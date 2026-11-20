/* IntelloKids landing page, shared by the app (viewLanding in js/app.js) and by the SEO page
   generator (infra/seo/build.js). One builder means the static pages that search engines read
   say exactly what visitors see. Needs config.js, i18n.js and characters.js.
   Layout (owner, 2026-11-08: "simple and kid-friendly"): a short first screen (Brainy, one sentence,
   one main button), four key points, then ONE "For parents" section that holds all the detail in
   collapsible blocks. Everything stays in the HTML, so search engines still read all of it.
   No feedback form on the home page (owner, 2026-11-15): feedback is for logged-in parents (#/feedback, account menu). */
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
    maths: 'maths-games/', shapes: 'shape-colour-games/', logic: 'logic-coding-games/', colouring: 'colouring-pages/',
    videos: 'learning-videos/'
  };
  // With the 7-day free trial on (IK_CONFIG.trial, owner 2026-11-13), the FAQ adds "Is IntelloKids free?" and the
  // first screen says "Try everything free for 7 days, no card needed."
  const trialOn = !!(window.IK_CONFIG && IK_CONFIG.trial && IK_CONFIG.trial.enabled);
  // Order (SEO, owner 2026-11-15): the brand questions parents search for first: what it is, free, ages, safe, app, languages.
  // Owner, 2026-11-17 (KISS): fewer, crisper questions. Videos, progress and "what will my child learn" are already in
  // "What's inside", so their FAQ entries (9, 4, 7) are no longer shown; the FAQ JSON-LD follows this list.
  const FAQ = [1].concat(trialOn ? [8] : [], [2, 3, 6, 5]);

  // Info pages with real URLs in every language that are not topic pages (no games list): the About page
  // (/about/, /fr/about/, /es/about/), built by infra/seo/build.js. path() and the app's page links know them too.
  const INFO_PAGES = { about: 'about/' };
  // Languages with translated legal pages (website/js/legal-fr.js, legal-es.js; static copies under fr/ and es/).
  const LEGAL_LANGS = ['en', 'fr', 'es'];
  const path = (lang, key) => (lang === 'en' ? '' : lang + '/') + (key in PAGES ? PAGES[key] : INFO_PAGES[key]);
  // The public Pricing page (made by infra/build-seo.ps1 while IK_CONFIG.payments.enabled): pricing.html in English,
  // fr/pricing.html and es/pricing.html in the other languages.
  const pricingPath = lang => (lang === 'en' || !IK_CONFIG.languages.some(l => l.code === lang) ? '' : lang + '/') + 'pricing.html';
  // Inside the Android app no Pricing or Refund link and no payment note are shown (Google Play payments policy).
  const inApp = () => !!(window.Store && Store.inApp && Store.inApp());
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
      app: o.appHref || (r => r),
      page: o.pageHref || (k => path(lang, k)),
      asset: o.asset || (p => p),
      home: o.homeHref || (code => code === 'en' ? '?lang=en' : code + '/'),
      brand: o.brandHref || '#/',   // the footer logo: this language's home page
    };
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
        ${trialOn && !c.signedIn ? `<p class="hero-trial">🎁 ${t('lp_trialLine')}</p>` : ''}
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

  // On phones (owner, 2026-11-09: "Brainy and a simple way in") the whole parents' section folds away behind the
  // "For parents" button: the app opens it with a tap, and the static pages use the #parents anchor (CSS :target), so it
  // works without JavaScript too. Wider screens show the section straight away, so the button is only shown on phones.
  // No key-point tiles any more (owner, 2026-11-18: no repeats; the same features are in "What's inside").
  function keyPoints() {
    return `<section class="key-section">
      <p class="center"><a class="btn ghost parents-jump" href="#parents" data-scroll="parents" aria-controls="parents">👪 ${t('lp_parentsLink')} <span aria-hidden="true">↓</span></a></p>
    </section>`;
  }

  // ---- "For parents": one place for everything a parent wants to know ----
  const block = (id, icon, title, body, open) => `<details class="card pinfo pinfo-${id}"${open ? ' open' : ''}>
        <summary><span class="pinfo-icon" aria-hidden="true">${icon}</span><h3>${title}</h3></summary>
        <div class="pinfo-body">${body}</div>
      </details>`;

  function featuresBody() {
    // Owner, 2026-11-17 (KISS): every feature once, in one short line. Talk to Brainy lives here too (it was repeated in
    // the About block and in "Meet Brainy").
    const feats = [['🗺️', t('feat_map'), t('feat_map_d')], ['🧩', t('feat_games'), t('feat_games_d')], ['🎬', t('feat_videos'), t('feat_videos_d')],
      ['🎨', t('feat_colour'), t('feat_colour_d')], ['❓', t('feat_quiz'), t('feat_quiz_d')], ['🏅', t('feat_stickers'), t('feat_stickers_d')],
      ['👫', t('feat_friend'), t('feat_friend_d')], ['💬', t('menu_chat'), t('lp_about_chat_d')], ['📈', t('feat_progress'), t('feat_progress_d')],
      ['🔊', t('feat_langs'), t('feat_langs_d')]];
    return `<ul class="feature-list">${feats.map(([i, h, d]) => `<li><span class="fl-icon" aria-hidden="true">${i}</span><div><h4>${h}</h4><p>${d}</p></div></li>`).join('')}</ul>`;
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
      </div>`;
  }

  function subjectsBody(c) {
    return `<div class="subject-grid">${SUBJECTS.map(s => `<a class="subject" href="${c.page(s.page)}"><span class="subject-icon" aria-hidden="true">${s.icon}</span><span>${t(s.key)}</span></a>`).join('')}</div>`;
  }

  // The FAQ stays visible as a list of questions (answers open on tap). Its text matches the
  // FAQ JSON-LD that infra/build-seo.ps1 writes, word for word.
  function faq() {
    return `<div class="faq">
      <h3 class="faq-title">${t('faqTitle')}</h3>
      ${FAQ.map(n => `<details class="card faq-item"><summary><h4>${t('faq' + n + 'q')}</h4></summary><p>${t('faq' + n + 'a')}</p></details>`).join('')}
    </div>`;
  }

  // No "About IntelloKids" card here (owner, 2026-11-18: no repeats; the hero already says what IntelloKids is). The About
  // page is linked once, from the footer ("About IntelloKids" under For parents), on every page.
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
      </div>
      ${faq()}
    </section>`;
  }

  // Social profiles in the footer (owner, 2026-11-17). URLs live in IK_CONFIG.social; an empty URL hides that icon.
  // Brand marks: Simple Icons 13.21.0 (CC0-1.0, simpleicons.org; LinkedIn's "in" mark as its brand guidelines allow), drawn in the footer's text colour, brand colour on
  // hover/focus (.soc-<id> in css/styles.css). infra/seo/build.js writes the same URLs into the Organization "sameAs".
  const SOCIAL = [
    { id: 'tiktok', name: 'TikTok', d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
    { id: 'instagram', name: 'Instagram', d: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077' },
    { id: 'facebook', name: 'Facebook', d: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z' },
    { id: 'youtube', name: 'YouTube', d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
    { id: 'x', name: 'X', d: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z' },
    { id: 'linkedin', name: 'LinkedIn', d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
  ];
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const socialLinks = () => SOCIAL.map(s => Object.assign({ url: String((IK_CONFIG.social || {})[s.id] || '').trim() }, s)).filter(s => /^https:\/\//.test(s.url));

  // The row of social icons (IK_CONFIG.social): the footer and the parents' "Contact us" panel (js/app.js) share it.
  // Empty when no profile is set, and always inside the Android app (and the kids' area never shows it).
  function socialRow(cls) {
    const soc = inApp() ? [] : socialLinks();
    return soc.length ? `<nav class="${cls || 'footer-social'} social-row" aria-label="${t('ft_follow')}">${soc.map(x => `<a href="${esc(x.url)}" target="_blank" rel="noopener me" aria-label="${t('ft_socialOn', { name: x.name })}" title="${t('ft_socialOn', { name: x.name })}" class="soc soc-${x.id}"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="${x.d}"/></svg></a>`).join('')}</nav>` : '';
  }

  // Footer (owner, 2026-11-15: "too cluttered, make it better"): a tidy grid of short columns with small headings
  // (brand · Learn · For parents · Legal), then a slim bottom bar with © and the payment note.
  // Owner, 2026-11-18: no feature or control repeated anywhere. The footer has no language row (the language menu is only
  // in the top bar; the head's hreflang links tell search engines about the other languages), no Pricing, Sign up or
  // Log in (all in the top bar). All games is here, not in the top bar (owner, 2026-11-18), no second description and no email (it is on the Contact page).
  // Every link stays a real <a href> (the topic and legal pages need these internal links for SEO).
  // Pricing, the Refund Policy and the Paddle note only while payments are on (Paddle's website review checks for
  // them), and never inside the Android app (Google Play payments policy).
  // No Feedback link: feedback is for logged-in parents only, from the account menu (owner, 2026-11-15).
  function footer(c) {
    const pay = !!(IK_CONFIG.payments && IK_CONFIG.payments.enabled) && !inApp();
    const col = (id, title, links) => `<nav class="footer-col footer-${id}" aria-labelledby="ft-${id}">
        <p class="footer-h" id="ft-${id}">${title}</p>
        <ul>${links.map(([href, text]) => `<li><a href="${href}">${text}</a></li>`).join('')}</ul>
      </nav>`;
    const learn = [[c.page('games'), t('allGames')], [c.page('videos'), t('videosTitle')]]
      .concat(GROUPS.map(g => [c.page(g.page), t('v_ages', { a: g.min + '–' + g.max })]), [[c.page('colouring'), t('subj_colouring')]]);
    // Legal pages and Contact in the page's language (owner, 2026-11-19): fr/terms.html, es/terms.html…
    const lf = f => c.asset((c.lang === 'en' || !LEGAL_LANGS.includes(c.lang) ? '' : c.lang + '/') + f);
    const parentsLinks = [[c.page('about'), t('lp_about_t')], [lf('contact.html'), t('contactUs')]];
    const legal = [[lf('terms.html'), t('termsOfService')], [lf('privacy.html'), t('privacyPolicy')]]
      .concat(pay ? [[lf('refund.html'), t('refundPolicy')]] : [], [[lf('security.html'), t('dataSecurity')]]);
    const social = socialRow('footer-social');
    return `<footer class="footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="footer-logo" href="${c.brand}"><img src="${c.asset('assets/logo-sm.png')}" width="203" height="150" alt="${t('logoAlt')}" loading="lazy"></a>
          ${social}
        </div>
        ${col('learn', t('ft_learn'), learn)}
        ${col('parents', t('ft_parents'), parentsLinks)}
        ${col('legal', t('ft_legal'), legal)}
      </div>
      <div class="footer-bottom">
        <p class="footer-copy"><span>© ${new Date().getFullYear()} IntelloKids</span>${pay ? `<span class="footer-pay">${t('paddleNote')}</span>` : ''}</p>
      </div>
    </footer>`;
  }

  // A game card for the static SEO pages.
  function gameCard(g, agesText) {
    return `<article class="card game-card"><div class="game-icon" aria-hidden="true">${g.icon}</div>
      <div><h3>${gameTitle(g)}</h3><p class="game-ages">${agesText}</p><p>${t('gd_' + g.id)}</p></div></article>`;
  }

  function html(o) {
    const c = ctx(o || {});
    // No language bar on the page (owner, 2026-11-18: "no repeated features"): the language menu is in the top bar
    // and the languages are in the footer.
    return hero(c) + keyPoints(c) + parents(c) + footer(c);
  }

  window.Landing = {
    html, footer: o => footer(ctx(o || {})), gameCard, gameTitle, gamesFor, agesOf, path,
    pricingPath, socialLinks, socialRow, LEGAL_LANGS, GAMES, GROUPS, SUBJECTS, PAGES, INFO_PAGES, FAQ
  };
})();
