/* IntelloKids sticker album for 7-year-olds: dragons, knights, princesses, fairies and unicorns, ninjas, our own
   superheroes and monster trucks (see "Age albums" in js/stickers.js). kind: 'royal' or 'action' sets the order
   from the child's avatar (girl/boy); every child sees and can win everything.
   Names: English|Français|Español|Deutsch|中文. */
window.Stickers && Stickers.addAlbum(7, [
  { id: 'dragons', kind: 'action', t: 'Dragon friends|Amis dragons|Amigos dragones|Drachenfreunde|龙朋友', icon: '🐉', frame: 'circle', bg: ['#FFFFFF', '#CDEBDA'], track: 'plays', items: [
    ['m:dragon:g,#FFE58A,t,#FFF3C4', 'Leafy|Feuillu|Hojita|Blattgrün|小叶'], ['m:dragon:r,#FFD54F,#B91C1C,#FFF3C4', 'Ember|Braise|Brasa|Glut|余烬'],
    ['m:dragon:b,#BAE6FD,#1E40AF,#E0F2FE', 'Splash|Plouf|Chapoteo|Platsch|浪花'], ['m:dragon:k,#FFE4F1,p,y', 'Rosie|Rosie|Rosita|Rosi|小玫瑰'],
    ['m:dragon:p,#E9D5FF,v,#FDE68A', 'Plum|Prune|Ciruela|Pflaume|紫李'], ['m:dragon:o,#FFF3C4,r,#FFF3C4', 'Sparky|Étincelle|Chispa|Funki|火花'],
    ['m:dragon:t,#CCFBF1,b,#FFF3C4', 'Minty|Menthe|Menta|Minzi|薄荷'], ['m:dragon:y,#FFF7D6,o,#FFFFFF', 'Sunny|Soleil|Solecito|Sonni|阳光'],
    ['m:dragon:#94A3B8,#E2E8F0,#475569,#FFF3C4', 'Pebble|Caillou|Piedrita|Kiesel|小石头'], ['m:dragon:#34D399,#FDE68A,#059669,#FDE68A', 'Jade|Jade|Jade|Jade|翡翠'],
    ['m:dragon:#60A5FA,#FDE68A,#F472B6,#FFFFFF', 'Bluebell|Clochette|Campanita|Glockenblume|蓝铃'], ['m:dragon:#F87171,#FECACA,#FBBF24,#FFF3C4', 'Cherry|Cerise|Cereza|Kirsche|樱桃'],
    ['m:dragon:#A78BFA,#FBCFE8,#38BDF8,#FFFFFF', 'Twinkle|Scintille|Destello|Funkel|闪闪'], ['m:dragon:#1F2937,#9CA3AF,#6B21A8,#FDE68A', 'Midnight|Minuit|Medianoche|Mitternacht|午夜'],
    ['m:dragon:#F5B800,#FFF7D6,#FB923C,#FFFFFF,legend', 'Goldie|Doré|Dorado|Goldi|金宝']
  ] },
  { id: 'princess', kind: 'royal', t: 'Princess palace|Le palais des princesses|El palacio de las princesas|Prinzessinnenpalast|公主宫殿', icon: '👑', frame: 'heart', bg: ['#FFF2F8', '#F9A8D4'], track: 'answers', items: [
    ['👸', 'Princess|Princesse|Princesa|Prinzessin|公主'], ['🤴', 'Prince|Prince|Príncipe|Prinz|王子'], ['👑', 'Crown|Couronne|Corona|Krone|王冠'],
    ['🏰', 'Castle|Château|Castillo|Schloss|城堡'], ['💍', 'Ring|Bague|Anillo|Ring|戒指'], ['🎀', 'Bow|Nœud|Lazo|Schleife|蝴蝶结'],
    ['👗', 'Ball gown|Robe de bal|Vestido de baile|Ballkleid|舞会礼服'], ['👠', 'Glass slipper|Pantoufle de verre|Zapatito de cristal|Glasschuh|水晶鞋'], ['🦢', 'Swan|Cygne|Cisne|Schwan|天鹅'],
    ['🌹', 'Rose|Rose|Rosa|Rose|玫瑰'], ['💎', 'Jewel|Joyau|Joya|Juwel|宝石'], ['💐', 'Bouquet|Bouquet|Ramo|Blumenstrauß|花束'],
    ['👸+❄️', 'Snow princess|Princesse des neiges|Princesa de las nieves|Schneeprinzessin|冰雪公主'], ['👸+🌸', 'Flower princess|Princesse des fleurs|Princesa de las flores|Blumenprinzessin|花朵公主'],
    ['🏰+🎆', 'Royal ball|Bal royal|Baile real|Königsball|皇家舞会']
  ] },
  { id: 'knights', kind: 'action', t: 'Knight school|L’école des chevaliers|Escuela de caballeros|Ritterschule|骑士学校', icon: '🛡️', frame: 'hex', bg: ['#F5F8FC', '#B8C6DB'], track: 'stars', items: [
    ['m:shield:b,y,pale,🦁', 'Lion shield|Bouclier du lion|Escudo del león|Löwenschild|狮子盾牌'], ['m:shield:r,w,chevron,🐉', 'Dragon shield|Bouclier du dragon|Escudo del dragón|Drachenschild|飞龙盾牌'],
    ['m:shield:g,y,quarter,🌲', 'Forest shield|Bouclier de la forêt|Escudo del bosque|Waldschild|森林盾牌'], ['m:shield:p,w,cross,⭐', 'Star shield|Bouclier étoilé|Escudo de la estrella|Sternenschild|星星盾牌'],
    ['m:shield:#0E7490,y,fess,🦅', 'Eagle shield|Bouclier de l’aigle|Escudo del águila|Adlerschild|雄鹰盾牌'], ['m:shield:o,x,bend,🦊', 'Fox shield|Bouclier du renard|Escudo del zorro|Fuchsschild|狐狸盾牌'],
    ['m:shield:x,y,border,🌙', 'Moon shield|Bouclier de la lune|Escudo de la luna|Mondschild|月亮盾牌'], ['m:shield:r,y,quarter,🐻', 'Bear shield|Bouclier de l’ours|Escudo del oso|Bärenschild|熊盾牌'],
    ['m:shield:b,w,chevron,🐴', 'Horse shield|Bouclier du cheval|Escudo del caballo|Pferdeschild|骏马盾牌'], ['m:shield:g,w,pale,🦉', 'Owl shield|Bouclier du hibou|Escudo del búho|Eulenschild|猫头鹰盾牌'],
    ['m:shield:k,w,fess,🌹', 'Rose shield|Bouclier de la rose|Escudo de la rosa|Rosenschild|玫瑰盾牌'], ['m:shield:t,y,cross,🐬', 'Sea shield|Bouclier de la mer|Escudo del mar|Meeresschild|大海盾牌'],
    ['m:shield:p,y,bend,⚡', 'Thunder shield|Bouclier du tonnerre|Escudo del trueno|Donnerschild|雷电盾牌'], ['m:shield:x,r,chevron,🔥', 'Fire shield|Bouclier de feu|Escudo de fuego|Feuerschild|火焰盾牌'],
    ['m:shield:#F5B800,w,border,👑', 'Royal shield|Bouclier royal|Escudo real|Königsschild|王者盾牌']
  ] },
  { id: 'fairies', kind: 'royal', t: 'Fairies and unicorns|Fées et licornes|Hadas y unicornios|Feen und Einhörner|仙子和独角兽', icon: '🦄', frame: 'flower', bg: ['#F7F2FF', '#C4B5FD'], track: 'fills', items: [
    ['🧚', 'Fairy|Fée|Hada|Fee|小仙子'], ['🦄', 'Unicorn|Licorne|Unicornio|Einhorn|独角兽'], ['🧚+🌸', 'Blossom fairy|Fée des fleurs|Hada de las flores|Blütenfee|花仙子'],
    ['🧚+❄️', 'Frost fairy|Fée du givre|Hada del hielo|Frostfee|冰霜仙子'], ['🧚+🌙', 'Moon fairy|Fée de la lune|Hada de la luna|Mondfee|月亮仙子'], ['🧚+🍄', 'Mushroom fairy|Fée des champignons|Hada de las setas|Pilzfee|蘑菇仙子'],
    ['🧚+🌈', 'Rainbow fairy|Fée arc-en-ciel|Hada del arcoíris|Regenbogenfee|彩虹仙子'], ['🧚+⭐', 'Star fairy|Fée des étoiles|Hada de las estrellas|Sternenfee|星星仙子'], ['🦄+⭐', 'Star unicorn|Licorne étoilée|Unicornio estrella|Sterneneinhorn|星星独角兽'],
    ['🦄+🌙', 'Night unicorn|Licorne de nuit|Unicornio nocturno|Nachteinhorn|夜晚独角兽'], ['🦄+🌸', 'Blossom unicorn|Licorne des fleurs|Unicornio de flores|Blüteneinhorn|花朵独角兽'], ['🦄+❄️', 'Snow unicorn|Licorne des neiges|Unicornio de nieve|Schnee-Einhorn|雪花独角兽'],
    ['🦄~200+💎', 'Sapphire unicorn|Licorne saphir|Unicornio zafiro|Saphir-Einhorn|蓝宝石独角兽'], ['🧚~280+✨', 'Sparkle fairy|Fée scintillante|Hada brillante|Glitzerfee|闪光仙子'],
    ['🦄+🌈', 'Rainbow unicorn|Licorne arc-en-ciel|Unicornio arcoíris|Regenbogen-Einhorn|彩虹独角兽']
  ] },
  { id: 'ninjas', kind: 'action', t: 'Ninja school|L’école des ninjas|Escuela ninja|Ninja-Schule|忍者学校', icon: '🥋', frame: 'circle', bg: ['#FFFFFF', '#E5D9C8'], track: 'chests', items: [
    ['m:ninja:x,w,happy', 'White-belt ninja|Ninja ceinture blanche|Ninja cinturón blanco|Ninja mit weißem Gürtel|白带忍者'], ['m:ninja:x,y,brave', 'Yellow-belt ninja|Ninja ceinture jaune|Ninja cinturón amarillo|Ninja mit gelbem Gürtel|黄带忍者'],
    ['m:ninja:x,o,wink', 'Orange-belt ninja|Ninja ceinture orange|Ninja cinturón naranja|Ninja mit orangem Gürtel|橙带忍者'], ['m:ninja:x,g,happy', 'Green-belt ninja|Ninja ceinture verte|Ninja cinturón verde|Ninja mit grünem Gürtel|绿带忍者'],
    ['m:ninja:x,b,brave', 'Blue-belt ninja|Ninja ceinture bleue|Ninja cinturón azul|Ninja mit blauem Gürtel|蓝带忍者'], ['m:ninja:x,p,wink', 'Purple-belt ninja|Ninja ceinture violette|Ninja cinturón morado|Ninja mit lila Gürtel|紫带忍者'],
    ['m:ninja:x,#92400E,happy', 'Brown-belt ninja|Ninja ceinture marron|Ninja cinturón marrón|Ninja mit braunem Gürtel|棕带忍者'], ['m:ninja:r,x,brave', 'Black-belt ninja|Ninja ceinture noire|Ninja cinturón negro|Ninja mit schwarzem Gürtel|黑带忍者'],
    ['m:ninja:r,y,happy', 'Fire ninja|Ninja du feu|Ninja de fuego|Feuer-Ninja|火忍者'], ['m:ninja:b,c,brave', 'Water ninja|Ninja de l’eau|Ninja del agua|Wasser-Ninja|水忍者'],
    ['m:ninja:g,y,wink', 'Leaf ninja|Ninja des feuilles|Ninja de las hojas|Blatt-Ninja|叶忍者'], ['m:ninja:w,b,happy', 'Snow ninja|Ninja des neiges|Ninja de la nieve|Schnee-Ninja|雪忍者'],
    ['m:ninja:p,y,brave', 'Thunder ninja|Ninja du tonnerre|Ninja del trueno|Donner-Ninja|雷忍者'], ['m:ninja:#334155,k,wink', 'Shadow ninja|Ninja de l’ombre|Ninja de las sombras|Schatten-Ninja|影忍者'],
    ['m:ninja:#F5B800,r,happy', 'Golden ninja|Ninja doré|Ninja dorado|Goldener Ninja|黄金忍者']
  ] },
  { id: 'heroes', kind: 'action', t: 'Super heroes|Super-héros|Superhéroes|Superhelden|超级英雄', icon: '⚡', frame: 'burst', bg: ['#FFF8E4', '#FFC24D'], track: 'three', items: [
    ['m:hero:b,r,r,x,0,⚡', 'Captain Bolt|Capitaine Éclair|Capitán Rayo|Kapitän Blitz|闪电队长'], ['m:hero:p,y,k,n,2,⭐', 'Star Girl|Super Étoile|Chica Estrella|Sternenmädchen|星星女孩'],
    ['m:hero:g,o,x,y,1,🔥', 'Flame Kid|Petite Flamme|Niño Llama|Flammenkind|火焰小子'], ['m:hero:c,b,b,x,3,❄️', 'Frost Flyer|Givre Volant|Escarcha Voladora|Frostflieger|冰霜飞侠'],
    ['m:hero:k,p,p,y,0,💖', 'Heart Hero|Cœur Héroïque|Heroína Corazón|Herzheldin|爱心英雄'], ['m:hero:o,x,y,x,2,☀️', 'Sun Spark|Étincelle Solaire|Chispa Solar|Sonnenfunke|太阳火花'],
    ['m:hero:t,g,g,n,1,🍃', 'Leaf Leaper|Saute-Feuille|Saltahojas|Blattspringer|跳跃叶侠'], ['m:hero:x,y,y,x,3,🌙', 'Moon Shadow|Ombre de Lune|Sombra Lunar|Mondschatten|月影侠'],
    ['m:hero:r,b,x,#B45309,0,🌊', 'Wave Rider|Surfeur des Vagues|Surfista de Olas|Wellenreiter|冲浪侠'], ['m:hero:y,r,r,x,1,🌟', 'Super Shine|Super Brillant|Súper Brillo|Superglanz|闪耀超人'],
    ['m:hero:l,k,v,#F59E0B,2,🦋', 'Butterfly Blaze|Papillon Éclair|Mariposa Veloz|Schmetterlingsblitz|蝴蝶闪侠'], ['m:hero:#0EA5E9,y,x,x,3,🌀', 'Whirlwind|Tourbillon|Torbellino|Wirbelwind|旋风侠'],
    ['m:hero:#16A34A,r,y,#78350F,0,🦖', 'Dino Dash|Dino Fonceur|Dino Veloz|Dino-Flitzer|恐龙冲刺侠'], ['m:hero:#7C3AED,#F5B800,#F5B800,x,2,💎', 'Crystal Queen|Reine de Cristal|Reina de Cristal|Kristallkönigin|水晶女王'],
    ['m:hero:#F5B800,r,b,x,1,⚡', 'Golden Guardian|Gardien Doré|Guardián Dorado|Goldener Wächter|黄金守护者']
  ] },
  { id: 'trucks', kind: 'action', t: 'Monster trucks|Monster trucks|Camiones monstruo|Monstertrucks|怪兽卡车', icon: '🏁', frame: 'square', bg: ['#F4F6F8', '#AEB9C4'], track: 'minutes', items: [
    ['m:truck:monster,r,y,🔥', 'Fire Stomper|Écrase-Feu|Pisafuego|Feuerstampfer|火焰踩踏者'], ['m:truck:monster,g,o,', 'Mud Masher|Broie-Boue|Aplastabarro|Matschmampfer|泥地粉碎者'],
    ['m:truck:monster,b,c,⚡', 'Thunder Wheels|Roues Tonnerre|Ruedas Trueno|Donnerräder|雷霆车轮'], ['m:truck:monster,o,y,⭐', 'Big Orange|Gros Orange|Gran Naranja|Großer Oranger|大橙子'],
    ['m:truck:monster,p,k,💥', 'Purple Crusher|Broyeur Violet|Triturador Morado|Lila Brecher|紫色粉碎者'], ['m:truck:monster,y,x,🐝', 'Bumble Truck|Camion Bourdon|Camión Abejorro|Hummeltruck|大黄蜂卡车'],
    ['m:truck:monster,t,y,🌊', 'Wave Crusher|Brise-Vague|Rompeolas|Wellenbrecher|破浪者'], ['m:truck:monster,x,r,🔥', 'Midnight Stomper|Écrase-Minuit|Pisa Medianoche|Mitternachtsstampfer|午夜踩踏者'],
    ['m:truck:monster,k,w,💖', 'Pink Power|Force Rose|Poder Rosa|Pinke Power|粉红力量'], ['m:truck:monster,#16A34A,y,🦖', 'Dino Truck|Camion Dino|Camión Dino|Dino-Truck|恐龙卡车'],
    ['m:truck:monster,#0EA5E9,w,❄️', 'Ice Breaker|Brise-Glace|Rompehielos|Eisbrecher|破冰者'], ['m:truck:monster,#DC2626,x,🐉', 'Dragon Wheels|Roues du Dragon|Ruedas de Dragón|Drachenräder|飞龙车轮'],
    ['m:truck:monster,#7C3AED,y,⚡', 'Storm Rider|Chevaucheur d’Orage|Jinete de Tormenta|Sturmreiter|风暴骑士'], ['m:truck:monster,#1F2937,#F5B800,⭐', 'Black Star|Étoile Noire|Estrella Negra|Schwarzer Stern|黑色之星'],
    ['m:truck:monster,#F5B800,r,👑', 'Golden King|Roi Doré|Rey Dorado|Goldener König|黄金之王']
  ] }
]);
