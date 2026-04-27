// ── flowbrain app.js ──────────────────────────────────────────

const MAX_SNOOZES = 2;
const SNOOZE_LEVELS = [
  { emoji:'🔔', label:'reminder',         snoozeLabel:'snooze 5 min',         volBoost:0,    rate:0.92, pitch:1.05, prefix:'Hey! Quick reminder:', suffix:"Don't forget!" },
  { emoji:'⚠️', label:'snooze 1 of 2',    snoozeLabel:'snooze again (last time!)', volBoost:0.2, rate:1.05, pitch:0.9,  prefix:'Oi! You snoozed this already.', suffix:'Seriously, sort it now!' },
  { emoji:'🚨', label:'final warning',    snoozeLabel:'no more snoozes!',      volBoost:0.35, rate:1.2,  pitch:0.75, prefix:'RIGHT. That is IT. No more snoozes.', suffix:'DO. IT. NOW.' },
];

const ACCENT_COLORS = [
  { name:'purple', accent:'#a78bfa', dim:'#a78bfa22', border:'#a78bfa44' },
  { name:'teal',   accent:'#2dd4bf', dim:'#2dd4bf22', border:'#2dd4bf44' },
  { name:'coral',  accent:'#fb7185', dim:'#fb718522', border:'#fb718544' },
  { name:'amber',  accent:'#fbbf24', dim:'#fbbf2422', border:'#fbbf2444' },
  { name:'blue',   accent:'#60a5fa', dim:'#60a5fa22', border:'#60a5fa44' },
  { name:'green',  accent:'#4ade80', dim:'#4ade8022', border:'#4ade8044' },
  { name:'pink',   accent:'#f0abfc', dim:'#f0abfc22', border:'#f0abfc44' },
];

// ── Default data ─────────────────────────────────────────────
const DEFAULT_CFG = {
  userName: 'you',
  colorIdx: 0,
  snoozeMins: 5,
  winddownTime: '20:30',
  winddownOn: true,
  volume: 0.8,
  pomodoros: [3,5,2,6,4,1,0],
};

const DEFAULT_REMINDERS = [
  { time:'10:00', text:'Take medication',        tag:'meds',    snoozeCount:0, fired:false, snoozedUntil:null },
  { time:'11:30', text:'Team standup call',      tag:'work',    snoozeCount:0, fired:false, snoozedUntil:null },
  { time:'14:00', text:'Review project proposal',tag:'work',    snoozeCount:0, fired:false, snoozedUntil:null },
  { time:'17:00', text:'Walk — get outside!',    tag:'health',  snoozeCount:0, fired:false, snoozedUntil:null },
];

const DEFAULT_HABITS = [
  { name:'Take medication',      streak:12, history:[1,1,1,1,1,1,0], done:false },
  { name:'Drink water (8 glasses)', streak:5, history:[1,1,0,1,1,1,0], done:false },
  { name:'10 min walk outside',  streak:3,  history:[0,1,1,1,1,0,0], done:false },
  { name:'No phone first 30 min',streak:7,  history:[1,1,1,1,1,1,1], done:false },
  { name:'Journal / brain dump', streak:2,  history:[0,0,1,0,1,1,0], done:false },
];

const DEFAULT_WINDDOWN = [
  { time:'20:30', text:"Review tomorrow's tasks",  on:true  },
  { time:'21:00', text:'Lay out clothes for tomorrow', on:true  },
  { time:'21:15', text:'Prep bag / essentials',    on:true  },
  { time:'21:30', text:'No screens wind-down',     on:false },
  { time:'22:00', text:'Lights out — sleep time!', on:true  },
];

// ── State ────────────────────────────────────────────────────
let cfg       = load('fb_cfg')       || JSON.parse(JSON.stringify(DEFAULT_CFG));
let reminders = load('fb_reminders') || JSON.parse(JSON.stringify(DEFAULT_REMINDERS));
let habits    = load('fb_habits')    || JSON.parse(JSON.stringify(DEFAULT_HABITS));
let winddown  = load('fb_winddown')  || JSON.parse(JSON.stringify(DEFAULT_WINDDOWN));

