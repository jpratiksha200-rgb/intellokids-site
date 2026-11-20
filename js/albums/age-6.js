/* IntelloKids sticker album for 6-year-olds: friendly characters, dinosaurs, sea life, space and sweets
   (see "Age albums" in js/stickers.js). Names: English|Français|Español|Deutsch|中文 (one name = the same everywhere). */
window.Stickers && Stickers.addAlbum(6, [
  { id: 'robots', t: 'Robot friends|Amis robots|Amigos robots|Roboterfreunde|机器人朋友', icon: '🤖', frame: 'square', bg: ['#FFFFFF', '#D3E2EF'], track: 'plays', items: [
    ['m:bot:b,box,round,ball,grid', 'Bolt'], ['m:bot:o,round,visor,bolt,smile', 'Zippy'], ['m:bot:g,tv,one,dish,dots', 'Gizmo'],
    ['m:bot:k,box,hearts,ball,smile', 'Lulu'], ['m:bot:t,round,round,dish,grid', 'Beep'], ['m:bot:p,tv,visor,ball,smile', 'Pixie'],
    ['m:bot:y,box,one,bolt,dots', 'Sparky'], ['m:bot:r,round,hearts,ball,grid', 'Rusty'], ['m:bot:c,box,visor,dish,smile', 'Nova'],
    ['m:bot:e,tv,round,bolt,grid', 'Clank'], ['m:bot:#FF8A65,round,one,ball,smile', 'Tinker'], ['m:bot:#34D399,box,round,dish,dots', 'Minto'],
    ['m:bot:#818CF8,tv,hearts,bolt,smile', 'Boop'], ['m:bot:#F472B6,round,visor,ball,grid', 'Whirr'], ['m:bot:#F5B800,box,round,bolt,smile', 'Goldo']
  ] },
  { id: 'dinos', t: 'Dino dig|Fouille des dinos|Excavación de dinos|Dino-Ausgrabung|恐龙大发现', icon: '🦖', frame: 'hex', bg: ['#FFF8E6', '#E8C27A'], track: 'answers', items: [
    ['m:dino:baby,b,y,spots', 'Blue dino baby|Bébé dino bleu|Bebé dino azul|Blaues Dino-Baby|蓝色恐龙宝宝'], ['m:dino:rex,o,y,stripes', 'Tiger T. rex|T. rex tigré|T. rex atigrado|Tiger-T. rex|老虎纹霸王龙'],
    ['m:dino:long,t,y,none', 'Teal long-neck|Long-cou turquoise|Cuellilargo turquesa|Türkiser Langhals|青色长颈龙'], ['m:dino:trike,g,k,none', 'Green triceratops|Tricératops vert|Triceratops verde|Grüner Triceratops|绿色三角龙'],
    ['m:dino:stego,o,y,spots', 'Orange stegosaurus|Stégosaure orange|Estegosaurio naranja|Oranger Stegosaurus|橙色剑龙'], ['m:dino:ptero,p,k,none', 'Purple pterodactyl|Ptérodactyle violet|Pterodáctilo morado|Lila Flugsaurier|紫色翼龙'],
    ['m:dino:rex,b,c,spots', 'Ice T. rex|T. rex des glaces|T. rex de hielo|Eis-T. rex|冰霜霸王龙'], ['m:dino:long,o,y,stripes', 'Stripy long-neck|Long-cou rayé|Cuellilargo a rayas|Gestreifter Langhals|条纹长颈龙'],
    ['m:dino:trike,p,y,spots', 'Purple triceratops|Tricératops violet|Triceratops morado|Lila Triceratops|紫色三角龙'], ['m:dino:stego,b,y,none', 'Blue stegosaurus|Stégosaure bleu|Estegosaurio azul|Blauer Stegosaurus|蓝色剑龙'],
    ['m:dino:ptero,r,y,none', 'Red pterodactyl|Ptérodactyle rouge|Pterodáctilo rojo|Roter Flugsaurier|红色翼龙'], ['m:dino:baby,o,g,spots', 'Orange dino baby|Bébé dino orange|Bebé dino naranja|Oranges Dino-Baby|橙色恐龙宝宝'],
    ['m:dino:trike,r,y,stripes', 'Fire triceratops|Tricératops de feu|Triceratops de fuego|Feuer-Triceratops|火焰三角龙'], ['m:dino:stego,k,p,spots', 'Pink stegosaurus|Stégosaure rose|Estegosaurio rosa|Rosa Stegosaurus|粉色剑龙'],
    ['m:dino:long,#F5B800,#FFF3C4,spots', 'Golden long-neck|Long-cou doré|Cuellilargo dorado|Goldener Langhals|金色长颈龙']
  ] },
  { id: 'reef', t: 'Coral reef|Récif de corail|Arrecife de coral|Korallenriff|珊瑚礁', icon: '🐠', frame: 'circle', bg: ['#E4FBFF', '#3CC6E0'], track: 'stars', items: [
    ['m:fish:round,o,w,stripes', 'Stripy fish|Poisson rayé|Pez a rayas|Streifenfisch|条纹鱼'], ['m:fish:long,b,y,spots', 'Spotty fish|Poisson tacheté|Pez con lunares|Tupfenfisch|斑点鱼'],
    ['m:fish:tall,y,x,zigzag', 'Zigzag fish|Poisson zigzag|Pez zigzag|Zickzackfisch|锯齿纹鱼'], ['m:fish:round,k,p,spots', 'Pink puff|Boule rose|Bolita rosa|Rosa Pummel|粉色胖胖鱼'],
    ['m:fish:long,g,y,stripes', 'Green racer|Bolide vert|Corredor verde|Grüner Flitzer|绿色快鱼'], ['m:fish:tall,p,y,stripes', 'Royal angelfish|Poisson-ange royal|Pez ángel real|Königs-Kaiserfisch|皇家神仙鱼'],
    ['m:fish:round,y,b,zigzag', 'Sunny fish|Poisson soleil|Pez sol|Sonnenfisch|太阳鱼'], ['m:fish:long,r,w,spots', 'Red dotty|Poisson à pois rouge|Pez rojo a lunares|Roter Punktefisch|红点鱼'],
    ['m:fish:tall,b,c,plain', 'Blue sailfish|Poisson voilier bleu|Pez vela azul|Blauer Segelfisch|蓝帆鱼'], ['m:fish:round,t,y,stripes', 'Teal fish|Poisson turquoise|Pez turquesa|Türkiser Fisch|青色鱼'],
    ['m:fish:long,p,k,zigzag', 'Purple zigzag|Zigzag violet|Zigzag morado|Lila Zickzack|紫色锯齿鱼'], ['m:fish:round,c,w,spots', 'Bubble fish|Poisson bulle|Pez burbuja|Blubberfisch|泡泡鱼'],
    ['m:fish:tall,o,y,zigzag', 'Coral fish|Poisson corail|Pez coral|Korallenfisch|珊瑚鱼'], ['m:fish:long,k,y,stripes', 'Rainbow fish|Poisson arc-en-ciel|Pez arcoíris|Regenbogenfisch|彩虹鱼'],
    ['m:fish:round,#F5B800,#FFF3C4,spots', 'Golden fish|Poisson doré|Pez dorado|Goldfisch|金鱼']
  ] },
  { id: 'planets', t: 'Planet hop|Tour des planètes|Salto de planetas|Planetenreise|行星之旅', icon: '🪐', frame: 'circle', bg: ['#4A4FA6', '#151A55'], track: 'fills', items: [
    ['m:planet:mercury', 'Mercury|Mercure|Mercurio|Merkur|水星'], ['m:planet:venus', 'Venus|Vénus|Venus|Venus|金星'], ['m:planet:earth', 'Earth|Terre|Tierra|Erde|地球'],
    ['m:planet:mars', 'Mars|Mars|Marte|Mars|火星'], ['m:planet:jupiter', 'Jupiter|Jupiter|Júpiter|Jupiter|木星'], ['m:planet:saturn', 'Saturn|Saturne|Saturno|Saturn|土星'],
    ['m:planet:uranus', 'Uranus|Uranus|Urano|Uranus|天王星'], ['m:planet:neptune', 'Neptune|Neptune|Neptuno|Neptun|海王星'], ['m:planet:moon', 'Moon|Lune|Luna|Mond|月球'],
    ['m:planet:pluto', 'Pluto|Pluton|Plutón|Pluto|冥王星'], ['m:planet:#A855F7,#F472B6,#FFD21F,2,1,spots', 'Planet Bubblegum|Planète Chewing-gum|Planeta Chicle|Planet Kaugummi|泡泡糖星球'],
    ['m:planet:#5CCB6F,#3B82F6,,1,1,bands', 'Planet Jelly|Planète Gelée|Planeta Gelatina|Planet Wackelpudding|果冻星球'], ['m:planet:#FB923C,#FFD21F,#F472B6,0,1,swirl', 'Planet Zoom|Planète Zoom|Planeta Zum|Planet Zoom|嗖嗖星球'],
    ['m:planet:#3ED8E8,#FFFFFF,#C4B5FD,2,1,bands', 'Planet Frosty|Planète Givrée|Planeta Escarcha|Planet Frosti|冰霜星球'], ['m:planet:sun', 'The Sun|Le Soleil|El Sol|Die Sonne|太阳']
  ] },
  { id: 'bakery', t: 'Bake shop|La pâtisserie|La pastelería|Die Konditorei|甜品店', icon: '🧁', frame: 'scallop', bg: ['#FFF7EF', '#FFB38A'], track: 'chests', items: [
    ['m:sweet:cupcake,k,c,cherry', 'Cherry cupcake|Cupcake cerise|Magdalena de cereza|Kirsch-Cupcake|樱桃纸杯蛋糕'], ['m:sweet:donut,k,n,none', 'Pink doughnut|Beignet rose|Dónut rosa|Rosa Donut|粉色甜甜圈'],
    ['m:sweet:cone,m,k,star', 'Mint ice cream|Glace à la menthe|Helado de menta|Minzeis|薄荷冰淇淋'], ['m:sweet:pop,r,w,none', 'Swirly lollipop|Sucette spirale|Piruleta espiral|Spirallutscher|漩涡棒棒糖'],
    ['m:sweet:cake,w,k,cherry', 'Birthday cake|Gâteau d’anniversaire|Tarta de cumpleaños|Geburtstagstorte|生日蛋糕'], ['m:sweet:macaron,l,w,none', 'Lavender macaron|Macaron lavande|Macarón de lavanda|Lavendel-Macaron|薰衣草马卡龙'],
    ['m:sweet:shake,k,k,cherry', 'Strawberry shake|Milk-shake fraise|Batido de fresa|Erdbeershake|草莓奶昔'], ['m:sweet:cupcake,#8B5A2B,y,star', 'Chocolate cupcake|Cupcake au chocolat|Magdalena de chocolate|Schoko-Cupcake|巧克力纸杯蛋糕'],
    ['m:sweet:donut,#8B5A2B,n,none', 'Choco doughnut|Beignet chocolat|Dónut de chocolate|Schoko-Donut|巧克力甜甜圈'], ['m:sweet:cone,k,y,cherry', 'Double scoop|Double boule|Doble bola|Zwei Kugeln|双球冰淇淋'],
    ['m:sweet:macaron,m,k,heart', 'Pistachio macaron|Macaron pistache|Macarón de pistacho|Pistazien-Macaron|开心果马卡龙'], ['m:sweet:pop,p,y,none', 'Rainbow lollipop|Sucette arc-en-ciel|Piruleta arcoíris|Regenbogenlutscher|彩虹棒棒糖'],
    ['m:sweet:cake,k,w,heart', 'Strawberry cake|Gâteau à la fraise|Tarta de fresa|Erdbeertorte|草莓蛋糕'], ['m:sweet:shake,#8B5A2B,#C08457,star', 'Chocolate shake|Milk-shake chocolat|Batido de chocolate|Schokoshake|巧克力奶昔'],
    ['m:sweet:cupcake,#F5B800,k,star', 'Golden cupcake|Cupcake doré|Magdalena dorada|Goldener Cupcake|金色纸杯蛋糕']
  ] },
  { id: 'beach', t: 'Beach day|Journée à la plage|Día de playa|Strandtag|海滩日', icon: '🏖️', frame: 'burst', bg: ['#FFF9E0', '#F5C76B'], track: 'three', items: [
    ['🏖️', 'Beach|Plage|Playa|Strand|沙滩'], ['🏝️', 'Island|Île|Isla|Insel|小岛'], ['⛱️', 'Parasol|Parasol|Sombrilla|Sonnenschirm|遮阳伞'],
    ['🌊', 'Big wave|Grosse vague|Gran ola|Große Welle|大浪'], ['🏄', 'Surfer|Surfeur|Surfista|Surfer|冲浪'], ['🤿', 'Snorkel|Masque et tuba|Gafas de buceo|Schnorchel|潜水镜'],
    ['⚓', 'Anchor|Ancre|Ancla|Anker|船锚'], ['🕶️', 'Sunglasses|Lunettes de soleil|Gafas de sol|Sonnenbrille|太阳镜'], ['🧴', 'Sun cream|Crème solaire|Protector solar|Sonnencreme|防晒霜'],
    ['🏊', 'Swimmer|Nageur|Nadador|Schwimmer|游泳'], ['🚣', 'Rowing boat|Barque|Bote de remos|Ruderboot|划船'], ['🌅', 'Sunrise|Lever de soleil|Amanecer|Sonnenaufgang|日出'],
    ['🌴', 'Palm tree|Palmier|Palmera|Palme|棕榈树'], ['🐬+🌊', 'Jumping dolphin|Dauphin sauteur|Delfín saltarín|Springender Delfin|跳跃的海豚'], ['🏰+🏖️', 'Sandcastle|Château de sable|Castillo de arena|Sandburg|沙堡']
  ] },
  { id: 'party', t: 'Animal party|La fête des animaux|Fiesta animal|Tierparty|动物派对', icon: '🦊', frame: 'heart', bg: ['#F8F0FF', '#C9A7F5'], track: 'minutes', items: [
    ['🦊+🎩', 'Fancy fox|Renard chic|Zorro elegante|Feiner Fuchs|绅士狐狸'], ['🐻+🎂', 'Birthday bear|Ours d’anniversaire|Oso de cumpleaños|Geburtstagsbär|生日熊'], ['🐰+🥕', 'Carrot bunny|Lapin carotte|Conejo zanahoria|Möhrenhase|胡萝卜兔'],
    ['🐸+👑', 'Frog king|Roi grenouille|Rey rana|Froschkönig|青蛙国王'], ['🐼+🎨', 'Painter panda|Panda peintre|Panda pintor|Maler-Panda|画家熊猫'], ['🐨+🎧', 'DJ koala|Koala DJ|Koala DJ|DJ-Koala|DJ考拉'],
    ['🐯+⚽', 'Football tiger|Tigre footballeur|Tigre futbolista|Fußball-Tiger|足球老虎'], ['🐧+🎀', 'Bow penguin|Manchot à nœud|Pingüino con lazo|Schleifenpinguin|蝴蝶结企鹅'], ['🦉+📚', 'Bookworm owl|Hibou savant|Búho lector|Bücher-Eule|爱读书的猫头鹰'],
    ['🐷+🎈', 'Balloon pig|Cochon ballon|Cerdito con globo|Ballon-Schwein|气球小猪'], ['🐵+🍌', 'Banana monkey|Singe banane|Mono plátano|Bananenaffe|香蕉猴子'], ['🦁+🎸', 'Rock lion|Lion rockeur|León rockero|Rocker-Löwe|摇滚狮子'],
    ['🐘+🎺', 'Trumpet elephant|Éléphant trompettiste|Elefante trompetista|Trompeten-Elefant|吹号大象'], ['🦒+🧣', 'Cosy giraffe|Girafe frileuse|Jirafa abrigada|Kuschel-Giraffe|围巾长颈鹿'], ['🐮+🎤', 'Singing cow|Vache chanteuse|Vaca cantante|Singende Kuh|唱歌的奶牛']
  ] }
]);
