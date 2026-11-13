/* IntelloKids landing page, shared by the app (viewLanding in js/app.js) and by the SEO page
   generator (infra/seo/build.js). One builder means the static pages that search engines read
   say exactly what visitors see. Needs config.js, i18n.js and characters.js.
   Layout (owner, 2026-11-08: "simple and kid-friendly"): a short first screen (Brainy, one sentence,
   one main button), four key points, then ONE "For parents" section that holds all the detail in
   collapsible blocks. Everything stays in the HTML, so search engines still read all of it.
   At the very bottom, just above the footer: "How are we doing?", the parents' feedback form (owner, 2026-11-09). */
(function () {
  const t = (k, v) => I18N.t(k, v);

  // Marketing catalogue: which age groups play each game, and its subjects.
  // Keep in step with POOLS in js/app.js when a game is added or moved between age groups.
  const GAMES = [
    { id: 'shapes', icon: '🔺', groups: ['tiny', 'junior', 'explorer'], subjects: ['shapes'] },
    { id: 'sorter', icon: '🧩', groups: ['tiny'], subjects: ['shapes'] },
    { id: 'colours', icon: '🎈', groups: ['tiny'], subjects: ['shapes'] },
    { id: 'shadow', icon: '👤', groups: ['tiny', 'junior'], subjects: ['shapes'] },
    { id: 'counting', icon: '🔢', groups: ['tiny', 'junior'], subjects: ['maths'] },
    { id: 'dots', icon: '🔗', groups: ['tiny', 'junior', 'explorer'], subjects: ['maths'] },
    { id: 'bigsmall', icon: '🐘', groups: ['tiny', 'junior'], subjects: ['maths'] },
    { id: 'memory', icon: '🃏', groups: ['tiny', 'junior', 'explorer'], subjects: ['logic'] },
    { id: 'puzzle', icon: '🖼️', groups: ['tiny', 'junior', 'explorer'], subjects: ['logic'] },
    { id: 'maze', icon: '🌀', groups: ['tiny', 'junior', 'explorer'], subjects: ['logic'] },
    { id: 'pattern', icon: '🔁', groups: ['junior', 'explorer'], subjects: ['logic'] },
    { id: 'odd', icon: '🔍', groups: ['junior', 'explorer'], subjects: ['logic'] },
    { id: 'addition', icon: '➕', groups: ['junior', 'explorer'], subjects: ['maths'] },
    { id: 'clock', icon: '🕒', groups: ['junior', 'explorer'], subjects: ['maths'] },
    { id: 'mathsrace', icon: '🏁', groups: ['explorer'], subjects: ['maths'] },
    { id: 'coding', icon: '🤖', groups: ['explorer'], subjects: ['logic'] },
    { id: 'quiz', icon: '❓', groups: ['tiny', 'junior', 'explorer'], subjects: ['maths', 'shapes'] },
    { id: 'colouring', icon: '🎨', groups: ['tiny', 'junior', 'explorer'], subjects: ['colouring'] }
  ];
  const GROUPS = [
    { id: 'tiny', icon: '🧸', cls: 'c1', min: 3, max: 4, page: 'ages-3-4' },
    { id: 'junior', icon: '🧠', cls: 'c2', min: 5, max: 6, page: 'ages-5-6' },
    { id: 'explorer', icon: '🚀', cls: 'c3', min: 7, max: 10, page: 'ages-7-10' }
  ];
  const SUBJECTS = [
    { id: 'maths', icon: '➕', key: 'subj_maths', page: 'maths' },
    { id: 'shapes', icon: '🔺', key: 'subj_shapes', page: 'shapes' },
    { id: 'logic', icon: '🧠', key: 'subj_logic', page: 'logic' },
    { id: 'colouring', icon: '🎨', key: 'subj_colouring', page: 'colouring' }
  ];
  // Public pages with real URLs (folders under website/). English lives at the root, other
  // languages under /fr/, /es/ (German and Chinese are parked: parked/languages/README.md). The English home page is the app itself (index.html).
  const PAGES = {
    home: '', games: 'games/', 'ages-3-4': 'ages/3-4/', 'ages-5-6': 'ages/5-6/', 'ages-7-10': 'ages/7-10/',
    maths: 'maths-games/', shapes: 'shape-colour-games/', logic: 'logic-coding-games/', colouring: 'colouring-pages/'
  };
  const FAQ = [1, 2, 3, 4, 5, 6, 7];

  const path = (lang, key) => (lang === 'en' ? '' : lang + '/') + PAGES[key];
  const gameTitle = g => t(g.id === 'colouring' ? 'menu_colour' : 'g_' + g.id);
  const gamesFor = group => GAMES.filter(g => g.groups.includes(group));
  function agesOf(g) {
    const gs = GROUPS.filter(x => g.groups.includes(x.id));
    return gs[0].min + '–' + gs[gs.length - 1].max;
  }

  // Links differ between the app (hash routes, same page) and the static pages (real files).
  function ctx(o) {
    const lang = o.lang || I18N.getLang();
    return {
      lang,
      signedIn: !!o.signedIn,
      langBar: !!o.langBar,
      app: o.appHref || (r => r),
      page: o.pageHref || (k => path(lang, k)),
      asset: o.asset || (p => p),
      home: o.homeHref || (code => code === 'en' ? '?lang=en' : code + '/')
    };
  }

  function langBar(c) {
    return `<div class="lang-bar" role="group" aria-label="${t('chooseLanguage')}">
      <span class="lang-bar-title">🌍 ${t('chooseLanguage')}</span>
      <div class="lang-bar-btns">${IK_CONFIG.languages.map(l => `<button type="button" class="lang-chip${l.code === c.lang ? ' on' : ''}" data-l="${l.code}" lang="${l.code}">${Art.flag(l.flag)}<span>${l.name}</span></button>`).join('')}</div>
      <span class="lang-soon">${t('moreLangsSoon')}</span>
    </div>`;
  }

  // First screen: Brainy, one sentence, one main button (and a quiet "Log in" link).
  // The brand name is part of the h1 (SEO: parents search for "IntelloKids"), shown as a small line above the tagline.
  function hero(c) {
    return `<section class="hero">
      <div class="hero-text">
        <h1><span class="hero-brand">IntelloKids</span> ${t('tagline')}</h1>
        <p class="hero-lead">${t('heroText')}</p>
        <div class="row hero-actions">
          <a class="btn primary big" href="${c.app(c.signedIn ? '#/parent' : '#/signup')}">${t('getStarted')} <span class="flip-rtl">→</span></a>
          ${c.signedIn ? '' : `<a class="hero-login" href="${c.app('#/login')}">${t('login')}</a>`}
        </div>
        <p class="trust hero-trust">🛡️ ${t('trustLine')}</p>
      </div>
      <div class="hero-art" aria-hidden="true">
        <span class="spark s1">⭐</span><span class="spark s2">✨</span><span class="spark s3">⭐</span>
        <div class="hero-friend f1">${Art.friend({ gender: 'girl', skin: 1 }, 1, 3)}</div>
        <div class="hero-brainy">${Art.brainy({ mood: 'cheer' })}</div>
        <div class="hero-friend f2">${Art.friend({ gender: 'boy', skin: 2 }, 1, 5)}</div>
      </div>
    </section>`;
  }

  // A few key points: big icons, short words. The details live in the parents' section.
  // On phones (owner, 2026-11-09: "Brainy and a simple way in") the key points and the whole parents'
  // section fold away behind the "For parents" button: the app opens it with a tap, and the static pages
  // use the #parents anchor (CSS :target), so it works without JavaScript too.
  function keyPoints() {
    const pts = [['🗺️', 'feat_map'], ['🧩', 'feat_games'], ['🎨', 'feat_colour'], ['🔊', 'feat_langs']];
    return `<section class="key-section">
      <ul class="key-points">${pts.map(([i, k]) => `<li class="key-point"><span class="kp-icon" aria-hidden="true">${i}</span><span>${t(k)}</span></li>`).join('')}</ul>
      <p class="center"><a class="btn ghost parents-jump" href="#parents" data-scroll="parents" aria-controls="parents">👪 ${t('lp_parentsLink')} <span aria-hidden="true">↓</span></a></p>
    </section>`;
  }

  // ---- "For parents": one place for everything a parent wants to know ----
  const block = (id, icon, title, body) => `<details class="card pinfo pinfo-${id}">
        <summary><span class="pinfo-icon" aria-hidden="true">${icon}</span><h3>${title}</h3></summary>
        <div class="pinfo-body">${body}</div>
      </details>`;

  function featuresBody() {
    const feats = [['👫', 'feat_friend'], ['🗺️', 'feat_map'], ['🧩', 'feat_games'], ['🎨', 'feat_colour'], ['🏅', 'feat_stickers'],
      ['❓', 'feat_quiz'], ['📈', 'feat_progress'], ['🔊', 'feat_langs'], ['🎬', 'feat_videos']];
    return `<ul class="feature-list">${feats.map(([i, k]) => `<li><span class="fl-icon" aria-hidden="true">${i}</span><div><h4>${t(k)}</h4><p>${t(k + '_d')}</p></div></li>`).join('')}</ul>`;
  }

  function howBody() {
    return `<ol class="how-steps">${[1, 2, 3].map(n => `<li class="how-step"><span class="how-num" aria-hidden="true">${n}</span><div><h4>${t('how' + n + '_t')}</h4><p>${t('how' + n + '_d')}</p></div></li>`).join('')}</ol>`;
  }

  function agesBody(c) {
    return `<p class="pinfo-sub">${t('gamesSub')}</p>
      <div class="age-grid">
        ${GROUPS.map(g => `<article class="age ${g.cls}">
          <h4><span aria-hidden="true">${g.icon}</span> ${t('age_' + g.id)}</h4><p>${t('age_' + g.id + '_d')}</p>
          <ul class="mini-games">${gamesFor(g.id).map(x => `<li><span aria-hidden="true">${x.icon}</span> ${gameTitle(x)}</li>`).join('')}</ul>
          <a class="more-link" href="${c.page(g.page)}">${t('learnMore')} <span class="flip-rtl">→</span></a>
        </article>`).join('')}
      </div>
      <p class="center"><a class="btn ghost" href="${c.page('games')}">${t('seeAllGames')} <span class="flip-rtl">→</span></a></p>`;
  }

  function subjectsBody(c) {
    return `<div class="subject-grid">${SUBJECTS.map(s => `<a class="subject" href="${c.page(s.page)}"><span class="subject-icon" aria-hidden="true">${s.icon}</span><span>${t(s.key)}</span></a>`).join('')}</div>`;
  }

  function meetBody() {
    return `<div class="meet"><div class="meet-art" aria-hidden="true">${Art.brainy({ mood: 'happy' })}</div><p>${t('meetBrainyText')}</p></div>`;
  }

  // The FAQ stays visible as a list of questions (answers open on tap). Its text matches the
  // FAQ JSON-LD that infra/build-seo.ps1 writes, word for word.
  function faq() {
    return `<div class="faq">
      <h3 class="faq-title">${t('faqTitle')}</h3>
      ${FAQ.map(n => `<details class="card faq-item"><summary><h4>${t('faq' + n + 'q')}</h4></summary><p>${t('faq' + n + 'a')}</p></details>`).join('')}
    </div>`;
  }

  function parents(c) {
    return `<section class="section for-parents" id="parents" aria-labelledby="parents-title">
      <h2 class="section-title" id="parents-title">👪 ${t('lp_parents')}</h2>
      <p class="section-sub">${t('lp_parentsSub')}</p>
      <p class="parents-trust">🛡️ ${t('trustLine')}</p>
      <div class="pinfo-grid">
        ${block('features', '🧩', t('featuresTitle'), featuresBody())}
        ${block('how', '🚀', t('how_title'), howBody())}
        ${block('ages', '🎂', t('gamesTitle'), agesBody(c))}
        ${block('subjects', '📚', t('subjectsTitle'), subjectsBody(c))}
        ${block('brainy', '💙', t('meetBrainy'), meetBody())}
      </div>
      ${faq()}
    </section>`;
  }

  // "How are we doing?" (owner, 2026-11-09): the last section before the footer, for parents. In the app,
  // js/feedback.js draws the form into [data-feedback]; the static pages keep the button to the form (#/feedback).
  const feedbackOn = () => !(IK_CONFIG.feedback && IK_CONFIG.feedback.enabled === false);
  function feedback(c) {
    if (!feedbackOn()) return '';
    return `<section class="section feedback-section" id="feedback" aria-labelledby="feedback-title">
      <div class="card fb-card">
        <h2 class="section-title" id="feedback-title">⭐ ${t('fb_title')}</h2>
        <p class="section-sub">${t('fb_sub')}</p>
        <div class="fb" data-feedback><p class="center"><a class="btn primary big" href="${c.app('#/feedback')}">⭐ ${t('fb_menu')}</a></p></div>
      </div>
    </section>`;
  }

  function footer(c) {
    // Legal links in every footer. With payments on (IK_CONFIG.payments.enabled), the pricing and refund
    // links and the payment note come back (payment providers check for them in their website review).
    // Last: the parents' feedback form (#/feedback).
    const pay = !!(IK_CONFIG.payments && IK_CONFIG.payments.enabled);
    const legal = (pay ? [['pricing.html', 'pricing']] : []).concat([['terms.html', 'termsOfService'], ['privacy.html', 'privacyPolicy']],
      pay ? [['refund.html', 'refundPolicy']] : [], [['security.html', 'dataSecurity'], ['contact.html', 'contactUs']]);
    return `<footer class="footer">
      <p class="footer-links">${legal.map(([f, k]) => `<a href="${c.asset(f)}">${t(k)}</a>`).join(' · ')}${feedbackOn() ? ` · <a class="footer-feedback" href="${c.app('#/feedback')}" data-feedback-link><span aria-hidden="true">⭐</span> ${t('fb_link')}</a>` : ''}</p>
      ${pay ? `<p class="muted small">${t('paddleNote')}</p>` : ''}
      <p class="footer-langs">${t('otherLangs')}: ${IK_CONFIG.languages.map(l => `<a href="${c.home(l.code)}" lang="${l.code}">${l.name}</a>`).join(' · ')} · <span class="lang-soon">${t('moreLangsSoon')}</span></p>
      <p class="muted">© ${new Date().getFullYear()} IntelloKids</p>
    </footer>`;
  }

  // A game card for the static SEO pages.
  function gameCard(g, agesText) {
    return `<article class="card game-card"><div class="game-icon" aria-hidden="true">${g.icon}</div>
      <div><h3>${gameTitle(g)}</h3><p class="game-ages">${agesText}</p><p>${t('gd_' + g.id)}</p></div></article>`;
  }

  function html(o) {
    const c = ctx(o || {});
    return (c.langBar ? langBar(c) : '') + hero(c) + keyPoints(c) + parents(c) + feedback(c) + footer(c);
  }

  window.Landing = {
    html, footer: o => footer(ctx(o || {})), gameCard, gameTitle, gamesFor, agesOf, path,
    GAMES, GROUPS, SUBJECTS, PAGES, FAQ
  };
})();
