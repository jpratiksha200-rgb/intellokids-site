/* Colouring pictures for age 7: detailed cartoon scenes, 25â€“40 parts, stroke 3.
   Format: see Colouring.addPack in js/colouring.js. Regions = data-r fill="#fff"; decorations = INK or fill="none".
   The first 3 pictures are the ones open while IK_CONFIG.limits applies (one of them is an animal). Original art only.
   Drawn in two parts (each PART has its own helpers); display order = part A's first 3, then B and A interleaved.
   Once shipped, never reorder or insert regions inside a picture (saved drawings are index-based); add new pictures at the end. */
(function () {
  const INK = '#1F3A44';
  const parts = [];
  const PART = f => { parts.push(f()); };

  /* IntelloKids colouring – age 7, part A */
  PART(function () {
    const INK = '#1F3A44';
    const SW = 3;
    const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
    const R = `data-r fill="#fff" ${L}`;
    const TL = `stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" fill="none"`;
    const f = v => Math.round(v * 10) / 10;
    const xy = p => f(p[0]) + ' ' + f(p[1]);
    // map every "x y" pair of a path (absolute M L Q C Z only) through p
    const xd = (d, p) => d.replace(/(-?\d*\.?\d+)[ ,]+(-?\d*\.?\d+)/g, (m, a, b) => xy(p(+a, +b)));
    const T = (d, tx, ty, s = 1, fx = 1) => xd(d, (x, y) => [tx + fx * s * x, ty + s * y]);
    // move + rotate (degrees) + scale + mirror: returns a point mapper
    const X = (tx, ty, deg = 0, s = 1, fx = 1) => { const c = Math.cos(deg * Math.PI / 180), n = Math.sin(deg * Math.PI / 180); return (x, y) => { x *= s * fx; y *= s; return [tx + x * c - y * n, ty + x * n + y * c]; }; };
    const P = d => `<path ${R} d="${d}"/>`;
    const C = (x, y, r) => `<circle ${R} cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;
    const E = (x, y, rx, ry, a) => `<ellipse ${R} cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"${a ? ` transform="rotate(${a} ${f(x)} ${f(y)})"` : ''}/>`;
    const D = d => `<path d="${d}" ${TL}/>`;
    const rrD = (x, y, w, h, r) => `M${x + r} ${y}L${x + w - r} ${y}Q${x + w} ${y} ${x + w} ${y + r}L${x + w} ${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}L${x + r} ${y + h}Q${x} ${y + h} ${x} ${y + h - r}L${x} ${y + r}Q${x} ${y} ${x + r} ${y}Z`;
    // fan of pointed petals rising from (cx, cy): lotus / tulip / flame shapes
    const fanD = (cx, cy, r, n, spread, inner = .45) => {
      const Q = (rad, a) => [cx + rad * Math.sin(a), cy - rad * Math.cos(a)];
      const step = n > 1 ? 2 * spread / (n - 1) : 1, h = step / 2, b0 = Q(r * .3, -spread - h * 1.2);
      let d = 'M' + xy(b0);
      for (let i = 0; i < n; i++) {
        const a = -spread + i * step, nv = i < n - 1 ? Q(r * inner, a + h) : Q(r * .3, spread + h * 1.2);
        d += 'Q' + xy(Q(r * .8, a - h * .9)) + ' ' + xy(Q(r, a)) + 'Q' + xy(Q(r * .8, a + h * .9)) + ' ' + xy(nv);
      }
      return d + 'Q' + xy([cx, cy + r * .3]) + ' ' + xy(b0) + 'Z';
    };
    const eye = (x, y, r = 6) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${INK}"/><circle cx="${f(x + r * .35)}" cy="${f(y - r * .38)}" r="${f(r * .36)}" fill="#fff"/>`;
    const smile = (x, y, w, h = w * .8) => `<path d="M${f(x - w)} ${f(y)}Q${f(x)} ${f(y + h)} ${f(x + w)} ${f(y)}" ${TL}/>`;
    const dot = (x, y, r = 2.5) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${INK}"/>`;
    const star = (cx, cy, ro, ri, n = 5, rot = 0) => { let p = ''; for (let i = 0; i < n * 2; i++) { const a = Math.PI * i / n - Math.PI / 2 + rot, r = i % 2 ? ri : ro; p += (i ? 'L' : 'M') + f(cx + r * Math.cos(a)) + ' ' + f(cy + r * Math.sin(a)); } return p + 'Z'; };
    const sparkle = (x, y, r) => { const k = r * .2; return `<path d="M${x} ${y - r}Q${f(x + k)} ${f(y - k)} ${x + r} ${y}Q${f(x + k)} ${f(y + k)} ${x} ${y + r}Q${f(x - k)} ${f(y + k)} ${x - r} ${y}Q${f(x - k)} ${f(y - k)} ${x} ${y - r}Z" fill="${INK}"/>`; };
    const cloudD = (x, y, s) => `M${x} ${y}Q${f(x - 4 * s)} ${f(y - 26 * s)} ${f(x + 22 * s)} ${f(y - 28 * s)}Q${f(x + 28 * s)} ${f(y - 50 * s)} ${f(x + 54 * s)} ${f(y - 44 * s)}Q${f(x + 76 * s)} ${f(y - 56 * s)} ${f(x + 88 * s)} ${f(y - 32 * s)}Q${f(x + 110 * s)} ${f(y - 30 * s)} ${f(x + 106 * s)} ${y}Z`;
    const cloud = (x, y, s) => `<path ${R} d="${cloudD(x, y, s)}"/>`;
    const heartD = (cx, cy, s) => `M${cx} ${f(cy + 9 * s)}C${f(cx - 14 * s)} ${f(cy)} ${f(cx - 12 * s)} ${f(cy - 11 * s)} ${cx} ${f(cy - 5 * s)}C${f(cx + 12 * s)} ${f(cy - 11 * s)} ${f(cx + 14 * s)} ${f(cy)} ${cx} ${f(cy + 9 * s)}Z`;
    // thick limb/stem along a polyline, with round ends
    const tube = (pts, w, w2 = w) => {
      const n = pts.length, nor = [], H = i => (w + (w2 - w) * i / (n - 1)) / 2, h = H(n - 1), h0 = H(0);
      for (let i = 0; i < n - 1; i++) { const dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1], l = Math.hypot(dx, dy) || 1; nor.push([-dy / l, dx / l]); }
      const side = s => pts.map((p, i) => {
        let nx, ny;
        if (i === 0) [nx, ny] = nor[0]; else if (i === n - 1) [nx, ny] = nor[n - 2];
        else { const a = nor[i - 1], b = nor[i]; nx = a[0] + b[0]; ny = a[1] + b[1]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; const c = Math.max(.6, nx * a[0] + ny * a[1]); nx /= c; ny /= c; }
        return f(p[0] + s * H(i) * nx) + ' ' + f(p[1] + s * H(i) * ny);
      });
      const A = side(1), B = side(-1).reverse();
      return `M${A.join('L')}A${f(h)} ${f(h)} 0 0 0 ${B[0]}L${B.slice(1).join('L')}A${f(h0)} ${f(h0)} 0 0 0 ${A[0]}Z`;
    };
    const qpts = (a, c, b, n = 8) => { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]); } return o; };
    const ring = (cx, cy, ro, ri) => `M${cx - ro} ${cy}A${ro} ${ro} 0 1 0 ${cx + ro} ${cy}A${ro} ${ro} 0 1 0 ${cx - ro} ${cy}ZM${cx - ri} ${cy}A${ri} ${ri} 0 1 0 ${cx + ri} ${cy}A${ri} ${ri} 0 1 0 ${cx - ri} ${cy}Z`;
    // ellipse with a notch (lily pad)
    const padD = (cx, cy, rx, ry, a = -1.2, w = .55) => { const p = t => f(cx + rx * Math.cos(t)) + ' ' + f(cy + ry * Math.sin(t)); return `M${cx} ${cy}L${p(a - w / 2)}A${rx} ${ry} 0 1 0 ${p(a + w / 2)}Z`; };
    // knobbly tyre outline
    const tyreD = (cx, cy, r, n, d) => { let p = ''; for (let i = 0; i < n; i++) { const a = 2 * Math.PI * i / n, w = Math.PI / n; [[a - w * .5, r - d], [a - w * .3, r], [a + w * .3, r], [a + w * .5, r - d]].forEach(([t, rr], j) => { p += (i || j ? 'L' : 'M') + f(cx + rr * Math.cos(t)) + ' ' + f(cy + rr * Math.sin(t)); }); } return p + 'Z'; };
    const drop = (x, y, rot, s = 1) => `<path ${R} transform="rotate(${rot} ${x} ${y})" d="${T('M0 -16C4 -8 10 -2 10 4C10 10 5 13 0 13C-5 13 -10 10 -10 4C-10 -2 -4 -8 0 -16Z', x, y, s)}"/>`;
    const frame = `<rect ${R} x="8" y="8" width="284" height="284" rx="18"/>`;
    // bumpy circle (tree tops, flowers, puffs): n bumps on radius r
    const blobD = (cx, cy, r, n, k = .6, a0 = 0) => { const p = []; for (let i = 0; i < n; i++) { const a = a0 + i * 2 * Math.PI / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } const br = f(2 * r * Math.sin(Math.PI / n) * k); return 'M' + xy(p[0]) + p.map((q, i) => `A${br} ${br} 0 0 1 ${xy(p[(i + 1) % n])}`).join('') + 'Z'; };
    // horizontal band of a circle between y1 and y2
    const bandD = (cx, cy, r, y1, y2) => { const w = y => Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy))); return `M${f(cx - w(y1))} ${y1}A${r} ${r} 0 0 0 ${f(cx - w(y2))} ${y2}L${f(cx + w(y2))} ${y2}A${r} ${r} 0 0 0 ${f(cx + w(y1))} ${y1}Z`; };
    const flower = (x, y, r) => P(blobD(x, y, r, 5, .52, -Math.PI / 2)) + `<circle ${R} cx="${x}" cy="${y}" r="${f(r * .62)}"/>`;
    // mermaid fluke at end point E, direction d (unit), size s
    const flukeD = (E, d, s) => { const n = [-d[1], d[0]], q = (a, b) => [E[0] + a * d[0] + b * n[0], E[1] + a * d[1] + b * n[1]]; return 'M' + xy(q(0, 7)) + 'Q' + xy(q(s * .3, s * .95)) + ' ' + xy(q(s, s * .9)) + 'Q' + xy(q(s * .75, s * .3)) + ' ' + xy(q(s * .62, 0)) + 'Q' + xy(q(s * .75, -s * .3)) + ' ' + xy(q(s, -s * .9)) + 'Q' + xy(q(s * .3, -s * .95)) + ' ' + xy(q(0, -7)) + 'Z'; };
    const bubble = (x, y, r) => `<circle ${R} cx="${x}" cy="${y}" r="${r}"/><path d="M${f(x - r * .55)} ${f(y - r * .05)}Q${f(x - r * .5)} ${f(y - r * .5)} ${f(x - r * .05)} ${f(y - r * .55)}" ${TL}/>`;
    const ground = y => `M8 ${y}Q150 ${y - 16} 292 ${y}L292 274Q292 292 274 292L26 292Q8 292 8 274Z`;
    const BOT = 'L292 274Q292 292 274 292L26 292Q8 292 8 274Z';
    // kid head: face circle, hair markup (drawn over the face), eyes + smile
    const head = (x, y, r, hair = '') => C(x, y, r) + hair + eye(x - r * .38, y + r * .12, r * .2) + eye(x + r * .38, y + r * .12, r * .2) + smile(x, y + r * .46, r * .28, r * .22);
    const st = (x, y, r) => P(star(x, y, r, r * .55));
    // bunting: string from s to e with sag, flags on [t0,t1] spans
    const bunt = (sx, sy, ex, ey, sag, ts, h = 26) => {
      const Q = t => [sx + (ex - sx) * t, sy + (ey - sy) * t + sag * 4 * t * (1 - t)], pts = [Q(0)]; let fl = '';
      ts.forEach(([t0, t1]) => { const a = Q(t0), b = Q(t1); pts.push(a, b); fl += P(`M${xy(a)}L${xy(b)}L${xy([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + h])}Z`); });
      pts.push(Q(1)); return fl + `<polyline points="${pts.map(xy).join(' ')}" ${TL}/>`;
    };
    // fern frond: lobed leaf from (x,y), length l, tilted a degrees, midrib stops short of the tip
    const fern = (x, y, l, a, w = 16, n = 6) => { const g = X(x, y, a), wn = q => w * .55 * (1 - q * .8); let d = 'M' + xy(g(-wn(0), 0)), r = ''; for (let i = 0; i < n; i++) { const t0 = i / n, t1 = (i + 1) / n, wi = w * (1 - t0 * .7), m = -l * (t0 + .5 / n); d += 'Q' + xy(g(-wi * 1.3, m)) + ' ' + xy(g(-wn(t1), -l * t1)); r = 'Q' + xy(g(wi * 1.3, m)) + ' ' + xy(g(wn(t0), -l * t0)) + r; } return P(d + r + 'Z') + D('M' + xy(g(0, 0)) + 'L' + xy(g(0, -l * .7))); };
    const leafD = (x, y, a, s = 1) => xd('M0 0Q8 -10 20 0Q8 10 0 0Z', X(x, y, a, s));
    const present = (x, y, w, h) => { const c = x + w / 2; return P(rrD(x, y, w, h, 3)) + P(rrD(x - 4, y - 10, w + 8, 12, 3)) + P(`M${c} ${y - 10}Q${c - 16} ${y - 28} ${c - 20} ${y - 14}Q${c - 14} ${y - 8} ${c} ${y - 10}Q${c + 14} ${y - 8} ${c + 20} ${y - 14}Q${c + 16} ${y - 28} ${c} ${y - 10}Z`) + dot(x + w * .3, y + h * .4) + dot(x + w * .7, y + h * .65) + dot(x + w * .45, y + h * .8); };
    const rays = (cx, cy, r1, r2, n, a0 = 0) => { let d = ''; for (let i = 0; i < n; i++) { const a = a0 + i * 2 * Math.PI / n; d += `M${f(cx + r1 * Math.cos(a))} ${f(cy + r1 * Math.sin(a))}L${f(cx + r2 * Math.cos(a))} ${f(cy + r2 * Math.sin(a))}`; } return `<path d="${d}" ${L} fill="none"/>`; };

    // ---------- 1. princess carousel
    const carousel = () => {
      const AX = 150, AY = 50, P0 = [24, 102], PC = [150, 134], P2 = [276, 102];
      const B = t => { const u = 1 - t; return [u * u * P0[0] + 2 * u * t * PC[0] + t * t * P2[0], u * u * P0[1] + 2 * u * t * PC[1] + t * t * P2[1]]; };
      const S = (t0, t1) => { const a = (1 - t0) * (1 - t1), b = t0 * (1 - t1) + t1 * (1 - t0), c = t0 * t1; return [a * P0[0] + b * PC[0] + c * P2[0], a * P0[1] + b * PC[1] + c * P2[1]]; };
      const K = p => [AX + (p[0] - AX) * .3, AY + (p[1] - AY) * .78];
      let stripes = '', scallops = '', bulbs = '';
      const N = 5;
      for (let i = 0; i < N; i++) {
        const t0 = i / N, t1 = (i + 1) / N, a = B(t0), b = B(t1), c = S(t0, t1);
        stripes += `<path ${R} d="M${AX} ${AY}Q${xy(K(a))} ${xy(a)}Q${xy(c)} ${xy(b)}Q${xy(K(b))} ${AX} ${AY}Z"/>`;
        const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 30];
        scallops += `<path ${R} d="M${xy(a)}Q${xy(c)} ${xy(b)}Q${xy(m)} ${xy(a)}Z"/>`;
        const mm = B((t0 + t1) / 2); bulbs += dot(mm[0], mm[1] + 7, 2.6);
        if (i) bulbs += dot(a[0], a[1], 3);
      }
      const horse = (tx, ty, fx) => {
        const s = .85, w = (x, y) => [tx + fx * s * x, ty + s * y], t = d => xd(d, w);
        const leg = pts => P(tube(pts.map(p => w(p[0], p[1])), 10.5));
        const e = w(-43, -42), n = w(-59, -33);
        return P(t('M26 -8Q44 -24 54 -10Q60 6 48 28Q46 12 38 8Q32 6 26 6Z'))
          + leg([[-12, 10], [-26, 22], [-22, 36]]) + leg([[12, 10], [18, 24], [12, 37]])
          + leg([[-20, 6], [-40, 8], [-42, 26]]) + leg([[22, 8], [32, 22], [28, 37]])
          + P(t('M-32 -58Q-26 -76 -12 -66Q2 -64 -2 -50Q12 -44 4 -32Q16 -26 6 -14L-10 -14Z'))
          + P(t('M-8 -10Q-10 -38 -24 -52L-22 -70L-34 -58Q-48 -60 -57 -48Q-66 -36 -60 -28Q-54 -20 -42 -24Q-34 -26 -30 -14L-26 2Z'))
          + `<ellipse ${R} cx="${f(tx)}" cy="${ty}" rx="${f(32 * s)}" ry="${f(19 * s)}"/>`
          + P(t('M-14 -18Q2 -24 18 -18L20 6Q2 12 -14 6Z'))
          + `<path d="${heartD(w(3, -6)[0], w(3, -6)[1], .45)}" fill="${INK}"/>`
          + P(t('M-51 -53L-49 -80L-34 -60Z'))
          + eye(e[0], e[1], 4) + dot(n[0], n[1], 1.6) + `<path d="${t('M-57 -27Q-52 -23 -47 -26')}" ${TL}/>`;
      };
      return `<path ${R} d="M24 248L24 264A126 14 0 0 0 276 264L276 248A126 14 0 0 1 24 248Z"/>
        <ellipse ${R} cx="150" cy="248" rx="126" ry="14"/>
        ${dot(60, 270)}${dot(105, 275)}${dot(150, 276)}${dot(195, 275)}${dot(240, 270)}
        <rect ${R} x="77" y="116" width="12" height="134"/><rect ${R} x="211" y="116" width="12" height="138"/>
        <rect ${R} x="136" y="110" width="28" height="138"/>
        ${stripes}${scallops}${bulbs}
        <path ${R} d="M130 56L126 24L140 38L150 16L160 38L174 24L170 56Z"/>
        ${dot(126, 23, 3.5)}${dot(150, 15, 3.5)}${dot(174, 23, 3.5)}<path d="${heartD(150, 45, .55)}" fill="${INK}"/>
        ${bunt(128, 30, 8, 42, 14, [[.12, .4], [.56, .84]])}${bunt(172, 30, 292, 42, 14, [[.12, .4], [.56, .84]])}
        ${horse(83, 198, 1)}${horse(217, 208, -1)}
        ${sparkle(22, 152, 7)}${sparkle(278, 150, 7)}${sparkle(16, 212, 5)}${sparkle(285, 214, 5)}`;
    };

    // ---------- 2. baby hippo
    const hippo = () => {
      const arm = fx => P(tube([[150 + fx * 34, 206], [150 + fx * 62, 190], [150 + fx * 74, 164]], 22));
      return frame + rays(246, 58, 31, 40, 8, .2) + `<circle ${R} cx="246" cy="58" r="23"/>` + cloud(22, 78, .7)
        + `<path ${R} d="M8 150Q50 124 96 140Q140 126 186 138Q230 122 292 142L292 180L8 180Z"/>`
        + `<path ${R} d="M8 172Q150 158 292 172L292 274Q292 292 274 292L26 292Q8 292 8 274Z"/>`
        // reeds
        + `<path ${R} d="M10 270Q14 214 44 176Q26 222 26 270Z"/><path ${R} d="M290 270Q286 214 256 178Q274 222 274 270Z"/>`
        + [[18, 252, 22, 122], [32, 258, 34, 142], [282, 252, 278, 124], [268, 258, 266, 146]].map(([x1, y1, x2, y2]) =>
          `<path ${R} d="${tube([[x1, y1], [x2, y2]], 7.5)}"/><rect ${R} x="${x2 - 6.5}" y="${y2 - 6}" width="13" height="32" rx="6.5"/>`).join('')
        // hippo
        + arm(-1) + arm(1)
        + `<ellipse ${R} cx="150" cy="210" rx="54" ry="30"/>`
        + P('M56 228Q64 210 78 222Q88 204 101 219Q112 208 124 221Q137 210 150 221Q163 210 176 221Q188 208 199 219Q212 204 222 222Q236 210 244 228Q246 252 150 252Q54 252 56 228Z')
        + `<path d="M34 250Q46 242 58 250M242 250Q254 242 266 250M110 262Q130 268 150 262" ${TL}/>`
        + `<circle ${R} cx="108" cy="82" r="13"/><circle ${R} cx="108" cy="81" r="6.5"/><circle ${R} cx="192" cy="82" r="13"/><circle ${R} cx="192" cy="81" r="6.5"/>`
        + `<ellipse ${R} cx="150" cy="114" rx="52" ry="42"/>`
        + `<path d="M144 74Q140 64 146 58M153 73Q154 63 161 60" ${TL}/>`
        + `<ellipse ${R} cx="112" cy="116" rx="9" ry="6"/><ellipse ${R} cx="188" cy="116" rx="9" ry="6"/>`
        + P('M94 152Q92 124 124 128Q150 132 176 128Q208 124 206 152Q204 190 150 190Q96 190 94 152Z')
        + eye(130, 100, 7) + eye(170, 100, 7)
        + `<ellipse cx="134" cy="144" rx="4.5" ry="6" fill="${INK}"/><ellipse cx="166" cy="144" rx="4.5" ry="6" fill="${INK}"/>`
        + smile(150, 164, 22, 16)
        + drop(56, 150, -40, .78) + drop(76, 124, -12, .78) + drop(50, 190, -72, .72)
        + drop(244, 150, 40, .78) + drop(224, 124, 12, .78) + drop(250, 190, 72, .72)
        + P(padD(82, 274, 34, 12, -1.0)) + P(padD(150, 281, 20, 7, -2.2)) + P(padD(222, 276, 36, 13, -2.0))
        + P(fanD(226, 270, 28, 5, 1.15)) + P(fanD(226, 274, 19, 3, .6, .5));
    };

    // ---------- 3. dune buggy
    const buggy = () => {
      const S = 1.2, g = X(150, 150, -10, S), G = d => xd(d, g);
      const C = (x, y, r) => { const p = g(x, y); return `<circle ${R} cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r * S)}"/>`; };
      const Dt = (x, y, r) => { const p = g(x, y); return dot(p[0], p[1], r); };
      const tb = (pts, w) => P(tube(pts.map(p => g(p[0], p[1])), w * S));
      const wheel = (x, y, r, hr) => P(G(tyreD(x, y, r, 16, 3.5))) + C(x, y, hr) + Dt(x, y, 3.5)
        + [0, 1, 2, 3, 4].map(i => Dt(x + hr * .6 * Math.cos(i * 1.257), y + hr * .6 * Math.sin(i * 1.257), 1.8)).join('');
      return frame + rays(240, 50, 29, 38, 10) + `<circle ${R} cx="240" cy="50" r="22"/>`
        + P('M8 148Q60 122 118 146Q176 170 234 138Q266 122 292 130L292 230L8 230Z')
        + P('M28 152L28 116Q28 108 34 108Q40 108 40 116L40 128L46 128L46 120Q46 115 49 115Q52 115 52 120L52 134Q52 138 48 138L40 138L40 152Z')
        + P('M8 196Q70 166 140 190Q210 214 292 184L292 250L8 250Z')
        + P('M8 274L8 222Q50 202 90 224Q126 244 150 292L26 292Q8 292 8 274Z')
        + P('M140 292Q180 248 240 244Q270 242 292 248L292 274Q292 292 274 292Z')
        + `<ellipse ${R} cx="196" cy="278" rx="13" ry="8"/><ellipse ${R} cx="226" cy="270" rx="11" ry="7"/>` + P(fanD(264, 268, 26, 5, 1.1, .4))
        + `<path d="M22 262l12 -6M40 254l12 -6M30 280l12 -6M50 272l12 -6M70 266l10 -6" ${TL}/>`
        + cloud(14, 214, .45) + cloud(48, 226, .5) + cloud(34, 196, .4)
        + `<path d="M14 96h26M10 110h18M22 82h16" ${TL}/>`
        + `<path d="M104 42q6 -6 12 0q6 -6 12 0M150 28q5 -5 10 0q5 -5 10 0" ${TL}/>`
        // buggy (local coords, facing right)
        + `<path d="${G('M-70 -20L-80 -92')}" ${L}/>` + P(G('M-80 -92L-48 -84L-78 -72Z'))
        + tb(qpts([-50, -18], [-38, -118], [16, -16]), 10.5)
        + tb([[-14, -34], [-34, -42], [-44, -66]], 10)
        + P(G('M-22 -10L-20 -34Q-18 -42 -8 -42L0 -42Q10 -42 10 -32L12 -10Z'))
        + C(-6, -57, 17) + C(2, -53, 11)
        + P(G('M-23 -60Q-20 -76 -4 -75Q-14 -66 -14 -56Z'))
        + (([x, y]) => eye(x, y, 2.8))(g(6, -55)) + `<path d="${G('M0 -48Q5 -44 10 -48')}" ${TL}/>`
        + tb([[-6, -32], [10, -22], [24, -26]], 10)
        + `<path d="${G('M30 -16L38 -8')}" ${L}/>` + P(G(rrD(23, -40, 11, 26, 5.5)))
        + P(G('M-84 -2Q-86 -22 -66 -22L-36 -22Q-30 -22 -28 -14L-26 -10L26 -10Q34 -10 40 -16Q52 -28 70 -28L84 -28Q100 -28 100 -12L100 2Q100 12 90 12L-76 12Q-84 12 -84 -2Z'))
        + C(88, -16, 7) + C(6, 1, 9) + `<path d="${G('M2 -3L10 -3L4 7')}" ${TL}/>`
        + wheel(-50, 24, 30, 15) + wheel(60, 26, 27, 13);
    };

    // ---------- 4. mermaid riding a seahorse
    const mermaid = () => {
      const weed = (x, y, h, w, ph) => { const p = []; for (let i = 0; i <= 8; i++) { const t = i / 8; p.push([x + Math.sin(t * 5 + ph) * 7, y - h * t]); } return P(tube(p, w, w * .7)); };
      const tail = []; for (let i = 0; i <= 10; i++) { const a = (-50 + i * 30) * Math.PI / 180, r = 30 - i * 2; tail.push([100 + r * Math.cos(a), 250 + r * Math.sin(a)]); }
      return frame + P('M8 252Q60 238 120 248Q190 260 292 244L292 274Q292 292 274 292L26 292Q8 292 8 274Z')
        + weed(24, 266, 112, 15, 0) + weed(276, 260, 176, 15, 1) + weed(258, 268, 92, 13, 3)
        + `<path ${R} d="${star(48, 272, 15, 8, 5)}"/>`
        + P('M224 284Q220 262 240 260Q260 262 256 284Q240 290 224 284Z') + `<path d="M240 284L240 268M232 284L229 270M248 284L251 270" ${TL}/>`
        + bubble(36, 44, 9) + bubble(58, 24, 6.5) + bubble(30, 82, 7) + bubble(232, 40, 9.5) + bubble(258, 70, 7) + bubble(210, 22, 6.5)
        // seahorse (facing left)
        + P('M150 202Q176 196 182 210Q172 214 178 224Q164 228 148 222Z')
        + P(tube(tail, 19, 10))
        + P('M88 116Q96 96 118 100Q134 104 142 128Q160 156 158 192Q156 228 122 236Q86 238 74 206Q64 176 82 150Q92 134 88 116Z')
        + P('M82 150Q64 176 74 206Q84 236 122 236Q96 216 94 188Q92 166 82 150Z') + `<path d="M68 176Q76 178 82 174M70 198Q78 198 84 194M84 220Q90 218 94 212" ${TL}/>`
        + P('M82 76L76 52L92 62L98 42L108 60L122 50L120 76Z')
        + `<ellipse ${R} cx="100" cy="94" rx="30" ry="26"/>`
        + P(tube([[78, 104], [42, 116]], 18, 14))
        + `<ellipse ${R} cx="98" cy="108" rx="8" ry="5.5"/>` + eye(94, 89, 8)
        + `<path d="M88 81L84 76M84 85L79 82" ${TL}/>` + `<path d="M58 118Q64 122 70 118" ${TL}/>`
        // mermaid
        + P('M150 62Q172 60 174 82Q176 102 192 116Q182 120 176 116Q180 134 196 144Q172 148 164 128Q160 112 152 104Z')
        + P(tube([[154, 136], [170, 166], [182, 196], [194, 220]], 30, 15))
        + P(flukeD([194, 220], [.45, .9], 26))
        + P(tube([[146, 110], [132, 118], [122, 110]], 10)) + P(tube([[160, 110], [176, 98], [182, 76]], 10))
        + P('M142 138Q140 118 144 106Q152 100 162 106Q166 118 166 138Z')
        + P('M142 116Q154 110 166 116L166 126Q154 130 142 126Z')
        + `<ellipse ${R} cx="154" cy="137" rx="15" ry="7" transform="rotate(-25 154 137)"/>`
        + `<circle ${R} cx="150" cy="82" r="18"/>`
        + P('M132 82Q132 62 150 62Q168 62 168 82Q162 72 152 75Q142 70 132 82Z')
        + P('M136 66L137 50L144 59L150 46L156 59L163 50L164 66Q150 62 136 66Z')
        + eye(144, 85, 3.5) + eye(157, 85, 3.5) + smile(150, 92, 4.5, 3.5)
        + `<path d="M140 82L137 80M161 82L164 80" ${TL}/>`
        + `<path d="M162 160Q170 164 176 158M172 184Q180 188 186 182" ${TL}/>`;
    };

    // ---------- 5. corgi and frisbee
    const corgi = () => {
      const g = X(130, 160, -10, 1.1), G = d => xd(d, g), tb = (p, w) => P(tube(p.map(q => g(...q)), w));
      const hc = g(46, -34), h = X(hc[0], hc[1], -6, 1.15), H = d => xd(d, h), k = 1.15;
      const tree = (x, y, r, tw, th) => P(rrD(x - tw / 2, y, tw, th, 4)) + P(blobD(x, y - 8, r, 9, .62));
      return frame + cloud(18, 70, .55) + cloud(112, 46, .48)
        + tree(38, 124, 27, 16, 100) + tree(266, 178, 20, 13, 50)
        + P(ground(222))
        + P(blobD(214, 218, 13, 6, .62, Math.PI)) + P(blobD(96, 218, 12, 6, .62, Math.PI))
        + E(146, 252, 40, 8)
        + flower(40, 260, 10) + flower(236, 266, 10) + flower(272, 240, 9)
        + D('M64 244l-3 -8M68 244l2 -9M196 244l-3 -8M200 244l2 -9M150 280l-2 -8M154 280l2 -8M90 270l-2 -8M94 270l2 -8')
        // corgi body (side, facing right) + head (front view)
        + tb([[-28, 12], [-46, 20], [-60, 16]], 15) + tb([[26, 10], [44, 18], [58, 14]], 15)
        + tb([[-22, 14], [-38, 28], [-54, 30]], 15) + tb([[32, 12], [50, 24], [64, 24]], 15)
        + E(...g(0, 0), 48 * 1.1, 25 * 1.1, -10)
        + P(blobD(...g(-48, -4), 11, 6, .6))
        + P(blobD(...h(0, 34), 17, 8, .6))
        + P(tube([[-20, 21], [0, 29], [20, 21]].map(q => h(...q)), 9 * k)) + P(heartD(...h(0, 39), 1.1))
        + [1, -1].map(m => P(H(`M${-28 * m} -8Q${-36 * m} -42 ${-24 * m} -50Q${-12 * m} -42 ${-2 * m} -24Z`)) + P(H(`M${-23 * m} -14Q${-28 * m} -36 ${-22 * m} -41Q${-14 * m} -35 ${-8 * m} -24Z`))).join('')
        + E(...h(0, 0), 28 * k, 24 * k, -6)
        + P(H('M-5 -23Q0 -25 5 -23L7 -2Q0 3 -7 -2Z'))
        + E(...h(0, 9), 16 * k, 11 * k, -6)
        + P(H('M-6 14Q-6 27 0 27Q6 27 6 14Z'))
        + `<ellipse cx="${f(h(0, 3)[0])}" cy="${f(h(0, 3)[1])}" rx="5" ry="4" fill="${INK}"/>` + D(H('M0 5Q-4 13 -9 9M0 5Q4 13 9 9'))
        + eye(...h(-12, -7), 5) + eye(...h(12, -7), 5) + E(...h(-20, 5), 6, 4.6, -6) + E(...h(20, 5), 6, 4.6, -6)
        // frisbee
        + `<path d="M196 46Q206 40 214 42M200 58Q208 54 214 56M276 98Q284 100 286 92" ${TL}/>`
        + `<ellipse ${R} cx="252" cy="68" rx="28" ry="11" transform="rotate(-18 252 68)"/><ellipse ${R} cx="252" cy="67" rx="14" ry="5" transform="rotate(-18 252 67)"/>`;
    };

    // ---------- 6. jetpack kid in space
    const jetpack = () => {
      const g = X(150, 154, 28, 1.2), G = d => xd(d, g), tb = (pts, w) => P(tube(pts.map(p => g(p[0], p[1])), w));
      const C = (x, y, r) => { const p = g(x, y); return `<circle ${R} cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r * 1.2)}"/>`; };
      const pt = (x, y) => g(x, y);
      const st = (x, y, r) => `<path ${R} d="${star(x, y, r, r * .55)}"/>`;
      let tiny = ''; [[30, 30], [92, 22], [210, 18], [276, 112], [24, 178], [100, 272], [190, 286], [282, 268], [196, 120], [70, 120]].forEach(([x, y]) => { tiny += dot(x, y, 2); });
      return frame + tiny + sparkle(40, 96, 6) + sparkle(232, 132, 6) + sparkle(120, 228, 5)
        + `<circle ${R} cx="44" cy="250" r="36"/>` + P(bandD(44, 250, 36, 230, 242)) + P(bandD(44, 250, 36, 256, 266))
        + `<circle ${R} cx="246" cy="62" r="28"/><circle ${R} cx="238" cy="54" r="7"/><circle ${R} cx="257" cy="72" r="6"/>`
        + `<circle ${R} cx="256" cy="222" r="17"/>` + `<path d="M246 214Q256 208 266 214" ${TL}/>`
        + P('M62 54Q40 38 16 22Q30 46 56 70Z') + `<circle ${R} cx="66" cy="62" r="11"/>`
        + st(118, 40, 11) + st(168, 26, 11) + st(28, 136, 11) + st(272, 150, 11) + st(214, 268, 11) + st(148, 272, 10.5)
        // kid (local, upright)
        + [-19, 19].map(x => { const flip = d => xd(d, (a, b) => g(2 * x - a, 60 - b)); return P(flip(fanD(x, 30, 40, 3, .32, .6))) + P(flip(fanD(x, 30, 24, 1, 0))); }).join('')
        + P(G(rrD(-27, -28, 16, 48, 8))) + P(G(rrD(11, -28, 16, 48, 8)))
        + P(G('M-24 18L-14 18L-11 30L-27 30Z')) + P(G('M14 18L24 18L27 30L11 30Z'))
        + tb([[-7, 10], [-9, 42]], 13) + tb([[7, 10], [12, 40]], 13)
        + P(G('M-19 40Q-19 34 -11 34Q-2 34 -2 42Q-2 50 -12 50Q-20 50 -19 40Z')) + P(G('M6 38Q6 32 14 32Q23 32 23 40Q23 48 13 48Q5 48 6 38Z'))
        + tb([[-14, -20], [-28, -8], [-36, 6]], 11) + tb([[14, -20], [26, -36], [30, -56]], 11)
        + C(-37, 10, 7.5) + C(30, -60, 7.5)
        + P(G(rrD(-15, -28, 30, 40, 10))) + P(G('M-16 4L16 4L16 13L-16 13Z'))
        + `<path ${R} d="${G(star(0, -11, 9, 5))}"/>`
        + P(G(rrD(-12, -33, 24, 8, 4)))
        + C(0, -52, 23) + C(0, -50, 14.5)
        + P(G('M-14.5 -51Q-14 -66 0 -65.5Q14 -66 14.5 -51Q8 -59 0 -56Q-8 -60 -14.5 -51Z'))
        + (([x, y]) => eye(x, y, 3.2))(pt(-5, -48)) + (([x, y]) => eye(x, y, 3.2))(pt(6, -48))
        + `<path d="${G('M-4 -42Q1 -38 6 -42')}" ${TL}/>` + `<path d="${G('M-17 -64Q-12 -72 -4 -74')}" ${TL}/>`;
    };

    // ---------- 7. kawaii milkshake
    const milkshake = () => {
      const strawSeg = (t0, t1) => { const A = [180, 106], B = [234, 30], dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy), nx = -dy / l * 7.5, ny = dx / l * 7.5; const p = t => [A[0] + dx * t, A[1] + dy * t]; const a = p(t0), b = p(t1); return P(`M${xy([a[0] + nx, a[1] + ny])}L${xy([b[0] + nx, b[1] + ny])}L${xy([b[0] - nx, b[1] - ny])}L${xy([a[0] - nx, a[1] - ny])}Z`); };
      const spr = (x, y, r) => P(rrD(x - 8, y - 4, 16, 8, 4)).replace('/>', ` transform="rotate(${r} ${x} ${y})"/>`);
      return frame
        + P('M8 234L292 234L292 254L8 254Z') + P('M8 254L292 254L292 274Q292 292 274 292L26 292Q8 292 8 274Z')
        + `<polyline points="8 30 30 46 34 44 60 54 64 52 92 58" ${TL}/>` + P('M30 46L60 54L40 72Z') + P('M64 52L92 58L72 78Z')
        + `<polyline points="292 30 270 46 266 44 240 54 236 52 208 58" ${TL}/>` + P('M270 46L240 54L260 72Z') + P('M236 52L208 58L228 78Z')
        + P(heartD(46, 152, 1.5)) + P(heartD(256, 140, 1.3)) + sparkle(36, 200, 7) + sparkle(262, 196, 7) + sparkle(266, 96, 5) + sparkle(30, 112, 5)
        + `<ellipse ${R} cx="150" cy="244" rx="62" ry="9"/>`
        + P('M141 214L159 214L161 238L139 238Z') + `<ellipse ${R} cx="150" cy="238" rx="30" ry="7"/>`
        + strawSeg(0, .55) + strawSeg(.55, .7) + strawSeg(.7, .85) + strawSeg(.85, 1)
        + `<circle ${R} cx="86" cy="86" r="21"/>` + dot(78, 78, 2.6) + dot(90, 74, 2.6) + dot(80, 92, 2.6)
        + P('M94 128L206 128L186 212Q150 222 114 212Z')
        + P(rrD(88, 118, 124, 14, 7))
        + P('M92 126Q82 110 100 104Q104 90 122 96Q132 84 150 88Q168 84 178 96Q196 90 200 104Q218 110 208 126Z')
        + P('M108 100Q98 86 114 80Q118 68 134 72Q150 62 166 72Q182 68 186 80Q202 86 192 100Z')
        + P('M124 76Q116 62 132 58Q136 44 150 38Q164 44 168 58Q184 62 176 76Z')
        + `<path d="M150 26Q152 14 164 12" ${L} fill="none"/>` + P('M160 14Q170 2 182 10Q172 20 160 14Z')
        + `<circle ${R} cx="150" cy="36" r="12"/>` + `<path d="M144 31Q146 27 150 27" ${TL}/>`
        + spr(120, 112, 30) + spr(182, 112, -25) + spr(136, 88, -35) + spr(166, 90, 35) + spr(150, 64, 0)
        + eye(130, 160, 7) + eye(170, 160, 7)
        + `<ellipse ${R} cx="118" cy="176" rx="9" ry="6"/><ellipse ${R} cx="182" cy="176" rx="9" ry="6"/>`
        + P('M138 172Q150 194 162 172Z')
        + `<path d="M104 146Q106 170 112 190" ${TL}/>`;
    };

    // ---------- 8. fairy with a dandelion
    const fairy = () => {
      const s = 1.2, g = (x, y) => [122 + (x - 129) * s, 140 + (y - 130) * s], G = d => xd(d, g);
      const C = (x, y, r) => { const p = g(x, y); return `<circle ${R} cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r * s)}"/>`; };
      const tb = (pts, w) => P(tube(pts.map(p => g(p[0], p[1])), w * s));
      const ept = (x, y, r) => { const p = g(x, y); return eye(p[0], p[1], r); };
      const seed = (x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x} ${y}L${x} ${y + 18}" ${TL}/>` + dot(x, y + 19, 2.4) + P(blobD(x, y - 4, 6, 7, .6)) + `</g>`;
      let fil = ''; for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7; fil += `M${f(214 + 6 * Math.cos(a))} ${f(64 + 6 * Math.sin(a))}L${f(214 + 22 * Math.cos(a))} ${f(64 + 22 * Math.sin(a))}`; }
      return frame + cloud(18, 74, .55) + cloud(226, 176, .5)
        + P('M8 214Q80 188 160 206Q230 222 292 198L292 292L8 292Z')
        + P('M8 252Q100 228 180 248Q240 262 292 244L292 274Q292 292 274 292L26 292Q8 292 8 274Z')
        + `<path d="M40 254L40 238M248 262L248 248M272 222L272 208" ${L}/>`
        + flower(40, 230, 10) + flower(248, 240, 10) + flower(272, 200, 9)
        + `<path d="M90 250l-3 -9M95 250l2 -10M190 248l-3 -9M195 248l2 -10M214 214l-2 -8M218 214l2 -8" ${TL}/>`
        + seed(262, 116, 15) + seed(272, 60, 25) + seed(60, 28, -20) + seed(226, 124, -12)
        // dandelion stalk + puff
        + `<path d="M170 102Q190 94 204 88" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`
        + P(blobD(214, 64, 30, 22, .58)) + `<path d="${fil}" ${TL}/>` + dot(214, 64, 5)
        // fairy wings
        + P(G('M122 124Q86 62 64 84Q50 104 116 132Z')) + P(G('M122 134Q78 140 80 164Q86 180 120 140Z'))
        + P(G('M136 124Q156 84 176 98Q188 116 140 132Z')) + P(G('M136 134Q170 140 168 160Q160 174 134 140Z'))
        // legs + shoes
        + tb([[122, 170], [116, 200]], 9) + tb([[134, 170], [142, 196]], 9)
        + (([x, y]) => `<ellipse ${R} cx="${f(x)}" cy="${f(y)}" rx="10" ry="7"/>`)(g(114, 204))
        + (([x, y]) => `<ellipse ${R} cx="${f(x)}" cy="${f(y)}" rx="10" ry="7" transform="rotate(-20 ${f(x)} ${f(y)})"/>`)(g(145, 200))
        // hair: top bun + bob
        + C(129, 64, 12)
        + P(G('M108 92Q106 70 129 70Q152 70 150 92Q152 110 140 112L118 112Q106 110 108 92Z'))
        // arms
        + tb([[118, 120], [100, 132], [88, 124]], 9) + tb([[140, 120], [156, 110], [168, 100]], 9)
        // dress
        + P(G('M106 172Q104 160 112 150L114 140L144 140L146 150Q154 160 152 172Q144 178 137 172Q129 180 121 172Q113 178 106 172Z'))
        + P(G('M117 140L118 122Q129 116 140 122L141 140Z'))
        + C(129, 96, 19)
        + P(G('M110 96Q110 77 129 77Q148 77 148 96Q142 86 134 88Q128 82 120 88Q114 86 110 96Z'))
        + (([x, y]) => P(heartD(x, y, .75)))(g(142, 62))
        + ept(122, 99, 3.6) + ept(136, 99, 3.6) + (([x, y]) => smile(x, y, 5, 4))(g(129, 106))
        + C(117, 105, 4.5) + C(141, 105, 4.5)
        + sparkle(64, 120, 5) + sparkle(190, 136, 5) + sparkle(56, 170, 4);
    };

    // ---------- 9. surfer
    const surfer = () => {
      const g = X(118, 170, -8, 1.15), G = d => xd(d, g), tb = (p, w) => P(tube(p.map(q => g(...q)), w * 1.15));
      const gull = (x, y, s) => P(T('M0 0Q12 -12 24 -2Q36 -12 48 0Q36 -4 24 8Q12 -4 0 0Z', x, y, s));
      return frame + rays(52, 50, 29, 38, 8, .3) + C(52, 50, 21) + cloud(92, 70, .45) + cloud(238, 46, .32) + gull(146, 30, .9) + gull(204, 20, .75)
        + P('M8 150L292 150' + BOT) + P('M24 150Q44 128 70 150Z')
        + P('M8 268Q100 262 150 220Q196 180 196 128Q196 76 244 66Q288 60 292 104' + BOT)
        + P('M210 134Q208 104 238 100Q266 100 268 130Q266 156 240 158Q214 158 210 134Z') + D('M240 144Q224 142 226 126Q230 110 246 114Q258 120 252 132')
        + P('M194 104Q186 86 202 80Q204 62 222 64Q230 50 246 56Q258 46 272 56Q288 54 290 72L292 74L292 94Q272 80 248 80Q214 82 194 104Z')
        + P(blobD(180, 84, 7.5, 5, .6)) + P(blobD(172, 106, 6.5, 5, .6)) + P(blobD(184, 126, 6, 5, .6)) + P(blobD(164, 76, 5.5, 5, .6))
        + D('M150 236Q166 226 176 210M182 192Q190 178 192 162M52 262Q74 258 92 250')
        + P('M8 272Q30 260 52 270Q74 258 98 268Q120 256 144 266Q166 254 190 264Q212 252 236 262Q258 252 292 260' + BOT)
        + E(118, 212, 58, 12, -16) + E(118, 212, 42, 5, -16)
        + tb([[-6, 0], [-14, 14], [-20, 30]], 11) + tb([[6, 0], [16, 12], [20, 30]], 11)
        + P(G(rrD(-12, -8, 24, 14, 5)))
        + tb([[-9, -28], [-26, -30], [-40, -40]], 10) + tb([[9, -28], [26, -26], [40, -18]], 10)
        + P(G(rrD(-11, -34, 22, 30, 8)))
        + P(G('M-6 -58Q-26 -66 -42 -52Q-32 -50 -28 -42Q-18 -52 -6 -50Z'))
        + head(...g(0, -47), 15, P(G('M-13 -46Q-14 -62 0 -62Q14 -62 13 -46Q6 -54 0 -52Q-6 -54 -13 -46Z')));
    };

    // ---------- 10. skateboard, helmet and knee pads
    const skate = () => {
      const g = X(150, 172, -30), G = d => xd(d, g);
      const kp = (x, y, a) => { const q = d => xd(d, X(x, y, a)); return P(q(rrD(-20, -28, 40, 52, 12))) + P(q('M-15 -22Q0 -32 15 -22L13 6Q0 16 -13 6Z')) + P(q(rrD(-23, 14, 46, 13, 5))); };
      return frame + [64, 120, 176].map(y => P(`M8 ${y}L292 ${y}L292 ${y + 56}L8 ${y + 56}Z`)).join('') + P('M8 232L292 232' + BOT)
        + D('M30 40h40M200 30h50M150 96h60M20 150h44M230 150h40M100 210h50M240 266h30M30 262h36')
        + [[-78, -38], [78, -38], [-78, 38], [78, 38]].map(([x, y]) => P(G(rrD(x - 9, y - 7, 18, 14, 5)))).join('')
        + P(G(rrD(-112, -33, 224, 66, 33)))
        + [-100, -88, 88, 100].map(x => dot(...g(x, -8), 2) + dot(...g(x, 8), 2)).join('')
        + st(...g(-60, 0), 16) + P(heartD(...g(-22, 1), 1.5)) + C(...g(18, 0), 14) + D(`M${xy(g(12, 3))}Q${xy(g(18, 8))} ${xy(g(24, 3))}`) + dot(...g(13, -4), 2) + dot(...g(23, -4), 2)
        + flower(...g(58, 0), 10)
        + `<path d="M34 110L62 146L80 150L98 146L126 110" stroke="${INK}" stroke-width="4" stroke-linejoin="round" fill="none"/>` + P(rrD(70, 143, 20, 13, 3))
        + P('M26 106Q24 44 80 44Q136 44 134 106Z') + P(rrD(20, 100, 120, 14, 7)) + st(80, 76, 14)
        + `<path d="M50 72l6 -12M104 60l6 12M64 54l4 -6M92 48l4 6" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
        + kp(198, 246, -10) + kp(256, 238, 12)
        + P(xd(rrD(-30, -11, 60, 22, 9), X(234, 46, 14))) + P(xd(rrD(30, -7, 12, 14, 3), X(234, 46, 14)));
    };

    // ---------- 11. triceratops
    const trike = () => {
      const t = d => T(d, 136, 204), p = (x, y) => [136 + x, 204 + y];
      return frame + C(46, 46, 20) + rays(46, 46, 27, 35, 8) + cloud(196, 60, .4) + cloud(226, 36, .34)
        + P('M188 176L226 92L252 92L292 168L292 176Z') + P('M226 92Q239 82 252 92L249 106Q242 98 236 108Q231 100 226 92Z')
        + P('M8 170Q80 140 150 166Q220 186 292 160L292 214L8 214Z') + P(ground(214))
        + fern(22, 252, 84, -14) + fern(46, 258, 64, 14, 13) + fern(272, 286, 56, -16, 14) + fern(250, 290, 40, -36, 12)
        + E(70, 276, 15, 8) + E(206, 280, 12, 7)
        + [[-30, 14, -32, 46], [28, 14, 30, 46]].map(([a, b, c, e]) => P(tube([p(a, b), p(c, e)], 22))).join('')
        + P(t('M-56 -24Q-30 -58 6 -56Q52 -54 66 -16Q72 18 46 28L-40 28Q-54 28 -60 18L-104 24Q-90 4 -56 -24Z'))
        + [[-20, 16, -22, 48], [40, 16, 42, 48]].map(([a, b, c, e]) => P(tube([p(a, b), p(c, e)], 22)) + D(t(`M${c - 5} ${e + 10}L${c - 5} ${e + 5}M${c} ${e + 11}L${c} ${e + 6}M${c + 5} ${e + 10}L${c + 5} ${e + 5}`))).join('')
        + E(...p(-14, -36), 10, 6.5) + E(...p(16, -40), 9, 6) + E(...p(-38, -14), 8, 6)
        + P(blobD(...p(78, -30), 36, 11, .6)) + D('M194 152l2 3M214 142l0 4M234 150l-2 3')
        + P(t('M60 -30Q62 -56 92 -54Q118 -50 124 -26Q128 -6 114 2Q98 10 80 6Q60 2 60 -30Z'))
        + P(t('M116 -26Q136 -28 136 -10Q128 2 116 -2Z'))
        + P(t('M78 -52Q80 -80 96 -88Q94 -68 92 -52Z')) + P(t('M94 -50Q104 -74 118 -78Q112 -60 106 -46Z')) + P(t('M112 -28Q116 -44 126 -46Q124 -36 121 -26Z'))
        + eye(...p(94, -28), 6) + E(...p(92, -10), 7, 5) + D(t('M104 -4Q112 0 118 -4'));
    };

    // ---------- 12. kid ninja on a rooftop
    const ninja = () => {
      const g = X(150, 136, 0, 1.15), G = d => xd(d, g), tb = (p, w) => P(tube(p.map(q => g(...q)), w * 1.15));
      const xl = y => f(70 - 54 * (y - 198) / 50), band = (a, b) => P(`M${xl(a)} ${a}L${300 - xl(a)} ${a}L${300 - xl(b)} ${b}L${xl(b)} ${b}Z`);
      let sc = ''; for (let r = 0; r < 3; r++) for (let x = 64 - r * 16; x < 240 + r * 16; x += 22) sc += `M${x} ${205 + r * 16}q5 5 10 0`;
      return frame + [[30, 30], [92, 24], [270, 110], [40, 170], [252, 176]].map(([x, y]) => dot(x, y, 2)).join('')
        + C(176, 94, 62) + C(214, 70, 10) + C(206, 128, 8) + st(40, 52, 11) + st(266, 44, 11) + st(28, 122, 10)
        + cloud(196, 160, .5) + cloud(14, 96, .45)
        + band(198, 214) + band(214, 230) + P(`M${xl(230)} 230L${300 - xl(230)} 230Q276 242 292 236L286 250L14 250L8 236Q24 242 ${xl(230)} 230Z`) + D(sc)
        + P('M30 250L270 250L270 292L30 292Z') + C(150, 272, 12) + P(rrD(60, 186, 180, 12, 6)) + C(60, 192, 9) + C(240, 192, 9)
        + tb([[3, 0], [2, 40]], 12) + tb([[-4, 0], [-20, 10], [-10, 24]], 12) + E(...g(4, 44), 11, 6) + E(...g(-6, 27), 10, 6, 30)
        + tb([[-10, -28], [-30, -30], [-46, -38]], 10) + tb([[10, -28], [30, -30], [46, -24]], 10)
        + C(...g(-48, -39), 7) + C(...g(48, -23), 7)
        + P(G(rrD(-13, -34, 26, 38, 10))) + P(G('M-14 -6L14 -6L14 5L-14 5Z'))
        + tb([[12, -58], [28, -64], [40, -56]], 7.5) + tb([[12, -56], [26, -54], [36, -44]], 7.5)
        + head(...g(0, -48), 17, P(G('M-15 -53Q-14 -66 0 -66Q14 -66 15 -53Z')) + P(G('M-15.5 -54Q0 -58 15.5 -54L15 -47Q0 -51 -15 -47Z')));
    };

    // ---------- 13. cherry blossom branch with birds
    const blossom = () => {
      const bird = (x, y, m) => { const t = d => T(d, x, y, 1, m); return P(t('M-16 -2Q-38 -16 -40 -2Q-38 10 -16 8Z')) + E(x, y, 22, 18) + E(x + 7 * m, y + 7, 12, 9) + P(t('M-14 -6Q4 -14 10 2Q2 14 -16 6Z')) + `<path d="${t('M20 -6L30 -2L20 3Z')}" fill="${INK}"/>` + eye(x + 11 * m, y - 5, 3.4) + D(t('M-4 18L-4 24M4 18L4 24')); };
      return frame + C(214, 86, 48) + P('M8 244Q70 224 130 240Q200 256 292 232' + BOT)
        + P(tube([[10, 96], [50, 106], [90, 122], [130, 134], [170, 144], [210, 154], [250, 164], [290, 166]], 20, 10))
        + P(tube([[124, 132], [134, 108], [146, 86], [160, 66]], 13, 9)) + P(tube([[206, 154], [218, 178], [232, 202]], 12, 9))
        + P(leafD(172, 92, -40)) + P(leafD(88, 146, 150))
        + bird(80, 96, 1) + bird(194, 126, -1)
        + [[160, 60], [136, 104], [40, 130], [114, 162], [176, 182], [240, 138], [236, 210], [276, 194]].map(([x, y]) => flower(x, y, 11)).join('')
        + E(30, 210, 6.5, 5, 30) + E(140, 232, 6.5, 5, -20) + E(272, 92, 6.5, 5, 40);
    };

    // ---------- 14. Christmas tree
    const xmas = () => {
      const tier = (ay, by, hw, n) => { let d = `M150 ${ay}L${150 - hw} ${by}`; const w = 2 * hw / n; for (let i = 0; i < n; i++) d += `Q${f(150 - hw + w * (i + .5))} ${by + 12} ${f(150 - hw + w * (i + 1))} ${by}`; return P(d + 'Z'); };
      const bb = (x, y) => C(x, y, 9.5) + D(`M${x - 5} ${y - 2}Q${x - 4} ${y - 6} ${x} ${y - 6}`);
      return frame + P('M8 240L292 240' + BOT)
        + P(rrD(20, 22, 70, 80, 6)) + [[28, 30], [58, 30], [28, 66], [58, 66]].map(([x, y]) => P(rrD(x, y, 24, 30, 3))).join('')
        + `<path ${R} fill-rule="evenodd" d="${blobD(246, 62, 26, 12, .6)}M259 62A13 13 0 1 0 233 62A13 13 0 1 0 259 62Z"/>` + P('M246 86Q234 76 230 90Q238 94 246 86Q254 94 262 90Q258 76 246 86Z')
        + tier(116, 214, 92, 6) + tier(74, 160, 68, 5) + tier(40, 106, 44, 4)
        + P(tube(qpts([118, 128], [150, 150], [182, 128]), 9)) + P(tube(qpts([102, 180], [150, 202], [198, 180]), 9))
        + bb(118, 128) + bb(182, 128) + bb(102, 180) + bb(198, 180) + bb(150, 90) + bb(150, 120)
        + `<path ${R} d="${star(150, 36, 21, 10)}"/>`
        + P(rrD(114, 218, 72, 12, 5)) + P('M120 230L180 230L172 262L128 262Z')
        + present(30, 222, 58, 46) + present(206, 232, 54, 36) + present(84, 252, 36, 30);
    };

    // ---------- 15. unicorn asleep on the moon
    const uniMoon = () => frame + [[38, 40, 11], [116, 26, 10], [190, 34, 11], [270, 34, 10], [30, 156, 10]].map(([x, y, r]) => st(x, y, r)).join('')
      + D('M70 8L70 50M234 8L234 76') + st(70, 62, 12) + st(234, 88, 12) + sparkle(150, 60, 6) + sparkle(270, 150, 6) + sparkle(104, 82, 4)
      + P('M40 110A113.2 113.2 0 1 0 260 110A115.6 115.6 0 0 1 40 110Z')
      + D('M120 212Q128 220 136 212M164 212Q172 220 180 212') + smile(150, 228, 9, 6) + E(110, 226, 8, 5.5) + E(190, 226, 8, 5.5)
      + cloud(16, 284, .85) + cloud(196, 284, .85) + st(272, 196, 10)
      + P('M194 156Q228 138 240 160Q248 182 230 200Q232 178 216 174Q206 172 196 174Z')
      + E(152, 166, 50, 24) + E(186, 168, 20, 16)
      + P(rrD(106, 176, 40, 13, 6.5)) + P(rrD(146, 180, 36, 13, 6.5)) + C(112, 182.5, 6.5) + C(152, 186.5, 6.5)
      + P('M104 138Q114 118 132 126Q146 118 158 132Q172 128 178 144Q162 142 148 146Q132 142 116 150Z')
      + P('M68 168Q62 148 78 140Q94 132 110 140Q122 150 118 164Q112 178 92 178Q72 178 68 168Z')
      + P('M106 140L114 120L121 140Z') + P('M96 141Q88 126 102 122Q112 128 108 142Z') + P('M80 143L66 108L97 136Z')
      + D('M84 156Q91 163 98 156M87 160l-2 4M92 162l0 4M97 160l2 4') + E(84, 168, 6, 4.5) + dot(71, 166, 1.8);

    // ---------- 16. quokka
    const quokka = () => frame + rays(250, 50, 27, 36, 8) + C(250, 50, 20) + P(ground(226))
      + P(blobD(44, 210, 34, 9, .6)) + P(blobD(258, 204, 36, 9, .6))
      + P(leafD(20, 178, -60)) + P(leafD(66, 182, -120)) + P(leafD(240, 172, -70)) + P(leafD(282, 180, -110))
      + C(34, 200, 7.5) + C(48, 196, 7.5) + C(41, 210, 7.5) + C(254, 194, 7.5) + C(268, 192, 7.5) + C(261, 205, 7.5)
      + D('M64 248l-3 -9M69 248l2 -10M226 252l-3 -9M231 252l2 -10')
      + P(tube([[180, 236], [212, 254], [244, 252]], 12, 9)) + E(126, 262, 22, 8.5) + E(174, 262, 22, 8.5)
      + P('M150 140Q182 142 192 196Q204 254 150 258Q96 254 108 196Q118 142 150 140Z') + E(150 , 214, 26, 36)
      + P(tube([[122, 168], [126, 190], [140, 196]], 12)) + P(tube([[178, 168], [174, 190], [160, 196]], 12))
      + C(150, 194, 9.5) + P('M150 186Q143 172 157 165Q165 178 150 186Z')
      + E(114, 84, 12, 15, -28) + E(114, 85, 6, 8.5, -28) + E(186, 84, 12, 15, 28) + E(186, 85, 6, 8.5, 28)
      + P('M150 78Q186 78 192 108Q196 132 176 146Q164 154 150 154Q136 154 124 146Q104 132 108 108Q114 78 150 78Z')
      + E(150, 136, 19, 13) + E(122, 128, 7, 5) + E(178, 128, 7, 5)
      + eye(134, 110, 6) + eye(166, 110, 6) + P('M143 124Q150 120 157 124Q156 131 150 132Q144 131 143 124Z') + D('M150 132L150 138M130 134Q150 156 170 134')
      + D('M144 82Q142 74 148 70M152 81Q154 73 160 72');

    // ---------- 17. camper van
    const camper = () => frame + C(252, 46, 20) + rays(252, 46, 27, 36, 8) + cloud(26, 66, .5)
      + P('M8 160Q90 126 170 152Q230 170 292 146L292 200L8 200Z') + P(ground(214))
      + P(rrD(244, 176, 14, 42, 3)) + P('M251 64L276 106L264 106L284 140L270 140L290 176L212 176L232 140L218 140L238 106L226 106Z')
      + P('M58 108L176 108L170 92Q118 80 64 92Z')
      + P(rrD(30, 106, 170, 100, 26)) + P('M30 158L200 158L200 182Q200 206 176 206L54 206Q30 206 30 182Z')
      + P(rrD(38, 116, 30, 32, 8)) + [80, 122, 164].map(x => P(rrD(x, 116, 30, 28, 5))).join('')
      + bunt(172, 100, 244, 112, 10, [[.08, .36], [.4, .68], [.72, .98]], 24)
      + C(40, 176, 6.5) + P(rrD(22, 188, 14, 12, 4)) + D('M120 172h12')
      + [70, 168].map(x => C(x, 206, 19) + C(x, 206, 8)).join('')
      + P(rrD(196, 212, 86, 10, 3)) + P('M208 222L218 222L206 262L196 262Z') + P('M260 222L270 222L282 262L272 262Z') + P(rrD(186, 240, 104, 11, 4))
      + P(rrD(222, 196, 30, 16, 4)) + D('M226 196Q237 182 248 196')
      + P(tube([[96, 268], [134, 254]], 10)) + P(tube([[96, 254], [134, 268]], 10)) + P(fanD(115, 254, 30, 3, .35, .5));

    // ---------- 18. waffles
    const waffles = () => {
      const FL = [60, 172], FR = [240, 172], BL = [88, 110], BR = [212, 110], L2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      const W = (u, v) => L2(L2(FL, FR, u), L2(BL, BR, u), v); let pk = '';
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== 1 || j !== 1) { const a = i / 3 + .05, b = (i + 1) / 3 - .05, c = j / 3 + .07, d = (j + 1) / 3 - .07; pk += P(`M${xy(W(a, c))}L${xy(W(b, c))}L${xy(W(b, d))}L${xy(W(a, d))}Z`); }
      return frame + P('M8 196L292 196' + BOT) + P(heartD(36, 60, 1.6)) + P(heartD(262, 72, 1.4)) + sparkle(46, 130, 6) + sparkle(256, 140, 6)
        + E(150, 234, 126, 32) + E(150, 230, 100, 22)
        + P(rrD(52, 208, 196, 18, 7)) + P(rrD(56, 190, 188, 18, 7)) + P(rrD(60, 172, 180, 18, 7))
        + D([72, 110, 150, 190, 228].map(x => `M${x} 172L${x} 179M${x - 4} 190L${x - 4} 197M${x - 2} 208L${x - 2} 215`).join(''))
        + P('M60 174L240 174L212 110L88 110Z') + pk
        + P('M116 142Q114 128 132 128Q142 124 152 127Q164 124 172 128Q188 128 186 142Q188 154 180 158L181 196Q181 204 176 204Q171 204 172 196L170 162Q160 166 150 164Q140 166 130 162L128 188Q128 195 123 195Q118 195 119 188L119 158Q112 152 116 142Z')
        + P('M139 134L161 134L165 142L135 142Z') + P(rrD(135, 142, 30, 8, 2))
        + [[44, 238], [256, 236]].map(([x, y]) => P(T('M0 -10Q14 -12 14 2Q12 16 0 22Q-12 16 -14 2Q-14 -12 0 -10Z', x, y)) + P(fanD(x, y - 9, 11, 3, .7, .5)) + dot(x - 5, y + 2, 1.6) + dot(x + 5, y + 4, 1.6) + dot(x, y + 11, 1.6)).join('')
        + C(78, 256, 8.5) + C(96, 262, 8.5) + C(214, 260, 8.5) + C(232, 254, 8.5);
    };

    // ---------- 19. sea lion and ball
    const seaLion = () => {
      let wd = ''; for (let i = 0; i < 6; i++) { const a0 = i * Math.PI / 3 - .3, a1 = a0 + Math.PI / 3, p = a => xy([196 + 25 * Math.cos(a), 46 + 25 * Math.sin(a)]); wd += P(`M196 46L${p(a0)}A25 25 0 0 1 ${p(a1)}Z`); }
      return frame + C(258, 112, 18) + cloud(18, 64, .5) + cloud(240, 56, .38)
        + P('M8 172L292 172' + BOT)
        + P('M8 206Q24 194 40 204Q56 194 72 204L72 220L8 220Z') + P('M228 204Q244 194 260 204Q276 194 292 204L292 220L228 220Z')
        + P(T('M0 0Q14 -12 30 -4L40 -12L38 6L30 2Q14 10 0 0Z', 238, 160)) + eye(244, 158, 2.4) + drop(228, 178, -30, .6) + drop(282, 174, 30, .6)
        + P(T('M0 0Q12 -12 24 -2Q36 -12 48 0Q36 -4 24 8Q12 -4 0 0Z', 30, 110, .8)) + P('M240 246Q256 236 272 246Q282 238 292 242L292 258L240 258Z')
        + P('M62 292Q54 222 100 206Q150 190 200 206Q246 222 238 292Z') + D('M120 240l10 10M190 236l-8 12') + st(208, 252, 13) + E(96, 262, 9, 6) + P('M146 282Q142 262 160 260Q178 262 174 282Q160 288 146 282Z') + D('M160 282L160 266M153 282L150 268M167 282L170 268')
        + P('M86 210Q62 198 52 214Q70 214 74 226Q84 220 92 216Z')
        + P('M92 216Q86 160 120 124Q132 110 140 100L168 108Q172 136 170 160Q168 196 158 216Z')
        + P('M150 168Q178 174 192 196Q170 202 148 188Z')
        + E(156, 94, 23, 19, -20) + E(176, 80, 13, 9.5, -30) + dot(186, 73, 3.5) + eye(154, 88, 4.6) + E(160, 104, 6, 4.4, -20)
        + D('M172 88Q178 92 184 86M178 76l8 -2M180 84l8 1') + wd + C(196, 46, 6.5) + D('M222 24q6 4 8 10M166 30q4 -6 10 -8');
    };

    // ---------- 20. pop singer on stage
    const singer = () => {
      const g = X(150, 152, 0, 1.25), G = d => xd(d, g), tb = (p, w) => P(tube(p.map(q => g(...q)), w * 1.25));
      const note = (x, y) => E(x, y, 7.5, 5.5, -20) + D(`M${x + 6} ${y - 2}L${x + 6} ${y - 24}Q${x + 12} ${y - 18} ${x + 16} ${y - 14}`);
      let val = 'M8 8L292 8L292 30'; for (let x = 292; x > 8; x -= 35.5) val += `Q${f(x - 17.75)} 48 ${f(x - 35.5)} 30`;
      return frame + P('M126 30L174 30L236 240L64 240Z')
        + P('M8 20L66 20Q52 90 64 150Q40 160 34 240L8 240Z') + P(T('M8 20L66 20Q52 90 64 150Q40 160 34 240L8 240Z', 300, 0, 1, -1))
        + P(val + 'L8 30Z') + st(94, 70, 12) + st(210, 64, 11) + st(236, 140, 10) + note(84, 120) + note(222, 104) + note(96, 196)
        + P('M8 236L292 236L292 254L8 254Z') + P('M8 254L292 254' + BOT) + [40, 80, 120, 160, 200, 240].map(x => dot(x + 10, 270, 3)).join('')
        + tb([[-8, 40], [-10, 66]], 11) + tb([[8, 40], [12, 66]], 11) + P(G(rrD(-21, 64, 18, 10, 5))) + P(G(rrD(4, 64, 18, 10, 5)))
        + P(G('M-20 44L-13 14L13 14L20 44Q0 50 -20 44Z'))
        + tb([[-12, -8], [-26, -22], [-30, -42]], 8.5) + C(...g(-30, -45), 6.5)
        + P(G(rrD(-14, -14, 28, 32, 9)))
        + P(blobD(...g(0, -40), 23, 11, .62)) + C(...g(0, -37), 17.5) + st(...g(-14, -54), 9)
        + D(G('M-10 -40Q-6 -36 -2 -40M3 -40Q7 -36 11 -40')) + `<ellipse cx="${f(g(-1, -30)[0])}" cy="${f(g(-1, -30)[1])}" rx="3.4" ry="4.2" fill="${INK}"/>` + E(...g(-10, -34), 6, 4.5) + E(...g(11, -34), 6, 4.5)
        + tb([[12, -8], [24, 0], [21, -11]], 8.5) + P(tube([g(21, -12), g(14, -20)], 9)) + C(...g(11, -23), 8);
    };

    // ---------- 21. pixel gem
    const plus = (x, y, k) => P(`M${x - k} ${y - 3 * k}h${2 * k}v${2 * k}h${2 * k}v${2 * k}h${-2 * k}v${2 * k}h${-2 * k}v${-2 * k}h${-2 * k}v${-2 * k}h${2 * k}Z`);
    const pixGem = () => { let s = frame; ['0011100', '0111110', '1111111', '0111110', '0011100', '0001000'].forEach((r, j) => [...r].forEach((c, i) => { if (c > 0) s += P(rrD(45 + i * 30, 36 + j * 30, 30, 30, 0)); }));
      for (let i = 0; i < 5; i++) s += P(rrD(95 + i * 22, 250, 22, 16, 0));
      return s + plus(40, 60, 7) + plus(258, 50, 6) + plus(256, 220, 7) + plus(44, 204, 6) + plus(150, 236, 4) + dot(30, 130, 3) + dot(270, 140, 3) + dot(96, 238, 2.5) + dot(214, 236, 2.5); };

    // ---------- 22. carp streamers
    const koi = () => {
      const wv = x => 7 * Math.sin(x / 34);
      const strip = (px, py, a, b, top, bot) => { const T0 = [], B0 = []; for (let i = 0; i <= 8; i++) { const x = a + (b - a) * i / 8; T0.push([px + x, py + wv(x) + top(x)]); B0.unshift([px + x, py + wv(x) + bot(x)]); } return P('M' + T0.concat(B0).map(xy).join('L') + 'Z'); };
      const fish = (px, py, Lg, H) => {
        const e = .85 * Lg, h = x => H / 2 * (1 + .15 * Math.sin(Math.PI * x / e)) * (1 - .4 * (x / e) * (x / e)), q = (x, y) => xy([px + x, py + wv(x) + y]);
        let sc = ''; for (let x = .3 * Lg; x < .78 * Lg; x += 16) for (const k of [-.45, .05]) sc += `M${q(x, h(x) * k)}q6 7 12 0`;
        return strip(px, py, .2 * Lg, e, x => -h(x), h) + strip(px, py, 0, .2 * Lg, x => -h(x), h)
          + P(`M${q(e, -h(e))}L${q(Lg, -H * .6)}Q${q(Lg * .9, 0)} ${q(Lg, H * .6)}L${q(e, h(e))}Z`)
          + E(px, py + wv(0), H * .13, H / 2) + C(px + .1 * Lg, py + wv(.1 * Lg) - H * .1, H * .16) + dot(px + .1 * Lg + 1, py + wv(.1 * Lg) - H * .1, H * .07) + D(sc);
      };
      return frame + C(262, 40, 18) + cloud(226, 46, .42) + P(ground(252))
        + flower(122, 270, 9) + flower(250, 268, 9) + P(blobD(196, 256, 17, 7, .6)) + D('M90 262l-3 -9M95 262l2 -10M30 270l-3 -9M35 270l2 -10')
        + P(tube([[56, 28], [56, 284]], 10)) + C(56, 22, 9)
        + [-16, -5, 6].map(k => strip(62, 48, 0, 132, () => k, () => k + 11)).join('')
        + fish(62, 100, 170, 48) + fish(62, 158, 142, 42) + fish(62, 210, 114, 36);
    };

    // ---------- 23. tree house
    const treeHouse = () => frame + C(256, 42, 18) + rays(256, 42, 25, 33, 8) + cloud(14, 62, .5) + P(ground(250))
      + P(blobD(150, 96, 74, 14, .6)) + P(blobD(66, 138, 36, 9, .6)) + P(blobD(234, 134, 38, 9, .6))
      + P('M120 254Q128 200 126 140L174 140Q172 200 182 254Q150 260 120 254Z') + P(tube([[172, 158], [236, 152]], 13))
      + D('M224 158L226 202M240 156L240 200') + `<path ${R} fill-rule="evenodd" d="${ring(233, 214, 17, 8)}"/>`
      + P(rrD(90, 172, 120, 12, 4)) + P(rrD(104, 122, 92, 50, 3)) + P('M96 126L150 84L150 126Z') + P('M150 84L204 126L150 126Z')
      + `<path d="M150 84L150 58" ${L}/>` + P('M150 58L174 64L150 72Z')
      + P('M160 172L160 146Q160 134 172 134Q184 134 184 146L184 172Z') + dot(178, 154, 2.5)
      + P(rrD(114, 134, 34, 26, 4)) + P(rrD(119, 139, 11, 16, 2)) + P(rrD(132, 139, 11, 16, 2))
      + D('M108 184L102 254M136 184L134 254') + [196, 210, 224, 238].map(y => P(rrD(101 - (y - 184) * .07, y, 36, 9, 3))).join('')
      + flower(38, 266, 9) + flower(262, 270, 9) + P(blobD(214, 262, 16, 7, .6)) + P(leafD(54, 196, 70)) + P(leafD(252, 190, 110));

    // ---------- 24. meerkat family
    const meerkats = () => {
      const mk = (x, y, s, pk = 1) => { const t = d => T(d, x, y, s);
        return P(tube([[x + 8 * s, y - 6 * s], [x + 26 * s, y], [x + 40 * s, y - 10 * s]], 9 * s, 6 * s))
          + P(t('M0 -78Q20 -76 22 -40Q24 -6 14 0L-14 0Q-24 -6 -22 -40Q-20 -76 0 -78Z')) + E(x, y - 34 * s, 12 * s, 24 * s)
          + P(tube([[x - 15 * s, y - 62 * s], [x - 15 * s, y - 50 * s], [x - 6 * s, y - 45 * s]], 9 * s)) + P(tube([[x + 15 * s, y - 62 * s], [x + 15 * s, y - 50 * s], [x + 6 * s, y - 45 * s]], 9 * s))
          + P(t('M0 -110Q18 -110 18 -94Q16 -80 6 -76L0 -72L-6 -76Q-16 -80 -18 -94Q-18 -110 0 -110Z'))
          + D(t('M-17 -100Q-22 -98 -18 -92M17 -100Q22 -98 18 -92'))
          + E(x - 7 * s, y - 95 * s, 5.5 * s * pk, 4.6 * s * pk, 20) + E(x + 7 * s, y - 95 * s, 5.5 * s * pk, 4.6 * s * pk, -20)
          + eye(x - 7 * s, y - 95 * s, 2.6 * s) + eye(x + 7 * s, y - 95 * s, 2.6 * s) + dot(x, y - 77 * s, 2.6 * s) + D(t('M-4 -71Q0 -68 4 -71'));
      };
      return frame + C(240, 66, 28) + rays(240, 66, 35, 44, 10) + P('M8 186Q80 158 160 178Q230 194 292 168' + BOT)
        + P('M28 252L28 214Q28 206 35 206Q42 206 42 214L42 224L50 224L50 216Q50 211 54 211Q58 211 58 216L58 230Q58 234 54 234L42 234L42 252Z')
        + P('M20 292Q50 208 150 204Q250 208 280 292Z') + E(68, 270, 14, 8) + E(232, 272, 13, 7)
        + D('M262 208l-3 -9M267 208l2 -10M112 258l-3 -7M190 262l2 -7')
        + mk(116, 216, 1.22) + mk(178, 214, 1.1) + mk(226, 232, .86, 1.25);
    };

    // ---------- 25. kid magician
    const magician = () => {
      const g = X(132, 150, 0, 1.25), G = d => xd(d, g), tb = (p, w) => P(tube(p.map(q => g(...q)), w * 1.25));
      const dove = (x, y, s) => P(T('M-18 4Q-6 -8 12 -4Q18 -12 26 -8Q22 -2 24 2Q10 12 -18 4Z', x, y, s)) + P(T('M-10 -1Q-10 -20 4 -26Q12 -26 11 -18Q14 -10 8 -1Z', x, y, s)) + dot(x + 18 * s, y - 6 * s, 1.8);
      const spk = (x, y, r) => P(`M${x} ${y - r}Q${f(x + r * .3)} ${f(y - r * .3)} ${x + r} ${y}Q${f(x + r * .3)} ${f(y + r * .3)} ${x} ${y + r}Q${f(x - r * .3)} ${f(y + r * .3)} ${x - r} ${y}Q${f(x - r * .3)} ${f(y - r * .3)} ${x} ${y - r}Z`);
      return frame + [[30, 30], [120, 24], [270, 120], [24, 150], [200, 22]].map(([x, y]) => dot(x, y, 2)).join('') + E(150, 262, 124, 20)
        + spk(70, 52, 15) + spk(36, 104, 11) + spk(174, 36, 12)
        + P(rrD(190, 196, 94, 10, 4)) + P('M194 206L280 206L284 250Q272 258 260 250Q248 258 238 250Q226 258 214 250Q202 258 190 250Z')
        + P(rrD(216, 166, 40, 30, 3)) + E(236, 166, 28, 7) + E(236, 165, 18, 4.5)
        + dove(234, 126, 1.1) + dove(264, 74, .95) + D('M222 150q4 -8 10 -10M248 148q2 -8 -2 -14')
        + P(G('M-16 -16Q-40 20 -46 64Q0 74 46 64Q40 20 16 -16Z'))
        + tb([[-7, 30], [-8, 62]], 12) + tb([[7, 30], [8, 62]], 12) + P(G(rrD(-19, 60, 16, 9, 4))) + P(G(rrD(3, 60, 16, 9, 4)))
        + tb([[-13, -10], [-28, -22], [-33, -38]], 9) + tb([[13, -10], [28, -2], [40, -8]], 9)
        + P(G(rrD(-15, -16, 30, 48, 9))) + P(G('M-7 -16L7 -16L0 6Z')) + P(G('M0 -15L-10 -20L-10 -9ZM0 -15L10 -20L10 -9Z'))
        + P(tube([g(-35, -44), g(-44, -62)], 9)) + P(tube([g(-44, -62), g(-48, -70)], 9)) + C(...g(-33, -41), 7.5) + C(...g(41, -9), 7.5)
        + head(...g(0, -33), 17, P(G('M-14 -35Q-15 -46 -8 -48L8 -48Q15 -46 14 -35Q8 -42 0 -41Q-8 -42 -14 -35Z')))
        + P(G(rrD(-13, -78, 26, 28, 3))) + P(G('M-13 -58L13 -58L13 -50L-13 -50Z')) + P(G(rrD(-21, -52, 42, 7, 3.5)))
        + sparkle(...g(-52, -78), 6) + sparkle(...g(-38, -84), 4);
    };

    // ---------- 26. star mandala
    const starMandala = () => { const p = (r, t) => xy([150 + r * Math.cos(t), 150 + r * Math.sin(t)]); let s = frame + P(blobD(150, 150, 126, 18, .6)) + C(150, 150, 110);
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, b = a + Math.PI / 8; s += P(`M${p(46, a - .34)}L${p(106, a)}L${p(46, a + .34)}Z`) + st(150 + 84 * Math.cos(b), 150 + 84 * Math.sin(b), 13); }
      s += C(150, 150, 54) + P(star(150, 150, 48, 25, 8));
      for (let i = 0; i < 8; i++) { const b = i * Math.PI / 4 - Math.PI / 2 + Math.PI / 8; s += C(150 + 41 * Math.cos(b), 150 + 41 * Math.sin(b), 5.5); }
      return s + C(150, 150, 14) + [[30, 30], [270, 30], [30, 270], [270, 270]].map(([x, y]) => sparkle(x, y, 7)).join(''); };

    return [
      { id: 'a7-carousel', cat: 'princess',
        name: { en: 'Princess carousel', fr: 'Manège de princesse', es: 'Carrusel de princesa', de: 'Prinzessinnen-Karussell', zh: '公主旋转木马' },
        svg: carousel() },
      { id: 'a7-baby-hippo', cat: 'animals',
        name: { en: 'Splashy baby hippo', fr: 'Bébé hippo qui éclabousse', es: 'Bebé hipopótamo chapoteando', de: 'Planschendes Nilpferdbaby', zh: '戏水的小河马' },
        svg: hippo() },
      { id: 'a7-dune-buggy', cat: 'vehicles',
        name: { en: 'Dune buggy jump', fr: 'Buggy dans les dunes', es: 'Buggy saltando dunas', de: 'Strandbuggy-Sprung', zh: '沙丘越野车' },
        svg: buggy() },
      { id: 'a7-mermaid-seahorse', cat: 'princess',
        name: { en: 'Mermaid and seahorse', fr: 'Sirène et hippocampe', es: 'Sirena y caballito de mar', de: 'Meerjungfrau mit Seepferd', zh: '美人鱼骑海马' },
        svg: mermaid() },
      { id: 'a7-corgi', cat: 'animals',
        name: { en: 'Corgi catching a frisbee', fr: 'Corgi et frisbee', es: 'Corgi y su frisbi', de: 'Corgi mit Frisbee', zh: '柯基接飞盘' },
        svg: corgi() },
      { id: 'a7-jetpack', cat: 'space',
        name: { en: 'Jetpack flight', fr: 'Vol en jetpack', es: 'Vuelo con mochila cohete', de: 'Flug mit Raketenrucksack', zh: '背包火箭飞行' },
        svg: jetpack() },
      { id: 'a7-milkshake', cat: 'food',
        name: { en: 'Happy milkshake', fr: 'Milk-shake rigolo', es: 'Batido feliz', de: 'Fröhlicher Milchshake', zh: '开心奶昔' },
        svg: milkshake() },
      { id: 'a7-fairy-dandelion', cat: 'princess',
        name: { en: 'Dandelion fairy', fr: 'Fée du pissenlit', es: 'Hada del diente de león', de: 'Pusteblumen-Fee', zh: '蒲公英仙子' },
        svg: fairy() },
      { id: 'a7-surfer', cat: 'ocean',
        name: { en: 'Surfing the big wave', fr: 'Surf sur la vague', es: 'Surfeando la ola', de: 'Wellenreiten', zh: '冲浪大浪' },
        svg: surfer() },
      { id: 'a7-skateboard', cat: 'hobbies',
        name: { en: 'My skateboard kit', fr: 'Mon skate et ses protections', es: 'Mi equipo de skate', de: 'Mein Skateboard-Set', zh: '我的滑板装备' },
        svg: skate() },
      { id: 'a7-triceratops', cat: 'dinosaurs',
        name: { en: 'Happy triceratops', fr: 'Tricératops joyeux', es: 'Triceratops feliz', de: 'Fröhlicher Triceratops', zh: '快乐三角龙' },
        svg: trike() },
      { id: 'a7-ninja', cat: 'fantasy',
        name: { en: 'Rooftop ninja', fr: 'Ninja sur le toit', es: 'Ninja en el tejado', de: 'Ninja auf dem Dach', zh: '屋顶小忍者' },
        svg: ninja() },
      { id: 'a7-cherry-blossom', cat: 'nature',
        name: { en: 'Cherry blossom birds', fr: 'Oiseaux et cerisier', es: 'Pájaros y cerezo', de: 'Vögel im Kirschbaum', zh: '樱花枝上的小鸟' },
        svg: blossom() },
      { id: 'a7-christmas-tree', cat: 'holidays',
        name: { en: 'Christmas tree', fr: 'Sapin de Noël', es: 'Árbol de Navidad', de: 'Weihnachtsbaum', zh: '圣诞树' },
        svg: xmas() },
      { id: 'a7-unicorn-moon', cat: 'princess',
        name: { en: 'Sleepy moon unicorn', fr: 'Licorne endormie sur la lune', es: 'Unicornio dormido en la luna', de: 'Einhorn schläft auf dem Mond', zh: '月亮上睡觉的独角兽' },
        svg: uniMoon() },
      { id: 'a7-quokka', cat: 'animals',
        name: { en: 'Smiling quokka', fr: 'Quokka souriant', es: 'Quokka sonriente', de: 'Lächelndes Quokka', zh: '微笑的短尾矮袋鼠' },
        svg: quokka() },
      { id: 'a7-camper-van', cat: 'vehicles',
        name: { en: 'Camper van trip', fr: 'Van au camping', es: 'Furgoneta de camping', de: 'Campingbus-Ausflug', zh: '露营车之旅' },
        svg: camper() },
      { id: 'a7-waffles', cat: 'food',
        name: { en: 'Waffle stack', fr: 'Pile de gaufres', es: 'Torre de gofres', de: 'Waffelturm', zh: '华夫饼塔' },
        svg: waffles() },
      { id: 'a7-sea-lion', cat: 'ocean',
        name: { en: 'Sea lion and ball', fr: 'Otarie et son ballon', es: 'León marino y pelota', de: 'Seelöwe mit Ball', zh: '顶球的海狮' },
        svg: seaLion() },
      { id: 'a7-microphone', cat: 'hobbies',
        name: { en: 'Little pop star', fr: 'Petite pop star', es: 'Pequeña estrella pop', de: 'Kleiner Popstar', zh: '小小歌星' },
        svg: singer() },
      { id: 'a7-pixel-gem', cat: 'patterns',
        name: { en: 'Pixel gem', fr: 'Gemme en pixels', es: 'Gema de píxeles', de: 'Pixel-Edelstein', zh: '像素宝石' },
        svg: pixGem() },
      { id: 'a7-carp-kites', cat: 'holidays',
        name: { en: 'Carp streamers', fr: 'Carpes volantes', es: 'Banderines de carpa', de: 'Karpfen-Fahnen', zh: '鲤鱼旗' },
        svg: koi() },
      { id: 'a7-tree-house', cat: 'nature',
        name: { en: 'Tree house', fr: 'Cabane dans l\'arbre', es: 'Casa del árbol', de: 'Baumhaus', zh: '树屋' },
        svg: treeHouse() },
      { id: 'a7-meerkats', cat: 'animals',
        name: { en: 'Meerkat family', fr: 'Famille de suricates', es: 'Familia de suricatas', de: 'Erdmännchen-Familie', zh: '狐獴一家' },
        svg: meerkats() },
      { id: 'a7-magician', cat: 'fantasy',
        name: { en: 'Little magician', fr: 'Petit magicien', es: 'Pequeño mago', de: 'Kleiner Zauberer', zh: '小魔术师' },
        svg: magician() },
      { id: 'a7-star-mandala', cat: 'patterns',
        name: { en: 'Star mandala', fr: 'Mandala étoilé', es: 'Mandala de estrellas', de: 'Sternen-Mandala', zh: '星星曼陀罗' },
        svg: starMandala() },
    ];
  });

  /* IntelloKids colouring – age 7, part B */
  PART(function () {
    const INK = '#1F3A44';
    const SW = 3;
    const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
    const R = `data-r fill="#fff" ${L}`;
    const N = v => Math.round(v * 10) / 10;
    const pt = (x, y) => N(x) + ' ' + N(y);
    const rot = (a, x, y) => a ? ` transform="rotate(${N(a)} ${N(x)} ${N(y)})"` : '';
    // regions
    const P = (d, ex = "") => `<path ${R} d="${d}"${ex}/>`;
    const C = (x, y, r) => `<circle ${R} cx="${N(x)}" cy="${N(y)}" r="${N(r)}"/>`;
    const E = (x, y, rx, ry, a = 0) => `<ellipse ${R} cx="${N(x)}" cy="${N(y)}" rx="${N(rx)}" ry="${N(ry)}"${rot(a, x, y)}/>`;
    const B = (x, y, w, h, r = 0) => `<rect ${R} x="${N(x)}" y="${N(y)}" width="${N(w)}" height="${N(h)}"${r ? ` rx="${N(r)}"` : ''}/>`;
    const G = p => `<polygon ${R} points="${p}"/>`;
    // round-ended limb along a polyline [x1,y1,x2,y2,(x3,y3)], width w
    const limb = (...a) => {
      const w = a.pop(), h = w / 2, p = []; for (let i = 0; i < a.length; i += 2) p.push([a[i], a[i + 1]]);
      const n = p.slice(1).map((q, i) => { const dx = q[0] - p[i][0], dy = q[1] - p[i][1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; });
      const off = s => p.map((q, i) => { let v = n[Math.min(i, n.length - 1)]; if (i && i < p.length - 1) { const a2 = n[i - 1], b2 = n[i]; v = [a2[0] + b2[0], a2[1] + b2[1]]; const l = Math.hypot(v[0], v[1]) || 1, c = Math.max(0.65, (v[0] * a2[0] + v[1] * a2[1]) / l); v = [v[0] / l / c, v[1] / l / c]; } return pt(q[0] + s * h * v[0], q[1] + s * h * v[1]); });
      const A = off(1), Z = off(-1).reverse(), r = N(h);
      return P(`M${A.join('L')}A${r} ${r} 0 0 0 ${Z.join('L')}A${r} ${r} 0 0 0 ${A[0]}Z`);
    };
    // decorations
    const D = (d, w = 2) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
    const dot = (x, y, r = 2.5) => `<circle cx="${N(x)}" cy="${N(y)}" r="${N(r)}" fill="${INK}"/>`;
    const eye = (x, y, r = 4) => dot(x, y, r) + `<circle cx="${N(x + r * 0.35)}" cy="${N(y - r * 0.4)}" r="${N(r * 0.4)}" fill="#fff"/>`;
    const smile = (x, y, w) => D(`M${pt(x - w, y)}q${N(w)} ${N(w * 0.9)} ${N(2 * w)} 0`);
    const shut = (x, y, w) => D(`M${pt(x - w, y)}q${N(w)} ${N(-w)} ${N(2 * w)} 0`);
    const spark = (x, y, s) => `<path d="M${pt(x, y - s)}Q${pt(x, y)} ${pt(x + s, y)}Q${pt(x, y)} ${pt(x, y + s)}Q${pt(x, y)} ${pt(x - s, y)}Q${pt(x, y)} ${pt(x, y - s)}Z" fill="${INK}"/>`;
    const swirl = (x, y, k) => D(`M${pt(x, y)}a${k} ${k} 0 0 1 ${N(2 * k)} 0a${N(2 * k)} ${N(2 * k)} 0 0 1 ${N(-4 * k)} 0a${N(3 * k)} ${N(3 * k)} 0 0 1 ${N(6 * k)} 0`);
    // path data
    const starD = (cx, cy, ro, ri, n = 5, a0 = -90) => { let s = ''; for (let i = 0; i < 2 * n; i++) { const a = (a0 + 180 * i / n) * Math.PI / 180, r = i % 2 ? ri : ro; s += (i ? 'L' : 'M') + pt(cx + r * Math.cos(a), cy + r * Math.sin(a)); } return s + 'Z'; };
    const heartD = (cx, cy, s) => `M${pt(cx, cy + s)}C${pt(cx - 1.6 * s, cy - 0.1 * s)} ${pt(cx - 0.9 * s, cy - 1.3 * s)} ${pt(cx, cy - 0.45 * s)}C${pt(cx + 0.9 * s, cy - 1.3 * s)} ${pt(cx + 1.6 * s, cy - 0.1 * s)} ${pt(cx, cy + s)}Z`;
    const cloudD = (x, y, s) => `M${pt(x, y)}q${N(-4 * s)} ${N(-26 * s)} ${N(22 * s)} ${N(-28 * s)}q${N(6 * s)} ${N(-22 * s)} ${N(32 * s)} ${N(-16 * s)}q${N(22 * s)} ${N(-12 * s)} ${N(34 * s)} ${N(12 * s)}q${N(22 * s)} ${N(2 * s)} ${N(18 * s)} ${N(32 * s)}z`;
    // bumpy ellipse (curly hair, bushes, lettuce, flowers)
    const puffD = (cx, cy, rx, ry, n, k = 1.18, a0 = 0) => { let s = ''; for (let i = 0; i <= n; i++) { const a = (a0 + 360 * i / n) * Math.PI / 180, m = (a0 + 360 * (i - 0.5) / n) * Math.PI / 180, p = pt(cx + rx * Math.cos(a), cy + ry * Math.sin(a)); s += i ? `Q${pt(cx + rx * k * Math.cos(m), cy + ry * k * Math.sin(m))} ${p}` : 'M' + p; } return s + 'Z'; };
    // scallops from (x1,y1) to (x2,y2), bumps of depth d (sideways of travel)
    const scal = (x1, y1, x2, y2, n, d) => { let s = ''; const dx = (x2 - x1) / n, dy = (y2 - y1) / n, l = Math.hypot(dx, dy); for (let i = 0; i < n; i++) s += `Q${pt(x1 + dx * (i + 0.5) - dy / l * 2 * d, y1 + dy * (i + 0.5) + dx / l * 2 * d)} ${pt(x1 + dx * (i + 1), y1 + dy * (i + 1))}`; return s; };
    // pointed leaf from base (x,y), length l, half-width w, angle a
    const leafD = (x, y, l, w, a) => { const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), Q = (u, v) => pt(x + u * c - v * s, y + u * s + v * c); return `M${Q(0, 0)}Q${Q(l * 0.45, -2 * w)} ${Q(l, 0)}Q${Q(l * 0.45, 2 * w)} ${Q(0, 0)}Z`; };
    const leaf = (x, y, l, w, a, v = 1) => { const r = a * Math.PI / 180; return P(leafD(x, y, l, w, a)) + (v ? D(`M${pt(x + 3 * Math.cos(r), y + 3 * Math.sin(r))}L${pt(x + l * 0.72 * Math.cos(r), y + l * 0.72 * Math.sin(r))}`) : ''); };
    const rose = (x, y, r) => C(x, y, r) + swirl(x - r * 0.12, y, r * 0.2);
    // kid / princess head: { back (before body), mid (after body), front (face, hair, features) }
    const head = (cx, cy, r, o = {}) => {
      const hair = o.hair || 'short', rr = r + 2.5, ap = d => pt(cx + rr * Math.cos(d * Math.PI / 180), cy + rr * Math.sin(d * Math.PI / 180));
      let back = '', mid = '', f = C(cx, cy, r);
      if (hair === 'long') { const w = r + 5, y = cy + r + (o.len || 30); back = P(`M${pt(cx - w, cy + 2)}A${w} ${w} 0 0 1 ${pt(cx + w, cy + 2)}Q${pt(cx + w + 10, y - 20)} ${pt(cx + w + 4, y)}` + scal(cx + w + 4, y, cx - w - 4, y, 3, 4) + `Q${pt(cx - w - 10, y - 20)} ${pt(cx - w, cy + 2)}Z`); }
      if (hair === 'curly') back = P(puffD(cx, cy + r * 0.22, r * 1.5, r * 1.42, 11, 1.14, 8));
      if (hair === 'bun') back = C(cx, cy - r * 1.36, r * 0.6);
      if (hair === 'buns2') back = C(cx - r * 0.8, cy - r * 0.72, r * 0.44) + C(cx + r * 0.8, cy - r * 0.72, r * 0.44);
      if (hair === 'pony') back = P(`M${pt(cx + r * 0.5, cy - r * 0.85)}Q${pt(cx + r * 2, cy - r * 1.1)} ${pt(cx + r * 1.7, cy + r * 0.9)}Q${pt(cx + r * 1.45, cy + r * 0.1)} ${pt(cx + r * 0.85, cy - r * 0.1)}Z`);
      if (hair === 'braids') for (const sd of [-1, 1]) for (let i = 0; i < (o.bn || 3); i++) mid += E(cx + sd * r * 0.95, cy + r * 0.7 + i * r * 0.48, r * 0.3, r * 0.28);
      if (hair === 'curly') f += P(`M${ap(172)}A${rr} ${rr} 0 1 1 ${ap(8)}` + `Q${pt(cx + r * 0.95, cy - r * 0.2)} ${pt(cx + r * 0.62, cy - r * 0.38)}Q${pt(cx + r * 0.42, cy - r * 0.2)} ${pt(cx + r * 0.2, cy - r * 0.45)}Q${pt(cx, cy - r * 0.25)} ${pt(cx - r * 0.22, cy - r * 0.46)}Q${pt(cx - r * 0.45, cy - r * 0.22)} ${pt(cx - r * 0.64, cy - r * 0.38)}Q${pt(cx - r * 0.95, cy - r * 0.2)} ${ap(172)}Z`);
      else if (hair === 'short') f += P(`M${ap(172)}A${rr} ${rr} 0 1 1 ${ap(8)}L${pt(cx + r * 0.68, cy - r * 0.3)}L${pt(cx + r * 0.45, cy - r * 0.5)}L${pt(cx + r * 0.18, cy - r * 0.36)}L${pt(cx - r * 0.08, cy - r * 0.58)}L${pt(cx - r * 0.36, cy - r * 0.38)}L${pt(cx - r * 0.62, cy - r * 0.5)}L${pt(cx - r * 0.75, cy - r * 0.2)}Z`);
      else if (o.side) f += P(`M${ap(160)}A${rr} ${rr} 0 1 1 ${ap(20)}Q${pt(cx + r * 0.85, cy - r * 0.45)} ${pt(cx + r * 0.3, cy - r * 0.52)}Q${pt(cx - r * 0.3, cy - r * 0.56)} ${pt(cx - r * 0.62, cy - r * 0.15)}Q${pt(cx - r * 0.8, cy + r * 0.08)} ${ap(160)}Z`);
      else if (!o.nocap) f += P(`M${ap(160)}A${rr} ${rr} 0 1 1 ${ap(20)}Q${pt(cx + r * 0.85, cy - r * 0.5)} ${pt(cx, cy - r * 0.62)}Q${pt(cx - r * 0.85, cy - r * 0.5)} ${ap(160)}Z`) + D(`M${pt(cx, cy - r * 0.62)}Q${pt(cx + r * 0.05, cy - r * 0.85)} ${pt(cx + r * 0.2, cy - r * 0.98)}`);
      const er = Math.max(3, r * 0.15), cr = Math.max(6.5, r * 0.2), ey = cy + r * 0.08;
      if (!o.noeyes) f += eye(cx - r * 0.35, ey, er) + eye(cx + r * 0.35, ey, er);
      f += smile(cx, cy + r * 0.4, r * 0.18) + E(cx - r * 0.55, cy + r * 0.36, cr, cr * 0.8) + E(cx + r * 0.55, cy + r * 0.36, cr, cr * 0.8);
      if (o.tiara) { const ty = cy - r - 1, w = r * 0.5; f += G([[-w, 2], [-w * 1.15, -r * 0.38], [-w * 0.45, -r * 0.16], [0, -r * 0.52], [w * 0.45, -r * 0.16], [w * 1.15, -r * 0.38], [w, 2]].map(p => pt(cx + p[0], ty + p[1])).join(' ')); }
      return { back, mid, front: f };
    };
    const frame = (r = 18) => B(10, 10, 280, 280, r);
    const ground = top => P(`M10 ${top}V272Q10 290 28 290H272Q290 290 290 272V${top}Z`);

    const BR = (x, y, w, h, r, a, ox, oy) => B(x, y, w, h, r).replace('/>', rot(a, ox, oy) + '/>');
    // mirror helpers: path with absolute "x y" pairs, ellipse
    const tp = (d, ox, k) => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (m, x, y) => pt(ox + k * x, +y));
    const EM = (ox, k, x, y, rx, ry, a = 0) => E(ox + k * x, y, rx, ry, k * a);

    // ---------- pictures ----------
    const swing = () => {
      const h = head(150, 98, 27, { hair: 'long', tiara: 1, len: 36 });
      let s = P('M45 262V140A105 105 0 0 1 255 140V262Z') + P(heartD(72, 104, 9.5)) + P(heartD(228, 104, 9.5)) + spark(70, 150, 6) + spark(230, 150, 6) + spark(150, 46, 5) + spark(110, 70, 4) + spark(190, 70, 4);
      s += P('M25 284V140A125 125 0 0 1 275 140V284H255V140A105 105 0 0 0 45 140V284Z');
      for (let i = 0; i < 6; i++) { const a = (200 + i * 28) * Math.PI / 180, rr = 115 + (i % 2 ? 9 : -9); s += E(150 + rr * Math.cos(a), 140 + rr * Math.sin(a), 10, 5.5, 200 + i * 28 + 90); }
      for (let i = 0; i < 7; i++) { const a = (186 + i * 28) * Math.PI / 180; s += rose(150 + 115 * Math.cos(a), 140 + 115 * Math.sin(a), 12); }
      s += P('M10 266Q60 252 110 262T210 260T290 262V278Q290 290 278 290H22Q10 290 10 278Z') + D('M30 280l4 -8M44 282l2 -9M250 280l4 -8M264 282l2 -9');
      s += D('M96 50V212M204 50V212', 3) + B(82, 208, 136, 13, 6) + h.back + E(139, 272, 9, 6) + E(161, 272, 9, 6);
      s += P('M134 172Q112 210 92 248Q150 264 208 248Q188 210 166 172Z') + P('M92 248Q150 264 208 248L212 258' + scal(212, 258, 150, 268, 3, 4.5) + scal(150, 268, 88, 258, 3, 4.5) + 'Z');
      s += P('M130 132Q150 125 170 132L166 178Q150 183 134 178Z') + P('M134 168Q150 174 166 168L167 180Q150 186 133 180Z');
      s += limb(132, 144, 98, 128, 12.5) + limb(168, 144, 202, 128, 12.5) + C(133, 139, 11) + C(167, 139, 11) + C(96, 127, 7.5) + C(204, 127, 7.5);
      return s + h.front;
    };

    const guineaPigs = () => {
      let s = '';
      const yt = x => 46 + Math.abs(x - 150) * 62 / 108;
      for (let i = 0; i < 5; i++) { const a = 42 + i * 43.2, b = a + 43.2; s += G([[a, yt(a) - 4], ...(a < 150 && b > 150 ? [[150, 42]] : []), [b, yt(b) - 4], [b, 236], [a, 236]].map(p => pt(...p)).join(' ')); }
      s += P('M14 110L150 22L286 110H258L150 48L42 110Z') + C(150, 92, 18) + C(150, 92, 11) + D('M144 86q3 -3 7 -3');
      s += P('M10 238Q40 226 80 234T150 232T220 234T290 230V280Q290 290 280 290H20Q10 290 10 280Z') + D('M18 252l9 -5M100 284l10 -5M196 286l9 -6M276 250l8 -6');
      s += P(puffD(150, 204, 34, 32, 12, 1.12, -90)) + P(puffD(150, 198, 19, 18, 8, 1.16, -90)) + D('M150 232V212M150 198v-8M138 222l-8 -6M162 222l8 -6');
      for (const [ox, k] of [[72, 1], [228, -1]]) {
        s += P(tp('M-58 222Q-70 176 -30 164Q-5 150 20 162Q58 170 62 206Q62 226 40 230Q-10 240 -58 222Z', ox, k)) + P(tp('M-58 222Q-70 176 -30 164Q-16 190 -28 210Q-36 224 -48.4 225.3Z', ox, k));
        s += EM(ox, k, -2, 182, 14, 10, 10) + EM(ox, k, 10, 163, 11, 7.5, -25) + EM(ox, k, 30, 231, 10, 6) + EM(ox, k, -38, 226, 10, 6) + EM(ox, k, 46, 212, 6.5, 5);
        s += eye(ox + k * 37, 189, 5.5) + `<ellipse cx="${ox + k * 59}" cy="201" rx="3.6" ry="3" fill="${INK}"/>` + D(tp('M59 205Q59 210 53 210M-6 228L-4 222', ox, k));
      }
      s += P('M116 259Q106 271 116 283L192 272Z') + leaf(112, 268, 28, 6, 205, 0) + leaf(112, 272, 26, 6, 160, 0) + D('M136 266l5 3M152 278l5 -3M166 270l4 2');
      s += C(42, 266, 17) + C(42, 266, 10.5);
      for (let i = 0; i < 6; i++) s += dot(42 + 5 * Math.cos(i * 1.05), 266 + 5 * Math.sin(i * 1.05), 1.3);
      s += P(leafD(214, 270, 72, 12, -8));
      for (let i = 0; i < 3; i++) s += C(232 + i * 15, 267.5 - i * 2.1, 7);
      return s;
    };

    const telescope = () => {
      let s = frame() + P('M268 26A28 28 0 1 0 268 74A28 28 0 0 1 268 26Z') + D('M236 46q4 4 8 0') + smile(242, 58, 4) + E(234, 58, 6.5, 5);
      s += P(starD(52, 36, 17, 9)) + P(starD(120, 26, 13, 7)) + P(starD(180, 42, 13, 7)) + P(starD(30, 106, 13, 7)) + P(starD(96, 152, 12.5, 6.5)) + P(starD(272, 114, 12.5, 6.5));
      s += dot(88, 60, 2) + dot(24, 64, 2) + dot(150, 18, 2) + dot(250, 148, 2) + dot(60, 124, 2) + dot(276, 168, 2) + spark(150, 70, 5) + spark(232, 92, 4) + spark(40, 168, 5);
      s += P('M10 214Q80 160 170 230V262H10Z') + P('M10 252Q90 226 150 214Q220 198 290 206V272Q290 290 272 290H28Q10 290 10 272Z');
      s += D('M150 110L110 236M150 110L150 244M150 110L182 238', 4) + D('M40 262l3 -9l3 9M84 252l3 -9l3 9M262 238l3 -9l3 9');
      s += B(197, 190, 14, 24, 5) + B(217, 190, 14, 24, 5) + E(202, 215, 11, 6.5) + E(227, 215, 11, 6.5);
      s += limb(234, 154, 246, 192, 13) + C(247, 196, 8) + B(190, 142, 48, 52, 13) + limb(196, 158, 168, 126, 12) + B(192, 138, 44, 12, 6) + B(220, 144, 12, 30, 5);
      s += C(214, 85, 9) + C(214, 120, 25) + P('M188 116A26 26 0 0 1 240 116Z') + B(186, 104, 56, 14, 7);
      s += D('M218 125q5 -5 10 0') + smile(214, 133, 4.5) + E(229, 134, 6.5, 5);
      for (const [x, y, w, hh, r] of [[143, 101, 30, 12, 3], [189, 117.5, 15, 15, 3], [93, 113, 98, 24, 5], [133, 110.5, 11, 29, 3], [73, 108, 22, 34, 4]]) s += BR(x, y, w, hh, r, 31, 205, 125);
      return s + C(150, 109, 8) + C(166, 123, 8);
    };

    const cookies = () => {
      const h = head(150, 92, 27, { hair: 'bun', tiara: 1 });
      let s = frame(16) + B(16, 62, 80, 108, 8) + B(28, 72, 56, 10, 5) + B(26, 90, 60, 46, 7) + D('M32 125H80') + C(45, 116, 8.5) + C(67, 116, 8.5) + C(56, 153, 8) + D('M56 153l4 -4');
      s += D('M36 54q-6 -8 0 -16t0 -16M56 54q-6 -8 0 -16t0 -16M76 54q-6 -8 0 -16t0 -16');
      s += B(194, 70, 88, 15, 6) + B(204, 34, 30, 37, 8) + B(201, 26, 36, 11, 4) + B(246, 44, 28, 27, 8) + B(243, 36, 34, 11, 4);
      s += h.back + P('M122 126Q150 114 178 126L188 184H112Z') + P('M133 120Q150 116 167 120L172 184H128Z') + C(122, 132, 12) + C(178, 132, 12) + h.front;
      s += G('12,226 26,178 274,178 288,226') + P('M12 226H288V278' + scal(288, 278, 12, 278, 10, 4) + 'Z');
      s += E(150, 201, 56, 14) + P(heartD(40, 202, 11)) + P(starD(72, 205, 13, 6.5)) + C(228, 203, 12) + P(puffD(262, 201, 12, 11, 6, 1.4));
      s += D('M222 199l3 2M232 197l-2 3M226 208l3 -1M235 206l1 3') + dot(262, 201, 3);
      s += limb(121, 138, 104, 190, 12) + limb(179, 138, 196, 190, 12) + B(112, 190, 76, 17, 8.5) + B(82, 192, 32, 13, 6.5) + B(186, 192, 32, 13, 6.5) + C(104, 198, 8.5) + C(196, 198, 8.5);
      return s;
    };

    const explorer = () => {
      let s = frame() + D('M54 10Q70 40 64 70Q60 92 76 110') + leaf(66, 40, 24, 6.5, -20, 0) + leaf(63, 70, 24, 6.5, 200, 0) + leaf(70, 98, 24, 6.5, -10, 0);
      s += leaf(8, 214, 130, 28, -38) + leaf(292, 204, 130, 28, 218) + leaf(30, 160, 100, 22, -72) + leaf(270, 156, 100, 22, 252);
      s += P(puffD(244, 54, 17, 17, 5, 1.55, -90)) + C(244, 54, 6);
      s += P('M112 146Q150 136 188 146L196 240H104Z') + G('131,140 150,151 138,169') + G('169,140 150,151 162,169') + B(118, 186, 24, 22, 5) + B(158, 186, 24, 22, 5) + dot(130, 192) + dot(170, 192) + B(106, 222, 88, 13, 5) + B(141, 219, 18, 19, 4);
      s += limb(118, 152, 95, 172, 120, 130, 15) + limb(182, 152, 205, 172, 180, 130, 15);
      s += C(150, 114, 31) + P('M136 134Q150 153 164 134Z') + P('M116 92Q116 50 150 50Q184 50 184 92Z') + B(116, 74, 68, 17, 4) + E(150, 92, 52, 10);
      s += C(137, 121, 13.5) + C(163, 121, 13.5) + C(137, 121, 8) + C(163, 121, 8) + D('M132 118q2 -4 6 -5M158 118q2 -4 6 -5') + C(121, 128, 9) + C(179, 128, 9);
      s += leaf(30, 292, 120, 26, -55) + leaf(270, 292, 120, 26, 235) + leaf(150, 296, 60, 20, -90);
      return s;
    };

    const recycle = (x, y, r) => D(`M${pt(x + r, y)}A${r} ${r} 0 1 1 ${pt(x, y - r)}M${pt(x - 3, y - r - 4)}L${pt(x + 1, y - r)}L${pt(x - 3, y - r + 4)}`);
    const truck = () => {
      let s = frame() + C(250, 44, 18) + D('M250 16v-4M226 30l-4 -3M274 30l4 -3M222 50h-6') + P(cloudD(120, 76, 0.75)) + P(cloudD(196, 104, 0.5));
      s += C(56, 110, 36) + B(50, 140, 12, 80, 3) + B(10, 212, 280, 26) + ground(236) + D('M28 276h24M84 276h24M140 276h24M196 276h24M252 276h24', 4);
      for (const x of [16, 56]) s += G(`${x + 4},176 ${x + 34},176 ${x + 30},226 ${x + 8},226`) + B(x, 166, 38, 12, 4) + C(x + 12, 228, 6.5) + recycle(x + 19, 200, 7);
      s += B(100, 118, 112, 112, 10) + B(110, 130, 28, 64, 6) + B(142, 130, 28, 64, 6) + B(174, 130, 28, 64, 6) + B(100, 202, 112, 13);
      s += recycle(124, 162, 7) + D('M156 170q-8 -12 0 -22q8 10 0 22zM156 170v6') + P(heartD(188, 162, 9));
      s += P('M212 230V146Q212 136 222 136H250Q260 136 266 148L282 186Q284 192 284 200V230Z') + P('M222 146H248Q254 146 258 154L268 178H222Z') + P('M230 136V126Q236 118 242 126V136Z') + D('M226 192h12');
      s += B(270, 216, 20, 12, 4) + E(276, 200, 6, 7) + C(130, 236, 22) + C(130, 236, 9) + C(186, 236, 22) + C(186, 236, 9) + C(252, 236, 22) + C(252, 236, 9);
      return s;
    };

    // tapered tube along a quadratic curve, round tip
    const tubeD = (x0, y0, cx, cy, x1, y1, w0, w1, n = 9) => {
      const A = [], Z = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n, u = 1 - t, x = u * u * x0 + 2 * u * t * cx + t * t * x1, y = u * u * y0 + 2 * u * t * cy + t * t * y1;
        let dx = u * (cx - x0) + t * (x1 - cx), dy = u * (cy - y0) + t * (y1 - cy); const l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2;
        A.push(pt(x - dy / l * w, y + dx / l * w)); Z.unshift(pt(x + dy / l * w, y - dx / l * w));
      }
      return `M${A.join('L')}A${N(w1 / 2)} ${N(w1 / 2)} 0 0 0 ${Z.join('L')}Z`;
    };
    const flags = (x0, y0, x1, sag, n, h) => { let s = D(`M${x0} ${y0}Q${(x0 + x1) / 2} ${y0 + 2 * sag} ${x1} ${y0}`); const yb = x => { const t = (x - x0) / (x1 - x0); return y0 + 4 * sag * t * (1 - t); }; for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (i + 0.5) / n, w = (x1 - x0) / n * 0.38; s += G(`${pt(x - w, yb(x - w))} ${pt(x + w, yb(x + w))} ${pt(x, yb(x) + h)}`); } return s; };

    const tacos = () => {
      let s = frame() + flags(12, 32, 288, 18, 7, 28) + E(150, 256, 136, 26);
      for (const [x, y, k, a] of [[98, 168, 1.12, -12], [220, 190, 1.02, 12]]) {
        const rx = 74 * k, ry = 56 * k, w = 2 * rx - 24;
        let t = '', z = `M${N(x - rx + 14)} ${y + 8}L${N(x - rx + 10)} ${y - 14}`;
        for (let i = 0; i < 9; i++) z += `L${N(x - rx + 12 + w * (i + 0.5) / 9)} ${y - 30 + (i % 2) * 5}L${N(x - rx + 12 + w * (i + 1) / 9)} ${y - 14}`;
        for (const [u, v] of [[-38, -40], [-8, -46], [22, -40]]) t += B(x + u * k, y + v * k, 15, 15, 4);
        t += P(z + `L${N(x + rx - 14)} ${y + 8}Z`) + P(`M${N(x - rx + 18)} ${y + 10}V${y - 6}` + scal(x - rx + 18, y - 6, x + rx - 18, y - 6, 6, -3.5) + `V${y + 10}Z`);
        t += P(`M${N(x - rx)} ${y - 10}A${N(rx)} ${N(ry)} 0 0 0 ${N(x + rx)} ${y - 10}Q${x} ${N(y + 26 * k)} ${N(x - rx)} ${y - 10}Z`) + eye(x - 18 * k, y + 22 * k, 6) + eye(x + 18 * k, y + 22 * k, 6) + smile(x, y + 32 * k, 6.5) + E(x - 34 * k, y + 29 * k, 7.5, 6) + E(x + 34 * k, y + 29 * k, 7.5, 6);
        for (const [u, v] of [[-56, 4], [-48, 16], [50, 4], [42, 16], [-14, 42], [14, 42], [0, 14]]) t += dot(x + u * k, y + v * k, 1.7);
        s += `<g${rot(a, x, y)}>${t}</g>`;
      }
      s += P('M30 266A24 24 0 0 0 78 266Z') + P('M37 266A17 17 0 0 0 71 266Z') + dot(48, 274, 1.5) + dot(60, 274, 1.5) + dot(54, 280, 1.5);
      s += P('M218 272Q248 292 278 266Q282 258 274 260Q252 280 222 264Z') + P('M274 262Q276 250 286 248L288 254Q282 256 280 264Z');
      return s;
    };

    const balletBunny = () => {
      let s = frame(16) + P('M10 26H78Q66 110 50 150Q70 210 62 240H10Z') + P('M290 26H222Q234 110 250 150Q230 210 238 240H290Z') + E(48, 150, 12, 8, -20) + E(252, 150, 12, 8, 20);
      s += P('M10 30V24Q10 10 24 10H276Q290 10 290 24V30' + scal(290, 30, 10, 30, 9, -5) + 'Z') + ground(240) + E(150, 254, 76, 15);
      s += rose(62, 262, 11) + leaf(72, 268, 22, 5.5, 20, 0) + rose(238, 264, 11) + leaf(228, 270, 22, 5.5, 160, 0) + spark(96, 70, 6) + spark(206, 66, 6) + spark(110, 210, 5) + spark(196, 230, 5);
      s += E(134, 62, 12, 34, -12) + E(166, 62, 12, 34, 12) + E(134, 66, 6, 23, -12) + E(166, 66, 6, 23, 12);
      s += limb(156, 194, 192, 210, 162, 220, 15) + limb(150, 196, 150, 238, 14) + E(150, 244, 7, 10) + E(158, 220, 9, 6.5, 15);
      s += limb(140, 152, 106, 122, 10) + limb(160, 152, 194, 122, 10) + C(102, 119, 8) + C(198, 119, 8) + P('M134 144Q150 136 166 144L162 192H138Z');
      s += P('M80 188Q150 164 220 188' + scal(220, 188, 150, 202, 4, -6) + scal(150, 202, 80, 188, 4, -6) + 'Z') + P('M96 194Q150 178 204 194' + scal(204, 194, 150, 208, 3, -5) + scal(150, 208, 96, 194, 3, -5) + 'Z');
      s += C(150, 114, 30) + eye(138, 112, 4.5) + eye(162, 112, 4.5) + `<path d="M146 120h8l-4 4z" fill="${INK}" ${L}/>` + D('M150 124q-3 5 -7 2M150 124q3 5 7 2') + E(129, 124, 6.5, 5) + E(171, 124, 6.5, 5);
      s += G('136,88 133,72 142,79 150,66 158,79 167,72 164,88');
      return s;
    };

    const ball = (X, Y, r, a) => {
      const t = rot(a, X, Y), k = 0.325 * r, A = `A${r} ${r} 0 0 1 `;
      let s = P(`M${X} ${Y}L${X - r} ${Y}${A}${X} ${Y - r}Z`, t) + P(`M${X} ${Y}L${X} ${Y - r}${A}${X + r} ${Y}Z`, t) + P(`M${X} ${Y}L${X + r} ${Y}${A}${X} ${Y + r}Z`, t) + P(`M${X} ${Y}L${X} ${Y + r}${A}${X - r} ${Y}Z`, t);
      for (const sd of [-1, 1]) {
        const e = X + sd * r, m = X + sd * k, q = X + sd * 0.6 * r, f = sd < 0 ? 1 : 0;
        s += P(`M${pt(e, Y)}A${r} ${r} 0 0 ${f} ${pt(q, Y - 0.8 * r)}Q${pt(m, Y - 0.4 * r)} ${pt(m, Y)}Z`, t) + P(`M${pt(e, Y)}L${pt(m, Y)}Q${pt(m, Y + 0.4 * r)} ${pt(q, Y + 0.8 * r)}A${r} ${r} 0 0 ${f} ${pt(e, Y)}Z`, t);
      }
      return s;
    };
    const basketball = () => {
      const h = head(83, 144, 25, { hair: 'curly' });
      let s = frame() + ground(250) + E(214, 272, 62, 12) + B(266, 100, 14, 160, 4) + B(160, 20, 124, 86, 8);
      s += D('M130 112Q150 52 184 58', 2.5).replace('stroke-linecap', 'stroke-dasharray="2 9" stroke-linecap') + D('M172 44l-12 -8M178 34l-6 -12M164 56l-14 -2');
      for (let i = 0; i < 4; i++) s += G(`${196 + i * 15},112 ${211 + i * 15},112 ${218 + i * 8},158 ${210 + i * 8},158`);
      s += ball(222, 74, 32, -20) + B(188, 104, 72, 11, 5.5) + spark(160, 150, 6) + spark(30, 80, 5) + spark(140, 200, 5) + spark(250, 200, 5);
      s += h.back + B(60, 248, 14, 20, 5) + B(92, 248, 14, 20, 5) + E(65, 270, 12, 7) + E(101, 270, 12, 7);
      s += limb(66, 180, 44, 132, 12) + limb(100, 180, 122, 132, 12) + C(42, 127, 9) + C(124, 127, 9);
      s += P('M58 172Q83 162 108 172L112 230H54Z') + D('M74 186h17l-10 25', 3.5) + P('M54 228H112L114 252H88L83 240L78 252H52Z') + h.front;
      return s;
    };

    const squid = () => {
      let s = frame();
      for (const [x, y, r] of [[52, 62, 12], [76, 34, 7.5], [250, 74, 11], [238, 40, 7.5], [274, 112, 8.5]]) s += C(x, y, r) + D(`M${pt(x - r * 0.5, y - r * 0.1)}q0 ${N(-r * 0.4)} ${N(r * 0.4)} ${N(-r * 0.45)}`);
      s += P(tubeD(30, 292, 6, 200, 40, 120, 18, 7)) + P(tubeD(60, 292, 84, 220, 52, 160, 15, 7)) + P(tubeD(268, 292, 294, 210, 258, 128, 18, 7)) + P(tubeD(240, 292, 220, 236, 250, 176, 15, 7));
      s += P('M10 262Q80 248 150 258T290 254V272Q290 290 272 290H28Q10 290 10 272Z') + E(100, 274, 13, 7.5) + E(206, 276, 11, 6.5);
      s += P(tubeD(122, 176, 58, 272, 42, 214, 13, 10)) + E(40, 210, 11, 7.5, -60) + P(tubeD(178, 176, 242, 272, 258, 214, 13, 10)) + E(260, 210, 11, 7.5, 60);
      for (let i = 0; i < 6; i++) { const x = 120 + 12 * i, d = x - 150; s += P(tubeD(x, 174, x + d * 0.5 + (i % 2 ? 8 : -8), 212, 150 + d * 1.9, 240, 15, 7.5)); }
      s += P('M150 30Q118 40 90 80Q112 92 130 84Z') + P('M150 30Q182 40 210 80Q188 92 170 84Z') + P('M150 22Q196 64 188 150H112Q104 64 150 22Z');
      s += C(138, 82, 8.5) + C(163, 106, 9.5) + C(137, 126, 7.5) + C(164, 66, 7);
      s += E(150, 162, 46, 30) + eye(131, 158, 8.5) + eye(169, 158, 8.5) + `<circle cx="128" cy="162" r="1.6" fill="#fff"/><circle cx="166" cy="162" r="1.6" fill="#fff"/>` + smile(150, 172, 6) + E(116, 172, 7, 5) + E(184, 172, 7, 5);
      return s;
    };

    const bookDragon = () => {
      let s = frame() + P('M22 124V64A36 36 0 0 1 94 64V124Z') + P('M31 116V65A27 27 0 0 1 85 65V116Z') + spark(48, 70, 5) + spark(70, 92, 4) + D('M70 56a10 10 0 1 0 8 14a8 8 0 1 1 -8 -14z');
      for (const [x, y, w, h] of [[48, 252, 204, 30], [70, 226, 166, 28], [56, 202, 180, 26]]) s += B(x, y, w, h, 5) + B(x + w / 2 - 20, y + 6, 40, h - 12, 3);
      s += P(tubeD(184, 186, 254, 196, 262, 238, 22, 11)) + P(leafD(262, 236, 22, 9, 80)) + D('M88 180q-4 -8 0 -14M80 180q-4 -8 0 -14');
      s += P('M64 182H96V192Q96 204 80 204Q64 204 64 192Z') + D('M96 186q9 0 8 7t-8 5');
      s += P('M120 132Q74 92 50 124Q62 128 60 140Q74 138 78 152Q92 146 106 158Z') + P('M180 132Q226 92 250 124Q238 128 240 140Q226 138 222 152Q208 146 194 158Z');
      s += P('M108 204Q98 128 150 122Q202 128 192 204Z') + P('M124 204Q118 152 150 148Q182 152 176 204Z') + E(124, 206, 17, 10) + E(176, 206, 17, 10) + D('M116 210v-5M124 211v-6M132 210v-5M168 210v-5M176 211v-6M184 210v-5');
      s += P('M126 70Q112 46 122 36Q134 52 140 62Z') + P('M174 70Q188 46 178 36Q166 52 160 62Z') + G('134,64 150,28 166,64') + C(150, 90, 36) + E(150, 110, 26, 15);
      s += C(135, 86, 12) + C(165, 86, 12) + D('M147 85q3 -3 6 0M123 84l-9 -3M177 84l9 -3') + eye(135, 87, 4.5) + eye(165, 87, 4.5) + dot(143, 106, 2.2) + dot(157, 106, 2.2) + smile(150, 113, 8) + E(118, 104, 6.5, 5) + E(182, 104, 6.5, 5);
      s += limb(120, 150, 116, 180, 13) + limb(180, 150, 184, 180, 13) + P('M106 168L150 178L194 168V198L150 208L106 198Z') + P('M111 166Q132 160 150 174V203Q132 192 111 196Z') + P('M189 166Q168 160 150 174V203Q168 192 189 196Z');
      s += D('M118 176q14 -4 26 4M118 184q14 -4 26 4M156 180q12 -8 26 -4M156 188q12 -8 26 -4') + C(112, 184, 8.5) + C(188, 184, 8.5);
      return s;
    };

    const swanBoat = () => {
      const h = head(176, 116, 25, { hair: 'braids', bn: 2, tiara: 1 });
      let s = frame() + C(254, 46, 20) + D('M254 16v-6M224 46h-6M232 24l-5 -5M276 24l5 -5') + P(cloudD(118, 66, 0.62));
      s += P('M10 198Q80 190 150 196T290 194V272Q290 290 272 290H28Q10 290 10 272Z') + D('M22 216h18M262 214h18M100 272h20M200 282h16');
      for (const [x, y] of [[262, 116], [278, 132]]) s += D(`M${x} 198V${y}`) + B(x - 5.5, y, 11, 30, 5.5);
      s += P(leafD(272, 198, 76, 6.5, -102)) + P('M232 214Q266 184 258 156Q246 186 222 202Z');
      s += h.back + P('M156 144Q176 136 196 144L200 200H152Z') + C(157, 150, 10.5) + C(195, 150, 10.5) + h.mid + limb(201, 165, 225, 139, 11) + C(226, 136, 8) + h.front;
      s += P('M52 210Q64 258 150 260Q232 260 252 204Q202 224 150 222Q98 222 52 210Z') + P('M104 232Q146 172 240 184Q252 192 242 200' + scal(242, 200, 104, 232, 6, -4) + 'Z');
      s += limb(154, 160, 146, 192, 11) + C(144, 194, 8) + P(tubeD(70, 224, 20, 170, 78, 134, 28, 16)) + P('M68 112L38 126L70 136Z') + C(80, 122, 17) + G('70,108 68,94 75,101 80,90 85,101 92,94 90,108') + eye(76, 119, 4) + E(89, 128, 6.5, 5);
      s += E(38, 262, 26, 9) + P(starD(38, 256, 14, 8, 6)) + E(256, 274, 24, 8.5) + P(starD(256, 268, 13, 7.5, 6)) + E(164, 280, 20, 7);
      return s;
    };
    const burst = (x, y, n, r0, r1, w) => { let s = ''; for (let i = 0; i < n; i++) { const a = i * 360 / n - 90, r = a * Math.PI / 180, m = r + Math.PI / n; s += P(leafD(x + r0 * Math.cos(r), y + r0 * Math.sin(r), r1 - r0, w, a)) + dot(x + (r1 + 7) * Math.cos(r), y + (r1 + 7) * Math.sin(r), 2.6) + D(`M${pt(x + (r1 - 8) * Math.cos(m), y + (r1 - 8) * Math.sin(m))}L${pt(x + (r1 + 2) * Math.cos(m), y + (r1 + 2) * Math.sin(m))}`); } return s + C(x, y, r0 - 3); };
    const dash = (d, w = 2.5) => D(d, w).replace('stroke-linecap', 'stroke-dasharray="2 8" stroke-linecap');
    const fireworks = () => {
      let s = frame() + burst(84, 82, 8, 16, 54, 8.5) + burst(218, 70, 8, 15, 50, 8) + dash('M96 214Q100 170 88 140') + dash('M206 214Q200 160 214 124');
      for (let i = 0; i < 10; i++) { const a = i * 36 * Math.PI / 180; s += D(`M${pt(150 + 10 * Math.cos(a), 132 + 10 * Math.sin(a))}L${pt(150 + 24 * Math.cos(a), 132 + 24 * Math.sin(a))}`) + dot(150 + 30 * Math.cos(a), 132 + 30 * Math.sin(a), 2.2); }
      s += spark(28, 160, 5) + spark(270, 150, 5) + spark(150, 30, 5) + dot(40, 30, 2) + dot(276, 24, 2) + dot(124, 70, 2) + dot(264, 116, 2) + dot(30, 116, 2);
      for (const [x, y, w, h, wx] of [[18, 212, 54, 56, 36], [78, 224, 46, 44, 92], [176, 222, 48, 46, 192], [228, 208, 54, 60, 246]]) s += B(x, y, w, h) + G(`${x - 6},${y + 2} ${x + w / 2},${y - 32} ${x + w + 6},${y + 2}`) + B(wx, y + 14, 18, 18, 3);
      s += B(128, 150, 44, 118) + G('122,152 150,110 178,152') + C(150, 180, 14) + D('M150 180V170M150 180L145 172') + D('M150 110V92', 2.5) + G('150,90 170,97 150,105');
      return s + P('M10 258Q80 250 150 256T290 254V272Q290 290 272 290H28Q10 290 10 272Z');
    };

    const photo = (x, y, a, k) => { const t = rot(a, x, y), m = [P(heartD(x, y - 4, 9), t), P(starD(x, y - 5, 12, 6), t), P(puffD(x, y - 5, 9, 9, 6, 1.4), t), G(`${x - 14},${y + 6} ${x - 2},${y - 14} ${x + 14},${y + 6}`).replace('/>', t + '/>')][k]; return B(x - 22, y - 24, 44, 52, 3).replace('/>', t + '/>') + B(x - 17, y - 19, 34, 32, 2).replace('/>', t + '/>') + m; };
    const camera = () => {
      const h = head(150, 136, 30, { hair: 'short' });
      let s = frame() + D('M12 30Q150 70 288 30') + photo(44, 64, -8, 0) + photo(98, 78, 6, 1) + photo(202, 78, -6, 2) + photo(256, 64, 8, 3);
      s += D('M42 38v6M100 50v6M200 50v6M258 38v6', 4) + photo(40, 252, -14, 1) + photo(260, 252, 12, 0);
      s += P('M92 178Q150 158 208 178L216 290H84Z') + h.front + limb(100, 186, 98, 214, 17) + limb(200, 186, 202, 214, 17);
      s += B(122, 168, 30, 16, 4) + B(170, 171, 18, 12, 4) + B(104, 180, 92, 60, 11) + B(168, 188, 20, 12, 3) + C(150, 212, 22) + C(150, 212, 12.5) + D('M144 207q3 -4 8 -4');
      return s + C(100, 216, 10.5) + C(200, 216, 10.5) + spark(222, 168, 6) + spark(78, 150, 5);
    };

    const island = () => {
      let s = frame() + C(56, 56, 22) + D('M56 22v-8M56 90v8M22 56h-8M90 56h8M32 32l-6 -6M80 32l6 -6M32 80l-6 6M80 80l6 6') + P(cloudD(162, 66, 0.62)) + P(cloudD(222, 104, 0.45)) + D('M120 110q5 -5 10 0q5 -5 10 0M240 40q4 -4 8 0q4 -4 8 0');
      s += P('M10 172H290V272Q290 290 272 290H28Q10 290 10 272Z') + P('M10 252Q40 242 70 252T130 252T190 252T250 252T290 248V272Q290 290 272 290H28Q10 290 10 272Z');
      s += E(26, 212, 14, 9) + E(276, 222, 12, 8) + P('M30 240Q56 190 150 186Q244 190 270 240Z');
      s += P(tubeD(104, 226, 92, 160, 116, 108, 17, 11)) + P(tubeD(206, 226, 218, 170, 196, 122, 16, 11)) + D('M100 200l8 -2M98 180l8 -2M100 160l8 -1M106 140l8 0M210 200l-8 -2M212 180l-8 -2M208 160l-8 -1');
      s += P('M104 186Q154 228 206 186Q154 206 104 186Z') + D('M104 186l-4 -6M206 186l2 -6');
      for (const [x, y, as] of [[116, 106, [200, 238, 290, 330, 10]], [196, 120, [176, 214, 250, 300, 345]]]) for (const a of as) s += leaf(x, y, 58, 10, a);
      s += C(110, 114, 7) + C(122, 116, 7) + C(116, 104, 7) + P(puffD(64, 226, 11, 11, 5, 1.6, -90)) + C(64, 226, 6) + P(tubeD(222, 226, 236, 214, 250, 222, 10, 8)) + B(250, 217, 9, 9, 2);
      return s;
    };

    const quilt = () => {
      let s = P('M20 20' + scal(20, 20, 280, 20, 10, -4) + scal(280, 20, 280, 280, 10, -4) + scal(280, 280, 20, 280, 10, -4) + scal(20, 280, 20, 20, 10, -4) + 'Z');
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const x = 34 + 58 * c, y = 34 + 58 * r, cx = x + 29, cy = y + 29, k = (r + c) % 2 ? (r % 2 ? 1 : 2) : 0;
        s += B(x, y, 58, 58) + [P(heartD(cx, cy + 1, 15)), G(`${cx},${cy - 20} ${cx + 20},${cy} ${cx},${cy + 20} ${cx - 20},${cy}`), P(puffD(cx, cy, 14, 14, 6, 1.4, -90))][k];
      }
      for (let i = 1; i < 4; i++) for (let j = 1; j < 4; j++) s += dot(34 + 58 * i, 34 + 58 * j, 3.5);
      return s;
    };

    const anky = () => {
      let s = frame() + C(252, 50, 20) + D('M252 20v-6M222 50h-6M230 28l-5 -5M274 28l5 -5M252 80v6') + P(cloudD(28, 74, 0.6));
      s += leaf(26, 242, 76, 12, -98) + leaf(32, 242, 64, 11, -58) + leaf(276, 236, 72, 12, -84) + leaf(268, 236, 60, 11, -124);
      s += P('M10 236Q90 226 150 234T290 232V272Q290 290 272 290H28Q10 290 10 272Z') + P(puffD(150, 266, 11, 11, 5, 1.6, -90)) + C(150, 266, 6);
      s += B(120, 196, 26, 46, 9) + B(216, 196, 24, 44, 9) + P(tubeD(76, 194, 40, 206, 34, 170, 24, 14)) + P(puffD(28, 160, 17, 14, 4, 1.3, 45)) + P(leafD(54, 194, 19, 7, 95)) + P(leafD(40, 186, 17, 6.5, 80));
      s += P('M60 216Q56 178 104 168H204Q240 174 242 206Q242 224 218 224H78Q60 224 60 216Z') + P('M64 198Q66 148 152 144Q236 148 240 196Q152 186 64 198Z');
      for (let i = 0; i < 5; i++) { const x = 96 + 28 * i, y = 160 - 12 * Math.sin((i + 0.5) / 5 * Math.PI); s += P(leafD(x, y + 6, 20, 7, -90 + (i - 2) * 12)); }
      for (const [x, y] of [[104, 176], [138, 168], [172, 168], [206, 176]]) s += E(x, y, 13, 8.5);
      for (const [x, y, a] of [[78, 196, 112], [118, 190, 98], [158, 188, 86], [200, 190, 74]]) s += P(leafD(x, y, 20, 7, a));
      s += B(84, 204, 28, 40, 10) + B(184, 204, 28, 40, 10) + D('M90 244v-5M98 244v-5M106 244v-5M190 244v-5M198 244v-5M206 244v-5');
      s += P('M224 196Q226 172 248 168Q268 166 282 176Q292 184 290 194Q288 206 272 208Q246 212 232 206Z') + D('M240 174q8 -5 16 -1') + eye(252, 184, 5) + smile(272, 198, 6) + E(244, 198, 7, 5.5) + dot(284, 186, 2);
      return s;
    };

    const pine = (x, y, h) => G(`${x},${y - h} ${x + h * 0.28},${y - h * 0.55} ${x + h * 0.16},${y - h * 0.55} ${x + h * 0.38},${y} ${x - h * 0.38},${y} ${x - h * 0.16},${y - h * 0.55} ${x - h * 0.28},${y - h * 0.55}`);
    const cableCar = () => {
      let s = frame() + C(250, 46, 18) + P(cloudD(24, 62, 0.55)) + P(cloudD(196, 100, 0.42)) + D('M110 40q4 -4 8 0q4 -4 8 0M84 56q3 -3 6 0q3 -3 6 0');
      s += P('M84 236L170 66L256 236Z') + P('M170 66L148 110L160 102L170 116L180 102L192 110Z') + P('M10 236V160L60 108L130 236Z') + P('M60 108L29 140L44 134L58 146L68 134L77.5 140Z') + P('M180 236L254 118L290 170V236Z') + P('M254 118L234 150L246 142L256 154L266 142L276 150Z');
      s += P('M10 232Q100 216 150 230T290 226V272Q290 290 272 290H28Q10 290 10 272Z') + pine(36, 262, 46) + pine(70, 276, 40) + pine(228, 270, 44) + pine(266, 258, 40);
      s += G('204,234 210,136 220,136 226,234') + B(198, 124, 34, 11, 4) + D('M10 70L290 150', 2.5) + D('M150 113V138M60 87V96', 4) + C(150, 112, 7) + C(60, 86, 6.5);
      s += B(46, 96, 30, 26, 6) + B(52, 101, 18, 11, 3) + P('M114 140Q150 126 186 140V148H114Z') + B(112, 146, 76, 64, 10) + B(120, 154, 26, 28, 5) + B(154, 154, 26, 28, 5) + B(112, 190, 76, 11);
      s += C(133, 172, 9) + C(167, 172, 9) + eye(130, 171, 2) + eye(136, 171, 2) + eye(164, 171, 2) + eye(170, 171, 2) + D('M131 176q2 2 4 0M165 176q2 2 4 0', 1.5);
      return s;
    };
    const qp = (x0, y0, cx, cy, x1, y1, t) => [(1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * cx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * cy + t * t * y1];
    const fort = () => {
      const h = head(150, 212, 22, { hair: 'pony' });
      let s = frame(16) + B(214, 24, 62, 54, 6) + B(221, 31, 48, 40, 4) + D('M250 40a10 10 0 1 0 8 14a8 8 0 1 1 -8 -14z') + P('M10 232H290V274Q290 290 274 290H26Q10 290 10 274Z') + E(150, 272, 126, 15);
      s += P('M34 252Q44 160 150 72Q256 160 266 252' + scal(266, 252, 34, 252, 9, -5) + 'Z') + P(starD(86, 200, 13, 6.5)) + P(starD(214, 200, 13, 6.5)) + P(heartD(150, 124, 11));
      s += P('M108 254V204Q150 150 192 204V254Z') + h.back + h.front + C(120, 232, 8) + C(180, 232, 8);
      s += B(12, 232, 72, 46, 18) + B(216, 232, 72, 46, 18) + B(82, 246, 58, 38, 15) + B(160, 246, 58, 38, 15) + D('M22 240l5 4M74 240l-5 4M226 240l5 4M278 240l-5 4');
      s += D('M12 64Q80 118 150 72Q220 118 288 64') + D('M150 72V42', 2.5) + G('150,40 174,48 150,57');
      for (const q of [[12, 64, 80, 118, 150, 72], [150, 72, 220, 118, 288, 64]]) for (const t of [0.2, 0.45, 0.7, 0.92]) { const [x, y] = qp(...q, t); s += E(x, y + 8, 6, 8); }
      return s;
    };

    const garden = () => {
      let s = frame() + C(250, 46, 18) + D('M250 18v-6M222 46h-6M230 26l-5 -5M270 26l5 -5') + P(cloudD(24, 66, 0.6));
      for (const x of [18, 54, 220, 256]) s += G(`${x},226 ${x},164 ${x + 13},150 ${x + 26},164 ${x + 26},226`);
      s += P('M10 214Q150 204 290 214V272Q290 290 272 290H28Q10 290 10 272Z') + P('M14 242Q150 228 286 242Q292 252 282 256Q150 244 18 256Q8 252 14 242Z') + P('M14 270Q150 256 286 270Q292 280 282 284Q150 272 18 284Q8 280 14 270Z');
      s += D('M150 120V262', 6) + limb(150, 146, 80, 140, 22) + limb(150, 146, 220, 140, 22) + P(puffD(70, 140, 13, 12, 6, 1.35)) + P(puffD(230, 140, 13, 12, 6, 1.35));
      s += P('M122 132Q150 124 178 132L186 214H114Z') + B(154, 168, 20, 20, 2) + D('M158 172l3 3M168 182l3 3M158 184l3 -3M120 214l6 10M134 214l2 10M166 214l-2 10M180 214l-6 10');
      s += C(150, 104, 26) + P('M124 84Q124 50 150 50Q176 50 176 84Z') + B(124, 66, 52, 15) + E(150, 84, 48, 9) + D('M126 96l-8 6M126 104l-9 2M174 96l8 6M174 104l9 2');
      s += eye(140, 104, 4) + eye(160, 104, 4) + D('M138 114q12 10 24 0M142 116v4M150 119v4M158 116v4') + E(129, 112, 6.5, 5) + E(171, 112, 6.5, 5);
      s += E(206, 120, 14, 11) + P(leafD(214, 120, 16, 5, 200)) + eye(200, 116, 2.5) + `<path d="M192 118l-7 3l7 2z" fill="${INK}"/>`;
      s += P(puffD(52, 238, 18, 14, 8, 1.16)) + C(52, 238, 8) + P(puffD(248, 238, 18, 14, 8, 1.16)) + C(248, 238, 8);
      for (const x of [92, 150, 208]) s += P(puffD(x, 252, 9, 12, 5, 1.45, -90)) + P(`M${x - 11} 272A11 11 0 0 1 ${x + 11} 272Z`);
      return s;
    };

    const flake = (x, y, r) => D(`M${x - r} ${y}h${2 * r}M${x} ${y - r}v${2 * r}M${pt(x - r * 0.7, y - r * 0.7)}l${N(r * 1.4)} ${N(r * 1.4)}M${pt(x + r * 0.7, y - r * 0.7)}l${N(-r * 1.4)} ${N(r * 1.4)}`, 1.8);
    const yeti = () => {
      let s = frame() + P(cloudD(186, 70, 0.55)) + pine(34, 182, 66) + pine(70, 178, 46) + pine(262, 240, 56) + flake(120, 36, 6) + flake(30, 108, 5) + flake(250, 120, 6) + flake(270, 30, 5) + flake(100, 220, 5);
      s += P('M10 168Q150 190 290 246V272Q290 290 272 290H28Q10 290 10 272Z');
      let y = B(84, 224, 124, 11, 5.5) + B(102, 236, 124, 11, 5.5) + D('M80 182L64 244M224 178L246 250', 3) + C(66, 238, 6.5) + C(244, 244, 6.5) + E(128, 222, 16, 9) + E(172, 233, 16, 9);
      y += limb(110, 150, 82, 180, 20) + limb(190, 150, 222, 176, 20) + P(puffD(150, 166, 50, 54, 14, 1.1)) + E(150, 182, 30, 32) + C(80, 182, 11) + C(224, 178, 11);
      y += limb(126, 138, 90, 120, 13) + B(116, 128, 68, 16, 8) + P(puffD(150, 104, 40, 36, 12, 1.1)) + E(150, 112, 27, 21) + P('M138 117Q150 134 162 117Z') + eye(140, 107, 4.5) + eye(160, 107, 4.5) + E(128, 117, 6.5, 5) + E(172, 117, 6.5, 5);
      y += C(150, 52, 10) + P('M116 88A34 34 0 0 1 184 88Z') + B(112, 80, 76, 14, 7);
      return s + `<g${rot(8, 150, 170)}>${y}</g>`;
    };

    const popcorn = () => {
      let s = frame() + spark(40, 40, 7) + spark(262, 44, 7) + spark(30, 150, 5) + spark(272, 140, 5) + P('M10 248H290V272Q290 290 272 290H28Q10 290 10 272Z');
      [[118, 72, 16, 0], [150, 62, 17, 30], [182, 72, 16, 10], [132, 92, 18, 20], [168, 92, 18, 40], [102, 106, 16, 0], [198, 106, 16, 20], [150, 104, 17, 50]].forEach(([x, y, r, a]) => { s += P(puffD(x, y, r, r * 0.92, 5, 1.32, a)); });
      for (let i = 0; i < 5; i++) s += G(`${92 + 23.2 * i},128 ${92 + 23.2 * (i + 1)},128 ${112 + 15.2 * (i + 1)},264 ${112 + 15.2 * i},264`);
      s += B(84, 112, 132, 20, 8) + eye(128, 178, 6) + eye(172, 178, 6) + smile(150, 192, 8) + E(114, 192, 7.5, 6) + E(186, 192, 7.5, 6);
      const tk = (x, y, a) => { const t = rot(a, x, y); return B(x - 34, y - 16, 50, 32, 4).replace('/>', t + '/>') + B(x + 16, y - 16, 18, 32, 4).replace('/>', t + '/>') + P(starD(x - 9, y, 11, 6.6), t); };
      s += tk(52, 246, -16) + tk(58, 272, 6) + P(puffD(206, 276, 9, 8.5, 5, 1.3)) + P(puffD(246, 280, 8.5, 8, 5, 1.3, 30));
      s += G('224,186 272,186 266,256 230,256') + limb(252, 178, 266, 132, 9) + B(220, 176, 56, 12, 5) + D('M234 206h32M236 226h28');
      return s;
    };

    const ringSeg = (x, y, ro, ri, a0, a1) => { const p = (r, a) => pt(x + r * Math.cos(a * Math.PI / 180), y + r * Math.sin(a * Math.PI / 180)); return P(`M${p(ro, a0)}A${ro} ${ro} 0 0 1 ${p(ro, a1)}L${p(ri, a1)}A${ri} ${ri} 0 0 0 ${p(ri, a0)}Z`); };
    const pool = () => {
      const h = head(186, 186, 20, { hair: 'short' });
      let s = frame() + C(254, 44, 18) + P(cloudD(130, 62, 0.55)) + P(puffD(100, 132, 34, 20, 7, 1.15)) + P(puffD(206, 130, 36, 20, 7, 1.15));
      s += P('M10 140H290V272Q290 290 272 290H28Q10 290 10 272Z') + P('M40 184Q40 168 56 168H262Q278 168 278 184V262Q278 278 262 278H56Q40 278 40 262Z') + P('M52 190Q52 180 62 180H256Q266 180 266 190V256Q266 266 256 266H62Q52 266 52 256Z');
      s += D('M70 236q8 -5 16 0t16 0M120 252q8 -5 16 0t16 0M226 240q8 -5 16 0t16 0M110 210q8 -5 16 0');
      s += B(14, 70, 30, 100, 5) + D('M18 86h22M18 104h22M18 122h22M18 140h22') + P(tubeD(40, 74, 44, 186, 110, 204, 30, 28)) + G('10,70 29,48 48,70');
      s += P(leafD(114, 196, 18, 6, -60)) + P(leafD(120, 204, 18, 6, -20)) + P(leafD(106, 190, 18, 6, -100));
      s += ringSeg(186, 228, 34, 15, 180, 270) + ringSeg(186, 228, 34, 15, 270, 360) + limb(174, 206, 154, 180, 11) + limb(198, 206, 218, 180, 11) + C(152, 176, 7.5) + C(220, 176, 7.5) + h.front;
      s += ringSeg(186, 228, 34, 15, 0, 90) + ringSeg(186, 228, 34, 15, 90, 180) + B(232, 144, 46, 18, 4) + E(70, 154, 9, 6) + E(88, 156, 9, 6) + D('M66 150l4 4M84 152l4 4');
      return s;
    };

    const envelope = (x, y, a) => { const t = rot(a, x, y); return B(x - 21, y - 14, 42, 28, 3).replace('/>', t + '/>') + G(`${x - 21},${y - 14} ${x + 21},${y - 14} ${x},${y + 3}`).replace('/>', t + '/>') + P(heartD(x, y + 2, 7), t); };
    const valentine = () => {
      let s = frame() + P(heartD(250, 46, 13)) + P(heartD(212, 30, 8.5)) + P(heartD(270, 100, 9)) + spark(176, 70, 6) + spark(30, 150, 5) + spark(150, 30, 5);
      s += P('M10 250Q150 238 290 250V272Q290 290 272 290H28Q10 290 10 272Z') + P(puffD(42, 264, 11, 11, 5, 1.6, -90)) + C(42, 264, 6) + P(puffD(256, 268, 11, 11, 5, 1.6, -90)) + C(256, 268, 6);
      s += B(160, 190, 26, 78, 4) + P('M92 194V130Q92 102 122 102H216Q244 102 244 130V194Z') + limb(228, 162, 228, 96, 9) + P(heartD(244, 96, 13));
      s += P(heartD(164, 140, 11)) + P(heartD(204, 166, 9)) + P(heartD(140, 172, 8.5));
      s += P('M68 196V132Q68 100 94 100Q120 100 120 132V196Z') + P('M78 189V135Q78 111 94 111Q110 111 110 135V189Z');
      s += envelope(92, 136, -18) + envelope(50, 84, 14) + envelope(122, 56, -8);
      return s;
    };

    const starCatcher = () => {
      const h = head(112, 142, 26, { hair: 'none', nocap: 1 });
      let s = frame() + P('M76 26A28 28 0 1 0 76 74A28 28 0 0 1 76 26Z') + D('M42 44q4 4 8 0') + smile(51, 56, 4) + E(44, 60, 6.5, 5.2);
      for (const [x, y, r] of [[122, 34, 13], [178, 26, 12.5], [262, 38, 13], [272, 112, 12.5], [252, 176, 12], [146, 82, 12], [28, 120, 12]]) s += P(starD(x, y, r, r * 0.55));
      s += dot(100, 66, 2) + dot(214, 60, 2) + dot(262, 220, 2) + dot(24, 176, 2) + dot(210, 150, 2) + P(cloudD(210, 274, 0.62));
      s += P('M188 86Q182 142 222 152Q252 142 241 102Z') + limb(112, 206, 206, 100, 11) + E(214, 93, 28, 11, 20) + P(starD(214, 82, 13, 7));
      s += P('M88 168Q112 158 136 168L142 226H82Z') + dot(112, 184, 2.2) + dot(112, 200, 2.2) + limb(94, 180, 132, 182, 12) + limb(132, 174, 158, 154, 12) + h.front;
      s += P('M86 136Q86 102 114 98Q148 96 172 116Q154 112 142 120Q144 128 141 136Z') + B(84, 126, 60, 14, 7) + C(172, 118, 9) + C(134, 181, 8) + C(160, 152, 8);
      s += P(cloudD(10, 278, 1.8)) + B(170, 206, 34, 40, 9) + B(167, 198, 40, 11, 4) + P(starD(187, 227, 12, 6.6)) + D('M178 212l-4 -3M196 212l4 -3');
      return s;
    };

    const puppets = () => {
      let s = frame(16) + P('M30 62Q150 14 270 62V76H30Z') + B(44, 92, 212, 112) + P('M44 92H96Q86 140 72 160Q88 188 82 204H44Z') + P('M256 92H204Q214 140 228 160Q212 188 218 204H256Z');
      s += P('M30 74H270V90' + scal(270, 90, 30, 90, 8, -5) + 'Z') + E(74, 160, 10, 7, -20) + E(226, 160, 10, 7, 20) + spark(150, 46, 6);
      s += P('M98 200Q100 166 118 156Q136 166 138 200Z') + C(118, 136, 20) + G('102,122 100,104 109,112 118,100 127,112 136,104 134,122') + C(99, 172, 7.5) + C(137, 172, 7.5);
      s += P('M164 200Q166 166 184 156Q202 166 204 200Z') + C(184, 138, 20) + P('M164 128Q158 112 148 110Q160 106 170 114Q176 96 184 92Q192 96 198 114Q208 106 220 110Q210 112 204 128Z') + C(148, 110, 6.5) + C(184, 92, 6.5) + C(220, 110, 6.5) + C(165, 172, 7.5) + C(203, 172, 7.5);
      for (const x of [118, 184]) s += eye(x - 7, 136, 3.5) + eye(x + 7, 136, 3.5) + smile(x, 145, 5) + E(x - 12, 145, 6.5, 5) + E(x + 12, 145, 6.5, 5);
      s += B(24, 196, 252, 14, 6) + B(32, 210, 236, 70, 4) + P(starD(84, 244, 15, 7.8)) + P(heartD(150, 244, 13)) + P(starD(216, 244, 15, 7.8));
      for (const x of [60, 150, 240]) s += P(`M${x - 24} 290A24 24 0 0 1 ${x + 24} 290Z`) + D(`M${x - 8} 272q4 -6 8 -2q4 -6 8 0`);
      return s;
    };
    return [
      { id: 'a7-princess-swing', cat: 'princess', name: { en: 'Princess on a swing', fr: 'Princesse à la balançoire', es: 'Princesa en el columpio', de: 'Prinzessin auf der Schaukel', zh: '荡秋千的公主' }, svg: swing() },
      { id: 'a7-guinea-pigs', cat: 'animals', name: { en: 'Guinea pig snack time', fr: "Goûter des cochons d'Inde", es: 'Cobayas comiendo verdura', de: 'Meerschweinchen-Picknick', zh: '吃蔬菜的豚鼠' }, svg: guineaPigs() },
      { id: 'a7-telescope', cat: 'space', name: { en: 'Stargazing on a hill', fr: 'Observer les étoiles', es: 'Mirando las estrellas', de: 'Sterne beobachten', zh: '山顶看星星' }, svg: telescope() },
      { id: 'a7-princess-cookies', cat: 'princess', name: { en: 'Princess bakes cookies', fr: 'Biscuits de princesse', es: 'Galletas de princesa', de: 'Prinzessin backt Kekse', zh: '公主烤饼干' }, svg: cookies() },
      { id: 'a7-explorer', cat: 'fantasy', name: { en: 'Jungle explorer', fr: 'Explorateur de la jungle', es: 'Explorador de la selva', de: 'Dschungelforscher', zh: '丛林探险家' }, svg: explorer() },
      { id: 'a7-recycling-truck', cat: 'vehicles', name: { en: 'Recycling truck', fr: 'Camion de recyclage', es: 'Camión de reciclaje', de: 'Recyclingwagen', zh: '回收车' }, svg: truck() },
      { id: 'a7-tacos', cat: 'food', name: { en: 'Happy tacos', fr: 'Tacos rigolos', es: 'Tacos felices', de: 'Fröhliche Tacos', zh: '开心塔可' }, svg: tacos() },
      { id: 'a7-ballet-bunny', cat: 'princess', name: { en: 'Ballerina bunny', fr: 'Lapine ballerine', es: 'Conejita bailarina', de: 'Ballerina-Häschen', zh: '芭蕾小兔' }, svg: balletBunny() },
      { id: 'a7-basketball', cat: 'hobbies', name: { en: 'Basketball shot', fr: 'Panier de basket', es: 'Tiro de baloncesto', de: 'Basketballwurf', zh: '投篮' }, svg: basketball() },
      { id: 'a7-squid', cat: 'ocean', name: { en: 'Cute squid', fr: 'Calmar mignon', es: 'Calamar simpático', de: 'Süßer Tintenfisch', zh: '可爱鱿鱼' }, svg: squid() },
      { id: 'a7-book-dragon', cat: 'fantasy', name: { en: 'Bookworm dragon', fr: 'Dragon qui lit', es: 'Dragón lector', de: 'Leseratten-Drache', zh: '爱读书的龙' }, svg: bookDragon() },
      { id: 'a7-swan-boat', cat: 'princess', name: { en: 'Princess swan boat', fr: 'Barque cygne de princesse', es: 'Barca cisne de princesa', de: 'Prinzessin im Schwanboot', zh: '公主天鹅船' }, svg: swanBoat() },
      { id: 'a7-fireworks', cat: 'holidays', name: { en: 'New Year fireworks', fr: 'Feux du Nouvel An', es: 'Fuegos de Año Nuevo', de: 'Silvesterfeuerwerk', zh: '新年烟花' }, svg: fireworks() },
      { id: 'a7-camera', cat: 'hobbies', name: { en: 'Little photographer', fr: 'Petit photographe', es: 'Pequeño fotógrafo', de: 'Kleiner Fotograf', zh: '小摄影师' }, svg: camera() },
      { id: 'a7-island', cat: 'nature', name: { en: 'Tropical island', fr: 'Île tropicale', es: 'Isla tropical', de: 'Tropeninsel', zh: '热带小岛' }, svg: island() },
      { id: 'a7-heart-quilt', cat: 'patterns', name: { en: 'Heart quilt', fr: 'Courtepointe de cœurs', es: 'Colcha de corazones', de: 'Herzchen-Quilt', zh: '爱心拼布被' }, svg: quilt() },
      { id: 'a7-ankylosaurus', cat: 'dinosaurs', name: { en: 'Happy ankylosaurus', fr: 'Ankylosaure joyeux', es: 'Anquilosaurio feliz', de: 'Fröhlicher Ankylosaurus', zh: '快乐甲龙' }, svg: anky() },
      { id: 'a7-cable-car', cat: 'vehicles', name: { en: 'Mountain cable car', fr: 'Téléphérique', es: 'Teleférico', de: 'Seilbahn', zh: '高山缆车' }, svg: cableCar() },
      { id: 'a7-pillow-fort', cat: 'things', name: { en: 'Pillow fort', fr: 'Cabane en coussins', es: 'Fuerte de cojines', de: 'Kissenburg', zh: '枕头城堡' }, svg: fort() },
      { id: 'a7-veggie-garden', cat: 'nature', name: { en: 'Veggie garden', fr: 'Potager et épouvantail', es: 'Huerto y espantapájaros', de: 'Gemüsegarten', zh: '菜园和稻草人' }, svg: garden() },
      { id: 'a7-yeti', cat: 'fantasy', name: { en: 'Skiing yeti', fr: 'Yéti à ski', es: 'Yeti esquiador', de: 'Yeti auf Skiern', zh: '滑雪的雪怪' }, svg: yeti() },
      { id: 'a7-popcorn', cat: 'food', name: { en: 'Popcorn and tickets', fr: 'Pop-corn et tickets', es: 'Palomitas y entradas', de: 'Popcorn und Tickets', zh: '爆米花和电影票' }, svg: popcorn() },
      { id: 'a7-pool-party', cat: 'hobbies', name: { en: 'Pool party', fr: 'Fête à la piscine', es: 'Fiesta en la piscina', de: 'Poolparty', zh: '泳池派对' }, svg: pool() },
      { id: 'a7-valentine', cat: 'holidays', name: { en: 'Valentine mailbox', fr: 'Boîte aux lettres d\'amour', es: 'Buzón de San Valentín', de: 'Valentinsbriefkasten', zh: '情人节信箱' }, svg: valentine() },
      { id: 'a7-star-catcher', cat: 'space', name: { en: 'Star catcher', fr: 'Attrape-étoiles', es: 'Cazador de estrellas', de: 'Sternenfänger', zh: '捉星星' }, svg: starCatcher() },
      { id: 'a7-puppet-show', cat: 'things', name: { en: 'Puppet show', fr: 'Théâtre de guignol', es: 'Teatro de títeres', de: 'Puppentheater', zh: '木偶戏' }, svg: puppets() },
    ];
  });

  const [a, b] = parts, list = a.slice(0, 3);
  for (let i = 3, j = 0; i < a.length || j < b.length; i++, j++) {
    if (j < b.length) list.push(b[j]);
    if (i < a.length) list.push(a[i]);
  }
  Colouring.addPack(7, list);
})();
