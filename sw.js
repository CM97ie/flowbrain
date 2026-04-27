@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

:root {
  --accent: #a78bfa;
  --accent-dim: #a78bfa22;
  --accent-border: #a78bfa44;
}

* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

html, body { height: 100%; background: #0a0a0e; }

.app {
  font-family: 'DM Sans', sans-serif;
  background: #0f0f13;
  color: #e8e6f0;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ── Status bar ── */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px 6px;
  font-size: 12px;
  color: #666;
  font-family: 'DM Mono', monospace;
  padding-top: max(14px, env(safe-area-inset-top));
}

/* ── Header ── */
.header {
  padding: 6px 20px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.app-title { font-size: 22px; font-weight: 600; color: #e8e6f0; letter-spacing: -0.5px; }
.focus-pill {
  background: #1a1a24; border: 1px solid #2a2a3a;
  border-radius: 20px; padding: 6px 12px;
  font-size: 12px; display: flex; align-items: center; gap: 5px; cursor: pointer;
}
.focus-dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.4} }

/* ── Scroll area ── */
.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 14px 100px;
  scrollbar-width: none;
}
.scroll-area::-webkit-scrollbar { display: none; }

/* ── Section label ── */
.section-label {
  font-size: 11px; font-weight: 500; color: #555;
  text-transform: uppercase; letter-spacing: 1px;
  margin: 20px 0 10px 2px;
}

/* ── Screens ── */
.screen { display: none; }
.screen.active { display: block; }

