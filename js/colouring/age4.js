/* Colouring pictures for age 4: one object or character plus one simple background element (hill, cloud, sun, pond…),
   8–15 big parts, stroke 5, cute faces. Format: see Colouring.addPack in js/colouring.js.
   Regions = data-r fill="#fff"; decorations = INK or fill="none". The first 3 are the ones open while IK_CONFIG.limits applies.
   Original art only. Rotated parts sit inside a rotated <g>, never a transform on the region itself (the fill pop animates transform). */
(function () {
  const INK = '#1F3A44', SW = 5;
  const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
  const R = `data-r fill="#fff" ${L}`;                 // a part to colour
  const D = `fill="none" ${L}`;                        // a decoration line
  const f = n => +(+n).toFixed(1);
  const eye = (x, y, r = 8) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${INK}"/><circle cx="${f(x + r * 0.35)}" cy="${f(y - r * 0.4)}" r="${f(r * 0.35)}" fill="#fff"/>`;
  const smile = (x, y, w) => `<path d="M${f(x - w)} ${f(y)} q${f(w)} ${f(w * 0.9)} ${f(w * 2)} 0" ${D}/>`;
  const face = (x, y, s = 1) => eye(x - 20 * s, y, 8 * s) + eye(x + 20 * s, y, 8 * s) + smile(x, y + 14 * s, 9 * s);
  const shut = (x, y, w = 8) => `<path d="M${f(x - w)} ${f(y)} q${f(w)} ${f(w * 0.8)} ${f(w * 2)} 0" ${D}/>`;    // relaxed closed eye
  const happy = (x, y, w = 8) => `<path d="M${f(x - w)} ${f(y)} q${f(w)} ${f(-w * 0.9)} ${f(w * 2)} 0" ${D}/>`; // happy closed eye
  const dot = (x, y, r = 4) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${INK}"/>`;
  const N = (en, fr, es, de, zh) => ({ en, fr, es, de, zh });
  const pts = a => a.map(p => f(p[0]) + ',' + f(p[1])).join(' ');
  const starPts = (cx, cy, ro, ri = ro * 0.48, n = 5, a0 = -90) => {
    const a = []; for (let i = 0; i < n * 2; i++) { const t = (a0 + 180 * i / n) * Math.PI / 180, r = i % 2 ? ri : ro; a.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); }
    return a;
  };
  const star = (...args) => pts(starPts(...args));
  // clip a polygon to a half-plane (Sutherland–Hodgman); used to cut stripes out of a shape
  const clipHP = (P, inside, inter) => { const o = []; P.forEach((a, i) => { const b = P[(i + 1) % P.length], ia = inside(a), ib = inside(b); if (ia) o.push(a); if (ia !== ib) o.push(inter(a, b)); }); return o; };
  const atY = y => (a, b) => [a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]), y];
  const atX = x => (a, b) => [x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])];
  const slab = (P, y0, y1, side = 0, mx = 150) => {
    let Q = clipHP(P, p => p[1] >= y0 - 1e-6, atY(y0)); Q = clipHP(Q, p => p[1] <= y1 + 1e-6, atY(y1));
    if (side) Q = clipHP(Q, p => (side < 0 ? p[0] <= mx + 1e-6 : p[0] >= mx - 1e-6), atX(mx));
    return Q;
  };
  // map a path written with absolute M/C/L/Q numbers: x -> cx + x*sx, y -> cy + y*sy (unit shapes, mirrors)
  const T = (d, cx, cy, sx, sy = sx) => { let i = 0; return d.replace(/-?\d*\.?\d+/g, n => f(i++ % 2 ? cy + n * sy : cx + n * sx)); };
  const heart = (cx, cy, s) => T('M0 0.9 C-1.5 -0.1 -0.9 -1.25 0 -0.45 C0.9 -1.25 1.5 -0.1 0 0.9 z', cx, cy, s);
  const cloud = (x, y, w, h) => T('M0.2 1 C0.02 1 -0.02 0.64 0.16 0.58 C0.12 0.26 0.38 0.14 0.48 0.32 C0.56 0 0.86 0.06 0.84 0.4 C1.02 0.4 1.06 0.98 0.84 1 z', x, y, w, h);
  // round-petal flower outline: n petals around a ring of radius r
  const bloom = (cx, cy, r, n = 6, k = 1.05) => {
    const c = 2 * r * Math.sin(Math.PI / n), ar = f(c / 2 * k); let d = '';
    for (let i = 0; i <= n; i++) { const t = (i / n * 2 - 0.5) * Math.PI, x = cx + r * Math.cos(t), y = cy + r * Math.sin(t); d += i ? ` A${ar} ${ar} 0 1 1 ${f(x)} ${f(y)}` : `M${f(x)} ${f(y)}`; }
    return d + ' z';
  };
  const rays = (cx, cy, r1, r2, n = 8, a0 = 0) => {
    let d = ''; for (let i = 0; i < n; i++) { const t = (a0 + 360 * i / n) * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); d += `M${f(cx + r1 * c)} ${f(cy + r1 * s)} L${f(cx + r2 * c)} ${f(cy + r2 * s)} `; }
    return `<path d="${d.trim()}" ${D}/>`;
  };
  const sun = (cx, cy, r) => `<circle ${R} cx="${cx}" cy="${cy}" r="${r}"/>` + rays(cx, cy, r + 8, r + 18, 8, 22.5);
  const wheel = (cx, cy, r, hub = r * 0.38, spokes = 0) => `<circle ${R} cx="${cx}" cy="${cy}" r="${r}"/>` + (spokes ? rays(cx, cy, hub, r, spokes, 30) : '') + `<circle ${R} cx="${cx}" cy="${cy}" r="${f(hub)}"/>`;
  const grass = (x, y) => `<path d="M${x - 9} ${y} q3 -7 1 -14 M${x} ${y} v-17 M${x + 9} ${y} q-3 -7 -1 -14" ${D}/>`;
  const note = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="5.5" fill="${INK}" transform="rotate(-20 ${x} ${y})"/><path d="M${x + 6} ${y - 2} v-24 q8 4 12 10" ${D}/>`;
  const rot = (a, x, y, inner) => `<g transform="rotate(${a} ${x} ${y})">${inner}</g>`;
  // bumpy round outline (tree tops, fluffy things)
  const bumpy = (cx, cy, r, n = 9, k = 0.62) => {
    const c = 2 * r * Math.sin(Math.PI / n), ar = f(c * k); let d = '';
    for (let i = 0; i <= n; i++) { const t = (i / n * 2 - 0.5) * Math.PI, x = cx + r * Math.cos(t), y = cy + r * Math.sin(t); d += i ? ` A${ar} ${ar} 0 0 1 ${f(x)} ${f(y)}` : `M${f(x)} ${f(y)}`; }
    return d + ' z';
  };
  // leaf from (x1,y1) to (x2,y2); a and b push the two sides along the normal (thickness (a-b)/2, bend (a+b)/4)
  const leaf = (x1, y1, x2, y2, a, b = -a) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, m = Math.hypot(dx, dy), nx = -dy / m, ny = dx / m;
    return `M${f(x1)} ${f(y1)} Q${f(mx + nx * a)} ${f(my + ny * a)} ${f(x2)} ${f(y2)} Q${f(mx + nx * b)} ${f(my + ny * b)} ${f(x1)} ${f(y1)} z`;
  };
  // a thick bent band along a cubic curve p (4 points), half-width w0 -> w1; the piece for t in [a, b]; cap = round end at b
  const bz = (p, t) => { const u = 1 - t; return [0, 1].map(k => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]); };
  const tube = (p, w0, w1, a = 0, b = 1, cap = 0, n = 14) => {
    const A = [], B = [];
    for (let i = 0; i <= n; i++) {
      const t = a + (b - a) * i / n, q = bz(p, t), q1 = bz(p, Math.max(0, t - 0.002)), q2 = bz(p, Math.min(1, t + 0.002));
      let dx = q2[0] - q1[0], dy = q2[1] - q1[1]; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
      const w = w0 + (w1 - w0) * t; A.push([q[0] - dy * w, q[1] + dx * w]); B.push([q[0] + dy * w, q[1] - dx * w]);
    }
    const P = q => f(q[0]) + ' ' + f(q[1]), we = f(w0 + (w1 - w0) * b);
    return 'M' + A.map(P).join(' L') + (cap ? ` A${we} ${we} 0 0 0 ` : ' L') + B.reverse().map(P).join(' L') + ' z';
  };
  const drop = (x, y, s) => T('M0 -1 C0.5 -0.4 0.8 0 0.8 0.35 C0.8 0.8 0.4 1 0 1 C-0.4 1 -0.8 0.8 -0.8 0.35 C-0.8 0 -0.5 -0.4 0 -1 z', x, y, s);
  const twinkle = (x, y, s = 7) => `<path d="M${x} ${y - s} v${2 * s} M${x - s} ${y} h${2 * s}" ${D}/>`;
  const peye = (x, y, r = 7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x}" cy="${y + 1}" r="${f(r * 0.6)}" fill="${INK}"/>`; // eye on a dark patch

  Colouring.addPack(4, [
    { id: 'a4-unicorn-cloud', cat: 'princess', name: N('Unicorn on a cloud', 'Licorne sur un nuage', 'Unicornio en una nube', 'Einhorn auf einer Wolke', '云上的独角兽'), svg: `
      <path ${R} d="M84 146 C40 124 20 172 46 200 C58 210 76 200 70 186 C80 178 88 166 84 146 z"/>
      <rect ${R} x="88" y="168" width="25" height="76" rx="12"/><rect ${R} x="118" y="168" width="25" height="76" rx="12"/>
      <rect ${R} x="150" y="168" width="25" height="76" rx="12"/><rect ${R} x="180" y="168" width="25" height="76" rx="12"/>
      <ellipse ${R} cx="138" cy="154" rx="66" ry="40"/>
      <polygon ${R} points="180,78 184,42 206,70"/>
      <ellipse ${R} cx="206" cy="108" rx="44" ry="40"/>
      <path ${R} d="M182 76 Q152 60 146 92 Q124 106 140 128 Q130 154 162 160 Q172 132 170 112 Q168 90 182 76 z"/>
      <ellipse ${R} cx="238" cy="124" rx="26" ry="21"/>
      <polygon ${R} points="206,70 228,74 224,22"/>
      <path d="M211 60 L226 54 M217 44 L225 40" ${D}/>
      ${eye(200, 102, 8)}${dot(250, 118, 3)}<path d="M228 134 q9 7 18 0" ${D}/>
      <path ${R} d="${cloud(16, 214, 268, 72)}"/>` },

    { id: 'a4-capybara', cat: 'animals', name: N('Capybara with an orange', 'Capybara à l’orange', 'Capibara con naranja', 'Capybara mit Orange', '顶橘子的水豚'), svg: `
      <path ${R} d="M44 252 C36 176 80 134 150 130 C200 128 232 160 236 252 z"/>
      <path ${R} d="M150 104 C152 80 176 70 210 70 L246 72 C268 74 282 92 282 116 L282 132 C282 152 270 164 250 166 L196 166 C168 166 150 150 150 128 z"/>
      <ellipse ${R} cx="172" cy="78" rx="15" ry="13"/>
      <path d="M262 90 q10 -4 16 2 q-2 10 -10 10 q-8 -2 -6 -12 z" fill="${INK}"/>
      ${shut(216, 100, 9)}<path d="M252 150 q8 6 18 0" ${D}/>
      <circle ${R} cx="208" cy="48" r="26"/>
      ${dot(198, 42, 2.5)}${dot(216, 56, 2.5)}${dot(200, 60, 2.5)}${dot(220, 38, 2.5)}
      <path ${R} d="M209 24 C214 4 236 0 246 8 C238 22 224 28 209 24 z"/>
      <path ${R} d="M207 24 C200 6 180 4 170 12 C178 24 192 28 207 24 z"/>
      <ellipse ${R} cx="150" cy="250" rx="136" ry="36"/>
      <path d="M118 264 q14 7 28 0 M182 274 q14 7 28 0 M210 238 q12 5 24 0" ${D}/>
      <ellipse ${R} cx="64" cy="256" rx="38" ry="15"/>
      <path d="M64 256 L98 251" ${D}/>
      <path ${R} d="${bloom(64, 244, 10, 5)}"/>${dot(64, 244, 4)}` },

    { id: 'a4-digger', cat: 'vehicles', name: N('Digger', 'Pelleteuse', 'Excavadora', 'Bagger', '挖掘机'), svg: `
      <path d="M10 262 H290" ${D}/>
      <path ${R} d="M196 262 C212 220 266 214 290 262 z"/>
      <rect ${R} x="30" y="212" width="178" height="48" rx="24"/>
      <circle ${R} cx="60" cy="236" r="15"/><circle ${R} cx="119" cy="236" r="15"/><circle ${R} cx="178" cy="236" r="15"/>
      <rect ${R} x="40" y="168" width="156" height="48" rx="10"/>
      <rect ${R} x="82" y="72" width="26" height="28" rx="8"/>
      <rect ${R} x="52" y="96" width="84" height="76" rx="12"/>
      <rect ${R} x="66" y="110" width="56" height="44" rx="8"/>
      <path d="M78 140 L96 122" ${D}/>
      <path ${R} d="M160 190 C176 136 200 100 224 80 L246 100 C226 116 206 150 194 196 z"/>
      <path ${R} d="M222 82 L246 74 L278 166 L254 174 z"/>
      <path ${R} d="M250 164 L290 166 C292 202 272 214 250 206 C238 200 238 180 250 164 z"/>
      ${dot(234, 86, 5)}${dot(264, 168, 5)}${dot(177, 186, 5)}` },

    { id: 'a4-princess', cat: 'princess', name: N('Princess', 'Princesse', 'Princesa', 'Prinzessin', '公主'), svg: `
      ${sun(46, 50, 22)}
      <path ${R} d="M100 100 C94 36 206 36 200 100 L210 162 C198 176 178 168 180 154 L120 154 C122 168 102 176 90 162 z"/>
      <ellipse ${R} cx="132" cy="268" rx="18" ry="13"/><ellipse ${R} cx="168" cy="268" rx="18" ry="13"/>
      <path ${R} d="M124 178 H176 L216 234 C186 248 114 248 84 234 z"/>
      <path ${R} d="M82 232 C112 246 188 246 218 232 L224 250 Q211 264 197 254 Q183 266 166 256 Q150 268 134 256 Q117 266 103 254 Q89 264 76 250 z"/>
      <path ${R} d="M128 132 H172 L178 182 H122 z"/>
      ${rot(12, 116, 150, `<rect ${R} x="105" y="150" width="22" height="50" rx="11"/>`)}
      ${rot(-12, 184, 150, `<rect ${R} x="173" y="150" width="22" height="50" rx="11"/>`)}
      <circle ${R} cx="122" cy="146" r="16"/><circle ${R} cx="178" cy="146" r="16"/>
      <circle ${R} cx="150" cy="96" r="40"/>
      <path ${R} d="M106 104 C96 34 204 34 194 104 C182 92 172 76 150 72 C128 76 118 92 106 104 z"/>
      <polygon ${R} points="120,58 118,24 136,40 150,16 164,40 182,24 180,58"/>
      ${dot(150, 48, 4)}${eye(134, 104, 7)}${eye(166, 104, 7)}${smile(150, 118, 8)}` },

    { id: 'a4-fairy', cat: 'princess', name: N('Fairy and flower', 'Fée et fleur', 'Hada y flor', 'Fee und Blume', '小仙女和花'), svg: `
      <path d="M20 272 H130" ${D}/>${grass(36, 272)}${grass(118, 272)}
      <path ${R} d="M70 272 C66 220 72 172 74 140 L94 140 C92 172 88 220 94 272 z"/>
      <path ${R} d="M72 222 C44 226 26 204 28 190 C48 186 66 198 72 222 z"/>
      <path ${R} d="M92 200 C116 196 132 176 130 162 C110 162 94 178 92 200 z"/>
      <path ${R} d="${bloom(82, 106, 22, 6)}"/>
      <circle ${R} cx="82" cy="106" r="17"/>
      <path ${R} d="M196 150 C170 104 128 108 132 140 C134 156 150 162 166 160 C146 172 146 196 164 200 C180 204 192 186 196 166 z"/>
      <path ${R} d="${T('M196 150 C170 104 128 108 132 140 C134 156 150 162 166 160 C146 172 146 196 164 200 C180 204 192 186 196 166 z', 410, 0, -1, 1)}"/>
      <path d="M198 206 v16 M212 206 v16" ${D}/><ellipse cx="196" cy="224" rx="7" ry="4" fill="${INK}"/><ellipse cx="214" cy="224" rx="7" ry="4" fill="${INK}"/>
      <path ${R} d="M190 124 H220 L246 198 Q205 212 164 198 z"/>
      ${rot(55, 192, 132, `<rect ${R} x="182" y="128" width="20" height="40" rx="10"/>`)}
      ${rot(-30, 218, 132, `<rect ${R} x="208" y="128" width="20" height="40" rx="10"/>`)}
      <circle ${R} cx="205" cy="94" r="32"/>
      <path ${R} d="M168 112 C160 70 178 56 192 56 C186 44 192 30 205 30 C218 30 224 44 218 56 C232 56 250 70 242 112 C236 118 230 116 230 108 C224 90 214 80 205 80 C196 80 186 90 180 108 C180 116 174 118 168 112 z"/>
      <path d="M194 56 Q205 62 216 56" ${D}/>
      ${eye(193, 100, 6)}${eye(217, 100, 6)}${smile(205, 112, 6)}
      <path d="M158 154 L144 128" ${D}/>
      <polygon ${R} points="${star(138, 116, 18, 8.5)}"/>
      <path d="M120 82 v12 M114 88 h12 M150 82 v10 M145 87 h10" ${D}/>` },

    { id: 'a4-mermaid', cat: 'princess', name: N('Mermaid on a rock', 'Sirène sur un rocher', 'Sirena en una roca', 'Meerjungfrau auf dem Felsen', '礁石上的美人鱼'), svg: `
      <path d="M8 280 q16 -10 32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0" ${D}/>
      <path ${R} d="M34 272 C30 214 84 190 150 194 C222 198 272 226 268 272 z"/>
      <polygon ${R} points="${star(62, 238, 22, 10)}"/>
      <path ${R} d="M88 90 C84 38 164 38 160 90 C164 120 178 150 170 178 C158 172 152 162 150 152 L98 152 C96 162 90 172 78 178 C70 150 84 120 88 90 z"/>
      <path ${R} d="M100 168 C96 214 130 238 190 234 C214 232 234 216 246 198 L232 184 C222 198 206 206 186 206 C160 206 150 196 150 168 z"/>
      <path d="M118 206 q8 6 16 0 M146 220 q8 6 16 0 M178 222 q8 6 16 0" ${D}/>
      <path ${R} d="M236 196 C228 162 250 144 268 150 C262 164 256 176 252 188 C266 186 282 196 288 210 C272 218 250 214 238 202 z"/>
      ${rot(20, 106, 130, `<rect ${R} x="96" y="130" width="20" height="46" rx="10"/>`)}
      ${rot(-20, 142, 130, `<rect ${R} x="132" y="130" width="20" height="46" rx="10"/>`)}
      <path ${R} d="M108 116 H140 L148 172 H100 z"/>
      <path ${R} d="M104 126 Q124 120 144 126 L146 150 Q124 158 102 150 z"/>
      <circle ${R} cx="124" cy="86" r="30"/>
      <path ${R} d="M88 90 C84 38 164 38 160 90 C152 84 140 72 124 72 C108 72 96 84 88 90 z"/>
      ${eye(112, 96, 6)}${eye(136, 96, 6)}${smile(124, 107, 6)}` },

    { id: 'a4-castle', cat: 'princess', name: N('Castle on a hill', 'Château sur la colline', 'Castillo en la colina', 'Schloss auf dem Hügel', '山坡上的城堡'), svg: `
      <path ${R} d="M6 292 C10 240 40 232 80 230 L220 230 C260 232 290 240 294 292 z"/>
      <rect ${R} x="122" y="76" width="56" height="100"/>
      <path ${R} d="M139 122 V104 A11 11 0 0 1 161 104 V122 z"/>
      <polygon ${R} points="114,80 186,80 150,24"/>
      <path ${R} d="M92 244 V140 H104 V126 H122 V140 H140 V126 H160 V140 H178 V126 H196 V140 H208 V244 z"/>
      <rect ${R} x="46" y="106" width="50" height="138" rx="4"/>
      <rect ${R} x="204" y="106" width="50" height="138" rx="4"/>
      <polygon ${R} points="38,110 104,110 71,46"/>
      <polygon ${R} points="196,110 262,110 229,46"/>
      <path ${R} d="M128 244 V204 A22 22 0 0 1 172 204 V244 z"/>
      <path d="M150 184 V244" ${D}/>${dot(142, 222, 3)}${dot(158, 222, 3)}
      <path ${R} d="M60 178 V158 A11 11 0 0 1 82 158 V178 z"/>
      <path ${R} d="M218 178 V158 A11 11 0 0 1 240 158 V178 z"/>
      <path d="M150 26 V4" ${D}/>
      <polygon ${R} points="152,4 182,14 152,24"/>` },

    { id: 'a4-pumpkin-carriage', cat: 'princess', name: N('Pumpkin carriage', 'Carrosse citrouille', 'Carroza de calabaza', 'Kürbiskutsche', '南瓜马车'), svg: `
      <path ${R} d="M60 22 A30 30 0 1 0 86 67 A28 28 0 0 1 60 22 z"/>
      <path ${R} d="M138 86 C134 60 146 42 168 38 L174 54 C160 58 158 70 162 86 z"/>
      <path ${R} d="M166 66 C184 42 216 46 222 58 C204 76 182 78 166 66 z"/>
      <ellipse ${R} cx="104" cy="150" rx="58" ry="62"/>
      <ellipse ${R} cx="196" cy="150" rx="58" ry="62"/>
      <ellipse ${R} cx="150" cy="148" rx="54" ry="68"/>
      <path d="M76 112 Q66 150 78 190 M224 112 Q234 150 222 190" ${D}/>
      <path ${R} d="M124 172 V138 A26 26 0 0 1 176 138 V172 z"/>
      <path d="M150 112 V172 M124 148 H176" ${D}/>
      <path d="M14 262 H286" ${D}/>${grass(30, 262)}${grass(150, 262)}${grass(270, 262)}
      ${wheel(92, 224, 36, 12, 6)}${wheel(208, 224, 36, 12, 6)}` },

    { id: 'a4-ballerina', cat: 'princess', name: N('Ballerina', 'Ballerine', 'Bailarina', 'Ballerina', '芭蕾舞女孩'), svg: `
      <ellipse ${R} cx="150" cy="272" rx="112" ry="17"/>
      <rect ${R} x="126" y="186" width="22" height="74" rx="11"/><rect ${R} x="152" y="186" width="22" height="74" rx="11"/>
      <path ${R} d="M124 246 H150 V258 Q150 272 137 272 Q124 272 124 258 z"/>
      <path ${R} d="M150 246 H176 V258 Q176 272 163 272 Q150 272 150 258 z"/>
      <path d="M128 238 L146 226 M128 226 L146 238 M154 238 L172 226 M154 226 L172 238" ${D}/>
      ${rot(135, 134, 126, `<rect ${R} x="124" y="126" width="20" height="56" rx="10"/>`)}
      ${rot(-135, 166, 126, `<rect ${R} x="156" y="126" width="20" height="56" rx="10"/>`)}
      <path ${R} d="M132 114 H168 L172 170 H128 z"/>
      <path ${R} d="M124 158 C100 160 70 170 62 182 Q72 196 86 190 Q96 204 112 194 Q124 206 138 196 Q150 208 162 196 Q176 206 188 194 Q204 204 214 190 Q228 196 238 182 C230 170 200 160 176 158 z"/>
      <circle ${R} cx="150" cy="40" r="17"/>
      <circle ${R} cx="150" cy="86" r="32"/>
      <path ${R} d="M114 94 C106 34 194 34 186 94 C176 80 164 72 150 72 C136 72 124 80 114 94 z"/>
      ${eye(138, 96, 6)}${eye(162, 96, 6)}${smile(150, 107, 6)}
      ${note(44, 120)}${note(244, 116)}` },

    { id: 'a4-frog-prince', cat: 'princess', name: N('Frog prince', 'Prince grenouille', 'Príncipe rana', 'Froschkönig', '青蛙王子'), svg: `
      <path ${R} d="M192 262 L214 277.4 A128 34 0 1 0 172.2 281.5 z"/>
      <ellipse ${R} cx="98" cy="214" rx="34" ry="28"/><ellipse ${R} cx="202" cy="214" rx="34" ry="28"/>
      <ellipse ${R} cx="150" cy="196" rx="62" ry="50"/>
      <ellipse ${R} cx="150" cy="208" rx="38" ry="32"/>
      <ellipse ${R} cx="120" cy="242" rx="22" ry="12"/><ellipse ${R} cx="180" cy="242" rx="22" ry="12"/>
      <ellipse ${R} cx="150" cy="128" rx="76" ry="46"/>
      <circle ${R} cx="100" cy="90" r="26"/><circle ${R} cx="200" cy="90" r="26"/>
      ${eye(100, 92, 12)}${eye(200, 92, 12)}
      <polygon ${R} points="128,92 124,60 140,74 150,54 160,74 176,60 172,92"/>
      ${dot(150, 82, 4)}${dot(142, 120, 2.5)}${dot(158, 120, 2.5)}
      <path d="M112 138 Q150 168 188 138" ${D}/>` },

    { id: 'a4-treasure-box', cat: 'princess', name: N('Jewel box', 'Coffre à bijoux', 'Cofre de joyas', 'Schatzkiste', '珠宝箱'), svg: `
      <ellipse ${R} cx="150" cy="260" rx="134" ry="22"/>
      <path ${R} d="M62 136 L68 70 C100 40 200 40 232 70 L238 136 z"/>
      <path d="M78 82 C110 60 190 60 222 82" ${D}/>
      <circle ${R} cx="98" cy="120" r="22"/>
      <path ${R} d="${heart(150, 112, 26)}"/>
      <polygon ${R} points="184,98 214,98 228,114 199,142 170,114"/>
      <path d="M170 114 H228 M190 98 L199 114 L208 98" ${D}/>
      <rect ${R} x="54" y="146" width="192" height="98" rx="12"/>
      <rect ${R} x="44" y="128" width="212" height="26" rx="10"/>
      <rect ${R} x="82" y="154" width="24" height="90"/><rect ${R} x="194" y="154" width="24" height="90"/>
      <path ${R} d="M128 166 H172 V200 Q150 222 128 200 z"/>
      <circle cx="150" cy="182" r="6" fill="${INK}"/><path d="M147 184 h6 l2 14 h-10 z" fill="${INK}"/>
      <path d="M40 60 v16 M32 68 h16 M262 52 v16 M254 60 h16 M150 34 v12 M144 40 h12" ${D}/>` },

    { id: 'a4-axolotl', cat: 'animals', name: N('Axolotl', 'Axolotl', 'Ajolote', 'Axolotl', '六角恐龙'), svg: `
      <path ${R} d="M10 288 C40 250 260 250 290 288 z"/>
      <path ${R} d="M232 172 C256 158 284 158 294 174 C288 198 262 212 232 208 z"/>
      <ellipse ${R} cx="150" cy="220" rx="15" ry="18"/><ellipse ${R} cx="214" cy="218" rx="15" ry="18"/>
      <ellipse ${R} cx="176" cy="188" rx="70" ry="38"/>
      ${dot(178, 196, 4)}${dot(204, 206, 3.5)}${dot(222, 184, 3.5)}
      ${rot(30, 52, 80, `<ellipse ${R} cx="52" cy="80" rx="26" ry="12"/>`)}
      <ellipse ${R} cx="34" cy="126" rx="26" ry="12"/>
      ${rot(-30, 52, 170, `<ellipse ${R} cx="52" cy="170" rx="26" ry="12"/>`)}
      ${rot(-30, 186, 80, `<ellipse ${R} cx="186" cy="80" rx="26" ry="12"/>`)}
      <ellipse ${R} cx="204" cy="120" rx="26" ry="12"/>
      ${rot(30, 196, 156, `<ellipse ${R} cx="196" cy="156" rx="26" ry="12"/>`)}
      <ellipse ${R} cx="118" cy="126" rx="70" ry="54"/>
      ${face(118, 118, 1.5)}
      <circle cx="262" cy="60" r="8" ${D}/><circle cx="246" cy="34" r="5" ${D}/>` },

    { id: 'a4-sloth', cat: 'animals', name: N('Sloth on a branch', 'Paresseux sur une branche', 'Perezoso en una rama', 'Faultier am Ast', '树枝上的树懒'), svg: `
      <path ${R} d="${leaf(40, 78, 46, 136, 24)}"/>
      <path ${R} d="${leaf(262, 82, 256, 140, -24)}"/>
      <path ${R} d="M10 62 C80 50 220 50 290 66 L290 88 C220 72 80 72 10 84 z"/>
      ${rot(164.5, 120, 138, `<rect ${R} x="107" y="138" width="26" height="78" rx="13"/>`)}
      ${rot(-164.5, 180, 138, `<rect ${R} x="167" y="138" width="26" height="78" rx="13"/>`)}
      <path d="M92 58 v10 M100 56 v12 M108 58 v10 M192 58 v10 M200 56 v12 M208 58 v10" ${D}/>
      <ellipse ${R} cx="126" cy="252" rx="17" ry="22"/><ellipse ${R} cx="174" cy="252" rx="17" ry="22"/>
      <ellipse ${R} cx="150" cy="206" rx="52" ry="54"/>
      <ellipse ${R} cx="150" cy="216" rx="30" ry="34"/>
      <circle ${R} cx="150" cy="132" r="46"/>
      <ellipse ${R} cx="150" cy="142" rx="36" ry="28"/>
      ${rot(25, 132, 138, `<ellipse ${R} cx="132" cy="138" rx="11" ry="16"/>`)}
      ${rot(-25, 168, 138, `<ellipse ${R} cx="168" cy="138" rx="11" ry="16"/>`)}
      ${peye(133, 135, 6)}${peye(167, 135, 6)}
      <ellipse cx="150" cy="152" rx="7" ry="5" fill="${INK}"/>${smile(150, 159, 6)}` },

    { id: 'a4-llama', cat: 'animals', name: N('Llama', 'Lama', 'Llama', 'Lama', '羊驼'), svg: `
      <rect ${R} x="78" y="196" width="22" height="80" rx="10"/><rect ${R} x="106" y="196" width="22" height="80" rx="10"/>
      <rect ${R} x="150" y="196" width="22" height="80" rx="10"/><rect ${R} x="178" y="196" width="22" height="80" rx="10"/>
      <path ${R} d="M6 292 C30 238 270 238 294 292 z"/>
      ${grass(40, 280)}${grass(262, 280)}
      <circle ${R} cx="40" cy="156" r="15"/>
      <path ${R} d="M60 200 C44 196 44 170 60 166 C58 146 80 134 100 142 C110 128 140 128 150 140 C164 130 190 136 192 154 C210 158 214 186 198 196 C196 212 170 216 160 208 C146 220 120 220 110 208 C96 218 66 216 60 200 z"/>
      <path ${R} d="M92 142 H172 L176 184 Q165 194 154 184 Q143 194 132 184 Q121 194 110 184 Q99 194 88 184 z"/>
      <path d="M96 164 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8" ${D}/>
      <rect ${R} x="166" y="72" width="42" height="112" rx="21"/>
      <path ${R} d="M168 54 C158 34 160 14 170 10 C182 16 184 36 182 50 z"/>
      <path ${R} d="M206 50 C206 32 214 12 224 12 C232 20 228 42 218 56 z"/>
      <ellipse ${R} cx="194" cy="72" rx="36" ry="28"/>
      <path ${R} d="M168 54 C164 40 178 32 186 40 C190 30 206 30 208 40 C218 36 226 46 218 56 C202 52 184 54 168 54 z"/>
      ${eye(180, 74, 6)}${eye(208, 74, 6)}<path d="M188 88 q6 5 12 0" ${D}/>` },

    { id: 'a4-red-panda', cat: 'animals', name: N('Red panda', 'Panda roux', 'Panda rojo', 'Roter Panda', '小熊猫'), svg: `
      <path ${R} d="${tube([[160, 214], [236, 218], [258, 150], [228, 104]], 22, 20, 0, 0.42)}"/>
      <path ${R} d="${tube([[160, 214], [236, 218], [258, 150], [228, 104]], 22, 20, 0.42, 0.62)}"/>
      <path ${R} d="${tube([[160, 214], [236, 218], [258, 150], [228, 104]], 22, 20, 0.62, 0.82)}"/>
      <path ${R} d="${tube([[160, 214], [236, 218], [258, 150], [228, 104]], 22, 20, 0.82, 1, 1)}"/>
      <ellipse ${R} cx="136" cy="196" rx="48" ry="44"/>
      <path ${R} d="M6 230 C80 220 220 220 294 232 L294 256 C220 244 80 244 6 254 z"/>
      <ellipse ${R} cx="114" cy="232" rx="14" ry="20"/><ellipse ${R} cx="158" cy="232" rx="14" ry="20"/>
      <polygon ${R} points="80,104 82,52 124,74"/><polygon ${R} points="192,104 190,52 148,74"/>
      <ellipse ${R} cx="136" cy="118" rx="64" ry="50"/>
      <path ${R} d="M100 130 C110 118 126 122 136 132 C146 122 162 118 172 130 C172 152 156 166 136 166 C116 166 100 152 100 130 z"/>
      <ellipse cx="108" cy="94" rx="9" ry="5" ${D}/><ellipse cx="164" cy="94" rx="9" ry="5" ${D}/>
      ${eye(112, 112, 7)}${eye(160, 112, 7)}
      <ellipse cx="136" cy="140" rx="7" ry="5" fill="${INK}"/><path d="M128 150 q8 6 16 0" ${D}/>` },

    { id: 'a4-dachshund', cat: 'animals', name: N('Sausage dog', 'Teckel', 'Perro salchicha', 'Dackel', '腊肠狗'), svg: `
      <path ${R} d="M8 236 Q150 220 292 236 V272 Q150 284 8 272 z"/>
      ${grass(30, 236)}${grass(270, 236)}
      <path ${R} d="${tube([[84, 156], [56, 150], [40, 130], [36, 104]], 12, 7, 0, 1, 1)}"/>
      <rect ${R} x="76" y="180" width="24" height="64" rx="10"/><rect ${R} x="104" y="180" width="24" height="64" rx="10"/>
      <rect ${R} x="184" y="180" width="24" height="64" rx="10"/><rect ${R} x="212" y="180" width="24" height="64" rx="10"/>
      <rect ${R} x="62" y="136" width="170" height="62" rx="31"/>
      ${rot(-25, 206, 156, `<rect ${R} x="194" y="134" width="24" height="44" rx="10"/>`)}
      <circle ${R} cx="214" cy="188" r="11"/>
      <ellipse ${R} cx="234" cy="118" rx="40" ry="34"/>
      <ellipse ${R} cx="266" cy="134" rx="24" ry="17"/>
      <ellipse cx="287" cy="128" rx="7" ry="6" fill="${INK}"/>
      <path ${R} d="M214 96 C196 92 188 118 194 140 C198 154 214 150 218 136 C222 122 222 104 214 96 z"/>
      ${eye(240, 112, 7)}<path d="M258 148 q8 6 16 0" ${D}/>` },

    { id: 'a4-hamster', cat: 'animals', name: N('Hamster with a seed', 'Hamster et sa graine', 'Hámster con semilla', 'Hamster mit Kern', '捧着瓜子的仓鼠'), svg: `
      <path ${R} d="M6 292 C30 244 270 244 294 292 z"/>
      <circle ${R} cx="96" cy="104" r="22"/><circle ${R} cx="204" cy="104" r="22"/>
      <circle ${R} cx="96" cy="100" r="12"/><circle ${R} cx="204" cy="100" r="12"/>
      <ellipse ${R} cx="150" cy="172" rx="84" ry="80"/>
      <ellipse ${R} cx="150" cy="208" rx="52" ry="42"/>
      <ellipse ${R} cx="104" cy="160" rx="22" ry="16"/><ellipse ${R} cx="196" cy="160" rx="22" ry="16"/>
      ${eye(126, 138, 8)}${eye(174, 138, 8)}${dot(150, 152, 4)}<path d="M142 160 q4 5 8 0 q4 5 8 0" ${D}/>
      <path ${R} d="M150 172 C140 182 134 210 140 232 C144 244 156 244 160 232 C166 210 160 182 150 172 z"/>
      <path d="M146 184 C140 200 140 220 144 236 M154 184 C160 200 160 220 156 236" ${D}/>
      <ellipse ${R} cx="128" cy="206" rx="13" ry="11"/><ellipse ${R} cx="172" cy="206" rx="13" ry="11"/>
      <ellipse ${R} cx="114" cy="252" rx="22" ry="12"/><ellipse ${R} cx="186" cy="252" rx="22" ry="12"/>` },

    { id: 'a4-koala', cat: 'animals', name: N('Koala on a branch', 'Koala sur une branche', 'Koala en una rama', 'Koala am Ast', '树枝上的考拉'), svg: `
      <path ${R} d="${leaf(252, 208, 256, 262, -22)}"/>
      <path ${R} d="${leaf(278, 210, 286, 258, -20)}"/>
      <ellipse ${R} cx="140" cy="176" rx="52" ry="48"/>
      <ellipse ${R} cx="140" cy="184" rx="30" ry="30"/>
      <path ${R} d="M6 196 C90 184 210 184 294 200 L294 224 C210 210 90 210 6 220 z"/>
      <ellipse ${R} cx="106" cy="208" rx="16" ry="22"/><ellipse ${R} cx="174" cy="208" rx="16" ry="22"/>
      <circle ${R} cx="84" cy="74" r="32"/><circle ${R} cx="196" cy="74" r="32"/>
      <circle ${R} cx="88" cy="78" r="17"/><circle ${R} cx="192" cy="78" r="17"/>
      <ellipse ${R} cx="140" cy="104" rx="66" ry="56"/>
      <ellipse ${R} cx="140" cy="118" rx="17" ry="23"/>
      ${eye(110, 98, 7)}${eye(170, 98, 7)}<path d="M130 148 q10 8 20 0" ${D}/>` },

    { id: 'a4-fox', cat: 'animals', name: N('Fox', 'Renard', 'Zorro', 'Fuchs', '狐狸'), svg: `
      <path ${R} d="M6 292 C30 248 270 248 294 292 z"/>
      <path ${R} d="${tube([[124, 236], [40, 246], [22, 160], [64, 124]], 22, 26, 0, 0.78)}"/>
      <path ${R} d="${tube([[124, 236], [40, 246], [22, 160], [64, 124]], 22, 26, 0.78, 1, 1)}"/>
      <path ${R} d="M108 246 C92 200 104 150 150 146 C196 150 208 200 192 246 z"/>
      <path ${R} d="M124 160 C136 176 164 176 176 160 C182 190 170 214 150 224 C130 214 118 190 124 160 z"/>
      <ellipse ${R} cx="128" cy="246" rx="18" ry="12"/><ellipse ${R} cx="172" cy="246" rx="18" ry="12"/>
      <polygon ${R} points="92,94 96,30 140,64"/><polygon ${R} points="208,94 204,30 160,64"/>
      <polygon ${R} points="104,80 106,48 128,64"/><polygon ${R} points="196,80 194,48 172,64"/>
      <path ${R} d="M150 170 C128 170 96 152 70 124 C92 112 96 70 150 64 C204 70 208 112 230 124 C204 152 172 170 150 170 z"/>
      <path ${R} d="M76 126 C100 118 128 124 150 142 C172 124 200 118 224 126 C200 152 172 170 150 170 C128 170 100 152 76 126 z"/>
      ${eye(120, 106, 8)}${eye(180, 106, 8)}
      <ellipse cx="150" cy="146" rx="8" ry="6" fill="${INK}"/><path d="M140 156 q5 6 10 0 q5 6 10 0" ${D}/>` },

    { id: 'a4-giraffe', cat: 'animals', name: N('Giraffe', 'Girafe', 'Jirafa', 'Giraffe', '长颈鹿'), svg: `
      ${sun(48, 48, 20)}
      <path d="M10 272 H290" ${D}/>${grass(30, 272)}${grass(272, 272)}
      <path d="M52 160 Q36 172 40 194" ${D}/><path d="M34 192 q6 -5 12 0 l-2 16 q-4 4 -8 0 z" fill="${INK}"/>
      <rect ${R} x="66" y="186" width="22" height="84" rx="10"/><rect ${R} x="94" y="186" width="22" height="84" rx="10"/>
      <rect ${R} x="150" y="186" width="22" height="84" rx="10"/><rect ${R} x="178" y="186" width="22" height="84" rx="10"/>
      <path d="M66 256 H88 M94 256 H116 M150 256 H172 M178 256 H200" ${D}/>
      <ellipse ${R} cx="122" cy="168" rx="72" ry="40"/>
      <ellipse ${R} cx="94" cy="160" rx="18" ry="13"/><ellipse ${R} cx="146" cy="178" rx="17" ry="12"/>
      <path ${R} d="M156 152 L196 64 L228 74 L194 162 z"/>
      <ellipse ${R} cx="194" cy="112" rx="11" ry="14"/>
      <path ${R} d="M207 56 V36 A11 11 0 1 1 217 36 V56 z"/>
      <path ${R} d="M227 58 V40 A11 11 0 1 1 237 40 V58 z"/>
      <path ${R} d="M200 62 C184 44 168 48 172 58 C176 68 190 70 202 68 z"/>
      ${rot(18, 230, 66, `<ellipse ${R} cx="230" cy="66" rx="40" ry="24"/>`)}
      ${eye(224, 62, 6)}${dot(262, 72, 2.5)}<path d="M246 84 q8 5 14 -2" ${D}/>` },

    { id: 'a4-panda', cat: 'animals', name: N('Panda with bamboo', 'Panda et bambou', 'Panda con bambú', 'Panda mit Bambus', '吃竹子的熊猫'), svg: `
      <path ${R} d="M6 292 C30 252 270 252 294 292 z"/>
      <rect ${R} x="226" y="44" width="28" height="104" rx="8"/><rect ${R} x="226" y="148" width="28" height="118" rx="8"/>
      <path d="M232 96 h16 M232 206 h16" ${D}/>
      <path ${R} d="${leaf(254, 98, 296, 76, 16, -16)}"/>
      <ellipse ${R} cx="130" cy="192" rx="64" ry="58"/>
      <ellipse ${R} cx="92" cy="240" rx="30" ry="22"/><ellipse ${R} cx="168" cy="240" rx="30" ry="22"/>
      <ellipse cx="92" cy="242" rx="10" ry="8" fill="#fff" ${L}/><ellipse cx="168" cy="242" rx="10" ry="8" fill="#fff" ${L}/>
      ${rot(28, 90, 160, `<rect ${R} x="76" y="156" width="28" height="56" rx="14"/>`)}
      <circle ${R} cx="80" cy="62" r="22"/><circle ${R} cx="180" cy="62" r="22"/>
      <ellipse ${R} cx="130" cy="104" rx="64" ry="54"/>
      ${rot(25, 106, 106, `<ellipse ${R} cx="106" cy="106" rx="15" ry="21"/>`)}
      ${rot(-25, 154, 106, `<ellipse ${R} cx="154" cy="106" rx="15" ry="21"/>`)}
      ${peye(108, 104, 7)}${peye(152, 104, 7)}
      <ellipse cx="130" cy="128" rx="9" ry="6" fill="${INK}"/><path d="M122 138 q8 7 16 0" ${D}/>
      ${rot(-8, 172, 166, `<rect ${R} x="160" y="152" width="74" height="28" rx="14"/>`)}` },

    { id: 'a4-trex', cat: 'dinosaurs', name: N('T. rex and palm tree', 'T. rex et palmier', 'T. rex y palmera', 'T-Rex und Palme', '霸王龙和椰子树'), svg: `
      <path d="M8 264 H292" ${D}/>
      <path ${R} d="M228 264 C232 214 238 150 242 100 L264 102 C260 154 254 214 252 264 z"/>
      <path d="M233 230 q9 4 18 0 M236 190 q9 4 18 0 M239 150 q9 4 18 0 M241 118 q9 4 18 0" ${D}/>
      <path ${R} d="${leaf(252, 98, 198, 70, 50, 4)}"/>
      <path ${R} d="${leaf(252, 100, 222, 138, 50, 4)}"/>
      <path ${R} d="${leaf(254, 98, 290, 70, -4, -50)}"/>
      <path ${R} d="${leaf(256, 100, 288, 138, -4, -50)}"/>
      <path ${R} d="M74 206 C50 214 30 232 8 228 C22 252 66 252 90 236 z"/>
      <polygon ${R} points="76,150 58,168 46,140"/><polygon ${R} points="94,134 72,146 68,120"/>
      <ellipse ${R} cx="106" cy="192" rx="48" ry="60"/>
      <ellipse ${R} cx="128" cy="204" rx="22" ry="36"/>
      <ellipse ${R} cx="96" cy="218" rx="26" ry="30"/>
      <ellipse ${R} cx="86" cy="254" rx="24" ry="11"/><ellipse ${R} cx="136" cy="254" rx="24" ry="11"/>
      ${rot(-40, 150, 168, `<rect ${R} x="139" y="168" width="22" height="30" rx="11"/>`)}
      <path ${R} d="M108 116 C106 90 126 76 156 78 C186 80 204 94 204 114 C204 132 190 142 170 142 L134 142 C116 142 108 132 108 116 z"/>
      ${eye(158, 102, 8)}${dot(194, 96, 2.5)}<path d="M168 126 Q186 132 198 118" ${D}/>` },

    { id: 'a4-longneck', cat: 'dinosaurs', name: N('Long-neck dinosaur', 'Dinosaure au long cou', 'Dinosaurio de cuello largo', 'Langhals-Dino', '长颈恐龙'), svg: `
      <path d="M8 266 H292" ${D}/>
      <rect ${R} x="240" y="118" width="30" height="148" rx="6"/>
      <path ${R} d="${bumpy(244, 90, 42, 9)}"/>
      <path ${R} d="M56 190 C30 200 14 224 8 248 C30 236 52 226 72 216 z"/>
      <rect ${R} x="58" y="212" width="24" height="54" rx="10"/><rect ${R} x="86" y="212" width="24" height="54" rx="10"/>
      <rect ${R} x="132" y="212" width="24" height="54" rx="10"/><rect ${R} x="160" y="212" width="24" height="54" rx="10"/>
      <ellipse ${R} cx="110" cy="196" rx="72" ry="44"/>
      <ellipse ${R} cx="88" cy="182" rx="17" ry="12"/><ellipse ${R} cx="128" cy="170" rx="14" ry="12"/>
      <path ${R} d="M146 178 C176 164 188 120 196 84 L224 90 C216 132 206 178 182 210 z"/>
      <ellipse ${R} cx="218" cy="80" rx="30" ry="21"/>
      ${eye(222, 74, 6)}${dot(242, 74, 2.5)}<path d="M222 88 q9 6 18 0" ${D}/>` },

    { id: 'a4-baby-dragon', cat: 'dinosaurs', name: N('Baby dragon on a cloud', 'Bébé dragon sur un nuage', 'Dragoncito en una nube', 'Babydrache auf einer Wolke', '云上的小龙宝宝'), svg: `
      <path ${R} d="${cloud(16, 206, 268, 80)}"/>
      <path ${R} d="${tube([[184, 222], [236, 234], [266, 200], [250, 170]], 15, 9)}"/>
      <path ${R} d="${heart(250, 158, 16)}"/>
      <path ${R} d="M114 140 C84 96 50 98 44 120 C58 124 62 136 58 148 C72 146 82 154 82 166 C94 160 104 156 114 156 z"/>
      <path ${R} d="${T('M114 140 C84 96 50 98 44 120 C58 124 62 136 58 148 C72 146 82 154 82 166 C94 160 104 156 114 156 z', 300, 0, -1, 1)}"/>
      <ellipse ${R} cx="150" cy="192" rx="50" ry="46"/>
      <ellipse ${R} cx="150" cy="202" rx="30" ry="32"/>
      <path d="M126 192 h48 M124 206 h52 M128 220 h44" ${D}/>
      <ellipse ${R} cx="124" cy="236" rx="20" ry="12"/><ellipse ${R} cx="176" cy="236" rx="20" ry="12"/>
      <polygon ${R} points="112,74 104,36 132,62"/><polygon ${R} points="188,74 196,36 168,62"/>
      <ellipse ${R} cx="150" cy="108" rx="62" ry="50"/>
      ${eye(124, 104, 9)}${eye(176, 104, 9)}${smile(150, 124, 8)}` },

    { id: 'a4-narwhal', cat: 'ocean', name: N('Narwhal', 'Narval', 'Narval', 'Narwal', '独角鲸'), svg: `
      <path ${R} d="M6 298 C40 254 260 254 294 298 z"/>
      <circle cx="40" cy="64" r="8" ${D}/><circle cx="58" cy="40" r="5" ${D}/><circle cx="34" cy="98" r="4" ${D}/>
      <path ${R} d="${tube([[110, 176], [70, 182], [46, 164], [42, 130]], 28, 10)}"/>
      <path ${R} d="M42 134 C20 122 12 100 22 90 C32 100 38 110 42 118 C46 108 56 96 68 94 C72 108 60 124 42 134 z"/>
      <polygon ${R} points="222,122 240,138 292,52"/>
      <path d="M246.3 97.9 L258.5 107.5 M263.8 80.2 L271.4 86.2" ${D}/>
      <ellipse ${R} cx="162" cy="162" rx="84" ry="60"/>
      ${rot(30, 150, 216, `<ellipse ${R} cx="150" cy="216" rx="26" ry="13"/>`)}
      <ellipse ${R} cx="126" cy="128" rx="14" ry="11"/><ellipse ${R} cx="166" cy="116" rx="13" ry="11"/><ellipse ${R} cx="100" cy="160" rx="12" ry="11"/>
      ${eye(212, 150, 8)}${smile(226, 166, 7)}` },

    { id: 'a4-dolphin', cat: 'ocean', name: N('Jumping dolphin', 'Dauphin qui saute', 'Delfín saltando', 'Springender Delfin', '跳跃的海豚'), svg: `
      <path ${R} d="M-6 200 C40 186 90 206 140 196 C190 186 240 166 306 176 V310 H-6 z"/>
      <path ${R} d="M-6 238 q26 -22 52 0 t52 0 t52 0 t52 0 t52 0 t52 0 V310 H-6 z"/>
      <path ${R} d="M132 92 C140 66 160 56 174 58 C166 70 164 80 170 90 z"/>
      <path ${R} d="M44 176 C60 120 110 84 170 86 C210 88 244 108 262 138 C250 136 240 138 236 146 C222 132 196 120 168 122 C120 124 84 150 62 186 z"/>
      <path ${R} d="M58 180 C44 174 26 166 18 176 C30 184 36 196 34 206 C46 200 54 192 58 180 z"/>
      <path ${R} d="M178 120 C178 140 166 156 148 164 C150 148 154 134 158 122 z"/>
      ${eye(218, 110, 6)}<path d="M232 132 q6 4 12 2" ${D}/>
      <path ${R} d="${drop(24, 140, 13)}"/><path ${R} d="${drop(50, 116, 12)}"/>` },

    { id: 'a4-seahorse', cat: 'ocean', name: N('Seahorse and bubbles', 'Hippocampe et bulles', 'Caballito de mar y burbujas', 'Seepferdchen mit Blasen', '海马和泡泡'), svg: `
      <path d="M8 286 H292" ${D}/>
      <path ${R} d="M30 286 C20 240 50 220 36 180 C28 156 40 136 50 128 C56 150 46 170 56 196 C68 230 48 250 54 286 z"/>
      <polygon ${R} points="124,48 128,22 140,36 148,18 154,46"/>
      ${rot(24, 168, 82, `<rect ${R} x="160" y="72" width="50" height="22" rx="11"/>`)}
      <path ${R} d="${tube([[128, 206], [112, 262], [186, 274], [172, 232]], 14, 7, 0, 1, 1)}"/>
      <path ${R} d="M110 132 C86 124 76 148 82 168 C90 180 102 176 108 168 z"/>
      <path d="M96 138 l8 8 M86 156 l16 2" ${D}/>
      <path ${R} d="M140 40 C118 40 108 58 114 76 C118 90 112 104 106 124 C98 156 104 196 128 218 L158 214 C180 196 190 166 182 140 C176 122 162 112 162 104 C170 98 176 86 172 70 C168 52 158 40 140 40 z"/>
      <path d="M180 140 q-10 5 -18 0 M182 162 q-10 5 -18 0 M176 184 q-10 5 -18 0 M164 204 q-8 4 -14 0" ${D}/>
      ${eye(146, 66, 7)}
      <circle ${R} cx="236" cy="62" r="16"/><circle ${R} cx="254" cy="114" r="12"/><circle ${R} cx="226" cy="152" r="11"/>
      <path d="M228 58 q2 -6 8 -8 M249 112 q1 -4 5 -6" ${D}/>` },

    { id: 'a4-jellyfish', cat: 'ocean', name: N('Jellyfish', 'Méduse', 'Medusa', 'Qualle', '水母'), svg: `
      <path ${R} d="M6 292 C40 262 260 262 294 292 z"/>
      <path ${R} d="${tube([[100, 150], [78, 190], [122, 216], [96, 256]], 11, 7, 0, 1, 1)}"/>
      <path ${R} d="${tube([[134, 150], [118, 190], [152, 218], [128, 256]], 11, 7, 0, 1, 1)}"/>
      <path ${R} d="${tube([[166, 150], [182, 190], [148, 218], [172, 256]], 11, 7, 0, 1, 1)}"/>
      <path ${R} d="${tube([[200, 150], [222, 190], [178, 216], [204, 256]], 11, 7, 0, 1, 1)}"/>
      <path ${R} d="M70 140 C70 80 110 50 150 50 C190 50 230 80 230 140 z"/>
      <circle ${R} cx="104" cy="96" r="12"/><circle ${R} cx="196" cy="96" r="12"/><circle ${R} cx="150" cy="70" r="12"/>
      <path ${R} d="M64 134 H236 L238 148 Q224 166 209 152 Q195 168 180 152 Q165 168 150 152 Q135 168 120 152 Q105 168 91 152 Q76 166 62 148 z"/>
      ${eye(126, 112, 8)}${eye(174, 112, 8)}${smile(150, 122, 8)}
      <circle cx="252" cy="60" r="7" ${D}/><circle cx="266" cy="36" r="5" ${D}/><circle cx="42" cy="88" r="6" ${D}/>` },

    { id: 'a4-fire-truck', cat: 'vehicles', name: N('Fire truck', 'Camion de pompiers', 'Camión de bomberos', 'Feuerwehrauto', '消防车'), svg: `
      <rect ${R} x="6" y="254" width="288" height="32" rx="8"/>
      <path d="M30 270 h24 M84 270 h24 M138 270 h24 M192 270 h24 M246 270 h24" ${D}/>
      <rect ${R} x="26" y="102" width="160" height="22" rx="6"/>
      <path d="M46 104 v18 M66 104 v18 M86 104 v18 M106 104 v18 M126 104 v18 M146 104 v18 M166 104 v18 M50 124 v8 M162 124 v8" ${D}/>
      <rect ${R} x="20" y="130" width="172" height="92" rx="8"/>
      <rect ${R} x="108" y="146" width="66" height="44" rx="6"/><path d="M132 168 h18" ${D}/>
      <circle ${R} cx="62" cy="168" r="24"/><circle cx="62" cy="168" r="13" ${D}/>${dot(62, 168, 5)}
      <path ${R} d="M210 110 V102 a15 13 0 0 1 30 0 V110 z"/>
      <path ${R} d="M190 222 V118 q0 -8 8 -8 h44 q20 0 30 24 l12 34 V222 z"/>
      <path ${R} d="M206 126 h34 q12 0 18 18 l6 20 h-58 z"/>
      <rect ${R} x="20" y="194" width="264" height="22"/>
      <path d="M212 180 h14" ${D}/><circle cx="276" cy="182" r="6" fill="#fff" ${L}/>
      ${wheel(70, 224, 28, 11)}${wheel(232, 224, 28, 11)}` },

    { id: 'a4-race-car', cat: 'vehicles', name: N('Race car', 'Voiture de course', 'Coche de carreras', 'Rennauto', '赛车'), svg: `
      <rect ${R} x="6" y="248" width="288" height="36" rx="8"/>
      <path d="M24 266 h26 M78 266 h26 M132 266 h26 M186 266 h26 M240 266 h26" ${D}/>
      <path d="M6 150 h22 M10 176 h18 M6 200 h20" ${D}/>
      <path d="M54 150 V172" ${D}/>
      <rect ${R} x="30" y="126" width="56" height="24" rx="6"/>
      <circle ${R} cx="170" cy="146" r="24"/>
      <path ${R} d="M166 134 H184 Q192 134 192 144 Q192 154 184 154 H166 z"/>
      <path ${R} d="M36 204 C36 186 52 176 80 174 L130 170 C136 162 144 160 150 160 L192 160 C200 160 206 166 210 170 L262 176 C282 178 292 190 292 204 V214 H36 z"/>
      <circle ${R} cx="112" cy="192" r="16"/>
      ${wheel(80, 220, 28, 11)}${wheel(240, 220, 28, 11)}` },

    { id: 'a4-helicopter', cat: 'vehicles', name: N('Helicopter', 'Hélicoptère', 'Helicóptero', 'Hubschrauber', '直升机'), svg: `
      <path ${R} d="${cloud(150, 228, 140, 58)}"/>
      <path ${R} d="M190 136 L268 124 L270 144 L196 168 z"/>
      <path ${R} d="M254 128 L262 98 Q266 90 274 92 L282 96 L278 140 z"/>
      <circle ${R} cx="276" cy="140" r="13"/><path d="M276 130 v20 M266 140 h20" ${D}/>
      <path d="M104 198 v20 M176 198 v20 M74 218 H196 q16 0 22 -12" ${D}/>
      <rect ${R} x="128" y="80" width="24" height="24" rx="4"/>
      <ellipse ${R} cx="140" cy="150" rx="72" ry="52"/>
      <path ${R} d="M80 146 C80 120 100 104 126 104 L128 148 z"/>
      <rect ${R} x="142" y="116" width="40" height="34" rx="8"/>
      <rect ${R} x="28" y="60" width="224" height="22" rx="11"/>${dot(140, 71, 5)}` },

    { id: 'a4-hot-air-balloon', cat: 'vehicles', name: N('Hot air balloon', 'Montgolfière', 'Globo aerostático', 'Heißluftballon', '热气球'), svg: `
      <path ${R} d="M6 296 C40 250 260 250 294 296 z"/>${grass(60, 286)}${grass(240, 286)}
      ${[[-100, -60], [-60, -20], [-20, 20], [20, 60], [60, 100]].map(([a, b]) => `<path ${R} d="M150 14 C${f(150 + a * 0.9)} 18 ${f(150 + a * 1.15)} 110 ${f(150 + a * 0.3)} 190 L${f(150 + b * 0.3)} 190 C${f(150 + b * 1.15)} 110 ${f(150 + b * 0.9)} 18 150 14 z"/>`).join('')}
      <circle ${R} cx="150" cy="24" r="16"/>
      <path ${R} d="M114 186 H186 L180 208 H120 z"/>
      <path d="M124 208 L128 224 M150 208 V224 M176 208 L172 224" ${D}/>
      <rect ${R} x="118" y="222" width="64" height="34" rx="6"/>
      <path d="M118 238 H182 M138 222 V256 M162 222 V256" ${D}/>
      <path d="M36 70 q6 -6 12 0 q6 -6 12 0 M244 44 q5 -5 10 0 q5 -5 10 0" ${D}/>` },

    { id: 'a4-astronaut', cat: 'space', name: N('Astronaut', 'Astronaute', 'Astronauta', 'Astronaut', '宇航员'), svg: `
      <path ${R} d="M6 292 C40 248 260 248 294 292 z"/>
      <ellipse cx="60" cy="280" rx="14" ry="5" ${D}/><ellipse cx="236" cy="276" rx="12" ry="4" ${D}/>
      ${twinkle(40, 50)}${twinkle(264, 40)}${twinkle(258, 176)}${twinkle(34, 160)}
      <rect ${R} x="90" y="118" width="120" height="96" rx="16"/>
      <rect ${R} x="112" y="196" width="32" height="46" rx="10"/><rect ${R} x="156" y="196" width="32" height="46" rx="10"/>
      <rect ${R} x="104" y="232" width="44" height="26" rx="12"/><rect ${R} x="152" y="232" width="44" height="26" rx="12"/>
      ${rot(22, 110, 140, `<rect ${R} x="95" y="140" width="30" height="54" rx="15"/>`)}
      ${rot(-150, 190, 140, `<rect ${R} x="175" y="140" width="30" height="50" rx="15"/>`)}
      <rect ${R} x="104" y="128" width="92" height="84" rx="26"/>
      <rect ${R} x="128" y="150" width="44" height="32" rx="6"/>${dot(140, 166, 4)}${dot(160, 166, 4)}
      <circle ${R} cx="88" cy="194" r="15"/><circle ${R} cx="217" cy="92" r="15"/>
      <path d="M184 42 L198 22" ${D}/>${dot(199, 20, 5)}
      <circle ${R} cx="150" cy="84" r="52"/>
      <rect ${R} x="112" y="58" width="76" height="56" rx="26"/>
      ${eye(136, 84, 6)}${eye(164, 84, 6)}${smile(150, 96, 6)}` },

    { id: 'a4-robot', cat: 'space', name: N('Robot', 'Robot', 'Robot', 'Roboter', '机器人'), svg: `
      <ellipse ${R} cx="150" cy="274" rx="112" ry="14"/>
      <path d="M150 54 V34" ${D}/><circle ${R} cx="150" cy="24" r="12"/>
      <rect ${R} x="108" y="228" width="32" height="44" rx="8"/><rect ${R} x="160" y="228" width="32" height="44" rx="8"/>
      <rect ${R} x="54" y="148" width="30" height="70" rx="15"/><rect ${R} x="216" y="148" width="30" height="70" rx="15"/>
      <path d="M58 230 q11 12 22 0 M220 230 q11 12 22 0" ${D}/>
      <rect ${R} x="84" y="140" width="132" height="94" rx="16"/>
      <rect ${R} x="104" y="156" width="60" height="44" rx="8"/>
      <path d="${heart(134, 178, 11)}" ${D}/>
      <circle ${R} cx="190" cy="168" r="12"/>${dot(184, 200, 4)}${dot(198, 200, 4)}
      <path d="M136 132 V140 M164 132 V140" ${D}/>
      <rect ${R} x="90" y="52" width="120" height="80" rx="18"/>
      <circle ${R} cx="124" cy="88" r="15"/><circle ${R} cx="176" cy="88" r="15"/>
      ${eye(124, 90, 7)}${eye(176, 90, 7)}
      <path ${R} d="M122 108 H178 Q178 126 150 126 Q122 126 122 108 z"/>` },

    { id: 'a4-alien', cat: 'space', name: N('Friendly alien', 'Gentil extraterrestre', 'Extraterrestre amigo', 'Freundlicher Außerirdischer', '友好的外星人'), svg: `
      <path ${R} d="M6 292 C40 250 260 250 294 292 z"/>
      <ellipse cx="62" cy="280" rx="14" ry="5" ${D}/><ellipse cx="240" cy="278" rx="11" ry="4" ${D}/>
      ${twinkle(36, 60)}${twinkle(266, 70)}${twinkle(250, 180)}
      <path d="M122 54 Q112 40 106 30 M178 54 Q188 40 194 30" ${D}/>
      <circle ${R} cx="104" cy="26" r="13"/><circle ${R} cx="196" cy="26" r="13"/>
      ${rot(30, 98, 192, `<ellipse ${R} cx="98" cy="192" rx="12" ry="24"/>`)}
      ${rot(-30, 202, 192, `<ellipse ${R} cx="202" cy="192" rx="12" ry="24"/>`)}
      <ellipse ${R} cx="126" cy="254" rx="22" ry="12"/><ellipse ${R} cx="174" cy="254" rx="22" ry="12"/>
      <path ${R} d="M112 150 C102 196 98 236 114 252 H186 C202 236 198 196 188 150 z"/>
      <ellipse ${R} cx="150" cy="212" rx="28" ry="28"/>
      <ellipse ${R} cx="150" cy="100" rx="78" ry="58"/>
      <ellipse ${R} cx="120" cy="96" rx="20" ry="24"/><ellipse ${R} cx="180" cy="96" rx="20" ry="24"/>
      ${eye(124, 100, 10)}${eye(176, 100, 10)}
      <path d="M132 132 q18 16 36 0" ${D}/>` },

    { id: 'a4-space-shuttle', cat: 'space', name: N('Space shuttle', 'Navette spatiale', 'Transbordador espacial', 'Raumfähre', '航天飞机'), svg: `
      <circle ${R} cx="244" cy="62" r="30"/><circle cx="234" cy="54" r="6" ${D}/><circle cx="254" cy="74" r="4" ${D}/>
      ${twinkle(46, 60)}${twinkle(60, 150)}${twinkle(236, 170)}${twinkle(258, 240)}
      <path ${R} d="M108 248 C104 274 124 292 140 296 C156 292 176 274 172 248 z"/>
      <path ${R} d="M124 250 C122 268 132 280 140 284 C148 280 158 268 156 250 z"/>
      <polygon ${R} points="112,228 136,228 140,250 108,250"/><polygon ${R} points="144,228 168,228 172,250 140,250"/>
      <polygon ${R} points="110,148 58,228 110,228"/><polygon ${R} points="170,148 222,228 170,228"/>
      <path ${R} d="M110 90 V232 H170 V90 z"/>
      <path ${R} d="M110 90 C110 60 126 38 140 24 C154 38 170 60 170 90 z"/>
      <circle ${R} cx="140" cy="114" r="14"/>
      <rect ${R} x="110" y="172" width="60" height="22"/>` },

    { id: 'a4-boba-tea', cat: 'food', name: N('Bubble tea', 'Thé aux perles', 'Té de burbujas', 'Bubble Tea', '珍珠奶茶'), svg: `
      <ellipse ${R} cx="150" cy="270" rx="112" ry="16"/>
      ${rot(14, 170, 40, `<rect ${R} x="158" y="10" width="24" height="120" rx="6"/>`)}
      <path ${R} d="M86 96 C90 60 210 60 214 96 z"/>
      <path ${R} d="M88 114 H212 L196 262 Q150 272 104 262 z"/>
      <rect ${R} x="78" y="92" width="144" height="22" rx="10"/>
      <path d="M92 134 H208" ${D}/>
      ${eye(128, 162, 8)}${eye(172, 162, 8)}${smile(150, 176, 9)}
      <circle ${R} cx="120" cy="240" r="12"/><circle ${R} cx="150" cy="246" r="12"/><circle ${R} cx="180" cy="240" r="12"/>
      <circle ${R} cx="135" cy="216" r="12"/><circle ${R} cx="165" cy="216" r="12"/>` },

    { id: 'a4-burger', cat: 'food', name: N('Burger', 'Hamburger', 'Hamburguesa', 'Burger', '汉堡包'), svg: `
      <ellipse ${R} cx="150" cy="264" rx="132" ry="22"/>
      <path ${R} d="M64 224 H236 Q236 256 208 256 H92 Q64 256 64 224 z"/>
      <rect ${R} x="56" y="198" width="188" height="30" rx="15"/>
      <path ${R} d="M60 186 H240 L236 202 H222 L214 220 Q208 228 202 220 L196 202 H114 L106 222 Q100 230 94 222 L88 202 H64 z"/>
      <rect ${R} x="64" y="160" width="172" height="30" rx="14"/>
      <path ${R} d="M52 132 H248 V164 q-12 16 -24 0 t-24 0 t-24 0 t-24 0 t-24 0 t-24 0 t-24 0 t-24 0 z"/>
      <path d="M150 84 V34" ${D}/>
      <polygon ${R} points="152,34 190,46 152,58"/>
      <path ${R} d="M60 132 C60 64 240 64 240 132 Q240 140 232 140 H68 Q60 140 60 132 z"/>
      <path d="M96 100 l8 -4 M196 100 l-8 -4 M120 88 l8 -2 M176 88 l-8 -2 M212 118 l6 -6 M86 120 l-6 -6" ${D}/>
      ${eye(126, 110, 7)}${eye(174, 110, 7)}${smile(150, 122, 8)}` },

    { id: 'a4-pancakes', cat: 'food', name: N('Pancakes', 'Pancakes', 'Tortitas', 'Pfannkuchen', '松饼'), svg: `
      <ellipse ${R} cx="150" cy="252" rx="132" ry="26"/>
      <rect ${R} x="52" y="214" width="196" height="32" rx="16"/>
      <rect ${R} x="56" y="186" width="188" height="32" rx="16"/>
      <rect ${R} x="50" y="158" width="200" height="32" rx="16"/>
      <rect ${R} x="58" y="130" width="184" height="32" rx="16"/>
      <path ${R} d="M70 134 C70 112 230 112 230 134 L230 150 Q224 162 218 150 L216 142 H180 L176 172 Q170 182 164 172 L160 142 H108 L104 158 Q98 168 92 158 L88 142 H76 Q70 142 70 134 z"/>
      <rect ${R} x="132" y="100" width="36" height="24" rx="5"/>
      <path ${R} d="${T('M0 1 C-0.5 0.6 -0.9 0 -0.8 -0.4 C-0.7 -0.9 0.7 -0.9 0.8 -0.4 C0.9 0 0.5 0.6 0 1 z', 252, 226, 22)}"/>
      <polygon ${R} points="${star(252, 208, 14, 6)}"/>
      ${dot(244, 226, 2.5)}${dot(258, 222, 2.5)}${dot(252, 236, 2.5)}${dot(262, 232, 2.5)}${dot(242, 238, 2.5)}` },

    { id: 'a4-popsicle', cat: 'food', name: N('Ice lolly', 'Glace à l’eau', 'Polo de hielo', 'Eis am Stiel', '冰棍'), svg: `
      ${sun(56, 56, 22)}
      <rect ${R} x="136" y="210" width="28" height="74" rx="12"/>
      <path ${R} d="M93.4 80 A60 60 0 0 1 206.6 80 z"/>
      <path ${R} d="M93.4 80 L206.6 80 A60 60 0 0 1 210 100 V116 H90 V100 A60 60 0 0 1 93.4 80 z"/>
      <rect ${R} x="90" y="116" width="120" height="36"/>
      <rect ${R} x="90" y="152" width="120" height="36"/>
      <path ${R} d="M90 188 H210 V220 Q210 228 202 228 H98 Q90 228 90 220 z"/>
      <path ${R} d="M94 224 V246 a11 11 0 0 0 22 0 V226 z"/>
      ${eye(128, 166, 7)}${eye(172, 166, 7)}${smile(150, 176, 7)}` },

    { id: 'a4-cherries', cat: 'food', name: N('Cherries', 'Cerises', 'Cerezas', 'Kirschen', '樱桃'), svg: `
      <ellipse ${R} cx="150" cy="240" rx="140" ry="34"/>
      <ellipse ${R} cx="150" cy="238" rx="104" ry="20"/>
      <path d="M56 178 C60 140 80 108 98 90 M118 184 C114 150 106 116 98 90 M184 182 C186 146 196 116 206 92 M246 176 C240 140 222 110 206 92" ${D}/>
      <path ${R} d="${leaf(98, 90, 54, 66, 24)}"/>
      <path ${R} d="${leaf(206, 92, 252, 64, -24)}"/>
      <circle ${R} cx="56" cy="206" r="30"/><circle ${R} cx="118" cy="214" r="30"/>
      <circle ${R} cx="184" cy="212" r="30"/><circle ${R} cx="246" cy="204" r="30"/>
      <path d="M42 196 q4 -8 12 -10 M104 204 q4 -8 12 -10 M170 202 q4 -8 12 -10 M232 194 q4 -8 12 -10" ${D}/>
      ${eye(110, 216, 4)}${eye(128, 216, 4)}${smile(119, 226, 4)}${eye(176, 214, 4)}${eye(194, 214, 4)}${smile(185, 224, 4)}` },

    { id: 'a4-sunflower', cat: 'nature', name: N('Sunflower', 'Tournesol', 'Girasol', 'Sonnenblume', '向日葵'), svg: `
      <path ${R} d="M138 296 C136 250 140 200 142 160 L162 160 C160 200 158 250 162 296 z"/>
      <path ${R} d="${leaf(144, 234, 82, 200, 28)}"/>
      <path ${R} d="${leaf(158, 214, 220, 182, -28)}"/>
      <path ${R} d="M6 298 C40 258 260 258 294 298 z"/>
      ${[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map(a => rot(a, 150, 104, `<ellipse ${R} cx="150" cy="50" rx="16" ry="27"/>`)).join('')}
      <circle ${R} cx="150" cy="104" r="40"/>
      ${eye(134, 98, 7)}${eye(166, 98, 7)}${smile(150, 112, 8)}
      ${dot(126, 80, 2.5)}${dot(150, 74, 2.5)}${dot(174, 80, 2.5)}${dot(120, 124, 2.5)}${dot(180, 124, 2.5)}${dot(150, 132, 2.5)}` },

    { id: 'a4-cactus', cat: 'nature', name: N('Cactus in a pot', 'Cactus en pot', 'Cactus en maceta', 'Kaktus im Topf', '盆栽仙人掌'), svg: `
      ${sun(250, 48, 20)}
      <path ${R} d="M120 156 H98 C84 156 76 146 76 134 V106 C76 90 100 90 100 106 V132 H120 z"/>
      <path ${R} d="M180 146 H202 C216 146 224 136 224 124 V100 C224 84 200 84 200 100 V122 H180 z"/>
      <rect ${R} x="118" y="60" width="64" height="150" rx="32"/>
      <path d="M86 116 l-6 -3 M90 140 l-6 3 M214 96 l6 -3 M210 122 l6 3 M128 92 l-6 -3 M172 96 l6 -3 M130 180 l-6 3 M170 184 l6 3" ${D}/>
      ${eye(136, 124, 7)}${eye(164, 124, 7)}${smile(150, 138, 7)}
      <path ${R} d="${bloom(150, 58, 12, 5)}"/>${dot(150, 58, 4)}
      <path ${R} d="${bloom(88, 92, 9, 5)}"/>${dot(88, 92, 3)}
      <path ${R} d="M96 214 H204 L192 280 H108 z"/>
      <rect ${R} x="86" y="196" width="128" height="26" rx="8"/>
      <path ${R} d="${heart(150, 250, 14)}"/>` },

    { id: 'a4-tree-swing', cat: 'nature', name: N('Tree with a swing', 'Arbre avec une balançoire', 'Árbol con columpio', 'Baum mit Schaukel', '挂着秋千的树'), svg: `
      <path ${R} d="M118 262 C124 220 124 180 116 140 L150 140 C144 180 144 220 152 262 z"/>
      <ellipse cx="134" cy="206" rx="8" ry="12" fill="${INK}"/>
      <path ${R} d="${tube([[136, 176], [180, 160], [220, 150], [254, 128]], 13, 9, 0, 1, 1)}"/>
      <path ${R} d="${bumpy(138, 94, 70, 11)}"/>
      <circle ${R} cx="98" cy="72" r="12"/><circle ${R} cx="168" cy="56" r="12"/><circle ${R} cx="124" cy="126" r="12"/><circle ${R} cx="182" cy="114" r="12"/>
      <path d="M214 154 V224 M240 142 V224" ${D}/>
      <rect ${R} x="200" y="222" width="54" height="22" rx="6"/>
      <path ${R} d="M6 298 C40 248 260 248 294 298 z"/>${grass(60, 286)}${grass(250, 290)}` },

    { id: 'a4-football', cat: 'hobbies', name: N('Football and goal', 'Ballon et but', 'Balón y portería', 'Fußball und Tor', '足球和球门'), svg: `
      <rect ${R} x="56" y="84" width="188" height="154"/>
      <path d="M84 84 V238 M112 84 V238 M140 84 V238 M168 84 V238 M196 84 V238 M224 84 V238 M56 112 H244 M56 140 H244 M56 168 H244 M56 196 H244 M56 224 H244" fill="none" stroke="${INK}" stroke-width="2.5"/>
      <rect ${R} x="34" y="62" width="22" height="182" rx="4"/><rect ${R} x="244" y="62" width="22" height="182" rx="4"/>
      <rect ${R} x="34" y="62" width="232" height="22" rx="4"/>
      <path ${R} d="M-6 240 Q150 226 306 240 V310 H-6 z"/>${grass(30, 262)}${grass(276, 266)}
      ${(() => {
        const cx = 150, cy = 210, r = 54, P = (rr, a) => f(cx + rr * Math.cos(a * Math.PI / 180)) + ' ' + f(cy + rr * Math.sin(a * Math.PI / 180));
        let s = `<circle ${R} cx="${cx}" cy="${cy}" r="${r}"/>`, lines = '';
        for (let k = 0; k < 5; k++) {
          const t = -90 + 72 * k, p = t + 36;
          lines += `M${P(r * 0.4, t)} L${P(r, t)} `;
          s += `<path ${R} d="M${P(r * 0.6, p - 17)} L${P(r, p - 27)} A${r} ${r} 0 0 1 ${P(r, p + 27)} L${P(r * 0.6, p + 17)} z"/>`;
        }
        return s + `<path d="${lines.trim()}" ${D}/><polygon ${R} points="${star(cx, cy, r * 0.4, r * 0.4 * Math.cos(Math.PI / 5), 5)}"/>`;
      })()}` },

    { id: 'a4-guitar', cat: 'hobbies', name: N('Guitar', 'Guitare', 'Guitarra', 'Gitarre', '吉他'), svg: `
      <circle ${R} cx="150" cy="150" r="118"/>
      ${note(40, 60)}${note(252, 250)}
      ${rot(35, 150, 150, `
        <path ${R} d="M150 118 C180 118 192 136 188 156 C186 168 180 172 184 180 C200 186 204 202 202 218 C200 250 180 268 150 268 C120 268 100 250 98 218 C96 202 100 186 116 180 C120 172 114 168 112 156 C108 136 120 118 150 118 z"/>
        <path ${R} d="M170 216 C188 212 196 228 191 242 C186 251 176 250 172 241 C178 233 177 224 170 216 z"/>
        <circle cx="150" cy="196" r="26" ${D}/><circle ${R} cx="150" cy="196" r="18"/>
        <path ${R} d="${heart(115, 233, 11.5)}"/>
        <rect ${R} x="132" y="226" width="36" height="20" rx="6"/>
        <rect ${R} x="139" y="40" width="22" height="122"/>
        <path d="M139 64 H161 M139 88 H161 M139 112 H161 M139 136 H161" ${D}/>
        <path ${R} d="M136 46 L134 14 Q134 8 140 8 H160 Q166 8 166 14 L164 46 z"/>
        ${dot(128, 18, 4)}${dot(128, 34, 4)}${dot(172, 18, 4)}${dot(172, 34, 4)}
        <path d="M145 46 V236 M150 46 V236 M155 46 V236" fill="none" stroke="${INK}" stroke-width="2"/>`)}` },

    { id: 'a4-roller-skate', cat: 'hobbies', name: N('Roller skate', 'Patin à roulettes', 'Patín', 'Rollschuh', '旱冰鞋'), svg: `
      <path d="M10 274 H290" ${D}/>${grass(26, 274)}${grass(274, 274)}
      <path ${R} d="M74 64 H146 Q154 64 154 72 V146 Q154 158 176 160 C220 164 252 178 252 206 V212 H66 V72 Q66 64 74 64 z"/>
      <path ${R} d="M196 162 C230 168 252 182 252 206 V212 H200 C196 196 194 180 196 162 z"/>
      <path d="M128 84 l22 14 M150 84 l-22 14 M128 108 l22 14 M150 108 l-22 14 M134 132 l20 12 M154 132 l-20 12" ${D}/>
      <polygon ${R} points="${star(100, 140, 24, 11)}"/>
      <rect ${R} x="60" y="54" width="100" height="24" rx="10"/>
      <path ${R} d="M232 222 h24 v14 q0 10 -10 10 h-4 q-10 0 -10 -10 z"/>
      <rect ${R} x="56" y="206" width="204" height="22" rx="10"/>
      ${wheel(98, 246, 25, 11)}${wheel(208, 246, 25, 11)}` },

    { id: 'a4-snowman', cat: 'holidays', name: N('Snowman', 'Bonhomme de neige', 'Muñeco de nieve', 'Schneemann', '雪人'), svg: `
      <path ${R} d="M6 298 C40 248 260 248 294 298 z"/>
      <path d="M110 136 L64 110 M80 119 L72 102 M190 136 L236 110 M220 119 L230 102" ${D}/>
      <circle ${R} cx="60" cy="108" r="12"/><circle ${R} cx="240" cy="108" r="12"/>
      <circle ${R} cx="150" cy="222" r="56"/>
      <circle ${R} cx="150" cy="142" r="42"/>
      ${dot(150, 136, 5)}${dot(150, 158, 5)}${dot(150, 210, 5)}${dot(150, 234, 5)}
      <circle ${R} cx="150" cy="76" r="34"/>
      <path ${R} d="M162 112 L186 112 L192 160 L168 164 z"/>
      <path d="M170 152 l2 10 M180 150 l2 10" ${D}/>
      <path ${R} d="M114 102 Q150 118 186 102 L188 118 Q150 136 112 118 z"/>
      <polygon ${R} points="148,74 188,86 148,96"/>
      ${eye(138, 66, 5)}${eye(162, 66, 5)}${dot(136, 96, 2.5)}${dot(144, 100, 2.5)}${dot(156, 100, 2.5)}${dot(164, 96, 2.5)}
      <rect ${R} x="122" y="6" width="56" height="38" rx="6"/>
      <rect ${R} x="104" y="38" width="92" height="20" rx="8"/>` },

    { id: 'a4-winter-tree', cat: 'holidays', name: N('Decorated tree', 'Sapin décoré', 'Árbol decorado', 'Geschmückter Baum', '装饰好的树'), svg: `
      <path ${R} d="M6 298 C40 252 260 252 294 298 z"/>
      <rect ${R} x="136" y="228" width="28" height="34" rx="4"/>
      <polygon ${R} points="50,238 250,238 150,128"/>
      <polygon ${R} points="72,172 228,172 150,80"/>
      <polygon ${R} points="96,112 204,112 150,42"/>
      <path d="M86 202 Q150 222 214 202 M106 142 Q150 158 194 142" ${D}/>
      <circle ${R} cx="102" cy="224" r="12"/><circle ${R} cx="198" cy="224" r="12"/><circle ${R} cx="150" cy="190" r="12"/>
      <circle ${R} cx="124" cy="156" r="12"/><circle ${R} cx="178" cy="160" r="12"/><circle ${R} cx="150" cy="92" r="12"/>
      <polygon ${R} points="${star(150, 36, 24, 11)}"/>
      <rect ${R} x="206" y="236" width="44" height="34" rx="4"/>
      <path d="M228 236 V270 M206 252 H250 M228 236 q-14 -14 -18 -2 q4 6 18 2 q14 -14 18 -2 q-4 6 -18 2" ${D}/>` },

    { id: 'a4-lantern', cat: 'holidays', name: N('Paper lantern', 'Lanterne en papier', 'Farol de papel', 'Papierlaterne', '纸灯笼'), svg: `
      <path ${R} d="M50 40 A28 28 0 1 0 76 82 A26 26 0 0 1 50 40 z"/>
      ${twinkle(250, 50)}${twinkle(42, 200)}${twinkle(262, 210)}
      <path d="M150 0 V48 M150 254 V264" ${D}/>
      ${[[-88, -53], [-53, -18], [-18, 18], [18, 53], [53, 88]].map(([a, b]) => `<path ${R} d="M${f(150 + a * 0.38)} 62 C${f(150 + a * 1.3)} 90 ${f(150 + a * 1.3)} 210 ${f(150 + a * 0.38)} 238 L${f(150 + b * 0.38)} 238 C${f(150 + b * 1.3)} 210 ${f(150 + b * 1.3)} 90 ${f(150 + b * 0.38)} 62 z"/>`).join('')}
      <rect ${R} x="116" y="46" width="68" height="22" rx="6"/>
      <rect ${R} x="116" y="232" width="68" height="22" rx="6"/>
      <path ${R} d="M136 262 H164 L170 296 H130 z"/>
      <path d="M142 270 V292 M150 270 V294 M158 270 V292" ${D}/>` },

    { id: 'a4-backpack', cat: 'things', name: N('Backpack', 'Sac à dos', 'Mochila', 'Rucksack', '书包'), svg: `
      <path d="M10 266 H290" ${D}/>${grass(30, 266)}${grass(270, 266)}
      <path ${R} d="M118 60 C118 22 182 22 182 60 L162 60 C162 44 138 44 138 60 z"/>
      <rect ${R} x="52" y="96" width="26" height="124" rx="13"/><rect ${R} x="222" y="96" width="26" height="124" rx="13"/>
      <path ${R} d="M70 100 C70 70 100 56 150 56 C200 56 230 70 230 100 V238 Q230 258 210 258 H90 Q70 258 70 238 z"/>
      <path ${R} d="M70 100 C70 70 100 56 150 56 C200 56 230 70 230 100 V126 Q150 146 70 126 z"/>
      <rect ${R} x="96" y="170" width="108" height="72" rx="18"/>
      <path ${R} d="M96 188 Q96 170 114 170 H186 Q204 170 204 188 V196 Q150 212 96 196 z"/>
      <rect x="140" y="192" width="20" height="14" rx="3" fill="#fff" ${L}/>
      <polygon ${R} points="${star(150, 225, 15, 7)}"/>
      <path d="M100 152 H200" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="6 6"/>` },

    { id: 'a4-teapot', cat: 'things', name: N('Teapot', 'Théière', 'Tetera', 'Teekanne', '茶壶'), svg: `
      <ellipse ${R} cx="150" cy="258" rx="128" ry="22"/>
      <path d="M268 112 q-8 -10 0 -20 q8 -10 0 -20 M250 104 q-6 -8 0 -16 q6 -8 0 -16" ${D}/>
      <path ${R} d="M86 132 C30 120 24 222 88 220 L92 198 C52 198 54 150 86 156 z"/>
      <path ${R} d="M206 188 C236 180 250 150 262 124 C270 118 282 124 278 134 C268 162 254 206 210 222 z"/>
      <ellipse ${R} cx="146" cy="182" rx="74" ry="62"/>
      <path ${R} d="M73 172 H219 A74 62 0 0 1 217.5 198 H74.5 A74 62 0 0 1 73 172 z"/>
      ${dot(110, 185, 4)}${dot(146, 185, 4)}${dot(182, 185, 4)}
      ${eye(124, 148, 7)}${eye(168, 148, 7)}${smile(146, 158, 7)}
      <path ${R} d="M108 124 C112 92 180 92 184 124 z"/>
      <rect ${R} x="98" y="118" width="96" height="22" rx="10"/>
      <circle ${R} cx="146" cy="92" r="12"/>` },

    { id: 'a4-striped-star', cat: 'patterns', name: N('Striped star', 'Étoile à rayures', 'Estrella de rayas', 'Streifenstern', '条纹星星'), svg: `
      <polygon ${R} points="${star(40, 44, 18, 8)}"/><polygon ${R} points="${star(262, 262, 18, 8)}"/>
      ${twinkle(262, 40)}${twinkle(36, 258)}
      ${(() => {
        const S = starPts(150, 162, 132, 132 * 0.382), ya = 162 - 132 * Math.sin(Math.PI / 10), yb = 162 + 132 * 0.382, yt = 30, ye = 162 + 132 * Math.cos(Math.PI / 5);
        const bands = [[yt, 74, 0], [74, ya, 0], [ya, 152, 0], [152, 182, 0], [182, yb, 0], [yb, 240, -1], [yb, 240, 1], [240, ye, -1], [240, ye, 1]];
        return bands.map(([a, b, s]) => `<polygon ${R} points="${pts(slab(S, a, b, s))}"/>`).join('');
      })()}` },
  ]);
})();
