// Vercel serverless function - checks reminders and sends push notifications
const { createClient } = require('@supabase/supabase-js');
const webpush = require('web-push');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

webpush.setVapidDetails(
  'mailto:flowbrain@app.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = async (req, res) => {
  // Allow cron jobs and direct calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const todayDay = dayNames[now.getDay()];

    // Get all unfired reminders due now
    const { data: reminders } = await supabase
      .from('reminders')
      .select('*')
      .eq('fired', false)
      .or(`time.eq.${currentTime},snoozed_until.eq.${currentTime}`);

    if (!reminders || reminders.length === 0) {
      return res.status(200).json({ sent: 0, message: 'No reminders due' });
    }

    let sent = 0;

    for (const reminder of reminders) {
      // Check if today is a scheduled day
      const days = reminder.days || [];
      const isEvery = days.length === 0 || days.length === 7;
      if (!isEvery && !days.includes(todayDay)) continue;

      // Get push subscriptions for this user
      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', reminder.user_id);

      if (!subs || subs.length === 0) continue;

      // Build notification based on snooze level
      const level = reminder.snooze_count || 0;
      const messages = [
        { title: `🔔 ${reminder.text}`, body: "Hey! Don't forget!" },
        { title: `⚠️ ${reminder.text}`, body: "Oi! You snoozed this already. Sort it now!" },
        { title: `🚨 ${reminder.text}`, body: "RIGHT. THAT IS IT. DO IT NOW!" },
      ];
      const msg = messages[Math.min(level, messages.length - 1)];

      const payload = JSON.stringify({
        title: msg.title,
        body: msg.body,
        tag: reminder.id,
        data: { reminderId: reminder.id, userId: reminder.user_id }
      });

      // Send to all user's devices
      for (const sub of subs) {
        try {
          await webpush.sendNotification(sub.subscription, payload);
          sent++;
        } catch (err) {
          // Remove invalid subscriptions
          if (err.statusCode === 410 || err.statusCode === 404) {
            await supabase.from('push_subscriptions').delete().eq('id', sub.id);
          }
        }
      }

      // Mark as fired (for one-time reminders)
      await supabase
        .from('reminders')
        .update({ fired: true, snoozed_until: null })
        .eq('id', reminder.id);
    }

    return res.status(200).json({ sent, time: currentTime });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
