/* IntelloKids app: routing, pages, adventure map and (switched-off) payments. */
(function () {
  const app = document.getElementById('app');
  const topbar = document.getElementById('topbar');
  const esc = Art.esc;
  // Payments are off (IK_CONFIG.payments.enabled): no pricing, plans or free-week screens anywhere.
  const PAY = Store.paymentsOn();
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

  function modal(html) {
    const m = GK.el(`<div class="modal-back"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`);
    document.body.appendChild(m);
    return { el: m, close: () => m.remove() };
  }

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
    const langs = IK_CONFIG.languages.map(l => `<option value="${l.code}" ${l.code === I18N.getLang() ? 'selected' : ''}>${l.name}</option>`).join('') + `<option disabled>🌍 ${t('moreLangsSoon')}</option>`;
    let nav;
    if (kid) {
      // Kids' top bar: just their stars and a way back to the grown-ups (the language is a parent setting).
      nav = `<span class="kid-pill kid-stars" aria-label="⭐ ${kid.stars}">⭐ ${kid.stars}</span>
             <button type="button" class="btn ghost small kid-parents" data-parents aria-label="${t('parents')}">👪 <span class="kid-parents-label">${t('parents')}</span></button>`;
    } else if (u) {
      // "Parent" (hidden while already in the Parents' area), Progress (family dashboard) right next to it,
      // then the parent's name ▾: the account menu (Settings, Help and information, Log out last). Owner, 2026-11-09.
      const path = location.hash.replace(/^#\/?/, ''), here = path.split('/')[0];
      nav = `${PAY ? `<a class="nav-link" href="#/pricing">${t('pricing')}</a>` : ''}
             ${path === 'parent' ? '' : `<a class="btn ghost small" href="#/parent">👪 ${t('nav_parent')}</a>`}
             <a class="btn ghost small${here === 'progress' ? ' is-active' : ''}" href="#/progress">📊 ${t('navProgress')}</a>
             ${accountMenu(u)}`;
    } else {
      nav = `<a class="nav-link nav-games" href="${Landing.path(I18N.getLang(), 'games')}">${t('allGames')}</a>
             ${PAY ? `<a class="nav-link" href="#/pricing">${t('pricing')}</a>` : ''}
             <a class="btn ghost small nav-login" href="#/login">${t('login')}</a>
             <a class="btn primary small" href="#/signup">${t('signup')}</a>`;
    }
    topbar.classList.toggle('kid-mode', !!kid);
    // Visitors on phones get a one-row bar (logo, Sign up, language); "Log in" is on the page itself.
    topbar.classList.toggle('visitor-mode', !kid && !u);
    topbar.innerHTML = `
      <a class="brand" href="${kid ? '#/kid/' + kid.id : '#/'}"><img src="assets/logo-sm.png" width="203" height="150" alt="IntelloKids home"></a>
      <nav class="nav">${nav}
        ${kid ? '' : `<label class="lang-select" title="${t('language')}"><span class="sr-only">${t('language')}</span><select>${langs}</select></label>`}
      </nav>`;
    const sel = topbar.querySelector('select');
    if (sel) sel.onchange = e => { Store.setLang(e.target.value); I18N.setLang(e.target.value); render(); };
    const lo = topbar.querySelector('[data-logout]');
    if (lo) lo.onclick = () => { Store.logout(); go('#/'); };
    const pa = topbar.querySelector('[data-parents]');
    if (pa) pa.onclick = () => go('#/parent');
    const acct = topbar.querySelector('.acct');
    if (acct) bindAccountMenu(acct);
    // Free-week banner for parents only (never in the kids' area).
    if (kid) { const b = document.getElementById('trial-banner'); if (b) b.remove(); } else trialBanner();
  }

  // ---------- Account menu (parent's name ▾) ----------
  // A real menu button: aria-expanded, Enter/Space/↓ open it on the first item, ↑ on the last, arrows/Home/End
  // move, Esc closes (focus back on the button), a tap outside or Tab closes. Log out is always last.
  function accountMenu(u) {
    return `<div class="acct">
      <button type="button" class="btn ghost small acct-btn" data-acct aria-haspopup="menu" aria-expanded="false" aria-controls="acct-menu" title="${esc(u.name)}">
        <span class="sr-only">${t('acct_menu')}: </span><span class="acct-name">${esc(u.name)}</span><span class="acct-caret" aria-hidden="true">▾</span></button>
      <div class="acct-menu" id="acct-menu" role="menu" aria-label="${t('acct_menu')}" hidden>
        <p class="acct-who" role="none"><small>${t('acct_signedIn')}</small><span>${esc(u.email)}</span></p>
        <a role="menuitem" tabindex="-1" href="#/settings"><span aria-hidden="true">⚙️</span> ${t('settings')}</a>
        <a role="menuitem" tabindex="-1" href="#/parent" data-help><span aria-hidden="true">💡</span> ${t('parents_help')}</a>
        ${Feedback.enabled() ? `<a role="menuitem" tabindex="-1" href="#/feedback" data-feedback-item><span aria-hidden="true">⭐</span> ${t('fb_menu')}</a>` : ''}
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
    // Help and information: the same block as in the Parents' area (#32), not a copy of it.
    menu.querySelector('[data-help]').onclick = e => {
      close(false);
      if (location.hash === '#/parent') { e.preventDefault(); scrollToHelp(); } else showHelp = true;
    };
    menu.querySelector('a[href="#/settings"]').addEventListener('click', () => close(false));
    // Give feedback: the feedback page (drawn again if the parent is already on it).
    const fb = menu.querySelector('[data-feedback-item]');
    if (fb) fb.onclick = e => { e.preventDefault(); close(false); go('#/feedback'); };
  }
  // Close the menu on a tap outside it, or when the screen is resized.
  document.addEventListener('pointerdown', e => { const a = topbar.querySelector('.acct.open'); if (a && !a.contains(e.target)) a._close(false); });
  window.addEventListener('resize', () => { const a = topbar.querySelector('.acct.open'); if (a) a._close(false); });
  let showHelp = false;
  function scrollToHelp() {
    const box = app.querySelector('.parent-help');
    if (!box) return;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const h = box.querySelector('h2'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }
  // The Terms / Privacy / Data security / Contact links, shared by the Parents' area and Settings.
  function helpLinks() {
    return `<ul class="help-links">${[['terms.html', '📜', 'termsOfService'], ['privacy.html', '🔒', 'privacyPolicy'], ['security.html', '🛡️', 'dataSecurity'], ['contact.html', '✉️', 'contactUs']]
      .map(([f, i, k]) => `<li><a href="${f}"><span aria-hidden="true">${i}</span> ${t(k)}</a></li>`).join('')}</ul>`;
  }

  // Language buttons with real flags, used on the language screen and the first-visit pop-up.
  const LANG_SUB = 'Choisissez votre langue · Elige tu idioma';
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
        <h1>Choose your language</h1>
        <p class="muted">${LANG_SUB}</p>
        <div class="lang-grid">
          ${langButtons()}
        </div>
        <p class="lang-soon"><span aria-hidden="true">🌍</span> ${t('moreLangsSoon')}</p>
      </section>`;
    app.querySelectorAll('.lang-btn').forEach(b => b.onclick = () => {
      Store.setLang(b.dataset.l); I18N.setLang(b.dataset.l); go('#/');
    });
  }

  // Home page: a short first screen, then one "For parents" section with every detail. The page content lives in
  // js/landing.js and is shared with the static SEO pages (infra/build-seo.ps1).
  // First-time visitors also get a small language bar on top (language is auto-detected).
  function viewLanding() {
    renderTopbar();
    app.innerHTML = Landing.html({ lang: I18N.getLang(), signedIn: !!Store.currentUser(), langBar: !Store.getLang() });
    app.querySelectorAll('.lang-bar [data-l]').forEach(b => b.onclick = () => {
      Store.setLang(b.dataset.l); I18N.setLang(b.dataset.l); render();
    });
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
    // "How are we doing?" at the bottom: the feedback form itself. The footer's ⭐ Feedback link scrolls to it.
    const fbBox = app.querySelector('[data-feedback]');
    if (fbBox && Feedback.enabled()) {
      Feedback.mount(fbBox, { heading: 3 });
      app.querySelectorAll('[data-feedback-link]').forEach(a => a.onclick = e => {
        e.preventDefault();
        const sec = document.getElementById('feedback');
        if (!sec) return go('#/feedback');
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const first = sec.querySelector('.fb-star-input'); if (first) first.focus({ preventScroll: true });
      });
    }
  }

  // ---------- Feedback (#/feedback, private: noindex): the parents' feedback form on its own page ----------
  // Reached from the footer link on every page and from the account menu. Children never see it.
  function viewFeedback() {
    if (!Feedback.enabled()) return go('#/');
    renderTopbar();
    const u = Store.currentUser();
    app.innerHTML = `
      <section class="page feedback-page">
        <div class="row between"><a class="btn ghost small" href="${u ? '#/parent' : '#/'}"><span class="flip-rtl">←</span> ${t('back')}</a><span></span></div>
        <div class="card fb-card">
          <h1>⭐ ${t('fb_title')}</h1>
          <p class="section-sub">${t('fb_sub')}</p>
          <div class="fb" data-feedback></div>
        </div>
      </section>`;
    Feedback.mount(app.querySelector('[data-feedback]'), { heading: 2 });
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

  // Terms in a pop-up, so the parent doesn't lose what they typed. withAccept: ask to accept.
  function showTermsModal(withAccept) {
    const body = window.LEGAL[I18N.getLang()] || window.LEGAL.en;
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
    const body = window.LEGAL[I18N.getLang()] || window.LEGAL.en;
    app.innerHTML = `
      <section class="page legal">
        <article class="card legal-card">
          <h1>${t('termsTitle')}</h1>
          <p class="muted">Last updated: ${window.LEGAL.updated}</p>
          ${body}
          ${u && Store.needsTerms(u) ? `<div class="row center"><button type="button" class="btn primary big" data-accept>✅ ${t('iAgree')}</button></div>` : ''}
        </article>
      </section>`;
    const a = app.querySelector('[data-accept]');
    if (a) a.onclick = () => { Store.acceptTerms(); go('#/parent'); };
  }

  // ---------- parents' dashboard for one child ----------
  const fmtDur = ms => {
    const s = Math.round(ms / 1000);
    if (s < 60) return s + ' ' + t('sec');
    const m = Math.round(s / 60);
    return m < 60 ? m + ' ' + t('min') : Math.floor(m / 60) + 'h ' + (m % 60) + ' ' + t('min');
  };
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
    const M = list => ({ min: Math.round(sum(list, h => h.ms) / 60000), acts: list.length, acc: accOf(list), stars: sum(list, h => h.stars), days: new Set(list.map(h => dayKey(h.t))).size });
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
        meta: `${'★'.repeat(h.stars)}${'☆'.repeat(3 - h.stars)} · ${fmtDur(h.ms || 0)} · ${h.mistakes ? '❌ ' + h.mistakes : '✅ 0'}` })),
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
      return { label: d.toLocaleDateString(I18N.voice(), { weekday: 'short' }), full: d.toLocaleDateString(I18N.voice(), { weekday: 'long', day: 'numeric', month: 'short' }), min: Math.round(ms / 6000) / 10 };
    });
    const maxMin = Math.max(1, ...week.map(d => d.min));

    const missed = Object.entries(c.missed || {}).sort((a, b) => b[1].n - a[1].n || b[1].last - a[1].last).slice(0, 6);
    const gname = g => Games[g] ? Games[g].icon + ' ' + t(Games[g].title) : g;
    const delta = (a, b, unit) => {
      if (a == null || b == null || (!a && !b)) return '';
      const d = a - b; if (!d) return `<span class="delta flat">= ${t('dash_vsLast')}</span>`;
      return `<span class="delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '▲' : '▼'} ${Math.abs(d)}${unit || ''} ${t('dash_vsLast')}</span>`;
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
            <p class="muted">${Store.currentAge(c)} ${t('years')} · ${t('age_' + group)} · ${t('level')} ${Store.level(c)} · ⭐ ${c.stars}</p>
            <p>🗺️ ${t('dash_currentWorld', { n: world + 1, world: t('w' + (world + 1)) })} · ${t('level')} ${Math.min(LEVELS, cur + 1)} / ${LEVELS}</p>
            <p class="muted small">🕒 ${last ? t('dash_lastPlayed', { when: ago(last) }) : t('dash_never')}</p>
            <p class="muted small">🎁 ${Chests.summary(c)}</p>
          </div>
          <a class="btn primary" href="#/kid/${c.id}">▶ ${t('play')}</a>
        </div>
        ${BrainyChat.parentAlert(c)}
        ${hist.length ? `
        <article class="card dash-summary">
          <h2>📋 ${t('dash_weekTitle')}</h2>
          <p class="summary-text">${t('dash_sum', { name, min: w.min, days: w.days, acts: w.acts })}
            ${best ? ' ' + t('dash_sumBest', { skill: '<b>' + t('skill_' + best.k) + '</b>' }) : ''}
            ${weakest && weakest !== best && weakest.acc < 80 ? ' ' + t('dash_sumPractice', { skill: '<b>' + t('skill_' + weakest.k) + '</b>' }) : ''}</p>
          <div class="stat-grid">
            ${kpi('⏱️', t('dash_time'), w.min + ' ' + t('min'), delta(w.min, p.min, ' ' + t('min')))}
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
              <p class="muted small">${s.plays} × · ${'★'.repeat(Math.round(s.stars))} ${s.spd ? '· ⚡ ' + s.spd.toFixed(1) + ' ' + t('sec') : ''}
                ${s.trend ? ` · <span class="trend ${s.trend}">${s.trend === 'up' ? '📈' : s.trend === 'down' ? '📉' : '➡️'} ${t('trend_' + s.trend)}</span>` : ''}</p>`
                : `<p class="muted small">${t('st_new_d')}</p>`}
            </div>`).join('')}</div>
        </article>

        <div class="dash-cols">
          <article class="card">
            <h2>📅 ${t('dash_week')}</h2>
            <div class="week-chart" role="img" aria-label="${t('dash_week')}: ${week.map(d => d.full + ' ' + d.min + ' ' + t('min')).join(', ')}">
              ${week.map(d => `<div class="wk-col" title="${d.full}: ${d.min} ${t('min')}"><span class="wk-val">${d.min || ''}</span><span class="wk-bar" style="height:${d.min / maxMin * 100}%"></span><span class="wk-day">${d.label}</span></div>`).join('')}
            </div>
          </article>
          <article class="card">
            <h2>🤝 ${t('dash_helpTitle', { name })}</h2>
            ${missed.length ? `<p class="muted small">${t('dash_mistakesNote', { name })}</p><ul class="mistake-list">${missed.map(([label, m]) => `<li><span>${esc(label)}<small class="muted"> · ${gname(m.game)}</small></span><b>${t('dash_times', { n: m.n })}</b></li>`).join('')}</ul>` : `<p class="muted">${t('dash_noMistakes')}</p>`}
            ${needHelp.length ? `<h3 class="tips-title">🏡 ${t('dash_tipsTitle')}</h3><ul class="tips">${needHelp.slice(0, 3).map(s => `<li>${SKILL_ICON[s.k]} ${t('tip_' + s.k)}</li>`).join('')}</ul>` : ''}
          </article>
        </div>

        <article class="card">
          <h2>👀 ${t('dash_whatTitle', { name })}</h2>
          <div class="timeline">${byDay.map(g => `
            <div class="tl-day"><h3>${g.l}</h3>
              <ul>${g.items.map(e => `<li><span class="tl-icon">${e.icon}</span><span class="tl-text">${e.text}${e.meta ? `<small class="muted">${e.meta}</small>` : ''}</span><span class="tl-time muted small">${new Date(e.t).toLocaleTimeString(I18N.voice(), { hour: '2-digit', minute: '2-digit' })}</span></li>`).join('')}</ul>
            </div>`).join('')}</div>
        </article>` : `<p class="empty card">${t('dash_empty', { name })}</p>`}

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
            <label>${t('password')}<input class="input" name="password" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" minlength="6" maxlength="128" required></label>
            ${signup ? `<label class="check"><input type="checkbox" name="terms" value="1"> <span>${t('agreeTerms')} <a href="#/terms" data-terms>${t('terms')}</a>.</span></label>` : ''}
            <p class="form-error" role="alert"></p>
            <button class="btn primary big full" type="submit">${t(signup ? 'createAccount' : 'login')}</button>
          </form>
          <p class="muted center">${t(signup ? 'haveAccount' : 'noAccount')} <a href="#/${signup ? 'login' : 'signup'}">${t(signup ? 'login' : 'signup')}</a></p>
          <p class="note">${t('demoNote')}</p>
        </div>
      </section>`;
    const form = app.querySelector('form'), err = app.querySelector('.form-error');
    const tl = app.querySelector('[data-terms]');
    if (tl) tl.onclick = e => { e.preventDefault(); showTermsModal(); };
    form.onsubmit = e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form));
      if ((signup && !f.name.trim()) || !f.email.trim() || !f.password) return (err.textContent = t('err_required'));
      if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return (err.textContent = t('err_email'));
      if (signup && f.password.length < 6) return (err.textContent = t('err_password'));
      if (signup && !f.terms) return (err.textContent = t('err_terms'));
      const r = signup ? Store.signup(f.name, f.email, f.password) : Store.login(f.email, f.password);
      if (r.error) return (err.textContent = t(r.error));
      const back = sessionStorage.getItem('ik_after_login');
      try { sessionStorage.removeItem('ik_after_login'); } catch (x) { /* ignore */ }
      // With payments on: new accounts start their free week; ended free weeks go to the plan step.
      if (PAY && signup && Store.trialInfo().active) toast(t('trialStarted', { n: Store.trialInfo().daysLeft }));
      if (PAY && !Store.hasAccess()) return go('#/pricing');
      go(back || '#/parent');
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
      return { label: d.toLocaleDateString(I18N.voice(), { weekday: 'narrow' }), full: d.toLocaleDateString(I18N.voice(), { weekday: 'long' }), min: Math.round(sum(hist.filter(h => dayKey(h.t) === key), h => h.ms) / 60000) };
    });
    return {
      min: Math.round(sum(wk, h => h.ms) / 60000), acts: wk.length, acc: accOf(wk), stars: sum(wk, h => h.stars),
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
          ${tile('⏱️', t('fam_total_min'), total(x => x.w.min) + ' ' + t('min'))}
          ${tile('🎮', t('fam_total_acts'), total(x => x.w.acts))}
          ${tile('⭐', t('fam_total_stars'), total(x => x.w.stars))}
          ${tile('🦄', t('fam_total_stickers'), total(x => Stickers.count(x.c)))}
        </div>
        <div class="family-grid">${weeks.map(({ c, w }) => {
          const name = esc(c.name), cur = currentNode(c), world = worldOf(cur), maxMin = Math.max(1, ...w.days.map(d => d.min));
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
              <div><b>${w.min}</b><span>${t('min')}</span></div>
              <div><b>${w.acc == null ? '–' : w.acc + '%'}</b><span>${t('dash_accuracy')}</span></div>
              <div><b>⭐ ${w.stars}</b><span>${t('fam_total_stars')}</span></div>
              <div><b>${t('fam_daysActive', { n: w.daysActive })}</b><span>${t('dash_days')}</span></div>
            </div>
            <div class="fam-week" role="img" aria-label="${t('dash_week')}: ${w.days.map(d => d.full + ' ' + d.min + ' ' + t('min')).join(', ')}">
              ${w.days.map(d => `<div class="fw-col" title="${d.full}: ${d.min} ${t('min')}"><span class="fw-bar" style="height:${Math.max(4, d.min / maxMin * 100)}%" data-empty="${d.min ? 0 : 1}"></span><span class="fw-day">${d.label}</span></div>`).join('')}
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

  // Paywall: everything behind the account needs a subscription or a free week that hasn't ended.
  function needsPayment() {
    if (Store.hasAccess()) return false;
    toast(Store.trialInfo().ended ? t('trialEnded') : t('needPlan')); go('#/pricing');
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

  // Parts that are locked for now (IK_CONFIG.limits): a padlock and a friendly line from Brainy.
  // No forms and no links out of the kids' area, just a way back to playing.
  const lockedLine = () => t('lock_title') + ' ' + t('lock_sub');
  function lockNote() { toast('🔒 ' + t('lock_title')); GK.speak(lockedLine()); }
  function viewLocked(kid, backHref) {
    renderTopbar(kid);
    app.innerHTML = `
      <section class="page ask-grownup locked-page">
        <div class="card ask-card">
          <div class="ask-chars">${kid.me ? meSvg(kid) : ''}${Art.brainy({ mood: 'happy' })}</div>
          <p class="lock-big" aria-hidden="true">🔒</p>
          <h1>${t('lock_title')}</h1>
          <p>${t('lock_sub')}</p>
          <a class="btn primary big" href="${backHref || '#/kid/' + kid.id}">🎮 ${t('lock_back')}</a>
        </div>
      </section>`;
    GK.speak(lockedLine());
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
        <p class="muted small">${t('lim_more')}</p>
      </div>`;
  }

  // Slim banner for parents during the free week: days left and a link to choose a plan.
  function trialBanner() {
    const old = document.getElementById('trial-banner'); if (old) old.remove();
    const u = Store.currentUser();
    if (!PAY || !u || Store.hasPaid(u)) return;
    const tr = Store.trialInfo(u);
    if (!tr.active) return;
    const el = GK.el(`<div id="trial-banner" class="trial-banner" role="status">
      🎁 ${tr.daysLeft <= 1 ? t('trialBannerLast') : t('trialBanner', { n: tr.daysLeft })}
      <a class="btn primary small" href="#/pricing">${t('trialChoose')}</a></div>`);
    topbar.insertAdjacentElement('afterend', el);
  }

  // ---------- Settings for parents (#/settings, private): account, language, data, help ----------
  function viewSettings() {
    const u = Store.currentUser();
    if (!u) return go('#/login');
    renderTopbar();
    const langs = IK_CONFIG.languages.map(l => `<option value="${l.code}" ${l.code === I18N.getLang() ? 'selected' : ''}>${l.name}</option>`).join('') + `<option disabled>🌍 ${t('moreLangsSoon')}</option>`;
    const pw = (name, key, auto) => `<label>${t(key)}<input class="input" type="password" name="${name}" autocomplete="${auto}" required></label>`;
    app.innerHTML = `
      <section class="page settings-page">
        <div class="row between"><a class="btn ghost small" href="#/parent"><span class="flip-rtl">←</span> ${t('back')}</a><h1>⚙️ ${t('settings')}</h1><span></span></div>

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
            <p class="muted small">${t('err_password')}</p>
            <p class="form-error" role="alert"></p>
            <div class="row"><button class="btn primary" type="submit">${t('set_changePassword')}</button></div>
          </form>
        </article>

        <article class="card settings-card">
          <h2>🌍 ${t('language')}</h2>
          <label class="set-lang"><span class="sr-only">${t('language')}</span><select class="input" data-lang>${langs}</select></label>
          <p class="muted small">${t('set_languageHint')}</p>
        </article>

        <article class="card settings-card">
          <h2>🗂️ ${t('set_data')}</h2>
          <div class="set-row">
            <div><strong>${t('set_download')}</strong><p class="muted small">${t('set_downloadHint')}</p></div>
            <button type="button" class="btn ghost" data-download>⬇️ ${t('set_download')}</button>
          </div>
          <div class="set-row danger">
            <div><strong>${t('set_delete')}</strong><p class="muted small">${t('set_deleteHint')}</p></div>
            <button type="button" class="btn ghost danger-btn" data-delete-open aria-expanded="false">🗑️ ${t('set_delete')}</button>
          </div>
          <form class="set-form delete-form" data-form="delete" hidden novalidate>
            <p class="delete-warn">⚠️ ${t('set_deleteHint')}</p>
            ${pw('password', 'set_deleteConfirm', 'current-password')}
            <p class="form-error" role="alert"></p>
            <div class="row"><button type="button" class="btn ghost" data-delete-cancel>${t('cancel')}</button><button class="btn danger" type="submit">${t('set_deleteBtn')}</button></div>
          </form>
        </article>

        <article class="card settings-card">
          <h2>ℹ️ ${t('parents_help')}</h2>
          ${helpLinks()}
        </article>
      </section>`;

    const form = name => app.querySelector(`[data-form="${name}"]`);
    const fail = (f, key) => { f.querySelector('.form-error').textContent = t(key); };
    const ok = (f, key) => { f.querySelector('.form-error').textContent = ''; toast('✅ ' + t(key)); };
    const fields = f => Object.fromEntries(new FormData(f));

    form('name').onsubmit = e => {
      e.preventDefault();
      const r = Store.updateName(fields(e.target).name);
      if (r.error) return fail(e.target, r.error);
      ok(e.target, 'set_saved'); renderTopbar();
    };
    form('email').onsubmit = e => {
      e.preventDefault();
      const f = fields(e.target), r = Store.changeEmail(f.email, f.password);
      if (r.error) return fail(e.target, r.error);
      ok(e.target, 'set_emailChanged'); viewSettings();
    };
    form('password').onsubmit = e => {
      e.preventDefault();
      const f = fields(e.target);
      if (!f.current || !f.next || !f.confirm) return fail(e.target, 'err_required');
      if (f.next !== f.confirm) return fail(e.target, 'err_match');
      const r = Store.changePassword(f.current, f.next);
      if (r.error) return fail(e.target, r.error);
      e.target.reset(); ok(e.target, 'set_passwordChanged');
    };
    app.querySelector('[data-lang]').onchange = e => { Store.setLang(e.target.value); I18N.setLang(e.target.value); viewSettings(); toast('✅ ' + t('set_saved')); };

    // Download my data: a JSON file made on this device.
    app.querySelector('[data-download]').onclick = () => {
      const data = Store.exportData();
      if (!data) return;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'intellokids-my-data-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast('✅ ' + t('set_downloaded'));
    };
    // Delete my account: opens a form that asks for the password first.
    const del = form('delete'), opener = app.querySelector('[data-delete-open]');
    opener.onclick = () => { del.hidden = false; opener.setAttribute('aria-expanded', 'true'); del.querySelector('input').focus(); };
    app.querySelector('[data-delete-cancel]').onclick = () => { del.hidden = true; del.reset(); opener.setAttribute('aria-expanded', 'false'); opener.focus(); };
    del.onsubmit = e => {
      e.preventDefault();
      const r = Store.deleteAccount(fields(e.target).password);
      if (r.error) return fail(e.target, r.error);
      toast('👋 ' + t('set_deleted')); go('#/');
    };
  }

  function viewParent() {
    const u = Store.currentUser();
    if (!u) return go('#/login');
    if (needsPayment()) return;
    renderTopbar();
    const sub = u.subscription, canAdd = Store.canAddChild(u);
    app.innerHTML = `
      <section class="page">
        <h1>${t('welcomeParent', { name: esc(u.name) })}</h1>
        ${PAY ? `<div class="card sub-card">
          <div><strong>${t('subscription')}:</strong> ${sub ? t('subActive', { plan: t('plan_' + sub.plan) }) : Store.trialInfo(u).active ? '🎁 ' + t('trialBanner', { n: Store.trialInfo(u).daysLeft }) : t('subNone')}</div>
          ${sub ? '' : `<a class="btn primary small" href="#/pricing">${t('choosePlan')}</a>`}
        </div>` : ''}
        ${limitsNote(u)}
        <div class="row between"><h2>${t('yourChildren')} ${kidsCount(u)}</h2><button type="button" class="btn primary" data-add${canAdd ? '' : ` disabled title="${t('kids_max', { n: Store.maxChildren() })}"`}>＋ ${t('addChild')}</button></div>
        ${canAdd ? '' : `<p class="note kids-full" role="note">ℹ️ ${t('kids_max', { n: Store.maxChildren() })}</p>`}
        <form class="card add-child" hidden novalidate>
          <label>${t('childName')}<input class="input" name="name" maxlength="30" required></label>
          <label>${t('childAge')}
            <select class="input" name="age" required>
              <option value="">–</option>
              ${[3, 4, 5, 6, 7, 8, 9, 10].map(a => `<option value="${a}">${a} ${t('years')}</option>`).join('')}
            </select></label>
          <p class="form-error" role="alert"></p>
          <div class="row"><button type="button" class="btn ghost" data-cancel>${t('cancel')}</button><button class="btn primary" type="submit">${t('save')}</button></div>
        </form>
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
                <button type="button" class="link-btn" data-remove="${c.id}">${t('remove')}</button>
              </div>
            </article>`).join('') : `<p class="empty">${t('noChildren')}</p>`}
        </div>
        <section class="card parent-help">
          <h2>ℹ️ ${t('parents_help')}</h2>
          ${helpLinks()}
        </section>
      </section>`;
    const form = app.querySelector('.add-child');
    const open = () => { if (!Store.canAddChild()) return viewParent(); form.hidden = false; form.querySelector('input').focus(); };
    app.querySelector('[data-add]').onclick = open;
    app.querySelector('[data-cancel]').onclick = () => (form.hidden = true);
    if (!u.children.length) open();
    form.onsubmit = e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form));
      if (!f.name.trim() || !f.age) return (form.querySelector('.form-error').textContent = t('err_required'));
      // The store refuses a child past IK_CONFIG.maxChildren (e.g. one was added in another tab meanwhile).
      if (!Store.addChild(f.name, f.age)) toast(t('kids_max', { n: Store.maxChildren() }));
      viewParent();
    };
    app.querySelectorAll('[data-remove]').forEach(b => b.onclick = e => {
      e.stopPropagation();
      const c = u.children.find(x => x.id === b.dataset.remove);
      if (c && confirm(t('confirmRemove', { name: c.name }))) { Store.removeChild(c.id); viewParent(); }
    });
    // Clicking a child opens their progress dashboard (but not when pressing Play/Remove).
    app.querySelectorAll('[data-dash]').forEach(card => {
      const open = () => go('#/parent/child/' + card.dataset.dash);
      card.onclick = e => { if (!e.target.closest('a, button')) open(); };
      card.onkeydown = e => { if (e.key === 'Enter' && e.target === card) open(); };
    });
    if (showHelp) { showHelp = false; setTimeout(scrollToHelp, 50); }   // came from the account menu's "Help and information"
    if (Store.needsTerms(u)) showTermsModal(true);
  }

  // ---------- Paddle ----------
  let pendingPlan = null;
  function loadPaddle() {
    const cfg = IK_CONFIG.paddle;
    return new Promise((resolve, reject) => {
      if (window.Paddle && loadPaddle.ready) return resolve(window.Paddle);
      const s = document.createElement('script');
      s.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      s.onload = () => {
        try {
          if (cfg.environment === 'sandbox') Paddle.Environment.set('sandbox');
          Paddle.Initialize({
            token: cfg.clientToken,
            eventCallback(ev) {
              if (ev.name === 'checkout.completed' && pendingPlan) {
                // NOTE: in production, confirm the subscription on the server using Paddle webhooks.
                Store.setSubscription(pendingPlan); pendingPlan = null;
                toast(t('paymentThanks')); setTimeout(() => go('#/parent'), 1500);
              }
            }
          });
          loadPaddle.ready = true; resolve(Paddle);
        } catch (e) { reject(e); }
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function viewPricing() {
    renderTopbar();
    const p = IK_CONFIG.paddle;
    const feats = ['plan_f1', 'plan_f2', 'plan_f3', 'plan_f4'].map(k => `<li>✅ ${t(k)}</li>`).join('');
    const u0 = Store.currentUser();
    const paid = u0 && Store.hasPaid(u0), tr = Store.trialInfo(u0);
    const ended = u0 && !paid && !tr.active;          // free week over: choose a plan to continue
    const onTrial = u0 && !paid && tr.active;         // still in the free week
    // Online payment is switched on only when a provider is chosen and set up (IK_CONFIG.payments.live).
    // Until then, "Subscribe" explains that payment is opening soon instead of taking money or faking it.
    const live = !!(IK_CONFIG.payments && IK_CONFIG.payments.live);
    app.innerHTML = `
      <section class="page pricing">
        <h1 class="center">${ended ? t('trialEndedTitle') : t('pricingTitle')}</h1>
        <p class="center muted">${ended ? t('trialEndedSub') : t('pricingSub')}</p>
        ${!u0 && p.trialDays ? `<div class="free-week-cta"><p>🎁 ${t('freeWeekSub', { n: p.trialDays })}</p><a class="btn primary big" href="#/signup">${t('startFreeWeek')}</a></div>` : ''}
        ${onTrial ? `<p class="free-week-note center">🎁 ${tr.daysLeft <= 1 ? t('trialBannerLast') : t('trialBanner', { n: tr.daysLeft })}. ${t('trialActiveNote')}</p>` : ''}
        <div class="plans">
          <article class="card plan">
            <h3>${t('plan_monthly')}</h3>
            <p class="price">${p.displayPrices.monthly}<span>${t('perMonth')}</span></p>${p.trialDays && !u0 ? `<p class="trial-note">🎁 ${t('trialNote', { n: p.trialDays })}</p>` : ''}
            <ul>${feats}</ul>
            <button type="button" class="btn primary full" data-plan="monthly">${t('subscribe')}</button>
          </article>
          <article class="card plan featured">
            <span class="badge">${t('bestValue')}</span>
            <h3>${t('plan_yearly')}</h3>
            <p class="price">${p.displayPrices.yearly}<span>${t('perYear')}</span></p>${p.trialDays && !u0 ? `<p class="trial-note">🎁 ${t('trialNote', { n: p.trialDays })}</p>` : ''}
            <ul>${feats}</ul>
            <button type="button" class="btn primary full" data-plan="yearly">${t('subscribe')}</button>
          </article>
        </div>
        <p class="center muted">🔒 ${t('securePayments')}</p>
        <p class="center muted small pay-legal">${t('paddleNote')} ${t('moneyBack')}<br>${t('agreeOnSubscribe')} <a href="terms.html">${t('termsOfService')}</a> · <a href="privacy.html">${t('privacyPolicy')}</a> · <a href="refund.html">${t('refundPolicy')}</a></p>
      </section>`;
    app.querySelectorAll('[data-plan]').forEach(b => b.onclick = async () => {
      const u = Store.currentUser();
      if (!u) { try { sessionStorage.setItem('ik_after_login', '#/pricing'); } catch (x) { /* ignore */ } return go('#/signup'); }
      if (!live) {
        const m = modal(`<div class="pay-soon"><div class="pay-soon-brainy">${Art.brainy({ mood: 'happy' })}</div>
          <h2>${t('paySoonTitle')}</h2><p>${t('paySoonBody')}</p>
          <p class="pay-soon-email">✉️ <a href="mailto:kidsintello@gmail.com">kidsintello@gmail.com</a></p>
          <div class="row center"><button class="btn primary" data-x>${t('paySoonOk')}</button></div></div>`);
        m.el.querySelector('[data-x]').onclick = m.close;
        return;
      }
      // Paddle checkout (only used if Paddle is chosen as the provider and switched on in config.js).
      const priceId = p.prices[b.dataset.plan];
      if (!priceId) return toast(t('paddleNotConfigured'));
      try {
        const P = await loadPaddle();
        pendingPlan = b.dataset.plan;
        P.Checkout.open({ items: [{ priceId, quantity: 1 }], customer: { email: u.email }, customData: { account: u.email } });
      } catch (e) { toast(t('paddleNotConfigured')); }
    });
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

  function viewKidHome(kid) {
    if (!kid.me) return viewMeSetup(kid);
    if (!kid.friend) return viewFriendSetup(kid);
    renderTopbar(kid);
    const fname = esc(kid.friend.name);
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
            <div class="scene-friend scene-me">${meSvg(kid)}<span class="name-tag">${esc(kid.name)}</span></div>
            <div class="scene-friend">${friendSvg(kid)}<span class="name-tag">${fname}</span></div>
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
    const fs = friendStickers; friendStickers = null;
    if (fs && fs.id === kid.id && Date.now() - fs.at < 10000) {
      const tk = renderToken;
      setTimeout(() => { if (tk === renderToken) Stickers.celebrate(fs.won, modal); }, 900);
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

  // Map of one world (10 levels). worldArg is 1–10 from the address; default = the child's current world.
  function viewMap(kid, worldArg) {
    if (!kid.friend) return go('#/kid/' + kid.id);
    renderTopbar(kid);
    const group = Store.ageGroup(kid), nodes = mapFor(kid);
    const cur = currentNode(kid), curWorld = worldOf(cur);
    // Worlds whose levels are all locked for now (IK_CONFIG.limits) can't be opened; saved progress is kept.
    let lastWorld = WORLDS - 1;
    while (lastWorld > 0 && !Store.levelOpen(lastWorld * PER_WORLD)) lastWorld--;
    const homeWorld = Math.min(curWorld, lastWorld);
    let w = worldArg ? Number(worldArg) - 1 : homeWorld;
    if (!(w >= 0 && w < WORLDS)) w = homeWorld;
    if (w > lastWorld) { lockNote(); w = homeWorld; }
    else if (w > curWorld) { toast('🔒 ' + t('worldLocked', { n: w * PER_WORLD })); w = homeWorld; }
    const L = Store.limits();
    const lockStrip = L && L.maxLevel != null && L.maxLevel < LEVELS && w === lastWorld ? `<p class="lock-strip">🔒 ${t('lock_levels', { n: L.maxLevel + 1 })}</p>` : '';
    const vertical = window.innerWidth < 700;
    const W = vertical ? 640 : 1000, H = vertical ? 1000 : 640;
    const stops = mapStops(vertical);
    const pts = stops.filter((p, s) => !CHEST_STOPS.includes(s));   // the 10 levels
    const first = w * PER_WORLD;
    const seen = kid.mapSeen[group] != null ? kid.mapSeen[group] : cur;
    // The plane only appears in the world the child is currently playing.
    const showPlane = w === curWorld;
    const enteringNewWorld = showPlane && worldOf(seen) !== curWorld;
    const fromLocal = enteringNewWorld ? 0 : Math.min(seen, cur) - first;
    const curLocal = cur - first;
    const pct = p => `left:${p[0] / W * 100}%;top:${p[1] / H * 100}%`;
    const decoPos = vertical
      ? [[60, 800], [580, 600], [70, 300], [570, 110], [310, 560], [600, 960], [580, 470], [90, 90]]
      : [[90, 330], [270, 330], [920, 600], [940, 90], [600, 90], [470, 610], [620, 380], [80, 120]];
    const theme = THEMES[w];
    const worldName = t('w' + (w + 1));
    const nextLocked = w + 1 < WORLDS && w + 1 > lastWorld;
    app.innerHTML = `
      <section class="page map-page">
        <div class="kid-head map-head">
          <a class="round-btn" href="#/kid/${kid.id}" aria-label="${t('home')}">🏠</a>
          <div class="world-bar">
            <a class="round-btn world-arrow ${w === 0 ? 'disabled' : ''}" ${w === 0 ? 'aria-disabled="true"' : `href="#/kid/${kid.id}/map/${w}"`} aria-label="${t('prevWorld')}"><span class="flip-rtl">◀</span></a>
            <h1 class="world-name"><span aria-hidden="true">${theme.deco[0]}</span> ${worldName}</h1>
            ${nextLocked
              // The next world is locked for now (IK_CONFIG.limits): ▶ becomes a padlock with the same lock note.
              ? `<button type="button" class="round-btn world-arrow is-locked" data-lock aria-label="${t('nextWorld')} – ${t('locked')}">🔒</button>`
              : `<a class="round-btn world-arrow ${w >= homeWorld ? 'disabled' : ''}" ${w >= homeWorld ? 'aria-disabled="true"' : `href="#/kid/${kid.id}/map/${w + 2}"`} aria-label="${t('nextWorld')}"><span class="flip-rtl">▶</span></a>`}
          </div>
        </div>
        ${showPlane && Store.levelOpen(cur) ? `<p class="center map-play"><a class="btn primary big" href="#/kid/${kid.id}/play/${cur}">${Games[nodes[cur][0]].icon} ${t('play')} <span class="flip-rtl" aria-hidden="true">▶</span></a></p>` : ''}
        ${lockStrip}
        <div class="map world-${w + 1} ${vertical ? 'vertical' : ''}" style="aspect-ratio:${W}/${H}">
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
            <path d="${smoothPath(stops)}" class="map-road"/><path d="${smoothPath(stops)}" class="map-road-dash"/>
          </svg>
          ${decoPos.map(([x, y], k) => `<span class="map-deco" style="${pct([x, y])}">${theme.deco[k]}</span>`).join('')}
          ${pts.map((p, k) => {
            const i = first + k, gid = nodes[i][0];
            const done = kid.completed[nodeKey(group, i)] || 0, held = !Store.levelOpen(i), open = !held && isUnlocked(kid, group, i);
            return `<a class="map-node ${done ? 'done' : ''} ${open ? '' : 'locked'} ${i === cur ? 'current' : ''} ${k === PER_WORLD - 1 ? 'boss' : ''}" style="${pct(p)}"
                      ${open ? `href="#/kid/${kid.id}/play/${i}"` : held ? 'data-lock aria-disabled="true"' : 'aria-disabled="true"'} aria-label="${t('level')} ${i + 1}: ${t(Games[gid].title)}${open ? '' : ' – ' + t('locked')}">
                      <span class="node-icon">${open ? Games[gid].icon : '🔒'}</span><span class="node-num">${i + 1}</span>
                      ${done ? `<span class="node-stars">${'★'.repeat(done)}${'☆'.repeat(3 - done)}</span>` : ''}
                    </a>`;
          }).join('')}
          ${Chests.mapMarkup(kid, w, CHEST_STOPS.map(s => stops[s]), pct)}
          ${showPlane ? `<div class="map-plane" style="${pct(pts[Math.max(0, fromLocal)])}">✈️</div>` : ''}
        </div>
      </section>`;
    app.querySelectorAll('[data-lock]').forEach(el => { el.onclick = lockNote; });
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
      const held = rank(v) === 1, s = pick(v);
      return `
        <button type="button" class="card video${held ? ' is-locked' : ''}" data-v="${v.id}"${held ? ` aria-label="${t('v_' + v.id)} – ${t('locked')}"` : ''}>
          <span class="video-thumb">${s.poster
            ? `<img src="${esc(s.poster)}" alt="" width="640" height="360" loading="lazy">`
            : v.emoji}${held ? '<span class="video-lock" aria-hidden="true">🔒</span>' : '<span class="play-icon" aria-hidden="true">▶</span>'}
            ${!held && s.lang && s.lang !== lang ? `<span class="video-lang" title="${t('videoInEnglish')}"><span class="sr-only">${t('videoInEnglish')}</span>${Art.flag(flagOf(s.lang))}</span>` : ''}</span>
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
      </div>`);
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
    renderToken++;
    if (window.Arcade) Arcade.stop(); // a treasure-chest game stops when the child leaves it
    try { BrainyVoice.stop(); } catch (e) { /* ignore */ }
    document.querySelectorAll('.modal-back').forEach(m => m.remove());
    const lang = Store.getLang();
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (parts[0] !== 'kid' || parts[1] !== greetedKid) greetedKid = null; // left the kid area: say hello next time
    if (parts[0] === 'language') {
      I18N.setLang(lang || detectLang()); metaFor('landing'); return viewLanguage();
    }
    I18N.setLang(lang || detectLang());
    window.scrollTo(0, 0);
    metaFor(parts[0] === undefined ? 'landing' : ['pricing', 'terms', 'signup', 'login', 'feedback'].includes(parts[0]) ? parts[0] : 'private');

    switch (parts[0]) {
      case undefined: return viewLanding();
      case 'signup': return viewAuth('signup');
      case 'login': return viewAuth('login');
      case 'parent': return parts[1] === 'child' ? viewChildDashboard(parts[2]) : viewParent();
      case 'progress': return viewFamily();
      case 'settings': return viewSettings();
      case 'feedback': return viewFeedback();
      case 'pricing': return PAY ? viewPricing() : go('#/');
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
  const urlLang = (/[?&]lang=([a-z]{2})\b/.exec(location.search) || [])[1];
  if (urlLang && I18N.has(urlLang)) {
    Store.setLang(urlLang);
    try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* file:// */ }
  }

  window.addEventListener('hashchange', render);
  render();
})();
