/* Colouring pictures for age 5: a character with props, 12–22 regions, stroke 4, every part big enough to tap.
   Format: see Colouring.addPack in js/colouring.js. Regions = data-r fill="#fff"; decorations = INK or fill="none".
   The first 3 pictures are the ones open while IK_CONFIG.limits applies. Original art only.
   Regions never carry a transform (the fill pop animation would override it); rotated parts sit in a <g>. */
(function () {
  const INK = '#1F3A44', SW = 4;
  const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
  const R = `data-r fill="#fff" ${L}`;                 // a part to colour
  const D = `fill="none" ${L}`;                        // a decoration line
  const T = `fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`; // thin detail line
  const f = v => Math.round(v * 10) / 10;
  const eye = (x, y, r = 6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${f(x + r * 0.35)}" cy="${f(y - r * 0.4)}" r="${f(r * 0.38)}" fill="#fff"/>`;
  const smile = (x, y, w) => `<path d="M${f(x - w)} ${y} q${w} ${f(w * 0.9)} ${f(w * 2)} 0" ${D}/>`;
  const shut = (x, y, w = 6) => `<path d="M${f(x - w)} ${y} q${w} ${f(-w * 1.1)} ${f(w * 2)} 0" ${D}/>`;   // happy closed eye
  const blush = (x, y) => `<path d="M${x - 6} ${y + 2} l3 -4 M${x - 1} ${y + 2} l3 -4 M${x + 4} ${y + 2} l3 -4" ${T}/>`;
  const face = (x, y, s = 1) => eye(x - 12 * s, y, f(5.5 * s)) + eye(x + 12 * s, y, f(5.5 * s)) + smile(x, f(y + 10 * s), f(5 * s)) + blush(f(x - 21 * s), f(y + 8 * s)) + blush(f(x + 21 * s), f(y + 8 * s));
  const N = (en, fr, es, de, zh) => ({ en, fr, es, de, zh });

  // Shape helpers (all return closed outlines).
  const pts = a => a.map(p => f(p[0]) + ',' + f(p[1])).join(' ');
  const starP = (cx, cy, ro, ri = ro * 0.48, n = 5, a0 = -90) => {
    const a = []; for (let i = 0; i < n * 2; i++) { const t = (a0 + i * 180 / n) * Math.PI / 180, r = i % 2 ? ri : ro; a.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); }
    return pts(a);
  };
  const star = (cx, cy, ro, ri, n = 5, a = R) => `<polygon ${a} points="${starP(cx, cy, ro, ri, n)}"/>`;
  const heartD = (x, y, s) => { const p = (dx, dy) => f(x + dx * s) + ' ' + f(y + dy * s);
    return `M${p(0, 0.8)} C${p(-0.2, 0.6)} ${p(-1, 0.1)} ${p(-1, -0.3)} C${p(-1, -0.9)} ${p(-0.2, -1)} ${p(0, -0.5)} C${p(0.2, -1)} ${p(1, -0.9)} ${p(1, -0.3)} C${p(1, 0.1)} ${p(0.2, 0.6)} ${p(0, 0.8)} z`; };
  const heart = (x, y, s, a = R) => `<path ${a} d="${heartD(x, y, s)}"/>`;
  // Scalloped circle: flower, curly hair, cloud puff, frill.
  const scallopD = (cx, cy, r, n, k = 1.1, a0 = -90) => {
    const br = f(r * Math.sin(Math.PI / n) * k); let d = '';
    for (let i = 0; i <= n; i++) { const t = (a0 + i * 360 / n) * Math.PI / 180, x = f(cx + r * Math.cos(t)), y = f(cy + r * Math.sin(t)); d += i ? ` A${br} ${br} 0 0 1 ${x} ${y}` : `M${x} ${y}`; }
    return d + ' z';
  };
  const scallop = (cx, cy, r, n, k, a = R) => `<path ${a} d="${scallopD(cx, cy, r, n, k)}"/>`;
  // A bent tube with round ends (arms, legs, tails, sticks): from x1,y1 through control cx,cy to x2,y2, width w.
  const nrm = (dx, dy, h) => { const l = Math.hypot(dx, dy) || 1; return [-dy / l * h, dx / l * h]; };
  const tubeD = (x1, y1, cx, cy, x2, y2, w) => {
    const h = w / 2, a = nrm(cx - x1, cy - y1, h), b = nrm(x2 - cx, y2 - cy, h), s = [a[0] + b[0], a[1] + b[1]], q = 2 * h * h / (s[0] * s[0] + s[1] * s[1] || 1), m = [s[0] * q, s[1] * q];
    return `M${f(x1 + a[0])} ${f(y1 + a[1])} Q${f(cx + m[0])} ${f(cy + m[1])} ${f(x2 + b[0])} ${f(y2 + b[1])} A${f(h)} ${f(h)} 0 0 0 ${f(x2 - b[0])} ${f(y2 - b[1])} Q${f(cx - m[0])} ${f(cy - m[1])} ${f(x1 - a[0])} ${f(y1 - a[1])} A${f(h)} ${f(h)} 0 0 0 ${f(x1 + a[0])} ${f(y1 + a[1])} z`;
  };
  const tube = (x1, y1, cx, cy, x2, y2, w, a = R) => `<path ${a} d="${tubeD(x1, y1, cx, cy, x2, y2, w)}"/>`;
  const limb = (x1, y1, x2, y2, w, a = R) => tube(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2, x2, y2, w, a);
  // A pointed leaf / petal / feather from x1,y1 to x2,y2, w = half width (rib line added when rib is true).
  const leafD = (x1, y1, x2, y2, w) => { const [nx, ny] = nrm(x2 - x1, y2 - y1, w * 1.3), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return `M${x1} ${y1} Q${f(mx + nx)} ${f(my + ny)} ${x2} ${y2} Q${f(mx - nx)} ${f(my - ny)} ${x1} ${y1} z`; };
  const leaf = (x1, y1, x2, y2, w, rib = true) => `<path ${R} d="${leafD(x1, y1, x2, y2, w)}"/>` + (rib ? `<path d="M${x1} ${y1} L${f(x1 + (x2 - x1) * 0.7)} ${f(y1 + (y2 - y1) * 0.7)}" ${T}/>` : '');
  // Sun rays (decoration) around a circle.
  const rays = (x, y, r1, r2, n = 8, a0 = 0) => { let d = ''; for (let i = 0; i < n; i++) { const t = (a0 + i * 360 / n) * Math.PI / 180; d += `M${f(x + r1 * Math.cos(t))} ${f(y + r1 * Math.sin(t))} L${f(x + r2 * Math.cos(t))} ${f(y + r2 * Math.sin(t))} `; } return `<path d="${d.trim()}" ${D}/>`; };
  // Zig-zag spikes along an elliptical arc (hedgehog back, mane, grass), closed straight back to the start.
  const zigArc = (cx, cy, rx, ry, k, n, a0, a1) => { const a = []; for (let i = 0; i <= 2 * n; i++) { const t = (a0 + (a1 - a0) * i / (2 * n)) * Math.PI / 180, r = i % 2 ? 1 : k; a.push([cx + rx * r * Math.cos(t), cy + ry * r * Math.sin(t)]); } return pts(a); };
  // A straight striped tail in bands (raccoon, lemur): base at x,y pointing at angle deg; cuts = band edges along it.
  const bandTail = (x, y, deg, cuts, h) => { let s = ''; for (let i = 0; i < cuts.length - 1; i++) { const a = cuts[i], b = cuts[i + 1], end = i === cuts.length - 2 ? `A${h} ${h} 0 0 1 ${b} ${h}` : `Q${b + 8} 0 ${b} ${h}`;
    s += `<path ${R} d="M${a} ${-h} L${b} ${-h} ${end} L${a} ${h} Q${a + 8} 0 ${a} ${-h} z"/>`; } return `<g transform="translate(${x} ${y}) rotate(${deg})">${s}</g>`; };
  // Cloud with a flat bottom, centred on x, bottom at y, half width s.
  const cloud = (x, y, s, a = R) => `<path ${a} d="M${f(x - s)} ${y} a${f(0.35 * s)} ${f(0.35 * s)} 0 0 1 ${f(0.3 * s)} ${f(-0.45 * s)} a${f(0.45 * s)} ${f(0.45 * s)} 0 0 1 ${f(0.8 * s)} ${f(-0.15 * s)} a${f(0.35 * s)} ${f(0.35 * s)} 0 0 1 ${f(0.6 * s)} ${f(0.2 * s)} a${f(0.3 * s)} ${f(0.3 * s)} 0 0 1 ${f(0.3 * s)} ${f(0.4 * s)} z"/>`;
  // An ellipse cut into side-by-side bands at the given x positions (fish stripes, bee stripes, mixer drum).
  const ellH = (cx, rx, ry, x) => ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
  const ellBands = (cx, cy, rx, ry, cuts, bulge = 8) => { const xs = [cx - rx, ...cuts, cx + rx]; let s = '';
    for (let i = 0; i < xs.length - 1; i++) { const a = xs[i], b = xs[i + 1], ha = ellH(cx, rx, ry, a), hb = ellH(cx, rx, ry, b);
      s += `<path ${R} d="M${f(a)} ${f(cy - ha)} A${rx} ${ry} 0 0 1 ${f(b)} ${f(cy - hb)} Q${f(b + bulge)} ${cy} ${f(b)} ${f(cy + hb)} A${rx} ${ry} 0 0 1 ${f(a)} ${f(cy + ha)} Q${f(a + bulge)} ${cy} ${f(a)} ${f(cy - ha)} z"/>`; }
    return s; };
  // Ice-cream scoop: round top, drippy bottom.
  const scoopD = (x, y, r) => { let d = `M${f(x - r)} ${y} A${r} ${r} 0 0 1 ${f(x + r)} ${y}`; for (let i = 0; i < 4; i++) d += ` q${f(-r / 4)} ${f(r / 3)} ${f(-r / 2)} 0`; return d + ' z'; };
  // A wavy ribbon / streamer from x1,y1 to x2,y2 (amp = wave height, waves = number of waves, w = width).
  const ribbon = (x1, y1, x2, y2, amp, waves, w) => { const n = 28, dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, top = [], bot = [];
    for (let i = 0; i <= n; i++) { const t = i / n, o = amp * Math.sin(t * waves * 2 * Math.PI), cx = x1 + dx * t - uy * o, cy = y1 + dy * t + ux * o; top.push([cx - uy * w / 2, cy + ux * w / 2]); bot.push([cx + uy * w / 2, cy - ux * w / 2]); }
    return `<polygon ${R} points="${pts(top.concat(bot.reverse()))}"/>`; };
  const rot = (deg, x, y, s) => `<g transform="rotate(${deg} ${x} ${y})">${s}</g>`;
  const wheel = (x, y, r, h = r * 0.42) => `<circle ${R} cx="${x}" cy="${y}" r="${r}"/><circle ${R} cx="${x}" cy="${y}" r="${f(h)}"/>`;
  const bubble = (x, y, r) => `<circle ${R} cx="${x}" cy="${y}" r="${r}"/><path d="M${f(x - r * 0.55)} ${f(y - r * 0.1)} q${f(r * 0.1)} ${f(-r * 0.45)} ${f(r * 0.5)} ${f(-r * 0.5)}" ${T}/>`;
  const spark = (x, y, s = 7) => `<path d="M${x} ${y - s} v${2 * s} M${x - s} ${y} h${2 * s}" ${T}/>`;
  const note = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="${INK}"/><path d="M${x + 5} ${y} v-20 q6 4 10 10" ${T}/>`;
  const flake = (x, y, s) => `<path d="M${x} ${y - s} V${y + s} M${f(x - s * 0.87)} ${f(y - s / 2)} L${f(x + s * 0.87)} ${f(y + s / 2)} M${f(x - s * 0.87)} ${f(y + s / 2)} L${f(x + s * 0.87)} ${f(y - s / 2)}" ${T}/>`;

  Colouring.addPack(5, [
    // 1 Mermaid holding a shell
    { id: 'a5-mermaid-shell', cat: 'princess', name: N('Mermaid', 'Sirène', 'Sirena', 'Meerjungfrau', '美人鱼'), svg: `
      <path ${R} d="M78 284 q2 -46 56 -54 q36 -4 58 12 q42 4 48 42 z"/>
      <path d="M100 268 q10 -6 20 0 M200 266 q8 -5 16 0" ${T}/>
      <path ${R} d="M34 286 q-14 -36 2 -66 q12 -22 0 -50 q26 14 18 50 q-10 34 6 66 z"/>
      ${bubble(56, 64, 14)}${bubble(84, 106, 10)}${bubble(256, 50, 12)}
      <path ${R} d="M106 84 q-4 -54 36 -56 q40 2 36 56 q2 36 14 58 q-18 12 -32 -6 h-36 q-14 18 -32 6 q12 -22 14 -58 z"/>
      <path ${R} d="M228 222 q10 -30 42 -36 q-4 30 -34 52 z"/>
      <path ${R} d="M232 234 q24 -4 42 18 q-26 14 -46 -8 z"/>
      <path ${R} d="M126 168 L158 168 Q162 204 200 218 L234 218 L238 238 Q188 252 150 234 Q122 216 126 168 z"/>
      <path d="M138 186 q5 6 10 0 M150 204 q5 6 10 0 M166 218 q5 6 10 0 M186 228 q5 6 10 0 M208 230 q5 6 10 0" ${T}/>
      <path ${R} d="M134 98 H150 V110 Q164 112 164 124 L160 144 Q164 160 158 174 H126 Q120 160 124 144 L120 124 Q120 112 134 110 Z"/>
      <path ${R} d="M121 132 q10 -9 21 0 q10 -9 21 0 l-1 16 q-20 6 -40 0 z"/>
      <path ${R} d="M120 164 h44 l2 14 q-24 8 -48 0 z"/>
      ${tube(124, 124, 104, 140, 102, 170, 15)}
      <circle ${R} cx="142" cy="78" r="31"/>
      ${face(142, 86)}
      <path ${R} d="M111 82 C109 48 126 37 142 37 C158 37 175 48 173 82 q-12 -20 -21 -22 q-10 14 -20 0 q-10 2 -21 22 z"/>
      ${star(168, 48, 13, 6.5)}
      <path ${R} d="M206 116 L180 88 A10 10 0 0 1 186 70 A10 10 0 0 1 200 60 A10 10 0 0 1 214 60 A10 10 0 0 1 228 70 A10 10 0 0 1 232 88 Z"/>
      <path d="M206 112 L186 72 M206 112 L200 62 M206 112 L214 62 M206 112 L228 72" ${T}/>
      ${tube(160, 124, 184, 128, 200, 114, 15)}` },

    // 2 Kitten with a ball of yarn
    { id: 'a5-kitten-yarn', cat: 'animals', name: N('Kitten and yarn', 'Chaton et sa pelote', 'Gatito con lana', 'Kätzchen mit Wolle', '小猫和毛线球'), svg: `
      <ellipse ${R} cx="150" cy="262" rx="128" ry="24"/>
      <path ${R} d="M84 242 C38 250 22 212 38 182 C44 170 60 170 58 184 C48 204 56 226 88 224 z"/>
      <ellipse ${R} cx="124" cy="204" rx="50" ry="48"/>
      <ellipse ${R} cx="124" cy="216" rx="28" ry="30"/>
      <ellipse ${R} cx="102" cy="250" rx="18" ry="12"/><ellipse ${R} cx="146" cy="250" rx="18" ry="12"/>
      <path d="M96 245 v7 M108 245 v7 M140 245 v7 M152 245 v7" ${T}/>
      <circle ${R} cx="264" cy="176" r="16"/>
      <path d="M252 170 q12 -6 24 4 M250 182 q14 -4 26 6 M262 161 q-8 14 2 30" ${T}/>
      <circle ${R} cx="222" cy="226" r="36"/>
      <path d="M192 212 q28 -12 58 8 M188 232 q32 -14 68 4 M196 250 q24 -8 52 2 M214 191 q-14 30 6 70 M236 192 q-12 30 4 66" ${T}/>
      <path d="M252 246 q22 8 18 26 q-4 12 12 16" ${D}/>
      ${tube(152, 186, 178, 176, 192, 196, 18)}
      <polygon ${R} points="74,100 74,34 122,68"/><polygon ${R} points="126,68 174,34 174,100"/>
      <polygon ${R} points="86,86 84,50 112,70"/><polygon ${R} points="136,70 164,50 162,86"/>
      <ellipse ${R} cx="124" cy="114" rx="56" ry="46"/>
      ${eye(104, 116, 7.5)}${eye(144, 116, 7.5)}
      <path d="M120 124 h8 l-4 5 z" fill="${INK}" ${L}/>
      <path d="M116 131 q4 6 8 0 q4 6 8 0" ${T}/>
      <path d="M70 118 l18 4 M70 131 l18 -1 M178 118 l-18 4 M178 131 l-18 -1 M116 72 l2 10 M124 70 v12 M132 72 l-2 10" ${T}/>
      ${blush(88, 136)}${blush(160, 136)}
      <path ${R} d="M86 150 q38 24 76 0 l0 14 q-38 24 -76 0 z"/>
      <circle ${R} cx="124" cy="180" r="9"/>
      <path d="M118 182 h12" ${T}/>` },

    // 3 Astronaut planting a flag on the moon
    { id: 'a5-astronaut-flag', cat: 'space', name: N('Astronaut', 'Astronaute', 'Astronauta', 'Astronautin', '宇航员'), svg: `
      <circle ${R} cx="42" cy="46" r="24"/>
      <path ${R} d="M26 40 q4 -14 18 -12 q8 6 2 14 q-4 10 -12 12 q-10 -4 -8 -14 z"/>
      ${star(38, 150, 14, 6.5)}${star(258, 150, 13, 6)}
      ${spark(84, 22)}${spark(178, 24, 6)}${spark(276, 104, 6)}
      <path ${R} d="M-10 238 Q80 220 150 230 T310 226 V310 H-10 z"/>
      <ellipse ${R} cx="46" cy="268" rx="24" ry="9"/><ellipse ${R} cx="252" cy="272" rx="28" ry="10"/>
      <rect ${R} x="66" y="140" width="40" height="64" rx="10"/>
      <path ${R} d="M88 152 q0 -20 20 -20 h20 q20 0 20 20 v60 l-4 32 h-22 l-3 -24 h-2 l-3 24 h-22 l-4 -32 z"/>
      <rect ${R} x="102" y="156" width="32" height="24" rx="5"/>
      <circle cx="111" cy="168" r="3.5" fill="${INK}"/><circle cx="125" cy="168" r="3.5" fill="${INK}"/>
      <path d="M90 206 h56" ${T}/>
      <rect ${R} x="84" y="236" width="34" height="20" rx="8"/><rect ${R} x="118" y="236" width="34" height="20" rx="8"/>
      ${tube(94, 146, 70, 156, 64, 186, 17)}
      <circle ${R} cx="64" cy="192" r="12"/>
      <path ${R} d="M193 62 q18 -10 36 0 t36 0 v46 q-18 -10 -36 0 t-36 0 z"/>
      ${star(229, 85, 14, 6.5)}
      <rect ${R} x="184" y="58" width="10" height="192" rx="5"/>
      ${tube(142, 148, 166, 146, 182, 160, 17)}
      <circle ${R} cx="188" cy="162" r="12"/>
      <circle ${R} cx="118" cy="90" r="46"/>
      <circle ${R} cx="118" cy="94" r="31"/>
      ${face(118, 100)}
      <path ${R} d="M88 92 q2 -30 30 -30 q28 0 30 30 q-14 -12 -30 -10 q-16 -2 -30 10 z"/>
      <path d="M84 72 q8 -16 24 -22" ${D}/>
      <path d="M150 56 l12 -16" ${D}/><circle cx="164" cy="37" r="5" fill="${INK}"/>` },

    // 4 Princess holding a flower bouquet
    { id: 'a5-princess-bouquet', cat: 'princess', name: N('Princess with flowers', 'Princesse et ses fleurs', 'Princesa con flores', 'Prinzessin mit Blumen', '拿花的公主'), svg: `
      <path ${R} d="M114 84 q-6 -54 36 -56 q42 2 36 56 q4 22 14 38 q-10 12 -24 6 h-52 q-14 6 -24 -6 q10 -16 14 -38 z"/>
      <rect ${R} x="142" y="100" width="16" height="22" rx="4"/>
      <path ${R} d="M136 156 h28 q34 44 62 112 q-76 18 -152 0 q28 -68 62 -112 z"/>
      <path ${R} d="M80 254 q17 10 35 0 q17 10 35 0 q17 10 35 0 q17 10 35 0 l6 14 q-76 18 -152 0 z"/>
      <path ${R} d="M128 118 q11 -6 22 4 q11 -10 22 -4 l-6 42 h-32 z"/>
      <path ${R} d="M130 118 q-26 -4 -28 22 q12 10 30 0 z"/><path ${R} d="M170 118 q26 -4 28 22 q-12 10 -30 0 z"/>
      <circle ${R} cx="150" cy="76" r="30"/>
      ${face(150, 82)}
      <path ${R} d="M120 80 C118 48 136 38 150 38 C164 38 182 48 180 80 q-10 -18 -20 -20 q-10 12 -20 0 q-10 2 -20 20 z"/>
      <polygon ${R} points="124,48 124,16 138,32 150,10 162,32 176,16 176,48"/>
      <circle cx="150" cy="38" r="4" fill="${INK}"/><circle cx="133" cy="40" r="3" fill="${INK}"/><circle cx="167" cy="40" r="3" fill="${INK}"/>
      ${leaf(136, 154, 116, 122, 11)}${leaf(164, 154, 184, 122, 11)}
      ${scallop(150, 148, 18, 6)}${scallop(124, 168, 18, 6)}${scallop(176, 168, 18, 6)}
      <circle cx="150" cy="148" r="6" ${T}/><circle cx="124" cy="168" r="6" ${T}/><circle cx="176" cy="168" r="6" ${T}/>
      <polygon ${R} points="118,182 182,182 150,246"/>
      ${tube(108, 136, 104, 180, 134, 196, 15)}${tube(192, 136, 196, 180, 166, 196, 15)}
      <path ${R} d="M150 216 L130 204 L130 228 Z M150 216 L170 204 L170 228 Z"/>
      <circle cx="150" cy="216" r="5" fill="${INK}"/>` },

    // 5 Fairy with a star wand
    { id: 'a5-fairy-wand', cat: 'princess', name: N('Fairy', 'Fée', 'Hada', 'Fee', '小仙女'), svg: `
      ${rot(-25, 96, 116, `<ellipse ${R} cx="96" cy="116" rx="44" ry="26"/>`)}${rot(25, 204, 116, `<ellipse ${R} cx="204" cy="116" rx="44" ry="26"/>`)}
      ${rot(30, 106, 166, `<ellipse ${R} cx="106" cy="166" rx="30" ry="18"/>`)}${rot(-30, 194, 166, `<ellipse ${R} cx="194" cy="166" rx="30" ry="18"/>`)}
      <path d="M70 112 q22 -10 44 6 M230 112 q-22 -10 -44 6 M88 168 q12 -8 26 0 M212 168 q-12 -8 -26 0" ${T}/>
      <path ${R} d="M114 84 q-4 -50 36 -52 q40 2 36 52 q2 26 -6 40 h-60 q-8 -14 -6 -40 z"/>
      ${limb(140, 184, 136, 230, 14)}${limb(160, 184, 164, 230, 14)}
      <ellipse ${R} cx="134" cy="236" rx="12" ry="9"/><ellipse ${R} cx="166" cy="236" rx="12" ry="9"/>
      <path ${R} d="M138 110 h24 l4 40 h-32 z"/>
      <path ${R} d="M136 146 h28 q30 20 36 44 q-8 10 -16.7 0 q-8 10 -16.7 0 q-8 10 -16.7 0 q-8 10 -16.6 0 q-8 10 -16.7 0 q-8 10 -16.6 0 q6 -24 36 -44 z"/>
      ${tube(140, 118, 120, 128, 116, 154, 14)}
      <circle ${R} cx="150" cy="82" r="30"/>
      ${face(150, 88)}
      <path ${R} d="M120 86 C118 52 136 42 150 42 C164 42 182 52 180 86 q-12 -20 -22 -22 q-8 12 -16 0 q-12 0 -22 22 z"/>
      ${scallop(178, 50, 12, 5, 1.15)}<circle cx="178" cy="50" r="4" fill="${INK}"/>
      ${limb(204, 92, 224, 50, 9)}
      ${tube(160, 118, 186, 116, 202, 92, 14)}
      ${star(226, 42, 22, 10)}
      ${spark(258, 30)}${spark(196, 22, 6)}${spark(262, 72, 5)}
      ${heart(52, 70, 14)}${star(258, 214, 13, 6)}${spark(48, 220)}` },

    // 6 Unicorn with a rainbow mane and a star
    { id: 'a5-unicorn-star', cat: 'princess', name: N('Unicorn and star', 'Licorne et étoile', 'Unicornio y estrella', 'Einhorn mit Stern', '独角兽和星星'), svg: `
      ${star(56, 58, 30, 14)}${spark(98, 30)}${spark(24, 108, 6)}
      <path ${R} d="M8 288 q30 -26 142 -28 q112 2 142 28 z"/>
      <path ${R} d="M90 146 C62 124 30 136 32 168 C46 154 68 154 90 164 z"/>
      <path ${R} d="M90 160 C58 158 32 180 42 212 C52 192 72 186 92 178 z"/>
      <path ${R} d="M94 174 C70 190 60 222 80 244 C82 218 90 202 104 190 z"/>
      ${limb(100, 196, 100, 244, 20)}${limb(126, 196, 126, 244, 20)}${limb(164, 196, 164, 244, 20)}${limb(188, 192, 188, 244, 20)}
      <rect ${R} x="89" y="238" width="22" height="18" rx="5"/><rect ${R} x="115" y="238" width="22" height="18" rx="5"/>
      <rect ${R} x="153" y="238" width="22" height="18" rx="5"/><rect ${R} x="177" y="238" width="22" height="18" rx="5"/>
      <path ${R} d="M84 170 C84 142 108 132 138 132 C152 132 162 128 170 116 C178 102 188 92 198 88 L228 112 C214 124 206 140 204 160 C202 196 180 212 140 212 C104 212 84 198 84 170 z"/>
      <polygon ${R} points="188,70 192,36 210,62"/>
      <path ${R} d="M200 66 C176 50 150 66 158 92 C168 84 180 82 196 90 z"/>
      <path ${R} d="M186 92 C160 88 138 104 144 128 C152 118 166 114 180 114 z"/>
      <path ${R} d="M174 112 C152 108 132 118 132 140 C142 132 154 128 166 130 z"/>
      <ellipse ${R} cx="208" cy="94" rx="34" ry="30"/>
      <polygon ${R} points="208,66 226,18 232,72"/>
      <path d="M212 56 l18 -4 M216 44 l14 -4 M220 32 l10 -3" ${T}/>
      <ellipse ${R} cx="236" cy="112" rx="24" ry="18"/>
      <circle cx="248" cy="106" r="3" fill="${INK}"/>
      ${eye(206, 92, 7)}<path d="M198 82 l-5 -4 M203 80 l-2 -6" ${T}/>
      <path d="M228 120 q8 6 16 0" ${D}/>${blush(214, 110)}` },

    // 7 Ballerina with a bow in her hair
    { id: 'a5-ballerina-bow', cat: 'princess', name: N('Ballerina', 'Ballerine', 'Bailarina', 'Ballerina', '芭蕾舞女孩'), svg: `
      <ellipse ${R} cx="150" cy="270" rx="78" ry="16"/>
      ${heart(48, 160, 15)}${heart(252, 160, 15)}${note(60, 230)}${note(236, 232)}${spark(46, 100)}${spark(256, 98)}
      <circle ${R} cx="150" cy="36" r="17"/>
      ${limb(141, 180, 140, 248, 15)}${limb(159, 180, 160, 248, 15)}
      <ellipse ${R} cx="139" cy="254" rx="9" ry="13"/><ellipse ${R} cx="161" cy="254" rx="9" ry="13"/>
      <path d="M132 238 l14 8 M146 238 l-14 8 M154 238 l14 8 M168 238 l-14 8" ${T}/>
      <rect ${R} x="143" y="102" width="14" height="18" rx="4"/>
      ${tube(138, 122, 108, 116, 92, 80, 13)}${tube(162, 122, 192, 116, 208, 80, 13)}
      <path ${R} d="M96 176 q54 -22 108 0 q12 12 -2 22 q-52 16 -104 0 q-14 -10 -2 -22 z"/>
      <path ${R} d="M132 116 q18 6 36 0 l-4 44 h-28 z"/>
      <path ${R} d="M128 154 h44 q32 6 44 26 q-10 10 -21.6 2 q-10 10 -21.6 2 q-10 10 -21.6 2 q-10 10 -21.6 2 q-10 10 -21.6 0 q12 -20 44 -26 z"/>
      <circle ${R} cx="150" cy="82" r="30"/>
      ${face(150, 88)}
      <path ${R} d="M118 84 C116 52 134 42 150 42 C166 42 184 52 182 84 C176 68 164 60 150 62 C136 60 124 68 118 84 z"/>
      <path ${R} d="M176 44 C164 26 148 30 150 44 C148 58 164 62 176 44 z"/>
      <path ${R} d="M176 44 C188 26 204 30 202 44 C204 58 188 62 176 44 z"/>
      <ellipse ${R} cx="176" cy="44" rx="8" ry="9"/>` },

    // 8 Snowflake princess in a sparkly dress
    { id: 'a5-snow-princess', cat: 'princess', name: N('Snow princess', 'Princesse des neiges', 'Princesa de la nieve', 'Schneeprinzessin', '雪花公主'), svg: `
      ${star(46, 64, 16, 7, 6)}${flake(46, 64, 9)}${star(256, 54, 14, 6, 6)}${flake(256, 54, 8)}${star(252, 168, 13, 6, 6)}${flake(252, 168, 7)}${star(46, 180, 13, 6, 6)}${flake(46, 180, 7)}
      ${scallop(150, 84, 46, 10, 1.15)}
      <rect ${R} x="142" y="108" width="16" height="18" rx="4"/>
      <path ${R} d="M138 156 h24 q34 46 64 112 q-76 18 -152 0 q30 -66 64 -112 z"/>
      <path ${R} d="M78 254 q12 -12 24 0 q12 -12 24 0 q12 -12 24 0 q12 -12 24 0 q12 -12 24 0 q12 -12 24 0 l2 14 q-76 18 -152 0 z"/>
      ${flake(118, 204, 9)}${flake(182, 204, 9)}${flake(150, 236, 9)}${flake(104, 240, 7)}${flake(196, 240, 7)}
      <path ${R} d="M130 122 q20 10 40 0 l-6 38 h-28 z"/>
      ${scallop(150, 124, 20, 7, 1.1)}
      ${tube(122, 134, 110, 160, 128, 182, 14)}
      ${tube(178, 132, 198, 120, 206, 94, 14)}
      <circle ${R} cx="124" cy="130" r="13"/><circle ${R} cx="176" cy="130" r="13"/>
      <circle ${R} cx="150" cy="90" r="30"/>
      ${face(150, 96)}
      <path ${R} d="M120 92 C118 60 136 50 150 50 C164 50 182 60 180 92 C174 80 168 74 160 74 C156 82 144 82 140 74 C132 74 126 80 120 92 z"/>
      ${star(150, 44, 15, 7, 6)}
      ${star(212, 72, 20, 9, 6)}${flake(212, 72, 11)}${spark(240, 96, 6)}${spark(186, 50, 5)}` },

    // 9 Queen on a throne
    { id: 'a5-queen-throne', cat: 'princess', name: N('Queen on a throne', 'Reine sur son trône', 'Reina en su trono', 'Königin auf dem Thron', '宝座上的女王'), svg: `
      <path ${R} d="M30 292 l30 -38 h180 l30 38 z"/>
      <path ${R} d="M84 236 V84 Q84 30 150 22 Q216 30 216 84 V236 z"/>
      <path ${R} d="M100 226 V92 Q100 48 150 40 Q200 48 200 92 V226 z"/>
      <circle ${R} cx="84" cy="74" r="14"/><circle ${R} cx="216" cy="74" r="14"/>
      <rect ${R} x="50" y="166" width="56" height="26" rx="13"/><rect ${R} x="194" y="166" width="56" height="26" rx="13"/>
      <rect ${R} x="66" y="222" width="168" height="32" rx="10"/>
      <path ${R} d="M126 120 h48 q42 40 50 122 h-148 q8 -82 50 -122 z"/>
      <path ${R} d="M132 156 h36 q28 30 36 88 q-54 14 -108 0 q8 -58 36 -88 z"/>
      <path ${R} d="M130 124 q20 8 40 0 l-4 38 h-32 z"/>
      ${limb(208, 112, 208, 244, 10)}
      ${heart(208, 98, 16)}
      ${tube(128, 134, 108, 166, 140, 184, 16)}${tube(172, 134, 204, 146, 206, 172, 16)}
      <path ${R} d="M118 96 q-4 -48 32 -50 q36 2 32 50 q2 22 8 34 h-80 q6 -12 8 -34 z"/>
      <path ${R} d="M114 122 q36 -14 72 0 q-2 14 -12 12 q-6 8 -16 2 q-8 8 -16 0 q-10 6 -16 -2 q-10 2 -12 -12 z"/>
      <circle ${R} cx="150" cy="94" r="29"/>
      ${face(150, 100)}
      <path ${R} d="M121 92 C119 62 134 54 150 54 C166 54 181 62 179 92 C172 76 162 70 150 72 C138 70 128 76 121 92 z"/>
      <polygon ${R} points="122,62 118,22 136,40 150,14 164,40 182,22 178,62"/>
      <circle cx="150" cy="48" r="4.5" fill="${INK}"/><circle cx="133" cy="52" r="3" fill="${INK}"/><circle cx="167" cy="52" r="3" fill="${INK}"/>` },

    // 10 Fairy mushroom house
    { id: 'a5-mushroom-house', cat: 'princess', name: N('Mushroom house', 'Maison champignon', 'Casa de seta', 'Pilzhaus', '蘑菇小屋'), svg: `
      <path ${R} d="M6 292 q8 -34 44 -34 h200 q36 0 44 34 z"/>
      <rect ${R} x="198" y="26" width="24" height="40" rx="4"/>
      <path d="M210 20 q-10 -8 0 -14 q8 -6 2 -14" ${T}/>
      <path ${R} d="M86 150 Q80 220 74 262 H226 Q220 220 214 150 z"/>
      <path ${R} d="M128 262 V214 q0 -26 22 -26 q22 0 22 26 V262 z"/>
      <circle cx="162" cy="230" r="3.5" fill="${INK}"/>
      <circle ${R} cx="106" cy="212" r="16"/><circle ${R} cx="194" cy="212" r="16"/>
      <path d="M106 196 v32 M90 212 h32 M194 196 v32 M178 212 h32" ${T}/>
      <path ${R} d="M50 150 Q150 170 250 150 Q150 216 50 150 z"/>
      <path ${R} d="M36 152 Q40 50 150 44 Q260 50 264 152 Q150 176 36 152 z"/>
      <circle ${R} cx="96" cy="104" r="17"/><circle ${R} cx="156" cy="76" r="16"/><circle ${R} cx="214" cy="112" r="17"/><ellipse ${R} cx="146" cy="130" rx="18" ry="13"/>
      ${heart(150, 210, 7, `fill="none" ${L}`)}
      <ellipse ${R} cx="150" cy="276" rx="24" ry="9"/>
      <path d="M262 246 v14" ${D}/>${scallop(262, 232, 14, 6)}<circle cx="262" cy="232" r="4" fill="${INK}"/>
      <circle ${R} cx="40" cy="250" r="18"/>
      <path d="M40 250 m0 -2 q6 0 6 6 q-2 8 -10 6 q-10 -4 -6 -14 q6 -10 18 -6" ${T}/>
      <path ${R} d="M14 276 Q14 266 26 266 H56 Q60 252 72 250 Q84 252 82 266 Q80 278 66 278 H22 Q14 278 14 276 z"/>
      <path d="M70 252 l-4 -14 M78 254 l4 -13" ${T}/><circle cx="65" cy="236" r="3.5" fill="${INK}"/><circle cx="83" cy="239" r="3.5" fill="${INK}"/>
      ${eye(72, 262, 3.5)}<path d="M74 270 q4 3 7 0" ${T}/>
      <path ${R} d="M48 36 q-28 -30 -36 -2 q6 22 36 2 z"/><path ${R} d="M52 36 q28 -30 36 -2 q-6 22 -36 2 z"/>
      <path d="M50 24 v24 M48 24 l-6 -8 M52 24 l6 -8" ${D}/>` },

    // 11 Princess with a little bird
    { id: 'a5-princess-bird', cat: 'princess', name: N('Princess and bird', 'Princesse et oiseau', 'Princesa y pajarito', 'Prinzessin mit Vogel', '公主和小鸟'), svg: `
      ${heart(252, 42, 13)}${heart(200, 34, 10)}${note(262, 124)}${spark(40, 60)}
      <path ${R} d="M102 86 q-6 -60 36 -62 q42 2 36 62 q2 44 14 76 q-9 7 -17 0 q-8 7 -17 0 h-32 q-8 7 -17 0 q-8 7 -17 0 q12 -32 14 -76 z"/>
      <path ${R} d="M100 204 h76 q24 38 32 66 q-70 16 -140 0 q8 -28 32 -66 z"/>
      ${scallop(110, 248, 12, 5)}${scallop(170, 248, 12, 5)}
      <path ${R} d="M120 158 h36 q20 30 30 62 q-48 12 -96 0 q10 -32 30 -62 z"/>
      <rect ${R} x="131" y="102" width="14" height="22" rx="4"/>
      <path ${R} d="M118 122 q20 8 40 0 l-4 40 h-32 z"/>
      ${tube(100, 138, 90, 172, 108, 190, 15)}
      <path ${R} d="M120 120 q-24 -4 -26 20 q12 10 28 0 z"/><path ${R} d="M156 120 q24 -4 26 20 q-12 10 -28 0 z"/>
      ${tube(178, 140, 206, 138, 210, 114, 15)}
      <circle ${R} cx="138" cy="80" r="30"/>
      ${face(138, 86)}
      <path ${R} d="M108 84 C104 50 124 40 140 40 C160 40 172 54 168 86 C160 66 142 62 126 66 C118 70 112 76 108 84 z"/>
      <polygon ${R} points="118,52 122,30 131,43 138,24 145,43 154,30 158,52"/>
      <path ${R} d="M212 92 L188 70 Q178 90 192 108 z"/>
      <circle ${R} cx="226" cy="84" r="23"/>
      <polygon ${R} points="246,77 263,86 246,95"/>
      <path ${R} d="M206 90 q16 -18 32 -4 q-12 20 -32 4 z"/>
      ${eye(234, 77, 5)}${blush(238, 94)}<path d="M222 62 q-2 -8 4 -12 M228 62 q2 -8 9 -8 M218 106 v6 M228 106 v6" ${T}/>` },

    // 12 Pony
    { id: 'a5-pony', cat: 'animals', name: N('Pony', 'Poney', 'Poni', 'Pony', '小马驹'), svg: `
      <circle ${R} cx="246" cy="48" r="22"/>${rays(246, 48, 30, 40, 8, 22)}
      <path ${R} d="M8 288 q30 -32 142 -34 q112 2 142 34 z"/>
      <path ${R} d="M212 150 C240 128 272 140 270 172 C256 158 234 158 212 168 z"/>
      <path ${R} d="M212 164 C244 162 270 184 260 216 C250 196 230 190 210 182 z"/>
      ${limb(112, 192, 112, 240, 20)}${limb(136, 192, 136, 240, 20)}${limb(174, 192, 174, 240, 20)}${limb(198, 192, 198, 240, 20)}
      <rect ${R} x="101" y="236" width="22" height="18" rx="5"/><rect ${R} x="125" y="236" width="22" height="18" rx="5"/>
      <rect ${R} x="163" y="236" width="22" height="18" rx="5"/><rect ${R} x="187" y="236" width="22" height="18" rx="5"/>
      <path ${R} d="M216 170 C216 142 192 132 162 132 C148 132 138 128 130 116 C122 102 112 92 102 88 L72 112 C86 124 94 140 96 160 C98 196 120 212 160 212 C196 212 216 198 216 170 z"/>
      <path ${R} d="M140 134 Q170 126 198 138 L202 180 Q170 192 138 180 z"/>
      ${heart(170, 158, 10, `fill="none" ${L}`)}<path d="M144 188 v6 M154 190 v6 M164 191 v6 M174 191 v6 M184 190 v6 M194 187 v6" ${T}/>
      <path ${R} d="M100 66 C124 50 150 66 142 92 C132 84 120 82 104 90 z"/>
      <path ${R} d="M114 92 C140 88 162 104 156 128 C148 118 134 114 120 114 z"/>
      <polygon ${R} points="114,70 110,34 94,62"/><polygon ${R} points="86,66 74,36 68,72"/>
      <ellipse ${R} cx="92" cy="94" rx="34" ry="30"/>
      <ellipse ${R} cx="64" cy="112" rx="24" ry="18"/>
      <circle cx="52" cy="106" r="3" fill="${INK}"/><path d="M56 120 q-8 6 -16 0" ${D}/>
      ${eye(94, 92, 7)}<path d="M102 82 l5 -4 M97 80 l2 -6" ${T}/>${blush(84, 108)}
      <path ${R} d="M108 62 C94 52 72 58 72 80 C82 72 94 72 108 78 z"/>` },

    // 13 Parrot on a perch
    { id: 'a5-parrot-perch', cat: 'animals', name: N('Parrot', 'Perroquet', 'Loro', 'Papagei', '鹦鹉'), svg: `
      <ellipse ${R} cx="150" cy="276" rx="52" ry="12"/>
      <rect ${R} x="142" y="212" width="16" height="64" rx="4"/>
      ${leaf(134, 192, 108, 272, 11, false)}${leaf(158, 192, 184, 270, 11, false)}${leaf(146, 196, 146, 286, 11, false)}
      <rect ${R} x="56" y="198" width="188" height="18" rx="9"/>
      <path ${R} d="M204 176 h34 l-5 22 h-24 z"/>
      <circle cx="214" cy="172" r="3" fill="${INK}"/><circle cx="222" cy="170" r="3" fill="${INK}"/><circle cx="230" cy="173" r="3" fill="${INK}"/>
      ${leaf(62, 200, 34, 172, 10)}${leaf(60, 214, 30, 234, 9)}
      <ellipse ${R} cx="152" cy="154" rx="40" ry="50"/>
      <ellipse ${R} cx="164" cy="166" rx="22" ry="32"/>
      <path ${R} d="M118 128 C100 150 104 190 130 212 C146 200 150 176 148 150 C146 134 132 124 118 128 z"/>
      <path d="M122 162 q10 6 22 2 M124 184 q10 6 20 2" ${T}/>
      <path d="M140 196 q-2 10 6 10 M150 198 q-2 10 6 10 M162 196 q-2 10 6 10 M172 196 q-2 10 6 10" ${D}/>
      <path ${R} d="M146 58 q-12 -22 2 -34 q2 16 10 20 q2 -18 18 -22 q-4 18 4 30 z"/>
      <circle ${R} cx="160" cy="86" r="34"/>
      <ellipse ${R} cx="174" cy="88" rx="18" ry="16"/>
      ${eye(176, 84, 6.5)}${blush(166, 98)}
      <path ${R} d="M188 76 q28 -2 28 24 q-2 10 -10 8 q-2 -14 -18 -14 z"/>
      <path d="M190 94 q12 2 14 12" ${T}/>` },

    // 14 Raccoon with a cookie
    { id: 'a5-raccoon', cat: 'animals', name: N('Raccoon', 'Raton laveur', 'Mapache', 'Waschbär', '小浣熊'), svg: `
      <ellipse ${R} cx="150" cy="264" rx="120" ry="18"/>
      ${bandTail(176, 236, -55, [0, 30, 54, 78, 102, 116], 20)}
      <ellipse ${R} cx="140" cy="206" rx="54" ry="52"/>
      <ellipse ${R} cx="140" cy="216" rx="32" ry="36"/>
      <ellipse ${R} cx="110" cy="254" rx="20" ry="12"/><ellipse ${R} cx="170" cy="254" rx="20" ry="12"/>
      <path d="M104 249 v8 M116 249 v8 M164 249 v8 M176 249 v8" ${T}/>
      <circle ${R} cx="140" cy="190" r="20"/>
      <circle cx="132" cy="184" r="3" fill="${INK}"/><circle cx="146" cy="182" r="3" fill="${INK}"/><circle cx="140" cy="196" r="3" fill="${INK}"/><circle cx="150" cy="194" r="2.5" fill="${INK}"/>
      ${tube(94, 166, 98, 196, 122, 194, 18)}${tube(186, 166, 182, 196, 158, 194, 18)}
      <polygon ${R} points="86,92 92,48 124,70"/><polygon ${R} points="194,92 188,48 156,70"/>
      <polygon ${R} points="96,82 98,58 114,70"/><polygon ${R} points="184,82 182,58 166,70"/>
      <path ${R} d="M78 120 C78 80 104 62 140 62 C176 62 202 80 202 120 L214 134 L194 140 C184 156 164 164 140 164 C116 164 96 156 86 140 L66 134 z"/>
      <path ${R} d="M84 116 C92 98 120 96 140 106 C160 96 188 98 196 116 C186 132 164 134 150 126 C146 132 134 132 130 126 C116 134 94 132 84 116 z"/>
      ${eye(112, 114, 7)}${eye(168, 114, 7)}
      <ellipse ${R} cx="140" cy="142" rx="22" ry="15"/>
      <ellipse cx="140" cy="134" rx="6" ry="4.5" fill="${INK}"/><path d="M134 146 q6 6 12 0" ${D}/>` },

    // 15 Hedgehog with an apple
    { id: 'a5-hedgehog-apple', cat: 'animals', name: N('Hedgehog', 'Hérisson', 'Erizo', 'Igel', '小刺猬'), svg: `
      <ellipse ${R} cx="150" cy="262" rx="134" ry="22"/>
      <path ${R} d="M18 248 q22 -44 48 0 z"/><rect ${R} x="34" y="248" width="16" height="18" rx="4"/>
      <circle cx="34" cy="236" r="4" fill="${INK}"/><circle cx="48" cy="230" r="3" fill="${INK}"/>
      ${leaf(250, 264, 284, 246, 8)}
      <polygon ${R} points="${zigArc(140, 188, 100, 84, 0.76, 14, 160, 352)}"/>
      <ellipse ${R} cx="150" cy="212" rx="70" ry="30"/>
      <ellipse ${R} cx="108" cy="246" rx="16" ry="9"/><ellipse ${R} cx="184" cy="246" rx="16" ry="9"/>
      <path ${R} d="M188 140 C222 140 254 168 266 190 C258 212 226 220 196 214 C174 206 168 152 188 140 z"/>
      <circle ${R} cx="266" cy="190" r="10"/>
      <circle ${R} cx="196" cy="142" r="12"/>
      ${eye(224, 172, 6.5)}${blush(228, 190)}<path d="M240 200 q6 6 12 0" ${D}/>
      <path ${R} d="M128 80 C110 68 90 80 92 100 C94 122 116 130 128 122 C140 130 162 122 164 100 C166 80 146 68 128 80 z"/>
      <path d="M128 80 q-2 -10 4 -16" ${D}/>${leaf(134, 70, 158, 56, 7)}
      <path ${R} d="M232 250 C222 242 206 248 208 262 C210 276 226 280 232 274 C238 280 254 276 256 262 C258 248 242 242 232 250 z"/>
      <path d="M232 250 q0 -8 6 -12" ${D}/>` },

    // 16 Bunny with a carrot
    { id: 'a5-bunny-carrot', cat: 'animals', name: N('Bunny and carrot', 'Lapin et carotte', 'Conejito con zanahoria', 'Häschen mit Karotte', '小兔子和胡萝卜'), svg: `
      <ellipse ${R} cx="150" cy="272" rx="122" ry="16"/>
      ${rot(-12, 120, 62, `<ellipse ${R} cx="120" cy="62" rx="18" ry="44"/><ellipse ${R} cx="120" cy="66" rx="9" ry="30"/>`)}
      ${rot(12, 180, 62, `<ellipse ${R} cx="180" cy="62" rx="18" ry="44"/><ellipse ${R} cx="180" cy="66" rx="9" ry="30"/>`)}
      <ellipse ${R} cx="150" cy="212" rx="54" ry="54"/>
      <ellipse ${R} cx="150" cy="222" rx="32" ry="36"/>
      <ellipse ${R} cx="110" cy="260" rx="26" ry="14"/><ellipse ${R} cx="190" cy="260" rx="26" ry="14"/>
      <path d="M102 256 v6 M110 254 v6 M118 256 v6 M182 256 v6 M190 254 v6 M198 256 v6" ${T}/>
      <ellipse ${R} cx="150" cy="122" rx="52" ry="44"/>
      ${eye(130, 122, 7)}${eye(170, 122, 7)}${blush(116, 138)}${blush(184, 138)}
      <path d="M144 134 h12 l-6 6 z" fill="${INK}" ${L}/><path d="M150 140 v5 M142 148 q8 4 8 -3 q0 7 8 3" ${T}/>
      <path d="M100 134 l-18 -3 M100 142 l-18 3 M200 134 l18 -3 M200 142 l18 3" ${T}/>
      ${leaf(176, 172, 172, 136, 8)}${leaf(182, 176, 214, 156, 8)}
      <path ${R} d="M120 250 Q138 206 160 176 Q172 162 186 172 Q192 186 178 198 Q150 224 120 250 z"/>
      <path d="M150 204 l10 4 M140 220 l9 4 M164 186 l9 4" ${T}/>
      <circle ${R} cx="140" cy="210" r="12"/><circle ${R} cx="168" cy="194" r="12"/>
      <path ${R} d="M186 86 L170 76 L170 96 Z M186 86 L202 76 L202 96 Z"/><circle cx="186" cy="86" r="4.5" fill="${INK}"/>` },

    // 17 Flamingo
    { id: 'a5-flamingo', cat: 'animals', name: N('Flamingo', 'Flamant rose', 'Flamenco', 'Flamingo', '火烈鸟'), svg: `
      <circle ${R} cx="52" cy="50" r="22"/>${rays(52, 50, 30, 40, 8, 22)}
      <ellipse ${R} cx="150" cy="262" rx="128" ry="24"/>
      <path d="M100 252 q8 -4 16 0 M180 270 q8 -4 16 0" ${T}/>
      <ellipse ${R} cx="62" cy="264" rx="28" ry="10"/><path d="M62 264 l18 -6" ${T}/>
      <ellipse ${R} cx="236" cy="270" rx="26" ry="9"/>
      ${star(236, 258, 15, 7, 6)}
      <path d="M262 252 V170 M280 254 V190" ${D}/>
      ${limb(262, 172, 262, 204, 15)}${limb(280, 192, 280, 220, 14)}
      ${leaf(270, 254, 246, 196, 8)}
      <path d="M134 184 V256 M124 184 L106 212 L128 222" ${D}/>
      ${tube(170, 136, 202, 98, 174, 62, 17)}
      <polygon ${R} points="84,136 52,122 62,146 48,166 86,160"/>
      <ellipse ${R} cx="130" cy="150" rx="54" ry="36"/>
      <path ${R} d="M96 140 C110 118 158 122 170 146 C152 172 110 172 96 140 z"/>
      <path d="M118 148 q10 6 22 2 M128 160 q8 4 18 0" ${T}/>
      <circle ${R} cx="176" cy="56" r="22"/>
      <path ${R} d="M194 46 q20 -4 26 14 l-14 8 q-4 -8 -14 -6 z"/>
      <path ${R} d="M220 60 q4 12 -6 20 l-8 -12 z"/>
      ${eye(180, 52, 5.5)}${blush(172, 68)}
      ${scallop(162, 36, 11, 5, 1.15)}<circle cx="162" cy="36" r="3.5" fill="${INK}"/>` },

    // 18 Cow
    { id: 'a5-cow', cat: 'animals', name: N('Cow', 'Vache', 'Vaca', 'Kuh', '奶牛'), svg: `
      <path ${R} d="M6 292 q20 -32 144 -32 q124 0 144 32 z"/>
      ${scallop(36, 262, 12, 5, 1.15)}<circle cx="36" cy="262" r="3.5" fill="${INK}"/>${scallop(264, 262, 12, 5, 1.15)}<circle cx="264" cy="262" r="3.5" fill="${INK}"/>
      <path d="M206 206 q30 -4 36 -30" ${D}/>${scallop(244, 168, 11, 6, 1.15)}
      <ellipse ${R} cx="150" cy="198" rx="62" ry="52"/>
      <path ${R} d="M96 190 C100 172 124 172 128 188 C132 206 112 214 100 206 C94 202 94 196 96 190 z"/>
      <path ${R} d="M178 210 C186 196 206 198 208 214 C208 230 186 232 180 222 C177 218 177 214 178 210 z"/>
      <rect ${R} x="112" y="222" width="30" height="36" rx="10"/><rect ${R} x="158" y="222" width="30" height="36" rx="10"/>
      <rect ${R} x="110" y="250" width="34" height="16" rx="6"/><rect ${R} x="156" y="250" width="34" height="16" rx="6"/>
      ${rot(-20, 82, 94, `<ellipse ${R} cx="82" cy="94" rx="24" ry="12"/>`)}${rot(20, 218, 94, `<ellipse ${R} cx="218" cy="94" rx="24" ry="12"/>`)}
      <path ${R} d="M112 62 q-16 -10 -12 -34 q16 8 24 26 z"/><path ${R} d="M188 62 q16 -10 12 -34 q-16 8 -24 26 z"/>
      <ellipse ${R} cx="150" cy="96" rx="58" ry="46"/>
      <path ${R} d="M100 74 C110 62 132 64 134 82 C136 100 118 108 104 102 C94 96 92 82 100 74 z"/>
      ${eye(118, 88, 7)}${eye(178, 88, 7)}
      <path d="M140 54 q4 -10 10 0 q6 -10 10 0" ${T}/>
      <ellipse ${R} cx="150" cy="124" rx="42" ry="24"/>
      <ellipse cx="136" cy="120" rx="5" ry="7" fill="${INK}"/><ellipse cx="164" cy="120" rx="5" ry="7" fill="${INK}"/>
      <path d="M140 136 q10 8 20 0" ${D}/>
      <path ${R} d="M104 150 q46 22 92 0 l0 13 q-46 22 -92 0 z"/>
      <path ${R} d="M136 192 q0 -24 14 -24 q14 0 14 24 z"/><circle cx="150" cy="194" r="4" fill="${INK}"/>` },

    // 19 Kangaroo with a joey
    { id: 'a5-kangaroo-joey', cat: 'animals', name: N('Kangaroo and joey', 'Kangourou et son petit', 'Canguro y su cría', 'Känguru mit Baby', '袋鼠妈妈和宝宝'), svg: `
      <circle ${R} cx="252" cy="48" r="22"/>${rays(252, 48, 30, 40, 8, 22)}
      ${scallop(262, 236, 24, 7)}
      <path ${R} d="M-10 264 q160 -18 320 0 V310 H-10 z"/>
      <path ${R} d="M114 206 Q62 236 30 250 Q14 258 22 270 Q32 278 50 270 Q100 252 134 232 z"/>
      <path ${R} d="M108 240 C92 204 98 136 142 116 C176 104 198 134 194 174 C190 214 176 240 152 246 z"/>
      ${rot(-20, 158, 150,`<ellipse ${R} cx="158" cy="150" rx="7" ry="12"/>`)}${rot(20, 180, 150, `<ellipse ${R} cx="180" cy="150" rx="7" ry="12"/>`)}
      <circle ${R} cx="169" cy="166" r="15"/>
      ${eye(163, 164, 3.5)}${eye(176, 164, 3.5)}<path d="M166 172 q3 3 6 0" ${T}/>
      <path ${R} d="M142 176 q26 8 50 -4 q4 34 -22 46 q-24 -4 -28 -42 z"/>
      <path ${R} d="M100 248 C88 214 106 188 134 192 C162 196 168 228 158 252 z"/>
      <path ${R} d="M104 246 H198 Q212 246 212 256 Q212 265 200 265 H104 Q96 265 96 256 Q96 246 104 246 z"/>
      ${tube(182, 136, 204, 140, 208, 160, 13)}
      ${rot(-15, 152, 52, `<ellipse ${R} cx="152" cy="52" rx="10" ry="24"/>`)}${rot(12, 176, 50, `<ellipse ${R} cx="176" cy="50" rx="10" ry="24"/>`)}
      <ellipse ${R} cx="168" cy="88" rx="28" ry="24"/>
      <ellipse ${R} cx="196" cy="98" rx="18" ry="13"/>
      <ellipse cx="210" cy="94" rx="4" ry="3" fill="${INK}"/><path d="M196 104 q6 4 12 0" ${D}/>
      ${eye(172, 84, 6)}${blush(162, 100)}` },

    // 20 Squirrel with an acorn
    { id: 'a5-squirrel-acorn', cat: 'animals', name: N('Squirrel', 'Écureuil', 'Ardilla', 'Eichhörnchen', '小松鼠'), svg: `
      <path ${R} d="M8 236 H262 Q280 236 280 250 Q280 264 262 264 H8 z"/>
      ${leaf(236, 238, 262, 204, 10)}${leaf(254, 240, 288, 222, 9)}
      <ellipse ${R} cx="42" cy="220" rx="14" ry="16"/><path ${R} d="M24 212 q18 -26 36 0 q-18 7 -36 0 z"/><path d="M42 200 v-6" ${D}/>
      <path ${R} d="M164 222 C222 232 262 196 256 146 C250 98 206 74 178 98 C176 108 182 114 192 112 C214 110 226 128 222 150 C218 180 196 196 164 196 z"/>
      <ellipse ${R} cx="138" cy="194" rx="40" ry="44"/>
      <ellipse ${R} cx="124" cy="202" rx="22" ry="30"/>
      <ellipse ${R} cx="120" cy="236" rx="24" ry="9"/>
      ${leaf(142, 88, 154, 46, 11)}${leaf(112, 84, 106, 40, 12)}
      <circle ${R} cx="122" cy="110" r="38"/>
      <ellipse ${R} cx="98" cy="126" rx="19" ry="14"/>
      ${eye(116, 104, 7)}<ellipse cx="82" cy="120" rx="5" ry="4" fill="${INK}"/><path d="M88 130 q6 5 12 0" ${D}/>${blush(132, 124)}
      <ellipse ${R} cx="100" cy="178" rx="15" ry="18"/>
      <path ${R} d="M82 170 q18 -26 36 0 q-18 7 -36 0 z"/><path d="M100 158 v-6" ${D}/>
      ${tube(140, 160, 124, 180, 112, 174, 14)}` },

    // 21 Otter holding a shell
    { id: 'a5-otter-shell', cat: 'animals', name: N('Otter', 'Loutre', 'Nutria', 'Otter', '小水獭'), svg: `
      <path ${R} d="M-10 180 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V310 H-10 z"/>
      ${spark(40, 60)}${spark(250, 40)}${cloud(150, 62, 40)}
      ${leaf(226, 176, 290, 160, 11, false)}
      <path ${R} d="M222 152 q-6 -26 8 -32 q8 -2 10 8 q4 -8 12 -4 q8 6 -2 30 z"/>
      <path d="M236 122 l2 12 M248 120 l-2 12" ${T}/>
      <ellipse ${R} cx="154" cy="168" rx="84" ry="32"/>
      <ellipse ${R} cx="160" cy="160" rx="56" ry="20"/>
      <circle ${R} cx="36" cy="128" r="9"/><circle ${R} cx="94" cy="126" r="9"/>
      <circle ${R} cx="65" cy="150" r="35"/>
      ${eye(50, 142, 6)}${eye(80, 142, 6)}
      <ellipse ${R} cx="65" cy="166" rx="20" ry="14"/>
      <ellipse cx="65" cy="159" rx="6" ry="4.5" fill="${INK}"/><path d="M59 169 q6 6 12 0 M44 164 l-16 -2 M44 170 l-16 4 M86 164 l16 -2 M86 170 l16 4" ${T}/>
      <path ${R} d="M156 160 L130 130 A10 10 0 0 1 136 112 A10 10 0 0 1 150 102 A10 10 0 0 1 164 102 A10 10 0 0 1 178 112 A10 10 0 0 1 182 130 Z"/>
      <path d="M156 156 L136 114 M156 156 L150 104 M156 156 L164 104 M156 156 L178 114" ${T}/>
      <circle ${R} cx="128" cy="140" r="10"/><circle ${R} cx="184" cy="140" r="10"/>
      <path ${R} d="M-10 198 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V310 H-10 z"/>
      ${star(244, 254, 18, 8)}${bubble(40, 254, 11)}${bubble(80, 280, 8)}` },

    // 22 Stegosaurus
    { id: 'a5-stegosaurus', cat: 'dinosaurs', name: N('Stegosaurus', 'Stégosaure', 'Estegosaurio', 'Stegosaurus', '剑龙'), svg: `
      <path ${R} d="M-10 250 q160 -12 320 0 V310 H-10 z"/>
      ${leaf(30, 252, 12, 206, 9)}${leaf(42, 252, 64, 206, 9)}
      <polygon ${R} points="30,172 28,140 52,164"/><polygon ${R} points="54,164 56,130 78,156"/>
      ${leaf(110, 150, 88, 106, 14, false)}${leaf(132, 138, 122, 90, 16, false)}${leaf(160, 132, 160, 80, 17, false)}${leaf(188, 134, 198, 88, 16, false)}${leaf(210, 148, 230, 110, 14, false)}
      <rect ${R} x="100" y="196" width="26" height="52" rx="8"/><rect ${R} x="132" y="200" width="26" height="48" rx="8"/>
      <rect ${R} x="176" y="200" width="26" height="48" rx="8"/><rect ${R} x="204" y="192" width="26" height="56" rx="8"/>
      <path d="M106 246 v-6 M113 246 v-6 M120 246 v-6 M182 246 v-6 M189 246 v-6 M196 246 v-6" ${T}/>
      <path ${R} d="M20 172 Q70 160 100 146 Q126 122 162 122 Q212 124 228 170 Q232 204 204 212 H112 Q94 212 86 206 Q52 196 20 172 z"/>
      <circle ${R} cx="152" cy="158" r="13"/><circle ${R} cx="186" cy="172" r="11"/><circle ${R} cx="122" cy="176" r="10"/>
      <ellipse ${R} cx="250" cy="154" rx="32" ry="26"/>
      ${eye(256, 147, 6.5)}<circle cx="276" cy="150" r="2.5" fill="${INK}"/><path d="M254 166 q12 8 22 -4" ${D}/>${blush(242, 164)}` },

    // 23 Pterodactyl (friendly)
    { id: 'a5-pterodactyl', cat: 'dinosaurs', name: N('Pterodactyl', 'Ptérodactyle', 'Pterodáctilo', 'Flugsaurier', '翼龙'), svg: `
      <circle ${R} cx="254" cy="44" r="20"/>${rays(254, 44, 28, 38, 8, 22)}
      ${cloud(56, 250, 36)}${cloud(240, 262, 34)}${cloud(40, 70, 26)}
      <path ${R} d="M134 134 Q76 96 22 104 Q30 132 44 150 Q60 148 68 164 Q84 162 92 180 Q112 176 132 188 z"/>
      <path ${R} d="M166 134 Q224 96 278 104 Q270 132 256 150 Q240 148 232 164 Q216 162 208 180 Q188 176 168 188 z"/>
      ${tube(136, 136, 80, 100, 28, 106, 12)}${tube(164, 136, 220, 100, 272, 106, 12)}
      <ellipse ${R} cx="138" cy="208" rx="8" ry="11"/><ellipse ${R} cx="162" cy="208" rx="8" ry="11"/>
      <ellipse ${R} cx="150" cy="164" rx="28" ry="42"/>
      <ellipse ${R} cx="150" cy="172" rx="16" ry="26"/>
      ${leaf(136, 74, 94, 40, 12, false)}
      <circle ${R} cx="150" cy="94" r="30"/>
      <path ${R} d="M174 88 Q214 84 238 100 Q214 114 174 110 z"/>
      <path d="M180 100 Q206 100 222 101" ${T}/>
      ${eye(154, 90, 7)}${blush(146, 108)}` },

    // 24 Dinosaur on a skateboard
    { id: 'a5-dino-skateboard', cat: 'dinosaurs', name: N('Skateboard dino', 'Dino en skate', 'Dino en monopatín', 'Skater-Dino', '滑板恐龙'), svg: `
      <path d="M14 150 h30 M6 176 h36 M18 202 h24" ${D}/>
      <path ${R} d="M40 230 q-12 -14 2 -20 q8 10 22 10 h172 q14 0 22 -10 q14 6 2 20 q-8 8 -22 8 h-176 q-14 0 -22 -8 z"/>
      <path d="M84 238 v6 M216 238 v6" ${D}/>
      <circle ${R} cx="84" cy="254" r="12"/><circle ${R} cx="216" cy="254" r="12"/>
      <path ${R} d="M110 150 Q72 152 34 126 Q44 172 112 192 z"/>
      <polygon ${R} points="117,135 88,130 107,153"/><polygon ${R} points="133,126 109,108 117,137"/><polygon ${R} points="152,123 138,97 133,126"/>
      ${limb(126, 190, 120, 208, 24)}${limb(176, 192, 186, 208, 24)}
      <ellipse ${R} cx="150" cy="164" rx="50" ry="44"/>
      <ellipse ${R} cx="168" cy="174" rx="27" ry="30"/>
      <ellipse ${R} cx="116" cy="213" rx="26" ry="9"/><ellipse ${R} cx="190" cy="213" rx="26" ry="9"/>
      ${tube(186, 146, 198, 158, 202, 170, 11)}${tube(198, 138, 214, 144, 222, 156, 12)}
      <ellipse ${R} cx="198" cy="92" rx="44" ry="36"/>
      ${eye(214, 94, 7)}<circle cx="236" cy="90" r="2.5" fill="${INK}"/><path d="M208 112 q14 8 28 -4" ${D}/>${blush(198, 108)}
      <path ${R} d="M158 82 Q162 36 202 34 Q244 36 242 80 Q200 68 158 82 z"/>
      <path ${R} d="M190 35 Q202 33 214 36 L210 72 Q200 70 190 72 z"/>
      <path d="M166 80 q4 24 24 30" ${D}/>` },

    // 25 Friendly smiling shark
    { id: 'a5-friendly-shark', cat: 'ocean', name: N('Friendly shark', 'Gentil requin', 'Tiburón amigable', 'Freundlicher Hai', '友好的鲨鱼'), svg: `
      <path ${R} d="M-10 262 q80 -14 160 -4 t160 -4 V310 H-10 z"/>
      <path ${R} d="M30 266 q-14 -36 2 -64 q12 -22 0 -48 q26 14 18 48 q-10 32 6 64 z"/>
      <path ${R} d="M262 262 q-12 -30 2 -54 q10 -18 2 -38 q22 12 14 38 q-8 28 4 54 z"/>
      ${star(92, 270, 15, 7)}
      <path ${R} d="M210 274 L196 258 A9 9 0 0 1 210 246 A9 9 0 0 1 224 258 Z"/><path d="M210 272 V250" ${T}/>
      ${bubble(40, 62, 12)}${bubble(70, 96, 8)}${bubble(96, 46, 9)}
      <path ${R} d="M220 54 L200 40 L202 68 z"/><ellipse ${R} cx="238" cy="54" rx="21" ry="14"/>
      ${eye(246, 50, 4)}<path d="M250 60 q4 3 8 0" ${T}/>
      <path ${R} d="M66 150 L22 104 Q38 140 32 150 Q38 160 22 198 z"/>
      <path ${R} d="M140 108 Q152 62 184 54 Q174 84 182 112 z"/>
      <path ${R} d="M86 132 Q92 112 108 106 Q102 120 106 130 z"/>
      <path ${R} d="M48 150 Q92 98 178 102 Q240 108 266 150 Q150 190 48 150 z"/>
      <path ${R} d="M48 150 Q150 190 266 150 Q240 194 178 198 Q92 202 48 150 z"/>
      <path ${R} d="M170 180 Q180 214 150 228 Q152 204 140 186 z"/>
      <path d="M204 124 q-5 12 0 24 M194 124 q-5 12 0 24" ${T}/>
      ${eye(228, 128, 7)}<path d="M222 158 q18 10 34 -6" ${D}/>${blush(240, 146)}` },

    // 26 Clownfish in a sea anemone
    { id: 'a5-clownfish-anemone', cat: 'ocean', name: N('Clownfish', 'Poisson-clown', 'Pez payaso', 'Clownfisch', '小丑鱼'), svg: `
      <path ${R} d="M-10 290 q60 -30 130 -20 q90 -16 190 14 V310 H-10 z"/>
      ${bubble(238, 46, 11)}${bubble(262, 80, 8)}${spark(48, 48)}
      ${tube(104, 244, 60, 214, 58, 168, 18)}${tube(196, 244, 240, 214, 242, 168, 18)}
      <path ${R} d="M80 118 Q50 84 34 90 Q46 118 34 146 Q50 152 80 118 z"/>
      <path ${R} d="M108 86 Q114 58 140 62 Q160 48 182 62 Q196 70 198 86 z"/>
      ${ellBands(150, 118, 80, 44, [100, 115, 140, 157, 186, 200], 16)}
      <path ${R} d="M156 128 Q180 126 184 150 Q162 152 152 138 z"/>
      ${eye(212, 108, 6)}<path d="M214 128 q5 4 9 -1" ${D}/>
      ${tube(118, 246, 80, 222, 90, 176, 18)}${tube(138, 244, 112, 206, 128, 170, 18)}${tube(162, 244, 188, 206, 172, 170, 18)}${tube(182, 246, 220, 222, 210, 176, 18)}${tube(150, 246, 164, 220, 150, 184, 18)}
      <path ${R} d="M96 300 Q98 256 112 238 H188 Q202 256 204 300 z"/>
      <path d="M118 262 q32 10 64 0" ${T}/>` },

    // 27 Pufferfish
    { id: 'a5-pufferfish', cat: 'ocean', name: N('Pufferfish', 'Poisson-globe', 'Pez globo', 'Kugelfisch', '河豚'), svg: `
      <path ${R} d="M-10 268 q160 -18 320 0 V310 H-10 z"/>
      ${limb(30, 270, 30, 206, 22)}${limb(54, 270, 54, 230, 20)}
      <path ${R} d="M262 274 q-12 -30 2 -54 q10 -18 2 -38 q22 12 14 38 q-8 28 4 54 z"/>
      ${star(150, 276, 15, 7)}
      ${bubble(56, 60, 11)}${bubble(244, 52, 13)}${bubble(268, 96, 8)}
      <path ${R} d="M74 140 q-26 -16 -32 4 q8 18 32 8 z"/><path ${R} d="M226 140 q26 -16 32 4 q-8 18 -32 8 z"/>
      <path ${R} d="M132 72 Q146 44 168 56 Q160 64 162 74 z"/>
      <polygon ${R} points="${starP(150, 148, 80, 72, 20)}"/>
      <ellipse ${R} cx="150" cy="182" rx="54" ry="32"/>
      <circle ${R} cx="118" cy="110" r="11"/><circle ${R} cx="152" cy="98" r="10"/><circle ${R} cx="186" cy="112" r="10"/>
      ${eye(126, 142, 8)}${eye(174, 142, 8)}${blush(108, 160)}${blush(192, 160)}
      <ellipse ${R} cx="150" cy="166" rx="11" ry="9"/>` },

    // 28 Manta ray
    { id: 'a5-manta-ray', cat: 'ocean', name: N('Manta ray', 'Raie manta', 'Mantarraya', 'Mantarochen', '蝠鲼'), svg: `
      <path ${R} d="M14 300 q-12 -40 6 -70 q12 -20 0 -44 q26 14 18 46 q-10 34 6 68 z"/>
      ${bubble(240, 48, 11)}${bubble(264, 78, 8)}
      <polygon ${R} points="40,70 24,58 24,82"/><ellipse ${R} cx="58" cy="70" rx="19" ry="12"/>${eye(66, 67, 3.5)}
      <polygon ${R} points="226,256 210,244 210,268"/><ellipse ${R} cx="244" cy="256" rx="19" ry="12"/>${eye(252, 253, 3.5)}
      <path d="M150 206 Q144 240 156 272" ${D}/>
      ${leaf(128, 102, 116, 64, 9, false)}${leaf(172, 102, 184, 64, 9, false)}
      ${leaf(138, 200, 126, 230, 9, false)}${leaf(162, 200, 174, 230, 9, false)}
      <path ${R} d="M150 96 C190 96 220 108 244 124 C262 136 276 150 290 168 C260 164 230 168 204 182 C182 194 166 202 150 208 C134 202 118 194 96 182 C70 168 40 164 10 168 C24 150 38 136 56 124 C80 108 110 96 150 96 z"/>
      <path ${R} d="M150 116 Q184 116 200 136 Q178 158 150 176 Q122 158 100 136 Q116 116 150 116 z"/>
      <circle ${R} cx="66" cy="152" r="10"/><circle ${R} cx="234" cy="152" r="10"/><circle ${R} cx="96" cy="164" r="9"/><circle ${R} cx="204" cy="164" r="9"/>
      ${eye(126, 128, 6)}${eye(174, 128, 6)}<path d="M142 144 q8 7 16 0" ${D}/>` },

    // 29 Monster truck with big wheels
    { id: 'a5-monster-truck', cat: 'vehicles', name: N('Monster truck', 'Monster truck', 'Camión monstruo', 'Monstertruck', '大脚怪兽卡车'), svg: `
      <path ${R} d="M-10 262 q80 -10 160 0 t160 0 V310 H-10 z"/>
      <rect ${R} x="102" y="84" width="14" height="48" rx="5"/><path d="M108 74 q-8 -8 0 -16 q8 -8 0 -16" ${T}/>
      <path ${R} d="M118 132 V96 q0 -18 18 -18 H186 q12 0 18 10 L226 132 z"/>
      <circle ${R} cx="144" cy="70" r="8"/><circle ${R} cx="168" cy="70" r="8"/>
      <path ${R} d="M130 126 V102 q0 -10 10 -10 H168 V126 z"/>
      <path ${R} d="M176 92 H186 q8 0 12 6 L214 126 H176 z"/>
      <circle ${R} cx="150" cy="114" r="13"/>
      ${eye(146, 116, 3)}${eye(156, 116, 3)}<path d="M147 121 q3 3 6 0" ${T}/>
      <path ${R} d="M136 110 q0 -16 14 -16 q14 0 14 16 z"/>
      <path ${R} d="M30 174 V142 q0 -12 12 -12 H262 q14 0 14 14 V174 q0 8 -8 8 H38 q-8 0 -8 -8 z"/>
      <circle ${R} cx="262" cy="148" r="8"/><rect ${R} x="22" y="140" width="16" height="20" rx="4"/>
      <rect ${R} x="268" y="154" width="18" height="26" rx="6"/>
      ${star(176, 156, 15, 7)}
      <polygon ${R} points="64,142 92,142 80,154 96,154 66,172 74,158 58,158"/>
      <polygon ${R} points="${starP(84, 214, 46, 40, 14)}"/><circle ${R} cx="84" cy="214" r="22"/><circle cx="84" cy="214" r="6" ${D}/>
      <polygon ${R} points="${starP(220, 214, 46, 40, 14)}"/><circle ${R} cx="220" cy="214" r="22"/><circle cx="220" cy="214" r="6" ${D}/>` },

    // 30 Police car
    { id: 'a5-police-car', cat: 'vehicles', name: N('Police car', 'Voiture de police', 'Coche de policía', 'Polizeiauto', '警车'), svg: `
      <path ${R} d="M-10 228 H310 V310 H-10 z"/>
      <path d="M20 268 h40 M110 268 h40 M200 268 h40" ${D}/>
      <path d="M118 56 l-8 -10 M148 50 v-12 M178 56 l8 -10" ${D}/>
      <rect ${R} x="124" y="90" width="52" height="16" rx="5"/>
      <path ${R} d="M128 90 q0 -24 22 -24 V90 z"/><path ${R} d="M150 66 q22 0 22 24 H150 z"/>
      <path ${R} d="M20 198 V172 q0 -14 14 -16 L62 152 L92 114 q6 -8 16 -8 H188 q10 0 16 8 L232 150 L266 154 q14 2 14 16 V198 q0 8 -8 8 H28 q-8 0 -8 -8 z"/>
      <path ${R} d="M74 150 L98 120 H144 V150 z"/>
      <path ${R} d="M154 150 V120 H192 q4 0 7 4 L220 150 z"/>
      <circle ${R} cx="124" cy="138" r="13"/>
      ${eye(119, 138, 3)}${eye(129, 138, 3)}<path d="M121 144 q3 3 6 0" ${T}/>
      <path ${R} d="M138 134 q0 -20 -14 -20 q-16 0 -16 18 h-8 v4 h38 z"/>
      <rect ${R} x="20" y="170" width="260" height="18"/>
      ${star(150, 180, 15, 7)}
      <circle ${R} cx="34" cy="164" r="8"/><rect ${R} x="264" y="154" width="14" height="16" rx="4"/>
      <rect ${R} x="12" y="186" width="28" height="18" rx="6"/>
      ${wheel(74, 206, 24, 10)}${wheel(226, 206, 24, 10)}
      ${cloud(56, 60, 30)}${cloud(250, 84, 26)}` },

    // 31 Tractor
    { id: 'a5-tractor', cat: 'vehicles', name: N('Tractor', 'Tracteur', 'Tractor', 'Traktor', '拖拉机'), svg: `
      <circle ${R} cx="262" cy="36" r="18"/>${rays(262, 36, 25, 33, 8, 22)}
      <path ${R} d="M-10 252 q160 -14 320 0 V310 H-10 z"/>
      <path d="M20 280 q40 -6 80 0 M140 282 q50 -6 100 0 M60 298 q60 -6 120 0" ${T}/>
      <rect ${R} x="222" y="98" width="14" height="50" rx="4"/>${cloud(230, 92, 22)}
      <path ${R} d="M70 78 H170 V200 H70 z"/>
      <path ${R} d="M64 56 H172 q8 0 8 8 v14 H56 v-14 q0 -8 8 -8 z"/>
      <rect ${R} x="84" y="92" width="72" height="54" rx="6"/>
      <circle ${R} cx="116" cy="128" r="15"/>
      ${eye(110, 129, 3.5)}${eye(122, 129, 3.5)}<path d="M112 136 q4 4 8 0" ${T}/>
      <path ${R} d="M100 124 q0 -20 16 -20 q16 0 16 20 h12 v5 h-44 z"/>
      <path ${R} d="M168 144 H246 q14 0 16 14 L264 206 H168 z"/>
      <path d="M228 160 v38 M238 160 v38 M248 162 v36" ${T}/>
      <circle ${R} cx="262" cy="154" r="9"/>
      <path ${R} d="M26 206 A66 66 0 0 1 158 206 H142 A50 50 0 0 0 42 206 z"/>
      <polygon ${R} points="${starP(92, 206, 50, 45, 16)}"/><circle ${R} cx="92" cy="206" r="26"/><circle cx="92" cy="206" r="8" ${D}/>
      <polygon ${R} points="${starP(222, 226, 30, 26, 12)}"/><circle ${R} cx="222" cy="226" r="14"/>` },

    // 32 Submarine
    { id: 'a5-submarine', cat: 'vehicles', name: N('Submarine', 'Sous-marin', 'Submarino', 'U-Boot', '潜水艇'), svg: `
      <path ${R} d="M-10 268 q160 -16 320 0 V310 H-10 z"/>
      <path ${R} d="M272 274 q-12 -34 4 -60 q10 -20 0 -44 q24 14 16 44 q-8 32 4 60 z"/>
      ${bubble(250, 56, 11)}${bubble(270, 100, 8)}
      <polygon ${R} points="226,236 208,224 208,248"/><ellipse ${R} cx="244" cy="236" rx="19" ry="13"/>${eye(252, 233, 3.5)}
      <path d="M44 165 H30" ${D}/>
      <ellipse ${R} cx="24" cy="146" rx="9" ry="16"/><ellipse ${R} cx="24" cy="184" rx="9" ry="16"/><circle ${R} cx="30" cy="165" r="9"/>
      <path ${R} d="M60 132 L48 100 H72 L90 128 z"/><path ${R} d="M60 200 L48 232 H72 L90 204 z"/>
      ${tube(164, 82, 164, 40, 196, 42, 12)}
      <path ${R} d="M112 124 V90 q0 -12 12 -12 H170 q12 0 12 12 V124 z"/>
      ${ellBands(140, 166, 104, 48, [74, 92], 10)}
      <circle ${R} cx="128" cy="162" r="15"/><circle ${R} cx="172" cy="162" r="15"/><circle ${R} cx="212" cy="162" r="13"/>
      ${eye(167, 160, 3)}${eye(177, 160, 3)}<path d="M168 168 q4 4 8 0" ${T}/>
      <path d="M120 156 q4 -6 10 -6 M206 156 q3 -5 8 -5" ${T}/>` },

    // 33 Cement mixer truck
    { id: 'a5-cement-mixer', cat: 'vehicles', name: N('Cement mixer', 'Bétonnière', 'Hormigonera', 'Betonmischer', '水泥搅拌车'), svg: `
      <path ${R} d="M-10 236 H310 V310 H-10 z"/>
      <path d="M20 272 h40 M110 272 h40 M200 272 h40" ${D}/>
      ${cloud(250, 60, 26)}
      <rect ${R} x="24" y="190" width="250" height="20" rx="6"/>
      <path ${R} d="M40 150 L12 178 L24 190 L52 162 z"/>
      <g transform="rotate(12 116 140)">${ellBands(116, 140, 82, 48, [70, 96, 136, 162], 12)}</g>
      <path ${R} d="M196 112 H238 q14 0 18 14 L270 160 V200 H196 z"/>
      <path ${R} d="M206 124 H236 q6 0 9 8 L258 158 H206 z"/>
      <circle ${R} cx="224" cy="146" r="12"/>
      ${eye(219, 147, 3)}${eye(229, 147, 3)}<path d="M221 153 q3 3 6 0" ${T}/>
      <path ${R} d="M208 142 q0 -18 16 -18 q16 0 16 18 h4 v5 h-40 z"/>
      <circle ${R} cx="264" cy="176" r="8"/>
      ${wheel(64, 214, 22, 9)}${wheel(116, 214, 22, 9)}${wheel(232, 214, 22, 9)}` },

    // 34 Robot dog
    { id: 'a5-robot-dog', cat: 'space', name: N('Robot dog', 'Chien robot', 'Perro robot', 'Roboterhund', '机器狗'), svg: `
      <path ${R} d="M-10 254 q160 -14 320 0 V310 H-10 z"/>
      <ellipse ${R} cx="60" cy="278" rx="24" ry="8"/>
      ${star(40, 50, 14, 6.5)}${star(130, 34, 11, 5)}${spark(86, 80)}${spark(280, 30, 6)}
      <path d="M72 156 l-12 -4 l8 -8 l-12 -4 l8 -8 l-12 -4 l6 -10" ${D}/>
      <circle ${R} cx="54" cy="110" r="9"/>
      <rect ${R} x="84" y="194" width="18" height="40" rx="6"/><rect ${R} x="112" y="194" width="18" height="40" rx="6"/>
      <rect ${R} x="150" y="194" width="18" height="40" rx="6"/><rect ${R} x="178" y="194" width="18" height="40" rx="6"/>
      <ellipse ${R} cx="93" cy="236" rx="14" ry="8"/><ellipse ${R} cx="121" cy="236" rx="14" ry="8"/><ellipse ${R} cx="159" cy="236" rx="14" ry="8"/><ellipse ${R} cx="187" cy="236" rx="14" ry="8"/>
      <rect ${R} x="70" y="138" width="136" height="64" rx="18"/>
      <rect ${R} x="98" y="152" width="64" height="34" rx="8"/>
      <circle cx="112" cy="169" r="4" fill="${INK}"/><circle cx="126" cy="169" r="4" fill="${INK}"/><path d="M138 162 h14 M138 176 h14" ${T}/>
      <path d="M214 72 V52" ${D}/><circle ${R} cx="214" cy="44" r="9"/>
      <rect ${R} x="174" y="72" width="84" height="72" rx="18"/>
      <rect ${R} x="194" y="88" width="48" height="30" rx="8"/>
      ${eye(208, 103, 5)}${eye(228, 103, 5)}<path d="M200 132 q8 6 16 0" ${D}/>
      <rect ${R} x="236" y="112" width="38" height="28" rx="12"/><circle cx="266" cy="120" r="4" fill="${INK}"/>
      <path ${R} d="M178 80 q-14 2 -14 18 v28 q0 10 10 10 q10 0 12 -10 z"/>
      <path ${R} d="M222 248 q-10 -8 0 -14 q8 -4 12 4 h28 q4 -8 12 -4 q10 6 0 14 q10 8 0 14 q-8 4 -12 -4 h-28 q-4 8 -12 4 q-10 -6 0 -14 z"/>` },

    // 35 Alien holding a balloon
    { id: 'a5-alien-balloon', cat: 'space', name: N('Alien with a balloon', 'Extraterrestre et ballon', 'Extraterrestre con globo', 'Außerirdischer mit Ballon', '拿气球的外星人'), svg: `
      <path ${R} d="M-10 260 q80 -16 160 -8 t160 -4 V310 H-10 z"/>
      <ellipse ${R} cx="56" cy="282" rx="22" ry="8"/><ellipse ${R} cx="246" cy="284" rx="24" ry="8"/>
      <path ${R} d="M32 44 q0 -22 22 -22 q22 0 22 22 z"/><ellipse ${R} cx="54" cy="48" rx="42" ry="13"/>
      <circle cx="30" cy="50" r="3" fill="${INK}"/><circle cx="54" cy="53" r="3" fill="${INK}"/><circle cx="78" cy="50" r="3" fill="${INK}"/>
      ${star(262, 160, 12, 5.5)}${star(32, 150, 12, 5.5)}${spark(256, 222)}${spark(40, 100, 6)}
      <path d="M126 88 L108 58 M154 88 L172 58" ${D}/><circle ${R} cx="106" cy="52" r="9"/><circle ${R} cx="174" cy="52" r="9"/>
      ${limb(126, 226, 122, 250, 18)}${limb(154, 226, 158, 250, 18)}
      <ellipse ${R} cx="118" cy="256" rx="16" ry="9"/><ellipse ${R} cx="162" cy="256" rx="16" ry="9"/>
      <ellipse ${R} cx="140" cy="196" rx="34" ry="38"/>
      <ellipse ${R} cx="140" cy="206" rx="18" ry="22"/>
      ${tube(110, 182, 92, 202, 96, 222, 14)}${tube(170, 180, 196, 172, 204, 144, 14)}
      <ellipse ${R} cx="140" cy="122" rx="48" ry="40"/>
      ${eye(122, 120, 9)}${eye(158, 120, 9)}${smile(140, 140, 7)}${blush(110, 140)}${blush(170, 140)}
      <ellipse ${R} cx="222" cy="72" rx="30" ry="36"/>
      <path d="M206 58 q2 -12 12 -16" ${T}/><path d="M216 108 h12 l-6 8 z" fill="${INK}" ${L}/>
      <path d="M222 116 q-16 12 -16 28" ${T}/>` },

    // 36 Moon rover
    { id: 'a5-moon-rover', cat: 'space', name: N('Moon rover', 'Rover lunaire', 'Vehículo lunar', 'Mondauto', '月球车'), svg: `
      <circle ${R} cx="54" cy="52" r="26"/><path ${R} d="M38 44 q4 -16 20 -14 q10 6 2 16 q-4 12 -14 14 q-12 -4 -8 -16 z"/>
      ${star(150, 34, 12, 5.5)}${star(272, 112, 11, 5)}${spark(240, 30)}${spark(100, 76, 6)}
      <path ${R} d="M-10 236 Q80 220 150 230 T310 226 V310 H-10 z"/>
      <ellipse ${R} cx="44" cy="274" rx="24" ry="9"/>
      <path d="M100 138 V120 M146 138 V122" ${D}/>
      <path ${R} d="M78 96 Q84 132 122 124 Q100 116 78 96 z"/>
      <polygon ${R} points="116,104 196,104 182,124 102,124"/>
      <path d="M136 104 L122 124 M156 104 L142 124 M176 104 L162 124" ${T}/>
      <rect ${R} x="204" y="102" width="14" height="40" rx="4"/>
      <rect ${R} x="64" y="138" width="160" height="52" rx="10"/>
      <rect ${R} x="64" y="156" width="160" height="16"/>
      <rect ${R} x="182" y="62" width="58" height="42" rx="12"/>
      <circle ${R} cx="200" cy="82" r="10"/><circle ${R} cx="222" cy="82" r="10"/>
      ${eye(200, 82, 4.5)}${eye(222, 82, 4.5)}<path d="M206 96 q5 4 10 0" ${T}/>
      <path d="M90 214 L120 188 L150 214 L180 188 L210 214" ${D}/>
      ${wheel(90, 214, 22, 9)}${wheel(150, 214, 22, 9)}${wheel(210, 214, 22, 9)}` },

    // 37 Superhero kid with a cape
    { id: 'a5-superhero-kid', cat: 'fantasy', name: N('Superhero', 'Super-héros', 'Superhéroe', 'Superheld', '超级英雄'), svg: `
      <rect ${R} x="14" y="150" width="44" height="112" rx="3"/><rect ${R} x="62" y="196" width="34" height="66" rx="3"/><rect ${R} x="234" y="168" width="52" height="94" rx="3"/>
      <path d="M24 166 h8 M42 166 h8 M24 186 h8 M42 186 h8 M24 206 h8 M42 206 h8 M24 226 h8 M42 226 h8 M72 212 h14 M72 232 h14 M244 184 h10 M266 184 h10 M244 206 h10 M266 206 h10 M244 228 h10 M266 228 h10 M6 262 H294" ${T}/>
      <path ${R} d="M124 118 Q96 170 70 250 Q130 236 170 252 Q220 230 270 236 Q230 190 240 140 Q200 150 176 118 z"/>
      <rect ${R} x="126" y="182" width="22" height="50" rx="4"/><rect ${R} x="152" y="182" width="22" height="50" rx="4"/>
      <rect ${R} x="120" y="226" width="32" height="24" rx="8"/><rect ${R} x="150" y="226" width="32" height="24" rx="8"/>
      <path ${R} d="M126 116 h48 q8 0 10 8 l4 54 h-76 l4 -54 q2 -8 10 -8 z"/>
      <rect ${R} x="112" y="168" width="76" height="16" rx="4"/>
      <circle ${R} cx="150" cy="142" r="17"/>${star(150, 142, 12, 5.5)}
      ${tube(122, 124, 90, 148, 112, 168, 16)}${tube(178, 124, 210, 148, 188, 168, 16)}
      <circle ${R} cx="112" cy="170" r="11"/><circle ${R} cx="188" cy="170" r="11"/>
      <circle ${R} cx="150" cy="80" r="30"/>
      <path ${R} d="M120 82 Q114 52 140 46 Q132 36 148 28 Q154 38 162 42 Q178 34 190 44 Q180 48 182 58 Q186 70 180 82 Q172 62 150 62 Q130 62 120 82 z"/>
      <path ${R} d="M118 80 Q150 66 182 80 L180 98 Q166 92 150 98 Q134 92 120 98 z"/>
      ${eye(137, 86, 5)}${eye(163, 86, 5)}${smile(150, 102, 5)}` },

    // 38 Pirate with a treasure map
    { id: 'a5-pirate-map', cat: 'fantasy', name: N('Pirate with a map', 'Pirate et sa carte', 'Pirata con mapa', 'Pirat mit Schatzkarte', '拿藏宝图的小海盗'), svg: `
      <path d="M10 236 q12 -8 24 0 t24 0 M246 236 q12 -8 24 0 t24 0" ${T}/>
      <ellipse ${R} cx="150" cy="262" rx="126" ry="20"/>
      <path ${R} d="M114 74 Q104 100 114 118 Q124 112 126 100 L174 100 Q176 112 186 118 Q196 100 186 74 z"/>
      <path ${R} d="M118 188 h64 l2 46 h-28 l-6 -24 l-6 24 h-28 z"/>
      <rect ${R} x="112" y="228" width="36" height="20" rx="8"/><rect ${R} x="152" y="228" width="36" height="20" rx="8"/>
      <path ${R} d="M126 114 h48 l8 76 h-64 z"/>
      <path d="M128 126 h44 M127 138 h46" ${T}/>
      <path ${R} d="M124 114 h16 l-2 42 h-18 z"/><path ${R} d="M176 114 h-16 l2 42 h18 z"/>
      ${tube(124, 122, 102, 134, 100, 162, 15)}${tube(176, 122, 198, 134, 200, 162, 15)}
      <circle ${R} cx="150" cy="84" r="29"/>
      ${face(150, 90)}
      <path ${R} d="M92 68 Q98 50 114 60 Q118 30 150 28 Q182 30 186 60 Q202 50 208 68 Q182 82 150 80 Q118 82 92 68 z"/>
      ${star(150, 50, 11, 5)}
      <rect ${R} x="96" y="150" width="108" height="56" rx="2"/>
      <path ${R} d="M114 192 q-4 -16 12 -18 q14 -8 22 4 q14 2 8 14 q-12 8 -26 6 q-14 4 -16 -6 z"/>
      <path d="M152 180 q14 -14 24 -10" stroke="${INK}" stroke-width="3" stroke-dasharray="4 5" fill="none" stroke-linecap="round"/>
      <path d="M176 160 l12 12 M188 160 l-12 12" ${D}/>
      <rect ${R} x="86" y="144" width="18" height="68" rx="8"/><rect ${R} x="196" y="144" width="18" height="68" rx="8"/>
      <circle ${R} cx="100" cy="170" r="10"/><circle ${R} cx="200" cy="170" r="10"/>` },

    // 39 Knight with a shield
    { id: 'a5-knight-shield', cat: 'fantasy', name: N('Knight', 'Chevalier', 'Caballero', 'Ritter', '小骑士'), svg: `
      <path ${R} d="M-10 256 q160 -12 320 0 V310 H-10 z"/>
      ${leaf(150, 42, 178, 8, 12, false)}
      <path ${R} d="M106 104 Q106 40 150 38 Q194 40 194 104 Q194 124 176 126 H124 Q106 124 106 104 z"/>
      <path d="M150 40 V58" ${D}/><circle cx="114" cy="112" r="3" fill="${INK}"/><circle cx="186" cy="112" r="3" fill="${INK}"/><circle cx="114" cy="96" r="3" fill="${INK}"/><circle cx="186" cy="96" r="3" fill="${INK}"/>
      <path ${R} d="M124 102 Q124 86 150 86 Q176 86 176 102 V110 Q176 128 150 128 Q124 128 124 110 z"/>
      ${face(150, 106, 0.85)}
      <path ${R} d="M118 70 Q150 56 182 70 L180 88 Q150 76 120 88 z"/>
      <rect ${R} x="128" y="212" width="18" height="28" rx="4"/><rect ${R} x="154" y="212" width="18" height="28" rx="4"/>
      <rect ${R} x="122" y="234" width="28" height="20" rx="8"/><rect ${R} x="150" y="234" width="28" height="20" rx="8"/>
      <path ${R} d="M114 184 h72 l8 32 h-88 z"/>
      <path ${R} d="M120 128 h60 l6 50 h-72 z"/>
      <rect ${R} x="110" y="170" width="80" height="16" rx="4"/>
      <path ${R} d="M206 52 q7 -12 14 0 V136 H206 z"/>
      <rect ${R} x="194" y="134" width="38" height="16" rx="6"/>
      <rect ${R} x="206" y="150" width="14" height="30" rx="4"/>
      ${tube(180, 136, 204, 142, 213, 160, 16)}
      <circle ${R} cx="213" cy="162" r="10"/>
      <path ${R} d="M54 124 H128 V172 Q128 216 91 234 Q54 216 54 172 z"/>
      <path ${R} d="M66 136 H116 V172 Q116 204 91 220 Q66 204 66 172 z"/>
      ${heart(91, 174, 15)}` },

    // 40 Wizard kid with a spellbook
    { id: 'a5-wizard-spellbook', cat: 'fantasy', name: N('Little wizard', 'Petit magicien', 'Pequeño mago', 'Kleiner Zauberer', '小巫师'), svg: `
      <path ${R} d="M250 26 a28 28 0 1 0 22 46 a22 22 0 1 1 -22 -46 z"/>
      ${star(38, 60, 13, 6)}${star(268, 160, 11, 5)}${spark(36, 140)}${spark(214, 22, 6)}
      <path ${R} d="M116 94 q-4 -36 34 -38 q38 2 34 38 q2 24 -6 36 h-56 q-8 -12 -6 -36 z"/>
      <path ${R} d="M128 118 h44 l42 134 q-64 16 -128 0 z"/>
      <path ${R} d="M110 268 Q114 254 132 256 Q142 258 140 268 Q126 274 110 268 z"/><path ${R} d="M190 268 Q186 254 168 256 Q158 258 160 268 Q174 274 190 268 z"/>
      <path ${R} d="M130 122 Q100 138 92 182 Q110 190 126 178 z"/><path ${R} d="M170 122 Q200 138 208 182 Q190 190 174 178 z"/>
      <path ${R} d="M96 168 H204 V214 Q176 208 150 218 Q124 208 96 214 z"/>
      <path ${R} d="M150 172 Q126 160 102 166 V206 Q126 200 150 212 z"/><path ${R} d="M150 172 Q174 160 198 166 V206 Q174 200 150 212 z"/>
      <path d="M110 178 q16 -4 32 2 M110 190 q16 -4 32 2 M158 180 q16 -6 32 -2 M158 192 q16 -6 32 -2" ${T}/>
      <circle ${R} cx="104" cy="192" r="10"/><circle ${R} cx="196" cy="192" r="10"/>
      ${star(122, 142, 12, 5.5)}${star(180, 134, 13, 6)}${spark(150, 150, 6)}
      <circle ${R} cx="150" cy="92" r="28"/>
      ${face(150, 98)}
      <path ${R} d="M122 92 C120 66 134 58 150 58 C166 58 180 66 178 92 C170 78 160 74 150 76 C140 74 130 78 122 92 z"/>
      <path ${R} d="M110 66 Q132 26 150 14 Q176 0 206 16 Q182 22 182 62 z"/>
      <ellipse ${R} cx="146" cy="66" rx="52" ry="12"/>
      ${star(150, 42, 10, 4.5)}` },

    // 41 Ice cream sundae
    { id: 'a5-ice-cream-sundae', cat: 'food', name: N('Ice cream sundae', 'Coupe glacée', 'Copa de helado', 'Eisbecher', '冰淇淋圣代'), svg: `
      ${heart(46, 96, 13)}${heart(256, 176, 12)}${spark(250, 60)}${spark(50, 190)}
      <ellipse ${R} cx="150" cy="274" rx="74" ry="12"/>
      <ellipse ${R} cx="150" cy="262" rx="40" ry="10"/>
      <rect ${R} x="142" y="212" width="16" height="50" rx="4"/>
      ${rot(20, 214, 70, `<rect ${R} x="205" y="34" width="18" height="72" rx="3"/><path d="M205 52 h18 M205 70 h18 M205 88 h18" ${T}/>`)}
      <path ${R} d="${scoopD(116, 130, 34)}"/><path ${R} d="${scoopD(184, 130, 34)}"/>
      <path d="M96 110 l4 6 M114 104 l-2 7 M128 116 l5 4 M172 108 l4 6 M190 102 l-3 7 M204 116 l5 3" ${T}/>
      <path ${R} d="M78 152 H222 Q218 208 150 220 Q82 208 78 152 z"/>
      <rect ${R} x="70" y="142" width="160" height="18" rx="9"/>
      <path ${R} d="${scoopD(150, 88, 38)}"/>
      <path d="M124 68 l5 -3 M172 66 l5 4 M118 84 l3 5 M182 84 l-3 5" ${T}/>
      ${eye(137, 82, 5.5)}${eye(163, 82, 5.5)}${smile(150, 91, 5)}${blush(124, 92)}${blush(176, 92)}
      ${cloud(150, 54, 24)}
      <path d="M150 12 q2 -8 12 -10" ${D}/><circle ${R} cx="150" cy="24" r="11"/>` },

    // 42 Bento box
    { id: 'a5-bento-box', cat: 'food', name: N('Bento box', 'Boîte bento', 'Caja bento', 'Bentobox', '便当盒'), svg: `
      <rect ${R} x="24" y="40" width="252" height="196" rx="24"/>
      <rect ${R} x="38" y="54" width="126" height="168" rx="14"/>
      <rect ${R} x="176" y="54" width="86" height="80" rx="14"/>
      <rect ${R} x="176" y="142" width="86" height="80" rx="14"/>
      <path ${R} d="M80 64 Q90 64 110 98 Q120 122 102 124 H58 Q40 122 50 98 Q70 64 80 64 z"/>
      <rect ${R} x="64" y="102" width="32" height="22" rx="3"/>
      ${eye(72, 88, 3.5)}${eye(88, 88, 3.5)}<path d="M77 94 q3 3 6 0" ${T}/>
      <path ${R} d="M120 144 Q130 144 150 178 Q160 202 142 204 H98 Q80 202 90 178 Q110 144 120 144 z"/>
      <rect ${R} x="104" y="182" width="32" height="22" rx="3"/>
      ${eye(112, 168, 3.5)}${eye(128, 168, 3.5)}<path d="M117 174 q3 3 6 0" ${T}/>
      ${heart(144, 80, 12)}
      <rect ${R} x="184" y="64" width="34" height="60" rx="8"/><rect ${R} x="222" y="64" width="32" height="60" rx="8"/>
      <path d="M201 86 q-8 0 -8 8 q0 10 10 10 q10 0 10 -12 M238 86 q-8 0 -8 8 q0 10 10 10 q10 0 10 -12" ${T}/>
      <path ${R} d="M184 202 Q184 158 206 158 Q228 158 228 202 q-4.4 10 -8.8 0 q-4.4 10 -8.8 0 q-4.4 10 -8.8 0 q-4.4 10 -8.8 0 q-4.4 10 -8.8 0 z"/>
      ${eye(198, 180, 3.5)}${eye(214, 180, 3.5)}<path d="M203 187 q3 3 6 0" ${T}/>
      ${scallop(246, 166, 13, 6, 1.2)}<path d="M246 180 v14 M240 186 l6 6 l6 -6" ${T}/>
      <circle ${R} cx="246" cy="208" r="12"/><path d="M240 197 l6 4 l6 -4" ${T}/>
      <polygon ${R} points="30,248 270,242 270,254 30,260"/><polygon ${R} points="40,266 276,260 276,272 40,278"/>` },

    // 43 Hot cocoa mug with marshmallows
    { id: 'a5-hot-cocoa', cat: 'food', name: N('Hot cocoa', 'Chocolat chaud', 'Chocolate caliente', 'Heiße Schokolade', '热可可'), svg: `
      <ellipse ${R} cx="150" cy="262" rx="104" ry="18"/>
      <circle ${R} cx="52" cy="248" r="20"/><circle cx="46" cy="242" r="3" fill="${INK}"/><circle cx="58" cy="246" r="3" fill="${INK}"/><circle cx="50" cy="256" r="3" fill="${INK}"/>
      <path d="M124 76 q-8 -10 0 -20 q8 -10 0 -20 M176 76 q-8 -10 0 -20 q8 -10 0 -20" ${D}/>
      ${heart(150, 50, 14)}${heart(104, 36, 9)}${heart(198, 32, 9)}
      ${limb(212, 40, 188, 118, 14)}<path d="M206 52 l10 6 M202 66 l10 6 M197 80 l10 6 M193 94 l10 6" ${T}/>
      <path ${R} d="M226 140 Q276 140 276 182 Q276 224 226 222 V204 Q256 204 256 182 Q256 160 226 160 z"/>
      <path ${R} d="M70 116 H230 V224 Q230 254 200 254 H100 Q70 254 70 224 z"/>
      <rect ${R} x="70" y="198" width="160" height="20"/>
      ${eye(126, 160, 7)}${eye(174, 160, 7)}${smile(150, 174, 8)}${blush(108, 176)}${blush(192, 176)}
      <ellipse ${R} cx="150" cy="116" rx="80" ry="16"/>
      ${rot(-15, 118, 110, `<rect ${R} x="104" y="99" width="28" height="22" rx="5"/>`)}${rot(10, 152, 104, `<rect ${R} x="138" y="93" width="28" height="22" rx="5"/>`)}${rot(20, 184, 112, `<rect ${R} x="170" y="101" width="28" height="22" rx="5"/>`)}` },

    // 44 Fruit basket
    { id: 'a5-fruit-basket', cat: 'food', name: N('Fruit basket', 'Panier de fruits', 'Cesta de frutas', 'Obstkorb', '水果篮'), svg: `
      <path ${R} d="M70 168 Q70 40 150 40 Q230 40 230 168 H214 Q214 58 150 58 Q86 58 86 168 z"/>
      <path ${R} d="M150 46 L128 34 L128 58 Z M150 46 L172 34 L172 58 Z"/><circle cx="150" cy="46" r="5" fill="${INK}"/>
      <path ${R} d="M58 172 H242 L222 262 Q150 274 78 262 z"/>
      <path d="M80 196 H220 M86 222 H214 M110 178 L104 262 M150 178 V268 M190 178 L196 262" ${T}/>
      <path ${R} d="M46 146 Q50 90 110 84 Q98 96 94 110 Q64 114 60 154 z"/>
      <path ${R} d="M58 160 Q72 110 124 108 Q112 118 108 130 Q80 134 74 164 z"/>
      <circle ${R} cx="212" cy="112" r="11"/><circle ${R} cx="234" cy="116" r="11"/><circle ${R} cx="202" cy="132" r="11"/><circle ${R} cx="224" cy="136" r="11"/><circle ${R} cx="246" cy="138" r="11"/><circle ${R} cx="214" cy="154" r="11"/>
      <path ${R} d="M178 96 Q192 96 192 116 Q206 128 206 146 Q206 170 180 170 Q154 170 154 146 Q154 128 168 116 Q168 96 178 96 z"/>
      <path d="M180 96 q0 -8 4 -12" ${D}/>${leaf(184, 90, 202, 78, 7)}
      <path ${R} d="M128 110 C110 98 90 110 92 130 C94 152 116 160 128 152 C140 160 162 152 164 130 C166 110 146 98 128 110 z"/>
      <path d="M128 110 q-2 -10 4 -16" ${D}/>${leaf(134, 98, 154, 86, 7)}
      ${eye(118, 128, 4.5)}${eye(138, 128, 4.5)}<path d="M124 136 q4 4 8 0" ${T}/>
      <rect ${R} x="48" y="160" width="204" height="24" rx="12"/>` },

    // 45 Beehive with bees
    { id: 'a5-beehive-bees', cat: 'nature', name: N('Beehive', 'Ruche', 'Colmena', 'Bienenstock', '蜂巢'), svg: `
      <path ${R} d="M-10 30 H220 Q236 30 236 42 Q236 54 220 54 H-10 z"/>
      ${leaf(200, 32, 228, 6, 9)}${leaf(234, 44, 268, 40, 9)}
      <g transform="rotate(90 120 152)">${ellBands(120, 152, 94, 74, [64, 98, 132, 166], 10)}</g>
      <path ${R} d="M110 222 q10 6 20 0 v22 q0 10 -10 10 q-10 0 -10 -10 z"/>
      <ellipse ${R} cx="120" cy="214" rx="17" ry="12"/>
      <path d="M190 132 q20 -30 40 -10 M178 228 q24 10 34 -10" stroke="${INK}" stroke-width="3" stroke-dasharray="4 6" fill="none" stroke-linecap="round"/>
      ${[[236, 112], [234, 210]].map(([x, y]) => `${rot(-20, x - 6, y - 18, `<ellipse ${R} cx="${x - 6}" cy="${y - 18}" rx="10" ry="14"/>`)}${rot(20, x + 10, y - 18, `<ellipse ${R} cx="${x + 10}" cy="${y - 18}" rx="10" ry="14"/>`)}
        <path d="M${x - 26} ${y} l-8 0" ${D}/>${ellBands(x, y, 26, 18, [x - 8, x + 8], 6)}
        ${eye(x + 15, y - 3, 3.5)}<path d="M${x + 13} ${y + 6} q3 3 6 0 M${x + 18} ${y - 16} q2 -8 8 -10" ${T}/>`).join('')}` },

    // 46 Daisies in a flower pot
    { id: 'a5-daisy-pot', cat: 'nature', name: N('Daisies in a pot', 'Pot de marguerites', 'Maceta de margaritas', 'Gänseblümchen im Topf', '盆里的雏菊'), svg: `
      <ellipse ${R} cx="150" cy="276" rx="110" ry="12"/>
      <path d="M150 180 V96 M150 180 Q124 146 96 124 M150 180 Q180 146 206 128" ${D}/>
      ${leaf(150, 160, 116, 140, 12)}${leaf(150, 150, 186, 130, 12)}${leaf(150, 130, 124, 110, 10)}
      ${[[150, 76, 30], [94, 112, 25], [208, 116, 25]].map(([x, y, r]) => `<path ${R} d="${scallopD(x, y, r, 10, 1.1)}"/><circle ${R} cx="${x}" cy="${y}" r="${f(r * 0.42)}"/>`).join('')}
      <path ${R} d="M88 196 H212 L198 268 Q150 276 102 268 z"/>
      <rect ${R} x="80" y="176" width="140" height="26" rx="8"/>
      ${eye(130, 226, 6)}${eye(170, 226, 6)}${smile(150, 238, 7)}${blush(116, 240)}${blush(184, 240)}
      <path ${R} d="M244 52 q-28 -24 -34 2 q6 18 34 2 z"/><path ${R} d="M250 52 q28 -24 34 2 q-6 18 -34 2 z"/><path d="M247 40 v24 M245 40 l-5 -8 M249 40 l5 -8" ${D}/>
      <path ${R} d="M68 268 q0 -18 14 -16 q10 4 8 16 z"/>
      <path ${R} d="M28 268 a21 21 0 0 1 42 0 z"/>
      <path d="M49 248 v20" ${T}/><circle cx="40" cy="259" r="3.5" fill="${INK}"/><circle cx="58" cy="259" r="3.5" fill="${INK}"/>${eye(80, 260, 2.5)}` },

    // 47 Bird's nest in a tree
    { id: 'a5-bird-nest', cat: 'nature', name: N('Bird’s nest', 'Nid d’oiseau', 'Nido de pájaro', 'Vogelnest', '树上的鸟窝'), svg: `
      ${cloud(60, 60, 32)}
      <path ${R} d="M-10 216 Q80 206 160 200 Q230 194 310 170 V196 Q232 218 160 224 Q80 230 -10 240 z"/>
      ${tube(204, 204, 232, 168, 268, 144, 14)}
      ${leaf(60, 214, 34, 184, 11)}${leaf(96, 224, 78, 256, 11)}${leaf(262, 148, 290, 126, 10)}${leaf(250, 190, 284, 206, 10)}
      <ellipse ${R} cx="150" cy="170" rx="60" ry="14"/>
      <circle ${R} cx="128" cy="156" r="22"/><circle ${R} cx="174" cy="152" r="22"/>
      ${eye(122, 152, 4)}${eye(168, 148, 4)}<path d="M126 138 q2 -8 8 -10 M172 134 q2 -8 8 -10" ${T}/>
      <polygon ${R} points="130,140 142,124 150,142"/><polygon ${R} points="176,136 188,120 196,138"/>
      <path ${R} d="M88 168 Q92 222 150 224 Q208 222 212 168 Q150 188 88 168 z"/>
      <path d="M100 186 q20 8 40 4 M160 192 q22 -2 40 -8 M110 206 q24 6 46 2 M130 176 l14 8 M176 180 l-12 8" ${T}/>
      <polygon ${R} points="200,92 176,80 180,106"/>
      <ellipse ${R} cx="222" cy="94" rx="27" ry="19"/>
      <path ${R} d="M206 92 q14 -18 30 -4 q-12 16 -30 4 z"/>
      <circle ${R} cx="248" cy="78" r="15"/>
      <polygon ${R} points="260,72 278,79 260,88"/>
      ${eye(252, 74, 4)}<path d="M278 84 q4 10 -4 14 q-8 6 -2 14" ${D}/>` },

    // 48 Tennis racket and ball
    { id: 'a5-tennis', cat: 'hobbies', name: N('Tennis', 'Tennis', 'Tenis', 'Tennis', '网球'), svg: `
      ${cloud(240, 44, 30)}
      <path ${R} d="M-10 238 H310 V310 H-10 z"/><path d="M-10 262 H310 M150 238 V310" ${T}/>
      <rect ${R} x="24" y="72" width="38" height="96" rx="12"/><rect ${R} x="32" y="56" width="22" height="18" rx="4"/><rect ${R} x="24" y="104" width="38" height="28"/>
      <g transform="rotate(35 150 140)">
        <rect ${R} x="140" y="196" width="20" height="40" rx="3"/>
        <rect ${R} x="137" y="226" width="26" height="54" rx="5"/><path d="M137 240 l26 -8 M137 254 l26 -8 M137 268 l26 -8" ${T}/>
        <rect ${R} x="135" y="276" width="30" height="16" rx="6"/>
        <path ${R} d="M130 160 Q150 182 170 160 L158 202 H142 z"/>
        <ellipse ${R} cx="150" cy="96" rx="56" ry="70"/>
        <ellipse ${R} cx="150" cy="96" rx="44" ry="58"/>
        <path d="${[-36, -24, -12, 0, 12, 24, 36].map(d => { const h = ellH(150, 44, 58, 150 + d); return `M${150 + d} ${f(96 - h)} V${f(96 + h)}`; }).join(' ')} ${[-48, -36, -24, -12, 0, 12, 24, 36, 48].map(d => { const w = ellH(96, 58, 44, 96 + d); return `M${f(150 - w)} ${96 + d} H${f(150 + w)}`; }).join(' ')}" fill="none" stroke="${INK}" stroke-width="2.5"/>
      </g>
      <circle ${R} cx="226" cy="222" r="36"/>
      <path d="M196 202 q24 20 0 44 M256 202 q-24 20 0 44" ${T}/>
      ${eye(214, 218, 5)}${eye(238, 218, 5)}${smile(226, 230, 5)}
      <circle ${R} cx="272" cy="150" r="15"/><path d="M262 140 q10 10 0 20 M282 140 q-10 10 0 20" ${T}/>` },

    // 49 Piano
    { id: 'a5-piano', cat: 'hobbies', name: N('Piano', 'Piano', 'Piano', 'Klavier', '钢琴'), svg: `
      <ellipse ${R} cx="52" cy="34" rx="10" ry="8"/><path d="M61 34 V8 q8 4 12 12" ${T}/>
      <ellipse ${R} cx="88" cy="44" rx="10" ry="8"/><path d="M97 44 V18 q8 4 12 12" ${T}/>
      <path d="M224 30 V48" ${D}/>${scallop(224, 22, 12, 5, 1.15)}<circle cx="224" cy="22" r="4" fill="${INK}"/>
      <path ${R} d="M210 74 Q202 58 212 46 H236 Q246 58 238 74 z"/>
      <rect ${R} x="30" y="72" width="240" height="18" rx="6"/>
      <rect ${R} x="40" y="88" width="220" height="66" rx="4"/>
      <rect ${R} x="108" y="96" width="84" height="50" rx="4"/>
      <path d="M116 108 h68 M116 120 h68 M116 132 h68" ${T}/>${note(140, 122)}${note(166, 112)}
      <rect ${R} x="32" y="150" width="236" height="50" rx="6"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect ${R} x="${f(44 + i * 26.5)}" y="156" width="26.5" height="40"/>`).join('')}
      ${[1, 2, 4, 5, 6].map(i => `<rect x="${f(37 + i * 26.5)}" y="156" width="14" height="24" rx="2" fill="${INK}"/>`).join('')}
      <rect ${R} x="48" y="198" width="204" height="44" rx="4"/>
      ${eye(130, 214, 5)}${eye(170, 214, 5)}${smile(150, 224, 6)}
      <rect ${R} x="52" y="240" width="22" height="32" rx="4"/><rect ${R} x="226" y="240" width="22" height="32" rx="4"/>
      <path d="M136 244 v10 h-8 M164 244 v10 h8" ${D}/>` },

    // 50 Painting easel
    { id: 'a5-painting-easel', cat: 'hobbies', name: N('Painting easel', 'Chevalet de peinture', 'Caballete de pintura', 'Staffelei', '画架'), svg: `
      ${limb(150, 40, 150, 262, 14)}
      ${limb(130, 40, 72, 272, 16)}${limb(170, 40, 228, 272, 16)}
      <rect ${R} x="66" y="52" width="168" height="128" rx="4"/>
      <path ${R} d="M70 176 Q118 122 168 150 Q200 132 230 150 V176 z"/>
      <circle ${R} cx="196" cy="88" r="18"/>${rays(196, 88, 24, 32, 8, 0)}
      ${eye(190, 86, 3)}${eye(202, 86, 3)}<path d="M192 94 q4 4 8 0" ${T}/>
      ${cloud(112, 104, 26)}
      <rect ${R} x="126" y="30" width="48" height="20" rx="6"/>
      <rect ${R} x="52" y="180" width="196" height="18" rx="6"/>
      <path ${R} d="M28 240 Q28 210 74 208 Q118 208 116 234 Q114 248 96 244 Q84 242 86 256 Q88 272 64 272 Q28 270 28 240 z"/>
      <ellipse cx="98" cy="226" rx="8" ry="6" ${D}/>
      <circle ${R} cx="50" cy="232" r="10"/><circle ${R} cx="72" cy="224" r="9"/><circle ${R} cx="50" cy="256" r="9"/>
      <rect ${R} x="226" y="234" width="44" height="40" rx="8"/><path ${R} d="M226 246 q22 10 44 0 v-12 h-44 z"/>
      ${rot(18, 252, 210, `<rect ${R} x="247" y="176" width="10" height="56" rx="4"/><path ${R} d="M247 178 q5 -22 10 0 z"/>`)}` },

    // 51 Diwali lamp (diya)
    { id: 'a5-diwali-diya', cat: 'holidays', name: N('Diwali lamp', 'Lampe de Diwali', 'Lámpara de Diwali', 'Diwali-Lampe', '排灯节油灯'), svg: `
      <path d="M-4 26 Q150 100 304 26" ${D}/>
      ${[[26, 39], [88, 57], [150, 62], [212, 57], [274, 39]].map(([x, y]) => `${scallop(x, y, 15, 10, 1.15)}<circle cx="${x}" cy="${y}" r="5.5" ${T}/>`).join('')}
      <path ${R} d="M60 200 Q74 222 68 234 Q60 242 52 234 Q46 222 60 200 z"/><path ${R} d="M240 200 Q254 222 248 234 Q240 242 232 234 Q226 222 240 200 z"/>
      <path ${R} d="M28 240 Q60 250 92 240 Q88 268 60 270 Q32 268 28 240 z"/><path ${R} d="M208 240 Q240 250 272 240 Q268 268 240 270 Q212 268 208 240 z"/>
      <circle cx="44" cy="256" r="2.5" fill="${INK}"/><circle cx="60" cy="259" r="2.5" fill="${INK}"/><circle cx="76" cy="256" r="2.5" fill="${INK}"/><circle cx="224" cy="256" r="2.5" fill="${INK}"/><circle cx="240" cy="259" r="2.5" fill="${INK}"/><circle cx="256" cy="256" r="2.5" fill="${INK}"/>
      <path ${R} d="M126 228 h48 l10 20 h-68 z"/>
      <path ${R} d="M72 166 Q150 186 228 166 Q222 226 150 232 Q78 226 72 166 z"/>
      <path ${R} d="M78 184 Q150 200 222 184 L216 196 Q150 212 84 196 z"/>
      <circle cx="110" cy="196" r="3" fill="${INK}"/><circle cx="150" cy="202" r="3" fill="${INK}"/><circle cx="190" cy="196" r="3" fill="${INK}"/>
      ${eye(132, 214, 5)}${eye(168, 214, 5)}${smile(150, 220, 5)}
      <ellipse ${R} cx="150" cy="166" rx="78" ry="12"/>
      <path d="M150 150 V164" ${D}/>
      <path ${R} d="M150 84 Q180 126 164 150 Q150 162 136 150 Q120 126 150 84 z"/>
      <path ${R} d="M150 110 Q164 132 158 146 Q150 154 142 146 Q136 132 150 110 z"/>
      ${spark(100, 100)}${spark(200, 100)}` },

    // 52 Easter basket with eggs
    { id: 'a5-easter-basket', cat: 'holidays', name: N('Easter basket', 'Panier de Pâques', 'Cesta de Pascua', 'Osterkorb', '复活节彩蛋篮'), svg: `
      <path ${R} d="M64 152 Q64 34 150 34 Q236 34 236 152 H220 Q220 52 150 52 Q80 52 80 152 z"/>
      <path ${R} d="M150 42 L128 30 L128 54 Z M150 42 L172 30 L172 54 Z"/><circle cx="150" cy="42" r="5" fill="${INK}"/>
      <ellipse ${R} cx="98" cy="118" rx="22" ry="28"/><path d="M78 114 l8 -8 l8 8 l8 -8 l8 8 l8 -8" ${T}/>
      <ellipse ${R} cx="202" cy="118" rx="22" ry="28"/><circle cx="194" cy="108" r="4" fill="${INK}"/><circle cx="210" cy="114" r="4" fill="${INK}"/><circle cx="198" cy="128" r="4" fill="${INK}"/>
      <g transform="rotate(90 150 104)">${ellBands(150, 104, 32, 25, [136, 156], 6)}</g>
      <ellipse ${R} cx="174" cy="130" rx="18" ry="22"/><path d="M158 128 q8 -6 16 0 q8 6 16 0" ${T}/>
      <polygon ${R} points="56,156 56,138 66,128 74,140 84,126 94,140 104,128 114,140 124,126 134,140 144,128 154,140 164,126 174,140 184,128 194,140 204,126 214,140 224,128 234,138 244,130 244,156"/>
      <path ${R} d="M60 160 H240 L222 262 Q150 274 78 262 z"/>
      <path d="M78 196 H222 M84 228 H216 M110 166 L104 262 M150 166 V268 M190 166 L196 262" ${T}/>
      <rect ${R} x="50" y="150" width="200" height="22" rx="11"/>
      <circle ${R} cx="38" cy="254" r="22"/><polygon ${R} points="56,244 74,251 56,258"/>
      ${eye(44, 246, 4)}<path d="M26 254 q8 8 16 0 M34 276 v6 M44 276 v6" ${T}/><path d="M34 232 q2 -8 8 -10" ${T}/>
      ${scallop(270, 252, 13, 6, 1.15)}<circle cx="270" cy="252" r="4" fill="${INK}"/><path d="M270 266 v18" ${D}/>` },

    // 53 Birthday party hat with streamers
    { id: 'a5-party-hat', cat: 'holidays', name: N('Party hat', 'Chapeau de fête', 'Gorro de fiesta', 'Partyhut', '生日派对帽'), svg: `
      <ellipse ${R} cx="52" cy="70" rx="26" ry="32"/><path d="M48 102 h8 l-4 6 z" fill="${INK}" ${L}/><path d="M52 108 q-10 20 4 40 q10 18 -2 40" ${T}/><path d="M38 56 q2 -10 10 -14" ${T}/>
      <ellipse ${R} cx="250" cy="76" rx="26" ry="32"/><path d="M246 108 h8 l-4 6 z" fill="${INK}" ${L}/><path d="M250 114 q10 20 -4 40 q-10 18 2 40" ${T}/><path d="M236 62 q2 -10 10 -14" ${T}/>
      ${star(30, 170, 11, 5)}${star(272, 214, 11, 5)}<circle ${R} cx="84" cy="128" r="8"/><circle ${R} cx="222" cy="140" r="8"/>
      ${spark(96, 34)}${spark(206, 26)}
      ${ribbon(8, 262, 104, 252, 8, 2, 14)}${ribbon(196, 256, 292, 266, 8, 2, 14)}
      <path ${R} d="M150 40 L167.4 96 Q150 104 132.6 96 z"/>
      <path ${R} d="M132.6 96 Q150 104 167.4 96 L186.1 156 Q150 168 113.9 156 z"/>
      <path ${R} d="M113.9 156 Q150 168 186.1 156 L206 220 Q150 236 94 220 z"/>
      ${star(150, 126, 8, 3.5, 5, `fill="none" ${L}`)}${star(128, 140, 5, 2.2, 5, `fill="${INK}"`)}${star(172, 140, 5, 2.2, 5, `fill="${INK}"`)}
      ${eye(134, 190, 6)}${eye(166, 190, 6)}${smile(150, 202, 6)}${blush(120, 204)}${blush(180, 204)}
      <path ${R} d="M90 216 Q150 234 210 216 L214 232 Q150 252 86 232 z"/>
      <circle cx="110" cy="234" r="3" fill="${INK}"/><circle cx="130" cy="238" r="3" fill="${INK}"/><circle cx="150" cy="240" r="3" fill="${INK}"/><circle cx="170" cy="238" r="3" fill="${INK}"/><circle cx="190" cy="234" r="3" fill="${INK}"/>
      ${scallop(150, 32, 18, 9, 1.2)}` }
  ]);
})();
