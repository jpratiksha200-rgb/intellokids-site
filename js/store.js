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
  }

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

  // ---- Free week ----
  // Every new parent account gets full access for TRIAL_DAYS days, no payment details needed.
  // Nothing is charged automatically; after it ends the parent chooses a plan to continue.
  // NOTE: this runs in the browser for now; when cloud accounts launch, the server enforces it
  // (subscriptions table: trialEndsAt), so a new browser can't restart the free week.
  const DAY_MS = 864e5;
  const trialDays = () => (window.IK_CONFIG && IK_CONFIG.paddle && IK_CONFIG.paddle.trialDays) || 7;
  function newTrial() { const now = Date.now(); return { startedAt: now, endsAt: now + trialDays() * DAY_MS }; }
  // Shared test login (works only in payment test mode; see login()).
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
        termsAccepted: { version: TERMS_VERSION, at: Date.now() }, trial: newTrial() };
      db.session = email;
      save(db);
      return { ok: true };
    },

    login(email, password) {
      const db = load();
      email = email.trim().toLowerCase();
      // TEST ACCOUNT: only while payments are in test mode (no Paddle key in config.js), so it can
      // never be used to skip paying in production. It is created fresh in this browser on first login.
      const testMode = !(window.IK_CONFIG && IK_CONFIG.paddle && IK_CONFIG.paddle.clientToken);
      if (testMode && email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password && !db.users[email]) {
        const now = Date.now(), day = 864e5;
        const hist = Array.from({ length: 14 }, (_, k) => ({ t: now - (k % 5) * day - k * 3600e3, key: 'tiny:' + (k % 9), game: ['shapes', 'colours', 'counting', 'sorter', 'bigsmall', 'memory', 'quiz'][k % 7], stars: 1 + ((k * 2) % 3), ms: 45000 + k * 4000, answers: 5, mistakes: k % 3 }));
        db.users[email] = { name: 'Test Parent', email, pass: hashPassword(password), createdAt: now,
          subscription: { plan: 'yearly', status: 'active', since: now, test: true },
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
      // Accounts created before the free week existed (and never paid) get their free week now.
      if (!u.subscription && !u.trial) u.trial = newTrial();
      db.session = email; save(db);
      return { ok: true };
    },

    logout() { const db = load(); db.session = null; save(db); },

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
      Object.keys(u).forEach(k => { if (k !== 'pass' && k !== 'children') account[k] = u[k]; });
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
    addChild(name, age) {
      let child = null;
      this.updateUser(u => {
        if ((u.children || []).length >= this.maxChildren()) return;
        child = {
          id: uid(), name: name.trim(), age: Number(age), addedAt: Date.now(),
          friend: null, xp: 0, stars: 0, completed: {}, mapSeen: {}, badges: {}, badgeNew: {}
        };
        u.children.push(child);
      });
      return child;
    },

    removeChild(id) { this.updateUser(u => { u.children = u.children.filter(c => c.id !== id); }); },

    getChild(id) {
      const u = this.currentUser();
      return u ? u.children.find(c => c.id === id) || null : null;
    },

    updateChild(id, fn) {
      let out = null;
      this.updateUser(u => { const c = u.children.find(x => x.id === id); if (c) { fn(c); out = c; } });
      return out;
    },

    // Paid access: an active (or Paddle free-trial) subscription is required to use IntelloKids.
    // Access = an active (or Paddle-trialing) subscription, or a free week that hasn't ended yet.
    hasPaid(u) { u = u || this.currentUser(); return !!(u && u.subscription && ['active', 'trialing'].includes(u.subscription.status)); },
    trialInfo(u) {
      u = u || this.currentUser();
      if (!u || !u.trial) return { active: false, ended: false, daysLeft: 0, had: false };
      const left = u.trial.endsAt - Date.now();
      return { active: left > 0, ended: left <= 0, daysLeft: Math.max(0, Math.ceil(left / DAY_MS)), endsAt: u.trial.endsAt, had: true };
    },
    // While payments are switched off (IK_CONFIG.payments.enabled = false), every family has full access.
    paymentsOn() { return !!(window.IK_CONFIG && IK_CONFIG.payments && IK_CONFIG.payments.enabled); },
    hasAccess(u) { u = u || this.currentUser(); if (!this.paymentsOn()) return !!u; return this.hasPaid(u) || this.trialInfo(u).active; },

    setSubscription(plan) { this.updateUser(u => { u.subscription = { plan, status: 'active', since: Date.now() }; }); },

    // ---- What's open for now (IK_CONFIG.limits) ----
    // Returns the limits that apply to this parent, or null when everything is open. A subscription only
    // counts while payments are switched on, so the test account and old test-mode payments get the limits too.
    limits(u) {
      const L = window.IK_CONFIG && IK_CONFIG.limits;
      if (!L || !L.enabled) return null;
      u = u || this.currentUser();
      return this.paymentsOn() && this.hasPaid(u) ? null : L;
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

  const TERMS_VERSION = '2026-11-08.4'; // .3: payment, pricing and refund terms removed (payments off); .4: Talk to Brainy added
  Store.TERMS_VERSION = TERMS_VERSION;

  window.Store = Store;
})();
