/* IntelloKids app: routing, pages, adventure map and payments (Paddle on the website, never in the Android app). */
(function () {
  const app = document.getElementById('app');
  const topbar = document.getElementById('topbar');
  const esc = Art.esc;
  // Payments on (IK_CONFIG.payments.enabled): the public Pricing and Refund pages and their links (never in the app).
  const PAY = Store.paymentsOn();
  // The public Pricing page in the current language (static pages made by infra/build-seo.ps1).
  const pricingHref = () => Landing.pricingPath(I18N.getLang());
  // 7-day free trial and the parents' plans screen (IK_CONFIG.trial, owner 2026-11-13). Works while payments are off.
  const PLANS = Store.plansOn();
  // Online family accounts (IK_CONFIG.backend, js/cloud.js). Off: accounts stay on this device, as before.
  const CLOUD = !!(window.Cloud && Cloud.on());
  // Navigate. If we're already on that address the browser fires no "hashchange",
  // so redraw the page ourselves.
  const go = hash => {
    if (location.hash === hash || (hash === '#/' && location.hash === '')) render();
    else location.hash = hash;
  };
  let renderToken = 0;
  let greetedKid = null; // the child Brainy has said hello to since they came into the kid area (once per visit)
  let friendStickers = null; // { id, won, at }: stickers won by making the friend, revealed on the kid home right after

  // Adventure map: 100 levels per age group, split into 10 worlds of 10 levels.
  // Each level is [gameId, difficulty]. Level 10 of every world is a quiz.
  const LEVELS = 100, PER_WORLD = 10, WORLDS = LEVELS / PER_WORLD;
  // Games per age group. Different ages, different content.
  const POOLS = {
    tiny: ['shapes', 'colours', 'shadow', 'sorter', 'bigsmall', 'memory', 'puzzle', 'maze', 'counting', 'dots'],
    junior: ['memory', 'pattern', 'addition', 'odd', 'shapes', 'counting', 'bigsmall', 'maze', 'shadow', 'dots', 'clock', 'puzzle'],
    explorer: ['mathsrace', 'coding', 'pattern', 'memory', 'odd', 'addition', 'shapes', 'maze', 'dots', 'clock', 'puzzle']
  };
  // 3-year-olds can't count yet: no number games for them; they get mind-stretching games
  // (shapes, colours, shadows, memory, puzzles, mazes, sizes) instead. Numbers start at 4.
  const NUMBER_GAMES = ['counting', 'dots', 'addition', 'mathsrace', 'clock'];
  function poolFor(kid) {
    const group = Store.ageGroup(kid);
    return Store.currentAge(kid) <= 3 ? POOLS[group].filter(g => !NUMBER_GAMES.includes(g)) : POOLS[group];
  }
  // Each world mixes up to 9 different games in its own order (a seeded shuffle, so a level is
  // always the same game when replayed). Games come back in later worlds at a higher difficulty.
  function seededShuffle(arr, seed) {
    const a = arr.slice(); let s = seed;
    const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function buildMap(pool, salt) {
    const out = [];
    for (let w = 0; w < WORLDS; w++) {
      const order = seededShuffle(pool, (w + 1) * 7919 + salt);
      for (let k = 0; k < PER_WORLD; k++) out.push(k === PER_WORLD - 1 ? ['quiz', 1] : [order[k % order.length], 1]);
    }
    return out;
  }
  const mapCache = {};
  function mapFor(kid) {
    const pool = poolFor(kid), key = pool.join(',');
    return mapCache[key] || (mapCache[key] = buildMap(pool, pool.length * 31));
  }
  // A different look for every world.
  const THEMES = [
    { deco: ['☁️', '🎈', '🌈', '🕊️', '☁️', '🪁', '☀️', '☁️'] },
    { deco: ['🌳', '🍄', '🦊', '🦉', '🌲', '🐿️', '🌳', '🦌'] },
    { deco: ['🐉', '🏰', '🔮', '✨', '🐲', '🌙', '💎', '✨'] },
    { deco: ['🐠', '🐙', '🐚', '🐳', '🦑', '🐡', '🦀', '🐬'] },
    { deco: ['🍭', '🧁', '🍩', '🍬', '🍰', '🍦', '🍪', '🎂'] },
    { deco: ['🌵', '🐪', '☀️', '🏜️', '🦂', '🌵', '🐫', '🏺'] },
    { deco: ['⛄', '❄️', '🐧', '🏔️', '🦭', '❄️', '🎿', '🦌'] },
    { deco: ['🦖', '🦕', '🌴', '🌋', '🥚', '🌿', '🦖', '🌴'] },
    { deco: ['🪐', '🚀', '👽', '⭐', '🌍', '🛸', '☄️', '🌟'] },
    { deco: ['🌈', '🦄', '👑', '🏰', '✨', '💖', '🦄', '🌟'] }
  ];
  const STAGE = { tiny: 0, junior: 1, explorer: 2 };
  const worldOf = i => Math.floor(i / PER_WORLD);
  // Difficulty grows with the child's exact age AND with progress on the map, so every child
  // gets a fair challenge: a 4-year-old gets harder levels than a 3-year-old, a 10-year-old
  // harder than a 7-year-old, and everyone ramps up level by level.
  // Returns d (1 easy, 2 medium, 3 tricky) for the games, and p (0–1) for fine-grained ranges.
  const AGE_SPAN = { tiny: [3, 4], junior: [5, 6], explorer: [7, 10] };
  function difficultyFor(kid, levelIdx) {
    const group = Store.ageGroup(kid), [lo, hi] = AGE_SPAN[group];
    const ageP = Math.min(1, Math.max(0, (Store.currentAge(kid) - lo) / Math.max(1, hi - lo)));
    const p = Math.min(1, (levelIdx / (LEVELS - 1)) * 0.7 + ageP * 0.3);
    return { d: p < 0.3 ? 1 : p < 0.65 ? 2 : 3, p, age: Store.currentAge(kid) };
  }

  // ---------- helpers ----------
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 3200);
  }

  // Pop-ups (QA P2-4): a real dialog. Focus moves into it and Tab stays inside; Escape presses its close / back
  // button when it has one ([data-x], else the round "back to the map / home" button of a result), so a pop-up
  // that must be answered (accepting new terms, opening a won sticker) never closes on Escape; focus goes back to
  // what was focused before. The dialog is named by its heading, or by opts.label.
  let modalSeq = 0;
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';
  const shown = e => !!(e.getClientRects().length && !e.closest('[hidden]'));
  function modal(html, opts) {
    opts = opts || {};
    const opener = document.activeElement;
    const m = GK.el(`<div class="modal-back"><div class="modal" role="dialog" aria-modal="true" tabindex="-1">${html}</div></div>`);
    const box = m.firstElementChild;
    const head = box.querySelector('h1, h2, h3, .reveal-title');
    if (opts.label || !head) box.setAttribute('aria-label', opts.label || (head ? head.textContent.trim() : 'IntelloKids'));
    else { head.id = head.id || 'dlg-title-' + (++modalSeq); box.setAttribute('aria-labelledby', head.id); }
    document.body.appendChild(m);
    const items = () => [...box.querySelectorAll(FOCUSABLE)].filter(shown);
    const top = () => { const all = document.querySelectorAll('.modal-back'); return all[all.length - 1] === m; };
    // Long texts (the terms) start on the dialog itself, so a screen reader reads its name first.
    const first = box.querySelector('[data-autofocus]') || (box.querySelector('.legal-scroll') ? null : items()[0]);
    try { (first || box).focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    const onKey = e => {
      if (!m.isConnected) return document.removeEventListener('keydown', onKey, true);
      if (!top()) return;
      if (e.key === 'Escape') {
        const x = [...box.querySelectorAll('[data-x], .round-btn[data-back]')].find(shown);
        if (x) { e.preventDefault(); e.stopPropagation(); x.click(); }
      } else if (e.key === 'Tab') {
        const list = items();
        if (!list.length) { e.preventDefault(); box.focus(); return; }
        const i = list.indexOf(document.activeElement);
        // A <video>'s own controls keep every key to themselves once the focus is inside them (Escape included, so the
        // player could not be closed from the keyboard). Tab never goes into them: the video is one stop (Space plays
        // and pauses it), and Tab / Shift+Tab move on to the next button.
        if (list.some(x => x.tagName === 'VIDEO')) {
          e.preventDefault();
          const n = list.length;
          list[i === -1 ? (e.shiftKey ? n - 1 : 0) : (i + (e.shiftKey ? n - 1 : 1)) % n].focus();
          return;
        }
        if (e.shiftKey && i <= 0) { e.preventDefault(); list[list.length - 1].focus(); }
        else if (!e.shiftKey && (i === -1 || i === list.length - 1)) { e.preventDefault(); list[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    const close = () => {
      document.removeEventListener('keydown', onKey, true);
      if (!m.isConnected) return;
      const hadFocus = m.contains(document.activeElement);
      m.remove();
      if (!hadFocus) return;
      // Back to the opener; if it's gone (a gift button removed), into the pop-up underneath, if any.
      const below = [...document.querySelectorAll('.modal-back')].pop();
      const back = opener && opener.isConnected && opener !== document.body && (!below || below.contains(opener)) ? opener
        : below ? (below.querySelector(FOCUSABLE) || below.firstElementChild) : null;
      try { if (back) back.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    };
    return { el: m, close };
  }

  // Show/hide password (owner, 2026-11-15): an eye button next to every password field in `root`. It never submits,
  // keeps the value and the cursor, starts hidden, and hides again when the form is sent (so nothing stays shown).
  // The eye button lives in js/pw-eye.js (shared with the owner dashboard); here it gets the texts in the site's language.
  function passwordToggles(root) { PwEye.attach(root, on => t(on ? 'pw_hide' : 'pw_show')); }


  function nodeKey(group, i) { return group + ':' + i; }
  function currentNode(kid) {
    const group = Store.ageGroup(kid), nodes = mapFor(kid);
    const i = nodes.findIndex((_, k) => !kid.completed[nodeKey(group, k)]);
    return i === -1 ? nodes.length - 1 : i;
  }
  function isUnlocked(kid, group, i) { return i === 0 || !!kid.completed[nodeKey(group, i - 1)]; }
  function friendSvg(kid) { return Art.friend(kid.friend, STAGE[Store.ageGroup(kid)], Store.level(kid)); }
  // The child's own character: their look, their T-shirt colour and their initial on the shirt.
  function meSvg(kid, me) {
    me = me || kid.me;
    return Art.friend({ gender: me.gender, skin: me.skin, top: Art.SHIRTS[me.shirt || 0], mark: (kid.name || '★').trim().charAt(0).toUpperCase(), name: kid.name, plain: true }, STAGE[Store.ageGroup(kid)], Store.level(kid));
  }
  // Picture used for the child in lists: their own character, else their friend, else Brainy.
  function avatarSvg(kid) { return kid.me ? meSvg(kid) : kid.friend ? friendSvg(kid) : Art.brainy({ thumb: false }); }

  // ---------- top bar ----------
  function renderTopbar(kid) {
    const u = Store.currentUser();
    let nav;
    if (kid) {
      // Kids' top bar: just their stars and a way back to the grown-ups (the language is a parent setting).
      nav = `${Store.lockedKid() === kid.id ? KidLock.badge(kid) : ''}<span class="kid-pill kid-stars" aria-label="⭐ ${kid.stars}">⭐ ${kid.stars}</span>
             <button type="button" class="btn ghost small kid-parents" data-parents aria-label="${t('parents')}">👪 <span class="kid-parents-label">${t('parents')}</span></button>`;
    } else if (u) {
      // "Parent" (hidden while already in the Parents' area), Progress (family dashboard) right next to it,
      // then the language menu and, at the very right, the parent's initials: the account menu (Settings, Help and
      // information, Log out last). Owner, 2026-11-09; initials at the very right, owner 2026-11-15.
      const path = location.hash.replace(/^#\/?/, ''), here = path.split('/')[0];
      // Email first (owner, 2026-11-16): while the email waits for confirmation, no Parent / Progress buttons.
      if (CLOUD && Cloud.pending(u)) nav = '';
      else nav = `${path === 'parent' ? '' : `<a class="btn ghost small" href="#/parent" title="${t('nav_parent')}"><span aria-hidden="true">👪</span> <span class="nav-label">${t('nav_parent')}</span></a>`}
             <a class="btn ghost small${here === 'progress' ? ' is-active' : ''}" href="#/progress" title="${t('navProgress')}"><span aria-hidden="true">📊</span> <span class="nav-label">${t('navProgress')}</span></a>`;
    } else {
      // No "All games" in the visitors' top bar (owner, 2026-11-18): the games page is linked once, from the footer.
      nav = `${PAY && !Store.inApp() ? `<a class="nav-link nav-pricing" href="${pricingHref()}">${t('pricing')}</a>` : ''}
             <a class="btn ghost small nav-login" href="#/login">${t('login')}</a>
             <a class="btn primary small" href="#/signup">${t('signup')}</a>`;
    }
    // The trial countdown sits at the very top of every screen while the trial runs (owner, 2026-11-13).
    const strip = trialStrip(u, kid);
    topbar.classList.toggle('has-trial', !!strip);
    topbar.classList.toggle('kid-mode', !!kid);
    // Visitors on phones get a one-row bar (logo, Sign up, language); "Log in" is on the page itself.
    topbar.classList.toggle('visitor-mode', !kid && !u);
    // Parents on phones: one compact row (QA P2-5): icon buttons, the name shortened, the language as a small chip.
    topbar.classList.toggle('parent-mode', !kid && !!u);
    // The logo (owner, 2026-11-15): a child's own home in the kids' area, the Parents' area for a logged-in parent
    // (their home page), the landing page for visitors.
    topbar.innerHTML = `${strip}
      <a class="brand" href="${kid ? '#/kid/' + kid.id : u ? '#/parent' : '#/'}"><img src="assets/logo-sm.png" width="203" height="150" alt="${t('logoAlt')}"></a>
      <nav class="nav">${nav}
        ${kid ? '' : langMenu()}${!kid && u ? accountMenu(u) : ''}
      </nav>`;
    bindLangMenu(topbar.querySelector('.lang-dd'), code => { Store.setLang(code); I18N.setLang(code); render(); });
    const lo = topbar.querySelector('[data-logout]');
    if (lo) lo.onclick = () => { if (CLOUD) Cloud.logout(); else Store.logout(); go('#/'); };
    const pa = topbar.querySelector('[data-parents]');
    if (pa) pa.onclick = () => go('#/parent');
    const acct = topbar.querySelector('.acct');
    if (acct) bindAccountMenu(acct);
    const ts = topbar.querySelector('button.trial-strip');
    if (ts) ts.onclick = toPlans;
  }

  // ---------- Language menu (owner, 2026-11-15): flag + name, in the brand font ----------
  // Replaces the browser's own <select> (system font, emoji flags shown as letters on Windows). The site's SVG flags
  // (Art.flag). A listbox button: aria-haspopup/aria-expanded, ↓/↑/Enter/Space open it on the current language,
  // arrows/Home/End move, Enter/Space/tap choose, Esc closes (focus back on the button), a tap outside or Tab closes.
  // Fixed under its button so the compact parents' bar never clips it. Used in the top bar and in Settings.
  let langMenuSeq = 0;
  function langMenu(cls) {
    const L = IK_CONFIG.languages, cur = L.find(l => l.code === I18N.getLang()) || L[0], id = 'lang-dd-' + (++langMenuSeq);
    return `<div class="lang-dd${cls ? ' ' + cls : ''}">
      <button type="button" class="lang-dd-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}" aria-label="${t('language')}: ${cur.name}" title="${t('language')}">
        ${Art.flag(cur.flag)}<span class="lang-dd-name">${cur.name}</span><span class="lang-dd-caret" aria-hidden="true">▾</span></button>
      <ul class="lang-dd-list" id="${id}" role="listbox" aria-label="${t('language')}" hidden>${L.map(l => `
        <li role="option" tabindex="-1" data-l="${l.code}" lang="${l.code}" aria-selected="${l.code === cur.code}">${Art.flag(l.flag)}<span>${l.name}</span><span class="lang-dd-check" aria-hidden="true">${l.code === cur.code ? '✓' : ''}</span></li>`).join('')}
      </ul></div>`;
  }
  function bindLangMenu(root, pick) {
    if (!root) return;
    const btn = root.querySelector('.lang-dd-btn'), list = root.querySelector('.lang-dd-list');
    const opts = () => [...list.querySelectorAll('[role="option"]')];
    const place = () => {
      const r = btn.getBoundingClientRect(), vw = window.innerWidth, vh = window.innerHeight, w = list.offsetWidth, h = list.offsetHeight;
      // Lined up with the button's right edge in the top bar (right half of the screen), its left edge elsewhere.
      const left = Math.max(12, Math.min(vw - 12 - w, r.left > vw / 2 ? r.right - w : r.left));
      list.style.left = Math.round(left) + 'px';
      list.style.top = Math.round(r.bottom + 6 + h > vh - 8 && r.top - 6 - h > 8 ? r.top - 6 - h : r.bottom + 6) + 'px';
    };
    const open = where => {
      list.hidden = false; place(); btn.setAttribute('aria-expanded', 'true'); root.classList.add('open');
      const all = opts(), sel = all.find(o => o.getAttribute('aria-selected') === 'true') || all[0];
      (where === 'last' ? all[all.length - 1] : sel).focus({ preventScroll: true });
    };
    const close = back => {
      if (list.hidden) return;
      list.hidden = true; btn.setAttribute('aria-expanded', 'false'); root.classList.remove('open');
      if (back) btn.focus({ preventScroll: true });
    };
    const choose = o => { const code = o.dataset.l; close(true); if (code && code !== I18N.getLang()) pick(code); };
    root._close = close;
    btn.onclick = () => (list.hidden ? open() : close(false));
    btn.onkeydown = e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); open(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); open('last'); }
      else if (e.key === 'Escape') close(true);
    };
    list.onkeydown = e => {
      const all = opts(), i = all.indexOf(document.activeElement);
      const to = n => all[(n + all.length) % all.length].focus({ preventScroll: true });
      if (e.key === 'ArrowDown') { e.preventDefault(); to(i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); to(i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); to(0); }
      else if (e.key === 'End') { e.preventDefault(); to(all.length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (i >= 0) choose(all[i]); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') close(false);
    };
    list.onclick = e => { const o = e.target.closest('[role="option"]'); if (o) choose(o); };
  }
  // Close an open language menu on a tap outside it, or when the screen is resized or scrolled.
  const closeLangMenus = e => document.querySelectorAll('.lang-dd.open').forEach(d => { if (!e || !e.target || !d.contains(e.target)) d._close(false); });
  document.addEventListener('pointerdown', closeLangMenus);
  window.addEventListener('resize', () => closeLangMenus());
  window.addEventListener('scroll', () => closeLangMenus(), { passive: true });

  // ---------- Account menu (the parent's initials, at the very right of the top bar) ----------
  // A real menu button: aria-expanded, Enter/Space/↓ open it on the first item, ↑ on the last, arrows/Home/End
  // move, Esc closes (focus back on the button), a tap outside or Tab closes. Log out is always last.
  // The button shows the parent's initials (owner, 2026-11-15): the first letter of the first two words of the name
  // ("Leckraz Jhuboo" → LJ, "Sam" → S), 👤 when the name has no letters.
  function initials(name) {
    const words = String(name || '').trim().split(/\s+/).map(w => (w.match(/\p{L}/u) || [''])[0]).filter(Boolean);
    return words.slice(0, 2).join('').toLocaleUpperCase().slice(0, 2);
  }
  function accountMenu(u) {
    const ini = initials(u.name);
    return `<div class="acct">
      <button type="button" class="acct-btn acct-avatar" data-acct aria-haspopup="menu" aria-expanded="false" aria-controls="acct-menu" aria-label="${t('acct_menu')} – ${esc(u.name)}" title="${esc(u.name)}">
        <span aria-hidden="true">${ini ? esc(ini) : '👤'}</span></button>
      <div class="acct-menu" id="acct-menu" role="menu" aria-label="${t('acct_menu')}" hidden>
        <p class="acct-who" role="none"><strong>${esc(u.name)}</strong><small>${t('acct_signedIn')}</small><span>${esc(u.email)}</span></p>
        <a role="menuitem" tabindex="-1" href="#/settings"><span aria-hidden="true">⚙️</span> ${t('settings')}</a>
        ${PLANS && !Store.inApp() ? `<a role="menuitem" tabindex="-1" href="#/settings" data-sub-item><span aria-hidden="true">💳</span> ${t('acct_subscription')}</a>` : ''}
        <a role="menuitem" tabindex="-1" href="#/settings" data-help><span aria-hidden="true">💡</span> ${t('parents_help')}</a>
        <button type="button" role="menuitem" tabindex="-1" data-contact><span aria-hidden="true">✉️</span> ${t('acct_contact')}</button>
        <button type="button" role="menuitem" tabindex="-1" data-logout><span aria-hidden="true">🚪</span> ${t('logout')}</button>
      </div></div>`;
  }
  function bindAccountMenu(acct) {
    const btn = acct.querySelector('[data-acct]'), menu = acct.querySelector('.acct-menu');
    const items = () => [...menu.querySelectorAll('[role="menuitem"]')];
    // Fixed under the button, lined up with its right edge, and always fully on screen (also at 390 px).
    const place = () => {
      const r = btn.getBoundingClientRect(), vw = window.innerWidth, w = menu.offsetWidth;
      let right = vw - r.right;
      if (vw - right - w < 12) right = vw - 12 - w;   // would stick out on the left: slide it right
      menu.style.top = Math.round(r.bottom + 6) + 'px';
      menu.style.right = Math.round(Math.max(12, right)) + 'px';
    };
    const open = where => {
      menu.hidden = false; place(); btn.setAttribute('aria-expanded', 'true'); acct.classList.add('open');
      const list = items(); (where === 'last' ? list[list.length - 1] : list[0]).focus();
    };
    const close = back => {
      if (menu.hidden) return;
      menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); acct.classList.remove('open');
      if (back) btn.focus();
    };
    acct._close = close;
    btn.onclick = () => (menu.hidden ? open('first') : close(false));
    btn.onkeydown = e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); open('first'); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); open('last'); }
      else if (e.key === 'Escape') close(true);
    };
    menu.onkeydown = e => {
      const list = items(), i = list.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') close(false);
      else if (e.key === ' ' && document.activeElement.tagName === 'A') { e.preventDefault(); document.activeElement.click(); }
    };
    // Help and information: the Terms / Privacy / Refund / Data security / Contact card in Settings (the Parents' area
    // no longer repeats it: the site footer has the same links. Owner, 2026-11-15).
    menu.querySelector('[data-help]').onclick = e => { e.preventDefault(); close(false); openSettingsAt('help'); };
    // Subscription (owner, 2026-11-15: "Manage subscription should be in the user profile… in the dropdown"):
    // Settings → Subscription, behind the grown-ups password.
    const si = menu.querySelector('[data-sub-item]');
    if (si) si.onclick = e => { e.preventDefault(); close(false); parentGate(() => openSettingsAt('subscription')); };
    menu.querySelector('a[href="#/settings"]').addEventListener('click', () => close(false));
    // Contact us (owner, 2026-11-18): a small panel with the email and the social icons. Feedback is no longer in this
    // menu: it is a card at the bottom of the Parents' area (no repeats).
    // close(true): the focus goes back to the account button first, so it returns there when the panel closes.
    menu.querySelector('[data-contact]').onclick = () => { close(true); openContact(); };
  }

  // ---------- Contact us panel (owner, 2026-11-18): from the account menu and the logged-in screens ----------
  // A pop-up on wider screens, a bottom sheet on phones (css .contact-sheet). One place for the contact email in the
  // logged-in area: Settings and the subscription screens open this panel instead of showing the address again.
  // The social icons are the footer's (Landing.socialRow: only the profiles set in IK_CONFIG.social, none in the app).
  const CONTACT_EMAIL = (window.LEGAL && LEGAL.email) || 'help@intellokids.com';
  function openContact() {
    const social = Landing.socialRow('contact-social');
    const m = modal(`<div class="contact-panel">
        <button type="button" class="contact-x" data-x aria-label="${t('ct_close')}">×</button>
        <h2><span aria-hidden="true">✉️</span> ${t('acct_contact')}</h2>
        <p class="contact-intro">${t('ct_intro')}</p>
        <div class="contact-mail">
          <a class="contact-address" href="mailto:${CONTACT_EMAIL}" data-autofocus>${CONTACT_EMAIL}</a>
          <button type="button" class="btn ghost small contact-copy" data-copy>${t('ct_copy')}</button>
        </div>
        <p class="contact-copied muted small" role="status" aria-live="polite"></p>
        ${social}
      </div>`);
    m.el.classList.add('contact-sheet');
    m.el.querySelector('[data-x]').onclick = m.close;
    m.el.addEventListener('click', e => { if (e.target === m.el) m.close(); });   // a tap outside the panel closes it
    const note = m.el.querySelector('.contact-copied');
    m.el.querySelector('[data-copy]').onclick = () => {
      const done = () => { note.textContent = '✓ ' + t('ct_copied'); };
      const fallback = () => {
        const r = document.createRange(); r.selectNodeContents(m.el.querySelector('.contact-address'));
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        try { document.execCommand('copy'); done(); } catch (e) { /* the address stays selected to copy by hand */ }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(CONTACT_EMAIL).then(done, fallback);
      else fallback();
    };
  }
  // Any [data-contact-open] button on a logged-in screen opens the panel.
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-contact-open]');
    if (b) { e.preventDefault(); openContact(); }
  });
  // Close the menu on a tap outside it, or when the screen is resized.
  document.addEventListener('pointerdown', e => { const a = topbar.querySelector('.acct.open'); if (a && !a.contains(e.target)) a._close(false); });
  window.addEventListener('resize', () => { const a = topbar.querySelector('.acct.open'); if (a) a._close(false); });
  // Opens Settings on one of its cards ('subscription' or 'help'): scrolled to it, its heading focused.
  let settingsAt = null;
  function openSettingsAt(id) {
    settingsAt = id;
    if (location.hash === '#/settings') viewSettings(); else go('#/settings');
  }
  function scrollToCard(id) {
    const box = app.querySelector('#' + id);
    if (!box) return;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const h = box.querySelector('h2'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }
  // The Terms / Privacy / Data security / Contact links, shared by the Parents' area and Settings.
  function helpLinks() {
    const docs = [['terms.html', '📜', 'termsOfService'], ['privacy.html', '🔒', 'privacyPolicy']]
      .concat(PAY && !Store.inApp() ? [['refund.html', '↩️', 'refundPolicy']] : [], [['security.html', '🛡️', 'dataSecurity']]);
    // Contact opens the "Contact us" panel (the one place for the email in the logged-in area, owner 2026-11-18).
    return `<ul class="help-links">${docs
      .map(([f, i, k]) => `<li><a href="${legalHref(f)}"><span aria-hidden="true">${i}</span> ${t(k)}</a></li>`).join('')}<li><a href="${legalHref('contact.html')}" data-contact-open><span aria-hidden="true">✉️</span> ${t('acct_contact')}</a></li></ul>`;
  }

  // Language buttons with real flags, used on the language screen and the first-visit pop-up.
  // The language screen's subtitle: "Choose your language" in the other languages (the title is in the detected one).
  const langSub = () => IK_CONFIG.languages.filter(l => l.code !== I18N.getLang()).map(l => I18N.tIn(l.code, 'chooseLanguage')).filter(Boolean).join(' · ');
  function langButtons() {
    return IK_CONFIG.languages.map(l => `<button type="button" class="lang-btn" data-l="${l.code}" lang="${l.code}"${l.dir ? ` dir="${l.dir}"` : ''}>
      ${Art.flag(l.flag)}<span class="lang-name">${l.name}</span></button>`).join('');
  }

  // ---------- pages ----------
  function viewLanguage() {
    topbar.innerHTML = '';
    app.innerHTML = `
      <section class="lang-screen">
        <img class="lang-logo" src="assets/logo-md.png" width="486" height="360" alt="IntelloKids">
        <h1>${t('chooseLanguage')}</h1>
        <p class="muted">${langSub()}</p>
        <div class="lang-grid">
          ${langButtons()}
        </div>
      </section>`;
    app.querySelectorAll('.lang-btn').forEach(b => b.onclick = () => {
      Store.setLang(b.dataset.l); I18N.setLang(b.dataset.l); go('#/');
    });
  }

  // Home page: a short first screen, then one "For parents" section with every detail. The page content lives in
  // js/landing.js and is shared with the static SEO pages (infra/build-seo.ps1).
  // The language is auto-detected; visitors change it in the top bar's language menu (no bar on the page, owner 2026-11-18).
  function viewLanding() {
    renderTopbar();
    app.innerHTML = Landing.html({ lang: I18N.getLang(), signedIn: !!Store.currentUser() });
    // "Information for parents ↓": scroll to the parents' section. On phones the section is folded away
    // (CSS) until this button opens it; on bigger screens it is always there and its first block opens.
    // (The address uses hash routes, so a plain #parents link would re-route instead of scrolling.)
    app.querySelectorAll('[data-scroll]').forEach(a => a.onclick = e => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.scroll);
      if (!target) return;
      const phone = window.matchMedia && window.matchMedia('(max-width: 600px)').matches;
      target.classList.add('is-open');
      a.setAttribute('aria-expanded', 'true');
      const first = target.querySelector('details');
      if (first && !phone) first.open = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---------- Feedback (#/feedback, private: noindex) ----------
  // Since 2026-11-18 (owner) the feedback form is a card at the bottom of the Parents' area. #/feedback still works for
  // old links: it opens the Parents' area scrolled to the card. Visitors go to the log-in page first with a short note.
  let toFeedback = false;
  function viewFeedback() {
    if (!Feedback.enabled()) return go('#/');
    if (!Store.currentUser()) {
      try { sessionStorage.setItem('ik_after_login', '#/feedback'); sessionStorage.setItem('ik_login_note', 'fb_loginNote'); } catch (x) { /* ignore */ }
      return go('#/login');
    }
    toFeedback = true;
    location.replace('#/parent');   // replace: Back doesn't bounce to #/feedback
  }

  // ---------- SEO: title, description and indexing rules for each screen ----------
  function setMeta(title, desc, indexable) {
    document.title = title;
    const set = (sel, attr, val) => { const m = document.querySelector(sel); if (m) m.setAttribute(attr, val); };
    set('meta[name="description"]', 'content', desc);
    set('meta[property="og:title"]', 'content', title);
    set('meta[property="og:description"]', 'content', desc);
    set('meta[name="twitter:title"]', 'content', title);
    set('meta[name="twitter:description"]', 'content', desc);
    // Private screens (parents' and children's areas) must never appear in search results.
    set('meta[name="robots"]', 'content', indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
  }
  function metaFor(page) {
    const brand = ' | IntelloKids';
    switch (page) {
      case 'landing': return setMeta(t('seo_title'), t('seo_desc'), true);
      case 'pricing': return setMeta(t('pricingTitle') + brand, t('pricingSub') + ' ' + t('seo_desc'), true);
      case 'terms': return setMeta(t('termsTitle') + brand, t('seo_desc'), true);
      case 'signup': return setMeta(t('signupTitle') + brand, t('seo_desc'), true);
      case 'login': return setMeta(t('loginTitle') + brand, t('seo_desc'), false);
      case 'feedback': return setMeta(t('fb_title') + brand, t('fb_sub'), false);   // noindex, like #/settings
      case 'language': return setMeta(t('chooseLanguage') + brand, t('seo_desc'), true); // in the detected language (QA P2-14)
      default: return setMeta('IntelloKids', t('seo_desc'), false);
    }
  }

  // First visit: the home page explains the features straight away (owner's request), in the
  // browser's language, with a small language bar on top. The full-screen language page is still
  // available at #/language.
  function detectLang() {
    const langs = (navigator.languages || [navigator.language || 'en']).map(l => String(l).slice(0, 2).toLowerCase());
    return langs.find(l => I18N.has(l)) || 'en';
  }

  // Legal pages in the site's language (owner, 2026-11-19: English, French, Spanish; the English text is the reference).
  // The static copies are terms.html… for English and fr/terms.html, es/terms.html… for the others.
  // (links inside the translated text point to that language's static pages)
  const legalBody = () => {
    const l = I18N.getLang(), b = l !== 'en' && window.LEGAL[l];
    return b ? b.replace(/href="(terms|privacy|refund|security|contact|pricing)\.html"/g, `href="${l}/$1.html"`) : window.LEGAL.en;
  };
  const legalHref = file => (I18N.getLang() === 'en' || !(window.LEGAL_TR && LEGAL_TR[I18N.getLang()]) ? '' : I18N.getLang() + '/') + file;
  function legalUpdated() {
    const T = window.LEGAL_TR && LEGAL_TR[I18N.getLang()];
    return T ? `${T.titles.updated} ${T.titles.date}` : `Last updated: ${window.LEGAL.updated}`;
  }
  // Terms in a pop-up, so the parent doesn't lose what they typed. withAccept: ask to accept.
  function showTermsModal(withAccept) {
    const body = legalBody();
    const m = modal(`<div class="legal-modal"><h2>${t('termsTitle')}</h2>
      ${withAccept ? `<p class="note">${t('termsUpdated')}</p>` : ''}
      <div class="legal-scroll">${body}</div>
      <div class="row center">${withAccept ? `<button class="btn primary" data-ok>✅ ${t('iAgree')}</button>` : `<button class="btn primary" data-x>${t('back')}</button>`}</div></div>`);
    m.el.classList.add('wide');
    const x = m.el.querySelector('[data-x]'); if (x) x.onclick = m.close;
    const ok = m.el.querySelector('[data-ok]'); if (ok) ok.onclick = () => { Store.acceptTerms(); m.close(); };
    return m;
  }

  function viewTerms() {
    renderTopbar();
    const u = Store.currentUser();
    const body = legalBody();
    app.innerHTML = `
      <section class="page legal">
        <article class="card legal-card">
          <h1>${t('termsTitle')}</h1>
          <p class="muted">${legalUpdated()}</p>
          ${body}
          ${u && Store.needsTerms(u) ? `<div class="row center"><button type="button" class="btn primary big" data-accept>✅ ${t('iAgree')}</button></div>` : ''}
        </article>
      </section>`;
    const a = app.querySelector('[data-accept]');
    if (a) a.onclick = () => { Store.acceptTerms(); go('#/parent'); };
  }

  // ---------- parents' dashboard for one child ----------
  // Play time in friendly units, never decimals (owner, 2026-11-15: "wtf is 0.3 mins?"). Every play time on the
  // parents' pages goes through here: "45 sec", "12 min" (whole minutes), "1 h 5 min".
  // label = true (chart bars): under a minute reads "<1 min", and nothing at all for a day with no play.
  const fmtPlay = (ms, label) => {
    const s = Math.round((ms || 0) / 1000);
    if (s <= 0) return label ? '' : t('dur_min', { n: 0 });
    if (s < 60) return label ? t('dur_lt1') : t('dur_sec', { n: s });
    const m = Math.round(s / 60);
    if (m < 60) return t('dur_min', { n: m });
    return m % 60 ? t('dur_hmin', { h: Math.floor(m / 60), m: m % 60 }) : t('dur_h', { h: m / 60 });
  };
  // Keeps each number with its unit ("1 h" | "5 min") so a narrow column wraps between them, never inside one.
  const nbPlay = str => esc(str).replace(/(\d) /g, '$1&nbsp;');
  const dayKey = ts => { const d = new Date(ts); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

  // Skill areas parents understand, built from the games.
  const SKILLS = {
    shapes: ['shapes', 'sorter', 'shadow'], colours: ['colours'], numbers: ['counting', 'bigsmall', 'dots'], maths: ['addition', 'mathsrace', 'clock'],
    memory: ['memory'], logic: ['pattern', 'odd', 'maze', 'puzzle'], coding: ['coding'], quiz: ['quiz']
  };
  const SKILL_ICON = { shapes: '🔷', colours: '🎨', numbers: '🔢', maths: '➕', memory: '🧠', logic: '🧩', coding: '🤖', quiz: '❓' };
  const skillOf = g => Object.keys(SKILLS).find(k => SKILLS[k].includes(g));
  const accOf = list => { const a = list.reduce((s, h) => s + (h.answers || 0), 0), m = list.reduce((s, h) => s + (h.mistakes || 0), 0); return a ? Math.round(a / (a + m) * 100) : null; };
  const ago = ts => {
    const m = Math.round((Date.now() - ts) / 60000);
    if (m < 60) return t('ago_min', { n: Math.max(1, m) });
    if (m < 1440) return t('ago_h', { n: Math.round(m / 60) });
    return t('ago_d', { n: Math.round(m / 1440) });
  };
  const dayLabel = ts => {
    const d = new Date(ts), today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.round((today - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
    return diff === 0 ? t('today') : diff === 1 ? t('yesterday') : d.toLocaleDateString(I18N.voice(), { weekday: 'long', day: 'numeric', month: 'short' });
  };

  function viewChildDashboard(id) {
    const u = Store.currentUser();
    if (!u) return go('#/login');
    if (needsPayment()) return;
    const c = Store.getChild(id);
    if (!c) return go('#/parent');
    // The child's age album(s) give the sticker names and pictures below: draw again once loaded.
    if (!Stickers.ready(c)) { const tk = renderToken; Stickers.loadFor(c).then(ok => { if (ok && tk === renderToken) viewChildDashboard(id); }); }
    renderTopbar();
    // Pictures from the age packs (js/colouring/age<N>.js) load on demand; once they're here, draw the page again.
    const notHere = Object.keys(c.drawings || {}).filter(k => !Colouring.get(k));
    if (notHere.length) {
      const here = location.hash;
      Colouring.loadFor(notHere).then(() => { if (location.hash === here && notHere.some(k => Colouring.get(k))) viewChildDashboard(id); });
    }
    const name = esc(c.name), group = Store.ageGroup(c), hist = c.history || [];
    const now = Date.now(), DAY = 864e5;
    const inRange = (from, to) => hist.filter(h => h.t > now - from * DAY && h.t <= now - to * DAY);
    const wk = inRange(7, 0), prev = inRange(14, 7);
    const sum = (list, f) => list.reduce((s, h) => s + (f(h) || 0), 0);
    const M = list => ({ ms: Math.round(sum(list, h => h.ms) / 1000) * 1000, acts: list.length, acc: accOf(list), stars: sum(list, h => h.stars), days: new Set(list.map(h => dayKey(h.t))).size });
    const w = M(wk), p = M(prev);
    const cur = currentNode(c), world = worldOf(cur);
    const last = hist.length ? Math.max(...hist.map(h => h.t)) : null;

    // ---- How they're doing: one card per skill area available for this age ----
    const avail = new Set([...poolFor(c), 'quiz']);
    const skills = Object.keys(SKILLS).filter(k => SKILLS[k].some(g => avail.has(g))).map(k => {
      const list = hist.filter(h => SKILLS[k].includes(h.game));
      const acc = accOf(list);
      const recent = accOf(list.slice(-4)), earlier = list.length > 5 ? accOf(list.slice(0, -4)) : null;
      const trend = recent == null || earlier == null ? null : recent - earlier >= 8 ? 'up' : earlier - recent >= 8 ? 'down' : 'flat';
      const status = !list.length ? 'new' : acc >= 85 ? 'strong' : acc >= 65 ? 'good' : 'practice';
      const spd = sum(list, h => h.answers) ? sum(list, h => h.ms) / sum(list, h => h.answers) / 1000 : null;
      return { k, list, acc, trend, status, spd, plays: list.length, stars: list.length ? sum(list, h => h.stars) / list.length : 0 };
    });
    const tried = skills.filter(s => s.plays >= 2);
    const best = tried.slice().sort((a, b) => b.acc - a.acc)[0];
    const weakest = tried.slice().sort((a, b) => a.acc - b.acc)[0];
    const needHelp = skills.filter(s => s.status === 'practice' || s.trend === 'down');

    // ---- What they're doing: games, finished pictures, stickers and videos, newest first ----
    const events = [
      ...hist.map(h => ({ t: h.t, icon: Games[h.game] ? Games[h.game].icon : '🎮',
        text: t('ev_game', { game: Games[h.game] ? t(Games[h.game].title) : h.game }) + (/^(tiny|junior|explorer):\d+$/.test(h.key) ? ' · ' + t('ev_level', { n: Number(h.key.split(':')[1]) + 1 }) : ''),
        meta: `${'★'.repeat(h.stars)}${'☆'.repeat(3 - h.stars)} · ${fmtPlay(h.ms)} · ${h.mistakes ? '❌ ' + h.mistakes : '✅ 0'}` })),
      ...Object.entries(c.drawings || {}).filter(([, d]) => d && d.done && d.at).map(([k, d]) => ({ t: d.at, icon: '🖍️', text: t('ev_drawing', { pic: esc(Colouring.name(k)) }), meta: '' })),
      ...Object.entries(c.badges || {}).map(([sid, ts]) => ({ t: ts, icon: '🦄', text: t('ev_sticker', { name: esc(Stickers.nameById(sid)) }), meta: '' })),
      ...Object.entries(c.videos || {}).filter(([, ts]) => ts).map(([vid, ts]) => ({ t: ts, icon: '🎬', text: t('ev_video', { video: t('v_' + vid) }), meta: '' })),
      ...Chests.events(c)
    ].sort((a, b) => b.t - a.t).slice(0, 30);
    const byDay = [];
    events.forEach(e => { const l = dayLabel(e.t); let g = byDay.find(x => x.l === l); if (!g) byDay.push(g = { l, items: [] }); g.items.push(e); });

    // 7-day chart.
    const week = Array.from({ length: 7 }, (_, k) => {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - k));
      const key = dayKey(d.getTime());
      const ms = sum(hist.filter(h => dayKey(h.t) === key), h => h.ms);
      return { label: d.toLocaleDateString(I18N.voice(), { weekday: 'short' }), full: d.toLocaleDateString(I18N.voice(), { weekday: 'long', day: 'numeric', month: 'short' }), ms };
    });
    const maxMs = Math.max(60000, ...week.map(d => d.ms));

    const missed = Object.entries(c.missed || {}).sort((a, b) => b[1].n - a[1].n || b[1].last - a[1].last).slice(0, 6);
    const gname = g => Games[g] ? Games[g].icon + ' ' + t(Games[g].title) : g;
    // f: optional formatter for the difference (play time: fmtPlay).
    const delta = (a, b, unit, f) => {
      if (a == null || b == null || (!a && !b)) return '';
      const d = a - b; if (!d) return `<span class="delta flat">= ${t('dash_vsLast')}</span>`;
      return `<span class="delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '▲' : '▼'} ${f ? nbPlay(f(Math.abs(d))) : Math.abs(d) + (unit || '')} ${t('dash_vsLast')}</span>`;
    };
    const kpi = (icon, label, value, dl) => `<div class="card stat"><span class="stat-icon">${icon}</span><span class="stat-value">${value}</span><span class="stat-label">${label}</span>${dl}</div>`;
    const stickersGot = Stickers.earned(c);
    const art = Object.entries(c.drawings || {}).filter(([k, d]) => d && d.done && Colouring.get(k));

    app.innerHTML = `
      <section class="page dashboard">
        <div class="row between"><a class="btn ghost small" href="#/parent"><span class="flip-rtl">←</span> ${t('back')}</a><span></span></div>
        <div class="card dash-head">
          <div class="child-avatar">${avatarSvg(c)}</div>
          <div>
            <h1>${t('dash_title', { name })}</h1>
            <p class="muted">${Store.currentAge(c)} ${t('years')} · ${t('age_' + group)}${c.friend && String(c.friend.name || '').trim()
              // The friend's own level ("Thomas: level 8"), not to be mixed up with the map level below (QA P2-8).
              ? ' · ' + t('dash_friendLevel', { friend: esc(String(c.friend.name).trim()), n: Store.level(c) }) : ''} · ⭐ ${c.stars}</p>
            <p>🗺️ ${t('dash_currentWorld', { n: world + 1, world: t('w' + (world + 1)) })} · ${t('level')} ${Math.min(LEVELS, cur + 1)} / ${LEVELS}</p>
            <p class="muted small">🕒 ${last ? t('dash_lastPlayed', { when: ago(last) }) : events.length ? t('dash_lastActive', { when: ago(events[0].t) }) : t('dash_never')}</p>
            <p class="muted small">🎁 ${Chests.summary(c)}</p>
          </div>
          <a class="btn primary" href="#/kid/${c.id}">▶ ${t('play')}</a>
        </div>
        ${BrainyChat.parentAlert(c)}
        ${hist.length ? `
        <article class="card dash-summary">
          <h2>📋 ${t('dash_weekTitle')}</h2>
          <p class="summary-text">${t('dash_sum', { name, time: nbPlay(fmtPlay(w.ms)), days: w.days, acts: w.acts })}
            ${best ? ' ' + t('dash_sumBest', { skill: '<b>' + t('skill_' + best.k) + '</b>' }) : ''}
            ${weakest && weakest !== best && weakest.acc < 80 ? ' ' + t('dash_sumPractice', { skill: '<b>' + t('skill_' + weakest.k) + '</b>' }) : ''}</p>
          <div class="stat-grid">
            ${kpi('⏱️', t('dash_time'), nbPlay(fmtPlay(w.ms)), delta(w.ms, p.ms, '', fmtPlay))}
            ${kpi('🎮', t('dash_sessions'), w.acts, delta(w.acts, p.acts))}
            ${kpi('🎯', t('dash_accuracy'), w.acc == null ? '–' : w.acc + '%', delta(w.acc, p.acc, '%'))}
            ${kpi('⭐', t('dash_starsWon'), w.stars, delta(w.stars, p.stars))}
            ${kpi('📅', t('dash_days'), w.days + ' / 7', delta(w.days, p.days))}
          </div>
        </article>

        <article class="card">
          <h2>💡 ${t('dash_howTitle', { name })}</h2>
          <div class="skill-grid">${skills.map(s => `
            <div class="skill-card st-${s.status}">
              <div class="skill-top"><span class="skill-icon">${SKILL_ICON[s.k]}</span><strong>${t('skill_' + s.k)}</strong>
                <span class="skill-badge">${t('st_' + s.status)}</span></div>
              ${s.plays ? `<div class="acc"><div class="bar"><i style="width:${s.acc}%"></i></div><span>${s.acc}%</span></div>
              <p class="muted small">${s.plays} × · ${'★'.repeat(Math.round(s.stars))} ${s.spd ? '· ⚡ ' + nbPlay(fmtPlay(Math.max(1000, s.spd * 1000))) : ''}
                ${s.trend ? ` · <span class="trend ${s.trend}">${s.trend === 'up' ? '📈' : s.trend === 'down' ? '📉' : '➡️'} ${t('trend_' + s.trend)}</span>` : ''}</p>`
                : `<p class="muted small">${t('st_new_d')}</p>`}
            </div>`).join('')}</div>
        </article>

        <div class="dash-cols">
          <article class="card">
            <h2>📅 ${t('dash_week')}</h2>
            <div class="week-chart" role="img" aria-label="${t('dash_week')}: ${week.map(d => d.full + ' ' + esc(fmtPlay(d.ms))).join(', ')}">
              ${week.map(d => `<div class="wk-col" title="${d.full}: ${esc(fmtPlay(d.ms))}"><span class="wk-val">${nbPlay(fmtPlay(d.ms, true))}</span><span class="wk-bar" style="height:${d.ms / maxMs * 100}%"></span><span class="wk-day">${d.label}</span></div>`).join('')}
            </div>
          </article>
          <article class="card">
            <h2>🤝 ${t('dash_helpTitle', { name })}</h2>
            ${missed.length ? `<p class="muted small">${t('dash_mistakesNote', { name })}</p><ul class="mistake-list">${missed.map(([label, m]) => `<li><span>${esc(label)}<small class="muted"> · ${gname(m.game)}</small></span><b>${t('dash_times', { n: m.n })}</b></li>`).join('')}</ul>` : `<p class="muted">${t('dash_noMistakes')}</p>`}
            ${needHelp.length ? `<h3 class="tips-title">🏡 ${t('dash_tipsTitle')}</h3><ul class="tips">${needHelp.slice(0, 3).map(s => `<li>${SKILL_ICON[s.k]} ${t('tip_' + s.k)}</li>`).join('')}</ul>` : ''}
          </article>
        </div>` : events.length
          // Videos watched, pictures finished… but no game finished yet (QA P1-4): say so, and show what they did below.
          ? `<p class="empty card">${t('dash_noGamesYet', { name })}</p>`
          : `<p class="empty card">${t('dash_empty', { name })}</p>`}

        ${events.length ? `
        <article class="card">
          <h2>👀 ${t('dash_whatTitle', { name })}</h2>
          <div class="timeline">${byDay.map(g => `
            <div class="tl-day"><h3>${g.l}</h3>
              <ul>${g.items.map(e => `<li><span class="tl-icon">${e.icon}</span><span class="tl-text">${e.text}${e.meta ? `<small class="muted">${e.meta}</small>` : ''}</span><span class="tl-time muted small">${new Date(e.t).toLocaleTimeString(I18N.voice(), { hour: '2-digit', minute: '2-digit' })}</span></li>`).join('')}</ul>
            </div>`).join('')}</div>
        </article>` : ''}

        ${BrainyChat.parentCard(c)}

        <article class="card">
          <h2>🏆 ${t('dash_achTitle')}</h2>
          <p class="muted">${t('dash_stickersWon', { n: Stickers.count(c) })} / ${Stickers.total(c)}</p>
          <div class="ach-stickers">${stickersGot.slice(-12).reverse().map(s => `<span title="${esc(Stickers.name(s))}">${Stickers.art(s, { cls: 'mini', uid: 'd', still: true })}</span>`).join('') || `<span class="muted small">–</span>`}</div>
          <h3>🖍️ ${t('dash_artTitle')}</h3>
          <div class="art-grid">${art.length ? art.map(([k]) => `<figure class="art-item" data-art="${k}"><svg viewBox="0 0 300 300" aria-hidden="true">${Colouring.get(k).svg}</svg><figcaption>${esc(Colouring.name(k))}</figcaption></figure>`).join('') : `<p class="muted small">${t('dash_noArt')}</p>`}</div>
        </article>
      </section>`;
    // Show the artwork in the child's own colours.
    app.querySelectorAll('[data-art]').forEach(f => {
      const d = (c.drawings || {})[f.dataset.art];
      f.querySelectorAll('[data-r]').forEach((r, i) => { if (d.doneFills && d.doneFills[i]) r.setAttribute('fill', d.doneFills[i]); });
    });
    // Talk to Brainy: on/off switch, delete history, and "seen" for the alerts shown above.
    BrainyChat.bindParent(app, c.id, () => viewChildDashboard(id), toast);
    BrainyChat.markSeen(c.id);
  }

  function viewAuth(mode) {
    renderTopbar();
    const signup = mode === 'signup';
    app.innerHTML = `
      <section class="auth">
        <div class="card auth-card">
          <div class="auth-brainy">${Art.brainy({ mood: 'happy' })}</div>
          <h1>${t(signup ? 'signupTitle' : 'loginTitle')}</h1>
          <form novalidate>
            ${signup ? `<label>${t('parentName')}<input class="input" name="name" autocomplete="name" maxlength="60" required></label>` : ''}
            <label>${t('email')}<input class="input" name="email" type="email" autocomplete="email" maxlength="120" required></label>
            <label>${t('password')}<input class="input" name="password" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" minlength="${signup && CLOUD ? 8 : 6}" maxlength="128" required></label>
            ${signup && CLOUD ? `<p class="muted small">${t('cl_pw8')}</p>` : ''}
            ${signup ? `<label class="check"><input type="checkbox" name="terms" value="1"> <span>${t('agreeTerms')} <a href="#/terms" data-terms>${t('terms')}</a>.</span></label>` : ''}
            <p class="form-error" role="alert"></p>
            ${signup ? '' : NO_ACCOUNT_BOX}
            <button class="btn primary big full" type="submit">${t(signup ? 'createAccount' : 'login')}</button>
          </form>
          ${signup ? '' : `<p class="center"><button type="button" class="link-btn" data-forgot>${t('cl_forgot')}</button></p>`}
          <p class="muted center">${t(signup ? 'haveAccount' : 'noAccount')} <a href="#/${signup ? 'login' : 'signup'}">${t(signup ? 'login' : 'signup')}</a></p>
          <p class="note">${t(CLOUD ? 'cl_cloudNote' : 'demoNote')}</p>
        </div>
      </section>`;
    const form = app.querySelector('form'), err = app.querySelector('.form-error');
    passwordToggles(form);
    const tl = app.querySelector('[data-terms]');
    if (tl) tl.onclick = e => { e.preventDefault(); showTermsModal(); };
    const fg = app.querySelector('[data-forgot]');
    if (fg) fg.onclick = () => forgotPassword(form.querySelector('[name=email]').value);
    try {
      const pre = sessionStorage.getItem('ik_login_email');
      if (pre) {
        form.querySelector('[name=email]').value = pre; sessionStorage.removeItem('ik_login_email');
        if (signup) form.querySelector('[name=name]').focus(); // "Sign up with this email": the email is in, the name is next
      }
    } catch (x) { /* ignore */ }
    // Why the log-in page opened (e.g. "Log in to send us feedback." from #/feedback), shown once above the form.
    try {
      const why = sessionStorage.getItem('ik_login_note');
      if (why) sessionStorage.removeItem('ik_login_note');
      if (why === 'fb_loginNote' && !signup) form.insertAdjacentHTML('beforebegin', `<p class="note login-note" role="status">⭐ ${t(why)}</p>`);
    } catch (x) { /* ignore */ }
    form.onsubmit = async e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form));
      if ((signup && !f.name.trim()) || !f.email.trim() || !f.password) return (err.textContent = t('err_required'));
      if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return (err.textContent = t('err_email'));
      if (signup && f.password.length < (CLOUD ? 8 : 6)) return (err.textContent = t(CLOUD ? 'cl_pw8' : 'err_password'));
      if (signup && !f.terms) return (err.textContent = t('err_terms'));
      if (CLOUD) {
        // Online accounts: the server answers (sign-up → "check your email"; a device account moves online).
        const btn = form.querySelector('[type=submit]');
        busy(btn, true); err.textContent = ''; noAccount(form, '');
        const r = signup ? await Cloud.signup(f.name, f.email, f.password) : await Cloud.login(f.email, f.password);
        busy(btn, false);
        if (r.code === 'account_not_found') return noAccount(form, f.email.trim());
        if (!r.ok) return (err.textContent = r.local ? t(r.local) : cloudErr(r));
        if (r.offline) toast('📡 ' + t('cl_err_offline'));
        if (r.next !== '#/parent') return go(r.next);
      } else {
        const r = signup ? Store.signup(f.name, f.email, f.password) : Store.login(f.email, f.password);
        if (r.error) return (err.textContent = t(r.error));
      }
      const back = sessionStorage.getItem('ik_after_login');
      try { sessionStorage.removeItem('ik_after_login'); } catch (x) { /* ignore */ }
      // The free trial starts with the first child (Store.addChild), so nobody's week is used up before playing.
      go(back || '#/parent');
    };
  }

  // ---------- Online accounts (IK_CONFIG.backend, js/cloud.js, docs/BACKEND.md) ----------
  // Server errors come back as stable codes; cl_err_<code> is the text in each language.
  function cloudErr(r) { return t(Cloud.errKey(r.code), { min: (r.extra && r.extra.min) || 8, n: (r.extra && r.extra.retry_after) || 60 }); }
  function busy(btn, on) { if (btn) { btn.disabled = on; btn.setAttribute('aria-busy', on ? 'true' : 'false'); } }
  // No account uses this email (log-in and "forgot password", owner 2026-11-20): say so kindly instead of an error,
  // with "Sign up with this email" (the sign-up form opens with it filled in). noAccount(form, '') hides it again.
  const NO_ACCOUNT_BOX = '<div class="no-account" data-no-account role="status" hidden></div>';
  function noAccount(form, email) {
    const box = form.querySelector('[data-no-account]');
    if (!box) return;
    box.hidden = !email;
    if (!email) { box.innerHTML = ''; return; }
    box.innerHTML = `<p>👋 ${t('cl_noAccount', { email: `<strong>${esc(email)}</strong>` })}</p>
      <button type="button" class="btn primary full" data-signup-with>${t('cl_signupWith')}</button>`;
    box.querySelector('[data-signup-with]').onclick = () => {
      try { sessionStorage.setItem('ik_login_email', email); } catch (e) { /* ignore */ }
      go('#/signup');
    };
  }
  const CONTACT = (window.LEGAL && LEGAL.email) || 'help@intellokids.com';

  // "Forgot your password?" (log-in page, Settings, the grown-ups gate). With online accounts: the reset by email.
  // Before that, a password lives only on this device and nobody can reset it: an honest note, never a fake reset.
  function forgotPassword(email) {
    if (CLOUD) {
      try { if (email) sessionStorage.setItem('ik_forgot_email', String(email).trim()); } catch (e) { /* ignore */ }
      return go('#/forgot');
    }
    const m = modal(`<div class="forgot-off">
        <p class="gate-icon" aria-hidden="true">🔑</p>
        <h2>${t('cl_forgotOffTitle')}</h2>
        <p>${t('cl_forgotOffText', { email: `<a href="mailto:${CONTACT}">${CONTACT}</a>` })}</p>
        <div class="row center"><button type="button" class="btn primary" data-x>${t('cl_ok')}</button></div>
      </div>`);
    m.el.querySelector('[data-x]').onclick = m.close;
  }

  // "Manage subscription" (online accounts): a fresh portal link from our server, behind the grown-ups gate.
  function bindManageSub() {
    app.querySelectorAll('[data-manage-sub]').forEach(ms => {
      ms.onclick = () => parentGate(async () => {
        busy(ms, true);
        const r = await Cloud.portal();
        busy(ms, false);
        if (r.ok) location.assign(r.url); else toast(cloudErr(r));
      });
    });
  }

  // "Check your email": type the 6-digit code (works in the app too), ask for a new one, or fix a mistyped email.
  // With online accounts this is the only screen a pending account can reach (owner, 2026-11-16: email first).
  function viewCheckEmail() {
    const u = Store.currentUser();
    if (!CLOUD || !u) return go('#/login');
    if (!Cloud.pending(u)) return go('#/parent');
    renderTopbar();
    const email = (u.cloud && u.cloud.email) || u.email;
    app.innerHTML = `
      <section class="auth">
        <div class="card auth-card check-email">
          <div class="auth-brainy">${Art.brainy({ mood: 'happy' })}</div>
          <h1>📬 ${t('cl_checkTitle')}</h1>
          <p>${t('cl_checkSub', { email: `<strong>${esc(email)}</strong>` })}</p>
          <form novalidate>
            <label>${t('cl_codeLabel')}<input class="input code-input" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="7" required></label>
            <p class="form-error" role="alert"></p>
            <button class="btn primary big full" type="submit">${t('cl_verify')}</button>
          </form>
          <p class="center"><button type="button" class="link-btn" data-resend>${t('cl_resend')}</button></p>
          <p class="muted small center" data-note role="status"></p>
          <p class="center"><button type="button" class="link-btn" data-wrong-email>${t('cl_wrongEmail')}</button></p>
          <form novalidate data-form="change" hidden>
            <label>${t('set_newEmail')}<input class="input" name="email" type="email" autocomplete="email" maxlength="120" required></label>
            <label>${t('password')}<input class="input" name="password" type="password" autocomplete="current-password" maxlength="128" required></label>
            <p class="form-error" role="alert"></p>
            <button class="btn primary full" type="submit">${t('cl_changeEmailSend')}</button>
          </form>
          <p class="note gate-note">${t('cl_gateNote')}</p>
        </div>
      </section>`;
    const form = app.querySelector('form'), err = form.querySelector('.form-error'), note = app.querySelector('[data-note]');
    const input = form.querySelector('input');
    // "Wrong email? Change it": the code goes to the new address instead (the password proves it's the same parent).
    const change = app.querySelector('[data-form="change"]');
    passwordToggles(change);
    app.querySelector('[data-wrong-email]').onclick = () => { change.hidden = !change.hidden; if (!change.hidden) change.querySelector('[name=email]').focus(); };
    change.onsubmit = async e => {
      e.preventDefault();
      const cerr = change.querySelector('.form-error'), f = Object.fromEntries(new FormData(change));
      if (!/^\S+@\S+\.\S+$/.test(String(f.email).trim())) return (cerr.textContent = t('err_email'));
      if (!f.password) return (cerr.textContent = t('err_required'));
      const btn = change.querySelector('[type=submit]'); busy(btn, true); cerr.textContent = '';
      const r = await Cloud.changePendingEmail(f.email, f.password);
      busy(btn, false);
      if (!r.ok) return (cerr.textContent = r.local ? t(r.local) : cloudErr(r));
      toast('📬 ' + t('cl_changeEmailDone', { email: String(f.email).trim().toLowerCase() }));
      viewCheckEmail();
    };
    setTimeout(() => input.focus(), 50);
    form.onsubmit = async e => {
      e.preventDefault();
      const code = input.value.replace(/\D/g, '');
      if (code.length !== 6) return (err.textContent = t('cl_err_code_format'));
      const btn = form.querySelector('[type=submit]'); busy(btn, true); err.textContent = '';
      const r = await Cloud.verify({ code });
      busy(btn, false);
      if (!r.ok) return (err.textContent = cloudErr(r));
      toast('✅ ' + t('cl_verified'));
      go('#/parent');
    };
    const rs = app.querySelector('[data-resend]');
    // Confirmed in another tab of this browser (the link from the email): this tab moves on by itself.
    const moved = () => {
      if (!rs.isConnected) return window.removeEventListener('storage', moved);
      if (!Cloud.pending()) { window.removeEventListener('storage', moved); toast('✅ ' + t('cl_verified')); go('#/parent'); }
    };
    window.addEventListener('storage', moved);
    const tick = () => {
      const cu = Store.currentUser(), sent = (cu && cu.cloud && cu.cloud.sentAt) || 0, left = Math.ceil((sent + 60e3 - Date.now()) / 1000);
      if (!rs.isConnected) return;
      rs.disabled = left > 0;
      if (left > 0) { note.textContent = t('cl_resendWait', { n: left }); setTimeout(tick, 1000); } else if (note.dataset.kind === 'wait') note.textContent = '';
      note.dataset.kind = left > 0 ? 'wait' : '';
    };
    tick();
    rs.onclick = async () => {
      busy(rs, true);
      const r = await Cloud.resend();
      busy(rs, false);
      note.dataset.kind = '';
      note.textContent = r.ok ? '✅ ' + t('cl_resent') : cloudErr(r);
      if (r.ok) setTimeout(tick, 1500);
    };
  }

  // A small card while something is checked with the server (verify link, reset link).
  function busyCard(title) {
    app.innerHTML = `<section class="auth"><div class="card auth-card"><div class="auth-brainy">${Art.brainy({ mood: 'happy' })}</div>
      <h1>${title}</h1><p class="center" role="status" aria-busy="true"><span class="boot-dots"><i></i><i></i><i></i></span></p></div></section>`;
  }
  function messageCard(icon, title, text, buttons) {
    app.innerHTML = `<section class="auth"><div class="card auth-card"><div class="auth-brainy">${Art.brainy({ mood: 'happy' })}</div>
      <h1>${icon} ${title}</h1><p>${text}</p><div class="row center">${buttons}</div></div></section>`;
  }

  // The link from the confirmation email (#/verify?token=…).
  async function viewVerifyLink(q) {
    renderTopbar();
    const tk = renderToken;
    if (!q.token) return go('#/');
    busyCard(t('cl_checkingLink'));
    const r = await Cloud.verify({ token: q.token });
    if (tk !== renderToken) return;
    if (!r.ok) {
      const pending = Cloud.pending();
      return messageCard('⚠️', t('cl_linkBadTitle'), cloudErr(r.code === 'code_invalid' ? { code: 'code_expired' } : r),
        pending ? `<a class="btn primary" href="#/check-email">${t('cl_enterCode')}</a>` : `<a class="btn primary" href="#/login">${t('cl_backLogin')}</a>`);
    }
    if (r.next === 'login') {
      // Confirmed, but this browser doesn't know the password yet (a fresh browser, another device, the link opened
      // again): "Email confirmed", then log in once here. The log-in page has the address filled in.
      try { if (r.email) sessionStorage.setItem('ik_login_email', r.email); } catch (e) { /* ignore */ }
      renderTopbar();
      return messageCard('✅', t('cl_verifiedTitle'), t('cl_verifiedLogin'), `<a class="btn primary" href="#/login">${t('login')}</a>`);
    }
    toast('✅ ' + t('cl_verified'));
    go('#/parent');
  }

  const pwFields = () => `
    <label>${t('cl_newPassword')}<input class="input" type="password" name="password" autocomplete="new-password" minlength="8" maxlength="128" required></label>
    <label>${t('cl_confirmPassword')}<input class="input" type="password" name="confirm" autocomplete="new-password" minlength="8" maxlength="128" required></label>`;
  const pwProblem = f => (!f.password || !f.confirm ? 'err_required' : f.password.length < 8 ? 'cl_pw8' : f.password !== f.confirm ? 'cl_mismatch' : null);
  function viewPwChanged() {
    renderTopbar();
    messageCard('✅', t('cl_pwChangedTitle'), t('cl_pwChanged'), `<a class="btn primary" href="#/login">${t('login')}</a>`);
  }

  // Forgot password: the email, then "check your email" (with a code form for the app), then the new password.
  function viewForgot() {
    if (!CLOUD) { go('#/login'); return forgotPassword(); }
    renderTopbar();
    let pre = '';
    try { pre = sessionStorage.getItem('ik_forgot_email') || ''; sessionStorage.removeItem('ik_forgot_email'); } catch (e) { /* ignore */ }
    const cu = Store.currentUser();
    if (!pre && cu) pre = cu.email;
    app.innerHTML = `
      <section class="auth">
        <div class="card auth-card">
          <div class="auth-brainy">${Art.brainy({ mood: 'happy' })}</div>
          <h1>🔑 ${t('cl_forgotTitle')}</h1>
          <div data-step="1">
            <p>${t('cl_forgotSub')}</p>
            <form novalidate data-form="ask">
              <label>${t('email')}<input class="input" name="email" type="email" autocomplete="email" maxlength="120" value="${esc(pre)}" required></label>
              <p class="form-error" role="alert"></p>
              ${NO_ACCOUNT_BOX}
              <button class="btn primary big full" type="submit">${t('cl_sendLink')}</button>
            </form>
          </div>
          <div data-step="2" hidden>
            <p class="note" data-sent></p>
            <p class="center" data-pending-again hidden><button type="button" class="btn" data-again-btn>${t('cl_askAgain')}</button></p>
            <div data-code-part>
            <p>${t('cl_haveCode')}</p>
            <form novalidate data-form="code">
              <label>${t('cl_codeLabel')}<input class="input code-input" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="7" required></label>
              ${pwFields()}
              <p class="form-error" role="alert"></p>
              <button class="btn primary big full" type="submit">${t('cl_setPassword')}</button>
            </form>
            </div>
          </div>
          <p class="muted center"><a href="#/login">${t('cl_backLogin')}</a></p>
        </div>
      </section>`;
    const ask = app.querySelector('[data-form="ask"]'), codeForm = app.querySelector('[data-form="code"]');
    passwordToggles(codeForm);
    let email = '';
    const step = name => app.querySelectorAll('[data-step]').forEach(s => { s.hidden = s.dataset.step !== name; });
    const backToAsk = () => { step('1'); ask.querySelector('[name=email]').focus(); };
    app.querySelector('[data-again-btn]').onclick = backToAsk;
    ask.onsubmit = async e => {
      e.preventDefault();
      const err = ask.querySelector('.form-error');
      email = ask.querySelector('[name=email]').value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email)) return (err.textContent = t('err_email'));
      err.textContent = ''; noAccount(ask, '');
      // What this device itself knows about the account (Cloud.localState: local data only, nothing asked of the server).
      const known = Cloud.localState(email), shown = `<strong>${esc(email)}</strong>`;
      const btn = ask.querySelector('[type=submit]'); busy(btn, true);
      const r = await Cloud.forgot(email);
      busy(btn, false);
      if (r.code === 'account_not_found') return noAccount(ask, email); // nothing was sent: offer sign-up instead
      if (!r.ok) return (err.textContent = cloudErr(r));
      // A pending account gets its confirmation email again from the server (not a reset): no code form for that.
      const pend = r.sent ? r.sent === 'verify' : known === 'pending';
      // Asked too often (3 an hour): nothing new was sent, so say so instead of "we've sent an email".
      app.querySelector('[data-sent]').innerHTML = '📬 ' + t(r.recent ? 'cl_forgotRecent' : pend ? 'cl_forgotPendingSent' : 'cl_forgotSent', { email: shown });
      app.querySelector('[data-code-part]').hidden = pend;
      app.querySelector('[data-pending-again]').hidden = !pend;
      step('2');
      if (!pend) codeForm.querySelector('[name=code]').focus();
    };
    codeForm.onsubmit = async e => {
      e.preventDefault();
      const err = codeForm.querySelector('.form-error'), f = Object.fromEntries(new FormData(codeForm));
      const code = String(f.code || '').replace(/\D/g, '');
      if (code.length !== 6) return (err.textContent = t('cl_err_code_format'));
      const bad = pwProblem(f);
      if (bad) return (err.textContent = t(bad));
      const btn = codeForm.querySelector('[type=submit]'); busy(btn, true); err.textContent = '';
      const r = await Cloud.reset({ email, code, password: f.password });
      busy(btn, false);
      if (!r.ok) return (err.textContent = cloudErr(r));
      viewPwChanged();
    };
  }

  // The link from the reset email (#/reset?token=…): choose the new password.
  function viewReset(q) {
    renderTopbar();
    if (!q.token) return go('#/forgot');
    app.innerHTML = `
      <section class="auth">
        <div class="card auth-card">
          <div class="auth-brainy">${Art.brainy({ mood: 'happy' })}</div>
          <h1>🔑 ${t('cl_resetTitle')}</h1>
          <form novalidate>
            ${pwFields()}
            <p class="muted small">${t('cl_pw8')}</p>
            <p class="form-error" role="alert"></p>
            <button class="btn primary big full" type="submit">${t('cl_setPassword')}</button>
          </form>
          <p class="muted center" data-again hidden><a href="#/forgot">${t('cl_askAgain')}</a></p>
        </div>
      </section>`;
    const form = app.querySelector('form');
    passwordToggles(form);
    setTimeout(() => form.querySelector('input').focus(), 50);
    form.onsubmit = async e => {
      e.preventDefault();
      const err = form.querySelector('.form-error'), f = Object.fromEntries(new FormData(form));
      const bad = pwProblem(f);
      if (bad) return (err.textContent = t(bad));
      const btn = form.querySelector('[type=submit]'); busy(btn, true); err.textContent = '';
      const r = await Cloud.reset({ token: q.token, password: f.password });
      busy(btn, false);
      if (!r.ok) {
        // A link that is not valid any more (used, replaced by a newer email, or expired) says just that.
        err.textContent = cloudErr(r.code === 'code_invalid' ? { code: 'code_expired' } : r);
        if (r.code === 'code_expired' || r.code === 'code_invalid') app.querySelector('[data-again]').hidden = false;
        return;
      }
      viewPwChanged();
    };
  }

  // ---------- Family progress: every child at a glance (next to the Parents' area) ----------
  // One card per child, this week's numbers, adventure progress, a strength and a skill to practise.
  // Children are never ranked against each other: each card stands on its own.
  function childWeek(c) {
    const hist = c.history || [], now = Date.now(), DAY = 864e5;
    const wk = hist.filter(h => h.t > now - 7 * DAY);
    const sum = (list, f) => list.reduce((s, h) => s + (f(h) || 0), 0);
    const avail = new Set([...poolFor(c), 'quiz']);
    const tried = Object.keys(SKILLS).filter(k => SKILLS[k].some(g => avail.has(g))).map(k => {
      const list = hist.filter(h => SKILLS[k].includes(h.game));
      return { k, plays: list.length, acc: accOf(list) };
    }).filter(s => s.plays >= 2);
    const best = tried.slice().sort((a, b) => b.acc - a.acc)[0];
    const weak = tried.slice().sort((a, b) => a.acc - b.acc)[0];
    const days = Array.from({ length: 7 }, (_, k) => {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - k));
      const key = dayKey(d.getTime());
      return { label: d.toLocaleDateString(I18N.voice(), { weekday: 'narrow' }), full: d.toLocaleDateString(I18N.voice(), { weekday: 'long' }), ms: sum(hist.filter(h => dayKey(h.t) === key), h => h.ms) };
    });
    return {
      ms: sum(wk, h => h.ms), acts: wk.length, acc: accOf(wk), stars: sum(wk, h => h.stars),
      daysActive: new Set(wk.map(h => dayKey(h.t))).size, days,
      last: hist.length ? Math.max(...hist.map(h => h.t)) : null,
      best: best && best.acc >= 70 ? best : null, weak: weak && weak !== best && weak.acc < 80 ? weak : null
    };
  }

  function viewFamily() {
    const u = Store.currentUser();
    if (!u) return go('#/login');
    if (needsPayment()) return;
    renderTopbar();
    const kids = u.children || [];
    const weeks = kids.map(c => ({ c, w: childWeek(c) }));
    const total = (f) => weeks.reduce((s, x) => s + f(x), 0);
    const tile = (icon, label, value) => `<div class="card stat"><span class="stat-icon">${icon}</span><span class="stat-value">${value}</span><span class="stat-label">${label}</span></div>`;
    app.innerHTML = `
      <section class="page family">
        <div class="family-head">
          <h1>📊 ${t('fam_title')}</h1><p class="muted">${t('fam_sub')}</p>
        </div>
        ${kids.length ? `
        <div class="stat-grid family-totals">
          ${tile('⏱️', t('fam_total_min'), nbPlay(fmtPlay(total(x => x.w.ms))))}
          ${tile('🎮', t('fam_total_acts'), total(x => x.w.acts))}
          ${tile('⭐', t('fam_total_stars'), total(x => x.w.stars))}
          ${tile('🦄', t('fam_total_stickers'), total(x => Stickers.count(x.c)))}
        </div>
        <div class="family-grid">${weeks.map(({ c, w }) => {
          const name = esc(c.name), cur = currentNode(c), world = worldOf(cur), maxMs = Math.max(60000, ...w.days.map(d => d.ms));
          return `<article class="card fam-card">
            <div class="fam-top">
              <div class="child-avatar">${avatarSvg(c)}</div>
              <div class="fam-who">
                <h2>${name}</h2>
                <p class="muted">${Store.currentAge(c)} ${t('years')} · ${t('age_' + Store.ageGroup(c))}</p>
                <p class="muted small">🕒 ${w.last ? t('dash_lastPlayed', { when: ago(w.last) }) : t('dash_never')}</p>
              </div>
            </div>
            <div class="fam-adventure">
              <div class="row between small"><span>🗺️ ${t('w' + (world + 1))}</span><strong>${t('level')} ${Math.min(LEVELS, cur + 1)} / ${LEVELS}</strong></div>
              <div class="bar"><i style="width:${Math.round((cur + 1) / LEVELS * 100)}%"></i></div>
            </div>
            <div class="fam-kpis">
              <div><b class="fam-time">${nbPlay(fmtPlay(w.ms))}</b><span>${t('dash_time')}</span></div>
              <div><b>${w.acc == null ? '–' : w.acc + '%'}</b><span>${t('dash_accuracy')}</span></div>
              <div><b>⭐ ${w.stars}</b><span>${t('fam_total_stars')}</span></div>
              <div><b>${t('fam_daysActive', { n: w.daysActive })}</b><span>${t('dash_days')}</span></div>
            </div>
            <div class="fam-week" role="img" aria-label="${t('dash_week')}: ${w.days.map(d => d.full + ' ' + esc(fmtPlay(d.ms))).join(', ')}">
              ${w.days.map(d => `<div class="fw-col" title="${d.full}: ${esc(fmtPlay(d.ms))}"><span class="fw-bar" style="height:${Math.max(4, d.ms / maxMs * 100)}%" data-empty="${d.ms ? 0 : 1}"></span><span class="fw-day">${d.label}</span></div>`).join('')}
            </div>
            ${w.acts ? '' : `<p class="muted small center">${t('fam_noPlay')}</p>`}
            <div class="fam-chips">
              ${w.best ? `<span class="chip-good">💪 ${t('fam_great', { skill: t('skill_' + w.best.k) })}</span>` : ''}
              ${w.weak ? `<span class="chip-practice">🌱 ${t('fam_practice', { skill: t('skill_' + w.weak.k) })}</span>` : ''}
              <span class="chip-neutral">🦄 ${Stickers.count(c)} / ${Stickers.total(c)}</span>
            </div>
            <div class="row fam-actions">
              <a class="btn ghost" href="#/parent/child/${c.id}">📊 ${t('fam_report')}</a>
              <a class="btn primary" href="#/kid/${c.id}">▶ ${t('play')}</a>
            </div>
          </article>`;
        }).join('')}</div>` : `
        <div class="card empty-family">
          <div class="empty-brainy">${Art.brainy({ mood: 'happy' })}</div>
          <p>${t('fam_none')}</p>
          ${Store.canAddChild(u) ? `<a class="btn primary" href="#/parent">＋ ${t('addChild')}</a>` : `<p class="note kids-full" role="note">ℹ️ ${t('kids_max', { n: Store.maxChildren() })}</p>`}
        </div>`}
      </section>`;
  }

  // There is no paywall: after the free trial every family keeps the free part (owner, 2026-11-13).
  // Kept as the single check in case a hard lock is ever needed again.
  function needsPayment() {
    if (Store.hasAccess()) return false;
    go('#/login');
    return true;
  }

  // Children never see payment screens: when the free week has ended, the kids' area shows a
  // friendly "ask your grown-up" screen that leads to the Parents' area instead.
  function viewAskGrownup(kid) {
    renderTopbar(kid);
    app.innerHTML = `
      <section class="page ask-grownup">
        <div class="card ask-card">
          <div class="ask-chars">${kid && kid.me ? meSvg(kid) : ''}${Art.brainy({ mood: 'happy' })}</div>
          <h1>${t('askGrownupTitle')}</h1>
          <p>${t('askGrownupSub')}</p>
          <button type="button" class="btn primary big" data-parents>👪 ${t('askGrownupBtn')}</button>
        </div>
      </section>`;
    GK.speak(t('askGrownupTitle') + ' ' + t('askGrownupSub'));
    app.querySelector('[data-parents]').onclick = () => go('#/parent');
  }

  // Parts that are locked (IK_CONFIG.limits): a padlock and a friendly line from Brainy.
  // With the trial and plans on, the line is "Ask a grown-up to unlock this!"; otherwise "locked for now".
  // Children never see prices or pay screens: the only way on is the small "For grown-ups" button, which
  // goes through the parent gate first. No forms and no links out of the kids' area.
  const lockTitle = () => t(PLANS ? 'tr_kidLock' : 'lock_title');
  const lockSub = () => t(PLANS ? 'tr_kidLockSub' : 'lock_sub');
  const lockedLine = () => lockTitle() + ' ' + lockSub();
  function lockNote() { toast('🔒 ' + lockTitle()); GK.speak(lockedLine()); }
  function viewLocked(kid, backHref) {
    renderTopbar(kid);
    app.innerHTML = `
      <section class="page ask-grownup locked-page">
        <div class="card ask-card">
          <div class="ask-chars">${kid.me ? meSvg(kid) : ''}${Art.brainy({ mood: 'happy' })}</div>
          <p class="lock-big" aria-hidden="true">🔒</p>
          <h1>${lockTitle()}</h1>
          <p>${lockSub()}</p>
          <a class="btn primary big" href="${backHref || '#/kid/' + kid.id}">🎮 ${t('lock_back')}</a>
          ${PLANS ? `<p class="grownup-link"><button type="button" class="btn ghost small" data-grownups>👪 ${t('tr_grownups')}</button></p>` : ''}
        </div>
      </section>`;
    const gb = app.querySelector('[data-grownups]');
    if (gb) gb.onclick = () => parentGate(() => go('#/plans'));
    GK.speak(lockedLine());
  }

  // ---------- Parent gate (owner, 2026-11-13; Google Play Families policy) ----------
  // Every way from the children's side to plans or subscribing, and the plans screen itself, first asks for the
  // password of the parent account that is signed in. A child can't guess it (the times-table question many
  // apps use is no barrier for our 7–10 year olds), and the parent already knows it. Passing it opens the plans
  // screen for 10 minutes in this tab. Nothing is stored; the password is checked with Store's salted hash.
  // The kid lock (js/pin.js): while this device is locked to a child the password is always asked, and passing it also
  // opens the lock (one gate per action: never the PIN and then the password).
  let gateUntil = 0;
  const gateOpen = () => Date.now() < gateUntil && !Store.lockedKid();
  function parentGate(onPass, onCancel) {
    if (gateOpen()) return onPass();
    const m = modal(`<form class="gate" novalidate>
        <p class="gate-icon" aria-hidden="true">👪🔐</p>
        <h2>${t('gate_title')}</h2>
        <p>${t('gate_sub')}</p>
        <label>${t('gate_pw')}<input class="input" type="password" name="pw" autocomplete="current-password" maxlength="128" required></label>
        <p class="gate-forgot"><button type="button" class="link-btn" data-forgot>${t('cl_forgot')}</button></p>
        <p class="form-error" role="alert"></p>
        <div class="row center"><button type="button" class="btn ghost" data-x>${t('gate_cancel')}</button><button class="btn primary" type="submit">${t('gate_go')}</button></div>
      </form>`);
    const f = m.el.querySelector('form'), err = f.querySelector('.form-error'), input = f.querySelector('input');
    passwordToggles(f);
    m.el.querySelector('[data-x]').onclick = () => { m.close(); if (onCancel) onCancel(); };
    m.el.querySelector('[data-forgot]').onclick = () => { m.close(); const u = Store.currentUser(); forgotPassword(u && u.email); };
    setTimeout(() => input.focus(), 50);
    let tries = 0;
    f.onsubmit = e => {
      e.preventDefault();
      if (Store.checkParent(input.value)) { Store.unlock(); gateUntil = Date.now() + 10 * 60e3; m.close(); return onPass(); }
      tries++; input.value = ''; err.textContent = t('gate_wrong');
      // After 3 wrong tries the gate closes (a child pressing buttons just ends up back where they were).
      if (tries >= 3) setTimeout(() => { m.close(); if (onCancel) onCancel(); }, 1200);
    };
  }

  // "2 / 4" next to "Your children": how many of the account's places are used (IK_CONFIG.maxChildren).
  function kidsCount(u) {
    const n = (u.children || []).length, max = Store.maxChildren();
    if (!isFinite(max)) return '';
    return `<span class="kids-count${n >= max ? ' full' : ''}"><span aria-hidden="true">${n} / ${max}</span><span class="sr-only">${t('kids_countLabel', { n, max })}</span></span>`;
  }

  // Parents' area: one neutral note listing what's open for now (only while the limits apply).
  function limitsNote(u) {
    const L = Store.limits(u);
    if (!L) return '';
    const items = [];
    if (L.maxLevel != null && L.maxLevel < LEVELS) items.push(['🗺️', 'menu_map', t('lim_levels', { n: L.maxLevel })]);
    if (Array.isArray(L.videos)) {
      // Each child only sees their own age group's videos (owner, 2026-11-12), so count the open ones per age group,
      // for the age groups of this family's children (all open videos when there are no children yet).
      const nVid = n => n === 1 ? t('lim_video1') : t('lim_videos', { n });
      const open = g => IK_CONFIG.videos.filter(v => v.url && L.videos.includes(v.id) && (!g || v.group === g)).length;
      const groups = ['tiny', 'junior', 'explorer'].filter(g => ((u || Store.currentUser() || {}).children || []).some(c => Store.ageGroup(c) === g));
      items.push(['🎬', 'menu_videos', groups.length ? groups.map(g => `${t('age_' + g)}: ${nVid(open(g))}`).join(' · ') : nVid(open())]);
    }
    if (L.colouring != null) items.push(['🎨', 'menu_colour', t('lim_colour', { n: Store.openPictureCount(u) })]);
    if (L.quizzes != null) items.push(['❓', 'menu_quiz', t('lim_quizzes', { n: L.quizzes })]);
    if (L.chat === false) items.push(['💬', 'menu_chat', t('lim_later')]);
    else if (BrainyChat.enabled() && BrainyChat.minAge() > 3) items.push(['💬', 'menu_chat', t('lim_chat', { n: BrainyChat.minAge() })]);
    return `<div class="card limits-note" role="note">
        <h2>🔓 ${t('lim_title')}</h2>
        <ul>${items.map(([icon, key, text]) => `<li><span aria-hidden="true">${icon}</span> <b>${t(key)}:</b> ${text}</li>`).join('')}</ul>
        <p class="muted small">${t(PLANS ? 'lim_moreSub' : 'lim_more')}</p>
      </div>`;
  }

  // ---------- Free trial, parents' side (IK_CONFIG.trial, owner 2026-11-13) ----------
  // "Mia and Leo" in the page's language.
  function namesOf(u) {
    const names = (u.children || []).map(c => c.name);
    try { return new Intl.ListFormat(I18N.getLang(), { style: 'long', type: 'conjunction' }).format(names); } catch (e) { return names.join(', '); }
  }
  const trialEndsLine = n => n <= 0 ? t('tr_soonTitle0') : n === 1 ? t('tr_soonTitle1') : t('tr_soonTitleN', { n });
  const savedLine = u => t((u.children || []).length > 1 ? 'tr_soonBodyN' : 'tr_soonBody1');
  const reminderDays = () => Number((IK_CONFIG.trial || {}).reminderDays) || 2;
  const toPlans = () => parentGate(() => go('#/plans'));

  // Trial countdown at the very top of every screen while the trial runs (owner, 2026-11-13), inside the sticky
  // top bar so it stays visible and never covers the page. Amber on the last days; hours on the last day.
  //   Parents: "🎁 Free trial: 5 days left · everything is open", a button that goes through the gate to the plans.
  //   Children: "🎁 5 days of everything open left!", plain text, not tappable, no pay or price words.
  // Hidden for subscribers and after the trial (the "trial ended" card and the locks take over).
  function trialStrip(u, kid) {
    if (!PLANS || !u) return '';
    const st = Store.trialState(u);
    if (!st.active) return '';
    const cd = st.countdown, cls = 'trial-strip' + (st.soon ? ' is-soon' : '');
    if (kid) {
      const text = cd.hours ? t(cd.hours === 1 ? 'tr_kidHour1' : 'tr_kidHours', { n: cd.hours }) : t(cd.days === 1 ? 'tr_kidDay1' : 'tr_kidDays', { n: cd.days });
      return `<div class="${cls}" role="status">🎁 ${text}</div>`;
    }
    const text = cd.hours ? t('tr_cdHours', { n: cd.hours }) : t(cd.days === 1 ? 'tr_cdDay1' : 'tr_cdDays', { n: cd.days });
    return `<button type="button" class="${cls}" aria-label="${text} · ${t('tr_cdOpen')} · ${t('tr_seePlans')}">🎁 ${text} · ${t('tr_cdOpen')} <span class="flip-rtl" aria-hidden="true">›</span></button>`;
  }

  // The Parents' area card: the trial waiting for a first child, the trial ended, or the active plan. A paid plan is
  // one status line; managing it lives in the account menu → Subscription (owner, 2026-11-15: "not here").
  function trialCard(u) {
    if (!PLANS) return '';
    if (Store.hasPaid(u)) {
      const st = subStatus(u, true);
      return `<div class="card sub-card"><div>✅ ${t('tr_paid', { plan: t('plan_' + (u.subscription.plan || 'yearly')) })}${st ? ` <span class="muted">· ${st}</span>` : ''}</div></div>`;
    }
    if (Store.trialEnded(u)) return `<div class="card sub-card trial-ended-card"><div>${t('tr_endedCard')}</div><button type="button" class="btn primary small" data-plans>⭐ ${t('tr_seePlans')}</button></div>`;
    if (!Store.trialStarted(u) && Store.trialOn()) return `<div class="card sub-card"><div>🎁 ${t('tr_pending', { n: Store.trialDays() })}</div></div>`;
    return '';
  }

  // One-time pop-ups in the Parents' area: the reminder on the last days, and "your trial has ended".
  // Kind and calm: one tap closes them, and they never come back.
  function trialPopups(u) {
    if (!PLANS || document.querySelector('.modal-back')) return;
    const ended = Store.trialEnded(u), n = Store.trialDaysLeft(u);
    const key = ended ? 'endedPopup' : Store.trialActive(u) && n <= reminderDays() ? 'reminderPopup' : null;
    if (!key || Store.trialSeen(key, u)) return;
    Store.markTrialSeen(key);
    const names = namesOf(u);
    const body = ended
      ? `<h2>${t('tr_endedTitle', { n: Store.trialDays() })}</h2>
         <p>${names ? t('tr_endedSaved', { names: esc(names) }) : t('tr_endedSavedNone')}</p>
         <p>${t('tr_endedFree')}</p>`
      : `<h2>${trialEndsLine(n)}</h2><p>${savedLine(u)}</p><p>${t('tr_anytime')}</p>`;
    const m = modal(`<div class="pay-soon trial-pop"><div class="pay-soon-brainy">${Art.brainy({ mood: 'happy' })}</div>${body}
      <div class="row center"><button type="button" class="btn ghost" data-x>${t(ended ? 'tr_later' : 'tr_ok')}</button><button type="button" class="btn primary" data-see>⭐ ${t('tr_seePlans')}</button></div></div>`);
    m.el.querySelector('[data-x]').onclick = m.close;
    m.el.querySelector('[data-see]').onclick = () => { m.close(); toPlans(); };
  }

  // ---------- Settings for parents (#/settings, private): account, language, data, help ----------
  // Settings: "Manage or cancel your subscription" for families who paid with Paddle. Without our server, we can't
  // open Paddle's customer portal for them (it needs the secret API key), so this explains the honest way: the
  // "Manage subscription" link in Paddle's receipt email, or an email to us. No fake portal, no link out to pay.
  const paddlePaid = u => Store.hasPaid(u) && u.subscription && u.subscription.source === 'paddle';
  const dateOf = (iso, short) => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString(I18N.getLang(), short ? { day: 'numeric', month: 'short' } : { year: 'numeric', month: 'long', day: 'numeric' }); };
  // "Renews on 15 December 2026" / "Cancelled – active until 15 December 2026" from the server's subscription
  // (online accounts), or '' when we don't know.
  function subStatus(u, short) {
    const cs = CLOUD && Cloud.subscription(u);
    if (!cs || !Store.hasPaid(u)) return '';
    const end = cs.active_until || cs.current_period_end;
    if (cs.cancel_scheduled && end) return t(short ? 'sub_endsShort' : 'sub_cancelledUntil', { date: esc(dateOf(end, short)) });
    if (cs.next_billed_at) return t(short ? 'sub_renewsShort' : 'sub_renewsOn', { date: esc(dateOf(cs.next_billed_at, short)) });
    return '';
  }
  // Can this parent manage the Paddle subscription here? Online account, on the website (never in the Android app).
  const canManage = u => CLOUD && paddlePaid(u) && Store.isOnline(u) && u.cloud && u.cloud.token && !Store.inApp() && !window.Capacitor;
  // Settings → Subscription (#subscription; the account menu's "💳 Subscription" opens it behind the grown-ups gate).
  //  - no plan: "No subscription · See plans";
  //  - Android app: the plan status and a neutral line, no button and no link (Google Play's payments policy);
  //  - online account on the website (owner, 2026-11-15): the plan, renewal or end date, the card's brand + last 4,
  //    Change card (Paddle's own overlay), Cancel (with a confirmation) or Undo cancellation, and Paddle's portal for
  //    invoices; every action behind the grown-ups gate;
  //  - otherwise (backend off, or a device account): the honest receipt-email explanation.
  function subscriptionCard(u) {
    if (!PLANS && !Store.hasPaid(u)) return '';
    const open = `<article class="card settings-card sub-manage" id="subscription"><h2>💳 ${t('sub_title')}</h2>`;
    if (!Store.hasPaid(u)) {
      return `${open}<p><strong>${t('sub_none')}</strong></p>
          <p><button type="button" class="btn primary" data-sub-plans>⭐ ${t('sub_seePlans')}</button></p></article>`;
    }
    const s = u.subscription;
    const since = s.since ? dateOf(s.since) : '';
    const st = subStatus(u);
    const plan = `<p><strong>${t('tr_paid', { plan: t('plan_' + (s.plan || 'yearly')) })}</strong>${since && !st ? ` <span class="muted small">${t('sub_since', { date: esc(since) })}</span>` : ''}</p>
          ${st ? `<p class="sub-status${Cloud.subscription(u).cancel_scheduled ? ' is-ending' : ''}" data-sub-status>${st}</p>` : ''}`;
    if (Store.inApp() || window.Capacitor) return `${open}${plan}<p class="muted">${t('sub_appText')}</p></article>`;
    if (s.source === 'play') return `${open}${plan}<p class="muted">${t('sub_playText')}</p></article>`;
    if (s.source !== 'paddle') return `${open}${plan}</article>`;
    if (canManage(u)) {
      const cs = Cloud.subscription(u) || {};
      const ending = !!cs.cancel_scheduled;
      return `${open}${plan}
          ${cs.card ? `<p class="sub-cardline" data-sub-cardline>💳 ${t('sub_card', { brand: esc(cardBrand(cs.card.brand)), last4: esc(cs.card.last4) })}</p>` : ''}
          <div class="row sub-actions">
            ${ending ? `<button type="button" class="btn primary" data-sub-resume>↩️ ${t('sub_undo')}</button>`
              : `<button type="button" class="btn ghost" data-sub-card>💳 ${t('sub_changeCard')}</button>
            <button type="button" class="btn ghost danger-btn" data-sub-cancel>${t('sub_cancel')}</button>`}
          </div>
          ${ending ? '' : `<p class="muted small">${t('sub_cardNote')}</p>`}
          <p class="small"><button type="button" class="link-btn" data-manage-sub>🧾 ${t('sub_portalLink')}</button></p>
        </article>`;
    }
    return `${open}${plan}
          <h3>${t('sub_manageTitle')}</h3>
          <p>${t('sub_manageText')}</p>
          <p class="muted small">${t('sub_cancelText')}</p>
          <p class="muted small">${t('sub_deviceText')}</p>
          <p><button type="button" class="btn ghost small" data-contact-open>✉️ ${t('acct_contact')}</button></p>
        </article>`;
  }
  // "visa" → "Visa", "american_express" → "American Express" (only the brand and last 4 digits are ever shown).
  const cardBrand = b => String(b || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // The Subscription card's buttons. Each asks for the grown-ups password first (open for 10 minutes once passed).
  let cardUpdate = false;
  function bindSubscription(u) {
    const q = sel => app.querySelector('#subscription ' + sel);
    const sp = q('[data-sub-plans]');
    if (sp) sp.onclick = toPlans;
    const cancel = q('[data-sub-cancel]'), resume = q('[data-sub-resume]'), card = q('[data-sub-card]');
    if (cancel) cancel.onclick = () => parentGate(() => {
      const cs = Cloud.subscription() || {}, end = cs.current_period_end || cs.next_billed_at;
      const m = modal(`<div class="sub-confirm">
          <p class="gate-icon" aria-hidden="true">💳</p>
          <h2>${t('sub_cancelTitle')}</h2>
          <p>${end ? t('sub_cancelConfirm', { date: esc(dateOf(end)) }) : t('sub_cancelConfirmNoDate')}</p>
          <p class="form-error" role="alert"></p>
          <div class="row center"><button type="button" class="btn primary" data-keep data-autofocus>${t('sub_keep')}</button><button type="button" class="btn danger" data-confirm-cancel>${t('sub_cancel')}</button></div>
        </div>`);
      m.el.querySelector('[data-keep]').onclick = m.close;
      const go2 = m.el.querySelector('[data-confirm-cancel]');
      go2.onclick = async () => {
        busy(go2, true);
        const r = await Cloud.cancelSubscription();
        busy(go2, false);
        if (!r.ok) { m.el.querySelector('.form-error').textContent = cloudErr(r); return; }
        m.close();
        const ns = Cloud.subscription();
        toast('✅ ' + t('sub_cancelDone', { date: dateOf((ns && (ns.active_until || ns.current_period_end)) || end) }));
        openSettingsAt('subscription');
      };
    });
    if (resume) resume.onclick = () => parentGate(async () => {
      busy(resume, true);
      const r = await Cloud.resumeSubscription();
      busy(resume, false);
      if (!r.ok) return toast(cloudErr(r));
      toast('✅ ' + t('sub_resumed'));
      openSettingsAt('subscription');
    });
    // Change card: our server asks Paddle for the subscription's payment-method transaction; Paddle's own overlay
    // (inside our page) takes the new card. We never see or store card numbers.
    if (card) card.onclick = () => parentGate(async () => {
      busy(card, true);
      const r = await Cloud.paymentMethod();
      if (!r.ok) { busy(card, false); return toast(cloudErr(r)); }
      try {
        const P = await loadPaddle();
        cardUpdate = true;
        P.Checkout.open({ transactionId: r.transaction_id, settings: { displayMode: 'overlay', variant: 'one-page', locale: paddleLocale() } });
      } catch (e) { toast(t('pl_checkoutFail')); } finally { busy(card, false); }
    });
    bindManageSub();
  }

  function viewSettings() {
    const u = Store.currentUser();
    if (!u) return go('#/login');
    renderTopbar();
    // Online account (signed in on the server): email, password and deleting go through the server, which also
    // checks the current password.
    const online = CLOUD && Store.isOnline(u) && u.cloud.token && u.cloud.status === 'active';
    const pw = (name, key, auto) => `<label>${t(key)}<input class="input" type="password" name="${name}" autocomplete="${auto}" required></label>`;
    // Without the server (or for an account that lives only on this device), deleting here can't cancel a Paddle
    // subscription: a clear warning box, and "cancel first" when this device recorded a Paddle purchase.
    const offWarn = online || !PAY ? '' : `<div class="delete-alert" role="note"><p>⚠️ <strong>${t('sub_deleteOffWarn')}</strong></p>
          ${paddlePaid(u) ? `<p>${t('sub_deleteFirst')} <button type="button" class="link-btn" data-contact-open>${t('acct_contact')}</button></p>` : ''}</div>`;
    app.innerHTML = `
      <section class="page settings-page">
        <div class="row between"><a class="btn ghost small" href="#/parent"><span class="flip-rtl">←</span> ${t('back')}</a><h1>⚙️ ${t('settings')}</h1><span></span></div>

        ${subscriptionCard(u)}

        <article class="card settings-card">
          <h2>👤 ${t('set_account')}</h2>
          <form class="set-form" data-form="name" novalidate>
            <label>${t('parentName')}<input class="input" name="name" maxlength="60" autocomplete="name" value="${esc(u.name)}" required></label>
            <p class="form-error" role="alert"></p>
            <div class="row"><button class="btn primary" type="submit">${t('save')}</button></div>
          </form>
          <form class="set-form" data-form="email" novalidate>
            <h3>✉️ ${t('email')}</h3>
            <p class="muted set-current">${esc(u.email)}</p>
            ${online && u.cloud.pendingEmail ? `<p class="note">${t('cl_emailPending', { email: esc(u.cloud.pendingEmail) })}</p>` : ''}
            <label>${t('set_newEmail')}<input class="input" type="email" name="email" autocomplete="email" required></label>
            ${pw('password', 'set_currentPassword', 'current-password')}
            <p class="form-error" role="alert"></p>
            <div class="row"><button class="btn primary" type="submit">${t('set_changeEmail')}</button></div>
          </form>
          <form class="set-form" data-form="password" novalidate>
            <h3>🔑 ${t('password')}</h3>
            ${pw('current', 'set_currentPassword', 'current-password')}
            ${pw('next', 'set_newPassword', 'new-password')}
            ${pw('confirm', 'set_confirmPassword', 'new-password')}
            <p class="muted small">${t(online ? 'cl_pw8' : 'err_password')}</p>
            <p><button type="button" class="link-btn" data-forgot>${t('cl_forgot')}</button></p>
            <p class="form-error" role="alert"></p>
            <div class="row"><button class="btn primary" type="submit">${t('set_changePassword')}</button></div>
          </form>
          <div class="set-form">
            <h3>🔒 ${t('pin_title')}</h3>
            <p class="muted small">${t('pin_hint')}</p>
            <div class="row"><button type="button" class="btn ghost" data-pin>${t(Store.hasPin(u) ? 'pin_change' : 'pin_set')}</button></div>
          </div>
        </article>

        <article class="card settings-card">
          <h2>🌍 ${t('language')}</h2>
          <div class="set-lang">${langMenu('lang-dd-wide')}</div>
          <p class="muted small">${t('set_languageHint')}</p>
        </article>

        <article class="card settings-card">
          <h2>🗂️ ${t('set_data')}</h2>
          <div class="set-row">
            <div><strong>${t('set_download')}</strong><p class="muted small">${t('set_downloadHint')}</p></div>
            <button type="button" class="btn ghost" data-download>⬇️ ${t('set_download')}</button>
          </div>
          <div class="set-row danger">
            <div><strong>${t('set_delete')}</strong><p class="muted small">${t('set_deleteHint')}</p>${online && paddlePaid(u) ? `<p class="small sub-delete-note">${t('del_rowHint')}</p>` : ''}</div>
            <button type="button" class="btn ghost danger-btn" data-delete-open aria-expanded="false">🗑️ ${t('set_delete')}</button>
          </div>
          ${offWarn}
          <form class="set-form delete-form" data-form="delete" hidden novalidate>
            ${online ? `<div data-del-step="1">
              <p class="delete-warn">⚠️ ${t('set_deleteHint')}</p>
              ${pw('password', 'set_deleteConfirm', 'current-password')}
              <p class="form-error" role="alert"></p>
              <div class="row"><button type="button" class="btn ghost" data-delete-cancel>${t('cancel')}</button><button class="btn primary" type="submit">${t('del_continue')}</button></div>
            </div>
            <div data-del-step="2" hidden>
              <h3 tabindex="-1">⚠️ ${t('del_alsoTitle')}</h3>
              <ul class="del-summary" data-del-summary></ul>
              <p class="small" data-del-refund hidden>${t('del_refund', { link: `<a href="${legalHref('refund.html')}">${t('refundPolicy')}</a>` })}</p>
              <div class="del-play" data-del-play hidden>
                <p class="small">${t('del_playText')}</p>
                <label class="check"><input type="checkbox" name="play_cancelled"> ${t('del_playConfirm')}</label>
              </div>
              <p class="form-error" role="alert"></p>
              <div class="row"><button type="button" class="btn ghost" data-delete-cancel>${t('cancel')}</button><button type="button" class="btn danger" data-del-final>${t('set_deleteBtn')}</button></div>
            </div>` : `<p class="delete-warn">⚠️ ${t('set_deleteHint')}</p>
            ${pw('password', 'set_deleteConfirm', 'current-password')}
            <p class="form-error" role="alert"></p>
            <div class="row"><button type="button" class="btn ghost" data-delete-cancel>${t('cancel')}</button><button class="btn danger" type="submit">${t('set_deleteBtn')}</button></div>`}
          </form>
        </article>

        <article class="card settings-card" id="help">
          <h2>ℹ️ ${t('parents_help')}</h2>
          ${helpLinks()}
        </article>
      </section>`;

    passwordToggles(app);
    bindSubscription(u);
    if (settingsAt) { const id = settingsAt; settingsAt = null; setTimeout(() => scrollToCard(id), 60); }
    const form = name => app.querySelector(`[data-form="${name}"]`);
    const fail = (f, key) => { f.querySelector('.form-error').textContent = t(key); };
    const ok = (f, key) => { f.querySelector('.form-error').textContent = ''; toast('✅ ' + t(key)); };
    const fields = f => Object.fromEntries(new FormData(f));
    const failCloud = (f, r) => { f.querySelector('.form-error').textContent = cloudErr(r); };
    app.querySelector('[data-forgot]').onclick = () => forgotPassword(u.email);
    app.querySelector('[data-pin]').onclick = () => KidLock.change(viewSettings);

    form('name').onsubmit = e => {
      e.preventDefault();
      const r = Store.updateName(fields(e.target).name);
      if (r.error) return fail(e.target, r.error);
      if (online) Cloud.updateAccount({ name: Store.currentUser().name });
      ok(e.target, 'set_saved'); renderTopbar();
    };
    form('email').onsubmit = async e => {
      e.preventDefault();
      const f = fields(e.target);
      if (online) {
        if (!f.email || !f.password) return fail(e.target, 'err_required');
        const btn = e.target.querySelector('[type=submit]'); busy(btn, true);
        const r = await Cloud.changeEmail(f.email.trim(), f.password);
        busy(btn, false);
        if (!r.ok) return failCloud(e.target, r);
        toast('📬 ' + t('cl_emailPending', { email: r.pending })); return viewSettings();
      }
      const r = Store.changeEmail(f.email, f.password);
      if (r.error) return fail(e.target, r.error);
      ok(e.target, 'set_emailChanged'); viewSettings();
    };
    form('password').onsubmit = async e => {
      e.preventDefault();
      const f = fields(e.target);
      if (!f.current || !f.next || !f.confirm) return fail(e.target, 'err_required');
      if (f.next !== f.confirm) return fail(e.target, 'err_match');
      if (online) {
        if (f.next.length < 8) return fail(e.target, 'cl_pw8');
        const btn = e.target.querySelector('[type=submit]'); busy(btn, true);
        const r = await Cloud.changePassword(f.current, f.next);
        busy(btn, false);
        if (!r.ok) return failCloud(e.target, r);
        e.target.reset(); return ok(e.target, 'set_passwordChanged');
      }
      const r = Store.changePassword(f.current, f.next);
      if (r.error) return fail(e.target, r.error);
      e.target.reset(); ok(e.target, 'set_passwordChanged');
    };
    bindLangMenu(app.querySelector('.set-lang .lang-dd'), code => { Store.setLang(code); I18N.setLang(code); if (online) Cloud.updateAccount({ lang: code }); viewSettings(); toast('✅ ' + t('set_saved')); });

    // Download my data: a JSON file (from the server for an online account, else made on this device).
    app.querySelector('[data-download]').onclick = async () => {
      const data = (online && await Cloud.exportData()) || Store.exportData();
      if (!data) return;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'intellokids-my-data-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast('✅ ' + t('set_downloaded'));
    };
    // Delete my account: opens a form that asks for the password first. Online (owner, 2026-11-15): 1) the password,
    // checked by the server (nothing changes yet); 2) what deleting also does (cancels the subscription now, removes
    // the saved card, deletes the children's progress; no refund for the rest of the period); 3) "Delete everything".
    const del = form('delete'), opener = app.querySelector('[data-delete-open]');
    const step = n => del.querySelectorAll('[data-del-step]').forEach(x => { x.hidden = x.dataset.delStep !== String(n); });
    const delErr = (key, r) => { const el = del.querySelector('[data-del-step]:not([hidden]) .form-error') || del.querySelector('.form-error'); el.textContent = r ? cloudErr(r) : t(key); };
    opener.onclick = () => { del.hidden = false; step(1); opener.setAttribute('aria-expanded', 'true'); del.querySelector('input').focus(); };
    del.querySelectorAll('[data-delete-cancel]').forEach(b => { b.onclick = () => { del.hidden = true; del.reset(); step(1); delPw = ''; del.querySelectorAll('.form-error').forEach(x => (x.textContent = '')); opener.setAttribute('aria-expanded', 'false'); opener.focus(); }; });
    let delPw = '', delPlay = false;
    const fin = del.querySelector('[data-del-final]');
    if (fin) fin.onclick = async () => {
      const box = del.querySelector('[name=play_cancelled]');
      if (delPlay && !box.checked) return delErr('del_playNeeded');
      busy(fin, true);
      const r = await Cloud.deleteAccount(delPw, delPlay && box.checked);
      busy(fin, false);
      if (!r.ok) {
        if (r.code === 'play_subscription_active') { delPlay = true; del.querySelector('[data-del-play]').hidden = false; }
        if (r.code === 'password_wrong') { step(1); delPw = ''; }
        return delErr(null, r);
      }
      toast('👋 ' + t('set_deleted')); go('#/');
    };
    del.onsubmit = async e => {
      e.preventDefault();
      if (online) {
        const pwv = fields(e.target).password;
        if (!pwv) return delErr('err_required');
        const btn = e.target.querySelector('[type=submit]'); busy(btn, true);
        const r = await Cloud.deleteCheck(pwv);
        busy(btn, false);
        if (!r.ok) return delErr(null, r);
        delPw = pwv; delPlay = r.play;
        const li = k => `<li>${t(k)}</li>`;
        del.querySelector('[data-del-summary]').innerHTML = (r.paddle ? li('del_cancelsSub') + li('del_removesCard') : '') + li('del_deletesProgress');
        del.querySelector('[data-del-refund]').hidden = !(r.paddle && !Store.inApp());
        del.querySelector('[data-del-play]').hidden = !r.play;
        step(2);
        const h = del.querySelector('[data-del-step="2"] h3'); if (h) h.focus();
        return;
      }
      const r = Store.deleteAccount(fields(e.target).password);
      if (r.error) return fail(e.target, r.error);
      toast('👋 ' + t('set_deleted')); go('#/');
    };
  }

  // The consent sentence for one child (owner, 2026-11-19), with a link to the Privacy Policy.
  function consentText(name) {
    return t('kid_consent', { name: name ? esc(name) : t('kid_consentThisChild'), privacy: `<a href="${legalHref('privacy.html')}" target="_blank" rel="noopener">${t('privacyPolicy')}</a>` });
  }
  // A redraw of the Parents' area that the parent didn't ask for (the end of a child's upload, which can take a while on
  // a slow network). Only while it is still on screen: the parent may have gone to Settings or Help meanwhile, and their
  // screen stays as it is. A child form the parent has started typing in is kept (open, values, focus, caret).
  function redrawParent(hash) {
    if (location.hash !== hash || !app.querySelector('.add-child')) return;
    const form = app.querySelector('.add-child'), el = document.activeElement;
    const edit = form.dataset.edit && Store.getChild(form.dataset.edit) ? form.dataset.edit : null;
    const keep = !form.hidden && (edit || Store.canAddChild()) && {
      edit, name: form.elements.name.value, age: form.elements.age.value, consent: form.elements.consent.checked,
      focus: form.contains(el) && el.name, caret: form.contains(el) && el.name === 'name' ? [el.selectionStart, el.selectionEnd] : null
    };
    viewParent();
    const f = app.querySelector('.add-child');
    if (!keep || !f) return;
    if (keep.edit) f._edit(keep.edit); else f.hidden = false;
    f.elements.name.value = keep.name; f.elements.age.value = keep.age; f.elements.consent.checked = keep.consent;
    if (!keep.edit) f.querySelector('[data-consent-text]').innerHTML = consentText(keep.name.trim());
    const back = keep.focus && f.elements[keep.focus];
    if (back && !document.querySelector('.modal-back')) {
      try { back.focus({ preventScroll: true }); if (keep.caret) back.setSelectionRange(keep.caret[0], keep.caret[1]); } catch (e) { /* ignore */ }
    }
  }
  function viewParent() {
    const u = Store.currentUser();
    if (!u) return go('#/login');
    if (needsPayment()) return;
    renderTopbar();
    const canAdd = Store.canAddChild(u);
    app.innerHTML = `
      <section class="page">
        <h1>${t('welcomeParent', { name: esc(u.name) })}</h1>
        ${trialCard(u)}
        ${limitsNote(u)}
        <div class="row between"><h2>${t('yourChildren')} ${kidsCount(u)}</h2><button type="button" class="btn primary" data-add${canAdd ? '' : ` disabled title="${t('kids_max', { n: Store.maxChildren() })}"`}>＋ ${t('addChild')}</button></div>
        ${canAdd ? '' : `<p class="note kids-full" role="note">ℹ️ ${t('kids_max', { n: Store.maxChildren() })}</p>`}
        <form class="card add-child" hidden novalidate>
          <h3 class="add-child-title" hidden></h3>
          <label>${t('childName')}<input class="input" name="name" maxlength="30" required></label>
          <label>${t('childAge')}
            <select class="input" name="age" required>
              <option value="">–</option>
              ${[3, 4, 5, 6, 7, 8, 9, 10].map(a => `<option value="${a}">${a} ${t('years')}</option>`).join('')}
            </select></label>
          <label class="check consent-check"><input type="checkbox" name="consent" value="1" required> <span data-consent-text>${consentText('')}</span></label>
          <p class="form-error" role="alert"></p>
          <div class="row"><button type="button" class="btn ghost" data-cancel>${t('cancel')}</button><button class="btn primary" type="submit">${t('save')}</button></div>
        </form>
        ${u.children.filter(c => !Store.hasConsent(c)).map(c => `<form class="card consent-ask" data-consent-for="${c.id}" novalidate>
          <h3>${t('kid_consentAskTitle', { name: esc(c.name) })}</h3>
          <label class="check consent-check"><input type="checkbox" name="consent" value="1" required> <span>${consentText(c.name)}</span></label>
          <p class="form-error" role="alert"></p>
          <div class="row"><button class="btn primary" type="submit">${t('kid_consentConfirm')}</button></div>
        </form>`).join('')}
        <div class="children">
          ${u.children.length ? u.children.map(c => `
            <article class="card child-card clickable" data-dash="${c.id}" tabindex="0" role="link" aria-label="${t('dash_title', { name: esc(c.name) })}">
              <div class="child-avatar">${avatarSvg(c)}</div>
              <div class="child-info">
                <h3>${esc(c.name)}</h3>
                ${BrainyChat.unseen(c).length ? `<p class="chat-badge ${BrainyChat.unseen(c).some(f => f.level === 'danger') ? 'danger' : ''}">💬 ${t('chatp_badge', { n: BrainyChat.unseen(c).length })}</p>` : ''}
                <p class="muted">${Store.currentAge(c)} ${t('years')} · ${t('age_' + Store.ageGroup(c))}</p>
              </div>
              <div class="child-actions">
                <a class="btn primary" href="#/kid/${c.id}">▶ ${t('play')}</a>
                <a class="btn ghost" href="#/parent/child/${c.id}">📊 ${t('progress')}</a>
                <span class="child-links">
                  <button type="button" class="link-btn" data-edit="${c.id}" aria-label="${t('kid_editTitle', { name: esc(c.name) })}">${t('kid_edit')}</button>
                  <button type="button" class="link-btn" data-remove="${c.id}">${t('remove')}</button>
                </span>
              </div>
            </article>`).join('') : `<p class="empty">${t('noChildren')}</p>`}
        </div>
        ${Feedback.enabled() ? `<section class="card fb-card parent-fb" id="feedback" data-parent-feedback></section>` : ''}
      </section>`;
    Feedback.mountCard(app.querySelector('[data-parent-feedback]'));
    if (toFeedback) {
      toFeedback = false;
      setTimeout(() => {
        const box = app.querySelector('#feedback');
        if (!box) return;
        box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const f = box.querySelector('h2, .fb-sent-line'); if (f) { f.tabIndex = -1; f.focus({ preventScroll: true }); }
      }, 80);
    }
    const form = app.querySelector('.add-child');
    const nameIn = form.querySelector('[name="name"]'), ageIn = form.querySelector('[name="age"]'), consentSpan = form.querySelector('[data-consent-text]');
    const title = form.querySelector('.add-child-title'), consentBox = form.querySelector('.consent-check');
    // The same form adds a child or edits one (owner, 2026-11-20: Edit next to Remove, prefilled, Save and Cancel).
    const addMode = () => {
      if (form.dataset.edit) { delete form.dataset.edit; form.reset(); consentSpan.innerHTML = consentText(''); }
      title.hidden = true; consentBox.hidden = false;
      ageIn.querySelectorAll('[data-extra]').forEach(o => o.remove());
      form.querySelector('.form-error').textContent = '';
    };
    const open = () => { if (!Store.canAddChild()) return viewParent(); addMode(); form.hidden = false; nameIn.focus(); };
    // Edit: the name and today's age. The consent stays (it is the same child), so its box is not shown.
    const openEdit = id => {
      const c = Store.getChild(id);
      if (!c) return;
      addMode();
      form.dataset.edit = id;
      title.textContent = t('kid_editTitle', { name: c.name }); title.hidden = false; consentBox.hidden = true;
      const age = Store.currentAge(c);
      if (!ageIn.querySelector(`option[value="${age}"]`)) ageIn.insertAdjacentHTML('beforeend', `<option value="${age}" data-extra>${age} ${t('years')}</option>`); // a child grown past 10
      nameIn.value = c.name; ageIn.value = String(age);
      form.hidden = false; form.scrollIntoView({ block: 'nearest' }); nameIn.focus();
    };
    form._edit = openEdit;
    app.querySelector('[data-add]').onclick = open;
    app.querySelector('[data-cancel]').onclick = () => {
      const id = form.dataset.edit;
      form.hidden = true; addMode();
      const b = id && app.querySelector(`[data-edit="${id}"]`); if (b) b.focus();
    };
    app.querySelectorAll('[data-edit]').forEach(b => b.onclick = e => { e.stopPropagation(); openEdit(b.dataset.edit); });
    if (!u.children.length) open();
    // The consent sentence names the child as the parent types the name.
    nameIn.addEventListener('input', () => { if (!form.dataset.edit) consentSpan.innerHTML = consentText(nameIn.value.trim()); });
    form.onsubmit = e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form));
      if (!f.name.trim() || !f.age) return (form.querySelector('.form-error').textContent = t('err_required'));
      if (form.dataset.edit) { // Save an edit: name and/or age (a new age moves the child to its age group; progress stays)
        const id = form.dataset.edit;
        Store.editChild(id, f.name, f.age);
        if (CLOUD && Store.isOnline()) Cloud.uploadNow(); // the server and the family's other devices get it now
        toast('✅ ' + t('set_saved'));
        viewParent();
        const b = app.querySelector(`[data-edit="${id}"]`); if (b) b.focus();
        return;
      }
      // Owner, 2026-11-19: no child without the parent's explicit consent (ticked box, recorded with the date and version).
      if (!f.consent) { form.querySelector('[name="consent"]').focus(); return (form.querySelector('.form-error').textContent = t('kid_consentErr')); }
      // The store refuses a child past IK_CONFIG.maxChildren (e.g. one was added in another tab meanwhile).
      const hadTrial = Store.trialStarted(u);
      if (!Store.addChild(f.name, f.age, Store.consentNow())) { toast(t('kids_max', { n: Store.maxChildren() })); return viewParent(); }
      const here = location.hash;
      const after = () => { if (PLANS && !hadTrial && Store.trialActive()) toast('🎁 ' + t('tr_started', { n: Store.trialDays() })); redrawParent(here); };
      // Online accounts: the child goes to the server at once, and the server starts the free week.
      if (CLOUD && Store.isOnline()) { viewParent(); Cloud.uploadNow().then(after); } else after();
    };
    // A child added before the consent checkbox existed: the parent is asked once, here, to confirm it.
    app.querySelectorAll('[data-consent-for]').forEach(fm => fm.onsubmit = e => {
      e.preventDefault();
      if (!fm.querySelector('[name="consent"]').checked) { fm.querySelector('.form-error').textContent = t('kid_consentErr'); return; }
      Store.giveConsent(fm.dataset.consentFor);
      viewParent();
    });
    app.querySelectorAll('[data-remove]').forEach(b => b.onclick = e => {
      e.stopPropagation();
      const c = u.children.find(x => x.id === b.dataset.remove);
      if (c && confirm(t('confirmRemove', { name: c.name }))) { if (CLOUD) Cloud.removeChild(c); Store.removeChild(c.id); viewParent(); }
    });
    // Clicking a child opens their progress dashboard (but not when pressing Play/Remove).
    app.querySelectorAll('[data-dash]').forEach(card => {
      const open = () => go('#/parent/child/' + card.dataset.dash);
      card.onclick = e => { if (!e.target.closest('a, button')) open(); };
      card.onkeydown = e => { if (e.key === 'Enter' && e.target === card) open(); };
    });
    app.querySelectorAll('[data-plans]').forEach(b => { b.onclick = toPlans; });
    if (Store.needsTerms(u)) showTermsModal(true);
    else trialPopups(u);
    KidLock.setup(); // children but no parent PIN yet: the parent chooses one now
  }

  // ---------- Paddle (payments on the website; owner, 2026-11-15) ----------
  // Paddle.js v2 is loaded only where it is needed: the plans screen (localized prices, checkout) and a payment link
  // (?_ptxn=, below). Never in the Android app (Google Play policy), never in the children's area.
  // The client-side token in config.js is public by design; the secret API key is never in the website.
  const PADDLE_JS = 'https://cdn.paddle.com/paddle/v2/paddle.js';
  // Why checkout can't open, or '' when the set-up is right: the environment must be exactly 'production' or
  // 'sandbox', and the token must match it (live_ with production, test_ with sandbox).
  function paddleProblem() {
    const cfg = IK_CONFIG.paddle || {}, env = cfg.environment, tok = String(cfg.clientToken || '');
    if (Store.inApp()) return 'Paddle is never used inside the Android app (Google Play Billing only).';
    if (env !== 'production' && env !== 'sandbox') return `IK_CONFIG.paddle.environment must be 'production' or 'sandbox', not ${JSON.stringify(env)}.`;
    if (!tok) return 'IK_CONFIG.paddle.clientToken is empty.';
    if (env === 'production' && !tok.startsWith('live_')) return 'A production checkout needs a live_ client-side token.';
    if (env === 'sandbox' && !tok.startsWith('test_')) return 'A sandbox checkout needs a test_ client-side token.';
    return '';
  }
  // The checkout the plans screen opened ({ plan, priceId, account }), so "checkout.completed" can be matched to it.
  let pendingCheckout = null;
  let paddleLoading = null;
  function loadPaddle() {
    const problem = paddleProblem();
    if (problem) { console.error('[IntelloKids] Paddle not started: ' + problem); return Promise.reject(new Error(problem)); }
    if (paddleLoading) return paddleLoading;
    const cfg = IK_CONFIG.paddle;
    paddleLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = PADDLE_JS;
      s.onload = () => {
        try {
          if (cfg.environment === 'sandbox') Paddle.Environment.set('sandbox'); // never in production
          // checkout.settings: the defaults for a checkout Paddle opens by itself (a ?_ptxn= payment link).
          Paddle.Initialize({ token: cfg.clientToken, eventCallback: onPaddleEvent,
            checkout: { settings: { displayMode: 'overlay', variant: 'one-page', locale: paddleLocale() } } });
          resolve(window.Paddle);
        } catch (e) { reject(e); }
      };
      s.onerror = () => { s.remove(); reject(new Error('Paddle.js could not be loaded')); };
      document.head.appendChild(s);
    });
    paddleLoading.catch(() => { paddleLoading = null; });  // try again next time (e.g. the network came back)
    return paddleLoading;
  }
  // Paddle.js events. The ONLY thing that unlocks is Paddle's real "checkout.completed" for a checkout the plans
  // screen opened, recorded by Store.recordPaddlePurchase (interim: the server's signed webhooks replace it).
  function onPaddleEvent(ev) {
    if (!ev || !ev.name) return;
    if (ev.name === 'checkout.completed') {
      const pc = pendingCheckout;
      if (pc && Store.recordPaddlePurchase(pc.plan, ev.data)) {
        pendingCheckout = null;
        // Paddle also sends the page to successUrl (#/welcome). Go there ourselves too, in case it doesn't.
        setTimeout(() => { if (location.hash !== '#/welcome') go('#/welcome'); }, 600);
      } else if (!pc && cardUpdate) {
        cardUpdate = false;
        toast('✅ ' + t('sub_cardUpdated'));
        if (CLOUD) setTimeout(() => Cloud.refresh(true).then(() => { if (location.hash === '#/settings') openSettingsAt('subscription'); }), 4000);
      } else if (!pc) {
        toast('✅ ' + t('ptxn_done'));   // a payment link or a payment-method update (?_ptxn=): nothing to unlock here
      } else {
        console.error('[IntelloKids] checkout.completed did not match the checkout we opened; nothing was unlocked.', ev.data && ev.data.transaction_id);
      }
    } else if (ev.name === 'checkout.closed') {
      if (!(ev.data && ev.data.status === 'completed')) { pendingCheckout = null; cardUpdate = false; }
    } else if (ev.name === 'checkout.error') {
      console.error('[IntelloKids] Paddle checkout error', ev.error || ev.data || '');
    }
  }
  const paddleLocale = () => (['en', 'fr', 'es'].includes(I18N.getLang()) ? I18N.getLang() : 'en');

  // Payment links: https://intellokids.com/?_ptxn=txn_… (Paddle's default payment link, set to the home page; it is
  // also used when a parent updates their payment method). Loading Paddle.js is all it takes: Paddle.Initialize reads
  // ?_ptxn= and opens that transaction's checkout by itself (an extra Checkout.open here could open it twice).
  const ptxn = (/[?&]_ptxn=(txn_[a-z0-9]+)/i.exec(location.search) || [])[1];
  function openPaymentLink() {
    if (!ptxn || Store.inApp()) return;
    loadPaddle().catch(e => { console.error('[IntelloKids] payment link', e); toast(t('pl_checkoutFail')); });
  }

  // The yearly plan's honest saving, worked out from the two display prices (so changing a price in config.js
  // updates it): { month: '$6.67', full: '$119.88', pct: 33 } for $79.99 a year against 12 × $9.99.
  // The currency sign and its place are taken from the yearly price. null if a price can't be read.
  function yearlyDeal(dp) {
    const num = x => { const m = /(\d+(?:[.,]\d{1,2})?)/.exec(String(x || '')); return m ? parseFloat(m[1].replace(',', '.')) : NaN; };
    const mo = num(dp && dp.monthly), yr = num(dp && dp.yearly);
    if (!(mo > 0 && yr > 0) || yr >= mo * 12) return null;
    const fmt = v => String(dp.yearly).replace(/(\d+(?:[.,]\d{1,2})?)/, v.toFixed(2));
    return { month: fmt(yr / 12), full: fmt(mo * 12), pct: Math.round((1 - yr / (mo * 12)) * 100) };
  }

  // ---------- Plans (#/plans): parents only, behind the parent gate ----------
  // Prices: Paddle's own localized prices (Paddle.PricePreview, shown exactly as Paddle formats them), with
  // IK_CONFIG.paddle.displayPrices as the fallback when Paddle can't be reached. "Subscribe" opens Paddle's checkout
  // while IK_CONFIG.payments.live is true; otherwise it says that online payment is opening soon.
  // In the Android app there are no prices and no Subscribe buttons, only a neutral line (Google Play policy).
  // The page never pressures: the free part is shown as a real choice, and the promise is next to the buttons.
  function viewPlans() {
    const u = Store.currentUser();
    if (!u) { try { sessionStorage.setItem('ik_after_login', '#/plans'); } catch (x) { /* ignore */ } return go('#/login'); }
    if (!gateOpen()) {
      renderTopbar();
      // The page's heading for screen readers while the grown-ups gate is open over it (a11y site test).
      app.innerHTML = `<section class="page pricing"><h1 class="sr-only">${t('pl_title')}</h1><p class="center muted">🔐 ${t('gate_title')}</p></section>`;
      return parentGate(() => viewPlans(), () => go('#/parent'));
    }
    renderTopbar();
    const p = IK_CONFIG.paddle, live = !!(IK_CONFIG.payments && IK_CONFIG.payments.live), inApp = Store.inApp();
    const paid = Store.hasPaid(u), active = Store.trialActive(u), n = Store.trialDaysLeft(u);
    const status = paid ? `✅ ${t('tr_paid', { plan: t('plan_' + (u.subscription.plan || 'yearly')) })}`
      : active ? `🎁 ${n === 1 ? t('tr_banner1') : n <= 0 ? t('tr_banner0') : t('tr_bannerN', { n })}`
      : Store.trialEnded(u) ? `🌱 ${t('pl_statusEnded')}` : `🎁 ${t('tr_pending', { n: Store.trialDays() })}`;
    // Both plans include the same things (owner's list, 2026-11-13). pl_f5 says "Works on phones, tablets and computers"
    // for now; it goes back to "Access across supported devices" once the online accounts are live (accounts are per device today).
    const feats = ['pl_f1', 'pl_f2', 'pl_f3', 'pl_f4', 'pl_f5', 'pl_f6'].map(k => `<li>✅ ${t(k, { n: Store.maxChildren() })}</li>`).join('');
    // What stays open without a subscription (the same switches as IK_CONFIG.limits; {} = an account with no trial).
    const L = IK_CONFIG.limits || {}, free = [];
    if (L.maxLevel != null) free.push(t('lim_levels', { n: L.maxLevel }));
    if (Array.isArray(L.videos)) free.push(t('pl_freeVideos'));
    if (L.colouring != null) free.push(t('lim_colour', { n: Store.openPictureCount({}) }));
    if (L.quizzes != null) free.push(t('lim_quizzes', { n: L.quizzes }));
    free.push(t('pl_freeProgress'));
    const onFree = !paid && !active;
    const freeCard = `<article class="card plan plan-free${onFree ? ' is-current' : ''}">
            ${onFree ? `<span class="badge badge-calm">${t('pl_current')}</span>` : ''}
            <h3>${t('pl_freeTitle')}</h3>
            <p class="price">${t('pl_freePrice')}</p>
            <p class="muted small plan-renew">${t('pl_freeSub')}</p>
            <ul>${free.map(x => `<li>🌱 ${x}</li>`).join('')}</ul>
          </article>`;
    if (inApp) {
      // Android app: no prices, no Subscribe, no link out to pay (Google Play Billing comes later).
      app.innerHTML = `
      <section class="page pricing plans-page plans-app">
        <div class="row between"><a class="btn ghost small" href="#/parent"><span class="flip-rtl">←</span> ${t('back')}</a><span></span></div>
        <h1 class="center">${t('pl_title')}</h1>
        <p class="plan-status center" role="status">${status}</p>
        <div class="card plan-promise" role="note"><p class="promise-main">📱 ${t('pl_appNote')}</p></div>
        <div class="plans plans-one">${freeCard}</div>
      </section>`;
      return;
    }
    const yearly = yearlyDeal(p.displayPrices);
    const plan = (id, price, per, extra, featured) => `<article class="card plan${featured ? ' featured' : ''}${paid && u.subscription.plan === id ? ' is-current' : ''}" data-plan-card="${id}">
        ${featured ? `<span class="badge">${yearly ? t('pl_save', { pct: yearly.pct }) : t('bestValue')}</span>` : ''}
        <h3>${t('plan_' + id)}</h3>
        <p class="price"><span class="price-amount" data-price="${id}">${esc(price)}</span><span>${t(per)}</span></p>
        ${extra ? `<p class="muted small plan-extra">${extra}</p>` : ''}
        <ul>${feats}</ul>
        ${paid ? '' : `<p class="plan-renew-terms" data-renew="${id}">${t(id === 'yearly' ? 'pl_renewY' : 'pl_renewM', { price: esc(price) })}</p>
        <button type="button" class="btn primary full" data-plan="${id}">${t('subscribe')}</button>`}
      </article>`;
    app.innerHTML = `
      <section class="page pricing plans-page">
        <div class="row between"><a class="btn ghost small" href="#/parent"><span class="flip-rtl">←</span> ${t('back')}</a><span></span></div>
        <h1 class="center">${t('pl_title')}</h1>
        <p class="center muted">${t('pl_sub', { n: Store.maxChildren() })}</p>
        <p class="plan-status center" role="status">${status}</p>
        <div class="card plan-promise" role="note">
          <p class="promise-main">🤝 ${t(CLOUD ? 'pl_promiseOnline' : 'pl_promise')}</p>
          <p class="muted small">${t('pl_promiseMore')}</p>
        </div>
        <div class="plans">
          ${freeCard}
          ${plan('monthly', p.displayPrices.monthly, 'perMonth', '', false)}
          ${plan('yearly', p.displayPrices.yearly, 'perYear', yearly ? t('pl_yearlyNote', { month: esc(yearly.month), full: esc(yearly.full) }) : '', true)}
        </div>
        ${live ? `<p class="center pay-methods">🔒 ${t('pl_payMethods')}</p>
        <p class="center muted small pay-secure">${t('pl_secure')}</p>` : ''}
        <p class="center muted small pay-legal">${t('pl_legal')} <a href="#/terms">${t('termsOfService')}</a> · <a href="#/terms">${t('privacyPolicy')}</a>${PAY ? ` · <a href="${legalHref('refund.html')}">${t('refundPolicy')}</a>` : ''}</p>
      </section>`;
    // Paddle's localized prices (currency and tax for the parent's country), shown exactly as Paddle formats them.
    // If Paddle can't be reached, the fallback prices above stay.
    if (live && !paid && !paddleProblem()) {
      const token = renderToken, ids = ['monthly', 'yearly'].filter(id => p.prices[id]);
      loadPaddle()
        .then(P => P.PricePreview({ items: ids.map(id => ({ priceId: p.prices[id], quantity: 1 })) }))
        .then(res => {
          if (token !== renderToken) return;   // the parent has left the plans screen
          const lines = (res && res.data && res.data.details && res.data.details.lineItems) || [];
          ids.forEach(id => {
            const li = lines.find(x => x.price && x.price.id === p.prices[id]);
            const total = li && li.formattedTotals && li.formattedTotals.total;
            if (!total) return;
            const amt = app.querySelector(`[data-price="${id}"]`), renew = app.querySelector(`[data-renew="${id}"]`);
            if (amt) amt.textContent = total;
            if (renew) renew.textContent = t(id === 'yearly' ? 'pl_renewY' : 'pl_renewM', { price: total });
            if (total !== p.displayPrices[id]) {   // another currency: the USD saving note doesn't fit, so hide it
              app.querySelectorAll('.plan-extra').forEach(x => x.remove());
              const badge = app.querySelector('.plan.featured .badge'); if (badge) badge.textContent = t('bestValue');
            }
          });
          const pg = app.querySelector('.plans-page'); if (pg) pg.classList.add('paddle-prices');
        })
        .catch(e => console.warn('[IntelloKids] Paddle prices not loaded, showing the fallback prices.', e && e.message));
    }
    app.querySelectorAll('[data-plan]').forEach(b => b.onclick = async () => {
      // Plans renew automatically until the parent cancels (owner, 2026-11-13); the trial never turns into a payment.
      // The renewal terms (price, period, "renews automatically", "cancel anytime") sit right above this button, as
      // US ROSCA / UK / EU rules require.
      if (!live) {
        const m = modal(`<div class="pay-soon"><div class="pay-soon-brainy">${Art.brainy({ mood: 'happy' })}</div>
          <h2>${t('paySoonTitle')}</h2><p>${t('pl_soonBody')}</p>
          <p class="pay-soon-email">✉️ <a href="mailto:help@intellokids.com">help@intellokids.com</a></p>
          <div class="row center"><button class="btn primary" data-x>${t('paySoonOk')}</button></div></div>`);
        m.el.querySelector('[data-x]').onclick = m.close;
        return;
      }
      const cur = Store.currentUser();
      // The parent accepts the current Terms (with the payment terms) before the first checkout.
      if (Store.needsTerms(cur)) return showTermsModal(true);
      const id = b.dataset.plan, priceId = p.prices[id];
      const problem = paddleProblem() || (priceId ? '' : `IK_CONFIG.paddle.prices.${id} is empty.`);
      if (problem) { console.error('[IntelloKids] Checkout not opened: ' + problem); return toast(t('pl_checkoutFail')); }
      b.disabled = true;
      try {
        const P = await loadPaddle();
        pendingCheckout = { plan: id, priceId, account: cur.email };
        P.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customer: { email: cur.email },
          customData: Object.assign({ account: cur.email, child_count: (cur.children || []).length },
            CLOUD && cur.cloud && cur.cloud.familyId ? { family_id: cur.cloud.familyId } : {}),
          settings: { displayMode: 'overlay', variant: 'one-page', locale: paddleLocale(), successUrl: p.successUrl }
        });
      } catch (e) {
        pendingCheckout = null;
        console.error('[IntelloKids] Checkout not opened', e);
        toast(t('pl_checkoutFail'));
      } finally { b.disabled = false; }
    });
  }

  // ---------- Thank-you screen (#/welcome), after Paddle's checkout.completed ----------
  // Shown only to a family whose Paddle purchase is recorded; anyone else goes to the Parents' area.
  function viewWelcome() {
    const u = Store.currentUser();
    if (!u) return go('#/login');
    if (!paddlePaid(u)) return go('#/parent');
    renderTopbar();
    const names = (u.children || []).map(c => esc(c.name));
    app.innerHTML = `
      <section class="page welcome-page">
        <div class="card welcome-card">
          <div class="pay-soon-brainy">${Art.brainy({ mood: 'happy' })}</div>
          <h1>🎉 ${t('wel_title')}</h1>
          <p class="welcome-plan"><strong>${t('tr_paid', { plan: t('plan_' + (u.subscription.plan || 'yearly')) })}</strong>${names.length ? ' ' + t('wel_kids', { names: names.join(', ') }) : ''}</p>
          <ul class="welcome-list">
            <li><span aria-hidden="true">📧</span> ${t('wel_receipt')}</li>
            <li><span aria-hidden="true">📱</span> ${t('wel_device')}</li>
            <li><span aria-hidden="true">✉️</span> ${t('wel_help')} <button type="button" class="link-btn" data-contact-open>${t('acct_contact')}</button></li>
          </ul>
          <div class="row center"><a class="btn primary big" href="#/parent">👪 ${t('wel_go')}</a></div>
        </div>
      </section>`;
  }

  // Children only: after the free week, one gentle note on the kid home (once per child). No prices, no buttons
  // to pay; "For grown-ups" goes through the parent gate.
  function kidTrialNote(kid) {
    if (!PLANS || !Store.trialEnded() || kid.trialOverSeen) return false;
    Store.updateChild(kid.id, c => { c.trialOverSeen = Date.now(); });
    const m = modal(`<div class="pay-soon kid-over"><div class="pay-soon-brainy">${Art.brainy({ mood: 'happy' })}</div>
      <h2>${t('tr_kidOverTitle')}</h2><p>${t('tr_kidOver')}</p>
      <div class="row center"><button type="button" class="btn primary big" data-x>🎮 ${t('tr_kidOk')}</button></div>
      <p class="grownup-link"><button type="button" class="btn ghost small" data-grownups>👪 ${t('tr_grownups')}</button></p></div>`);
    m.el.querySelector('[data-x]').onclick = m.close;
    m.el.querySelector('[data-grownups]').onclick = () => { m.close(); toPlans(); };
    GK.speak(t('tr_kidOverTitle') + ' ' + t('tr_kidOver'));
    return true;
  }

  // ---------- kid area ----------
  function viewFriendSetup(kid) {
    renderTopbar(kid);
    const f = { gender: 'girl', skin: 0, name: '' };
    app.innerHTML = `
      <section class="page friend-setup">
        <div class="setup-intro">
          <div class="setup-brainy">${Art.brainy({ mood: 'cheer' })}</div>
          <div class="bubble big">${t('friendIntro', { name: esc(kid.name) })}</div>
        </div>
        <h1 class="center">${t('createFriend')}</h1>
        <div class="setup-grid">
          <div class="setup-preview"></div>
          <div class="card setup-form">
            <div class="toggle" role="group">
              <button type="button" class="toggle-btn active" data-g="girl">👧 ${t('girl')}</button>
              <button type="button" class="toggle-btn" data-g="boy">👦 ${t('boy')}</button>
            </div>
            <p class="label">${t('skin')}</p>
            <div class="skins">${Art.SKINS.map((s, i) => `<button type="button" class="skin ${i === 0 ? 'active' : ''}" data-s="${i}" style="background:${s}" aria-label="${t('skin')} ${i + 1}"></button>`).join('')}</div>
            <input class="input big" maxlength="20" placeholder="${t('friendNamePh')}" aria-label="${t('friendNamePh')}">
            <p class="form-error" role="alert"></p>
            <button type="button" class="btn primary big full" data-go>${t('letsGo')} 🚀</button>
          </div>
        </div>
      </section>`;
    const preview = app.querySelector('.setup-preview');
    const draw = () => { preview.innerHTML = (kid.me ? `<div class="preview-me">${meSvg(kid)}</div>` : '') + Art.friend(f, STAGE[Store.ageGroup(kid)], 1) + `<div class="preview-brainy">${Art.brainy({})}</div>`; };
    draw();
    GK.speak(t('friendIntro_say'), t('friendIntro', { name: kid.name }));
    app.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
      f.gender = b.dataset.g; app.querySelectorAll('[data-g]').forEach(x => x.classList.toggle('active', x === b)); GK.sfx('tap'); draw();
    });
    app.querySelectorAll('[data-s]').forEach(b => b.onclick = () => {
      f.skin = +b.dataset.s; app.querySelectorAll('[data-s]').forEach(x => x.classList.toggle('active', x === b)); GK.sfx('tap'); draw();
    });
    app.querySelector('[data-go]').onclick = () => {
      const input = app.querySelector('.setup-form input');
      f.name = input.value.trim();
      if (!f.name) {
        app.querySelector('.form-error').textContent = t('friendNamePh') + ' ✏️';
        GK.bad(input); input.focus();
        return;
      }
      // Making the friend is an achievement ("Create your virtual friend"): its sticker shows right after.
      const b4 = Stickers.before(kid.id);
      Store.updateChild(kid.id, c => { c.friend = { gender: f.gender, skin: f.skin, name: f.name }; });
      const won = Stickers.check(kid.id, b4);
      friendStickers = won.length ? { id: kid.id, won, at: Date.now() } : null;
      GK.sfx('win'); go('#/kid/' + kid.id);
    };
  }

  // "This is me!": the child creates their own character first (look, skin, T-shirt colour).
  function viewMeSetup(kid) {
    renderTopbar(kid);
    const me = { gender: 'girl', skin: 0, shirt: 0 };
    app.innerHTML = `
      <section class="page friend-setup">
        <div class="setup-intro">
          <div class="setup-brainy">${Art.brainy({ mood: 'cheer' })}</div>
          <div class="bubble big">${t('meIntro', { name: esc(kid.name) })}</div>
        </div>
        <h1 class="center">${t('meTitle')}</h1>
        <div class="setup-grid">
          <div class="setup-preview"></div>
          <div class="card setup-form">
            <div class="toggle" role="group">
              <button type="button" class="toggle-btn active" data-g="girl">👧 ${t('girl')}</button>
              <button type="button" class="toggle-btn" data-g="boy">👦 ${t('boy')}</button>
            </div>
            <p class="label">${t('skin')}</p>
            <div class="skins">${Art.SKINS.map((s, i) => `<button type="button" class="skin ${i === 0 ? 'active' : ''}" data-s="${i}" style="background:${s}" aria-label="${t('skin')} ${i + 1}"></button>`).join('')}</div>
            <p class="label">${t('shirt')}</p>
            <div class="skins shirts">${Art.SHIRTS.map((s, i) => `<button type="button" class="skin ${i === 0 ? 'active' : ''}" data-shirt="${i}" style="background:${s}" aria-label="${t('shirt')} ${i + 1}"></button>`).join('')}</div>
            <button type="button" class="btn primary big full" data-go>${t('thatsMe')} ✨</button>
          </div>
        </div>
      </section>`;
    const preview = app.querySelector('.setup-preview');
    const draw = () => { preview.innerHTML = `<div class="preview-meonly">${meSvg(kid, me)}<span class="name-tag">${esc(kid.name)}</span></div><div class="preview-brainy">${Art.brainy({})}</div>`; };
    draw();
    GK.speak(t('meIntro_say'), t('meIntro', { name: kid.name }));
    const pick = (sel, key, attr) => app.querySelectorAll(sel).forEach(b => b.onclick = () => {
      me[key] = key === 'gender' ? b.dataset[attr] : +b.dataset[attr];
      app.querySelectorAll(sel).forEach(x => x.classList.toggle('active', x === b)); GK.sfx('tap'); draw();
    });
    pick('[data-g]', 'gender', 'g'); pick('[data-s]', 'skin', 's'); pick('[data-shirt]', 'shirt', 'shirt');
    app.querySelector('[data-go]').onclick = () => {
      Store.updateChild(kid.id, c => { c.me = { gender: me.gender, skin: me.skin, shirt: me.shirt }; });
      GK.sfx('win'); go('#/kid/' + kid.id);
    };
  }

  // "Your friend Thomas and Brainy are ready to play!" (the friend the child made), or "Brainy is ready to play!" if
  // there's no friend (yet). html: the friend's name escaped for the page. nameless: the recorded version, no name.
  function friendLine(kid, html, nameless) {
    const f = kid.friend, name = f && String(f.name || '').trim();
    if (!name) return t('brainyReady');
    const girl = f.gender === 'girl';
    if (nameless) return t(girl ? 'withFriendF_say' : 'withFriend_say');
    return t(girl ? 'withFriendF' : 'withFriend', { friend: html ? esc(name) : name });
  }

  // A name under a character: one line, smaller for long names, cut with "…" if it still doesn't fit (the full name
  // stays in the text and the tooltip), so it never covers the character's feet on phones (QA P2-12).
  const nameTag = n => { n = String(n || '').trim(); return `<span class="name-tag${n.length > 9 ? ' long' : ''}" title="${esc(n)}">${esc(n)}</span>`; };
  function viewKidHome(kid) {
    if (!kid.me) return viewMeSetup(kid);
    if (!kid.friend) return viewFriendSetup(kid);
    renderTopbar(kid);

    // One clear thing to do: a big Adventure map button. Everything else is a smaller picture tile.
    const tiles = [['quiz', '❓', 'menu_quiz', 't2'], ['colour', '🎨', 'menu_colour', 't3'], ['videos', '🎬', 'menu_videos', 't4'], ['stickers', '🦄', 'menu_stickers', 't5']];
    // Talk to Brainy: a tile, and Brainy in the scene can be tapped (unless a parent switched it off).
    // Only for children aged IK_CONFIG.brainyChat.minAge and over: younger children see neither, and no padlock.
    const chatOn = BrainyChat.forAge(kid) && BrainyChat.enabled(kid), chatOpen = Store.chatOpen();
    if (chatOn) tiles.push(['chat', '💬', 'menu_chat', 't6']); // right after Stickers (owner, 2026-11-08)
    // Locked for now (IK_CONFIG.limits): the tile shows a padlock and opens the "locked for now" screen.
    const held = { quiz: Store.quizzesLeft(kid) <= 0, chat: !chatOpen };
    const brainyScene = `${Art.brainy({ mood: 'cheer' })}<span class="name-tag">Brainy</span>`;
    app.innerHTML = `
      <section class="page kid-home">
        <div class="scene">
          <div class="scene-sky"><span class="cloud c1">☁️</span><span class="cloud c2">☁️</span><span class="sun">☀️</span></div>
          <div class="scene-chars">
            <div class="scene-friend scene-me">${meSvg(kid)}${nameTag(kid.name)}</div>
            <div class="scene-friend">${friendSvg(kid)}${nameTag(kid.friend.name)}</div>
            ${chatOn && chatOpen ? `<a class="scene-brainy talk" href="#/kid/${kid.id}/chat" aria-label="${t('menu_chat')}"><span class="talk-bubble" aria-hidden="true">💬 ${t('chat_talkToMe')}</span>${brainyScene}</a>`
              : `<div class="scene-brainy">${brainyScene}</div>`}
          </div>
          <div class="scene-ground"></div>
        </div>
        <h1 class="kid-hi">${t('hiKid', { name: esc(kid.name) })}</h1>
        <p class="kid-hi-sub">${friendLine(kid, true)}</p>
        <a class="tile t1 tile-main" href="#/kid/${kid.id}/map"><span class="tile-icon" aria-hidden="true">🗺️</span><span>${t('menu_map')}</span><span class="tile-go" aria-hidden="true"><span class="flip-rtl">▶</span></span></a>
        <div class="tiles tiles-small">
          ${tiles.map(([r, i, k, c]) => `<a class="tile ${c}${held[r] ? ' is-locked' : ''}" href="#/kid/${kid.id}/${r}"${held[r] ? ` aria-label="${t(k)} – ${t('locked')}"` : ''}><span class="tile-icon" aria-hidden="true">${i}</span><span>${t(k)}</span>${held[r] ? '<span class="tile-lock" aria-hidden="true">🔒</span>' : ''}</a>`).join('')}
        </div>
      </section>`;
    // Brainy says hello once per visit to the kid area, with the child's and the friend's names (not again when the
    // child comes back from a game, nor on a redraw). Saying hello never gives a sticker.
    if (greetedKid !== kid.id) {
      greetedKid = kid.id;
      GK.speakNamed(t('hiKid', { name: kid.name }) + ' ' + friendLine(kid, false), t('hiKid_say') + ' ' + friendLine(kid, false, true));
    }
    // No sticker check here: stickers come only at the moment something is completed (rule in stickers.js).
    // The one exception is the sticker just won by making the virtual friend on this screen, shown right after.
    // Both pop-ups wait for Brainy's hello to finish (it would be cut off otherwise; QA P1-5): the device voice or the
    // recorded line ending, or no sound at all, and never more than ~9 s.
    const afterHello = (fn, min) => setTimeout(() => {
      try { BrainyVoice.whenQuiet(fn, 9000); } catch (e) { fn(); }
    }, min);
    const fs = friendStickers; friendStickers = null;
    if (fs && fs.id === kid.id && Date.now() - fs.at < 10000) {
      const tk = renderToken;
      afterHello(() => { if (tk === renderToken) Stickers.celebrate(fs.won, modal); }, 600);
    } else {
      // After the free week: one gentle note (never stickers; nothing is awarded or taken away here).
      const tk = renderToken;
      afterHello(() => { if (tk === renderToken && !document.querySelector('.modal-back')) kidTrialNote(Store.getChild(kid.id) || kid); }, 600);
    }
  }

  // The 12 stops of one world page along its road: levels 1–5, the treasure chest after level 5, levels 6–10 and the
  // chest after level 10 (js/chests.js). Map units: 640 × 1000 on phones (vertical), 1000 × 640 on wider screens.
  const CHEST_STOPS = [5, 11];
  function mapStops(vertical) {
    return vertical
      ? [[110, 895], [280, 908], [450, 865], [555, 755], [420, 678], [250, 640], [110, 545], [200, 430], [370, 410], [530, 335], [450, 205], [290, 118]]
      : [[80, 530], [220, 560], [370, 520], [500, 450], [640, 520], [790, 560], [910, 450], [830, 320], [680, 270], [530, 230], [380, 170], [230, 110]];
  }
  function smoothPath(pts) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
    }
    return d;
  }

  // Map of one world (10 levels). worldArg is 1–10 from the address; default = the child's own world.
  // Every world can be browsed (owner, 2026-11-15: "they may be kept blocked, but they should be able to see"):
  // ◀ ▶ go through worlds 1 to 10, and worlds not reached yet show their scenery and levels, locked. Browsing changes
  // nothing: the airplane, mapSeen and the "new world" toast only belong to the child's own world, and no stars or
  // stickers are ever given here (stickers rule).
  function viewMap(kid, worldArg) {
    if (!kid.friend) return go('#/kid/' + kid.id);
    renderTopbar(kid);
    const group = Store.ageGroup(kid), nodes = mapFor(kid);
    const cur = currentNode(kid), curWorld = worldOf(cur);
    // lastWorld: the last world with a level open under IK_CONFIG.limits. Later worlds can be looked at, not played.
    let lastWorld = WORLDS - 1;
    while (lastWorld > 0 && !Store.levelOpen(lastWorld * PER_WORLD)) lastWorld--;
    // homeWorld: the child's own world ("📍 My level"), where the airplane and "Play" are.
    const homeWorld = Math.min(curWorld, lastWorld);
    let w = worldArg ? Number(worldArg) - 1 : homeWorld;
    if (!(w >= 0 && w < WORLDS)) w = homeWorld;
    const browsing = w !== homeWorld;
    const L = Store.limits();
    const first = w * PER_WORLD;
    // The strip under the title says why a world's levels are locked. Held by the free limits wins over "not reached yet".
    const lockStrip = L && L.maxLevel != null && L.maxLevel < LEVELS && w >= lastWorld
      ? `<p class="lock-strip">🔒 ${t(PLANS ? 'tr_kidLevels' : 'lock_levels', { n: L.maxLevel + 1 })}</p>`
      : w > curWorld ? `<p class="lock-strip">🔒 ${t('worldLocked', { n: first })}</p>` : '';
    const vertical = window.innerWidth < 700;
    const W = vertical ? 640 : 1000, H = vertical ? 1000 : 640;
    const stops = mapStops(vertical);
    const pts = stops.filter((p, s) => !CHEST_STOPS.includes(s));   // the 10 levels
    const seen = kid.mapSeen[group] != null ? kid.mapSeen[group] : cur;
    // The plane only appears in the world the child is currently playing (and only while that world is open).
    const showPlane = w === curWorld && curWorld <= lastWorld;
    const enteringNewWorld = showPlane && worldOf(seen) !== curWorld;
    const fromLocal = enteringNewWorld ? 0 : Math.min(seen, cur) - first;
    const curLocal = cur - first;
    const pct = p => `left:${p[0] / W * 100}%;top:${p[1] / H * 100}%`;
    const decoPos = vertical
      ? [[60, 800], [580, 600], [70, 300], [570, 110], [310, 560], [600, 960], [580, 470], [90, 90]]
      : [[90, 330], [270, 330], [920, 600], [940, 90], [600, 90], [470, 610], [620, 380], [80, 120]];
    const theme = THEMES[w];
    const worldName = t('w' + (w + 1));
    // ◀ ▶ are real links to the world pages ("Next world: Enchanted Forest"); only ◀ on world 1 and ▶ on world 10 are off.
    const arrow = (to, key, glyph) => to < 0 || to >= WORLDS
      ? `<button type="button" class="round-btn world-arrow disabled" disabled aria-label="${t(key)}"><span class="flip-rtl" aria-hidden="true">${glyph}</span></button>`
      : `<a class="round-btn world-arrow" href="#/kid/${kid.id}/map/${to + 1}" data-world aria-label="${t('map_' + key, { world: t('w' + (to + 1)) })}"><span class="flip-rtl" aria-hidden="true">${glyph}</span></a>`;
    // Under the title: "▶ Play" (the child's own level) in their own world; "📍 My level" (back there) in any other world.
    const action = browsing
      ? `<p class="center map-play"><a class="btn ghost big map-mine" href="#/kid/${kid.id}/map/${homeWorld + 1}" data-world>📍 ${t('map_myLevel')}</a></p>`
      : showPlane && Store.levelOpen(cur) ? `<p class="center map-play"><a class="btn primary big" href="#/kid/${kid.id}/play/${cur}">${Games[nodes[cur][0]].icon} ${t('play')} <span class="flip-rtl" aria-hidden="true">▶</span></a></p>` : '';
    app.innerHTML = `
      <section class="page map-page">
        <div class="kid-head map-head">
          <a class="round-btn" href="#/kid/${kid.id}" aria-label="${t('home')}">🏠</a>
          <div class="world-bar">
            ${arrow(w - 1, 'prevWorld', '◀')}
            <h1 class="world-name"><span aria-hidden="true">${theme.deco[0]}</span> ${worldName}</h1>
            ${arrow(w + 1, 'nextWorld', '▶')}
          </div>
        </div>
        ${action}
        ${lockStrip}
        <div class="map world-${w + 1} ${vertical ? 'vertical' : ''}" style="aspect-ratio:${W}/${H}">
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
            <path d="${smoothPath(stops)}" class="map-road"/><path d="${smoothPath(stops)}" class="map-road-dash"/>
          </svg>
          ${decoPos.map(([x, y], k) => `<span class="map-deco" style="${pct([x, y])}">${theme.deco[k]}</span>`).join('')}
          ${pts.map((p, k) => {
            const i = first + k, gid = nodes[i][0];
            // held (free limits) wins over "not reached yet": its padlock says "Ask a grown-up", never a price.
            const done = kid.completed[nodeKey(group, i)] || 0, held = !Store.levelOpen(i), open = !held && isUnlocked(kid, group, i);
            return `<a class="map-node ${done ? 'done' : ''} ${open ? '' : 'locked'} ${i === cur ? 'current' : ''} ${k === PER_WORLD - 1 ? 'boss' : ''}" style="${pct(p)}"
                      ${open ? `href="#/kid/${kid.id}/play/${i}"` : `${held ? 'data-lock' : 'data-notyet'} role="button" tabindex="0" aria-disabled="true"`} aria-label="${t('level')} ${i + 1}: ${t(Games[gid].title)}${open ? '' : ' – ' + t('locked')}">
                      <span class="node-icon">${open ? Games[gid].icon : '🔒'}</span><span class="node-num">${i + 1}</span>
                      ${done ? `<span class="node-stars">${'★'.repeat(done)}${'☆'.repeat(3 - done)}</span>` : ''}
                    </a>`;
          }).join('')}
          ${Chests.mapMarkup(kid, w, CHEST_STOPS.map(s => stops[s]), pct)}
          ${showPlane ? `<div class="map-plane" style="${pct(pts[Math.max(0, fromLocal)])}">✈️</div>` : ''}
        </div>
      </section>`;
    // Moving between worlds replaces the address, so the phone's Back button leaves the map in one step.
    app.querySelectorAll('[data-world]').forEach(a => { a.onclick = e => { e.preventDefault(); location.replace(a.getAttribute('href')); }; });
    // Locked levels and chests answer a tap, Enter or Space with a friendly line (never a price).
    const onTap = (el, fn) => {
      el.onclick = e => { e.preventDefault(); fn(); };
      el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } };
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    };
    app.querySelectorAll('[data-lock]').forEach(el => onTap(el, lockNote));
    // A level not reached yet: a gentle "Finish level N first!" (N = the level to play now), said by Brainy (QA P2-7).
    app.querySelectorAll('[data-notyet]').forEach(el => onTap(el, () => {
      const msg = t('map_finishFirst', { n: Math.min(LEVELS, cur + 1) }); GK.sfx('tap'); toast('🔒 ' + msg); GK.speak(msg);
    }));
    Chests.bindMap(app, kid, toast);
    if (showPlane) {
      const plane = app.querySelector('.map-plane');
      if (enteringNewWorld) { toast('🎉 ' + t('newWorld', { world: worldName })); GK.speak(t('newWorld', { world: worldName })); }
      if (fromLocal !== curLocal) {
        // Fly the airplane to the new level.
        setTimeout(() => { plane.style.left = pts[curLocal][0] / W * 100 + '%'; plane.style.top = pts[curLocal][1] / H * 100 + '%'; GK.sfx('win'); }, 400);
      }
      Store.updateChild(kid.id, c => { c.mapSeen[group] = cur; });
    }
  }

  // opts: { levelNum, nextHref } for adventure levels
  // diff: { d, p, age } from difficultyFor()
  function startGame(kid, gid, diff, key, backHref, opts) {
    opts = opts || {};
    const token = renderToken;
    const G = Games[gid], group = Store.ageGroup(kid);
    const toMap = backHref.includes('/map');
    const backBtn = `<a class="round-btn" href="${backHref}" aria-label="${t(toMap ? 'backToMap' : 'home')}">${toMap ? '🗺️' : '🏠'}</a>`;
    // Adventure levels show which level this is (owner, 2026-11-11): a "Level 5" pill by the game's name.
    const lvl = opts.levelNum;
    const title = lvl
      ? `<h1 class="play-title"><span class="level-pill">${t('levelN', { n: lvl })}</span> <span class="play-name">${G.icon} ${t(G.title)}</span></h1>`
      : `<h1>${G.icon} ${t(G.title)}</h1>`;
    app.innerHTML = `
      <section class="page play">
        <div class="kid-head">${backBtn}${title}</div>
        <div class="game-root card"></div>
        <div class="play-buddies">${kid.me ? `<div>${meSvg(kid)}</div>` : ''}<div>${friendSvg(kid)}</div></div>
      </section>`;
    GK.beginTrack();
    // Fair stars: the youngest children may make one mistake and still get 3 stars.
    GK.setLeniency(diff.age <= 4 ? 1 : 0);
    G.start(app.querySelector('.game-root'), {
      difficulty: diff.d, level: diff.p, age: diff.age, group, child: kid,
      finish(stars) {
        if (token !== renderToken) return; // player left the game
        const tr = GK.endTrack();
        const stats = tr ? { game: gid, ms: tr.ms, answers: tr.answers, mistakes: tr.mistakes, missed: tr.missed } : null;
        // The game is finished with a result: the one moment a game can win stickers (rule in stickers.js).
        const b4 = Stickers.before(kid.id);
        const res = Store.recordResult(kid.id, key, stars, stats);
        const won = Stickers.check(kid.id, b4);
        const fresh = Store.getChild(kid.id);
        renderTopbar(fresh);
        GK.sfx('win');
        const m = modal(`
          <div class="result">
            <div class="result-chars">${fresh.me ? `<div>${meSvg(fresh)}</div>` : ''}<div>${friendSvg(fresh)}</div><div>${Art.brainy({ mood: 'cheer' })}</div></div>
            ${lvl ? `<p class="level-done"><span class="level-done-tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>${t('levelDone', { n: lvl })}</p>` : ''}
            <h2>${t('greatJob')}</h2>
            <p class="result-stars" aria-label="${t('youEarned', { n: stars })}">${'<span class="on">★</span>'.repeat(stars)}${'<span>★</span>'.repeat(3 - stars)}</p>
            ${res.levelUp ? `<p class="level-up">🎉 ${t('levelUp', { friend: esc(fresh.friend.name) })}</p>` : ''}
            ${won.length ? `<button type="button" class="gift-btn" data-gift>🎁 ${t('giftOne')}</button>` : ''}
            <div class="row center result-actions">
              <button type="button" class="round-btn" data-again aria-label="${t('playAgain')}" title="${t('playAgain')}">🔄</button>
              <a class="round-btn${opts.nextHref ? '' : ' primary'}" href="${backHref}" data-back aria-label="${t(toMap ? 'backToMap' : 'home')}" title="${t(toMap ? 'backToMap' : 'home')}">${toMap ? '🗺️' : '🏠'}</a>
              ${opts.nextHref ? `<a class="btn primary big${opts.nextChest ? ' next-chest' : ''}" href="${opts.nextHref}" data-back>${opts.nextChest ? `<span class="chest-mini" aria-hidden="true">${Chests.art('ready', { mini: true })}</span> ${t('chest_title')}` : t('nextLevel')} <span class="flip-rtl">▶</span></a>` : ''}</div>
          </div>`);
        GK.speak((lvl ? t('levelDone', { n: lvl }) + ' ' : '') + t('greatJob') + ' ' + t('youEarned', { n: stars }) + (won.length ? ' ' + t('giftOne') : '')); // one sticker per moment at most
        const gift = m.el.querySelector('[data-gift]');
        if (gift) gift.onclick = () => { gift.remove(); Stickers.celebrate(won, modal); };
        m.el.querySelector('[data-again]').onclick = () => { m.close(); render(); };
        m.el.querySelectorAll('[data-back]').forEach(b => b.onclick = () => m.close());
      }
    });
  }

  function viewPlay(kid, idx) {
    if (!kid.friend) return go('#/kid/' + kid.id);
    const group = Store.ageGroup(kid), node = mapFor(kid)[idx];
    if (!node) return go(`#/kid/${kid.id}/map`);
    if (!Store.levelOpen(idx)) return viewLocked(kid, `#/kid/${kid.id}/map`);
    if (!isUnlocked(kid, group, idx)) return go(`#/kid/${kid.id}/map`);
    renderTopbar(kid);
    // After level 5, 10, 15 … "Next" leads to the treasure chest on the road (until its game has been played once);
    // the chest's own Next / Skip then go on to the following level.
    if (window.Cloud) Cloud.track('level', nodeKey(group, idx), kid.id);
    const chest = Chests.nextAfterLevel(kid, idx);
    const next = chest || (idx + 1 < LEVELS && Store.levelOpen(idx + 1) ? `#/kid/${kid.id}/play/${idx + 1}` : null);
    startGame(kid, node[0], difficultyFor(kid, idx), nodeKey(group, idx), `#/kid/${kid.id}/map/${worldOf(idx) + 1}`, { levelNum: idx + 1, nextHref: next, nextChest: !!chest });
  }

  function viewQuiz(kid) {
    if (!kid.friend) return go('#/kid/' + kid.id);
    if (Store.quizzesLeft(kid) <= 0) return viewLocked(kid);
    renderTopbar(kid);
    startGame(kid, 'quiz', difficultyFor(kid, currentNode(kid)), 'quiz:' + Store.ageGroup(kid), `#/kid/${kid.id}`);
  }

  // Kids' pages: a big round 🏠 button and the page name with its picture. No small print.
  // hideTitle: the page already shows its own big title (the chat's header), so the h1 is for screen readers only.
  function pageHead(kid, icon, title, hideTitle) {
    return `<div class="kid-head"><a class="round-btn" href="#/kid/${kid.id}" aria-label="${t('home')}">🏠</a><h1${hideTitle ? ' class="sr-only"' : ''}>${icon} ${t(title)}</h1></div>`;
  }

  // Talk to Brainy (js/brainy-chat.js): answered on this device, filtered for safety, visible to parents.
  function viewChat(kid) {
    // Too young for the chat (IK_CONFIG.brainyChat.minAge): quietly back home, without adding a step to "Back".
    if (!BrainyChat.forAge(kid)) return location.replace('#/kid/' + kid.id);
    if (!Store.chatOpen()) return viewLocked(kid);
    if (!BrainyChat.enabled(kid)) { toast('🔒 ' + t('chat_off')); return go('#/kid/' + kid.id); }
    renderTopbar(kid);
    app.innerHTML = `<section class="page chat-page">${pageHead(kid, '💬', 'chatTitle', true)}<div class="card chat-root"></div></section>`;
    BrainyChat.render(app.querySelector('.chat-root'), kid);
  }

  function viewColour(kid) {
    renderTopbar(kid);
    app.innerHTML = `<section class="page">${pageHead(kid, '🎨', 'colourTitle')}<div class="card colour-root"></div></section>`;
    Colouring.render(app.querySelector('.colour-root'), kid, {
      onLocked: lockNote, // a picture that is locked for now
      // A finished picture can unlock creative stickers. It counts the first time it is finished, and again
      // only after "Start again" (pressing "I'm done" again on the same colours is not a new picture).
      // Taps and coloured parts never count. before() runs just before the finished picture is saved.
      before: () => Stickers.before(kid.id),
      onFinish(pic, counted, b4) {
        if (!counted) return;
        Store.addTally(kid.id, 'pictures');
        const won = Stickers.check(kid.id, b4);
        if (won.length) setTimeout(() => Stickers.celebrate(won, modal), 1400);
      }
    });
  }

  // Videos for the child's own age only (owner, 2026-11-12): the same three groups, icons and colours as the home
  // page (js/landing.js). ageRange() gives '3–4', '5–6' or '7–10'.
  const VIDEO_GROUPS = { tiny: '🧸', junior: '🧠', explorer: '🚀' };
  const ageRange = g => ({ tiny: '3–4', junior: '5–6', explorer: '7–10' })[g];
  // The small subject chip on a video card (IK_CONFIG.videos[].subject). Unknown subjects show no chip.
  const VIDEO_SUBJECTS = { science: '🔬', maths: '🔢', words: '🔤', world: '🌍', feelings: '💛', creative: '🎨', coding: '💻' };

  function viewVideos(kid) {
    renderTopbar(kid);
    // Each child sees the videos of their own age group and nothing else: no tabs, no way to another age.
    // The group is worked out from the child's age every time the page opens (Store.ageGroup: the age grows by
    // one each year), never saved, so the page moves on by itself when the child grows into the next group.
    // On the page: the playable videos, then the finished ones locked for now (IK_CONFIG.limits) with a big
    // padlock, then the planned videos as "Coming soon" cards (no file yet; IK_CONFIG.videosComingSoon: false hides them).
    const group = Store.ageGroup(kid);
    const mine = v => v.group === group;
    const soon = IK_CONFIG.videosComingSoon !== false;
    const rank = v => !v.url ? 2 : Store.videoOpen(v.id) ? 0 : 1;
    const vids = IK_CONFIG.videos.filter(v => mine(v) && (v.url || soon)).sort((a, b) => rank(a) - rank(b));
    const done = vids.filter(v => v.url), planned = vids.filter(v => !v.url);
    const lang = I18N.getLang();
    // Each video plays in the site language when that version exists (IK_CONFIG.videos[].langs), else the main one.
    const pick = v => (v.langs || []).includes(lang)
      ? { url: `videos/${lang}/${v.id}.mp4`, poster: `videos/${lang}/${v.id}.jpg`, lang }
      : { url: v.url, poster: v.poster, lang: v.lang };
    // A video in another language shows that language's flag instead of words.
    const flagOf = code => (IK_CONFIG.languages.find(l => l.code === code) || {}).flag;
    const chip = v => VIDEO_SUBJECTS[v.subject] ? `<span class="subj-chip"><span aria-hidden="true">${VIDEO_SUBJECTS[v.subject]}</span> ${t('vs_' + v.subject)}</span>` : '';
    const card = v => {
      const held = rank(v) === 1, s = pick(v), foreign = s.lang && s.lang !== lang;
      // The flag shows on locked cards too (top corner; the padlock sits in the middle), so a parent can see which
      // videos are only in English before unlocking them (QA P1-3).
      return `
        <button type="button" class="card video${held ? ' is-locked' : ''}" data-v="${v.id}"${held ? ` aria-label="${t('v_' + v.id)} – ${t('locked')}${foreign ? ' – ' + t('videoInEnglish') : ''}"` : ''}>
          <span class="video-thumb">${s.poster
            ? `<img src="${esc(s.poster)}" alt="" width="640" height="360" loading="lazy">`
            : v.emoji}${held ? '<span class="video-lock" aria-hidden="true">🔒</span>' : '<span class="play-icon" aria-hidden="true">▶</span>'}
            ${foreign ? `<span class="video-lang" title="${t('videoInEnglish')}"><span class="sr-only">${t('videoInEnglish')}</span>${Art.flag(flagOf(s.lang))}</span>` : ''}</span>
          <strong>${t('v_' + v.id)}</strong>${chip(v)}
        </button>`;
    };
    // A planned video: a picture made from the group's colour and the video's emoji, a "Coming soon" badge, the title.
    const soonCard = v => `
        <button type="button" class="card video is-soon" data-v="${v.id}" aria-label="${t('v_' + v.id)} – ${t('comingSoon')}">
          <span class="video-thumb soon-thumb"><span class="soon-emoji" aria-hidden="true">${v.emoji || '🎬'}</span><span class="soon-badge" aria-hidden="true">✨ ${t('comingSoon')}</span></span>
          <strong>${t('v_' + v.id)}</strong>${chip(v)}
        </button>`;
    app.innerHTML = `<section class="page">${pageHead(kid, '🎬', 'videosTitle')}
      <div class="vpanel g-${group}">
        <h2 class="vgroup"><span class="vgroup-icon" aria-hidden="true">${VIDEO_GROUPS[group]}</span> ${t('age_' + group)} <small>· ${t('v_ages', { a: ageRange(group) })}</small></h2>
        ${done.length ? `<div class="video-grid">${done.map(card).join('')}</div>` : ''}
        ${planned.length ? `<h3 class="soon-head"><span aria-hidden="true">🎬</span> ${t('comingSoon')}</h3>
        <p class="soon-sub">${t('v_soonSub')}</p>
        <div class="video-grid soon-grid">${planned.map(soonCard).join('')}</div>` : ''}
        ${vids.length ? '' : `<p class="empty card">🎬 ${t('comingSoon')}</p>`}
      </div></section>`;
    app.querySelectorAll('[data-v]').forEach(b => b.onclick = () => {
      // Only this child's age group can be opened, whatever id the page is asked for.
      const v = IK_CONFIG.videos.find(x => x.id === b.dataset.v);
      if (!v || !mine(v)) return;
      if (!v.url) return toast(t('v_soonToast') + ' 🎬');
      if (!Store.videoOpen(v.id)) return lockNote();
      if (window.Cloud) Cloud.track('video', v.id, kid.id);
      const s = pick(v);
      // Under the video, a "Talk about it" question for the grown-up watching along (vq_<id>). When the video ends,
      // an end card with one thing to try away from the screen (va_<id>), "Watch again" and "Back" (owner, 2026-11-12).
      // Nothing plays next on its own, and watching or finishing a video never awards stars or stickers.
      const has = k => I18N.hasKey(lang, k) || I18N.hasKey('en', k);
      const m = modal(`<div class="vplayer">
        <video src="${esc(s.url)}"${s.poster ? ` poster="${esc(s.poster)}"` : ''} controls autoplay playsinline preload="metadata" controlslist="nodownload" style="width:100%;border-radius:16px;background:#000"></video>
        <div class="vend" tabindex="-1" hidden>
          <div class="vend-brainy" aria-hidden="true">${Art.brainy({ mood: 'happy' })}</div>
          <h3>🌟 ${t('v_endTitle')}</h3>
          ${has('va_' + v.id) ? `<p class="vend-lead">${t('v_endLead')}</p><p class="vend-try"><span aria-hidden="true">🏡</span> ${t('va_' + v.id)}</p>` : ''}
          <div class="row center"><button class="btn primary" data-again>▶ ${t('v_again')}</button><button class="btn ghost" data-x>${t('back')}</button></div>
        </div>
        ${has('vq_' + v.id) ? `<aside class="talk-card"><strong>💬 ${t('v_talk')}</strong><p>${t('vq_' + v.id)}</p></aside>` : ''}
        <div class="row center vplayer-back"><button class="btn primary" data-x>${t('back')}</button></div>
      </div>`, { label: t('v_' + v.id) });
      const end = m.el.querySelector('.vend'), backRow = m.el.querySelector('.vplayer-back');
      m.el.querySelectorAll('[data-x]').forEach(x => x.onclick = m.close);
      // The video's events are caught on the pop-up (they don't bubble), so they still arrive when the Android
      // app swaps the player for a fresh one after "Try again" (app-shell/ik-native.js).
      // Parents see "Watched …" in the child's recent activity.
      m.el.addEventListener('play', () => {
        Store.updateChild(kid.id, c => { c.videos = c.videos || {}; c.videos[v.id] = Date.now(); });
      }, { once: true, capture: true });
      m.el.addEventListener('ended', e => {
        const video = e.target;
        try { if (document.fullscreenElement) document.exitFullscreen(); else if (video.webkitDisplayingFullscreen) video.webkitExitFullscreen(); } catch (err) { /* ignore */ }
        video.hidden = true; backRow.hidden = true; end.hidden = false; end.focus();
      }, true);
      m.el.querySelector('[data-again]').onclick = () => {
        const video = m.el.querySelector('video');
        end.hidden = true; backRow.hidden = false;
        if (!video) return;
        video.hidden = false; video.currentTime = 0;
        video.play().catch(() => { /* the child can press play */ });
      };
    });
  }

  // Treasure chest after every 5 levels (js/chests.js): opening moment, the child's arcade game, result.
  function viewChest(kid, k) {
    if (!kid.friend) return go('#/kid/' + kid.id);
    renderTopbar(kid);
    Chests.view(app, kid, k, {
      modal, toast, go, lockNote,                                // chests behind a level held by the free limits
      onReward() { renderTopbar(Store.getChild(kid.id)); },   // +3 stars in the top bar
      before: () => Stickers.before(kid.id),                    // a chest game WON can win stickers (e.g. "Treasure Hunter"),
      checkStickers: b4 => Stickers.check(kid.id, b4),          // shown on its result screen; opening or losing wins nothing
      celebrate: won => Stickers.celebrate(won, modal)
    });
  }

  function viewStickers(kid) {
    renderTopbar(kid);
    app.innerHTML = `<section class="page album">${pageHead(kid, '🦄', 'stickersTitle')}<div class="album-root"></div></section>`;
    // Wait for the child's age album (a small file, loaded once). Without it (offline) the album still shows the rest.
    // Looking at the album never awards anything (stickers come only when something is completed).
    const tk = renderToken;
    Stickers.loadFor(kid).then(() => {
      if (tk === renderToken) Stickers.album(app.querySelector('.album-root'), Store.getChild(kid.id), modal);
    });
  }

  // Coloured parts (taps) no longer count for anything: stickers count finished pictures (viewColour).

  // ---------- router ----------
  function render() {
    // Kid lock (js/pin.js): while this device is locked to a child, nothing outside their playground opens without the
    // PIN, and the child's screen stays as it is (a game keeps going). So this comes before anything is stopped.
    I18N.setLang(Store.getLang() || detectLang());
    if (KidLock.guard()) return;
    renderToken++;
    if (window.Arcade) Arcade.stop(); // a treasure-chest game stops when the child leaves it
    try { BrainyVoice.stop(); } catch (e) { /* ignore */ }
    document.querySelectorAll('.modal-back').forEach(m => m.remove());
    let lang = Store.getLang();
    const [path, query] = location.hash.replace(/^#\/?/, '').split('?');
    const parts = path.split('/').filter(Boolean);
    const q = {};
    new URLSearchParams(query || '').forEach((v, k) => { q[k] = v; });
    // An emailed link (#/verify?token=…&lang=fr) opened in a browser with no language chosen yet: the family's language.
    if (!lang && q.lang && I18N.has(q.lang)) { lang = q.lang; Store.setLang(lang); }
    if (parts[0] !== 'kid' || parts[1] !== greetedKid) greetedKid = null; // left the kid area: say hello next time
    if (parts[0] === 'language') {
      I18N.setLang(lang || detectLang()); metaFor('language'); return viewLanguage();
    }
    I18N.setLang(lang || detectLang());
    window.scrollTo(0, 0);
    Store.ensureTrial(); // accounts from before the trial get theirs now (once they have a child)
    metaFor(parts[0] === undefined ? 'landing' : ['pricing', 'terms', 'signup', 'login', 'feedback'].includes(parts[0]) ? parts[0] : 'private');

    // Email first (owner, 2026-11-16): with online accounts, a parent whose email isn't confirmed yet only sees
    // "Check your email" (and the log-in, sign-up, password and Terms pages). No Parents' area, children, play or plans.
    // The server refuses the same (no session before confirmation). Backend off: unchanged.
    if (CLOUD && Cloud.pending() && !['signup', 'login', 'check-email', 'verify', 'forgot', 'reset', 'terms'].includes(parts[0])) {
      location.replace('#/check-email'); return;
    }
    switch (parts[0]) {
      // A logged-in parent's home page is the Parents' area (owner, 2026-11-15); visitors (and search engines) get
      // the landing page. The static SEO pages (/fr/, /games/ ...) stay public pages.
      case undefined: if (Store.currentUser()) { location.replace('#/parent'); return; } return viewLanding();   // replace: Back doesn't bounce
      case 'signup': return viewAuth('signup');
      case 'login': return viewAuth('login');
      case 'check-email': return viewCheckEmail();
      case 'verify': return CLOUD ? viewVerifyLink(q) : go('#/');
      case 'forgot': return viewForgot();
      case 'reset': return CLOUD ? viewReset(q) : go('#/login');
      case 'parent': return parts[1] === 'child' ? viewChildDashboard(parts[2]) : viewParent();
      case 'progress': return viewFamily();
      case 'settings': return viewSettings();
      case 'feedback': return viewFeedback();
      case 'plans': return PLANS ? viewPlans() : go('#/parent');
      case 'welcome': return viewWelcome();
      // The public Pricing page is a static page; signed-in parents get their plans screen.
      case 'pricing':
        if (!Store.currentUser() && PAY && !Store.inApp()) { location.href = pricingHref(); return; }
        return go(PLANS ? '#/plans' : '#/');
      case 'terms': return viewTerms();
      case 'kid': {
        if (!Store.currentUser()) return go('#/login');
        const kid = Store.getChild(parts[1]);
        if (!kid) return go('#/parent');
        if (!Store.hasAccess()) return viewAskGrownup(kid);
        Stickers.loadFor(kid); // get the child's sticker album ready in the background
        switch (parts[2]) {
          case undefined: return viewKidHome(kid);
          case 'map': return viewMap(kid, parts[3]);
          case 'play': return viewPlay(kid, Number(parts[3]));
          case 'quiz': return viewQuiz(kid);
          case 'colour': return viewColour(kid);
          case 'chat': return viewChat(kid);
          case 'videos': return viewVideos(kid);
          case 'stickers': return viewStickers(kid);
          case 'chest': return viewChest(kid, Number(parts[3]));
          default: return go('#/kid/' + kid.id);
        }
      }
      default: return go('#/');
    }
  }

  // A saved language that is no longer offered (German and Chinese, parked 2026-11-13) is forgotten, so the
  // visitor gets the browser's language (or English) and the language bar on the home page to choose again.
  const savedLang = Store.getLang();
  if (savedLang && !I18N.has(savedLang)) Store.setLang(null);

  // Links from the static SEO pages open the app in that page's language, e.g. /?lang=fr#/signup.
  // Remember the choice, then tidy the address bar.
  // A language that isn't offered (an old /?lang=de or zh link) falls back as usual and is taken out of the address too (QA P2-14).
  const urlLang = (/[?&]lang=([a-z]{2})\b/.exec(location.search) || [])[1];
  if (urlLang) {
    if (I18N.has(urlLang)) Store.setLang(urlLang);
    try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* file:// */ }
  }

  KidLock.init({ modal, toast, parentGate });
  window.addEventListener('hashchange', render);
  render();
  openPaymentLink();   // ?_ptxn=txn_... (Paddle payment links and payment-method updates)
})();
