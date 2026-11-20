/* Bubble Party (age 3): bubbles with little friends inside float up; tap to pop them.
 * No timer and no way to lose. Higher levels: more bubbles at once, a bit faster, rainbow bubbles that pop
 * everything on screen. Keyboard: Space pops the lowest bubble; bubbles are buttons too (Tab + Enter). */
Arcade.games.bubbles = {
  title: 'ag_bubbles', icon: '🫧', instr: 'g_bubbles_i',
  start(stage, ctx) {
    const A = Arcade, s = ctx.s, L = ctx.level;
    const goal = Math.min(26, 9 + L), maxOn = Math.min(7, 3 + Math.floor(L / 3));
    const riseSec = Math.max(4.6, 9 - L * 0.22), every = Math.max(650, 1150 - L * 25);
    const FRIENDS = ['🐟', '⭐', '🌸', '🦋', '🍓', '🐢', '🐥', '🐠', '🐞', '🍀'];
    stage.innerHTML = '<div class="bb-pond"></div>';
    const pond = stage.firstChild;
    let popped = 0, done = false, n = 0;
    const bubbles = [];
    const hud = () => ctx.hud(`🫧 ${popped} / ${goal}`);
    hud();

    function spawn() {
      if (done || bubbles.length >= maxOn) return;
      const W = pond.clientWidth, H = pond.clientHeight;
      const size = Math.max(78, Math.min(112, W * 0.26) - L);
      const rainbow = L >= 3 && Math.random() < 0.12;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'bb-bubble' + (rainbow ? ' rainbow' : '');
      b.setAttribute('aria-label', t('arc_pop'));
      b.innerHTML = `<span aria-hidden="true">${rainbow ? '🌈' : A.pick(FRIENDS)}</span>`;
      b.style.width = b.style.height = size + 'px';
      pond.appendChild(b);
      const o = { el: b, x: A.rand(4, Math.max(5, W - size - 4)), y: H + 4, size, rainbow, phase: Math.random() * 6, speed: (H + size) / (riseSec * 60) };
      bubbles.push(o);
      const pop = e => { if (e) e.preventDefault(); popOne(o); };
      s.on(b, 'pointerdown', pop);
      s.on(b, 'click', e => { if (e.detail === 0) pop(); }); // keyboard Enter/Space on a focused bubble
    }
    function popOne(o, chain) {
      if (o.gone || done) return;
      o.gone = true;
      bubbles.splice(bubbles.indexOf(o), 1);
      o.el.classList.add('pop');
      A.melody(n++);
      A.burst(pond, o.x + o.size / 2, o.y + o.size / 2, ['💧', '✨', '🫧'], 5);
      setTimeout(() => o.el.remove(), 260);
      popped++; hud();
      if (o.rainbow && !chain) { A.note(1175, 300); bubbles.slice().forEach(x => popOne(x, true)); }
      if (popped >= goal) { done = true; s.timer(() => ctx.win(3), 700); }
    }

    spawn();
    s.every(spawn, every);
    A.keys(s, { action: () => { const low = bubbles.slice().sort((a, b) => b.y - a.y)[0]; if (low) popOne(low); } });
    s.loop(dt => {
      bubbles.slice().forEach(o => {
        o.y -= o.speed * dt; o.phase += 0.03 * dt;
        o.el.style.transform = `translate(${o.x + Math.sin(o.phase) * 14}px, ${o.y}px)`;
        if (o.y < -o.size) { o.gone = true; bubbles.splice(bubbles.indexOf(o), 1); o.el.remove(); } // floats away: no penalty
      });
    });
  }
};
