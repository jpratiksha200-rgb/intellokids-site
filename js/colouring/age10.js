/* Colouring pictures for age 10: mandalas, detailed scenes and pattern art, 50â€“100 parts, stroke 2.
   Format: see Colouring.addPack in js/colouring.js. Regions = data-r fill="#fff"; decorations = INK or fill="none".
   The first 3 pictures are the ones open while IK_CONFIG.limits applies (one of them is an animal). Original art only.
   Drawn in two parts (each PART has its own helpers); display order = part A's first 3, then B and A interleaved.
   Once shipped, never reorder or insert regions inside a picture (saved drawings are index-based); add new pictures at the end. */
(function () {
  const INK = '#1F3A44';
  const parts = [];
  const PART = f => { parts.push(f()); };

  /* IntelloKids colouring – age 10, part A */
  PART(function () {
    const INK = '#1F3A44';
    const SW = 2;
    const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
    const R = `data-r fill="#fff" ${L}`;
    const T = `fill="none" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"`;
    const N = v => Math.round(v * 10) / 10;
    const rad = a => a * Math.PI / 180;
    // polar point, angle in degrees clockwise from "up"
    const pol = (cx, cy, r, a) => [N(cx + r * Math.sin(rad(a))), N(cy - r * Math.cos(rad(a)))];
    const P = (d, x) => `<path ${R} d="${d}"${x || ''}/>`;
    const C = (x, y, r) => `<circle ${R} cx="${N(x)}" cy="${N(y)}" r="${r}"/>`;
    const E = (x, y, rx, ry, a) => `<ellipse ${R} cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${a ? ` transform="rotate(${a} ${x} ${y})"` : ''}/>`;
    const Q = (x, y, w, h, r) => `<rect ${R} x="${x}" y="${y}" width="${w}" height="${h}"${r ? ` rx="${r}"` : ''}/>`;
    const D = d => `<path ${T} d="${d}"/>`;
    const K = d => `<path fill="${INK}" d="${d}"/>`;
    const dot = (x, y, r) => `<circle cx="${N(x)}" cy="${N(y)}" r="${r}" fill="${INK}"/>`;
    const eye = (x, y, r) => dot(x, y, r) + `<circle cx="${N(x + r * .35)}" cy="${N(y - r * .4)}" r="${N(r * .38)}" fill="#fff"/>`;
    const ring = (n, off, f) => { let s = ''; for (let i = 0; i < n; i++) s += f(off + 360 * i / n, i); return s; };
    // local shape: u runs along direction a (deg clockwise from up), v to its right
    const lp = (cx, cy, a, segs) => { const s = Math.sin(rad(a)), c = Math.cos(rad(a)); return segs.map(t => typeof t === 'string' ? t : N(cx + t[0] * s + t[1] * c) + ' ' + N(cy - t[0] * c + t[1] * s)).join(' '); };
    const LP = (cx, cy, a, segs) => P(lp(cx, cy, a, segs));
    // petal shapes in local coords (r1 inner, r2 outer, w half-width)
    const lens = (r1, r2, w) => { const l = r2 - r1; return ['M', [r1, 0], 'C', [r1 + l * .25, w], [r2 - l * .35, w], [r2, 0], 'C', [r2 - l * .35, -w], [r1 + l * .25, -w], [r1, 0], 'Z']; };
    const lotusP = (r1, r2, w) => { const l = r2 - r1; return ['M', [r1, 0], 'C', [r1, w], [r1 + l * .55, w * 1.1], [r2, 0], 'C', [r1 + l * .55, -w * 1.1], [r1, -w], [r1, 0], 'Z']; };
    const roundP = (r1, r2, w) => { const l = r2 - r1; return ['M', [r1, -w * .6], 'C', [r1 + l * .6, -w * 1.2], [r2, -w * .9], [r2, 0], 'C', [r2, w * .9], [r1 + l * .6, w * 1.2], [r1, w * .6], 'Z']; };
    const tear = (r1, r2, w) => { const l = r2 - r1; return ['M', [r1, 0], 'C', [r1 + l * .3, -w], [r2, -w * 1.1], [r2, 0], 'C', [r2, w * 1.1], [r1 + l * .3, w], [r1, 0], 'Z']; };
    // annular sector
    const sec = (cx, cy, r1, r2, a1, a2) => { const p = (r, a) => pol(cx, cy, r, a).join(' '), g = a2 - a1 > 180 ? 1 : 0; return `M${p(r2, a1)} A${r2} ${r2} 0 ${g} 1 ${p(r2, a2)} L${p(r1, a2)} A${r1} ${r1} 0 ${g} 0 ${p(r1, a1)}Z`; };
    // cubic bezier sampling
    const cub = (B, t) => { const u = 1 - t; return [0, 1].map(k => u * u * u * B[0][k] + 3 * u * u * t * B[1][k] + 3 * u * t * t * B[2][k] + t * t * t * B[3][k]); };
    const pt = p => N(p[0]) + ' ' + N(p[1]);
    // point + unit normal on a cubic; direction (deg clockwise from up) of a vector
    const nrm = (B, t) => { const p = cub(B, t), q = cub(B, Math.min(1, t + .001)), r = cub(B, Math.max(0, t - .001)), dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy); return [p, -dy / l, dx / l]; };
    const dirOf = (x, y) => Math.atan2(x, -y) * 180 / Math.PI;
    // band of a shape between two edge curves A and B (t1..t2), cross edges bulge by g
    const bandP = (A, B, t1, t2, g) => {
      const a = [], b = [], n = 6;
      for (let i = 0; i <= n; i++) { const t = t1 + (t2 - t1) * i / n; a.push(cub(A, t)); b.push(cub(B, t)); }
      const x = (p, q) => 'Q' + pt([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + g]) + ' ' + pt(q);
      return 'M' + a.map(pt).join(' L') + ' ' + x(a[n], b[n]) + ' L' + b.reverse().map(pt).join(' L') + ' ' + x(b[n], a[0]) + 'Z';
    };
    // split a cubic at t (exact), cubic path pieces, mirror in x
    const split = (B, t) => { const l = (a, b) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], p = l(B[0], B[1]), q = l(B[1], B[2]), r = l(B[2], B[3]), a = l(p, q), b = l(q, r), m = l(a, b); return [[B[0], p, a, m], [m, b, r, B[3]]]; };
    const cs = B => 'C' + B.slice(1).map(pt).join(' ');
    const mirB = B => B.map(p => [300 - p[0], p[1]]).reverse();
    const tAt = (B, k, v) => { let lo = 0, hi = 1, t = .5; for (let i = 0; i < 30; i++) { t = (lo + hi) / 2; (cub(B, t)[k] < v) === (cub(B, 1)[k] > cub(B, 0)[k]) ? lo = t : hi = t; } return t; };
    const across = (A, B, t, s, g) => { const p = cub(A, t), q = cub(B, t); return [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s + 2 * s * (1 - s) * g]; };
    // tube along a cubic: n segment regions, width w0 -> w1; sp = split line (-1..1) for two-tone segments
    const tube = (B, n, w0, w1, sp) => {
      const S = 3, side = (t, k) => { const e = .001, p = cub(B, t), q = cub(B, Math.min(1, t + e)), r = cub(B, Math.max(0, t - e)); const dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy), w = (w0 + (w1 - w0) * t) * k; return [p[0] - dy / l * w, p[1] + dx / l * w]; };
      let out = '';
      const poly = (a, b) => P('M' + a.map(pt).join(' L') + ' L' + b.reverse().map(pt).join(' L') + 'Z');
      for (let i = 0; i < n; i++) {
        const a = [], b = [], m = [];
        for (let j = 0; j <= S; j++) { const t = (i + j / S) / n; a.push(side(t, 1)); b.push(side(t, -1)); m.push(side(t, sp || 0)); }
        out += sp === undefined ? poly(a, b) : poly(a, m.slice()) + poly(m, b);
      }
      return out;
    };
    const spark = (x, y, r) => { const k = N(r * .2); return P(`M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z`); };
    const heart = (x, y, s) => P(`M${x} ${N(y + s * .9)}C${N(x - s * 1.5)} ${N(y - s * .1)} ${N(x - s * .8)} ${N(y - s * 1.1)} ${x} ${N(y - s * .4)}C${N(x + s * .8)} ${N(y - s * 1.1)} ${N(x + s * 1.5)} ${N(y - s * .1)} ${x} ${N(y + s * .9)}Z`);
    const leafPair = (x, y, a, l, w) => LP(x, y, a, ['M', [0, 0], 'C', [l * .3, w], [l * .75, w], [l, 0], 'Z']) + LP(x, y, a, ['M', [0, 0], 'C', [l * .3, -w], [l * .75, -w], [l, 0], 'Z']);

    /* 1 lotus mandala */
    const lotus = (() => {
      const c = 150, A = (a, sh) => LP(c, c, a, sh);
      let s = C(c, c, 143);
      s += ring(24, 0, a => C(...pol(c, c, 135, a), 6));
      s += ring(8, 22.5, a => A(a, lotusP(36, 140, 34)));
      s += ring(8, 0, a => A(a, lotusP(36, 128, 42)) + A(a, lotusP(56, 116, 24)) + A(a, tear(70, 104, 10)));
      s += ring(8, 22.5, a => A(a, lotusP(28, 86, 22)) + A(a, lotusP(40, 76, 11)));
      s += C(c, c, 40) + ring(10, 18, a => A(a, roundP(16, 37, 7))) + C(c, c, 15) + C(c, c, 7);
      return s;
    })();

    // stripe wedge on an ellipse edge (param angles t1..t2 in deg, dep = fraction towards the centre)
    const ew = (cx, cy, rx, ry, t1, t2, dep) => {
      const e = (t, k) => [cx + rx * Math.cos(rad(t)) * k, cy + ry * Math.sin(rad(t)) * k], m = (t1 + t2) / 2;
      return P(`M${pt(e(t1, 1))} A${rx} ${ry} 0 0 1 ${pt(e(t2, 1))} Q${pt(e(t2 + 2, 1 - dep * .5))} ${pt(e(m, 1 - dep))} Q${pt(e(t1 - 2, 1 - dep * .5))} ${pt(e(t1, 1))}Z`);
    };

    // two-tone tapering strand (hair lock, feather, flame) along cubic B, split lengthwise
    const strand = (B, w0, one) => {
      const A = [], Z = [], M = [];
      for (let i = 0; i <= 12; i++) {
        const u = i / 12, p = cub(B, u), q = cub(B, Math.min(1, u + .01)), r = cub(B, Math.max(0, u - .01)), dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy), w = w0 * Math.pow(1 - u, .7) * (.8 + .4 * Math.sin(Math.PI * u));
        M.push(p); A.push([p[0] - dy / l * w, p[1] + dx / l * w]); Z.push([p[0] + dy / l * w, p[1] - dx / l * w]);
      }
      const m = M.map(pt).join(' L');
      return one ? P('M' + A.map(pt).join(' L') + ' L' + Z.reverse().map(pt).join(' L') + 'Z') : P('M' + m + ' L' + A.reverse().map(pt).join(' L') + 'Z') + P('M' + m + ' L' + Z.reverse().map(pt).join(' L') + 'Z');
    };

    /* 2 zen unicorn */
    const unicorn = (() => {
      const Bk = [[128, 84], [112, 150], [104, 222], [94, 286]], Fr = [[176, 176], [168, 226], [250, 232], [236, 288]];
      let s = C(184, 132, 100);
      s += spark(272, 32, 14) + spark(272, 252, 14) + heart(256, 216, 11);
      // flowing mane: two-tone locks behind the neck, lowest first
      const lock = (t, c1, c2, e, w) => { const [x, y] = cub(Bk, t); return strand([[x + 12, y], [x + c1[0], y + c1[1]], [x + c2[0], y + c2[1]], [x + e[0], y + e[1]]], w); };
      s += lock(.95, [-20, -4], [-40, 22], [-64, 6], 12) + lock(.78, [-40, -4], [-40, 46], [-80, 40], 16) + lock(.6, [-44, -8], [-44, 46], [-86, 40], 17)
        + lock(.42, [-44, -8], [-46, 46], [-88, 38], 17) + lock(.24, [-44, -12], [-50, 40], [-92, 32], 17) + lock(.06, [-34, -30], [-74, -8], [-94, 30], 16);
      // neck sections with zentangle islands
      const ts = [0, .38, .58, .79, 1];
      for (let i = 0; i < 4; i++) s += P(bandP(Bk, Fr, ts[i], ts[i + 1], 12));
      [.2, .4, .6, .8].forEach(f => { s += C(...across(Bk, Fr, .48, f, 12), 8); });
      [.14, .3, .46, .62, .78].forEach(f => { const p = across(Bk, Fr, .685, f + .03, 12); s += P(lp(p[0], p[1] - 9, 180, roundP(0, 18, 9))); });
      [.22, .42, .62, .82].forEach(f => { const p = across(Bk, Fr, .89, f, 12); s += LP(p[0], p[1], 90, lens(-14, 14, 9)); });
      // ear
      s += P('M136 78 C130 54 140 34 152 20 C166 36 172 56 164 74 Z') + P('M143 68 C140 52 145 40 152 31 C160 42 163 54 159 66 Z');
      // head + muzzle
      s += P('M128 76 C146 56 178 56 196 72 C212 88 234 116 250 138 C266 160 264 190 242 194 C224 198 208 190 194 182 C176 186 158 182 150 170 C134 148 118 104 128 76 Z');
      s += P('M250 138 C266 160 264 190 242 194 C224 198 208 190 194 182 C212 172 236 160 250 138 Z');
      s += K('M244 158 q6 -3 7 4 q-5 2 -7 -4 Z') + D('M224 184 q8 5 16 1');
      // cheek flower, eye, blush
      s += ring(6, 0, a => LP(164, 136, a, roundP(6, 17, 7))) + C(164, 136, 6.5);
      s += `<path d="M198 104 Q210 116 222 104" ${L} fill="none"/>` + D('M201 109 l-5 5 M209 113 l-2 7 M217 111 l2 7') + E(216, 132, 10, 7);
      // horn with spiral bands
      const hl = 78, w = u => 15 * (1 - u / hl), hu = [0, 22, 40, 56];
      hu.forEach((u0, k) => {
        const u1 = hu[k + 1], a0 = k ? u0 - 4 : 0, b0 = k ? u0 + 4 : 0, a1 = u1 - 4, b1 = u1 + 4;
        s += LP(182, 74, 30, u1 ? ['M', [a0, -w(a0)], 'L', [a1, -w(a1)], 'L', [b1, w(b1)], 'L', [b0, w(b0)], 'Z'] : ['M', [a0, -w(a0)], 'L', [hl, 0], 'L', [b0, w(b0)], 'Z']);
      });
      // flower crown
      s += LP(132, 86, 228, lens(0, 30, 11)) + LP(208, 86, 122, lens(0, 28, 11));
      [[136, 76, 13], [161, 66, 12], [203, 80, 12]].forEach(([x, y, r]) => { s += C(x, y, r) + C(x, y, 6); });
      return s;
    })();

    /* 3 pattern tiger */
    const flower = (x, y, n, r1, r2, w, cr) => ring(n, 0, a => LP(x, y, a, roundP(r1, r2, w))) + C(x, y, cr);
    const tiger = (() => {
      const mir = ' transform="matrix(-1 0 0 1 300 0)"', hx = 150, hy = 134, rx = 100, ry = 86;
      let lf = leafPair(8, 292, 26, 88, 19) + leafPair(8, 292, 62, 80, 17) + flower(32, 266, 5, 6, 21, 10, 7) + leafPair(26, 28, 108, 58, 12) + leafPair(26, 28, 166, 58, 12) + flower(26, 28, 5, 5, 17, 9, 6);
      let s = lf + `<g${mir}>${lf}</g>`;
      // shoulders, front legs and paws, all with bold stripes
      const bst = (a, b, d) => ew(150, 296, 100, 92, a, b, d);
      s += P('M50 296 A100 92 0 0 1 250 296 Z') + bst(190, 202, .44) + bst(209, 221, .48) + bst(338, 350, .44) + bst(319, 331, .48);
      [105, 195].forEach(x => { s += Q(x - 28, 214, 56, 72, 24) + LP(x, 238, 90, lens(-25, 25, 8)) + LP(x, 257, 90, lens(-23, 23, 8)); });
      s += E(105, 280, 32, 14) + E(195, 280, 32, 14) + D('M93 294v-8M105 294v-8M117 294v-8M183 294v-8M195 294v-8M207 294v-8');
      // ears
      const ear = (l, w) => ['M', [-8, -w], 'C', [l * .45, -w * .85], [l * .85, -w * .3], [l, 0], 'C', [l * .85, w * .3], [l * .45, w * .85], [-8, w], 'Z'];
      [[82, -40], [218, 40]].forEach(([x, a]) => { s += LP(x, 76, a, ear(32, 26)) + LP(x, 76, a, ear(22, 14)); });
      // sideburn tufts
      let tf = strand([[96, 146], [68, 152], [48, 166], [28, 184]], 15, 1) + strand([[98, 166], [78, 180], [66, 198], [58, 220]], 14, 1);
      s += tf + `<g${mir}>${tf}</g>`;
      // head + stripes
      const st = (a, b, d) => ew(hx, hy, rx, ry, a, b, d);
      s += E(hx, hy, rx, ry);
      s += st(242, 257, .38) + st(283, 298, .38) + st(222, 235, .28) + st(305, 318, .28) + st(264, 276, .16);
      s += st(193, 208, .4) + st(175, 190, .46) + st(158, 172, .34) + st(332, 347, .4) + st(350, 365, .46) + st(8, 22, .34);
      // forehead "three bars", brows, eyes
      s += [[72, 25], [86, 20], [100, 14]].map(([y, l]) => LP(150, y, 90, lens(-l, l, 9))).join('');
      s += LP(112, 104, 72, lens(-18, 18, 8)) + LP(188, 104, 288, lens(-18, 18, 8));
      s += E(110, 130, 24, 18) + E(190, 130, 24, 18) + C(113, 138, 13) + C(187, 138, 13) + eye(114, 139, 8) + eye(186, 139, 8);
      // white mask, tongue, muzzle, nose
      s += P('M98 178 Q100 156 124 160 Q150 150 176 160 Q200 156 202 178 Q204 208 176 216 Q150 228 124 216 Q96 208 98 178 Z');
      s += C(150, 208, 10) + E(134, 188, 19, 16) + E(166, 188, 19, 16);
      s += P('M136 165 Q150 157 164 165 Q160 176 150 180 Q140 176 136 165 Z');
      s += dot(126, 186, 2) + dot(132, 193, 2) + dot(123, 194, 2) + dot(174, 186, 2) + dot(168, 193, 2) + dot(177, 194, 2);
      return s;
    })();

    const cloud = (x, y, s) => P(`M${x} ${y}q${N(-4 * s)} ${N(-18 * s)} ${N(16 * s)} ${N(-18 * s)}q${N(6 * s)} ${N(-16 * s)} ${N(26 * s)} ${N(-10 * s)}q${N(18 * s)} ${N(-6 * s)} ${N(24 * s)} ${N(12 * s)}q${N(16 * s)} ${N(2 * s)} ${N(12 * s)} ${N(16 * s)}z`);
    const arch = (x, y, w, h) => P(`M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`);
    const ground = y => P(`M8 ${y}H292V278Q292 292 278 292H22Q8 292 8 278Z`);
    // blossom: one scalloped region with an ink centre
    const bloss = (x, y, r, n = 5, a0 = 0, nd) => { let d = ''; for (let i = 0; i <= n; i++) { const p = pol(x, y, r * .72, a0 + i * 360 / n); d += i ? `A${N(r * .44)} ${N(r * .44)} 0 0 1 ${p.join(' ')}` : `M${p.join(' ')}`; } return P(d + 'Z') + (nd ? '' : dot(x, y, N(r * .2))); };

    /* 4 princess palace */
    const palace = (() => {
      let s = Q(8, 8, 284, 284, 14) + cloud(18, 62, .9) + cloud(216, 46, .9) + ground(170);
      [26, 240].forEach(x => { s += Q(x, 78, 34, 94) + P(`M${x - 4} 80C${x - 12} 62 ${x + 14} 56 ${x + 17} 34C${x + 20} 56 ${x + 46} 62 ${x + 38} 80Z`) + arch(x + 10, 94, 14, 26) + arch(x + 10, 130, 14, 26) + D(`M${x + 17} 34V14`) + P(`M${x + 17} 14l20 6l-20 6Z`); });
      [56, 196].forEach(x => { s += Q(x, 108, 48, 64) + Q(x - 4, 96, 56, 12, 3) + arch(x + 8, 120, 13, 30) + arch(x + 27, 120, 13, 30); });
      s += Q(100, 88, 100, 84) + Q(116, 68, 68, 22) + P('M110 72C98 50 140 44 150 22C160 44 202 50 190 72Z') + P('M150 22C162 44 170 58 166 72H134C130 58 138 44 150 22Z') + C(150, 18, 6);
      s += arch(122, 74, 10, 13) + arch(145, 74, 10, 13) + arch(168, 74, 10, 13);
      s += arch(110, 104, 16, 36) + arch(174, 104, 16, 36) + C(150, 99, 8) + P('M133 172V128A17 17 0 0 1 150 111V172Z') + P('M150 172V111A17 17 0 0 1 167 128V172Z');
      s += Q(124, 172, 52, 9) + Q(116, 181, 68, 9) + Q(108, 190, 84, 9) + Q(14, 176, 92, 20, 10) + Q(194, 176, 92, 20, 10);
      s += P('M108 199H192L234 292H66Z');
      [56, 244].forEach(x => { s += Q(x - 5, 222, 10, 22) + C(x, 210, 18) + P(`M${x - 13} 242h26l-4 20h-18Z`); });
      // fountain
      s += P('M84 240v16a66 14 0 0 0 132 0v-16Z') + E(150, 240, 66, 14) + Q(144, 204, 12, 38) + P('M118 208Q98 216 96 238Q106 226 124 212Z') + P('M182 208Q202 216 204 238Q194 226 176 212Z');
      s += P('M116 206a34 10 0 0 0 68 0Z') + Q(145, 186, 10, 20) + P('M134 186a16 8 0 0 0 32 0Z') + C(150, 179, 6);
      // flower beds
      [[14, [28, 52, 76]], [210, [224, 248, 272]]].forEach(([x, f]) => { s += Q(x, 266, 76, 22, 10); f.forEach(c => { s += bloss(c, 264, 12); }); });
      return s;
    })();

    /* 5 supercar */
    const wheel = (x, y) => C(x, y, 30) + C(x, y, 21) + ring(5, 0, a => P(sec(x, y, 8, 18, a + 11, a + 61))) + C(x, y, 6);
    const supercar = (() => {
      let s = Q(8, 8, 284, 222, 14) + cloud(18, 50, .8) + cloud(222, 36, .8);
      const sr = 58, cy = 82, chord = (y1, y2) => { const xa = Math.sqrt(sr * sr - (y1 - cy) ** 2), xb = Math.sqrt(sr * sr - (y2 - cy) ** 2); return P(`M${N(150 - xa)} ${y1}H${N(150 + xa)}A${sr} ${sr} 0 0 1 ${N(150 + xb)} ${y2}H${N(150 - xb)}A${sr} ${sr} 0 0 1 ${N(150 - xa)} ${y1}Z`); };
      s += chord(24, 88) + chord(96, 106) + chord(114, 124);
      [[14, 118, 26], [38, 94, 24], [62, 130, 26], [204, 100, 24], [230, 126, 22], [252, 90, 26]].forEach(([x, y, w], i) => { s += Q(x, y, w, 230 - y) + (i % 2 && w > 20 ? Q(x + 6, y + 12, w - 12, 14) : ''); });
      s += D('M50 94V78M265 90V72') + ground(226) + [18, 76, 134, 192, 250].map(x => Q(x, 272, 32, 10, 4)).join('');
      // car
      s += Q(8, 196, 16, 10, 4) + Q(32, 152, 10, 18) + P('M14 143H66L63 155H16Z');
      s += P('M20 212V184Q20 170 34 166L92 156Q122 128 168 126Q198 126 226 150L266 160Q282 166 280 186V204Q280 212 272 212Z');
      s += P('M104 158Q126 138 160 134L164 158Z') + P('M172 134Q196 136 214 152L176 158Z') + P('M212 148l12-6 4 9-12 4Z');
      s += P('M96 176L124 170L120 196H100Z') + P('M130 162H174L182 204H136Z') + C(158, 182, 13) + D('M152 175h12l-7 15');
      s += P('M240 164L270 170L268 180L238 174Z') + Q(20, 174, 12, 10, 3);
      s += P('M44 212A40 40 0 0 1 124 212Z') + P('M182 212A40 40 0 0 1 262 212Z') + wheel(84, 214) + wheel(222, 214);
      return s;
    })();

    /* 6 kawaii ramen */
    const ringP = (x, y, r1, r2) => `<path ${R} fill-rule="evenodd" d="M${x - r2} ${y}a${r2} ${r2} 0 1 0 ${2 * r2} 0a${r2} ${r2} 0 1 0 ${-2 * r2} 0ZM${x - r1} ${y}a${r1} ${r1} 0 1 0 ${2 * r1} 0a${r1} ${r1} 0 1 0 ${-2 * r1} 0Z"/>`;
    const onion = (x, y) => ringP(x, y, 3.5, 9);
    const rot = (el, a, x, y) => el.replace('/>', ` transform="rotate(${a} ${x} ${y})"/>`);
    const ramen = (() => {
      const BL = [[26, 128], [28, 214], [84, 262], [150, 262]], [up, dn] = split(BL, tAt(BL, 1, 214));
      let s = Q(14, 234, 272, 58, 12) + [[44, 240], [232, 240], [20, 264], [68, 264], [208, 264], [256, 264]].map(([x, y]) => Q(x, y, 24, 22, 3)).join('');
      s += strand([[44, 100], [28, 74], [58, 56], [40, 22]], 9, 1) + strand([[172, 84], [156, 60], [186, 44], [170, 16]], 9, 1);
      s += rot(Q(235, 10, 10, 120, 4), 28, 240, 70) + rot(Q(251, 16, 10, 120, 4), 28, 256, 76);
      s += P('M112 246h76l-6 32h-64Z') + P('M' + pt(up[0]) + cs(up) + 'L' + pt([300 - up[3][0], up[3][1]]) + cs(mirB(up)) + 'Z') + P('M' + pt(dn[0]) + cs(dn) + cs(mirB(dn)) + 'Z');
      [[80, 228], [104, 234], [127, 237], [150, 238], [173, 237], [196, 234], [220, 228]].forEach(([x, y]) => { s += C(x, y, 8); });
      s += eye(112, 190, 6) + eye(188, 190, 6) + D('M140 194q10 10 20 0') + E(92, 202, 11, 7) + E(208, 202, 11, 7);
      s += `<path ${R} fill-rule="evenodd" d="M26 128a124 46 0 1 0 248 0a124 46 0 1 0 -248 0ZM38 128a112 38 0 1 0 224 0a112 38 0 1 0 -224 0Z"/>` + E(150, 128, 112, 38);
      s += rot(Q(66, 50, 30, 64, 2), -14, 81, 82) + rot(Q(98, 44, 30, 64, 2), -4, 113, 76);
      [0, 1, 2, 3, 4].forEach(k => { const t = [], b = []; for (let x = 48 + k * 5; x <= 140 + k * 4; x += 4) { const y = 114 + k * 10 + 4.5 * Math.sin(x / 22 * 2 * Math.PI); t.push([x, y - 4.6]); b.push([x, y + 4.6]); } s += P('M' + t.map(pt).join('L') + 'L' + b.reverse().map(pt).join('L') + 'Z'); });
      s += E(160, 104, 22, 15, -8) + E(160, 104, 13, 8, -8) + E(198, 100, 22, 15, 6) + E(198, 100, 13, 8, 6);
      s += E(234, 124, 23, 17, 10) + C(232, 125, 9) + E(200, 142, 23, 17, -10) + C(202, 143, 9);
      s += C(156, 144, 17) + C(156, 144, 9) + D('M156 144m-4 0a4 4 0 1 1 4 4');
      [[136, 116], [226, 152], [178, 124], [84, 94], [122, 160], [180, 160], [252, 140]].forEach(([x, y]) => { s += onion(x, y); });
      [[236, 98], [247, 104], [235, 110], [224, 102], [248, 116], [258, 108]].forEach(([x, y]) => { s += C(x, y, 5.5); });
      return s;
    })();

    /* 7 koi pond */
    // rotated ellipse as a path (no transform, so its box is exact)
    const ell = (x, y, rx, ry, a) => { const c = Math.cos(rad(a)) * rx, s = Math.sin(rad(a)) * rx, p = pt([x - c, y - s]), q = pt([x + c, y + s]); return P(`M${p}A${rx} ${ry} ${N(a)} 1 0 ${q}A${rx} ${ry} ${N(a)} 1 0 ${p}Z`); };
    const koi = ang => {
      const hd = pol(150, 150, 78, ang), tl = pol(150, 150, 72, ang - 78), d = (p, r, a) => [p[0] + r * Math.sin(rad(a)), p[1] - r * Math.cos(rad(a))];
      const B = [hd, d(hd, 40, ang - 90), d(tl, 40, ang + 12), tl], at = u => { const [p, nx, ny] = nrm(B, u); return [p, dirOf(ny, -nx)]; };
      const wf = u => 19 * (u < .26 ? Math.sqrt(1 - ((.26 - u) / .26) ** 2) : 1 - .74 * ((u - .26) / .74) ** 1.2), A = [], Z = [];
      for (let i = 0; i <= 22; i++) { const u = (i / 22) ** 1.4, [p, nx, ny] = nrm(B, u), w = wf(u); A.push([p[0] + nx * w, p[1] + ny * w]); Z.push([p[0] - nx * w, p[1] - ny * w]); }
      const [tp, ta] = at(.995), [fp, fa] = at(.3), [hp, ha] = at(.07);
      let s = LP(...tp, ta + 26, lens(-2, 34, 13)) + LP(...tp, ta - 26, lens(-2, 34, 13)) + LP(...fp, fa + 118, roundP(8, 30, 11)) + LP(...fp, fa - 118, roundP(8, 30, 11));
      s += P('M' + A.map(pt).join(' L') + ' L' + Z.reverse().map(pt).join(' L') + 'Z');
      [[.2, 9, 8], [.46, 14, 10], [.72, 10, 6]].forEach(([u, l, w], i) => { const [p, a] = at(u); s += LP(p[0], p[1], a + (i - 1) * 8, lens(-l, l, w)); });
      s += eye(...d(hp, 9, ha - 100), 2.6) + eye(...d(hp, 9, ha + 100), 2.6);
      return s;
    };
    const lily = (x, y, r, a) => P(`M${x} ${y}L${pol(x, y, r, a).join(' ')}A${r} ${r} 0 1 0 ${pol(x, y, r, a + 36).join(' ')}Z`);
    const koiPond = (() => {
      let s = C(150, 150, 130) + ring(20, 0, a => ell(...pol(150, 150, 137, a), 20, 9, a));
      s += ringP(150, 150, 34, 46);
      s += lily(150, 150, 34, 150) + ring(6, 0, a => LP(150, 150, a, lens(4, 24, 10))) + C(150, 150, 7);
      s += lily(202, 60, 20, 200) + lily(201, 238, 21, 300) + lily(48, 150, 20, 100) + ring(6, 30, a => LP(201, 238, a, lens(3, 19, 9))) + C(201, 238, 6);
      s += koi(10) + koi(130) + koi(250);
      return s;
    })();

    /* 8 eastern dragon */
    const dragon = (() => {
      const S = [[[100, 92], [56, 116], [62, 172], [132, 168]], [[132, 168], [196, 164], [270, 150], [264, 204]], [[264, 204], [258, 250], [170, 226], [116, 246]], [[116, 246], [80, 258], [40, 286], [22, 256]]];
      const W = [[15, 18], [18, 18], [18, 14], [14, 5]], NS = [4, 6, 6, 5];
      let s = cloud(10, 40, .6) + cloud(8, 226, .7) + cloud(140, 214, .9) + cloud(212, 290, 1);
      s += ringP(250, 52, 16, 24) + C(250, 52, 16) + D('M242 46q3 -6 9 -7') + spark(212, 22, 11) + spark(282, 98, 11);
      // rounded fins along the back, legs, tail tuft (behind the body)
      S.forEach((B, i) => { for (let k = 1; k <= NS[i] - (i % 2); k++) { const t = (k - .5) / NS[i], [p, nx, ny] = nrm(B, t), w = W[i][0] + (W[i][1] - W[i][0]) * t; if (w > 8) s += LP(p[0] - nx * w * .6, p[1] - ny * w * .6, dirOf(-nx, -ny), ['M', [0, -10], 'C', [10, -10], [22, -4], [26, 8], 'C', [16, 4], [8, 8], [0, 10], 'Z']); } });
      [[0, .88], [1, .38]].forEach(([i, t]) => { const [p, nx, ny] = nrm(S[i], t), x = N(p[0] + nx * 8), y = N(p[1] + ny * 8); s += P(`M${x - 9} ${y}C${x - 10} ${y + 14} ${x - 6} ${y + 24} ${x - 2} ${y + 28}H${x + 12}C${x + 8} ${y + 18} ${x + 10} ${y + 8} ${x + 9} ${y}Z`) + E(x + 5, y + 31, 12, 7) + D(`M${x + 1} ${y + 38}v-4M${x + 9} ${y + 38}v-4`); });
      s += strand([[24, 258], [12, 240], [26, 226], [16, 208]], 9) + strand([[24, 258], [36, 240], [48, 238], [56, 220]], 8, 1);
      S.slice().reverse().forEach((B, j) => { const i = 3 - j; s += tube(B, NS[i], W[i][0], W[i][1], .35); });
      // mane, horns, head
      s += strand([[92, 62], [70, 50], [54, 60], [32, 52]], 10, 1) + strand([[90, 80], [66, 78], [52, 92], [28, 92]], 10, 1);
      s += strand([[112, 44], [106, 26], [94, 16], [78, 12]], 8, 1) + strand([[100, 48], [88, 32], [74, 28], [60, 30]], 7, 1);
      s += P('M86 70C86 46 108 36 130 40C146 42 156 50 166 52C182 54 196 60 196 74C196 88 182 94 168 94C152 96 136 100 118 100C98 100 86 88 86 70Z');
      s += E(188, 68, 13, 11) + dot(192, 63, 2) + dot(183, 62, 2) + strand([[112, 52], [120, 43], [134, 43], [144, 50]], 5, 1) + E(128, 64, 11, 10) + eye(131, 65, 6) + E(152, 80, 8, 5);
      s += D('M158 90q14 8 30 -2M196 78C216 88 212 106 228 104M194 60C206 46 216 52 226 40') + strand([[130, 98], [126, 112], [136, 120], [128, 134]], 7, 1);
      return s;
    })();

    const star = (x, y, ro, ri, n, a0 = 0) => { let d = ''; for (let i = 0; i < 2 * n; i++) d += (i ? 'L' : 'M') + pol(x, y, i % 2 ? ri : ro, a0 + 180 * i / n).join(' '); return P(d + 'Z'); };
    const fan = (x, y, r, a1, a2, n) => { let d = `M${x} ${y}`; for (let i = 0; i <= n; i++) d += (i ? `A${N(r * .23)} ${N(r * .23)} 0 0 1 ` : 'L') + pol(x, y, r, a1 + (a2 - a1) * i / n).join(' '); return P(d + 'Z') + D(Array.from({ length: n - 1 }, (_, i) => 'M' + pol(x, y, 4, 0).join(' ') + 'L' + pol(x, y, r * .78, a1 + (a2 - a1) * (i + 1) / n).join(' ')).join('')); };

    /* 9 mermaid mandala */
    const mermaid = (() => {
      const c = 150;
      let s = C(c, c, 143) + ring(16, 0, a => LP(c, c, a, roundP(112, 143, 21)) + D(lp(c, c, a, ['M', [121, -8], 'Q', [137, -12], [135, 2], 'Q', [133, 9], [126, 4]]))) + ring(16, 11.25, a => C(...pol(c, c, 112, a), 7)) + C(c, c, 104);
      s += strand([[74, 252], [54, 220], [82, 196], [62, 164]], 9, 1) + strand([[92, 256], [104, 226], [80, 204], [98, 180]], 8, 1) + star(80, 226, 17, 8, 5, 10) + fan(122, 252, 22, -60, 60, 5);
      s += strand([[164, 88], [198, 84], [204, 120], [234, 130]], 12) + strand([[166, 104], [190, 114], [194, 140], [216, 152]], 10);
      s += LP(228, 182, -30, lens(-8, 40, 14)) + LP(228, 182, 30, lens(-8, 40, 14)) + tube([[146, 168], [138, 238], [222, 254], [228, 180]], 7, 21, 9, 0);
      s += P('M134 120Q150 112 166 120L160 168H140Z') + E(150, 168, 26, 9);
      [142, 158].forEach(x => { s += P(`M${x} 140L${x - 9} 128Q${x} 120 ${x + 9} 128Z`); });
      s += tube([[134, 124], [118, 112], [110, 94], [108, 80]], 1, 5, 4) + tube([[166, 124], [182, 136], [180, 152], [166, 160]], 1, 5, 4) + C(108, 78, 6) + C(108, 62, 9);
      s += Q(145, 106, 10, 14) + C(150, 94, 19) + P('M131 96C128 66 172 66 169 96C164 82 136 82 131 96Z') + P('M138 77L141 64L147 72L150 59L153 72L159 64L162 77Q150 73 138 77Z');
      s += eye(143, 96, 3) + eye(157, 96, 3) + D('M144 104q6 5 12 0') + E(137, 103, 6, 4.5) + E(163, 103, 6, 4.5);
      return s;
    })();

    /* 10 butterfly mandala */
    const butterfly = (() => {
      const c = 150, UW = [[147, 142], [128, 110], [100, 58], [70, 60], [44, 62], [32, 88], [42, 108], [52, 128], [92, 144], [147, 142]],
        LW = [[147, 156], [120, 160], [68, 160], [58, 196], [52, 226], [76, 250], [100, 240], [122, 230], [140, 196], [147, 156]];
      let s = C(c, c, 143) + ring(24, 7.5, a => LP(c, c, a, roundP(120, 143, 14))) + C(c, c, 122);
      const wing = (W, ce, ks, spots, mx) => {
        const tr = (p, k) => { const q = [ce[0] + (p[0] - ce[0]) * k, ce[1] + (p[1] - ce[1]) * k]; return mx ? [300 - q[0], q[1]] : q; };
        let o = ks.map(k => { let d = 'M' + pt(tr(W[0], k)); for (let i = 1; i < W.length; i += 3) d += 'C' + [W[i], W[i + 1], W[i + 2]].map(p => pt(tr(p, k))).join(' '); return P(d + 'Z'); }).join('');
        spots.forEach(([g, t]) => { const q = tr(cub(W.slice(g * 3, g * 3 + 4), t), .86); o += C(q[0], q[1], 6); });
        const e = tr(ce, 1); return o + C(e[0], e[1], 10) + dot(e[0], e[1], 3.5);
      };
      [0, 1].forEach(m => { s += wing(UW, [88, 100], [1, .72, .42], [[0, .55], [0, .85], [1, .3], [1, .7], [2, .25]], m) + wing(LW, [100, 202], [1, .7, .38], [[0, .65], [1, .3], [1, .7]], m); });
      s += D('M146 108Q136 94 134 80M154 108Q164 94 166 80') + C(134, 78, 6) + C(166, 78, 6);
      s += [[204, 5.5, 7], [191, 6.5, 8], [176, 7.5, 8], [160, 8, 9]].map(([y, rx, ry]) => E(150, y, rx, ry)).join('') + E(150, 138, 10, 16) + C(150, 116, 10);
      return s;
    })();

    /* 11 parasaurolophus in the jungle */
    const para = (() => {
      let s = Q(8, 8, 284, 284, 14) + C(262, 40, 18) + P('M8 176L54 116L92 150L140 98L196 158L240 118L292 164V214H8Z') + P('M8 196L40 170L80 190L126 160L170 192L222 168L292 196V214H8Z') + ground(212);
      // tree fern behind the tail
      [-45, -20, 5, 30].forEach(a => { s += strand([[60, 118], pol(60, 118, 28, a), pol(60, 110, 50, a * 1.15), pol(60, 118, 64, a * 1.25)], 10); });
      [[256, 214, -30], [270, 214, -4], [282, 212, 14]].forEach(([x, y, a]) => { s += strand([[x, y], ...[.4, .75, 1].map(k => pol(x, y, 62 * k, a - 10 * k))], 10, 1); });
      // far legs, body + thick tail, near legs (sturdy, with hoof-like feet)
      const foot = (x, w) => P(`M${x} 264V256Q${x} 248 ${x + 8} 248H${x + w - 8}Q${x + w} 248 ${x + w} 256V264Z`) + D(`M${x + w / 3} 264v-6M${x + 2 * w / 3} 264v-6`);
      s += P('M140 168C138 198 146 226 148 250H172C170 226 172 198 174 174Z') + foot(142, 34) + P('M176 166C178 194 182 222 182 250H196C196 222 196 194 194 168Z') + foot(176, 24);
      s += P('M196 150C194 186 202 222 202 250H220C220 222 222 186 220 146Z') + foot(198, 26);
      s += P('M12 128C50 118 86 98 122 96C156 94 180 104 196 106C204 100 208 94 212 90L236 100C232 118 224 138 214 156C206 172 186 182 160 182C130 182 106 176 92 160C70 148 40 136 12 128Z');
      [[44, 128, 7], [64, 128, 11], [86, 124, 13]].forEach(([x, y, l]) => { s += LP(x, y, 0, lens(-l, l, 7)); });
      [[104, 106], [128, 104], [152, 104], [176, 108]].forEach(([x, y]) => { s += C(x, y + 6, 7.5); });
      s += LP(206, 120, 30, lens(-10, 10, 6)) + LP(210, 136, 30, lens(-10, 10, 6));
      s += P('M98 168C94 200 104 228 104 250H134C130 228 136 200 142 176Z') + E(118, 148, 34, 28) + ring(5, 0, a => LP(118, 148, a, lens(6, 24, 7))) + C(118, 148, 6) + foot(96, 42);
      s += [[164, 138], [186, 140]].map(([x, y]) => LP(x, y, 0, lens(-12, 12, 8))).join('');
      // long tube crest sweeping back from the skull, duck-billed head
      s += tube([[232, 80], [208, 62], [176, 52], [146, 54]], 4, 8, 7) + C(146, 54, 7);
      s += P('M204 94C206 78 222 70 240 74C252 77 262 85 272 90C282 94 284 106 276 110C264 114 250 112 238 114C224 116 210 112 204 104Z');
      s += P('M256 84C266 86 276 90 280 96C284 104 280 110 272 111C262 112 254 110 248 110C252 102 254 92 256 84Z');
      s += eye(234, 88, 4.5) + D('M240 106q8 3 14 -1') + dot(270, 94, 1.8);
      // flowers, foreground leaves
      s += bloss(156, 276, 13) + bloss(184, 284, 12) + bloss(240, 274, 13) + bloss(68, 232, 12);
      s += leafPair(8, 290, 30, 90, 18) + leafPair(8, 290, 70, 80, 16) + leafPair(288, 288, -40, 84, 18);
      return s;
    })();

    /* 12 music studio */
    const note = (x, y) => D(`M${x + 7} ${y - 2}V${y - 30}q8 6 12 14`) + ell(x, y, 8.5, 6.5, -20);
    const studio = (() => {
      let s = Q(8, 8, 284, 284, 14);
      [18, 210].forEach(x => { for (let i = 0; i < 6; i++) s += Q(x + (i % 3) * 24, 16 + (i > 2) * 24, 22, 22, 3); });
      s += note(110, 52) + note(196, 40) + note(236, 76);
      s += P('M8 184H292V242H8Z') + P('M8 242H292V278Q292 292 278 292H22Q8 292 8 278Z') + Q(24, 250, 70, 34, 5) + Q(206, 250, 70, 34, 5) + dot(59, 267, 3) + dot(241, 267, 3);
      [18, 224].forEach(x => { s += Q(x, 94, 58, 92, 6) + C(x + 29, 114, 9) + ringP(x + 29, 154, 10, 21) + C(x + 29, 154, 10); });
      // microphone + pop filter
      s += D('M118 118Q130 134 145 142') + ringP(104, 100, 16, 22) + C(104, 100, 16);
      s += Q(145, 132, 10, 46) + P('M120 190Q120 178 134 178H166Q180 178 180 190Z') + Q(130, 62, 40, 72, 20) + P('M130 98V82A20 20 0 0 1 170 82V98Z') + Q(130, 98, 40, 11);
      // keyboard
      s += Q(70, 192, 160, 48, 6) + [100, 150, 200].map(x => C(x, 199, 5.5)).join('');
      for (let i = 0; i < 10; i++) s += Q(75 + i * 15, 206, 15, 30, 2);
      [1, 2, 4, 5, 6, 8, 9].forEach(i => { s += Q(75 + i * 15 - 4.5, 206, 9, 18, 2); });
      // headphones on the desk, plant
      s += P('M18 222Q18 194 40 194Q62 194 62 222H54Q54 203 40 203Q26 203 26 222Z') + Q(12, 212, 16, 26, 7) + Q(52, 212, 16, 26, 7) + Q(20, 216, 10, 18, 4) + Q(50, 216, 10, 18, 4);
      s += strand([[258, 214], [244, 196], [250, 180], [238, 166]], 9, 1) + strand([[262, 214], [268, 194], [282, 186], [284, 168]], 9, 1) + strand([[260, 214], [258, 192], [262, 176], [258, 158]], 8, 1) + P('M244 210H278L274 238H248Z');
      return s;
    })();

    /* 13 pattern horse */
    const horse = (() => {
      let s = ring(12, 0, a => LP(236, 58, a, lens(30, 50, 9))) + C(236, 58, 28) + ground(270);
      [[30, 286], [170, 288], [196, 280], [282, 284]].forEach(([x, y]) => { s += bloss(x, y, 13); });
      s += strand([[254, 124], [284, 130], [292, 180], [274, 228]], 14) + strand([[256, 134], [274, 162], [270, 204], [288, 244]], 12);
      // far legs
      s += tube([[130, 180], [118, 194], [106, 202], [96, 208]], 1, 8, 7) + tube([[98, 204], [94, 216], [96, 226], [102, 234]], 1, 6, 6) + P('M92 234l18-5 4 11-18 5Z');
      s += P('M206 188C206 214 214 240 216 268H232C230 240 232 214 230 190Z') + P('M214 266H234L236 282H212Z');
      // ear, body silhouette, near hooves
      s += P('M82 52L90 26L101 50Z');
      s += P('M34 104C30 92 34 80 44 74C54 64 62 54 70 50C76 46 84 44 90 48C110 60 128 92 150 108C180 112 210 104 236 112C256 118 262 140 258 160C254 180 250 200 256 222L258 270H240L240 232C236 212 226 196 214 190C190 196 160 198 140 192C138 220 136 250 138 270H120C120 248 118 214 114 186C106 170 100 150 100 132C98 120 86 108 76 106C64 106 56 112 46 112C40 112 36 108 34 104Z');
      s += P('M118 268H140L142 282H116Z') + P('M238 268H260L262 282H236Z') + Q(122, 250, 14, 14, 4) + Q(242, 250, 14, 14, 4);
      // zentangle islands: blanket, flower on the hip, leaves on the neck, dots on the chest
      s += P('M152 114C172 118 198 116 214 112L210 158C190 164 164 164 148 158Z') + [156, 168, 180, 192, 204].map((x, i) => C(x, 168 - (i === 0 || i === 4 ? 4 : 2), 6)).join('') + bloss(181, 136, 22, 6);
      s += ring(6, 0, a => LP(230, 150, a, roundP(7, 22, 8))) + C(230, 150, 7);
      [[100, 76, 40], [114, 96, 40], [126, 116, 40]].forEach(([x, y, a]) => { s += LP(x, y, a, lens(-11, 11, 8)); });
      s += C(108, 140, 5.5) + C(112, 156, 5.5) + C(118, 172, 5.5);
      // mane, forelock, face
      const CR = [[90, 48], [110, 60], [128, 92], [150, 108]];
      [0, .22, .44, .66, .86].forEach(t => { const p = cub(CR, t); s += strand([p, [p[0] + 16, p[1] + 2], [p[0] + 16, p[1] + 26], [p[0] + 30, p[1] + 36]], 12); });
      s += strand([[90, 48], [80, 50], [72, 58], [70, 72]], 8, 1) + eye(64, 70, 4) + D('M58 66l-4-3M61 63l-2-4') + K('M38 94q5-2 6 3q-5 1-6-3Z') + D('M37 108q5 2 10-1');
      return s;
    })();

    /* 14 ballerina with ribbons */
    const dancer = (() => {
      let s = C(150, 146, 128);
      [[30, 268, 14], [270, 268, 14], [34, 66, 13], [266, 66, 13], [62, 232, 11], [238, 232, 11]].forEach(([x, y, r], i) => { s += (i < 2 ? LP(x, y, i % 2 ? 300 : 60, lens(6, 36, 10)) : '') + bloss(x, y, r); });
      // ribbons (two cubic pieces per side)
      [0, 1].forEach(m => { const X = p => [m ? 300 - p[0] : p[0], p[1]]; s += tube([[188, 36], [262, 18], [292, 118], [232, 166]].map(X), 4, 6, 6) + tube([[232, 166], [184, 202], [258, 246], [206, 278]].map(X), 4, 6, 5); });
      // arms, tutu, legs
      s += tube([[140, 94], [124, 82], [114, 62], [112, 40]], 1, 5, 4) + tube([[160, 94], [176, 82], [186, 62], [188, 40]], 1, 5, 4) + C(112, 37, 6) + C(188, 37, 6);
      s += E(150, 276, 40, 8) + tube([[148, 176], [148, 210], [150, 240], [150, 262]], 1, 6, 4) + P('M146 258h8l-1 15h-6Z');
      s += tube([[156, 178], [170, 196], [180, 206], [186, 216]], 1, 6, 5) + tube([[186, 214], [176, 224], [164, 230], [154, 232]], 1, 5, 4);
      s += ring(8, 0, (a, i) => LP(150, 128, 96 + i * 24, roundP(10, 60, 15))) + ring(7, 0, (a, i) => LP(150, 128, 108 + i * 24, roundP(8, 42, 13)));
      // bodice, neck, head, bun
      s += P('M138 92Q150 88 162 92L158 130H142Z') + Q(145, 78, 10, 14) + C(150, 46, 10) + C(150, 66, 15) + P('M135 66C134 48 166 48 165 66C160 56 140 56 135 66Z');
      s += D('M141 68q3 3 6 0M153 68q3 3 6 0M145 75q5 4 10 0');
      return s;
    })();

    /* 15 future city */
    const fcar = (x, y, k) => { const p = (u, v) => N(x + u * k) + ' ' + N(y + v); return LP(x - 24 * k, y + 1, k > 0 ? 270 : 90, lens(0, 20, 7)) + P(`M${p(-26, -4)}L${p(-24, 6)}Q${p(-20, 10)} ${p(-10, 10)}L${p(12, 10)}Q${p(26, 8)} ${p(30, -2)}Q${p(30, -8)} ${p(24, -8)}L${p(-22, -8)}Q${p(-26, -8)} ${p(-26, -4)}Z`) + P(`M${p(-14, -8)}Q${p(-10, -22)} ${p(6, -20)}L${p(12, -8)}Z`) + D(`M${p(-48, -2)}h${-12 * k}M${p(-46, 6)}h${-8 * k}`); };
    const city = (() => {
      let s = Q(8, 8, 284, 284, 14) + P('M58 26A26 26 0 1 0 84 64A20 20 0 1 1 58 26Z') + spark(122, 24, 10) + spark(270, 30, 10) + spark(200, 54, 9) + spark(30, 104, 9);
      const win = (x, y, c, r) => { let o = ''; for (let i = 0; i < c * r; i++) o += Q(x + (i % c) * 16, y + Math.floor(i / c) * 20, 10, 12, 2); return o; };
      s += Q(16, 124, 44, 120) + P('M16 124A22 18 0 0 1 60 124Z') + win(24, 136, 2, 4);
      s += Q(89, 84, 12, 160) + E(95, 98, 24, 7) + C(95, 72, 9);
      s += P('M120 244V70L145 34L170 70V244Z') + win(129, 80, 2, 6);
      s += Q(186, 110, 42, 134) + P('M186 110Q207 84 228 110Z') + win(194, 124, 2, 4);
      s += Q(242, 146, 42, 98, 6) + win(250, 158, 2, 3) + C(263, 132, 11);
      s += P('M8 250H292V278Q292 292 278 292H22Q8 292 8 278Z') + [40, 150, 260].map(x => Q(x - 7, 244, 14, 34)).join('') + Q(8, 232, 284, 14, 4);
      s += P('M100 232Q100 214 118 214H186Q204 214 204 232Z') + [120, 144, 168].map(x => Q(x, 219, 16, 9, 3)).join('');
      s += fcar(98, 150, 1) + fcar(226, 86, -1);
      return s;
    })();

    /* 16 macaron tower */
    const bunting = (n, y0, dy) => D(`M8 ${y0}Q150 ${y0 + 2 * dy} 292 ${y0}`) + Array.from({ length: n }, (_, i) => { const x = 8 + 284 * (i + .5) / n, t = (x - 8) / 284, y = N(y0 + 2 * dy * t * (1 - t)); return P(`M${N(x - 12)} ${y}H${N(x + 12)}L${N(x)} ${y + 22}Z`); }).join('');
    const macarons = (() => {
      let s = Q(8, 8, 284, 284, 14) + bunting(7, 24, 16) + P('M8 262H292V278Q292 292 278 292H22Q8 292 8 278Z');
      s += E(150, 270, 28, 6) + E(150, 252, 92, 9);
      [5, 4, 3, 2, 1].forEach((n, j) => { const y = 230 - j * 32; for (let i = 0; i < n; i++) { const x = 150 + (i - (n - 1) / 2) * 37; s += Q(x - 17, y - 15, 34, 11, 5) + Q(x - 16, y - 4, 32, 8, 3) + Q(x - 17, y + 4, 34, 11, 5); } });
      s += heart(150, 76, 13);
      s += P('M12 240H66L60 262H18Z') + E(39, 240, 27, 7) + C(28, 234, 6.5) + C(40, 230, 6.5) + C(52, 235, 6.5) + LP(44, 224, 30, lens(0, 15, 6));
      s += Q(240, 214, 48, 12, 5) + Q(240, 226, 48, 12) + Q(240, 238, 48, 10) + Q(240, 248, 48, 14) + C(264, 206, 8);
      return s;
    })();

    /* 17 pixel skyline */
    const pixel = (() => {
      const cell = (c, r, w = 1, h = 1) => Q(10 + c * 10, 10 + r * 10, w * 10, h * 10);
      let s = Q(10, 10, 280, 280) + P('M220 20h40v10h10v10h10v40h-10v10h-10v10h-40v-10h-10v-10h-10v-40h10v-10h10Z') + cell(21, 3) + cell(24, 6) + cell(21, 7);
      [[30, 40], [90, 26], [150, 58], [176, 34], [60, 96], [150, 100]].forEach(([x, y]) => { s += P(`M${x - 3.5} ${y - 10.5}h7v7h7v7h-7v7h-7v-7h-7v-7h7Z`); });
      [[0, 4, 12], [4, 3, 16], [7, 5, 7], [12, 4, 14], [16, 5, 10], [21, 3, 15], [24, 4, 11]].forEach(([c, w, t]) => {
        s += cell(c, t, w, 24 - t);
        for (let r = t + 1; r < 23; r += 2) for (let k = c + 1; k < c + w - 1; k += 2) if ((r + k) % 4 !== 3) s += cell(k, r);
      });
      s += cell(9, 4, 1, 3) + cell(8, 6, 3, 1) + cell(17, 8, 3, 2) + cell(22, 13);
      s += Q(10, 250, 280, 40) + [0, 1, 2, 3, 4].map(i => Q(22 + i * 56, 266, 30, 8)).join('');
      return s;
    })();

    /* 18 hummingbird */
    const humming = (() => {
      const lv = a => a.map(([x, y, r]) => LP(x, y, r, lens(0, 24, 9))).join('');
      let s = C(160, 150, 130) + D('M8 28Q70 18 96 48Q114 70 112 96') + lv([[28, 24, 190], [52, 24, 20], [78, 34, 200], [98, 54, 40], [112, 80, 220], [110, 96, 70], [14, 30, 20]]);
      [[50, 26], [96, 50]].forEach(([x, y]) => { s += LP(x, y, 180, lens(-4, 26, 7)) + [-30, 0, 30].map(a => LP(x, y + 24, 180 + a, roundP(0, 22, 8))).join('') + dot(x, y + 48, 3); });
      s += LP(28, 120, 100, lens(0, 50, 9)) + [40, 100, 160].map(a => LP(78, 128, a, roundP(0, 20, 9))).join('');
      s += [[54, 232, 330], [54, 232, 170], [256, 56, 150], [256, 56, 210]].map(([x, y, a]) => LP(x, y, a, lens(24, 58, 11))).join('') + ring(5, 18, a => LP(54, 232, a, roundP(6, 36, 18))) + C(54, 232, 8) + ring(5, 0, a => LP(256, 56, a, roundP(0, 26, 12))) + C(256, 56, 7);
      // tail, body, wing, head
      s += [125, 142, 159, 176].map(a => LP(214, 196, a, lens(-4, 46, 9))).join('') + ell(186, 160, 46, 28, 40) + LP(194, 172, 130, lens(-24, 24, 11)) + LP(162, 138, 130, lens(-14, 14, 9));
      s += [0, 18, 36, 54].map((a, i) => LP(186, 140, a, roundP(0, 88 - i * 9, 10))).join('') + LP(188, 142, 30, lens(-4, 36, 13));
      s += P('M134 114L84 128L136 126Z') + C(150, 118, 20) + eye(146, 113, 4.5);
      return s;
    })();

    /* 19 pirate cove */
    const sail = (x, y, w, h) => P(`M${x - w / 2} ${y}Q${x} ${y + 6} ${x + w / 2} ${y}Q${x + w / 2 + 6} ${y + h / 2} ${x + w / 2} ${y + h}Q${x} ${y + h + 6} ${x - w / 2} ${y + h}Q${x - w / 2 - 6} ${y + h / 2} ${x - w / 2} ${y}Z`);
    const cove = (() => {
      let s = Q(8, 8, 284, 284, 14) + cloud(110, 44, .8) + P('M8 150H292V292H8Z');
      s += P('M8 48Q36 38 58 62Q82 86 94 128Q106 162 112 200H8Z') + P('M22 200Q24 162 46 160Q68 162 72 200Z');
      s += `<path d="M170 34V140M222 56V140" ${L}/>` + P('M170 30l26 7-26 7Z') + K('M178 34l2 3 3 0-2 2 1 3-3-2-3 2 1-3-2-2 3 0Z');
      s += P('M228 64L272 138H232Z') + sail(170, 56, 44, 30) + sail(170, 96, 54, 34) + sail(222, 72, 36, 24) + sail(222, 102, 44, 28);
      s += P('M116 138H256L240 172H132Z') + P('M120 146H252L248 156H124Z') + [148, 178, 208].map(x => C(x, 164, 5.5)).join('');
      [[124, 186], [196, 196], [258, 182]].forEach(([x, y]) => { s += strand([[x, y], [x + 14, y - 10], [x + 30, y - 6], [x + 32, y + 4]], 7, 1); });
      s += P('M8 222Q100 198 180 214Q240 226 292 208V278Q292 292 278 292H22Q8 292 8 278Z');
      s += tube([[272, 240], [278, 200], [266, 150], [244, 118]], 5, 8, 6);
      [-90, -45, 0, 45, 90].forEach(a => { s += strand([[244, 118], pol(244, 118, 22, a - 10), pol(244, 126, 40, a * 1.1 - 10), pol(244, 142, 50, a * 1.3 - 10)], 9); });
      s += C(238, 126, 7) + C(252, 128, 7);
      s += P('M96 242L106 212H150L160 242Z') + P('M100 242Q106 226 118 232Q128 220 138 232Q150 224 156 242Z') + Q(96, 242, 64, 34, 4) + Q(123, 242, 10, 34) + Q(120, 252, 16, 12, 3);
      s += P('M112 232l8-10 8 10-8 8Z') + P('M140 230l7-9 7 9-7 7Z') + [[176, 272], [192, 280], [178, 287], [70, 266]].map(([x, y]) => C(x, y, 8) + `<circle cx="${x}" cy="${y}" r="4" ${T}/>`).join('');
      s += star(240, 266, 15, 7, 5, 8) + P('M160 222l7-9 7 9-7 7Z') + cloud(206, 30, .6) + D('M30 24q6-6 12 0q6-6 12 0M64 36q5-5 10 0q5-5 10 0');
      return s;
    })();

    /* 20 rangoli */
    const rangoli = (() => {
      const c = 150, A = (a, sh) => LP(c, c, a, sh);
      let s = Q(8, 8, 284, 284, 14);
      [[38, 44], [262, 44], [38, 262], [262, 262]].forEach(([x, y]) => { s += LP(x, y - 6, 0, lens(0, 26, 7)) + P(`M${x - 22} ${y}Q${x} ${y + 26} ${x + 22} ${y}Z`); });
      s += ring(16, 0, a => A(a, lotusP(96, 140, 20))) + ring(16, 11.25, a => C(...pol(c, c, 128, a), 7));
      s += C(c, c, 100) + ring(8, 22.5, a => A(a, tear(60, 96, 14)) + C(...pol(c, c, 84, a), 6));
      s += ring(8, 0, a => C(...pol(c, c, 84, a), 9));
      s += C(c, c, 60) + ring(12, 15, a => A(a, roundP(30, 58, 9))) + C(c, c, 30) + ring(8, 0, a => A(a, lens(12, 29, 7))) + C(c, c, 11);
      return s;
    })();

    /* 21 fashion sketch board */
    const fashion = (() => {
      let s = Q(8, 8, 284, 284, 14) + rot(Q(14, 20, 40, 12), -20, 34, 26) + rot(Q(246, 268, 40, 12), -20, 266, 274);
      s += [0, 1, 2, 3, 4].map(i => Q(18, 50 + i * 26, 18, 20, 3)).join('');
      s += ell(150, 50, 42, 10, 0) + P('M124 48Q124 20 150 20Q176 20 176 48Z') + Q(124, 38, 52, 10);
      s += P('M236 70Q234 48 248 50Q262 60 274 54Q288 52 288 62Q288 70 280 70H246L242 90H236Z') + LP(268, 56, 0, lens(-12, 12, 6));
      [[60, 1], [228, 0]].forEach(([x, g]) => {
        s += P(`M${x - 20} 286L${x} 270L${x + 20} 286Z`) + `<path d="M${x} 230V272" ${L}/>` + Q(x - 6, 56, 12, 12, 3);
        if (g) {
          s += P(`M${x - 24} 74Q${x} 66 ${x + 24} 74L${x + 16} 122H${x - 16}Z`) + Q(x - 18, 120, 36, 10, 3);
          const hy = i => 226 + 12 * (1 - ((i - 2) / 2) ** 2);
          for (let i = 0; i < 4; i++) s += P(`M${x - 17 + 8.5 * i} 130L${x - 46 + 23 * i} ${hy(i)}L${x - 23 + 23 * i} ${hy(i + 1)}L${x - 8.5 + 8.5 * i} 130Z`);
          s += LP(x, 125, 240, lens(2, 22, 7)) + LP(x, 125, 120, lens(2, 22, 7)) + C(x, 125, 5.5);
        } else {
          s += P(`M${x - 24} 74Q${x} 66 ${x + 24} 74L${x + 20} 130H${x - 20}Z`) + [0, 1, 2].map(i => Q(x - 21, 88 + i * 14, 42, 7)).join('');
          s += P(`M${x - 20} 130L${x - 38} 216H${x + 38}L${x + 20} 130Z`) + [[-14, 160], [10, 154], [-20, 196], [6, 188], [24, 204]].map(([dx, y]) => C(x + dx, y, 5.5)).join('');
        }
      });
      s += Q(130, 144, 16, 12, 6) + Q(154, 144, 16, 12, 6) + D('M146 150h8M130 148l-6-4M170 148l6-4');
      s += `<path d="M134 214Q150 192 166 214" ${T} stroke-width="3"/>` + Q(124, 212, 52, 40, 8) + P('M124 220Q150 238 176 220V212H124Z') + C(150, 228, 5.5);
      s += ring(7, 0, (a, i) => C(...pol(150, 108, 22, 110 + i * 23), 5.5));
      s += LP(110, 280, 60, ['M', [0, -5], 'L', [56, -5], 'L', [56, 5], 'L', [0, 5], 'Z']) + LP(110, 280, 60, ['M', [56, -5], 'L', [70, 0], 'L', [56, 5], 'Z']) + LP(110, 280, 60, ['M', [-12, -5], 'L', [0, -5], 'L', [0, 5], 'L', [-12, 5], 'Z']);
      s += spark(270, 120, 11) + spark(28, 200, 11);
      return s;
    })();

    /* 22 castle mandala */
    const castleM = (() => {
      const c = 150;
      let s = C(c, c, 143) + ring(20, 0, a => LP(c, c, a, roundP(116, 143, 20)) + heart(...pol(c, c, 130, a), 6.5)) + C(c, c, 118);
      s += cloud(56, 96, .7) + cloud(196, 82, .6) + P('M43.1 200Q150 160 256.9 200A118 118 0 0 1 43.1 200Z');
      s += P('M140 196Q120 222 150 240Q178 256 156 268H180Q200 250 170 232Q150 218 160 196Z');
      [[84, 1], [188, 1]].forEach(([x]) => { s += Q(x, 104, 28, 92) + P(`M${x - 4} 106L${x + 14} 70L${x + 32} 106Z`) + arch(x + 8, 124, 12, 22) + D(`M${x + 14} 70V54`) + P(`M${x + 14} 54l16 5-16 5Z`); });
      s += P('M112 196V118H122V110H132V118H144V110H156V118H168V110H178V118H188V196Z') + Q(134, 76, 32, 34) + P('M130 78L150 44L170 78Z') + D('M150 44V30') + P('M150 30l16 5-16 5Z') + arch(144, 84, 12, 18);
      s += P('M136 196V170A14 14 0 0 1 150 156V196Z') + P('M150 196V156A14 14 0 0 1 164 170V196Z') + arch(118, 130, 12, 20) + arch(170, 130, 12, 20);
      s += bloss(84, 222, 11) + bloss(214, 220, 11) + bloss(110, 250, 10) + bloss(200, 250, 10);
      return s;
    })();

    /* 23 Japanese garden */
    const jgarden = (() => {
      let s = Q(8, 8, 284, 284, 14) + C(264, 42, 18) + P('M120 150L196 72L272 150Z') + P('M174 94L196 72L218 94L208 102L196 94L184 102Z') + cloud(200, 122, .6);
      s += ground(146) + E(160, 216, 118, 40) + ell(110, 236, 14, 6, 0) + lily(220, 236, 14, 300) + lily(190, 248, 11, 100);
      [[150, 246, 1], [120, 206, 1]].forEach(([x, y, k]) => { s += LP(x - 12 * k, y, 90 * k + 180, lens(0, 15, 9)) + LP(x, y, 90 * k, lens(-14, 14, 8)); });
      s += P('M50 214Q156 120 262 214H246Q156 140 66 214Z') + P('M58 204Q156 104 254 204L250 196Q156 98 62 196Z');
      [70, 104, 156, 208, 242].map(x => { const t = (x - 50) / 212, y = (1 - t) * (1 - t) * 214 + 2 * t * (1 - t) * 116 + t * t * 214; return Q(x - 4, N(y - 22), 8, 22, 2); }).forEach(r => { s += r; });
      s += strand([[44, 292], [40, 226], [66, 168], [60, 116]], 16, 1) + strand([[54, 182], [82, 152], [108, 130], [124, 100]], 8, 1) + strand([[48, 204], [28, 176], [24, 146], [14, 124]], 7, 1);
      [[30, 68, 26], [72, 46, 28], [114, 62, 24], [40, 112, 22], [92, 96, 24], [130, 104, 18], [16, 150, 16]].forEach(([x, y, r]) => { s += bloss(x, y, r * 1.4, 8, 10, 1); });
      s += [[34, 58], [80, 36], [112, 70], [44, 112], [92, 100], [70, 62]].map(([x, y]) => bloss(x, y, 11)).join('') + bloss(150, 150, 10) + bloss(178, 170, 9) + bloss(96, 160, 9) + bloss(222, 176, 9);
      s += Q(250, 270, 30, 10, 3) + Q(258, 238, 14, 32) + Q(250, 214, 30, 24, 3) + Q(259, 220, 12, 12, 2) + P('M240 214Q265 196 290 214Z') + C(265, 196, 7);
      s += [[90, 270, 18], [130, 282, 16], [172, 276, 18], [214, 284, 14]].map(([x, y, r]) => ell(x, y, r, 7, 0)).join('');
      s += C(28, 236, 16) + C(276, 160, 14) + C(250, 166, 12) + C(20, 266, 12) + ell(276, 284, 14, 7, 0);
      return s;
    })();

    /* 24 kite festival */
    const kites = (() => {
      let s = Q(8, 8, 284, 284, 14) + cloud(20, 120, .8) + cloud(200, 168, .8);
      s += P('M8 236Q90 200 170 240Q230 216 292 230V278Q292 292 278 292H22Q8 292 8 278Z') + P('M8 262Q120 236 292 266V278Q292 292 278 292H22Q8 292 8 278Z');
      [[60, 250], [228, 244], [262, 248]].forEach(([x, y]) => { s += Q(x - 3, y, 7, 14) + C(x, y - 6, 9); });
      const bow = (x, y) => LP(x, y, 60, lens(0, 15, 7)) + LP(x, y, 240, lens(0, 15, 7));
      const kite = (x, y, w, h, tl) => { const T_ = [x, y - h], R_ = [x + w, y], B_ = [x, y + h * 1.4], L_ = [x - w, y], c = [x, y]; return [[T_, R_], [R_, B_], [B_, L_], [L_, T_]].map(([p, q]) => P(`M${pt(c)}L${pt(p)}L${pt(q)}Z`)).join('') + D(`M${pt(B_)}Q${x - 20} ${y + h * 2.2} ${tl[0]} ${tl[1]}`) + bow(...tl); };
      s += kite(70, 54, 26, 30, [56, 140]) + bow(64, 112) + kite(242, 60, 22, 26, [268, 150]) + bow(258, 124) + kite(150, 190, 18, 22, [128, 246]) + kite(36, 176, 15, 17, [24, 226]);
      s += ring(6, 0, a => P(`M150 90L${pol(150, 90, 30, a).join(' ')}L${pol(150, 90, 30, a + 60).join(' ')}Z`)) + C(150, 90, 9) + D('M150 120Q140 150 160 180');
      s += P('M180 148L224 148L202 124Z') + P('M180 148L224 148L212 160H192Z') + D('M202 160Q198 180 214 204') + C(196, 30, 14);
      s += star(94, 182, 22, 10, 5) + C(94, 183, 7) + D('M94 205Q86 226 104 244') + LP(104, 244, 60, lens(0, 13, 6)) + LP(104, 244, 240, lens(0, 13, 6));
      s += Q(188, 220, 20, 14, 2) + Q(188, 246, 20, 14, 2) + D('M192 234V246M204 234V246');
      return s;
    })();

    /* 25 snowflake mandala */
    const snowflake = (() => {
      const c = 150, A = (a, sh) => LP(c, c, a, sh);
      let s = C(c, c, 143) + ring(12, 0, a => A(a, roundP(120, 143, 18))) + ring(12, 15, a => C(...pol(c, c, 130, a), 6.5));
      s += ring(6, 30, a => A(a, lens(46, 78, 11)) + A(a, lens(86, 112, 10)));
      s += ring(6, 0, a => [60, 92].map(r => { const p = pol(c, c, r, a); return LP(...p, a + 48, lens(0, 26, 7)) + LP(...p, a - 48, lens(0, 26, 7)); }).join('') + A(a, lens(18, 116, 9)) + A(a, lens(104, 138, 9)));
      s += C(c, c, 24) + ring(6, 30, a => A(a, roundP(6, 22, 7))) + C(c, c, 7);
      return s;
    })();

    /* 26 vintage car */
    const spoked = (x, y) => C(x, y, 31) + C(x, y, 23) + ring(8, 0, a => P(sec(x, y, 8, 20, a + 6, a + 39))) + C(x, y, 7);
    const vcar = (() => {
      let s = Q(8, 8, 284, 284, 14) + cloud(150, 52, .9) + cloud(24, 74, .7) + C(254, 46, 20);
      s += P('M8 236H292V278Q292 292 278 292H22Q8 292 8 278Z');
      for (let r = 0; r < 2; r++) for (let i = 0; i < 7 - r; i++) s += Q(12 + i * 40 + r * 20, 248 + r * 22, 34, 16, 6);
      s += C(44, 168, 20) + C(44, 168, 10);
      s += P('M60 206V138Q60 100 100 98H150V206Z') + P('M68 136Q70 108 100 106H112V136Z') + Q(118, 106, 26, 30, 3) + P('M118 144H146V198H122Z');
      s += P('M150 102L160 102L156 148H150Z') + P('M150 148H246Q254 148 254 156V206H150Z') + D('M176 160v32M190 160v32M204 160v32M218 160v32');
      s += Q(254, 138, 14, 68, 3) + Q(257, 146, 8, 52, 2) + C(276, 156, 10) + C(276, 156, 5.5) + Q(262, 204, 26, 9, 4);
      s += P(sec(96, 222, 32, 44, -90, 90)) + P(sec(224, 222, 32, 44, -90, 90)) + Q(138, 206, 48, 10, 3);
      s += spoked(96, 222) + spoked(224, 222);
      return s;
    })();

    return [
      { id: 'a10-lotus-mandala', cat: 'patterns',
        name: { en: 'Lotus mandala', fr: 'Mandala lotus', es: 'Mandala de loto', de: 'Lotus-Mandala', zh: '莲花曼陀罗' },
        svg: lotus },
      { id: 'a10-unicorn-zen', cat: 'princess',
        name: { en: 'Zen pattern unicorn', fr: 'Licorne zen à motifs', es: 'Unicornio zen con motivos', de: 'Zen-Einhorn mit Mustern', zh: '禅意图案独角兽' },
        svg: unicorn },
      { id: 'a10-tiger-pattern', cat: 'animals',
        name: { en: 'Pattern tiger', fr: 'Tigre à motifs', es: 'Tigre con motivos', de: 'Tiger mit Mustern', zh: '图案小老虎' },
        svg: tiger },
      { id: 'a10-princess-palace', cat: 'princess',
        name: { en: 'Palace garden fountain', fr: 'Fontaine du palais', es: 'Fuente del palacio', de: 'Palast mit Brunnen', zh: '宫殿花园喷泉' },
        svg: palace },
      { id: 'a10-supercar', cat: 'vehicles',
        name: { en: 'Sunset supercar', fr: 'Supervoiture au couchant', es: 'Superdeportivo al atardecer', de: 'Supersportwagen', zh: '夕阳超级跑车' },
        svg: supercar },
      { id: 'a10-ramen', cat: 'food',
        name: { en: 'Happy ramen bowl', fr: 'Bol de ramen joyeux', es: 'Bol de ramen feliz', de: 'Fröhliche Ramen-Schale', zh: '开心拉面碗' },
        svg: ramen },
      { id: 'a10-koi-pond', cat: 'ocean',
        name: { en: 'Koi pond', fr: 'Bassin aux carpes koï', es: 'Estanque de carpas koi', de: 'Koi-Teich', zh: '锦鲤池塘' },
        svg: koiPond },
      { id: 'a10-eastern-dragon', cat: 'fantasy',
        name: { en: 'Cloud dragon', fr: 'Dragon des nuages', es: 'Dragón de las nubes', de: 'Wolkendrache', zh: '祥云中国龙' },
        svg: dragon },
      { id: 'a10-mermaid-mandala', cat: 'princess',
        name: { en: 'Mermaid wave mandala', fr: 'Mandala sirène des vagues', es: 'Mandala sirena de olas', de: 'Meerjungfrau-Mandala', zh: '美人鱼海浪曼陀罗' },
        svg: mermaid },
      { id: 'a10-butterfly-mandala', cat: 'patterns',
        name: { en: 'Butterfly mandala', fr: 'Mandala papillon', es: 'Mandala mariposa', de: 'Schmetterlings-Mandala', zh: '蝴蝶曼陀罗' },
        svg: butterfly },
      { id: 'a10-parasaurolophus', cat: 'dinosaurs',
        name: { en: 'Parasaurolophus jungle', fr: 'Parasaurolophus en jungle', es: 'Parasaurolophus en la selva', de: 'Parasaurolophus im Dschungel', zh: '丛林副栉龙' },
        svg: para },
      { id: 'a10-music-studio', cat: 'hobbies',
        name: { en: 'Home music studio', fr: 'Studio de musique', es: 'Estudio de música', de: 'Musikstudio', zh: '家庭音乐工作室' },
        svg: studio },
      { id: 'a10-horse-pattern', cat: 'animals',
        name: { en: 'Pattern horse', fr: 'Cheval à motifs', es: 'Caballo con motivos', de: 'Pferd mit Mustern', zh: '图案骏马' },
        svg: horse },
      { id: 'a10-dancer-ribbons', cat: 'princess',
        name: { en: 'Ribbon ballerina', fr: 'Ballerine aux rubans', es: 'Bailarina con cintas', de: 'Ballerina mit Bändern', zh: '彩带芭蕾舞者' },
        svg: dancer },
      { id: 'a10-cyber-city', cat: 'space',
        name: { en: 'Future city', fr: 'Ville du futur', es: 'Ciudad del futuro', de: 'Stadt der Zukunft', zh: '未来城市' },
        svg: city },
      { id: 'a10-macarons', cat: 'food',
        name: { en: 'Macaron tower', fr: 'Tour de macarons', es: 'Torre de macarons', de: 'Macaron-Turm', zh: '马卡龙塔' },
        svg: macarons },
      { id: 'a10-pixel-city', cat: 'patterns',
        name: { en: 'Pixel city at night', fr: 'Ville pixel la nuit', es: 'Ciudad pixel de noche', de: 'Pixelstadt bei Nacht', zh: '像素夜景城市' },
        svg: pixel },
      { id: 'a10-hummingbird', cat: 'nature',
        name: { en: 'Hummingbird and flowers', fr: 'Colibri et fleurs', es: 'Colibrí y flores', de: 'Kolibri mit Blumen', zh: '蜂鸟与花' },
        svg: humming },
      { id: 'a10-pirate-cove', cat: 'fantasy',
        name: { en: 'Pirate cove', fr: 'Crique des pirates', es: 'Cala pirata', de: 'Piratenbucht', zh: '海盗湾' },
        svg: cove },
      { id: 'a10-rangoli', cat: 'holidays',
        name: { en: 'Rangoli with lamps', fr: 'Rangoli et lampes', es: 'Rangoli con lámparas', de: 'Rangoli mit Lichtern', zh: '油灯兰果丽' },
        svg: rangoli },
      { id: 'a10-fashion-sketch', cat: 'things',
        name: { en: 'Fashion design board', fr: 'Planche de mode', es: 'Tablero de moda', de: 'Mode-Entwurfstafel', zh: '时装设计板' },
        svg: fashion },
      { id: 'a10-castle-mandala', cat: 'princess',
        name: { en: 'Castle heart mandala', fr: 'Mandala château et cœurs', es: 'Mandala de castillo', de: 'Schloss-Herz-Mandala', zh: '城堡爱心曼陀罗' },
        svg: castleM },
      { id: 'a10-japanese-garden', cat: 'nature',
        name: { en: 'Japanese garden', fr: 'Jardin japonais', es: 'Jardín japonés', de: 'Japanischer Garten', zh: '日式庭园' },
        svg: jgarden },
      { id: 'a10-kite-festival', cat: 'holidays',
        name: { en: 'Kite festival', fr: 'Fête des cerfs-volants', es: 'Festival de cometas', de: 'Drachenfest', zh: '风筝节' },
        svg: kites },
      { id: 'a10-snowflake-mandala', cat: 'patterns',
        name: { en: 'Snowflake mandala', fr: 'Mandala flocon', es: 'Mandala copo de nieve', de: 'Schneeflocken-Mandala', zh: '雪花曼陀罗' },
        svg: snowflake },
      { id: 'a10-vintage-car', cat: 'vehicles',
        name: { en: 'Vintage car', fr: 'Voiture ancienne', es: 'Coche antiguo', de: 'Oldtimer', zh: '复古老爷车' },
        svg: vcar },
    ];
  });

  /* IntelloKids colouring – age 10, part B */
  PART(function () {
    const INK = '#1F3A44';
    const SW = 2;
    const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
    const R = `data-r fill="#fff" ${L}`;
    // ---- helpers (all return markup strings) ----
    const n1 = v => Math.round(v * 10) / 10;
    const rep = (n, f) => { let s = ''; for (let i = 0; i < n; i++) s += f(i); return s; };
    const rep0 = (n, f) => Array.from({ length: n }, (_, i) => f(i));
    const tf = t => t ? ` transform="${t}"` : '';
    const XY = v => n1(v[0]) + ' ' + n1(v[1]);
    const P = (d, t) => `<path ${R} d="${d}"${tf(t)}/>`;
    const C = (x, y, r) => `<circle ${R} cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}"/>`;
    const E = (x, y, rx, ry, a) => `<ellipse ${R} cx="${n1(x)}" cy="${n1(y)}" rx="${n1(rx)}" ry="${n1(ry)}"${a ? tf(`rotate(${a} ${n1(x)} ${n1(y)})`) : ''}/>`;
    const B = (x, y, w, h, r, t) => `<rect ${R} x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}"${r ? ` rx="${r}"` : ''}${tf(t)}/>`;
    const G = (p, t) => `<polygon ${R} points="${typeof p === 'string' ? p : p.map(v => n1(v[0]) + ',' + n1(v[1])).join(' ')}"${tf(t)}/>`;
    const ln = (d, w = 1.4) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const dot = (x, y, r) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r}" fill="${INK}"/>`;
    const eye = (x, y, r) => dot(x, y, r) + `<circle cx="${n1(x + r * 0.35)}" cy="${n1(y - r * 0.4)}" r="${n1(r * 0.38)}" fill="#fff"/>`;
    const smile = (x, y, w, k = 0.8) => ln(`M${n1(x - w)} ${n1(y)}q${n1(w)} ${n1(w * k)} ${n1(2 * w)} 0`, 1.6);
    const tg = (t, s) => `<g transform="${t}">${s}</g>`;
    const ROT = (a, x, y) => `rotate(${n1(a)} ${n1(x)} ${n1(y)})`;
    const ring = (n, cx, cy, f, a0 = 0) => rep(n, i => tg(ROT(a0 + 360 * i / n, cx, cy), f(i)));
    const MIR = (s, x = 150) => s + tg(`matrix(-1 0 0 1 ${2 * x} 0)`, s);
    const pt = (cx, cy, r, a) => { const t = (a - 90) * Math.PI / 180; return [n1(cx + r * Math.cos(t)), n1(cy + r * Math.sin(t))]; };
    const sec = (cx, cy, r1, r2, a1, a2) => { const g = a2 - a1 > 180 ? 1 : 0; return `M${XY(pt(cx, cy, r2, a1))}A${r2} ${r2} 0 ${g} 1 ${XY(pt(cx, cy, r2, a2))}L${XY(pt(cx, cy, r1, a2))}` + (r1 > 0 ? `A${r1} ${r1} 0 ${g} 0 ${XY(pt(cx, cy, r1, a1))}` : '') + 'Z'; };
    const star = (cx, cy, ro, ri, n, a0 = 0) => { let s = ''; for (let i = 0; i < 2 * n; i++) s += (i ? 'L' : 'M') + XY(pt(cx, cy, i % 2 ? ri : ro, a0 + 180 * i / n)); return s + 'Z'; };
    const ST = (x, y, r, n = 5, a = 0) => P(star(x, y, r, r * 0.52, n, a)); // chubby star region
    // petal from (x,y) pointing up, length h, half width ~0.75w (round tip)
    const pet = (x, y, h, w) => { x = n1(x); y = n1(y); return `M${x} ${y}C${n1(x - w)} ${n1(y - h * 0.25)} ${n1(x - w)} ${n1(y - h)} ${x} ${n1(y - h)}C${n1(x + w)} ${n1(y - h)} ${n1(x + w)} ${n1(y - h * 0.25)} ${x} ${y}Z`; };
    // pointed leaf from (x,y) pointing up
    const leaf = (x, y, h, w) => { x = n1(x); y = n1(y); return `M${x} ${y}C${n1(x - w)} ${n1(y - h * 0.3)} ${n1(x - w * 0.6)} ${n1(y - h * 0.8)} ${x} ${n1(y - h)}C${n1(x + w * 0.6)} ${n1(y - h * 0.8)} ${n1(x + w)} ${n1(y - h * 0.3)} ${x} ${y}Z`; };
    const heart = (x, y, s) => `M${x} ${n1(y + s * 0.9)}C${n1(x - s * 1.3)} ${n1(y + s * 0.1)} ${n1(x - s * 0.9)} ${n1(y - s * 0.95)} ${x} ${n1(y - s * 0.35)}C${n1(x + s * 0.9)} ${n1(y - s * 0.95)} ${n1(x + s * 1.3)} ${n1(y + s * 0.1)} ${x} ${n1(y + s * 0.9)}Z`;
    const cloud = (x, y, s) => P(`M${x} ${y}` + [[-4, -26, 22, -28], [6, -22, 32, -16], [22, -12, 34, 12], [22, 2, 18, 32]].map(q => 'q' + q.map(v => n1(v * s)).join(' ')).join('') + 'z');
    const FRAME = B(8, 8, 284, 284, 16);
    const BOT = top => P(top + 'V276A16 16 0 0 1 276 292H24A16 16 0 0 1 8 276Z');
    const wv = (y, a, n) => { let d = `M8 ${y}`; const w = n1(284 / n / 2); for (let i = 0; i < n; i++) d += `q${n1(w / 2)} ${-a} ${w} 0q${n1(w / 2)} ${a} ${w} 0`; return d + 'L292 ' + y; };
    const bz = (a, b, c, d, t) => { const u = 1 - t; return [0, 1].map(k => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]); };
    // a band of varying width along a chain of cubic beziers [p0,c1,c2,p1,c1,c2,p2...]
    const tube = (q, w0, w1, n = 12) => {
      const p = []; for (let k = 0; k + 3 < q.length; k += 3) for (let i = k ? 1 : 0; i <= n; i++) p.push(bz(q[k], q[k + 1], q[k + 2], q[k + 3], i / n));
      const a = [], b = [], m = p.length - 1;
      p.forEach((v, i) => { const u = p[Math.max(0, i - 1)], z = p[Math.min(m, i + 1)], dx = z[0] - u[0], dy = z[1] - u[1], d = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * i / m) / 2; a.push([v[0] - dy / d * w, v[1] + dx / d * w]); b.push([v[0] + dy / d * w, v[1] - dx / d * w]); });
      return 'M' + a.concat(b.reverse()).map(XY).join('L') + 'Z';
    };
    // dome panel: between heights h1..h2 and meridians u1..u2 (x = cx + u*halfwidth)
    const dcell = (cx, by, r, h1, h2, u1, u2) => { const a = [], b = []; for (let i = 0; i <= 8; i++) { const h = h1 + (h2 - h1) * i / 8, w = Math.sqrt(Math.max(0, r * r - h * h)); a.push([cx + u1 * w, by - h]); b.unshift([cx + u2 * w, by - h]); } return 'M' + a.concat(b).map(XY).join('L') + 'Z'; };
    const dome = (cx, by, r, hs, us) => { let o = ''; for (let j = 0; j < hs.length - 1; j++) for (let i = 0; i < us.length - 1; i++) o += P(dcell(cx, by, r, hs[j], hs[j + 1], us[i], us[i + 1])); return o; };
    // round paper lantern in 3 segments + caps + tassel
    const lan = (x, y, rx, ry, cw = 16) => { const m = n1(rx * 0.7); return P(`M${x} ${y - ry}A${rx} ${ry} 0 0 0 ${x} ${y + ry}Q${x - m} ${y} ${x} ${y - ry}Z`) + P(`M${x} ${y - ry}A${rx} ${ry} 0 0 1 ${x} ${y + ry}Q${x + m} ${y} ${x} ${y - ry}Z`) + P(`M${x} ${y - ry}Q${x - m} ${y} ${x} ${y + ry}Q${x + m} ${y} ${x} ${y - ry}Z`) + B(x - cw / 2, y - ry - 5, cw, 8, 2) + B(x - cw / 2, y + ry - 3, cw, 8, 2) + P(`M${x - 5} ${y + ry + 5}L${x - 7} ${y + ry + 21}H${x + 7}L${x + 5} ${y + ry + 5}Z`); };
    const pad = (x, y, k) => { const rx = 30 * k, ry = 11 * k; return P(`M${x} ${y}L${n1(x + 0.866 * rx)} ${n1(y - 0.5 * ry)}A${n1(rx)} ${n1(ry)} 0 1 1 ${n1(x + 0.5 * rx)} ${n1(y - 0.866 * ry)}Z`); };
    const rose = (x, y, r) => C(x, y, r) + ln(`M${n1(x - r * 0.4)} ${y}a${n1(r * 0.4)} ${n1(r * 0.4)} 0 1 1 ${n1(r * 0.4)} ${n1(r * 0.4)}M${n1(x + r * 0.7)} ${n1(y - r * 0.2)}a${n1(r * 0.65)} ${n1(r * 0.65)} 0 0 1 ${n1(-r * 0.9)} ${n1(r * 0.75)}`, 1.2);
    // wing between top curve U and bottom curve W (cubic, same tip); rows ts, cells per row ks, scallop b
    const wing = (U, W, ts, ks, b) => {
      const Q = (t, v) => { const a = bz(...U, t), c = bz(...W, t); return [a[0] + (c[0] - a[0]) * v, a[1] + (c[1] - a[1]) * v]; };
      const bt = (i, v) => i === 0 ? -b * Math.sin(Math.PI * v) : i === ts.length - 1 ? 1 : ts[i] + b * Math.sin(Math.PI * ((v * ks[i - 1]) % 1));
      let o = '';
      for (let i = 0; i < ks.length; i++) for (let j = 0; j < ks[i]; j++) {
        const v0 = j / ks[i], v1 = (j + 1) / ks[i], p = [], N = 6, sv = (s, w) => v0 + (v1 - v0) * s / N, st = s => ts[i] + (ts[i + 1] - ts[i]) * s / N;
        for (let s = 0; s <= N; s++) p.push(Q(bt(i, sv(s)), sv(s)));
        for (let s = 1; s < N; s++) p.push(Q(st(s), v1));
        for (let s = N; s >= 0; s--) p.push(Q(bt(i + 1, sv(s)), sv(s)));
        for (let s = N - 1; s > 0; s--) p.push(Q(st(s), v0));
        o += P('M' + p.map(XY).join('L') + 'Z');
      }
      return o;
    };
    const fish = (x, y, k, f) => { const X = v => n1(x + f * v * k), Y = v => n1(y + v * k); return P(`M${X(-13)} ${Y(0)}L${X(-31)} ${Y(-12)}L${X(-31)} ${Y(12)}Z`) + E(x, y, 16 * k, 11 * k) + P(`M${X(-11)} ${Y(-7)}Q${X(-5)} ${Y(-29)} ${X(10)} ${Y(-8)}Z`) + eye(X(8), Y(-2), 2.5) + ln(`M${X(-3)} ${Y(-5)}q${n1(f * 3 * k)} ${n1(5 * k)} 0 ${n1(10 * k)}`, 1.2); };

    return [
      // 1 ─ princess portrait
      { id: 'a10-princess-portrait', cat: 'princess',
        name: { en: 'Princess portrait', fr: 'Portrait de princesse', es: 'Retrato de princesa', de: 'Prinzessinnenporträt', zh: '公主肖像' },
        svg: (() => {
          let s = FRAME + P('M44 270V138A106 106 0 0 1 256 138V270Z');
          s += [[74, 96], [226, 96], [64, 172], [236, 172]].map(([x, y]) => ST(x, y, 12, 4)).join('');
          s += P('M150 62C96 62 92 112 98 152C101 178 104 196 112 206H188C196 196 199 178 202 152C208 112 204 62 150 62Z');
          s += P('M136 150V190Q136 196 118 200Q150 236 182 200Q164 196 164 190V150Z');
          s += P('M30 284V240C44 214 86 206 116 202Q150 232 184 202C214 206 256 214 270 240V284Z');
          s += P('M138 222H162L157 272H143Z') + ln('M150 240v4M150 252v4M150 264v4', 1.6);
          s += P('M116 202Q150 232 184 202L192 208Q150 246 108 208Z');
          s += rep(9, i => { const t = 0.1 + i * 0.1, u = 1 - t; return dot(u * u * 112 + 2 * u * t * 150 + t * t * 188, u * u * 205 + 2 * u * t * 239 + t * t * 205, 1.5); });
          s += MIR(P('M40 252C34 222 62 206 92 208C104 222 102 244 88 254C70 260 50 260 40 252Z') + ln('M60 222q8 10 6 24', 1.3));
          s += P(heart(150, 207, 8.5)) + MIR(dot(131, 193, 1.3) + dot(136, 196, 1.3) + dot(141, 198.5, 1.3));
          s += E(150, 124, 37, 41);
          s += eye(136, 127, 5.5) + eye(164, 127, 5.5) + ln('M131 121l-4 -3M169 121l4 -3') + ln('M128 112q7 -6 14 -2M172 112q-7 -6 -14 -2') + ln('M148 137q2 2 4 0') + smile(150, 147, 8, 0.7);
          s += E(124, 141, 8, 5) + E(176, 141, 8, 5);
          s += MIR(P('M150 70C118 70 102 94 104 128C105 148 109 160 116 168C114 142 120 108 150 88Z'));
          const fl = (x, y, k) => ring(5, x, y, () => E(x, y - 10 * k, 6.5 * k, 10 * k)) + C(x, y, 6 * k) + dot(x, y, 1.8);
          s += fl(150, 58, 1.15) + fl(114, 78, 1.02) + fl(186, 78, 1.02) + C(98, 106, 7) + C(202, 106, 7);
          s += MIR(rep(6, i => E(112 - i * 1.2, 176 + i * 12.5, 11.5, 8.5, i % 2 ? 28 : -28)) + P('M98 252Q92 263 95 270H115Q117 263 112 252Z') + ln('M101 258l-1 10M105 258v10M109 258l1 10', 1.2) + C(105, 249, 6));
          s += rep(8, i => P(sec(150, 138, 106, 128, -90 + 22.5 * i, -67.5 + 22.5 * i)) + dot(...pt(150, 138, 117, -78.75 + 22.5 * i), 2));
          s += B(22, 138, 22, 66) + B(22, 204, 22, 66) + B(256, 138, 22, 66) + B(256, 204, 22, 66) + B(22, 270, 86, 20) + B(108, 270, 84, 20) + B(192, 270, 86, 20);
          s += C(150, 21, 7.5) + C(33, 138, 7.5) + C(267, 138, 7.5) + C(150, 280, 7.5);
          return s;
        })() },

      // 2 ─ swans
      { id: 'a10-swans', cat: 'animals',
        name: { en: 'Two swans', fr: 'Deux cygnes', es: 'Dos cisnes', de: 'Zwei Schwäne', zh: '两只天鹅' },
        svg: (() => {
          let s = FRAME + ring(8, 238, 50, () => P(pet(238, 30, 15, 7.5))) + C(238, 50, 18) + cloud(22, 86, 0.85) + cloud(186, 110, 0.65);
          s += P(heart(150, 52, 10)) + P(heart(112, 30, 7)) + P(heart(188, 30, 7));
          const swan = () => {
            let w = P(tube([[136, 216], [108, 174], [80, 132], [92, 100], [102, 72], [134, 70], [140, 96]], 22, 13));
            w += P('M149 212C149 234 128 244 100 244C64 244 36 236 22 212C18 204 18 196 22 184C34 196 50 200 70 200C110 198 149 192 149 212Z');
            w += wing([[138, 198], [114, 172], [72, 150], [30, 138]], [[134, 226], [96, 228], [54, 200], [30, 138]], [0, 0.3, 0.55, 0.78, 1], [3, 3, 3, 1], 0.06);
            w += E(138, 100, 14, 12, 35) + P('M147 103Q156 116 151 129Q140 123 134 112Z') + eye(136, 97, 2.8);
            return w;
          };
          s += MIR(swan());
          s += BOT(wv(230, 5, 6)) + BOT(wv(252, 5, 5)) + BOT(wv(270, 4, 4));
          const lily = (x, y, k) => { let o = pad(x, y, k); const bx = x - 6 * k, by = y - 2 * k; [[-42, 21], [42, 21], [0, 26]].forEach(([a, h]) => { o += P(pet(bx, by, h * k, 12 * k), ROT(a, bx, by)); }); return o; };
          s += lily(54, 272, 1.05) + lily(246, 278, 1) + pad(150, 284, 0.6);
          return s;
        })() },

      // 3 ─ moon base
      { id: 'a10-moon-base', cat: 'space',
        name: { en: 'Moon base', fr: 'Base lunaire', es: 'Base lunar', de: 'Mondbasis', zh: '月球基地' },
        svg: (() => {
          let s = FRAME;
          s += [[124, 30], [178, 56], [230, 26], [272, 64], [108, 104], [210, 112], [150, 88]].map(([x, y], i) => ST(x, y, 13, 5, i * 13)).join('');
          s += C(62, 62, 32) + P('M42 46C50 34 70 38 70 50C70 60 60 62 56 74C48 80 38 66 42 46Z') + P('M74 70C82 62 92 70 88 80C84 88 72 86 74 70Z') + P('M46 84C54 80 66 82 72 88C64 96 52 94 46 84Z');
          s += P('M8 196C40 184 70 190 98 186C130 180 170 188 204 182C236 176 266 186 292 182V240H8Z');
          s += BOT('M8 226C60 218 120 232 170 226C220 220 260 230 292 224');
          s += B(56, 208, 44, 14, 3) + B(220, 206, 40, 14, 3);
          s += B(37, 180, 6, 32) + rep(6, i => B(12 + 20 * (i % 3), 152 + 15 * Math.floor(i / 3), 20, 15));
          s += B(264, 160, 6, 50) + E(254, 154, 20, 8.5, -35) + ln('M254 154L242 142', 1.8) + dot(241, 141, 3);
          s += dome(158, 230, 70, [0, 26, 50], [1, 0.707, 0, -0.707, -1]) + dome(158, 230, 70, [50, 70], [1, 0, -1]);
          s += P('M146 230V212Q158 200 170 212V230Z') + C(126, 216, 7) + C(190, 216, 7) + B(84, 228, 148, 10, 3);
          s += dome(40, 234, 26, [0, 13], [1, 0, -1]) + dome(40, 234, 26, [13, 26], [1, -1]) + C(40, 216, 5.5) + B(12, 232, 56, 8, 3);
          s += dome(267, 232, 24, [0, 12], [1, 0, -1]) + dome(267, 232, 24, [12, 24], [1, -1]) + C(267, 215, 5) + B(241, 230, 51, 8, 3);
          s += E(232, 262, 28, 10) + E(234, 264, 16, 5) + E(198, 283, 18, 6.5) + ln('M186 282q12 -5 24 0', 1.3) + E(30, 276, 15, 6) + ln('M20 276q10 -4 20 0', 1.3);
          s += P('M84 244Q86 228 104 226H126Q140 228 142 244Z') + P('M94 242Q96 233 106 233H124Q132 234 134 242Z');
          s += ln('M150 244L158 224', 2) + C(159, 220, 5.5);
          s += P('M62 264V252Q62 244 70 244H156Q164 244 166 252L170 264Z') + C(164, 254, 5.5) + ln('M76 254h60', 1.4);
          s += rep(3, i => C(80 + i * 37, 270, 12) + C(80 + i * 37, 270, 5.5));
          return s;
        })() },

      // 4 ─ fairy by the lantern pond
      { id: 'a10-fairy-lantern', cat: 'princess',
        name: { en: 'Fairy lantern pond', fr: 'Fée et lanternes', es: 'Hada y farolillos', de: 'Fee mit Laternen', zh: '池塘边的灯笼仙子' },
        svg: (() => {
          let s = FRAME + C(232, 62, 30) + C(219, 52, 7) + C(242, 76, 6.5) + C(246, 49, 6.5);
          s += [[188, 24], [278, 124], [22, 162]].map(([x, y]) => ST(x, y, 10)).join('');
          s += P(tube([[8, 44], [50, 52], [110, 24], [184, 38]], 12, 6));
          s += [[26, 46, 170], [66, 44, 200], [104, 34, 160], [150, 32, 195], [172, 37, 150]].map(([x, y, a]) => P(leaf(x, y, 18, 8), ROT(a, x, y))).join('');
          s += ln('M40 46V78M82 40V100M134 34V42', 1.3) + lan(40, 102, 17, 19) + lan(82, 124, 16, 19) + lan(134, 63, 15, 16);
          s += P('M8 190C18 176 38 174 52 184C64 168 92 168 106 182C120 172 140 174 150 186C168 174 198 174 212 186C230 170 262 172 276 186C284 182 290 184 292 186V214H8Z');
          s += BOT(wv(206, 3, 7)) + BOT(wv(236, 3, 6)) + BOT(wv(262, 3, 5)) + E(232, 222, 24, 5) + E(232, 249, 15, 4.5);
          s += P(leaf(20, 290, 72, 10), ROT(-6, 20, 290)) + P(leaf(36, 290, 56, 9), ROT(10, 36, 290)) + P(leaf(282, 290, 60, 9), ROT(-8, 282, 290));
          s += ln('M28 288Q26 240 30 214M270 288Q272 250 266 226', 2) + E(30, 214, 5.5, 12) + E(266, 226, 5.5, 12);
          s += pad(62, 270, 0.9) + pad(232, 284, 0.7);
          // fairy
          s += [[-52, 62, 25, 138], [52, 62, 25, 138], [-116, 50, 20, 142], [116, 50, 20, 142]].map(([a, h, w, y]) => P(pet(178, y, h, w), ROT(a, 178, y)) + tg(ROT(a, 178, y), C(178, y - h * 0.68, h * 0.16))).join('');
          s += P(tube([[172, 190], [171, 202], [170, 212], [168, 221]], 10, 9)) + P(tube([[184, 190], [188, 200], [194, 207], [200, 211]], 10, 9)) + E(166, 225, 7.5, 5, -10) + E(204, 214, 7.5, 5, 40);
          s += [-42, 42, -21, 21, 0].map(a => P(pet(178, 150, 44, 13), ROT(180 + a, 178, 150))).join('');
          s += P('M167 114Q178 120 189 114L194 152H162Z') + ln('M170 136h16', 1.3);
          s += P(tube([[167, 124], [158, 130], [150, 132], [142, 132]], 9, 8)) + C(139, 132, 6) + P(tube([[189, 124], [198, 118], [204, 110], [207, 102]], 9, 8)) + C(208, 99, 6);
          s += ln('M139 132Q130 108 116 110', 2.4) + ln('M116 110V119', 1.3) + P('M116 124A13 15 0 0 0 116 154Z') + P('M116 124A13 15 0 0 1 116 154Z') + B(108, 119, 16, 8, 2) + B(108, 151, 16, 8, 2);
          s += C(178, 76, 10) + C(178, 100, 18) + P('M159 104C156 84 168 78 178 78C190 78 200 86 197 104C192 94 184 90 178 94C172 90 164 94 159 104Z');
          s += eye(171, 103, 2.6) + eye(185, 103, 2.6) + smile(178, 110, 4);
          s += [[64, 160], [128, 160], [244, 150], [258, 196]].map(([x, y]) => C(x, y, 6) + ln(`M${x - 10} ${y}h-4M${x + 10} ${y}h4M${x} ${y - 10}v-4M${x} ${y + 10}v4`, 1.2)).join('');
          return s;
        })() },

      // 5 ─ ocean mandala
      { id: 'a10-ocean-mandala', cat: 'patterns',
        name: { en: 'Ocean mandala', fr: "Mandala de l'océan", es: 'Mandala del océano', de: 'Meeres-Mandala', zh: '海洋曼陀罗' },
        svg: (() => {
          const c = 150; let s = '';
          s += rep(16, k => { const q = (r, d) => XY(pt(c, c, r, 22.5 * k + d)); return P(`M${q(110, 0)}L${q(110, 22.5)}C${q(122, 23.5)} ${q(128, 31.5)} ${q(138, 30.5)}C${q(145, 24)} ${q(145, 14)} ${q(138, 8)}C${q(128, 9)} ${q(122, 1)} ${q(110, 0)}Z`) + ln(`M${q(139, 27)}C${q(134, 28)} ${q(131, 24)} ${q(134, 21)}C${q(136, 19.5)} ${q(138, 22)} ${q(136, 23)}`, 1.3); });
          s += rep(8, k => P(sec(c, c, 0, 114, 45 * k, 45 * k + 45)) + `<circle cx="${pt(c, c, 100, 45 * k + 22.5)[0]}" cy="${pt(c, c, 100, 45 * k + 22.5)[1]}" r="3" fill="none" stroke="${INK}" stroke-width="1.3"/>`);
          s += rep(8, k => { const t = 45 * k; let o = ''; for (let j = 0; j < 3; j++) { const a1 = t - 19.5 + 13 * j, a2 = a1 + 13; o += P(`M${XY(pt(c, c, 78, t))}L${XY(pt(c, c, 108, a1))}Q${XY(pt(c, c, 117, a1 + 6.5))} ${XY(pt(c, c, 108, a2))}Z`); } return o + C(...pt(c, c, 80, t), 6.5); });
          s += rep(8, k => { const t = 22.5 + 45 * k, p = pt(c, c, 62, t); return P(star(p[0], p[1], 15, 6.8, 5, t)) + dot(p[0], p[1], 1.8); });
          s += rep(16, k => { const a = 22.5 * k; return P(`M${XY(pt(c, c, 34, a))}L${XY(pt(c, c, 41, a))}Q${XY(pt(c, c, 53, a + 11.25))} ${XY(pt(c, c, 41, a + 22.5))}L${XY(pt(c, c, 34, a + 22.5))}Z`); });
          s += C(c, c, 34) + ring(8, c, c, () => P(pet(150, 138, 19, 8))) + C(150, 150, 12) + dot(150, 150, 3);
          s += [[26, 26], [274, 26], [26, 274], [274, 274]].map(([x, y], i) => ST(x, y, 15, 5, 45 + 90 * i) + dot(x, y, 1.6)).join('');
          return s;
        })() },

      // 6 ─ underwater city
      { id: 'a10-underwater-city', cat: 'ocean',
        name: { en: 'Underwater city', fr: 'Ville sous-marine', es: 'Ciudad submarina', de: 'Unterwasserstadt', zh: '海底城市' },
        svg: (() => {
          let s = FRAME;
          s += P(tube([[30, 240], [14, 200], [44, 170], [26, 118]], 13, 7)) + P(tube([[274, 240], [288, 200], [260, 170], [278, 112]], 13, 7));
          s += BOT('M8 238C40 230 80 240 120 234C170 228 220 240 292 232');
          s += [[96, 58, 6.5], [106, 40, 6], [188, 64, 6], [200, 46, 7.5], [258, 74, 6], [270, 58, 6]].map(([x, y, r]) => C(x, y, r)).join('');
          s += fish(58, 88, 1.1, 1) + fish(236, 32, 1, -1) + fish(86, 160, 1, 1) + fish(204, 116, 0.95, -1);
          s += B(186, 212, 46, 12, 3);
          // scallop-shell house
          s += rep(5, j => { const a1 = -66 + 26.4 * j, a2 = a1 + 26.4; return P(`M62 240L${XY(pt(62, 240, 52, a1))}Q${XY(pt(62, 240, 60, a1 + 13.2))} ${XY(pt(62, 240, 52, a2))}Z`); });
          s += P('M42 244L50 230Q62 226 74 230L82 244Z') + C(62, 204, 9) + C(...pt(62, 240, 36, -26.4), 6) + C(...pt(62, 240, 36, 26.4), 6);
          // spiral shell tower
          const ys = [236, 206, 178, 154, 134, 117, 103], hw = [46, 42, 37, 32, 27, 22, 17];
          const ed = i => [[150 - hw[i], ys[i] - (i ? 8 : 0)], [150 + hw[i], ys[i] + (i ? 8 : 0)]];
          for (let i = 0; i < 6; i++) { const [l0, r0] = ed(i), [l1, r1] = ed(i + 1); s += P(`M${XY(l0)}Q150 ${ys[i] + 8} ${XY(r0)}Q${150 + hw[i] + 8} ${(r0[1] + r1[1]) / 2} ${XY(r1)}Q150 ${ys[i + 1] + 8} ${XY(l1)}Q${150 - hw[i] - 8} ${(l0[1] + l1[1]) / 2} ${XY(l0)}Z`); }
          s += P('M133 95Q150 111 167 111Q166 76 150 50Q136 72 133 95Z') + C(150, 46, 6);
          s += P('M138 240V222Q150 208 162 222V240Z') + P('M143 204V194Q150 184 157 194V204Z') + P('M145 154V147Q150 139 155 147V154Z') + E(150, 114, 7, 5.5);
          // onion tower
          s += B(228, 148, 42, 30) + B(228, 178, 42, 30) + B(228, 208, 42, 30) + C(249, 163, 7) + C(249, 193, 7) + P('M241 238V225Q249 215 257 225V238Z');
          s += P('M222 148C222 130 240 124 249 104C258 124 276 130 276 148Z') + C(249, 100, 5.5);
          // foreground
          s += P(tube([[112, 290], [112, 276], [110, 262], [112, 248]], 11, 8)) + P(tube([[110, 274], [104, 270], [98, 262], [94, 250]], 9, 7)) + P(tube([[114, 268], [120, 264], [126, 258], [128, 248]], 9, 7));
          s += E(196, 276, 22, 12) + ln('M180 274q6 -6 10 0t10 0t10 0M184 282q6 -5 10 0t10 0', 1.3);
          s += ST(254, 270, 14, 5, 10) + dot(254, 270, 1.6);
          return s;
        })() },

      // 7 ─ rose gazebo
      { id: 'a10-rose-gazebo', cat: 'princess',
        name: { en: 'Rose garden gazebo', fr: 'Kiosque aux roses', es: 'Cenador de rosas', de: 'Rosenpavillon', zh: '玫瑰花园凉亭' },
        svg: (() => {
          let s = FRAME + cloud(14, 62, 0.7) + cloud(220, 52, 0.6) + BOT('M8 222C80 214 220 214 292 222');
          s += E(150, 250, 18, 6) + E(141, 266, 20, 6.5) + E(156, 283, 22, 6.5) + B(68, 226, 164, 12, 3) + B(80, 214, 140, 12, 3);
          s += B(86, 112, 26, 68) + B(122, 112, 56, 102) + B(188, 112, 26, 68) + [76, 112, 178, 214].map(x => B(x, 110, 10, 104)).join('');
          const rl = x => { const a = [x, 180], b = [x + 26, 180], c = [x + 26, 214], d = [x, 214], m = [x + 13, 197]; return G([a, b, m]) + G([b, c, m]) + G([c, d, m]) + G([d, a, m]); };
          s += rl(86) + rl(188) + rose(81, 150, 8) + rose(219, 150, 8);
          s += dome(150, 100, 64, [0, 32], [1, 0.5, 0, -0.5, -1]) + dome(150, 100, 64, [32, 64], [1, 0, -1]) + C(150, 32, 6) + P(heart(150, 20, 7.5));
          s += B(66, 98, 168, 12, 3) + rep(9, i => i === 4 ? '' : P(`M${69 + 18 * i} 110a9 9 0 0 0 18 0Z`));
          // princess
          s += P('M133 150Q126 128 138 118Q150 110 162 118Q174 128 167 150Q170 172 162 180H138Q130 172 133 150Z');
          s += P('M118 212Q122 192 134 180H166Q178 192 182 212Z') + P('M128 196Q131 178 140 168H160Q169 178 172 196Q165 202 157 197Q150 203 143 197Q135 202 128 196Z');
          s += P('M141 170L138 152Q150 146 162 152L159 170Z') + C(137, 155, 6.5) + C(163, 155, 6.5) + C(150, 134, 14);
          s += eye(144.5, 135, 2.3) + eye(155.5, 135, 2.3) + smile(150, 141, 3.5) + P('M135 136Q134 116 150 116Q166 116 165 136Q158 127 150 129Q142 127 135 136Z') + G('141,117 144,104 150,111 156,104 159,117') + rose(150, 170, 7.5);
          // rose bushes
          s += [12, 212].map(x => cloud(x, 282, 0.72) + [[16, -20], [38, -30], [58, -18], [32, -8]].map(([dx, dy]) => rose(x + dx, 282 + dy, 8)).join('') + [[6, -10, -60], [70, -10, 60], [48, -4, 20]].map(([dx, dy, a]) => P(leaf(x + dx, 282 + dy, 16, 9), ROT(a, x + dx, 282 + dy))).join('')).join('');
          return s;
        })() },

      // 8 ─ wizard tower
      { id: 'a10-wizard-tower', cat: 'fantasy',
        name: { en: 'Wizard tower', fr: 'Tour du magicien', es: 'Torre del mago', de: 'Zauberturm', zh: '巫师塔' },
        svg: (() => {
          let s = FRAME + P('M244 26A26 26 0 0 0 244 78A34 34 0 0 1 244 26Z');
          s += [[36, 36], [84, 64], [30, 132], [268, 124], [240, 176], [212, 64], [56, 200]].map(([x, y], i) => ST(x, y, 12.5, 5, i * 17)).join('') + [[96, 104], [208, 136], [270, 214]].map(([x, y]) => ST(x, y, 12, 4)).join('');
          s += BOT('M8 246C60 232 110 240 150 236C200 232 250 240 292 230') + E(40, 264, 18, 9) + E(258, 262, 16, 8) + E(150, 254, 16, 5.5) + E(146, 272, 18, 6);
          s += P('M114 252L120 116H180L186 252Z') + [[121, 124, 16], [163, 130, 15], [123, 176, 14], [164, 184, 14], [120, 212, 16], [165, 218, 15], [123, 236, 12], [166, 238, 13]].map(([x, y, w]) => B(x, y, w, 10, 3)).join('');
          s += MIR(P('M139 166V150Q139 138 150 138V166Z') + P('M140 214V200Q140 190 150 190V214Z')) + P('M138 252V238Q138 226 150 226Q162 226 162 238V252Z') + dot(157, 240, 2);
          s += rep(8, i => B(185 - i * 0.6, 242 - 12 * i, 20 - i, 8, 2)) + B(178, 136, 26, 8, 2) + ln('M205 250L198 146', 1.4);
          s += P('M106 112L120 86Q150 96 180 86L194 112Q150 124 106 112Z') + P('M120 86L134 60Q150 68 166 60L180 86Q150 96 120 86Z') + P('M134 60L150 30L166 60Q150 68 134 60Z');
          s += ST(150, 79, 13) + C(128, 100, 6) + C(172, 100, 6) + C(150, 51, 5.5) + E(150, 114, 56, 9) + P('M146 38Q160 16 186 20Q192 30 182 32Q168 28 156 44Z') + C(188, 26, 6.5);
          const bk = (x, y, a) => tg(ROT(a, x, y), MIR(P(`M${x} ${y}Q${x - 8} ${y - 6} ${x - 18} ${y - 3}L${x - 16} ${y + 10}Q${x - 8} ${y + 6} ${x} ${y + 11}Z`), x));
          s += bk(56, 92, -15) + bk(236, 102, 12) + bk(64, 158, 8);
          return s;
        })() },

      // 9 ─ kawaii café
      { id: 'a10-kawaii-cafe', cat: 'food',
        name: { en: 'Kawaii café', fr: 'Café kawaii', es: 'Cafetería kawaii', de: 'Kawaii-Café', zh: '可爱咖啡馆' },
        svg: (() => {
          const fc = (x, y) => eye(x - 6, y, 2.2) + eye(x + 6, y, 2.2) + smile(x, y + 5, 2.5);
          let s = FRAME + B(10, 12, 280, 8, 4) + rep(8, i => P(`M${14 + 34 * i} 20h34V36A17 11 0 0 1 ${14 + 34 * i} 36Z`));
          s += B(16, 106, 268, 9, 3) + B(16, 176, 268, 9, 3);
          // row 1
          s += E(36, 98, 11, 8, -35) + E(88, 98, 11, 8, 35) + E(46, 91, 12, 11, -15) + E(78, 91, 12, 11, 15) + E(62, 87, 14, 14) + fc(62, 86);
          s += C(150, 53, 5.5) + B(124, 56, 52, 10, 4) + P('M128 66H172Q180 66 180 76V98Q180 106 170 106H130Q120 106 120 98V76Q120 66 128 66Z') + E(150, 86, 18, 12) + fc(150, 84);
          s += B(208, 88, 56, 18, 2) + B(208, 78, 56, 10) + P('M206 80V70Q236 60 266 70V80Q259 86 252 80Q245 86 238 80Q231 86 224 80Q217 86 210 80Z') + P(heart(236, 57, 9.5), ROT(180, 236, 57)) + fc(236, 95);
          // row 2
          s += E(58, 174, 30, 5.5) + P('M79 140A13 13 0 0 1 79 166V159A6 6 0 0 0 79 147Z') + P('M36 138H80Q80 170 58 172Q36 170 36 138Z') + fc(58, 151) + ln('M50 132q-4 -5 0 -10t0 -10M64 132q-4 -5 0 -10t0 -10', 1.3);
          s += E(127, 174, 32, 5.5) + [111, 143].map(x => C(x, 156, 16) + ln(`M${x} 156m-3 0a3 3 0 1 1 3 3a6 6 0 1 1 6 -6a10 10 0 0 1 -9 12`, 1.3)).join('');
          s += E(196, 174, 28, 5) + P('M176 172L182 142H210L216 172Z') + P('M181 148L183 138Q196 132 209 138L211 148Q204 153 196 148Q188 153 181 148Z') + C(196, 128, 8) + C(203, 118, 5.5) + fc(196, 160);
          s += P('M230 174V156Q230 136 256 136Q282 136 282 156V174Z') + ln('M244 142l5 7M256 140l5 7M268 142l5 7', 1.4) + fc(256, 160);
          // counter
          s += B(8, 250, 284, 9) + BOT('M8 259H292') + [22, 111, 200].map(x => B(x, 266, 78, 18, 4)).join('');
          s += P('M34 250V214Q34 206 40 202V196H52V202Q58 206 58 214V250Z') + B(38, 188, 16, 9, 2) + fc(46, 226);
          s += C(82, 230, 12) + C(98, 238, 12) + dot(78, 226, 1.6) + dot(86, 233, 1.6) + dot(95, 235, 1.6) + dot(101, 242, 1.6);
          s += P('M136 250L144 238H156L164 250Z') + E(150, 236, 44, 4.5) + B(118, 212, 64, 22, 4) + B(128, 197, 44, 15, 4) + C(150, 192, 5.5) + fc(150, 221);
          s += C(236, 220, 8) + C(252, 215, 8) + C(266, 221, 8) + P('M222 226H278Q276 250 250 250Q224 250 222 226Z');
          return s;
        })() },

      // 10 ─ beetle collection
      { id: 'a10-beetles', cat: 'animals',
        name: { en: 'Beetle collection', fr: 'Collection de scarabées', es: 'Colección de escarabajos', de: 'Käfersammlung', zh: '甲虫收藏' },
        svg: (() => {
          let s = FRAME;
          const half = (cx, ey, rx, ry, sd, y1, y2) => { const p = [[cx, y1]]; for (let i = 0; i <= 10; i++) { const y = y1 + (y2 - y1) * i / 10, t = (y - ey) / ry; p.push([cx + sd * rx * Math.sqrt(Math.max(0, 1 - t * t)), y]); } p.push([cx, y2]); return G(p); };
          rep(6, i => {
            const x = 16 + (i % 3) * 92, y = 16 + Math.floor(i / 3) * 136, cx = x + 42, cy = y + 64, ey = cy + 12;
            s += B(x, y, 84, 128, 8);
            s += ln(rep(3, k => `M${cx - 20} ${cy - 6 + 18 * k}l-12 ${k * 6 - 6}l-4 ${6 + k * 4}M${cx + 20} ${cy - 6 + 18 * k}l12 ${k * 6 - 6}l4 ${6 + k * 4}`), 1.8) + ln(`M${cx - 4} ${cy - 42}q-8 -12 -16 -10M${cx + 4} ${cy - 42}q8 -12 16 -10`, 1.6);
            if (i === 2) s += MIR(P(`M${cx - 6} ${cy - 44}C${cx - 16} ${cy - 54} ${cx - 16} ${cy - 66} ${cx - 8} ${cy - 70}C${cx - 8} ${cy - 62} ${cx - 2} ${cy - 56} ${cx + 2} ${cy - 48}Z`), cx);
            if (i === 4) s += P(`M${cx - 6} ${cy - 44}C${cx - 8} ${cy - 58} ${cx - 2} ${cy - 66} ${cx + 8} ${cy - 70}C${cx + 4} ${cy - 62} ${cx + 6} ${cy - 54} ${cx + 6} ${cy - 44}Z`);
            s += E(cx, cy - 38, 11, 9) + eye(cx - 5, cy - 39, 1.8) + eye(cx + 5, cy - 39, 1.8) + E(cx, cy - 22, 21, 12);
            if (i === 0) { [-1, 1].forEach(sd => { [cy - 24, cy - 6, cy + 12, cy + 30, cy + 48].reduce((a, b) => { s += half(cx, ey, 26, 36, sd, a, b); return b; }); }); }
            else {
              s += half(cx, ey, 26, 36, -1, ey - 36, ey + 36) + half(cx, ey, 26, 36, 1, ey - 36, ey + 36);
              if (i === 1) s += MIR(P(heart(cx - 12, cy + 4, 7.5)) + P(heart(cx - 12, cy + 26, 7)), cx);
              if (i === 2) s += MIR(C(cx - 12, cy + 6, 7.5) + C(cx - 11, cy + 28, 6.5), cx);
              if (i === 3) s += MIR(half(cx, ey, 13, 30, -1, ey - 30, ey + 30), cx);
              if (i === 4) s += MIR(C(cx - 12, cy - 2, 5.5) + C(cx - 15, cy + 16, 5.5) + C(cx - 10, cy + 33, 5.5), cx);
              if (i === 5) s += MIR(ST(cx - 12, cy + 8, 11) + C(cx - 11, cy + 32, 6), cx);
            }
            s += dot(cx, cy - 26, 1.5);
            return '';
          });
          return s;
        })() },

      // 11 ─ skateboard decks
      { id: 'a10-skate-decks', cat: 'hobbies',
        name: { en: 'Skateboard decks', fr: 'Planches de skate', es: 'Tablas de skate', de: 'Skateboard-Decks', zh: '滑板板面设计' },
        svg: (() => {
          let s = FRAME + BOT('M8 266H292');
          const W = 48, H = 24;
          const deck = (cx, d) => {
            const x0 = cx - H, y0 = 30, Y1 = 66, Y2 = 230;
            let o = [y0 + 40, y0 + 196].map(y => B(x0 - 10, y - 9, 16, 18, 5) + B(x0 + W - 6, y - 9, 16, 18, 5)).join('');
            o += P(`M${x0} ${Y1}V${y0 + H}A${H} ${H} 0 0 1 ${x0 + W} ${y0 + H}V${Y1}Z`) + P(`M${x0} ${Y2}V${y0 + 236 - H}A${H} ${H} 0 0 0 ${x0 + W} ${y0 + 236 - H}V${Y2}Z`);
            o += [[cx - 6, y0 + 16], [cx + 6, y0 + 16], [cx - 6, y0 + 220], [cx + 6, y0 + 220]].map(([x, y]) => dot(x, y, 1.8)).join('');
            return o + d(x0, Y1, Y2);
          };
          const wave = (x0, Y1) => { let o = ''; const yb = k => x => Y1 + 27.3 * k + (k && k < 6 ? 5 * Math.sin((x - x0) / W * 2 * Math.PI) : 0); for (let k = 0; k < 6; k++) { const p = []; for (let i = 0; i <= 8; i++) p.push([x0 + 6 * i, yb(k)(x0 + 6 * i)]); for (let i = 8; i >= 0; i--) p.push([x0 + 6 * i, yb(k + 1)(x0 + 6 * i)]); o += G(p); } return o; };
          const chk = (x0, Y1) => rep(8, i => B(x0 + H * (i % 2), Y1 + 41 * Math.floor(i / 2), H, 41));
          const strs = (x0, Y1, Y2) => B(x0, Y1, W, Y2 - Y1) + ST(x0 + H, Y1 + 82, 20) + P(heart(x0 + H, Y1 + 28, 10)) + P(heart(x0 + H, Y1 + 136, 10)) + C(x0 + 12, Y1 + 54, 6) + C(x0 + 36, Y1 + 110, 6);
          const diag = (x0, Y1, Y2) => { const l = [0, 14, 48, 82, 116, 164], r = [0, 38, 72, 106, 140, 164]; return rep(5, k => G([[x0, Y1 + l[k]], [x0 + W, Y1 + r[k]], [x0 + W, Y1 + r[k + 1]], [x0, Y1 + l[k + 1]]])); };
          s += deck(44, wave) + deck(114, chk) + deck(186, strs) + deck(256, diag);
          return s;
        })() },

      // 12 ─ comic page hero
      { id: 'a10-comic-hero', cat: 'fantasy',
        name: { en: 'Comic book hero', fr: 'Héros de BD', es: 'Héroe de cómic', de: 'Comic-Held', zh: '漫画小英雄' },
        svg: (() => {
          let s = FRAME + B(16, 16, 268, 140, 6) + B(16, 164, 128, 120, 6) + B(152, 164, 132, 120, 6);
          s += cloud(30, 58, 0.55) + cloud(214, 46, 0.5) + cloud(104, 40, 0.4);
          s += [[24, 112, 30], [56, 96, 28], [86, 118, 34], [122, 104, 26], [150, 90, 30], [182, 112, 32], [216, 100, 30], [248, 116, 28]].map(([x, y, w]) => B(x, y, w, 156 - y)).join('');
          s += [[30, 122], [62, 108], [128, 116], [156, 102], [222, 112], [254, 126], [92, 130], [188, 124], [62, 130], [156, 124], [222, 134]].map(([x, y]) => B(x, y, 12, 12, 2)).join('');
          s += ln('M30 70h24M24 84h34M36 98h22', 1.6);
          s += P('M120 64C96 54 74 62 52 50C60 66 56 82 66 92C90 92 108 90 122 86Z');
          s += P(tube([[122, 78], [108, 76], [94, 74], [82, 72]], 12, 11)) + P(tube([[122, 86], [108, 88], [94, 90], [82, 92]], 12, 11)) + E(76, 71, 9, 7) + E(76, 93, 9, 7);
          s += P('M116 70Q140 64 160 70L160 92Q140 96 116 92Z') + ST(138, 81, 11) + P(tube([[156, 72], [170, 66], [184, 60], [194, 54]], 10, 9)) + C(198, 52, 7);
          s += C(172, 86, 13) + P('M158 82Q160 68 174 70Q188 72 186 82Q178 76 170 80Q164 76 158 82Z') + P('M160 84Q172 79 185 84L185 92Q172 89 160 92Z') + eye(167, 88, 1.8) + eye(178, 88, 1.8) + smile(173, 95, 3);
          // close-up panel
          s += P('M24 284Q30 262 80 260Q130 262 136 284Z') + C(80, 230, 32) + P('M48 228Q46 196 80 196Q114 196 112 228Q104 210 92 214Q84 204 76 212Q62 208 48 228Z');
          s += P('M50 226Q80 216 110 226L110 240Q80 232 50 240Z') + eye(68, 231, 3.6) + eye(92, 231, 3.6) + smile(80, 248, 8);
          s += P('M96 186A24 15 0 1 1 124 198L132 210L114 199A24 15 0 0 1 96 186Z') + ST(80, 272, 11);
          // emblem panel
          s += P(star(218, 224, 54, 40, 12)) + C(218, 224, 31) + ST(218, 224, 22) + [[168, 180], [268, 180], [168, 268], [268, 268]].map(([x, y]) => ST(x, y, 12, 4)).join('');
          return s;
        })() },

      // 13 ─ geometric kaleidoscope
      { id: 'a10-geometric', cat: 'patterns',
        name: { en: 'Geometric kaleidoscope', fr: 'Kaléidoscope géométrique', es: 'Caleidoscopio geométrico', de: 'Geometrisches Kaleidoskop', zh: '几何万花筒' },
        svg: (() => {
          const Ls = [[0, 0, 0], [34, 24, 0], [52, 52, 15], [84, 74, 15], [104, 104, 0], [140, 108, 0]], v =(l, m) => pt(150, 150, Ls[l][(m + 12) % 2], 30 * m + Ls[l][2]);
          const q = (l, m) => G([v(l, m), v(l + 1, m), v(l + 1, m + 1), v(l, m + 1)]);
          let s = FRAME + ring(4, 150, 150, () => P('M8 64V24A16 16 0 0 1 24 8H64Z'));
          s += G(rep0(12, m => v(1, m))) + C(150, 150, 9) + rep(12, m => G([v(1, m), v(2, m), v(1, m + 1)]) + G([v(2, m - 1), v(1, m), v(2, m)]) + q(2, m));
          s += rep(12, m => G([v(3, m - 1), v(4, m), v(3, m)]) + G([v(4, m), v(3, m), v(4, m + 1)]) + q(4, m));
          return s + rep(6, m => dot(...v(5, 2 * m), 2.2));
        })() },

      // 14 ─ gaming room
      { id: 'a10-gaming-room', cat: 'things',
        name: { en: 'Gaming room', fr: 'Coin jeux vidéo', es: 'Rincón gamer', de: 'Gaming-Zimmer', zh: '游戏房间' },
        svg: (() => {
          let s = FRAME + BOT('M8 236H292') + E(150, 268, 96, 15) + B(22, 40, 50, 62, 3) + P(heart(47, 70, 13));
          s += ln('M12 22Q80 42 146 28T290 24', 1.4) + [[30, 32], [62, 38], [96, 38], [128, 32], [164, 29], [200, 33], [236, 34], [270, 29]].map(([x, y]) => C(x, y, 5.5)).join('');
          s += B(222, 74, 64, 7, 2) + [[-40, 232], [0, 238], [40, 244]].map(([a, x]) => P(leaf(x, 62, 20, 10), ROT(a, x, 62))).join('') + P('M228 74L231 60H245L248 74Z') + E(271, 64, 10, 10) + eye(267, 63, 1.8) + eye(275, 63, 1.8);
          s += P('M24 160H276L286 180H14Z') + B(14, 180, 272, 12, 2) + B(24, 192, 12, 46) + B(264, 192, 12, 46);
          s += B(96, 62, 108, 72, 6) + B(103, 69, 94, 56) + P('M103 112Q130 104 150 110T197 108V125H103Z') + C(182, 84, 8) + P(heart(158, 90, 7.5)) + B(126, 86, 12, 12) + B(124, 98, 16, 12) + dot(130, 91, 1.5) + dot(134, 91, 1.5);
          s += [66, 212].map(x => B(x, 108, 22, 58, 4) + C(x + 11, 124, 6) + C(x + 11, 148, 8)).join('');
          s += P('M28 168Q28 160 38 160H66Q76 160 76 168L78 178Q76 184 68 180L62 176H42L36 180Q28 184 26 178Z') + ln('M38 166h8M42 162v8M64 166h1M60 170h1', 1.8);
          s += P('M196 164H236L240 178H192Z') + E(216, 171, 8, 5.5) + E(255, 172, 15, 4.5) + B(252, 116, 6, 56) + P('M236 126Q236 101 255 101Q274 101 274 126H265Q265 111 255 111Q245 111 245 126Z') + E(240, 128, 7, 10) + E(270, 128, 7, 10);
          // chair seen from behind
          s += P('M104 240Q150 232 196 240L198 256Q150 264 102 256Z') + P('M116 244V150Q116 130 150 130Q184 130 184 150V244Z') + B(138, 160, 24, 84) + B(128, 140, 44, 16, 7) + B(100, 206, 14, 36, 4) + B(186, 206, 14, 36, 4);
          s += B(145, 258, 10, 12) + P('M108 278L144 268H156L192 278L190 284H158L150 278L142 284H110Z') + C(112, 282, 6) + C(188, 282, 6) + C(150, 283, 6);
          return s;
        })() },

      // 15 ─ climbing wall
      { id: 'a10-climbing-wall', cat: 'hobbies',
        name: { en: 'Climbing wall', fr: "Mur d'escalade", es: 'Rocódromo', de: 'Kletterwand', zh: '攀岩墙' },
        svg: (() => {
          const cx = [14, 84, 170, 228, 286], ry = [14, 96, 176, 254];
          let s = FRAME + rep(12, i => { const c = i % 4, r = Math.floor(i / 4); return B(cx[c], ry[r], cx[c + 1] - cx[c] - 4, ry[r + 1] - ry[r] - 4, 4); });
          s += P('M8 258H102V292H24A16 16 0 0 1 8 276Z') + B(102, 258, 96, 34) + P('M198 258H292V276A16 16 0 0 1 276 292H198Z');
          s += [[122, 56, 'c'], [190, 120, 'e'], [124, 223, 'e'], [186, 236, 'c'], [38, 36, 'c'], [66, 64, 't'], [30, 110, 'e'], [62, 142, 'c'], [36, 186, 't'], [70, 222, 'e'], [104, 28, 'e'], [204, 30, 'c'], [254, 42, 't'], [270, 92, 'e'], [240, 124, 'c'], [264, 164, 't'], [226, 194, 'e'], [262, 228, 'c'], [204, 80, 't'], [96, 104, 'c'], [214, 160, 'c']].map(([x, y, t], i) => t === 'c' ? C(x, y, 9.5) : t === 'e' ? E(x, y, 11, 7.5, i * 37 % 180) : P(star(x, y, 12, 6.5, 3, i * 29))).join('');
          s += B(166, 14, 8, 108) + C(170, 18, 7);
          s += P(tube([[144, 168], [132, 176], [124, 186], [122, 206]], 13, 12)) + P(tube([[158, 168], [166, 184], [172, 200], [178, 218]], 13, 12)) + E(122, 211, 9, 6) + E(181, 222, 9, 6);
          s += P('M136 156H168L172 178H156L152 170L148 178H132Z') + P('M138 114Q152 108 166 114L168 158H136Z') + B(134, 150, 36, 9, 3) + C(172, 162, 6.5);
          s += P(tube([[140, 118], [132, 100], [126, 82], [122, 68]], 10, 9)) + P(tube([[164, 120], [174, 126], [180, 128], [188, 128]], 10, 9)) + C(122, 65, 6.5) + C(190, 128, 6.5);
          s += C(152, 98, 13) + P('M137 97Q137 80 152 80Q167 80 167 97Z') + eye(158, 101, 2.2) + smile(158, 106, 3);
          return s;
        })() },

      // 16 ─ reading nook
      { id: 'a10-bookshelf-nook', cat: 'things',
        name: { en: 'Reading nook', fr: 'Coin lecture', es: 'Rincón de lectura', de: 'Leseecke', zh: '读书角' },
        svg: (() => {
          let s = FRAME + BOT('M8 250H292') + E(150, 272, 96, 14);
          const ws = [13, 15, 12, 16, 14, 13, 15], hs = [50, 44, 54, 40, 48, 52, 42];
          [14, 208].forEach((x, side) => {
            s += B(x, 30, 78, 220, 4);
            [[38, 92], [100, 156], [164, 220]].forEach(([top, bot], r) => { let bx = x + 4; for (let k = 0; k < 5; k++) { const j = (k + r * 2 + side * 3) % 7, w = ws[j], h = Math.min(hs[j], bot - top - 4); s += B(bx, bot - h, w, h, 2) + (k % 2 ? dot(bx + w / 2, bot - h + 8, 2) : ''); bx += w; } });
            s += [92, 156, 220].map(y => B(x, y, 78, 8, 2)).join('');
          });
          s += B(106, 40, 88, 96, 4) + [[112, 46], [152, 46], [112, 90], [152, 90]].map(([x, y]) => B(x, y, 36, 40)).join('') + C(130, 62, 8.5) + dot(127, 60, 1.6) + dot(133, 65, 1.3);
          s += B(92, 26, 116, 6, 3) + MIR(P('M98 32H118Q112 70 122 96Q108 110 104 146H96Z'));
          s += B(96, 192, 108, 58, 3) + B(104, 202, 42, 36, 3) + B(154, 202, 42, 36, 3) + B(92, 176, 116, 16, 6) + dot(125, 220, 2.2) + dot(175, 220, 2.2);
          s += B(102, 146, 30, 30, 8, ROT(-10, 117, 161)) + B(168, 146, 30, 30, 8, ROT(10, 183, 161)) + C(150, 164, 11) + MIR(P('M150 182Q140 176 126 178L128 168Q140 166 150 172Z'));
          return s;
        })() },

      // 17 ─ feather mandala
      { id: 'a10-feather-mandala', cat: 'patterns',
        name: { en: 'Feather mandala', fr: 'Mandala de plumes', es: 'Mandala de plumas', de: 'Federn-Mandala', zh: '羽毛曼陀罗' },
        svg: (() => {
          const fw = t => 16 * Math.sqrt(Math.max(0, Math.sin(Math.PI * t))) * (1 - 0.2 * t), Y = t => 110 - 96 * t, tb = [0, 0.4, 0.68, 1];
          let f = '';
          for (let k = 0; k < 3; k++) [-1, 1].forEach(sd => { const a = tb[k] + (k ? 0.07 : 0), b = tb[k + 1] + (k < 2 ? 0.07 : 0), p = [[150, Y(tb[k])]]; for (let i = 0; i <= 8; i++) { const t = a + (b - a) * i / 8; p.push([150 + sd * fw(t), Y(t)]); } p.push([150, Y(tb[k + 1])]); f += G(p); });
          let s = ring(12, 150, 150, () => f) + rep(12, k => C(...pt(150, 150, 126, 15 + 30 * k), 6.5));
          return s + C(150, 150, 44) + ring(8, 150, 150, () => P(pet(150, 138, 26, 9))) + C(150, 150, 12) + dot(150, 150, 3);
        })() },

      // 18 ─ mountain lake
      { id: 'a10-mountain-lake', cat: 'nature',
        name: { en: 'Mountain lake', fr: 'Lac de montagne', es: 'Lago de montaña', de: 'Bergsee', zh: '高山湖泊' },
        svg: (() => {
          let s = FRAME + ring(8, 236, 50, () => P(pet(236, 32, 14, 8))) + C(236, 50, 16) + cloud(18, 76, 0.7) + cloud(118, 44, 0.5) + ln('M96 92q5 -5 10 0q5 -5 10 0M126 104q4 -4 8 0q4 -4 8 0', 1.6);
          const mt = (px, py, lx, rx, by) => { const mx = px + (rx - px) * 0.3, f = 0.3, L = [px + (lx - px) * f, py + (by - py) * f], Rr = [px + (rx - px) * f, py + (by - py) * f]; const lp = (t, d) => [Rr[0] + (L[0] - Rr[0]) * t, Rr[1] + (L[1] - Rr[1]) * t + d]; return G([[lx, by], [px, py], [mx, by]]) + G([[px, py], [rx, by], [mx, by]]) + G([[px, py], Rr, lp(0.25, 9), lp(0.5, 0), lp(0.75, 9), L]); };
          s += mt(64, 94, 8, 150, 196) + mt(250, 100, 176, 292, 196) + mt(160, 58, 66, 254, 200);
          s += P('M8 186Q80 170 150 184T292 178V214H8Z');
          s += rep(10, i => { const x = 22 + i * 28.4, h = 38 + (i * 5) % 12, w = 13, y = 213; return G([[x - w, y], [x + w, y], [x, y - h * 0.62]]) + G([[x - w * 0.72, y - h * 0.4], [x + w * 0.72, y - h * 0.4], [x, y - h]]); });
          s += P('M8 212H292V256Q220 250 150 260T8 254Z') + [[64, 40], [250, 36], [160, 52]].map(([x, d]) => G([[x - 20, 212], [x + 20, 212], [x, 212 + d]])).join('') + E(100, 246, 26, 4.5) + E(222, 240, 22, 4.5);
          s += P('M112 236Q150 250 196 236L188 228H120Z') + B(144, 222, 20, 9, 2);
          s += BOT('M8 254Q80 246 150 256T292 250') + E(40, 270, 22, 10) + E(72, 280, 14, 7) + [[228, 270], [252, 278], [272, 266]].map(([x, y]) => ln(`M${x} ${y + 12}V${y + 4}`, 1.6) + C(x, y, 6)).join('');
          return s;
        })() },

      // 19 ─ succulent garden
      { id: 'a10-succulents', cat: 'nature',
        name: { en: 'Succulent garden', fr: 'Jardin de succulentes', es: 'Jardín de suculentas', de: 'Sukkulentengarten', zh: '多肉植物花园' },
        svg: (() => {
          let s = FRAME + BOT('M8 248H292');
          // hanging pots
          s += ln('M60 8L40 46M60 8L80 46M240 8L220 46M240 8L260 46', 1.3);
          s += [44, 60, 76].map((x, j) => rep(4 - (j % 2), i => C(x + (i % 2 ? 2 : -2), 82 + i * 11 + j * 4, 5.5))).join('');
          s += [[222, 86, 20], [238, 96, -10], [254, 86, 15], [266, 98, -15]].map(([x, y, a]) => P(heart(x, y, 8.5), ROT(a, x, y))).join('') + ln('M226 74Q224 80 222 80M240 74Q238 84 238 90M252 74V80M260 72Q266 84 266 92', 1.2);
          s += [60, 240].map(x => P(`M${x - 24} 52H${x + 24}Q${x + 22} 76 ${x} 76Q${x - 22} 76 ${x - 24} 52Z`) + B(x - 28, 46, 56, 8, 3)).join('');
          // pot 1 with rosette
          s += P('M30 192H86L80 248H36Z') + P('M32 206L40 214L48 206L56 214L64 206L72 214L84 206L83 220L72 228L64 220L56 228L48 220L40 228L34 220Z') + B(24, 182, 64, 12, 3);
          s += ring(8, 56, 158, () => P(pet(56, 152, 24, 11)), 22.5) + ring(5, 56, 158, () => P(pet(56, 158, 18, 10))) + C(56, 158, 6);
          // pot 2 with aloe
          s += [[-66, 56], [-44, 70], [-22, 82], [0, 92], [22, 82], [44, 70], [66, 56]].map(([a, h]) => P(leaf(150, 178, h, Math.abs(a) > 60 ? 17 : 14), ROT(a, 150, 178))).join('');
          s += B(118, 178, 64, 70, 6) + B(118, 198, 64, 12) + B(118, 222, 64, 12) + B(112, 170, 76, 12, 4);
          // pot 3 with jade
          s += ln('M242 190V164L226 146M242 172L262 152M242 164V134', 2);
          s += [[226, 142, -30], [212, 152, 20], [230, 128, 10], [262, 148, 30], [276, 160, -20], [256, 132, -10], [242, 116, 0], [228, 168, 40], [258, 170, -40]].map(([x, y, a]) => E(x, y, 10, 7, a)).join('');
          s += P('M206 196H278Q276 248 242 248Q208 248 206 196Z') + B(202, 188, 80, 10, 4) + [[226, 218], [242, 228], [258, 218]].map(([x, y]) => C(x, y, 6)).join('');
          return s;
        })() },

      // 20 ─ Christmas baubles
      { id: 'a10-christmas-ornaments', cat: 'holidays',
        name: { en: 'Christmas baubles', fr: 'Boules de Noël', es: 'Bolas de Navidad', de: 'Weihnachtskugeln', zh: '圣诞彩球' },
        svg: (() => {
          const BR = [[8, 46], [90, 56], [200, 32], [292, 42]], bc = t => bz(...BR, t);
          let s = FRAME + [[110, 100], [190, 100], [24, 184], [276, 184]].map(([x, y], i) => ST(x, y, 13, i % 2 ? 5 : 4)).join('');
          for (let k = 0; k < 6; k++) { const d = k < 3 ? -1 : 1, t0 = (k % 3) / 3, p = []; for (let i = 0; i <= 8; i++) { const v = bc(t0 + i / 24); p.push([v[0], v[1] + d * (i % 2 ? 22 : 10)]); } for (let i = 8; i >= 0; i--) { const v = bc(t0 + i / 24); p.push([v[0], v[1] - d * 3]); } s += G(p); }
          s += P(tube(BR, 13, 11)) + E(92, 70, 8, 12) + E(214, 60, 8, 12) + ln('M86 66l12 4M86 74l12 -4M208 56l12 4M208 64l12 -4', 1.3);
          const bau = (cx, cy, r, bs) => {
            const an = v => Math.atan2(v[1] - cy, v[0] - cx), arc = (a, b) => { let d = b - a; if (d < 0) d += 2 * Math.PI; return rep0(7, i => [cx + r * Math.cos(a + d * (i + 1) / 8), cy + r * Math.sin(a + d * (i + 1) / 8)]); };
            const bp = b => { const [y0, a, n] = b, w = Math.sqrt(r * r - (y0 - cy) ** 2); return rep0(2 * n + 1, i => [cx - w + w * i / n, y0 + (i % 2 ? a : 0)]); };
            const L2 = [null, ...bs, null]; let o = '';
            for (let k = 0; k < L2.length - 1; k++) { const T = L2[k] && bp(L2[k]), U = L2[k + 1] && bp(L2[k + 1]), tp = [cx, cy - r], bt = [cx, cy + r]; let p = T ? T.slice() : [tp]; p.push(...arc(an(T ? T[T.length - 1] : tp), an(U ? U[U.length - 1] : bt))); p.push(...(U ? U.slice().reverse() : [bt])); p.push(...arc(an(U ? U[0] : bt), an(T ? T[0] : tp))); o += G(p); }
            return o;
          };
          const cap = (cx, y) => ln(`M${cx} ${n1(bc((cx - 8) / 284)[1])}V${y - 12}`, 1.3) + `<circle cx="${cx}" cy="${y - 11}" r="3" fill="none" stroke="${INK}" stroke-width="1.6"/>` + B(cx - 8, y - 9, 16, 10, 2);
          s += cap(60, 100) + cap(240, 100) + cap(66, 208) + cap(234, 208) + cap(150, 136);
          s += bau(150, 178, 42, [[146, 0, 1], [162, 5, 6], [194, 5, 6], [210, 0, 1]]) + [122, 150, 178].map(x => C(x, 180, 5.5)).join('');
          s += lan(60, 130, 30, 30, 0).split('<rect')[0] + bau(66, 236, 28, [[222, 0, 1], [236, 4, 4], [250, 0, 1]]) + bau(234, 236, 28, [[221, 4, 4], [251, 4, 4]]) + P(heart(234, 237, 9));
          s += C(240, 130, 30) + [[240, 112], [223, 127], [257, 127], [231, 147], [249, 147]].map(([x, y]) => C(x, y, 6.5)).join('');
          s += [-62, 62].map(a => P(pet(150, 44, 24, 12), ROT(a, 150, 44))).join('') + [160, 200].map(a => P(leaf(150, 44, 28, 10), ROT(a, 150, 44))).join('') + C(150, 44, 7);
          s += [[244, 40, -100], [262, 41, 82]].map(([x, y, a]) => P(leaf(x, y, 26, 13), ROT(a, x, y))).join('') + C(246, 42, 6) + C(258, 44, 6) + C(252, 31, 6);
          return s;
        })() },

      // 21 ─ Ferris wheel
      { id: 'a10-ferris-wheel', cat: 'things',
        name: { en: 'Ferris wheel', fr: 'Grande roue', es: 'Noria', de: 'Riesenrad', zh: '摩天轮' },
        svg: (() => {
          let s = FRAME + cloud(12, 100, 0.5) + cloud(236, 96, 0.5) + BOT('M8 262H292');
          s += [10, 234].map(x => B(x + 4, 214, 48, 48) + P(`M${x + 20} 262V242Q${x + 28} 232 ${x + 36} 242V262Z`) + rep(3, i => G([[x + 28, 178], [x + 56 * i / 3, 216], [x + 56 * (i + 1) / 3, 216]])) + ln(`M${x + 28} 178V160`, 1.6) + G(`${x + 28},158 ${x + 48},167 ${x + 28},176`)).join('');
          s += MIR(ln('M8 16L74 39', 1.3) + [[12, 18], [32, 25], [52, 32]].map(([x, y]) => G([[x, y], [x + 18, y + 6], [x + 6, y + 22]])).join(''));
          s += G('171,200 193,200 220,258 196,258') + G('107,200 129,200 104,258 80,258') + B(70, 256, 160, 10, 3);
          s += `<path ${R} fill-rule="evenodd" d="M44 128a106 106 0 1 0 212 0a106 106 0 1 0 -212 0ZM54 128a96 96 0 1 0 192 0a96 96 0 1 0 -192 0Z"/>`;
          s += rep(8, k => P(sec(150, 128, 40, 96, 45 * k, 45 * k + 45)) + P(sec(150, 128, 12, 40, 45 * k, 45 * k + 45))) + C(150, 128, 13) + dot(150, 128, 3) + rep(16, k => dot(...pt(150, 128, 101, 11.25 + 22.5 * k), 1.8));
          s += rep(8, k => { const [x, y] = pt(150, 128, 101, 45 * k); return P(`M${x - 13} ${y + 8}Q${x} ${y - 12} ${x + 13} ${y + 8}Z`) + dot(x, y + 1, 2) + P(`M${x - 12} ${y + 8}H${x + 12}V${y + 19}Q${x + 12} ${y + 27} ${x} ${y + 27}Q${x - 12} ${y + 27} ${x - 12} ${y + 19}Z`); });
          return s;
        })() },

      // 22 ─ knight's armour
      { id: 'a10-armour', cat: 'fantasy',
        name: { en: "Knight's armour", fr: 'Armure de chevalier', es: 'Armadura de caballero', de: 'Ritterrüstung', zh: '骑士盔甲' },
        svg: (() => {
          let s = FRAME + [[96, 24, 26], [212, 30, 24], [90, 226, 24], [230, 160, 26], [240, 210, 22], [18, 132, 22]].map(([x, y, w]) => B(x, y, w, 13, 3)).join('');
          s += MIR(B(16, 18, 56, 7, 3) + P('M22 25H66V122L44 110L22 122Z') + G([[44, 46], [58, 70], [44, 94], [30, 70]]));
          s += BOT('M8 244H292') + P('M110 248L118 234H182L190 248Z') + B(146, 210, 8, 26);
          s += P('M24 156H84V198Q84 228 54 240Q24 228 24 198Z') + P('M24 156H54V188H24Z') + P('M54 156H84V188H54Z') + C(54, 188, 9);
          s += MIR(B(98, 138, 16, 30, 6) + C(106, 174, 8.5) + P('M98 182H114L112 206H100Z') + P('M98 206H114V218Q106 226 98 218Z'));
          s += B(122, 185, 27, 14, 3) + B(151, 185, 27, 14, 3) + B(124, 199, 25, 14, 3) + B(151, 199, 25, 14, 3);
          s += MIR(P('M150 118Q132 118 124 124L122 170Q134 178 150 178Z')) + C(150, 146, 13) + P(heart(150, 147, 7.5)) + B(122, 176, 56, 9, 3) + B(143, 173, 14, 14, 2);
          s += P('M126 112Q150 120 174 112L178 122Q150 130 122 122Z') + P('M130 102Q150 110 170 102L174 112Q150 120 126 112Z');
          s += MIR(P(sec(116, 132, 22, 31, -125, 15)) + P(sec(116, 132, 13, 22, -125, 15)) + P(sec(116, 132, 0, 13, -125, 15)));
          s += [-24, 0, 24].map(a => P(leaf(150, 60, a ? 40 : 46, 10), ROT(a, 150, 60))).join('') + P('M128 102V74Q128 54 150 54Q172 54 172 74V102Q150 110 128 102Z') + P('M130 76Q150 68 170 76V91Q150 97 130 91Z') + ln('M138 81h24M140 86h20', 1.6) + [138, 144, 156, 162].map(x => dot(x, 98, 1.3)).join('');
          return s;
        })() },

      // 23 ─ world landmarks
      { id: 'a10-landmarks', cat: 'things',
        name: { en: 'World landmarks', fr: 'Monuments du monde', es: 'Monumentos del mundo', de: 'Wahrzeichen der Welt', zh: '世界地标' },
        svg: (() => {
          const sm = (x, y) => cloud(x, y, 0.3);
          const lm = [
            () => sm(4, 34) + C(54, 20, 8) + P('M14 92L28 52H40L54 92H44Q34 70 24 92Z') + P('M25 50L30 30L34 6L38 30L43 50Z') + B(22, 47, 24, 8, 2),
            () => C(16, 22, 8) + G([[2, 92], [28, 40], [34, 92]]) + G([[28, 40], [54, 92], [34, 92]]) + G([[42, 92], [56, 60], [68, 92]]),
            () => sm(36, 26) + B(22, 34, 24, 58) + G('19,35 34,8 49,35') + C(34, 47, 8) + ln('M34 47v-5M34 47h4', 1.4) + B(28, 62, 12, 13, 2) + B(28, 79, 12, 13, 2),
            () => sm(6, 24) + tg(ROT(7, 34, 92), rep(5, i => B(21, 78 - 14 * i, 26, 14)) + B(24, 16, 20, 8, 2) + rep(5, i => dot(34, 85 - 14 * i, 1.6))),
            () => C(54, 18, 7) + B(4, 46, 9, 46, 2) + B(55, 46, 9, 46, 2) + P('M18 64C18 50 34 46 34 28C34 46 50 50 50 64Z') + B(12, 64, 44, 28) + P('M28 92V80Q34 72 40 80V92Z') + dot(34, 25, 1.8),
            () => C(52, 22, 9) + sm(2, 30) + P('M0 92L26 40H42L68 92Z') + G([[26, 40], [42, 40], [49, 54], [43, 51], [38, 58], [32, 51], [25, 57], [19, 54]])
          ];
          let s = FRAME;
          rep(6, i => { const x = 16 + (i % 3) * 92, y = 18 + Math.floor(i / 3) * 136; s += `<path ${R} fill-rule="evenodd" d="M${x} ${y}h84v126h-84ZM${x + 8} ${y + 8}v110h68v-110Z"/>` + B(x + 8, y + 8, 68, 110) + tg(`translate(${x + 8} ${y + 8})`, B(0, 92, 68, 18) + lm[i]()) + rep(6, k => `<circle cx="${x + 7 + k * 14}" cy="${y + 4}" r="1.6" fill="${INK}"/><circle cx="${x + 7 + k * 14}" cy="${y + 122}" r="1.6" fill="${INK}"/>`); return ''; });
          return s;
        })() },

      // 24 ─ treetop village
      { id: 'a10-treetop-village', cat: 'fantasy',
        name: { en: 'Treetop village', fr: 'Village dans les arbres', es: 'Aldea en los árboles', de: 'Baumhausdorf', zh: '树顶村庄' },
        svg: (() => {
          let s = FRAME + C(270, 26, 11) + ln('M118 30q5 -5 10 0q5 -5 10 0M160 22q4 -4 8 0q4 -4 8 0', 1.6);
          s += B(37, 60, 26, 232) + B(135, 50, 30, 242) + B(237, 60, 26, 232) + BOT('M8 262Q80 252 150 262T292 256');
          s += cloud(4, 92, 1) + cloud(186, 96, 0.98) + cloud(94, 70, 1.02) + cloud(20, 62, 0.5) + cloud(220, 64, 0.5);
          s += [[30, 64], [72, 58], [118, 40], [176, 38], [214, 66], [264, 60]].map(([x, y]) => C(x, y, 6)).join('');
          s += cloud(10, 288, 0.55) + cloud(222, 288, 0.6);
          const brg = (a, b, c, d, e, f, g, h) => { const p = []; for (let i = 0; i <= 10; i++) p.push(bz(e, f, g, h, i / 10)); for (let i = 10; i >= 0; i--) p.push(bz(a, b, c, d, i / 10)); return G(p) + P(tube([a, b, c, d], 9, 9)) + P(tube([e, f, g, h], 6, 6)); };
          s += brg([180, 120], [196, 150], [206, 160], [220, 170], [180, 100], [198, 124], [206, 134], [220, 146]) + brg([80, 148], [96, 146], [106, 132], [120, 120], [80, 126], [96, 122], [104, 108], [120, 98]);
          s += ln('M100 145V156M200 156V168', 1.3) + E(100, 162, 6, 8) + E(200, 174, 6, 8);
          const hut = (cx, py) => B(cx - 30, py, 60, 9, 3) + B(cx - 22, py - 34, 44, 34, 5) + G([[cx - 28, py - 32], [cx + 28, py - 32], [cx, py - 60]]) + B(cx - 16, py - 24, 12, 24, 5) + C(cx + 11, py - 20, 6) + ln(`M${cx} ${py - 60}V${py - 78}`, 1.6) + G(`${cx},${py - 80} ${cx + 20},${py - 72} ${cx},${py - 64}`);
          s += hut(50, 150) + hut(150, 122) + hut(250, 172);
          s += rep(4, i => B(150 + (i % 2 ? 2 : -30), 160 + 22 * i, 28, 8, 3)) + [[22, 200, -60], [78, 210, 60], [222, 230, -60], [276, 236, 60]].map(([x, y, a]) => P(leaf(x, y, 20, 10), ROT(a, x, y))).join('');
          return s;
        })() },

      // 25 ─ steampunk airship
      { id: 'a10-airship', cat: 'vehicles',
        name: { en: 'Steampunk airship', fr: 'Dirigeable steampunk', es: 'Dirigible steampunk', de: 'Steampunk-Luftschiff', zh: '蒸汽朋克飞艇' },
        svg: (() => {
          const cx = 150, cy = 96, rx = 118, ry = 50, hh = x => ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
          const cell = (x0, x1, v0, v1) => { const p = []; for (let i = 0; i <= 8; i++) { const x = x0 + (x1 - x0) * i / 8; p.push([x, cy + v0 * hh(x)]); } for (let i = 8; i >= 0; i--) { const x = x0 + (x1 - x0) * i / 8; p.push([x, cy + v1 * hh(x)]); } return G(p); };
          let s = FRAME + cloud(14, 236, 0.8) + cloud(196, 262, 0.75) + cloud(16, 52, 0.4) + cloud(226, 214, 0.45) + cloud(104, 284, 0.55) + cloud(150, 30, 0.35) + ln('M60 196q5 -5 10 0q5 -5 10 0M246 30q4 -4 8 0q4 -4 8 0', 1.6);
          s += G('230,60 268,28 286,28 266,74') + G('248,46 268,28 286,28 272,46') + G('230,132 268,164 286,164 266,118') + G('248,146 268,164 286,164 272,146');
          s += cell(32, 54, -1, 1) + cell(54, 74, -1, 1) + cell(226, 246, -1, 1) + cell(246, 268, -1, 1);
          const vs = [-1, -0.6, -0.2, 0.2, 0.6, 1]; for (let c = 0; c < 4; c++) for (let b = 0; b < 5; b++) s += cell(74 + 38 * c, 112 + 38 * c, vs[b], vs[b + 1]);
          s += ln('M112 145L114 152M188 145L186 152M134 146V150M166 146V150', 1.6) + ln('M78 180H96M204 180H222', 3);
          s += P('M96 176H204Q200 200 176 204H124Q100 200 96 176Z') + B(108, 154, 84, 24, 4) + B(102, 148, 96, 8, 3) + [123, 141, 159, 177].map(x => C(x, 166, 6)).join('') + [132, 168].map(x => P(star(x, 190, 10, 7, 8)) + dot(x, 190, 2.4)).join('') + ln('M146 204V222M154 204V222', 1.3) + B(140, 220, 20, 16, 2);
          s += [80, 220].map(x => E(x, 166, 5, 11) + E(x, 194, 5, 11) + C(x, 180, 6)).join('');
          return s;
        })() },

      // 26 ─ chess set
      { id: 'a10-chess', cat: 'hobbies',
        name: { en: 'Chess set', fr: "Jeu d'échecs", es: 'Juego de ajedrez', de: 'Schachspiel', zh: '国际象棋' },
        svg: (() => {
          let s = FRAME + B(8, 176, 284, 34) + P('M50 208H250L282 286H18Z');
          const ry = [214, 228, 244, 262, 282], hw = y => 94 + (y - 214) / 68 * 32, xl = (y, c) => 150 - hw(y) + c * hw(y) / 4;
          for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) s += G([[xl(ry[r], c), ry[r]], [xl(ry[r], c + 1), ry[r]], [xl(ry[r + 1], c + 1), ry[r + 1]], [xl(ry[r + 1], c), ry[r + 1]]]);
          const base = x => P(`M${x - 20} 202V194Q${x - 20} 188 ${x - 14} 188H${x + 14}Q${x + 20} 188 ${x + 20} 194V202Z`) + B(x - 15, 180, 30, 8, 3);
          const body = (x, t, w) => P(`M${x - 13} 180Q${x - 6} ${t + 22} ${x - w} ${t}H${x + w}Q${x + 6} ${t + 22} ${x + 13} 180Z`);
          let x = 36; s += base(x) + body(x, 132, 9) + B(x - 14, 125, 28, 8, 3) + P(`M${x - 15} 126V110H${x - 9}V117H${x - 3}V110H${x + 3}V117H${x + 9}V110H${x + 15}V126Z`);
          x = 82; s += base(x) + P(`M${x + 12} 180L${x + 14} 150C${x + 16} 128 ${x + 6} 112 ${x - 8} 110L${x - 10} 100L${x - 15} 113C${x - 24} 119 ${x - 26} 129 ${x - 20} 135C${x - 14} 139 ${x - 8} 135 ${x - 2} 137C${x - 6} 150 ${x - 12} 164 ${x - 13} 180Z`) + P(`M${x + 14} 152C${x + 16} 130 ${x + 6} 114 ${x - 8} 110L${x - 1} 105C${x + 15} 109 ${x + 25} 129 ${x + 22} 156Z`) + eye(x - 9, 121, 2.2) + dot(x - 20, 130, 1.4);
          x = 126; s += base(x) + body(x, 132, 8) + B(x - 12, 125, 24, 8, 3) + C(x, 86, 5.5) + P(`M${x} 90C${x - 16} 100 ${x - 14} 122 ${x - 8} 126H${x + 8}C${x + 14} 122 ${x + 16} 100 ${x} 90Z`) + ln(`M${x + 2} 100l6 8`, 1.6);
          x = 172; s += base(x) + body(x, 124, 9) + B(x - 15, 116, 30, 8, 3) + P(`M${x - 3} 92V82H${x - 9}V76H${x - 3}V66H${x + 3}V76H${x + 9}V82H${x + 3}V92Z`) + P(`M${x - 12} 117L${x - 16} 92Q${x} 98 ${x + 16} 92L${x + 12} 117Z`);
          x = 218; s += base(x) + body(x, 126, 9) + B(x - 15, 118, 30, 8, 3) + C(x, 82, 5.5) + P(`M${x - 12} 119L${x - 17} 93L${x - 8} 103L${x} 88L${x + 8} 103L${x + 17} 93L${x + 12} 119Z`);
          x = 264; s += base(x) + body(x, 152, 7) + B(x - 11, 145, 22, 8, 3) + C(x, 132, 12);
          return s;
        })() },
    ];
  });

  const [a, b] = parts, list = a.slice(0, 3);
  for (let i = 3, j = 0; i < a.length || j < b.length; i++, j++) {
    if (j < b.length) list.push(b[j]);
    if (i < a.length) list.push(a[i]);
  }
  Colouring.addPack(10, list);
})();
