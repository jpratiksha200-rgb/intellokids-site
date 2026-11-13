/* Brainy Hop (age 6): Brainy runs along by himself; tap (or Space / ↑) to hop over logs and rocks and grab
 * the stars, all the way to the finish flag. Bumping into something doesn't end the game: Brainy wobbles
 * and slows down for a moment. Stars at the end: 3 with no bumps, 2 with up to 2, else 1.
 * Higher levels: faster, obstacles closer together, double logs (level 5+) and tall rocks (level 9+). */
Arcade.games.hop = {
  title: 'ag_hop', icon: '🏃', instr: 'g_hop_i',
  start(stage, ctx) {
    const A = Arcade, s = ctx.s, L = ctx.level;
    const box = document.createElement('div'); box.className = 'arc-box'; stage.appendChild(box);
    const c = A.canvas(box, 0.56, 0.5), g = c.g, W = c.w, H = c.h;
    const ground = H * 0.8, me = { x: W * 0.16, y: ground, vy: 0, size: H * 0.24, hurt: 0 };
    const grav = H * 0.0019, jumpV = -H * 0.035;
    const baseSpeed = W * (0.0082 + L * 0.00042);
    const distGoal = W * (17 + L * 1.1);
    const minGap = W * Math.max(0.36, 0.62 - L * 0.012);
    let speed = baseSpeed, dist = 0, nextAt = W * 0.9, obstacles = [], stars = [], got = 0, bumps = 0, done = false, flagX = null, n = 0;
    const clouds = [0.2, 0.55, 0.85].map(f => ({ x: W * f, y: H * A.rand(0.1, 0.3) }));
    const brainy = A.brainy('cheer'), brainyOops = A.brainy('think');
    const hud = () => ctx.hud(`🏁 ${Math.min(100, Math.round(dist / distGoal * 100))}%  ·  ⭐ ${got}`);
    hud();

    const jump = () => { if (done) return; if (me.y >= ground - 0.5) { me.vy = jumpV; A.note(660, 120); } };
    s.on(c.cv, 'pointerdown', e => { e.preventDefault(); jump(); });
    A.keys(s, { up: jump, action: jump, forceEnter: true });

    function addObstacle(x) {
      const tall = L >= 9 && Math.random() < 0.3, double = !tall && L >= 5 && Math.random() < 0.28;
      const h = tall ? H * 0.2 : H * 0.12, w = (double ? 1.9 : 1) * H * 0.13;
      obstacles.push({ x, w, h, ch: tall ? '🪨' : '🪵', double });
      if (Math.random() < 0.65) stars.push({ x: x + w / 2, y: ground - h - H * A.rand(0.16, 0.26) });
    }
    s.loop(dt => {
      if (!done) {
        speed += (baseSpeed - speed) * 0.02 * dt;
        const dx = speed * dt;
        dist += dx;
        if (flagX == null && dist + W >= distGoal) flagX = W + (distGoal - dist - W) + W * 0.2;
        if (flagX == null && dist + W * 1.1 >= nextAt) { addObstacle(W * 1.1); nextAt = dist + W * 1.1 + minGap + Math.random() * W * 0.45; }
        obstacles.forEach(o => { o.x -= dx; }); stars.forEach(st => { st.x -= dx; }); clouds.forEach(cl => { cl.x -= dx * 0.2; if (cl.x < -60) cl.x = W + 60; });
        if (flagX != null) flagX -= dx;
        me.vy += grav * dt; me.y = Math.min(ground, me.y + me.vy * dt); if (me.y >= ground) me.vy = 0;
        if (me.hurt > 0) me.hurt -= dt;
        // Bumps: a forgiving box around Brainy's middle.
        const bx = me.x - me.size * 0.28, bw = me.size * 0.5, by = me.y - me.size * 0.62;
        obstacles.forEach(o => {
          if (o.hit || me.hurt > 0) return;
          if (bx + bw > o.x + 6 && bx < o.x + o.w - 6 && me.y > ground - o.h + 4) {
            o.hit = true; bumps++; me.hurt = 70; speed = baseSpeed * 0.55; A.note(180, 260, 'triangle');
          }
        });
        stars.forEach(st => {
          if (!st.got && Math.abs(st.x - me.x) < me.size * 0.45 && Math.abs(st.y - (by + me.size * 0.3)) < me.size * 0.55) {
            st.got = true; got++; A.melody(n++);
          }
        });
        obstacles = obstacles.filter(o => o.x + o.w > -20); stars = stars.filter(st => st.x > -20 && !st.got);
        hud();
        if (flagX != null && flagX <= me.x) {
          done = true; A.note(1046, 400);
          s.timer(() => ctx.win(bumps === 0 ? 3 : bumps <= 2 ? 2 : 1), 900);
        }
      }
      // Draw
      const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#9BE7F0'); sky.addColorStop(1, '#E6FAFC');
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      clouds.forEach(cl => A.emoji(g, '☁️', cl.x, cl.y, H * 0.14));
      g.fillStyle = '#6FD07F'; g.fillRect(0, ground, W, H - ground);
      g.fillStyle = '#5CCB6F';
      for (let x = -((dist * 1) % 40); x < W; x += 40) g.fillRect(x, ground + 6, 20, 4);
      obstacles.forEach(o => {
        const sz = o.h * 1.25;
        if (o.double) { A.emoji(g, o.ch, o.x + o.w * 0.27, ground - o.h / 2, sz); A.emoji(g, o.ch, o.x + o.w * 0.73, ground - o.h / 2, sz); }
        else A.emoji(g, o.ch, o.x + o.w / 2, ground - o.h / 2, sz);
      });
      stars.forEach(st => A.emoji(g, '⭐', st.x, st.y, H * 0.1));
      if (flagX != null) A.emoji(g, '🏁', flagX, ground - H * 0.12, H * 0.22);
      const img = me.hurt > 0 ? brainyOops : brainy;
      if (!(me.hurt > 0 && Math.floor(me.hurt / 6) % 2)) {
        const bob = me.y >= ground ? Math.sin(dist / 18) * 2 : 0;
        if (img.complete) g.drawImage(img, me.x - me.size / 2, me.y - me.size + bob, me.size, me.size);
        else A.emoji(g, '🙂', me.x, me.y - me.size / 2, me.size * 0.8);
      }
    });
  }
};
