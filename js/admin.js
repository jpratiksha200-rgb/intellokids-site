/* IntelloKids workspace: the owner's private dashboard at /workspaceadmin (docs/BACKEND.md, "Admin dashboard").
 * Needs the IntelloKids server (IK_CONFIG.backend.enabled). Without it, it says so and never shows made-up numbers.
 * Sign-in: email + password (+ optional 6-digit code), a 12-hour admin session kept in this tab only (sessionStorage).
 * Every panel is read-only and refreshes every 60 seconds. Charts are plain inline SVG (no outside libraries).
 * Children's privacy: the server never sends children's names, chats or progress details here, only counts and ages.
 * Real data only (owner, 2026-11-17): every number comes from the live database and Paddle/Play; crawlers and our own
 * test accounts are left out on the server; a section without data says "No data yet" instead of showing zeros. */
(function () {
  const main = document.getElementById('adm');
  const status = document.getElementById('adm-status');
  const conf = (window.IK_CONFIG && IK_CONFIG.backend) || {};
  const API = String(conf.url || '').replace(/\/+$/, '') + '/api/v1';
  const KEY = 'ik_admin_session';
  let token = null, timer = null, visitDays = 30, usageDays = 30, famPage = 1, famQuery = '', demo = false;
  try { token = sessionStorage.getItem(KEY); } catch (e) { /* private mode */ }

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const fmt = n => (n == null ? '–' : Number(n).toLocaleString());
  const money = list => (list && list.length ? list.map(m => { try { return (m.cents / 100).toLocaleString(undefined, { style: 'currency', currency: m.currency }); } catch (e) { return (m.cents / 100).toFixed(2) + ' ' + esc(m.currency); } }).join(' · ') : '0');
  const when = iso => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '–');
  // Play time in friendly units, never decimals (owner, 2026-11-15): "45 sec", "12 min", "1 h 5 min". Takes minutes.
  const dur = min => {
    if (min == null) return '–';
    const s = Math.round(Number(min) * 60);
    if (!(s > 0)) return '0 min';
    if (s < 60) return s + ' sec';
    const m = Math.round(s / 60);
    return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '');
  };
  const day = d => (d ? new Date(d + 'T12:00:00Z').toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '–');

  async function api(path, opts) {
    opts = opts || {};
    const headers = { Accept: 'application/json' };
    if (opts.body) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = 'Bearer ' + token;
    let r;
    try { r = await fetch(API + path, { method: opts.method || 'GET', headers, body: opts.body ? JSON.stringify(opts.body) : undefined, cache: 'no-store' }); }
    catch (e) { throw Object.assign(new Error('The server is not answering. Check your internet connection.'), { code: 'offline' }); }
    if (opts.raw) { if (!r.ok) throw new Error('Download failed (' + r.status + ')'); return r; }
    let data = null;
    try { data = await r.json(); } catch (e) { /* empty */ }
    if (r.status === 401 && token && path !== '/admin/login') { signOut(true); throw new Error('Please sign in again.'); }
    if (!r.ok) throw Object.assign(new Error((data && data.error && data.error.message) || ('Error ' + r.status)), { code: data && data.error && data.error.code });
    return data;
  }

  // ---- No server yet (today's GitHub Pages site) ----
  function offPage() {
    status.textContent = '';
    main.innerHTML = `<section class="adm-card adm-off"><h1>🔒 IntelloKids workspace</h1>
      <p>The admin dashboard needs the IntelloKids server, which isn't live yet.</p>
      <p class="muted small">Once the server is switched on, sign in here to see families, visits, usage and payments. No numbers are shown before then.</p></section>`;
  }

  // ---- Sign-in ----
  function loginPage(msg, needCode) {
    stopTimer();
    status.textContent = '';
    main.innerHTML = `<section class="adm-card login">
      <h1>Sign in</h1>
      <p class="muted small">Owner dashboard. Your session lasts 12 hours, in this tab only.</p>
      <form novalidate>
        <label>Email<input class="input" name="email" type="email" autocomplete="username" required></label>
        <label>Password<input class="input" name="password" type="password" autocomplete="current-password" required></label>
        <label ${needCode ? '' : 'hidden'} data-code>6-digit code from your authenticator app<input class="input" name="totp" inputmode="numeric" autocomplete="one-time-code" maxlength="7"></label>
        <p class="err" role="alert">${esc(msg || '')}</p>
        <button class="btn primary" type="submit">Sign in</button>
      </form></section>`;
    const f = main.querySelector('form'), err = f.querySelector('.err');
    if (window.PwEye) PwEye.attach(f); // show/hide eye, the same as on the site (js/pw-eye.js)
    f.querySelector('[name=email]').focus();
    f.onsubmit = async e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      const btn = f.querySelector('button'); btn.disabled = true; err.textContent = '';
      try {
        const r = await api('/admin/login', { method: 'POST', body: { email: d.email, password: d.password, totp: d.totp || undefined } });
        token = r.token;
        try { sessionStorage.setItem(KEY, token); } catch (x) { /* ignore */ }
        dashboard();
      } catch (x) {
        btn.disabled = false;
        if (x.code === 'totp_required') { f.querySelector('[data-code]').hidden = false; f.querySelector('[name=totp]').focus(); }
        err.textContent = x.message;
      }
    };
  }

  function signOut(expired) {
    if (token && !expired) api('/admin/logout', { method: 'POST' }).catch(() => {});
    token = null;
    try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    loginPage(expired ? 'Your session ended. Please sign in again.' : '');
  }
  function stopTimer() { if (timer) clearInterval(timer); timer = null; }

  // ---- Charts (inline SVG) ----
  // Grouped bars: series = [{ label, color, values: [] }], labels = x labels.
  function bars(labels, series, opts) {
    opts = opts || {};
    const W = 760, H = opts.h || 220, padL = 40, padB = 26, padT = 10, n = labels.length || 1;
    const max = Math.max(1, ...series.flatMap(s => s.values));
    const step = (W - padL - 8) / n, bw = Math.max(2, (step * 0.8) / series.length);
    const y = v => padT + (H - padT - padB) * (1 - v / max);
    let g = '';
    for (let k = 0; k <= 4; k++) { const v = Math.round((max * k) / 4), yy = y(v); g += `<line x1="${padL}" x2="${W - 4}" y1="${yy}" y2="${yy}" stroke="#E3F4F7"/><text x="${padL - 6}" y="${yy + 4}" font-size="11" text-anchor="end">${fmt(v)}</text>`; }
    const every = Math.ceil(n / (opts.maxLabels || 10));
    labels.forEach((l, i) => {
      series.forEach((s, j) => {
        const v = s.values[i] || 0, x = padL + i * step + step * 0.1 + j * bw;
        g += `<rect x="${x.toFixed(1)}" y="${y(v).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0, H - padB - y(v)).toFixed(1)}" rx="2" fill="${s.color}"><title>${esc(l)}: ${esc(s.label)} ${esc(opts.fmt ? opts.fmt(v) : fmt(v))}</title></rect>`;
      });
      if (i % every === 0) g += `<text x="${(padL + i * step + step / 2).toFixed(1)}" y="${H - 8}" font-size="11" text-anchor="middle">${esc(l)}</text>`;
    });
    const legend = series.length > 1 ? `<div class="legend">${series.map(s => `<span><i style="background:${s.color}"></i>${esc(s.label)}</span>`).join('')}</div>` : '';
    return `${legend}<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || 'chart')}">${g}</svg>`;
  }
  function heatmap(m) { // m[weekday 0 = Sunday][hour] (UTC)
    const max = Math.max(1, ...m.flat()), names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], W = 760, cw = (W - 40) / 24, ch = 20;
    let g = '';
    m.forEach((row, d) => {
      g += `<text x="0" y="${d * ch + 15}" font-size="11">${names[d]}</text>`;
      row.forEach((v, h) => { const a = v ? 0.15 + 0.85 * (v / max) : 0.04; g += `<rect x="${40 + h * cw}" y="${d * ch + 2}" width="${cw - 2}" height="${ch - 3}" rx="3" fill="rgba(14,110,126,${a.toFixed(2)})"><title>${names[d]} ${h}:00 UTC: ${v} games</title></rect>`; });
    });
    for (let h = 0; h < 24; h += 3) g += `<text x="${40 + h * cw + 2}" y="${7 * ch + 14}" font-size="11">${h}h</text>`;
    return `<svg class="chart" viewBox="0 0 ${W} ${7 * ch + 20}" role="img" aria-label="Activity by day and hour">${g}</svg>`;
  }
  // Real data only (owner, 2026-11-17): a section without data shows "No data yet", never zeros dressed as numbers.
  const empty = msg => `<p class="empty">${esc(msg || 'No data yet.')}</p>`;
  const table = (rows, cols, none) => (rows && rows.length
    ? `<div class="scroll"><table><thead><tr>${cols.map(c => `<th class="${c.num ? 'num' : ''}">${esc(c.label)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${cols.map(c => `<td class="${c.num ? 'num' : ''}">${c.html ? c.html(r) : esc(c.get ? c.get(r) : r[c.key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
    : `<p class="muted small">${esc(none || 'No data yet.')}</p>`);
  const stat = (value, label) => `<div class="stat"><b>${value}</b><span>${esc(label)}</span></div>`;
  const anyOf = (...v) => v.some(x => Number(x) > 0);

  // ---- The dashboard ----
  function dashboard() {
    stopTimer();
    main.innerHTML = `
      <div id="p-banner"></div>
      <section class="adm-card" id="p-visits"><div class="panel-head"><h2>📈 Visits per day</h2>
        <div class="row" role="group" aria-label="Period">${[7, 30, 90].map(d => `<button type="button" class="btn small" data-vdays="${d}" aria-pressed="${d === visitDays}">${d} days</button>`).join('')}</div></div>
        <div data-body><p class="muted">Loading…</p></div></section>
      <section class="adm-card" id="p-overview"><h2>👪 Families, trials and money</h2><div data-body><p class="muted">Loading…</p></div></section>
      <section class="adm-card" id="p-usage"><div class="panel-head"><h2>🎮 What families do</h2>
        <div class="row" role="group" aria-label="Period">${[7, 30, 90].map(d => `<button type="button" class="btn small" data-udays="${d}" aria-pressed="${d === usageDays}">${d} days</button>`).join('')}</div></div>
        <div data-body><p class="muted">Loading…</p></div></section>
      <section class="adm-card" id="p-logins"><h2>🔑 Sign-ins and active time (last 30 days)</h2><div data-body><p class="muted">Loading…</p></div></section>
      <section class="adm-card" id="p-families"><div class="panel-head"><h2>📋 Families</h2>
        <div class="row"><input class="input" type="search" placeholder="Search by email" aria-label="Search by email" data-q style="width:220px" value="${esc(famQuery)}">
        <button type="button" class="btn small" data-csv>⬇️ Export CSV</button></div></div>
        <p class="note">Parents are listed by their account email. Children appear only as ages: no names, chats or progress details (children's privacy).</p>
        <div data-body><p class="muted">Loading…</p></div></section>
      <section class="adm-card" id="p-feedback"><h2>💬 Feedback from parents</h2>
        <p class="note">From the card at the bottom of the Parents' area: the stars and the message only (no parent or child details). Each one is also emailed to help@intellokids.com, with the parent's email as the reply-to.</p>
        <div data-body><p class="muted">Loading…</p></div></section>
      <section class="adm-card" id="p-launch"><h2>🚀 3-month launch test</h2><div data-body><p class="muted">Loading…</p></div></section>
      <section class="adm-card" id="p-security"><h2>🛡️ Security</h2><div data-body><p class="muted">Loading…</p></div></section>`;
    main.querySelectorAll('[data-vdays]').forEach(b => b.onclick = () => { visitDays = Number(b.dataset.vdays); main.querySelectorAll('[data-vdays]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); loadVisits(); });
    main.querySelectorAll('[data-udays]').forEach(b => b.onclick = () => { usageDays = Number(b.dataset.udays); main.querySelectorAll('[data-udays]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); loadUsage(); });
    let qt = null;
    main.querySelector('[data-q]').oninput = e => { clearTimeout(qt); qt = setTimeout(() => { famQuery = e.target.value.trim(); famPage = 1; loadFamilies(); }, 350); };
    main.querySelector('[data-csv]').onclick = exportCsv;
    refreshAll();
    timer = setInterval(refreshAll, 60000); // the live overview
  }

  const body = id => main.querySelector('#' + id + ' [data-body]');
  const fail = (id, e) => { const b = body(id); if (b) b.innerHTML = `<p class="err">${esc(e.message)}</p>`; };

  async function refreshAll() {
    if (!token) return;
    await Promise.all([loadOverview(), loadVisits(), loadUsage(), loadLogins(), loadFamilies(), loadFeedback(), loadLaunch(), loadSecurity()]);
    status.innerHTML = `<span>Updated ${new Date().toLocaleTimeString()} · refreshes every minute</span><button type="button" class="btn small" data-out>Sign out</button>`;
    status.querySelector('[data-out]').onclick = () => signOut(false);
  }

  async function loadOverview() {
    try {
      const o = await api('/admin/overview');
      demo = !!o.demo;
      // Production is always real data only. A local test server says where its numbers come from.
      const hidden = Number(o.test_families_hidden) || 0;
      main.querySelector('#p-banner').innerHTML = (demo ? '<div class="adm-banner">⚠️ Local test server: these numbers come from the database on this computer, not from intellokids.com.</div>' : '')
        + `<p class="adm-real"><b>Real people only.</b> Visits from search crawlers, link previews, uptime checks, scripts and headless browsers are not counted, and our own test accounts (example.com, kidsintello+…@gmail.com) are left out of every number${hidden ? ` (${fmt(hidden)} hidden)` : ''}.</p>`;
      const f = o.families, c = o.children, a = o.active, t = o.trials, s = o.subscriptions, r = o.revenue;
      const paidAny = [r.all_time, r.refunds_all_time].some(l => l && l.length);
      const h3 = (txt, first) => `<h3${first ? '' : ' style="margin-top:14px"'}>${txt}</h3>`;
      body('p-overview').innerHTML = `
        ${h3('Families', true)}${f.total ? `<div class="grid">${stat(fmt(f.total), 'families signed up')}${stat(fmt(f.verified), 'verified email')}${stat(fmt(f.new_today), 'new today')}${stat(fmt(f.new_7d), 'new in 7 days')}${stat(fmt(f.new_30d), 'new in 30 days')}${stat(fmt(f.pending), 'waiting to verify')}</div>` : empty('No families yet.')}
        ${h3('Children')}${c.total ? `<div class="grid">${stat(fmt(c.total), 'children')}${stat(fmt(c.by_age_group.tiny), 'aged 3–4')}${stat(fmt(c.by_age_group.junior), 'aged 5–6')}${stat(fmt(c.by_age_group.explorer), 'aged 7–10')}</div>` : empty('No children added yet.')}
        ${h3('Active')}${anyOf(a.families.mau, a.children.mau) ? `<div class="grid">${stat(fmt(a.families.dau), 'families today')}${stat(fmt(a.families.wau), 'families this week')}${stat(fmt(a.families.mau), 'families this month')}${stat(fmt(a.children.dau), 'children playing today')}${stat(fmt(a.children.wau), 'children this week')}${stat(fmt(a.children.mau), 'children this month')}</div>` : empty('No activity in the last 30 days yet.')}
        ${h3('Trials and subscriptions')}${anyOf(t.started, t.active, t.ended, s.active, s.canceled_all) ? `<div class="grid">${stat(fmt(t.active), 'trials running')}${stat(fmt(t.ended), 'trials ended')}${stat(o.conversion_rate == null ? '–' : o.conversion_rate + '%', 'trial → paid')}${stat(fmt(s.active), 'active subscriptions')}${stat(fmt(s.monthly) + ' / ' + fmt(s.annual), 'monthly / yearly')}${stat(fmt(s.cancel_scheduled), 'cancelling at period end')}${stat(fmt(s.canceled_30d), 'cancelled (30 days)')}${stat(fmt(s.by_provider.paddle) + ' / ' + fmt(s.by_provider.play), 'website / Google Play')}</div>` : empty('No trials or subscriptions yet.')}
        ${h3('Money')}${paidAny ? `<div class="grid">${stat(money(r.today), 'paid today')}${stat(money(r.last_30d), 'paid in 30 days')}${stat(money(r.all_time), 'paid all time')}${stat('$' + Number(r.mrr_estimate_usd).toFixed(2), 'monthly recurring (estimate)')}${stat(money(r.refunds_all_time), 'refunds')}</div>
        <p class="muted small">Amounts are what parents paid (Paddle, tax included). MRR estimate: active monthly × $9.99 + yearly × $79.99 / 12.</p>` : empty('No payments yet.')}
        <div class="grid2" style="margin-top:8px"><div><h3>Top countries: sign-ups</h3>${table(o.top_countries.signups, [{ label: 'Country', key: 'country' }, { label: 'Families', key: 'n', num: true }], 'No sign-ups yet.')}</div>
        <div><h3>Top countries: subscriptions</h3>${table(o.top_countries.subscriptions, [{ label: 'Country', key: 'country' }, { label: 'Subscriptions', key: 'n', num: true }], 'No subscriptions yet.')}</div></div>`;
    } catch (e) { fail('p-overview', e); }
  }

  async function loadVisits() {
    try {
      const v = await api('/admin/visits?days=' + visitDays);
      const labels = v.series.map(d => day(d.day));
      const kv = (rows, label) => table(rows, [{ label, key: 'key' }, { label: 'Views', key: 'n', num: true }]);
      tpData = null;
      if (!v.totals.views) {
        body('p-visits').innerHTML = `${empty('No visits from real people in the last ' + v.days + ' days yet.')}
          <p class="muted small">Counted without cookies, only once a person is really on the page (they move, touch, scroll, type or the page stays open 5 seconds). Crawlers, link previews, uptime checks, scripts and headless browsers are never counted.</p>`;
        return;
      }
      body('p-visits').innerHTML = `
        <div class="grid">${stat(fmt(v.totals.views), 'page views (' + v.days + ' days)')}${stat(fmt(v.totals.visitors), 'unique visitors (' + v.days + ' days)')}${stat(fmt(v.series[v.series.length - 1].views), 'views today')}${stat(fmt(v.series[v.series.length - 1].visitors), 'visitors today')}</div>
        ${bars(labels, [{ label: 'Page views', color: '#3ED8E8', values: v.series.map(d => d.views) }, { label: 'Unique visitors', color: '#FFD21F', values: v.series.map(d => d.visitors) }], { label: 'Visits per day', maxLabels: visitDays > 30 ? 9 : 10 })}
        <div class="tp" id="p-toppages"></div>
        <div class="grid2"><div><h3>Languages</h3>${kv(v.languages, 'Language')}</div>
        <div><h3>Countries</h3>${kv(v.countries, 'Country')}</div><div><h3>Came from</h3>${kv(v.referrers, 'Website')}</div></div>
        <p class="muted small">Real people only: a visit counts once a person is really on the page (they move, touch, scroll, type or the page stays open 5 seconds); crawlers, link previews, uptime checks, scripts and headless browsers are never counted. Counted without cookies: no IP address is stored, the referrer is kept as a domain only, and "unique visitors" use a random id the browser forgets every day (not sent at all when the browser asks not to be tracked).</p>`;
      tpData = v;
      renderTopPages();
    } catch (e) { fail('p-visits', e); }
  }

  // ---- Top pages: friendly names for the page groups the visit beacon sends (js/visit.js → backend pageGroup()) ----
  // Website pages arrive as their address ("/", "/fr/games/", "/pricing.html"); app screens as "app:<first part of the
  // #/ route>" ("app:kid" covers everything inside a child's play area). Unknown keys are shown as they are.
  const TP_LANGS = { fr: ['French', '🇫🇷'], es: ['Spanish', '🇪🇸'], de: ['German', '🇩🇪'], zh: ['Chinese', '🇨🇳'] };
  const TP_SITE = {
    '/': ['🏠', 'Home page'], '/games/': ['🎮', 'Games page'], '/learning-videos/': ['🎬', 'Videos page'], '/colouring-pages/': ['🎨', 'Colouring page'],
    '/maths-games/': ['🔢', 'Maths games page'], '/shape-colour-games/': ['🔺', 'Shapes & colours page'], '/logic-coding-games/': ['🧩', 'Logic & coding page'],
    '/ages/3-4/': ['🧠', 'Ages 3–4 page'], '/ages/5-6/': ['🧠', 'Ages 5–6 page'], '/ages/7-10/': ['🧠', 'Ages 7–10 page'],
    '/pricing.html': ['💳', 'Pricing'], '/terms.html': ['📜', 'Terms of use'], '/privacy.html': ['🔒', 'Privacy policy'], '/refund.html': ['↩️', 'Refund policy'],
    '/security.html': ['🛡️', 'Security page'], '/contact.html': ['✉️', 'Contact page'], '/404.html': ['🚧', 'Page not found'],
  };
  const TP_APP = {
    kid: ['🧒', "Child's play area"], parent: ['👪', "Parents' area"], signup: ['✍️', 'Sign-up'], login: ['🔑', 'Log-in'],
    'check-email': ['📬', 'Check your email'], verify: ['✅', 'Email confirmation link'], forgot: ['🤔', 'Forgot password'], reset: ['🔁', 'New password'],
    progress: ['📊', 'Family progress'], settings: ['⚙️', 'Settings'], feedback: ['💬', 'Feedback form'], plans: ['💳', 'Plans'], pricing: ['💳', 'Pricing'],
    welcome: ['🎉', 'Welcome screen'], terms: ['📜', 'Terms (in the app)'], language: ['🌍', 'Choose a language'],
    map: ['🗺️', 'Learning map'], play: ['🎮', 'Playing a game'], quiz: ['❓', 'Quiz'], colour: ['🎨', 'Colouring'], videos: ['🎬', 'Videos'],
    stickers: ['⭐', 'Sticker album'], chest: ['🎁', 'Treasure chest'], chat: ['🗨️', 'Talk to Brainy'], other: ['📱', 'Other app screen'],
  };
  function pageName(key) {
    const k = String(key == null ? '' : key);
    if (k.startsWith('app:')) { const s = TP_APP[k.slice(4)]; return { app: true, icon: s ? s[0] : '📱', name: s ? s[1] : k, known: !!s }; }
    let p = k.replace(/\/index\.html$/, '/');
    if (p.startsWith('/') && !p.endsWith('/') && !/\.[a-z0-9]+$/.test(p)) p += '/';
    const m = /^\/([a-z]{2})(\/.*)$/.exec(p), lang = m && TP_LANGS[m[1]];
    if (lang) {
      if (m[2] === '/') return { app: false, icon: lang[1], name: 'Home (' + lang[0] + ')', known: true };
      const s = TP_SITE[m[2]];
      if (s) return { app: false, icon: s[0], name: s[1] + ' (' + lang[0] + ')', known: true };
    }
    const s = TP_SITE[p];
    return { app: false, icon: s ? s[0] : '📄', name: s ? s[1] : k, known: !!s };
  }
  let tpData = null, tpTab = 'all', tpAll = false; // kept across the 60-second refresh and range changes
  const TP_TOP = 10;
  const pct = (n, total) => { if (!total || !n) return '0%'; const x = (100 * n) / total; return (x < 1 ? '<1' : x < 10 ? x.toFixed(1) : Math.round(x)) + '%'; };
  function renderTopPages(focusSel) {
    const box = main.querySelector('#p-toppages');
    if (!box || !tpData) return;
    const total = Number(tpData.totals && tpData.totals.views) || 0, days = tpData.days;
    const rows = (tpData.pages || []).map(r => Object.assign({ key: String(r.key), n: Number(r.n) || 0 }, pageName(r.key)));
    const lists = { all: rows, web: rows.filter(r => !r.app), app: rows.filter(r => r.app) };
    const sum = list => list.reduce((a, r) => a + r.n, 0);
    const tabs = [['all', 'All'], ['web', 'Website pages'], ['app', 'App screens']];
    const list = lists[tpTab] || rows, shown = tpAll ? list : list.slice(0, TP_TOP), max = Math.max(1, ...list.map(r => r.n));
    const groupViews = sum(list), unlisted = Math.max(0, total - sum(rows));
    const head = tpTab === 'all'
      ? `<b>${fmt(total)}</b> page views in the last ${days} days`
      : `<b>${fmt(groupViews)}</b> of the ${fmt(total)} page views in the last ${days} days were on ${tpTab === 'web' ? 'website pages' : 'app screens'} (${pct(groupViews, total)})`;
    const row = r => `<tr class="${r.app ? 'is-app' : 'is-web'}"><td>
        <div class="tp-page"><span class="tp-ico" aria-hidden="true">${r.icon}</span><span class="tp-txt"><span class="tp-name">${esc(r.name)}</span>${r.known ? `<span class="tp-key">${esc(r.key)}</span>` : ''}</span></div>
        <div class="tp-track" aria-hidden="true"><div class="tp-bar" style="width:${Math.max(1.5, (100 * r.n) / max).toFixed(1)}%"></div></div></td>
      <td class="num">${fmt(r.n)}</td><td class="num">${pct(r.n, total)}</td></tr>`;
    box.innerHTML = `<div class="panel-head"><h3>🔝 Top pages</h3>
        <div class="row tp-tabs" role="group" aria-label="Which pages">${tabs.map(([id, label]) => `<button type="button" class="btn small" data-tp-tab="${id}" aria-pressed="${id === tpTab}">${label}${id === 'all' ? '' : ` <span class="tp-share">${pct(sum(lists[id]), total)}</span>`}</button>`).join('')}</div></div>
      <p class="tp-total">${head}</p>
      ${tpTab === 'all' && rows.length ? '<div class="legend tp-legend" aria-hidden="true"><span><i class="tp-web"></i>Website page</span><span><i class="tp-app"></i>App screen</span></div>' : ''}
      ${shown.length ? `<table class="tp-table"><caption class="tp-sr">Top ${tpTab === 'web' ? 'website pages' : tpTab === 'app' ? 'app screens' : 'pages'}, last ${days} days</caption>
        <thead><tr><th scope="col">Page</th><th scope="col" class="num">Views</th><th scope="col" class="num">% of all</th></tr></thead>
        <tbody>${shown.map(row).join('')}</tbody></table>` : `<p class="muted small">No ${tpTab === 'web' ? 'website page' : tpTab === 'app' ? 'app screen' : 'page'} views in the last ${days} days yet.</p>`}
      ${list.length > TP_TOP ? `<p class="tp-more"><button type="button" class="btn small" data-tp-more aria-expanded="${tpAll}">${tpAll ? 'Show top ' + TP_TOP : 'Show all ' + list.length}</button></p>` : ''}
      <p class="muted small">${unlisted ? `Other pages not listed: ${fmt(unlisted)} views. ` : ''}"% of all" is the share of every page view in the period; the bars compare each row with the top one. App screens are counted by section: everything a child does in their play area (map, games, videos, colouring, stickers…) counts as "Child's play area".</p>`;
    box.querySelectorAll('[data-tp-tab]').forEach(b => b.onclick = () => { tpTab = b.dataset.tpTab; tpAll = false; renderTopPages('[data-tp-tab="' + tpTab + '"]'); });
    const more = box.querySelector('[data-tp-more]');
    if (more) more.onclick = () => { tpAll = !tpAll; renderTopPages('[data-tp-more]'); };
    if (focusSel) { const f = box.querySelector(focusSel); if (f) f.focus(); }
  }

  async function loadUsage() {
    try {
      const u = await api('/admin/usage?days=' + usageDays), f = u.features;
      if (!anyOf(f.levels_played, f.games_finished, f.videos_opened, f.pictures_coloured, f.quizzes_finished, f.stickers_won, f.chests_won) && !(u.popular_content || []).length) {
        const tb = f.talk_to_brainy;
        body('p-usage').innerHTML = empty('No play activity in the last ' + u.days + ' days yet.')
          + (tb.children_total ? `<p class="muted small">Talk to Brainy is on for ${fmt(tb.children_total - tb.children_with_chat_off)} of ${fmt(tb.children_total)} children.</p>` : '');
        return;
      }
      body('p-usage').innerHTML = `
        <div class="grid">${stat(fmt(f.levels_played), 'map levels started')}${stat(fmt(f.games_finished), 'games finished')}${stat(fmt(f.videos_opened), 'videos opened')}${stat(fmt(f.pictures_coloured), 'pictures coloured')}${stat(fmt(f.quizzes_finished), 'quizzes finished')}${stat(fmt(f.stickers_won), 'stickers won')}${stat(fmt(f.chests_won), 'treasure chests won')}${stat(fmt(f.talk_to_brainy.children_total - f.talk_to_brainy.children_with_chat_off) + ' / ' + fmt(f.talk_to_brainy.children_total), 'children with Talk to Brainy on')}${stat(dur(u.avg_game_minutes), 'average game')}${stat(dur(u.avg_daily_play_minutes_per_active_family), 'play per active family per day')}</div>
        <div class="grid2" style="margin-top:12px"><div><h3>Games played</h3>${table(u.games, [{ label: 'Game', key: 'game' }, { label: 'Finished', key: 'n', num: true }])}</div>
        <div><h3>Videos opened</h3>${table(u.videos, [{ label: 'Video', key: 'video' }, { label: 'Opens', key: 'n', num: true }])}</div>
        <div><h3>Most opened content</h3>${table(u.popular_content, [{ label: 'Content', key: 'content' }, { label: 'While', get: r => String(r.access || '').replace(':', ' · ') }, { label: 'Opens', key: 'n', num: true }])}</div>
        <div><h3>Games by age group</h3>${table(u.by_age_group, [{ label: 'Age group', get: r => ({ tiny: '3–4', junior: '5–6', explorer: '7–10' })[r.age_group] || r.age_group }, { label: 'Games', key: 'games', num: true }])}</div></div>
        <h3 style="margin-top:12px">When children play (UTC)</h3>${heatmap(u.heatmap_utc)}`;
    } catch (e) { fail('p-usage', e); }
  }

  async function loadLogins() {
    try {
      const l = await api('/admin/logins?days=30');
      if (!l.per_day.some(d => d.logins || d.active_families || d.play_minutes) && !l.by_hour_utc.some(Boolean)) {
        body('p-logins').innerHTML = empty('No parent sign-ins in the last 30 days yet.');
        return;
      }
      body('p-logins').innerHTML = `
        ${bars(l.per_day.map(d => day(d.day)), [{ label: 'Parent sign-ins', color: '#0E6E7E', values: l.per_day.map(d => d.logins) }, { label: 'Active families', color: '#5CCB6F', values: l.per_day.map(d => d.active_families) }], { label: 'Sign-ins per day' })}
        <div class="grid2"><div><h3>Sign-ins by hour (UTC)</h3>${bars(l.by_hour_utc.map((_, h) => h + 'h'), [{ label: 'Sign-ins', color: '#A855F7', values: l.by_hour_utc }], { h: 160, maxLabels: 8, label: 'Sign-ins by hour' })}</div>
        <div><h3>Play time per day (minutes)</h3>${bars(l.per_day.map(d => day(d.day)), [{ label: 'Play time', color: '#F47C8A', values: l.per_day.map(d => d.play_minutes) }], { h: 160, maxLabels: 6, label: 'Play time per day', fmt: dur })}</div></div>`;
    } catch (e) { fail('p-logins', e); }
  }

  async function loadFamilies() {
    try {
      const d = await api('/admin/families?page=' + famPage + '&q=' + encodeURIComponent(famQuery));
      const tag = p => `<span class="tag ${/^paid/.test(p) ? 'paid' : /^trial/.test(p) ? 'trial' : /^pending/.test(p) ? 'pending' : ''}">${esc(p)}</span>`;
      if (!d.total) {
        body('p-families').innerHTML = empty(famQuery ? 'No families match "' + famQuery + '".' : 'No families yet.');
        return;
      }
      body('p-families').innerHTML = `<p class="muted small">${fmt(d.total)} families${famQuery ? ' matching "' + esc(famQuery) + '"' : ''} · most recently active first · test accounts are not listed</p>
        ${table(d.families, [
          { label: 'Parent email', key: 'email' }, { label: 'Signed up', get: r => when(r.signed_up) }, { label: 'Verified', get: r => (r.verified ? 'yes' : 'no') },
          { label: 'Last log-in', get: r => when(r.last_login) }, { label: 'Last active', get: r => day(r.last_active) }, { label: 'Plan', html: r => tag(r.plan) },
          { label: 'Children (ages)', get: r => (r.children.length ? r.children.length + ' (' + r.children.join(', ') + ')' : '0') }, { label: 'Country', key: 'country' }])}
        <div class="row between" style="margin-top:8px"><button type="button" class="btn small" data-prev ${famPage <= 1 ? 'disabled' : ''}>← Previous</button>
        <span class="muted small">Page ${d.page} of ${d.pages}</span><button type="button" class="btn small" data-next ${famPage >= d.pages ? 'disabled' : ''}>Next →</button></div>`;
      const b = body('p-families');
      b.querySelector('[data-prev]').onclick = () => { famPage--; loadFamilies(); };
      b.querySelector('[data-next]').onclick = () => { famPage++; loadFamilies(); };
    } catch (e) { fail('p-families', e); }
  }

  async function exportCsv() {
    try {
      const r = await api('/admin/families.csv?q=' + encodeURIComponent(famQuery), { raw: true });
      const blob = await r.blob(), a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'intellokids-families-' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch (e) { alert(e.message); }
  }

  // Parents' feedback (owner, 2026-11-18): newest first.
  async function loadFeedback() {
    try {
      const d = await api('/admin/feedback');
      if (!d.total) { body('p-feedback').innerHTML = empty('No feedback yet.'); return; }
      const stars = n => (n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '—');
      body('p-feedback').innerHTML = `<p class="muted small">${fmt(d.total)} messages${d.average !== null ? ' · average ' + esc(String(d.average)) + ' / 5' : ''} · newest first · test accounts are not listed</p>
        <ul class="fb-list">${d.feedback.map(f => `<li><p class="fb-meta"><span class="fb-stars-ro" aria-label="${f.rating ? f.rating + ' out of 5' : 'no rating'}">${stars(f.rating)}</span> <span class="muted small">${esc(when(f.at))} · ${esc(f.lang)}</span></p>
          <p class="fb-msg">${f.message ? esc(f.message) : '<span class="muted">(no message)</span>'}</p></li>`).join('')}</ul>`;
    } catch (e) { fail('p-feedback', e); }
  }

  async function loadLaunch() {
    try {
      const L = await api('/admin/launch');
      const n = (k, v) => stat(v == null ? '–' : (typeof v === 'number' ? fmt(v) : esc(v)), k);
      const r1 = L['1_families_registered'], r2 = L['2_children_using'], r3 = L['3_trials'], r4 = L['4_subscriptions'], r6 = L['6_cancellations'];
      if (!anyOf(r1.signed_up, r1.verified, r2.children_added, r2.children_first_active, r3.started, r4.started, r4.active_now, r6.canceled) && !L['5_popular_premium_content'].length) {
        body('p-launch').innerHTML = `<p class="muted small">From ${day(L.from)} to ${day(L.to)} (last 90 days).</p>${empty('No launch-test data in this period yet.')}`;
        return;
      }
      body('p-launch').innerHTML = `<p class="muted small">From ${day(L.from)} to ${day(L.to)} (last 90 days). Definitions: docs/LAUNCH-TEST-PLAN.md.</p>
        <div class="grid">${n('1 · families registered', r1.signed_up)}${n('1 · verified', r1.verified)}${n('2 · children who played', r2.children_first_active)}${n('3 · trials started', r3.started)}${n('3 · ran the full 7 days', r3.ran_full_7_days)}${n('3 · subscribed during trial', r3.subscribed_during_trial)}${n('4 · subscriptions started', r4.started)}${n('4 · trial → paid', r4.trial_to_paid_rate == null ? null : r4.trial_to_paid_rate + '%')}${n('6 · cancellations', r6.canceled)}</div>
        <div class="grid2" style="margin-top:12px"><div><h3>5 · Most popular premium content</h3>${table(L['5_popular_premium_content'], [{ label: 'Content', key: 'content' }, { label: 'Age group', key: 'age_group' }, { label: 'Opens', key: 'opens', num: true }])}</div>
        <div><h3>7 · Subscriptions by country</h3>${table(L['7_subscriptions_by_country'], [{ label: 'Country', key: 'key' }, { label: 'Subscriptions', key: 'n', num: true }])}</div></div>`;
    } catch (e) { fail('p-launch', e); }
  }

  async function loadSecurity() {
    try {
      const [me, audit] = await Promise.all([api('/admin/me'), api('/admin/audit')]);
      const on = me.admin.totp_enabled;
      body('p-security').innerHTML = `<p>Signed in as <strong>${esc(me.admin.email)}</strong>. 2-step login: <strong>${on ? 'on' : 'off'}</strong>.</p>
        ${on ? '' : `<p class="note">Recommended: a long, unique password, and 2-step login with an authenticator app (Google Authenticator, Microsoft Authenticator…). <button type="button" class="btn small" data-totp>Turn on 2-step login</button></p><div data-totp-box></div>`}
        <h3>Recent sign-ins to this dashboard</h3>${table(audit.logins, [{ label: 'When', get: r => when(r.at) }, { label: 'Result', get: r => (r.success ? 'signed in' : 'refused: ' + r.reason.replace('_', ' ')) }, { label: 'Country', key: 'country' }])}
        <p class="muted small">No IP addresses are recorded. 5 wrong tries lock sign-in for 15 minutes.</p>`;
      const tb = body('p-security').querySelector('[data-totp]');
      if (tb) tb.onclick = totpSetup;
    } catch (e) { fail('p-security', e); }
  }

  async function totpSetup() {
    const box = body('p-security').querySelector('[data-totp-box]');
    try {
      const s = await api('/admin/totp/setup', { method: 'POST' });
      stopTimer(); // don't redraw while the admin types the code
      box.innerHTML = `<div class="note"><p>1. In your authenticator app, add an account by typing this key: <strong style="letter-spacing:2px;overflow-wrap:anywhere">${esc(s.secret)}</strong></p>
        <p>2. Type the 6-digit code the app shows:</p>
        <form class="row" novalidate><input class="input" name="code" inputmode="numeric" maxlength="7" style="width:140px" aria-label="6-digit code"><button class="btn primary small" type="submit">Turn on</button></form><p class="err" role="alert"></p></div>`;
      const f = box.querySelector('form');
      f.onsubmit = async e => {
        e.preventDefault();
        try { await api('/admin/totp/enable', { method: 'POST', body: { code: f.code.value.replace(/\s/g, '') } }); loadSecurity(); timer = setInterval(refreshAll, 60000); }
        catch (x) { box.querySelector('.err').textContent = x.message; }
      };
    } catch (e) { box.innerHTML = `<p class="err">${esc(e.message)}</p>`; }
  }

  // ---- Start ----
  function start() {
    if (!conf.enabled) return offPage();
    if (token) dashboard(); else loginPage();
  }
  start();
})();
