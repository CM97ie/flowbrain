// Sync reminders/habits/captures/config between app and Supabase
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { userId, action, table, data } = req.method === 'POST' ? req.body : req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    if (action === 'push') {
      // Save data to Supabase
      if (table === 'config') {
        await supabase.from('configs').upsert({ user_id: userId, data, updated_at: new Date() }, { onConflict: 'user_id' });
      } else {
        // Delete old records and insert new ones
        await supabase.from(table).delete().eq('user_id', userId);
        if (data && data.length > 0) {
          const rows = data.map(d => ({ ...d, user_id: userId }));
          await supabase.from(table).insert(rows);
        }
      }
      return res.status(200).json({ ok: true });
    }

    if (action === 'pull') {
      // Get data from Supabase
      if (table === 'config') {
        const { data: cfg } = await supabase.from('configs').select('data').eq('user_id', userId).single();
        return res.status(200).json({ data: cfg?.data || null });
      } else {
        const { data: rows } = await supabase.from(table).select('*').eq('user_id', userId);
        return res.status(200).json({ data: rows || [] });
      }
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
