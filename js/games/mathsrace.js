/* Maths race: every correct answer flies the airplane closer to the finish flag. */
Games.mathsrace = {
  title: 'g_mathsrace', icon: '🏁',
  start(root, ctx) {
    const total = 10, d = ctx.difficulty;
    const ui = GK.frame(root, ctx, total);
    ui.say(t('g_mathsrace_i'));
    const track = GK.el(`<div class="race-track"><span class="race-plane">✈️</span><span class="race-flag">🏁</span></div>`);
    root.querySelector('.game').insertBefore(track, ui.area);
    const plane = track.querySelector('.race-plane');

    function question() {
      const kind = d === 1 ? GK.pick(['+', '−']) : GK.pick(['+', '−', '×']);
      let a, b, ans;
      if (kind === '+') { a = GK.rand(2, d === 1 ? 12 : 40); b = GK.rand(1, d === 1 ? 8 : 30); ans = a + b; }
      else if (kind === '−') { a = GK.rand(5, d === 1 ? 20 : 60); b = GK.rand(1, a - 1); ans = a - b; }
      else { a = GK.rand(2, 10); b = GK.rand(2, d === 2 ? 5 : 10); ans = a * b; }
      return { text: `${a} ${kind} ${b} = ?`, ans };
    }

    let score = 0;
    GK.rounds(ui, total, (i, done) => {
      const q = question();
      GK.note(q.text.replace('?', q.ans));
      ui.area.appendChild(GK.el(`<div class="race-q">${q.text}</div>`));
      const opts = new Set([q.ans]);
      while (opts.size < 4) { const x = q.ans + GK.pick([-10, -3, -2, -1, 1, 2, 3, 10]); if (x >= 0) opts.add(x); }
      let miss = 0;
      const wrap = GK.choices(ui.area, GK.shuffle([...opts]).map(x => ({ html: `<span class="num">${x}</span>`, value: x })), (v, btn) => {
        if (v === q.ans) {
          GK.good(btn); score++;
          plane.style.left = `calc(${(score / total) * 100}% - ${score / total * 48}px)`;
          wrap.querySelectorAll('button').forEach(x => (x.disabled = true)); done(miss);
        } else { miss++; GK.bad(btn); }
      }, 'numbers four');
    }, ctx.finish);
  }
};
