/* The "page not found" page (404.html) in the visitor's language (QA P2-14): the language they chose on the site,
   else the /fr/ or /es/ part of the address, else the browser's language; English otherwise. en, fr, es only. */
(function () {
  var T = {
    fr: { title: 'Page introuvable | IntelloKids', h1: 'Oups ! Brainy ne trouve pas cette page.',
      p: 'La page a peut-être changé d’adresse. Retournons à l’aventure !', a: 'Aller à l’accueil d’IntelloKids' },
    es: { title: 'Página no encontrada | IntelloKids', h1: '¡Ups! Brainy no encuentra esta página.',
      p: 'Puede que la página se haya movido. ¡Volvamos a la aventura!', a: 'Ir a la página de inicio de IntelloKids' }
  };
  var lang = null;
  try { lang = (JSON.parse(localStorage.getItem('intellokids_db_v1') || '{}') || {}).lang; } catch (e) { /* no storage */ }
  if (!lang || !T[lang] && lang !== 'en') {
    var m = /^\/(fr|es|en)(\/|$)/.exec(location.pathname);
    lang = m ? m[1] : null;
  }
  if (!lang) {
    var list = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < list.length && !lang; i++) { var c = String(list[i]).slice(0, 2).toLowerCase(); if (c === 'en' || T[c]) lang = c; }
  }
  var s = T[lang];
  if (!s) return;   // English: the page is already in English
  document.documentElement.lang = lang;
  document.title = s.title;
  document.getElementById('nf-title').textContent = s.h1;
  document.getElementById('nf-text').textContent = s.p;
  var a = document.getElementById('nf-home');
  a.textContent = s.a;
  a.setAttribute('href', '/?lang=' + lang);
})();
