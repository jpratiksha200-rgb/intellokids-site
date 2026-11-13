/* Tell the time: read the clock face and pick the right time.
   Easy: o'clock. Medium: + half past. Tricky: + quarter past/to (and 5-minute steps for older explorers). */
Games.clock = {
  title: 'g_clock', icon: '🕒',
  start(root, ctx) {
    const d = ctx.difficulty, total = 5, n = d === 1 ? 3 : 4;
    const minutesFor = d === 1 ? [0] : d === 2 ? [0, 30] : ctx.group === 'explorer' && (ctx.level || 0) > 0.8 ? [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] : [0, 15, 30, 45];
    const fmt = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
    const face = (h, m) => {
      const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
      const ticks = Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; return `<text x="${50 + 36 * Math.sin(a)}" y="${53.5 + -36 * Math.cos(a)}" text-anchor="middle" font-size="9" font-family="Fredoka, sans-serif" fill="#1F3A44">${i || 12}</text>`; }).join('');
      return `<svg class="clock-face" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="#fff" stroke="#0E6E7E" stroke-width="4"/>${ticks}
        <line x1="50" y1="50" x2="${50 + 22 * Math.sin(ha * Math.PI / 180)}" y2="${50 - 22 * Math.cos(ha * Math.PI / 180)}" stroke="#F47C8A" stroke-width="5" stroke-linecap="round"/>
        <line x1="50" y1="50" x2="${50 + 32 * Math.sin(ma * Math.PI / 180)}" y2="${50 - 32 * Math.cos(ma * Math.PI / 180)}" stroke="#0E6E7E" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="50" cy="50" r="3.5" fill="#FFD21F" stroke="#0E6E7E" stroke-width="1.5"/></svg>`;
    };
    const ui = GK.frame(root, ctx, total);
    let last = '';
    GK.rounds(ui, total, (i, done) => {
      ui.say(t('g_clock_i'), i > 0);
      let h, m; do { h = GK.rand(1, 12); m = GK.pick(minutesFor); } while (fmt(h, m) === last);
      const ans = fmt(h, m); last = ans; GK.note(ans);
      const set = new Set([ans]);
      // Tricky distractors: neighbouring hours, and swapped hands where possible.
      let guard = 0;
      while (set.size < n && guard++ < 100) {
        const hh = ((h - 1 + GK.pick([-1, 1, 2, -2, 6]) + 12) % 12) + 1;
        set.add(fmt(GK.pick([hh, h]), GK.pick(minutesFor)));
      }
      ui.area.appendChild(GK.el(`<div class="clock-wrap">${face(h, m)}</div>`));
      let miss = 0;
      const wrap = GK.choices(ui.area, GK.shuffle([...set]).map(x => ({ html: `<span class="num time">${x}</span>`, value: x })), (v, b) => {
        if (v === ans) { GK.good(b); wrap.querySelectorAll('button').forEach(x => (x.disabled = true)); done(miss); }
        else { miss++; GK.bad(b); }
      }, 'numbers four');
    }, ctx.finish);
  }
};
