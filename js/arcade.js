/* IntelloKids arcade: shared helpers for the treasure-chest games (js/arcade/*.js, opened from js/chests.js).
 * Every game registers itself as Arcade.games.<id> = { title, icon, instr, start(stage, ctx) }.
 *   ctx = { level (1–20), age, s (session), hud(text), say(text), win(stars 1–3), lose(), attempt }
 * A session (Arcade.session) owns every loop, timer and listener of one round, so all of it stops when the
 * child leaves the screen (Arcade.stop() is called by the router) or the round ends. */
(function () {
  const games = {};
  const live = [];
  const rand = (a, b) => a + Math.random() * (b - a);
  const irand = (a, b) => Math.floor(rand(a, b + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function stop() { live.splice(0).forEach(end => { try { end(); } catch (e) { /* already stopped */ } }); }

  function session(root) {
    const offs = [];
    let ended = false;
    const s = {
      get dead() { return ended || !document.body.contains(root); },
      on(target, type, fn, opts) { target.addEventListener(type, fn, opts); offs.push(() => target.removeEventListener(type, fn, opts)); },
      // step(dt) runs every frame; dt = 1 at 60 fps. Return false to stop.
      loop(step) {
        let last = performance.now(), raf = 0;
        const frame = now => {
          if (s.dead) return;
          const dt = Math.min(3, (now - last) / 16.667); last = now;
          if (step(dt, now) !== false) raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        offs.push(() => cancelAnimationFrame(raf));
      },
      timer(fn, ms) { const id = setTimeout(() => { if (!s.dead) fn(); }, ms); offs.push(() => clearTimeout(id)); return id; },
      every(fn, ms) { const id = setInterval(() => { if (s.dead) clearInterval(id); else fn(); }, ms); offs.push(() => clearInterval(id)); return id; },
      end() { if (ended) return; ended = true; offs.splice(0).forEach(f => f()); }
    };
    live.push(s.end);
    return s;
  }

  // A canvas that fills its box at the device's resolution. aspect = height / width. Returns { cv, g, w, h }.
  function canvas(box, aspect, maxVh) {
    const cv = document.createElement('canvas');
    cv.className = 'arc-canvas';
    box.appendChild(cv);
    const out = { cv, g: cv.getContext('2d'), w: 0, h: 0 };
    const fit = () => {
      const maxH = window.innerHeight * (maxVh || 0.62);
      let w = box.clientWidth || 320, h = w * aspect;
      if (h > maxH) { h = maxH; w = h / aspect; }
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.style.width = Math.round(w) + 'px'; cv.style.height = Math.round(h) + 'px';
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      out.g.setTransform(dpr, 0, 0, dpr, 0, 0);
      out.w = w; out.h = h;
    };
    fit();
    return out;
  }

  // Keyboard: arrows, WASD, space and enter. handlers = { up, down, left, right, action }.
  const KEY = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left',
    ArrowRight: 'right', d: 'right', D: 'right', ' ': 'action', Enter: 'action', Spacebar: 'action' };
  function keys(s, handlers, release) {
    s.on(document, 'keydown', e => {
      const k = KEY[e.key], el = e.target && e.target.closest ? e.target : null;
      if (!k || !handlers[k] || (el && el.closest('input, textarea, select'))) return;
      // Enter on a focused button keeps working as a click, and on a focused link (the chest's Skip, the map) always.
      if (k === 'action' && e.key === 'Enter' && el && (el.closest('a[href]') || (el.closest('button') && !handlers.forceEnter))) return;
      e.preventDefault();
      handlers[k](e);
    });
    if (release) s.on(document, 'keyup', e => { const k = KEY[e.key]; if (k && release[k]) release[k](e); });
  }

  // Swipe or tap on an element: cb('up'|'down'|'left'|'right'|'tap', event).
  function swipe(s, el, cb) {
    let x0 = 0, y0 = 0, on = false;
    s.on(el, 'pointerdown', e => { on = true; x0 = e.clientX; y0 = e.clientY; });
    s.on(el, 'pointerup', e => {
      if (!on) return; on = false;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return cb('tap', e);
      cb(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'), e);
    });
    s.on(el, 'pointercancel', () => { on = false; });
  }

  // Four big arrow buttons (for children who can't swipe or have no keyboard).
  function pad(box, s, onDir) {
    const p = document.createElement('div');
    p.className = 'arc-pad';
    p.innerHTML = [['up', '▲'], ['left', '◀'], ['right', '▶'], ['down', '▼']]
      .map(([d, a]) => `<button type="button" class="arc-pad-btn ${d}" data-d="${d}" aria-label="${t('arc_' + d)}">${a}</button>`).join('');
    box.appendChild(p);
    p.querySelectorAll('[data-d]').forEach(b => s.on(b, 'pointerdown', e => { e.preventDefault(); onDir(b.dataset.d); }));
    p.querySelectorAll('[data-d]').forEach(b => s.on(b, 'click', e => { if (e.detail === 0) onDir(b.dataset.d); })); // keyboard
    return p;
  }

  // Brainy as an image for canvas games (made from the same drawing as everywhere else).
  const imgs = {};
  function brainy(mood) {
    mood = mood || 'cheer';
    if (!imgs[mood]) {
      const svg = Art.brainy({ mood, thumb: false }).replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"');
      imgs[mood] = new Image();
      imgs[mood].src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }
    return imgs[mood];
  }
  const EMOJI_FONT = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';
  function emoji(g, ch, x, y, size) {
    g.font = Math.round(size) + 'px ' + EMOJI_FONT;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(ch, x, y);
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  // A little burst of sparkles at (x, y) inside a positioned box (DOM, so it works over any game).
  function burst(box, x, y, chars, n) {
    chars = chars || ['✨', '⭐', '💫'];
    for (let i = 0; i < (n || 6); i++) {
      const sp = document.createElement('span');
      sp.className = 'arc-spark'; sp.textContent = pick(chars);
      const a = Math.random() * Math.PI * 2, d = rand(30, 70);
      sp.style.left = x + 'px'; sp.style.top = y + 'px';
      sp.style.setProperty('--dx', Math.cos(a) * d + 'px'); sp.style.setProperty('--dy', Math.sin(a) * d + 'px');
      box.appendChild(sp);
      setTimeout(() => sp.remove(), 700);
    }
  }

  // Short musical blips (Web Audio), so every catch, pop and hop has its own little sound.
  let actx = null;
  function note(freq, ms, type) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain(), t0 = actx.currentTime;
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + (ms || 160) / 1000);
      o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + (ms || 160) / 1000 + 0.02);
    } catch (e) { /* no audio */ }
  }
  const SCALE = [523, 587, 659, 698, 784, 880, 988, 1046];
  const melody = i => note(SCALE[i % SCALE.length], 150);

  window.Arcade = { games, session, stop, canvas, keys, swipe, pad, brainy, emoji, roundRect, burst, note, melody, rand, irand, pick };
})();