let timerRunning = false, totalSecs = 25*60, remainSecs = 25*60, timerInt = null;
let pomodorosToday = cfg.pomodoros ? (cfg.pomodoros[6] || 0) : 0;
let activeAlerts = {};
let micOn = false, recognition = null;

// ── Storage helpers ──────────────────────────────────────────
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }
function load(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch(e){ return null; } }
function saveAll() { save('fb_cfg', cfg); save('fb_reminders', reminders); save('fb_habits', habits); save('fb_winddown', winddown); }

// ── Theme ────────────────────────────────────────────────────
function applyTheme(idx) {
  const c = ACCENT_COLORS[Math.min(idx, ACCENT_COLORS.length - 1)];
  document.documentElement.style.setProperty('--accent', c.accent);
  document.documentElement.style.setProperty('--accent-dim', c.dim);
  document.documentElement.style.setProperty('--accent-border', c.border);
}

// ── Navigation ───────────────────────────────────────────────
function goScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const screen = document.getElementById('screen-' + name);
  const nav    = document.getElementById('nav-' + name);
  if (screen) screen.classList.add('active');
  if (nav) nav.classList.add('active');
  if (name === 'stats')    renderStats();
  if (name === 'habits')   renderHabits();
  if (name === 'winddown') renderWinddown();
  if (name === 'settings') loadSettings();
  if (name === 'reminders') renderAllReminders();
  if (name === 'home') {
    renderHomeReminders();
    updateHomeStats();
  }
}

