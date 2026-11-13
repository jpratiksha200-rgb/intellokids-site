/* Peek-a-Boo Garden (age 4): little animals peek out of holes; tap them before they hide.
 * No way to lose: a missed animal just hides again. Higher levels: more holes, quicker peeks, two at once.
 * Keyboard: number keys 1–9 tap a hole; holes are buttons too (Tab + Enter). */
Arcade.games.peekaboo = {
  title: 'ag_peekaboo', icon: '🐰', instr: 'g_peekaboo_i',
  start(stage, ctx) {
    const A = Arcade, s = ctx.s, L = ctx.level;
    const holes = L < 3 ? 3 : L < 6 ? 4 : L < 11 ? 6 : 9;
    const cols = holes === 4 ? 2 : 3;
    const goal = Math.min(20, 8 + L);
    const show = Math.max(950, 1750 - L * 45), gap = Math.max(300, 900 - L * 30), twoAtOnce = L >= 8;
    const CRITTERS = ['🐰', '🦔', '🐹', '🐿️', '🐸', '🐥', '🦊', '🐼'];
    stage.innerHTML = `<div class="pk-garden" style="grid-template-columns:repeat(${cols},1fr)">${Array.from({ length: holes }, (_, i) =>
      `<button type="button" class="pk-hole" data-i="${i}" aria-label="${t('arc_hole', { n: i + 1 })}"><span class="pk-critter" aria-hidden="true"></span><span class="pk-dirt" aria-hidden="true"></span><span class="pk-key" aria-hidden="true">${i + 1}</span></button>`).join('')}</div>`;
    const els = Array.from(stage.querySelectorAll('.pk-hole'));
    const up = new Set();
    let got = 0, done = false, n = 0;
    const hud = () => ctx.hud(`⭐ ${got} / ${goal}`);
    hud();

    function peek() {
      if (done) return;
      const free = els.map((_, i) => i).filter(i => !up.has(i));
      if (!free.length || up.size >= (twoAtOnce ? 2 : 1)) return;
      const i = A.pick(free), el = els[i];
      el.querySelector('.pk-critter').textContent = A.pick(CRITTERS);
      el.classList.add('up'); up.add(i);
      const myTurn = el.dataset.turn = String(Math.random());
      s.timer(() => { if (el.dataset.turn === myTurn && up.has(i)) hide(i); }, show);
    }
    function hide(i) { up.delete(i); els[i].classList.remove('up', 'hit'); }
    function tap(i) {
      if (done) return;
      const el = els[i];
      if (el.classList.contains('hit')) return;
      if (!up.has(i)) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); return; } // empty hole: a little wiggle
      el.dataset.turn = 'hit'; // the peek's own "hide" timer no longer applies; the hole stays busy until hidden
      el.classList.add('hit');
      A.melody(n++ * 2);
      const r = el.getBoundingClientRect(), b = stage.getBoundingClientRect();
      A.burst(stage, r.left - b.left + r.width / 2, r.top - b.top + r.height / 3, ['⭐', '✨', '💛'], 5);
      s.timer(() => hide(i), 380);
      got++; hud();
      if (got >= goal) { done = true; s.timer(() => ctx.win(3), 700); }
    }
    els.forEach((el, i) => {
      s.on(el, 'pointerdown', e => { e.preventDefault(); tap(i); });
      s.on(el, 'click', e => { if (e.detail === 0) tap(i); });
    });
    s.on(document, 'keydown', e => { const k = Number(e.key); if (k >= 1 && k <= holes) { e.preventDefault(); tap(k - 1); } });
    s.timer(peek, 600);
    s.every(peek, gap + 250);
  }
};