/* ── Bottom nav ── */
.bottom-nav {
  display: flex; justify-content: space-around;
  padding: 10px 6px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid #1a1a26;
  background: #0f0f13;
}
.nav-item {
  display: flex; flex-direction: column; align-items: center;
  gap: 3px; cursor: pointer; padding: 5px 12px;
  border-radius: 12px; transition: background .15s;
}
.nav-item:hover { background: #1a1a26; }
.nav-item.active { background: #1a1528; }
.nav-icon { font-size: 18px; }
.nav-label { font-size: 10px; color: #555; font-weight: 500; }
.nav-item.active .nav-label { color: var(--accent); }

/* ── Home greeting ── */
.home-greeting { font-size: 14px; color: #666; margin-bottom: 2px; }
.home-name { font-size: 26px; font-weight: 600; color: #e8e6f0; letter-spacing: -0.5px; margin-bottom: 18px; }

/* ── Quick stat row ── */
.quick-stat-row { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; margin-bottom: 16px; }
.qs-card { background: #16161f; border: 1px solid #222230; border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; }
.qs-icon { font-size: 20px; flex-shrink: 0; }
.qs-val { font-size: 20px; font-weight: 600; font-family: 'DM Mono', monospace; }
.qs-lbl { font-size: 10px; color: #555; margin-top: 1px; }

/* ── Capture row ── */
.capture-row {
  background: #16161f; border: 1px solid #2a2a3a;
  border-radius: 18px; padding: 14px 16px;
  display: flex; align-items: center; gap: 10px; margin-bottom: 6px;
}
.capture-input { flex:1; background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e6f0; caret-color:var(--accent); }
.capture-input::placeholder { color: #444; }
.mic-btn { width:32px; height:32px; background:var(--accent-dim); border:1px solid var(--accent-border); border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; font-size:14px; }
.mic-btn.recording { background:#ef444422; border-color:#ef444466; animation:blink 1s infinite; }

/* ── Reminders ── */
.reminder-list { display: flex; flex-direction: column; gap: 8px; }
.reminder-item { background:#16161f; border:1px solid #222230; border-radius:14px; padding:12px 14px; display:flex; align-items:center; gap:10px; transition:background .15s; }
.reminder-item.snooze1 { border-color:#f59e0b55; background:#1c1609; }
.reminder-item.snooze2 { border-color:#ef444455; background:#1c0f0f; }
.reminder-item.fired { border-color:#22c55e33; opacity:0.5; }
.reminder-time { font-family:'DM Mono',monospace; font-size:12px; color:var(--accent); font-weight:500; min-width:42px; }
.reminder-text { flex:1; font-size:13px; color:#c4c0d8; }
.tag { font-size:10px; padding:2px 8px; border-radius:6px; font-weight:500; }
.tag-meds { background:#3d2e10; color:#fbbf24; }
.tag-work { background:#1a3d38; color:#4ade80; }
.tag-health { background:#3d1f1f; color:#f87171; }
.tag-idea { background:#3d2f6e; color:#c4b5fd; }
.tag-reminder { background:#222230; color:#888; }
.preview-btn { font-size:14px; cursor:pointer; color:#444; flex-shrink:0; }
.snooze-badge { font-size:10px; padding:2px 7px; border-radius:6px; font-weight:600; font-family:'DM Mono',monospace; }
.snooze-badge.s1 { background:#f59e0b22; color:#f59e0b; }
.snooze-badge.s2 { background:#ef444422; color:#ef4444; }

/* ── Timer ── */
.timer-card { background:#16161f; border:1px solid #222230; border-radius:18px; padding:20px; }
.ring-wrap { display:flex; justify-content:center; margin-bottom:10px; }
.progress-ring { transform:rotate(-90deg); }
.ring-bg { fill:none; stroke:#222230; stroke-width:4; }
.ring-fill { fill:none; stroke:var(--accent); stroke-width:4; stroke-linecap:round; transition:stroke-dashoffset 1s linear; }
.timer-display { font-family:'DM Mono',monospace; font-size:42px; font-weight:500; text-align:center; letter-spacing:2px; margin-bottom:6px; }
.timer-label { text-align:center; font-size:12px; color:#555; margin-bottom:18px; }
.timer-controls { display:flex; gap:10px; justify-content:center; }
.btn { border:1px solid #2a2a3a; border-radius:12px; padding:9px 20px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all .15s; background:#1c1c28; color:#c4c0d8; }
.btn:hover { background:#242434; }
.btn:active { transform:scale(.97); }
.btn.primary { background:var(--accent-dim); border-color:var(--accent-border); color:var(--accent); }
.btn.primary:hover { background:var(--accent-dim); filter:brightness(1.2); }

/* ── Tiles ── */
.tile-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
.tile { background:#16161f; border:1px solid #222230; border-radius:18px; padding:16px; cursor:pointer; transition:background .15s,transform .1s; position:relative; }
.tile:active { transform:scale(.97); }
.tile.wide { grid-column:1/-1; }
.tile.accent-purple { border-color:#3d2f6e; background:#1a1528; }
.tile.accent-teal { border-color:#1a3d38; background:#121f1e; }
.tile.accent-amber { border-color:#3d2e10; background:#1c1609; }
.tile.accent-red { border-color:#3d1f1f; background:#1c0f0f; }
.tile.accent-night { border-color:#1a1a3a; background:#111120; }
.tile-icon { font-size:20px; margin-bottom:8px; display:block; }
.tile-name { font-size:13px; font-weight:500; color:#c4c0d8; margin-bottom:3px; }
.tile-sub { font-size:11px; color:#555; }
.tile-badge { position:absolute; top:12px; right:12px; font-size:10px; font-weight:600; font-family:'DM Mono',monospace; border-radius:8px; padding:2px 7px; }
.tile-badge.night { background:#1a1a3a; color:#a5b4fc; }

/* ── Stats ── */
.metric-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-bottom:14px; }
.metric-card { background:#16161f; border:1px solid #222230; border-radius:16px; padding:14px 16px; }
.metric-val { font-size:28px; font-weight:600; font-family:'DM Mono',monospace; margin-bottom:4px; }
.metric-label { font-size:11px; color:#555; }
.bar-chart { background:#16161f; border:1px solid #222230; border-radius:16px; padding:16px; margin-bottom:14px; }
.bar-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.bar-row:last-child { margin-bottom:0; }
.bar-day { font-size:11px; color:#555; font-family:'DM Mono',monospace; min-width:26px; }
.bar-track { flex:1; height:8px; background:#1e1e2a; border-radius:4px; overflow:hidden; }
.bar-fill { height:100%; border-radius:4px; transition:width .6s ease; }
.bar-val { font-size:11px; font-family:'DM Mono',monospace; color:#888; min-width:22px; text-align:right; }

/* ── Habits ── */
.habit-card { background:#16161f; border:1px solid #222230; border-radius:16px; padding:0 14px; margin-bottom:12px; }
.habit-row { display:flex; align-items:center; gap:10px; padding:12px 0; border-bottom:1px solid #1a1a24; }
.habit-row:last-child { border-bottom:none; }
.habit-check { width:26px; height:26px; border-radius:8px; border:1.5px solid #333; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; font-size:14px; }
.habit-check.done { background:#22c55e22; border-color:#22c55e66; color:#22c55e; }
.habit-info { flex:1; }
.habit-name { font-size:13px; color:#c4c0d8; font-weight:500; }
.habit-name.done { text-decoration:line-through; color:#555; }
.habit-streak { font-size:11px; color:#555; margin-top:2px; }
.habit-streak span { color:#f59e0b; font-weight:500; }
.habit-dots { display:flex; gap:3px; }
.hdot { width:9px; height:9px; border-radius:2px; background:#222; }
.hdot.done { background:#22c55e55; }
.hdot.today { background:#22c55e; }
.habit-add-row { display:flex; gap:8px; margin-top:4px; }
.habit-add-input { flex:1; background:#16161f; border:1px solid #2a2a3a; border-radius:10px; padding:10px 12px; font-family:'DM Sans',sans-serif; font-size:13px; color:#e8e6f0; outline:none; }
.habit-add-input:focus { border-color:var(--accent-border); }
.habit-add-btn { background:#22c55e22; border:1px solid #22c55e44; border-radius:10px; padding:10px 14px; font-size:13px; color:#22c55e; cursor:pointer; font-family:'DM Sans',sans-serif; white-space:nowrap; }

/* ── Wind-down ── */
.wnd-hero { background:#111120; border:1px solid #1a1a3a; border-radius:16px; padding:14px 16px; margin-bottom:14px; display:flex; align-items:center; gap:12px; font-size:22px; }
.wnd-card { background:#16161f; border:1px solid #222230; border-radius:16px; padding:0 14px; margin-bottom:10px; }
.wnd-row { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid #1a1a24; }
.wnd-row:last-child { border-bottom:none; }
.wnd-time { font-family:'DM Mono',monospace; font-size:12px; color:var(--accent); min-width:44px; }
.wnd-text { flex:1; font-size:13px; color:#c4c0d8; }
.wnd-toggle { width:36px; height:20px; background:#222; border-radius:10px; cursor:pointer; position:relative; flex-shrink:0; border:1px solid #333; transition:background .2s; }
.wnd-toggle.on { background:var(--accent); }
.wnd-toggle::after { content:''; position:absolute; width:14px; height:14px; background:#fff; border-radius:50%; top:2px; left:2px; transition:left .2s; }
.wnd-toggle.on::after { left:18px; }
.wnd-add { display:flex; gap:8px; margin-top:4px; }
.wnd-input { flex:1; background:#16161f; border:1px solid #2a2a3a; border-radius:10px; padding:10px 12px; font-family:'DM Sans',sans-serif; font-size:13px; color:#e8e6f0; outline:none; }
.wnd-time-input { background:#16161f; border:1px solid #2a2a3a; border-radius:10px; padding:10px; font-family:'DM Mono',monospace; font-size:12px; color:#e8e6f0; outline:none; width:86px; }
.wnd-add-btn { background:var(--accent-dim); border:1px solid var(--accent-border); border-radius:10px; padding:10px 14px; font-size:13px; color:var(--accent); cursor:pointer; font-family:'DM Sans',sans-serif; white-space:nowrap; }

/* ── Settings ── */
.sett-card { background:#16161f; border:1px solid #222230; border-radius:16px; padding:0 16px; margin-bottom:4px; }
.sett-row { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid #1a1a24; }
.sett-row:last-child { border-bottom:none; }
.sett-label { font-size:13px; color:#c4c0d8; }
.sett-sub { font-size:11px; color:#555; margin-top:2px; }
.sett-input { background:#0f0f13; border:1px solid #2a2a3a; border-radius:10px; padding:7px 12px; font-family:'DM Sans',sans-serif; font-size:13px; color:#e8e6f0; outline:none; width:130px; }
.sett-input:focus { border-color:var(--accent-border); }
.color-swatches { display:flex; gap:10px; flex-wrap:wrap; }
.swatch { width:30px; height:30px; border-radius:9px; cursor:pointer; border:2px solid transparent; transition:border-color .15s, transform .1s; }
.swatch.selected { border-color:#fff; }
.swatch:active { transform:scale(.9); }
.snooze-row { display:flex; gap:8px; flex-wrap:wrap; }
.snooze-opt { padding:8px 14px; border-radius:10px; font-size:12px; font-weight:500; background:#1c1c28; border:1px solid #2a2a3a; cursor:pointer; color:#888; transition:all .15s; }
.snooze-opt.selected { background:var(--accent-dim); border-color:var(--accent-border); color:var(--accent); }
.save-btn { width:100%; background:var(--accent); color:#fff; border:none; border-radius:14px; padding:14px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; margin-top:16px; transition:opacity .15s; }
.save-btn:hover { opacity:.9; }
.add-btn { width:100%; background:var(--accent-dim); border:1px solid var(--accent-border); color:var(--accent); border-radius:14px; padding:13px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; margin-top:14px; }

/* ── Alert system ── */
.alert-wrap { position:absolute; top:70px; left:12px; right:12px; z-index:50; display:flex; flex-direction:column; gap:8px; pointer-events:none; }
.alert-card { border-radius:18px; padding:16px; pointer-events:all; animation:slideDown .25s ease; }
.alert-card.level0 { background:#1a1528; border:1px solid #a78bfa66; }
.alert-card.level1 { background:#1c1609; border:1px solid #f59e0b88; }
.alert-card.level2 { background:#1c0f0f; border:2px solid #ef444499; }
@keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
.alert-card.shake { animation:shake .4s ease; }
.alert-header { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.alert-emoji { font-size:22px; flex-shrink:0; }
.alert-title-text { font-size:14px; font-weight:600; flex:1; }
.alert-title-text.level0 { color:#c4b5fd; }
.alert-title-text.level1 { color:#fbbf24; }
.alert-title-text.level2 { color:#f87171; }
.alert-sub-text { font-size:11px; color:#555; margin-top:2px; }
.alert-dismiss { font-size:18px; color:#444; cursor:pointer; padding:4px; }
.alert-actions { display:flex; gap:8px; margin-top:4px; }
.alert-done-btn { flex:1; background:#22c55e22; border:1px solid #22c55e44; border-radius:12px; padding:10px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:#22c55e; cursor:pointer; }
.alert-snooze-btn { flex:1; border-radius:12px; padding:10px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; }
.alert-snooze-btn.level0 { background:#f59e0b22; border:1px solid #f59e0b44; color:#f59e0b; }
.alert-snooze-btn.level1 { background:#ef444422; border:1px solid #ef444444; color:#ef4444; }
.alert-snooze-btn.level2 { background:#3d1f1f; border:1px solid #ef444466; color:#f87171; opacity:0.5; cursor:not-allowed; }
.snooze-remaining { font-size:10px; font-family:'DM Mono',monospace; color:#555; text-align:center; margin-top:6px; }

/* ── Modal ── */
.modal-overlay { position:absolute; inset:0; background:#0f0f13ee; z-index:40; display:flex; align-items:flex-end; justify-content:center; border-radius:0; }
.modal-overlay.hidden { display:none; }
.modal { background:#16161f; border:1px solid #2a2a3a; border-radius:24px 24px 0 0; padding:20px; width:100%; padding-bottom:max(20px,env(safe-area-inset-bottom)); }
.modal-handle { width:36px; height:4px; background:#333; border-radius:2px; margin:0 auto 18px; }
.modal-title { font-size:15px; font-weight:600; margin-bottom:16px; color:#e8e6f0; }
.modal-input { width:100%; background:#0f0f13; border:1px solid #2a2a3a; border-radius:12px; padding:12px 14px; font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e6f0; margin-bottom:12px; outline:none; }
.modal-input:focus { border-color:var(--accent-border); }
.modal-row { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
.chip { padding:7px 14px; border-radius:10px; font-size:12px; font-weight:500; background:#1c1c28; border:1px solid #2a2a3a; cursor:pointer; color:#888; transition:all .15s; }
.chip.selected { background:var(--accent-dim); border-color:var(--accent-border); color:var(--accent); }

/* ── Wind-down badge ── */
.winddown-badge { display:inline-flex; align-items:center; gap:5px; background:#1a1a28; border:1px solid #2a2a3a; border-radius:12px; padding:4px 10px; font-size:11px; cursor:pointer; color:#a5b4fc; }

/* ── Utility ── */
.hidden { display:none !important; }