// ── Clock & greeting ─────────────────────────────────────────
function updateClock() {
  const n = new Date();
  const hh = String(n.getHours()).padStart(2,'0');
  const mm = String(n.getMinutes()).padStart(2,'0');
  document.getElementById('clock').textContent = hh + ':' + mm;
  const h = n.getHours();
  document.getElementById('greeting-text').textContent = h < 12 ? 'good morning,' : h < 17 ? 'good afternoon,' : 'good evening,';
  const badge = document.getElementById('winddown-indicator');
  const timeStr = hh + ':' + mm;
  if (cfg.winddownOn && timeStr >= (cfg.winddownTime || '20:30')) {
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
  checkReminders(timeStr);
}

// ── Home ─────────────────────────────────────────────────────
function updateHomeStats() {
  document.getElementById('qs-pomodoro').textContent = pomodorosToday;
  const done = habits.filter(h => h.done).length;
  document.getElementById('qs-habits').textContent = done + '/' + habits.length;
  document.getElementById('user-name-display').textContent = cfg.userName || 'you';
}

function renderHomeReminders() {
  const list = document.getElementById('reminder-list');
  if (!list) return;
  list.innerHTML = '';
  const upcoming = reminders.filter(r => !r.fired).slice(0, 4);
  upcoming.forEach((r, i) => renderReminderItem(list, r, reminders.indexOf(r)));
  if (upcoming.length === 0) {
    list.innerHTML = '<div style="padding:14px;text-align:center;font-size:13px;color:#555">no reminders — add one below ✓</div>';
  }
}

function renderAllReminders() {
  const list = document.getElementById('all-reminder-list');
  if (!list) return;
  list.innerHTML = '';
  reminders.forEach((r, i) => renderReminderItem(list, r, i));
}

function renderReminderItem(container, r, idx) {
  const item = document.createElement('div');
  const sc = r.snoozeCount || 0;
  item.className = 'reminder-item' + (r.fired ? ' fired' : sc===1 ? ' snooze1' : sc>=2 ? ' snooze2' : '');
  const tagClass = 'tag-' + (r.tag || 'reminder');
  const displayTime = (r.snoozedUntil && !r.fired) ? r.snoozedUntil : (r.time || '—');
  const snoozeBadge = sc === 1 ? '<span class="snooze-badge s1">snooze 1</span>' : sc >= 2 ? '<span class="snooze-badge s2">snooze 2</span>' : '';
  item.innerHTML = `
    <span class="reminder-time">${displayTime}</span>
    <span class="reminder-text">${r.text}${r.fired ? ' ✓' : ''}</span>
    ${snoozeBadge}
    <span class="tag ${tagClass}">${r.tag || 'note'}</span>
    <span class="preview-btn" onclick="previewReminder(${idx})">🔊</span>
  `;
  container.appendChild(item);
}

// ── Reminder alerts ──────────────────────────────────────────
function checkReminders(timeStr) {
  reminders.forEach((r, i) => {
    if (r.fired) return;
    const trigger = r.snoozedUntil || r.time;
    if (trigger === timeStr && !activeAlerts[i]) showAlert(i);
  });
}

function showAlert(idx) {
  const r = reminders[idx];
  const level = Math.min(r.snoozeCount || 0, SNOOZE_LEVELS.length - 1);
  const lvl = SNOOZE_LEVELS[level];
  const wrap = document.getElementById('alert-wrap');
  if (document.getElementById('alert-' + idx)) {
    const el = document.getElementById('alert-' + idx);
    el.className = `alert-card level${level} shake`;
    setTimeout(() => el.classList.remove('shake'), 500);
    return;
  }
  activeAlerts[idx] = true;
  const card = document.createElement('div');
  card.id = 'alert-' + idx;
  card.className = `alert-card level${level}`;
  const canSnooze = (r.snoozeCount || 0) < MAX_SNOOZES;
  const tagClass = 'tag-' + (r.tag || 'reminder');
  const left = MAX_SNOOZES - (r.snoozeCount || 0);
  card.innerHTML = `
    <div class="alert-header">
      <span class="alert-emoji">${lvl.emoji}</span>
      <div style="flex:1">
        <div class="alert-title-text level${level}">${r.text}</div>
        <div class="alert-sub-text">${lvl.label} · <span class="tag ${tagClass}" style="font-size:10px;padding:1px 6px">${r.tag||'note'}</span></div>
      </div>
      <span class="alert-dismiss" onclick="dismissAlert(${idx})">✕</span>
    </div>
    <div class="alert-actions">
      <button class="alert-done-btn" onclick="doneAlert(${idx})">✓ done</button>
      <button class="alert-snooze-btn level${canSnooze ? level : 2}" onclick="${canSnooze ? 'snoozeAlert('+idx+')' : ''}">
        ${canSnooze ? lvl.snoozeLabel : '🚫 no more snoozes'}
      </button>
    </div>
    <div class="snooze-remaining">${canSnooze ? left + ' snooze' + (left===1?'':'s') + ' remaining' : 'final warning — no snoozes left!'}</div>
  `;
  wrap.appendChild(card);
  speakReminder(r, level);
}

function dismissAlert(idx) {
  const el = document.getElementById('alert-' + idx);
  if (el) el.remove();
  delete activeAlerts[idx];
}

function doneAlert(idx) {
  dismissAlert(idx);
  reminders[idx].fired = true;
  reminders[idx].snoozeCount = 0;
  save('fb_reminders', reminders);
  renderHomeReminders();
  speak('Great job! Reminder complete.', 0.7, 0.95, 1.0);
}

function snoozeAlert(idx) {
  const r = reminders[idx];
  if ((r.snoozeCount || 0) >= MAX_SNOOZES) return;
  r.snoozeCount = (r.snoozeCount || 0) + 1;
  const snoozeTime = new Date(Date.now() + (cfg.snoozeMins || 5) * 60 * 1000);
  r.snoozedUntil = String(snoozeTime.getHours()).padStart(2,'0') + ':' + String(snoozeTime.getMinutes()).padStart(2,'0');
  r.fired = false;
  save('fb_reminders', reminders);
  renderHomeReminders();
  dismissAlert(idx);
  const msg = r.snoozeCount < MAX_SNOOZES
    ? `Snoozed for ${cfg.snoozeMins || 5} minutes. I'll be back, and I won't be happy.`
    : `Last snooze. ${cfg.snoozeMins || 5} minutes. Then I'm coming for you.`;
  speak(msg, Math.min(0.7 + r.snoozeCount * 0.15, 1), 0.95 + r.snoozeCount * 0.08, 1.0 - r.snoozeCount * 0.1);
}

function speakReminder(r, level) {
  const lvl = SNOOZE_LEVELS[level];
  const vol = Math.min(1, (cfg.volume || 0.8) + lvl.volBoost);
  speak(`${lvl.prefix} ${r.text}. ${lvl.suffix}`, vol, lvl.rate, lvl.pitch);
}

function previewReminder(idx) {
  const r = reminders[idx];
  const level = Math.min(r.snoozeCount || 0, SNOOZE_LEVELS.length - 1);
  speakReminder(r, level);
}

// ── Speech ───────────────────────────────────────────────────
function speak(text, volume=0.8, rate=0.95, pitch=1.05) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.volume = volume;
  u.rate = rate;
  u.pitch = pitch;
  u.lang = 'en-GB';
  window.speechSynthesis.speak(u);
}

