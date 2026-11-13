/* IntelloKids sticker album for 10-year-olds: cosmic dragons, science, constellations, potions, our own pixel heroes,
   royal fashion and action sports (see "Age albums" in js/stickers.js). kind: 'royal' or 'action' sets the order from
   the child's avatar (girl/boy); every child sees and can win everything. Names: English|Français|Español|Deutsch|中文. */
window.Stickers && Stickers.addAlbum(10, [
  { id: 'cosmic', kind: 'action', t: 'Cosmic dragons|Dragons cosmiques|Dragones cósmicos|Kosmische Drachen|宇宙巨龙', icon: '🐉', frame: 'hex', bg: ['#2E2B6E', '#0B0A26'], track: 'plays', items: [
    ['m:dragon:#312E81,#A5B4FC,#7C3AED,#FDE68A,legend+⭐', 'Starlight dragon|Dragon de lumière|Dragón de luz estelar|Sternenlichtdrache|星光龙'], ['m:dragon:#0F766E,#99F6E4,#1D4ED8,#FFFFFF,legend+🌠', 'Comet dragon|Dragon comète|Dragón cometa|Kometendrache|彗星龙'],
    ['m:dragon:#BE185D,#FBCFE8,#6D28D9,#FDE68A,legend+🌌', 'Galaxy dragon|Dragon galactique|Dragón galáctico|Galaxiedrache|银河龙'], ['m:dragon:#1D4ED8,#BFDBFE,#0EA5E9,#FFFFFF,legend+🪐', 'Saturn dragon|Dragon de Saturne|Dragón de Saturno|Saturndrache|土星龙'],
    ['m:dragon:#B91C1C,#FECACA,#F59E0B,#FFF7ED,legend+☄️', 'Meteor dragon|Dragon météore|Dragón meteoro|Meteordrache|流星龙'], ['m:dragon:#4B5563,#E5E7EB,#111827,#FDE68A,legend+🌑', 'Black hole dragon|Dragon trou noir|Dragón agujero negro|Schwarzes-Loch-Drache|黑洞龙'],
    ['m:dragon:#7C3AED,#DDD6FE,#22D3EE,#FFFFFF,legend+✨', 'Nova dragon|Dragon nova|Dragón nova|Nova-Drache|新星龙'], ['m:dragon:#0EA5E9,#E0F2FE,#F472B6,#FFFFFF,legend+🌈', 'Northern lights dragon|Dragon des aurores|Dragón de las auroras|Nordlichtdrache|北极光龙'],
    ['m:dragon:#F97316,#FFEDD5,#FBBF24,#FFFFFF,legend+☀️', 'Solar flare dragon|Dragon éruption solaire|Dragón llamarada solar|Sonnenwind-Drache|太阳耀斑龙'], ['m:dragon:#CBD5E1,#F8FAFC,#64748B,#93C5FD,legend+🌕', 'Moonbeam dragon|Dragon rayon de lune|Dragón rayo de luna|Mondstrahl-Drache|月光龙'],
    ['m:dragon:#16A34A,#BBF7D0,#7C3AED,#FDE68A,legend+🌍', 'Earth guardian|Gardien de la Terre|Guardián de la Tierra|Erdhüter|地球守护龙'], ['m:dragon:#6D28D9,#F5D0FE,#EC4899,#FDE68A,legend+🔮', 'Mystic dragon|Dragon mystique|Dragón místico|Mystischer Drache|神秘龙'],
    ['m:dragon:#0891B2,#CFFAFE,#155E75,#FFFFFF,legend+🛰️', 'Orbit dragon|Dragon d’orbite|Dragón orbital|Orbitdrache|轨道龙'], ['m:dragon:#111827,#C4B5FD,#4C1D95,#F5B800,legend+🌌', 'Deep space dragon|Dragon de l’espace profond|Dragón del espacio profundo|Tiefraumdrache|深空龙'],
    ['m:dragon:#F5B800,#FFF7D6,#7C3AED,#FFFFFF,legend+🌟', 'Celestial emperor|Empereur céleste|Emperador celestial|Himmelskaiser|天帝神龙']
  ] },
  { id: 'fashion', kind: 'royal', t: 'Royal fashion|Mode royale|Moda real|Königliche Mode|皇家时尚', icon: '👒', frame: 'heart', bg: ['#FFF3F8', '#F7A8CB'], track: 'answers', items: [
    ['👒', 'Sun hat|Chapeau de paille|Pamela|Sonnenhut|遮阳帽'], ['👜', 'Handbag|Sac à main|Bolso|Handtasche|手提包'], ['👛', 'Purse|Porte-monnaie|Monedero|Geldbörse|小钱包'],
    ['💄', 'Lip gloss|Brillant à lèvres|Brillo de labios|Lipgloss|唇彩'], ['👢', 'Boots|Bottes|Botas|Stiefel|靴子'], ['👡', 'Sandals|Sandales|Sandalias|Sandalen|凉鞋'],
    ['🧤', 'Gloves|Gants|Guantes|Handschuhe|手套'], ['👘', 'Kimono|Kimono|Kimono|Kimono|和服'], ['🥻', 'Sari|Sari|Sari|Sari|纱丽'],
    ['💃', 'Dancer|Danseuse|Bailarina|Tänzerin|舞者'], ['🩰', 'Ballet shoes|Chaussons de danse|Zapatillas de ballet|Ballettschuhe|芭蕾舞鞋'], ['💅', 'Nail polish|Vernis à ongles|Esmalte de uñas|Nagellack|指甲油'],
    ['👸+💃', 'Ballroom princess|Princesse du bal|Princesa del baile|Ballprinzessin|舞会公主'], ['🤴+🎩', 'Dapper prince|Prince élégant|Príncipe elegante|Feiner Prinz|优雅王子'],
    ['👑+💎', 'Diamond crown|Couronne de diamants|Corona de diamantes|Diamantkrone|钻石王冠']
  ] },
  { id: 'science', t: 'Science lab|Le labo des sciences|Laboratorio de ciencias|Forscherlabor|科学实验室', icon: '🔬', frame: 'hex', bg: ['#EEF8FF', '#7CC7F0'], track: 'stars', items: [
    ['🔬', 'Microscope|Microscope|Microscopio|Mikroskop|显微镜'], ['🧪', 'Test tube|Éprouvette|Tubo de ensayo|Reagenzglas|试管'], ['🧫', 'Petri dish|Boîte de Petri|Placa de Petri|Petrischale|培养皿'],
    ['🧬', 'DNA|ADN|ADN|DNA|DNA'], ['🧲', 'Magnet|Aimant|Imán|Magnet|磁铁'], ['⚗️', 'Lab flask|Alambic|Alambique|Destillierkolben|蒸馏瓶'],
    ['🌡️', 'Thermometer|Thermomètre|Termómetro|Thermometer|温度计'], ['🔋', 'Battery|Pile|Pila|Batterie|电池'], ['🦠', 'Microbe|Microbe|Microbio|Mikrobe|微生物'],
    ['🌋', 'Volcano|Volcan|Volcán|Vulkan|火山'], ['⚛️', 'Atom|Atome|Átomo|Atom|原子'], ['📐', 'Set square|Équerre|Escuadra|Geodreieck|三角尺'],
    ['⚙️', 'Gear|Engrenage|Engranaje|Zahnrad|齿轮'], ['🔧', 'Spanner|Clé à molette|Llave inglesa|Schraubenschlüssel|扳手'], ['👩‍🔬', 'Scientist|Scientifique|Científica|Forscherin|科学家']
  ] },
  { id: 'potions', t: 'Potion lab|Le labo des potions|Laboratorio de pociones|Zaubertrank-Labor|魔药实验室', icon: '🧪', frame: 'circle', bg: ['#F5F0FF', '#B79CF0'], track: 'fills', items: [
    ['m:potion:round,k,n,bubbles', 'Giggle potion|Potion de fou rire|Poción de la risa|Kichertrank|欢笑药水'], ['m:potion:tall,g,p,sparkle', 'Grow potion|Potion de croissance|Poción de crecer|Wachstrank|长大药水'],
    ['m:potion:flask,b,y,swirl', 'Ocean potion|Potion de l’océan|Poción del océano|Ozeantrank|海洋药水'], ['m:potion:heart,r,k,bubbles', 'Kindness potion|Potion de gentillesse|Poción de la bondad|Freundlichkeitstrank|善良药水'],
    ['m:potion:round,y,n,sparkle', 'Sunshine potion|Potion de soleil|Poción de sol|Sonnentrank|阳光药水'], ['m:potion:tall,p,y,bubbles', 'Dream potion|Potion de rêve|Poción de los sueños|Traumtrank|梦境药水'],
    ['m:potion:flask,g,n,bubbles', 'Bubble potion|Potion à bulles|Poción de burbujas|Blubbertrank|泡泡药水'], ['m:potion:heart,k,y,sparkle', 'Friendship potion|Potion d’amitié|Poción de la amistad|Freundschaftstrank|友谊药水'],
    ['m:potion:round,c,b,swirl', 'Ice potion|Potion de glace|Poción de hielo|Eistrank|冰冻药水'], ['m:potion:tall,o,r,sparkle', 'Fire potion|Potion de feu|Poción de fuego|Feuertrank|火焰药水'],
    ['m:potion:flask,p,k,sparkle', 'Starlight potion|Potion d’étoiles|Poción de estrellas|Sternenlichttrank|星光药水'], ['m:potion:round,t,y,bubbles', 'Speed potion|Potion de vitesse|Poción de velocidad|Tempotrank|加速药水'],
    ['m:potion:heart,p,w,swirl', 'Invisibility potion|Potion d’invisibilité|Poción de invisibilidad|Unsichtbarkeitstrank|隐身药水'], ['m:potion:tall,#22C55E,y,swirl', 'Brain boost|Potion de génie|Poción de genio|Schlautrank|聪明药水'],
    ['m:potion:flask,#F5B800,r,sparkle', 'Golden elixir|Élixir doré|Elixir dorado|Goldenes Elixier|黄金灵药']
  ] },
  { id: 'pixel', kind: 'action', t: 'Pixel heroes|Héros en pixels|Héroes pixelados|Pixel-Helden|像素英雄', icon: '👾', frame: 'square', bg: ['#F0F3FF', '#9AA8F5'], track: 'chests', items: [
    ['m:pixel:knight', 'Pixel knight|Chevalier pixel|Caballero pixel|Pixel-Ritter|像素骑士'], ['m:pixel:wizard', 'Pixel wizard|Magicien pixel|Mago pixel|Pixel-Zauberer|像素巫师'],
    ['m:pixel:princess', 'Pixel princess|Princesse pixel|Princesa pixel|Pixel-Prinzessin|像素公主'], ['m:pixel:ninja', 'Pixel ninja|Ninja pixel|Ninja pixel|Pixel-Ninja|像素忍者'],
    ['m:pixel:robot', 'Pixel robot|Robot pixel|Robot pixel|Pixel-Roboter|像素机器人'], ['m:pixel:alien', 'Pixel alien|Alien pixel|Alien pixel|Pixel-Alien|像素外星人'],
    ['m:pixel:dragon', 'Pixel dragon|Dragon pixel|Dragón pixel|Pixel-Drache|像素龙'], ['m:pixel:cat', 'Pixel cat|Chat pixel|Gato pixel|Pixel-Katze|像素猫'],
    ['m:pixel:fox', 'Pixel fox|Renard pixel|Zorro pixel|Pixel-Fuchs|像素狐狸'], ['m:pixel:frog', 'Pixel frog|Grenouille pixel|Rana pixel|Pixel-Frosch|像素青蛙'],
    ['m:pixel:bunny', 'Pixel bunny|Lapin pixel|Conejo pixel|Pixel-Hase|像素兔子'], ['m:pixel:bird', 'Pixel bird|Oiseau pixel|Pájaro pixel|Pixel-Vogel|像素小鸟'],
    ['m:pixel:fish', 'Pixel fish|Poisson pixel|Pez pixel|Pixel-Fisch|像素鱼'], ['m:pixel:controller', 'Game pad|Manette|Mando|Gamepad|游戏手柄'],
    ['m:pixel:trophy', 'Pixel trophy|Trophée pixel|Trofeo pixel|Pixel-Pokal|像素奖杯']
  ] },
  { id: 'stars', t: 'Constellations|Constellations|Constelaciones|Sternbilder|星座', icon: '✨', frame: 'circle', bg: ['#3A3F95', '#0B0E33'], track: 'three', items: [
    ['m:sky:plough', 'The Plough|La Grande Casserole|El Carro|Großer Wagen|北斗七星'], ['m:sky:orion', 'Orion|Orion|Orión|Orion|猎户座'], ['m:sky:cassiopeia', 'Cassiopeia|Cassiopée|Casiopea|Kassiopeia|仙后座'],
    ['m:sky:swan', 'The Swan|Le Cygne|El Cisne|Schwan|天鹅座'], ['m:sky:lion', 'The Lion|Le Lion|Leo|Löwe|狮子座'], ['m:sky:lyre', 'The Lyre|La Lyre|La Lira|Leier|天琴座'],
    ['m:sky:dragon', 'The Dragon|Le Dragon|El Dragón|Drache|天龙座'], ['m:sky:pegasus', 'Pegasus|Pégase|Pegaso|Pegasus|飞马座'], ['m:sky:twins', 'The Twins|Les Gémeaux|Géminis|Zwillinge|双子座'],
    ['m:sky:bull', 'The Bull|Le Taureau|Tauro|Stier|金牛座'], ['m:sky:cross', 'Southern Cross|Croix du Sud|Cruz del Sur|Kreuz des Südens|南十字座'], ['m:sky:eagle', 'The Eagle|L’Aigle|El Águila|Adler|天鹰座'],
    ['m:sky:scorpion', 'Scorpius|Le Scorpion|Escorpio|Skorpion|天蝎座'], ['m:sky:littlebear', 'Little Bear|Petite Ourse|Osa Menor|Kleiner Bär|小熊座'], ['m:sky:andromeda', 'Andromeda|Andromède|Andrómeda|Andromeda|仙女座']
  ] },
  { id: 'action', kind: 'action', t: 'Action sports|Sports extrêmes|Deportes de acción|Action-Sport|极限运动', icon: '🏂', frame: 'burst', bg: ['#EDF7FF', '#68B5F0'], track: 'minutes', items: [
    ['🏂', 'Snowboard|Snowboard|Snowboard|Snowboard|单板滑雪'], ['⛷️', 'Skier|Skieur|Esquiador|Skifahrer|滑雪'], ['🚴', 'Cyclist|Cycliste|Ciclista|Radfahrer|骑行'],
    ['🚵', 'Mountain bike|VTT|Bici de montaña|Mountainbike|山地车'], ['🏇', 'Horse race|Course de chevaux|Carrera de caballos|Pferderennen|赛马'], ['🤾', 'Handball|Handball|Balonmano|Handball|手球'],
    ['🤽', 'Water polo|Water-polo|Waterpolo|Wasserball|水球'], ['🏌️', 'Golfer|Golfeur|Golfista|Golfer|高尔夫球手'], ['🤺', 'Fencing|Escrime|Esgrima|Fechten|击剑'],
    ['🏋️', 'Weightlifting|Haltérophilie|Halterofilia|Gewichtheben|举重'], ['🪂', 'Parachute|Parachute|Paracaídas|Fallschirm|跳伞'], ['🛷', 'Sledge|Luge|Trineo|Schlitten|雪橇'],
    ['🥌', 'Curling|Curling|Curling|Curling|冰壶'], ['⛹️', 'Basketball player|Basketteur|Jugador de baloncesto|Basketballspieler|篮球运动员'], ['🏃+🏅', 'Gold medal runner|Coureur médaille d’or|Corredor de oro|Goldläufer|金牌跑者']
  ] }
]);
