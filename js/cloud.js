/* IntelloKids online accounts (docs/BACKEND.md). Everything here is switched off unless IK_CONFIG.backend.enabled.
 *
 * What it does when on:
 *  - signs parents up, in and out with the server (a bearer token kept with the account in localStorage);
 *  - a new account is "pending" until the parent types the 6-digit code (or clicks the link) from the email;
 *    until then only "Check your email" opens (owner, 2026-11-16: email first);
 *  - accounts exist only on the server (owner, 2026-11-17: start fresh, no device accounts from before online
 *    accounts): this browser keeps a copy of the signed-in family only, and any older device-only account found here
 *    is cleared at start (it never blocks a sign-up or a log-in);
 *  - mirrors the server's trial dates and subscription onto the account, so Store.trialState() and the limits
 *    work unchanged (the server is the source of truth; this device only caches it);
 *  - syncs every child's progress (the server merges devices; Brainy chat never leaves the device);
 *  - sends "content opened" counts for the launch test (no child data).
 * Store calls Cloud.changed() after every save; screens call the async functions below. */
(function () {
  const conf = () => (window.IK_CONFIG && IK_CONFIG.backend) || {};
  const CHAT = ['chat', 'chatFlags', 'chatSeen'];
  const NOT_PROGRESS = new Set(['id', 'name', 'age', 'addedAt', 'cloudId', 'editPending'].concat(CHAT));
  let applying = false; // true while we write the server's answer into the store (no sync loop)
  let syncTimer = null, eventTimer = null, refreshing = null;
  const events = [];
  const sigs = {}; // child id → JSON of the progress last sent/received (this tab)
  const OPTIMISTIC_MS = 30 * 60e3; // a just-completed checkout stays unlocked this long while the server confirms it

  // A page opened from file:// (the owner's local copy, the test harnesses) can never reach the API (the browser
  // refuses it), so it works like the switch is off: accounts stay in this browser, the local test account works.
  function on() { return !!conf().enabled && location.protocol !== 'file:'; }
  // '' = the website's own address. Inside the Android app (served from https://localhost) that means intellokids.com.
  function base() {
    let u = String(conf().url || '');
    if (!u && window.Capacitor && location.hostname === 'localhost') u = 'https://intellokids.com';
    return u.replace(/\/+$/, '') + '/api/v1';
  }
  const user = () => Store.currentUser();
  const token = u => (u = u || user()) && u.cloud && u.cloud.token;

  // One request. Never throws: { ok, status, data, code } (code 'offline' when the network is down).
  async function req(method, path, body, auth) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) headers.Authorization = 'Bearer ' + auth;
    let res;
    try {
      res = await fetch(base() + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store' });
    } catch (e) { return { ok: false, status: 0, code: 'offline', data: null }; }
    let data = null;
    try { data = await res.json(); } catch (e) { /* empty */ }
    if (res.ok) return { ok: true, status: res.status, data, code: null };
    const err = (data && data.error) || {};
    // A signed-out or expired session: forget the token (the account stays on the device).
    if (res.status === 401 && auth && token() === auth) setCloud({ token: null });
    return { ok: false, status: res.status, data, code: err.code || 'server_error', extra: err };
  }

  // Requests that change the account on the server (a child added or removed, progress, PIN, name, billing) go through
  // write(). A refresh asked before or during one of them may answer with the family as it was: it is then asked again
  // (fresh() below), so an old answer never overwrites newer state on this device.
  let writeGen = 0;
  const writes = new Set();
  function write(method, path, body, auth) {
    writeGen++;
    const p = req(method, path, body, auth);
    writes.add(p);
    return p.finally(() => { writes.delete(p); writeGen++; });
  }

  // The i18n key for a server error (texts in en/fr/es: cl_err_*).
  function errKey(code) {
    const k = 'cl_err_' + String(code || 'generic');
    return I18N.hasKey('en', k) ? k : 'cl_err_generic';
  }

  function setCloud(patch) {
    applying = true;
    try { Store.updateUser(u => { u.cloud = Object.assign({}, u.cloud, patch); }); } finally { applying = false; }
  }

  // ---- The server's entitlement, mirrored onto the fields Store.trialState() / hasPaid() read ----
  function applyEntitlement(u, ent) {
    if (!ent) return;
    const tr = ent.trial || {};
    if (tr.started_at) u.trialStartedAt = Date.parse(tr.started_at); else delete u.trialStartedAt;
    if (ent.access === 'paid' && ent.subscription) {
      const s = ent.subscription;
      u.subscription = { plan: s.plan === 'annual' ? 'yearly' : s.plan, status: 'active', since: u.subscription && u.subscription.since || Date.now(),
        source: s.provider === 'play' ? 'play' : 'paddle', cloud: true, cancelScheduled: !!s.cancel_scheduled, periodEnd: s.current_period_end };
    } else if (u.subscription && u.subscription.source === 'paddle' && !u.subscription.cloud && Date.now() - (u.subscription.since || 0) < OPTIMISTIC_MS) {
      // A checkout that just completed on this device (Store.recordPaddlePurchase): keep it open while Paddle's signed
      // webhook reaches our server (usually seconds), and ask again in a minute. After that the server's answer wins.
      setTimeout(() => refresh(true), 60e3);
    } else if (u.subscription && (u.subscription.cloud || u.subscription.source === 'paddle')) {
      u.subscription = null; // the server says there is no paid plan (ended, refunded…)
    }
    u.cloud = Object.assign({}, u.cloud, { entitlement: ent, checkedAt: Date.now() });
  }

  const progressOf = c => { const p = {}; Object.keys(c).forEach(k => { if (!NOT_PROGRESS.has(k)) p[k] = c[k]; }); return p; };
  function writeProgress(childId, merged) {
    applying = true;
    try {
      Store.updateChild(childId, c => {
        Object.keys(merged).forEach(k => { if (!NOT_PROGRESS.has(k)) c[k] = merged[k]; });
      });
    } finally { applying = false; }
    const c = Store.getChild(childId);
    if (c) sigs[childId] = JSON.stringify(progressOf(c));
  }
  // ---- The server's merge rules (backend/src/progress.ts), the same here: when the child plays on while an upload is
  // on its way, the server's answer is merged into the CURRENT progress instead of replacing it. Keep the two in step.
  const IDENTITY = new Set(['id', 'name', 'age', 'addedAt']);
  const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
  const num = v => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const SAFE_KEY = k => k !== '__proto__' && k !== 'constructor' && k !== 'prototype';
  const maxOf = (a, b) => Math.max(num(a), num(b));
  function mergeNumMap(a, b, pick) {
    const out = {};
    for (const src of [a, b]) {
      if (!isObj(src)) continue;
      for (const [k, v] of Object.entries(src)) {
        if (!SAFE_KEY(k) || typeof v !== 'number' || !Number.isFinite(v)) continue;
        out[k] = k in out ? (pick === 'min' ? Math.min(out[k], v) : Math.max(out[k], v)) : v;
      }
    }
    return out;
  }
  function mergeHistory(a, b) {
    const seen = new Map();
    for (const src of [a, b]) {
      if (!Array.isArray(src)) continue;
      for (const h of src) { if (isObj(h) && typeof h.t === 'number') seen.set(h.t + '|' + String(h.key == null ? '' : h.key), h); }
    }
    return [...seen.values()].sort((x, y) => num(x.t) - num(y.t)).slice(-500);
  }
  function mergeMissed(a, b) {
    const out = {};
    for (const src of [a, b]) {
      if (!isObj(src)) continue;
      for (const [label, m] of Object.entries(src)) {
        if (!SAFE_KEY(label) || !isObj(m)) continue;
        const o = out[label];
        out[label] = o ? Object.assign({}, o, m, { n: maxOf(o.n, m.n), last: maxOf(o.last, m.last) }) : Object.assign({}, m);
      }
    }
    const keys = Object.keys(out);
    if (keys.length > 60) keys.sort((x, y) => num(out[x].last) - num(out[y].last)).slice(0, keys.length - 60).forEach(k => delete out[k]);
    return out;
  }
  function mergeDrawings(a, b, bNewer) {
    const out = {}, A = isObj(a) ? a : {}, B = isObj(b) ? b : {};
    for (const pic of new Set([...Object.keys(A), ...Object.keys(B)])) {
      if (!SAFE_KEY(pic)) continue;
      const x = A[pic], y = B[pic];
      if (!isObj(x)) { out[pic] = y; continue; }
      if (!isObj(y)) { out[pic] = x; continue; }
      const newer = bNewer ? y : x, older = bNewer ? x : y; // the newer copy wins, a finished picture is never lost
      const merged = Object.assign({}, newer);
      if (!newer.done && older.done) { merged.done = true; merged.doneFills = older.doneFills; merged.at = older.at; }
      else if (newer.done && older.done && num(older.at) > num(newer.at)) { merged.doneFills = older.doneFills; merged.at = older.at; }
      out[pic] = merged;
    }
    return out;
  }
  function mergeChests(a, b) {
    const A = isObj(a) ? a : {}, B = isObj(b) ? b : {};
    const won = A.won == null && B.won == null ? undefined : maxOf(A.won, B.won);
    return Object.assign({}, A, B, { open: mergeNumMap(A.open, B.open, 'min'), best: mergeNumMap(A.best, B.best), lv: mergeNumMap(A.lv, B.lv), plays: maxOf(A.plays, B.plays) },
      won === undefined ? {} : { won });
  }
  const RULES = {
    xp: maxOf, stars: maxOf, quizCount: maxOf, improved: maxOf,
    completed: (a, b) => mergeNumMap(a, b), mapSeen: (a, b) => mergeNumMap(a, b), badges: (a, b) => mergeNumMap(a, b, 'min'),
    videos: (a, b) => mergeNumMap(a, b), tally: (a, b) => mergeNumMap(a, b),
    albumBase: (a, b) => Object.assign({}, isObj(b) ? b : {}, isObj(a) ? a : {}),
    history: mergeHistory, missed: mergeMissed, drawings: mergeDrawings, chests: mergeChests
  };
  // stored: the server's copy (changed at storedAt); incoming: this device's (changed at incomingAt).
  function mergeProgress(stored, storedAt, incoming, incomingAt) {
    const bNewer = incomingAt >= storedAt, out = {};
    for (const k of new Set([...Object.keys(stored), ...Object.keys(incoming)])) {
      if (!SAFE_KEY(k) || IDENTITY.has(k) || CHAT.includes(k)) continue;
      const a = stored[k], b = incoming[k], rule = RULES[k];
      if (rule) { out[k] = rule(a, b, bNewer); continue; }
      if (!(k in incoming)) { out[k] = a; continue; }
      if (!(k in stored)) { out[k] = b; continue; }
      out[k] = bNewer ? b : a;
    }
    return out;
  }

  // The server's answer to an upload of `sent` (the JSON sent). If the child played on meanwhile (a level finished while
  // the request was on its way), the answer is merged into the CURRENT progress, never written over it, and the child
  // stays "changed" so the newer progress is sent next. Progress never goes backwards.
  function keepAnswer(childId, sent, answer, answerAt) {
    const c = Store.getChild(childId);
    if (!c) return;
    const now = progressOf(c);
    if (JSON.stringify(now) === sent) return writeProgress(childId, answer || {});
    writeProgress(childId, mergeProgress(answer || {}, answerAt || 0, now, Date.now()));
    sigs[childId] = JSON.stringify(answer || {}); // what the server has: the newer changes still go up
    soon();
  }

  // After a sign-in or a refresh: the server's account, entitlement and children become this device's.
  async function adopt(snap) {
    if (!snap || !snap.family) return;
    const fam = snap.family;
    applying = true;
    try {
      Store.updateUser(u => {
        u.name = fam.name;
        u.cloud = Object.assign({}, u.cloud, { familyId: fam.id, status: fam.status, email: fam.email, playId: fam.play_account_id, pendingEmail: fam.pending_email || null });
        // The parent PIN (kid lock): the server's hash, unless this device changed it and hasn't sent it yet.
        if (fam.pin_hash && !u.pinDirty) u.pin = fam.pin_hash;
        else if (fam.pin_hash === null && u.pin) u.pinDirty = true;
        applyEntitlement(u, snap.entitlement);
        // Children that exist on the server but not on this device (added on another device) come here.
        (snap.children || []).forEach(sc => {
          const known = u.children.find(c => c.cloudId === sc.id || c.id === sc.id);
          // A child edited on another device (name, age): the server's copy, unless this device has an edit to send.
          if (known) { if (!known.editPending) { known.name = sc.name; known.age = sc.age; known.addedAt = Date.parse(sc.added_at) || known.addedAt; } return; }
          // This device's own child, uploaded but not acknowledged yet (the server keeps the device's id as local_id).
          const mine = sc.local_id && u.children.find(c => !c.cloudId && c.id === sc.local_id);
          if (mine) { mine.cloudId = sc.id; return; }
          u.children.push(Object.assign({}, sc.progress || {}, { id: sc.id, cloudId: sc.id, name: sc.name, age: sc.age, addedAt: Date.parse(sc.added_at) || Date.now() },
            { friend: (sc.progress || {}).friend || null, xp: (sc.progress || {}).xp || 0, stars: (sc.progress || {}).stars || 0, completed: (sc.progress || {}).completed || {}, mapSeen: (sc.progress || {}).mapSeen || {}, badges: (sc.progress || {}).badges || {}, badgeNew: (sc.progress || {}).badgeNew || {} }));
        });
        // A child removed on another device goes from this one too.
        const ids = new Set((snap.children || []).map(c => c.id));
        if (fam.status === 'active') u.children = u.children.filter(c => !c.cloudId || ids.has(c.cloudId));
      });
    } finally { applying = false; }
    if (fam.email && fam.email !== (user() || {}).email) { applying = true; try { Store.relinkEmail(fam.email); } finally { applying = false; } }
    if (fam.status === 'active') { await uploadNewChildren(); await syncAll(); }
  }

  // Children not on the server yet (added on this device while offline) are uploaded with all their progress.
  // One upload at a time: two at once (a refresh while "add a child" uploads) would add the same child twice.
  let uploading = null;
  const uploadNewChildren = () => uploading || (uploading = uploadEach().finally(() => { uploading = null; }));
  async function uploadEach() {
    const u = user(), tk = token(u);
    if (!u || !tk || !u.cloud || u.cloud.status !== 'active') return;
    for (const c of u.children.filter(x => !x.cloudId)) {
      const p = progressOf(c), sent = JSON.stringify(p), who = c.name + '|' + c.age;
      // local_id: the server answers a second upload of the same child (an answer lost on the way) with the first one.
      const r = await write('POST', '/children', { name: c.name, age: Math.max(3, Math.min(10, Number(c.age) || 3)), local_id: c.id, added_at: new Date(c.addedAt || Date.now()).toISOString(), progress: p }, tk);
      if (r.ok) {
        let here = false;
        applying = true;
        try {
          Store.updateUser(x => {
            const k = x.children.find(y => y.id === c.id);
            if (k) { k.cloudId = r.data.child.id; here = true; if (k.name + '|' + k.age === who) delete k.editPending; } // the upload had the latest name and age
            applyEntitlement(x, r.data.entitlement);
          });
        } finally { applying = false; }
        // Removed on this device while it was going up: remove it on the server too.
        if (!here) { write('DELETE', '/children/' + encodeURIComponent(r.data.child.id), undefined, tk); continue; }
        keepAnswer(c.id, sent, r.data.child.progress, Date.parse(r.data.child.progress_updated_at) || 0);
      } else if (r.code === 'children_max') break;
      else if (r.code === 'offline') return;
    }
  }

  // A parent PIN set on this device goes to the server (its salted hash only), once per tab and hash.
  let pinSent = null;
  async function pushPin(u, tk) {
    if (!u.pinDirty || !u.pin || pinSent === u.pin) return;
    const hash = pinSent = u.pin;
    const r = await write('PATCH', '/account', { pin_hash: hash }, tk);
    if (r.ok && r.data && r.data.family && r.data.family.pin_hash === hash) {
      applying = true;
      try { Store.updateUser(x => { if (x.pin === hash) delete x.pinDirty; }); } finally { applying = false; }
    } else if (r.code === 'offline') pinSent = null; // try again later
  }

  // Sends every child whose progress changed since the last sync, and keeps the merged copy the server returns.
  // One run at a time; a call during a run gets one more run right after it (so nothing changed meanwhile is missed).
  let syncRun = null, syncNext = null;
  function syncAll() {
    if (!syncRun) return (syncRun = syncOnce().finally(() => { syncRun = null; }));
    return syncNext || (syncNext = syncRun.catch(() => {}).then(() => { syncNext = null; return syncAll(); }));
  }
  async function syncOnce() {
    const u = user(), tk = token(u);
    if (!u || !tk || !u.cloud || u.cloud.status !== 'active') return;
    await pushPin(u, tk);
    await pushEdits(tk);
    for (const id of u.children.filter(x => x.cloudId).map(x => x.id)) {
      const c = Store.getChild(id); // the child as it is now (an earlier request may have changed it)
      if (!c || !c.cloudId) continue;
      const p = progressOf(c), sig = JSON.stringify(p);
      if (sigs[c.id] === sig) continue;
      const r = await write('PUT', '/children/' + encodeURIComponent(c.cloudId) + '/progress', { progress: p, updated_at: new Date().toISOString() }, tk);
      if (r.ok) keepAnswer(c.id, sig, r.data.progress, Date.parse(r.data.progress_updated_at) || 0);
      else if (r.status === 404) { applying = true; try { Store.updateChild(c.id, x => { delete x.cloudId; }); } finally { applying = false; } }
      else if (r.code === 'offline') return; // try again later
    }
  }

  // A child's new name or age (Parents' area, Edit) goes to the server: PATCH /children/:id with what changed.
  async function pushEdits(tk) {
    for (const c of (user() || { children: [] }).children.filter(x => x.cloudId && x.editPending)) {
      const sent = JSON.stringify(c.editPending);
      const r = await write('PATCH', '/children/' + encodeURIComponent(c.cloudId), c.editPending, tk);
      if (r.code === 'offline') return; // try again later
      if (!r.ok && r.status !== 400) continue; // e.g. too many requests: next sync
      applying = true;
      try {
        Store.updateChild(c.id, x => {
          if (JSON.stringify(x.editPending) !== sent) return; // edited again meanwhile: that goes next
          delete x.editPending;
          // The age counts from the moment the server took it (the same day as this device's).
          if (r.ok && r.data && r.data.child && 'age' in JSON.parse(sent)) x.addedAt = Date.parse(r.data.child.added_at) || x.addedAt;
        });
      } finally { applying = false; }
    }
  }

  // A sync in 4 seconds (changes made close together go in one request).
  function soon() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => { uploadNewChildren().then(syncAll); }, 4000);
  }
  function changed() {
    if (applying || !on() || !token()) return;
    soon();
  }

  // Re-reads the account (entitlement, children from other devices). At start, every 3 hours, when the tab comes back.
  function refresh(force) {
    const u = user(), tk = token(u);
    if (!on() || !tk) return Promise.resolve();
    if (!force && u.cloud && u.cloud.checkedAt && Date.now() - u.cloud.checkedAt < 3 * 3600e3 && !refreshing) return syncAll();
    if (refreshing) return refreshing;
    refreshing = fresh(tk).then(r => (r && r.ok ? adopt(r.data) : null)).finally(() => { refreshing = null; });
    return refreshing;
  }
  // GET /family, asked once every change this device was sending has its answer. If a change went out while the GET was
  // on its way, its answer may be older than this device (e.g. without the child just added, or with the trial not
  // started yet), so it is asked again (a few times at most; after that the next refresh brings it).
  async function fresh(tk) {
    for (let i = 0; i < 4; i++) {
      if (uploading) await uploading.catch(() => {});
      if (writes.size) await Promise.allSettled([...writes]);
      const gen = writeGen;
      const r = await req('GET', '/family', undefined, tk);
      if (!r.ok || (gen === writeGen && !writes.size && !uploading)) return r;
    }
    return null;
  }

  // KidLock.setup (a family with children but no PIN on this device): is there a parent PIN made on another device?
  // Only the PIN is taken from the answer, and only when this device has none, so an answer older than this device's
  // own changes (a child being uploaded) can't undo anything; the rest comes with the next refresh.
  async function serverPin() {
    const tk = token();
    if (!on() || !tk) return;
    const r = await req('GET', '/family', undefined, tk);
    const hash = r.ok && r.data && r.data.family && r.data.family.pin_hash;
    if (!hash) return;
    applying = true;
    try { Store.updateUser(u => { if (!u.pin) { u.pin = hash; delete u.pinDirty; } }); } finally { applying = false; }
  }

  // ---- Account flows (each resolves to { ok, next?, code? }) ----
  const lang = () => (window.I18N && I18N.getLang()) || 'en';

  async function signup(name, email, password) {
    const local = Store.signup(name, email, password);
    if (local.error) return { ok: false, local: local.error };
    const r = await req('POST', '/auth/signup', { name, email, password, lang: lang(), terms_accepted: true, terms_version: Store.TERMS_VERSION });
    // Email first (owner, 2026-11-16): an account exists only once the server has it, so offline means "try again".
    if (!r.ok) { Store.removeLocalAccount(); return { ok: false, code: r.code, extra: r.extra }; }
    setCloud({ status: 'pending', email: email.trim().toLowerCase(), sentAt: Date.now() });
    return { ok: true, next: '#/check-email' };
  }

  async function login(email, password) {
    email = email.trim().toLowerCase();
    const r = await req('POST', '/auth/login', { email, password, client: window.Capacitor ? 'app' : 'web' });
    if (r.ok) {
      Store.importUser(r.data.family, password);
      setCloud({ token: r.data.token, status: 'active', email: r.data.family.email });
      await adopt(r.data);
      return { ok: true, next: '#/parent' };
    }
    if (r.code === 'email_not_verified') {
      if (Store.login(email, password).error) Store.importUser({ email, name: email.split('@')[0] }, password);
      setCloud({ status: 'pending', email });
      return { ok: true, next: '#/check-email' };
    }
    // Offline: only this device's copy of a confirmed online account opens (it syncs when the network is back).
    if (r.code === 'offline') {
      const known = Store.localAccount(email);
      if (!known || !known.cloud || known.cloud.status !== 'active' || Store.login(email, password).error) return { ok: false, code: 'offline' };
      return { ok: true, next: '#/parent', offline: true };
    }
    return { ok: false, code: r.code, extra: r.extra };
  }

  async function verify(opts) {
    const u = user();
    const body = opts.token ? { token: opts.token } : { email: opts.email || (u && u.cloud && u.cloud.email) || (u && u.email), code: String(opts.code || '').replace(/\D/g, '') };
    body.client = window.Capacitor ? 'app' : 'web';
    const r = await req('POST', '/auth/verify', body);
    // The link was used before (a second click, another browser, a mail scanner) and the email is confirmed: log in.
    if (opts.token && r.code === 'code_expired' && r.extra && r.extra.already_verified) return confirmedElsewhere(r.extra.email);
    if (!r.ok) return { ok: false, code: r.code, extra: r.extra };
    const fam = r.data.family;
    const here = user();
    // This device has the account (sign-up here, or the parent who asked for an email change): link it.
    const mine = here && ((here.cloud && here.cloud.familyId === fam.id) || here.email === fam.email || (here.cloud && here.cloud.email === fam.email) || (here.cloud && here.cloud.pendingEmail === fam.email));
    if (!mine) { // confirmed in a fresh browser or on another device: this browser has no password yet, so log in here
      req('POST', '/auth/logout', undefined, r.data.token); // the session the server just made isn't kept here
      return confirmedElsewhere(fam.email);
    }
    setCloud({ token: r.data.token, status: 'active', email: fam.email, sentAt: 0 });
    await adopt(r.data);
    return { ok: true, next: '#/parent' };
  }

  function confirmedElsewhere(email) {
    // A pending copy of this account on this device is confirmed now (so "Forgot password" stops calling it pending).
    if (email) { applying = true; try { Store.markLocalConfirmed(email); } finally { applying = false; } }
    return { ok: true, next: 'login', email: email || '' };
  }

  async function resend() {
    const u = user();
    const email = u && ((u.cloud && u.cloud.email) || u.email);
    if (!email) return { ok: false, code: 'generic' };
    const r = await req('POST', '/auth/resend', { email });
    if (r.ok) setCloud({ sentAt: Date.now() });
    return r.ok ? { ok: true } : { ok: false, code: r.code, extra: r.extra };
  }

  // "Wrong email? Change it" on "Check your email": the sign-up is sent again with the new address (the server keeps
  // no session for a pending account, so this is the only way). The unconfirmed old address is removed by the server
  // after 30 days. The password is checked on this device first.
  async function changePendingEmail(newEmail, password) {
    const u = user();
    if (!pending(u)) return { ok: false, code: 'generic' };
    newEmail = String(newEmail || '').trim().toLowerCase();
    if (!Store.checkParent(password)) return { ok: false, local: 'gate_wrong' };
    if (newEmail === ((u.cloud && u.cloud.email) || u.email)) return { ok: false, local: 'err_sameEmail' };
    if (Store.localAccount(newEmail)) return { ok: false, local: 'err_exists' };
    const r = await req('POST', '/auth/signup', { name: u.name, email: newEmail, password, lang: lang(), terms_accepted: true,
      terms_version: (u.termsAccepted && u.termsAccepted.version) || Store.TERMS_VERSION });
    if (!r.ok) return { ok: false, code: r.code, extra: r.extra };
    applying = true;
    try { Store.relinkEmail(newEmail); } finally { applying = false; }
    setCloud({ email: newEmail, sentAt: Date.now(), familyId: null });
    return { ok: true };
  }

  async function forgot(email) {
    const r = await req('POST', '/auth/forgot', { email: String(email || '').trim().toLowerCase() });
    // sent: 'reset' (the reset email) or 'verify' (a pending account: its confirmation email again); recent: nothing new was
    // sent, one went out a little earlier (3 an hour per account). No account: code account_not_found.
    return r.ok ? { ok: true, sent: r.data && r.data.sent, recent: !!r.data && r.data.status === 'recently_sent' } : { ok: false, code: r.code, extra: r.extra };
  }

  async function reset(opts) {
    const body = opts.token ? { token: opts.token, password: opts.password } : { email: String(opts.email || '').trim().toLowerCase(), code: String(opts.code || '').replace(/\D/g, ''), password: opts.password };
    const r = await req('POST', '/auth/reset', body);
    if (!r.ok) return { ok: false, code: r.code, extra: r.extra };
    // Every session ended on the server: this device logs out too (the new password works at the next log-in).
    const u = user();
    if (u && u.cloud && (opts.token || u.email === body.email)) { setCloud({ token: null }); Store.logout(); }
    return { ok: true };
  }

  async function logout() {
    const tk = token();
    if (tk) { req('POST', '/auth/logout', undefined, tk); setCloud({ token: null }); }
    Store.logout();
  }

  // Settings (each needs the current password on the server too).
  async function changePassword(current, next) {
    const r = await req('POST', '/account/password', { current, password: next }, token());
    if (r.ok) Store.setPassword(next);
    return r.ok ? { ok: true } : { ok: false, code: r.code, extra: r.extra };
  }
  async function changeEmail(email, password) {
    const r = await req('POST', '/account/email', { email, password }, token());
    if (r.ok) setCloud({ pendingEmail: r.data.pending_email });
    return r.ok ? { ok: true, pending: r.data.pending_email } : { ok: false, code: r.code, extra: r.extra };
  }
  // Deleting, step 1: the password only (nothing changes). The answer says what deleting will also do.
  async function deleteCheck(password) {
    const r = await req('DELETE', '/account', { password, check: true }, token());
    return r.ok ? { ok: true, paddle: !!r.data.paddle_subscription, play: !!r.data.play_subscription } : { ok: false, code: r.code, extra: r.extra };
  }
  // The final "Delete everything": the server first cancels a Paddle subscription now and removes the saved card;
  // if Paddle fails, the account is kept (cancel_failed / card_removal_failed). Google Play: the parent confirms.
  async function deleteAccount(password, playCancelled) {
    const r = await req('DELETE', '/account', Object.assign({ password }, playCancelled ? { play_cancelled: true } : {}), token());
    if (r.ok) Store.removeLocalAccount();
    return r.ok ? { ok: true } : { ok: false, code: r.code, extra: r.extra };
  }
  // Parents' feedback (owner, 2026-11-18): our own API instead of FormSubmit. { ok } or { ok: false, code, retryAfter }.
  async function feedback(rating, message) {
    const r = await req('POST', '/feedback', { rating: rating || null, message: message || '', lang: lang() }, token());
    return r.ok ? { ok: true } : { ok: false, code: r.code, retryAfter: r.extra && r.extra.retry_after };
  }
  async function exportData() {
    const r = await req('GET', '/account/export', undefined, token());
    return r.ok ? r.data : null;
  }
  // "Manage subscription": a fresh Paddle customer portal link for this family (the server picks the customer).
  async function portal() {
    const r = await req('POST', '/billing/portal', undefined, token());
    return r.ok ? { ok: true, url: r.data.url } : { ok: false, code: r.code, extra: r.extra };
  }
  // Settings → Subscription (owner, 2026-11-15): cancel at the end of the paid period, undo that, or a Paddle
  // transaction to replace the card (the website opens it with Paddle.Checkout.open). The server finds the
  // subscription from the family's own record; the answer is the new entitlement, mirrored at once.
  async function billing(path) {
    const r = await write('POST', '/billing/' + path, undefined, token());
    if (!r.ok) return { ok: false, code: r.code, extra: r.extra };
    if (r.data && r.data.entitlement) {
      applying = true;
      try { Store.updateUser(u => applyEntitlement(u, r.data.entitlement)); } finally { applying = false; }
    }
    return Object.assign({ ok: true }, r.data);
  }
  const cancelSubscription = () => billing('cancel');
  const resumeSubscription = () => billing('resume');
  const paymentMethod = () => billing('payment-method');
  // The server's subscription details (plan, renewal or end date, card brand + last 4), or null.
  const subscription = u => { u = u || user(); return (u && u.cloud && u.cloud.entitlement && u.cloud.entitlement.subscription) || null; };
  function updateAccount(patch) { const tk = token(); if (tk) write('PATCH', '/account', patch, tk); }
  function removeChild(child) {
    const tk = token();
    if (tk && child && child.cloudId) write('DELETE', '/children/' + encodeURIComponent(child.cloudId), undefined, tk);
  }

  // ---- Launch-test counts: what children open (content id + premium flag; no child data leaves) ----
  function premiumOf(kind, id) {
    const L = window.IK_CONFIG && IK_CONFIG.limits;
    if (!L || !L.enabled) return false;
    if (kind === 'level') return L.maxLevel != null && Number(String(id).split(':')[1]) >= L.maxLevel;
    if (kind === 'video') return Array.isArray(L.videos) && !L.videos.includes(id);
    return false;
  }
  function track(kind, id, childId) {
    if (!on() || !token()) return;
    const u = user(), c = u && u.children.find(x => x.id === childId);
    events.push({ kind, id: String(id), premium: premiumOf(kind, id), child_id: c && c.cloudId });
    clearTimeout(eventTimer);
    eventTimer = setTimeout(flushEvents, 20000);
  }
  async function flushEvents() {
    const tk = token();
    if (!tk || !events.length) return;
    const byChild = {};
    events.splice(0).forEach(e => { (byChild[e.child_id || ''] = byChild[e.child_id || ''] || []).push({ kind: e.kind, id: e.id, premium: e.premium }); });
    for (const [cid, items] of Object.entries(byChild)) await req('POST', '/events', Object.assign({ items: items.slice(0, 50) }, cid ? { child_id: cid } : {}), tk);
  }

  // The pending account is waiting for its email (only "Check your email" opens).
  const pending = u => { u = u || user(); return !!(on() && u && u.cloud && u.cloud.status === 'pending'); };
  // "Forgot password": what THIS device knows about an email's account, signed in or not. Only local data, no request,
  // so it reveals nothing about which emails have online accounts. 'pending' = waiting for its email confirmation (the
  // server then sends the confirmation email again, not a reset); null = the normal reset email.
  function localState(email) {
    const u = on() && Store.localAccount(email);
    return u && u.cloud && u.cloud.status === 'pending' ? 'pending' : null;
  }

  if (on()) {
    // Start fresh (owner, 2026-11-17): device-only accounts from before online accounts are cleared, never moved.
    Store.clearDeviceAccounts();
    try { localStorage.removeItem('ik_device_trial'); } catch (e) { /* ignore */ }
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { flushEvents(); syncAll(); } else refresh(false);
    });
    setTimeout(() => refresh(true), 300);
  }

  // Right after the parent adds a child: upload it now, so the server can start the free week straight away.
  const uploadNow = () => uploadNewChildren().then(syncAll);

  window.Cloud = { on, apiBase: base, uploadNow, changed, refresh, serverPin, adopt, signup, login, verify, resend, changePendingEmail, forgot, reset, logout,
    changePassword, changeEmail, deleteCheck, deleteAccount, exportData, feedback, portal, cancelSubscription, resumeSubscription, paymentMethod, subscription, updateAccount, removeChild, track, flushEvents, syncAll,
    pending, localState, errKey };
})();
