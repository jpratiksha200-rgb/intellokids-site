/* Colouring pictures for age 6: small scenes (a main subject plus its setting), 18–30 parts, 3.5 lines.
   Format: see Colouring.addPack in js/colouring.js. Regions = data-r fill="#fff"; decorations = INK or fill="none".
   The first 3 pictures are the ones open while IK_CONFIG.limits applies. Original art only.
   Regions never carry a transform themselves; scaled or mirrored parts sit inside a <g transform>. */
(function () {
  const INK = '#1F3A44', SW = 3.5;
  const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
  const R = `data-r fill="#fff" ${L}`;                 // a part to colour
  const D = `fill="none" ${L}`;                        // a decoration line
  const f = v => Math.round(v * 10) / 10;
  // at(): draw fn() inside a scaled (and optionally mirrored) group; rs/ds keep the line 3.5 wide on screen.
  let rs = R, ds = D, sc = 1;
  const at = (x, y, s, fn, flip, rot) => {
    const keep = [rs, ds, sc]; sc *= s;
    const l = `stroke="${INK}" stroke-width="${Math.round(SW / sc * 100) / 100}" stroke-linejoin="round" stroke-linecap="round"`;
    rs = `data-r fill="#fff" ${l}`; ds = `fill="none" ${l}`;
    const out = fn(); [rs, ds, sc] = keep;
    return `<g transform="translate(${f(x)} ${f(y)})${rot ? ` rotate(${rot})` : ''} scale(${flip ? -s : s} ${s})">${out}</g>`;
  };
  const mir = fn => fn() + at(0, 0, 1, fn, true);      // a part and its mirror image (about x = 0)
  const P = d => `<path ${rs} d="${d}"/>`;
  const C = (x, y, r) => `<circle ${rs} cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;
  const E = (x, y, rx, ry) => `<ellipse ${rs} cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"/>`;
  const B = (x, y, w, h, r) => `<rect ${rs} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${r ? ` rx="${r}"` : ''}/>`;
  const G = p => `<polygon ${rs} points="${typeof p === 'string' ? p : p.map(q => f(q[0]) + ',' + f(q[1])).join(' ')}"/>`;
  const Z = d => `<path ${ds} d="${d}"/>`;              // decoration line
  const dot = (x, y, r = 2.2) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${INK}"/>`;
  const eye = (x, y, r = 3) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${INK}"/><circle cx="${f(x + r * 0.35)}" cy="${f(y - r * 0.4)}" r="${f(r * 0.38)}" fill="#fff"/>`;
  const smile = (x, y, w) => Z(`M${f(x - w)} ${f(y)} q${f(w)} ${f(w * 0.9)} ${f(w * 2)} 0`);
  const shut = (x, y, w = 4) => Z(`M${f(x - w)} ${f(y)} q${f(w)} ${f(-w)} ${f(w * 2)} 0`);   // happy closed eye
  const face = (x, y, s = 1) => eye(x - 7 * s, y, 3 * s) + eye(x + 7 * s, y, 3 * s) + smile(x, y + 6 * s, 3.5 * s);
  const N = (en, fr, es, de, zh) => ({ en, fr, es, de, zh });

  // ---- shapes ----
  const pt = (x, y, a, r) => f(x + r * Math.cos(a * Math.PI / 180)) + ' ' + f(y + r * Math.sin(a * Math.PI / 180));
  const cap = (x1, y1, x2, y2, w) => {                 // a limb with round ends
    const l = Math.hypot(x2 - x1, y2 - y1) || 1, h = w / 2, nx = -(y2 - y1) / l * h, ny = (x2 - x1) / l * h, p = (x, y) => f(x) + ' ' + f(y);
    return P(`M${p(x1 + nx, y1 + ny)} L${p(x2 + nx, y2 + ny)} A${f(h)} ${f(h)} 0 0 0 ${p(x2 - nx, y2 - ny)} L${p(x1 - nx, y1 - ny)} A${f(h)} ${f(h)} 0 0 0 ${p(x1 + nx, y1 + ny)} Z`);
  };
  const blobD = (cx, cy, r, n = 8, k = 0.56, a0 = -90) => {   // bumpy round outline: tree tops, bushes, puffs
    const rb = f(2 * r * Math.sin(Math.PI / n) * k); let d = 'M' + pt(cx, cy, a0, r);
    for (let i = 1; i <= n; i++) d += ` A${rb} ${rb} 0 0 1 ${pt(cx, cy, a0 + i * 360 / n, r)}`;
    return d + ' Z';
  };
  const blob = (...a) => P(blobD(...a));
  const petalsD = (cx, cy, n, ri, ro, a0 = -90) => {   // one outline with n round petals
    const w = 180 / n; let d = '';
    for (let i = 0; i < n; i++) { const a = a0 + i * 2 * w; if (!i) d = 'M' + pt(cx, cy, a - w, ri); d += ` C${pt(cx, cy, a - w * 1.1, ro)} ${pt(cx, cy, a + w * 1.1, ro)} ${pt(cx, cy, a + w, ri)}`; }
    return d + ' Z';
  };
  const frondD = (cx, cy, angs, len, ri = 5, dl = 20) => {  // palm crown: pointed leaves at the given angles (ascending)
    const n = angs.length; let d = '';
    for (let i = 0; i < n; i++) {
      const a = angs[i], b = i < n - 1 ? angs[i + 1] : angs[0] + 360, pv = i ? (angs[i - 1] + a) / 2 : (angs[n - 1] - 360 + a) / 2;
      if (!i) d = 'M' + pt(cx, cy, pv, ri);
      d += ` Q${pt(cx, cy, a - dl, len * 0.72)} ${pt(cx, cy, a, len)} Q${pt(cx, cy, a + dl, len * 0.72)} ${pt(cx, cy, (a + b) / 2, ri)}`;
    }
    return d + ' Z';
  };
  const starPts = (x, y, r, k = 0.45, n = 5, a0 = -90) => { const a = []; for (let i = 0; i < n * 2; i++) { const t = (a0 + i * 180 / n) * Math.PI / 180, q = i % 2 ? r * k : r; a.push([x + q * Math.cos(t), y + q * Math.sin(t)]); } return a; };
  const star = (x, y, r, k, n) => G(starPts(x, y, r, k, n));
  const heart = (x, y, s = 1) => at(x, y, s, () => P('M0 9 C-5 5 -12 0 -12 -5 C-12 -11 -4 -12 0 -6 C4 -12 12 -11 12 -5 C12 0 5 5 0 9 Z'));
  const arch = (x, y, w, h) => P(`M${x} ${y + h} V${f(y + w / 2)} Q${x} ${y} ${f(x + w / 2)} ${y} Q${x + w} ${y} ${x + w} ${f(y + w / 2)} V${y + h} Z`); // round-topped door or window
  const crenel = (x0, x1, top, bot, n, h = 10) => {     // castle wall with battlements
    const w = (x1 - x0) / (2 * n - 1); let d = `M${x0} ${bot} V${top - h}`;
    for (let i = 0; i < n; i++) { d += ` H${f(x0 + (2 * i + 1) * w)}`; if (i < n - 1) d += ` V${top} H${f(x0 + (2 * i + 2) * w)} V${top - h}`; }
    return P(d + ` V${bot} Z`);
  };

  // ---- scenery ----
  const sky = () => B(0, 0, 300, 300);
  const ground = (y, b = 10) => P(`M0 ${y} Q150 ${y - 2 * b} 300 ${y} V300 H0 Z`);
  const waves = (y, a = 5, w = 30, bot = 300) => { let d = `M0 ${y}`; for (let x = 0; x < 300; x += w) d += ` q${w / 4} ${-a} ${w / 2} 0 q${w / 4} ${a} ${w / 2} 0`; return P(d + ` V${bot} H0 Z`); };
  const ripple = (x, y, w = 20) => Z(`M${x} ${y} q${w / 4} -4 ${w / 2} 0 q${w / 4} 4 ${w / 2} 0`);
  const cloud = (x, y, s = 1) => at(x, y, s, () => P('M-27 0 q-12 0 -10 -12 q2 -12 16 -10 q6 -14 22 -10 q14 -8 22 6 q14 0 12 14 q-2 12 -14 12 Z'));
  const sun = (x, y, r = 18, fc = 1) => {
    let d = ''; for (let i = 0; i < 8; i++) { const a = 22.5 + i * 45; d += `M${pt(x, y, a, r + 6)} L${pt(x, y, a, r + 13)}`; }
    return C(x, y, r) + Z(d) + (fc ? face(x, y - 1, r / 22) : '');
  };
  const tree = (x, y, s = 1) => at(x, y, s, () => P('M-8 0 L-6 -40 H6 L8 0 Z') + blob(0, -60, 26, 8));
  const pine = (x, y, s = 1) => at(x, y, s, () => B(-6, -18, 12, 18) + G('0,-92 20,-62 10,-62 28,-38 16,-38 34,-14 -34,-14 -16,-38 -28,-38 -10,-62 -20,-62'));
  const flower = (x, y, s = 1, n = 5, leaf = 1) => at(x, y, s, () => Z('M0 0 V-30') + (leaf ? P('M0 -10 Q6 -28 26 -22 Q20 -6 0 -10 Z') : '') + P(petalsD(0, -42, n, 7, 25)) + C(0, -42, 7));
  const tufts = (...p) => Z(p.map(([x, y]) => `M${x - 6} ${y} l-2 -7 M${x} ${y} v-9 M${x + 6} ${y} l2 -7`).join(' '));
  const twinkle = (x, y, r = 5) => Z(`M${x} ${y - r} V${y + r} M${x - r} ${y} H${x + r}`);
  const flag = (x, y, left) => Z(`M${x} ${y} V${y - 28}`) + G(`${x},${y - 28} ${left ? x - 22 : x + 22},${y - 22} ${x},${y - 15}`);
  const rainbow = (cx, cy, r, w, n) => { let o = ''; for (let i = 0; i < n; i++) { const a = r - i * w, b = a - w; o += P(`M${cx - a} ${cy} A${a} ${a} 0 0 1 ${cx + a} ${cy} L${cx + b} ${cy} A${b} ${b} 0 0 0 ${cx - b} ${cy} Z`); } return o; };
  const palm = (x, y, s = 1, flip, nuts = 1) => at(x, y, s, () => P('M-7 0 C-4 -30 2 -60 9 -84 L19 -82 C12 -58 8 -30 8 0 Z') + (nuts ? C(8, -78, 6) + C(20, -77, 6) : '') + P(frondD(14, -86, [160, 205, 250, 295, 340, 380], 40)), flip);
  const fern = (x, y, s = 1) => at(x, y, s, () => P(frondD(0, 0, [195, 232, 270, 308, 345], 30, 4, 16)));
  const ring = (x, y, r) => `M${f(x - r)} ${f(y)} a${r} ${r} 0 1 0 ${f(2 * r)} 0 a${r} ${r} 0 1 0 ${f(-2 * r)} 0`;   // small circle for decorations

  const shroom = (x, y, s = 1) => at(x, y, s, () => P('M-7 0 C-8 -6 -7 -12 -6 -16 H6 C7 -12 8 -6 7 0 Z') + P('M-20 -12 C-20 -30 -10 -36 0 -36 C10 -36 20 -30 20 -12 Q0 -6 -20 -12 Z') + Z('M-10 -24 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M6 -28 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0'));
  const leaf = (x, y, s = 1, rot = 0) => at(x, y, s, () => P('M0 -12 C9 -6 9 6 0 13 C-9 6 -9 -6 0 -12 Z') + Z('M0 -7 V9'), 0, rot);
  const carrot = (x, y, s = 1, rot = 0) => at(x, y, s, () => P('M-2 0 C-10 -8 -14 -20 -8 -24 C-4 -18 -2 -12 0 -8 C0 -14 2 -24 8 -26 C12 -20 8 -8 2 0 Z') + P('M-9 -2 C-7 14 -2 26 0 32 C2 26 7 14 9 -2 Z') + Z('M-6 8 h5 M1 16 h5 M-3 23 h4'), 0, rot);
  const cactus = (x, y, s = 1) => at(x, y, s, () => P('M-9 0 V-30 H-18 Q-26 -30 -26 -38 V-48 Q-26 -54 -20 -54 Q-14 -54 -14 -48 V-40 H-9 V-58 Q-9 -66 0 -66 Q9 -66 9 -58 V-34 H14 V-44 Q14 -50 20 -50 Q26 -50 26 -44 V-30 Q26 -24 18 -24 H9 V0 Z') + Z('M-3 -54 v6 M3 -40 v6 M-3 -24 v6 M3 -12 v6'));
  const butterfly = (x, y, s = 1, rot = 0) => at(x, y, s, () => mir(() => P('M-2 -2 C-10 -22 -32 -26 -32 -10 C-32 0 -20 2 -6 1 C-20 6 -24 18 -16 22 C-8 25 -3 12 -2 4 Z') + Z('M-18 -11 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0')) +
    `<ellipse cx="0" cy="0" rx="3.5" ry="14" fill="${INK}"/>` + Z('M-1 -12 Q-4 -22 -10 -26 M1 -12 Q4 -22 10 -26'), 0, rot);
  // Chubby bird facing right, feet at y = 0 (fly: wing up, no legs).
  const bird = (x, y, s = 1, flip, fly) => at(x, y, s, () => G('-14,-12 -32,-6 -30,-20') + P('M-18 -12 C-20 -30 -4 -40 10 -36 C22 -32 24 -18 16 -8 C10 -2 -10 -2 -18 -12 Z') +
    (fly ? P('M-8 -24 C-16 -42 -4 -54 8 -48 C4 -40 2 -32 2 -24 Z') : P('M-12 -20 C-4 -27 8 -23 8 -14 C0 -8 -10 -10 -12 -20 Z')) +
    G('19,-31 33,-26 19,-20') + eye(10, -27, 2.6) + (fly ? '' : Z('M-4 -4 v6 M4 -4 v6')), flip);
  // Bunny sitting, front view, base at y = 0. o.peek: ears and head only; o.feet: 0 to leave the feet out.
  const bunny = (x, y, s = 1, o = {}) => at(x, y, s, () =>
    mir(() => P('M-6 -80 C-18 -100 -20 -124 -10 -128 C0 -128 2 -104 2 -84 Z') + Z('M-8 -90 C-13 -102 -14 -114 -10 -119')) +
    (o.peek ? '' : P('M-26 0 C-32 -24 -20 -44 0 -46 C20 -44 32 -24 26 0 Z') + (o.feet === 0 ? '' : E(-14, -2, 11, 6) + E(14, -2, 11, 6))) +
    C(0, -64, 22) + eye(-8, -66, 3.2) + eye(8, -66, 3.2) + `<path d="M-3 -58 h6 l-3 3 z" fill="${INK}"/>` + Z('M0 -55 v2 M-4 -51 q4 3 4 -2 q0 5 4 2 M-12 -57 h-9 M-12 -53 l-8 3 M12 -57 h9 M12 -53 l8 3'));

  const rock = (x, y, s = 1) => at(x, y, s, () => P('M-22 0 C-24 -12 -12 -20 0 -20 C10 -20 22 -14 22 0 Z'));
  const reed = (x, y, s = 1) => at(x, y, s, () => P('M-6 0 L-14 -24 L-4 -12 L-2 -34 L4 -14 L12 -28 L8 0 Z'));
  const nose = (x, y, rx = 4, ry = 3) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${INK}"/>`;

  // ---- animals (local units, standing on y = 0) ----
  const pig = (x, y, s = 1, flip) => at(x, y, s, () =>
    [-26, -10, 8, 24].map(v => cap(v, -16, v, 0, 11)).join('') + Z('M-35 -34 q-9 -2 -9 -9 q1 -6 6 -3 q3 4 -4 7') +
    E(0, -28, 36, 22) + G('20,-46 22,-64 34,-52') + G('38,-52 50,-62 47,-46') + C(34, -36, 17) + E(49, -32, 9, 7) +
    dot(46, -32, 1.6) + dot(52, -32, 1.6) + eye(28, -41, 2.8) + eye(39, -42, 2.8) + Z('M38 -22 q4 3 8 0'), flip);
  const hen = (x, y, s = 1, flip) => at(x, y, s, () =>
    Z('M-4 -10 V0 M4 -10 V0 M-4 0 h-5 M4 0 h5') +
    P('M-6 -10 C-20 -10 -30 -20 -30 -34 C-30 -44 -26 -52 -20 -56 C-18 -48 -14 -42 -8 -40 C-4 -50 4 -60 14 -60 C24 -60 30 -52 28 -42 C34 -32 28 -12 -6 -10 Z') +
    P('M9 -59 C6 -68 13 -71 16 -65 C18 -72 26 -71 24 -63 C29 -65 32 -58 25 -55 Z') + G('26,-52 40,-47 26,-41') +
    P('M-14 -32 C-6 -40 10 -36 10 -26 C2 -18 -10 -20 -14 -32 Z') + eye(17, -50, 2.6), flip);
  const fox = (x, y, s = 1) => at(x, y, s, () =>
    P('M14 -10 C44 -4 64 -24 60 -52 C58 -66 50 -74 42 -70 C48 -54 44 -34 26 -28 Z') +
    P('M60 -52 C58 -66 50 -74 42 -70 C45 -64 46 -58 46 -52 Q53 -49 60 -52 Z') +
    P('M-24 -2 C-30 -22 -24 -48 0 -52 C24 -48 30 -22 24 -2 Z') +
    P('M-12 -46 C-6 -38 6 -38 12 -46 C14 -30 10 -14 0 -8 C-10 -14 -14 -30 -12 -46 Z') + E(-11, -3, 9, 6) + E(11, -3, 9, 6) +
    mir(() => G('-27,-86 -25,-118 -6,-99') + Z('M-22 -91 L-21 -108 L-12 -98')) +
    P('M-32 -80 C-32 -98 -16 -106 0 -106 C16 -106 32 -98 32 -80 C32 -68 14 -56 0 -54 C-14 -56 -32 -68 -32 -80 Z') +
    P('M-30 -74 C-20 -70 -8 -74 0 -66 C8 -74 20 -70 30 -74 C26 -62 12 -55 0 -54 C-12 -55 -26 -62 -30 -74 Z') +
    eye(-11, -83, 3.4) + eye(11, -83, 3.4) + nose(0, -66, 4.5, 3.2) + Z('M-5 -60 q5 4 10 0'));
  const polar = (x, y, s = 1, flip) => at(x, y, s, () =>
    [-32, -14, 14, 32].map(v => cap(v, -26, v, -6, 13)).join('') + C(-44, -44, 6) + E(0, -38, 44, 26) +
    C(26, -72, 7) + C(52, -74, 7) + C(40, -54, 20) + E(56, -48, 12, 9) +
    nose(66, -51) + eye(35, -58, 3) + eye(48, -60, 3) + Z('M54 -42 q4 3 8 0'), flip);
  const cub = (x, y, s = 1) => at(x, y, s, () => E(0, -22, 24, 22) + Z('M-14 -2 v-6 M14 -2 v-6') + C(-16, -72, 8) + C(16, -72, 8) + C(0, -56, 20) + E(0, -48, 10, 7) +
    nose(0, -52, 3.5, 2.6) + eye(-8, -60, 2.8) + eye(8, -60, 2.8) + Z('M-4 -46 q4 3 8 0'));
  const beaver = (x, y, s = 1) => at(x, y, s, () =>
    P('M12 -8 C26 -2 44 0 56 -6 C68 -12 70 -32 60 -38 C48 -44 30 -30 14 -20 Z') + Z('M26 -14 L52 -32 M36 -8 L60 -25 M33 -23 L48 -7 M45 -31 L60 -15') +
    P('M-22 0 C-28 -20 -24 -46 0 -48 C24 -46 28 -20 22 0 Z') + E(0, -20, 13, 16) + E(-10, -2, 9, 6) + E(10, -2, 9, 6) +
    C(-15, -77, 5.5) + C(15, -77, 5.5) + P('M-20 -62 C-20 -76 -10 -82 0 -82 C10 -82 20 -76 20 -62 C20 -50 12 -44 0 -44 C-12 -44 -20 -50 -20 -62 Z') + P('M-15 -54 C-15 -62 15 -62 15 -54 C15 -48 8 -46 0 -46 C-8 -46 -15 -48 -15 -54 Z') +
    nose(0, -58) + P('M-6 -51 H6 V-41 Q0 -39 -6 -41 Z') + Z('M0 -51 V-40') + eye(-8, -68, 3) + eye(8, -68, 3) +
    cap(-30, -18, 30, -44, 9) + C(-16, -24, 6) + C(14, -37, 6));
  const camel = (x, y, s = 1, flip) => at(x, y, s, () =>
    [[-34, -36], [-14, -15], [16, 17], [34, 36]].map(([a, b]) => cap(a, -46, b, -5, 12)).join('') + Z('M-41 -24 h12 M-21 -24 h12 M10 -24 h12 M29 -24 h12 M-44 -62 q-7 8 -5 20') +
    P('M-44 -60 C-46 -80 -36 -98 -22 -98 C-12 -98 -8 -86 0 -86 C8 -86 12 -100 24 -100 C38 -100 46 -84 44 -64 C42 -50 30 -44 0 -44 C-30 -44 -42 -48 -44 -60 Z') +
    P('M-12 -93 Q0 -89 12 -95 L13 -60 H-13 Z') + Z('M-8 -60 v6 M0 -60 v6 M8 -60 v6') +
    P('M34 -72 C48 -76 58 -92 60 -110 L76 -108 C76 -86 64 -62 42 -52 Z') + E(63, -123, 5, 7) +
    P('M56 -112 C58 -126 76 -130 88 -122 C96 -116 98 -106 92 -102 C84 -98 70 -100 60 -102 Z') +
    eye(72, -116, 3) + dot(92, -111, 1.6) + Z('M82 -104 q4 3 8 0'), flip);
  const cat = (x, y, s = 1, flip) => at(x, y, s, () =>
    P('M-20 -6 C-46 -4 -52 -28 -42 -44 C-38 -32 -32 -22 -18 -20 Z') +
    P('M-26 0 C-32 -30 -20 -58 4 -60 C24 -58 30 -30 24 0 Z') + Z('M-14 -40 q6 2 8 -4 M-18 -26 q6 2 8 -4') + E(2, -3, 9, 6) + E(18, -3, 9, 6) +
    G('-6,-84 -6,-110 10,-96') + G('18,-96 34,-108 31,-85') + C(12, -76, 22) +
    eye(4, -80, 3.2) + eye(20, -81, 3.2) + `<path d="M10 -72 h5 l-2.5 3 z" fill="${INK}"/>` + Z('M12.5 -69 v2 M8 -65 q4 3 4.5 -2 q.5 5 4.5 2 M-2 -72 h-9 M-2 -68 l-8 3 M26 -72 h9 M26 -68 l8 3'), flip);

  const deer = (x, y, s = 1, flip) => at(x, y, s, () =>
    P('M-32 -60 C-40 -72 -48 -66 -43 -55 C-40 -51 -35 -53 -32 -56 Z') +
    [[-26, -27], [-10, -10], [12, 13], [28, 30]].map(([a, b]) => cap(a, -40, b, -5, 12)).join('') + Z('M-33 -12 h12 M-16 -12 h12 M7 -12 h12 M23 -12 h12') +
    E(0, -50, 36, 20) + Z(ring(-18, -58, 3) + ring(-4, -63, 3) + ring(10, -57, 3) + ring(-10, -46, 2.5) + ring(4, -47, 2.5)) +
    P('M18 -60 C22 -76 26 -88 30 -96 L46 -88 C40 -78 36 -64 34 -52 Z') +
    P('M28 -102 C16 -108 10 -118 14 -122 C22 -122 30 -114 34 -106 Z') + E(38, -96, 15, 13) + E(50, -90, 10, 8) +
    P('M44 -104 C52 -114 60 -118 62 -114 C62 -106 54 -100 46 -98 Z') +
    eye(39, -99, 3.4) + nose(58, -92, 3, 2.4) + Z('M51 -84 q4 3 8 0'), flip);
  const owl = (x, y, s = 1, baby) => at(x, y, s, () =>
    P('M-26 -2 C-34 -30 -30 -56 -22 -66 L-24 -82 L-10 -71 C-4 -73 4 -73 10 -71 L24 -82 L22 -66 C30 -56 34 -30 26 -2 Q0 4 -26 -2 Z') +
    E(0, -22, 16, 18) + Z('M-7 -26 l3.5 3 l3.5 -3 l3.5 3 l3.5 -3 M-7 -16 l3.5 3 l3.5 -3 l3.5 3 l3.5 -3') +
    C(-11, -50, 11) + C(11, -50, 11) + eye(-11, -50, 5) + eye(11, -50, 5) +
    (baby ? `<path d="M-5 -40 h10 l-5 8 z" fill="${INK}"/>` : G('-6,-41 6,-41 0,-29') + mir(() => P('M-26 -46 C-38 -38 -38 -16 -28 -6 C-24 -16 -22 -26 -22 -36 Z'))) +
    Z('M-8 0 v4 M-3 0 v4 M3 0 v4 M8 0 v4'));
  // Friendly dinosaurs, all facing right and standing on y = 0.
  const longneck = (x, y, s = 1, flip) => at(x, y, s, () =>
    P('M-44 -54 C-70 -50 -90 -36 -106 -16 C-90 -24 -70 -32 -42 -36 Z') +
    [[-34, -35], [-12, -12], [14, 14], [36, 37]].map(([a, b]) => cap(a, -40, b, -6, 15)).join('') +
    E(0, -54, 48, 30) + Z(ring(-20, -62, 5) + ring(-2, -70, 4) + ring(14, -58, 5) + ring(-28, -46, 3.5)) +
    P('M26 -74 C38 -100 48 -134 54 -160 L72 -156 C68 -128 58 -90 44 -56 Z') +
    P('M50 -162 C52 -176 74 -180 84 -170 C92 -164 92 -154 84 -151 L60 -149 C52 -151 50 -156 50 -162 Z') +
    eye(68, -166, 3.2) + dot(86, -162, 1.6) + Z('M74 -156 q5 3 10 0'), flip);
  const trike = (x, y, s = 1, flip) => at(x, y, s, () =>
    P('M-36 -30 C-52 -28 -62 -20 -68 -8 C-56 -12 -46 -16 -34 -18 Z') +
    [-26, -6, 12, 30].map(v => cap(v, -24, v, -4, 14)).join('') + E(0, -34, 40, 22) +
    blob(48, -58, 20, 7) + P('M40 -50 C46 -60 62 -60 70 -52 C78 -44 82 -36 74 -32 C64 -28 48 -30 40 -38 Z') +
    G('50,-57 53,-77 61,-58') + G('71,-48 84,-58 79,-40') + eye(58, -48, 3) + Z('M64 -36 q4 3 8 0'), flip);
  const stego = (x, y, s = 1, flip) => at(x, y, s, () =>
    P('M-36 -50 Q-42 -70 -32 -74 Q-26 -66 -24 -62 Q-20 -84 -12 -86 Q-4 -76 -2 -68 Q2 -90 10 -90 Q18 -80 16 -66 Q24 -80 30 -78 Q34 -68 28 -56 Z') +
    P('M-38 -40 C-60 -40 -76 -30 -90 -12 C-74 -18 -60 -24 -40 -24 Z') +
    [-30, -12, 10, 28].map(v => cap(v, -26, v, -5, 15)).join('') +
    P('M-44 -30 C-46 -54 -24 -66 0 -66 C24 -66 40 -54 42 -36 C44 -24 30 -18 0 -18 C-30 -18 -42 -22 -44 -30 Z') + Z(ring(-16, -46, 4) + ring(4, -50, 5) + ring(20, -40, 4)) +
    P('M34 -44 C40 -54 58 -56 66 -48 C72 -42 70 -32 62 -30 C52 -28 40 -32 34 -38 Z') + eye(52, -46, 3.2) + Z('M58 -36 q4 3 8 0'), flip);
  // Flying dragon, body centred on 0,0, facing right.
  const batWing = () => P('M4 -16 C0 -50 -10 -74 -30 -88 Q-30 -66 -46 -58 Q-30 -46 -42 -30 Q-24 -28 -14 -14 Z') + Z('M2 -18 L-44 -58 M0 -16 L-40 -31');
  const flyDragon = (x, y, s = 1, flip) => at(x, y, s, () =>
    at(18, -4, 0.8, batWing) +
    P('M-30 4 C-56 10 -74 4 -88 -10 C-80 -6 -70 -6 -60 -8 C-50 -10 -42 -10 -34 -12 Z') + G('-86,-8 -104,-18 -100,2') +
    E(-14, 18, 8, 7) + E(16, 18, 8, 7) + P('M12 -14 L30 -32 L52 -24 L34 -2 Z') +
    E(0, 0, 36, 22) + P('M-16 14 C-4 26 22 24 34 8 C34 2 32 -2 28 -4 C22 8 4 14 -16 14 Z') + Z('M2 15 l3 6 M14 12 l4 6 M24 6 l5 5') +
    batWing() + at(25, 55, 0.85, dHead), flip);
  const turtle = (x, y, s = 1, flip) => at(x, y, s, () =>
    C(46, -6, 10) + P('M-24 6 C-30 16 -40 20 -44 16 C-40 8 -32 4 -26 2 Z') + P('M18 6 C26 18 40 24 46 20 C44 12 34 6 24 2 Z') +
    P('M-36 4 C-34 -20 -16 -30 4 -30 C22 -30 36 -18 36 4 Z') + G('-10,-18 6,-18 14,-8 6,4 -10,4 -18,-8') + Z('M-10 -18 L-16 -26 M6 -18 L12 -26 M14 -8 H30 M-18 -8 H-31') +
    P('M-40 4 H40 Q36 12 0 12 Q-36 12 -40 4 Z') + eye(48, -9, 2.8) + Z('M48 -1 q3 2 6 0'), flip);
  const dolphin = (x, y, s = 1, flip, rot = 0) => at(x, y, s, () => G('-30,10 -48,0 -44,20') + G('-2,-13 -8,-28 10,-15') +
    P('M-34 8 C-24 -14 12 -22 32 -8 C38 -6 44 -2 42 2 C36 4 30 2 26 2 C10 -2 -12 6 -26 16 Z') + eye(22, -6, 2.6) + Z('M30 0 q4 2 8 0'), flip, rot);
  const shell = (x, y, s = 1, rot = 0) => at(x, y, s, () => P('M0 2 L-16 -8 C-18 -20 -8 -28 0 -28 C8 -28 18 -20 16 -8 Z') + Z('M0 2 L-8 -24 M0 2 L0 -27 M0 2 L8 -24'), 0, rot);
  const crab = (x, y, s = 1) => at(x, y, s, () => Z('M-16 -6 l-10 8 M-14 -2 l-10 10 M16 -6 l10 8 M14 -2 l10 10 M-10 -16 l-10 -10 M10 -16 l10 -10') +
    C(-24, -30, 8) + C(24, -30, 8) + Z('M-24 -38 v7 M24 -38 v7') + E(0, -10, 20, 13) + eye(-6, -14, 2.8) + eye(6, -14, 2.8) + smile(0, -7, 3));
  const loco = (x, y, s = 1) => at(x, y, s, () =>
    B(-46, -64, 38, 54, 4) + B(-38, -56, 22, 18, 3) + P('M-52 -62 Q-27 -78 -2 -62 Z') +
    B(-10, -46, 52, 34, 8) + P('M14 -44 V-56 L8 -64 H32 L26 -56 V-44 Z') + G('42,-20 56,-4 42,-4') +
    C(-30, -9, 11) + C(0, -9, 11) + C(26, -9, 11) + dot(-30, -9, 3) + dot(0, -9, 3) + dot(26, -9, 3) + Z('M-30 -9 H26'));
  const wagon = (x, y, s = 1) => at(x, y, s, () => B(-30, -50, 60, 40, 4) + B(-18, -44, 36, 20, 3) + face(0, -36, 0.8) + C(-16, -9, 9) + C(16, -9, 9) + dot(-16, -9, 2.5) + dot(16, -9, 2.5) + Z('M30 -20 H40'));

  // ---- vehicles and things ----
  const racecar = (x, y, s = 1) => at(x, y, s, () =>
    P('M-56 -26 V-42 H-38 V-36 H-46 V-26 Z') + C(-2, -38, 10) + Z('M-10 -40 H6') +
    P('M-50 -10 V-24 Q-50 -28 -44 -28 H-22 L-14 -34 H10 L18 -28 H40 Q54 -26 58 -14 V-10 Z') +
    C(20, -19, 7) + Z('M20 -23 v8') + C(-32, -9, 12) + C(36, -9, 12) + dot(-32, -9, 3.5) + dot(36, -9, 3.5));
  const cone = (x, y, s = 1) => at(x, y, s, () => G('-12,0 12,0 3,-26 -3,-26') + Z('M-8 -10 H8 M-5 -18 H5'));
  const plane = (x, y, s = 1) => at(x, y, s, () =>
    P('M-80 -46 L-90 -78 H-74 L-54 -46 Z') +
    P('M-84 -34 C-88 -46 -78 -48 -66 -48 H40 C62 -48 76 -40 80 -32 C74 -22 60 -18 40 -18 H-70 C-80 -18 -84 -24 -84 -34 Z') +
    P('M-88 -32 H-60 L-66 -24 H-92 Z') + P('M52 -42 H64 Q72 -40 76 -34 H52 Z') +
    Z([-40, -26, -12, 2, 16, 30].map(v => ring(v, -36, 3.5)).join(' ')) +
    P('M-20 -24 L-44 -8 H-28 L20 -24 Z') + E(-6, -12, 14, 7) +
    Z('M-30 -18 V-12 M46 -18 V-12') + C(-30, -6, 6) + C(46, -6, 6));
  const gear = (x, y, r, n = 8) => { const p = []; for (let i = 0; i < n; i++) { const a = i * 360 / n, w = 90 / n; [[a - 2 * w, r - 5], [a - w, r + 3], [a + w, r + 3], [a + 2 * w, r - 5]].forEach(([b, q]) => p.push([x + q * Math.cos(b * Math.PI / 180), y + q * Math.sin(b * Math.PI / 180)])); } return G(p) + Z(ring(x, y, f(r * 0.35))); };
  const parrot = (x, y, s = 1, flip) => at(x, y, s, () =>
    P('M-6 -14 L-14 22 L-2 22 L4 -10 Z') + P('M-14 -6 C-18 -30 -8 -50 6 -52 C20 -52 24 -40 20 -30 C18 -16 10 -2 -14 -6 Z') +
    P('M-12 -28 C-4 -36 8 -32 8 -20 C2 -12 -8 -14 -12 -28 Z') + P('M17 -46 C28 -48 32 -37 24 -30 C24 -34 21 -36 16 -37 Z') +
    eye(10, -42, 2.8) + Z('M-4 -4 v6 M4 -4 v6'), flip);

  const pumpkin = (x, y, s = 1) => at(x, y, s, () =>
    P('M-5 -35 C-6 -44 -2 -50 6 -50 L7 -45 C4 -45 4 -41 5 -35 Z') +
    P('M0 -36 C-12 -40 -30 -36 -32 -20 C-34 -6 -22 2 -12 0 C-6 2 6 2 12 0 C22 2 34 -6 32 -20 C30 -36 12 -40 0 -36 Z') +
    Z('M-13 -36 C-19 -24 -19 -10 -13 0 M13 -36 C19 -24 19 -10 13 0') + eye(-8, -20, 3) + eye(8, -20, 3) + smile(0, -12, 4.5));
  const duck = (x, y, s = 1, flip) => at(x, y, s, () =>
    P('M-22 -2 C-26 -14 -20 -22 -14 -18 C-6 -22 6 -20 14 -12 C20 -6 18 0 12 0 H-16 Z') + C(12, -26, 9) + G('20,-29 32,-25 20,-21') +
    Z('M-10 -12 q8 6 16 0') + eye(14, -28, 2.4), flip);
  const petal = (cx, cy, a, r0, r1, w) => {             // rounded petal pointing outward at angle a
    const u = [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)], q = (r, k) => f(cx + u[0] * r - u[1] * k) + ' ' + f(cy + u[1] * r + u[0] * k), m = r0 + (r1 - r0) * 0.3;
    return P(`M${q(r0, 0)} C${q(m, w)} ${q(r1, w * 0.8)} ${q(r1, 0)} C${q(r1, -w * 0.8)} ${q(m, -w)} ${q(r0, 0)} Z`);
  };

  // ---- characters ----
  // A simple child, feet at y = 0 and about 100 tall. o.hair: long|short|bun|pony|bob|none; o.dress; o.crown;
  // o.bust: shoulders only (for windows and tables); o.armL/o.armR: hand position, or 0 for no arm;
  // o.body: own body outline; o.legs: false to leave them out; o.back/o.add: extra parts drawn first/last.
  const kid = (x, y, s, o = {}, flip) => at(x, y, s, () => {
    const hl = o.armL === undefined ? [-20, -30] : o.armL, hr = o.armR === undefined ? [20, -30] : o.armR, hair = o.hair || 'short';
    let a = o.back ? o.back() : '';
    if (hair === 'long') a += P('M-18 -72 C-23 -97 23 -97 18 -72 C21 -60 24 -48 22 -40 C14 -37 10 -41 8 -47 H-8 C-10 -41 -14 -37 -22 -40 C-24 -48 -21 -60 -18 -72 Z');
    if (hair === 'pony') a += P('M12 -84 C32 -92 38 -68 30 -50 C26 -60 22 -68 14 -70 Z');
    if (hair === 'bun') a += C(0, -92, 9);
    if (hair === 'bob') a += P('M-19 -72 C-24 -98 24 -98 19 -72 C21 -62 22 -56 20 -52 H-20 C-22 -56 -21 -62 -19 -72 Z');
    if (hl) a += cap(-8, -50, hl[0], hl[1], 9);
    if (hr) a += cap(8, -50, hr[0], hr[1], 9);
    const legs = !o.bust && o.legs !== false;
    if (legs) a += (o.dress ? Z('M-7 -16 V-7 M7 -16 V-7') : P('M-13 -32 H13 L14 -8 H3 L0 -20 L-3 -8 H-14 Z')) + E(-8, -5, 8, 6) + E(8, -5, 8, 6);
    a += P(o.body || (o.bust ? 'M-12 -54 H12 Q21 -50 23 -36 H-23 Q-21 -50 -12 -54 Z' : o.dress ? 'M-9 -54 C-12 -40 -20 -28 -25 -15 Q0 -9 25 -15 C20 -28 12 -40 9 -54 Z' : 'M-11 -55 H11 L14 -29 H-14 Z'));
    if (hl) a += C(hl[0], hl[1], 6);
    if (hr) a += C(hr[0], hr[1], 6);
    a += C(0, -70, 17) + eye(-6.5, -69, 2.8) + eye(6.5, -69, 2.8) + smile(0, -63, 3.5);
    if (hair !== 'none') a += P('M-18 -70 C-20 -88 -6 -93 2 -92 C14 -91 20 -83 18 -70 C14 -77 8 -80 0 -79 C-7 -79 -13 -76 -18 -70 Z');
    if (o.crown) a += G('-10,-86 -12,-100 -5,-93 0,-103 5,-93 12,-100 10,-86');
    return a + (o.add ? o.add() : '');
  }, flip);

  const penguin = (x, y, s, o = {}, flip) => at(x, y, s, () =>
    P('M0 -112 C28 -112 40 -80 40 -50 C40 -18 26 0 0 0 C-26 0 -40 -18 -40 -50 C-40 -80 -28 -112 0 -112 Z') +
    P('M0 -90 C6 -100 24 -98 25 -82 C31 -64 31 -40 27 -24 C23 -10 14 -6 0 -6 C-14 -6 -23 -10 -27 -24 C-31 -40 -31 -64 -25 -82 C-24 -98 -6 -100 0 -90 Z') +
    mir(() => P('M-33 -70 C-48 -62 -56 -42 -53 -26 C-45 -32 -39 -40 -33 -46 Z')) +
    (o.feet === 0 ? '' : E(-14, -1, 11, 6) + E(14, -1, 11, 6)) +
    eye(-10, -76, 4) + eye(10, -76, 4) +
    (o.beak === 0 ? Z('M-5 -68 L0 -62 L5 -68') : P('M-8 -68 Q0 -72 8 -68 L0 -58 Z')) +
    (o.bow ? P('M12 -103 L0 -113 L0 -93 Z M12 -103 L24 -113 L24 -93 Z') + dot(12, -103, 3) : ''), flip);

  const fish = (x, y, s = 1, flip) => at(x, y, s, () => G('-18,0 -32,-12 -32,12') + P('M-22 0 C-12 -16 14 -16 22 0 C14 16 -12 16 -22 0 Z') + eye(9, -3, 2.6) + Z('M12 4 q3 2 6 0'), flip);

  const ink = d => `<path d="${d}" fill="${INK}"/>`;   // solid dark detail (stripes, noses)
  // Horse facing right, hooves at y = 0. o.horn (unicorn), o.plume, o.blanket, o.zebra (stripes, short mane).
  const horse = (x, y, s, o = {}, flip) => at(x, y, s, () =>
    (o.zebra ? Z('M-44 -64 Q-54 -54 -52 -40') + P('M-52 -42 C-61 -36 -61 -22 -54 -18 C-49 -25 -46 -34 -50 -42 Z')
      : P('M-40 -72 C-60 -86 -82 -72 -78 -48 C-76 -36 -68 -26 -58 -22 C-63 -32 -63 -42 -57 -48 C-59 -38 -55 -30 -48 -27 C-51 -40 -47 -52 -40 -56 Z')) +
    cap(-34, -50, -36, -6, 14) + cap(-17, -50, -18, -6, 14) + cap(16, -50, 17, -6, 14) + cap(33, -50, 35, -6, 14) +
    Z('M-42.5 -12 h13 M-24.5 -12 h13 M10 -12 h13 M28 -12 h13' + (o.zebra ? ' M-42 -34 h12 M-42 -24 h12 M-24 -34 h12 M-24 -24 h12 M10 -34 h12 M10 -24 h12 M28 -34 h12 M28 -24 h12' : '')) +
    E(0, -58, 46, 24) +
    (o.zebra ? ink('M-40 -70 L-35 -73 L-36 -54 Z M-29 -77 L-23 -78 L-26 -54 Z M-15 -80 L-9 -81 L-12 -54 Z M-1 -81 L5 -81 L2 -55 Z M-23 -37 L-17 -36 L-20 -50 Z M-9 -35 L-3 -35 L-6 -49 Z M7 -35 L13 -36 L10 -49 Z') : '') +
    (o.blanket ? P('M-22 -80 C-8 -84 8 -84 18 -80 L16 -48 C4 -44 -10 -44 -22 -48 Z') : '') +
    P('M16 -72 C22 -92 28 -106 36 -116 L60 -102 C52 -90 46 -76 42 -60 Z') +
    (o.zebra ? ink('M21 -83 L23 -88 L39 -76 Z M26 -94 L28 -99 L44 -87 Z M31 -105 L33 -110 L48 -98 Z') : '') +
    G('40,-124 43,-144 52,-128') +
    E(52, -112, 20, 18) + E(66, -100, 15, 12) +
    (o.zebra ? ink('M44 -126 L48 -125 L46 -116 Z M52 -129 L56 -128 L53 -119 Z') +
        P('M28 -128 C16 -116 11 -100 10 -82 L21 -78 C24 -96 30 -110 41 -122 Z') + Z('M16 -110 l7 3 M13 -98 l7 3')
      : P('M32 -128 C18 -124 13 -108 15 -94 C13 -84 7 -78 0 -75 C13 -72 23 -80 27 -92 C29 -104 33 -116 42 -126 C38 -130 35 -130 32 -128 Z')) +
    (o.horn ? G('52,-127 66,-158 62,-125') + Z('M55 -136 l8 -2 M58 -145 l6 -2') : '') +
    (o.plume ? P('M44 -128 C38 -150 52 -162 60 -152 C57 -142 52 -134 50 -128 Z') : '') +
    eye(56, -114, 3.6) + dot(72, -103, 1.8) + Z('M62 -94 q5 4 10 0'), flip);

  // Dragon head with two horns, facing right (centred near 30,-112).
  const dHead = () => P('M-4 -120 Q-14 -136 -20 -150 Q-4 -146 8 -130 Z') + P('M12 -130 Q8 -148 8 -160 Q20 -150 24 -134 Z') +
    P('M-8 -110 C-10 -128 8 -138 24 -134 C36 -132 44 -124 56 -118 C68 -112 70 -98 58 -93 C46 -89 30 -88 16 -88 C2 -88 -8 -96 -8 -110 Z') +
    eye(10, -114, 4.2) + eye(27, -116, 4.2) + dot(62, -108, 1.8) + dot(55, -111, 1.8) + Z('M36 -98 q10 6 20 0');
  // Friendly seated dragon facing right, sitting on y = 0.
  const dragon = (x, y, s, flip) => at(x, y, s, () =>
    P('M-20 -74 C-44 -116 -84 -122 -98 -102 C-86 -98 -84 -88 -88 -80 C-74 -82 -68 -72 -70 -64 C-56 -68 -44 -62 -36 -54 Z') +
    G('-4,-80 -26,-98 -16,-74 -46,-82 -30,-60 -56,-56 -36,-44 -52,-28 -30,-24') +
    P('M-24 -12 C-50 -6 -70 -14 -78 -32 C-70 -30 -62 -28 -54 -30 C-44 -32 -36 -34 -28 -36 Z') + G('-76,-30 -94,-44 -90,-22') +
    P('M-30 -2 C-46 -24 -42 -64 -18 -78 C-2 -86 16 -82 26 -70 C42 -52 42 -22 30 -2 Z') +
    P('M2 -6 C-8 -22 -6 -52 8 -62 C18 -66 28 -58 32 -44 C36 -26 30 -12 22 -6 Z') + Z('M0 -20 H28 M-2 -34 H30 M2 -48 H28') +
    E(-16, -4, 15, 8) + E(24, -4, 15, 8) + cap(22, -58, 40, -44, 12) + dHead(), flip);

  Colouring.addPack(6, [
    // 1 — castle with a princess waving from the window
    { id: 'a6-castle-princess', cat: 'princess', name: N('Princess castle', 'Château de princesse', 'Castillo de princesa', 'Prinzessinnenschloss', '公主城堡'), svg:
      sky() + sun(272, 28, 12) + cloud(42, 28, 0.55) + cloud(206, 34, 0.6) + ground(240, 10) +
      B(108, 64, 84, 100) + G('100,66 150,14 200,66') +
      crenel(70, 230, 152, 246, 7, 12) +
      B(36, 124, 48, 122) + G('30,126 60,70 90,126') + flag(60, 70, 1) +
      B(216, 124, 48, 122) + G('210,126 240,70 270,126') + flag(240, 70, 1) +
      arch(126, 184, 48, 62) + Z('M142 188 V246 M158 188 V246') + dot(166, 220) +
      arch(53, 150, 14, 22) + arch(233, 150, 14, 22) +
      G('136,246 164,246 190,300 110,300') +
      arch(124, 70, 52, 66) + B(116, 136, 68, 13, 4) +
      kid(150, 166, 0.9, { hair: 'long', crown: 1, bust: 1, armL: 0, armR: [30, -84] }) },

    // 2 — penguin family on an ice floe
    { id: 'a6-penguin-family', cat: 'animals', name: N('Penguin family', 'Famille pingouin', 'Familia de pingüinos', 'Pinguinfamilie', '企鹅一家'), svg:
      sky() + sun(52, 50, 20) + cloud(226, 58, 0.9) + waves(176, 5, 30) +
      P('M14 236 Q150 262 286 236 L276 258 Q150 284 26 258 Z') +
      P('M14 236 Q16 214 60 210 L236 206 Q284 210 286 236 Q150 262 14 236 Z') +
      fish(274, 166, 0.55) + ripple(262, 182, 24) +
      penguin(92, 240, 0.95) + penguin(208, 238, 0.85, { bow: 1 }, 1) + penguin(150, 250, 0.55, { beak: 0, feet: 0 }) },

    // 3 — rocket on its launch pad
    { id: 'a6-rocket-launch', cat: 'space', name: N('Rocket launch', 'Décollage de fusée', 'Despegue del cohete', 'Raketenstart', '火箭发射'), svg:
      sky() + P('M50 38 A24 24 0 1 0 50 86 A40 40 0 0 1 50 38 Z') +
      star(160, 28, 9) + star(256, 36, 10) + star(46, 140, 9) + star(272, 196, 8) + twinkle(96, 60) + twinkle(250, 250) + twinkle(18, 200) +
      '<g transform="rotate(-18 262 118)">' + P('M228 118 A34 12 0 0 1 296 118 L284 118 A22 5 0 0 0 240 118 Z') + C(262, 118, 19) + P('M228 118 A34 12 0 0 0 296 118 L284 118 A22 5 0 0 1 240 118 Z') + '</g>' +
      P('M0 248 Q150 234 300 248 V300 H0 Z') +
      B(146, 110, 56, 12) + B(200, 64, 22, 182) + Z('M200 64 L222 100 L200 136 L222 172 L200 208 L222 244 M222 64 L200 100 L222 136 L200 172 L222 208 L200 244') + C(211, 58, 6) +
      cloud(44, 254, 0.7) + cloud(256, 254, 0.7) +
      B(56, 234, 128, 14, 3) +
      P('M94 166 L66 206 V232 L94 216 Z') + P('M146 166 L174 206 V232 L146 216 Z') +
      P('M120 40 C142 64 148 110 146 170 V222 H94 V170 C92 110 98 64 120 40 Z') +
      P('M120 40 C132 52 140 66 143 84 H97 C100 66 108 52 120 40 Z') +
      C(120, 120, 17) + C(120, 120, 10) + Z('M114 114 q3 -4 7 -5') +
      B(94, 176, 52, 16) + B(114, 200, 12, 36, 5) +
      P('M102 222 H138 L144 236 H96 Z') },

    // 4 — princess tea party
    { id: 'a6-tea-party', cat: 'princess', name: N('Tea party', 'Goûter de princesse', 'Fiesta del té', 'Teeparty', '公主茶会'), svg:
      sky() + ground(198, 6) + Z('M0 26 Q150 74 300 26') +
      [45, 115, 185, 255].map(x => { const t = x / 300, y = f(26 + 96 * t * (1 - t)); return G(`${x - 13},${y} ${x + 13},${y} ${x},${y + 24}`); }).join('') +
      kid(70, 216, 1.05, { hair: 'long', dress: 1, crown: 1, legs: false, armL: [-22, -34], armR: [22, -34] }) +
      C(208, 128, 10) + C(252, 128, 10) + E(230, 196, 30, 26) + C(230, 150, 25) + E(230, 161, 11, 8) +
      eye(221, 145, 3.4) + eye(239, 145, 3.4) + `<ellipse cx="230" cy="157" rx="4" ry="3" fill="${INK}"/>` + Z('M226 163 q4 4 8 0') +
      P('M20 200 H280 L290 260 Q150 270 10 260 Z') + Z('M40 224 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M90 240 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M150 226 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M210 242 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M262 224 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0') +
      P('M128 188 C116 186 110 176 108 164 L116 162 C120 172 124 176 130 177 Z') + P('M170 170 C200 162 200 200 172 198 L172 190 C184 190 184 178 171 179 Z') +
      E(150, 182, 24, 19) + P('M133 168 Q136 157 146 155 Q144 147 150 147 Q156 147 154 155 Q164 157 167 168 Z') +
      [70, 230].map(x => E(x, 203, 19, 6) + P(`M${x - 13} 186 H${x + 13} Q${x + 13} 202 ${x} 202 Q${x - 13} 202 ${x - 13} 186 Z`) + Z(`M${x + 12} 190 q8 0 6 6 q-2 4 -7 3 M${x - 3} 180 q-4 -5 0 -9 q4 -4 0 -9`)).join('') },

    // 5 — mermaid lagoon
    { id: 'a6-mermaid-lagoon', cat: 'princess', name: N('Mermaid lagoon', 'Lagon de la sirène', 'Laguna de la sirena', 'Meerjungfrauenlagune', '美人鱼泻湖'), svg:
      sky() + sun(40, 40, 16) + cloud(132, 48, 0.75) +
      P('M190 150 Q238 118 290 150 Z') + palm(234, 144, 0.8) +
      waves(146, 4, 30) +
      P('M50 266 Q46 226 82 210 Q120 194 156 210 Q186 226 186 266 Z') +
      P('M100 204 C96 236 118 254 156 252 C176 251 190 244 198 236 L192 224 C178 232 162 234 150 230 C138 226 136 214 136 204 Z') +
      Z('M116 230 q5 5 10 0 M132 240 q5 5 10 0 M150 242 q5 5 10 0') +
      P('M192 230 C198 212 216 204 230 208 C222 218 214 226 208 232 C218 234 228 244 228 258 C214 256 200 248 192 238 Z') +
      kid(118, 236, 1, { hair: 'long', bust: 1, body: 'M-10 -54 C-14 -46 -16 -40 -15 -30 H15 C16 -40 14 -46 10 -54 Z', armL: [-28, -30], armR: [28, -30],
        add: () => P('M-14 -46 C-10 -53 -3 -53 0 -46 C3 -53 10 -53 14 -46 L13 -39 H-13 Z') }) +
      star(72, 238, 12, 0.5) +
      waves(268, 5, 40) +
      fish(38, 190, 0.75) + Z('M60 176 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M68 164 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0') + ripple(20, 210, 30) },

    // 6 — fairy garden
    { id: 'a6-fairy-garden', cat: 'princess', name: N('Fairy garden', 'Jardin des fées', 'Jardín de hadas', 'Feengarten', '仙女花园'), svg:
      sky() + cloud(56, 50, 0.8) + ground(234, 8) +
      P('M206 254 Q200 208 214 186 H262 Q276 208 270 254 Z') +
      P('M186 192 Q184 130 238 128 Q292 130 290 192 Q238 204 186 192 Z') +
      C(212, 166, 9) + C(244, 146, 10) + C(272, 172, 8) +
      arch(220, 212, 24, 42) + C(258, 220, 7) + Z('M258 213 V227 M251 220 H265') +
      kid(112, 196, 0.95, { hair: 'bun', dress: 1, armL: [-26, -42], armR: [24, -62],
        back: () => mir(() => P('M-4 -52 C-24 -88 -54 -86 -52 -64 C-50 -52 -30 -50 -8 -48 C-30 -44 -44 -28 -34 -20 C-24 -12 -12 -30 -4 -44 Z')),
        add: () => Z('M24 -62 L32 -84') + star(34, -92, 10) }) +
      twinkle(162, 96) + twinkle(64, 110) + twinkle(176, 136, 4) +
      flower(36, 282, 1, 5, 0) + flower(84, 268, 0.85, 6, 0) + flower(160, 286, 0.95, 5, 0) + tufts([120, 262], [200, 274], [264, 280]) },

    // 7 — unicorn in a meadow with a rainbow
    { id: 'a6-unicorn-rainbow', cat: 'princess', name: N('Rainbow unicorn', 'Licorne arc-en-ciel', 'Unicornio del arcoíris', 'Regenbogen-Einhorn', '彩虹独角兽'), svg:
      sky() + rainbow(150, 200, 132, 15, 4) + sun(266, 34, 14) + cloud(42, 206, 1.1) + cloud(260, 206, 1.1) +
      P('M0 214 Q70 186 150 206 Q230 186 300 212 V300 H0 Z') +
      horse(140, 272, 0.95, { horn: 1 }) +
      flower(30, 290, 0.8, 5, 1) + flower(268, 292, 0.85, 6, 1) + tufts([96, 290], [214, 292]) },

    // 8 — ballerina on a stage with curtains
    { id: 'a6-ballerina-stage', cat: 'princess', name: N('Ballerina', 'Ballerine', 'Bailarina', 'Ballerina', '芭蕾舞女孩'), svg:
      sky() + P('M0 226 H300 V300 H0 Z') + Z('M70 226 L44 300 M120 226 L112 300 M180 226 L188 300 M230 226 L256 300') +
      E(150, 256, 74, 18) +
      at(150, 0, 1, () => mir(() => P('M-150 0 H-72 C-78 50 -94 110 -108 142 C-96 172 -86 200 -84 226 H-150 Z') + Z('M-128 34 C-126 80 -124 120 -126 142 C-122 172 -118 200 -116 226') + E(-106, 144, 11, 8))) +
      P('M0 0 H300 V24 q-25 22 -50 0 q-25 22 -50 0 q-25 22 -50 0 q-25 22 -50 0 q-25 22 -50 0 q-25 22 -50 0 Z') +
      Z('M104 34 V50 M196 34 V50') + star(104, 62, 12) + star(196, 62, 12) +
      kid(150, 246, 1.15, { hair: 'bun', legs: false, body: 'M-11 -55 H11 L10 -32 H-10 Z', armL: [-38, -60], armR: [34, -94],
        back: () => cap(-7, -28, -6, -7, 9) + cap(7, -28, 6, -7, 9) + E(-6, -4, 5, 6.5) + E(6, -4, 5, 6.5),
        add: () => P('M-10 -38 C-26 -40 -40 -34 -40 -28 C-40 -22 -30 -20 -24 -22 C-18 -18 -8 -18 0 -20 C8 -18 18 -18 24 -22 C30 -20 40 -22 40 -28 C40 -34 26 -40 10 -38 Z') }) +
      P('M226 262 L252 256 L242 282 Z') + blob(232, 252, 8, 6) + blob(247, 248, 8, 6) },

    // 9 — princess with her friendly dragon
    { id: 'a6-princess-dragon', cat: 'princess', name: N('Princess and dragon', 'La princesse et son dragon', 'La princesa y su dragón', 'Prinzessin und Drache', '公主和小龙'), svg:
      sky() + sun(48, 44, 16) +
      P('M0 196 Q90 150 190 176 Q250 160 300 172 V300 H0 Z') +
      B(226, 124, 26, 46) + G('222,126 239,100 256,126') + Z('M239 100 V88') +
      P('M0 236 Q150 220 300 236 V300 H0 Z') + tufts([140, 262], [30, 286]) +
      kid(78, 278, 1.1, { hair: 'long', dress: 1, crown: 1, armL: [-20, -30], armR: [30, -58] }) +
      dragon(204, 280, 1, 1) },

    // 10 — royal carriage pulled by a horse
    { id: 'a6-royal-carriage', cat: 'princess', name: N('Royal carriage', 'Carrosse royal', 'Carroza real', 'Königskutsche', '皇家马车'), svg:
      sky() + sun(256, 42, 16) + cloud(60, 44, 0.8) + cloud(168, 72, 0.6) +
      P('M0 200 Q100 168 200 192 Q260 178 300 186 V300 H0 Z') +
      P('M0 250 Q150 238 300 250 V300 H0 Z') +
      Z('M150 212 L198 226') +
      P('M26 220 C18 176 34 136 92 132 C150 136 166 176 158 220 Q92 234 26 220 Z') +
      G('70,140 64,116 80,126 92,108 104,126 120,116 114,140') +
      arch(72, 152, 40, 40) + Z('M92 152 V192 M72 172 H112') + heart(92, 210, 0.8) +
      C(60, 244, 24) + C(60, 244, 8) + Z('M60 220 V236 M60 252 V268 M36 244 H52 M68 244 H84') +
      C(140, 250, 19) + C(140, 250, 7) + Z('M140 231 V243 M140 257 V269 M121 250 H133 M147 250 H159') +
      horse(228, 268, 0.72, { plume: 1, blanket: 1 }) },

    // 11 — princess picnic
    { id: 'a6-princess-picnic', cat: 'princess', name: N('Princess picnic', 'Pique-nique de princesse', 'Pícnic de princesa', 'Prinzessinnen-Picknick', '公主野餐'), svg:
      sky() + sun(252, 40, 16) + cloud(150, 50, 0.7) +
      P('M0 188 Q80 160 170 180 Q240 166 300 176 V300 H0 Z') +
      tree(46, 212, 1.25) + butterfly(180, 116, 0.75, 15) +
      G('44,232 252,226 288,284 12,292') + Z('M113 230 L104 289 M183 228 L196 287 M28 262 L270 255') +
      kid(92, 264, 1, { hair: 'long', crown: 1, legs: false, body: 'M-9 -54 C-14 -40 -26 -22 -36 -8 Q0 2 36 -8 C26 -22 14 -40 9 -54 Z', armL: [-24, -30], armR: [26, -40] }) +
      P('M190 240 C190 212 234 212 234 240 H226 C226 222 198 222 198 240 Z') + P('M184 238 H240 L234 268 H190 Z') + Z('M186 248 H238 M188 258 H236 M200 238 L202 268 M212 238 V268 M224 238 L222 268') +
      C(258, 268, 10) + Z('M258 258 q2 -6 6 -8') +
      E(150, 274, 24, 7) + G('134,272 166,272 150,252') + Z('M140 265 H160') +
      flower(282, 226, 0.75, 5, 0) },

    // 12 — farm barn with a pig and a hen
    { id: 'a6-farm-barn', cat: 'animals', name: N('On the farm', 'À la ferme', 'En la granja', 'Auf dem Bauernhof', '农场'), svg:
      sky() + sun(44, 40, 15) + cloud(140, 42, 0.7) +
      P('M0 186 Q100 158 200 176 Q260 168 300 172 V300 H0 Z') +
      G('158,240 158,152 218,108 278,152 278,240') + P('M146 160 L218 98 L290 160 L280 168 L218 116 L156 168 Z') +
      B(204, 132, 28, 24) + Z('M218 132 V156') + B(192, 184, 52, 56) + Z('M192 184 L244 240 M244 184 L192 240') +
      B(-4, 196, 154, 12, 3) + B(-4, 220, 154, 12, 3) +
      [14, 50, 86, 122].map(x => G(`${x - 8},244 ${x - 8},190 ${x},180 ${x + 8},190 ${x + 8},244`)).join('') +
      pig(116, 282, 1) + hen(40, 274, 1.15) + tufts([180, 266], [270, 268], [20, 292]) },

    // 13 — fox in an autumn forest
    { id: 'a6-autumn-fox', cat: 'animals', name: N('Fox in autumn', 'Renard en automne', 'Zorro en otoño', 'Fuchs im Herbst', '秋天的狐狸'), svg:
      sky() + sun(250, 40, 15) + cloud(78, 44, 0.7) +
      P('M0 228 Q150 210 300 228 V300 H0 Z') +
      tree(40, 240, 1.35) + tree(262, 236, 1.3) + tree(206, 222, 0.75) +
      fox(146, 276, 1.1) +
      leaf(108, 86, 1, 30) + leaf(190, 108, 1, -35) + leaf(244, 270, 1, 70) + leaf(60, 272, 1, -60) +
      shroom(96, 290, 0.8) + shroom(212, 292, 0.7) },

    // 14 — bunny family at their burrow
    { id: 'a6-bunny-burrow', cat: 'animals', name: N('Bunny family', 'Famille lapin', 'Familia de conejos', 'Hasenfamilie', '兔子一家'), svg:
      sky() + sun(46, 42, 16) + cloud(206, 46, 0.8) +
      P('M0 212 Q70 140 170 166 Q240 184 300 194 V300 H0 Z') +
      E(96, 212, 30, 19) + bunny(96, 248, 0.6, { peek: 1 }) +
      bunny(184, 268, 1) + bunny(250, 278, 0.62, { feet: 0 }) +
      carrot(126, 276, 0.9, 80) + carrot(284, 250, 0.75, -15) +
      flower(26, 290, 0.75, 5, 0) + flower(62, 296, 0.6, 6, 0) + tufts([150, 290], [220, 294]) },

    // 15 — polar bear on an iceberg
    { id: 'a6-polar-bear', cat: 'animals', name: N('Polar bear', 'Ours polaire', 'Oso polar', 'Eisbär', '北极熊'), svg:
      sky() + sun(244, 44, 16) + cloud(70, 48, 0.8) + cloud(160, 78, 0.55) +
      G('210,204 230,178 250,170 274,186 292,204') + waves(196, 4, 30) +
      G('34,206 62,150 96,138 124,166 146,206') +
      P('M14 228 Q20 206 50 204 L170 200 Q206 204 212 226 Q110 240 14 228 Z') +
      P('M14 228 Q110 240 212 226 L200 262 Q110 276 30 262 Z') + Z('M60 244 L70 262 M150 240 L142 258') +
      polar(92, 226, 0.85) + cub(182, 222, 0.7) + fish(256, 250, 0.7, 1) + ripple(232, 272, 26) + ripple(30, 282, 26) },

    // 16 — beaver building a dam
    { id: 'a6-beaver-dam', cat: 'animals', name: N('Beaver dam', 'Le barrage du castor', 'La presa del castor', 'Biberdamm', '河狸筑坝'), svg:
      sky() + sun(250, 38, 15) + cloud(110, 40, 0.7) +
      P('M0 150 Q70 110 150 136 Q230 112 300 140 V300 H0 Z') + pine(40, 164, 0.9) +
      P('M0 172 Q150 162 300 172 V204 H0 Z') + ripple(80, 176) + ripple(170, 174) +
      [[36, 184, 112], [148, 184, 112], [22, 198, 90], [112, 198, 80], [192, 198, 90], [40, 212, 110], [150, 212, 110]].map(([x, y, w]) => B(x, y, w, 14, 7) + Z(`M${x + w - 7} ${y + 7} m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0`)).join('') +
      P('M70 226 H230 L258 300 H44 Z') + ripple(110, 254, 30) + ripple(170, 278, 30) +
      P('M0 226 H70 L44 300 H0 Z') + P('M300 226 H230 L258 300 H300 Z') +
      beaver(232, 186, 0.95) },

    // 17 — bird feeder with birds
    { id: 'a6-bird-feeder', cat: 'animals', name: N('Bird feeder', 'Mangeoire à oiseaux', 'Comedero de pájaros', 'Vogelhäuschen', '喂鸟器'), svg:
      sky() + sun(44, 40, 15) + cloud(228, 44, 0.8) +
      blob(268, 240, 26, 8) + ground(244, 8) +
      B(144, 150, 12, 102) + B(120, 104, 60, 46) + C(150, 126, 10) + G('106,110 150,68 194,110') +
      B(100, 146, 100, 12, 4) + dot(120, 143, 1.8) + dot(128, 142, 1.8) + dot(136, 143, 1.8) +
      bird(150, 70, 0.9) + bird(190, 146, 0.8, 1) + bird(66, 120, 0.85, 0, 1) +
      flower(36, 290, 0.8) + flower(214, 292, 0.7, 6) },

    // 18 — zebra at a waterhole
    { id: 'a6-zebra-waterhole', cat: 'animals', name: N('Zebra at the waterhole', 'Zèbre au point d’eau', 'Cebra en la charca', 'Zebra am Wasserloch', '水塘边的斑马'), svg:
      sky() + sun(60, 54, 20) + cloud(170, 44, 0.7) +
      P('M0 178 Q150 166 300 178 V300 H0 Z') +
      P('M244 182 L248 132 L232 110 L240 106 L252 124 L264 106 L271 110 L258 132 L260 182 Z') +
      P('M192 112 C196 94 228 88 250 92 C274 86 300 96 300 110 C290 120 206 122 192 112 Z') +
      E(126, 264, 100, 24) + ripple(70, 266, 30) + ripple(130, 278, 30) +
      horse(196, 242, 0.85, { zebra: 1 }, 1) +
      reed(30, 254) + reed(222, 260, 0.9) + rock(262, 286, 0.9) + rock(290, 290, 0.6) },

    // 19 — camel in the desert
    { id: 'a6-desert-camel', cat: 'animals', name: N('Desert camel', 'Chameau du désert', 'Camello del desierto', 'Wüstenkamel', '沙漠骆驼'), svg:
      sky() + sun(244, 56, 24) + cloud(90, 42, 0.7) +
      G('190,192 224,132 258,192') + Z('M224 132 L214 192') +
      P('M0 186 Q90 148 180 182 Q240 164 300 176 V300 H0 Z') + palm(44, 196, 0.8) +
      P('M0 238 Q120 200 300 232 V300 H0 Z') +
      camel(146, 262, 0.95) +
      P('M0 300 V270 Q80 254 160 276 Q230 264 300 280 V300 Z') +
      cactus(262, 280, 0.8) + cactus(30, 292, 0.65) },

    // 20 — cat watching a goldfish bowl
    { id: 'a6-cat-goldfish', cat: 'animals', name: N('Cat and goldfish', 'Le chat et le poisson rouge', 'El gato y el pez', 'Katze und Goldfisch', '小猫和金鱼'), svg:
      B(0, 0, 300, 232) + P('M0 232 H300 V300 H0 Z') +
      B(40, 34, 90, 88) + Z('M85 34 V122 M40 78 H130') + B(32, 120, 106, 12, 3) +
      Z('M24 26 H146') + P('M30 26 H58 C54 52 48 90 34 126 H30 Z') + P('M140 26 H112 C116 52 122 90 136 126 H140 Z') +
      B(214, 16, 64, 48, 3) + B(222, 24, 48, 32) + Z('M224 52 L236 40 L246 50 L254 44 L268 54') +
      E(130, 272, 112, 18) +
      B(212, 160, 16, 66) + E(220, 226, 30, 7) + E(220, 158, 54, 12) +
      P('M203 84 A38 38 0 1 0 237 84 Z') +
      P('M186.5 100 A38 38 0 1 0 253.5 100 Q237 94 220 100 Q203 106 186.5 100 Z') +
      P('M199 140 C193 128 203 120 197 108 C209 116 211 128 207 140 Z') +
      P('M190.5 142 A38 38 0 0 0 249.5 142 Q220 136 190.5 142 Z') +
      fish(228, 118, 0.6) + Z('M203 84 Q220 90 237 84 M246 104 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0 M242 92 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0') +
      cat(106, 276, 1.25) },

    // 21 — deer by a stream
    { id: 'a6-deer-stream', cat: 'animals', name: N('Deer by the stream', 'Le faon au ruisseau', 'El ciervo junto al arroyo', 'Reh am Bach', '小溪边的小鹿'), svg:
      sky() + sun(250, 40, 15) + cloud(96, 44, 0.7) +
      P('M0 168 Q80 128 160 156 Q230 132 300 160 V300 H0 Z') + tree(34, 202, 1.05) + tree(274, 198, 0.95) +
      P('M0 196 Q150 184 300 196 V300 H0 Z') +
      P('M168 196 Q196 214 168 232 Q136 252 162 274 Q178 288 168 300 H240 Q252 282 230 264 Q204 246 228 228 Q252 210 210 196 Z') +
      ripple(184, 220, 18) + ripple(174, 262, 20) + ripple(198, 290, 20) +
      deer(92, 266, 1) + rock(222, 248, 0.6) + rock(250, 288, 0.55) +
      flower(28, 290, 0.7, 5, 0) + flower(128, 294, 0.6, 6, 0) + tufts([270, 254], [146, 240]) },

    // 22 — owl family in a tree hollow at night
    { id: 'a6-owl-family', cat: 'animals', name: N('Owl family', 'Famille hibou', 'Familia de búhos', 'Eulenfamilie', '猫头鹰一家'), svg:
      sky() + C(236, 60, 26) + shut(227, 56, 4) + shut(245, 56, 4) + smile(236, 68, 4) +
      star(190, 30, 8) + star(280, 118, 8) + star(200, 112, 7) + twinkle(276, 20) + twinkle(160, 96, 4) +
      P('M0 270 Q150 258 300 270 V300 H0 Z') +
      P('M44 300 C56 240 60 170 52 110 L48 60 H170 L162 110 C156 170 160 240 176 300 Z') + Z('M70 240 q6 -10 2 -22 M150 250 q-6 -12 0 -24 M140 100 q4 -8 0 -16') +
      blob(64, 44, 50, 9) + blob(156, 34, 40, 8) +
      P('M156 186 C190 178 230 172 288 164 L290 178 C236 188 196 196 158 204 Z') + leaf(274, 154, 1, 50) +
      arch(74, 140, 74, 64) + owl(93, 202, 0.5, 1) + owl(129, 202, 0.5, 1) +
      owl(232, 176, 0.8) },

    // 23 — friendly dinosaur valley
    { id: 'a6-dino-valley', cat: 'dinosaurs', name: N('Dinosaur valley', 'La vallée des dinosaures', 'El valle de los dinosaurios', 'Dinosaurier-Tal', '恐龙山谷'), svg:
      sky() + sun(46, 40, 16) + cloud(156, 42, 0.7) +
      G('110,176 176,92 242,176') + G('196,176 252,116 308,176') +
      P('M0 172 Q150 160 300 172 V300 H0 Z') + palm(30, 198, 0.85, 0, 0) +
      longneck(206, 254, 0.85, 1) + trike(72, 264, 0.85) + fern(146, 270, 0.9) +
      P('M0 276 Q80 264 160 280 Q230 292 300 274 V300 H0 Z') + ripple(60, 288, 24) + ripple(230, 290, 24) },

    // 24 — dinosaur nest with eggs and a mum
    { id: 'a6-dino-nest', cat: 'dinosaurs', name: N('Dinosaur nest', 'Le nid de dinosaure', 'El nido de dinosaurio', 'Dinosauriernest', '恐龙窝'), svg:
      sky() + sun(250, 40, 16) + cloud(140, 44, 0.7) + palm(270, 202, 0.85, 1) +
      P('M0 196 Q150 184 300 196 V300 H0 Z') +
      stego(84, 266, 0.95) +
      E(216, 246, 60, 16) + E(186, 238, 13, 17) + E(246, 238, 13, 17) + Z(ring(182, 232, 3) + ring(190, 242, 2.5) + ring(250, 230, 3) + ring(242, 242, 2.5)) +
      C(216, 222, 14) + eye(210, 222, 2.6) + eye(222, 222, 2.6) + smile(216, 228, 3) +
      P('M200 250 V232 L206 238 L211 230 L216 238 L221 230 L226 238 L232 232 V250 Z') +
      P('M203 214 Q216 196 229 214 L224 210 L220 215 L216 209 L212 215 L208 210 Z') +
      P('M154 244 C156 280 276 280 278 244 Q216 262 154 244 Z') + Z('M170 258 l14 6 M196 266 l16 -4 M226 266 l14 -6 M252 260 l12 -8') +
      fern(28, 292, 0.8) + fern(150, 296, 0.6) },

    // 25 — dragon flying over the hills
    { id: 'a6-dragon-hills', cat: 'dinosaurs', name: N('Flying dragon', 'Le dragon volant', 'El dragón volador', 'Fliegender Drache', '飞龙'), svg:
      sky() + sun(258, 40, 16) + cloud(54, 50, 0.8) + cloud(196, 32, 0.55) +
      P('M0 212 Q70 172 150 198 Q220 170 300 192 V300 H0 Z') +
      pine(44, 238, 0.6) + pine(262, 230, 0.55) +
      P('M0 252 Q100 222 200 248 Q260 238 300 246 V300 H0 Z') +
      B(196, 222, 44, 36) + G('190,224 218,198 246,224') + arch(212, 238, 12, 20) + B(224, 230, 10, 10) +
      tufts([60, 280], [150, 276], [270, 284]) +
      flyDragon(150, 152, 1.1) },

    // 26 — coral reef
    { id: 'a6-coral-reef', cat: 'ocean', name: N('Coral reef', 'Le récif de corail', 'El arrecife de coral', 'Korallenriff', '珊瑚礁'), svg:
      sky() + Z(ring(150, 40, 4) + ring(156, 26, 3) + ring(40, 120, 3.5) + ring(270, 100, 4) + ring(264, 86, 3)) +
      P('M196 254 C192 226 214 208 240 212 C268 216 284 238 280 258 Z') +
      P('M0 250 Q80 236 160 252 Q230 264 300 246 V300 H0 Z') +
      at(62, 262, 1.25, () => P('M-7 0 C-7 -10 -8 -18 -14 -24 C-20 -30 -28 -36 -32 -46 A6 6 0 0 1 -21 -50 C-18 -42 -14 -38 -8 -34 C-10 -46 -16 -58 -14 -68 A6 6 0 0 1 -2 -68 C-2 -58 -2 -48 0 -40 C4 -52 8 -64 12 -74 A6 6 0 0 1 23 -70 C18 -58 12 -46 8 -34 C14 -38 22 -42 28 -50 A6 6 0 0 1 36 -42 C30 -32 18 -24 8 -18 C7 -12 7 -6 7 0 Z') +
        Z(ring(-24, -42, 1.8) + ring(-8, -58, 1.8) + ring(14, -60, 1.8) + ring(0, -22, 1.8) + ring(24, -40, 1.8))) +
      at(240, 222, 1, () => P('M-3 0 L-3 -12 C-32 -16 -40 -44 -28 -60 C-14 -74 14 -74 28 -60 C40 -44 32 -16 3 -12 L3 0 Z') + Z('M0 -12 L-22 -52 M0 -12 L0 -66 M0 -12 L22 -52 M0 -12 L-30 -32 M0 -12 L30 -32')) +
      blob(150, 262, 22, 9, 0.6) + Z('M136 258 q4 -6 8 0 t8 0 t8 0 M140 268 q4 -6 8 0 t8 0') +
      P('M98 266 V238 Q98 230 105 230 Q112 230 112 238 V246 H114 V224 Q114 216 121 216 Q128 216 128 224 V266 Z') + Z('M100 236 h10 M116 222 h10') +
      P('M14 262 C6 238 22 222 12 198 C10 188 18 184 20 194 C26 216 14 236 24 260 Z') + P('M282 252 C274 228 290 212 280 188 C278 178 286 174 288 184 C294 206 282 226 292 250 Z') +
      fish(206, 66, 0.85, 1) + fish(232, 122, 0.9) + fish(64, 160, 0.75) + turtle(96, 82, 0.95) +
      star(208, 280, 12, 0.5) + shell(40, 288, 0.8) },

    // 27 — pirate ship at sea
    { id: 'a6-pirate-ship', cat: 'ocean', name: N('Pirate ship', 'Bateau pirate', 'Barco pirata', 'Piratenschiff', '海盗船'), svg:
      sky() + sun(44, 42, 16) + cloud(256, 46, 0.8) +
      P('M222 196 Q256 172 290 196 Z') + waves(194, 4, 30) +
      B(134, 58, 10, 150) + G('200,100 254,192 200,184') +
      P('M88 96 Q140 86 190 96 Q196 140 190 180 Q140 172 88 180 Q82 140 88 96 Z') +
      P('M104 62 Q140 56 176 62 Q180 78 176 90 Q140 86 104 90 Q100 78 104 62 Z') +
      B(124, 42, 30, 16, 3) + P('M139 42 V20 H172 L164 29 L172 38 H139 Z') + Z('M150 26 q3 -3 5 0 q2 -3 5 0 q0 4 -5 7 q-5 -3 -5 -7') +
      P('M38 190 H82 V204 H240 L226 238 Q218 256 196 256 H96 Q66 256 52 232 Z') + B(46, 196, 26, 14, 3) + Z('M82 214 H234') +
      C(110, 228, 7) + C(150, 228, 7) + C(190, 228, 7) +
      waves(252, 6, 40) + Z('M226 150 q5 -5 10 0 q5 -5 10 0') + bird(258, 118, 0.7, 1, 1) },

    // 28 — lighthouse by the sea
    { id: 'a6-lighthouse', cat: 'ocean', name: N('Lighthouse', 'Le phare', 'El faro', 'Leuchtturm', '灯塔'), svg:
      sky() + cloud(64, 160, 0.7) + cloud(260, 150, 0.6) +
      G('186,72 20,30 20,116 186,90') + G('214,72 300,44 300,104 214,90') +
      waves(204, 4, 30) +
      P('M136 300 V244 Q150 214 196 210 Q252 206 280 230 Q296 244 300 252 V300 Z') + rock(116, 270, 0.9) +
      [[104, 136], [136, 168], [168, 200], [200, 232]].map(([a, b]) => { const w = v => 16 + (v - 104) / 128 * 12; return G([[200 - w(a), a], [200 + w(a), a], [200 + w(b), b], [200 - w(b), b]]); }).join('') +
      arch(192, 210, 16, 22) + arch(194, 146, 12, 16) +
      B(176, 94, 48, 12, 2) + Z('M178 94 V84 M189 94 V84 M200 94 V84 M211 94 V84 M222 94 V84 M176 84 H224') +
      B(186, 64, 28, 30) + Z('M200 64 V94') + G('180,66 200,42 220,66') + C(200, 38, 6) +
      P('M40 236 H100 L92 252 H50 Z') + G('68,234 68,190 94,232') + Z('M68 234 V188') +
      Z('M100 70 q6 -6 12 0 q6 -6 12 0 M128 104 q5 -5 10 0 q5 -5 10 0') },

    // 29 — sandcastle on the beach
    { id: 'a6-sandcastle', cat: 'ocean', name: N('Sandcastle', 'Château de sable', 'Castillo de arena', 'Sandburg', '沙堡'), svg:
      sky() + sun(256, 40, 16) + cloud(70, 44, 0.8) +
      waves(160, 4, 30) +
      P('M0 196 Q150 180 300 194 V300 H0 Z') +
      crenel(128, 172, 150, 214, 3, 10) + flag(150, 140) +
      crenel(96, 204, 210, 252, 5, 10) + crenel(76, 116, 178, 252, 2, 10) + crenel(184, 224, 178, 252, 2, 10) +
      arch(140, 222, 20, 30) + Z('M90 196 v-8 q6 -6 12 0 v8 M198 196 v-8 q6 -6 12 0 v8') +
      P('M236 232 H268 L262 270 H242 Z') + Z('M236 232 Q252 206 268 232 M240 248 q5 -4 10 0 t10 0 t8 0') +
      at(62, 284, 0.9, () => P('M-9 0 H9 L7 20 Q0 28 -7 20 Z') + cap(0, -2, 0, -44, 9), 0, 80) +
      'M36 222 A20 20 0 0 0 36 262 Q23 242 36 222 Z|M36 222 Q23 242 36 262 Q49 242 36 222 Z|M36 222 A20 20 0 0 1 36 262 Q49 242 36 222 Z'.split('|').map(P).join('') +
      star(280, 282, 12, 0.5) + shell(134, 292, 0.8, -15) + crab(196, 292, 0.8) },

    // 30 — train on a bridge
    { id: 'a6-train-bridge', cat: 'vehicles', name: N('Train on a bridge', 'Le train sur le pont', 'El tren en el puente', 'Zug auf der Brücke', '过桥的火车'), svg:
      sky() + sun(44, 40, 15) + cloud(150, 40, 0.7) +
      P('M0 190 Q80 150 160 180 Q230 150 300 176 V300 H0 Z') +
      P('M0 272 Q150 262 300 272 V300 H0 Z') +
      P('M0 204 H300 V300 H262 V262 A42 42 0 0 0 178 262 V300 H122 V262 A42 42 0 0 0 38 262 V300 H0 Z') +
      Z('M0 226 H24 M136 226 H164 M276 226 H300 M14 246 H34 M126 246 H140 M160 246 H174 M266 246 H286 M0 210 H300') +
      wagon(96, 204, 0.95) + wagon(164, 204, 0.95) + loco(240, 204, 0.95) +
      cloud(264, 126, 0.45) + cloud(282, 100, 0.35) },

    // 31 — race track with cars
    { id: 'a6-race-track', cat: 'vehicles', name: N('Car race', 'Course de voitures', 'Carrera de coches', 'Autorennen', '赛车'), svg:
      sky() + sun(260, 36, 14) + cloud(140, 36, 0.6) +
      P('M0 178 H300 V300 H0 Z') + tree(236, 186, 0.7) + tree(280, 184, 0.6) +
      P('M8 128 L28 102 H182 L202 128 Z') + B(14, 126, 182, 52) + Z('M14 144 H196 M14 162 H196') +
      Z([30, 50, 70, 90, 110, 130, 150, 170].map((v, i) => ring(v + (i % 2) * 4, 138, 4.5) + ring(v + 6, 156, 4.5)).join(' ')) +
      P('M0 200 H300 V256 H0 Z') + Z('M8 228 h22 M52 228 h22 M96 228 h22 M140 228 h22 M184 228 h22') +
      ink('M232 200 h6 v6 h-6 z M238 206 h6 v6 h-6 z M232 212 h6 v6 h-6 z M238 218 h6 v6 h-6 z M232 224 h6 v6 h-6 z M238 230 h6 v6 h-6 z M232 236 h6 v6 h-6 z M238 242 h6 v6 h-6 z M232 248 h6 v6 h-6 z') +
      Z('M276 200 V124') + B(276, 124, 24, 18) + ink('M276 124 h6 v6 h-6 z M288 124 h6 v6 h-6 z M282 130 h6 v6 h-6 z M294 130 h6 v6 h-6 z M276 136 h6 v6 h-6 z M288 136 h6 v6 h-6 z') +
      racecar(84, 226, 0.85) + racecar(178, 254, 1) +
      cone(26, 290) + cone(120, 292, 0.9) + tufts([70, 286], [250, 288]) },

    // 32 — construction site with a crane
    { id: 'a6-construction-site', cat: 'vehicles', name: N('Building site', 'Le chantier', 'La obra', 'Baustelle', '建筑工地'), svg:
      sky() + sun(270, 34, 13) + cloud(150, 30, 0.55) +
      P('M0 236 Q150 226 300 236 V300 H0 Z') +
      B(220, 104, 70, 46) + Z('M220 127 H290 M243 104 V150 M266 104 V150') + B(220, 150, 70, 100) + Z('M220 170 H290 M220 190 H290 M220 210 H290 M220 230 H290 M236 150 V170 M262 170 V190 M240 190 V210 M266 210 V230') +
      B(40, 64, 20, 188) + Z('M40 64 L60 92 L40 120 L60 148 L40 176 L60 204 L40 232 M60 64 L40 92 L60 120 L40 148 L60 176 L40 204 L60 232') +
      B(8, 52, 204, 12) + B(12, 64, 26, 20) + B(60, 64, 24, 24, 3) + Z('M66 70 h12 v8 h-12 z') +
      Z('M170 64 V108 M166 108 q4 6 8 0') + B(138, 112, 66, 14) + Z(ring(150, 119, 2.5) + ring(171, 119, 2.5) + ring(192, 119, 2.5)) +
      P('M188 258 Q226 212 268 258 Z') +
      B(70, 252, 100, 22, 11) + C(88, 263, 7) + C(120, 263, 7) + C(152, 263, 7) +
      B(80, 214, 60, 38, 4) + P('M88 214 V182 H120 L128 214 Z') + P('M94 208 V188 H116 L121 208 Z') +
      cap(134, 226, 170, 188, 13) + cap(170, 188, 198, 230, 12) + P('M188 226 L212 222 L210 248 Q200 256 190 246 Z') +
      cone(22, 292) + cone(284, 292) },

    // 33 — airport with a plane
    { id: 'a6-airport', cat: 'vehicles', name: N('Airport', 'L’aéroport', 'El aeropuerto', 'Flughafen', '飞机场'), svg:
      sky() + sun(262, 34, 14) + cloud(70, 40, 0.8) + cloud(184, 52, 0.55) +
      P('M0 186 H300 V300 H0 Z') +
      B(14, 120, 150, 66) + B(24, 130, 130, 22, 3) + Z('M50 130 V152 M76 130 V152 M102 130 V152 M128 130 V152') + B(74, 160, 28, 26) + Z('M88 160 V186') +
      B(196, 92, 22, 94) + P('M184 70 H230 L224 94 H190 Z') + Z('M192 82 H222 M200 76 V88 M214 76 V88') + G('186,70 207,56 228,70') +
      Z('M272 186 V128') + P('M272 128 L298 134 V146 L272 152 Z') + Z('M281 130 V150 M290 132 V148') +
      P('M0 222 H300 V272 H0 Z') + Z('M10 247 h24 M60 247 h24 M110 247 h24 M160 247 h24 M210 247 h24 M260 247 h24') +
      plane(150, 266, 1) + Z('M96 84 q5 -5 10 0 q5 -5 10 0 M126 100 q4 -4 8 0 q4 -4 8 0') },

    // 34 — harbour with boats
    { id: 'a6-harbour', cat: 'vehicles', name: N('Harbour', 'Le port', 'El puerto', 'Hafen', '港口'), svg:
      sky() + sun(254, 36, 14) + cloud(160, 40, 0.7) +
      P('M0 140 Q60 124 124 140 V172 H0 Z') +
      B(14, 104, 36, 40) + G('8,106 32,84 56,106') + Z('M26 120 h10 v10 h-10 z') + B(66, 112, 34, 32) + G('60,114 83,94 106,114') + Z('M78 126 h10 v10 h-10 z') +
      waves(166, 4, 30) +
      B(182, 224, 12, 50) + B(262, 224, 12, 50) + P('M170 210 H300 V226 H170 Z') + Z('M196 210 V226 M222 210 V226 M248 210 V226 M274 210 V226') +
      B(262, 184, 26, 26, 2) + Z('M262 184 L288 210 M288 184 L262 210') + B(234, 192, 24, 18, 2) +
      P('M20 236 H110 L96 256 H34 Z') + Z('M64 236 V150') + G('68,232 68,154 106,228') + G('60,232 60,166 28,226') +
      P('M112 262 H222 L208 288 H128 Z') + B(188, 226, 16, 36) + Z('M188 234 H204') + B(132, 226, 46, 36, 4) + B(140, 234, 30, 14, 3) + Z(ring(150, 274, 5)) +
      P('M232 276 H290 L282 290 H240 Z') +
      P('M36 292 L46 268 H62 L72 292 Z') + C(54, 262, 6) +
      Z('M140 90 q5 -5 10 0 q5 -5 10 0 M200 70 q4 -4 8 0 q4 -4 8 0') },

    // 35 — space station with an astronaut
    { id: 'a6-space-station', cat: 'space', name: N('Space station', 'La station spatiale', 'La estación espacial', 'Raumstation', '空间站'), svg:
      sky() + star(30, 150, 8) + star(270, 40, 9) + star(150, 20, 7) + star(276, 150, 7) + twinkle(110, 170) + twinkle(30, 240) + twinkle(200, 180, 4) +
      C(40, 40, 15) + Z(ring(34, 36, 3.5) + ring(46, 46, 2.5)) +
      C(262, 268, 64) + P('M220 240 C232 222 254 226 252 244 C250 258 232 262 220 254 Z') + P('M262 290 C270 270 296 268 300 280 V300 H266 C262 298 260 294 262 290 Z') +
      B(56, 56, 40, 36, 2) + B(56, 108, 40, 36, 2) + B(204, 56, 40, 36, 2) + B(204, 108, 40, 36, 2) +
      Z('M56 74 H96 M76 56 V92 M56 126 H96 M76 108 V144 M204 74 H244 M224 56 V92 M204 126 H244 M224 108 V144') +
      B(92, 94, 116, 12) + Z('M150 54 V44') + P('M136 44 Q150 58 164 44 Z') + B(124, 54, 52, 92, 14) + C(150, 100, 10) + Z('M124 76 H176 M124 124 H176') +
      Z('M150 146 C150 190 90 170 98 214') +
      kid(98, 274, 0.95, { hair: 'none', armL: [-30, -62], armR: [30, -40], back: () => C(0, -70, 24),
        add: () => Z('M-12 -84 q6 -6 14 -4 M0 -94 V-102') + C(0, -104, 3) + Z('M-6 -46 h12 v8 h-12 z') }) },

    // 36 — alien planet with a UFO
    { id: 'a6-alien-planet', cat: 'space', name: N('Alien planet', 'La planète extraterrestre', 'El planeta alienígena', 'Alien-Planet', '外星星球'), svg:
      sky() + star(140, 30, 8) + star(280, 140, 8) + star(24, 140, 7) + twinkle(250, 90) + twinkle(110, 120, 4) +
      '<g transform="rotate(-15 56 56)">' + P('M20 56 A36 11 0 0 1 92 56 L80 56 A24 5 0 0 0 32 56 Z') + C(56, 56, 22) + P('M20 56 A36 11 0 0 0 92 56 L80 56 A24 5 0 0 1 32 56 Z') + '</g>' +
      C(252, 34, 12) + Z(ring(248, 30, 3)) +
      P('M0 218 Q60 198 130 212 Q210 228 300 204 V300 H0 Z') +
      E(56, 262, 24, 8) + Z('M36 262 q20 -10 40 0') + E(250, 270, 28, 9) + Z('M226 270 q24 -12 48 0') + E(120, 244, 16, 6) +
      G('174,112 206,112 244,236 136,236') +
      P('M170 98 A20 20 0 0 1 210 98 Z') + E(190, 102, 46, 13) + C(160, 104, 6) + C(190, 108, 6) + C(220, 104, 6) + P('M168 112 H212 L204 120 H176 Z') +
      at(190, 248, 1.05, () => cap(-16, -28, -30, -42, 10) + cap(16, -28, 28, -16, 10) + Z('M-8 -48 L-14 -62 M8 -48 L14 -62') + C(-14, -66, 6) + C(14, -66, 6) +
        P('M-20 0 C-26 -20 -22 -48 0 -50 C22 -48 26 -20 20 0 Z') + C(0, -32, 10) + eye(0, -32, 5) + smile(0, -16, 5)) +
      at(30, 236, 1, () => P('M-4 0 C-6 -20 -2 -36 -8 -50 A10 10 0 1 1 8 -50 C2 -36 6 -20 4 0 Z')) + at(282, 248, 0.8, () => P('M-4 0 C-6 -20 -2 -36 -8 -50 A10 10 0 1 1 8 -50 C2 -36 6 -20 4 0 Z')) },

    // 37 — robot workshop
    { id: 'a6-robot-workshop', cat: 'space', name: N('Robot workshop', 'L’atelier du robot', 'El taller del robot', 'Roboterwerkstatt', '机器人工作室'), svg:
      B(0, 0, 300, 226) + P('M0 226 H300 V300 H0 Z') + Z('M0 254 H300') +
      B(16, 24, 128, 84, 4) + Z([36, 56, 76, 96, 116].map(v => ring(v, 34, 1.5) + ring(v, 98, 1.5)).join(' ')) +
      cap(44, 54, 92, 54, 9) + P('M30 52 C30 42 44 40 48 48 L42 54 L48 60 C44 68 30 66 30 56 Z') +
      cap(108, 44, 108, 94, 9) + B(94, 36, 28, 16, 3) +
      gear(226, 54, 22, 8) + gear(268, 96, 16, 7) +
      B(10, 150, 132, 14, 3) + B(20, 164, 12, 62) + B(120, 164, 12, 62) +
      P('M52 124 V114 Q52 102 68 102 Q84 102 84 114 V124 H76 V114 Q76 110 68 110 Q60 110 60 114 V124 Z') + B(40, 122, 56, 28, 3) + Z('M40 134 H96') +
      at(222, 284, 1.1, () =>
        B(-16, -36, 12, 26) + B(4, -36, 12, 26) + B(-22, -14, 20, 12, 4) + B(2, -14, 20, 12, 4) +
        cap(-26, -76, -38, -46, 11) + cap(26, -76, 38, -46, 11) + C(-38, -44, 7) + C(38, -44, 7) +
        B(-28, -88, 56, 54, 8) + B(-14, -78, 28, 20, 4) + dot(-6, -68, 2.5) + dot(6, -68, 2.5) + Z('M-6 -50 h12') +
        Z('M0 -126 V-138') + C(0, -142, 6) + B(-24, -126, 48, 38, 8) + B(-16, -120, 32, 24, 5) + eye(-7, -110, 3) + eye(7, -110, 3) + smile(0, -103, 4)) +
      P('M150 150 L166 126 H190 L198 150 Z') + Z('M178 150 V166 M164 166 H192') },

    // 38 — superhero on a city rooftop
    { id: 'a6-superhero-rooftop', cat: 'fantasy', name: N('Superhero', 'Super-héros', 'Superhéroe', 'Superheld', '超级英雄'), svg:
      sky() + sun(256, 44, 16) + cloud(64, 40, 0.7) +
      B(0, 102, 52, 140) + B(52, 70, 60, 172) + B(196, 92, 56, 150) + B(252, 124, 48, 118) +
      Z([[12, 116], [30, 116], [12, 140], [30, 140], [12, 164], [30, 164], [66, 86], [88, 86], [66, 110], [88, 110], [66, 134], [88, 134], [66, 158], [88, 158], [210, 108], [232, 108], [210, 132], [232, 132], [210, 156], [232, 156], [264, 140], [282, 140], [264, 164], [282, 164]].map(([a, b]) => `M${a} ${b} h10 v12 h-10 z`).join(' ')) +
      P('M0 236 H300 V300 H0 Z') + B(0, 226, 300, 14) +
      B(236, 178, 40, 48, 4) + G('230,180 256,160 282,180') + Z('M244 226 V236 M268 226 V236') +
      kid(140, 238, 1.25, { hair: 'short', armL: [-22, -30], armR: [24, -86],
        back: () => P('M-9 -54 C-24 -40 -40 -16 -50 6 Q-14 12 22 2 C18 -20 14 -40 9 -54 Z'),
        add: () => P('M-17 -73 C-10 -77 -4 -76 0 -72 C4 -76 10 -77 17 -73 C17 -66 12 -63 6 -64 C3 -64 1 -66 0 -67 C-1 -66 -3 -64 -6 -64 C-12 -63 -17 -66 -17 -73 Z') +
          eye(-6.5, -69, 2.8) + eye(6.5, -69, 2.8) + star(0, -43, 8) + Z('M-13 -32 H13') }) },

    // 39 — knight at the castle gate
    { id: 'a6-knight-gate', cat: 'fantasy', name: N('Little knight', 'Le petit chevalier', 'El pequeño caballero', 'Kleiner Ritter', '小骑士'), svg:
      sky() + sun(150, 34, 14) + cloud(240, 40, 0.6) + ground(244, 6) +
      crenel(40, 260, 110, 250, 9, 12) + crenel(8, 72, 82, 250, 3, 12) + crenel(228, 292, 82, 250, 3, 12) +
      P('M28 108 H52 V146 L40 138 L28 146 Z') + P('M248 108 H272 V146 L260 138 L248 146 Z') + Z('M40 116 l3 6 h6 l-5 4 l2 6 l-6 -4 l-6 4 l2 -6 l-5 -4 h6 z M260 116 l3 6 h6 l-5 4 l2 6 l-6 -4 l-6 4 l2 -6 l-5 -4 h6 z') +
      arch(96, 146, 108, 104) + Z('M114 154 V250 M132 148 V250 M150 146 V250 M168 148 V250 M186 154 V250 M98 180 H202 M96 210 H204 M96 236 H204') +
      G('112,250 188,250 206,300 94,300') +
      kid(150, 270, 1.2, { hair: 'none', armL: 0, armR: [24, -34],
        back: () => cap(26, -38, 34, -90, 10) + cap(14, -42, 36, -46, 8),
        add: () => P('M0 -88 C-6 -104 6 -118 22 -114 C14 -108 9 -100 7 -88 Z') +
          P('M-19 -68 C-20 -93 20 -93 19 -68 V-56 H12 V-74 Q0 -80 -12 -74 V-56 H-19 Z') +
          P('M-36 -52 H-10 V-34 C-10 -22 -18 -16 -23 -14 C-28 -16 -36 -22 -36 -34 Z') + star(-23, -36, 7) }) },

    // 40 — treasure island
    { id: 'a6-treasure-island', cat: 'fantasy', name: N('Treasure island', 'L’île au trésor', 'La isla del tesoro', 'Schatzinsel', '宝藏岛'), svg:
      sky() + sun(46, 40, 16) + cloud(160, 36, 0.7) +
      P('M232 164 H284 L276 176 H240 Z') + G('258,162 258,124 280,160') + Z('M258 164 V122') +
      waves(172, 4, 30) +
      P('M8 262 Q30 214 150 210 Q270 214 292 262 Q150 278 8 262 Z') +
      palm(70, 240, 1.1) +
      P('M150 206 L156 176 H210 L216 206 Z') + P('M152 214 Q160 196 172 204 Q182 192 194 202 Q206 194 214 214 Z') +
      B(148, 212, 68, 40, 4) + Z('M148 226 H216') + B(176, 220, 12, 14, 3) + G('184,186 194,196 184,206 174,196') +
      Z('M106 254 l12 10 M118 254 l-12 10') +
      parrot(250, 252, 0.9, 1) + crab(116, 286, 0.7) + ripple(30, 286, 26) + ripple(240, 290, 26) },

    // 41 — bakery shop window
    { id: 'a6-bakery-window', cat: 'food', name: N('Bakery', 'La boulangerie', 'La panadería', 'Bäckerei', '面包店'), svg:
      sky() + Z('M8 12 h22 M40 12 h22 M240 12 h22 M272 12 h22 M24 24 h22 M256 24 h22') +
      [0, 1, 2, 3, 4].map(i => { const x = 20 + 52 * i; return P(`M${x} 36 H${x + 52} V70 Q${x + 26} 90 ${x} 70 Z`); }).join('') + Z('M14 36 H286') +
      B(22, 98, 174, 136, 4) + B(30, 160, 158, 12, 2) +
      B(44, 136, 62, 24, 4) + B(54, 116, 42, 22, 4) + C(75, 108, 7) + Z('M44 143 q8 6 15 0 q8 6 15 0 q8 6 16 0 q8 6 16 0 M54 122 q7 5 14 0 q7 5 14 0 q7 5 14 0') +
      [128, 166].map(x => P(`M${x - 13} 140 H${x + 13} L${x + 9} 160 H${x - 9} Z`) + Z(`M${x - 5} 142 L${x - 3} 158 M${x + 5} 142 L${x + 3} 158`) + P(`M${x - 15} 141 Q${x - 16} 126 ${x - 4} 124 Q${x} 112 ${x + 6} 122 Q${x + 16} 124 ${x + 15} 141 Z`)).join('') +
      P('M36 226 C34 204 50 196 66 196 C82 196 98 204 96 226 Z') + Z('M52 204 l6 10 M66 200 l6 10 M80 204 l6 10') +
      P('M104 224 C102 208 116 196 132 196 C148 196 162 208 160 224 C152 218 144 214 132 214 C120 214 112 218 104 224 Z') + Z('M118 201 l4 14 M132 197 v17 M146 201 l-4 14') +
      C(180, 210, 14) + Z(ring(180, 210, 5) + ' M172 200 l3 -2 M186 198 l2 3 M190 212 l3 1 M170 216 l-2 3') +
      B(14, 226, 190, 14, 3) +
      B(210, 98, 66, 138, 4) + arch(222, 110, 42, 52) + dot(266, 172, 3) +
      P('M0 240 H300 V300 H0 Z') + Z('M70 240 L60 300 M150 240 V300 M230 240 L240 300') },

    // 42 — ice cream van
    { id: 'a6-ice-cream-van', cat: 'food', name: N('Ice cream van', 'Le camion de glaces', 'El camión de helados', 'Eiswagen', '冰淇淋车'), svg:
      sky() + sun(270, 32, 13) + cloud(220, 70, 0.6) +
      P('M0 196 H300 V300 H0 Z') + P('M0 256 H300 V300 H0 Z') + Z('M20 280 h30 M90 280 h30 M160 280 h30 M230 280 h30') +
      G('134,96 166,96 150,120') + C(150, 86, 15) + C(150, 62, 12) +
      P('M22 250 V186 Q24 166 44 162 L64 160 V128 Q64 118 74 118 H214 Q224 118 224 128 V250 Z') + Z('M64 160 V250 M70 212 q20 -8 40 0 t40 0 t40 0 t34 0') +
      P('M32 186 Q34 172 46 170 H58 V186 Z') + B(86, 142, 104, 50, 4) + Z('M80 192 H196') +
      P('M80 134 H196 V146 Q183 158 170 146 Q157 158 144 146 Q131 158 118 146 Q105 158 92 146 Q86 152 80 146 Z') +
      C(30, 214, 6) + B(14, 236, 22, 12, 4) +
      C(70, 252, 18) + C(186, 252, 18) + dot(70, 252, 5) + dot(186, 252, 5) +
      kid(256, 284, 0.95, { hair: 'bob', dress: 1, armL: [-20, -30], armR: [32, -46], back: () => G('23,-52 41,-52 32,-28') + C(32, -60, 9) }) },

    // 43 — pizza party table
    { id: 'a6-pizza-party', cat: 'food', name: N('Pizza party', 'Fête pizza', 'Fiesta de pizza', 'Pizzaparty', '披萨派对'), svg:
      sky() + Z('M0 24 Q150 64 300 24') +
      [45, 115, 185, 255].map(x => { const t = x / 300, y = f(24 + 80 * t * (1 - t)); return G(`${x - 13},${y} ${x + 13},${y} ${x},${y + 24}`); }).join('') +
      [[40, 96], [74, 76], [262, 92]].map(([x, y]) => E(x, y, 16, 20) + Z(`M${x - 3} ${y + 24} h6 l-3 -4 z M${x} ${y + 24} q-6 14 0 30`)).join('') +
      P('M14 168 H286 L298 300 H2 Z') + Z(ring(40, 250, 4) + ring(100, 276, 4) + ring(160, 252, 4) + ring(220, 278, 4) + ring(270, 248, 4)) +
      G('100,170 126,170 113,134') + C(113, 131, 6) + Z('M106 156 h14 M103 164 h20') +
      P('M178 156 H204 L200 172 H182 Z') + P('M176 157 Q174 144 186 142 Q190 132 196 140 Q206 142 206 157 Z') +
      E(150, 214, 94, 32) + E(150, 210, 80, 27) +
      [0, 60, 120, 180, 240, 300].map(a => { const p = d => f(150 + 70 * Math.cos(d * Math.PI / 180)) + ' ' + f(210 + 22 * Math.sin(d * Math.PI / 180)); return P(`M150 210 L${p(a)} A70 22 0 0 1 ${p(a + 60)} Z`); }).join('') +
      Z('M108 204 m-6 0 a6 4 0 1 0 12 0 a6 4 0 1 0 -12 0 M150 222 m-6 0 a6 4 0 1 0 12 0 a6 4 0 1 0 -12 0 M190 202 m-6 0 a6 4 0 1 0 12 0 a6 4 0 1 0 -12 0 M136 196 m-5 0 a5 3 0 1 0 10 0 a5 3 0 1 0 -10 0') +
      [34, 266].map(x => P(`M${x - 13} 222 H${x + 13} L${x + 10} 258 H${x - 10} Z`) + Z(`M${x + 4} 222 L${x + 10} 204 h6`)).join('') },

    // 44 — butterfly garden
    { id: 'a6-butterfly-garden', cat: 'nature', name: N('Butterfly garden', 'Le jardin des papillons', 'El jardín de mariposas', 'Schmetterlingsgarten', '蝴蝶花园'), svg:
      sky() + sun(258, 40, 15) + cloud(60, 44, 0.7) +
      P('M0 214 Q80 184 160 204 Q230 188 300 206 V300 H0 Z') + P('M0 262 Q150 248 300 262 V300 H0 Z') +
      at(150, 132, 1, () => mir(() => P('M-4 -6 C-14 -42 -58 -58 -68 -30 C-74 -10 -40 0 -6 2 Z') + P('M-6 4 C-36 6 -60 24 -48 44 C-36 58 -12 40 -4 12 Z') + C(-42, -26, 9) + Z(ring(-30, 26, 4) + ring(-18, 12, 3))) +
        cap(0, -24, 0, 40, 12) + C(0, -32, 9) + Z('M-3 -40 Q-8 -54 -16 -56 M3 -40 Q8 -54 16 -56') + dot(-3.5, -33, 1.6) + dot(3.5, -33, 1.6)) +
      butterfly(56, 104, 0.7, -20) + butterfly(250, 120, 0.65, 20) +
      flower(36, 284, 0.9, 5, 1) + flower(106, 290, 0.8, 6, 0) + flower(196, 292, 0.85, 5, 0) + flower(264, 284, 0.9, 6, 1) + tufts([150, 280], [230, 276]) },

    // 45 — waterfall with a rainbow
    { id: 'a6-waterfall-rainbow', cat: 'nature', name: N('Rainbow waterfall', 'La cascade arc-en-ciel', 'La cascada del arcoíris', 'Regenbogen-Wasserfall', '彩虹瀑布'), svg:
      sky() + sun(256, 34, 13) + cloud(70, 38, 0.7) +
      rainbow(150, 164, 122, 14, 3) +
      P('M0 104 Q50 92 108 104 V250 H0 Z') + P('M0 104 Q50 92 108 104 V118 Q50 106 0 118 Z') +
      P('M192 104 Q250 92 300 104 V250 H192 Z') + P('M192 104 Q250 92 300 104 V118 Q250 106 192 118 Z') +
      pine(32, 104, 0.6) + pine(268, 102, 0.55) +
      P('M108 104 H192 V244 H108 Z') + Z('M126 112 q5 20 0 40 q-5 20 0 40 q5 20 0 40 M150 112 q5 20 0 40 q-5 20 0 40 q5 20 0 40 M174 112 q5 20 0 40 q-5 20 0 40 q5 20 0 40') +
      E(150, 258, 116, 26) + cloud(152, 256, 1.15) + rock(46, 264, 0.9) + rock(258, 268, 0.8) +
      duck(214, 270, 0.85) + ripple(80, 276, 26) +
      P('M0 276 Q150 296 300 276 V300 H0 Z') },

    // 46 — camping tent under the stars
    { id: 'a6-camping-tent', cat: 'nature', name: N('Camping night', 'Nuit en camping', 'Noche de acampada', 'Zeltnacht', '星空露营'), svg:
      sky() + P('M248 28 A22 22 0 1 0 248 72 A34 34 0 0 1 248 28 Z') + star(40, 40, 8) + star(130, 30, 7) + star(184, 72, 7) + twinkle(90, 70) + twinkle(290, 110, 4) + twinkle(20, 110, 4) +
      G('0,190 70,112 150,190') + G('120,190 196,100 284,190') +
      P('M0 186 Q150 176 300 186 V300 H0 Z') +
      pine(28, 204, 0.8) + pine(270, 200, 0.7) + pine(238, 214, 0.55) +
      G('70,262 140,150 210,262') + G('112,262 140,190 168,262') + C(140, 236, 14) + eye(135, 236, 2.4) + eye(145, 236, 2.4) + smile(140, 242, 3) +
      P('M126 230 C126 214 154 214 154 230 Z') + P('M140 190 L168 262 H190 Q172 232 140 190 Z') + Z('M140 150 V140 M70 262 L52 276 M210 262 L228 276') +
      P('M224 226 H244 L240 222 H228 Z') + Z('M228 222 Q234 210 240 222') + B(222, 226, 24, 26, 3) + Z('M234 248 q-4 -6 0 -12 q4 6 0 12') + B(218, 250, 32, 12, 3) +
      B(22, 268, 62, 18, 9) + Z(ring(76, 277, 5)) + dot(110, 120, 1.8) + dot(176, 140, 1.8) + dot(60, 150, 1.8) },

    // 47 — football match
    { id: 'a6-football-match', cat: 'hobbies', name: N('Football match', 'Match de foot', 'Partido de fútbol', 'Fußballspiel', '足球比赛'), svg:
      sky() + sun(150, 42, 15) + B(0, 92, 300, 60) + Z([14, 36, 58, 80, 102, 124, 146, 168, 190, 212, 234, 256, 278].map((v, i) => ring(v + (i % 2) * 5, 110, 5) + ring(v + 8, 132, 5)).join(' ')) +
      P('M0 152 H300 V300 H0 Z') + Z('M0 252 Q150 232 300 252 M150 152 V172') +
      B(184, 118, 94, 80) + Z('M200 118 V198 M216 118 V198 M232 118 V198 M248 118 V198 M264 118 V198 M184 136 H278 M184 156 H278 M184 176 H278') +
      G('174,108 288,108 288,198 278,198 278,118 184,118 184,198 174,198') +
      Z('M24 196 V150') + G('24,150 44,156 24,162') +
      kid(230, 226, 0.85, { hair: 'short', armL: [-26, -84], armR: [26, -84] }) +
      kid(86, 278, 1.1, { hair: 'pony', armL: [-24, -40], armR: [22, -32] }) +
      C(126, 270, 13) + `<polygon points="126,264 131,268 129,274 123,274 121,268" fill="${INK}"/>` + Z('M126 264 V257 M131 268 L138 266 M129 274 L133 280 M123 274 L119 280 M121 268 L114 266') },

    // 48 — music band (animal friends)
    { id: 'a6-music-band', cat: 'hobbies', name: N('Music band', 'Le groupe de musique', 'La banda de música', 'Musikband', '小乐队'), svg:
      sky() + Z('M36 0 q6 113 0 226 M100 0 q6 113 0 226 M200 0 q6 113 0 226 M264 0 q6 113 0 226') +
      G('62,0 86,0 128,226 20,226') + G('214,0 238,0 280,226 172,226') +
      P('M0 226 H300 V300 H0 Z') + Z('M0 238 H300') +
      C(128, 124, 9) + C(172, 124, 9) + E(150, 188, 30, 26) + C(150, 146, 24) + E(150, 157, 11, 8) +
      nose(150, 152) + eye(141, 141, 3.2) + eye(159, 141, 3.2) + Z('M146 162 q4 3 8 0 M128 178 L104 166 M172 178 L198 152') +
      Z('M109 190 V226 M200 160 V226 M192 226 H208') + B(92, 170, 34, 20, 4) + Z('M92 178 H126') + E(200, 156, 20, 6) +
      C(150, 212, 30) + C(150, 212, 13) + Z('M150 205 l2 5 h5 l-4 3 l2 5 l-5 -3 l-5 3 l2 -5 l-4 -3 h5 z') +
      bunny(58, 284, 0.95, { feet: 0 }) +
      at(60, 256, 0.95, () => P('M10 -4.5 H42 V-7 H54 V7 H42 V4.5 H10 Z') + P('M-20 0 C-20 -12 -10 -14 -4 -9 C2 -14 12 -12 12 0 C12 12 2 14 -4 9 C-10 14 -20 12 -20 0 Z') + Z(ring(-4, 0, 4) + ' M-14 0 H52'), 0, -30) +
      cat(252, 284, 0.95, 1) + Z('M210 216 V284 M200 284 H220') + C(210, 208, 7) + Z('M205 206 h10 M205 210 h10') +
      [[104, 104], [190, 92], [244, 130], [56, 150]].map(([x, y]) => ink(`M${x - 5} ${y} a5 4 0 1 0 10 0 a5 4 0 1 0 -10 0`) + Z(`M${x + 5} ${y} V${y - 18} l8 4`)).join('') },

    // 49 — bike ride in the park
    { id: 'a6-bike-ride', cat: 'hobbies', name: N('Bike ride', 'Balade à vélo', 'Paseo en bici', 'Fahrradtour', '骑自行车'), svg:
      sky() + sun(256, 38, 15) + cloud(74, 42, 0.7) +
      P('M0 180 Q90 150 180 172 Q240 158 300 168 V300 H0 Z') + tree(40, 198, 1) + tree(262, 192, 0.9) +
      P('M0 214 Q150 202 300 214 V300 H0 Z') + P('M0 268 Q150 248 300 264 V292 Q150 276 0 298 Z') +
      flower(30, 252, 0.7, 5, 0) + flower(268, 246, 0.7, 6, 0) +
      at(146, 274, 1.1, () =>
        C(-38, -24, 24) + C(40, -24, 24) + Z('M-38 -46 V-2 M-60 -24 H-16 M40 -46 V-2 M18 -24 H62') + dot(-38, -24, 3.5) + dot(40, -24, 3.5) +
        G('-38,-24 -12,-60 0,-24') + G('-12,-60 30,-62 0,-24') + cap(30, -62, 40, -24, 8) + Z('M30 -62 L31 -74') + cap(22, -74, 40, -77, 8) +
        P('M-26 -64 Q-22 -88 -12 -104 H12 Q14 -84 8 -62 Z') + cap(-12, -68, 14, -50, 12) + cap(14, -50, 6, -28, 11) + E(10, -24, 9, 6) +
        C(4, -116, 15) + eye(1, -116, 2.4) + eye(11, -116, 2.4) + smile(7, -110, 3) +
        P('M-12 -118 C-12 -139 20 -139 20 -118 Q4 -124 -12 -118 Z') + Z('M0 -134 v6 M8 -134 v6') +
        cap(4, -98, 30, -78, 9) + C(31, -77, 6)) },

    // 50 — friendly Halloween house with pumpkins
    { id: 'a6-halloween-house', cat: 'holidays', name: N('Halloween house', 'La maison d’Halloween', 'La casa de Halloween', 'Halloween-Haus', '万圣节小屋'), svg:
      sky() + C(242, 56, 30) + shut(232, 52, 4.5) + shut(252, 52, 4.5) + smile(242, 64, 5) +
      star(40, 36, 8) + star(130, 24, 7) + twinkle(190, 60) + twinkle(20, 120, 4) + twinkle(290, 130, 4) +
      P('M0 236 Q150 220 300 236 V300 H0 Z') +
      B(170, 96, 18, 40) + G('72,150 140,90 208,150') + B(84, 146, 112, 92) + C(140, 124, 10) + Z('M140 114 V134 M130 124 H150') +
      arch(124, 190, 32, 48) + dot(150, 216) + arch(96, 164, 22, 24) + arch(162, 164, 22, 24) + Z('M107 164 V188 M96 178 H118 M173 164 V188 M162 178 H184') +
      G('128,238 152,238 168,300 112,300') +
      cat(36, 238, 0.62) + pumpkin(90, 286, 1) + pumpkin(228, 284, 1.2) + pumpkin(274, 292, 0.75) },

    // 51 — winter village with a snowman
    { id: 'a6-winter-village', cat: 'holidays', name: N('Winter village', 'Le village en hiver', 'El pueblo en invierno', 'Winterdorf', '冬日小镇'), svg:
      sky() + cloud(60, 40, 0.8) + cloud(210, 30, 0.6) +
      Z([[120, 30], [160, 70], [270, 70], [30, 100], [100, 90], [290, 20]].map(([x, y]) => `M${x - 5} ${y} h10 M${x} ${y - 5} v10 M${x - 3.5} ${y - 3.5} l7 7 M${x + 3.5} ${y - 3.5} l-7 7`).join(' ')) +
      P('M0 170 Q80 136 170 160 Q240 140 300 156 V300 H0 Z') +
      B(26, 150, 74, 60) + P('M16 154 L63 110 L110 154 Q101 162 92 155 Q82 163 72 155 Q61 163 50 155 Q40 163 30 155 Q22 160 16 154 Z') + B(54, 178, 20, 32) + B(32, 164, 16, 14) +
      B(204, 140, 74, 66) + P('M194 144 L241 100 L288 144 Q279 152 270 145 Q260 153 250 145 Q239 153 228 145 Q218 153 208 145 Q200 150 194 144 Z') + B(232, 170, 20, 36) + B(256, 154, 16, 14) +
      pine(132, 182, 0.75) + pine(172, 192, 0.6) +
      P('M0 214 Q150 200 300 214 V300 H0 Z') +
      Z('M122 250 L96 232 M100 235 l-8 -2 M178 250 L204 232 M200 235 l8 -2') +
      C(150, 258, 30) + C(150, 208, 22) + P('M128 192 H172 V186 H164 V160 H136 V186 H128 Z') + Z('M136 178 H164') +
      eye(143, 202, 2.8) + eye(157, 202, 2.8) + G('150,204 170,209 150,214') + dot(142, 218, 1.6) + dot(150, 221, 1.6) + dot(158, 218, 1.6) +
      P('M132 224 Q150 234 168 224 L170 234 Q150 244 130 234 Z M156 236 L162 258 L172 254 L166 234 Z') + dot(150, 252, 2.6) + dot(150, 266, 2.6) +
      P('M222 268 H276 V280 H222 Z') + Z('M216 290 H280 q8 0 8 -8 M232 280 V290 M266 280 V290') },

    // 52 — lantern festival
    { id: 'a6-lantern-festival', cat: 'holidays', name: N('Lantern festival', 'La fête des lanternes', 'El festival de faroles', 'Laternenfest', '灯笼节'), svg:
      sky() + C(262, 112, 20) + Z(ring(256, 106, 4) + ring(268, 118, 3)) + twinkle(40, 24) + twinkle(130, 22, 4) + twinkle(160, 110, 4) + twinkle(290, 160, 4) +
      P('M0 196 L14 176 H96 L112 196 Z') + B(6, 196, 98, 48) + Z('M24 210 h14 v14 h-14 z M70 210 h14 v14 h-14 z') +
      P('M188 190 L204 170 H286 L300 190 Z') + B(196, 190, 104, 54) + Z('M218 204 h14 v14 h-14 z M262 204 h14 v14 h-14 z') +
      P('M0 244 H300 V300 H0 Z') + Z('M0 34 Q150 94 300 34') +
      [75, 150, 225].map(x => { const y = f(34 + 120 * (x / 300) * (1 - x / 300)); return Z(`M${x} ${y} V${y + 6} M${x} ${y + 46} V${y + 58}`) + E(x, y + 26, 18, 15) +
        Z(`M${x} ${y + 12} V${y + 40} M${x - 9} ${y + 13} Q${x - 15} ${y + 26} ${x - 9} ${y + 39} M${x + 9} ${y + 13} Q${x + 15} ${y + 26} ${x + 9} ${y + 39}`) +
        P(`M${x - 9} ${y + 5} H${x + 9} V${y + 13} H${x - 9} Z M${x - 9} ${y + 39} H${x + 9} V${y + 47} H${x - 9} Z`); }).join('') +
      [[44, 128], [110, 152], [204, 128]].map(([x, y]) => at(x, y, 1, () => P('M-11 -14 H11 L15 12 H-15 Z') + Z('M0 6 q-4 -5 0 -10 q4 5 0 10'))).join('') +
      kid(150, 290, 1.05, { hair: 'bun', dress: 1, armL: [-20, -30], armR: [26, -58],
        back: () => Z('M26 -58 L40 -90 V-82') + E(40, -70, 10, 12) + Z('M33 -70 h14 M40 -58 v6') }) },

    // 53 — flower mandala
    { id: 'a6-flower-mandala', cat: 'patterns', name: N('Flower mandala', 'Mandala fleur', 'Mandala de flores', 'Blumen-Mandala', '花朵曼陀罗'), svg:
      sky() + [0, 45, 90, 135, 180, 225, 270, 315].map(a => petal(150, 150, a, 96, 134, 13)).join('') +
      [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(a => petal(150, 150, a, 28, 116, 30)).join('') +
      [0, 45, 90, 135, 180, 225, 270, 315].map(a => petal(150, 150, a, 16, 68, 15)).join('') +
      C(150, 150, 18) + Z(ring(150, 150, 8) + [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(a => { const r = a * Math.PI / 180; return ring(f(150 + 130 * Math.cos(r)), f(150 + 130 * Math.sin(r)), 4); }).join(' ')) }
  ]);
})();
