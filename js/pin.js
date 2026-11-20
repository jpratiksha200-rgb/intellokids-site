/* IntelloKids parent PIN and kid lock (owner, 2026-11-18).
 * One 4-digit PIN per family. When a child's playground opens, the device is locked to that child: inside it they go
 * everywhere (map, games, videos, colouring, stickers, chat), but every way out (the Parents button, the logo, another
 * address, Back/Forward, the Android back button, a sibling's playground) first asks for the PIN. The lock survives a
 * reload or a closed tab. "Forgot PIN?" opens it with the account password, then the parent picks a new PIN.
 * Data and checks live in Store (hasPin, setPin, tryPin, lockedKid, lockTo, unlock); this file has the screens.
 * app.js calls KidLock.init({ modal, toast, parentGate }) once, KidLock.guard() at the start of every route, and
 * KidLock.setup() where a PIN is still missing. */
(function () {
  let H = null; // app helpers: { modal, toast, parentGate }
  let shown = null; // the address of the locked child's screen that is on show (we stay on it)
  const esc = s => Art.esc(s);
  const open = () => !!document.querySelector('.modal-back .pin');

  // ---- The number pad (a pop-up) ----
  // o: { icon, title, sub, onPin(pin, pad), cancel (fn, or none: no Cancel button), forgot (fn: the "Forgot PIN?" link) }
  // pad: { fail(text), reset(), retitle(title, sub), close() }
  function pad(o) {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => `<button type="button" class="pin-key" data-d="${d}">${d}</button>`).join('')
      + (o.cancel ? `<button type="button" class="pin-key pin-cancel" data-x>${t('cancel')}</button>` : '<span></span>')
      + '<button type="button" class="pin-key" data-d="0">0</button>'
      + `<button type="button" class="pin-key pin-del" data-del aria-label="${t('pin_delete')}"><span aria-hidden="true">⌫</span></button>`;
    const m = H.modal(`<div class="pin" tabindex="-1" data-autofocus>
        <p class="pin-icon" aria-hidden="true">${o.icon || '🔒'}</p>
        <h2>${o.title}</h2>
        <p class="pin-sub">${o.sub || ''}</p>
        <p class="pin-dots" role="status" aria-live="polite"><span></span><span></span><span></span><span></span><span class="sr-only"></span></p>
        <p class="pin-error" role="alert"></p>
        <div class="pin-keys">${keys}</div>
        ${o.forgot ? `<p class="pin-forgot"><button type="button" class="link-btn" data-forgot>${t('pin_forgot')}</button></p>` : ''}
      </div>`);
    const box = m.el.querySelector('.pin'), dots = [...box.querySelectorAll('.pin-dots > span:not(.sr-only)')];
    const err = box.querySelector('.pin-error'), said = box.querySelector('.pin-dots .sr-only');
    let typed = '', timer = null;
    const draw = () => { dots.forEach((d, i) => d.classList.toggle('on', i < typed.length)); said.textContent = t('pin_typed', { n: typed.length }); };
    const keysOff = off => box.querySelectorAll('[data-d], [data-del]').forEach(b => { b.disabled = off; });
    // A wait after too many wrong tries: the digits are off and the seconds count down.
    const waitOut = () => {
      clearInterval(timer);
      const tick = () => {
        const ms = Store.pinWait();
        if (!ms || !m.el.isConnected) { clearInterval(timer); keysOff(false); err.textContent = ''; return; }
        keysOff(true); err.textContent = t('pin_wait', { s: Math.ceil(ms / 1000) });
      };
      tick(); timer = setInterval(tick, 1000);
    };
    const api = {
      fail(text) { typed = ''; draw(); err.textContent = text; box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); },
      reset() { typed = ''; draw(); },
      retitle(title, sub) { box.querySelector('h2').textContent = title; box.querySelector('.pin-sub').textContent = sub || ''; },
      waitOut,
      close() { clearInterval(timer); document.removeEventListener('keydown', onKey, true); m.close(); }
    };
    const press = d => {
      if (typed.length >= 4 || Store.pinWait()) return;
      typed += d; err.textContent = ''; draw();
      if (typed.length === 4) { const pin = typed; setTimeout(() => o.onPin(pin, api), 120); }
    };
    const del = () => { typed = typed.slice(0, -1); draw(); };
    box.querySelectorAll('[data-d]').forEach(b => { b.onclick = () => press(b.dataset.d); });
    box.querySelector('[data-del]').onclick = del;
    if (o.cancel) box.querySelector('[data-x]').onclick = () => { api.close(); o.cancel(); };
    if (o.forgot) box.querySelector('[data-forgot]').onclick = () => { api.close(); o.forgot(); };
    // A keyboard works too: digits, Backspace (Escape is the pop-up's Cancel).
    const onKey = e => {
      if (!m.el.isConnected) return document.removeEventListener('keydown', onKey, true);
      if (document.querySelectorAll('.modal-back')[document.querySelectorAll('.modal-back').length - 1] !== m.el) return;
      if (/^[0-9]$/.test(e.key)) { e.preventDefault(); press(e.key); } else if (e.key === 'Backspace') { e.preventDefault(); del(); }
    };
    document.addEventListener('keydown', onKey, true);
    draw();
    if (Store.pinWait()) waitOut();
    return api;
  }

  // ---- Choose a PIN: type it, then type it again ----
  // o: { title, cancel (fn or none: required), done (fn) }
  function choose(o) {
    let first = null;
    pad({
      icon: '🔐', title: o.title || t('pin_setTitle'), sub: t('pin_setSub'), cancel: o.cancel,
      onPin(pin, p) {
        if (first === null) { first = pin; p.reset(); return p.retitle(t('pin_again'), ''); }
        if (pin !== first) { first = null; p.retitle(o.title || t('pin_setTitle'), t('pin_setSub')); return p.fail(t('pin_mismatch')); }
        Store.setPin(pin); p.close(); H.toast('🔒 ' + t('pin_saved'));
        if (o.done) o.done();
      }
    });
  }

  // The Parents' area with children but no PIN yet (just added the first child, or the first visit since this shipped):
  // the parent chooses one now, no way around it. Online accounts ask the server first: it may come from another device.
  function setup() {
    const u = Store.currentUser();
    if (open() || !u || !(u.children || []).length || Store.hasPin()) return;
    const now = () => { if (!open() && !Store.hasPin() && location.hash.indexOf('#/parent') === 0) choose({}); };
    // Only the PIN is asked for (Cloud.serverPin): quick, and it never waits for the child's upload.
    if (window.Cloud && Cloud.on() && Store.isOnline()) Cloud.serverPin().then(now, now); else now();
  }

  // ---- Ask for the PIN ----
  // o: { title, sub, ok (the right PIN), cancel, reset (after "Forgot PIN?": the password, then a new PIN or Cancel) }
  function ask(o) {
    pad({
      title: o.title || t('pin_title'), sub: o.sub || '', cancel: o.cancel,
      onPin(pin, p) {
        const r = Store.tryPin(pin);
        if (r.ok) { p.close(); return o.ok(); }
        if (r.wait) { p.reset(); return p.waitOut(); }
        p.fail(t('pin_wrong'));
      },
      // Forgot PIN: the account password (the grown-ups gate, which also opens the lock), then a new PIN (Cancel keeps
      // the old one).
      forgot: () => H.parentGate(() => choose({ title: t('pin_newTitle'), cancel: o.reset, done: o.reset }), () => ask(o))
    });
  }

  // ---- The lock, checked at the start of every route (app.js render). true = stop: this route doesn't open. ----
  function guard() {
    const u = Store.currentUser(), id = Store.lockedKid();
    const p = location.hash.replace(/^#\/?/, '').split('?')[0].split('/').filter(Boolean);
    if (!id) {
      shown = null;
      // Opening a child's playground locks the device to that child. Without a PIN yet, the parent chooses one first.
      const kid = u && p[0] === 'kid' && Store.getChild(p[1]);
      if (!kid || (window.Cloud && Cloud.pending())) return false;
      if (Store.hasPin()) { Store.lockTo(kid.id); shown = location.hash; return false; }
      document.querySelectorAll('.modal-back').forEach(x => x.remove());
      choose({ done: () => { Store.lockTo(kid.id); window.dispatchEvent(new HashChangeEvent('hashchange')); },
        cancel: () => location.replace('#/parent') });
      return true;
    }
    if (p[0] === 'kid' && p[1] === id) { shown = location.hash; return false; }
    // A way out. The child's screen stays as it is (a game keeps going) and the address goes back to it; the PIN opens
    // the way to where they were going. Cancel: back to playing.
    if (!shown) { location.replace('#/kid/' + id); return true; } // a reload or a new tab: straight back into the playground
    const target = location.hash || '#/';
    try { history.replaceState(null, '', shown); } catch (e) { location.replace(shown); return true; }
    if (open()) return true;
    const kid = Store.getChild(id);
    const leave = () => { Store.unlock(); location.hash = target; };
    ask({ sub: t('pin_askSub', { name: esc(kid.name) }), cancel: () => {}, ok: leave, reset: leave });
    return true;
  }

  // Settings → Change PIN: the current PIN (or the password, "Forgot PIN?"), then the new one twice.
  function change(done) {
    const pick = () => choose({ title: t('pin_newTitle'), cancel: () => {}, done });
    if (!Store.hasPin()) return choose({ cancel: () => {}, done });
    ask({ title: t('pin_current'), cancel: () => {}, ok: pick, reset: done || (() => {}) });
  }

  // "🔒 Locked to Mia" in the child's top bar, so the parent sees the lock is on.
  // On phones only "🔒 Mia" shows (the long text stays for screen readers).
  const badge = kid => `<span class="kid-pill kid-lock" title="${t('pin_lockedTo', { name: esc(kid.name) })}"><span aria-hidden="true">🔒</span>
    <span class="kid-lock-long">${t('pin_lockedTo', { name: esc(kid.name) })}</span><span class="kid-lock-short" aria-hidden="true">${esc(kid.name)}</span></span>`;

  window.KidLock = { init: h => { H = h; }, guard, setup, change, badge };
})();
