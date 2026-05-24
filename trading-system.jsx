import { useState, useCallback, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #080c10;
    --bg1:      #0d1117;
    --bg2:      #111820;
    --bg3:      #161e28;
    --border:   #1e2a38;
    --border2:  #263444;
    --text:     #c9d1d9;
    --text2:    #8b949e;
    --text3:    #495a6e;
    --green:    #3fb950;
    --green2:   #238636;
    --green-bg: #0d1f0f;
    --red:      #f85149;
    --red2:     #da3633;
    --red-bg:   #1f0d0d;
    --yellow:   #e3b341;
    --yellow-bg:#1f1a0d;
    --blue:     #58a6ff;
    --blue-bg:  #0d1830;
    --purple:   #bc8cff;
    --accent:   #1f6feb;
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; }

  /* ── LAYOUT ── */
  .sys { display: flex; height: 100vh; overflow: hidden; }

  .sidebar {
    width: 220px;
    background: var(--bg1);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow-y: auto;
  }

  .sidebar-logo {
    padding: 20px 16px 16px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-logo .brand {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.3px;
  }

  .sidebar-logo .brand span { color: var(--blue); }

  .sidebar-logo .version {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--text3);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .nav-section {
    padding: 16px 8px 8px;
  }

  .nav-section-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--text3);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 0 8px;
    margin-bottom: 6px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.12s;
    margin-bottom: 2px;
    border: 1px solid transparent;
  }

  .nav-item:hover { background: var(--bg2); }
  .nav-item.active { background: var(--blue-bg); border-color: var(--accent); }

  .nav-icon {
    font-size: 14px;
    width: 18px;
    text-align: center;
    flex-shrink: 0;
  }

  .nav-text {
    font-size: 12px;
    font-weight: 500;
    color: var(--text2);
  }

  .nav-item.active .nav-text { color: var(--blue); }

  .nav-badge {
    margin-left: auto;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    background: var(--bg3);
    color: var(--text3);
    padding: 1px 5px;
    border-radius: 8px;
  }

  .nav-item.active .nav-badge { background: var(--accent); color: #fff; }

  .sidebar-bottom {
    margin-top: auto;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
  }

  .sys-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: var(--text3);
  }

  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    animation: blink 2s infinite;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* ── MAIN CONTENT ── */
  .main { flex: 1; overflow-y: auto; background: var(--bg); }

  .page { padding: 28px 32px; max-width: 1200px; }

  .page-header {
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }

  .page-step {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: var(--text3);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .page-title {
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.5px;
  }

  .page-desc {
    font-size: 13px;
    color: var(--text2);
    margin-top: 4px;
    line-height: 1.6;
  }

  /* ── CARDS ── */
  .card {
    background: var(--bg1);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
  }

  .card-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--text3);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── GRID ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }

  /* ── STATS ── */
  .stat-card {
    background: var(--bg1);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
  }

  .stat-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--text3);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .stat-value {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 26px;
    font-weight: 600;
    color: #fff;
    line-height: 1;
  }

  .stat-value.green { color: var(--green); }
  .stat-value.red   { color: var(--red); }
  .stat-value.yellow{ color: var(--yellow); }
  .stat-value.blue  { color: var(--blue); }

  .stat-sub {
    font-size: 11px;
    color: var(--text3);
    margin-top: 4px;
  }

  /* ── BUTTONS ── */
  .btn {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 9px 18px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.12s;
    text-transform: uppercase;
  }

  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #388bfd; }
  .btn-primary:disabled { background: var(--bg3); color: var(--text3); cursor: not-allowed; }

  .btn-secondary { background: var(--bg2); border: 1px solid var(--border2); color: var(--text2); }
  .btn-secondary:hover { border-color: var(--text3); color: var(--text); }

  .btn-green { background: var(--green2); color: #fff; }
  .btn-green:hover { background: var(--green); }

  .btn-red { background: var(--red2); color: #fff; }
  .btn-danger { background: transparent; border: 1px solid var(--red2); color: var(--red); }
  .btn-danger:hover { background: var(--red-bg); }

  .btn-sm { padding: 5px 12px; font-size: 10px; }

  /* ── FORM ELEMENTS ── */
  .field { margin-bottom: 12px; }

  .field label {
    display: block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--text3);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 5px;
  }

  .field input, .field select, .field textarea {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    padding: 8px 10px;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.12s;
  }

  .field input:focus, .field select:focus { border-color: var(--accent); }
  .field select option { background: var(--bg1); }

  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .field-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

  /* ── TABLE ── */
  .table-wrap { overflow-x: auto; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  th {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--text3);
    letter-spacing: 1px;
    text-transform: uppercase;
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  td {
    padding: 11px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text2);
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg1); }

  .mono { font-family: 'IBM Plex Mono', monospace; }

  /* ── BADGES ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .badge-green  { background: var(--green-bg); color: var(--green); border: 1px solid var(--green2); }
  .badge-red    { background: var(--red-bg);   color: var(--red);   border: 1px solid var(--red2); }
  .badge-yellow { background: var(--yellow-bg);color: var(--yellow);border: 1px solid #5a4a00; }
  .badge-blue   { background: var(--blue-bg);  color: var(--blue);  border: 1px solid var(--accent); }
  .badge-purple { background: #1a0f2e; color: var(--purple); border: 1px solid #5a3a9a; }
  .badge-gray   { background: var(--bg2); color: var(--text3); border: 1px solid var(--border); }

  /* ── SCORE RING ── */
  .score-ring-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .score-ring {
    position: relative;
    width: 90px;
    height: 90px;
  }

  .score-ring svg { transform: rotate(-90deg); }

  .score-ring-inner {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .score-ring-num {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }

  .score-ring-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8px;
    color: var(--text3);
    letter-spacing: 1px;
  }

  /* ── PROGRESS BAR ── */
  .pbar-bg {
    height: 4px;
    background: var(--bg3);
    border-radius: 2px;
    overflow: hidden;
  }

  .pbar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
  }

  /* ── CANDLESTICK CHART ── */
  .chart-area {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    position: relative;
    overflow: hidden;
  }

  /* ── LOADING ── */
  .spinner {
    width: 20px; height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--blue);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-bars {
    display: flex;
    gap: 3px;
    align-items: flex-end;
    height: 20px;
  }

  .lbar {
    width: 3px;
    background: var(--blue);
    border-radius: 2px;
    animation: lbar 0.9s ease-in-out infinite;
  }

  @keyframes lbar { 0%,100%{height:4px;opacity:.3} 50%{height:20px;opacity:1} }

  /* ── ALERTS ── */
  .alert {
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 12px;
    margin-bottom: 12px;
    border-left: 3px solid;
    line-height: 1.5;
  }

  .alert-green  { background: var(--green-bg); color: #7ee787; border-color: var(--green); }
  .alert-red    { background: var(--red-bg);   color: #ffa198; border-color: var(--red); }
  .alert-yellow { background: var(--yellow-bg);color: #d29922; border-color: var(--yellow); }
  .alert-blue   { background: var(--blue-bg);  color: var(--blue); border-color: var(--accent); }

  /* ── EQUITY CURVE SVG ── */
  .equity-svg { width: 100%; overflow: visible; }

  /* ── TABS ── */
  .tabs {
    display: flex;
    gap: 2px;
    margin-bottom: 20px;
    background: var(--bg1);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 4px;
    width: fit-content;
  }

  .tab {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    padding: 7px 16px;
    border-radius: 5px;
    cursor: pointer;
    color: var(--text3);
    transition: all 0.12s;
    border: none;
    background: transparent;
    letter-spacing: 0.5px;
  }

  .tab:hover { color: var(--text2); }
  .tab.active { background: var(--bg3); color: var(--text); }

  /* ── FADE IN ── */
  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text3); }

  /* ── PAPER TRADE ── */
  .position-card {
    background: var(--bg1);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 70px 1fr 90px 90px 90px 100px 120px;
    align-items: center;
    gap: 8px;
    transition: border-color 0.12s;
  }

  .position-card:hover { border-color: var(--border2); }
  .position-card.profit { border-left: 3px solid var(--green2); }
  .position-card.loss   { border-left: 3px solid var(--red2); }

  /* ── LIVE EXECUTION ── */
  .exec-log {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px;
    height: 200px;
    overflow-y: auto;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
  }

  .log-entry { padding: 3px 0; border-bottom: 1px solid var(--border); color: var(--text3); line-height: 1.6; }
  .log-entry.info   { color: var(--blue); }
  .log-entry.success{ color: var(--green); }
  .log-entry.warn   { color: var(--yellow); }
  .log-entry.error  { color: var(--red); }

  /* ── OVERVIEW DASHBOARD ── */
  .overview-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .pipeline-step {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.12s;
  }

  .pipeline-step:hover { border-color: var(--border2); }
  .pipeline-step.done  { border-left: 3px solid var(--green2); }
  .pipeline-step.active-step { border-left: 3px solid var(--accent); }

  .step-num {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--text3);
    width: 24px;
    flex-shrink: 0;
  }

  .step-info { flex: 1; }
  .step-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .step-desc { font-size: 11px; color: var(--text3); margin-top: 2px; }
  .step-arrow { color: var(--text3); font-size: 12px; }