function testVoice() {
  speak(`Hey! Flowbrain is working perfectly. You're all set, ${cfg.userName || 'there'}!`, cfg.volume || 0.8, 0.95, 1.05);
}

// ── Mic ──────────────────────────────────────────────────────
function toggleMic() {
  micOn = !micOn;
  const btn = document.getElementById('mic-btn');
  const icon = document.getElementById('mic-icon');
  if (micOn) {
    btn.classList.add('recording');
    icon.textContent = '⏹';
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      recognition = new SR();
      recognition.lang = 'en-GB';
      recognition.onresult = e => {
        document.getElementById('capture-field').value = e.results[0][0].transcript;
        toggleMic();
      };
      recognition.onerror = () => toggleMic();
      recognition.start();
    } else {
      document.getElementById('capture-field').placeholder = 'voice not supported — type here';
      toggleMic();
    }
  } else {
    btn.classList.remove('recording');
    icon.textContent = '🎙';
    if (recognition) { try { recognition.stop(); } catch(e){} }
  }
}

function handleCapture(e) {
  if (e.key !== 'Enter') return;
  const val = document.getElementById('capture-field').value.trim();
  if (!val) return;
  reminders.push({ time: '', text: val, tag: 'idea', snoozeCount: 0, fired: false, snoozedUntil: null });
  save('fb_reminders', reminders);
  document.getElementById('capture-field').value = '';
  renderHomeReminders();
}

// ── Quick add modal ──────────────────────────────────────────
function openQuickAdd() {
  document.getElementById('modal-overlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('modal-text').focus(), 100);
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-text').value = '';
  document.getElementById('modal-time').value = '';
}

function selectChip(el) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function saveEntry() {
  const text = document.getElementById('modal-text').value.trim();
  const time = document.getElementById('modal-time').value;
  const sel  = document.querySelector('.chip.selected');
  const tag  = sel ? sel.textContent.trim() : 'reminder';
  if (!text) return;
  reminders.push({ time, text, tag, snoozeCount: 0, fired: false, snoozedUntil: null });
  save('fb_reminders', reminders);
  closeModal();
  renderHomeReminders();
  if (time) speak(`Got it. I'll remind you about ${text} at ${formatTimeSpoken(time)}.`);
  else speak(`Captured: ${text}`);
}

function formatTimeSpoken(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h), min = parseInt(m);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return min === 0 ? `${h12} ${suffix}` : `${h12} ${min} ${suffix}`;
}

// ── Timer ────────────────────────────────────────────────────
function updateTimerDisplay() {
  const m = Math.floor(remainSecs / 60), s = remainSecs % 60;
  document.getElementById('timer-display').textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  document.getElementById('ring').style.strokeDashoffset = 201 * (remainSecs / totalSecs);
}

