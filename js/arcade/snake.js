/* Star Trail (age 8): steer Brainy around the meadow to collect stars; his sparkly trail grows with each one.
 * Bumping into the trail (or a rock, or the fence from level 5) ends the try, and the child tries again.
 * Higher levels: more stars to collect, faster, rocks (level 3+), solid fence instead of wrap-around (level 5+).
 * Controls: arrows / WASD, swipe on the meadow, or the big arrow buttons. Stars: 3 on the first try, then 2, 1. */
Arcade.games.snake = {
  title: 'ag_snake', icon: '🌟', instr: 'g_snake_i',
  start(stage, ctx) {
    const A = Arcade, s = ctx.s, L = ctx.level, G = 13;
    const goal = Math.min(22, 7 + L), tick = Math.max(110, 235 - L * 7), wrap = L < 5;
    const box = document.createElement('div'); box.className = 'arc-box'; stage.appendChild(box);
    const c = A.canvas(box, 1, 0.5), g = c.g, W = c.w, cs = W / G;
    const brainy = A.brainy('cheer');
    const mid = Math.floor(G / 2);
    let body = [{ x: mid - 1, y: mid }, { x: mid - 2, y: mid }, { x: mid - 3, y: mid }], dir = { x: 1, y: 0 }, queue = [];
    let rocks = [], star = null, got = 0, done = false, started = false, acc = 0, n = 0;
    const free = (x, y) => !body.some(p => p.x === x && p.y === y) && !rocks.some(r => r.x === x && r.y === y) && !(star && star.x === x && star.y === y);
    function place() { let x, y, tries = 0; do { x = A.irand(0, G - 1); y = A.irand(0, G - 1); } while (!free(x, y) && tries++ < 500); return { x, y }; }
    const nRocks = L >= 3 ? Math.min(9, Math.floor(L / 2)) : 0;
    for (let i = 0; i < nRocks; i++) { const p = place(); if (Math.abs(p.y - mid) > 1) rocks.push(p); }
    star = place();
    const hud = () => ctx.hud(`⭐ ${got} / ${goal}`);
    hud();

    const DIRS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    function steer(d) {
      if (done || !DIRS[d]) return;
      started = true;
      const last = queue.length ? queue[queue.length - 1] : dir, nd = DIRS[d];
      if (nd.x === -last.x && nd.y === -last.y) return;   // no turning straight back
      if (nd.x === last.x && nd.y === last.y) return;
      if (queue.length < 2) queue.push(nd);
    }
    A.keys(s, { up: () => steer('up'), down: () => steer('down'), left: () => steer('left'), right: () => steer('right'), action: () => { started = true; } });
    A.swipe(s, c.cv, d => { if (d === 'tap') started = true; else steer(d); });
    A.pad(stage, s, steer);

    function step() {
      if (queue.length) dir = queue.shift();
      let hx = body[0].x + dir.x, hy = body[0].y + dir.y;
      if (wrap) { hx = (hx + G) % G; hy = (hy + G) % G; }
      const crash = hx < 0 || hy < 0 || hx >= G || hy >= G || rocks.some(r => r.x === hx && r.y === hy) || body.slice(0, -1).some(p => p.x === hx && p.y === hy);
      if (crash) { done = true; A.note(160, 300, 'triangle'); s.timer(() => ctx.lose(), 700); return; }
      body.unshift({ x: hx, y: hy });
      if (star && hx === star.x && hy === star.y) {
        got++; hud(); A.melody(n++);
        const r = c.cv.getBoundingClientRect(), b = box.getBoundingClientRect();
        A.burst(box, (hx + 0.5) * cs * r.width / W + r.left - b.left, (hy + 0.5) * cs * r.width / W + r.top - b.top, ['✨', '⭐'], 5);
        if (got >= goal) { done = true; star = null; A.note(1046, 400); s.timer(() => ctx.win(ctx.attempt <= 1 ? 3 : ctx.attempt <= 3 ? 2 : 1), 700); return; }
        star = place();
      } else body.pop();
    }
    s.loop(dt => {
      if (started && !done) { acc += dt * 16.667; while (acc >= tick && !done) { acc -= tick; step(); } }
      // Meadow with a soft checkerboard.
      for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) { g.fillStyle = (x + y) % 2 ? '#A9E6B4' : '#B8EDC0'; g.fillRect(x * cs, y * cs, cs + 1, cs + 1); }
      if (!wrap) { g.strokeStyle = '#8B5E34'; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, W - 4); }
      rocks.forEach(r => A.emoji(g, '🪨', (r.x + 0.5) * cs, (r.y + 0.5) * cs, cs * 0.9));
      if (star) A.emoji(g, '⭐', (star.x + 0.5) * cs, (star.y + 0.5) * cs, cs * (0.85 + Math.sin(performance.now() / 200) * 0.08));
      for (let i = body.length - 1; i >= 1; i--) {
        const p = body[i], hue = (i * 28) % 360;
        g.fillStyle = `hsl(${hue}, 85%, 70%)`;
        g.beginPath(); g.arc((p.x + 0.5) * cs, (p.y + 0.5) * cs, cs * 0.38, 0, Math.PI * 2); g.fill();
      }
      const h = body[0];
      if (brainy.complete) g.drawImage(brainy, h.x * cs - cs * 0.15, h.y * cs - cs * 0.2, cs * 1.3, cs * 1.3);
      else { g.fillStyle = '#3ED8E8'; g.beginPath(); g.arc((h.x + 0.5) * cs, (h.y + 0.5) * cs, cs * 0.45, 0, Math.PI * 2); g.fill(); }
      if (!started && !done) {
        g.fillStyle = 'rgba(8,71,79,.55)'; A.roundRect(g, W * 0.15, W * 0.4, W * 0.7, W * 0.2, 16); g.fill();
        g.fillStyle = '#fff'; g.font = '600 ' + Math.round(W * 0.06) + 'px Fredoka, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(t('arc_ready'), W / 2, W / 2);
      }
    });
  }
};
