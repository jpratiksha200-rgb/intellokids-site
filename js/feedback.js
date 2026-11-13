/* IntelloKids feedback form for parents (owner, 2026-11-09: "parents can rate with five stars and write
   feedback, and it must arrive in my email").
   Shown in the "How are we doing?" section at the bottom of the home page and on #/feedback (noindex), and
   reached from the footer link and the parent's account menu. Never in the kids' area.
   The website has no server, so the form posts JSON to the address in IK_CONFIG.feedback.endpoint
   (FormSubmit, which emails it to kidsintello@gmail.com). It sends only what the parent types (stars,
   message, optional name and email) plus the language and the page: no child data, no account id.
   If sending fails, the parent gets a mailto: link with the rating and message filled in.
   Needs config.js, i18n.js, characters.js (Art) and store.js. */
(function () {
  const t = (k, v) => I18N.t(k, v);
  const esc = s => Art.esc(s);
  const cfg = () => Object.assign({ enabled: true, cooldown: 30, maxLength: 2000, email: 'kidsintello@gmail.com', endpoint: '' }, IK_CONFIG.feedback || {});
  const MOODS = ['', '😞', '😕', '🙂', '😀', '😍'];
  const LAST_KEY = 'ik_feedback_last';
  let lastSend = 0, seq = 0;

  const starText = n => '★'.repeat(n) + '☆'.repeat(5 - n) + ' (' + n + '/5)';
  const subject = n => 'IntelloKids feedback: ' + starText(n);

  // At most one send per cooldown (30 s) from this browser, also across page reloads.
  function lastTime() { try { return Math.max(lastSend, Number(localStorage.getItem(LAST_KEY)) || 0); } catch (e) { return lastSend; } }
  function markSend() { lastSend = Date.now(); try { localStorage.setItem(LAST_KEY, String(lastSend)); } catch (e) { /* private mode */ } }
  const waitLeft = () => Math.max(0, Math.ceil((lastTime() + cfg().cooldown * 1000 - Date.now()) / 1000));

  // The page the form was sent from (address without the ?lang= part; only the route when opened from a file).
  const pageRef = () => (location.protocol === 'file:' ? '' : location.origin + location.pathname) + (location.hash || '#/');

  // What is sent. FormSubmit fields: _subject (email subject), _template, _captcha (off: we use the
  // honeypot and the cooldown instead), _honey (FormSubmit drops anything where it isn't empty).
  // "email", when given, becomes the Reply-To, so the owner can simply press Reply.
  function payload(f) {
    const p = {
      _subject: subject(f.rating), _template: 'table', _captcha: 'false', _honey: f.honey || '',
      rating: starText(f.rating), message: f.message || '—'
    };
    if (f.name) p.name = f.name;
    if (f.email) p.email = f.email;
    p.language = I18N.getLang();
    p.page = pageRef();
    return p;
  }

  function send(data) {
    const c = cfg();
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = setTimeout(() => { if (ctrl) ctrl.abort(); }, 20000);
    return fetch(c.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
      signal: ctrl ? ctrl.signal : undefined
    }).then(r => r.json().catch(() => ({})).then(j => {
      // FormSubmit answers {"success": "true"}; before the owner activates the form it answers "false".
      if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || 'HTTP ' + r.status);
      return j;
    })).then(j => { clearTimeout(timer); return j; }, e => { clearTimeout(timer); throw e; });
  }

  // Plan B when sending fails: the parent's own email app, with the rating and message filled in.
  function mailto(f) {
    const body = (f.rating ? starText(f.rating) : '') + (f.message ? '\n\n' + f.message.slice(0, 1500) : '');
    return 'mailto:' + cfg().email + '?subject=' + encodeURIComponent(f.rating ? subject(f.rating) : 'IntelloKids feedback') + '&body=' + encodeURIComponent(body);
  }

  function formHtml(h) {
    const u = Store.currentUser(), c = cfg(), id = 'fb' + (++seq);
    const stars = [1, 2, 3, 4, 5].map(n => `<input type="radio" class="fb-star-input" name="rating" value="${n}" id="${id}-r${n}" required>
          <label class="fb-star" for="${id}-r${n}" title="${esc(t('fb_r' + n))}"><span aria-hidden="true">★</span><span class="sr-only">${esc(t('fb_r' + n))}, ${esc(t('fb_starOf', { n }))}</span></label>`).join('');
    return `<form class="fb-form" novalidate>
        <div class="fb-fail" role="alert" hidden>
          <p class="fb-fail-title"><span aria-hidden="true">😕</span> <strong>${t('fb_failTitle')}</strong></p>
          <p>${t('fb_fail')}</p>
          <p class="row center"><a class="btn ghost" data-mailto href="mailto:${esc(c.email)}">✉️ ${t('fb_mailto')}</a></p>
        </div>
        <fieldset class="fb-rate">
          <legend class="fb-legend">${t('fb_rating')}</legend>
          <div class="fb-stars">${stars}</div>
          <p class="fb-word" aria-hidden="true"></p>
        </fieldset>
        <label class="fb-label">${t('fb_message')}
          <textarea class="input fb-text" name="message" rows="4" maxlength="${c.maxLength}" placeholder="${esc(t('fb_messagePh'))}"></textarea></label>
        <p class="fb-count muted small" aria-hidden="true">0 / ${c.maxLength}</p>
        <div class="fb-two">
          <label class="fb-label">${t('fb_name')}<input class="input" name="name" maxlength="60" autocomplete="name"></label>
          <label class="fb-label">${t('fb_email')}<input class="input" type="email" name="email" maxlength="120" autocomplete="email" value="${u ? esc(u.email) : ''}"></label>
        </div>
        <div class="fb-hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="_honey" tabindex="-1" autocomplete="off"></label></div>
        <p class="form-error" role="alert"></p>
        <div class="row center"><button class="btn primary big fb-send" type="submit">⭐ ${t('fb_send')}</button></div>
        <p class="fb-privacy muted small">🔒 ${t('fb_privacy')} <a href="privacy.html">${t('privacyPolicy')}</a></p>
      </form>
      <div class="fb-done" role="status" tabindex="-1" hidden>
        <div class="fb-brainy" aria-hidden="true">${Art.brainy({ mood: 'cheer' })}</div>
        <h${h} class="fb-done-title">${t('fb_thanksTitle')}</h${h}>
        <p>${t('fb_thanks')}</p>
        <button type="button" class="btn ghost" data-again>${t('fb_again')}</button>
      </div>`;
  }

  // mount(element, { heading }): draws the form into element. heading = level of the thank-you title.
  function mount(root, o) {
    if (!root || !cfg().enabled) return;
    const h = Math.min(6, Math.max(2, (o && o.heading) || 3));
    root.innerHTML = formHtml(h);
    const form = root.querySelector('form'), done = root.querySelector('.fb-done'), fail = root.querySelector('.fb-fail');
    const err = form.querySelector('.form-error'), btn = form.querySelector('.fb-send'), sendLabel = btn.innerHTML;
    const radios = [...form.querySelectorAll('input[name="rating"]')], labels = [...form.querySelectorAll('.fb-star')];
    const word = form.querySelector('.fb-word'), text = form.querySelector('[name="message"]'), count = form.querySelector('.fb-count');
    const field = n => form.querySelector(`[name="${n}"]`);
    const rating = () => { const r = radios.find(x => x.checked); return r ? Number(r.value) : 0; };
    const paint = n => labels.forEach((l, i) => l.classList.toggle('on', i < n));
    let busy = false;

    radios.forEach(r => r.addEventListener('change', () => {
      const n = rating();
      paint(n); word.textContent = n ? MOODS[n] + ' ' + t('fb_r' + n) : '';
      if (err.textContent === t('fb_errRating')) err.textContent = '';
    }));
    // Mouse users see the stars light up as they point (touch and keyboard just pick).
    labels.forEach((l, i) => {
      l.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') paint(i + 1); });
      l.addEventListener('pointerleave', () => paint(rating()));
    });
    text.addEventListener('input', () => { count.textContent = text.value.length + ' / ' + cfg().maxLength; });

    const read = () => ({
      rating: rating(),
      message: field('message').value.trim().slice(0, cfg().maxLength),
      name: field('name').value.trim().slice(0, 60),
      email: field('email').value.trim().slice(0, 120),
      honey: field('_honey').value
    });
    const showDone = () => { form.hidden = true; done.hidden = false; done.focus(); };

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (busy) return;
      const f = read();
      if (!f.rating) { err.textContent = t('fb_errRating'); radios[0].focus(); return; }
      if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) { err.textContent = t('err_email'); field('email').focus(); return; }
      const wait = waitLeft();
      if (wait) { err.textContent = t('fb_wait', { n: wait }); return; }
      err.textContent = '';
      if (f.honey) { showDone(); return; }   // a robot filled the hidden field: say thanks, send nothing
      busy = true; btn.disabled = true; btn.textContent = t('fb_sending'); fail.hidden = true;
      markSend();
      send(payload(f)).then(showDone, () => {
        fail.querySelector('[data-mailto]').href = mailto(f);
        fail.hidden = false;
        fail.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }).then(() => { busy = false; btn.disabled = false; btn.innerHTML = sendLabel; });
    });
    done.querySelector('[data-again]').addEventListener('click', () => { mount(root, o); const s = root.querySelector('.fb-star-input'); if (s) s.focus(); });
  }

  window.Feedback = { mount, enabled: () => cfg().enabled !== false };
})();