function toggleTimer() {
  const btn = document.getElementById('timer-btn');
  if (timerRunning) {
    clearInterval(timerInt);
    timerRunning = false;
    btn.textContent = 'resume';
  } else {
    timerRunning = true;
    btn.textContent = 'pause';
    timerInt = setInterval(() => {
      if (remainSecs > 0) {
        remainSecs--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInt);
        timerRunning = false;
        btn.textContent = 'start';
        pomodorosToday++;
        if (!cfg.pomodoros) cfg.pomodoros = [0,0,0,0,0,0,0];
        cfg.pomodoros[6] = pomodorosToday;
        save('fb_cfg', cfg);
        document.getElementById('qs-pomodoro').textContent = pomodorosToday;
        document.getElementById('timer-label').textContent = '✓ session done — great work!';
        remainSecs = totalSecs;
        updateTimerDisplay();
        speak('Focus session complete! Well done. Time for a break.', cfg.volume || 0.8);
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInt);
  timerRunning = false;
  remainSecs = totalSecs;
  document.getElementById('timer-btn').textContent = 'start';
  document.getElementById('timer-label').textContent = 'pomodoro · deep work';
  updateTimerDisplay();
}

function skipTimer() { resetTimer(); }

// ── Habits ───────────────────────────────────────────────────
function renderHabits() {
  const list = document.getElementById('habit-list-main');
  if (!list) return;
  list.innerHTML = '';
  habits.forEach((h, i) => {
    const row = document.createElement('div');
    row.className = 'habit-row';
    row.onclick = () => toggleHabitDone(i);
    const dots = h.history.map((d, idx) =>
      `<div class="hdot ${d ? 'done' : ''} ${idx === 6 && h.done ? 'today' : ''}"></div>`
    ).join('');
    row.innerHTML = `
      <div class="habit-check ${h.done ? 'done' : ''}">${h.done ? '✓' : ''}</div>
      <div class="habit-info">
        <div class="habit-name ${h.done ? 'done' : ''}">${h.name}</div>
        <div class="habit-streak"><span>${h.streak}</span> day streak</div>
      </div>
      <div class="habit-dots">${dots}</div>
    `;
    list.appendChild(row);
  });
  updateHomeStats();
}

function toggleHabitDone(i) {
  habits[i].done = !habits[i].done;
  if (habits[i].done) { habits[i].streak++; habits[i].history[6] = 1; }
  else { habits[i].streak = Math.max(0, habits[i].streak - 1); habits[i].history[6] = 0; }
  save('fb_habits', habits);
  renderHabits();
}

function addHabit() {
  const inp = document.getElementById('habit-input');
  const name = inp.value.trim();
  if (!name) return;
  habits.push({ name, streak: 0, history: [0,0,0,0,0,0,0], done: false });
  inp.value = '';
  save('fb_habits', habits);
  renderHabits();
}

// ── Stats ────────────────────────────────────────────────────
function renderStats() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const poms = cfg.pomodoros || [0,0,0,0,0,0,0];
  const maxP = Math.max(...poms, 1);
  const barEl = document.getElementById('pomodoro-bar-chart');
  if (barEl) {
    barEl.innerHTML = '';
    days.forEach((d, i) => {
      const pct = Math.round((poms[i] / maxP) * 100);
      const row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML = `<span class="bar-day">${d}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:var(--accent)"></div></div><span class="bar-val">${poms[i]}</span>`;
      barEl.appendChild(row);
    });
  }
  const total = poms.reduce((a,b) => a+b, 0);
  const el = id => document.getElementById(id);
  if (el('stat-pomodoros')) el('stat-pomodoros').textContent = total;
  if (el('stat-focus-hrs')) el('stat-focus-hrs').textContent = (Math.round(total * 25 / 60 * 10) / 10) + 'h';
  const totalHabitsDone = habits.reduce((a, h) => a + h.history.filter(Boolean).length, 0);
  if (el('stat-habits-done')) el('stat-habits-done').textContent = totalHabitsDone;
  const bestStreak = Math.max(...habits.map(h => {
    let s = 0, max = 0;
    h.history.forEach(v => { s = v ? s+1 : 0; max = Math.max(max, s); });
    return max;
  }), 0);
  if (el('stat-best-streak')) el('stat-best-streak').textContent = bestStreak;
  const habitEl = document.getElementById('habit-stat-list');
  if (habitEl) {
    habitEl.innerHTML = '';
    habits.forEach(h => {
      const pct = Math.round((h.history.filter(Boolean).length / 7) * 100);
      const row = document.createElement('div'); row.className = 'bar-row';
      const short = h.name.length > 16 ? h.name.slice(0,14)+'…' : h.name;
      row.innerHTML = `<span class="bar-day" style="min-width:64px;font-family:'DM Sans',sans-serif;color:#888;font-size:11px">${short}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:#22c55e"></div></div><span class="bar-val">${pct}%</span>`;
      habitEl.appendChild(row);
    });
  }
}

// ── Wind-down ────────────────────────────────────────────────
function renderWinddown() {
  const list = document.getElementById('wnd-list');
  if (!list) return;
  list.innerHTML = '';
  const master = document.getElementById('wnd-master-toggle');
  if (master) master.className = 'wnd-toggle' + (cfg.winddownOn ? ' on' : '');
  winddown.forEach((item, i) => {
    const row = document.createElement('div'); row.className = 'wnd-row';
    row.innerHTML = `<span class="wnd-time">${item.time}</span><span class="wnd-text">${item.text}</span><div class="wnd-toggle ${item.on ? 'on' : ''}" onclick="toggleWndItem(${i})"></div>`;
    list.appendChild(row);
  });
  const activeCount = winddown.filter(x => x.on).length;
  const badge = document.getElementById('wnd-badge-count');
  if (badge) badge.textContent = activeCount + ' set';
}

function toggleWndItem(i) { winddown[i].on = !winddown[i].on; save('fb_winddown', winddown); renderWinddown(); }

function toggleWinddown() { cfg.winddownOn = !cfg.winddownOn; save('fb_cfg', cfg); renderWinddown(); }

function addWinddown() {
  const t   = document.getElementById('wnd-new-time').value;
  const txt = document.getElementById('wnd-new-text').value.trim();
  if (!txt) return;
  winddown.push({ time: t || '21:00', text: txt, on: true });
  winddown.sort((a, b) => a.time.localeCompare(b.time));
  document.getElementById('wnd-new-text').value = '';
  save('fb_winddown', winddown);
  renderWinddown();
}

// ── Settings ─────────────────────────────────────────────────
function loadSettings() {
  document.getElementById('sett-name').value = cfg.userName || '';
  document.getElementById('sett-winddown-time').value = cfg.winddownTime || '20:30';
  document.getElementById('vol-slider').value = cfg.volume || 0.8;
  document.querySelectorAll('.snooze-opt').forEach(el => el.classList.remove('selected'));
  const found = [...document.querySelectorAll('.snooze-opt')].find(el => parseInt(el.textContent) === cfg.snoozeMins);
  if (found) found.classList.add('selected');
  buildSwatches();
}

function buildSwatches() {
  const wrap = document.getElementById('color-swatches');
  if (!wrap) return;
  wrap.innerHTML = '';
  ACCENT_COLORS.forEach((c, i) => {
    const s = document.createElement('div');
    s.className = 'swatch' + (cfg.colorIdx === i ? ' selected' : '');
    s.style.background = c.accent;
    s.onclick = () => { cfg.colorIdx = i; applyTheme(i); buildSwatches(); };
    wrap.appendChild(s);
  });
}

function selectSnooze(el, val) {
  document.querySelectorAll('.snooze-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  cfg.snoozeMins = val;
}

function previewName() {
  const n = document.getElementById('sett-name').value.trim();
  document.getElementById('user-name-display').textContent = n || 'you';
}

function saveSettings() {
  cfg.userName = document.getElementById('sett-name').value.trim() || 'you';
  cfg.winddownTime = document.getElementById('sett-winddown-time').value || '20:30';
  cfg.volume = parseFloat(document.getElementById('vol-slider').value);
  save('fb_cfg', cfg);
  document.getElementById('user-name-display').textContent = cfg.userName;
  const toast = document.createElement('div');
  toast.style.cssText = 'position:absolute;bottom:90px;left:50%;transform:translateX(-50%);background:#22c55e22;border:1px solid #22c55e44;border-radius:12px;padding:8px 18px;font-size:13px;color:#4ade80;white-space:nowrap;z-index:60';
  toast.textContent = '✓ changes saved!';
  document.getElementById('app').appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
  speak(`Settings saved. Looking good, ${cfg.userName}!`, cfg.volume, 0.95, 1.05);
}

// ── Init ─────────────────────────────────────────────────────
applyTheme(cfg.colorIdx || 0);
updateClock();
setInterval(updateClock, 15000);
updateTimerDisplay();
renderHomeReminders();
updateHomeStats();
renderWinddown();


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
