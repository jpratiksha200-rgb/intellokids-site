/* Colouring pictures for age 8: detailed scenes with pattern areas, 30â€“55 parts, stroke 2.5.
   Format: see Colouring.addPack in js/colouring.js. Regions = data-r fill="#fff"; decorations = INK or fill="none".
   The first 3 pictures are the ones open while IK_CONFIG.limits applies (one of them is an animal). Original art only.
   Drawn in two parts (each PART has its own helpers); display order = part A's first 3, then B and A interleaved.
   Once shipped, never reorder or insert regions inside a picture (saved drawings are index-based); add new pictures at the end. */
(function () {
  const INK = '#1F3A44';
  const parts = [];
  const PART = f => { parts.push(f()); };

  /* IntelloKids colouring – age 8, part A */
  PART(function () {
  const INK = '#1F3A44';
  const SW = 2.5;
  const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
  const R = `data-r fill="#fff" ${L}`;
  const T = `fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"`;
  const PI = Math.PI, cos = Math.cos, sin = Math.sin, sq = Math.sqrt, abs = Math.abs;
  const n1 = v => Math.round(v * 10) / 10;
  const xy = p => n1(p[0]) + ' ' + n1(p[1]);
  const pd = ps => 'M' + ps.map(xy).join(' L') + ' Z';
  const P = d => `<path ${R} d="${d}"/>`;
  const PP = ps => P(pd(ps));
  const C = (x, y, r) => `<circle ${R} cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}"/>`;
  const E = (x, y, rx, ry, a) => `<ellipse ${R} cx="${n1(x)}" cy="${n1(y)}" rx="${n1(rx)}" ry="${n1(ry)}"${a ? ` transform="rotate(${a} ${n1(x)} ${n1(y)})"` : ''}/>`;
  const B = (x, y, w, h, r) => `<rect ${R} x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}"${r ? ` rx="${r}"` : ''}/>`;
  const RING = (x, y, a, b) => `<path ${R} fill-rule="evenodd" d="${pd(ell(x, y, a, a, 36))} ${pd(ell(x, y, b, b, 32))}"/>`;
  const FR = B(10, 10, 280, 280, 18);
  const BOT = 'V272 Q290 290 272 290 H28 Q10 290 10 272 Z';
  const gnd = (a, m, b) => P(`M10 ${a} Q150 ${m} 290 ${b} ${BOT}`);
  const D = d => `<path ${T} d="${d}"/>`;
  const K = d => `<path fill="${INK}" d="${d}"/>`;
  const dot = (x, y, r = 2) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" fill="${INK}"/>`;
  const ke = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${INK}"/>`;
  const eye = (x, y, r = 3.5) => dot(x, y, r) + `<circle cx="${n1(x + r * 0.35)}" cy="${n1(y - r * 0.4)}" r="${n1(r * 0.38)}" fill="#fff"/>`;
  const smile = (x, y, w = 4) => D(`M${n1(x - w)} ${n1(y)} q${n1(w)} ${n1(w * 0.9)} ${n1(2 * w)} 0`);
  const face = (x, y, r) => eye(x - r * 0.38, y, r * 0.14) + eye(x + r * 0.38, y, r * 0.14) + smile(x, y + r * 0.36, r * 0.2);
  const sparkle = (x, y, r) => K(`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`);
  const rays = (x, y, r) => D(each([0, 1, 2, 3, 4, 5, 6, 7], i => { const a = i * PI / 4; return `M${xy([x + r * cos(a), y + r * sin(a)])} L${xy([x + (r + 6) * cos(a), y + (r + 6) * sin(a)])}`; }));
  const tp = (d, x, y, k = 1, a = 0) => { const c = cos(a), s = sin(a); return d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (m, u, v) => xy([x + k * (u * c - v * s), y + k * (u * s + v * c)])); };
  const mir = (d, cx) => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (m, u, v) => n1(2 * cx - u) + ' ' + v);
  const P2 = (d, cx) => P(d) + P(mir(d, cx));
  const each = (list, f) => list.map(f).join('');
  const star = (cx, cy, ro, ri, n, a0 = -PI / 2) => { const o = []; for (let i = 0; i < n * 2; i++) { const a = a0 + PI * i / n, r = i % 2 ? ri : ro; o.push([cx + r * cos(a), cy + r * sin(a)]); } return pd(o); };
  const heart = (x, y, s) => tp('M0 0.85 C-1.3 -0.05 -0.75 -1.05 0 -0.35 C0.75 -1.05 1.3 -0.05 0 0.85 Z', x, y, s);
  const cloud = (x, y, s) => P(tp('M0 0 Q-4 -26 22 -28 Q28 -50 54 -44 Q76 -56 88 -32 Q110 -30 106 0 Z', x, y, s));
  const fluff = (cx, cy, rx, ry, n, k = 0.14, a0 = 0) => {
  const p = (i, f = 1) => { const a = a0 + 2 * PI * i / n; return xy([cx + rx * f * cos(a), cy + ry * f * sin(a)]); };
  let d = 'M' + p(0);
  for (let i = 0; i < n; i++) d += ` Q${p(i + 0.5, 1 + k)} ${p(i + 1)}`;
  return d + ' Z';
  };
  const flower = (cx, cy, r, n, a0 = -PI / 2) => {
  const h = sin(PI / n), rho = r / (cos(PI / n) + 1.72 * h), ar = n1(1.15 * rho * h);
  const p = i => { const a = a0 + 2 * PI * (i + 0.5) / n; return xy([cx + rho * cos(a), cy + rho * sin(a)]); };
  let d = 'M' + p(0);
  for (let i = 1; i <= n; i++) d += ` A${ar} ${ar} 0 1 1 ${p(i)}`;
  return d + ' Z';
  };
  const fl = (x, y, r, n) => P(flower(x, y, r, n)) + C(x, y, r * 0.45);
  const leaf = (x, y, l, w, a) => { const q = (u, v) => tp(`${u} ${v}`, x, y, 1, a * PI / 180); return P(`M${q(-l, 0)} Q${q(0, -w)} ${q(l, 0)} Q${q(0, w)} ${q(-l, 0)} Z`) + D(`M${q(-l * 0.8, 0)} L${q(l * 0.7, 0)}`); };
  const maple = (x, y, r, a = 0) => {
  const A = [0, 32, 62, 100, 132, 158, 180], Rr = [1, 0.42, 0.92, 0.45, 0.62, 0.32, 0.22], o = [];
  for (let i = 0; i < 7; i++) o.push([Rr[i] * sin(A[i] * PI / 180), -Rr[i] * cos(A[i] * PI / 180)]);
  for (let i = 5; i > 0; i--) o.push([-o[i][0], o[i][1]]);
  const c = cos(a * PI / 180), s = sin(a * PI / 180);
  return PP(o.map(([u, v]) => [x + r * (u * c - v * s), y + r * (u * s + v * c)])) + D(tp('M0 0.22 L0 0.7 M0 0.22 L0 -0.6 M0 0 L0.5 -0.5 M0 0 L-0.5 -0.5', x, y, r, a * PI / 180));
  };
  const coin = (x, y, r = 9) => C(x, y, r) + D(`M${n1(x - r * 0.45)} ${n1(y - r * 0.2)} q${n1(r * 0.45)} ${n1(-r * 0.45)} ${n1(r * 0.9)} 0`);
  const bubble = (x, y, r) => C(x, y, r) + D(`M${n1(x - r * 0.55)} ${n1(y - r * 0.1)} q${n1(r * 0.1)} ${n1(-r * 0.45)} ${n1(r * 0.5)} ${n1(-r * 0.5)}`);
  const lantern = x => B(x - 8, 20, 16, 8, 2) + E(x, 52, 20, 24) + B(x - 8, 76, 16, 8, 2) + D(`M${x} 84 V100 M${x - 4} 100 h8 M${x - 10} 40 Q${x} 52 ${x - 10} 64 M${x + 10} 40 Q${x} 52 ${x + 10} 64`);
  const HAIR = {
  L: 'M0 -27 C-28 -27 -32 -3 -26 13 C-36 25 -42 45 -34 59 C-28 69 -14 67 -8 57 L8 57 C14 67 28 65 32 55 C38 39 34 23 26 11 C30 -5 26 -27 0 -27 Z',
  B: 'M0 -25 C-27 -25 -30 -4 -27 13 Q-26 23 -16 23 L16 23 Q26 23 27 13 C30 -4 27 -25 0 -25 Z',
  P: 'M6 -22 Q36 -32 42 -6 Q46 14 32 30 Q34 10 24 -2 Q18 -12 6 -12 Z',
  F: 'M-20 0 C-23 -20 -8 -24 0 -24 C10 -24 23 -20 20 0 C15 -8 8 -13 4 -14 C2 -7 -6 -4 -13 -8 C-15 -4 -17 -2 -20 0 Z',
  S: 'M-20 1 C-24 -21 -4 -26 4 -22 C18 -20 24 -10 20 3 C16 -6 9 -10 3 -11 C-2 -3 -11 0 -20 1 Z',
  T: 'M-13 -22 L-14 -38 L-6 -32 L0 -43 L6 -32 L14 -38 L13 -22 Q0 -26 -13 -22 Z',
  K: 'M-14 -17 L-18 -33 L-8 -26 L0 -38 L8 -26 L18 -33 L14 -17 Q0 -21 -14 -17 Z'
  };
  const hair = (x, y, r, c) => P(tp(HAIR[c], x, y, r / 20));
  const kid = (x, y, r, st = 'F') => {
  const k = r / 20;
  let s = st.includes('U') ? C(x - 17 * k, y - 17 * k, 9 * k) + C(x + 17 * k, y - 17 * k, 9 * k) : '';
  s += C(x, y, r);
  for (const c of 'FSTK') if (st.includes(c)) s += hair(x, y, r, c);
  return s + face(x, y + 3 * k, r);
  };
  const qp = (a, b, c, t) => { const u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]; };
  const qb = (a, b, c, n = 12) => range(0, n, 1).map(i => qp(a, b, c, i / n));
  const bunting = (a, b, c, ts, h = 20) => D(`M${xy(a)} Q${xy(b)} ${xy(c)}`) + each(ts, t => { const [x, y] = qp(a, b, c, t); return PP([[x - h / 2, y - 1], [x + h / 2, y + 1], [x, y + h]]); });
  const ell = (cx, cy, rx, ry, n = 40, a0 = 0) => { const o = []; for (let i = 0; i < n; i++) { const a = a0 + 2 * PI * i / n; o.push([cx + rx * cos(a), cy + ry * sin(a)]); } return o; };
  const range = (a, b, st) => { const o = []; for (let v = a; v <= b + 1e-6; v += st) o.push(v); return o; };
  const area = ps => { let a = 0; ps.forEach((p, i) => { const q = ps[(i + 1) % ps.length]; a += p[0] * q[1] - q[0] * p[1]; }); return abs(a / 2); };
  const cut = (ps, nx, ny, k) => {
  const o = [];
  ps.forEach((a, i) => {
  const b = ps[(i + 1) % ps.length], da = nx * a[0] + ny * a[1] - k, db = nx * b[0] + ny * b[1] - k;
  if (da >= 0) o.push(a);
  if ((da >= 0) !== (db >= 0)) { const t = da / (da - db); o.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  });
  return o;
  };
  const clipF = ps => cut(cut(cut(cut(ps, 1, 0, 10), -1, 0, -290), 0, 1, 10), 0, -1, -290);
  const side = (ps, p, q, k) => { const nx = q[1] - p[1], ny = p[0] - q[0], c = nx * p[0] + ny * p[1]; return nx * k[0] + ny * k[1] >= c ? cut(ps, nx, ny, c) : cut(ps, -nx, -ny, -c); };
  const band = (ps, nx, ny, k0, k1) => cut(cut(ps, nx, ny, k0), -nx, -ny, -k1);
  const bandsA = (ps, nx, ny, ks, minA = 120) => {
  const k = ks.slice();
  for (let it = 0; it < 40; it++) {
  const bs = k.slice(1).map((v, i) => band(ps, nx, ny, k[i], v));
  const i = bs.findIndex(b => area(b) < minA);
  if (i < 0 || k.length <= 2) return bs.filter(b => b.length > 2);
  k.splice(i === 0 ? 1 : i, 1);
  }
  return [];
  };
  const stripes = (ps, nx, ny, ks, minA) => each(bandsA(ps, nx, ny, ks, minA), PP);
  const tube = (a, b, c, d, w) => (t, s) => {
  const u = 1 - t, f = (i, j) => u * u * u * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t * t * t * d[i];
  const g = i => 3 * u * u * (b[i] - a[i]) + 6 * u * t * (c[i] - b[i]) + 3 * t * t * (d[i] - c[i]);
  const dx = g(0), dy = g(1), l = Math.hypot(dx, dy) || 1, ww = typeof w === 'function' ? w(t) : w;
  return [f(0) - dy / l * s * ww, f(1) + dx / l * s * ww];
  };
  const cellF = (m, fa, fb, s0, s1, n = 8) => {
  const o = [];
  for (let i = 0; i <= n; i++) { const s = s0 + (s1 - s0) * i / n; o.push(m(fa(s), s)); }
  for (let i = 1; i < n; i++) o.push(m(fa(s1) + (fb(s1) - fa(s1)) * i / n, s1));
  for (let i = 0; i <= n; i++) { const s = s1 - (s1 - s0) * i / n; o.push(m(fb(s), s)); }
  for (let i = 1; i < n; i++) o.push(m(fb(s0) + (fa(s0) - fb(s0)) * i / n, s0));
  return o;
  };
  const cellTS = (m, t0, t1, s0, s1, n) => cellF(m, () => t0, () => t1, s0, s1, n);
  const tubeStripes = (m, ts) => each(ts.slice(1), (t, i) => PP(cellTS(m, ts[i], t, -1, 1, 6)));
  const scales = (m, ts, cols, h = 0.04) => {
  let s = '';
  ts.slice(1).forEach((t1, i) => {
  const t0 = ts[i], bump = (sv, on) => on ? h * abs(sin(PI * (sv + 1) * cols / 2)) : 0;
  const n = i < ts.length - 2 ? cols : 1;
  for (let c = 0; c < n; c++) s += PP(cellF(m, sv => t0 + bump(sv, i > 0), sv => t1 + bump(sv, i < ts.length - 2), -1 + 2 * c / n, -1 + 2 * (c + 1) / n));
  });
  return s;
  };
  const limbPts = (a, k, b, w) => {
  const c = [2 * k[0] - (a[0] + b[0]) / 2, 2 * k[1] - (a[1] + b[1]) / 2];
  const at = t => { const u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]; };
  const tg = t => { const u = 1 - t, dx = 2 * u * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), dy = 2 * u * (c[1] - a[1]) + 2 * t * (b[1] - c[1]), l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  const Ls = [], Rs = [];
  for (let i = 0; i <= 12; i++) { const p = at(i / 12), g = tg(i / 12); Ls.push([p[0] - g[1] * w, p[1] + g[0] * w]); Rs.push([p[0] + g[1] * w, p[1] - g[0] * w]); }
  const cap = (p, g, sg) => { const o = []; for (let j = 1; j < 8; j++) { const an = PI * j / 8; o.push([p[0] + w * sg * (-g[1] * cos(an) + g[0] * sin(an)), p[1] + w * sg * (g[0] * cos(an) + g[1] * sin(an))]); } return o; };
  return [...Ls, ...cap(b, tg(1), 1), ...Rs.reverse(), ...cap(a, tg(0), -1)];
  };
  const limb = (a, k, b, w) => PP(limbPts(a, k, b, w));
  const vsplit = (x0, x1, top, bot, curves, n = 56) => {
  const xs = []; for (let i = 0; i <= n; i++) xs.push(x0 + (x1 - x0) * (1 - cos(PI * i / n)) / 2);
  const ln = [top, ...curves.map(f => x => Math.min(bot(x), Math.max(top(x), f(x)))), bot], out = [];
  for (let k = 0; k < ln.length - 1; k++) {
  const th = xs.map(x => ln[k + 1](x) - ln[k](x) > 0.05);
  let i0 = th.indexOf(true), i1 = th.lastIndexOf(true);
  if (i0 < 0) continue;
  const xx = xs.slice(Math.max(0, i0 - 1), Math.min(n, i1 + 1) + 1);
  out.push([...xx.map(x => [x, ln[k](x)]), ...xx.slice().reverse().map(x => [x, ln[k + 1](x)])]);
  }
  return out;
  };
  const fBot = x => { const d = x < 28 ? 28 - x : x > 272 ? x - 272 : 0; return 272 + sq(Math.max(0, 324 - d * d)); };
  const scl = (x, y0, h, w, off = 0) => y0 + h * abs(sin(PI * (x - off) / w)); // scallop row
  const rot = (a, cx, cy, inner) => `<g transform="rotate(${a} ${cx} ${cy})">${inner}</g>`;
  const sg = (cx, cy, s, a, inner, dx = 0, dy = 0, fx = 1) => `<g transform="translate(${dx} ${dy}) rotate(${a} ${cx} ${cy}) translate(${cx} ${cy}) scale(${s * fx} ${s}) translate(${-cx} ${-cy})">${inner.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${Math.round(w / s * 100) / 100}"`)}</g>`;
  // 1. Princess ballroom
  const ballroom = () => {
  let s = B(10, 10, 280, 194);
  const ys = [202, 242, 290], X = (xt, y) => 150 + (xt - 150) * (y - 30) / 172;
  for (let r = 0; r < 2; r++) for (let c = -2; c < 2; c++) {
  const a = 150 + c * 70, b = a + 70, q = cut(cut([[X(a, ys[r]), ys[r]], [X(b, ys[r]), ys[r]], [X(b, ys[r + 1]), ys[r + 1]], [X(a, ys[r + 1]), ys[r + 1]]], 1, 0, 10), -1, 0, -290);
  if (q.length > 2 && (r || c + 1)) s += PP(q);
  }
  s += each([52, 204], x => P(`M${x} 184 V84 A22 22 0 0 1 ${x + 44} 84 V184 Z`) + D(`M${x + 10} 104 l12 -12 M${x + 10} 116 l20 -20`));
  const dr = 'M10 10 L66 10 C60 50 46 84 30 110 C40 140 48 170 52 204 L10 204 Z', dd = 'M20 30 Q24 70 18 100 M36 22 Q38 50 32 80 M22 136 Q28 166 28 198';
  s += P2(dr, 150) + D(dd + mir(dd, 150));
  s += D('M150 10 V22 M126 48 Q112 46 110 32 M174 48 Q188 46 190 32');
  s += B(104, 24, 12, 13, 2) + B(144, 18, 12, 16, 2) + B(184, 24, 12, 13, 2);
  s += P('M118 36 L182 36 Q180 58 150 62 Q120 58 118 36 Z') + D('M126 45 H174') + dot(150, 53, 2.4);
  s += each([[110, 18], [150, 12], [190, 18]], ([x, y]) => P(tp('M0 -10 Q12 2 0 5 Q-12 2 0 -10 Z', x, y)));
  s += D('M150 62 v6') + sparkle(150, 74, 6) + sparkle(98, 50, 6) + sparkle(206, 48, 5) + sparkle(166, 98, 4) + sparkle(30, 160, 4);
  s += P2('M190 240 L207 240 L207 262 Q207 270 199 270 L184 270 Q177 270 180 264 Q183 259 190 257 Z', 208);
  s += B(191, 188, 15, 56, 3) + B(210, 188, 15, 56, 3);
  s += limb([227, 122], [244, 142], [232, 162], 5.5);
  s += P('M189 114 Q208 108 227 114 L232 190 Q208 196 184 190 Z');
  s += PP([[190, 117], [189, 131], [230.6, 176], [230.1, 160]]);
  s += P('M201 111.5 L208 130 L215 111.5 Q208 109 201 111.5 Z') + dot(201, 146, 1.6) + dot(210, 186, 1.6) + dot(201, 176, 1.6);
  s += P2('M177 126 Q175 103 199 109 L198 126 Z', 208) + D('M181 125 v5 M187 125 v5 M193 125 v5 M223 125 v5 M229 125 v5 M235 125 v5');
  s += limb([188, 121], [172, 126], [154, 112], 5.5);
  s += kid(208, 91, 18, 'SK');
  const cx = 98;
  s += hair(98, 99, 19, 'L') + D('M68 140 q6 -4 4 -12 M126 138 q-5 -4 -3 -12');
  const sTop = x => { const d = abs(x - cx); return d <= 10 ? 148 : 148 + 124 * Math.pow(Math.min(1, (d - 10) / 70), 1.7); };
  vsplit(18, 178, sTop, x => scl(x, 272, 7, 20, 18), [x => scl(x, 190, 7, 20, 88), x => scl(x, 232, 7, 20, 98)]).forEach(q => { s += PP(q); });
  s += each([54, 98, 142], x => P(heart(x, 253, 8.5))) + sparkle(77, 212, 4) + sparkle(119, 212, 4);
  s += P('M86 120 Q98 126 110 120 L105 150 L91 150 Z') + B(87, 145, 22, 9, 4.5);
  s += limb([83, 128], [72, 144], [68, 164], 4.8) + limb([113, 128], [132, 124], [150, 112], 4.8);
  s += C(85, 124, 8.5) + C(111, 124, 8.5) + kid(98, 99, 19, 'FT');
  s += C(152, 111, 6.5) + P(heart(152, 144, 10));
  s += D('M16 256 q-4 -12 6 -24 M24 278 q-8 -6 -6 -16 M186 252 q8 -10 2 -22');
  return s;
  };
  // 2. Highland cow
  const cow = () => {
  let s = FR + C(252, 46, 19) + rays(252, 46, 24) + cloud(150, 54, 0.62) + cloud(24, 58, 0.5);
  s += P('M10 156 L50 104 L104 156 Z') + P('M35 123.5 L50 104 L65 123.5 L57.5 119 L50 128 L42.5 119 Z');
  s += P('M150 156 L232 92 L290 136 L290 156 Z') + P('M212 107.6 L232 92 L252 107.6 L243 104 L232 114 L221 104 Z');
  s += P('M10 148 Q80 134 150 148 Q220 136 290 148 ' + BOT) + gnd(222, 204, 222);
  s += each([[232, 196, 22], [258, 192, 20], [98, 200, 22], [128, 200, 22]], ([x, y, w]) => B(x, y, w, 260 - y, 7) + B(x - 2, 250, w + 4, 15, 6));
  s += limb([270, 160], [284, 178], [282, 206], 4.6) + P(fluff(282, 214, 8, 11, 7, 0.25));
  const q = x => sq(Math.max(0, 1 - ((x - 196) / 80) ** 2));
  vsplit(116, 276, x => 166 - 50 * q(x) - 3 * q(x) * abs(sin(PI * (x - 196) / 13)), x => 166 + 50 * q(x) + 6 * Math.min(1, 3 * q(x)) * abs(sin(PI * (x - 196) / 14)),
  [x => scl(x, 148, 7, 16), x => scl(x, 180, 7, 16, 8)]).forEach(p => { s += PP(p); });
  s += P2('M86 106 C62 108 42 98 36 72 C48 96 60 122 86 124 Z', 112);
  s += E(68, 132, 17, 8.5, 22) + E(156, 132, 17, 8.5, -22) + E(69, 132, 9.5, 4.4, 22) + E(155, 132, 9.5, 4.4, -22);
  s += P('M82 118 Q78 170 92 198 L132 198 Q146 170 142 118 Z') + eye(98, 171, 4.6) + eye(126, 171, 4.6);
  s += E(112, 199, 31, 19) + ke(100, 197, 3.6, 5.4) + ke(124, 197, 3.6, 5.4) + smile(112, 208, 6);
  s += P2('M102 85 C86 80 72 92 76 108 C68 118 72 132 80 140 Q82 148 86 153 Q88 145 92.5 142 Q95 152 99 161 Q101 152 105.5 148 Q96 116 102 85 Z', 112);
  s += P('M102 85 Q112 80 122 85 Q128 116 118.5 148 Q115 156 112 165 Q109 156 105.5 148 Q96 116 102 85 Z');
  s += D('M86 106 q-4 12 2 24 M138 106 q4 12 -2 24 M112 96 q-4 14 0 30');
  s += fl(34, 254, 16, 8) + fl(74, 276, 12, 6) + fl(188, 274, 13, 5) + fl(272, 276, 12, 6);
  s += E(30, 186, 10, 13, -30) + E(48, 186, 10, 13, 30) + D('M39 178 v18 M37 178 q-4 -8 -8 -8 M41 178 q4 -8 8 -8');
  s += D('M54 234 q4 -8 2 -14 M62 236 q-2 -6 2 -10 M160 240 q2 -8 -2 -12 M224 278 q2 -6 -2 -10 M282 236 q-2 -6 2 -10');
  return s;
  };
  // 3. BMX jump
  const bmx = () => {
  let s = FR + C(262, 42, 16) + rays(262, 42, 21) + cloud(118, 66, 0.55) + cloud(30, 120, 0.6);
  s += bunting([10, 28], [60, 56], [116, 22], [0.16, 0.38, 0.6, 0.82]);
  s += P('M10 206 Q60 182 120 198 Q190 172 290 196 ' + BOT);
  const ramp = (x0, x1, f, bot, n, ks, mA) => {
  const xs = range(x0, x1, (x1 - x0) / 20), top = xs.map(x => [x, f(x) + 8]);
  return PP([...xs.map(x => [x, f(x)]), ...top.slice().reverse()]) + stripes(cut([...top, ...bot], 0, -1, -257), n, 0.75, ks, mA);
  };
  s += ramp(12, 118, x => 248 - 64 * ((x - 12) / 106) ** 2, [[118, 262], [12, 262]], 1, range(150, 330, 26), 320);
  s += ramp(196, 290, x => 210 + 44 * ((x - 196) / 94) ** 1.5, [[290, 262], [192, 262], [196, 218]], -1, range(-130, 30, 26), 160);
  s += P('M10 256 Q80 248 150 256 Q220 264 290 254 ' + BOT) + D('M34 272 q10 -4 20 0 M126 276 q10 -4 20 0 M226 272 q10 -4 20 0');
  s += P(fluff(124, 180, 11, 8, 7, 0.3)) + P(fluff(104, 168, 8, 6, 6, 0.3)) + D('M70 150 q24 -30 56 -44 M86 166 q16 -18 36 -28');
  const wheel = (x, y) => RING(x, y, 25, 17.5) + C(x, y, 17.5) + each([0, 1, 2], i => {
  const o = []; for (let j = 0; j < 18; j++) { const a = 2 * PI * i / 3 + 0.3 + 1.5 * (j < 9 ? j : 17 - j) / 8, r = j < 9 ? 14 : 5.5; o.push([x + r * cos(a), y + r * sin(a)]); }
  return PP(o);
  }) + dot(x, y, 2.4);
  let g = limb([172, 108], [194, 136], [188, 178], 6.2) + E(191, 183, 10.5, 5.6) + wheel(150, 165) + wheel(232, 165);
  g += `<path ${R} fill-rule="evenodd" d="M147 164 L169 124 L222 120 L227 140 L189 174 L151 169 Z M178 131 L217 128 L219 136 L188 163 Z M172 137 L180 165 L157 164 Z"/>`;
  g += limb([224, 138], [228, 152], [232, 165], 3.6) + limb([220, 124], [219, 110], [212, 98], 3.8);
  g += B(226, 84, 24, 19, 5) + `<circle cx="238" cy="89.6" r="2.7" ${T}/><circle cx="238" cy="96.6" r="3.4" ${T}/>`;
  g += E(166, 120, 14, 5.5, -5) + D('M186 170 L198 164 M186 170 L186 181') + dot(186, 170, 2.6);
  g += limb([176, 106], [205, 120], [199, 160], 6.6) + E(202, 164, 11, 6, -6);
  g += stripes(limbPts([172, 106], [186, 94], [199, 81], 13), 0.68, -0.73, [-99, 49, 63, 99], 90);
  g += limb([200, 83], [211, 92], [212, 99], 5) + C(212, 99, 6) + C(211, 60, 16.5);
  g += P('M193.5 61 C191 40 207 32 221 36 C231 40 234 48 232 54 L243 55 Q243 61 234 61 Z') + P('M206 34.5 C214 33 221 35 225 38 L221 60.5 L210 60.5 Z');
  g += D('M195 62 Q199 74 206 74') + eye(210, 66, 2.9) + eye(221, 66, 2.9) + smile(217, 73, 3.4);
  return s + sg(195, 125, 1.15, -10, g, 2, 10);
  };
  // 4. Dragon with treasure
  const dragon = () => {
  let s = FR + P('M10 32 Q10 10 30 10 L270 10 Q290 10 290 32 L278 32 L268 54 L258 32 L214 32 L205 48 L196 32 L106 32 L96 52 L86 32 L46 32 L37 48 L28 32 Z') + gnd(232, 216, 232);
  s += PP([[30, 92], [40, 78], [50, 92], [40, 108]]) + D('M34 92 H46');
  s += P('M58 232 Q70 188 112 180 Q150 174 188 182 Q222 190 230 232 Z');
  s += P('M96 150 L102 120 Q130 106 158 120 L164 150 Z') + D('M106 128 Q130 118 154 128') + coin(112, 148) + coin(131, 143) + coin(150, 148);
  s += B(94, 148, 72, 40, 6) + B(106, 148, 12, 40) + B(142, 148, 12, 40) + B(122, 158, 16, 17, 3) + dot(130, 164, 2.2) + D('M130 165 v5');
  s += coin(100, 196) + coin(124, 202, 8.5) + coin(172, 194) + coin(206, 180, 8.5);
  s += PP([[172, 168], [182, 158], [194, 158], [202, 168], [187, 186]]) + D('M172 168 H202 M182 158 L187 186 L194 158');
  s += P(heart(148, 198, 9)) + sparkle(116, 192, 5) + sparkle(80, 168, 5) + sparkle(172, 112, 5) + sparkle(212, 170, 4);
  s += P('M250 176 C254 150 266 128 286 116 C284 130 285 142 280 152 Z') + P('M250 176 L280 152 C286 164 282 174 274 178 C270 184 262 188 254 184 Z');
  const m = tube([240, 132], [322, 250], [-40, 282], [64, 132], t => 13 + 11 * Math.pow(sin(PI * t), 0.6) - 5 * t);
  s += each([0.72, 0.8, 0.88], t => {
  const a = m(t - 0.05, -0.9), b = m(t + 0.05, -0.9), c = m(t, 0), e = m(t, -1), d = Math.hypot(e[0] - c[0], e[1] - c[1]) / 17;
  return P(`M${xy(a)} Q${xy(e)} ${xy([e[0] + (e[0] - c[0]) / d, e[1] + (e[1] - c[1]) / d])} Q${xy(e)} ${xy(b)} Z`);
  });
  const tk = range(0.05, 0.96, 0.1).concat([1]), bp = sv => 0.03 * sin(PI * (sv + 1) / 1.15);
  tk.slice(1).forEach((t1, i) => { const t0 = tk[i]; s += PP(cellF(m, sv => t0 + (i ? bp(sv) : 0), sv => t1 + (i < 9 ? bp(sv) : 0), -1, 0.15)) + PP(cellTS(m, t0, t1, 0.15, 1)); });
  s += rot(35, 72, 120, P(heart(72, 120, 13)));
  s += tp(P('M240 72 Q246 50 262 40 Q256 56 252 74 Z') + P('M252 78 Q264 62 284 60 Q272 70 262 84 Z') + P('M256 96 Q274 90 286 98 Q272 106 258 106 Z'), -10, 22);
  s += C(226, 116, 25) + E(202, 128, 22, 15) + E(237, 128, 6.5, 4.6) + eye(228, 110, 5.2) + dot(188, 122, 2) + D('M186 134 Q198 142 212 136');
  return s;
  };
  // 5. Mermaid in a giant clam
  const mermaidClam = () => {
  let s = FR + gnd(248, 232, 248) + D('M40 270 h8 M120 280 h8 M230 272 h8');
  const weed = (x0, yb, yt, w, ph) => { const Ls = [], Rs = []; for (let y = yb; y >= yt; y -= 6) { const k = (y - yt) / (yb - yt), x = x0 + 7 * sin((y + ph) / 14), ww = w * (0.35 + 0.65 * k); Ls.push([x - ww, y]); Rs.push([x + ww, y]); } return PP([...Ls, [x0 + 7 * sin((yt - 6 + ph) / 14), yt - 8], ...Rs.reverse()]); };
  s += weed(28, 252, 110, 8, 0) + weed(54, 254, 150, 7, 20);
  s += P('M250 250 C248 230 238 222 234 206 C231 196 239 192 243 200 C247 210 251 214 255 206 C257 196 251 188 255 180 C259 172 267 176 265 186 C263 198 265 206 271 200 C277 194 275 184 281 184 C287 186 285 196 281 204 C275 216 267 226 266 250 Z');
  s += bubble(48, 54, 9) + bubble(68, 30, 6.5) + bubble(254, 66, 8) + bubble(236, 40, 6);
  for (let k = 0; k < 7; k++) {
  const a0 = (215 + 110 * k / 7) * PI / 180, a1 = a0 + 110 / 7 * PI / 180, o = [];
  for (let j = 0; j <= 10; j++) { const a = a0 + (a1 - a0) * j / 10, r = 148 + 10 * sin(PI * j / 10); o.push([150 + r * cos(a), 238 + r * sin(a)]); }
  s += PP([...o, [150 + 30 * cos(a1), 238 + 30 * sin(a1)], [150 + 30 * cos(a0), 238 + 30 * sin(a0)]]);
  }
  s += P('M150 72 C122 70 112 92 118 112 C110 128 100 150 108 170 C114 180 124 176 128 168 C130 150 132 136 136 124 L164 124 C168 136 170 150 172 168 C176 176 186 180 192 170 C200 150 190 128 182 112 C188 92 178 70 150 72 Z');
  s += D('M114 150 q6 -6 4 -14 M186 150 q-6 -6 -4 -14') + P('M136 120 Q150 126 164 120 L170 186 Q150 194 130 186 Z');
  s += limb([164, 124], [184, 156], [196, 196], 5.2) + limb([136, 124], [120, 108], [114, 84], 5.2) + bubble(112, 72, 9.5);
  s += each([142, 158], x => P(`M${x} 147 L${x - 10} 142 A10 10 0 0 1 ${x + 10} 142 Z`) + D(`M${x} 146 L${x} 134 M${x} 146 L${x - 6} 136 M${x} 146 L${x + 6} 136`));
  s += kid(150, 98, 19) + P('M136 80 Q138 66 150 62 Q162 66 164 80 Q150 74 136 80 Z') + D('M150 64 V77 M143 67 L146 77 M157 67 L154 77');
  const bowl = vsplit(52, 248, x => 214 - 6 * abs(sin(PI * (x - 52) / 39.2)), x => 214 + 58 * sq(Math.max(0, 1 - ((x - 150) / 98) ** 2)), [])[0], hb = [150, 300];
  for (let k = 0; k < 5; k++) { const x = 52 + 39.2 * k; s += PP(side(side(bowl, hb, [x, 214], [x + 39.2, 214]), hb, [x + 39.2, 214], [x, 214])); }
  s += C(76, 208, 8.5) + C(96, 210, 8) + C(118, 208, 7.5);
  const mt = tube([166, 204], [214, 190], [252, 208], [258, 248], t => 15 - 7 * t), e = xy(mt(1, 0));
  s += P(`M${e} C266 264 282 270 286 260 C284 252 272 250 ${e} Z`) + P(`M${e} C248 268 252 284 262 284 C270 280 268 266 ${e} Z`);
  s += scales(mt, [0, 0.2, 0.4, 0.6, 0.8, 1], 2, 0.05) + B(132, 180, 40, 12, 6);
  return s;
  };
  // 6. Sushi set
  const sushi = () => {
  let s = FR + D('M18 22 H282') + each([22, 104, 186], x => P(`M${x} 22 L${x + 92} 22 L${x + 92} 62 Q${x + 69} 70 ${x + 46} 62 Q${x + 23} 70 ${x} 62 Z`)) + C(150, 42, 11) + D('M141 42 h18');
  s += P('M10 104 L290 104 ' + BOT) + B(42, 228, 30, 16, 3) + B(228, 228, 30, 16, 3) + stripes([[24, 126], [276, 126], [276, 232], [24, 232]], 0, 1, [126, 162, 197, 232]);
  const maki = (x, y) => P(`M${x - 24} ${y} L${x - 24} ${y + 24} A24 11 0 0 0 ${x + 24} ${y + 24} L${x + 24} ${y} Z`) + E(x, y, 24, 11) + E(x, y, 13, 6.5) + face(x, y + 21, 15);
  s += maki(60, 148) + maki(100, 178);
  s += E(158, 196, 31, 17) + face(158, 200, 17);
  s += stripes([...qb([122, 186], [126, 160], [160, 160], 8), ...qb([160, 160], [194, 160], [196, 182], 8).slice(1), ...qb([196, 182], [160, 176], [122, 186], 8).slice(1, -1)], 1, -0.7, range(-12, 90, 19), 90);
  s += E(230, 198, 28, 16) + face(230, 202, 16) + B(203, 168, 54, 24, 7) + B(221, 164, 18, 36, 4);
  s += E(262, 142, 12, 8.5, -20) + E(254, 150, 12, 8.5, 15) + P(fluff(266, 216, 10, 7.5, 7, 0.2));
  s += E(70, 260, 40, 17) + E(70, 257, 28, 9.5) + P('M170 266 Q176 254 188 262 Q200 256 204 268 Q196 278 186 272 Q176 278 170 266 Z');
  s += limb([128, 280], [200, 262], [280, 244], 4.4) + limb([124, 270], [196, 252], [278, 232], 4.4);
  return s;
  };
  // 7. Solar system
  const solar = () => {
  const at = (r, a) => [-40 + r * cos(a * PI / 180), 150 + r * sin(a * PI / 180)];
  const ring = (x, y, rx, ry, ix, iy, f) => `M${x - rx} ${y} A${rx} ${ry} 0 0 ${f ? 0 : 1} ${x + rx} ${y} L${x + ix} ${y} A${ix} ${iy} 0 0 ${f ? 1 : 0} ${x - ix} ${y} Z`;
  const ringed = (x, y, r, rx, ry, ix, iy, a) => rot(a, x, y, P(ring(x, y, rx, ry, ix, iy)) + C(x, y, r) + P(ring(x, y, rx, ry, ix, iy, 1)));
  let s = B(10, 10, 280, 280) + each([280, 222, 180, 137], r => PP(clipF(ell(-40, 150, r, r, 120))));
  s += PP(cut(ell(-40, 150, 97, 97, 64).map((p, i) => i % 2 ? [-40 + (p[0] + 40) * 0.88, 150 + (p[1] - 150) * 0.88] : p), 1, 0, 10)) + PP(cut(ell(-40, 150, 78, 78, 64), 1, 0, 10));
  let [x, y] = at(117, -40); s += C(x, y, 9) + dot(x - 2, y - 2, 1.5);
  [x, y] = at(117, 38); s += C(x, y, 12) + D(`M${n1(x - 7)} ${n1(y - 3)} q7 -4 14 0`);
  [x, y] = at(158, -12); s += C(x, y, 17) + P(tp('M-12 -6 Q-6 -14 0 -8 Q4 -2 -4 2 Q-10 4 -12 -6 Z', x, y, 1.15)) + P(tp('M2 3 Q10 -1 12 7 Q10 14 3 13 Q-2 9 2 3 Z', x, y, 1.15));
  [x, y] = at(162, -29); s += C(x, y, 7);
  [x, y] = at(201, 24); s += C(x, y, 12) + dot(x + 3, y - 3, 2) + dot(x - 4, y + 4, 1.6);
  [x, y] = at(251, -24); s += stripes(ell(x, y, 24, 24, 48), 0, 1, [y - 25, y - 10, y + 2, y + 13, y + 25]) + E(x + 8, y + 8, 7, 4.5);
  [x, y] = at(251, 22); s += C(x, y, 13) + D(`M${n1(x - 7)} ${n1(y + 2)} q7 4 14 0`);
  s += ringed(250, 214, 15, 31, 9, 20, 4.5, -14) + ringed(258, 66, 11, 21, 7, 14, 3.5, 70);
  [x, y] = at(201, -34);
  const cm = tube([x + 21, y + 32], [x + 14, y + 21], [x + 7, y + 11], [x, y], t => 2 + 7 * t);
  s += PP(cellTS(cm, 0, 1, -1, -0.33)) + PP(cellTS(cm, 0, 1, -0.33, 0.33)) + PP(cellTS(cm, 0, 1, 0.33, 1)) + C(x, y, 8);
  s += each([[118, 2], [158, 22], [201, -8], [251, 0]], ([r, a]) => { const p = at(r, a); return P(star(p[0], p[1], 10.5, 6, 5)); }) + P(star(272, 142, 10.5, 6, 5));
  s += sparkle(276, 24, 5) + sparkle(204, 280, 5) + sparkle(96, 20, 4) + sparkle(28, 280, 4) + sparkle(222, 110, 4);
  return s;
  };
  // 8. Shiba in a scarf
  const shiba = () => {
  let s = FR + gnd(214, 196, 214) + B(30, 110, 22, 110, 4) + P(fluff(42, 70, 34, 42, 11, 0.16)) + B(250, 130, 18, 90, 4) + P(fluff(258, 96, 30, 38, 10, 0.16));
  s += RING(214, 214, 21, 9) + C(214, 214, 9);
  s += P('M150 160 C188 160 206 200 207 236 C208 262 190 272 150 272 C110 272 92 262 93 236 C94 200 112 160 150 160 Z');
  s += E(106, 246, 22, 26) + E(194, 246, 22, 26) + E(98, 272, 17, 9) + E(202, 272, 17, 9);
  s += P('M150 178 C170 178 180 200 178 226 C176 248 164 256 150 256 C136 256 124 248 122 226 C120 200 130 178 150 178 Z');
  s += B(126, 214, 21, 60, 10) + B(153, 214, 21, 60, 10) + D('M133 266 v6 M140 266 v6 M160 266 v6 M167 266 v6');
  s += tubeStripes(tube([176, 194], [181, 210], [186, 224], [190, 240], 9), [0, 0.5, 1]) + D('M181 249 l1 8 M187 249 l1 9 M193 248 l1 8 M199 247 l1 7');
  s += P2('M100 114 Q102 76 114 58 Q134 70 144 94 Z', 150) + P2('M109 104 Q111 82 117 70 Q130 80 136 96 Z', 150);
  s += P('M150 84 C192 84 208 108 208 136 C208 164 184 178 150 178 C116 178 92 164 92 136 C92 108 108 84 150 84 Z');
  s += P('M150 126 C140 118 116 124 108 142 C104 162 124 176 150 176 C176 176 196 162 192 142 C184 124 160 118 150 126 Z');
  s += E(128, 115, 8, 5, -10) + E(172, 115, 8, 5, 10) + eye(128, 134, 5.2) + eye(172, 134, 5.2);
  s += K('M142 146 Q150 141 158 146 Q156 153 150 155 Q144 153 142 146 Z') + D('M150 155 v4 M140 160 q5 6 10 0 q5 6 10 0');
  s += tubeStripes(tube([96, 166], [124, 196], [176, 196], [204, 166], 10), [0, 0.2, 0.4, 0.6, 0.8, 1]);
  s += maple(60, 150, 14, -20) + maple(236, 44, 13, 15) + leaf(102, 36, 15, 9, -30) + leaf(206, 70, 14, 9, 40) + leaf(268, 168, 13, 8.5, -50);
  s += leaf(36, 262, 16, 10, -25) + maple(68, 246, 14, 20) + leaf(238, 262, 16, 10, 25) + maple(268, 246, 13, -15) + leaf(50, 226, 13, 8.5, 70);
  return s;
  };
  // 9. Jet ski
  const jetski = () => {
  let s = FR + C(250, 46, 18) + rays(250, 46, 23) + cloud(120, 54, 0.6) + D('M196 74 q5 -5 10 0 q5 -5 10 0 M214 92 q4 -4 8 0 q4 -4 8 0');
  s += P('M18 150 Q40 128 76 150 Z') + limb([46, 142], [50, 118], [58, 98], 4.6) + P(star(58, 94, 26, 7, 5, -PI / 2 + 0.3));
  vsplit(10, 290, x => 150 + 2.5 * sin(x / 8), fBot, [x => 178 + 7 * sin(x / 13), x => 214 + 8 * sin((x + 30) / 15), x => 250 + 7 * sin((x + 10) / 12)], 70).forEach(q => { s += PP(q); });
  s += C(40, 196, 7) + C(150, 248, 6.5) + C(30, 268, 7) + C(272, 272, 7) + D('M70 236 q8 -10 16 0 M200 270 q8 -10 16 0 M228 238 q8 -10 16 0 M96 276 q8 -10 16 0');
  s += P('M238 200 Q238 176 254 176 Q270 176 270 200 Z') + B(238, 200, 32, 12) + P('M246 176 L248 164 L260 164 L262 176 Z') + C(254, 158, 6.5);
  s += P('M56 210 Q46 186 52 172 Q60 182 66 184 Q64 164 74 152 Q78 170 84 178 Q90 160 104 154 Q100 172 102 182 Q110 176 118 176 Q110 194 104 210 Z') + C(40, 162, 7) + C(62, 134, 7) + C(96, 132, 7);
  let g = P('M92 176 L214 176 Q232 176 240 166 L246 166 Q244 194 206 198 L120 198 Q98 198 92 176 Z') + P('M96 176 Q98 160 122 158 L172 154 Q200 150 222 158 L240 166 Q232 176 214 176 Z');
  g += P('M98 184 L232 184 Q238 182 243 176 Q244 186 236 190 Q226 192 214 192 L112 192 Q104 192 98 184 Z') + P('M118 158 Q120 144 138 144 L174 143 Q182 145 178 155 Z');
  g += P('M204 156 L214 132 Q222 134 222 158 Z') + limb([196, 154], [194, 140], [190, 128], 4);
  g += limb([152, 140], [180, 138], [182, 164], 7) + E(186, 168, 11, 6) + limb([162, 110], [178, 120], [190, 128], 4.6) + C(191, 128, 5.6);
  g += P('M140 140 Q138 116 150 104 Q162 98 172 106 Q178 122 172 142 Q156 148 140 140 Z') + P('M152 102 Q160 98 168 102 L166 140 Q160 143 154 141 Z');
  g += P('M150 74 Q128 66 112 80 Q126 78 132 84 Q118 90 112 102 Q130 90 144 92 Z') + C(164, 84, 16);
  g += P('M148 84 C146 66 162 62 172 66 C180 70 182 78 180 84 C174 78 166 76 160 77 C156 82 152 84 148 84 Z') + eye(164, 88, 2.8) + eye(175, 88, 2.8) + smile(171, 95, 3.4);
  return s + sg(168, 160, 1.12, -9, g);
  };
  const fish = (x, y, r, f = 1) => PP([[x - f * r * 0.75, y], [x - f * r * 1.65, y - r * 0.7], [x - f * r * 1.65, y + r * 0.7]]) + stripes(ell(x, y, r, r * 0.64, 32), 1, 0, r < 14 ? [x - r, x - r * 0.1, x + r] : [x - r, x - r * 0.3, x + r * 0.25, x + r]) + eye(x + f * r * 0.55, y - r * 0.1, r * 0.14);
  const note = (x, y, k = 1) => P(tp('M-7 3 Q-8 -5 1 -6 Q3 -6 4 -5 L4 -28 L8 -28 Q10 -20 17 -16 Q20 -10 16 -5 Q15 -12 8 -16 L8 -1 Q7 6 -1 7 Q-7 8 -7 3 Z', x, y, k));
  // 10. Fairy riding a butterfly
  const fairyFly = () => {
  let s = FR + cloud(18, 62, 0.5) + cloud(204, 46, 0.55) + gnd(256, 240, 256) + fl(36, 270, 12, 6) + fl(264, 270, 12, 6);
  s += D('M145 72 Q132 50 118 42 M155 72 Q168 50 182 42') + C(116, 41, 6) + C(184, 41, 6);
  for (const f of [1, -1]) {
  const X = x => 150 + f * (x - 150);
  s += E(X(88), 128, 64, 42, -24 * f) + E(X(96), 128, 36, 22, -24 * f) + C(X(44), 108, 9) + C(X(62), 154, 7.5) + C(X(98), 128, 8);
  s += E(X(108), 198, 42, 32, 30 * f) + E(X(114), 194, 22, 16, 30 * f) + C(X(90), 218, 7.5);
  }
  s += stripes(ell(150, 232, 12, 38, 40), 0, 1, [194, 236, 270]) + C(150, 84, 13) + face(150, 84, 13);
  let g = E(130, 166, 9, 17, -35) + E(170, 166, 9, 17, 35) + P('M141 164 Q150 168 159 164 L157 186 L143 186 Z');
  g += limb([146, 200], [134, 210], [126, 226], 4.2) + limb([152, 202], [142, 214], [136, 230], 4.2);
  g += P2('M150 182 Q128 186 124 204 Q138 204 148 196 Z', 150) + P('M142 182 L158 182 Q160 198 150 210 Q140 198 142 182 Z');
  g += limb([142, 168], [130, 176], [124, 164], 4) + limb([158, 168], [170, 176], [178, 164], 4) + D('M178 164 L186 150') + P(star(188, 146, 10, 5.6, 5));
  return s + sg(150, 186, 1.3, 0, g + kid(150, 142, 14, 'UF')) + sparkle(208, 130, 5) + sparkle(96, 176, 4) + sparkle(232, 228, 5);
  };
  // 11. Plesiosaur
  const plesio = () => {
  let s = FR + C(244, 52, 20) + rays(244, 52, 25) + cloud(150, 64, 0.5);
  s += P('M18 150 Q50 108 92 150 Z') + P('M188 150 Q228 122 270 150 Z') + limb([56, 138], [58, 118], [66, 102], 4.5) + P(star(66, 98, 22, 7, 5));
  const sea = vsplit(10, 290, x => 150 + 2 * sin(x / 7), fBot, [x => 180 + 6 * sin(x / 12), x => 208 + 6 * sin((x + 20) / 13), x => 246 + 7 * sin(x / 11)], 70);
  s += PP(sea[0]) + PP(sea[1]);
  s += P('M244 192 Q272 186 286 168 Q280 198 248 206 Z') + E(200, 192, 54, 32) + C(198, 176, 8) + C(222, 172, 7) + C(238, 190, 6.5) + C(178, 188, 6.5);
  s += E(150, 204, 22, 8, -28) + E(250, 206, 18, 7, 30);
  s += tubeStripes(tube([172, 188], [128, 184], [92, 152], [94, 98], t => 15 - 6 * t), [0, 0.2, 0.4, 0.6, 0.8, 1]);
  s += E(104, 82, 23, 17, -8) + eye(110, 78, 4) + dot(122, 80, 1.6) + D('M100 92 Q112 96 122 90');
  s += PP(sea[2]) + PP(sea[3]) + D('M40 226 q8 -8 16 0 M150 232 q8 -8 16 0 M232 268 q8 -8 16 0 M80 270 q8 -8 16 0');
  s += fish(48, 196, 12, -1) + fish(222, 266, 12, -1) + bubble(118, 238, 6.5) + bubble(262, 230, 6);
  return s;
  };
  // 12. Headphones and a music player
  const headphones = () => {
  let s = stripes([[10, 10], [290, 10], [290, 290], [10, 290]], 1, 1, range(20, 580, 60), 300);
  const arc = (r0, r1, a0, a1) => { const o = []; for (let i = 0; i <= 16; i++) { const a = (a0 + (a1 - a0) * i / 16) * PI / 180; o.push([150 + r1 * cos(a), 170 + r1 * sin(a)]); } for (let i = 16; i >= 0; i--) { const a = (a0 + (a1 - a0) * i / 16) * PI / 180; o.push([150 + r0 * cos(a), 170 + r0 * sin(a)]); } return PP(o); };
  s += arc(84, 102, 200, 247) + arc(84, 102, 247, 293) + arc(84, 102, 293, 340) + arc(74, 84, 230, 310);
  s += B(46, 112, 18, 34, 6) + B(236, 112, 18, 34, 6);
  for (const x of [62, 238]) s += E(x, 182, 30, 42) + E(x, 182, 18, 27) + P(heart(x, 182, 10));
  s += D('M150 192 Q120 180 100 200 Q80 220 72 220') + B(114, 190, 72, 90, 12) + B(124, 200, 52, 34, 5) + RING(150, 254, 18, 7) + C(150, 254, 7);
  s += note(112, 100) + note(176, 92, 1.1) + note(150, 140, 0.9) + note(250, 258, 1.1) + note(40, 262) + note(266, 50) + sparkle(208, 132, 5) + sparkle(92, 140, 4);
  return s;
  };
  // 13. Kid detective
  const detective = () => {
  let s = FR + each([[24, 30], [84, 58], [214, 26], [240, 86], [30, 124], [222, 150]], ([x, y]) => B(x, y, 46, 22, 3)) + gnd(206, 196, 206);
  s += B(22, 70, 10, 140) + P('M14 72 L40 72 L34 52 L20 52 Z') + D('M27 52 V44');
  s += each([[44, 274, -20], [70, 256, -10], [98, 274, 0], [222, 270, 10], [248, 252, 20], [272, 272, 30]], ([x, y, a]) => P(tp('M0 -10 Q6 -10 6 -2 Q6 4 3 6 Q5 9 3 12 Q0 15 -3 12 Q-5 9 -3 6 Q-6 4 -6 -2 Q-6 -10 0 -10 Z', x, y, 1.1, a * PI / 180)));
  s += B(134, 206, 14, 42, 6) + B(154, 206, 14, 42, 6) + E(138, 250, 12, 6) + E(166, 250, 12, 6);
  s += limb([128, 134], [110, 160], [122, 180], 5.5) + P('M126 126 Q150 120 174 126 L186 212 Q150 220 114 212 Z');
  s += P('M120 132 Q150 152 180 132 L184 156 Q150 172 116 156 Z') + B(117, 186, 66, 10, 4) + dot(150, 202, 1.6) + dot(150, 172, 1.6);
  s += P2('M150 124 L136 122 L144 140 Z', 150) + limb([172, 136], [196, 150], [206, 132], 5.5);
  s += hair(150, 100, 22, 'B') + C(150, 100, 22) + stripes([...qb([127, 98], [124, 70], [150, 68], 8), ...qb([150, 68], [176, 70], [173, 98], 8).slice(1), ...qb([173, 98], [150, 88], [127, 98], 8).slice(1, -1)], 1, 0, [120, 141, 159, 180]);
  s += P('M168 92 Q186 88 194 98 Q184 100 170 98 Z') + eye(142, 104, 3.1) + smile(150, 113, 4);
  s += limb([210, 128], [218, 140], [226, 154], 4.5) + C(206, 132, 6) + RING(196, 106, 23, 16) + C(196, 106, 16) + eye(196, 106, 7);
  return s;
  };
  // 14. Scuba diver
  const diver = () => {
  let s = FR + gnd(252, 236, 252) + D('M60 270 h8 M150 280 h8 M226 266 h8');
  const coral = 'M0 0 C-2 -20 -12 -28 -16 -44 C-19 -54 -11 -58 -7 -50 C-3 -40 1 -36 5 -44 C7 -54 1 -62 5 -70 C9 -78 17 -74 15 -64 C13 -52 15 -44 21 -50 C27 -56 25 -66 31 -66 C37 -64 35 -54 31 -46 C25 -34 17 -24 16 0 Z';
  s += P(tp(coral, 26, 256, 1)) + P(tp(coral, 236, 258, 0.9)) + P(fluff(176, 252, 18, 12, 9, 0.2));
  s += fish(66, 70, 15) + fish(204, 192, 13, -1) + fish(110, 226, 12);
  s += bubble(236, 70, 7) + bubble(250, 46, 8.5) + bubble(232, 26, 6) + bubble(40, 170, 7);
  s += P(tp('M0 -6 L-28 -16 Q-33 0 -28 16 L0 6 Z', 58, 112, 1, -0.2)) + P(tp('M0 -6 L-28 -16 Q-33 0 -28 16 L0 6 Z', 60, 140, 1, 0.25));
  s += limb([108, 126], [84, 116], [60, 112], 7) + limb([108, 132], [86, 136], [62, 140], 7);
  s += stripes(limbPts([100, 128], [142, 126], [184, 122], 17), 1, 0, [0, 140, 156, 300]);
  s += B(98, 86, 72, 22, 11) + B(124, 86, 14, 22) + limb([180, 130], [200, 142], [220, 146], 6) + C(222, 146, 7);
  s += P(mir(tp(HAIR.P, 212, 108, 0.85), 212)) + C(212, 108, 17) + B(200, 96, 30, 16, 7) + B(205, 99, 20, 10, 4) + eye(210, 104, 2.4) + eye(219, 104, 2.4) + C(222, 120, 6) + D('M218 124 Q190 130 170 100');
  return s;
  };
  // 15. Unicorn birthday cake
  const unicake = () => {
  let s = FR + bunting([10, 30], [150, 62], [290, 30], [0.1, 0.3, 0.5, 0.7, 0.9]) + E(36, 104, 16, 20) + E(264, 104, 16, 20) + D('M36 124 Q30 150 40 176 M264 124 Q270 150 260 176');
  s += gnd(244, 236, 244) + E(150, 252, 104, 14) + P('M130 264 L170 264 L178 282 L122 282 Z');
  s += stripes([[64, 178], [236, 178], [236, 248], [64, 248]], 1, 0, range(64, 236, 28.6));
  s += P('M60 172 L240 172 L240 190 ' + each(range(0, 5, 1), i => `Q${232 - i * 36} 206 ${222 - i * 36} 192 Q${213 - i * 36} 200 ${204 - i * 36} 190`) + ' L60 190 Z');
  s += B(94, 110, 112, 68, 12) + P2('M110 116 L102 82 L130 106 Z', 150) + P2('M112 108 L108 92 L122 104 Z', 150);
  s += stripes([[134, 104], [150, 38], [166, 104]], 0.35, 1, [88, 108, 125, 142, 164], 60);
  s += D('M118 142 q8 7 16 0 M166 142 q8 7 16 0 M118 142 l-4 -3 M182 142 l4 -3') + E(116, 156, 8, 5.5) + E(184, 156, 8, 5.5) + smile(150, 152, 6);
  s += fl(96, 102, 15, 6) + fl(82, 128, 13, 5) + fl(204, 102, 15, 6) + fl(218, 128, 13, 5);
  s += sparkle(40, 220, 6) + sparkle(262, 214, 5) + sparkle(150, 226, 4);
  return s;
  };
  const pix = (rows, ch, x0, y0, u) => {
  const on = (r, c) => (rows[r] || '')[c] === ch, nx = new Map(), K = (x, y) => x + ',' + y;
  rows.forEach((row, r) => [...row].forEach((v, c) => {
  if (v !== ch) return;
  if (!on(r - 1, c)) nx.set(K(c, r), [c + 1, r]);
  if (!on(r, c + 1)) nx.set(K(c + 1, r), [c + 1, r + 1]);
  if (!on(r + 1, c)) nx.set(K(c + 1, r + 1), [c, r + 1]);
  if (!on(r, c - 1)) nx.set(K(c, r + 1), [c, r]);
  }));
  const k0 = nx.keys().next().value; let p = k0.split(',').map(Number), o = [];
  do { o.push(p); p = nx.get(K(p[0], p[1])); } while (K(p[0], p[1]) !== k0 && o.length < 999);
  o = o.filter((q, i) => { const a = o[(i + o.length - 1) % o.length], b = o[(i + 1) % o.length]; return (q[0] - a[0]) * (b[1] - q[1]) !== (q[1] - a[1]) * (b[0] - q[0]); });
  return PP(o.map(([c, r]) => [x0 + c * u, y0 + r * u]));
  };
  const pixAll = (rows, chs, x0, y0, u) => each([...chs], c => pix(rows, c, x0, y0, u));
  // 16. Ring-tailed lemurs
  const lemurs = () => {
  let s = FR + leaf(40, 46, 34, 22, 35) + leaf(262, 40, 34, 22, -40) + leaf(30, 256, 30, 20, -30) + leaf(272, 258, 30, 20, 30) + C(150, 40, 18) + rays(150, 40, 23);
  s += PP([[10, 194], [290, 202], [290, 218], [10, 212]]) + D('M60 203 q8 4 16 2 M210 210 q8 3 16 0');
  const lem = tubeStripes(tube([160, 196], [204, 212], [214, 262], [182, 290], 8.5), range(0.12, 1, 0.11)) +
  P('M150 128 C172 128 180 160 178 184 C176 200 164 204 150 204 C136 204 124 200 122 184 C120 160 128 128 150 128 Z') + E(150, 176, 16, 22) +
  E(136, 204, 11, 6.5) + E(164, 204, 11, 6.5) + limb([134, 142], [126, 166], [140, 186], 5.5) + limb([166, 142], [174, 166], [160, 186], 5.5) +
  P2('M130 102 Q114 84 120 74 Q136 82 142 94 Z', 150) + C(150, 112, 24) +
  P('M150 104 C140 98 128 104 128 116 C128 130 140 136 150 136 C160 136 172 130 172 116 C172 104 160 98 150 104 Z') +
  E(140, 113, 8.5, 7.5, -20) + E(160, 113, 8.5, 7.5, 20) + eye(141, 113, 3.8) + eye(159, 113, 3.8) + K('M146 122 L154 122 L150 127 Z') + smile(150, 128, 3.5);
  s += sg(150, 150, 0.95, 0, lem, -56, -4) + sg(150, 150, 0.82, 0, lem, 60, 12, -1);
  return s + sparkle(110, 78, 4) + sparkle(200, 92, 4);
  };
  // 17. Dumplings in a bamboo steamer
  const dumplings = () => {
  let s = FR + lantern(40) + lantern(260);
  s += stripes([[10, 150], [290, 150], [290, 272], [272, 290], [28, 290], [10, 272]], 1, -0.5, range(-140, 290, 56), 200);
  s += P(fluff(84, 74, 16, 11, 7, 0.2)) + P(fluff(124, 58, 13, 9, 7, 0.2)) + P(fluff(170, 72, 15, 10, 7, 0.2));
  s += stripes(vsplit(52, 238, x => 160 + 30 * sq(Math.max(0, 1 - ((x - 145) / 93) ** 2)), x => 214 + 30 * sq(Math.max(0, 1 - ((x - 145) / 93) ** 2)), [])[0], 1, 0, range(52, 238, 31), 150);
  s += `<path ${R} fill-rule="evenodd" d="${pd(ell(145, 160, 93, 32, 48))} ${pd(ell(145, 160, 82, 25, 44))}"/>` + E(145, 160, 82, 25);
  const dump = (x, y) => P(tp('M-20 6 Q-22 -8 -9 -13 Q0 -20 9 -13 Q22 -8 20 6 Q0 13 -20 6 Z', x, y)) + D(tp('M-6 -13 L-4 -7 M0 -16 L0 -9 M6 -13 L4 -7', x, y)) + face(x, y - 1, 15);
  s += dump(106, 152) + dump(150, 146) + dump(192, 154) + dump(124, 172) + dump(170, 174);
  s += E(256, 222, 26, 50, 18) + E(256, 222, 15, 32, 18) + C(256, 222, 7);
  s += E(56, 250, 32, 13) + E(56, 248, 22, 7.5) + limb([96, 282], [170, 262], [236, 244], 4.4) + limb([92, 272], [166, 252], [230, 234], 4.4);
  return s;
  };
  // 18. Pixel game screen
  const pixel = () => {
  let s = FR + B(28, 24, 244, 182, 6) + D('M212 262 h40 M212 270 h40');
  s += P('M60 236 L72 236 L72 224 L84 224 L84 236 L96 236 L96 248 L84 248 L84 260 L72 260 L72 248 L60 248 Z') + C(150, 244, 13) + C(182, 234, 13);
  s += each(range(0, 5, 1), i => B(28 + i * 40.7, 176, 40.7, 30)) + each([0, 1, 2], i => B(160 + i * 30, 112, 30, 30));
  const H = ['..hhhh..', '.hhhhhh.', '.hssssh.', '.ssssss.', '..ssss..', '.bbbbbb.', 'abbbbbbA', 'abbbbbbA', '.bbbbbb.', '.pp..qq.', '.pp..qq.', 'ooo..OOO'];
  s += pixAll(H, 'hsbaApqoO', 54, 80, 8) + dot(76, 106, 2.4) + dot(92, 106, 2.4);
  const HT = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'], G = ['.XXX.', 'XXXXX', '.XXX.', '..X..'];
  s += each([36, 68, 100], x => pix(HT, 'X', x, 32, 4)) + pix(G, 'X', 160, 74, 7) + pix(G, 'X', 206, 74, 7) + pix(G, 'X', 132, 130, 7);
  s += pix(['..XX....', '.XXXXX..', 'XXXXXXXX'], 'X', 196, 34, 8) + pix(['.XX.', 'XXXX', 'XXXX'], 'X', 230, 152, 8);
  return s + sparkle(150, 60, 4) + sparkle(250, 100, 4);
  };
  // 19. Space surfer on a planet's rings
  const surfer = () => {
  let s = B(10, 10, 280, 280, 18) + C(54, 54, 17) + dot(48, 50, 2.5) + dot(60, 60, 2) + P(star(130, 40, 11, 6, 5)) + P(star(262, 120, 11, 6, 5)) + P(star(36, 130, 10, 5.6, 5)) + P(star(270, 262, 10, 5.6, 5));
  const ring = (a0, a1) => { const o = []; for (let i = 0; i <= 12; i++) { const a = (a0 + (a1 - a0) * i / 12) * PI / 180; o.push([150 * cos(a), 36 * sin(a)]); } for (let i = 12; i >= 0; i--) { const a = (a0 + (a1 - a0) * i / 12) * PI / 180; o.push([118 * cos(a), 22 * sin(a)]); } return PP(clipF(o.map(([u, v]) => [96 + u * 0.951 + v * 0.309, 236 - u * 0.309 + v * 0.951]))); };
  s += ring(300, 360);
  s += stripes(clipF(ell(96, 236, 84, 84, 64)), 0.3, 1, [100, 200, 236, 268, 300, 420], 150);
  s += ring(0, 45) + ring(45, 90) + ring(90, 180);
  const bd = ell(212, 168, 42, 9, 36).map(([x, y]) => [212 + (x - 212) * 0.94 + (y - 168) * 0.34, 168 - (x - 212) * 0.34 + (y - 168) * 0.94]);
  let g = stripes(bd, 0.94, -0.34, [0, 176, 196, 400], 60);
  g += limb([206, 128], [196, 146], [196, 164], 6) + limb([216, 128], [232, 142], [232, 158], 6) + E(196, 166, 9, 5, -20) + E(234, 160, 9, 5, -20);
  g += limb([206, 104], [190, 110], [176, 98], 5) + limb([222, 102], [238, 104], [250, 90], 5) + P('M200 98 Q214 92 226 98 L222 132 Q210 136 200 132 Z');
  g += C(216, 80, 22) + hair(216, 80, 14, 'B') + kid(216, 80, 14) + D('M206 64 q-4 -4 -2 -8 M232 74 q5 -2 6 2');
  const cm = tube([96, 84], [110, 96], [124, 108], [138, 120], t => 2 + 7 * t);
  s += PP(cellTS(cm, 0, 1, -1, -0.33)) + PP(cellTS(cm, 0, 1, -0.33, 0.33)) + PP(cellTS(cm, 0, 1, 0.33, 1)) + C(138, 120, 8.5);
  return s + sg(214, 132, 1.22, 0, g, -4, 0) + sparkle(178, 96, 5) + sparkle(72, 160, 4) + sparkle(230, 230, 4);
  };
  // 20. Puffins on a cliff
  const puffins = () => {
  let s = FR + cloud(30, 60, 0.6) + cloud(190, 44, 0.5) + D('M120 70 q6 -6 12 0 q6 -6 12 0 M150 92 q5 -5 10 0 q5 -5 10 0');
  vsplit(10, 290, x => 150, fBot, [x => 196 + 6 * sin(x / 12), x => 238 + 6 * sin(x / 10)]).forEach(q => { s += PP(q); });
  const cl = [[10, 186], ...qb([10, 186], [120, 176], [212, 196], 8).slice(1), [228, 290], [28, 290], [10, 272]];
  s += stripes(cl, 0.2, 1, [180, 226, 252, 320], 200) + P('M10 182 Q120 170 214 192 L216 204 Q120 188 10 196 Z');
  s += fl(160, 214, 11, 5) + fl(40, 226, 10, 5) + D('M230 270 q8 -10 16 0 M250 236 q8 -10 16 0');
  const pf = P('M132 204 L150 204 L156 212 L130 212 Z') + P('M150 204 L168 204 L174 212 L148 212 Z') +
  P('M140 110 C162 104 178 130 178 160 C178 192 162 204 146 204 C128 204 118 190 118 164 C118 134 124 114 140 110 Z') +
  P('M150 140 C166 146 172 170 168 188 C164 200 156 204 146 204 C134 204 128 194 130 176 C132 156 138 144 150 140 Z') +
  P('M126 140 Q110 168 124 196 Q140 176 136 148 Z') + C(150, 104, 22) +
  P('M146 88 C164 82 176 96 172 112 C170 124 158 128 148 126 C136 124 130 110 134 98 Q138 90 146 88 Z') +
  stripes([[164, 88], [204, 112], [164, 132]], 1, 0, [160, 181, 206], 40) + eye(160, 104, 3.2);
  s += sg(150, 150, 0.92, 0, pf, -64, -18) + sg(150, 150, 0.8, 0, pf, 48, -2, -1) + fl(250, 220, 11, 5) + fl(108, 234, 10, 5);
  return s;
  };
  // 21. Lion dance head
  const liondance = () => {
  let s = FR + lantern(40) + lantern(260) + fl(34, 250, 15, 5) + fl(266, 250, 15, 5);
  s += each(range(0, 9, 1), i => { const a = PI * (0.85 + i * 1.3 / 9); return C(150 + 112 * cos(a), 162 - 100 * sin(a), 19); });
  s += P2('M74 96 Q42 66 50 40 Q82 52 96 76 Z', 150) + P('M150 56 C214 56 250 100 250 160 C250 220 214 260 150 260 C86 260 50 220 50 160 C50 100 86 56 150 56 Z');
  s += P('M138 66 Q150 22 162 66 Z') + C(150, 80, 12) + P2('M118 80 Q122 62 140 66 Q136 78 118 80 Z', 150);
  s += limb([88, 118], [112, 94], [136, 110], 5.5) + limb([212, 118], [188, 94], [164, 110], 5.5);
  s += each([116, 184], x => C(x, 144, 21) + C(x + 2, 146, 13) + eye(x + 2, 146, 7.5) + `<circle cx="${x - 3}" cy="${152}" r="1.8" fill="#fff"/>`);
  s += C(84, 184, 14) + C(216, 184, 14) + D('M78 180 l-3 6 M85 180 l-3 6 M92 180 l-3 6 M210 180 l3 6 M217 180 l3 6 M224 180 l3 6') + P('M134 170 Q150 156 166 170 Q166 182 150 184 Q134 182 134 170 Z');
  s += P('M98 196 Q150 202 202 196 Q200 248 150 252 Q100 248 98 196 Z') + P('M120 236 Q150 218 180 236 Q170 251 150 252 Q130 251 120 236 Z') + P(fluff(150, 270, 36, 10, 8, 0.3));
  s += D('M70 150 q-8 10 0 20 M230 150 q8 10 0 20 M84 214 q10 4 14 12 M216 214 q-10 4 -14 12');
  return s;
  };
  // 22. Terrarium
  const terrarium = () => {
  let s = FR + gnd(240, 232, 240) + B(18, 206, 30, 34, 4) + leaf(26, 192, 14, 8, -70) + leaf(40, 190, 14, 8, -110);
  s += P('M250 214 L280 214 L276 246 L254 246 Z') + P('M250 222 L230 208 L234 204 L254 216 Z') + D('M280 220 Q292 228 278 240');
  s += P('M104 50 L196 50 L192 78 L108 78 Z') + D('M120 58 h4 M150 64 h4 M176 58 h4') + P('M104 84 L196 84 L202 112 L98 112 Z') + B(94, 74, 112, 12, 5);
  const jt = x => 182 - 78 * sq(Math.max(0, 1 - ((x - 150) / 106) ** 2)), jb = x => 182 + 76 * sq(Math.max(0, 1 - ((x - 150) / 106) ** 2));
  vsplit(44, 256, jt, jb, [x => 200 + 5 * sin(x / 9), x => 218 + 3 * sin(x / 13), x => 236]).forEach(q => { s += PP(q); });
  s += each([[96, 246], [118, 250], [140, 245], [162, 250], [184, 246], [206, 250]], ([x, y]) => E(x, y, 9, 6.5));
  s += D('M62 150 Q56 172 62 192 M232 132 q6 10 4 22');
  s += P(flower(98, 186, 22, 8)) + P(flower(98, 186, 12, 6)) + leaf(140, 172, 24, 10, -62) + leaf(156, 168, 24, 10, -118);
  s += stripes(limbPts([190, 196], [190, 170], [190, 140], 13), 1, 0, [170, 186, 194, 210]) + C(190, 128, 8);
  s += P('M214 194 Q216 176 230 176 Q244 176 246 194 Z') + B(225, 194, 10, 10, 3);
  return s + sparkle(76, 120, 5) + sparkle(220, 116, 4);
  };
  // 23. Cheerleader
  const cheer = () => {
  let s = each(range(0, 11, 1), i => { const a = (i * 30 - 90) * PI / 180, b = a + PI / 6; return PP(clipF([[150, 140], [150 + 400 * cos(a), 140 + 400 * sin(a)], [150 + 400 * cos(b), 140 + 400 * sin(b)]])); });
  s += P('M10 248 Q150 236 290 248 L290 290 L10 290 Z') + E(150, 268, 42, 9);
  s += P('M236 252 L272 236 L272 268 Z') + E(272, 252, 7, 16) + P(star(40, 222, 12, 6.8, 5)) + P(star(256, 196, 10, 5.6, 5));
  s += limb([140, 168], [122, 190], [116, 216], 6.5) + limb([160, 168], [178, 190], [184, 216], 6.5) + E(112, 222, 13, 7, -20) + E(188, 222, 13, 7, 20);
  s += each(range(0, 4, 1), i => PP([[128 + 8.8 * i, 136], [136.8 + 8.8 * i, 136], [112 + 15.2 * (i + 1), 172], [112 + 15.2 * i, 172]]));
  s += limb([132, 98], [116, 74], [100, 52], 6) + limb([168, 98], [184, 74], [200, 52], 6);
  s += P('M132 92 Q150 98 168 92 L172 138 L128 138 Z') + P('M132 102 L150 120 L168 102 L169 113 L150 131 L131 113 Z');
  s += P(fluff(92, 42, 24, 21, 12, 0.3)) + P(fluff(208, 42, 24, 21, 12, 0.3));
  s += hair(150, 72, 20, 'P') + kid(150, 72, 20) + P2('M164 50 L178 42 L178 58 Z', 164) + dot(164, 50, 3);
  return s + sparkle(60, 120, 5) + sparkle(244, 120, 5) + sparkle(96, 170, 4) + sparkle(210, 168, 4);
  };
  // 24. Quad bike on a muddy trail
  const quad = () => {
  let s = FR + C(252, 44, 16) + rays(252, 44, 21) + cloud(90, 60, 0.55) + P('M10 150 Q80 118 150 146 Q220 116 290 144 ' + BOT);
  const pine = (x, y) => B(x - 5, y + 30, 10, 18) + P(`M${x - 26} ${y + 32} L${x} ${y - 4} L${x + 26} ${y + 32} Z`) + P(`M${x - 19} ${y + 8} L${x} ${y - 24} L${x + 19} ${y + 8} Z`);
  s += pine(38, 108) + pine(264, 104) + gnd(214, 196, 214) + E(54, 262, 34, 10) + E(244, 272, 30, 9);
  s += P(fluff(40, 214, 14, 10, 7, 0.35)) + P(fluff(60, 196, 9, 7, 6, 0.35)) + D('M30 236 q-8 -4 -12 -12 M250 220 h20 M246 230 h26');
  s += each([96, 214], x => P(fluff(x, 226, 30, 30, 14, 0.09)) + C(x, 226, 14) + dot(x, 226, 3));
  s += P('M58 214 Q64 178 104 178 L134 178 L134 196 L112 196 Q88 194 78 214 Z') + P('M180 196 L184 178 Q232 176 246 212 L232 214 Q222 196 196 196 Z');
  s += P('M120 196 L136 172 L190 172 L198 196 L178 210 L134 210 Z') + P('M108 176 Q110 164 124 164 L170 164 Q176 170 170 176 Z') + B(234, 172, 16, 12, 4) + B(196, 158, 30, 8, 3) + limb([194, 172], [198, 160], [204, 150], 4);
  s += limb([144, 168], [168, 176], [164, 200], 6.5) + E(168, 204, 11, 6) + P('M136 168 Q134 140 148 128 Q160 122 168 132 Q170 152 160 170 Z') + limb([160, 134], [182, 142], [198, 150], 5) + C(200, 150, 6);
  s += C(168, 110, 16) + P('M152 112 C150 92 164 88 174 90 C184 92 188 102 186 112 Z') + P('M168 104 L188 104 Q192 114 186 118 L168 118 Z') + smile(178, 124, 3);
  return s;
  };
  // 25. Friendship bracelets
  const bracelets = () => {
  let s = FR;
  const wa = k => k * 30 * PI / 180, wz = k => (k % 2 ? 12 : -12) * PI / 180;
  s += E(170, 214, 76, 36) + each(range(0, 11, 1), k => {
  const o = []; for (let j = 0; j <= 6; j++) { const a = wa(k) + (wa(k + 1) - wa(k)) * j / 6; o.push([170 + 100 * cos(a), 214 + 52 * sin(a)]); }
  for (let j = 6; j >= 0; j--) { const a = wa(k) + wz(k) + (wa(k + 1) + wz(k + 1) - wa(k) - wz(k)) * j / 6; o.push([170 + 76 * cos(a), 214 + 36 * sin(a)]); }
  return PP(o);
  }) + E(274, 214, 9, 13) + D('M274 205 v-6');
  s += C(226, 82, 40) + each(range(0, 9, 1), i => { const a = (i * 36 - 90) * PI / 180; return C(226 + 40 * cos(a), 82 + 40 * sin(a), i % 2 ? 7.5 : 9.5); });
  s += C(96, 98, 60);
  s += each(range(0, 8, 1), i => {
  const a = (81 + i * 36) * PI / 180, x = 96 + 60 * cos(a), y = 98 + 60 * sin(a);
  return i % 3 === 1 ? P(heart(x, y + 1, 11)) : i % 3 === 2 ? P(star(x, y, 12, 6.8, 5)) : C(x, y, 9.5);
  });
  s += D('M140 140 Q152 152 160 168 M140 140 Q144 160 140 176') + C(140, 140, 7) + C(161, 171, 6.5) + C(140, 180, 6.5);
  s += D('M42 128 L33 162 M68 154 L60 177 M105 158 L96 166') + P(heart(32, 172, 12)) + P(star(58, 190, 13, 7.3, 5)) + P('M96 166 A16 16 0 1 0 96 198 A7.5 16 0 1 1 96 166 Z');
  s += P('M24 262 L38 246 L74 246 L74 278 L38 278 Z') + D('M38 262 Q60 236 80 222') + `<circle cx="38" cy="262" r="3" ${T}/>` + C(138, 28, 8) + P(heart(270, 268, 10));
  return s + sparkle(176, 30, 6) + sparkle(276, 150, 5) + sparkle(110, 276, 5);
  };
  // 26. Heart mandala
  const heartMandala = () => {
  const hp = (k, y0) => range(0, 71, 1).map(i => { const t = 2 * PI * i / 72; return [150 + k * 16 * sin(t) ** 3, y0 - k * (13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t))]; });
  const c = [150, 136], wedge = (ps, n, off) => each(range(0, n - 1, 1), i => {
  const a = (i * 360 / n + off - 90) * PI / 180, b = a + 2 * PI / n, m = (a + b) / 2, q = [c[0] + 9 * cos(m), c[1] + 9 * sin(m)];
  return PP(side(side(ps, c, [c[0] + 600 * cos(a), c[1] + 600 * sin(a)], q), c, [c[0] + 600 * cos(b), c[1] + 600 * sin(b)], q));
  });
  let s = FR + each([[36, 40], [264, 40], [36, 266], [264, 266]], ([x, y]) => P(heart(x, y, 14)));
  s += wedge(hp(8.4, 118), 12, 0) + wedge(hp(6.5, 122), 12, 15) + wedge(hp(4.6, 126), 8, 0) + P(pd(hp(2.6, 130)));
  return s + sparkle(150, 22, 5) + sparkle(20, 150, 4) + sparkle(280, 150, 4);
  };
  const N = (en, fr, es, de, zh) => ({ en, fr, es, de, zh });
  return [
  { id: 'a8-princess-ballroom', cat: 'princess', name: N('Royal ballroom dance', 'Bal au château', 'Baile en el palacio', 'Tanz im Ballsaal', '舞会上的公主'), svg: ballroom() },
  { id: 'a8-highland-cow', cat: 'animals', name: N('Fluffy highland cow', 'Vache poilue des Highlands', 'Vaca peluda escocesa', 'Flauschiges Hochlandrind', '毛茸茸的高地牛'), svg: cow() },
  { id: 'a8-bmx', cat: 'vehicles', name: N('BMX jump', 'Saut en BMX', 'Salto en BMX', 'BMX-Sprung', '小轮车飞跃'), svg: bmx() },
  { id: 'a8-dragon-treasure', cat: 'fantasy', name: N('Dragon and its treasure', 'Le dragon et son trésor', 'El dragón y su tesoro', 'Drache mit Schatz', '守护宝藏的龙'), svg: dragon() },
  { id: 'a8-mermaid-pearls', cat: 'princess', name: N('Mermaid in a pearl shell', 'Sirène dans un coquillage', 'Sirena en una concha', 'Meerjungfrau in der Muschel', '贝壳里的美人鱼'), svg: mermaidClam() },
  { id: 'a8-sushi', cat: 'food', name: N('Happy sushi set', 'Sushis rigolos', 'Sushi felices', 'Fröhliches Sushi', '开心寿司拼盘'), svg: sushi() },
  { id: 'a8-solar-system', cat: 'space', name: N('Solar system', 'Système solaire', 'Sistema solar', 'Sonnensystem', '太阳系'), svg: solar() },
  { id: 'a8-shiba', cat: 'animals', name: N('Shiba in a scarf', 'Shiba en écharpe', 'Shiba con bufanda', 'Shiba mit Schal', '戴围巾的柴犬'), svg: shiba() },
  { id: 'a8-jet-ski', cat: 'vehicles', name: N('Jet ski on the waves', 'Jet-ski sur les vagues', 'Moto de agua en las olas', 'Jetski auf den Wellen', '浪花上的摩托艇'), svg: jetski() },
  { id: 'a8-fairy-butterfly', cat: 'princess', name: N('Fairy on a butterfly', 'Fée sur un papillon', 'Hada en una mariposa', 'Fee auf dem Schmetterling', '骑蝴蝶的小仙女'), svg: fairyFly() },
  { id: 'a8-plesiosaur', cat: 'dinosaurs', name: N('Plesiosaur in the sea', 'Plésiosaure dans la mer', 'Plesiosaurio en el mar', 'Plesiosaurier im Meer', '海里的蛇颈龙'), svg: plesio() },
  { id: 'a8-headphones', cat: 'hobbies', name: N('Headphones and music', 'Casque et musique', 'Auriculares y música', 'Kopfhörer und Musik', '耳机和音乐'), svg: headphones() },
  { id: 'a8-detective', cat: 'fantasy', name: N('Little detective', 'Petit détective', 'Pequeño detective', 'Kleiner Detektiv', '小侦探'), svg: detective() },
  { id: 'a8-diver', cat: 'ocean', name: N('Scuba diver', 'Petit plongeur', 'Buceador', 'Kleiner Taucher', '潜水员'), svg: diver() },
  { id: 'a8-unicorn-cake', cat: 'princess', name: N('Unicorn birthday cake', 'Gâteau licorne', 'Pastel de unicornio', 'Einhorn-Torte', '独角兽生日蛋糕'), svg: unicake() },
  { id: 'a8-lemur', cat: 'animals', name: N('Ring-tailed lemurs', 'Lémuriens à queue rayée', 'Lémures de cola anillada', 'Kattas auf dem Ast', '环尾狐猴'), svg: lemurs() },
  { id: 'a8-dumplings', cat: 'food', name: N('Dumplings in a steamer', 'Raviolis vapeur', 'Dumplings al vapor', 'Teigtaschen im Dämpfer', '蒸笼里的饺子'), svg: dumplings() },
  { id: 'a8-pixel-game', cat: 'patterns', name: N('Pixel game', 'Jeu en pixels', 'Juego de píxeles', 'Pixelspiel', '像素游戏'), svg: pixel() },
  { id: 'a8-space-surfer', cat: 'space', name: N('Space surfer', 'Surfeur spatial', 'Surfista espacial', 'Weltraum-Surfer', '太空冲浪'), svg: surfer() },
  { id: 'a8-puffins', cat: 'animals', name: N('Puffins on a cliff', 'Macareux sur la falaise', 'Frailecillos en el acantilado', 'Papageitaucher am Felsen', '悬崖上的海鹦'), svg: puffins() },
  { id: 'a8-lion-dance', cat: 'holidays', name: N('Lion dance', 'Danse du lion', 'Danza del león', 'Löwentanz', '舞狮'), svg: liondance() },
  { id: 'a8-terrarium', cat: 'nature', name: N('Little terrarium', 'Petit terrarium', 'Pequeño terrario', 'Kleines Terrarium', '迷你玻璃花园'), svg: terrarium() },
  { id: 'a8-cheerleader', cat: 'hobbies', name: N('Cheerleader jump', 'Saut de pom-pom girl', 'Salto de animadora', 'Cheerleader-Sprung', '啦啦队跳跃'), svg: cheer() },
  { id: 'a8-quad-bike', cat: 'vehicles', name: N('Quad bike in the mud', 'Quad dans la boue', 'Quad en el barro', 'Quad im Matsch', '泥地里的四轮车'), svg: quad() },
  { id: 'a8-friendship', cat: 'things', name: N('Friendship bracelets', 'Bracelets d’amitié', 'Pulseras de amistad', 'Freundschaftsbänder', '友谊手链'), svg: bracelets() },
  { id: 'a8-heart-mandala', cat: 'patterns', name: N('Heart mandala', 'Mandala cœur', 'Mandala de corazón', 'Herz-Mandala', '爱心曼陀罗'), svg: heartMandala() }
  ];
  });

  /* IntelloKids colouring – age 8, part B */
  PART(function () {
    const INK = '#1F3A44';
    const SW = 2.5;
    const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
    const R = `data-r fill="#fff" ${L}`;
    const N = v => Math.round(v * 10) / 10;
    const J = a => a.map(p => N(p[0]) + ' ' + N(p[1])).join(' ');
    const pg = a => `<polygon ${R} points="${J(a)}"/>`;
    const pa = d => `<path ${R} d="${d}"/>`;
    const ci = (x, y, r) => `<circle ${R} cx="${N(x)}" cy="${N(y)}" r="${N(r)}"/>`;
    const el = (x, y, rx, ry, a) => `<ellipse ${R} cx="${N(x)}" cy="${N(y)}" rx="${N(rx)}" ry="${N(ry)}"${a ? ` transform="rotate(${N(a)} ${N(x)} ${N(y)})"` : ''}/>`;
    const re = (x, y, w, h, r, a) => `<rect ${R} x="${N(x)}" y="${N(y)}" width="${N(w)}" height="${N(h)}"${r ? ` rx="${r}"` : ''}${a ? ` transform="rotate(${a} ${N(x + w / 2)} ${N(y + h / 2)})"` : ''}/>`;
    const ln = (d, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w || 1.7}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const dot = (x, y, r) => `<circle cx="${N(x)}" cy="${N(y)}" r="${r || 2}" fill="${INK}"/>`;
    const eye = (x, y, r) => { r = r || 4; return dot(x, y, r) + `<circle cx="${N(x + r * .35)}" cy="${N(y - r * .38)}" r="${N(r * .38)}" fill="#fff"/>`; };
    const sm = (x, y, w) => ln(`M${N(x - w)} ${N(y)}q${N(w)} ${N(w * .85)} ${N(2 * w)} 0`, 2);
    const shut = (x, y, w) => ln(`M${N(x - w)} ${N(y)}q${N(w)} ${N(w * .75)} ${N(2 * w)} 0`, 2);
    const g = (t, s) => `<g transform="${t}">${s}</g>`;
    const st = (cx, cy, ro, ri, k, rot) => { k = k || 5; rot = rot === undefined ? -90 : rot; let d = ''; for (let i = 0; i < 2 * k; i++) { const a = (rot + 180 * i / k) * Math.PI / 180, r = i % 2 ? ri : ro; d += (i ? 'L' : 'M') + N(cx + r * Math.cos(a)) + ' ' + N(cy + r * Math.sin(a)); } return d + 'Z'; };
    const ht = (x, y, s) => `M${N(x)} ${N(y + s)}C${N(x - 1.5 * s)} ${N(y + .1 * s)} ${N(x - s)} ${N(y - 1.1 * s)} ${N(x)} ${N(y - .4 * s)}C${N(x + s)} ${N(y - 1.1 * s)} ${N(x + 1.5 * s)} ${N(y + .1 * s)} ${N(x)} ${N(y + s)}Z`;
    // bumpy round flower outline (k petals)
    const flo = (x, y, r, k) => { k = k || 5; let d = ''; for (let i = 0; i < k; i++) { const a0 = 2 * Math.PI * i / k - Math.PI / 2, a1 = a0 + 2 * Math.PI / k, am = (a0 + a1) / 2, ri = r * .55; const P = (a, rr) => N(x + rr * Math.cos(a)) + ' ' + N(y + rr * Math.sin(a)); d += (i ? 'L' : 'M') + P(a0, ri) + 'Q' + P(am - .35, r * 1.25) + ' ' + P(am, r * 1.05) + 'Q' + P(am + .35, r * 1.25) + ' ' + P(a1, ri); } return d + 'Z'; };
    const cld = (x, y, s) => pa(`M${x} ${y}q${-4 * s} ${-22 * s} ${18 * s} ${-24 * s}q${6 * s} ${-18 * s} ${28 * s} ${-12 * s}q${18 * s} ${-8 * s} ${26 * s} ${12 * s}q${18 * s} ${4 * s} ${14 * s} ${24 * s}z`);
    // cubic bezier point + tangent angle
    const bz = (p, t) => { const u = 1 - t, x = u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6], y = u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7]; const dx = 3 * u * u * (p[2] - p[0]) + 6 * u * t * (p[4] - p[2]) + 3 * t * t * (p[6] - p[4]), dy = 3 * u * u * (p[3] - p[1]) + 6 * u * t * (p[5] - p[3]) + 3 * t * t * (p[7] - p[5]); return [x, y, Math.atan2(dy, dx)]; };
    // tapered tube around a bezier (w0 at start, w1 at end)
    const tube = (p, w0, w1, n) => { n = n || 12; const A = [], B = []; for (let i = 0; i <= n; i++) { const t = i / n, [x, y, a] = bz(p, t), w = (w0 + (w1 - w0) * t) / 2; A.push([x - w * Math.sin(a), y + w * Math.cos(a)]); B.unshift([x + w * Math.sin(a), y - w * Math.cos(a)]); } return pg(A.concat(B)); };
    // teardrop / leaf-scale with its tip pointing along angle a (degrees)
    const tear = (cx, cy, s, a, f) => { a *= Math.PI / 180; f = f || .62; const c = Math.cos(a), si = Math.sin(a), P = (u, v) => N(cx + u * c - v * si) + ' ' + N(cy + u * si + v * c); return pa(`M${P(s, 0)}C${P(.45 * s, -f * s)} ${P(-.75 * s, -.75 * s)} ${P(-.75 * s, 0)}C${P(-.75 * s, .75 * s)} ${P(.45 * s, f * s)} ${P(s, 0)}Z`); };
    // circle segment below level y (liquid in a round flask)
    const seg = (cx, cy, r, y) => { const dx = Math.sqrt(r * r - (y - cy) * (y - cy)); return pa(`M${N(cx - dx)} ${N(y)}A${r} ${r} 0 ${y < cy ? 1 : 0} 0 ${N(cx + dx)} ${N(y)}Z`); };
    const FR = re(10, 10, 280, 280, 16);

    const P = [];
    /* 1 princess library */
    P.push({ id: 'a8-princess-library', cat: 'princess', name: { en: 'Princess in the library', fr: 'Princesse à la bibliothèque', es: 'Princesa en la biblioteca', de: 'Prinzessin in der Bibliothek', zh: '图书馆里的公主' }, svg: (() => {
      let s = re(10, 10, 280, 280, 14) + pa('M10 226H290V276Q290 290 276 290H24Q10 290 10 276Z') + el(150, 264, 116, 19);
      s += pa('M110 108V62A40 40 0 0 1 190 62V108Z') + pa('M118 67V62A32 32 0 0 1 148 30.1V67Z') + pa('M152 67V30.1A32 32 0 0 1 182 62V67Z') + re(118, 71, 30, 31) + re(152, 71, 30, 31) + pa('M170 37A14 14 0 0 0 170 65A24 24 0 0 1 170 37Z');
      for (const x of [14, 202]) s += re(x, 24, 84, 202, 3) + re(x + 8, 34, 68, 58) + re(x + 8, 100, 68, 58) + re(x + 8, 166, 68, 52);
      const bk = (x, yb, ws) => ws.map(([w, h]) => { const r = re(x, yb - h, w, h, 1.5) + ln(`M${x + 4} ${yb - h + 7}h${w - 8}M${x + 4} ${yb - 7}h${w - 8}`); x += w + 1; return r; }).join('');
      s += bk(24, 92, [[14, 46], [13, 52], [16, 42]]) + pg([[70, 92], [84, 92], [77, 46], [63, 49]]);
      s += re(24, 146, 42, 12, 2) + re(27, 134, 36, 12, 2) + bk(70, 158, [[15, 46]]);
      s += bk(26, 218, [[13, 40], [15, 46], [13, 38]]);
      s += bk(212, 92, [[15, 44], [13, 52], [14, 40]]);
      s += bk(212, 158, [[14, 48], [13, 42]]) + re(242, 146, 34, 12, 2);
      s += pg([[214, 218], [228, 218], [237, 174], [223, 171]]) + bk(240, 218, [[14, 46], [13, 40]]);
      s += pa('M110 240V142Q110 114 150 114Q190 114 190 142V240Z') + re(97, 172, 27, 70, 10) + re(176, 172, 27, 70, 10);
      s += pa('M150 107C126 107 121 126 124 142C126 158 118 166 123 180Q137 175 150 179Q163 175 177 180C182 166 174 158 176 142C179 126 174 107 150 107Z');
      s += pa('M139 182Q112 202 103 248Q150 262 197 248Q188 202 161 182Z');
      s += pa('M135 151Q150 160 165 151L162 186Q150 190 138 186Z');
      s += pa('M138 151Q125 150 122 165L118 186Q124 193 131 188L135 167Z') + pa('M162 151Q175 150 178 165L182 186Q176 193 169 188L165 167Z');
      s += ci(150, 132, 17) + pa('M133 131Q133 112 151 112Q168 113 167 131Q158 122 148 118Q142 127 133 131Z') + pg([[136, 114], [138, 101], [144, 108], [150, 96], [156, 108], [162, 101], [164, 114]]);
      s += eye(143, 136, 2.8) + eye(157, 136, 2.8) + sm(150, 142, 4.5);
      s += pa('M111 176L150 182L189 176L192 209L150 217L108 209Z') + pa('M117 175Q135 170 150 180V207Q135 199 115 202Z') + pa('M183 175Q165 170 150 180V207Q165 199 185 202Z');
      s += ln('M124 182q10 -3 20 2M123 189q10 -3 21 2M156 184q10 -5 20 -2M156 191q10 -5 21 -2') + ci(115, 192, 6.5) + ci(185, 192, 6.5);
      return s;
    })() });

    /* 2 pangolin */
    P.push({ id: 'a8-pangolin', cat: 'animals', name: { en: 'Pangolin', fr: 'Pangolin', es: 'Pangolín', de: 'Schuppentier', zh: '穿山甲' }, svg: (() => {
      let s = FR + ci(48, 46, 20) + ln('M48 14v-6M48 78v6M16 46h-6M80 46h6M26 24l-4 -4M70 24l4 -4M26 68l-4 4M70 68l4 4', 2.5) + cld(178, 62, 1.1);
      s += pa('M10 240Q80 228 150 236T290 230V274Q290 290 274 290H26Q10 290 10 274Z');
      const lg = (x, y) => pa(`M${x - 14} ${y}V${y + 28}Q${x - 14} ${y + 40} ${x - 2} ${y + 40}H${x + 18}Q${x + 27} ${y + 39} ${x + 21} ${y + 30}Q${x + 14} ${y + 27} ${x + 14} ${y + 20}V${y}Z`) + ln(`M${x + 10} ${y + 34}v6M${x + 3} ${y + 34}v6`);
      s += lg(128, 222) + lg(220, 224) + lg(100, 226) + lg(192, 228);
      const A = [214, 218, 204, 152, 110, 136, 78, 194], B = [78, 194, 60, 226, 22, 242, 54, 272];
      const W = (k, t) => k ? 60 - 46 * t : 62 + 30 * Math.sin(Math.PI * t) - 2 * t;
      const side = [], oth = [];
      for (const k of [0, 1]) for (let i = k; i <= 10; i++) { const t = i / 10, [x, y, a] = bz(k ? B : A, t), w = W(k, t) * .44; side.push([x - w * Math.sin(a), y + w * Math.cos(a)]); oth.unshift([x + w * Math.sin(a), y - w * Math.cos(a)]); }
      s += pg(side.concat(oth));
      for (const k of [1, 0]) for (let i = k ? 7 : 9; i >= 1; i--) {
        const t = i / (k ? 7 : 9), [x, y, a] = bz(k ? B : A, t), w = W(k, t), n = Math.max(1, Math.round(w / 28)), d = w / n, o = (i % 2 ? .22 : -.22) * d;
        for (let j = 0; j < n; j++) { const v = (j - (n - 1) / 2) * d + (n > 1 ? o : 0); s += tear(x - v * Math.sin(a), y + v * Math.cos(a), Math.max(11, d * .72), a * 180 / Math.PI, .85); }
      }
      s += pa('M202 190C228 180 252 200 268 222C276 230 283 234 278 240C271 245 254 243 240 244C222 245 206 244 198 237C186 226 188 198 202 190Z');
      s += el(277, 236, 6.5, 5.5) + el(244, 232, 6.5, 4.5) + eye(236, 214, 4.5) + ln('M252 238q5 3 10 0', 2);
      s += ln('M272 256v-30M28 268v-26', 2.5) + pa(flo(272, 216, 14)) + ci(272, 216, 6.5) + pa(flo(28, 230, 13)) + ci(28, 230, 6);
      s += ln('M150 276l-4 -10M156 276l2 -11M162 276l6 -9M236 280l-4 -10M242 280l2 -11M248 280l6 -9');
      return s;
    })() });

    /* 3 shooting stars over a sleeping village */
    const house = (x, yb, w, h, rh, win) => {
      let r = re(x, yb - h, w, h), ax = x + w / 2, ay = yb - h - rh, L0 = x - 7, R0 = x + w + 7, B = yb - h;
      for (const f of (h > 42 ? [1, .68, .4] : [1, .52])) r += pg([[ax, ay], [ax + (L0 - ax) * f, ay + (B - ay) * f], [ax + (R0 - ax) * f, ay + (B - ay) * f]]);
      const dw = w * .26;
      r += pa(`M${N(x + w * .16)} ${yb}v${N(-h * .42)}a${N(dw / 2)} ${N(dw / 2)} 0 0 1 ${N(dw)} 0v${N(h * .42)}z`) + (win ? pa(`M${N(x + w * .56)} ${N(yb - h * .3)}v${N(-h * .3)}a${N(dw / 2)} ${N(dw / 2)} 0 0 1 ${N(dw)} 0v${N(h * .3)}z`) : '');
      return r;
    };
    // rotate local points (u along the tail, v across) around (x, y)
    const rp = (x, y, deg, a) => { const c = Math.cos(deg * Math.PI / 180), si = Math.sin(deg * Math.PI / 180); return a.map(([u, v]) => [x + u * c - v * si, y + u * si + v * c]); };
    P.push({ id: 'a8-shooting-stars', cat: 'space', name: { en: 'Shooting stars', fr: 'Étoiles filantes', es: 'Estrellas fugaces', de: 'Sternschnuppen', zh: '流星划过小镇' }, svg: (() => {
      let s = FR + pa('M238 26A40 40 0 0 0 238 106A56 56 0 0 1 238 26Z') + shut(207, 58, 5) + sm(212, 78, 6);
      const shoot = (x, y, Lg, ro) => { const e = Lg * .8; return pg(rp(x, y, 30, [[0, -18], [-e, -8], [-e - 5, -5], [-e, -2], [0, -6]])) + pg(rp(x, y, 30, [[0, -6.5], [-Lg, -3], [-Lg - 6, 0], [-Lg, 3], [0, 6.5]])) + pg(rp(x, y, 30, [[0, 6], [-e, 2], [-e - 5, 5], [-e, 8], [0, 18]])) + pa(st(x, y, ro, ro * .56, 5, -90)); };
      s += shoot(176, 98, 92, 19) + shoot(106, 50, 64, 15) + shoot(82, 150, 56, 15);
      for (const [x, y, r] of [[34, 64, 11], [154, 26, 11], [146, 150, 12], [226, 140, 12]]) s += pa(st(x, y, r, r * .62));
      s += dot(118, 112, 2.5) + dot(274, 124, 2.5) + dot(198, 26, 2.5) + dot(28, 112, 2.5) + dot(190, 156, 2.5);
      s += pa('M10 206Q80 168 150 192T290 182V274Q290 290 274 290H26Q10 290 10 274Z');
      s += house(148, 204, 46, 40, 30, 1) + house(232, 198, 42, 36, 28, 1);
      s += pa('M10 248Q110 216 200 238T290 234V274Q290 290 274 290H26Q10 290 10 274Z');
      s += re(114, 196, 12, 30) + ci(120, 184, 18) + re(124, 254, 12, 28) + ci(130, 240, 20);
      s += house(26, 270, 64, 48, 36, 1) + house(180, 272, 62, 46, 34, 1);
      return s;
    })() });

    /* 4 princess riding a horse */
    P.push({ id: 'a8-princess-horse', cat: 'princess', name: { en: 'Princess on horseback', fr: 'Princesse à cheval', es: 'Princesa a caballo', de: 'Prinzessin zu Pferd', zh: '骑马的公主' }, svg: (() => {
      let s = FR + ci(254, 44, 20) + cld(22, 72, 1.1) + pa('M10 206Q90 176 170 198T290 190V274Q290 290 274 290H26Q10 290 10 274Z');
      const leg = (x, d) => pa(`M${x} 190L${x + 2 + d} 250H${x + 18 + d}L${x + 22} 188Z`) + re(x - 1 + d, 248, 23, 12, 3);
      s += leg(120, 6) + leg(174, -6);
      for (let i = 0; i < 5; i++) s += el(80 - i * 3.5, 157 + i * 18, 11.5, 13, i % 2 ? -28 : 28);
      s += pa('M64 236Q50 260 66 270Q82 258 74 236Z');
      s += pa('M96 136C124 130 160 142 184 134C196 114 206 92 220 76L244 96C236 112 226 136 220 160C216 182 206 200 190 204C160 208 130 208 108 204C86 200 76 186 76 166C76 148 84 138 96 136Z');
      s += pa('M84 186C80 206 92 218 96 230L98 250H114L116 228C116 212 114 198 114 192Z') + re(94, 248, 23, 12, 3) + leg(194, 4);
      s += pa('M214 84C218 64 236 58 248 68C258 80 266 96 270 108C274 122 264 130 252 126C242 122 234 114 226 106C218 98 213 92 214 84Z') + el(260, 117, 12, 10, 25);
      s += eye(236, 84, 4) + dot(263, 114, 2) + ln('M250 124q5 3 9 0');
      for (let i = 0; i < 6; i++) { const t = i / 5; s += el(214 - 34 * t, 74 + 58 * t, 12, 8.5, i % 2 ? 30 : 75); }
      s += pg([[222, 76], [222, 48], [238, 68]]) + el(214, 70, 7, 10, -35);
      // princess sitting high on the saddle, gown draping
      s += pa(flo(144, 92, 22, 10)) + pa('M134 102H154L158 136H130Z') + ci(130, 108, 7.5) + ci(158, 108, 7.5);
      s += pa('M130 132Q110 150 108 176Q144 188 180 176Q178 150 158 132Z') + pa('M108 172Q117 181 126 175Q135 183 144 177Q153 183 162 175Q171 181 180 172L182 188Q171 196 162 190Q153 198 144 192Q135 198 126 190Q117 196 106 188Z');
      s += pa('M160 108Q170 120 178 116L182 124Q168 130 154 118Z') + ci(182, 119, 6.5);
      s += ci(144, 86, 14) + pg([[132, 75], [133, 60], [139, 68], [144, 56], [149, 68], [155, 60], [156, 75]]) + eye(138, 87, 2.6) + eye(150, 87, 2.6) + sm(144, 94, 3.8);
      s += ln('M188 118Q224 108 254 116');
      for (const [x, y, r] of [[34, 252, 14], [86, 274, 13], [238, 270, 14], [272, 236, 13], [160, 272, 13]]) s += pa(flo(x, y, r, 6)) + ci(x, y, r * .45);
      return s;
    })() });

    /* 5 potion shelf */
    P.push({ id: 'a8-potion-shop', cat: 'fantasy', name: { en: 'Magic potion shelf', fr: 'Étagère de potions', es: 'Estante de pociones', de: 'Zaubertrank-Regal', zh: '魔法药水架' }, svg: (() => {
      let s = re(10, 10, 280, 280, 14) + ln('M126 10v12M174 10v12') + re(108, 20, 84, 34, 10) + pa(st(150, 37, 13, 7.5)) + re(16, 100, 268, 12, 4) + re(16, 180, 268, 12, 4) + re(16, 264, 268, 12, 4);
      s += ci(56, 76, 22) + seg(56, 76, 22, 78) + re(48, 42, 16, 16) + re(45, 32, 22, 12, 4) + ci(76, 36, 6) + ci(86, 22, 5.5);
      s += pa('M100 100V62Q100 50 112 48V40H124V48Q136 50 136 62V100Z') + re(108, 30, 20, 12, 4) + pa(ht(118, 76, 10));
      s += re(154, 64, 44, 36, 10) + re(150, 56, 52, 12, 5) + ci(176, 50, 6) + pa(st(168, 84, 10, 6)) + pa(st(186, 80, 9, 5.5));
      s += pa(st(244, 80, 26, 15)) + re(236, 40, 16, 16) + re(233, 30, 22, 12, 4);
      s += pg([[38, 180], [94, 180], [74, 136], [74, 118], [58, 118], [58, 136]]) + pg([[44.5, 166], [87.5, 166], [94, 180], [38, 180]]) + pg([[51, 152], [81, 152], [87.5, 166], [44.5, 166]]) + re(54, 106, 24, 14, 4);
      s += pa(ht(140, 154, 22)) + pa(ht(140, 156, 11)) + re(133, 118, 14, 12) + re(130, 108, 20, 12, 4);
      s += pa('M188 180V140Q188 124 204 122V114H220V122Q236 124 236 140V180Z') + re(188, 160, 48, 20) + re(188, 145, 48, 15) + re(200, 102, 24, 13, 4);
      s += pg([[254, 180], [278, 180], [282, 160], [266, 144], [250, 160]]) + pg([[266, 144], [282, 160], [266, 162], [250, 160]]);
      s += re(26, 248, 70, 16, 3) + re(32, 232, 60, 16, 3) + re(36, 210, 54, 22, 3) + pa(st(63, 221, 9, 5.5));
      s += ci(150, 238, 26) + seg(150, 238, 26, 242) + ci(150, 206, 12) + re(144, 184, 12, 14) + re(140, 174, 20, 12, 4);
      s += re(214, 214, 22, 50, 3) + el(225, 264, 22, 6) + pa('M225 186Q236 200 232 208Q228 214 225 214Q222 214 218 208Q214 200 225 186Z') + re(252, 232, 26, 32, 8) + re(256, 222, 18, 12, 4);
      s += ci(196, 244, 6) + ci(204, 226, 5.5) + ci(110, 156, 6);
      return s;
    })() });

    /* 6 hero team */
    P.push({ id: 'a8-hero-team', cat: 'fantasy', name: { en: 'Hero team', fr: 'Équipe de héros', es: 'Equipo de héroes', de: 'Heldenteam', zh: '小英雄战队' }, svg: (() => {
      let s = FR + ci(256, 44, 18) + cld(128, 50, .85);
      s += re(12, 126, 40, 114) + re(128, 74, 44, 166) + re(254, 104, 36, 136);
      for (const [x, y] of [[19, 138], [33, 138], [137, 86], [151, 86], [137, 112], [151, 112], [137, 138], [151, 138], [261, 118], [275, 118]]) s += re(x, y, 12, 16, 2);
      s += pa('M10 232H290V256H10Z') + re(10, 252, 280, 12, 3) + pa('M10 264H290V274Q290 290 274 290H26Q10 290 10 274Z');
      // hero A: curly hair, heart emblem, fist up
      s += pa('M74 112Q42 150 36 228Q54 218 68 230Q84 218 98 230Q114 218 130 228Q128 160 104 112Z') + pa(flo(88, 100, 26, 11));
      s += re(72, 168, 15, 52, 4) + re(89, 168, 15, 52, 4) + re(68, 212, 21, 28, 7) + re(87, 212, 21, 28, 7);
      s += pa('M68 116Q88 108 108 116V172H68Z') + re(66, 160, 44, 12, 3) + pa(ht(88, 136, 11));
      s += pg([[66, 116], [77, 125], [60, 86], [49, 90]]) + ci(53, 81, 9) + pa('M104 116Q126 122 124 142L110 162L102 154L112 141Q112 131 104 129Z');
      s += ci(88, 92, 19) + pa('M69 92Q70 70 88 70Q106 70 107 92Q100 80 88 80Q76 80 69 92Z');
      s += pa('M70 90Q88 82 106 90Q107 101 97 100Q88 96 79 100Q69 101 70 90Z') + eye(80, 92, 3) + eye(96, 92, 3) + sm(88, 104, 5);
      // hero B: side fringe, comet emblem, hands on hips
      s += pa('M198 112Q172 160 172 228Q186 218 200 230Q216 218 230 230Q246 218 266 226Q258 150 226 112Z');
      s += re(196, 168, 15, 52, 4) + re(213, 168, 15, 52, 4) + re(192, 212, 21, 28, 7) + re(211, 212, 21, 28, 7);
      s += pa('M192 116Q212 108 232 116V172H192Z') + re(190, 160, 44, 12, 3) + ci(212, 136, 15) + pa(st(216, 132, 9, 5.4)) + ln('M209 136l-7 6M213 140l-6 6M206 132l-7 3', 2);
      s += pa('M194 116Q172 122 174 142L188 162L196 154L186 141Q186 131 194 129Z') + pa('M230 116Q252 122 250 142L236 162L228 154L238 141Q238 131 230 129Z');
      s += ci(212, 92, 19) + pa('M193 94Q188 68 212 68Q236 68 231 94Q228 82 220 78Q208 90 193 94Z');
      s += pa('M194 90Q212 82 230 90Q231 101 221 100Q212 96 203 100Q193 101 194 90Z') + eye(204, 92, 3) + eye(220, 92, 3) + sm(212, 104, 5);
      return s;
    })() });

    /* 7 kelp forest */
    // vertical band of an ellipse between x1 and x2 (stripes on a round body)
    const band = (cx, cy, rx, ry, x1, x2) => { const h = x => ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)); return pa(`M${N(x1)} ${N(cy - h(x1))}A${rx} ${ry} 0 0 1 ${N(x2)} ${N(cy - h(x2))}V${N(cy + h(x2))}A${rx} ${ry} 0 0 1 ${N(x1)} ${N(cy + h(x1))}Z`); };
    const fish = (x, y, rx, ry, k) => pg([[x - rx * .8 * k, y], [x - (rx + 18) * k, y - 14], [x - (rx + 18) * k, y + 14]]) + el(x, y, rx, ry) + eye(x + rx * .5 * k, y - 3, 3) + sm(x + rx * .72 * k, y + 5, 2.5);
    P.push({ id: 'a8-kelp-forest', cat: 'ocean', name: { en: 'Kelp forest', fr: 'Forêt de varech', es: 'Bosque de algas', de: 'Kelpwald', zh: '海带森林' }, svg: (() => {
      let s = FR + pa('M10 44Q45 32 80 44T150 44T220 44T290 44V26Q290 10 274 10H26Q10 10 10 26Z') + pa('M10 238Q70 224 140 236T290 230V274Q290 290 274 290H26Q10 290 10 274Z');
      for (const [x, d, top] of [[42, 20, 58], [114, -18, 70], [196, 16, 60], [262, -14, 76]]) {
        const p = [x, 252, x + d, 190, x - d, 110, x + d * .6, top];
        s += tube(p, 11, 8, 10);
        [[.32, 1], [.55, -1], [.78, 1]].forEach(([t, k]) => { const [bx, by, a] = bz(p, t), ad = a * 180 / Math.PI; const b = a + k * 1.05; s += tear(bx + 14 * Math.cos(b), by + 14 * Math.sin(b), 25, b * 180 / Math.PI, .5); });
      }
      s += pa('M10 246Q16 214 44 218Q62 206 78 224Q92 230 90 250Z') + pa('M210 248Q216 220 240 222Q262 214 270 236L272 252Z');
      // urchins
      for (const [x, y] of [[50, 226], [244, 230]]) s += pa(st(x, y, 21, 14, 13)) + ci(x, y, 14) + eye(x - 5, y - 2, 2.4) + eye(x + 5, y - 2, 2.4) + sm(x, y + 4, 3);
      // big striped fish
      s += pg([[118, 128], [94, 108], [94, 148]]) + pa('M140 102Q156 80 172 100Z') + el(150, 128, 36, 25) + band(150, 128, 36, 25, 126, 138) + band(150, 128, 36, 25, 152, 164);
      s += eye(172, 122, 4) + sm(176, 134, 3.5);
      s += fish(212, 168, 18, 11, -1) + fish(70, 92, 17, 11, 1) + fish(250, 112, 15, 10, -1);
      for (const [x, y, r] of [[186, 92, 6.5], [194, 72, 7.5], [100, 64, 6], [146, 190, 7]]) s += ci(x, y, r);
      s += el(150, 262, 14, 9) + el(118, 270, 10, 7) + ln('M144 262l12 0M146 257l8 0');
      return s;
    })() });

    /* 8 princess ice skater */
    P.push({ id: 'a8-ice-skater', cat: 'princess', name: { en: 'Princess ice skater', fr: 'Princesse patineuse', es: 'Princesa patinadora', de: 'Eisprinzessin auf Kufen', zh: '滑冰公主' }, svg: (() => {
      let s = FR + pa('M256 24A16 16 0 1 0 272 48A13 13 0 1 1 256 24Z');
      const G = [10, 28, 90, 84, 200, 6, 290, 46]; s += ln('M10 28C90 84 200 6 290 46', 2);
      [.07, .2, .33, .62, .76, .9].forEach(t => { const [x, y] = bz(G, t); s += el(x, y + 8, 6.5, 9); });
      for (const [x, b] of [[38, 214], [262, 214]]) s += re(x - 6, b - 18, 12, 20) + pg([[x - 30, b - 14], [x + 30, b - 14], [x, b - 58]]) + pg([[x - 24, b - 46], [x + 24, b - 46], [x, b - 86]]) + pg([[x - 17, b - 76], [x + 17, b - 76], [x, b - 108]]);
      s += el(150, 252, 140, 36) + el(150, 254, 124, 26);
      s += ln('M60 258q20 -10 44 -2M188 262q24 6 46 -4M118 272q16 4 30 0', 1.7);
      // skater
      s += ci(150, 63, 11);
      s += tube([140, 112, 114, 90, 118, 52, 144, 38], 11, 9, 8) + tube([160, 112, 186, 90, 182, 52, 156, 38], 11, 9, 8) + ci(150, 36, 8);
      s += pg([[139, 172], [151, 172], [148, 234], [136, 234]]) + pg([[150, 172], [162, 172], [176, 230], [164, 233]]);
      s += re(128, 228, 22, 15, 6) + re(162, 226, 22, 15, 6, -14) + ln('M126 248h26M163 246l24 -6', 2.5);
      s += pa('M138 104Q150 99 162 104L161 142H139Z');
      for (let i = 0; i < 5; i++) { const w0 = 139 + 4.4 * i, w1 = w0 + 4.4, h0 = 98 + 21 * i, h1 = h0 + 21, y = x => 176 - 10 * Math.sin((x - 98) / 104 * Math.PI) + (x - 98) * .08; s += pa(`M${N(w0)} 140L${N(w1)} 140L${h1} ${N(y(h1))}Q${N((h0 + h1) / 2)} ${N(y((h0 + h1) / 2) + 9)} ${h0} ${N(y(h0))}Z`); }
      s += ci(150, 86, 16) + pa('M134 84Q136 66 150 66Q164 66 166 84Q158 74 150 74Q142 74 134 84Z') + pg([[141, 69], [143, 60], [147, 65], [150, 57], [153, 65], [157, 60], [159, 69]]);
      s += shut(144, 89, 3.2) + shut(156, 89, 3.2) + sm(150, 96, 4);
      s += ln('M92 128q-10 20 0 40M208 128q10 20 0 40M80 140q-6 14 0 26M220 140q6 14 0 26', 2);
      for (const [x, y, r] of [[96, 96, 10], [208, 92, 10], [70, 196, 9], [232, 186, 9]]) s += pa(st(x, y, r, r * .62, 4, -90));
      return s;
    })() });

    /* 9 lemonade stand */
    P.push({ id: 'a8-lemonade-stand', cat: 'food', name: { en: 'Lemonade stand', fr: 'Stand de limonade', es: 'Puesto de limonada', de: 'Limonadenstand', zh: '柠檬水小摊' }, svg: (() => {
      let s = FR + ci(262, 30, 14) + ln('M262 10v-2M240 30h-4M246 14l-3 -3M246 46l-3 3', 2.5) + cld(20, 42, .7);
      s += pa('M10 236H290V274Q290 290 274 290H26Q10 290 10 274Z');
      s += re(49, 70, 14, 170) + re(237, 70, 14, 170);
      s += re(112, 16, 76, 30, 8) + pa('M131 32L136 29Q140 21 150 21Q160 21 164 29L169 32L164 35Q160 43 150 43Q140 43 136 35Z') + el(161, 19, 8, 4.5, -25) + ln('M124 46v6M176 46v6', 2.5);
      s += re(34, 48, 232, 12, 5);
      for (let i = 0; i < 6; i++) { const x = 38 + i * 37.3, w = 37.3; s += pa(`M${N(x)} 58H${N(x + w)}V88Q${N(x + w / 2)} 108 ${N(x)} 88Z`); }
      s += re(30, 150, 240, 16, 4);
      for (let i = 0; i < 5; i++) s += re(40 + i * 44, 166, 44, 72);
      s += ci(150, 200, 18) + ci(150, 200, 11) + ln('M150 189v22M139 200h22M142 192l16 16M158 192l-16 16', 1.5);
      // pitcher
      s += pa('M74 150V108Q74 98 84 98H112Q118 98 118 108V150Z') + pa('M78 118H114V146H78Z') + pg([[112, 98], [126, 90], [118, 108]]) + pa('M74 108Q56 110 58 126Q60 140 74 140V132Q66 130 66 124Q66 116 74 116Z') + ci(96, 128, 9);
      // glasses
      for (const x of [138, 172]) s += ln(`M${x + 16} 112L${x + 26} 84`, 3) + pg([[x, 106], [x + 26, 106], [x + 23, 150], [x + 3, 150]]) + pg([[x + 1.4, 120], [x + 24.6, 120], [x + 23, 150], [x + 3, 150]]);
      // lemon bowl
      s += el(220, 124, 12, 9, -20) + el(246, 124, 12, 9, 20) + el(233, 114, 12, 9) + pa('M206 128H260Q258 150 233 150Q208 150 206 128Z');
      s += el(222, 248, 11, 8, -15) + el(244, 246, 11, 8, 10) + el(264, 249, 11, 8, -5) + re(206, 250, 72, 30, 4) + dot(216, 265, 2.5) + dot(268, 265, 2.5);
      return s;
    })() });

    /* 10 kawaii school supplies */
    const face = (x, y, k) => { k = k || 1; return eye(x - 7 * k, y, 2.8 * k) + eye(x + 7 * k, y, 2.8 * k) + sm(x, y + 5 * k, 3 * k); };
    P.push({ id: 'a8-pencil-case', cat: 'things', name: { en: 'Kawaii school supplies', fr: 'Fournitures kawaii', es: 'Material escolar kawaii', de: 'Kawaii-Schulsachen', zh: '萌萌文具' }, svg: (() => {
      let s = FR;
      // pencil (tip up, 3 facets)
      s += pg([[64, 64], [92, 64], [78, 26]]) + pg([[64, 64], [73, 64], [78, 26]]) + `<path d="M74.5 37L78 26L81.5 37Q78 39 74.5 37Z" fill="${INK}"/>`;
      s += re(64, 64, 9, 130) + re(73, 64, 10, 130) + re(83, 64, 9, 130) + face(78, 96, .8);
      // ruler
      s += re(100, 44, 30, 150, 3) + ln('M100 60h9M100 74h6M100 88h9M100 102h6M100 116h9M100 130h6M100 144h9M100 158h6') + face(118, 72, .7);
      // crayon
      s += pa('M140 70L152 40L164 70Z') + re(138, 70, 28, 124, 3) + re(138, 84, 28, 18) + re(138, 150, 28, 18) + face(152, 120, .8);
      // glue stick
      s += re(174, 66, 32, 34, 8) + re(176, 96, 28, 98, 4) + re(180, 112, 20, 34, 4) + face(190, 160, .75);
      // paint brush
      s += pa('M218 64Q216 40 226 26Q236 40 234 64Z') + re(217, 62, 18, 22, 2) + re(220, 82, 12, 112, 6);
      // pouch
      s += pa('M30 196Q30 180 50 180H250Q270 180 270 196V252Q270 272 250 272H50Q30 272 30 252Z') + re(42, 174, 216, 14, 7) + re(238, 184, 14, 24, 5);
      for (const [x, y] of [[54, 206], [92, 246], [212, 246], [250, 222], [56, 252], [200, 204]]) s += ci(x, y, 7.5);
      s += el(118, 240, 10, 6.5) + el(182, 240, 10, 6.5) + face(150, 226, 1.8);
      // stickers + eraser
      s += pa(st(34, 40, 18, 11)) + pa(ht(268, 36, 14)) + re(240, 100, 46, 30, 7, 10) + re(255, 97, 22, 36, 2, 10) + face(266, 115, .6);
      return s;
    })() });

    /* 11 toucan */
    // points along a bezier between t0 and t1
    const bpts = (p, t0, t1, n) => { n = n || 6; const a = []; for (let i = 0; i <= n; i++) a.push(bz(p, t0 + (t1 - t0) * i / n)); return a; };
    const bstrip = (U, D, t0, t1) => pg(bpts(U, t0, t1).concat(bpts(D, t0, t1).reverse()));
    // leaf split along its midrib into two regions (base x,y, angle a, length Lg, half-width w)
    const leaf = (x, y, a, Lg, w) => { const P = (u, v) => J(rp(x, y, a, [[u, v]])); return [-1, 1].map(k => pa(`M${P(0, 0)}C${P(Lg * .25, k * w * 1.3)} ${P(Lg * .75, k * w)} ${P(Lg, 0)}Z`)).join(''); };
    P.push({ id: 'a8-toucan', cat: 'animals', name: { en: 'Toucan in the jungle', fr: 'Toucan dans la jungle', es: 'Tucán en la selva', de: 'Tukan im Dschungel', zh: '丛林里的巨嘴鸟' }, svg: (() => {
      let s = FR + leaf(14, 150, -55, 122, 30) + leaf(236, 12, 150, 84, 22) + leaf(290, 196, 200, 100, 26) + leaf(290, 284, 222, 92, 24) + leaf(14, 268, -18, 96, 24);
      s += pa('M104 196L92 264Q106 272 120 264L128 200Z');
      s += tube([10, 238, 100, 228, 200, 216, 290, 208], 20, 15, 10);
      s += el(126, 158, 38, 56, 12) + ci(148, 100, 30) + pa('M150 112C172 126 172 162 152 186C138 166 134 136 150 112Z') + tear(114, 168, 34, 98, .7);
      s += el(161, 94, 13, 11) + eye(163, 94, 5);
      const U = [172, 72, 206, 58, 246, 76, 270, 118], M = [172, 100, 206, 94, 240, 102, 270, 118], D = [172, 118, 204, 130, 240, 126, 270, 118];
      s += bstrip(U, M, 0, .32) + bstrip(U, M, .32, .68) + bstrip(U, M, .68, 1) + bstrip(M, D, 0, .55) + bstrip(M, D, .55, 1);
      s += el(120, 220, 9, 5.5) + el(139, 219, 9, 5.5);
      s += pa(flo(256, 168, 17)) + ci(256, 168, 7) + pa(flo(44, 214, 14)) + ci(44, 214, 6);
      for (const [x, y] of [[214, 236], [228, 244], [216, 252]]) s += ci(x, y, 7);
      s += ln('M206 222q8 6 8 14M222 226q4 8 6 18');
      return s;
    })() });

    /* 12 bowling */
    const pin = (x, yb, h) => { const w = h * .19, Y = f => N(yb - f * h), X = f => N(x + f * w); return pa(`M${X(-.5)} ${yb}Q${X(-1.4)} ${Y(.32)} ${X(-.4)} ${Y(.68)}C${X(-.85)} ${Y(.8)} ${X(-.6)} ${Y(1)} ${x} ${Y(1)}C${X(.6)} ${Y(1)} ${X(.85)} ${Y(.8)} ${X(.4)} ${Y(.68)}Q${X(1.4)} ${Y(.32)} ${X(.5)} ${yb}Z`) + pa(`M${X(-.74)} ${Y(.53)}Q${x} ${Y(.5)} ${X(.74)} ${Y(.53)}L${X(.44)} ${Y(.66)}Q${x} ${Y(.63)} ${X(-.44)} ${Y(.66)}Z`); };
    // stripe across a circle between heights y1..y2, turned by a degrees
    const cband = (cx, cy, r, y1, y2, a) => { const hx = y => Math.sqrt(r * r - (y - cy) ** 2); return `<path ${R} d="M${N(cx - hx(y1))} ${y1}H${N(cx + hx(y1))}A${r} ${r} 0 0 1 ${N(cx + hx(y2))} ${y2}H${N(cx - hx(y2))}A${r} ${r} 0 0 1 ${N(cx - hx(y1))} ${y1}Z" transform="rotate(${a} ${cx} ${cy})"/>`; };
    P.push({ id: 'a8-bowling', cat: 'hobbies', name: { en: 'Bowling strike', fr: 'Partie de bowling', es: 'Pleno en los bolos', de: 'Bowling-Strike', zh: '保龄球全中' }, svg: (() => {
      let s = FR + re(10, 10, 280, 22) + re(96, 40, 108, 40, 8);
      for (const x of [120, 150, 180]) s += pa(st(x, 60, 12, 7));
      s += pa('M10 132H290V274Q290 290 274 290H26Q10 290 10 274Z') + pg([[10, 290], [32, 290], [96, 132], [84, 132]]) + pg([[290, 290], [268, 290], [204, 132], [216, 132]]);
      for (let i = 0; i < 6; i++) s += pg([[32 + 39.3 * i, 290], [32 + 39.3 * (i + 1), 290], [96 + 18 * (i + 1), 132], [96 + 18 * i, 132]]);
      s += `<path d="M150 236l-6 10h12zM118 238l-6 10h12zM182 238l-6 10h12z" fill="${INK}"/>`;
      s += pin(116, 152, 84) + pin(150, 150, 84) + pin(184, 152, 84) + pin(133, 168, 90) + pin(167, 168, 90);
      s += g('rotate(38 238 116)', pin(238, 156, 80));
      s += ln('M206 168l-14 6M212 180l-12 10M262 156l12 8', 2.5);
      for (const [x, y, r] of [[268, 76, 13], [206, 92, 10], [272, 196, 11]]) s += pa(st(x, y, r, r * .6));
      s += ci(98, 226, 46) + cband(98, 226, 46, 196, 212, -28) + cband(98, 226, 46, 226, 240, -28) + dot(112, 194, 4.5) + dot(126, 202, 4.5) + dot(116, 210, 4.5);
      s += ci(246, 254, 24) + cband(246, 254, 24, 246, 260, 20);
      return s;
    })() });

    /* 13 ballet class */
    const tutu = (x, y, rx) => { let d = `M${x - rx} ${y}Q${x} ${y - 16} ${x + rx} ${y}`; for (let i = 0; i < 6; i++) { const x0 = x + rx - i * rx / 3, x1 = x0 - rx / 3; d += `Q${N((x0 + x1) / 2)} ${y + 13} ${N(x1)} ${y}`; } return pa(d + 'Z'); };
    P.push({ id: 'a8-ballet-class', cat: 'princess', name: { en: 'Ballet class', fr: 'Cours de danse', es: 'Clase de ballet', de: 'Ballettstunde', zh: '芭蕾舞课' }, svg: (() => {
      let s = FR;
      for (const x of [20, 107, 194]) s += re(x, 24, 86, 150, 4) + ln(`M${x + 12} 58l22 -22M${x + 12} 78l38 -38`, 2);
      s += pa('M10 196H290V218H10Z') + pa('M10 218H290V242H10Z') + pa('M10 242H290V266H10Z') + pa('M10 266H290V274Q290 290 274 290H26Q10 290 10 274Z');
      s += re(54, 134, 12, 28, 3) + re(234, 134, 12, 28, 3) + re(14, 124, 272, 11, 5);
      // dancer 1: bun, hand on the barre, leg in passé
      s += ci(86, 50, 10) + tube([76, 102, 62, 110, 54, 118, 48, 126], 11, 10, 6) + ci(48, 128, 6.5) + tube([96, 102, 118, 88, 120, 62, 102, 44], 11, 10, 6) + ci(100, 43, 6.5);
      s += pg([[76, 148], [89, 148], [87, 232], [76, 232]]) + pg([[87, 148], [100, 148], [124, 172], [120, 183], [96, 200], [89, 190], [110, 176]]) + el(81, 236, 10, 6) + el(92, 196, 7.5, 6, -30);
      s += pa('M73 94Q86 88 99 94L98 146H74Z') + tutu(86, 150, 38) + tutu(86, 146, 27);
      s += ci(86, 74, 17) + pa('M69 74Q70 56 86 56Q102 56 103 74Q95 65 86 65Q77 65 69 74Z') + eye(79, 77, 2.8) + eye(93, 77, 2.8) + sm(86, 85, 4);
      // dancer 2: long side braids, arms in fifth position
      s += tube([200, 102, 178, 86, 180, 54, 204, 40], 11, 10, 6) + tube([224, 102, 246, 86, 244, 54, 220, 40], 11, 10, 6) + ci(212, 38, 8);
      s += pg([[200, 148], [212, 148], [211, 232], [200, 232]]) + pg([[212, 148], [224, 148], [224, 232], [213, 232]]) + el(199, 236, 11, 6, -12) + el(225, 236, 11, 6, 12);
      s += pa('M199 94Q212 88 225 94L224 146H200Z') + tutu(212, 150, 38) + tutu(212, 146, 27);
      s += ci(212, 74, 17) + pa('M195 76Q194 56 212 56Q230 56 229 76Q222 64 212 63Q202 64 195 76Z') + eye(205, 77, 2.8) + eye(219, 77, 2.8) + sm(212, 85, 4);
      for (const k of [-1, 1]) { for (let i = 0; i < 4; i++) s += el(212 + k * (17 + i * .8), 92 + i * 12, 6.5 - i * .3, 7.5, k * -12); s += pa(ht(212 + k * 20, 140, 6)); }
      // ballet bag
      s += ln('M136 248Q150 222 164 248', 3) + re(128, 244, 44, 30, 8) + pa('M128 254Q150 266 172 254V250Q150 262 128 250Z');
      return s;
    })() });

    /* 14 kid inventor */
    const gear = (cx, cy, r, n) => { const a = []; for (let j = 0; j < 4 * n; j++) { const t = 2 * Math.PI * (j + .5) / (4 * n), rr = j % 4 === 1 || j % 4 === 2 ? r + 8 : r; a.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)]); } return pg(a) + ci(cx, cy, r * .45) + dot(cx, cy, 3.5); };
    P.push({ id: 'a8-inventor', cat: 'things', name: { en: 'Kid inventor', fr: 'Jeune inventrice', es: 'Pequeña inventora', de: 'Kleine Erfinderin', zh: '小发明家' }, svg: (() => {
      let s = FR + pa('M10 232H290V274Q290 290 274 290H26Q10 290 10 274Z');
      s += gear(50, 54, 28, 10) + gear(114, 36, 15, 7) + gear(250, 56, 24, 9);
      s += ci(176, 66, 15) + re(169, 79, 14, 9, 2) + ln('M176 42v-8M156 52l-6 -4M196 52l6 -4M154 70h-8M198 70h8', 2.5) + ln('M171 72q5 -10 10 0');
      // workbench + contraption
      s += re(196, 204, 54, 28, 5) + re(180, 180, 10, 52) + re(268, 180, 10, 52) + re(170, 170, 116, 12, 3);
      s += ln('M206 122V100M248 122l10 -26', 2.5) + ci(206, 94, 8) + ci(258, 92, 9) + re(190, 122, 72, 48, 7) + ci(212, 144, 12) + ci(242, 140, 9) + ci(242, 160, 6.5) + ln('M212 144l6 -7');
      // kid
      s += el(82, 114, 11, 18, 25) + ci(104, 124, 19) + pa('M85 124Q86 104 104 104Q122 104 123 124Q116 112 104 112Q92 112 85 124Z');
      s += ci(96, 110, 7.5) + ci(112, 110, 7.5) + ln('M89 110h-4M119 110h4M103.5 110h1') + eye(97, 127, 3) + eye(111, 127, 3) + sm(104, 134, 4.5);
      s += re(88, 214, 12, 26) + re(108, 214, 12, 26) + el(92, 244, 12, 6.5) + el(118, 244, 12, 6.5);
      s += tube([82, 150, 72, 166, 70, 180, 70, 196], 12, 11, 6) + ci(70, 199, 6.5);
      s += pg([[96, 146], [112, 146], [111, 216], [97, 216]]) + pg([[84, 148], [98, 145], [98, 220], [76, 220]]) + pg([[124, 148], [110, 145], [110, 220], [132, 220]]) + re(114, 186, 13, 14, 2);
      s += tube([124, 150, 136, 144, 142, 132, 146, 122], 12, 11, 6);
      s += re(144, 84, 9, 40, 4) + pa('M145 66.6V77H152V66.6A11 11 0 1 1 145 66.6Z') + ci(147, 122, 7);
      return s;
    })() });

    /* 15 leaf tiles */
    P.push({ id: 'a8-leaf-pattern', cat: 'patterns', name: { en: 'Leaf tiles', fr: 'Carreaux de feuilles', es: 'Azulejos de hojas', de: 'Blätterfliesen', zh: '树叶花砖' }, svg: (() => {
      let s = re(10, 10, 280, 280, 14);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        const x = 14 + i * 92, y = 14 + j * 92, f = (i + j) % 2, round = (i * 3 + j) % 3 === 1;
        s += re(x + 2, y + 2, 84, 84, 10);
        const bx = f ? x + 72 : x + 16, a = f ? -135 : -45;
        s += ln(`M${bx} ${y + 72}l${f ? 6 : -6} 6`, 3) + leaf(bx, y + 72, a, 76, round ? 27 : 21);
        const P2 = (u, v) => J(rp(bx, y + 72, a, [[u, v]]));
        s += ln(`M${P2(22, 0)}L${P2(32, 9)}M${P2(38, 0)}L${P2(48, 8)}M${P2(22, 0)}L${P2(32, -9)}M${P2(38, 0)}L${P2(48, -8)}`);
        const c1 = f ? [x + 20, y + 20] : [x + 68, y + 68], c2 = f ? [x + 68, y + 68] : [x + 20, y + 20];
        s += ci(c1[0], c1[1], 8) + ci(c2[0], c2[1], 8);
      }
      for (const x of [104, 196]) for (const y of [104, 196]) s += pa(st(x, y, 14, 8, 4, -90));
      return s;
    })() });

    /* 16 beach huts */
    P.push({ id: 'a8-beach-huts', cat: 'ocean', name: { en: 'Striped beach huts', fr: 'Cabanes de plage rayées', es: 'Casetas de playa', de: 'Bunte Strandhütten', zh: '彩条海滩小屋' }, svg: (() => {
      let s = FR + ci(254, 38, 17) + ln('M254 12v-2M228 38h-4M236 20l-3 -3M272 20l3 -3M236 56l-3 3M272 56l3 3', 2.5) + cld(20, 56, .8) + ln('M120 34q6 -6 12 0q6 -6 12 0M164 48q5 -5 10 0q5 -5 10 0', 2);
      s += pa('M10 104Q45 96 80 104T150 104T220 104T290 104V176H10Z') + pa('M10 170Q80 162 150 172T290 168V274Q290 290 274 290H26Q10 290 10 274Z');
      for (let k = 0; k < 3; k++) {
        const x = 17 + k * 92, h = k % 2 ? 'H' : 'V';
        s += ln(`M${x + 38} 84V66`, 2.5) + pg([[x + 38, 66], [x + 58, 72], [x + 38, 78]]);
        for (const dx of [0, 12.5, 50.5, 63]) s += re(x + dx, 118, 12.5, 106);
        s += re(x + 25, 118, 26, 34) + ci(x + 38, 135, 9.5) + pa(`M${x + 25} 224V168A13 13 0 0 1 ${x + 51} 168V224Z`) + dot(x + 45, 198, 2.5);
        s += k % 2 ? pa(`M${x - 6} 120Q${x + 38} 70 ${x + 82} 120Z`) : pg([[x - 6, 120], [x + 82, 120], [x + 38, 84]]);
        s += re(x - 4, 224, 84, 12, 4);
      }
      s += pa('M188 266L196 248H222L230 266Z') + ln('M196 248Q209 234 222 248', 2) + pg([[240, 272], [246, 242], [252, 242], [258, 272]]);
      s += re(30, 250, 96, 30, 4) + re(30, 250, 32, 30) + re(94, 250, 32, 30);
      return s;
    })() });

    /* 17 alpaca with a patterned blanket */
    // fluffy bumpy ellipse outline
    const fluff = (cx, cy, rx, ry, k) => { let d = ''; for (let i = 0; i < k; i++) { const a0 = 2 * Math.PI * i / k, a1 = 2 * Math.PI * (i + 1) / k, am = (a0 + a1) / 2, P = (a, f) => N(cx + rx * f * Math.cos(a)) + ' ' + N(cy + ry * f * Math.sin(a)); d += (i ? '' : 'M' + P(a0, 1)) + 'Q' + P(am, 1.16) + ' ' + P(a1, 1); } return pa(d + 'Z'); };
    const qp = (x0, y0, cx, cy, x1, y1, n) => { const a = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; a.push([u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]); } return a; };
    // fluffy tube along a bezier: scalloped wool on both sides
    const ftube = (p, w0, w1, n) => { const A = [], B = [], C = []; for (let i = 0; i <= n; i++) { const t = i / n, [x, y, a] = bz(p, t), w = (w0 + (w1 - w0) * t) / 2; C.push([x, y]); A.push([x - w * Math.sin(a), y + w * Math.cos(a)]); B.push([x + w * Math.sin(a), y - w * Math.cos(a)]); }
      const side = (S, rev) => { let d = ''; for (let j = 1; j <= n; j++) { const i0 = rev ? n - j + 1 : j - 1, i1 = rev ? n - j : j, m = [(S[i0][0] + S[i1][0]) / 2, (S[i0][1] + S[i1][1]) / 2], c = [(C[i0][0] + C[i1][0]) / 2, (C[i0][1] + C[i1][1]) / 2], k = 8 / (Math.hypot(m[0] - c[0], m[1] - c[1]) || 1); d += 'Q' + J([[m[0] + (m[0] - c[0]) * k, m[1] + (m[1] - c[1]) * k], S[i1]]); } return d; };
      return pa('M' + J([A[0]]) + side(A, 0) + 'L' + J([B[n]]) + side(B, 1) + 'Z'); };
    P.push({ id: 'a8-alpaca', cat: 'animals', name: { en: 'Alpaca with a blanket', fr: 'Alpaga et sa couverture', es: 'Alpaca con manta', de: 'Alpaka mit Decke', zh: '披毯子的羊驼' }, svg: (() => {
      let s = FR + ci(46, 44, 17) + pg([[10, 172], [10, 128], [70, 60], [150, 172]]) + pg([[70, 60], [55.8, 86], [63, 81], [70, 89], [78, 81], [88.9, 86]]) + pg([[140, 172], [256, 74], [290, 108], [290, 172]]) + pg([[256, 74], [230, 96], [240, 91], [248, 99], [258, 91], [268, 97], [278, 96]]);
      s += pa('M10 172Q90 156 170 168T290 164V274Q290 290 274 290H26Q10 290 10 274Z');
      const leg = x => re(x, 196, 13, 52, 5) + re(x - 1.5, 244, 16, 10, 4) + ln(`M${x + 6.5} 247v7`);
      s += leg(100) + leg(158) + leg(80) + leg(176) + fluff(60, 166, 12, 14, 6);
      s += fluff(126, 178, 68, 34, 16);
      s += pa('M90 140Q128 126 166 140L168 188Q128 200 88 188Z');
      const zz = []; for (let i = 0; i <= 8; i++) zz.push([167.6 - i * 9.95, i % 2 ? 176 : 168]);
      s += pg(qp(89, 156, 128, 142, 167, 156, 8).concat(zz)) + pg(qp(90, 140, 128, 126, 166, 140, 8).concat(qp(89, 156, 128, 142, 167, 156, 8).reverse()));
      for (const x of [99, 119, 139, 159]) { const t = (x - 88) / 80; s += ci(x, 195 + 24 * t * (1 - t), 6.5); }
      s += ftube([180, 178, 200, 146, 184, 118, 208, 94], 44, 34, 6);
      s += el(199, 56, 6.5, 18, -22) + el(231, 56, 6.5, 18, 22) + el(215, 86, 21, 25) + fluff(215, 63, 16, 10, 9);
      s += el(215, 102, 13, 9) + el(199, 96, 6.5, 4.5) + el(231, 96, 6.5, 4.5) + eye(207, 85, 4) + eye(223, 85, 4) + ln('M211 99q4 3 8 0M215 102v4', 2) + sm(215, 106, 4);
      for (const [x, y, r] of [[30, 262, 12], [262, 254, 13], [212, 272, 11]]) s += ln(`M${x} ${y + r}v10`, 2.5) + pa(flo(x, y, r)) + ci(x, y, r * .45);
      return s;
    })() });

    /* 18 mochi and dango */
    const mface = (x, y, k) => eye(x - 9 * k, y, 3 * k) + eye(x + 9 * k, y, 3 * k) + sm(x, y + 5 * k, 3.2 * k);
    P.push({ id: 'a8-mochi', cat: 'food', name: { en: 'Mochi and dango', fr: 'Mochis et dangos', es: 'Mochis y dangos', de: 'Mochi und Dango', zh: '麻糬和团子' }, svg: (() => {
      let s = FR + ci(64, 64, 44) + ci(64, 64, 34) + ln('M64 30v68M30 64h68', 2.5);
      for (const [x, y] of [[176, 40], [262, 34], [236, 92]]) s += pa(flo(x, y, 13)) + ci(x, y, 5.5);
      s += pa('M10 176H290V206H10Z') + pa('M10 206H290V240H10Z') + pa('M10 240H290V274Q290 290 274 290H26Q10 290 10 274Z');
      s += ln('M280 136Q298 140 292 158Q288 168 276 164', 3.5) + pg([[226, 150], [204, 126], [212, 122], [232, 140]]) + el(252, 150, 30, 23) + pa('M234 132Q252 112 270 132Z') + ci(252, 116, 6);
      // tea cup on saucer
      s += el(236, 240, 42, 12) + pa('M206 172H266Q266 222 236 228Q206 222 206 172Z') + pa('M207 188H265Q264 200 260 206H212Q208 200 207 188Z') + el(236, 172, 30, 7) + ln('M226 160q-6 -10 0 -18M244 160q-6 -10 0 -18', 2);
      // plate + mochi
      s += el(118, 236, 100, 26) + el(118, 232, 82, 18);
      s += pa('M40 232Q34 196 64 192Q94 196 88 232Z') + pa('M30 226Q34 204 54 202Q48 220 60 232H34Z') + mface(68, 214, .8);
      s += pa('M96 236Q88 188 124 186Q160 188 152 236Z') + el(104, 222, 7, 4.5) + el(144, 222, 7, 4.5) + mface(124, 214, 1);
      s += pa('M156 234Q150 202 176 198Q202 202 196 234Z') + pa('M164 196Q164 174 176 168Q188 174 188 196Q176 204 164 196Z') + pg([[166, 172], [176, 162], [186, 172], [176, 178]]) + mface(176, 218, .75);
      // dango skewer
      s += g('rotate(-28 150 120)', re(146, 40, 9, 160, 4) + ci(150, 74, 19) + ci(150, 112, 19) + ci(150, 150, 19)) + mface(134, 79, .65) + mface(152, 113, .65) + mface(170, 147, .65);
      return s;
    })() });

    /* 19 DJ decks */
    const note = (x, y) => ln(`M${x + 7} ${y}v-26l14 6`, 2.5) + el(x, y, 8, 6, -20);
    P.push({ id: 'a8-dj-decks', cat: 'hobbies', name: { en: 'DJ decks', fr: 'Platines de DJ', es: 'Mesa de DJ', de: 'DJ-Pult', zh: 'DJ打碟台' }, svg: (() => {
      let s = FR + ln('M150 10v14', 2.5) + ci(150, 46, 22) + cband(150, 46, 22, 30, 40, 0) + cband(150, 46, 22, 52, 62, 0) + re(143, 20, 14, 8, 2);
      s += ln('M122 66l-26 30M178 66l26 30M136 72l-10 28M164 72l10 28', 2) + note(84, 54) + note(206, 50) + note(40, 100);
      // speakers
      for (const x of [14, 230]) s += re(x, 112, 56, 166, 6) + ci(x + 28, 148, 20) + ci(x + 28, 148, 10) + ci(x + 28, 214, 22) + ci(x + 28, 214, 11) + ci(x + 28, 256, 8);
      // desk
      s += re(66, 186, 168, 92, 4) + re(60, 172, 180, 16, 4);
      for (let i = 0; i < 6; i++) { const h = [26, 40, 32, 48, 22, 36][i]; s += re(98 + i * 18, 262 - h, 14, h, 2); }
      // turntables
      for (const x of [64, 168]) s += re(x, 114, 68, 58, 6) + ci(x + 32, 143, 25) + ci(x + 32, 143, 16) + ci(x + 32, 143, 7) + ln(`M${x + 62} 120v18l-12 14`, 3) + dot(x + 62, 120, 3);
      s += re(132, 118, 36, 54, 4) + ci(142, 130, 5.5) + ci(158, 130, 5.5) + re(138, 142, 8, 22, 2) + re(154, 142, 8, 22, 2);
      return s;
    })() });

    /* 20 Santa's sleigh */
    P.push({ id: 'a8-santa-sleigh', cat: 'holidays', name: { en: "Santa's sleigh", fr: 'Le traîneau du père Noël', es: 'El trineo de Papá Noel', de: 'Der Schlitten vom Weihnachtsmann', zh: '圣诞老人的雪橇' }, svg: (() => {
      let s = FR + ci(226, 70, 40);
      for (const [x, y, r] of [[40, 34, 11], [126, 30, 10], [172, 44, 9], [276, 168, 9], [26, 96, 9]]) s += pa(st(x, y, r, r * .6));
      // rooftops with snow
      s += re(30, 198, 16, 40) + pa('M26 202Q28 192 38 194Q48 190 50 202Z') + re(226, 210, 16, 40) + pa('M222 214Q224 204 234 206Q244 202 246 214Z');
      s += pg([[10, 290], [10, 236], [70, 210], [130, 236], [130, 290]]) + pa('M10 236L70 210L130 236Q118 244 104 238Q92 246 80 238Q66 246 54 238Q40 246 26 238Q18 244 10 240Z');
      s += pg([[110, 290], [110, 250], [180, 222], [250, 250], [250, 290]]) + pa('M110 250L180 222L250 250Q238 258 224 252Q210 260 196 252Q182 260 168 252Q154 260 140 252Q126 260 110 254Z');
      s += pg([[230, 290], [230, 240], [290, 214], [290, 290]]) + re(160, 262, 22, 22, 3) + re(54, 254, 22, 22, 3) + re(256, 254, 20, 22, 3);
      // reindeer
      s += pa('M258 98L250 80L242 82L238 72L246 70L250 75L252 62L260 64L258 80L264 96Z') + pa('M270 98L274 80L268 74L274 70L278 76L284 66L290 70L282 82L278 98Z');
      s += pg([[244, 146], [262, 162], [268, 156], [252, 140]]) + pg([[206, 146], [190, 162], [184, 156], [200, 140]]) + el(192, 130, 8, 5.5, -30);
      s += pg([[244, 128], [256, 104], [272, 110], [262, 142]]) + el(224, 138, 36, 18, -10);
      s += pg([[246, 148], [262, 172], [270, 168], [256, 144]]) + pg([[212, 150], [198, 172], [190, 168], [204, 146]]);
      s += el(254, 100, 9, 5, -35) + el(268, 108, 16, 12, -15) + ci(283, 113, 6) + eye(268, 104, 3.2) + sm(273, 115, 3);
      // sack of presents, santa
      s += re(64, 100, 20, 20, 3) + re(88, 94, 18, 22, 3) + pa('M58 136Q52 108 80 108Q106 108 102 136Z') + ln('M74 100v20M64 110h20M97 94v22M88 105h18', 2);
      s += pa('M108 134Q110 114 128 114Q146 114 148 134Z') + ci(128, 98, 14);
      s += pa('M115 98Q114 124 128 128Q142 124 141 98Q134 108 128 108Q122 108 115 98Z') + ln('M121 104q7 -4 7 0q0 -4 7 0', 1.7) + eye(122, 94, 2.5) + eye(134, 94, 2.5);
      s += pa('M116 86C114 64 140 60 142 86Z') + pa('M122 72Q108 60 94 70L100 76Q110 70 120 80Z') + ci(95, 75, 6.5) + re(112, 82, 32, 10, 5);
      // sleigh
      s += ln('M28 206H150Q168 206 172 192M66 196v10M132 196v10', 3.5);
      s += pa('M30 136Q20 114 36 110Q50 112 46 134Z') + pa('M36 132H156Q166 132 166 146Q164 180 138 194H62Q38 192 36 162Z') + pa('M54 146H148Q148 170 132 180H70Q54 176 54 146Z') + ci(168, 134, 11) + ln('M168 134m-4 0a4 4 0 1 1 4 4');
      s += tube([144, 120, 150, 126, 156, 128, 162, 126], 11, 10, 4) + ci(166, 125, 6.5) + ln('M170 126Q210 132 246 142M170 128Q206 146 250 150', 1.7);
      s += pa(st(101, 163, 10, 6));
      return s;
    })() });

    /* 21 Eid moon */
    const lantern = (x, y) => ln(`M${x} 10V${y}`, 2) + ln(`M${x} ${y}m-4 4a4 4 0 1 0 8 0a4 4 0 1 0 -8 0`, 2) + pg([[x - 16, y + 24], [x + 16, y + 24], [x, y + 8]]) + pg([[x - 16, y + 24], [x + 16, y + 24], [x + 20, y + 44], [x + 16, y + 64], [x - 16, y + 64], [x - 20, y + 44]]) + pa(`M${x - 8} ${y + 58}V${y + 38}A8 8 0 0 1 ${x + 8} ${y + 38}V${y + 58}Z`) + pg([[x - 16, y + 64], [x + 16, y + 64], [x + 8, y + 76], [x - 8, y + 76]]);
    P.push({ id: 'a8-eid-moon', cat: 'holidays', name: { en: 'Eid moon and stars', fr: "Lune et étoiles de l'Aïd", es: 'Luna y estrellas de Eid', de: 'Eid-Mond und Sterne', zh: '开斋节的弯月和星星' }, svg: (() => {
      let s = FR;
      const G = [10, 22, 90, 62, 210, 62, 290, 22]; s += ln('M10 22C90 62 210 62 290 22', 2);
      [.1, .23, .36, .5, .64, .77, .9].forEach((t, i) => { const [x, y] = bz(G, t); s += i % 2 ? pg([[x - 11, y - 1], [x + 11, y - 1], [x, y + 22]]) : pa(st(x, y + 11, 13, 7.5)); });
      s += lantern(52, 70) + lantern(250, 84);
      s += pa('M150 72A64 64 0 1 0 202 172A52 52 0 1 1 150 72Z');
      for (const [x, y, r] of [[105, 108, 9], [94, 136, 8.5], [97, 164, 8.5], [111, 188, 8.5]]) s += ci(x, y, r);
      s += pa(st(196, 110, 22, 12)) + pa(st(232, 40, 10, 6)) + pa(st(28, 172, 10, 6)) + pa(st(276, 178, 9, 5.5));
      // skyline with domes
      s += re(20, 214, 44, 76) + pa('M20 214Q42 178 64 214Z') + re(236, 206, 44, 84) + pa('M236 206Q258 170 280 206Z');
      s += re(64, 232, 54, 58) + re(182, 232, 54, 58) + re(118, 222, 64, 68) + pa('M118 222Q150 170 182 222Z');
      for (const x of [34, 250]) s += pa(`M${x} 270V250A8 8 0 0 1 ${x + 16} 250V270Z`);
      for (const x of [132, 156]) s += pa(`M${x} 270V248A6 6 0 0 1 ${x + 12} 248V270Z`);
      return s;
    })() });

    /* 22 wildflowers in a mason jar */
    P.push({ id: 'a8-wildflower-jar', cat: 'nature', name: { en: 'Wildflowers in a jar', fr: 'Fleurs des champs en bocal', es: 'Flores silvestres en tarro', de: 'Wildblumen im Glas', zh: '玻璃罐里的野花' }, svg: (() => {
      let s = FR + pa('M10 238H290V274Q290 290 274 290H26Q10 290 10 274Z');
      s += ln('M150 124V72M138 124L98 98M162 124L206 74M128 124L62 70M172 124L250 92M144 124L108 48M156 124L238 136', 2.5);
      for (const [x, y, a] of [[118, 104, -30], [186, 96, 35], [208, 124, 20], [92, 86, -40]]) s += el(x, y, 14, 7, a);
      // lavender sprigs
      for (const [x0, y0, x1, y1] of [[128, 124, 62, 70], [172, 124, 250, 92]]) { const a = Math.atan2(y1 - y0, x1 - x0); for (let i = 0; i < 4; i++) s += el(x1 - (i * 11 - 4) * Math.cos(a), y1 - (i * 11 - 4) * Math.sin(a), 8.5, 6, a * 180 / Math.PI); }
      s += pa(flo(150, 66, 21, 12)) + ci(150, 66, 9) + pa(flo(108, 44, 15, 10)) + ci(108, 44, 6.5);
      s += pa(flo(96, 100, 18, 5)) + ci(96, 100, 7) + pa(flo(206, 70, 18, 5)) + ci(206, 70, 7);
      s += pa(st(240, 138, 18, 11, 8)) + ci(240, 138, 6.5);
      // jar
      s += pa('M100 152Q100 140 112 138H188Q200 140 200 152V250Q200 264 186 264H114Q100 264 100 250Z') + pa('M103 194Q150 186 197 194V250Q197 261 186 261H114Q103 261 103 250Z');
      s += ln('M112 160v22M120 156v8', 2.5) + re(104, 120, 92, 20, 5) + re(100, 142, 100, 13, 3);
      s += el(134, 154, 15, 9, -18) + el(166, 154, 15, 9, 18) + pg([[146, 156], [134, 182], [142, 178], [146, 186], [150, 160]]) + pg([[154, 156], [166, 182], [158, 178], [154, 186], [150, 160]]) + ci(150, 152, 7);
      s += el(58, 262, 10, 6, 20) + el(244, 270, 10, 6, -25) + el(80, 276, 9, 5.5, -10);
      return s;
    })() });

    /* 23 hair accessories */
    // puffy scrunchie ring split into k segments
    const scr = (cx, cy, ro, ri, k) => { let s = ''; const P = (a, r) => N(cx + r * Math.cos(a)) + ' ' + N(cy + r * Math.sin(a)); for (let i = 0; i < k; i++) { const a0 = 2 * Math.PI * i / k, a1 = 2 * Math.PI * (i + 1) / k; s += pa(`M${P(a0, ri)}L${P(a0, ro)}Q${P((a0 + a1) / 2, ro * 1.24)} ${P(a1, ro)}L${P(a1, ri)}A${ri} ${ri} 0 0 0 ${P(a0, ri)}Z`); } return s; };
    const ring = (x, y, r1, r2) => `<path ${R} fill-rule="evenodd" d="M${x - r1} ${y}a${r1} ${r1} 0 1 0 ${2 * r1} 0a${r1} ${r1} 0 1 0 ${-2 * r1} 0ZM${x - r2} ${y}a${r2} ${r2} 0 1 0 ${2 * r2} 0a${r2} ${r2} 0 1 0 ${-2 * r2} 0Z"/>`;
    P.push({ id: 'a8-hair-accessories', cat: 'things', name: { en: 'Bows, clips and scrunchies', fr: 'Nœuds, barrettes et chouchous', es: 'Lazos, pinzas y coleteros', de: 'Schleifen, Spangen, Haargummis', zh: '蝴蝶结、发夹和发圈' }, svg: (() => {
      let s = FR;
      const H = (a, r) => [150 + r * Math.cos(a * Math.PI / 180), 190 + r * Math.sin(a * Math.PI / 180)];
      s += pa(`M${J([H(203, 134)])}A134 134 0 0 1 ${J([H(337, 134)])}L${J([H(337, 118)])}A118 118 0 0 0 ${J([H(203, 118)])}Z`);
      for (const a of [228, 250, 270, 290, 312]) { const [x, y] = H(a, 126); s += a % 20 === 10 ? pa(ht(x, y, 9.5)) : ci(x, y, 7.5); }
      // big bow
      const bx = 150, by = 132;
      s += pg([[bx - 6, by + 8], [bx - 26, by + 50], [bx - 16, by + 46], [bx - 10, by + 56], [bx + 2, by + 10]]) + pg([[bx + 6, by + 8], [bx + 26, by + 50], [bx + 16, by + 46], [bx + 10, by + 56], [bx - 2, by + 10]]);
      s += pa(`M${bx} ${by}C${bx - 22} ${by - 36} ${bx - 56} ${by - 28} ${bx - 52} ${by}C${bx - 56} ${by + 28} ${bx - 22} ${by + 36} ${bx} ${by}Z`) + pa(`M${bx} ${by}C${bx + 22} ${by - 36} ${bx + 56} ${by - 28} ${bx + 52} ${by}C${bx + 56} ${by + 28} ${bx + 22} ${by + 36} ${bx} ${by}Z`) + el(bx, by, 10, 13);
      for (const [dx, dy] of [[-36, -8], [-24, 6], [-40, 10], [-26, -14]]) s += dot(bx + dx, by + dy, 2.6) + dot(bx - dx, by + dy, 2.6);
      s += scr(62, 222, 32, 15, 8) + scr(240, 226, 30, 14, 7);
      // snap clips
      const clip = (x, y, a, hrt) => g(`rotate(${a} ${x} ${y})`, pa(`M${x - 36} ${y}Q${x - 32} ${y - 13} ${x} ${y - 11}L${x + 34} ${y - 4}Q${x + 41} ${y} ${x + 34} ${y + 4}L${x} ${y + 11}Q${x - 32} ${y + 13} ${x - 36} ${y}Z`) + (hrt ? pa(ht(x - 12, y, 6.5)) : pa(st(x - 12, y, 8.5, 5))));
      s += clip(150, 214, -12, 1) + clip(150, 252, 8, 0);
      s += ring(266, 36, 15, 8) + ring(34, 36, 15, 8) + re(96, 268, 34, 10, 5) + pa(st(113, 270, 14, 8.5));
      s += re(178, 268, 72, 14, 4) + ln('M184 282v6M192 282v6M200 282v6M208 282v6M216 282v6M224 282v6M232 282v6M240 282v6', 2.5);
      return s;
    })() });

    /* 24 feathered raptor */
    P.push({ id: 'a8-velociraptor', cat: 'dinosaurs', name: { en: 'Feathered raptor', fr: 'Raptor à plumes', es: 'Raptor con plumas', de: 'Gefiederter Raptor', zh: '羽毛迅猛龙' }, svg: (() => {
      let s = FR + ci(252, 40, 17) + cld(14, 60, .8) + leaf(26, 248, -76, 88, 18) + leaf(274, 244, -104, 80, 17);
      s += pa('M10 234Q90 222 170 232T290 228V274Q290 290 274 290H26Q10 290 10 274Z') + pa('M222 240Q226 222 246 224Q264 220 268 240Z');
      // strong bird-like leg with a three-toed foot
      const leg = d => { const fx = 156 + d, fy = 246; return el(146 + d, 176, 15, 22, -20) + pg([[149 + d, 190], [163 + d, 195], [154 + d, 224], [161 + d, 246], [150 + d, 248], [141 + d, 224]]) + pa(`M${fx - 12} ${fy - 2}Q${fx} ${fy - 6} ${fx + 8} ${fy - 2}L${fx + 24} ${fy}Q${fx + 30} ${fy + 3} ${fx + 24} ${fy + 7}L${fx + 14} ${fy + 7}L${fx + 20} ${fy + 11}Q${fx + 23} ${fy + 15} ${fx + 17} ${fy + 15}L${fx + 4} ${fy + 12}L${fx} ${fy + 15}Q${fx - 6} ${fy + 16} ${fx - 7} ${fy + 11}L${fx - 9} ${fy + 6}Q${fx - 16} ${fy + 4} ${fx - 12} ${fy - 2}Z`); };
      s += leg(22);
      // long stiff tail with feather tip and pattern
      const T = [124, 152, 94, 146, 64, 136, 36, 128];
      for (const a of [205, 180, 155]) { const r = a * Math.PI / 180; s += tear(44 + 10 * Math.cos(r), 128 + 10 * Math.sin(r), 19, a, .6); }
      s += tube(T, 30, 10, 10);
      for (const t of [.3, .6]) { const [x, y, a] = bz(T, t); s += tear(x, y, 12 - 4 * t, a * 180 / Math.PI + 180, .65); }
      // slim S-shaped body and neck
      s += pa('M112 140C138 126 160 128 176 122C188 118 192 108 198 100L216 108C210 118 212 130 204 142C198 156 188 166 170 170C150 176 126 172 112 162C102 157 101 145 112 140Z');
      for (const [x, y] of [[132, 146], [152, 140], [170, 133]]) s += tear(x, y, 12, 195, .6);
      // head, crest, face
      for (const [x, y, a] of [[198, 90, -150], [204, 84, -128], [213, 82, -104]]) s += tear(x, y, 15, a, .6);
      s += el(220, 100, 26, 17, -6) + eye(226, 95, 5.5) + dot(242, 98, 1.8) + ln('M220 110q12 7 24 -2', 2) + el(216, 108, 6, 4, -6);
      // feathered arm wing
      s += tube([190, 136, 196, 148, 202, 156, 210, 162], 12, 10, 4);
      for (const [x, y, a] of [[186, 160, 120], [194, 166, 105], [202, 170, 90], [210, 170, 75]]) s += tear(x, y, 14, a, .6);
      s += leg(0);
      return s;
    })() });

    /* 25 lobster in a rock pool */
    // smooth irregular stone through 7 jittered points
    const stone = (cx, cy, rx, ry, j) => { const f = [1, .72, .95, .8, .68, 1, .78], q = []; for (let i = 0; i < 7; i++) { const a = 2 * Math.PI * i / 7 + j; q.push([cx + rx * f[(i + j) % 7] * Math.cos(a), cy + ry * f[(i + j) % 7] * Math.sin(a)]); } const m = (a, b) => N((a[0] + b[0]) / 2) + ' ' + N((a[1] + b[1]) / 2); let d = 'M' + m(q[6], q[0]); for (let i = 0; i < 7; i++) d += 'Q' + J([q[i]]) + ' ' + m(q[i], q[(i + 1) % 7]); return pa(d + 'Z'); };
    P.push({ id: 'a8-lobster', cat: 'ocean', name: { en: 'Lobster in a rock pool', fr: 'Homard dans une flaque', es: 'Langosta en una charca', de: 'Hummer im Felsenbecken', zh: '岩石池里的龙虾' }, svg: (() => {
      let s = FR + ln('M60 150q8 -5 16 0q8 5 16 0M212 140q8 -5 16 0q8 5 16 0M70 56q10 -6 20 0q10 6 20 0M190 44q10 -6 20 0q10 6 20 0M96 196q7 -4 14 0', 2);
      s += pa('M10 26Q10 10 26 10H46Q56 40 48 70Q40 110 52 150Q58 200 50 236Q60 262 90 256Q150 266 210 256Q242 262 252 236Q244 200 250 150Q260 110 252 70Q246 40 254 10H274Q290 10 290 26V274Q290 290 274 290H26Q10 290 10 274Z');
      for (const [x, y, rx, ry, j] of [[33, 36, 23, 25, 0], [29, 90, 20, 29, 1], [35, 142, 25, 24, 2], [29, 194, 20, 29, 3], [37, 247, 28, 25, 4], [90, 273, 33, 18, 5], [148, 277, 28, 14, 6], [205, 273, 33, 18, 0], [263, 247, 28, 25, 1], [271, 194, 20, 29, 2], [265, 142, 25, 24, 3], [271, 90, 20, 29, 4], [267, 36, 23, 25, 5]]) s += stone(x, y, rx, ry, j);
      s += stone(70, 250, 17, 12, 2) + stone(232, 250, 17, 12, 4);
      // seaweed, shells, pebbles, bubbles
      s += tube([66, 246, 58, 220, 76, 200, 64, 172], 14, 7, 8) + tube([80, 246, 88, 226, 76, 210, 86, 192], 11, 6, 6) + tube([234, 246, 244, 222, 226, 204, 240, 180], 14, 7, 8);
      s += pa('M90 244L78 226Q82 216 90 218Q96 210 104 214Q112 210 116 218Q124 216 126 226L114 244Z') + ln('M102 240v-20M96 240l-7 -16M108 240l7 -16', 1.7);
      s += el(208, 234, 14, 11) + ln('M208 234m-6 0a6 5 0 1 1 6 5a3 3 0 1 1 -1 -5', 1.7) + el(186, 248, 9, 6.5) + el(224, 214, 8, 6);
      s += ci(218, 118, 6.5) + ci(226, 100, 5.5) + ci(84, 112, 6);
      // lobster: antennae, legs, tail fan, tail segments, claws, body
      s += ln('M142 96Q120 60 92 40M158 96Q180 60 208 40', 2.5) + ln('M124 140h-24l-6 10M124 152h-22l-6 10M124 164h-20l-6 10M176 140h24l6 10M176 152h22l6 10M176 164h20l6 10', 3);
      s += el(150, 252, 11, 16) + el(132, 246, 10, 15, 30) + el(168, 246, 10, 15, -30);
      for (let i = 4; i >= 0; i--) { const w = 50 - i * 4; s += re(150 - w / 2, 160 + i * 16, w, 22, 9); }
      for (const k of [-1, 1]) s += tube([150 + k * 18, 118, 150 + k * 34, 104, 150 + k * 44, 94, 150 + k * 52, 82], 14, 12, 6) + el(150 + k * 66, 62, 16, 25, k * 25) + el(150 + k * 48, 46, 8, 18, k * 10);
      s += el(150, 128, 32, 40) + ci(136, 94, 8) + ci(164, 94, 8) + eye(136, 94, 4) + eye(164, 94, 4) + sm(150, 112, 6) + el(130, 118, 6.5, 4.5) + el(170, 118, 6.5, 4.5);
      return s;
    })() });

    /* 26 snowboarder */
    const pine = (x, b, s) => re(x - 5 * s, b - 14 * s, 10 * s, 16 * s) + pg([[x - 24 * s, b - 10 * s], [x + 24 * s, b - 10 * s], [x, b - 46 * s]]) + pg([[x - 18 * s, b - 34 * s], [x + 18 * s, b - 34 * s], [x, b - 66 * s]]);
    P.push({ id: 'a8-snowboarder', cat: 'hobbies', name: { en: 'Snowboarder', fr: 'Snowboardeur', es: 'Snowboarder', de: 'Snowboarder', zh: '单板滑雪' }, svg: (() => {
      let s = FR + ci(250, 42, 17) + ln('M250 16v-2M224 42h-4M232 24l-3 -3M268 24l3 -3M232 60l-3 3', 2.5);
      s += pg([[100, 170], [176, 62], [250, 170]]) + pg([[176, 62], [158, 88], [168, 94], [178, 84], [188, 94], [196, 90]]) + pg([[190, 180], [262, 84], [290, 120], [290, 180]]) + pg([[262, 84], [248, 104], [258, 110], [266, 100], [278, 106]]);
      s += pa('M10 116Q150 130 290 210V274Q290 290 274 290H26Q10 290 10 274Z');
      s += pine(36, 126, 1) + pine(78, 128, .8) + pine(262, 268, 1);
      s += ln('M220 254V202', 3) + pg([[220, 202], [246, 210], [220, 220]]);
      s += ci(84, 182, 11) + ci(70, 170, 9) + ci(70, 192, 8);
      // snowboarder
      s += g('rotate(22 152 200)', re(94, 192, 116, 18, 9) + pa(st(104, 201, 7, 4.5)) + pa(st(150, 201, 7, 4.5)) + pa(st(198, 201, 7, 4.5)));
      s += tube([126, 182, 116, 166, 124, 150, 140, 146], 15, 14, 6) + tube([174, 200, 182, 182, 172, 162, 158, 148], 15, 14, 6);
      s += el(127, 188, 12, 8, 22) + el(173, 206, 12, 8, 22);
      s += tube([140, 114, 124, 118, 110, 122, 98, 124], 13, 12, 6) + ci(94, 125, 7.5) + tube([164, 112, 180, 106, 194, 100, 204, 92], 13, 12, 6) + ci(208, 90, 7.5);
      s += pg([[136, 106], [166, 102], [172, 152], [132, 154]]) + pg([[134.3, 126], [168.6, 122], [170, 136], [133.4, 138]]);
      s += pa('M136 104Q114 96 98 104L104 112Q118 106 134 114Z') + re(136, 100, 30, 10, 5);
      s += ci(151, 84, 16) + pa('M135 80Q136 60 151 60Q166 60 167 80Z') + ci(151, 56, 7) + re(134, 76, 34, 9, 4.5) + el(151, 73, 13, 6) + eye(145, 88, 2.8) + eye(157, 88, 2.8) + sm(151, 95, 4);
      return s;
    })() });

    return P;
  });

  const [a, b] = parts, list = a.slice(0, 3);
  for (let i = 3, j = 0; i < a.length || j < b.length; i++, j++) {
    if (j < b.length) list.push(b[j]);
    if (i < a.length) list.push(a[i]);
  }
  Colouring.addPack(8, list);
})();