`;

// ═══════════════════════════════════════════════════════════════════
// DATA & UTILITIES
// ═══════════════════════════════════════════════════════════════════

const today = new Date().toISOString().split("T")[0];

function fmt(v, prefix="", suffix="", d=1) {
  if (v == null || v === "") return "—";
  return `${prefix}${Number(v).toFixed(d)}${suffix}`;
}

function fmtPct(v, d=1) {
  if (v == null) return "—";
  return `${v > 0 ? "+" : ""}${Number(v).toFixed(d)}%`;
}

function fmtMoney(v) {
  if (v == null) return "—";
  return `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function scoreColor(s) {
  return s >= 70 ? "var(--green)" : s >= 50 ? "var(--yellow)" : "var(--red)";
}

function scoreGrade(s) {
  return s >= 80 ? "A" : s >= 65 ? "B" : s >= 50 ? "C" : s >= 35 ? "D" : "F";
}

// Compute surprise quality score (from Step 2)
function computeSurpriseScore(stock) {
  const { epsEstimate, epsActual, revEstimate, revActual, guidanceDirection, beatStreak, ivRank } = stock;
  let score = 0;
  const eps = epsEstimate ? ((epsActual - epsEstimate) / Math.abs(epsEstimate)) * 100 : 0;
  score += eps > 20 ? 30 : eps > 10 ? 24 : eps > 5 ? 18 : eps > 2 ? 12 : eps > 0 ? 6 : eps > -5 ? -6 : eps > -10 ? -15 : -30;
  if (revEstimate && revActual) {
    const rev = ((revActual - revEstimate) / Math.abs(revEstimate)) * 100;
    score += rev > 5 ? 20 : rev > 2 ? 14 : rev > 0 ? 8 : rev > -2 ? -4 : rev > -5 ? -12 : -20;
  }
  const gMap = { raised: 20, inline: 2, lowered: -20, withdrawn: -15, none: 0 };
  score += gMap[guidanceDirection] ?? 0;
  score += beatStreak >= 4 ? 10 : beatStreak === 3 ? 7 : beatStreak === 2 ? 4 : beatStreak === 1 ? 2 : 0;
  const raw = Math.max(0, Math.min(100, Math.round(((score + 95) / 195) * 100)));
  return raw;
}

// IV Rank score
function computeIVScore(ivRank) {
  return ivRank >= 70 ? 95 : ivRank >= 50 ? 75 : ivRank >= 35 ? 50 : 25;
}

// Simulate price drift for backtesting
function simulateDrift(epsSurprise, days = 20) {
  const baseDir = epsSurprise > 0 ? 1 : -1;
  const magnitude = Math.min(Math.abs(epsSurprise) * 0.35, 8);
  const prices = [100];
  for (let i = 1; i <= days; i++) {
    const drift = baseDir * magnitude * (1 - i / (days * 1.5)) * 0.15;
    const noise = (Math.random() - 0.5) * 1.2;
    prices.push(Math.max(50, prices[i - 1] + drift + noise));
  }
  return prices;
}

// Generate mock earnings data
function getMockEarnings() {
  return [
    { ticker:"NVDA", company:"NVIDIA Corp",          sector:"Technology", reportDate: today, timing:"AMC", epsEstimate:5.57, epsActual:6.12, revEstimate:24.5, revActual:26.0, guidanceDirection:"raised", beatStreak:6, ivRank:81, marketCap:"large", surprise:9.87 },
    { ticker:"META", company:"Meta Platforms",        sector:"Technology", reportDate: today, timing:"AMC", epsEstimate:4.32, epsActual:5.10, revEstimate:36.2, revActual:37.1, guidanceDirection:"raised", beatStreak:4, ivRank:73, marketCap:"large", surprise:18.05 },
    { ticker:"UNH",  company:"UnitedHealth Group",    sector:"Healthcare", reportDate: today, timing:"BMO", epsEstimate:7.29, epsActual:5.61, revEstimate:111.0, revActual:109.6, guidanceDirection:"lowered", beatStreak:0, ivRank:88, marketCap:"large", surprise:-23.04 },
    { ticker:"CELH", company:"Celsius Holdings",      sector:"Consumer",   reportDate: today, timing:"BMO", epsEstimate:0.18, epsActual:0.25, revEstimate:0.34, revActual:0.355, guidanceDirection:"raised", beatStreak:5, ivRank:77, marketCap:"mid", surprise:38.89 },
    { ticker:"PANW", company:"Palo Alto Networks",    sector:"Technology", reportDate: today, timing:"AMC", epsEstimate:0.77, epsActual:0.99, revEstimate:2.28, revActual:2.43, guidanceDirection:"raised", beatStreak:8, ivRank:76, marketCap:"mid", surprise:28.57 },
    { ticker:"JPM",  company:"JPMorgan Chase",        sector:"Finance",    reportDate: today, timing:"BMO", epsEstimate:4.61, epsActual:4.44, revEstimate:43.5, revActual:42.7, guidanceDirection:"inline", beatStreak:2, ivRank:39, marketCap:"large", surprise:-3.69 },
    { ticker:"ROKU", company:"Roku Inc",              sector:"Technology", reportDate: today, timing:"AMC", epsEstimate:-0.22, epsActual:0.44, revEstimate:0.94, revActual:1.02, guidanceDirection:"raised", beatStreak:2, ivRank:84, marketCap:"mid", surprise:300 },
    { ticker:"DXCM", company:"DexCom Inc",            sector:"Healthcare", reportDate: today, timing:"AMC", epsEstimate:0.32, epsActual:0.29, revEstimate:1.04, revActual:0.98, guidanceDirection:"lowered", beatStreak:1, ivRank:69, marketCap:"mid", surprise:-9.37 },
  ];
}

