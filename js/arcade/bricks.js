/* Brick Rocket (age 10): bounce Brainy's comet off the paddle to break all the bricks. Three lives.
 * Higher levels: more rows, a faster comet, a narrower paddle, tough bricks that need two hits (level 3+) and
 * steel bricks that never break (level 8+). A star brick makes the paddle wider for a while.
 * Controls: drag/touch to move the paddle, or arrows / A-D; tap or Space launches. Stars = lives left. */
Arcade.games.bricks = {
  title: 'ag_bricks', icon: '🧱', instr: 'g_bricks_i',
  start(stage, ctx) {
    const A = Arcade, s = ctx.s, L = ctx.level;
    const box = document.createElement('div'); box.className = 'arc-box'; stage.appendChild(box);
    const c = A.canvas(box, 1.25, 0.6), g = c.g, W = c.w, H = c.h;
    const COLS = 7, ROWS = Math.min(7, 3 + Math.floor(L / 2));
    const pad = { w: W * Math.max(0.17, 0.25 - L * 0.004), h: H * 0.025, x: W / 2, y: H * 0.92, wide: 0 };
    const r = W * 0.022, speed = W * (0.0105 + L * 0.00035);
    const bw = (W - 16) / COLS, bh = H * 0.045, top = H * 0.1;
    const COLORS = ['#F47C8A', '#FB923C', '#FFD21F', '#5CCB6F', '#3ED8E8', '#5AA9E6', '#A855F7'];
    const bricks = [];
    for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
      let hp = 1, steel = false;
      if (L >= 3 && Math.random() < Math.min(0.35, 0.08 + L * 0.015)) hp = 2;
      if (L >= 8 && row === Math.floor(ROWS / 2) && (col === 1 || col === COLS - 2)) steel = true;
      bricks.push({ x: 8 + col * bw, y: top + row * (bh + 6), w: bw - 4, h: bh, hp, steel, color: COLORS[row % COLORS.length], alive: true });
    }
    const starBrick = A.pick(bricks.filter(b => !b.steel)); starBrick.star = true;
    let ball = { x: W / 2, y: pad.y - r - 2, vx: 0, vy: 0, stuck: true }, lives = 3, done = false, keyDir = 0, n = 0;
    const left = () => bricks.filter(b => b.alive && !b.steel).length;
    const hud = () => ctx.hud(`${'❤️'.repeat(lives)}${'🤍'.repeat(3 - lives)}  ·  🧱 ${left()}`);
    hud();

    const launch = () => {
      if (done || !ball.stuck) return;
      const a = -Math.PI / 2 + A.rand(-0.35, 0.35);
      ball.vx = Math.cos(a) * speed; ball.vy = Math.sin(a) * speed; ball.stuck = false; A.note(700, 100);
    };
    const toX = e => { const rc = c.cv.getBoundingClientRect(); return (e.clientX - rc.left) / rc.width * W; };
    s.on(c.cv, 'pointerdown', e => { e.preventDefault(); pad.target = toX(e); launch(); });
    s.on(c.cv, 'pointermove', e => { pad.target = toX(e); });
    A.keys(s, { left: () => { keyDir = -1; pad.target = null; }, right: () => { keyDir = 1; pad.target = null; }, action: launch, up: launch, forceEnter: true },
      { left: () => { if (keyDir < 0) keyDir = 0; }, right: () => { if (keyDir > 0) keyDir = 0; } });

    function hitBrick(b) {
      if (b.steel) { A.note(300, 60, 'square'); return; }
      b.hp--; A.melody(n++);
      if (b.hp > 0) return;
      b.alive = false;
      if (b.star) { pad.wide = 600; A.note(1175, 300); }
      const rc = c.cv.getBoundingClientRect(), bx = box.getBoundingClientRect();
      A.burst(box, (b.x + b.w / 2) / W * rc.width + rc.left - bx.left, (b.y + b.h / 2) / H * rc.height + rc.top - bx.top, b.star ? ['🌟', '✨'] : ['✨'], b.star ? 8 : 3);
      hud();
      if (!left()) { done = true; A.note(1046, 400); s.timer(() => ctx.win(lives), 800); }
    }
    s.loop(dt => {
      const pw = pad.w * (pad.wide > 0 ? 1.5 : 1);
      if (!done) {
        if (pad.wide > 0) pad.wide -= dt;
        if (pad.target != null) pad.x += (pad.target - pad.x) * Math.min(1, 0.4 * dt); else pad.x += keyDir * W * 0.02 * dt;
        pad.x = Math.max(pw / 2, Math.min(W - pw / 2, pad.x));
        if (ball.stuck) { ball.x = pad.x; ball.y = pad.y - r - 2; }
        else {
          // Move in small steps so the comet never jumps through a brick.
          const steps = Math.ceil(Math.max(Math.abs(ball.vx), Math.abs(ball.vy)) * dt / (r * 0.8));
          for (let i = 0; i < steps && !done; i++) {
            ball.x += ball.vx * dt / steps; ball.y += ball.vy * dt / steps;
            if (ball.x < r) { ball.x = r; ball.vx = Math.abs(ball.vx); }
            if (ball.x > W - r) { ball.x = W - r; ball.vx = -Math.abs(ball.vx); }
            if (ball.y < r) { ball.y = r; ball.vy = Math.abs(ball.vy); }
            if (ball.vy > 0 && ball.y + r >= pad.y && ball.y + r <= pad.y + pad.h + 8 && Math.abs(ball.x - pad.x) <= pw / 2 + r) {
              const off = (ball.x - pad.x) / (pw / 2), a = -Math.PI / 2 + off * 1.05;  // where it lands sets the angle
              const sp = Math.hypot(ball.vx, ball.vy); ball.vx = Math.cos(a) * sp; ball.vy = Math.sin(a) * sp; ball.y = pad.y - r;
              A.note(520, 60);
            }
            for (const b of bricks) {
              if (!b.alive) continue;
              const nx = Math.max(b.x, Math.min(ball.x, b.x + b.w)), ny = Math.max(b.y, Math.min(ball.y, b.y + b.h));
              if ((ball.x - nx) ** 2 + (ball.y - ny) ** 2 <= r * r) {
                const ox = Math.min(ball.x + r - b.x, b.x + b.w - (ball.x - r)), oy = Math.min(ball.y + r - b.y, b.y + b.h - (ball.y - r));
                if (ox < oy) ball.vx = -ball.vx; else ball.vy = -ball.vy;
                hitBrick(b); break;
              }
            }
            if (ball.y > H + r) {
              lives--; hud(); A.note(170, 300, 'triangle');
              if (lives <= 0) { done = true; s.timer(() => ctx.lose(), 600); }
              else ball.stuck = true;
              break;
            }
          }
        }
      }
      // Draw: night sky, bricks, paddle and comet.
      const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#1B1F5C'); sky.addColorStop(1, '#3B2A8C');
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(255,255,255,.6)';
      for (let i = 0; i < 30; i++) { const sx = (i * 97) % W, sy = (i * 53) % (H * 0.9); g.fillRect(sx, sy, 2, 2); }
      bricks.forEach(b => {
        if (!b.alive) return;
        g.fillStyle = b.steel ? '#9AA7AD' : b.color; A.roundRect(g, b.x, b.y, b.w, b.h, 6); g.fill();
        if (b.hp > 1) { g.fillStyle = 'rgba(0,0,0,.18)'; A.roundRect(g, b.x + 3, b.y + 3, b.w - 6, b.h - 6, 4); g.fill(); }
        if (b.steel) { g.fillStyle = '#C9D3D7'; g.fillRect(b.x + 6, b.y + b.h / 2 - 1, b.w - 12, 2); }
        if (b.star) A.emoji(g, '⭐', b.x + b.w / 2, b.y + b.h / 2 + 1, b.h * 0.8);
      });
      g.fillStyle = pad.wide > 0 ? '#FFD21F' : '#3ED8E8'; A.roundRect(g, pad.x - pw / 2, pad.y, pw, pad.h, pad.h / 2); g.fill();
      g.fillStyle = 'rgba(255,210,31,.35)'; g.beginPath(); g.arc(ball.x - ball.vx * 2, ball.y - ball.vy * 2, r * 1.3, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#FFF6CC'; g.beginPath(); g.arc(ball.x, ball.y, r, 0, Math.PI * 2); g.fill();
      if (ball.stuck && !done) {
        g.fillStyle = '#fff'; g.font = '600 ' + Math.round(W * 0.05) + 'px Fredoka, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(t('arc_tapStart'), W / 2, H * 0.7);
      }
    });
  }
};
