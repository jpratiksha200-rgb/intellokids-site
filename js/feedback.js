/* IntelloKids feedback for parents (owner, 2026-11-09: "parents can rate with five stars and write feedback, and it
   must arrive in my email").
   A card at the bottom of the Parents' area (#/parent, owner 2026-11-18; #/feedback leads there), for logged-in
   parents only. Never in the kids' area.
   Owner, 2026-11-18: no third party any more (it was FormSubmit). The card posts to our own API
   (POST /api/v1/feedback, js/cloud.js Cloud.feedback): only the optional stars and the message, plus the language.
   The server keeps it in our database (EU) and emails it to help@intellokids.com with the parent's account email as
   the reply-to. No child data. Without the online accounts (IK_CONFIG.backend off, or an account that isn't online)
   nothing can be sent: the parent gets the "Email us instead" link with the rating and message filled in.
   Needs config.js, i18n.js, characters.js (Art), store.js and cloud.js. */
(function () {
  const t = (k, v) => I18N.t(k, v);
  const esc = s => Art.esc(s);
  const cfg = () => Object.assign({ enabled: true, cooldown: 30, maxLength: 2000, email: 'help@intellokids.com' }, IK_CONFIG.feedback || {});
  const LAST_KEY = 'ik_feedback_last';
  let lastSend = 0, seq = 0;

  const starText = n => '★'.repeat(n) + '☆'.repeat(5 - n) + ' (' + n + '/5)';
  const subject = n => 'IntelloKids feedback: ' + starText(n);

  // At most one send per cooldown (30 s) from this browser, also across page reloads (the server allows 5 a day).
  function lastTime() { try { return Math.max(lastSend, Number(localStorage.getItem(LAST_KEY)) || 0); } catch (e) { return lastSend; } }
  function markSend() { lastSend = Date.now(); try { localStorage.setItem(LAST_KEY, String(lastSend)); } catch (e) { /* private mode */ } }
  const waitLeft = () => Math.max(0, Math.ceil((lastTime() + cfg().cooldown * 1000 - Date.now()) / 1000));

  // Can this account send through our API? (Online accounts on and a confirmed, signed-in family.)
  function online(u) {
    return !!(window.Cloud && Cloud.on() && u && u.cloud && u.cloud.token && u.cloud.status === 'active');
  }
  // Resolves on success; rejects with { code } ('offline' when it can't be sent from here, 'rate_limited', …).
  function send(f, u) {
    if (!online(u)) return Promise.reject({ code: 'offline' });
    return Cloud.feedback(f.rating, f.message).then(r => { if (!r.ok) throw { code: r.code }; return r; });
  }

  // Plan B when sending fails: the parent's own email app, with the rating and message filled in.
  function mailto(f) {
    const body = (f.rating ? starText(f.rating) : '') + (f.message ? '\n\n' + f.message.slice(0, 1500) : '');
    return 'mailto:' + cfg().email + '?subject=' + encodeURIComponent(f.rating ? subject(f.rating) : 'IntelloKids feedback') + '&body=' + encodeURIComponent(body);
  }

  // ---- The feedback card at the bottom of the Parents' area (owner, 2026-11-18) ----
  // KISS: optional stars, one message box and Send. The parent's name and email come from the account (so we can
  // reply) and are named in the small note under the button; children's names are never sent.
  // After a successful send the card becomes one "✓ Thanks!" line, and stays that way on this device for this family.
  const doneKey = u => 'ik_fb_sent_' + String((u && u.cloud && u.cloud.familyId) || (u && u.email) || '').toLowerCase();
  function isDone(u) { try { return !!localStorage.getItem(doneKey(u)); } catch (e) { return false; } }
  function markDone(u) { try { localStorage.setItem(doneKey(u), String(Date.now())); } catch (e) { /* private mode */ } }
  const doneLine = () => `<p class="fb-sent-line" role="status" tabindex="-1"><span class="fb-sent-tick" aria-hidden="true">✓</span> ${t('fb_sentLine')}</p>`;

  function cardHtml() {
    const c = cfg(), id = 'fb' + (++seq);
    const stars = [1, 2, 3, 4, 5].map(n => `<input type="radio" class="fb-star-input" name="rating" value="${n}" id="${id}-r${n}">
          <label class="fb-star" for="${id}-r${n}" title="${esc(t('fb_r' + n))}"><span aria-hidden="true">★</span><span class="sr-only">${esc(t('fb_r' + n))}, ${esc(t('fb_starOf', { n }))}</span></label>`).join('');
    return `<h2 class="fb-card-title" id="${id}-title"><span aria-hidden="true">⭐</span> ${t('fb_title')}</h2>
      <p class="fb-card-sub muted">${t('fb_cardSub')}</p>
      <form class="fb-form" novalidate aria-labelledby="${id}-title">
        <div class="fb-fail" role="alert" hidden>
          <p class="fb-fail-title"><span aria-hidden="true">😕</span> <strong>${t('fb_failTitle')}</strong></p>
          <p>${t('fb_fail')}</p>
          <p class="row center"><a class="btn ghost" data-mailto href="mailto:${esc(c.email)}">✉️ ${t('fb_mailto')}</a></p>
        </div>
        <fieldset class="fb-rate">
          <legend class="fb-legend">${t('fb_ratingOpt')}</legend>
          <div class="fb-stars">${stars}</div>
        </fieldset>
        <label class="fb-label">${t('fb_message')}
          <textarea class="input fb-text" name="message" rows="3" maxlength="${c.maxLength}" placeholder="${esc(t('fb_messagePh'))}"></textarea></label>
        <div class="fb-hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="_honey" tabindex="-1" autocomplete="off"></label></div>
        <p class="form-error" role="alert"></p>
        <div class="row center"><button class="btn primary fb-send" type="submit">${t('fb_send')}</button></div>
        <p class="fb-privacy muted small">🔒 ${t('fb_cardPrivacy')}</p>
      </form>`;
  }

  // mountCard(element): draws the card (or the "✓ Thanks!" line) for the parent who is logged in.
  function mountCard(root) {
    const u = Store.currentUser();
    if (!root || !cfg().enabled || !u) return;
    if (isDone(u)) { root.classList.add('is-done'); root.innerHTML = doneLine(); return; }
    root.classList.remove('is-done');
    root.innerHTML = cardHtml();
    const form = root.querySelector('form'), fail = root.querySelector('.fb-fail');
    const err = form.querySelector('.form-error'), btn = form.querySelector('.fb-send'), sendLabel = btn.innerHTML;
    const radios = [...form.querySelectorAll('input[name="rating"]')], labels = [...form.querySelectorAll('.fb-star')];
    const rating = () => { const r = radios.find(x => x.checked); return r ? Number(r.value) : 0; };
    const paint = n => labels.forEach((l, i) => l.classList.toggle('on', i < n));
    let busy = false;
    radios.forEach(r => r.addEventListener('change', () => { paint(rating()); err.textContent = ''; }));
    labels.forEach((l, i) => {
      l.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') paint(i + 1); });
      l.addEventListener('pointerleave', () => paint(rating()));
    });
    form.querySelector('textarea').addEventListener('input', () => { if (err.textContent === t('fb_errEmpty')) err.textContent = ''; });
    const finish = () => { markDone(u); root.classList.add('is-done'); root.innerHTML = doneLine(); root.querySelector('.fb-sent-line').focus(); };

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (busy) return;
      const f = {
        rating: rating(), message: form.querySelector('[name="message"]').value.trim().slice(0, cfg().maxLength),
        honey: form.querySelector('[name="_honey"]').value
      };
      if (!f.rating && !f.message) { err.textContent = t('fb_errEmpty'); radios[0].focus(); return; }
      const wait = waitLeft();
      if (wait) { err.textContent = t('fb_wait', { n: wait }); return; }
      err.textContent = '';
      if (f.honey) { finish(); return; }   // a robot filled the hidden field: say thanks, send nothing
      busy = true; btn.disabled = true; btn.textContent = t('fb_sending'); fail.hidden = true;
      markSend();
      // On failure the message stays in the box, with the error and the "Email us instead" link
      // (too many today: a short note instead).
      send(f, u).then(finish, e => {
        busy = false; btn.disabled = false; btn.innerHTML = sendLabel;
        if (e && e.code === 'rate_limited') { err.textContent = t('fb_limit'); return; }
        fail.querySelector('[data-mailto]').href = mailto(f);
        fail.hidden = false;
      });
    });
  }

  window.Feedback = { mountCard, enabled: () => cfg().enabled !== false };
})();
