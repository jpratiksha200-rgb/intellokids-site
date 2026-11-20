/* IntelloKids local data store.
 * DEMO ONLY: everything is saved in this browser's localStorage. A real backend
 * (server + database + secure login) will replace this before launch. */
(function () {
  const KEY = 'intellokids_db_v1';
  let memory = null; // fallback if localStorage is unavailable

  function blank() { return { lang: null, session: null, users: {} }; }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign(blank(), JSON.parse(raw)) : (memory || blank());
    } catch (e) { return memory || blank(); }
  }

  function save(db) {
    memory = db;
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* ignore */ }
    // Online accounts (js/cloud.js, only when IK_CONFIG.backend.enabled): something changed, sync it soon.
    if (window.Cloud && Cloud.changed) Cloud.changed();
  }
  // True while this account is linked to (or waiting to be linked to) an online account: the server then decides
  // the trial and paid access, never this browser (IK_CONFIG.backend, docs/BACKEND.md).
  const online = u => !!(u && u.cloud && window.Cloud && Cloud.on());

  // ---- Password protection ----
  // Passwords are never stored. We keep a salted, slow SHA-256 hash ("s2$<salt>$<hash>", 10,000 rounds).
  // Synchronous so it also works from file:// and in older WebViews (crypto.subtle needs HTTPS).
  // When cloud accounts launch, sign-in moves to Cognito and no password reaches this code at all.
  function sha256(str) {
    const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    const bytes = unescape(encodeURIComponent(str)).split('').map(c => c.charCodeAt(0));
    const len = bytes.length * 8;
    bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
    for (let i = 7; i >= 0; i--) bytes.push(i > 3 ? 0 : (len >>> (i * 8)) & 0xff);
    let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const rotr = (x, n) => (x >>> n) | (x << (32 - n)), W = new Array(64);
    for (let o = 0; o < bytes.length; o += 64) {
      for (let i = 0; i < 16; i++) W[i] = (bytes[o + i * 4] << 24) | (bytes[o + i * 4 + 1] << 16) | (bytes[o + i * 4 + 2] << 8) | bytes[o + i * 4 + 3];
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3), s1 = rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
        const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H = H.map((v, i) => (v + [a, b, c, d, e, f, g, h][i]) | 0);
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('');
  }
  function newSalt() {
    const a = new Uint8Array(16);
    (window.crypto && crypto.getRandomValues) ? crypto.getRandomValues(a) : a.forEach((_, i) => { a[i] = Math.floor(Math.random() * 256); });
    return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
  }
  function hashPassword(password, salt) {
    salt = salt || newSalt();
    let h = sha256(salt + ':' + password);
    for (let i = 0; i < 10000; i++) h = sha256(h + salt);
    return 's2$' + salt + '$' + h;
  }
  // Old accounts used a weak demo hash; they are upgraded the next time the parent logs in.
  function legacyHash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return 'h' + (h >>> 0).toString(36);
  }
  function checkPassword(password, stored) {
    if (typeof stored !== 'string') return false;
    if (stored.startsWith('s2$')) { const salt = stored.split('$')[1]; return hashPassword(password, salt) === stored; }
    return legacyHash(password) === stored;
  }

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  const XP_PER_LEVEL = 30;

  // ---- 7-day free trial (owner, 2026-11-13) ----
  // Every parent account gets ONE free trial of IK_CONFIG.trial.days days with everything open and no payment
  // details. It starts when the account has its first child (the moment a child can play), so the week isn't
  // used up before anyone plays. Accounts that already had children when this shipped start theirs the first
  // time they open the site (Store.ensureTrial). When it ends, the free limits (IK_CONFIG.limits) apply again;
  // nothing is ever charged and nothing the children earned is touched.
  // All trial logic lives in the "Free trial" block of Store below, and Store.trialState() is its single source
  // of truth: the UI only calls the Store.trial* functions. Today the state is u.trialStartedAt in this browser.
  // When the online-accounts backend lands (verified parent email, one trial per family recorded on the server),
  // only trialState() and startTrial() change to use the server's answer; no screen needs to change.
  const DAY_MS = 864e5;
  const trialConf = () => (window.IK_CONFIG && IK_CONFIG.trial) || {};
  // Shared test login. It works ONLY where Store.testModeOn() is true (see below): never on intellokids.com.
  const TEST_ACCOUNT = { email: 'test@intellokids.com', password: 'BrainyTest2026!' };

  const Store = {
    getLang() { return load().lang; },
    setLang(code) { const db = load(); db.lang = code; save(db); },

    currentUser() {
      const db = load();
      return db.session ? db.users[db.session] || null : null;
    },

    signup(name, email, password) {
      const db = load();
      email = email.trim().toLowerCase();
      if (db.users[email]) return { error: 'err_exists' };
      db.users[email] = { name: name.trim(), email, pass: hashPassword(password), children: [], subscription: null, createdAt: Date.now(),
        termsAccepted: { version: TERMS_VERSION, at: Date.now() } };
      db.session = email;
      save(db);
      return { ok: true };
    },

    login(email, password) {
      const db = load();
      email = email.trim().toLowerCase();
      // TEST ACCOUNT: only where Store.testModeOn() is true (local dev / test harnesses, never the live site
      // or the Android app). It is created fresh in this browser on first login.
      const testMode = this.testModeOn();
      if (testMode && email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password && !db.users[email]) {
        const now = Date.now(), day = 864e5;
        const hist = Array.from({ length: 14 }, (_, k) => ({ t: now - (k % 5) * day - k * 3600e3, key: 'tiny:' + (k % 9), game: ['shapes', 'colours', 'counting', 'sorter', 'bigsmall', 'memory', 'quiz'][k % 7], stars: 1 + ((k * 2) % 3), ms: 45000 + k * 4000, answers: 5, mistakes: k % 3 }));
        db.users[email] = { name: 'Test Parent', email, pass: hashPassword(password), createdAt: now,
          subscription: { plan: 'yearly', status: 'active', since: now, test: true }, // a fake paid plan: no trial UI
          termsAccepted: { version: TERMS_VERSION, at: now },
          children: [
            { id: 'test-mia', name: 'Mia', age: 4, addedAt: now, friend: { gender: 'girl', skin: 1, name: 'Luna' }, me: { gender: 'girl', skin: 1, shirt: 0 },
              xp: 70, stars: 26, completed: Object.fromEntries(Array.from({ length: 9 }, (_, k) => ['tiny:' + k, 1 + ((k * 2) % 3)])), mapSeen: {}, badges: {}, badgeNew: {}, history: hist,
              missed: { 'Tap the triangle!': { game: 'shapes', n: 3, last: now }, 'How many can you count? (6 🍎)': { game: 'counting', n: 2, last: now } } },
            { id: 'test-leo', name: 'Leo', age: 8, addedAt: now, friend: null, xp: 0, stars: 0, completed: {}, mapSeen: {}, badges: {}, badgeNew: {} }
          ] };
        // Like a real child, Mia already has the stickers her past games earned (no NEW tag, no pop-up),
        // so they are never handed out later for nothing (sticker rule in js/stickers.js).
        if (window.Stickers && Stickers.seed) db.users[email].children.forEach(c => Stickers.seed(c));
      }
      const u = db.users[email];
      if (!u || !checkPassword(password, u.pass)) return { error: 'err_login' };
      if (!String(u.pass).startsWith('s2$')) u.pass = hashPassword(password); // upgrade an old weak hash
      db.session = email; save(db);
      return { ok: true };
    },

    logout() { const db = load(); db.session = null; delete db.lock; save(db); },

    // ---- Online accounts (js/cloud.js) ----
    // Used only once the server has confirmed something (a password, an email change, an account on a new device).
    isOnline(u) { return online(u || this.currentUser()); },
    // The password the server accepted becomes this device's one too (the parents' gate checks it here).
    setPassword(password) { this.updateUser(u => { u.pass = hashPassword(password); }); },
    // The server confirmed a new email address: move this device's account to it (keeps everything else).
    relinkEmail(newEmail) {
      const db = load(), u = db.session && db.users[db.session];
      newEmail = String(newEmail || '').trim().toLowerCase();
      if (!u || !newEmail || newEmail === u.email || db.users[newEmail]) return false;
      delete db.users[u.email]; u.email = newEmail; db.users[newEmail] = u; db.session = newEmail; save(db);
      return true;
    },
    // An online account signed in on a device that doesn't have it yet: a local copy (children come from the server).
    importUser(family, password) {
      const db = load(), email = String(family.email).toLowerCase();
      if (!db.users[email]) {
        db.users[email] = { name: family.name, email, pass: hashPassword(password), children: [], subscription: null, createdAt: Date.now(),
          termsAccepted: { version: family.terms_version || TERMS_VERSION, at: Date.now() } };
      } else db.users[email].pass = hashPassword(password);
      db.session = email; save(db);
      return db.users[email];
    },
    // The account this device keeps for an email, signed in or not (case-insensitive), or null. Read-only: the
    // "Forgot password" screen uses it to explain a device-only account without asking the server anything.
    localAccount(email) {
      const key = String(email || '').trim().toLowerCase();
      return (key && load().users[key]) || null;
    },
    // The server confirmed this email on this device while nobody was signed in: note it on the device's copy.
    markLocalConfirmed(email) {
      const db = load(), u = db.users[String(email || '').trim().toLowerCase()];
      if (!u || !u.cloud || u.cloud.status !== 'pending') return;
      u.cloud = Object.assign({}, u.cloud, { status: 'active', sentAt: 0 }); save(db);
    },
    // Online accounts only (Cloud.on, owner 2026-11-17: start fresh): every account kept in this browser that was
    // never linked to the server (made before online accounts, or the local test account) is removed, and signed out
    // if it was signed in. Copies of online accounts (confirmed or waiting for their email) stay.
    clearDeviceAccounts() {
      const db = load();
      const gone = Object.keys(db.users).filter(k => { const u = db.users[k]; return !u || !u.cloud || !(u.cloud.familyId || u.cloud.status === 'pending'); });
      if (!gone.length) return 0;
      gone.forEach(k => { delete db.users[k]; });
      if (db.session && !db.users[db.session]) db.session = null;
      save(db);
      return gone.length;
    },
    // Deletes this device's copy after the server deleted the account (no password check: the server did it).
    removeLocalAccount() { const db = load(), u = db.session && db.users[db.session]; if (u) delete db.users[u.email]; db.session = null; save(db); },

    // ---- Account settings (Settings page, #/settings) ----
    // Each returns { ok: true } or { error: '<i18n key>' }. The current password is asked for every change that
    // matters (email, password, deleting the account), as on any account page.
    updateName(name) {
      name = String(name || '').trim().slice(0, 60);
      if (!name) return { error: 'err_required' };
      this.updateUser(u => { u.name = name; });
      return { ok: true };
    },
    changeEmail(newEmail, password) {
      const db = load(), u = db.session && db.users[db.session];
      if (!u) return { error: 'err_login' };
      newEmail = String(newEmail || '').trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(newEmail)) return { error: 'err_email' };
      if (!checkPassword(password, u.pass)) return { error: 'err_currentPassword' };
      if (newEmail === u.email) return { error: 'err_sameEmail' };
      if (db.users[newEmail]) return { error: 'err_exists' };
      delete db.users[u.email];
      u.email = newEmail; db.users[newEmail] = u; db.session = newEmail;
      save(db);
      return { ok: true };
    },
    changePassword(current, next) {
      const db = load(), u = db.session && db.users[db.session];
      if (!u) return { error: 'err_login' };
      if (!checkPassword(current, u.pass)) return { error: 'err_currentPassword' };
      if (String(next || '').length < 6) return { error: 'err_password' };
      u.pass = hashPassword(next);
      save(db);
      return { ok: true };
    },
    // Everything kept about the family, for "Download my data" (no password hash).
    exportData() {
      const u = this.currentUser();
      if (!u) return null;
      const account = {};
      Object.keys(u).forEach(k => { if (!['pass', 'pin', 'pinDirty', 'children'].includes(k)) account[k] = u[k]; });
      return { app: 'IntelloKids', exportedAt: new Date().toISOString(), language: load().lang, account, children: u.children || [] };
    },
    // Deletes the parent and all children from this device, then logs out.
    deleteAccount(password) {
      const db = load(), u = db.session && db.users[db.session];
      if (!u) return { error: 'err_login' };
      if (!checkPassword(password, u.pass)) return { error: 'err_currentPassword' };
      delete db.users[u.email];
      db.session = null;
      save(db);
      return { ok: true };
    },

    updateUser(fn) {
      const db = load();
      const u = db.session && db.users[db.session];
      if (!u) return null;
      fn(u); save(db);
      return u;
    },

    // Most children one account can hold (IK_CONFIG.maxChildren, owner 2026-11-12). Accounts that already have
    // more keep every child (nobody is removed or hidden); they just can't add another until they're under it.
    maxChildren() { const n = Number(window.IK_CONFIG && IK_CONFIG.maxChildren); return n > 0 ? n : Infinity; },
    canAddChild(u) { u = u || this.currentUser(); return !!u && (u.children || []).length < this.maxChildren(); },

    // Returns the new child, or null when the account is full (or nobody is logged in).
    // consent (owner, 2026-11-19): the parent's ticked consent for this child, { at, version } (TERMS_VERSION). It lives on
    // the child record, so it syncs with the child's progress like everything else (no extra server field).
    addChild(name, age, consent) {
      let child = null;
      this.updateUser(u => {
        if ((u.children || []).length >= this.maxChildren()) return;
        child = {
          id: uid(), name: name.trim(), age: Number(age), addedAt: Date.now(),
          friend: null, xp: 0, stars: 0, completed: {}, mapSeen: {}, badges: {}, badgeNew: {}
        };
        if (consent) child.consent = consent;
        u.children.push(child);
        this.startTrial(u);
      });
      return child;
    },

    // A consent record for now (the parent ticked the box).
    consentNow() { return { at: Date.now(), version: TERMS_VERSION }; },
    hasConsent(c) { return !!(c && c.consent && c.consent.at); },
    giveConsent(id) { this.updateChild(id, c => { c.consent = this.consentNow(); }); },

    removeChild(id) { this.updateUser(u => { u.children = u.children.filter(c => c.id !== id); }); },

    // Edit a child (owner, 2026-11-20): a new name and/or age. A new age counts from today (as when the child was added,
    // and as the server does), so the age group and the content follow at once; progress, consent and stickers stay.
    // Online accounts keep what changed in `editPending` until the server has it (js/cloud.js sends it). Returns the child.
    editChild(id, name, age) {
      name = String(name || '').trim(); age = Number(age);
      return this.updateChild(id, c => {
        const p = Object.assign({}, c.editPending);
        if (name && name !== c.name) { c.name = name; p.name = name; }
        if (age && age !== this.currentAge(c)) { c.age = age; c.addedAt = Date.now(); p.age = age; }
        if (Object.keys(p).length && online(this.currentUser())) c.editPending = p;
      });
    },

    getChild(id) {
      const u = this.currentUser();
      return u ? u.children.find(c => c.id === id) || null : null;
    },

    updateChild(id, fn) {
      let out = null;
      this.updateUser(u => { const c = u.children.find(x => x.id === id); if (c) { fn(c); out = c; } });
      return out;
    },

    // Paid: an active subscription. Only one made through the payment provider (source 'paddle') or the shared
    // test account's fake plan (test mode only, see login) counts. Old demo "test payments" from before
    // payments were paused (no source) don't, so those families get the trial like everyone else.
    hasPaid(u) {
      u = u || this.currentUser();
      const s = u && u.subscription;
      if (!s || !['active', 'trialing'].includes(s.status)) return false;
      return s.source === 'paddle' || s.source === 'play' || (s.test === true && this.testModeOn());
    },
    // SECURITY: the single switch for the shared test account (TEST_ACCOUNT) and its fake paid plan.
    // TEST_ACCOUNT's password is in this public file, so it must never work where real families use the app.
    // True only when ALL hold: (1) no Paddle client token in config.js (payment test mode); (2) a local copy:
    // IK_CONFIG.devMode === true (set only by the owner's local dev-overrides.js, never in git), a file:// page,
    // or host localhost / 127.0.0.1; (3) not the native Android app (Capacitor serves it from https://localhost).
    // So on intellokids.com / www it is always false: the login is refused and an old test user is not paid.
    testModeOn() {
      const c = window.IK_CONFIG || {};
      if (c.paddle && c.paddle.clientToken) return false;
      const cap = window.Capacitor;
      if (cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) return false;
      const loc = window.location || {};
      return c.devMode === true || loc.protocol === 'file:' || loc.hostname === 'localhost' || loc.hostname === '127.0.0.1';
    },
    // Switches (config.js). payments.enabled: the public Pricing and Refund pages and the footer links (it no longer
    // locks anyone out). payments.live: Subscribe opens Paddle's checkout. trial.enabled: the 7-day trial, the
    // parents' plans screen and the subscribe wording. plansOn: the plans screen exists (trial or payments on).
    paymentsOn() { return !!(window.IK_CONFIG && IK_CONFIG.payments && IK_CONFIG.payments.enabled); },
    plansOn() { return this.trialOn() || this.paymentsOn(); },

    // ---- Free trial (single source of truth: trialState) ----
    trialOn() { return !!trialConf().enabled; },
    trialDays() { return Number(trialConf().days) > 0 ? Number(trialConf().days) : 7; },
    // Everything about one account's trial:
    //   started   the trial has begun (it never starts again, even after removing every child)
    //   active    everything is open now          ended  it is over (and no subscription)
    //   endsAt    when it ends (ms)                daysLeft  calendar days to endsAt: 7 on the first day, 1 = tomorrow, 0 = today
    //   msLeft    time left (ms)                   countdown { days } while a day or more is left, then { hours } (top strip)
    //   soon      the last reminderDays days (the amber strip and the reminder pop-up)
    // Subscribers never see a trial: active and ended are both false for them.
    trialState(u) {
      u = u || this.currentUser();
      // Email first (owner, 2026-11-16): an online account waiting for its email confirmation has no trial yet. The
      // server's trial applies once it's confirmed.
      const waiting = online(u) && u.cloud.status === 'pending';
      const startedAt = (!waiting && u && u.trialStartedAt) || 0;
      const endsAt = startedAt ? startedAt + this.trialDays() * DAY_MS : 0;
      const counts = !!u && this.trialOn() && !!startedAt && !this.hasPaid(u), now = Date.now();
      const active = counts && now < endsAt, ended = counts && now >= endsAt;
      const day = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
      const msLeft = active ? endsAt - now : 0;
      const countdown = !active ? null : msLeft >= DAY_MS ? { days: Math.ceil(msLeft / DAY_MS) } : { hours: Math.max(1, Math.ceil(msLeft / 36e5)) };
      const daysLeft = active ? Math.max(0, Math.round((day(endsAt) - day(now)) / DAY_MS)) : 0;
      const soon = active && (countdown.hours || countdown.days <= (Number(trialConf().reminderDays) || 2));
      return { started: !!startedAt, startedAt, endsAt, active, ended, daysLeft, msLeft, countdown, soon };
    },
    trialStarted(u) { return this.trialState(u).started; },
    trialActive(u) { return this.trialState(u).active; },
    trialEnded(u) { return this.trialState(u).ended; },
    trialDaysLeft(u) { return this.trialState(u).daysLeft; },
    trialEndsAt(u) { return this.trialState(u).endsAt; },
    // Starts the trial on this account object (inside updateUser) once it has a child. Returns true if it started.
    startTrial(u) {
      if (online(u)) return false; // online accounts: the server starts the trial (Cloud.applyEntitlement)
      if (!this.trialOn() || !u || u.trialStartedAt || this.hasPaid(u) || !(u.children || []).length) return false;
      u.trialStartedAt = Date.now();
      return true;
    },
    // Called on every page: accounts from before the trial (and new ones) get theirs once they have a child.
    ensureTrial() {
      const u = this.currentUser();
      if (!u || online(u) || u.trialStartedAt || !this.trialOn() || this.hasPaid(u) || !(u.children || []).length) return false;
      this.updateUser(x => this.startTrial(x));
      return true;
    },
    // One-time notes (the parents' reminder and "trial ended" pop-ups). The child's "free week is over" note is
    // kept on the child (c.trialOverSeen), so every child sees it once.
    trialSeen(key, u) { u = u || this.currentUser(); return !!(u && u.trialSeen && u.trialSeen[key]); },
    markTrialSeen(key) { this.updateUser(u => { u.trialSeen = Object.assign({}, u.trialSeen, { [key]: Date.now() }); }); },
    // Parent gate: the password of the parent who is signed in (salted hash check; nothing is stored).
    checkParent(password) { const u = this.currentUser(); return !!u && checkPassword(String(password || ''), u.pass); },

    // ---- Parent PIN and kid lock (owner, 2026-11-18; screens in js/pin.js) ----
    // One 4-digit PIN per family, kept only as a salted hash (u.pin, made like a password hash; never the PIN). Online
    // accounts sync that hash with the family (Cloud), so the PIN works on every device, offline too. u.pinDirty: set
    // here and not yet confirmed by the server.
    // The lock is this device's only (db.lock = { kid }): once a child's playground opens, it stays locked to that
    // child, also after a reload or a closed tab, until the PIN (or the parent's password) opens it. Logging out ends it.
    hasPin(u) { u = u || this.currentUser(); return !!(u && u.pin); },
    setPin(pin) {
      if (!/^\d{4}$/.test(String(pin))) return false;
      return !!this.updateUser(u => { u.pin = hashPassword(String(pin)); u.pinDirty = true; });
    },
    // A typed PIN: { ok: true }, or { wait: ms } (0 = try again now). After 5 wrong tries the pad waits 30 s, then
    // twice as long after each further wrong try (at most 15 min). The tries are kept, so a reload doesn't reset them.
    tryPin(pin) {
      const db = load(), u = db.session && db.users[db.session], now = Date.now();
      const T = db.pinTries || { n: 0, until: 0 };
      if (T.until > now) return { wait: T.until - now };
      if (u && u.pin && checkPassword(String(pin), u.pin)) { delete db.pinTries; save(db); return { ok: true }; }
      T.n++; T.until = T.n >= 5 ? now + Math.min(15 * 60e3, 30e3 * Math.pow(2, T.n - 5)) : 0;
      db.pinTries = T; save(db);
      return { wait: T.until ? T.until - now : 0 };
    },
    pinWait() { const T = load().pinTries; return T && T.until > Date.now() ? T.until - Date.now() : 0; },
    // The child this device is locked to (one of the signed-in parent's children), or null.
    lockedKid() {
      const db = load(), u = db.session && db.users[db.session], id = db.lock && db.lock.kid;
      return id && u && (u.children || []).some(c => c.id === id) ? id : null;
    },
    lockTo(kidId) { const db = load(); db.lock = { kid: kidId }; save(db); },
    // The right PIN or the parent's password: the lock and the wrong tries are cleared.
    unlock() { const db = load(); if (!db.lock && !db.pinTries) return; delete db.lock; delete db.pinTries; save(db); },

    // Nobody is ever locked out of the account: after the trial, families keep the free part (owner, 2026-11-13).
    hasAccess(u) { u = u || this.currentUser(); return !!u; },

    // ---- Paddle purchase (INTERIM, until the server exists) ----
    // Called ONLY from Paddle.js's real "checkout.completed" event for a checkout the plans screen opened (app.js).
    // It saves the subscription on the signed-in parent's account in this browser, and Store.hasPaid() then opens
    // everything. Nothing else may unlock: no URL, no button, no other event.
    // REPLACED LATER: when the Cloudflare server goes live (branch accounts-online), Paddle's signed webhooks
    // (subscription.created / updated / canceled) will record and end subscriptions on the server, and this
    // function goes. Until then a cancellation or a failed renewal is not seen here (the family stays unlocked on
    // this device), and the subscription doesn't follow the parent to another device.
    //   data: the event's data ({ transaction_id, customer: { id, email }, items: [{ price_id, billing_cycle }],
    //         custom_data, ... }). plan: 'monthly' | 'yearly'. Returns true if it was saved.
    recordPaddlePurchase(plan, data) {
      const P = (window.IK_CONFIG && IK_CONFIG.paddle) || {}, prices = P.prices || {};
      if (!data || !['monthly', 'yearly'].includes(plan) || !prices[plan]) return false;
      const item = (data.items || []).find(i => i && i.price_id === prices[plan]);
      if (!item || !/^txn_/.test(String(data.transaction_id || ''))) return false;
      const u = this.currentUser();
      const account = data.custom_data && data.custom_data.account;
      if (!u || (account && account !== u.email)) return false;
      const period = data.billing_period || item.billing_period || null;   // not in today's event; kept if Paddle adds it
      this.updateUser(x => {
        x.subscription = {
          source: 'paddle', status: 'active', plan, priceId: item.price_id,
          transactionId: data.transaction_id, checkoutId: data.id || null,
          customerId: (data.customer && data.customer.id) || null,
          subscriptionId: data.subscription_id || null,                 // only the webhooks give it today
          billingCycle: item.billing_cycle || null,
          since: Date.now(), renewsAt: period && period.ends_at ? Date.parse(period.ends_at) || null : null
        };
      });
      return true;
    },

    // Inside the Android app (Capacitor)? Then Paddle is never loaded and no Subscribe or Pricing link is shown:
    // Google Play's payments policy (digital content bought in the app must use Play Billing, and the app may not
    // point to another way to pay). ik-native.js also marks the page with the "ik-app" class.
    inApp() {
      const C = window.Capacitor || (window.capacitorExports && capacitorExports.Capacitor);
      try { if (C && C.isNativePlatform && C.isNativePlatform()) return true; } catch (e) { /* ignore */ }
      return document.documentElement.classList.contains('ik-app');
    },

    // ---- What's open for now (IK_CONFIG.limits) ----
    // Returns the limits that apply to this parent, or null when everything is open: during the free trial,
    // and for subscribers (a subscription only counts while plans are switched on).
    limits(u) {
      const L = window.IK_CONFIG && IK_CONFIG.limits;
      if (!L || !L.enabled) return null;
      u = u || this.currentUser();
      if (this.trialActive(u)) return null;
      return this.plansOn() && this.hasPaid(u) ? null : L;
    },
    levelOpen(i, u) { const L = this.limits(u); return !L || L.maxLevel == null || i < L.maxLevel; }, // i counts from 0
    videoOpen(id, u) { const L = this.limits(u); return !L || !Array.isArray(L.videos) || L.videos.includes(id); },
    // Colouring: the pictures in limits.colouring (ids, or a number = the first N classics), plus the first
    // limits.colouringPerAge pictures of every age's pack (js/colouring/age3.js … age10.js).
    pictureOpen(id, u) {
      const L = this.limits(u);
      if (!L || L.colouring == null) return true;
      const classics = window.Colouring ? Object.keys(Colouring.PICS) : [];
      const listed = Array.isArray(L.colouring) ? L.colouring : classics.slice(0, Math.max(0, L.colouring));
      if (listed.includes(id)) return true;
      const i = window.Colouring ? Colouring.packIndex(id) : -1;
      return i > -1 && i < (L.colouringPerAge || 0);
    },
    // How many colouring pictures are open in all (for the parents' note), or null when all are.
    openPictureCount(u) {
      const L = this.limits(u);
      if (!L || L.colouring == null) return null;
      const listed = Array.isArray(L.colouring) ? L.colouring.length : Math.max(0, L.colouring);
      return listed + (L.colouringPerAge || 0) * (window.Colouring ? Colouring.AGES.length : 8);
    },
    chatOpen(u) { const L = this.limits(u); return !L || L.chat !== false; },
    // Quizzes finished in the Quiz section. Children who played before the counter existed are counted from their history.
    quizCount(c) { return typeof c.quizCount === 'number' ? c.quizCount : (c.history || []).filter(h => /^quiz:/.test(h.key)).length; },
    quizzesLeft(c, u) { const L = this.limits(u); return !L || L.quizzes == null ? Infinity : Math.max(0, L.quizzes - this.quizCount(c)); },

    // ---- Child helpers ----
    // The child's age increases automatically each year after the parent added them,
    // so the virtual friend "grows up" together with the child.
    currentAge(c) {
      const years = Math.floor((Date.now() - c.addedAt) / (365.25 * 24 * 3600 * 1000));
      return Math.min(12, c.age + years);
    },
    ageGroup(c) {
      const a = this.currentAge(c);
      return a <= 4 ? 'tiny' : a <= 6 ? 'junior' : 'explorer';
    },
    level(c) { return 1 + Math.floor(c.xp / XP_PER_LEVEL); },
    levelProgress(c) { return (c.xp % XP_PER_LEVEL) / XP_PER_LEVEL; },

    acceptTerms() { this.updateUser(u => { u.termsAccepted = { version: TERMS_VERSION, at: Date.now() }; }); },
    needsTerms(u) { return !u.termsAccepted || u.termsAccepted.version !== TERMS_VERSION; },
    TERMS_VERSION: null, // set below

    // Lifetime counts of what the child has COMPLETED (finished games, right answers in them, stars won,
    // 3-star and no-mistake games, finished pictures). Stickers count from these, so they only grow when
    // something is finished, never on login, opening a page, starting or leaving a game (owner, 2026-11-10).
    // Saves from before this have them worked out once from the game history.
    tally(c) {
      if (c.tally) return c.tally;
      const done = (c.history || []).filter(h => h.stars > 0);
      return {
        games: done.length, answers: done.reduce((a, h) => a + (h.answers || 0), 0), stars: done.reduce((a, h) => a + h.stars, 0),
        three: done.filter(h => h.stars === 3).length, perfect: done.filter(h => h.answers > 0 && !h.mistakes).length,
        pictures: Object.values(c.drawings || {}).filter(d => d && d.done).length
      };
    },
    addTally(childId, key, n) {
      this.updateChild(childId, c => { c.tally = Object.assign({}, this.tally(c)); c.tally[key] = (c.tally[key] || 0) + (n == null ? 1 : n); });
    },

    // Records a finished game. Returns info used for celebrations.
    // stats (optional): { game, ms, answers, mistakes, missed:{label:count} } for the parents' dashboard.
    recordResult(childId, nodeKey, stars, stats) {
      let result = {};
      this.updateChild(childId, c => {
        const quiz = /^quiz:/.test(nodeKey), quizzesBefore = quiz ? this.quizCount(c) : 0; // before history grows
        if (quiz) c.quizCount = quizzesBefore + 1;
        if (stars > 0) { // a finished game with a result (worked out from the history before this game is added)
          const T = c.tally = Object.assign({}, this.tally(c));
          T.games++; T.stars += stars; if (stars === 3) T.three++;
          if (stats) { T.answers += stats.answers || 0; if (stats.answers > 0 && !stats.mistakes) T.perfect++; }
        }
        if (stats) {
          c.history = c.history || [];
          c.history.push({ t: Date.now(), key: nodeKey, game: stats.game, stars, ms: stats.ms, answers: stats.answers, mistakes: stats.mistakes });
          if (c.history.length > 500) c.history.splice(0, c.history.length - 500);
          c.missed = c.missed || {};
          Object.entries(stats.missed || {}).forEach(([label, n]) => {
            const m = c.missed[label] || (c.missed[label] = { game: stats.game, n: 0, last: 0 });
            m.n += n; m.last = Date.now();
          });
          // Keep the 60 most recent mistake types.
          const keys = Object.keys(c.missed);
          if (keys.length > 60) keys.sort((a, b) => c.missed[a].last - c.missed[b].last).slice(0, keys.length - 60).forEach(k => delete c.missed[k]);
        }
        const before = this.level(c);
        const prevBest = c.completed[nodeKey] || 0;
        c.completed[nodeKey] = Math.max(prevBest, stars);
        // Full XP for new stars; a little XP for replays so practice still counts.
        const gained = Math.max(0, stars - prevBest) * 10 + (prevBest ? 2 : 0);
        c.xp += gained;
        c.stars += Math.max(0, stars - prevBest);
        // Replayed a level and beat the old score (for the "Never give up" sticker).
        if (prevBest && stars > prevBest) c.improved = (c.improved || 0) + 1;
        result = { levelUp: this.level(c) > before, level: this.level(c) };
      });
      return result;
    }
  };

  // .3: payment, pricing and refund terms removed (payments off); .4: Talk to Brainy added;
  // 2026-11-15.1: payment terms back for live payments with Paddle (Merchant of Record), refund policy, privacy on payments.
  const TERMS_VERSION = '2026-11-19.5'; // 2026-11-19.5: data retention (Privacy 2, 7, 11 and Data Security) and the fr/es legal pages; 2026-11-19.4: contact address help@intellokids.com; 2026-11-19.3: Data Security page shortened (no technical detail), Privacy trial-record wording; 2026-11-19.2: parental consent per child, the notice email and Privacy section 9; 2026-11-19.1: Privacy section 3: we keep the card type and last 4 digits (not the full number); 2026-11-18.3: the parent PIN (kid lock) in the Privacy Policy and Data Security; 2026-11-18.2: Privacy Policy: feedback goes to our own database and email, FormSubmit removed; 2026-11-18.1: no refunds after the 7-day free trial, cancel anytime (Refund Policy and Terms rewritten), no business address in the legal pages (owner); .2: online accounts (EU servers, providers, retention, anonymous visit counting); 2026-11-17.1: no refund guarantee of our own (refunds follow Paddle's Buyer Terms and the law), seller Intellokids Ltd
  Store.TERMS_VERSION = TERMS_VERSION;

  window.Store = Store;
})();
