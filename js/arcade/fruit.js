/* Fruit Basket (age 5): move the basket to catch falling fruit. A missed fruit costs nothing; from level 4
 * a bee sometimes falls too (catching it makes the basket wobble for a moment). The round ends when the
 * basket is full. Higher levels: faster fruit, more at once, more bees, golden stars worth 2.
 * Controls: drag or touch anywhere on the field, or arrow keys / A-D. */
Arcade.games.fruit = {
  title: 'ag_fruit', icon: '🧺', instr: 'g_fruit_i',
  start(stage, ctx) {
    const A = Arcade, s = ctx.s, L = ctx.level;
    const goal = Math.min(30, 11 + L);
    const box = document.createElement('div'); box.className = 'arc-box'; stage.appendChild(box);
    const c = A.canvas(box, 4 / 3), g = c.g, W = c.w, H = c.h;
    const FRUIT = ['🍎', '🍌', '🍓', '🍊', '🍇', '🍐', '🍒', '🍑'];
    const fall = H * (0.0042 + L * 0.00026), every = Math.max(430, 1100 - L * 32);
    const beeChance = L >= 4 ? Math.min(0.3, 0.12 + L * 0.009) : 0, starChance = L >= 6 ? 0.08 : 0;
    const size = Math.max(34, W * 0.11);
    const basket = { x: W / 2, y: H - size * 0.9, w: W * 0.24, v: 0, wobble: 0 };
    let items = [], caught = 0, missed = 0, done = false, keyDir = 0, n = 0, spawnT = 0;
    const hud = () => ctx.hud(`🧺 ${caught} / ${goal}`);
    hud();

    const toX = e => { const r = c.cv.getBoundingClientRect(); return (e.clientX - r.left) / r.width * W; };
    s.on(c.cv, 'pointerdown', e => { e.preventDefault(); c.cv.setPointerCapture && c.cv.setPointerCapture(e.pointerId); basket.target = toX(e); });
    s.on(c.cv, 'pointermove', e => { basket.target = toX(e); });
    A.keys(s, { left: () => { keyDir = -1; basket.target = null; }, right: () => { keyDir = 1; basket.target = null; } },
      { left: () => { if (keyDir < 0) keyDir = 0; }, right: () => { if (keyDir > 0) keyDir = 0; } });

    function spawn() {
      const r = Math.random();
      const kind = r < beeChance ? 'bee' : r < beeChance + starChance ? 'star' : 'fruit';
      items.push({ x: A.rand(size, W - size), y: -size, kind, ch: kind === 'bee' ? '🐝' : kind === 'star' ? '🌟' : A.pick(FRUIT),
        vy: fall * A.rand(0.85, 1.2) * (kind === 'bee' ? 1.1 : 1), sway: Math.random() * 6 });
    }
    function drawBg() {
      const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#BDF3F8'); sky.addColorStop(1, '#EAFBFD');
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = '#7BD88A'; g.beginPath(); g.ellipse(W / 2, H + H * 0.05, W * 0.8, H * 0.12, 0, 0, Math.PI * 2); g.fill();
      A.emoji(g, '🌳', W * 0.1, H * 0.86, size * 1.6); A.emoji(g, '🌳', W * 0.9, H * 0.86, size * 1.6);
    }
    s.loop(dt => {
      if (!done) {
        spawnT += dt * 16.667;
        if (spawnT >= every) { spawnT = 0; spawn(); }
        if (basket.target != null) basket.x += (basket.target - basket.x) * Math.min(1, 0.35 * dt);
        else basket.x += keyDir * W * 0.016 * dt;
        basket.x = Math.max(basket.w / 2, Math.min(W - basket.w / 2, basket.x));
        if (basket.wobble > 0) basket.wobble -= dt;
      }
      items.forEach(it => {
        it.y += it.vy * dt; it.sway += 0.05 * dt;
        const inX = Math.abs(it.x - basket.x) < basket.w / 2, inY = it.y > basket.y - size * 0.55 && it.y < basket.y + size * 0.2;
        if (!it.gone && !done && inX && inY && basket.wobble <= 0) {
          it.gone = true;
          if (it.kind === 'bee') { basket.wobble = 40; A.note(196, 220, 'triangle'); }
          else {
            caught = Math.min(goal, caught + (it.kind === 'star' ? 2 : 1)); A.melody(n++); hud();
            const r = c.cv.getBoundingClientRect(), b = box.getBoundingClientRect();
            A.burst(box, (it.x / W) * r.width + (r.left - b.left), (it.y / H) * r.height + (r.top - b.top), ['✨', '⭐'], 4);
            if (caught >= goal) { done = true; s.timer(() => ctx.win(missed <= goal * 0.25 ? 3 : missed <= goal * 0.6 ? 2 : 1), 800); }
          }
        }
        if (!it.gone && it.y > H + size) { it.gone = true; if (it.kind !== 'bee') missed++; }
      });
      items = items.filter(it => !it.gone);
      drawBg();
      items.forEach(it => A.emoji(g, it.ch, it.x + Math.sin(it.sway) * 4, it.y, size));
      const wob = basket.wobble > 0 ? Math.sin(basket.wobble) * 0.25 : 0;
      g.save(); g.translate(basket.x, basket.y); g.rotate(wob); A.emoji(g, '🧺', 0, 0, size * 1.55); g.restore();
    });
  }
};