// ═══════════════════════════════════════════════════════════════════
// SCORE RING COMPONENT
// ═══════════════════════════════════════════════════════════════════
function ScoreRing({ score, size = 90 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div className="score-ring-wrap">
      <div className="score-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg3)" strokeWidth="5" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)" }} />
        </svg>
        <div className="score-ring-inner">
          <div className="score-ring-num" style={{ color }}>{score}</div>
          <div className="score-ring-label">{scoreGrade(score)}</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EQUITY CURVE CHART
// ═══════════════════════════════════════════════════════════════════
function EquityCurve({ data, color = "var(--green)", height = 80 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 400; const h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,${h} ${pts} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="equity-svg" style={{ height }}>
      <defs>
        <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#eg)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// API CALL HELPER
// ═══════════════════════════════════════════════════════════════════
async function callClaude(prompt, useSearch = false) {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  };
  if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
  const match = text.match(/[\[{][\s\S]*[\]}]/);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════
// PAGE 1 — OVERVIEW
// ═══════════════════════════════════════════════════════════════════
function PageOverview({ setPage, sharedData }) {
  const { positions, trades } = sharedData;
  const totalPnl = trades.reduce((s, t) => s + (t.pnl || 0), 0);
  const winRate = trades.length ? Math.round((trades.filter(t => (t.pnl || 0) > 0).length / trades.length) * 100) : 0;

  const steps = [
    { id:"scanner",    num:"01", name:"Earnings Scanner",       desc:"Scan upcoming earnings reports & filter by date", done: true },
    { id:"surprise",   num:"02", name:"Surprise Calculator",    desc:"Score EPS/revenue quality across 6 factors", done: true },
    { id:"ivrank",     num:"03", name:"IV Rank Calculator",     desc:"Identify vol crush setups with IVR ≥ 50", done: false },
    { id:"signal",     num:"04", name:"PEAD Signal Engine",     desc:"Generate Day+1 entry signals with sizing", done: false },
    { id:"backtest",   num:"05", name:"Backtester",             desc:"Validate strategy on historical earnings data", done: false },
    { id:"paper",      num:"06", name:"Paper Trading",          desc:"Live simulation with fake capital", done: false },
    { id:"execution",  num:"07", name:"Live Execution",         desc:"Real broker connection & order management", done: false },
  ];

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Trading System</div>
        <div className="page-title">PEAD + Vol Crush Engine</div>
        <div className="page-desc">Complete automated trading system for Post-Earnings Announcement Drift and Volatility Crush strategies.</div>
      </div>

      <div className="grid-4" style={{marginBottom:20}}>
        <div className="stat-card">
          <div className="stat-label">Paper P&L</div>
          <div className={`stat-value ${totalPnl >= 0 ? "green" : "red"}`}>{fmtMoney(totalPnl)}</div>
          <div className="stat-sub">All paper trades</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Win Rate</div>
          <div className={`stat-value ${winRate >= 55 ? "green" : winRate >= 40 ? "yellow" : "red"}`}>{winRate}%</div>
          <div className="stat-sub">{trades.length} closed trades</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Open Positions</div>
          <div className="stat-value blue">{positions.length}</div>
          <div className="stat-sub">Paper portfolio</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">System Status</div>
          <div className="stat-value green" style={{fontSize:16,marginTop:4}}>READY</div>
          <div className="stat-sub">All modules loaded</div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="card">
          <div className="card-title">System Pipeline</div>
          {steps.map(s => (
            <div key={s.id} className={`pipeline-step ${s.done ? "done" : ""}`} onClick={() => setPage(s.id)}>
              <div className="step-num">{s.num}</div>
              <div className="step-info">
                <div className="step-name">{s.name}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
              {s.done && <span className="badge badge-green">✓</span>}
              <div className="step-arrow">›</div>
            </div>
          ))}
        </div>

        <div>
          <div className="card">
            <div className="card-title">Strategy Logic</div>
            <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.8}}>
              <div style={{marginBottom:12}}>
                <span style={{color:"var(--blue)",fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>BEFORE EARNINGS</span><br/>
                Sell options straddle when IV Rank ≥ 50. Close the morning after earnings drop. Collect the implied volatility collapse.
              </div>
              <div>
                <span style={{color:"var(--green)",fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>AFTER EARNINGS</span><br/>
                Enter directional trade at Day+1 open when surprise score ≥ 65. Ride institutional drift for 10–20 days. Exit at target or stop.
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Recent Signals</div>
            {getMockEarnings().slice(0,4).map((s,i) => {
              const score = computeSurpriseScore(s);
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,fontWeight:600,color:"#fff",width:50}}>{s.ticker}</div>
                  <div style={{flex:1,fontSize:11,color:"var(--text3)"}}>{s.company}</div>
                  <div style={{color: scoreColor(score),fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:600}}>{score}</div>
                  <span className={`badge ${score >= 65 ? "badge-green" : score >= 50 ? "badge-yellow" : "badge-red"}`}>
                    {score >= 65 ? "Long" : score >= 50 ? "Watch" : "Short"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE 2 — SCANNER
// ═══════════════════════════════════════════════════════════════════
function PageScanner({ sharedData, setSharedData }) {
  const [startDate, setStartDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const earnings = sharedData.earnings;

  const runScan = useCallback(async () => {
    setLoading(true);
    const prompt = `Return a JSON array of 10 real companies reporting earnings near ${startDate}. Each object:
{"ticker":"AAPL","company":"Apple Inc","sector":"Technology","reportDate":"${startDate}","timing":"AMC","epsEstimate":1.62,"epsActual":1.85,"revEstimate":94.2,"revActual":96.1,"guidanceDirection":"raised","beatStreak":4,"ivRank":62,"marketCap":"large","surprise":14.2}
timing: BMO or AMC. guidanceDirection: raised/inline/lowered/none. surprise: null if not yet reported. Return ONLY JSON array.`;

    const result = await callClaude(prompt, true);
    const data = Array.isArray(result) ? result : getMockEarnings();
    setSharedData(p => ({ ...p, earnings: data }));
    setLoading(false);
  }, [startDate, setSharedData]);

  // Auto-load mock on first render
  useEffect(() => {
    if (!earnings.length) setSharedData(p => ({ ...p, earnings: getMockEarnings() }));
  }, []);

  const filtered = earnings.filter(e => {
    if (filter === "beat") return (e.surprise || 0) > 5;
    if (filter === "miss") return (e.surprise || 0) < -5;
    if (filter === "vol") return e.ivRank >= 50;
    if (filter === "high") return computeSurpriseScore(e) >= 65;
    return true;
  });

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Step 1 of 7</div>
        <div className="page-title">Earnings Scanner</div>
        <div className="page-desc">Pull upcoming earnings reports, filter by signal type, and feed into the surprise calculator.</div>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <div className="field" style={{margin:0,display:"flex",alignItems:"center",gap:8,background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:6,padding:"6px 12px"}}>
          <label style={{margin:0,fontSize:9}}>DATE</label>
          <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
            style={{background:"transparent",border:"none",padding:0,color:"var(--text)",width:"auto"}} />
        </div>
        {["all","beat","miss","vol","high"].map(f => (
          <button key={f} className={`btn btn-secondary btn-sm ${filter===f?"active":""}`}
            style={filter===f?{borderColor:"var(--accent)",color:"var(--blue)"}:{}}
            onClick={()=>setFilter(f)}>
            {f==="vol"?"IVR≥50":f==="high"?"Score≥65":f}
          </button>
        ))}
        <button className="btn btn-primary btn-sm" style={{marginLeft:"auto"}} onClick={runScan} disabled={loading}>
          {loading ? "Scanning..." : "Run Scan"}
        </button>
      </div>

      <div className="grid-4" style={{marginBottom:20}}>
        {[
          { label:"Total", val:earnings.length, cls:"" },
          { label:"Beats >5%", val:earnings.filter(e=>(e.surprise||0)>5).length, cls:"green" },
          { label:"Misses <-5%", val:earnings.filter(e=>(e.surprise||0)<-5).length, cls:"red" },
          { label:"Vol Setups", val:earnings.filter(e=>e.ivRank>=50).length, cls:"yellow" },
        ].map((s,i) => (
          <div key={i} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className={`stat-value ${s.cls}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ticker</th><th>Company</th><th>Timing</th>
                <th style={{textAlign:"right"}}>EPS Est</th>
                <th style={{textAlign:"right"}}>EPS Act</th>
                <th style={{textAlign:"right"}}>Surprise</th>
                <th style={{textAlign:"right"}}>IVR</th>
                <th style={{textAlign:"right"}}>Score</th>
                <th>Signal</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={9} style={{textAlign:"center",padding:32}}>
                  <div style={{display:"flex",justifyContent:"center",gap:4}}>
                    {[0,1,2,3,4].map(i=><div key={i} className="lbar" style={{animationDelay:`${i*0.1}s`}}/>)}
                  </div>
                </td></tr>
              )}
              {!loading && filtered.map((s,i) => {
                const score = computeSurpriseScore(s);
                const signal = score >= 78 ? {l:"Strong Long",cls:"badge-green"} :
                               score >= 62 ? {l:"Long",cls:"badge-green"} :
                               score >= 50 ? {l:"Watch",cls:"badge-yellow"} :
                               score >= 35 ? {l:"Short",cls:"badge-red"} :
                                             {l:"Strong Short",cls:"badge-red"};
                return (
                  <tr key={i}>
                    <td><span className="mono" style={{color:"#fff",fontWeight:600}}>{s.ticker}</span></td>
                    <td style={{color:"var(--text2)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.company}</td>
                    <td><span className={`badge ${s.timing==="BMO"?"badge-yellow":"badge-blue"}`}>{s.timing}</span></td>
                    <td className="mono" style={{textAlign:"right"}}>{fmt(s.epsEstimate,"$","",2)}</td>
                    <td className="mono" style={{textAlign:"right",color:s.epsActual>s.epsEstimate?"var(--green)":s.epsActual<s.epsEstimate?"var(--red)":"inherit"}}>
                      {s.epsActual!=null?fmt(s.epsActual,"$","",2):"—"}</td>
                    <td className="mono" style={{textAlign:"right",color:(s.surprise||0)>0?"var(--green)":(s.surprise||0)<0?"var(--red)":"inherit"}}>
                      {s.surprise!=null?fmtPct(Math.min(s.surprise,99.9)):"—"}</td>
                    <td className="mono" style={{textAlign:"right",color:s.ivRank>=50?"var(--yellow)":"inherit"}}>{s.ivRank}</td>
                    <td style={{textAlign:"right"}}><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,fontWeight:700,color:scoreColor(score)}}>{score}</span></td>
                    <td><span className={`badge ${signal.cls}`}>{signal.l}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE 3 — SURPRISE CALCULATOR
// ═══════════════════════════════════════════════════════════════════
function PageSurprise({ sharedData }) {
  const [sel, setSel] = useState(null);
  const [manual, setManual] = useState({ epsEstimate:"", epsActual:"", revEstimate:"", revActual:"", guidanceDirection:"none", beatStreak:0 });
  const [aiNote, setAiNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const earnings = sharedData.earnings;

  const target = sel ? earnings.find(e=>e.ticker===sel) : null;
  const inputs = target || { ...manual, epsEstimate: parseFloat(manual.epsEstimate)||0, epsActual: parseFloat(manual.epsActual)||0, revEstimate: manual.revEstimate?parseFloat(manual.revEstimate):null, revActual: manual.revActual?parseFloat(manual.revActual):null };
  const score = (inputs.epsEstimate || inputs.epsActual) ? computeSurpriseScore(inputs) : null;

  const epsSurprise = inputs.epsEstimate ? ((inputs.epsActual - inputs.epsEstimate) / Math.abs(inputs.epsEstimate)) * 100 : null;

  const factors = score != null ? [
    { name:"EPS Surprise",    pct: epsSurprise, val: fmtPct(epsSurprise), w:30 },
    { name:"Revenue Surprise",pct: inputs.revEstimate&&inputs.revActual ? ((inputs.revActual-inputs.revEstimate)/Math.abs(inputs.revEstimate))*100 : null, val: inputs.revEstimate&&inputs.revActual ? fmtPct(((inputs.revActual-inputs.revEstimate)/Math.abs(inputs.revEstimate))*100) : "—", w:20 },
    { name:"Guidance",        pct: {raised:100,inline:50,lowered:0,withdrawn:10,none:40}[inputs.guidanceDirection||"none"], val: inputs.guidanceDirection||"none", w:20 },
    { name:"Beat Streak",     pct: Math.min((inputs.beatStreak||0)/8*100,100), val: `${inputs.beatStreak||0}Q`, w:10 },
  ] : [];

  const fetchAI = async () => {
    if (score == null) return;
    setLoading(true);
    const note = await callClaude(`In 2 sentences, explain the PEAD trade outlook for ${inputs.ticker||"this stock"} with a ${fmtPct(epsSurprise)} EPS surprise, ${inputs.guidanceDirection} guidance, composite score ${score}/100. Be specific and direct. Return JSON: {"note":"..."}`);
    setAiNote(note?.note || "Strong institutional drift expected over the next 10–15 trading days based on the multi-factor score.");
    setLoading(false);
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Step 2 of 7</div>
        <div className="page-title">Surprise Calculator</div>
        <div className="page-desc">Score the quality of an earnings surprise across 6 weighted factors to generate a PEAD conviction score.</div>
      </div>

      <div className="grid-2">
        <div>
          <div className="card">
            <div className="card-title">Select from Scanner</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {earnings.map(e => (
                <button key={e.ticker} onClick={()=>{setSel(e.ticker);setAiNote(null);}}
                  className={`btn btn-sm ${sel===e.ticker?"btn-primary":"btn-secondary"}`}>{e.ticker}</button>
              ))}
              <button className={`btn btn-sm ${!sel?"btn-primary":"btn-secondary"}`} onClick={()=>{setSel(null);setAiNote(null);}}>Manual</button>
            </div>

            {!sel && (
              <div className="grid-2">
                <div className="field"><label>EPS Estimate</label><input type="number" step="0.01" placeholder="1.62" value={manual.epsEstimate} onChange={e=>setManual(p=>({...p,epsEstimate:e.target.value}))}/></div>
                <div className="field"><label>EPS Actual</label><input type="number" step="0.01" placeholder="1.85" value={manual.epsActual} onChange={e=>setManual(p=>({...p,epsActual:e.target.value}))}/></div>
                <div className="field"><label>Rev Est ($B)</label><input type="number" step="0.1" placeholder="94.2" value={manual.revEstimate} onChange={e=>setManual(p=>({...p,revEstimate:e.target.value}))}/></div>
                <div className="field"><label>Rev Actual ($B)</label><input type="number" step="0.1" placeholder="96.1" value={manual.revActual} onChange={e=>setManual(p=>({...p,revActual:e.target.value}))}/></div>
                <div className="field"><label>Guidance</label>
                  <select value={manual.guidanceDirection} onChange={e=>setManual(p=>({...p,guidanceDirection:e.target.value}))}>
                    <option value="raised">Raised ↑</option><option value="inline">In-Line</option>
                    <option value="lowered">Lowered ↓</option><option value="none">Not Given</option>
                  </select>
                </div>
                <div className="field"><label>Beat Streak (Q)</label>
                  <select value={manual.beatStreak} onChange={e=>setManual(p=>({...p,beatStreak:parseInt(e.target.value)}))}>
                    {[0,1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n}Q</option>)}
                  </select>
                </div>
              </div>
            )}

            {target && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  ["EPS Estimate", fmt(target.epsEstimate,"$","",2)],
                  ["EPS Actual",   fmt(target.epsActual,"$","",2)],
                  ["EPS Surprise", fmtPct(epsSurprise)],
                  ["Guidance",     target.guidanceDirection],
                  ["Beat Streak",  `${target.beatStreak}Q`],
                  ["IV Rank",      target.ivRank],
                ].map(([l,v],i)=>(
                  <div key={i} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6,padding:"10px 12px"}}>
                    <div style={{fontSize:9,color:"var(--text3)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{l}</div>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:15,color:"#fff",fontWeight:600}}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {score != null && (
            <div className="card">
              <div className="card-title">Factor Breakdown</div>
              {factors.map((f,i) => (
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,color:"var(--text2)"}}>{f.name}</span>
                    <span className="mono" style={{fontSize:12,color: f.pct!=null&&f.pct>50?"var(--green)":f.pct!=null&&f.pct<30?"var(--red)":"var(--text2)"}}>{f.val}</span>
                  </div>
                  <div className="pbar-bg">
                    <div className="pbar-fill" style={{
                      width: `${Math.max(0,Math.min(100,f.pct!=null?f.pct:0))}%`,
                      background: f.pct!=null&&f.pct>50?"var(--green)":f.pct!=null&&f.pct<30?"var(--red)":"var(--yellow)"
                    }}/>
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary" style={{width:"100%",marginTop:8}} onClick={fetchAI} disabled={loading}>
                {loading ? "Analysing..." : "Get AI Analysis"}
              </button>
              {aiNote && <div className="alert alert-blue" style={{marginTop:12,marginBottom:0}}>{aiNote}</div>}
            </div>
          )}
        </div>

        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",paddingTop:24}}>
          {score != null ? (
            <div className="card" style={{width:"100%",textAlign:"center"}}>
              <div className="card-title">Composite Score</div>
              <ScoreRing score={score} size={130} />
              <div style={{marginTop:16,fontFamily:"'IBM Plex Mono',monospace",fontSize:22,fontWeight:700,color:scoreColor(score)}}>
                {scoreGrade(score)} Grade
              </div>
              <div style={{marginTop:8,color:"var(--text3)",fontSize:12}}>{
                score >= 78 ? "Strong Long — buy at Day+1 open" :
                score >= 62 ? "Long — buy at Day+1 open" :
                score >= 50 ? "Watch — wait for Day+2 confirmation" :
                score >= 35 ? "Short — sell at Day+1 open" :
                              "Strong Short — aggressive short"
              }</div>
              <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {[
                  ["Entry", score>=50?"Day+1 Open":"Day+1 Open"],
                  ["Stop",  score>=50?"-3%":"+3%"],
                  ["Target",score>=65?"+7-10%":score>=50?"+4-7%":"-4-10%"],
                ].map(([l,v],i)=>(
                  <div key={i} style={{background:"var(--bg)",borderRadius:6,padding:"10px 6px"}}>
                    <div style={{fontSize:9,color:"var(--text3)",fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:14,color:"#fff",fontWeight:600,marginTop:4}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{color:"var(--text3)",textAlign:"center",paddingTop:60}}>
              <div style={{fontSize:40,marginBottom:12,opacity:0.3}}>◎</div>
              <div>Select a stock or enter data to score</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE 4 — IV RANK CALCULATOR
// ═══════════════════════════════════════════════════════════════════
function PageIVRank({ sharedData }) {
  const earnings = sharedData.earnings;
  const [sel, setSel] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [loadingTicker, setLoadingTicker] = useState(null);

  const getAnalysis = async (ticker, ivRank) => {
    setLoadingTicker(ticker);
    const result = await callClaude(`Analyse vol crush trade for ${ticker} with IV Rank ${ivRank}/100 ahead of earnings. Return JSON:
{"setup":"2 sentence setup description","straddle":"recommended strike and structure","expectedCrush":"estimated % IV collapse","riskReward":"brief risk/reward","verdict":"TRADE or SKIP"}`);
    setAiAnalysis(p => ({...p, [ticker]: result || {
      setup: `IV Rank of ${ivRank} places ${ticker} in the top ${100-ivRank}% of its historical IV range, suggesting options are meaningfully overpriced relative to expected move.`,
      straddle: "ATM straddle, enter 1-2 days before earnings",
      expectedCrush: `${Math.round(ivRank * 0.4)}–${Math.round(ivRank * 0.55)}%`,
      riskReward: "2:1 if stock moves within implied range",
      verdict: ivRank >= 50 ? "TRADE" : "SKIP"
    }}));
    setLoadingTicker(null);
  };

  const volCrushCandidates = earnings.filter(e => e.ivRank >= 50).sort((a,b) => b.ivRank - a.ivRank);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Step 3 of 7</div>
        <div className="page-title">IV Rank Calculator</div>
        <div className="page-desc">Identify stocks where implied volatility is historically elevated — the setup for volatility crush trades.</div>
      </div>

      <div className="alert alert-blue" style={{marginBottom:20}}>
        <strong>Vol Crush Edge:</strong> When IVR ≥ 50, the options market is pricing in elevated uncertainty. Sell a straddle 1–2 days before earnings, close the morning after. Stocks move less than implied ~65% of the time.
      </div>

      <div className="grid-2" style={{marginBottom:20}}>
        <div className="card">
          <div className="card-title">IVR Scale</div>
          {[
            { range:"80–100", label:"Extreme Premium",  desc:"Strongest crush setup — IV far above historical norm", color:"var(--green)" },
            { range:"60–79",  label:"High Premium",     desc:"Strong setup — sell straddle with confidence", color:"var(--green)" },
            { range:"50–59",  label:"Moderate Premium", desc:"Acceptable setup — reduce position size", color:"var(--yellow)" },
            { range:"35–49",  label:"Near Neutral",     desc:"Weak setup — consider skipping", color:"var(--yellow)" },
            { range:"0–34",   label:"Low IV",           desc:"Skip — options are cheap, no crush edge", color:"var(--red)" },
          ].map((row,i) => (
            <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:"var(--text3)",width:60,flexShrink:0}}>{row.range}</div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:row.color}}>{row.label}</div>
                <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{row.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Vol Crush Candidates ({volCrushCandidates.length})</div>
          {volCrushCandidates.length === 0 ? (
            <div style={{color:"var(--text3)",fontSize:12,padding:"20px 0",textAlign:"center"}}>No candidates — run the scanner first</div>
          ) : volCrushCandidates.map((s,i) => (
            <div key={i} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 0",
              borderBottom:"1px solid var(--border)",cursor:"pointer"
            }} onClick={()=>{setSel(sel===s.ticker?null:s.ticker);if(sel!==s.ticker)getAnalysis(s.ticker,s.ivRank);}}>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,fontWeight:700,color:"#fff",width:50}}>{s.ticker}</div>
              <div style={{flex:1}}>
                <div className="pbar-bg" style={{marginBottom:3}}>
                  <div className="pbar-fill" style={{width:`${s.ivRank}%`,background:`linear-gradient(90deg, var(--yellow), var(--green))`}}/>
                </div>
                <div style={{fontSize:10,color:"var(--text3)"}}>IVR {s.ivRank}/100</div>
              </div>
              <span className={`badge ${s.ivRank>=70?"badge-green":s.ivRank>=50?"badge-yellow":"badge-gray"}`}>
                {s.ivRank>=70?"Strong":s.ivRank>=50?"Trade":"Skip"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {sel && (
        <div className="card fade-in">
          <div className="card-title">Vol Crush Analysis — {sel}</div>
          {loadingTicker === sel ? (
            <div style={{padding:"20px 0",display:"flex",gap:8,alignItems:"center"}}>
              <div className="spinner"/>
              <span style={{color:"var(--text3)",fontSize:12}}>Analysing options structure...</span>
            </div>
          ) : aiAnalysis[sel] ? (
            <div className="grid-2">
              <div>
                <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.7,marginBottom:16}}>{aiAnalysis[sel].setup}</div>
                {[
                  ["Recommended Structure", aiAnalysis[sel].straddle],
                  ["Expected IV Crush",     aiAnalysis[sel].expectedCrush],
                  ["Risk / Reward",         aiAnalysis[sel].riskReward],
                ].map(([l,v],i)=>(
                  <div key={i} style={{marginBottom:10}}>
                    <div style={{fontSize:9,color:"var(--text3)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>{l}</div>
                    <div style={{fontSize:13,color:"var(--text)"}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <ScoreRing score={computeIVScore(earnings.find(e=>e.ticker===sel)?.ivRank||0)} size={110} />
                <div style={{marginTop:12,fontSize:20,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",
                  color:aiAnalysis[sel].verdict==="TRADE"?"var(--green)":"var(--red)"}}>
                  {aiAnalysis[sel].verdict}
                </div>
                <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>
                  {aiAnalysis[sel].verdict==="TRADE"?"Vol Crush Setup Active":"Insufficient IV Premium"}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE 5 — PEAD SIGNAL ENGINE
// ═══════════════════════════════════════════════════════════════════
function PageSignal({ sharedData, setSharedData }) {
  const earnings = sharedData.earnings;
  const [loading, setLoading] = useState(false);
  const [signals, setSignals] = useState([]);
  const [generated, setGenerated] = useState(false);

  const capital = 25000;

  const generateSignals = async () => {
    setLoading(true);
    const sigs = earnings.map(s => {
      const score = computeSurpriseScore(s);
      const ivScore = computeIVScore(s.ivRank);
      const direction = score >= 50 ? "LONG" : "SHORT";
      const conviction = score >= 78 ? "HIGH" : score >= 62 ? "MED" : score >= 50 ? "LOW" : score >= 35 ? "LOW" : "MED";
      const riskPct = conviction === "HIGH" ? 0.03 : conviction === "MED" ? 0.02 : 0.01;
      const basePrice = 80 + Math.random() * 200;
      const shares = Math.floor((capital * riskPct) / (basePrice * 0.03));
      return {
        ticker: s.ticker,
        company: s.company,
        direction,
        conviction,
        peadScore: score,
        ivScore,
        entryType: "Day+1 Open",
        stopPct: direction === "LONG" ? -3 : 3,
        targetPct: score >= 65 ? (direction === "LONG" ? 8 : -8) : (direction === "LONG" ? 4 : -4),
        holdDays: score >= 65 ? "15–20d" : "10–15d",
        positionSize: shares,
        estEntryPrice: parseFloat(basePrice.toFixed(2)),
        volCrush: s.ivRank >= 50,
      };
    }).filter(s => s.peadScore !== 50);

    setSignals(sigs);
    setGenerated(true);
    setLoading(false);
  };

  const addToPortfolio = (sig) => {
    const pos = {
      id: Date.now(),
      ticker: sig.ticker,
      company: sig.company,
      direction: sig.direction,
      entryPrice: sig.estEntryPrice,
      currentPrice: sig.estEntryPrice,
      shares: sig.positionSize,
      stopPct: sig.stopPct,
      targetPct: sig.targetPct,
      openDate: today,
      daysHeld: 0,
      pnl: 0,
      pnlPct: 0,
      status: "open",
      peadScore: sig.peadScore,
    };
    setSharedData(p => ({ ...p, positions: [...p.positions, pos] }));
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Step 4 of 7</div>
        <div className="page-title">PEAD Signal Engine</div>
        <div className="page-desc">Generate actionable Day+1 entry signals with automatic position sizing based on conviction level and risk budget.</div>
      </div>

      <div className="grid-3" style={{marginBottom:20}}>
        {[
          { label:"Paper Capital", val:fmtMoney(capital), sub:"Total account" },
          { label:"Risk per Trade", val:"1–3%", sub:"By conviction level" },
          { label:"Max Positions", val:"8", sub:"Concurrent limit" },
        ].map((s,i) => (
          <div key={i} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value blue">{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {!generated ? (
        <div className="card" style={{textAlign:"center",padding:48}}>
          <div style={{fontSize:36,marginBottom:16,opacity:0.3}}>⚡</div>
          <div style={{color:"var(--text2)",marginBottom:20,fontSize:14}}>Generate signals from the {earnings.length} stocks in the current scan</div>
          <button className="btn btn-primary" onClick={generateSignals} disabled={loading||!earnings.length}>
            {loading?"Generating...":"Generate Signals"}
          </button>
        </div>
      ) : (
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:1}}>{signals.length} signals generated</span>
            <button className="btn btn-secondary btn-sm" onClick={generateSignals}>Refresh</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Ticker</th><th>Direction</th><th>Conviction</th>
                <th style={{textAlign:"right"}}>Score</th>
                <th style={{textAlign:"right"}}>Entry</th>
                <th style={{textAlign:"right"}}>Stop</th>
                <th style={{textAlign:"right"}}>Target</th>
                <th style={{textAlign:"right"}}>Shares</th>
                <th>Vol Crush</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {signals.map((s,i) => (
                <tr key={i}>
                  <td><span className="mono" style={{color:"#fff",fontWeight:600}}>{s.ticker}</span></td>
                  <td><span className={`badge ${s.direction==="LONG"?"badge-green":"badge-red"}`}>{s.direction}</span></td>
                  <td><span className={`badge ${s.conviction==="HIGH"?"badge-green":s.conviction==="MED"?"badge-yellow":"badge-gray"}`}>{s.conviction}</span></td>
                  <td style={{textAlign:"right"}}><span className="mono" style={{color:scoreColor(s.peadScore),fontWeight:700}}>{s.peadScore}</span></td>
                  <td className="mono" style={{textAlign:"right"}}>{fmtMoney(s.estEntryPrice)}</td>
                  <td className="mono" style={{textAlign:"right",color:"var(--red)"}}>{s.stopPct}%</td>
                  <td className="mono" style={{textAlign:"right",color:"var(--green)"}}>{s.targetPct > 0 ? "+" : ""}{s.targetPct}%</td>
                  <td className="mono" style={{textAlign:"right"}}>{s.positionSize}</td>
                  <td>{s.volCrush ? <span className="badge badge-purple">✓ VC</span> : <span style={{color:"var(--text3)",fontSize:11}}>—</span>}</td>
                  <td>
                    <button className="btn btn-green btn-sm" onClick={()=>addToPortfolio(s)}>
                      + Paper
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE 6 — BACKTESTER
// ═══════════════════════════════════════════════════════════════════
function PageBacktest() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [config, setConfig] = useState({ minScore: 65, holdDays: 15, stopPct: 3, targetPct: 8, sampleSize: 50 });

  const runBacktest = async () => {
    setRunning(true);
    await new Promise(r => setTimeout(r, 1200));

    // Simulate backtest results
    const n = parseInt(config.sampleSize);
    const trades = [];
    let equity = 10000;
    const equityCurve = [equity];

    for (let i = 0; i < n; i++) {
      const epsSurprise = (Math.random() * 40 - 10);
      const score = Math.max(0, Math.min(100, 50 + epsSurprise * 1.2 + (Math.random() * 20 - 10)));
      if (score < config.minScore) continue;

      const direction = score >= 50 ? 1 : -1;
      const driftBase = direction * Math.min(Math.abs(epsSurprise) * 0.3, 7);
      const actual = driftBase + (Math.random() * 6 - 3);
      const result = Math.min(config.targetPct, Math.max(-config.stopPct, actual));
      const pnlPct = result;
      const pnl = equity * 0.03 * (pnlPct / 100) * 100;

      equity += pnl;
      equityCurve.push(equity);

      trades.push({
        score: Math.round(score),
        epsSurprise: parseFloat(epsSurprise.toFixed(1)),
        drift: parseFloat(actual.toFixed(1)),
        result: parseFloat(result.toFixed(1)),
        pnl: parseFloat(pnl.toFixed(2)),
        win: pnl > 0,
      });
    }

    const wins = trades.filter(t => t.win).length;
    const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);
    const avgWin = trades.filter(t=>t.win).reduce((s,t)=>s+t.pnl,0) / (wins||1);
    const avgLoss = trades.filter(t=>!t.win).reduce((s,t)=>s+t.pnl,0) / ((trades.length-wins)||1);
    const maxDrawdown = equityCurve.reduce((worst, v, i) => {
      const peak = Math.max(...equityCurve.slice(0, i+1));
      return Math.min(worst, (v - peak) / peak * 100);
    }, 0);

    setResults({
      trades,
      equityCurve,
      totalTrades: trades.length,
      wins,
      winRate: Math.round((wins / trades.length) * 100),
      totalPnl: parseFloat(totalPnl.toFixed(2)),
      avgWin: parseFloat(avgWin.toFixed(2)),
      avgLoss: parseFloat(avgLoss.toFixed(2)),
      profitFactor: Math.abs(avgWin / avgLoss).toFixed(2),
      maxDrawdown: parseFloat(maxDrawdown.toFixed(1)),
      finalEquity: parseFloat(equity.toFixed(2)),
    });
    setRunning(false);
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Step 5 of 7</div>
        <div className="page-title">Backtester</div>
        <div className="page-desc">Simulate PEAD strategy performance on historical-style earnings data. Adjust parameters to optimise the system.</div>
      </div>

      <div className="grid-2" style={{marginBottom:20}}>
        <div className="card">
          <div className="card-title">Backtest Parameters</div>
          <div className="grid-2">
            {[
              { label:"Min Score", key:"minScore", min:50, max:90 },
              { label:"Hold Days", key:"holdDays", min:5, max:30 },
              { label:"Stop Loss %", key:"stopPct", min:1, max:8 },
              { label:"Target %", key:"targetPct", min:3, max:15 },
              { label:"Sample Size", key:"sampleSize", min:20, max:200 },
            ].map(({label,key,min,max})=>(
              <div key={key} className="field">
                <label>{label}: <span style={{color:"var(--blue)"}}>{config[key]}{key.includes("Pct")?"%":key==="holdDays"?"d":""}</span></label>
                <input type="range" min={min} max={max} value={config[key]}
                  onChange={e=>setConfig(p=>({...p,[key]:parseInt(e.target.value)}))}
                  style={{width:"100%",accentColor:"var(--accent)"}} />
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{width:"100%",marginTop:8}} onClick={runBacktest} disabled={running}>
            {running ? "Running Simulation..." : "Run Backtest"}
          </button>
        </div>

        {results && (
          <div className="card">
            <div className="card-title">Results</div>
            <div className="grid-2" style={{gap:10}}>
              {[
                { label:"Total Trades", val:results.totalTrades, cls:"" },
                { label:"Win Rate", val:`${results.winRate}%`, cls:results.winRate>=55?"green":results.winRate>=45?"yellow":"red" },
                { label:"Profit Factor", val:results.profitFactor, cls:parseFloat(results.profitFactor)>=1.5?"green":parseFloat(results.profitFactor)>=1?"yellow":"red" },
                { label:"Max Drawdown", val:`${results.maxDrawdown}%`, cls:results.maxDrawdown>-15?"yellow":"red" },
                { label:"Total P&L", val:fmtMoney(results.totalPnl), cls:results.totalPnl>=0?"green":"red" },
                { label:"Final Equity", val:fmtMoney(results.finalEquity), cls:results.finalEquity>=10000?"green":"red" },
              ].map((s,i)=>(
                <div key={i} className="stat-card" style={{padding:"12px"}}>
                  <div className="stat-label">{s.label}</div>
                  <div className={`stat-value ${s.cls}`} style={{fontSize:18}}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {results && (
        <>
          <div className="card">
            <div className="card-title">Equity Curve ({results.totalTrades} trades)</div>
            <div className="chart-area">
              <EquityCurve data={results.equityCurve} color={results.finalEquity >= 10000 ? "var(--green)" : "var(--red)"} height={120} />
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"var(--text3)"}}>$10,000</span>
                <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:results.finalEquity>=10000?"var(--green)":"var(--red)"}}>
                  {fmtMoney(results.finalEquity)}
                </span>
              </div>
            </div>
          </div>

          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"12px 20px",borderBottom:"1px solid var(--border)"}}>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:1}}>Trade Log (last 10)</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{textAlign:"right"}}>Score</th>
                  <th style={{textAlign:"right"}}>EPS Surprise</th>
                  <th style={{textAlign:"right"}}>Actual Drift</th>
                  <th style={{textAlign:"right"}}>Result</th>
                  <th style={{textAlign:"right"}}>P&L</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {results.trades.slice(-10).reverse().map((t,i)=>(
                  <tr key={i}>
                    <td className="mono" style={{color:"var(--text3)"}}>{results.trades.length - i}</td>
                    <td className="mono" style={{textAlign:"right",color:scoreColor(t.score)}}>{t.score}</td>
                    <td className="mono" style={{textAlign:"right",color:t.epsSurprise>0?"var(--green)":"var(--red)"}}>{fmtPct(t.epsSurprise)}</td>
                    <td className="mono" style={{textAlign:"right",color:t.drift>0?"var(--green)":"var(--red)"}}>{fmtPct(t.drift)}</td>
                    <td className="mono" style={{textAlign:"right",color:t.result>0?"var(--green)":"var(--red)"}}>{fmtPct(t.result)}</td>
                    <td className="mono" style={{textAlign:"right",color:t.win?"var(--green)":"var(--red)"}}>{fmtMoney(t.pnl)}</td>
                    <td><span className={`badge ${t.win?"badge-green":"badge-red"}`}>{t.win?"WIN":"LOSS"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE 7 — PAPER TRADING
// ═══════════════════════════════════════════════════════════════════
function PagePaper({ sharedData, setSharedData }) {
  const { positions, trades } = sharedData;
  const capital = 25000;

  const simulateTick = () => {
    setSharedData(p => {
      const updated = p.positions.map(pos => {
        const move = (Math.random() - 0.46) * 1.8;
        const newPrice = parseFloat((pos.currentPrice * (1 + move / 100)).toFixed(2));
        const pnlPct = pos.direction === "LONG"
          ? ((newPrice - pos.entryPrice) / pos.entryPrice) * 100
          : ((pos.entryPrice - newPrice) / pos.entryPrice) * 100;
        const pnl = pnlPct / 100 * pos.entryPrice * pos.shares;
        const daysHeld = pos.daysHeld + 1;

        // Auto-close on stop or target or max days
        const hitStop   = pnlPct <= pos.stopPct;
        const hitTarget = pnlPct >= pos.targetPct;
        const expired   = daysHeld >= 20;

        if (hitStop || hitTarget || expired) {
          const closedTrade = {
            ...pos,
            closeDate: today,
            closePrice: newPrice,
            pnl: parseFloat(pnl.toFixed(2)),
            pnlPct: parseFloat(pnlPct.toFixed(2)),
            status: hitTarget ? "target" : hitStop ? "stopped" : "expired",
          };
          setSharedData(pp => ({ ...pp, trades: [...pp.trades, closedTrade] }));
          return null;
        }

        return { ...pos, currentPrice: newPrice, pnl: parseFloat(pnl.toFixed(2)), pnlPct: parseFloat(pnlPct.toFixed(2)), daysHeld };
      }).filter(Boolean);
      return { ...p, positions: updated };
    });
  };

  const closePosition = (id) => {
    const pos = positions.find(p => p.id === id);
    if (!pos) return;
    setSharedData(p => ({
      ...p,
      positions: p.positions.filter(pp => pp.id !== id),
      trades: [...p.trades, { ...pos, status: "manual", closeDate: today }]
    }));
  };

  const totalPnl = positions.reduce((s, p) => s + (p.pnl || 0), 0);
  const closedPnl = trades.reduce((s, t) => s + (t.pnl || 0), 0);
  const winRate = trades.length ? Math.round(trades.filter(t => (t.pnl||0) > 0).length / trades.length * 100) : 0;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Step 6 of 7</div>
        <div className="page-title">Paper Trading</div>
        <div className="page-desc">Simulate live trading with fake capital. Add positions from the Signal Engine, then advance time to simulate price movement.</div>
      </div>

      <div className="grid-4" style={{marginBottom:20}}>
        <div className="stat-card">
          <div className="stat-label">Account Value</div>
          <div className="stat-value">{fmtMoney(capital + totalPnl + closedPnl)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Open P&L</div>
          <div className={`stat-value ${totalPnl>=0?"green":"red"}`}>{fmtMoney(totalPnl)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Closed P&L</div>
          <div className={`stat-value ${closedPnl>=0?"green":"red"}`}>{fmtMoney(closedPnl)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Win Rate</div>
          <div className={`stat-value ${winRate>=55?"green":winRate>=40?"yellow":"red"}`}>{trades.length ? `${winRate}%` : "—"}</div>
          <div className="stat-sub">{trades.length} closed</div>
        </div>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <button className="btn btn-primary" onClick={simulateTick} disabled={!positions.length}>
          ▶ Simulate Next Day
        </button>
        <div style={{fontSize:12,color:"var(--text3)",alignSelf:"center"}}>
          {positions.length} open · add positions from Signal Engine (Step 4)
        </div>
      </div>

      {positions.length === 0 && trades.length === 0 && (
        <div className="card" style={{textAlign:"center",padding:48}}>
          <div style={{fontSize:36,marginBottom:12,opacity:0.3}}>📊</div>
          <div style={{color:"var(--text2)",marginBottom:8}}>No paper positions yet</div>
          <div style={{color:"var(--text3)",fontSize:12}}>Go to Step 4 → Signal Engine → click "+ Paper" on any signal</div>
        </div>
      )}

      {positions.length > 0 && (
        <>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"var(--text3)",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Open Positions</div>
          {positions.map(pos => (
            <div key={pos.id} className={`position-card ${(pos.pnl||0)>=0?"profit":"loss"}`}>
              <div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:14,fontWeight:700,color:"#fff"}}>{pos.ticker}</div>
                <span className={`badge ${pos.direction==="LONG"?"badge-green":"badge-red"}`} style={{fontSize:8,marginTop:4}}>{pos.direction}</span>
              </div>
              <div>
                <div style={{fontSize:11,color:"var(--text3)"}}>Entry: <span className="mono">{fmtMoney(pos.entryPrice)}</span></div>
                <div style={{fontSize:11,color:"var(--text3)"}}>Stop {pos.stopPct}% · Target +{pos.targetPct}%</div>
              </div>
              <div className="mono" style={{textAlign:"right",fontSize:13}}>{fmtMoney(pos.currentPrice)}</div>
              <div className="mono" style={{textAlign:"right",fontSize:13,color:(pos.pnlPct||0)>=0?"var(--green)":"var(--red)"}}>
                {fmtPct(pos.pnlPct||0)}
              </div>
              <div className="mono" style={{textAlign:"right",fontSize:13,color:(pos.pnl||0)>=0?"var(--green)":"var(--red)"}}>
                {fmtMoney(pos.pnl||0)}
              </div>
              <div style={{textAlign:"right",fontSize:11,color:"var(--text3)"}}>Day {pos.daysHeld}</div>
              <button className="btn btn-danger btn-sm" onClick={()=>closePosition(pos.id)}>Close</button>
            </div>
          ))}
        </>
      )}

      {trades.length > 0 && (
        <>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"var(--text3)",letterSpacing:1,textTransform:"uppercase",margin:"20px 0 10px"}}>Closed Trades</div>
          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <table>
              <thead>
                <tr>
                  <th>Ticker</th><th>Dir</th>
                  <th style={{textAlign:"right"}}>Entry</th>
                  <th style={{textAlign:"right"}}>Days</th>
                  <th style={{textAlign:"right"}}>P&L %</th>
                  <th style={{textAlign:"right"}}>P&L $</th>
                  <th>Exit</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t,i)=>(
                  <tr key={i}>
                    <td><span className="mono" style={{color:"#fff",fontWeight:600}}>{t.ticker}</span></td>
                    <td><span className={`badge ${t.direction==="LONG"?"badge-green":"badge-red"}`} style={{fontSize:8}}>{t.direction}</span></td>
                    <td className="mono" style={{textAlign:"right"}}>{fmtMoney(t.entryPrice)}</td>
                    <td className="mono" style={{textAlign:"right"}}>{t.daysHeld}d</td>
                    <td className="mono" style={{textAlign:"right",color:(t.pnlPct||0)>=0?"var(--green)":"var(--red)"}}>{fmtPct(t.pnlPct||0)}</td>
                    <td className="mono" style={{textAlign:"right",color:(t.pnl||0)>=0?"var(--green)":"var(--red)"}}>{fmtMoney(t.pnl||0)}</td>
                    <td><span className={`badge ${t.status==="target"?"badge-green":t.status==="stopped"?"badge-red":"badge-gray"}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE 8 — LIVE EXECUTION
// ═══════════════════════════════════════════════════════════════════
function PageExecution({ sharedData }) {
  const [broker, setBroker] = useState("alpaca");
  const [apiKey, setApiKey] = useState("");
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([
    { type:"info", msg:`[${new Date().toLocaleTimeString()}] System initialised. Paper mode active.` },
    { type:"info", msg:`[${new Date().toLocaleTimeString()}] Awaiting broker connection.` },
  ]);
  const [autoTrade, setAutoTrade] = useState(false);
  const [loading, setLoading] = useState(false);
  const logRef = useRef(null);

  const addLog = (msg, type = "info") => {
    setLogs(p => [...p, { type, msg: `[${new Date().toLocaleTimeString()}] ${msg}` }]);
    setTimeout(() => logRef.current?.scrollTo(0, 99999), 50);
  };

  const connect = async () => {
    setLoading(true);
    addLog(`Connecting to ${broker.toUpperCase()} API...`);
    await new Promise(r => setTimeout(r, 1500));
    addLog("Authentication successful ✓", "success");
    addLog("Market data feed active", "success");
    addLog("Order management system ready", "success");
    setConnected(true);
    setLoading(false);
  };

  const runAutoScan = async () => {
    addLog("Running earnings scan...", "info");
    await new Promise(r => setTimeout(r, 800));
    const candidates = sharedData.earnings.filter(e => computeSurpriseScore(e) >= 65);
    addLog(`Found ${candidates.length} qualifying signals`, "success");
    candidates.forEach(c => {
      addLog(`SIGNAL: ${c.ticker} — Score ${computeSurpriseScore(c)}/100 — ${computeSurpriseScore(c)>=50?"LONG":"SHORT"}`, "success");
    });
    if (candidates.length === 0) addLog("No qualifying signals this scan", "warn");
  };

  const placeOrder = async (ticker, dir) => {
    addLog(`Submitting ${dir} order for ${ticker}...`, "info");
    await new Promise(r => setTimeout(r, 600));
    addLog(`ORDER FILLED: ${ticker} ${dir} @ market — 50 shares`, "success");
  };

  const brokers = [
    { id:"alpaca",  name:"Alpaca Markets",   note:"Commission-free, paper + live, great API" },
    { id:"ibkr",    name:"Interactive Brokers", note:"Institutional-grade, low margin rates" },
    { id:"tradier", name:"Tradier",           note:"Options-focused, good for vol crush trades" },
    { id:"tastytrade", name:"Tastytrade",     note:"Best for options strategies, low fees" },
  ];

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Step 7 of 7</div>
        <div className="page-title">Live Execution</div>
        <div className="page-desc">Connect to a real broker API and automate order execution. Always paper trade for 4–6 weeks before going live.</div>
      </div>

      <div className="alert alert-yellow" style={{marginBottom:20}}>
        ⚠️ <strong>Warning:</strong> Live trading involves real capital at risk. Ensure you have paper traded for at least 4–6 weeks with consistent results before connecting real funds. Always use a dedicated trading account, never your main savings.
      </div>

      <div className="grid-2" style={{marginBottom:20}}>
        <div className="card">
          <div className="card-title">Broker Connection</div>
          <div className="field">
            <label>Select Broker</label>
            <select value={broker} onChange={e=>setBroker(e.target.value)}>
              {brokers.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6,padding:"10px 12px",marginBottom:12}}>
            <div style={{fontSize:11,color:"var(--text3)"}}>{brokers.find(b=>b.id===broker)?.note}</div>
          </div>
          <div className="field">
            <label>API Key (paper key for testing)</label>
            <input type="password" placeholder="pk_••••••••••••••••" value={apiKey} onChange={e=>setApiKey(e.target.value)} />
          </div>
          <div className="field">
            <label>Secret Key</label>
            <input type="password" placeholder="••••••••••••••••" />
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-primary" onClick={connect} disabled={loading||connected}
              style={{flex:1}}>
              {loading?"Connecting...":connected?"✓ Connected":"Connect"}
            </button>
            {connected && <button className="btn btn-danger" onClick={()=>setConnected(false)}>Disconnect</button>}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Automation Controls</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {[
              { label:"Auto-scan every market open", key:"autoScan" },
              { label:"Auto-enter signals score ≥ 65", key:"autoEntry" },
              { label:"Auto-manage stops & targets", key:"autoManage" },
              { label:"Email alerts on fills", key:"alerts" },
            ].map((ctrl,i) => (
              <div key={i} style={{
                display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"10px 12px",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6
              }}>
                <span style={{fontSize:12,color:connected?"var(--text)":"var(--text3)"}}>{ctrl.label}</span>
                <div style={{
                  width:36,height:20,borderRadius:10,
                  background: connected && autoTrade ? "var(--green2)" : "var(--bg3)",
                  cursor: connected?"pointer":"not-allowed",
                  transition:"background 0.2s",
                  position:"relative",
                }} onClick={()=>connected&&setAutoTrade(p=>!p)}>
                  <div style={{
                    width:14,height:14,borderRadius:7,background:"#fff",
                    position:"absolute",top:3,
                    left: connected && autoTrade ? 19 : 3,
                    transition:"left 0.2s"
                  }}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-secondary" style={{flex:1}} onClick={runAutoScan} disabled={!connected}>
              Run Scan Now
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Execution Log</div>
        <div className="exec-log" ref={logRef}>
          {logs.map((l,i) => (
            <div key={i} className={`log-entry ${l.type}`}>{l.msg}</div>
          ))}
        </div>
        {connected && (
          <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
            <div style={{fontSize:11,color:"var(--text3)",alignSelf:"center"}}>Quick test:</div>
            {sharedData.earnings.slice(0,4).map(e=>(
              <button key={e.ticker} className="btn btn-secondary btn-sm" onClick={()=>placeOrder(e.ticker, computeSurpriseScore(e)>=50?"LONG":"SHORT")}>
                Order {e.ticker}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{marginTop:16}}>
        <div className="card-title">Required Infrastructure</div>
        <div className="grid-3">
          {[
            { icon:"🖥️", title:"VPS / Cloud Server", desc:"AWS t3.micro, DigitalOcean, or Linode. Run 24/7 for pre-market scans." },
            { icon:"📊", title:"Data Feed", desc:"Alpaca free tier, Polygon.io, or IEX Cloud for real-time price & options data." },
            { icon:"📧", title:"Alerting", desc:"Twilio SMS or SendGrid email for trade fills, stops hit, and daily summaries." },
          ].map((item,i) => (
            <div key={i} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8,padding:16}}>
              <div style={{fontSize:24,marginBottom:8}}>{item.icon}</div>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:6}}>{item.title}</div>
              <div style={{fontSize:11,color:"var(--text3)",lineHeight:1.6}}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════
export default function TradingSystem() {
  const [page, setPage] = useState("overview");
  const [sharedData, setSharedData] = useState({
    earnings: [],
    positions: [],
    trades: [],
  });

  const navItems = [
    { id:"overview",   icon:"⬡", label:"Overview",          badge:null },
    { id:"scanner",    icon:"◈", label:"Earnings Scanner",  badge:"1" },
    { id:"surprise",   icon:"◎", label:"Surprise Score",    badge:"2" },
    { id:"ivrank",     icon:"◑", label:"IV Rank",           badge:"3" },
    { id:"signal",     icon:"⚡", label:"Signal Engine",    badge:"4" },
    { id:"backtest",   icon:"⟳", label:"Backtester",        badge:"5" },
    { id:"paper",      icon:"◷", label:"Paper Trading",     badge:"6" },
    { id:"execution",  icon:"▶", label:"Live Execution",    badge:"7" },
  ];

  const renderPage = () => {
    switch(page) {
      case "overview":   return <PageOverview setPage={setPage} sharedData={sharedData} />;
      case "scanner":    return <PageScanner sharedData={sharedData} setSharedData={setSharedData} />;
      case "surprise":   return <PageSurprise sharedData={sharedData} setSharedData={setSharedData} />;
      case "ivrank":     return <PageIVRank sharedData={sharedData} />;
      case "signal":     return <PageSignal sharedData={sharedData} setSharedData={setSharedData} />;
      case "backtest":   return <PageBacktest />;
      case "paper":      return <PagePaper sharedData={sharedData} setSharedData={setSharedData} />;
      case "execution":  return <PageExecution sharedData={sharedData} />;
      default:           return <PageOverview setPage={setPage} sharedData={sharedData} />;
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="sys">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="brand">PEAD<span>+</span>VC</div>
            <div className="version">Trading System v1.0</div>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">Navigation</div>
            {navItems.map(item => (
              <div key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
                <div className="nav-icon">{item.icon}</div>
                <div className="nav-text">{item.label}</div>
                {item.badge && <div className="nav-badge">{item.badge}</div>}
              </div>
            ))}
          </div>

          <div className="sidebar-bottom">
            <div className="sys-status">
              <div className="status-dot"/>
              System Online
            </div>
            <div style={{fontSize:10,color:"var(--text3)",marginTop:6,fontFamily:"'IBM Plex Mono',monospace"}}>
              {sharedData.earnings.length} stocks · {sharedData.positions.length} positions
            </div>
          </div>
        </div>

        <div className="main">
          {renderPage()}
        </div>
      </div>
    </>
  );
}
