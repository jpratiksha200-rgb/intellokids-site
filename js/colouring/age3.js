/* Colouring pictures for age 3: one big, friendly object, 4–10 big parts, thick lines, no tiny areas.
   Format: see Colouring.addPack in js/colouring.js. Regions = data-r fill="#fff"; decorations = INK or fill="none".
   The first 3 pictures are the ones open while IK_CONFIG.limits applies. Original art only.
   Regions never carry their own transform (the fill "pop" animation would reset it): rotate a <g> around them instead. */
(function () {
  const INK = '#1F3A44', SW = 6;
  const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
  const R = `data-r fill="#fff" ${L}`;                 // a part to colour
  const D = `fill="none" ${L}`;                        // a decoration line
  const eye = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.4}" r="${r * 0.35}" fill="#fff"/>`;
  const smile = (x, y, w) => `<path d="M${x - w} ${y} q${w} ${w * 0.9} ${w * 2} 0" ${D}/>`;
  const face = (x, y, s = 1) => eye(x - 20 * s, y, 9 * s) + eye(x + 20 * s, y, 9 * s) + smile(x, y + 16 * s, 10 * s);
  const N = (en, fr, es, de, zh) => ({ en, fr, es, de, zh });
  const f = v => +v.toFixed(1);
  const rad = a => a * Math.PI / 180;
  // Star polygon points (n points, outer/inner radius, first point at angle rot in degrees).
  const star = (cx, cy, ro, ri, n = 5, rot = -90) => {
    const p = [];
    for (let i = 0; i < n * 2; i++) { const a = rad(rot + i * 180 / n), r = i % 2 ? ri : ro; p.push(f(cx + r * Math.cos(a)) + ',' + f(cy + r * Math.sin(a))); }
    return p.join(' ');
  };
  // Heart path, about 2s wide, centred on cx,cy.
  const heart = (cx, cy, s) => `M${cx} ${f(cy + 0.85 * s)} C${f(cx - 0.4 * s)} ${f(cy + 0.5 * s)} ${f(cx - s)} ${f(cy + 0.1 * s)} ${f(cx - s)} ${f(cy - 0.35 * s)} ` +
    `C${f(cx - s)} ${f(cy - 0.8 * s)} ${f(cx - 0.45 * s)} ${f(cy - 1.02 * s)} ${cx} ${f(cy - 0.55 * s)} C${f(cx + 0.45 * s)} ${f(cy - 1.02 * s)} ${f(cx + s)} ${f(cy - 0.8 * s)} ${f(cx + s)} ${f(cy - 0.35 * s)} ` +
    `C${f(cx + s)} ${f(cy + 0.1 * s)} ${f(cx + 0.4 * s)} ${f(cy + 0.5 * s)} ${cx} ${f(cy + 0.85 * s)} z`;
  // Puffy scalloped outline (clouds, wool, bushes): n bumps around an ellipse.
  const puff = (cx, cy, rx, ry, n, k = 0.62, rot = -90) => {
    const P = i => { const a = rad(rot + i * 360 / n); return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; };
    let d = `M${f(P(0)[0])} ${f(P(0)[1])}`;
    for (let i = 1; i <= n; i++) { const [x, y] = P(i), [px, py] = P(i - 1), c = f(Math.hypot(x - px, y - py) * k); d += ` A${c} ${c} 0 0 1 ${f(x)} ${f(y)}`; }
    return d + ' z';
  };
  // Raindrop / flame shape, about 2s wide, point at the top.
  const drop = (x, y, s) => `M${x} ${f(y - 1.5 * s)} C${f(x + 0.3 * s)} ${f(y - 0.9 * s)} ${f(x + s)} ${f(y - 0.4 * s)} ${f(x + s)} ${f(y + 0.15 * s)} A${s} ${s} 0 0 1 ${f(x - s)} ${f(y + 0.15 * s)} C${f(x - s)} ${f(y - 0.4 * s)} ${f(x - 0.3 * s)} ${f(y - 0.9 * s)} ${x} ${f(y - 1.5 * s)} z`;
  // Four-point sparkle.
  const sparkle = (x, y, r) => `<polygon ${R} points="${star(x, y, r, r * 0.42, 4)}"/>`;
  // Vertical stripe x=a..b cut exactly from an ellipse (bee stripes).
  const band = (cx, cy, rx, ry, a, b) => {
    const h = x => ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
    return `M${a} ${f(cy - h(a))} A${rx} ${ry} 0 0 1 ${b} ${f(cy - h(b))} L${b} ${f(cy + h(b))} A${rx} ${ry} 0 0 1 ${a} ${f(cy + h(a))} z`;
  };
  const ball = (x, y, r = 7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`;
  const at = (cx, cy, a, r) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  // Chubby star with soft round arms (starfish). ro is the pull of each arm; the tip reaches about ro/2 + ri/2.
  const softStar = (cx, cy, ro, ri, n = 5, rot = -90) => {
    const st = 360 / n, s = at(cx, cy, rot - st / 2, ri);
    let d = `M${f(s[0])} ${f(s[1])}`;
    for (let i = 0; i < n; i++) { const q = at(cx, cy, rot + i * st, ro), e = at(cx, cy, rot + i * st + st / 2, ri); d += ` Q${f(q[0])} ${f(q[1])} ${f(e[0])} ${f(e[1])}`; }
    return d + ' z';
  };
  // Star with straight sides and rounded tips (radius about rt).
  const roundStar = (cx, cy, ro, ri, n = 5, rt = 14, rot = -90) => {
    const st = 360 / n, mix = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
    let d = '';
    for (let i = 0; i < n; i++) {
      const t = at(cx, cy, rot + i * st, ro), a = at(cx, cy, rot + i * st - st / 2, ri), b = at(cx, cy, rot + i * st + st / 2, ri);
      const k = rt / Math.hypot(t[0] - a[0], t[1] - a[1]), p1 = mix(t, a, k), p2 = mix(t, b, k);
      d += (i ? ' L' : 'M') + `${f(p1[0])} ${f(p1[1])} Q${f(t[0])} ${f(t[1])} ${f(p2[0])} ${f(p2[1])} L${f(b[0])} ${f(b[1])}`;
    }
    return d + ' z';
  };
  // Scallop-shell ribs: one closed wedge per pair of angles, with a bumpy outer edge.
  const fan = (cx, cy, rx, ry, angles, k0 = 0.2) => {
    const P = (a, s) => [cx + rx * s * Math.cos(rad(a)), cy + ry * s * Math.sin(rad(a))];
    let out = '';
    for (let i = 0; i < angles.length - 1; i++) {
      const a = P(angles[i], 1), b = P(angles[i + 1], 1), ia = P(angles[i], k0), ib = P(angles[i + 1], k0), c = f(Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.62);
      out += `<path ${R} d="M${f(ia[0])} ${f(ia[1])} L${f(a[0])} ${f(a[1])} A${c} ${c} 0 0 1 ${f(b[0])} ${f(b[1])} L${f(ib[0])} ${f(ib[1])} z"/>`;
    }
    return out;
  };
  // Pinwheel swirl: n curved wedges filling a circle (lollipop).
  const swirl = (cx, cy, r, n, bend = 50) => {
    let out = '';
    for (let k = 0; k < n; k++) {
      const a1 = -90 + k * 360 / n, a2 = a1 + 360 / n, o1 = at(cx, cy, a1, r), o2 = at(cx, cy, a2, r), c1 = at(cx, cy, a1 + bend, r * 0.55), c2 = at(cx, cy, a2 + bend, r * 0.55);
      out += `<path ${R} d="M${cx} ${cy} Q${f(c1[0])} ${f(c1[1])} ${f(o1[0])} ${f(o1[1])} A${r} ${r} 0 0 1 ${f(o2[0])} ${f(o2[1])} Q${f(c2[0])} ${f(c2[1])} ${cx} ${cy} z"/>`;
    }
    return out;
  };
  // Egg (taller top half, rounder bottom half) cut into horizontal bands. Each cut: { y, a (zigzag/wave height), n (steps, even), wave }.
  const eggBands = (cx, cy, rx, ryT, ryB, cuts) => {
    const hx = y => rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / (y < cy ? ryT : ryB)) ** 2)), P = p => `${f(p[0])} ${f(p[1])}`;
    const edge = c => {
      const x0 = cx - hx(c.y), x1 = cx + hx(c.y), n = c.n || 1, pts = [];
      for (let i = 0; i <= n; i++) pts.push([x0 + (x1 - x0) * i / n, (i === 0 || i === n) ? c.y : c.wave ? (i % 2 ? c.y + (i % 4 === 1 ? -2 : 2) * c.a : c.y) : c.y + (i % 2 ? -c.a : c.a)]);
      return pts;
    };
    const draw = (pts, wave) => pts.slice(1).map((p, i) => wave ? (i % 2 ? '' : `Q${P(p)} ${P(pts[i + 2])}`) : `L${P(p)}`).join(' ');
    const down = (y1, y2) => (y1 < cy && y2 > cy) ? `A${rx} ${ryT} 0 0 1 ${cx + rx} ${cy} A${rx} ${ryB} 0 0 1 ${P([cx + hx(y2), y2])}` : `A${rx} ${y1 < cy ? ryT : ryB} 0 0 1 ${P([cx + hx(y2), y2])}`;
    const up = (y2, y1) => (y1 < cy && y2 > cy) ? `A${rx} ${ryB} 0 0 1 ${cx - rx} ${cy} A${rx} ${ryT} 0 0 1 ${P([cx - hx(y1), y1])}` : `A${rx} ${y1 < cy ? ryT : ryB} 0 0 1 ${P([cx - hx(y1), y1])}`;
    const E = cuts.map(edge), out = [];
    out.push(`M${P(E[0][0])} A${rx} ${ryT} 0 0 1 ${P(E[0][E[0].length - 1])} ${draw(E[0].slice().reverse(), cuts[0].wave)} z`);
    for (let i = 0; i < cuts.length - 1; i++) out.push(`M${P(E[i][0])} ${draw(E[i], cuts[i].wave)} ${down(cuts[i].y, cuts[i + 1].y)} ${draw(E[i + 1].slice().reverse(), cuts[i + 1].wave)} ${up(cuts[i + 1].y, cuts[i].y)} z`);
    const l = E[E.length - 1];
    out.push(`M${P(l[0])} ${draw(l, cuts[cuts.length - 1].wave)} A${rx} ${ryB} 0 0 1 ${P(l[0])} z`);
    return out.map(d => `<path ${R} d="${d}"/>`).join('');
  };
  // Heart made of two circles and a V, cut into horizontal bands at the given heights.
  const heartBands = (cuts) => {
    const r = 55 * Math.SQRT2, Ly = 162, xl = y => y <= Ly ? 95 - Math.sqrt(r * r - (y - 107) ** 2) : 40 + (y - Ly), xr = y => 300 - xl(y), P = (x, y) => `${f(x)} ${f(y)}`;
    const down = (a, b) => a < Ly && b > Ly ? `A${f(r)} ${f(r)} 0 0 1 260 ${Ly} L${P(xr(b), b)}` : b <= Ly ? `A${f(r)} ${f(r)} 0 0 1 ${P(xr(b), b)}` : `L${P(xr(b), b)}`;
    const up = (b, a) => a < Ly && b > Ly ? `L40 ${Ly} A${f(r)} ${f(r)} 0 0 1 ${P(xl(a), a)}` : b <= Ly ? `A${f(r)} ${f(r)} 0 0 1 ${P(xl(a), a)}` : `L${P(xl(a), a)}`;
    const out = [`M${P(xl(cuts[0]), cuts[0])} A${f(r)} ${f(r)} 0 0 1 150 52 A${f(r)} ${f(r)} 0 0 1 ${P(xr(cuts[0]), cuts[0])} z`];
    for (let i = 0; i < cuts.length - 1; i++) { const a = cuts[i], b = cuts[i + 1]; out.push(`M${P(xl(a), a)} L${P(xr(a), a)} ${down(a, b)} L${P(xl(b), b)} ${up(b, a)} z`); }
    const z = cuts[cuts.length - 1];
    out.push(`M${P(xl(z), z)} L${P(xr(z), z)} L150 272 z`);
    return out.map(d => `<path ${R} d="${d}"/>`).join('');
  };
  // Wavy octopus leg hanging from y=170 at x=c down to y=b; s=±1 flips the wiggle; turned by rot degrees around its top.
  const leg = (c, b, rot, s) => {
    const w = 12 * s, m = (222 + b) / 2 + 6, l = c - 17, r = c + 17;
    return `<g transform="rotate(${rot} ${c} 170)"><path ${R} d="M${l} 170 Q${l - w} 196 ${l} 222 Q${l + w} ${m} ${l} ${b} A17 17 0 0 0 ${r} ${b} Q${r + w} ${m} ${r} 222 Q${r - w} 196 ${r} 170 z"/></g>`;
  };

  Colouring.addPack(3, [
    { id: 'a3-crown', cat: 'princess', name: N('Crown', 'Couronne', 'Corona', 'Krone', '王冠'), svg: `
      <polygon ${R} points="50,232 50,112 100,165 150,84 200,165 250,112 250,232"/>
      <circle ${R} cx="50" cy="104" r="17"/><circle ${R} cx="150" cy="74" r="19"/><circle ${R} cx="250" cy="104" r="17"/>
      <rect ${R} x="44" y="192" width="212" height="54" rx="10"/>
      <circle ${R} cx="98" cy="219" r="15"/><circle ${R} cx="150" cy="219" r="17"/><circle ${R} cx="202" cy="219" r="15"/>` },

    { id: 'a3-puppy', cat: 'animals', name: N('Puppy', 'Chiot', 'Cachorro', 'Hündchen', '小狗'), svg: `
      <ellipse ${R} cx="150" cy="152" rx="88" ry="82"/>
      <path ${R} d="M96 86 C52 84 36 166 58 206 C74 230 104 206 106 160 C108 122 116 92 96 86 z"/>
      <path ${R} d="M204 86 C248 84 264 166 242 206 C226 230 196 206 194 160 C192 122 184 92 204 86 z"/>
      <ellipse ${R} cx="186" cy="134" rx="27" ry="25"/>
      <ellipse ${R} cx="150" cy="178" rx="48" ry="32"/>
      <path ${R} d="M133 189 Q141.5 188 150 180 Q158.5 188 167 189 C170 224 130 224 133 189 z"/>
      <ellipse ${R} cx="150" cy="160" rx="17" ry="12"/>
      ${eye(115, 134, 10)}${eye(186, 134, 10)}
      <path d="M150 172 V180 Q133 196 116 184 M150 180 Q167 196 184 184" ${D}/>` },

    { id: 'a3-truck', cat: 'vehicles', name: N('Truck', 'Camion', 'Camión', 'Lastwagen', '卡车'), svg: `
      <rect ${R} x="26" y="186" width="248" height="28" rx="10"/>
      <rect ${R} x="34" y="112" width="160" height="80" rx="10"/>
      <path ${R} d="M196 192 V96 q0 -10 10 -10 h34 q24 0 30 30 l4 76 z"/>
      <path ${R} d="M212 104 h30 q12 0 15 16 l3 26 h-48 z"/>
      <circle ${R} cx="86" cy="222" r="34"/><circle ${R} cx="222" cy="222" r="34"/>
      <circle ${R} cx="86" cy="222" r="13"/><circle ${R} cx="222" cy="222" r="13"/>
      <path d="M18 262 H282" ${D}/>` },

    { id: 'a3-magic-wand', cat: 'princess', name: N('Magic wand', 'Baguette magique', 'Varita mágica', 'Zauberstab', '魔法棒'), svg: `
      <g transform="rotate(40 175 115)">
        <rect ${R} x="160" y="115" width="30" height="185" rx="15"/>
        <path ${R} d="M160 230 H190 V285 A15 15 0 0 1 160 285 z"/>
      </g>
      <polygon ${R} points="${star(175, 115, 90, 44, 5, -50)}"/>
      ${sparkle(64, 66, 32)}${sparkle(236, 238, 32)}${sparkle(146, 264, 28)}
      ${face(175, 112)}` },

    { id: 'a3-glass-slipper', cat: 'princess', name: N('Glass slipper', 'Pantoufle de verre', 'Zapatito de cristal', 'Gläserner Schuh', '水晶鞋'), svg: `
      <path ${R} d="M214 176 L252 172 L246 258 Q238 266 230 258 z"/>
      <path ${R} d="M34 222 C34 198 62 188 96 184 C108 182 118 181 126 180 C150 172 168 156 184 140 C202 122 220 106 240 106 C258 106 268 122 264 140 L258 182 C226 184 198 198 172 218 C148 238 118 246 82 246 C50 246 34 238 34 222 z"/>
      <path ${R} d="M126 180 C150 172 168 156 184 140 C202 122 220 106 240 106 C258 106 268 122 264 140 C246 146 228 154 210 164 C186 178 156 192 126 180 z"/>
      <path ${R} d="M92 192 C76 172 54 176 56 194 C58 210 78 210 92 192 z"/>
      <path ${R} d="M92 192 C108 172 130 176 128 194 C126 210 106 210 92 192 z"/>
      <circle cx="92" cy="192" r="8" fill="${INK}"/>
      ${sparkle(70, 92, 32)}${sparkle(150, 62, 26)}` },

    { id: 'a3-princess-dress', cat: 'princess', name: N('Princess dress', 'Robe de princesse', 'Vestido de princesa', 'Prinzessinnenkleid', '公主裙'), svg: `
      <path ${R} d="M112 148 C88 190 52 228 34 256 Q62 276 92 262 Q121 278 150 262 Q179 278 208 262 Q238 276 266 256 C248 228 212 190 188 148 z"/>
      <path ${R} d="M134 150 H166 C178 196 190 226 194 250 Q150 264 106 250 C110 226 122 196 134 150 z"/>
      <ellipse ${R} cx="88" cy="96" rx="31" ry="25"/><ellipse ${R} cx="212" cy="96" rx="31" ry="25"/>
      <path ${R} d="M106 56 Q150 90 194 56 L184 136 H116 z"/>
      <rect ${R} x="106" y="126" width="88" height="30" rx="12"/>
      <path ${R} d="M150 141 C132 116 102 122 106 141 C110 160 132 164 150 141 z"/>
      <path ${R} d="M150 141 C168 116 198 122 194 141 C190 160 168 164 150 141 z"/>
      <circle cx="150" cy="141" r="8" fill="${INK}"/>` },

    { id: 'a3-unicorn', cat: 'princess', name: N('Unicorn', 'Licorne', 'Unicornio', 'Einhorn', '独角兽'), svg: `
      <path ${R} d="M150 80 C200 56 252 82 254 126 C274 148 266 182 248 194 C262 218 246 248 218 250 C222 222 216 190 208 160 C198 122 178 96 150 80 z"/>
      <path ${R} d="M96 114 C80 88 78 58 88 40 C108 54 124 78 124 100 z"/>
      <path ${R} d="M204 114 C220 88 222 58 212 40 C192 54 176 78 176 100 z"/>
      <ellipse ${R} cx="150" cy="148" rx="78" ry="70"/>
      <ellipse ${R} cx="150" cy="206" rx="62" ry="44"/>
      <polygon ${R} points="128,92 172,92 150,14"/>
      <path d="M135 72 L163 64 M141 50 L159 45" ${D}/>
      <path ${R} d="M152 94 C130 66 96 70 90 98 C104 94 114 106 110 120 C128 118 144 108 152 94 z"/>
      ${eye(118, 150, 12)}${eye(182, 150, 12)}
      <ellipse cx="134" cy="202" rx="5" ry="7" fill="${INK}"/><ellipse cx="166" cy="202" rx="5" ry="7" fill="${INK}"/>
      <path d="M128 224 Q150 240 172 224" ${D}/>` },

    { id: 'a3-mermaid-tail', cat: 'princess', name: N('Mermaid tail', 'Queue de sirène', 'Cola de sirena', 'Meerjungfrauenschwanz', '美人鱼尾巴'), svg: `
      <path ${R} d="M86 250 C78 196 104 160 142 134 C162 120 176 108 182 92 L210 96 C204 116 194 132 182 146 C160 172 162 212 172 250 z"/>
      <path ${R} d="M196 100 C168 94 138 72 126 42 C156 36 184 52 198 76 z"/>
      <path ${R} d="M196 100 C226 110 256 94 270 68 C246 50 212 54 198 76 z"/>
      <path d="M100 214 q10 12 20 0 q10 12 20 0 q10 12 20 0 M112 182 q10 12 20 0 q10 12 20 0 M138 152 q10 12 20 0" ${D}/>
      <path ${R} d="M10 236 Q38 220 66 236 Q94 252 122 236 Q150 220 178 236 Q206 252 234 236 Q262 220 290 236 V284 H10 z"/>
      <circle ${R} cx="62" cy="112" r="20"/><circle ${R} cx="84" cy="54" r="16"/><circle ${R} cx="246" cy="166" r="18"/>` },

    { id: 'a3-castle-tower', cat: 'princess', name: N('Castle tower', 'Tour de château', 'Torre del castillo', 'Burgturm', '城堡塔'), svg: `
      <path d="M150 40 V10 M24 264 H276" ${D}/>
      <polygon ${R} points="152,10 200,26 152,42"/>
      <rect ${R} x="96" y="110" width="108" height="154"/>
      <path ${R} d="M76 120 L150 34 L224 120 Q150 140 76 120 z"/>
      <path ${R} d="M130 186 V164 Q150 138 170 164 V186 z"/>
      <path ${R} d="M122 264 V228 Q150 194 178 228 V264 z"/>
      <path d="M102 150 h18 M180 150 h18 M102 212 h14 M186 212 h12" ${D}/>
      <path ${R} d="${puff(66, 248, 36, 22, 7)}"/>
      <path ${R} d="${puff(234, 248, 36, 22, 7)}"/>` },

    { id: 'a3-ballet-slippers', cat: 'princess', name: N('Ballet slippers', 'Chaussons de danse', 'Zapatillas de ballet', 'Ballettschuhe', '芭蕾舞鞋'), svg: `
      <path d="M141 138 C122 112 128 82 143 60 M159 138 C178 112 172 82 157 60" ${D}/>
      <g transform="rotate(12 90 170)">
        <path ${R} d="M85 74 C107 74 123 96 129 130 C131 146 131 158 131 170 C131 232 111 268 85 268 C59 268 39 232 39 170 C39 158 39 146 41 130 C47 96 63 74 85 74 z"/>
        <path ${R} d="M41 130 C47 96 63 74 85 74 C107 74 123 96 129 130 Q85 176 41 130 z"/>
        <path d="M85 172 l-12 -8 v16 z M85 172 l12 -8 v16 z" ${D}/></g>
      <g transform="rotate(-12 210 170)">
        <path ${R} d="M215 74 C237 74 253 96 259 130 C261 146 261 158 261 170 C261 232 241 268 215 268 C189 268 169 232 169 170 C169 158 169 146 171 130 C177 96 193 74 215 74 z"/>
        <path ${R} d="M171 130 C177 96 193 74 215 74 C237 74 253 96 259 130 Q215 176 171 130 z"/>
        <path d="M215 172 l-12 -8 v16 z M215 172 l12 -8 v16 z" ${D}/></g>
      <path ${R} d="M150 48 C124 20 94 28 100 50 C106 68 130 64 150 48 z"/>
      <path ${R} d="M150 48 C176 20 206 28 200 50 C194 68 170 64 150 48 z"/>
      <circle ${R} cx="150" cy="48" r="15"/>` },

    { id: 'a3-hand-mirror', cat: 'princess', name: N('Hand mirror', 'Miroir', 'Espejo de mano', 'Handspiegel', '小镜子'), svg: `
      <rect ${R} x="134" y="190" width="32" height="76" rx="14"/>
      <circle ${R} cx="150" cy="270" r="18"/>
      <ellipse ${R} cx="150" cy="116" rx="84" ry="90"/>
      <ellipse ${R} cx="150" cy="116" rx="60" ry="66"/>
      <ellipse ${R} cx="150" cy="212" rx="26" ry="15"/>
      <path ${R} d="${heart(150, 28, 22)}"/>
      <path d="M112 90 L134 68 M114 116 L154 76" ${D}/>` },

    { id: 'a3-duckling', cat: 'animals', name: N('Duckling', 'Caneton', 'Patito', 'Entchen', '小鸭子'), svg: `
      <path ${R} d="M66 194 C66 150 110 140 160 146 C200 150 226 136 248 112 C262 140 262 200 236 228 C208 252 118 256 90 240 C74 230 66 214 66 194 z"/>
      <circle ${R} cx="110" cy="104" r="52"/>
      <path ${R} d="M64 98 C40 92 20 104 24 118 C28 132 54 134 68 122 z"/>
      <path ${R} d="M146 186 C156 164 204 160 226 178 C218 206 188 220 162 212 C148 206 140 196 146 186 z"/>
      <path ${R} d="M12 240 Q38 226 64 240 Q90 254 116 240 Q142 226 168 240 Q194 254 220 240 Q246 226 272 240 Q284 246 288 252 V284 H12 z"/>
      ${eye(122, 96, 10)}
      <path d="M108 52 q-4 -18 10 -22" ${D}/>` },

    { id: 'a3-piglet', cat: 'animals', name: N('Piglet', 'Petit cochon', 'Cerdito', 'Ferkel', '小猪'), svg: `
      <path ${R} d="M90 92 C72 68 46 52 26 56 C22 82 42 108 70 122 z"/>
      <path ${R} d="M210 92 C228 68 254 52 274 56 C278 82 258 108 230 122 z"/>
      <ellipse ${R} cx="150" cy="160" rx="102" ry="90"/>
      <ellipse ${R} cx="150" cy="176" rx="44" ry="32"/>
      <ellipse ${R} cx="88" cy="190" rx="22" ry="15"/><ellipse ${R} cx="212" cy="190" rx="22" ry="15"/>
      <ellipse cx="136" cy="176" rx="6" ry="10" fill="${INK}"/><ellipse cx="164" cy="176" rx="6" ry="10" fill="${INK}"/>
      ${eye(108, 134, 11)}${eye(192, 134, 11)}
      ${smile(150, 218, 14)}` },

    { id: 'a3-frog', cat: 'animals', name: N('Frog', 'Grenouille', 'Rana', 'Frosch', '青蛙'), svg: `
      <ellipse ${R} cx="150" cy="262" rx="130" ry="26"/>
      <ellipse ${R} cx="150" cy="214" rx="82" ry="50"/>
      <ellipse ${R} cx="150" cy="222" rx="46" ry="32"/>
      <circle ${R} cx="98" cy="80" r="38"/><circle ${R} cx="202" cy="80" r="38"/>
      <ellipse ${R} cx="150" cy="140" rx="108" ry="62"/>
      <path ${R} d="M70 268 C70 246 84 236 100 236 C116 236 130 246 130 268 Q120 276 110 268 Q100 276 90 268 Q80 276 70 268 z"/>
      <path ${R} d="M170 268 C170 246 184 236 200 236 C216 236 230 246 230 268 Q220 276 210 268 Q200 276 190 268 Q180 276 170 268 z"/>
      ${eye(98, 70, 14)}${eye(202, 70, 14)}
      ${ball(140, 118, 4)}${ball(160, 118, 4)}
      <path d="M96 148 Q150 192 204 148" ${D}/>` },

    { id: 'a3-snail', cat: 'animals', name: N('Snail', 'Escargot', 'Caracol', 'Schnecke', '蜗牛'), svg: `
      <path d="M68 118 Q58 96 52 78 M96 114 Q102 94 110 76" ${D}/>${ball(52, 76)}${ball(111, 74)}
      <path ${R} d="M44 236 C36 200 40 160 50 140 C60 116 84 108 104 116 C124 124 136 140 160 170 L252 228 C268 230 280 244 274 254 C266 264 120 266 70 262 C50 260 44 250 44 236 z"/>
      <circle ${R} cx="196" cy="146" r="84"/>
      <circle ${R} cx="200" cy="149" r="54"/>
      <circle ${R} cx="204" cy="152" r="26"/>
      ${eye(70, 152, 8)}${eye(98, 152, 8)}${smile(84, 170, 9)}` },

    { id: 'a3-ladybug', cat: 'animals', name: N('Ladybug', 'Coccinelle', 'Mariquita', 'Marienkäfer', '瓢虫'), svg: `
      <path d="M132 44 Q120 24 104 16 M168 44 Q180 24 196 16 M64 160 l-20 -8 M60 196 h-22 M66 232 l-20 10 M236 160 l20 -8 M240 196 h22 M234 232 l20 10" ${D}/>${ball(104, 16)}${ball(196, 16)}
      <ellipse ${R} cx="150" cy="82" rx="62" ry="50"/>
      <path ${R} d="M150 90 A90 90 0 0 0 150 270 z"/>
      <path ${R} d="M150 90 A90 90 0 0 1 150 270 z"/>
      <circle ${R} cx="110" cy="140" r="17"/><circle ${R} cx="92" cy="196" r="17"/><circle ${R} cx="124" cy="238" r="15"/>
      <circle ${R} cx="190" cy="140" r="17"/><circle ${R} cx="208" cy="196" r="17"/><circle ${R} cx="176" cy="238" r="15"/>
      ${eye(130, 60, 8)}${eye(170, 60, 8)}${smile(150, 72, 9)}` },

    { id: 'a3-bee', cat: 'animals', name: N('Bee', 'Abeille', 'Abeja', 'Biene', '小蜜蜂'), svg: `
      <g transform="rotate(-20 150 84)"><ellipse ${R} cx="150" cy="84" rx="30" ry="46"/></g>
      <g transform="rotate(20 208 88)"><ellipse ${R} cx="208" cy="88" rx="28" ry="42"/></g>
      <polygon points="266,162 292,170 266,178" fill="${INK}" ${L}/>
      <ellipse ${R} cx="170" cy="170" rx="100" ry="72"/>
      <path ${R} d="${band(170, 170, 100, 72, 148, 188)}"/>
      <path ${R} d="${band(170, 170, 100, 72, 218, 256)}"/>
      <path d="M66 104 Q58 80 42 70 M94 100 Q98 80 104 62" ${D}/>${ball(42, 70)}${ball(104, 60)}
      <circle ${R} cx="82" cy="152" r="54"/>
      ${face(82, 148, 0.9)}` },

    { id: 'a3-penguin', cat: 'animals', name: N('Penguin', 'Pingouin', 'Pingüino', 'Pinguin', '企鹅'), svg: `
      <path ${R} d="M66 130 C40 150 28 196 40 218 C56 212 70 190 76 168 z"/>
      <path ${R} d="M234 130 C260 150 272 196 260 218 C244 212 230 190 224 168 z"/>
      <path ${R} d="M150 28 C222 28 242 110 242 172 C242 238 204 268 150 268 C96 268 58 238 58 172 C58 110 78 28 150 28 z"/>
      <path ${R} d="M150 90 C130 58 82 66 84 106 C86 138 96 160 94 190 C94 236 120 256 150 256 C180 256 206 236 206 190 C204 160 214 138 216 106 C218 66 170 58 150 90 z"/>
      ${eye(122, 112, 11)}${eye(178, 112, 11)}
      <path ${R} d="M128 134 Q150 122 172 134 Q158 160 150 160 Q142 160 128 134 z"/>
      <ellipse ${R} cx="116" cy="268" rx="32" ry="16"/><ellipse ${R} cx="184" cy="268" rx="32" ry="16"/>` },

    { id: 'a3-mouse', cat: 'animals', name: N('Mouse', 'Souris', 'Ratón', 'Maus', '小老鼠'), svg: `
      <circle ${R} cx="78" cy="92" r="58"/><circle ${R} cx="222" cy="92" r="58"/>
      <circle ${R} cx="80" cy="96" r="34"/><circle ${R} cx="220" cy="96" r="34"/>
      <ellipse ${R} cx="150" cy="172" rx="94" ry="82"/>
      ${eye(116, 158, 11)}${eye(184, 158, 11)}
      <ellipse ${R} cx="150" cy="194" rx="20" ry="15"/>
      <path d="M150 209 V214 Q138 228 126 220 M150 214 Q162 228 174 220 M106 196 L52 186 M106 208 L54 218 M194 196 L248 186 M194 208 L246 218" ${D}/>` },

    { id: 'a3-sheep', cat: 'animals', name: N('Sheep', 'Mouton', 'Oveja', 'Schaf', '小绵羊'), svg: `
      <rect ${R} x="100" y="214" width="30" height="56" rx="12"/><rect ${R} x="170" y="214" width="30" height="56" rx="12"/>
      <path ${R} d="${puff(150, 166, 110, 82, 12)}"/>
      <g transform="rotate(-25 90 122)"><ellipse ${R} cx="90" cy="122" rx="32" ry="17"/></g>
      <g transform="rotate(25 210 122)"><ellipse ${R} cx="210" cy="122" rx="32" ry="17"/></g>
      <ellipse ${R} cx="150" cy="144" rx="50" ry="60"/>
      <path ${R} d="${puff(150, 90, 44, 22, 7)}"/>
      ${eye(130, 142, 9)}${eye(170, 142, 9)}
      ${ball(150, 166, 5)}${smile(150, 174, 10)}` },

    { id: 'a3-chick', cat: 'animals', name: N('Chick', 'Poussin', 'Pollito', 'Küken', '小鸡'), svg: `
      <path ${R} d="M96 238 L86 268 Q96 278 106 270 Q114 280 122 270 Q132 278 142 268 L132 238 z"/>
      <path ${R} d="M168 238 L158 268 Q168 278 178 270 Q186 280 194 270 Q204 278 214 268 L204 238 z"/>
      <path ${R} d="M62 150 Q22 148 16 200 Q48 204 72 182 z"/>
      <path ${R} d="M238 150 Q278 148 284 200 Q252 204 228 182 z"/>
      <ellipse ${R} cx="150" cy="150" rx="100" ry="96"/>
      <path d="M144 58 Q138 36 156 28 M154 56 Q166 38 182 44" ${D}/>
      ${eye(112, 128, 12)}${eye(188, 128, 12)}
      <path ${R} d="M124 156 L150 142 L176 156 L150 182 z"/>` },

    { id: 'a3-dino-egg', cat: 'dinosaurs', name: N('Baby dino egg', 'Bébé dino', 'Huevo de dino', 'Dino-Baby im Ei', '恐龙蛋宝宝'), svg: `
      <polygon ${R} points="112,150 110,112 80,124"/><polygon ${R} points="126,60 152,36 120,22"/>
      <path ${R} d="M104 200 C100 160 104 128 120 104 C130 88 140 76 150 70 L190 86 C176 100 168 118 166 140 C164 160 166 180 170 200 z"/>
      <ellipse ${R} cx="180" cy="72" rx="60" ry="42"/>
      ${eye(190, 60, 11)}${ball(226, 64, 3.5)}
      <path d="M194 92 Q214 102 232 88" ${D}/>
      <path ${R} d="M52 180 L76 160 L100 180 L124 160 L150 180 L176 160 L200 180 L224 160 L248 180 C262 222 252 280 150 280 C48 280 38 222 52 180 z"/>
      <circle ${R} cx="98" cy="226" r="20"/><circle ${R} cx="168" cy="246" r="20"/><circle ${R} cx="212" cy="210" r="17"/>` },

    { id: 'a3-baby-dragon', cat: 'dinosaurs', name: N('Baby dragon', 'Bébé dragon', 'Dragoncito', 'Babydrache', '小龙宝宝'), svg: `
      <path ${R} d="M86 226 L26 170 Q34 196 20 214 Q44 214 42 238 Q58 234 68 262 z"/>
      <path ${R} d="M84 180 C76 230 64 262 58 288 H162 C156 262 150 230 160 190 z"/>
      <path ${R} d="M160 190 C150 230 156 262 162 288 H124 C120 262 120 230 130 196 z"/>
      <path d="M126 232 H154 M124 260 H158" ${D}/>
      <path ${R} d="M88 94 Q60 72 30 62 Q66 46 110 74 z"/>
      <path ${R} d="M114 76 Q98 48 74 24 Q114 30 142 68 z"/>
      <polygon ${R} points="62,106 20,126 60,156"/>
      <circle ${R} cx="124" cy="136" r="70"/>
      <ellipse ${R} cx="200" cy="168" rx="64" ry="40"/>
      ${eye(128, 122, 15)}${ball(242, 150, 5)}
      <path d="M178 190 Q214 208 250 186" ${D}/>` },

    { id: 'a3-starfish', cat: 'ocean', name: N('Starfish', 'Étoile de mer', 'Estrella de mar', 'Seestern', '海星'), svg: `
      <path ${R} d="${softStar(150, 158, 196, 62)}"/>
      <circle ${R} cx="150" cy="158" r="40"/>
      ${[0, 1, 2, 3, 4].map(i => { const p = at(150, 158, -90 + i * 72, 84); return `<circle ${R} cx="${f(p[0])}" cy="${f(p[1])}" r="14"/>`; }).join('')}
      ${face(150, 154, 0.85)}` },

    { id: 'a3-crab', cat: 'ocean', name: N('Crab', 'Crabe', 'Cangrejo', 'Krabbe', '螃蟹'), svg: `
      <path d="M70 196 Q40 196 28 216 M76 222 Q50 230 42 252 M230 196 Q260 196 272 216 M224 222 Q250 230 258 252 M128 124 L122 90 M172 124 L178 90" ${D}/>
      <path ${R} d="M82 100 L83.7 72.4 A40 40 0 1 0 107.6 96.3 z"/>
      <path ${R} d="M218 100 L216.3 72.4 A40 40 0 1 1 192.4 96.3 z"/>
      <ellipse ${R} cx="150" cy="184" rx="100" ry="66"/>
      <circle ${R} cx="120" cy="76" r="20"/><circle ${R} cx="180" cy="76" r="20"/>
      ${eye(122, 78, 9)}${eye(182, 78, 9)}
      ${smile(150, 192, 18)}` },

    { id: 'a3-octopus', cat: 'ocean', name: N('Octopus', 'Pieuvre', 'Pulpo', 'Krake', '章鱼'), svg: `
      ${leg(70, 236, 24, 1)}${leg(110, 252, 10, 1)}${leg(150, 260, 0, 1)}${leg(190, 252, -10, -1)}${leg(230, 236, -24, -1)}
      <ellipse ${R} cx="150" cy="122" rx="104" ry="94"/>
      ${face(150, 132, 1.2)}` },

    { id: 'a3-seashell', cat: 'ocean', name: N('Seashell', 'Coquillage', 'Concha', 'Muschel', '贝壳'), svg: `
      ${fan(150, 250, 140, 190, [-160, -132, -104, -76, -48, -20], 0.05)}
      <path ${R} d="M110 232 H190 L208 270 Q150 282 92 270 z"/>` },

    { id: 'a3-train', cat: 'vehicles', name: N('Train', 'Train', 'Tren', 'Zug', '火车'), svg: `
      <path d="M14 262 H286" ${D}/>
      <path ${R} d="${puff(238, 50, 38, 24, 7)}"/>
      <path ${R} d="M196 142 L188 96 H228 L220 142 z"/>
      <path ${R} d="M116 140 H238 Q264 140 264 180 Q264 220 238 220 H116 z"/>
      <rect ${R} x="36" y="100" width="84" height="120"/>
      <rect ${R} x="26" y="78" width="104" height="28" rx="10"/>
      <rect ${R} x="54" y="120" width="48" height="44" rx="8"/>
      <circle ${R} cx="80" cy="226" r="32"/><circle ${R} cx="168" cy="232" r="26"/><circle ${R} cx="226" cy="232" r="26"/>
      ${ball(80, 226, 7)}${ball(168, 232, 6)}${ball(226, 232, 6)}` },

    { id: 'a3-sailboat', cat: 'vehicles', name: N('Sailboat', 'Voilier', 'Velero', 'Segelboot', '帆船'), svg: `
      <circle ${R} cx="54" cy="56" r="28"/>
      <path ${R} d="${puff(244, 54, 40, 22, 7)}"/>
      <path d="M150 18 V196" ${D}/>
      <polygon ${R} points="153,20 198,34 153,50"/>
      <path ${R} d="M158 58 Q222 120 254 186 H158 z"/>
      <path ${R} d="M142 72 Q102 132 68 186 H142 z"/>
      <path ${R} d="M32 188 H268 L242 250 Q150 262 58 250 z"/>
      <path ${R} d="M45.4 220 H254.6 L242 250 Q150 262 58 250 z"/>
      <path d="M20 276 q14 -10 28 0 q14 10 28 0 q14 -10 28 0 q14 10 28 0 q14 -10 28 0 q14 10 28 0 q14 -10 28 0 q14 10 28 0 q14 -10 28 0" ${D}/>` },

    { id: 'a3-airplane', cat: 'vehicles', name: N('Airplane', 'Avion', 'Avión', 'Flugzeug', '飞机'), svg: `
      <path ${R} d="M128 126 L170 126 L142 66 Q134 58 124 66 z"/>
      <path ${R} d="M40 140 L30 76 Q32 62 46 66 L100 126 z"/>
      <path ${R} d="M30 152 C30 130 50 120 80 120 H210 C246 120 272 140 272 162 C272 184 246 200 210 200 H80 C50 200 30 178 30 152 z"/>
      <path ${R} d="M206 134 H222 C244 134 258 146 262 162 H206 z"/>
      <circle ${R} cx="102" cy="152" r="16"/><circle ${R} cx="141" cy="152" r="16"/><circle ${R} cx="180" cy="152" r="16"/>
      <path ${R} d="M126 176 L182 176 L146 248 Q136 258 124 250 z"/>
      <path ${R} d="${puff(66, 246, 42, 20, 7)}"/>` },

    { id: 'a3-bus', cat: 'vehicles', name: N('Bus', 'Bus', 'Autobús', 'Bus', '公交车'), svg: `
      <path d="M14 258 H286" ${D}/>
      <path ${R} d="M28 94 Q28 70 52 70 H244 Q272 70 276 104 L280 212 Q280 226 266 226 H40 Q28 226 28 214 z"/>
      <rect ${R} x="28" y="162" width="250" height="28"/>
      <rect ${R} x="44" y="88" width="46" height="50" rx="8"/><rect ${R} x="102" y="88" width="46" height="50" rx="8"/><rect ${R} x="160" y="88" width="46" height="50" rx="8"/>
      <rect ${R} x="218" y="88" width="44" height="112" rx="6"/>
      <circle ${R} cx="86" cy="228" r="30"/><circle ${R} cx="222" cy="228" r="30"/>
      ${ball(86, 228, 8)}${ball(222, 228, 8)}` },

    { id: 'a3-moon', cat: 'space', name: N('Moon', 'Lune', 'Luna', 'Mond', '月亮'), svg: `
      <path ${R} d="M160.5 30.5 A120 120 0 1 0 256.2 205.9 A100 100 0 1 1 160.5 30.5 z"/>
      <path ${R} d="${roundStar(220, 122, 38, 17, 5, 7)}"/>
      <path ${R} d="${roundStar(258, 40, 30, 14, 5, 6)}"/>
      <path ${R} d="${roundStar(42, 42, 30, 14, 5, 6)}"/>
      <path ${R} d="${roundStar(258, 260, 30, 14, 5, 6)}"/>
      ${eye(54, 138, 9)}${eye(88, 138, 9)}${smile(71, 158, 12)}` },

    { id: 'a3-star', cat: 'space', name: N('Star', 'Étoile', 'Estrella', 'Stern', '星星'), svg: `
      <path ${R} d="${roundStar(150, 160, 134, 64, 5, 22)}"/>
      <path ${R} d="${roundStar(150, 160, 80, 38, 5, 12)}"/>
      ${sparkle(42, 48, 28)}${sparkle(258, 50, 28)}
      ${sparkle(150, 266, 26)}
      ${face(150, 158, 0.9)}` },

    { id: 'a3-planet', cat: 'space', name: N('Planet', 'Planète', 'Planeta', 'Planet', '星球'), svg: `
      <g transform="rotate(-15 150 150)"><path ${R} d="M18 150 A132 50 0 0 1 282 150 L230 150 A80 22 0 0 0 70 150 z"/></g>
      <circle ${R} cx="150" cy="150" r="82"/>
      <g transform="rotate(-15 150 150)"><path ${R} d="M18 150 A132 50 0 0 0 282 150 L230 150 A80 22 0 0 1 70 150 z"/></g>
      <path ${R} d="${roundStar(48, 48, 30, 14, 5, 6)}"/>
      <path ${R} d="${roundStar(254, 252, 30, 14, 5, 6)}"/>
      ${sparkle(50, 250, 28)}
      ${face(150, 118, 1.1)}` },

    { id: 'a3-flying-saucer', cat: 'space', name: N('Flying saucer', 'Soucoupe volante', 'Platillo volador', 'Ufo', '飞碟'), svg: `
      <polygon ${R} points="112,196 188,196 244,284 56,284"/>
      <path d="M150 60 V30" ${D}/>${ball(150, 26, 9)}
      <path ${R} d="M84 150 C84 30 216 30 216 150 z"/>
      <ellipse ${R} cx="150" cy="158" rx="130" ry="34"/>
      <circle ${R} cx="78" cy="160" r="15"/><circle ${R} cx="150" cy="164" r="15"/><circle ${R} cx="222" cy="160" r="15"/>
      <ellipse ${R} cx="150" cy="196" rx="66" ry="20"/>
      ${eye(130, 92, 10)}${eye(170, 92, 10)}${smile(150, 106, 10)}` },

    { id: 'a3-apple', cat: 'food', name: N('Apple', 'Pomme', 'Manzana', 'Apfel', '苹果'), svg: `
      <path ${R} d="M136 86 C136 66 134 50 130 34 Q148 22 166 32 C166 50 166 68 166 86 z"/>
      <path ${R} d="M134 60 C118 40 86 36 68 46 C84 66 114 72 134 60 z"/>
      <path ${R} d="M164 56 C182 28 232 22 252 36 C234 66 192 76 164 56 z"/>
      <path d="M172 54 Q210 44 240 38" ${D}/>
      <path ${R} d="M150 82 C120 58 46 62 44 146 C42 214 94 270 132 262 C142 258 158 258 168 262 C206 270 258 214 256 146 C254 62 180 58 150 82 z"/>
      ${face(150, 168, 1.15)}` },

    { id: 'a3-strawberry', cat: 'food', name: N('Strawberry', 'Fraise', 'Fresa', 'Erdbeere', '草莓'), svg: `
      <path ${R} d="M138 92 C138 70 134 54 128 40 Q146 28 164 38 C166 56 166 74 164 92 z"/>
      <path ${R} d="M150 84 C210 70 262 100 256 150 C250 200 196 252 150 272 C104 252 50 200 44 150 C38 100 90 70 150 84 z"/>
      <path ${R} d="M148 86 C120 84 86 98 70 124 C100 130 132 116 150 96 z"/>
      <path ${R} d="M152 86 C180 84 214 98 230 124 C200 130 168 116 150 96 z"/>
      <path ${R} d="M130 88 C126 110 136 128 150 136 C164 128 174 110 170 88 z"/>
      ${[[94, 152], [206, 152], [118, 214], [182, 214], [150, 246], [76, 180], [224, 180], [114, 120], [186, 120]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.5" ry="5.5" fill="${INK}"/>`).join('')}
      ${face(150, 176, 1)}` },

    { id: 'a3-donut', cat: 'food', name: N('Donut', 'Beignet', 'Dona', 'Donut', '甜甜圈'), svg: `
      <path ${R} fill-rule="evenodd" d="M22 152 A128 128 0 1 0 278 152 A128 128 0 1 0 22 152 z M114 152 A36 36 0 1 0 186 152 A36 36 0 1 0 114 152 z"/>
      <path ${R} fill-rule="evenodd" d="${puff(150, 152, 92, 92, 12)} M114 152 A36 36 0 1 0 186 152 A36 36 0 1 0 114 152 z"/>
      <circle ${R} cx="93" cy="119" r="15"/><circle ${R} cx="150" cy="86" r="15"/><circle ${R} cx="207" cy="119" r="15"/>
      <path d="M92 168 l14 8 M208 168 l-14 8 M206 82 l10 -10 M94 82 l-10 -10 M78 150 l-4 -14 M222 150 l4 -14" ${D}/>
      ${eye(130, 208, 8)}${eye(170, 208, 8)}${smile(150, 222, 9)}` },

    { id: 'a3-lollipop', cat: 'food', name: N('Lollipop', 'Sucette', 'Piruleta', 'Lutscher', '棒棒糖'), svg: `
      <rect ${R} x="136" y="196" width="28" height="88" rx="12"/>
      ${swirl(150, 112, 96, 6)}
      <circle ${R} cx="150" cy="112" r="22"/>
      <path ${R} d="M150 232 C130 212 108 206 106 218 C104 230 106 242 108 250 C116 256 132 252 150 232 z"/>
      <path ${R} d="M150 232 C170 212 192 206 194 218 C196 230 194 242 192 250 C184 256 168 252 150 232 z"/>` },

    { id: 'a3-pizza', cat: 'food', name: N('Pizza', 'Pizza', 'Pizza', 'Pizza', '披萨'), svg: `
      <path ${R} d="M46 74 Q150 96 254 74 L158 270 Q150 282 142 270 z"/>
      <path ${R} d="M30 62 Q150 30 270 62 Q282 80 264 92 Q150 112 36 92 Q18 80 30 62 z"/>
      <circle ${R} cx="102" cy="130" r="20"/><circle ${R} cx="198" cy="130" r="20"/><circle ${R} cx="150" cy="214" r="18"/>
      ${eye(128, 160, 9)}${eye(172, 160, 9)}${smile(150, 176, 10)}` },

    { id: 'a3-watermelon', cat: 'food', name: N('Watermelon', 'Pastèque', 'Sandía', 'Wassermelone', '西瓜'), svg: `
      <path ${R} d="M8 80 H292 A142 176 0 0 1 8 80 z"/>
      <path ${R} d="M40 80 H260 A110 142 0 0 1 40 80 z"/>
      <path ${R} d="M70 80 H230 A80 110 0 0 1 70 80 z"/>
      <ellipse ${R} cx="102" cy="128" rx="18" ry="13"/><ellipse ${R} cx="198" cy="128" rx="18" ry="13"/>
      ${[[96, 98], [204, 98], [120, 156], [180, 156], [150, 172]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="6" fill="${INK}"/>`).join('')}
      ${eye(128, 108, 9)}${eye(172, 108, 9)}${smile(150, 124, 11)}` },

    { id: 'a3-sun', cat: 'nature', name: N('Sun', 'Soleil', 'Sol', 'Sonne', '太阳'), svg: `
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(k => { const a = -90 + k * 45, p = at(150, 150, a - 21, 66), c = at(150, 150, a - 10, 112), t = at(150, 150, a, 140), e = at(150, 150, a + 10, 112), s = at(150, 150, a + 21, 66); return `<path ${R} d="M${f(p[0])} ${f(p[1])} Q${f(c[0])} ${f(c[1])} ${f(t[0])} ${f(t[1])} Q${f(e[0])} ${f(e[1])} ${f(s[0])} ${f(s[1])} z"/>`; }).join('')}
      <circle ${R} cx="150" cy="150" r="76"/>
      ${face(150, 144, 1.35)}` },

    { id: 'a3-tulip', cat: 'nature', name: N('Tulip', 'Tulipe', 'Tulipán', 'Tulpe', '郁金香'), svg: `
      <path ${R} d="M136 156 C135 200 137 240 138 286 H164 C164 240 166 200 164 156 z"/>
      <path ${R} d="M146 276 C108 266 70 228 60 168 C98 182 134 216 148 254 z"/>
      <path ${R} d="M154 268 C192 256 226 218 238 170 C202 182 168 214 152 244 z"/>
      <path ${R} d="M118 132 C112 82 128 48 150 30 C172 48 188 82 182 132 z"/>
      <path ${R} d="M150 172 C104 172 82 140 86 62 C106 72 126 86 140 102 C152 120 158 148 150 172 z"/>
      <path ${R} d="M150 172 C196 172 218 140 214 62 C194 72 174 86 160 102 C148 120 142 148 150 172 z"/>` },

    { id: 'a3-mushroom', cat: 'nature', name: N('Mushroom', 'Champignon', 'Seta', 'Pilz', '蘑菇'), svg: `
      <path ${R} d="M110 172 C104 210 100 248 104 264 H196 C200 248 196 210 190 172 z"/>
      <path ${R} d="M30 168 C30 82 90 36 150 36 C210 36 270 82 270 168 C270 182 260 188 248 188 H52 C40 188 30 182 30 168 z"/>
      <circle ${R} cx="92" cy="122" r="22"/><circle ${R} cx="150" cy="76" r="22"/><circle ${R} cx="208" cy="122" r="22"/><circle ${R} cx="150" cy="150" r="18"/>
      ${eye(130, 216, 9)}${eye(170, 216, 9)}${smile(150, 232, 10)}` },

    { id: 'a3-rain-cloud', cat: 'nature', name: N('Rain cloud', 'Nuage de pluie', 'Nube de lluvia', 'Regenwolke', '下雨的云'), svg: `
      <path ${R} d="M66 180 C30 180 24 136 58 124 C54 86 100 68 126 92 C138 52 200 48 214 90 C242 72 282 98 270 132 C294 144 288 182 252 182 z"/>
      <path ${R} d="${drop(72, 230, 18)}"/><path ${R} d="${drop(124, 256, 18)}"/><path ${R} d="${drop(176, 230, 18)}"/><path ${R} d="${drop(228, 256, 18)}"/>
      ${face(160, 134, 1.2)}` },

    { id: 'a3-beach-ball', cat: 'hobbies', name: N('Beach ball', 'Ballon de plage', 'Pelota de playa', 'Wasserball', '沙滩球'), svg: `
      <path ${R} d="M150 80 Q33.8 102.3 33.8 129.5 A118 118 0 0 1 266.2 129.5 Q266.2 102.3 150 80 z"/>
      <path ${R} d="M150 80 Q266.2 102.3 266.2 129.5 A118 118 0 0 1 252.2 209 Q252.2 138.1 150 80 z"/>
      <path ${R} d="M150 80 Q252.2 138.1 252.2 209 A118 118 0 0 1 190.4 260.9 Q190.4 153.4 150 80 z"/>
      <path ${R} d="M150 80 Q190.4 153.4 190.4 260.9 A118 118 0 0 1 109.6 260.9 Q109.6 153.4 150 80 z"/>
      <path ${R} d="M150 80 Q109.6 153.4 109.6 260.9 A118 118 0 0 1 47.8 209 Q47.8 138.1 150 80 z"/>
      <path ${R} d="M150 80 Q47.8 138.1 47.8 209 A118 118 0 0 1 33.8 129.5 Q33.8 102.3 150 80 z"/>
      <circle ${R} cx="150" cy="80" r="22"/>
      <path d="M200 54 Q222 62 236 80" ${D}/>` },

    { id: 'a3-drum', cat: 'hobbies', name: N('Drum', 'Tambour', 'Tambor', 'Trommel', '鼓'), svg: `
      <path ${R} d="M48 104 V222 A102 30 0 0 0 252 222 V104 z"/>
      <path d="M70 158 L110 243.6 L150 168 L190 243.6 L230 158" ${D}/>
      <path ${R} d="M44 214 A106 32 0 0 0 256 214 V244 A106 32 0 0 1 44 244 z"/>
      <path ${R} d="M44 104 A106 32 0 0 0 256 104 V134 A106 32 0 0 1 44 134 z"/>
      <ellipse ${R} cx="150" cy="104" rx="106" ry="32"/>
      <g transform="rotate(-31.7 100 96)"><rect ${R} x="100" y="84" width="141" height="24" rx="12"/></g>
      <g transform="rotate(31.7 200 96)"><rect ${R} x="59" y="84" width="141" height="24" rx="12"/></g>
      <circle ${R} cx="220" cy="22" r="16"/><circle ${R} cx="80" cy="22" r="16"/>` },

    { id: 'a3-kite', cat: 'hobbies', name: N('Kite', 'Cerf-volant', 'Cometa', 'Drachen', '风筝'), svg: `
      <path d="M118 214 Q128 256 166 252 Q214 248 232 266" ${D}/>
      <polygon ${R} points="118,14 28,98 118,98"/><polygon ${R} points="118,14 208,98 118,98"/>
      <polygon ${R} points="28,98 118,214 118,98"/><polygon ${R} points="208,98 118,214 118,98"/>
      <path ${R} d="M136 232 L196 272 V232 L136 272 z"/>
      <path ${R} d="M204 246 L260 286 V246 L204 286 z"/>` },

    { id: 'a3-birthday-cake', cat: 'holidays', name: N('Birthday cake', "Gâteau d'anniversaire", 'Pastel de cumpleaños', 'Geburtstagskuchen', '生日蛋糕'), svg: `
      <ellipse ${R} cx="150" cy="262" rx="132" ry="20"/>
      <rect ${R} x="40" y="176" width="220" height="82" rx="10"/>
      <rect ${R} x="90" y="66" width="28" height="42" rx="6"/><rect ${R} x="136" y="58" width="28" height="50" rx="6"/><rect ${R} x="182" y="66" width="28" height="42" rx="6"/>
      <rect ${R} x="72" y="112" width="156" height="68" rx="10"/>
      <path ${R} d="M68 112 Q68 100 80 100 H220 Q232 100 232 112 V124 Q220 140 208 124 Q196 140 184 124 Q172 140 160 124 Q148 140 136 124 Q124 140 112 124 Q100 140 88 124 Q76 140 68 124 z"/>
      <path ${R} d="${drop(104, 42, 15)}"/><path ${R} d="${drop(150, 34, 15)}"/><path ${R} d="${drop(196, 42, 15)}"/>
      ${[[70, 206], [110, 228], [150, 206], [190, 228], [230, 206], [100, 154], [150, 162], [200, 154]].map(([x, y]) => ball(x, y, 5)).join('')}` },

    { id: 'a3-gift', cat: 'holidays', name: N('Present', 'Cadeau', 'Regalo', 'Geschenk', '礼物'), svg: `
      <path ${R} d="M150 100 C118 56 66 62 76 92 C84 112 120 110 150 100 z"/>
      <path ${R} d="M150 100 C182 56 234 62 224 92 C216 112 180 110 150 100 z"/>
      <rect ${R} x="50" y="140" width="200" height="128" rx="8"/>
      <rect ${R} x="128" y="140" width="44" height="128"/>
      <rect ${R} x="36" y="102" width="228" height="46" rx="10"/>
      <rect ${R} x="128" y="102" width="44" height="46"/>
      <ellipse ${R} cx="150" cy="100" rx="22" ry="17"/>` },

    { id: 'a3-pumpkin', cat: 'holidays', name: N('Pumpkin', 'Citrouille', 'Calabaza', 'Kürbis', '南瓜'), svg: `
      <path ${R} d="M136 94 C136 72 132 58 126 44 L160 36 C164 56 164 76 164 94 z"/>
      <path d="M128 60 q-24 -12 -32 8 q-4 18 14 18 q12 -2 8 -14" ${D}/>
      <ellipse ${R} cx="104" cy="178" rx="78" ry="86"/><ellipse ${R} cx="196" cy="178" rx="78" ry="86"/>
      <ellipse ${R} cx="150" cy="178" rx="64" ry="92"/>
      <path ${R} d="M164 64 C182 34 234 32 250 50 C232 78 192 86 164 64 z"/>
      ${eye(128, 168, 11)}${eye(172, 168, 11)}${smile(150, 192, 14)}` },

    { id: 'a3-easter-egg', cat: 'holidays', name: N('Easter egg', 'Œuf de Pâques', 'Huevo de Pascua', 'Osterei', '复活节彩蛋'), svg: `
      ${eggBands(150, 160, 100, 134, 112, [{ y: 84, a: 10, n: 8 }, { y: 128 }, { y: 192 }, { y: 228, a: 7, n: 8, wave: true }])}
      ${eye(128, 152, 9)}${eye(172, 152, 9)}${smile(150, 168, 10)}` },

    { id: 'a3-umbrella', cat: 'things', name: N('Umbrella', 'Parapluie', 'Paraguas', 'Regenschirm', '雨伞'), svg: `
      <path ${R} d="M164 146 V240 A40 40 0 0 1 84 240 V226 A14 14 0 0 1 112 226 V240 A12 12 0 0 0 136 240 V146 z"/>
      <path d="M150 34 V16" ${D}/>${ball(150, 14, 7)}
      <path ${R} d="M150 30 C70 30 20 90 20 150 Q52 128 85 150 C90 100 120 40 150 30 z"/>
      <path ${R} d="M150 30 C120 40 90 100 85 150 Q117 128 150 150 L150 30 z"/>
      <path ${R} d="M150 30 L150 150 Q183 128 215 150 C210 100 180 40 150 30 z"/>
      <path ${R} d="M150 30 C180 40 210 100 215 150 Q248 128 280 150 C280 90 230 30 150 30 z"/>
      <path ${R} d="${drop(36, 50, 15)}"/><path ${R} d="${drop(264, 50, 15)}"/>` },

    { id: 'a3-rain-boot', cat: 'things', name: N('Rain boot', 'Botte de pluie', 'Bota de lluvia', 'Gummistiefel', '雨靴'), svg: `
      <ellipse ${R} cx="150" cy="262" rx="138" ry="28"/>
      <path ${R} d="M88 56 H198 V176 C230 176 258 190 264 212 C266 224 262 232 254 232 H88 z"/>
      <rect ${R} x="78" y="38" width="130" height="40" rx="12"/>
      <path ${R} d="M80 228 H258 Q272 228 270 242 Q268 256 254 256 H88 Q78 256 78 244 z"/>
      <path ${R} d="${heart(143, 142, 30)}"/>` },

    { id: 'a3-rainbow-heart', cat: 'patterns', name: N('Rainbow heart', 'Cœur arc-en-ciel', 'Corazón arcoíris', 'Regenbogenherz', '彩虹爱心'), svg: `
      ${heartBands([90, 136, 182, 226])}` }
  ]);
})();
