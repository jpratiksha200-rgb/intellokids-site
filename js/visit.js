/* Anonymous, cookieless visit counting for the owner's dashboard (docs/BACKEND.md, "Admin dashboard").
 * OFF unless online accounts are on (IK_CONFIG.backend.enabled): then nothing is sent at all.
 * When on, one tiny request per page or app screen: the page group (e.g. "/" or "app:parent"), the language and the
 * referring website's DOMAIN only (e.g. "google.com"). No cookies, no IP stored, no fingerprinting, no third parties.
 * "Unique visitors": a random id kept in this browser for today only (a new one every day); it is never sent when
 * the browser asks not to be tracked (Do-Not-Track or Global Privacy Control). The owner's admin tab is not counted.
 * Real people only (owner, 2026-11-17): nothing is sent by automated or headless browsers (navigator.webdriver, a
 * bot or headless user agent), and nothing before a person is really there: the page is visible AND they move the
 * pointer, touch, scroll, type or click, OR the page stays visible and focused for 5 seconds. After that, later app
 * screens count normally. The server drops bots too (backend routes/collect.ts). Nothing new is stored or read for
 * this: the checks only look at the page's own state. Works the same in the Android app (WebView) and from file://. */
(function () {
  if (!window.Cloud || !Cloud.on() || !Cloud.apiBase) return;
  const nav = navigator, ua = nav.userAgent || '';
  // Automated, headless and crawler browsers. "(^|[^u])bot" keeps Cubot phones (no look-behind: older iPhones).
  if (nav.webdriver === true) return;
  if (/(^|[^u])bot\b|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|inspectiontool|googleother|phantomjs|puppeteer|playwright|selenium|webdriver|prerender|ahrefs|semrush|gptbot|claude|perplexity|bytespider/i.test(ua)) return;
  try {
    // Chromium browsers list their brands; a headless one says so, and an automated one that fakes its user agent
    // usually ends up with no brands at all.
    const d = nav.userAgentData;
    if (d && Array.isArray(d.brands) && (!d.brands.length || d.brands.some(b => /headless/i.test(String(b && b.brand))))) return;
  } catch (e) { /* ignore */ }
  try { if (sessionStorage.getItem('ik_admin_session')) return; } catch (e) { /* ignore */ }
  const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;

  function dailyId() {
    if (dnt) return undefined;
    try {
      const today = new Date().toISOString().slice(0, 10);
      let v = JSON.parse(localStorage.getItem('ik_vid') || 'null');
      if (!v || v.day !== today || typeof v.id !== 'string') {
        const a = new Uint8Array(16);
        crypto.getRandomValues(a);
        v = { day: today, id: Array.from(a, b => b.toString(16).padStart(2, '0')).join('') };
        localStorage.setItem('ik_vid', JSON.stringify(v));
      }
      return v.id;
    } catch (e) { return undefined; }
  }
  let refDomain = '';
  try { if (document.referrer) refDomain = new URL(document.referrer).hostname; } catch (e) { /* ignore */ }

  let last = null, human = false;
  function send() {
    if (!human) return;
    const screen = location.hash.replace(/^#\/?/, '').split(/[/?]/)[0];
    const path = screen ? 'app:' + screen : location.pathname;
    if (path === last) return;
    last = path;
    const body = { path, lang: (window.I18N && I18N.getLang()) || document.documentElement.lang || 'en', ref: refDomain, vid: dailyId() };
    refDomain = ''; // the referrer belongs to the first page of the visit only
    try {
      fetch(Cloud.apiBase() + '/collect/view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true, credentials: 'omit' }).catch(() => {});
    } catch (e) { /* never break the page */ }
  }

  // ---- Wait for a real person ----
  const SIGNALS = ['pointermove', 'pointerdown', 'touchstart', 'scroll', 'keydown', 'click'];
  const visible = () => document.visibilityState === 'visible';
  let focusedSeconds = 0, timer = null;
  function isHuman(e) {
    if (human || !visible() || (e && e.isTrusted === false)) return; // events made by a script don't count
    human = true;
    SIGNALS.forEach(t => window.removeEventListener(t, isHuman, true));
    clearInterval(timer);
    send(); // the screen the person is on now
  }
  SIGNALS.forEach(t => window.addEventListener(t, isHuman, { capture: true, passive: true }));
  timer = setInterval(() => {
    let focused = false;
    try { focused = document.hasFocus(); } catch (e) { /* ignore */ }
    focusedSeconds = visible() && focused ? focusedSeconds + 1 : 0; // 5 seconds in a row, visible and focused
    if (focusedSeconds >= 5) isHuman();
  }, 1000);
  window.addEventListener('hashchange', send);
})();
