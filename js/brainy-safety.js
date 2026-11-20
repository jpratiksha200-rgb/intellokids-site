/* Talk to Brainy: safety filter.
 * Every message a child types goes through check() BEFORE Brainy answers. It runs on the
 * device only: nothing is sent anywhere. It looks for, in this order:
 *   danger   – signs a child may be unsafe, sorted into categories (cat) so Brainy can answer warmly
 *              and the parents' dashboard shows an alert (level 'danger' = red, 'feelings' = amber):
 *                selfharm  wanting to die, disappear or hurt themselves, hating their life, nobody loves me
 *                grooming  secrets with grown-ups, "don't tell", come to his house/car, someone in my bed
 *                          or bath, clothes off, touching, private parts, being shown pictures, gifts for secrets
 *                bully     bullying, hitting at school, threats, mean messages (and "mean to me", "they laugh
 *                          at me", "nobody plays with me" at the 'feelings' level)
 *                home      someone hits or hurts me / my mum / my brother, scared at home, no food, locked in
 *                online    asked for a photo, number, address, school, video chat or to meet, by someone
 *                          online or in an app or game (Roblox, Minecraft, TikTok, WhatsApp, Discord…)
 *                worry     other danger signs (strangers, kidnapping, "don't tell my mum")
 *                checkin   borderline ("I want to disappear in hide and seek", "I'm home alone", "can you
 *                          keep a secret"): a gentle check-in and a 'feelings' alert
 *   private  – personal details (address, street, postcode, phone number in digits or words, email,
 *              username, school name, full name, passwords). The message is hidden.
 *   rude     – swear words and slurs. The message is hidden.
 *   unkind   – insults ("you're stupid"); "self" when the child says it about themselves.
 *   grownup  – topics for a grown-up (weapons, drugs, sex, money, violence).
 *   link     – web addresses (Brainy never opens or shares links).
 * The lists for the site's current language AND English are always checked (kids mix languages).
 *
 * Worry rules (RULES below) are written in a small pattern language, matched as whole words on text that
 * is lower-cased, without accents, with look-alike digits turned back into letters (s3cr3t, $ecret), repeated
 * letters squeezed (secreeet), common misspellings fixed (secrit, clotes, roblux) and apostrophes both
 * dropped and spaced (don't → dont/don t, j'habite → jhabite/j habite):
 *   a b       the words a then b          (a|b c)   either a, or b c        x?   optional
 *   word*     any word starting with it   ~ / ~2    up to 4 / 2 other words   {NAME}  a word group (MACROS)
 *   !(a|b)    not followed by a or b      $         end of the message
 * A rule can be [pattern, unless]: it doesn't count when "unless" is also in the message. SOFT lists turn a
 * category into a gentle check-in when the message looks like a game, a joke or an accident. INNOCENT
 * phrases are removed first ("never talk to strangers", "stranger things"). Keep the innocent test list in
 * infra/check-chat-safety.js up to date when adding words: "I live in a yellow house", "my mum hit the ball",
 * "a secret recipe for cookies", "I hate broccoli" must stay innocent. */
(function () {
  const L = (s) => s.split('|');

  // ---------- word lists ----------
  // German and Chinese danger signs (parked languages). English, French and Spanish use RULES below.
  const DANGER = {
    de: L("schlägt mich|schlagen mich|haut mich|tut mir weh|tun mir weh|hat mich angefasst|fasst mich an|fassen mich an|berührt mich|meine intimen stellen|mich umbringen|will sterben|möchte sterben|mir wehtun|mich ritzen|mobbing|gemobbt|mobben mich|weglaufen|abhauen|ein fremder|eine fremde|fremde leute|mich treffen|treffen wollen|fotos schicken|bilder schicken|fotos von mir|nicht meiner mama sagen|nicht meinem papa sagen|nicht meinen eltern sagen|geheimnis vor meinen eltern|nicht sicher|entführ*|angst nach hause"),
    zh: L("打我|揍我|伤害我|弄疼我|摸我|碰我|隐私部位|想死|不想活|自杀|杀了我|伤害自己|割自己|欺负我|霸凌|被欺负|离家出走|陌生人|见面|发照片|我的照片|不要告诉妈妈|不要告诉爸爸|别告诉妈妈|别告诉爸爸|不要告诉父母|不安全|绑架|害怕回家")
  };
  const PRIVATE = {
    en: L("my address|my home address|i live at|my postcode|my zip code|my phone|my phone number|phone number|my number is|my mobile|my password|password is|the password|my email|my e-mail|email address|my school is|my school's name|i go to school at|my last name|my surname|my full name"),
    fr: L("mon adresse|j'habite au numéro|j'habite rue|j'habite avenue|mon code postal|mon numéro de téléphone|mon numéro c'est|numéro de téléphone|mon portable|mon mot de passe|mot de passe|mon email|mon e-mail|mon adresse mail|mon école s'appelle|mon nom de famille"),
    es: L("mi dirección|vivo en la calle|mi código postal|mi número de teléfono|mi número es el|mi teléfono es|número de teléfono|mi móvil|mi celular|mi contraseña|la contraseña|mi correo|mi email|mi colegio se llama|mi escuela se llama|mi apellido"),
    de: L("meine adresse|ich wohne in der|meine postleitzahl|meine nummer|telefonnummer|meine handynummer|mein passwort|das passwort|meine email|meine e-mail|meine schule heißt|mein nachname|mein familienname"),
    zh: L("我的地址|我家住在|我家地址|我住在|邮编|电话号码|手机号|我的电话|密码|我的邮箱|我的学校叫|我的全名")
  };
  const RUDE = {
    en: L("fuck*|fck|fcuk|fking|fkn|motherf*|shit*|sht|bullshit|bitch*|bastard*|asshole*|arsehole*|ass|arse|dick|dickhead*|cock|cocks|cunt*|piss*|pussy|slut*|whore*|wank*|twat*|prick|bollocks|crap|crappy|damn|dammit|goddamn|nigg*|faggot*|fag|fags|retard*|spaz|tranny|porn*|sexy|horny|wtf|stfu"),
    fr: L("putain*|merde*|connard*|connasse*|con|conne|salop*|salaud*|encul*|bordel|bâtard*|pute*|nique|niquer|niqué|ta gueule|chier|foutre|couille*|bite|pd|pédé*|nègre|enfoiré*"),
    es: L("mierda*|puta*|puto*|joder|jodid*|cabrón*|coño|pendej*|gilipoll*|culo|carajo|chinga*|verga|maricón*|marica|hijo de puta|hostia|cojones|polla"),
    de: L("scheiß*|arschloch*|arsch|fick*|fotze*|hure*|hurensohn*|wichser*|schlampe*|verdammt*|kacke|schwuchtel*|neger|missgeburt|spast*"),
    zh: L("操你|操他|草泥马|傻逼|傻b|傻比|妈的|他妈|你妈|滚蛋|混蛋|王八蛋|婊子|贱人|去死|狗屎|鸡巴|屌")
  };
  const UNKIND = {
    en: L("stupid|idiot*|dumb|dummy|loser|ugly|moron|shut up|i hate you|hate you|you suck|you're bad|you are bad|you're useless|you are useless|useless|silly brainy"),
    fr: L("idiot*|stupide*|nul|nulle|débile*|crétin*|imbécile*|tais toi|ferme la|je te déteste|je te hais|moche|bouffon"),
    es: L("tonto*|idiota*|estúpid*|bobo*|feo|fea|cállate|te odio|inútil"),
    de: L("dumm*|doof*|blöd*|idiot*|trottel|halt die klappe|halts maul|ich hasse dich|hässlich|nutzlos|depp"),
    zh: L("笨蛋|白痴|蠢|闭嘴|我恨你|讨厌你|丑八怪|没用")
  };
  // Said about themselves ("I'm stupid") → encouragement instead of a telling-off.
  const SELF = {
    en: L("i am|i'm|im|i feel|am i"),
    fr: L("je suis|suis je|je me sens|j'suis"),
    es: L("soy|estoy|me siento"),
    de: L("ich bin|bin ich|ich fühle mich"),
    zh: L("我是|我好|我很|我太|我真")
  };
  const GROWNUP = {
    en: L("gun|guns|weapon*|bomb|bombs|knife|knives|drug|drugs|alcohol|beer|wine|vodka|drunk|smoking|cigarette*|vape*|vaping|sex|naked|nude*|boobs|penis|vagina|private parts|kill|killed|killing|murder*|blood|war|horror|gamble*|gambling|casino|credit card|buy|pay|money|where do babies come from"),
    fr: L("pistolet|fusil|arme|armes|bombe|bombes|couteau|drogue|drogues|alcool|bière|ivre|cigarette*|fumer|sexe|tout nu|toute nue|pénis|vagin|zizi|tuer|tué|meurtre*|sang|guerre|horreur|casino|carte bancaire|acheter|payer|argent|d'où viennent les bébés"),
    es: L("pistola|arma|armas|bomba|bombas|cuchillo|droga|drogas|alcohol|cerveza|borracho|cigarro|cigarros|cigarrillo*|fumar|sexo|desnud*|pene|vagina|matar|mató|asesin*|sangre|guerra|terror|casino|tarjeta de crédito|comprar|pagar|dinero|de dónde vienen los bebés"),
    de: L("pistole|gewehr|waffe|waffen|bombe|bomben|messer|droge|drogen|alkohol|bier|wein|betrunken|zigarette*|rauchen|sex|nackt|penis|vagina|töten|getötet|mord|morden|mörder|blut|krieg|horror|kasino|kreditkarte|kaufen|bezahlen|geld|woher kommen die babys"),
    zh: L("枪|武器|炸弹|毒品|喝酒|啤酒|白酒|香烟|抽烟|做爱|性交|色情|裸体|脱光|杀人|杀死|流血|战争|恐怖片|赌博|信用卡|买东西|付钱|宝宝从哪里来")
  };
  // English words that are innocent in another site language (German "war" = was, "dick" = thick,
  // French "retard" = late).
  const FALSE_FRIENDS = { de: ['dick', 'war', 'kind', 'gift'], fr: ['retard'], es: ['retard'], zh: [] };

  // ---------- normalising ----------
  const CJK = /[㐀-鿿豈-﫿]/;
  // Lower case, no accents (é → e, ß → ss, ñ → ny so "año" ≠ "ano"), punctuation → spaces.
  function norm(s) {
    return String(s || '').toLowerCase().replace(/ñ/g, 'ny').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^\p{L}\p{N}*]+/gu, ' ').replace(/\s+/g, ' ').trim();
  }
  // Extra pass for swear words written in disguise: f*ck, sh1t, fuuuck, f u c k.
  const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i' };
  function leet(s) {
    return String(s || '').toLowerCase().replace(/ñ/g, 'ny').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[013457@$!]/g, c => LEET[c]);
  }
  const collapse = w => w.replace(/(.)\1+/g, '$1');
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // One compiled matcher per (list, language). A phrase is matched as whole words.
  const cache = {};
  function matcher(name, list, lang) {
    const key = name + ':' + lang;
    if (cache[key]) return cache[key];
    const skip = FALSE_FRIENDS[lang] || [];
    const own = list[lang] || [];
    const en = lang === 'en' ? [] : (list.en || []).filter(w => !skip.includes(w.replace(/\*$/, '')));
    const all = own.concat(en);
    const cjk = all.filter(p => CJK.test(p));
    const res = all.filter(p => !CJK.test(p)).map(p => {
      const prefix = p.endsWith('*'), n = norm(p.replace(/\*$/, ''));
      return { n, re: new RegExp('(^| )' + escRe(n) + (prefix ? '\\p{L}*' : '') + '(?= |$)', 'u'), prefix };
    });
    return (cache[key] = { cjk, res });
  }
  function find(name, list, text, lang) {
    const m = matcher(name, list, lang), n = norm(text);
    for (const p of m.cjk) if (text.includes(p)) return p;
    for (const p of m.res) if (p.re.test(n)) return p.n;
    return null;
  }

  // Swear words: whole words, prefixes, repeated letters, look-alike digits and f*ck-style stars.
  function findRude(text, lang) {
    const hit = find('rude', RUDE, text, lang);
    if (hit) return hit;
    const words = matcher('rude', RUDE, lang).res.filter(p => !p.n.includes(' '));
    const same = (tok, star) => {
      const plain = tok.replace(/\*/g, ''), col = collapse(plain);
      for (const p of words) {
        const w = p.n, solid = collapse(w) === w; // "fuuuck" → fuck, but never "tant pis" → piss
        if (plain === w || (p.prefix && plain.startsWith(w))) return w;
        if (solid && w.length >= 4 && (col === w || (p.prefix && col.startsWith(w)))) return w;
        if (star && tok.length === w.length && new RegExp('^' + tok.split('*').map(escRe).join('.') + '$').test(w)) return w;
      }
      return null;
    };
    const tokens = leet(text).split(/[^\p{L}*]+/u).filter(Boolean);
    for (const tok of tokens) { const w = same(tok, tok.includes('*')); if (w) return w; }
    // Spelled out letter by letter ("f u c k", "s.h.i.t").
    let run = '';
    for (const tok of tokens.concat([''])) {
      if (tok.length === 1) { run += tok; continue; }
      if (run.length >= 3) { const w = same(run, false); if (w) return w; }
      run = '';
    }
    return null;
  }

  // Phone numbers, e-mail addresses and web links.
  const EMAIL = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
  const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|co|uk|fr|es|de|cn|io|app|tv|gg)\b)/i;
  // 7+ digits with at least one block of 3 (so counting "1 2 3 4 5 6 7" or "1000000" is fine).
  function looksLikePhone(text) {
    const runs = String(text).match(/\+?\d[\d\s().-]{5,}\d/g) || [];
    return runs.some(r => { const d = r.replace(/\D/g, ''); return d.length >= 7 && /\d{3}/.test(r) && !/^\d0+$/.test(d); });
  }


  // ---------- worry rules (en, fr, es) ----------
  // Word groups used in the rules as {NAME}. A group may use other groups.
  const APPS = "roblox|minecraft|fortnite|tiktok|youtube|whatsapp|discord|snapchat|snap|instagram|insta|facebook|messenger|telegram|zoom|facetime|skype|twitch|among us|xbox|playstation|ps4|ps5|psn|nintendo|kik|omegle|wechat|brawl stars|clash royale|free fire|gacha|animal jam|pokemon go|call of duty|gta|steam|reddit|twitter|pinterest|likee|yubo|wizz|signal|viber|bereal";
  const MACROS = {
    en: {
      APP: APPS,
      STRX: "man|men|guy|guys|lady|ladies|woman|women|grown up|grown ups|adult|adults|stranger|strangers|someone|somebody|some person|a person|this person|that person|people|teenager|teen|older boy|big boy|older boys|big boys|older girl|old man|mister",
      STR: "{STRX}|neighbour|neighbor|coach|teacher|babysitter",
      FAM: "uncle|cousin|step dad|stepdad|step father|stepfather|mum's boyfriend|mom's boyfriend|mummy's boyfriend|mommy's boyfriend|mum's friend|mom's friend|dad's friend|family friend|big brother|older brother|step brother|stepbrother",
      KIN: "grandad|grandpa|granddad|grandfather|grandma|granny|grandmother|nan|nana|nanny|auntie|aunty|aunt",
      PAR: "mum|mom|mummy|mommy|mam|mama|mother|dad|daddy|father|papa|parents",
      PRO: "he|she|they",
      ADULT: "{STR}|{FAM}",
      ANYONE: "anyone|anybody|nobody|no one|my mum|my mom|my mummy|my mommy|my dad|my daddy|my parents|mum|mom|dad|mummy|mommy|daddy|your mum|your mom|your dad|your parents|my teacher|your teacher|a grown up|grown ups|my family|the police|police|people|anything|a word|about it|about this|about him|about her|about us|what happened|what he did|what she did",
      ONL: "online|on line|internet|on the computer|on the ipad|on my ipad|on the tablet|on my tablet|on my phone|on the phone|in a game|in the game|in my game|on a game|on the game|on an app|on the app|in the chat|on the chat|on chat|video game|video games|{APP}",
      ASK: "ask|asks|asked|asking|keeps asking|kept asking|keep asking|want|wants|wanted|told me to|tells me to|tell me to|said to|says to|begged|begs|beg|made me|makes me|dared me|dares me|try to get me to|tried to get me to|wants me to|want me to|wanted me to|needs|said send|says send|told me|tells me",
      ITEM: "photo|photos|picture|pictures|pic|pics|selfie|selfies|number|phone number|phone|mobile|address|where i live|school|password|passwords|email|real name|last name|surname|location|video|videos|face|body|age",
      ITEMX: "photo|photos|picture|pictures|pic|pics|selfie|selfies|number|phone number|address|where i live|password|email|real name|surname|location|video|videos|body|nudes",
      ITEMSEND: "photo|photos|picture|pictures|pic|pics|selfie|selfies|video|videos|number|phone number|address|password|school|where i live|location|nudes|nude",
      STRONL: "man|men|guy|grown up|grown ups|adult|adults|stranger|strangers|lady|woman|old man|teenager|older boy|older girl|person i do not know|someone i do not know|somebody i do not know|people i do not know|boy i do not know|girl i do not know|someone i only know|people i have never met|someone i have never met|someone i never met",
      CLOTH: "clothes|clothing|pants|knickers|underwear|undies|underpants|boxers|top|shirt|t shirt|tshirt|trousers|shorts|skirt|dress|pyjamas|pajamas|pjs|nappy|diaper|bra|vest|swimsuit|costume|jumper",
      BODY: "private parts|private part|privates|private|willy|willie|penis|vagina|bum|bottom|butt|boobs|chest|breasts|nipples|pee pee|wee wee|winkie|front bottom|down there|between my legs|crotch|genitals|body|pants|knickers|underwear|bits",
      PRIV: "private parts|private part|privates|willy|willie|penis|vagina|front bottom|pee pee|wee wee|winkie|genitals|crotch|boobs|breasts|nipples",
      REQ: "wants me|want me|wanted me|asked me|asks me|ask me|told me|tells me|tell me|made me|makes me|make me|forced me|forces me|dared me|dares me|tried to|tries to|try to|wants to|wanted to|said to|says to|begged me|keeps asking me",
      GIFT: "gift|gifts|present|presents|sweets|sweet|candy|candies|money|toy|toys|treat|treats|chocolate|chocolates|ice cream|robux|vbucks|v bucks|pocket money|games|sweeties|lollies|reward|rewards|a phone|skins|gems|coins",
      WHO: "{PAR}|{FAM}|{KIN}|brother|sister|he|she|they|someone|somebody|stepmum|step mum|stepmom|step mom|stepmother|step mother|boyfriend|girlfriend",
      VICT: "me|us|my mum|my mom|my mummy|my mommy|mum|mom|mummy|mommy|my dad|my daddy|my brother|my little brother|my baby brother|my big brother|my sister|my little sister|my baby sister|my big sister|the baby|my baby|my brothers|my sisters|my family|my nan|my grandma|my dog|my cat|my pet",
      HITV: "hit|hits|hitting|beat|beats|beating|beat up|beats up|kick|kicks|kicked|kicking|punch|punches|punched|punching|slap|slaps|slapped|slapping|smack|smacks|smacked|smacking|hurt|hurts|hurting|hurted|choke|chokes|choked|choking|strangle*|push|pushes|pushed|shove|shoves|shoved|bite|bites|bit|burn|burns|burned|burnt|attack|attacks|attacked|bash|bashes|bashed|whack|whacks|whacked|batter*|abuse*|shake|shakes|shook|throws things at|threw things at",
      KIDS: "kids|children|boys|girls|classmates|class mates|other kids|older kids|big kids|a boy|a girl|this boy|this girl|some kids|some boys|some girls|my class|people at school|a kid|this kid|the others|older children",
      SCHOOL: "at school|in class|in the playground|on the bus|at break|at lunch|at recess|at playtime|after school|on the way home|on the way to school|in the toilets",
      SECRETOK: "recipe|recipes|club|den|base|hideout|handshake|code|codes|word|words|password|place|garden|room|mission|agent|agents|plan|plans|game|weapon|ingredient|ingredients|santa|map|treasure|language|door|tunnel|fort|camp|song|dance|surprise|potion|lair|cave|box|trick|tricks|passage|level|island|world|spot|sauce|formula|move|moves|power|powers|identity|name|diary|notebook|message|note|stash|hiding place|army|gang|society|team|shop|cookie|cookies|cake|present|gift|santa's",
      SURPRISE: "surprise|surprises|birthday|party|christmas|present for|presents for|gift for|gifts for|card for|mother s day|mothers day|father s day|fathers day|easter|treasure hunt|hide and seek|secret santa|recipe",
      BATH: "bath|bathtime|bath time|shower|bed|bedtime|swim|swimming|pool|doctor|nurse|wash|washing|dirty|wet|pyjamas|pajamas|get dressed|getting dressed|change|changing|nappy|potty|toilet|beach",
      HARD: "{STR}|{FAM}|he|him|his|secret|photo|photos|picture|pictures|video|camera|online|internet|{APP}|touch|touched|touching|touches|kiss|kissed|private|privates",
      GAME: "hide and seek|hide n seek|hiding|magic|magician|trick|game|games|minecraft|roblox|fortnite|my character|level|tag|tig|laughter|laughing|laugh|funny|lol|haha|hahaha|lmao|embarrassed|embarrassing|cringe|joke|joking|pretend|pretending|story|film|movie|cartoon|book|zombie|zombies|monster|monsters|ghost|by accident|accident|accidentally|fell|fall|falling|tripped|slipped|playing|football|bike|scooter|paper|scissors|knee|finger|cooking|park|trampoline|playground|plaster",
      SERIOUS: "really|for real|seriously|not a game|not joking|on purpose|every day|sad|cry|crying|hate|alone|nobody|no one|lonely|always|forever"
    },
    fr: {
      APP: APPS,
      STRX: "monsieur|un homme|homme|un adulte|une adulte|adulte|une dame|une femme|un inconnu|une inconnue|inconnu|inconnue|des inconnus|quelqu'un|une personne|un mec|un gars|un type|un ado|une ado|des gens|les gens|un grand|une grande|le monsieur|la dame|un vieux",
      STR: "{STRX}|des hommes|adultes|dame|femme|inconnus|mec|gars|le voisin|la voisine|voisin|voisine|ado|adolescent|entraineur|l'entraineur|le prof|la prof|prof|le maitre|la maitresse|la nounou|nounou|baby sitter|babysitter",
      FAM: "mon oncle|oncle|tonton|mon cousin|cousin|mon beau pere|beau pere|le copain de maman|le copain de ma mere|le cheri de maman|l'ami de papa|un ami de papa|l'ami de maman|un ami de la famille|mon grand frere|grand frere|demi frere",
      KIN: "papi|papy|pepe|grand pere|mamie|mami|meme|grand mere|tata|tante",
      PAR: "papa|maman|mon pere|ma mere|mes parents|parents|mere|pere",
      PRO: "il|elle|ils|elles",
      ADULT: "{STR}|{FAM}",
      ONL: "sur internet|internet|en ligne|sur le net|le net|sur un jeu|dans un jeu|sur le jeu|dans le jeu|sur la tablette|sur ma tablette|sur le telephone|sur mon telephone|sur le portable|sur mon portable|sur l'ordi|sur l'ordinateur|sur le chat|sur une appli|sur l'appli|dans l'appli|par message|par messages|en message|en messages|un jeu en ligne|jeu video|jeux video|{APP}",
      ASK: "demande|demandent|demandait|veut|voulait|veulent|voudrait|exige|reclame|insiste|dit d'envoyer|dit de lui envoyer|envoie moi|envoyer|lui envoyer|d'envoyer|veut voir|voulait voir|veut que je lui envoie|veut que j'envoie",
      ITEM: "photo|photos|selfie|selfies|numero|numero de telephone|telephone|portable|adresse|ecole|mot de passe|video|videos|nom de famille|ou j'habite|mon corps|mon visage|mon age|age",
      ITEMX: "photo|photos|selfie|selfies|numero|numero de telephone|adresse|mot de passe|video|videos|nom de famille|ou j'habite|mon corps",
      ITEMSEND: "photo|photos|selfie|video|videos|numero|numero de telephone|adresse|mot de passe|ecole|nom de famille",
      STRONL: "un homme|des hommes|un monsieur|un adulte|des adultes|un inconnu|une inconnue|des inconnus|un grand|une grande|une dame|une femme|un mec|un gars|un type|un ado|un vieux|quelqu'un que je connais pas|quelqu'un que je ne connais pas|des gens que je connais pas|des gens que je ne connais pas|une personne que je connais pas|une personne que je ne connais pas|quelqu'un que j'ai jamais vu",
      CLOTH: "habits|vetements|culotte|culottes|slip|pantalon|t shirt|tee shirt|teeshirt|tshirt|haut|robe|pyjama|sous vetements|calecon|jupe|maillot|short",
      BODY: "parties intimes|partie intime|parties privees|zizi|zezette|nenette|foufoune|sexe|fesses|derriere|zigounette|kiki|quequette|poitrine|seins|corps|entre les jambes|culotte|slip",
      PRIV: "parties intimes|partie intime|parties privees|zizi|zezette|nenette|foufoune|sexe|zigounette|quequette|kiki|seins",
      REQ: "veut|voulait|veulent|demande|demandait|dit|disait|oblige|force|essaye|essaie|essaye de|propose",
      GIFT: "cadeau|cadeaux|bonbons|bonbon|argent|sous|jouets|jouet|robux|v bucks|vbucks|gemmes|pieces|chocolat|chocolats|glace|sucreries|skins|recompense|telephone",
      WHO: "{PAR}|{FAM}|{KIN}|mon frere|ma soeur|frere|soeur|il|elle|ils|quelqu'un|ma belle mere|belle mere|son copain|son amoureux",
      VICT: "maman|papa|ma mere|mon pere|mon frere|ma soeur|mon petit frere|ma petite soeur|mon grand frere|ma grande soeur|le bebe|bebe|nous|mes freres|mes soeurs|tout le monde|ma maman|mon papa|mon chien|mon chat|ma famille|ma mamie|mamie",
      HITV: "frappe|frappent|frappait|a frappe|tape|tapent|tapait|a tape|bat|battent|battait|a battu|cogne|cognent|gifle|giflent|a gifle|tabasse|tabassent|fait mal a|font mal a|fait du mal a|donne des coups a|donne des claques a|etrangle|maltraite|maltraitent|brutalise",
      KIDS: "les enfants|des enfants|les autres|les grands|des grands|les garcons|des garcons|les filles|des filles|un garcon|une fille|un grand|une grande|ils|elles|mes camarades|ceux de ma classe|ma classe|les cm2|un enfant|des eleves|les eleves|un eleve",
      SCHOOL: "a l'ecole|en classe|dans la cour|a la recre|a la recreation|dans le bus|a la cantine|au college|a la sortie|aux toilettes",
      SECRETOK: "recette|club|cabane|code|mot|mot de passe|base|plan|jeu|mission|langage|passage|tresor|repaire|cachette|chanson|danse|surprise|potion|boite|tour|ingredient|ingredients|carte|ile|monde|endroit|pouvoir|identite|nom|journal|carnet|message|gateau|cadeau|equipe|bande|armee|agent|agents",
      SURPRISE: "surprise|surprises|anniversaire|fete|noel|cadeau pour|cadeaux pour|carte pour|fete des meres|fete des peres|paques|chasse au tresor|cache cache|recette",
      BATH: "bain|douche|lit|coucher|piscine|nager|medecin|docteur|infirmiere|laver|sale|mouille|pyjama|habiller|m'habiller|changer|me changer|couche|pot|toilettes|plage",
      HARD: "{STR}|{FAM}|il|lui|son|sa|ses|secret|photo|photos|video|camera|internet|en ligne|{APP}|touche|touchait|bisou|bisous|embrasse|intime|intimes",
      GAME: "cache cache|se cacher|cacher|magie|magicien|tour de magie|jeu|jeux|minecraft|roblox|fortnite|mon personnage|niveau|loup|chat perche|rire|de rire|mort de rire|morte de rire|mdr|ptdr|lol|haha|hihi|marrant|drole|blague|honte|la honte|pour de faux|pour de rire|histoire|film|dessin anime|livre|zombie|zombies|monstre|monstres|fantome|par accident|accident|sans faire expres|pas fait expres|tombe|tombant|tomber|glisse|velo|trottinette|papier|ciseaux|genou|doigt|parc|trampoline|pansement",
      SERIOUS: "vraiment|pour de vrai|serieux|serieusement|pas un jeu|pas une blague|expres|tous les jours|triste|pleure|pleurer|deteste|seul|seule|personne|toujours"
    },
    es: {
      APP: APPS,
      STRX: "un senor|senor|el senor|un hombre|hombre|un adulto|una adulta|una senora|una mujer|un desconocido|una desconocida|desconocido|desconocida|desconocidos|un extrano|una extrana|extrano|alguien|una persona|un chico mayor|un tipo|un viejo|gente|la gente|un muchacho|una muchacha",
      STR: "{STRX}|adulto|adultos|senora|mujer|extranos|el vecino|la vecina|un vecino|vecino|vecina|el profe|la profe|el profesor|la profesora|el entrenador|la ninera|ninera|la canguro|el canguro",
      FAM: "mi tio|tio|mi primo|primo|mi padrastro|padrastro|el novio de mi mama|el novio de mi madre|el amigo de mi papa|un amigo de mi papa|un amigo de la familia|mi hermano mayor|hermano mayor|hermanastro",
      KIN: "abuelo|abuela|tia|yayo|yaya|abu",
      PAR: "papa|mama|padre|madre|mis padres|padres|papi|mami",
      PRO: "ella|ellos|ellas",
      ADULT: "{STR}|{FAM}",
      ONL: "en internet|internet|en linea|online|en la red|en un juego|en el juego|en la tablet|en la tableta|en mi tablet|en el movil|en mi movil|en el celular|en mi celular|en el ordenador|en la compu|en la computadora|en el chat|en una app|en la app|por mensaje|por mensajes|en un videojuego|videojuego|videojuegos|{APP}",
      ASK: "pide|pidio|pedia|piden|quiere|queria|quieren|quiso|exige|insiste|me dijo que le mande|me dijo que mande|me dice que le mande|me dijo que le envie|me dice que le envie|mandale|mandarle|enviale|enviarle|mandar|enviar|quiere ver|queria ver|quiere que le mande|quiere que le envie|me pidio que le mande|me pidio que le enviara|me pidio que le mandara",
      ITEM: "foto|fotos|selfie|selfis|numero|numero de telefono|telefono|movil|celular|direccion|colegio|escuela|cole|contrasena|video|videos|apellido|donde vivo|mi cara|mi cuerpo|edad|mi edad",
      ITEMX: "foto|fotos|selfie|selfis|numero|numero de telefono|telefono|direccion|contrasena|video|videos|apellido|donde vivo|mi cuerpo",
      ITEMSEND: "foto|fotos|selfie|video|videos|numero|telefono|direccion|contrasena|colegio|apellido",
      STRONL: "un hombre|unos hombres|un senor|un adulto|unos adultos|un desconocido|una desconocida|unos desconocidos|un extrano|una extrana|una senora|una mujer|un chico mayor|una chica mayor|un tipo|un viejo|alguien que no conozco|gente que no conozco|una persona que no conozco|personas que no conozco|alguien que nunca he visto",
      CLOTH: "ropa|bragas|braga|calzoncillos|pantalon|pantalones|camiseta|ropa interior|vestido|pijama|falda|banador|calzones|calzon|sudadera|camisa",
      BODY: "partes intimas|partes privadas|partes|parte intima|pipi|colita|pilila|pito|pene|vagina|culo|pecho|pechos|tetas|cuca|cosita|entrepierna|cuerpo|trasero|pompis|chichi|ahi abajo|parte de abajo",
      PRIV: "partes intimas|partes privadas|parte intima|pipi|colita|pilila|pito|pene|vagina|cuca|cosita|chichi|tetas|pechos|entrepierna|parte de abajo",
      REQ: "quiere|queria|quieren|pide|pidio|dijo|dice|obliga|obligo|intento|intenta|me hizo|hace",
      GIFT: "regalo|regalos|dulces|caramelos|chuches|golosinas|dinero|juguetes|juguete|robux|pavos|v bucks|vbucks|gemas|monedas|skins|chocolate|chocolates|helado|premio|premios|movil|celular",
      WHO: "{PAR}|{FAM}|{KIN}|mi hermano|mi hermana|hermano|hermana|ella|ellos|alguien|mi madrastra|madrastra|su novio",
      VICT: "a mi mama|a mi papa|a mi madre|a mi padre|a mi hermano|a mi hermana|a mi hermanito|a mi hermanita|al bebe|a nosotros|a mis hermanos|a mis hermanas|a mi abuela|a mi perro|a mi gato|a mama|a papa|mi mama|mi papa|mi madre|mi padre|mi hermano|mi hermana|me",
      HITV: "pega|pegan|pego|pegaba|pegaban|golpea|golpean|golpeo|golpeaba|da golpes|da bofetadas|da cachetadas|da patadas|da punetazos|abofetea|patea|patean|maltrata|maltratan|hace dano|hacen dano|hizo dano|lastima|lastiman|ahorca|estrangula|quema|zarandea",
      KIDS: "los ninos|unos ninos|los nenes|los chicos|unos chicos|las chicas|unas chicas|las ninas|unas ninas|un nino|una nina|un chico|una chica|mis companeros|mis companeras|los de mi clase|los mayores|los grandes|los otros|otros ninos|ellos|ellas",
      SCHOOL: "en el cole|en el colegio|en la escuela|en clase|en el recreo|en el patio|en el autobus|en el comedor|a la salida|en los banos",
      SECRETOK: "receta|club|escondite|codigo|contrasena|base|plan|juego|mision|idioma|tesoro|pasadizo|guarida|cueva|cancion|baile|sorpresa|pocion|caja|truco|trucos|ingrediente|ingredientes|mapa|isla|mundo|lugar|sitio|poder|identidad|nombre|diario|mensaje|pastel|tarta|regalo|equipo|banda|agente|agentes|refugio|cabana",
      SURPRISE: "sorpresa|sorpresas|cumpleanos|cumple|fiesta|navidad|regalo para|regalos para|tarjeta para|dia de la madre|dia del padre|pascua|reyes|busqueda del tesoro|escondite|receta|amigo invisible",
      BATH: "bano|banarme|banera|ducha|ducharme|cama|dormir|piscina|nadar|medico|doctor|enfermera|lavar|lavarme|sucia|sucio|mojada|mojado|pijama|vestirme|cambiarme|panal|orinal|playa",
      HARD: "{STR}|{FAM}|el|secreto|foto|fotos|video|camara|internet|en linea|{APP}|toca|toco|tocaba|beso|besa|intimas|partes",
      GAME: "escondite|al escondite|esconderme|magia|mago|truco|truco de magia|juego|juegos|jugando|minecraft|roblox|fortnite|mi personaje|nivel|pilla pilla|risa|de risa|me muero de risa|jaja|jajaja|jeje|lol|xd|gracioso|graciosa|broma|bromeando|verguenza|que verguenza|de mentira|cuento|historia|pelicula|dibujos|libro|zombi|zombie|zombis|monstruo|monstruos|fantasma|sin querer|por accidente|accidente|me cai|caerme|me tropece|resbale|bici|bicicleta|patinete|papel|tijeras|rodilla|dedo|parque|cama elastica|tirita",
      SERIOUS: "de verdad|en serio|no es un juego|no es broma|a proposito|todos los dias|triste|lloro|llorando|odio|solo|sola|nadie|siempre"
    }
  };

  // Category → [reply key br_s_<reply>, alert level]. Checked in this order; the first match wins.
  const CATS = {
    selfharm: ['selfharm', 'danger'], selfharm2: ['selfharm', 'danger'], grooming: ['grooming', 'danger'],
    bully: ['bully', 'danger'], home: ['home', 'danger'], online: ['online', 'danger'], worry: ['danger', 'danger'],
    meanKids: ['bully', 'feelings'], checkin: ['checkin', 'feelings']
  };
  const SHOWN = { selfharm2: 'selfharm', meanKids: 'bully' };   // the category name returned for these

  const RULES = {
    en: {
      selfharm: [
        "kill myself|killing myself|end my life|end it all|take my own life|suicide|suicidal|kms|unalive|unalive myself|self harm|selfharm",
        "(want|wanna|going|try|trying|tried|will|should|feel like|plan|planning|thinking about|think about|thought about|wish i could) ~2 (kill|hurt|harm|cut|stab|hit|punch|burn|starve|strangle|scratch) (myself|my self)",
        "i (really|just)? (hate|h8|hated) (my life|myself|my self|me|being me|my body|living|being alive|everything about me|who i am)",
        "my life (is|s) ~1 (bad|horrible|terrible|awful|rubbish|pointless|over|sad|the worst|a mess|ruined|not worth)",
        "(nobody|no one|no body) (loves|love|cares about|care about|cares for|wants|needs|would miss|will miss) me",
        "(everyone|everybody|my family|my parents|my mum|my mom|my dad|the whole world) (hates|hate|does not love|do not love|does not want|do not want) me",
        "(better off|happier|better) without me|no reason to live|no point (in)? (living|being alive)|nothing to live for|i do not want to (live|be alive|be here anymore|be here any more|exist|wake up)|i should not (be alive|exist)|i am a (mistake|waste)|i am worthless|i want everything to stop"
      ],
      selfharm2: [
        "(want|wanna|going|wish|would like|like|ready) ~2 (to)? (die|be dead|disappear|vanish|not exist|stop existing|not be here|not be alive|not live|not be born|go away forever|sleep forever|go to sleep forever|never wake up|not wake up|be gone forever|leave forever|be invisible forever)",
        "(i want|i wanna|want|wanna) (to)? (die|disappear|be dead|kill myself|stop living|stop being alive)",
        "wish i (was|were|had) ~1 (dead|never born|not born|gone|not alive|not here|never been born|died)",
        "hurt myself|cut myself|harm myself|hurting myself|cutting myself|harming myself|hurt my self|cut my self",
        "(want|wanna|going|will|plan|planning|try|trying|think about|thinking about|thought about|i am|gonna|might) ~2 (to)? (run away|running away|runaway|leave home|leave my home|leave my house|leave my family) !(from (the|a|that|this|those|these|him|her|them|it|zombies|monsters|zombie|monster))",
        "(run|running|ran) away from (home|my home|my house|my family|my mum|my mom|my dad|my parents)"
      ],
      grooming: [
        "(it is|is|be|keep it|keep this|keep that|this is|that is|it will be|it was|it s) our (little|special|own|big|private)? secret !({SECRETOK})",
        "our (little|special|private) secret !({SECRETOK})",
        "secret (between|with) (me and him|him and me|me and her|her and me|me and the man|me and my uncle)",
        "({ADULT}|{PRO}|{KIN}|{PAR}) ~4 (said|says|say|told|tells|tell|asked|asks|ask|wants|want|wanted|made|makes|make|forced|forces|needs|need|warned) ~3 (keep|kept|keeping) ~3 secret !({SECRETOK})",
        "(told|tells|tell|said|says|say|asked|asks|made|makes|wants|want|wanted|warned|forced|forces|threatened) ~3 (not|never|nobody|no one) (to)? (tell|say|talk|speak) ~2 ({ANYONE})",
        "(not allowed|i can not|i must not|i must never|i promised|promised|i have to promise|swear|swore) ~2 (to)? (not)? (tell|say) ~2 ({ANYONE})",
        "({GIFT}) ~6 (if|so|when|because|as long as|for) ~3 (i|me)? (keep|kept|stay|staying|be|do not|never|not|say|tell|keeping) ~3 (quiet|secret|a secret|tell|telling|say anything|nothing|anything|shh|shush|our secret|it quiet)",
        "(keep|kept|keeping|stay|staying) (quiet|it quiet|a secret|it a secret|it secret|the secret|our secret) ~6 ({GIFT})",
        "(have|has|got|share|shares|sharing|keep|keeps|keeping) (a|some|our|the)? (secret|secrets) with (a|an|my|this|that|the)? ({ADULT}|him)",
        "({ADULT}) ~3 (has|have|got|shares|share|keeps|keep|plays|play|played) (a|our|some)? (secret|secrets) ~2 (with me|game|games)",
        "(secret|secrets) (game|games) ~4 ({ADULT}|{PRO}|him|her)",
        "({ADULT}|{PRO}) ~4 (secret|secrets) (game|games)",
        "({STR}) ~6 (come|go|going|coming|came|went|visit|sleep|stay|get|got|getting|climb|hop|ride|follow) ~2 (to|over to|round to|into|in|inside|at|over at|back to) (his|her|their) (house|home|flat|apartment|place|car|van|truck|bedroom|tent|garage|shed|caravan)",
        "({STR}) ~6 (get|got|getting|climb|hop|come|go) (in|into|inside) (a|the) (car|van|truck)",
        "({STR}) ~4 (offered|offers|offer|promised|promises|wanted to give|wants to give|tried to give) (me|us)? ~2 ({GIFT}|a lift|a ride|a puppy|a kitten)",
        "({STR}|{FAM}) ~4 (comes|come|came|coming|gets|get|got|getting|climbs|climb|climbed|sleeps|sleep|slept|lies|lie|lay|lays|goes|go|went|crawls|creeps|sneaks) ~2 (in|into|inside|under) (my|the) (bed|beds|bath|bathtub|shower|covers|duvet|blanket|sleeping bag)",
        "({STR}|{FAM}) ~3 (bath|baths|bathe|bathes|shower|showers|showered|bathed) with me",
        "(watch|watches|watched|watching|look at|looks at|looked at|looking at|film|films|filmed|filming|take pictures of|takes pictures of|took pictures of|take photos of|takes photos of|took photos of|photographs|spy on|spies on|spied on|peek at|peeks at) me ~3 (bath|shower|change|changing|undress|undressing|get dressed|getting dressed|toilet|loo|pants|underwear|knickers|naked|pyjamas|pajamas|without clothes|with no clothes|sleep|sleeping)",
        "({REQ}) ~4 (take|took|taking|takes|get|pull|pulled|pulls|remove|removed|removes|lift|lifted|lifts|undo|unzip|unzipped|show|showed|shows) ~3 ({CLOTH})",
        "({STR}|{FAM}|{PRO}) ~3 (took|takes|take|pulled|pulls|pull|removed|removes|lifted|lifts) (off)? (my) ({CLOTH}) (off|down|up)",
        "(undress|undressed|undressing|undresses|naked|nude|no clothes|without clothes|without my clothes|nothing on|in my underwear|in my pants|in my knickers) ~3 (for him|for her|for them|in front of|photo|photos|picture|pictures|pic|pics|video|videos|selfie|on camera|webcam|camera|on facetime)",
        "({REQ}|see|saw|sees|seen|watch|watched|watches|look at|looked at|looks at) ~3 (me|my body)? (naked|nude|undressed|undress|with no clothes|without clothes|without my clothes|in my underwear|in my pants|in my knickers)",
        "undress me|undressed me|undresses me|undressing me",
        "({REQ}|{STR}|{FAM}) ~5 (show|showed|shows|see|seen) ~3 (my|him my|her my|them my) (body|{PRIV}|bum|chest) ~3 (camera|video|photo|picture|pic|facetime|webcam|online|secret|naked)?",
        "(send|sent|sending|share|shared|want|wants|asked for|asks for) ~2 (nudes|nude pics|nude photos|naked pics|naked photos|naked pictures|nude pictures)",
        "(touch|touches|touched|touching|tickle|tickles|tickled|rub|rubs|rubbed|rubbing|felt|grab|grabs|grabbed|stroke|strokes|stroked|lick|licks|licked) ~2 (my|me on my|me in my|me under my|me on the|me in the|me down) ({BODY}|under my clothes|under my pants|under my knickers)",
        "(touch|touches|touched|touching) me",
        "({REQ}|forced me|forces me) ~2 (to)? (touch|rub|kiss|see|look at|hold|lick|suck) (his|her|their) ({BODY})",
        "({REQ}|forced me|forces me) ~2 (to)? (touch|rub|lick|suck) (him|her|them) (there|down there)",
        "(my|his|her|their|your|a man s|someone s|the man s|mans) ({PRIV})",
        "(show|shows|showed|showing|shown|send|sends|sent|sending) ~3 (his|her|their) ({BODY})",
        "(show|shows|showed|showing|shown|send|sends|sent|sending|watch|watched|watching|look at|looked at|looking at|see|saw|seen) ~3 (rude|naked|nude|dirty|grown up|adult|sexy|private|yucky|disgusting|naughty|inappropriate) (pictures|photos|videos|pics|movies|films|picture|photo|video|clips|stuff|things|pic|images|image)",
        "(pictures|photos|videos|picture|photo|video|pics|pic|movie|movies) of (naked|nude|undressed)",
        "(pictures|photos|videos|picture|photo|video|pics|pic) of (people|ladies|men|women|grown ups|someone|him|her|girls|boys|kids|children) (with no|without) clothes",
        "({STR}|{FAM}) ~4 (sit|sat|sits|sitting) on (his|her) (lap|knee|knees)",
        "({STR}) ~3 (kiss|kissed|kisses|kissing) (me|my)",
        "({FAM}|{PRO}|{KIN}) ~3 (kiss|kissed|kisses|kissing) me ~2 (on the lips|on my lips|on the mouth|with tongue|with his tongue|with her tongue|in secret|secretly)"
      ],
      bully: [
        "bully|bullies|bullied|bullying|bulys|bullys|cyberbully*|cyber bully*|cyber bullying",
        "({KIDS}|{SCHOOL}) ~6 (hit|hits|hitting|kick|kicks|kicked|kicking|punch|punched|punches|push|pushes|pushed|shove|shoved|shoves|beat|beats|beat up|beats up|trip|tripped|trips|spit|spat|spits|threaten|threatened|threatens|hurt|hurts|steal|stole|steals|throw|threw|throws|pull my hair|pulled my hair|pulls my hair|scratch|scratched|bite|bit|bites|choke|choked|take|took|takes) ~2 (me|my)",
        "(hit|hits|hitting|kick|kicks|kicked|punch|punched|punches|push|pushes|pushed|beat me up|beats me up|threaten|threatened|threatens|steal|stole|steals|trip|tripped|bite|bit) ~2 (me|my) ~6 ({SCHOOL})",
        "(send|sends|sent|post|posts|posted|write|writes|wrote|say|says|said|share|shares|shared|spread|spreads) ~3 (mean|nasty|horrible|rude|unkind|bad|cruel|hurtful) (messages|message|comments|comment|texts|text|things about me|stuff about me|lies about me|rumours|rumors|pictures of me|photos of me|videos of me)",
        "(threaten|threatened|threatens|threatening) me",
        "(said|says|say|going to|gonna|will) ~2 (beat me up|hurt me|get me|kill me) ~4 (school|after school|tomorrow|at break|outside)",
        "(wait|waiting|waited) for me after school"
      ],
      home: [
        ["({WHO}) ~3 ({HITV}) ({VICT})", "at (chess|cards|a game|the game|racing|football|uno|monopoly|tennis|running|the race|mario|fortnite|minecraft|draughts|checkers|snap|ludo|scrabble)"],
        "({WHO}) ~3 ({HITV}) (her|him|them) ($|again|every|all|a lot|badly|really|hard|so|when|and|because|with|at night|in front)",
        "(hit|hits|hitting|beat|beats|beating|beat up|beats up|kick|kicks|kicking|kicked|punch|punches|punched|punching|slap|slaps|slapped|smack|smacks|smacked|choke|chokes|choked|strangle*|whack|whacks|whacked) me",
        ["(hurt|hurts|hurting|hurted) me", "(my|the|it) (tummy|belly|head|tooth|teeth|knee|leg|legs|arm|foot|feet|finger|ear|ears|throat|back|hand|eye|eyes|ankle|elbow|nose|mouth|skin|shoes|shoe|toe|toes|plaster|scratch|cut|graze|bruise)|it hurts me"],
        "(scared|afraid|frightened|terrified|worried|nervous) (to be|to go|of going|of being|being|to stay|staying|when i am|when i go|to sleep)? (at)? home",
        "(scared|afraid|frightened|terrified) (in|at|of being in|of being at|to be in|to go in) (my|the|our) (house|home|flat)",
        "(scared|afraid|frightened|terrified) of (my|my mum s|my mom s|my dad s) ({PAR}|{FAM}|{KIN}|stepmum|step mum|stepmom|step mom|brother|sister|family|babysitter|parents|boyfriend|girlfriend)",
        "(not safe|unsafe|never safe|do not feel safe|never feel safe|is not safe) ~3 (at home|home|in my house|in my home|with my|with him|with her|with them|around him|around her)",
        "(no|not any|not enough|there is no|there s no|we have no|we do not have|we have not got|never any|never enough) (food|dinner|breakfast|lunch|anything to eat|food to eat) ~3 (at home|in the house|in my house|for days|all day|again|ever|because|since|for me)",
        "(nobody|no one) (feeds|feed|gives me food|cooks for me|makes me food)",
        "(never|do not|does not|did not|will not|forget to|forgets to|forgot to|refuse to|refuses to) (feed|feeds) me",
        "(never|do not|does not|did not|will not) (give|gives) me (food|anything to eat|dinner|breakfast|lunch)",
        "(never|do not|does not|did not|will not) (let|lets) me eat !(sweets|candy|chocolate|crisps|junk|ice cream|dessert|pudding|cake|biscuits|cookies|in|on|before|after|upstairs|there|that|this|it|too|so|more|another)",
        "(have not|did not|have not had|did not have|could not|can not|not) (eaten|eat|had food|had anything to eat|have food|have anything to eat|had dinner|had breakfast|had lunch) ~3 (for days|all day|since yesterday|for two days|in days|for a long time|for ages)",
        "(always|so|really|very) hungry ~4 (no food|nothing to eat|do not feed|nobody feeds|never feed|not allowed to eat)",
        "(locked|locks|lock|locking) me (in|out|up)|locked me|locks me"
      ],
      online: [
        "{ONL} ~8 ({ASK}) ~6 ({ITEM})",
        "({ASK}) ~4 ({ITEM}) ~8 {ONL}",
        "({STRX}) ~5 ({ASK}) ~4 ({ITEMX})",
        "{ONL} ~8 (asked|asks|asking|wants to know|wanted to know|keeps asking) ~2 (how old i am|my age|if i am a girl|if i am a boy|where i live|what i look like)",
        "(asked|asks|asking|ask|wants to know|want to know|wanted to know|keeps asking|kept asking|asked me|asks me) ~2 (where i live|where my house is|what my address is|my address|where i go to school|what school i go to|which school i go to|what school|which school|if i am alone|if i am home alone|if i am on my own|if my parents are|where my parents are|if my mum is|if my mom is|if my dad is|what i look like|what i am wearing|my real name|for my address|how to find me|where i am)",
        "(talk|talks|talking|talked|chat|chats|chatting|chatted|play|plays|playing|played|message|messages|messaging|messaged|text|texts|texting|texted|speak|speaks|speaking|spoke|video call|video calling|facetime|facetiming|call|calls|calling|called) ~3 ({STRONL}) ~6 ({ONL})",
        "({ONL}) ~6 (talk|talks|talking|talked|chat|chats|chatting|chatted|play|plays|playing|played|message|messages|messaging|messaged|text|texts|texting|texted|speak|speaks|speaking|spoke) ~3 ({STRONL})",
        "({STRONL}) ~3 ({ONL}) ~4 (talks|talked|messages|messaged|texts|texted|chats|chatted|wants|asked|asks|keeps|added|follows|followed|sent|sends|said|says|is|told|tells|calls|called)",
        "({STRONL}) ~6 (messaged|messages|texted|texts|added|adds|friend requested|sent me|sends me|keeps messaging|keeps texting|is messaging|is texting)",
        "(play|playing|played|plays|chat|chatting|talk|talking) ({APP}|online|games|a game|video games) with (a|an|this|some|that)? ({STRONL})",
        "i (sent|send|gave|give|shared|share|showed|show|posted|post|told|tell) (him|her|them|it|someone|somebody|a man|the man|a stranger|the stranger) ~2 ({ITEMSEND})",
        "i (sent|send|gave|give|shared|share|showed|show|posted|post|told|tell) ~3 ({ITEMSEND}) ~6 ({ONL}|someone|somebody|a man|the man|a stranger|stranger|grown up|people i do not know|a person)",
        "({STRX}|{PRO}|{ONL}) ~6 ({ASK}) ~3 (video chat|video call|videochat|videocall|facetime|face time|go on camera|turn on my camera|turn on the camera|put my camera on|turn my camera on|go live|livestream|live stream|webcam|talk on camera|show my face|see my face|see me on camera)",
        "(video chat|video call|videochat|videocall|facetime|webcam|on camera|live stream|livestream) ~3 (with)? (a|an|this|some|that)? ({STRONL})",
        "({ONL}) ~8 (meet|meet up|meeting|see me in real life|see me for real|in real life|irl|come to my house|come over|visit me|come and see me|pick me up)",
        "(meet me|meet up|see me in real life|come to my house) ~6 ({ONL})",
        "(robux|vbucks|v bucks|free robux|free vbucks|gems|coins|skins|skin|gift card|gift cards|diamonds|items|pets|money) ~6 (if|for|so|when|in return|in exchange|to) ~4 (photo|photos|picture|pictures|pic|pics|selfie|number|address|meet|video|password|secret|send|show|tell|call)",
        "({STRX}|{PRO}|{ONL}|{FAM}) ~4 (asked|asks|wants|told|tells|said|says) ~3 (delete|hide|clear) ~3 (the|our|my|his|her|all the|these|those)? (chat|chats|messages|message|texts|conversation|photos|pictures)",
        "({STRX}|{PRO}|{ONL}) ~6 (sent|sends|send|showed|shows|show) me ~3 (weird|strange|scary|creepy|horrible|nasty) (pictures|photos|pics|videos|messages|picture|photo|video|links|link|stuff|things)",
        ["(send|sending|sent) (me|you|him|her|them)? (a|some|any|my)? (picture|pictures|photo|photos|selfie|selfies|pic|pics)", "(of|a picture of|a photo of) (a|an|the|some|cats|dogs|animals|space|planets|dinosaurs|flowers)|(mum|mom|dad|mummy|mommy|daddy|grandma|nan|grandad|teacher|school|birthday|holiday)"],
        ["(photos|pictures|pics|videos) of me", "(mum|mom|dad|mummy|mommy|daddy|grandma|nan|grandad|granny|teacher|school|beach|holiday|birthday|party|baby|when i was|wedding|my family)"]
      ],
      worry: [
        "abuse*|abusing|kidnap*",
        "(keep a secret|keep secrets|keep it secret|keep it a secret) from (my|your) ~1 ({PAR}|teacher|family)|secret from my (mum|mom|dad|parents|teacher|mummy|mommy|daddy)",
        "do not tell (my|your) ({PAR}|teacher|family|nan|grandma)|do not tell (anyone|anybody|no one)",
        "a stranger|strangers",
        "meet me|meet up|asked to meet|wants to meet|want to meet me",
        "kill me",
        "(i am|i feel|we are) (not safe|unsafe)|(i do not|i never|we do not) feel safe",
        "({STR}) ~4 (followed|follows|following|follow|grabbed|grabs|grab|tried to take|wants to take|try to take|chased|chases) me"
      ],
      meanKids: [
        "({KIDS}|they|everyone|everybody|people|someone|somebody|my friends|my friend|my best friend|friends|he|she|the others|others|my classmates) ~4 (is|are|was|were|keep|keeps|kept|always|being|been|get|gets|getting) ~2 (mean|nasty|horrible|unkind|rude|cruel|not nice|not kind) (to|with|about|towards) me",
        "(laugh|laughs|laughed|laughing|make fun|makes fun|made fun|making fun|pick on|picks on|picked on|picking on|gang up on|ganged up on|gangs up on|stare at|stared at|point at|pointed at) (at|of|on)? me",
        "(tease|teases|teased|teasing|leave me out|leaves me out|left me out|leaving me out|ignore me|ignores me|ignored me|ignoring me|exclude me|excludes me|excluded me)",
        "(call|calls|called|calling) me (names|ugly|fat|stupid|dumb|an idiot|idiot|a baby|baby|weird|a loser|loser|smelly|horrible names|bad names|mean names|nasty names|rude names|a freak|freak|a nerd|nerd|disgusting|four eyes)",
        "(say|says|said|saying|tell|tells|told|telling) (me)? (i am|that i am) (ugly|fat|stupid|dumb|weird|smelly|a loser|a baby|disgusting|useless|horrible|a freak|nobody|worthless)",
        "(nobody|no one|none of the kids|no kids) (plays|play|wants to play|will play|likes|like|sits|wants to sit|will sit|talks|wants to talk|wants to be friends|will be friends) ~2 me",
        "i (have|got) no friends|i do not have (any)? friends|i have not got (any)? friends|(nobody|no one) wants to be my friend|i have no one to play with|i am always (alone|on my own) at school"
      ],
      checkin: [
        "(can|could|will|would) you keep (a|my|this|our)? secret !({SECRETOK})",
        "i (have|got) (a|a big|a little|a special|a bad|a scary|some) secret !({SECRETOK})",
        "secret (between|with) (us|you and me|me and you|us two)",
        "(i am|we are) (all)? (home alone|alone at home|alone in the house|on my own at home|by myself at home|all alone at home|alone all night|alone every day|alone at night|alone all day)",
        "(left|leave|leaves|leaving) me (home)? alone ~3 (at home|all day|all night|every day|for hours|for days|at night)",
        ["({PRO}) ~5 (come|go|going|get|got|climb|visit|sleep|stay) ~2 (to|over to|round to|into|in|inside|at) (his|her|their) (house|home|flat|car|van|place)", "play|playing|sleepover|sleep over|party|birthday|playdate|play date|tea|dinner|homework|lego|game|games|friend|friends"],
        ["({PAR}|{PRO}|{KIN}) ~4 (comes|come|came|gets|get|got|climbs|climb|climbed|sleeps|sleep|slept|lies|lie|lay) ~2 (in|into|inside|under) (my) (bed|bath|shower|covers|duvet)", "nightmare|nightmares|bad dream|scared|storm|thunder|cuddle|cuddles|story|stories|poorly|sick|ill|cold"],
        "({PRO}|my friend|a friend|a boy|a girl|friend|someone at school|a kid) ~4 (wants|asked|asks|want|wanted|keeps asking) ~3 (my|for my) (number|phone number|address|photo|picture|selfie|password)",
        "(friend|friends|someone|people|a boy|a girl|boy|girl) (i|we) (met|know|only know|play with|talk to|chat to|chat with) ~2 ({ONL})|online friend|online friends|internet friend|internet friends",
        "({PAR}) ~2 (shout|shouts|shouting|yell|yells|yelling|scream|screams|screaming|fight|fights|fighting|argue|argues|arguing|shouted|yelled|screamed|fought|argued) ~3 (at each other|all the time|every day|every night|a lot|at me|so much|really loud|again)",
        "(mum and dad|mom and dad|my parents) (fight|fights|fighting|argue|arguing|shout|scream|screaming)",
        "(nobody|no one) (listens to|believes|believe|listen to) me",
        ["i do not want to go home", "park|fun|play|playing|party|more|stay|zoo|beach|holiday|game|friend|friends|nan|grandma|cinema"],
        ["something bad happened|something happened to me|i have something to tell|i need to tell someone|i am scared of (him|her|them)|i feel scared of (him|her|them)", "game|story|film|book|movie|joke|dream|nightmare"]
      ]
    },
    fr: {
      selfharm: [
        "me tuer|me suicider|suicide|suicidaire|en finir|mettre fin a ma vie|me jeter par la fenetre|sauter par la fenetre|me tailler les veines",
        "(je)? (deteste|hais) (ma vie|moi meme|ma propre vie|mon corps|etre moi|vivre)|je me (deteste|hais)",
        "ma vie (est|c'est) ~1 (nulle|horrible|pourrie|triste|finie|un enfer|naze|nul)",
        "personne (ne)? (m'aime|veut de moi|s'occupe de moi|tient a moi) !(bien)",
        "(tout le monde|toute ma famille|mes parents|ma famille|maman|papa) ~1 (me deteste|me hait|me haissent|me detestent|m'aime pas|veut pas de moi)",
        "je (sers a rien|ne sers a rien|vaux rien|ne vaux rien|suis une erreur|devrais pas exister|ne devrais pas exister|merite pas de vivre|ne merite pas de vivre)",
        "(seraient|serait) ~1 (mieux|plus heureux|plus heureuse|plus heureuses) sans moi|(plus|pas|aucune) (envie|raison) de vivre|envie de plus vivre"
      ],
      selfharm2: [
        "envie de mourir|veux mourir|voudrais mourir|aimerais mourir|(aimerais|voudrais|veux) etre (mort|morte)|(voudrais|aimerais) ne jamais etre (ne|nee)|aurais prefere ne (pas|jamais) naitre",
        "(veux|veut|voudrais|aimerais|envie de|vais) ~2 (disparaitre|plus exister|ne plus exister|plus etre la|ne plus etre la|plus vivre|ne plus vivre|partir pour toujours|m'en aller pour toujours|dormir pour toujours|jamais me reveiller|ne jamais me reveiller|plus me reveiller|m'endormir pour toujours)",
        "me faire du mal|me couper|me blesser|me griffer|me scarifier",
        "(me suis enfui|me suis enfuie|ai fugue|me suis sauve|me suis sauvee|suis parti|suis partie) (de la maison|de chez moi)",
        "fuguer|faire une fugue|(veux|vais|voudrais|envie de|aimerais) ~2 (m'enfuir|partir de la maison|quitter la maison|m'echapper|me sauver|fuir|m'enfuir de la maison|partir de chez moi) !(du|de la|des|d'un|d'une|devant)"
      ],
      grooming: [
        "(c'est|ce sera|c'etait|ca reste|que c'est) notre (petit|grand)? secret !({SECRETOK})",
        "notre petit secret !({SECRETOK})|secret entre (lui et moi|elle et moi|moi et lui|moi et elle)",
        "({ADULT}|{PRO}|{KIN}|{PAR}) ~4 (dit|dis|demande|veut|voulait|oblige|force|interdit) ~4 (garder|garde) ~2 (le|un|ce|notre|son)? secret !({SECRETOK})",
        "garder le secret",
        "(dit|demande|interdit|oblige|force|defendu|interdiction|promis|promettre|jure|jurer|veut) ~3 (de)? (ne)? rien (dire|raconter|repeter)",
        "(dit|demande|interdit|oblige|defendu|promis|promettre|jure|jurer|veut) ~3 (de)? (ne)? (pas|jamais) (le|en|lui|leur)? (dire|raconter|parler|repeter) ~2 (a personne|a maman|a papa|a mes parents|a ma mere|a mon pere|a la maitresse|a ma maitresse|a personne d'autre)",
        "(dit|demande|interdit|oblige|defendu|promis|promettre|jure|jurer|veut) ~3 (de)? (ne)? (pas|jamais) (le|en) (dire|parler|raconter)",
        "({GIFT}) ~6 (si|pour que|pour pas que|a condition que|contre|en echange) ~3 (je)? (ne)? (dis|dise|rien|pas|garde|tais|taise|me taise|me tais|taire|secret|raconte)",
        "({STR}) ~6 (venir|aller|viens|vienne|venu|monter|monte|rentrer|entrer|suivre|dormir) ~2 (chez lui|chez elle|chez eux|dans sa voiture|dans sa maison|dans son camion|dans sa camionnette|a sa maison|dans son appartement|dans sa chambre|dans la voiture|dans une voiture)",
        "({STR}) ~4 (propose|offert|offre|promis|promet|voulait donner|veut donner|veut me donner|m'a offert|m'offre|m'a promis) ~3 ({GIFT}|un tour en voiture|de m'emmener|de me ramener|un chiot|un chaton)",
        "({STR}|{FAM}) ~4 (vient|viens|venu|venait|viennent|rentre|entre|se met|se mettait|se couche|se couchait|dort|dormait|monte|grimpe|se glisse) ~2 (dans|sous) (mon|ma|le|la) (lit|bain|baignoire|douche|couette|couverture|draps)",
        "({STR}|{FAM}) ~3 (prend|prenait|prends) ~2 (le bain|la douche|son bain|sa douche) avec moi",
        "(me regarde|me regardait|me filme|me photographie|m'espionne|me prend en photo|me prenait en photo|me regardent) ~4 (bain|douche|change|habille|deshabille|toilettes|culotte|slip|tout nu|toute nue|nu|nue|pyjama|dors|sous la douche)",
        "({REQ}) ~5 (enlever|enleve|retirer|retire|oter|ote|baisser|baisse|soulever|souleve|montrer|montre|deshabiller|deshabille) ~3 ({CLOTH})",
        "({STR}|{FAM}|{PRO}) ~3 (a enleve|enleve|a baisse|baisse|a retire|retire|a souleve|souleve|a ote|ote) ~2 (ma|mon|mes) ({CLOTH})",
        "(tout nu|toute nue|tous nus|deshabille|deshabillee|en culotte|en slip|sans habits|sans vetements|sans culotte) ~4 (photo|photos|video|videos|camera|selfie|devant lui|devant elle|devant eux|pour lui|pour elle|webcam|facetime|en appel)",
        "({REQ}|voir|vu|voit|regarder|regarde) ~3 (moi|me)? (tout nu|toute nue|nu|nue|deshabille|deshabillee|en culotte|en slip|sans habits|sans vetements)",
        "me deshabiller|m'a deshabille|m'a deshabillee|me deshabille|deshabille moi|me deshabillait",
        "m'a touche|m'a touchee|me touche|me touchent|me touchait|mes parties intimes",
        "(touche|touchait|touchent|a touche|caresse|caressait|caressent|a caresse|tripote|tripotait|tripotent|chatouille) ~3 (mes|ma|mon|les|la|le|sous ma|sous mon|sous mes) ({BODY})",
        "({REQ}|oblige|force) ~3 (de)? (toucher|touche|caresser|embrasser|regarder|voir|lecher) ~2 (son|sa|ses|leur) ({BODY})",
        "(son|sa|ses|mon|ma|mes|leur|leurs|tes) ({PRIV})",
        "(montre|montrait|montrent|m'a montre|me montre|fait voir|m'a fait voir|envoie|m'envoie|m'a envoye|regarder|regarde|vu|voir) ~5 (photos|photo|videos|video|images|image|films|film) ~3 (nus|nues|nu|nue|tout nus|cochonnes|cochonne|degoutantes|degoutante|pour adultes|pour les grands|pas pour les enfants|interdites|sexe)",
        "(montre|montrait|m'a montre|me montre|m'a fait voir|me fait voir) ~2 (son|sa|ses) ({BODY})",
        "({STR}|{FAM}) ~3 (bisou|bisous|m'embrasse|m'a embrasse|embrasser|bisou sur la bouche|bisous sur la bouche)",
        "({STR}|{FAM}) ~4 (assis|assise|asseoir|m'asseoir|m'assois|s'asseoir) sur ses (genoux|cuisses)"
      ],
      bully: [
        "harcele*|harcelement|me harcelent|cyberharcelement|cyber harcelement|on se moque de moi|se moquent de moi|se moque de moi|racket|rackette|rackettent|me rackettent",
        "({KIDS}|{SCHOOL}) ~6 (me frappent|me frappe|me tapent|me tape|me poussent|me pousse|me battent|me bat|me donnent des coups|me donne des coups|me font tomber|me fait tomber|me crachent|me crache|me menacent|me menace|me volent|me vole|me tirent les cheveux|me tire les cheveux|me font mal|me fait mal|m'ont frappe|m'a frappe|m'ont tape|m'a tape)",
        "(me frappent|me tapent|me poussent|me menacent|me rackettent|me volent|me battent) ~6 ({SCHOOL})",
        "(envoient|envoie|ecrivent|ecrit|postent|disent|mettent) ~3 (des)? (messages|commentaires|trucs|choses|photos|videos) (mechants|mechantes|mechant|mechante|horribles|pas gentils|pas gentilles|mechancetes)",
        "(veulent|veut|vont|va) ~2 (me frapper|me taper|me casser la figure|me tabasser|m'attendre a la sortie)|m'attendent a la sortie|me menacent|me menace"
      ],
      home: [
        ["({WHO}) ~3 ({HITV}) ({VICT})", "aux cartes|au jeu|a la course|aux echecs|au foot|aux dames|a un jeu|au uno|au memory|a la bataille|au ping pong|au tennis|a mario|a fortnite|au loup|a minecraft"],
        "({WHO}) ~3 (le|la|les|lui) (frappe|frappent|bat|battent|cogne|gifle|tabasse|frappait|battait)",
        ["me frappe|me frappent|m'a frappe|me frappait|me tape|me tapent|m'a tape|me tapait|me bat|me battent|m'a battu|me battait|me cogne|me gifle|me giflent|m'a gifle|me tabasse|me donne des coups|me donne des claques|m'etrangle|me secoue|me brule|me maltraite|me maltraitent", "sur les nerfs|sur le systeme"],
        ["me fait mal|me font mal|me fait du mal|m'a fait mal|me faisait mal", "(ma|mon|mes|la|le|les) (dent|dents|ventre|tete|genou|genoux|jambe|jambes|bras|pied|pieds|doigt|doigts|oreille|oreilles|gorge|dos|main|mains|oeil|yeux|cheville|coude|ongle|nez|bouche|peau|bidou|chaussure|chaussures)|ca me fait mal"],
        "(peur|tres peur|trop peur) (a la maison|chez moi|de rentrer|de rentrer a la maison|de rentrer chez moi|d'etre a la maison|d'etre chez moi|quand papa|quand maman|quand il rentre|quand il boit|de papa|de maman|de mon pere|de ma mere|de mon beau pere|de ma belle mere|de mon oncle|de mon frere|de mes parents)",
        "(pas|jamais) en securite ~3 (a la maison|chez moi|avec papa|avec maman|avec lui|avec elle)",
        "(pas|rien|jamais|plus) (de|a)? (manger|nourriture|repas|diner|dejeuner) ~3 (a la maison|chez moi|depuis|pour moi)",
        "(personne|on) ne me donne (pas|rien|jamais)? (a manger|de manger|a diner)",
        "(on|ils|maman|papa|personne) ~2 (me donne|me donnent) (pas|jamais|rien) a manger",
        "(pas|rien) mange depuis ~2 (jours|hier|deux jours|longtemps)",
        "toujours faim ~4 (rien a manger|pas de nourriture|on ne me donne)",
        "m'enferme|m'enferment|m'a enferme|m'a enfermee|m'enfermait"
      ],
      online: [
        "{ONL} ~8 ({ASK}) ~4 ({ITEM})",
        "({ASK}) ~4 ({ITEM}) ~8 {ONL}",
        "({STRX}) ~5 ({ASK}) ~4 ({ITEMX})",
        "(demande|demandait|veut savoir|voulait savoir|veulent savoir|me demandent) ~3 (ou j'habite|ou je vis|mon adresse|ou est ma maison|a quelle ecole|dans quelle ecole|quelle ecole|mon ecole|si je suis seul|si je suis seule|si je suis tout seul|si je suis toute seule|si mes parents|ou sont mes parents|si ma mere|si mon pere|si maman|si papa|a quoi je ressemble|comment je suis habille|mon vrai nom|mon nom de famille|ou me trouver)",
        "(parle|parlais|discute|discutais|chatte|chattais|tchatte|joue|jouais|ecris|ecrit|ecrivais|envoie des messages|appelle|appel video|facetime) ~3 (avec|a)? ({STRONL}) ~6 ({ONL})",
        "({ONL}) ~6 (parle|parlais|discute|discutais|chatte|tchatte|joue|jouais|ecris|ecrivais) ~3 (avec|a)? ({STRONL})",
        "({STRONL}) ~3 ({ONL}) ~4 (me parle|m'ecrit|m'envoie|me demande|veut|m'a demande|m'a ajoute|me suit|m'a envoye|me dit|m'a dit|m'appelle|m'a ecrit|est)",
        "({STRONL}) ~4 (m'ecrit|m'a ecrit|m'envoie des messages|m'a envoye des messages|m'a ajoute|m'ajoute|me parle tout le temps|m'envoie|m'a demande en ami)",
        "(joue|jouais|jouer) (a)? ({APP}|des jeux en ligne|en ligne) avec (un|une|des)? ({STRONL})",
        "(je lui ai|je leur ai|je lui|je leur) (envoye|donne|montre|dit|envoie|dis) ~2 ({ITEMSEND})",
        "(j'ai) (envoye|donne|montre|dit|partage) ~3 ({ITEMSEND}) ~6 ({ONL}|un monsieur|un inconnu|une inconnue|quelqu'un|un homme|une dame|des gens|un grand)",
        "({STRX}|{PRO}|{ONL}) ~6 ({ASK}) ~3 (appel video|appel en video|facetime|camera|webcam|visio|en visio|allumer la camera|allumer ma camera|en direct|en live|montrer mon visage|voir mon visage)",
        "(appel video|appel en video|facetime|webcam|visio|en visio|camera) ~3 (avec)? ({STRONL})",
        "({ONL}) ~8 (me rencontrer|rencontrer|se rencontrer|se voir|me voir|se voir en vrai|en vrai|venir chez moi|venir me chercher|me retrouver|se retrouver|rendez vous|rdv)",
        "(robux|v bucks|vbucks|gemmes|pieces|skins|skin|carte cadeau|diamants|argent|cadeau|cadeaux) ~6 (si|contre|pour|en echange) ~4 (photo|photos|selfie|numero|adresse|rencontrer|video|mot de passe|secret|envoie|envoyer|montre|montrer)",
        "({STRX}|{PRO}|{ONL}|{FAM}) ~4 (demande|dit|veut) ~3 (d'effacer|effacer|de supprimer|supprimer|cacher|de cacher) ~3 (les|nos|mes|ses|la|notre)? (messages|message|conversation|conversations|photos|discussion)",
        ["envoyer des photos|envoyer une photo|photos de moi|photo de moi", "(maman|papa|mamie|papi|vacances|plage|anniversaire|bebe|quand j'etais|ecole|classe|famille|d'un|d'une|de chat|de chien)"]
      ],
      worry: [
        "un inconnu|une inconnue|des inconnus|un etranger|une etrangere",
        "me rencontrer|se voir en vrai",
        "(dis|le dis|dites) (pas|rien) (a ma mere|a mon pere|a mes parents|a maman|a papa|a la maitresse)|(dis|dire|raconte|raconter|le dire|en parler|parle|parler) (rien)? a personne|personne ne doit (savoir|le savoir)",
        "(je ne suis pas|je suis pas|pas) en securite",
        "kidnapp*|abus|abuse de moi|maltraite*",
        "({STR}) ~4 (m'a suivi|m'a suivie|me suit|me suivait|m'a attrape|m'a attrapee|a voulu m'emmener|veut m'emmener|m'a pris|me poursuit)"
      ],
      meanKids: [
        "({KIDS}|tout le monde|les copains|mes copains|mes copines|ma copine|mon copain|mes amis|mon ami|ma meilleure amie|mon meilleur ami|il|elle) ~4 (sont|est|etaient|etait|sont toujours|est toujours) ~2 (mechants|mechantes|mechant|mechante|pas gentils|pas gentilles|pas gentil|pas gentille|nuls|nulles|durs|horribles) (avec moi|envers moi|a moi|pour moi)",
        "(rient|rigolent|rit|rigole|riaient|rigolaient|se marrent) (de moi|sur moi)",
        "m'insultent|m'insulte|m'insultaient|me traitent|me traite|me traitaient",
        "(m'appellent|m'appelle|me disent que je suis|me dit que je suis|disent que je suis) (nul|nulle|bebe|un bebe|moche|gros|grosse|bete|idiot|idiote|debile|nuls|gogol|bizarre|un nul|une nulle|laid|laide|stupide)",
        "m'embetent|m'embete|m'excluent|m'exclut|m'ignorent|m'ignore|me laissent de cote|me laisse de cote|me mettent a l'ecart|me met a l'ecart|m'evitent",
        "personne (ne)? (veut)? (joue|jouer) avec moi|personne (ne)? veut etre (mon|ma) (ami|amie|copain|copine)|personne (ne)? m'aime bien",
        "(je n'ai|j'ai) (pas|plus|aucun|aucune) (d'amis|amis|copains|copines|ami|copain|d'ami|de copains|de copines)|je suis toujours (tout seul|toute seule) a l'ecole"
      ],
      checkin: [
        "(tu peux|peux tu|tu sais) garder (un|mon|ce)? secret !({SECRETOK})",
        "j'ai (un|un gros|un grand|un petit) secret !({SECRETOK})",
        "secret entre (nous|nous deux|toi et moi|moi et toi)",
        "(je suis|on est) (tout seul|toute seule|seul|seule) (a la maison|chez moi|toute la nuit|toute la journee|tous les soirs|la nuit)",
        "(me laisse|me laissent|m'a laisse|m'ont laisse) (tout seul|toute seule|seul|seule) ~3 (a la maison|chez moi|toute la nuit|toute la journee|tous les jours|des heures|la nuit)",
        ["({PAR}|{PRO}|{KIN}) ~4 (vient|viens|venu|venait|se met|se couche|dort|dormait) ~2 (dans|sous) (mon|ma) (lit|bain|douche|couette)", "cauchemar|cauchemars|mauvais reve|peur|orage|tonnerre|calin|calins|histoire|malade|froid"],
        "(il|elle|mon copain|ma copine|un ami|une amie|un garcon|une fille) ~4 (veut|demande|voulait) ~3 (mon|ma) (numero|adresse|photo|mot de passe)",
        "(ami|amie|amis|quelqu'un) (que j'ai rencontre|que je connais) ~2 ({ONL})|ami en ligne|amie en ligne|amis en ligne|ami sur internet",
        "({PAR}) ~3 (crient|crie|hurlent|hurle|se disputent|se dispute|se battent|criaient|se disputaient) ~3 (tout le temps|tous les jours|tous les soirs|beaucoup|sur moi|tres fort|encore)",
        "(maman et papa|papa et maman|mes parents) (se disputent|crient|se battent|se crient dessus)",
        "personne (ne)? (m'ecoute|me croit)",
        ["je (ne)? veux pas rentrer (a la maison|chez moi)", "parc|amuse|jouer|fete|zoo|plage|vacances|jeu|copain|copine|mamie|papi|cinema"],
        ["il s'est passe quelque chose de grave|il m'est arrive quelque chose|j'ai quelque chose a dire|j'ai peur de (lui|elle|eux)", "jeu|histoire|film|livre|blague|reve|cauchemar"]
      ]
    },
    es: {
      selfharm: [
        "matarme|suicidarme|suicidio|suicida|quitarme la vida|acabar con mi vida|acabar con todo|tirarme por la ventana|saltar por la ventana",
        "(odio|detesto) (mi vida|vivir|ser yo|mi cuerpo|a mi mismo|a mi misma)|me odio|me detesto",
        "mi vida (es|esta) ~1 (horrible|terrible|un asco|una mierda|fatal|triste|acabada|lo peor|un desastre)",
        "nadie me (quiere|ama|necesita)|a nadie le importo|nadie se preocupa por mi",
        "(todos|todo el mundo|mi familia|mis padres|mi mama|mi papa) (me odian|me odia|no me quieren|no me quiere)",
        "(estarian|estaria) ~1 mejor sin mi|no sirvo para nada|no valgo nada|soy un error|no deberia (existir|estar vivo|estar viva)|no quiero (vivir|seguir viviendo|estar vivo|estar viva)|no tengo (razones|motivos) para vivir"
      ],
      selfharm2: [
        "quiero morir|quiero morirme|me quiero morir|quisiera morir|quisiera morirme|me gustaria morir|me gustaria morirme|ojala estuviera (muerto|muerta)|ojala no hubiera nacido|quiero estar (muerto|muerta)",
        "(quiero|quisiera|me gustaria|tengo ganas de|me quiero|voy a) ~2 (desaparecer|no existir|no estar aqui|dejar de existir|no vivir|irme para siempre|no despertar|no despertarme|dormir para siempre)",
        ["hacerme dano|cortarme|me corte|lastimarme|herirme", "(el|mi) (pelo|flequillo|cabello)|las unas|el pelo"],
        "(me escape|me fugue|me fui|me escapo|me escapé) de (casa|mi casa)",
        "escapar de casa|escaparme de casa|huir de casa|irme de casa|fugarme|(quiero|voy a|me quiero|quisiera|me voy a) ~2 (escapar|escaparme|huir|marcharme de casa|irme de mi casa) !(del|de la|de los|de las|de el|de un|de una)"
      ],
      grooming: [
        "(es|sera|era|que es) nuestro (pequeno|gran)? secreto !({SECRETOK})",
        "nuestro pequeno secreto !({SECRETOK})|secreto entre (el y yo|ella y yo|yo y el|yo y ella)",
        "({ADULT}|{PRO}|{KIN}|{PAR}) ~4 (dijo|dice|dicen|pidio|pide|quiere|queria|obliga|obligo|hizo|hace) ~4 (guardar|guarde|guardara|guardes|mantener|mantenga) ~2 (el|un|este|nuestro|su)? secreto !({SECRETOK})",
        "guardar el secreto",
        "(dijo|dice|dicen|pidio|pide|obliga|obligo|prohibio|prohibe|amenazo|amenaza) ~3 (que)? (no)? (se lo|le|lo)? (diga|dijera|digas|cuente|contara|cuentes|contar|decir|hable|hablara) ~2 (nada|a nadie|a mi mama|a mi papa|a mis padres|a mama|a papa|a mi madre|a mi padre|a la profe|a mi profe)",
        "(prometi|prometer|prometo|jure|jurar|juro|no puedo|no debo|no me dejan) ~3 (no)? (decir|contar|decirlo|contarlo|decirselo|contarselo) ~2 (nada|a nadie|a mi mama|a mi papa|a mis padres)",
        "({GIFT}) ~6 (si|para que|a cambio|por) ~3 (no)? (digo|diga|cuente|cuento|callo|calle|me callo|me calle|guardo|guarde|secreto|nada|me quedo callado|me quedo callada)",
        "({STR}) ~6 (ir|vaya|fuera|fuese|venga|vengas|venir|subir|suba|subiera|subirme|entrar|entre|dormir|acompanar|acompane|acompanara|irme) ~2 (a su casa|a su coche|a su carro|en su coche|en su carro|a su furgoneta|en su furgoneta|con el a|con ella a|a casa de el|a su piso|a su cuarto|a su habitacion|al coche|al carro|en el coche|en el carro)",
        "({STR}) ~4 (ofrecio|ofrece|me ofrecio|me ofrece|prometio|me prometio|quiso darme|queria darme|quiere darme) ~3 ({GIFT}|llevarme|un paseo en coche|un perrito|un gatito)",
        "({STR}|{FAM}) ~4 (viene|vino|venia|vienen|se mete|se metio|se metia|entra|entro|entraba|duerme|dormia|se acuesta|se acostaba|sube) ~2 (a|en|dentro de) (mi|la) (cama|banera|ducha|sabanas|manta)",
        "({STR}|{FAM}) ~3 (se bana|se banaba|se ducha|se duchaba|se mete en la ducha|se mete en la banera) conmigo",
        "(me mira|me miraba|me miran|me graba|me grababa|me hace fotos|me hacia fotos|me saca fotos|me espia|me espiaba) ~4 (bano|banera|ducha|cambio|cambiando|desvisto|desnudo|desnuda|vistiendo|me visto|aseo|pijama|ropa interior|sin ropa|duermo|durmiendo)",
        "(quite|quitar|quitarme|quito|quitara|quitase|quitate|quitarte|quitarse|quita|desvestir|desvestirme|desvistiera|desvista|desvisto) ~3 ({CLOTH})",
        "(desnudarme|desnudate|desnudarte|me desnude|me desnudara|me desnudo|desnudo|desnuda|desnudos|sin ropa|en ropa interior|en bragas|en calzoncillos) ~4 (foto|fotos|video|videos|camara|selfie|delante de el|delante de ella|delante de ellos|para el|para ella|webcam|videollamada)",
        "({REQ}|ver|vio|ve|verme|mirarme|mira) ~3 (me)? (desnudo|desnuda|sin ropa|en ropa interior|en bragas|en calzoncillos)",
        "me desnuda|me desviste|me desvistio",
        "(viene|vino|venia|entra|entro|entraba|se mete|se metio) ~4 (cuarto|habitacion|cama|bano|ducha) ~6 (me toca|me toco|me tocaba|me acaricia|me acariciaba)",
        "(por la noche|en la cama|a escondidas|en secreto|cuando duermo|cuando estoy dormido|cuando estoy dormida) ~4 me (toca|toco|tocaba|acaricia)|me (toca|toco|tocaba|acaricia) ~3 (por la noche|en la cama|a escondidas|en secreto|cuando duermo)",
        "me toca el cuerpo|me toco el cuerpo|me toca donde|me toco donde|me toca mis partes|me toco mis partes|mis partes intimas",
        "(me toca|me toco|me tocaba|me tocan|me tocaron|me acaricia|me acaricio|me acariciaba|me manosea|me manoseo|me soba|me sobo) ~3 ({BODY}|por debajo de la ropa|debajo de la ropa|ahi|donde no|de una forma rara|raro)",
        "({REQ}|me obliga|me obligo) ~3 (tocar|tocarle|tocarlo|acariciar|besar|chupar|ver|mirar) ~2 (su|sus|le|el) ({BODY})",
        "(su|sus|mis|mi) ({PRIV})",
        "(me enseno|me ensena|me mostro|me muestra|me ha ensenado|me ha mostrado) ~2 (su|sus) ({BODY})",
        "(me enseno|me ensena|me mostro|me muestra|me ha ensenado|me ha mostrado|me manda|me mando|me envia|me envio|vi|veo|ver) ~4 (fotos|foto|videos|video|imagenes|imagen|peliculas) ~3 (desnud*|sin ropa|de adultos|para adultos|de mayores|guarras|guarros|cochinas|cochinos|asquerosas|de sexo)",
        "({STR}) ~3 (me beso|me besa|me besaba|besarme|me dio un beso|me da besos|me besaron)",
        "({FAM}|{PRO}|{KIN}) ~3 (me beso|me besa|me besaba|besarme|me dio un beso|me da besos) ~2 (en la boca|en secreto|a escondidas)",
        "({STR}|{FAM}) ~4 (sentarme|me sienta|me sentaba|me sento|me siento) en sus (piernas|rodillas)"
      ],
      bully: [
        "me acosa*|acoso|acosan|acosado|acosada|me molestan|bullying|bulin|bulling|ciberacoso|me hacen bullying|me amenazan|me amenaza|me roban|se burlan de mi|se burla de mi|me quitan (el bocadillo|el almuerzo|la merienda|el dinero)",
        "({KIDS}|{SCHOOL}) ~6 (me pegan|me pega|me empujan|me empuja|me patean|me patea|me golpean|me golpea|me escupen|me escupe|me tiran del pelo|me tira del pelo|me hacen dano|me hace dano|me pegaron|me pego|me empujaron|me tiraron|me tiran)",
        "(me pegan|me empujan|me patean|me golpean|me amenazan|me roban) ~6 ({SCHOOL})",
        "(mandan|manda|escriben|escribe|ponen|pone|dicen|publican|suben) ~3 (mensajes|comentarios|cosas|fotos|videos) (malos|malas|feos|feas|crueles|horribles|ofensivos)",
        "(van a|quieren|me van a|dicen que me van a) ~2 (pegarme|pegar|darme una paliza|golpearme)|me esperan a la salida"
      ],
      home: [
        ["({WHO}) ~3 ({HITV}) ({VICT})", "al balon|a la pelota|al futbol|a las cartas|al ajedrez|en el juego|a la consola|al parchis|a la oca|en la carrera|en mario|en fortnite|a la pinata"],
        ["({WHO}) ~2 (nos|la|le|lo|les) ({HITV})", "balon|pelota|bola|pared|puerta|mesa|pinata|juego|partido|sello|pegatina|pegamento|cromo|cromos|foto|papel|carta"],
        "me pega|me pegan|me pegaba|me pegaban|me golpea|me golpean|me golpeo|me da golpes|me da bofetadas|me da cachetadas|me da patadas|me patea|me abofetea|me maltrata|me maltratan|me ahorca|me estrangula|me quema|me zarandea",
        ["me hace dano|me hacen dano|me hizo dano|me lastima|me lastiman", "(el|la|los|las|mi|mis) (zapato|zapatos|diente|dientes|muela|barriga|tripa|cabeza|rodilla|pierna|brazo|pie|pies|dedo|oreja|garganta|espalda|mano|ojo|ojos|tobillo|codo|nariz|boca|piel)"],
        "tengo miedo (en casa|en mi casa|de volver a casa|de estar en casa|de ir a casa|de mi papa|de mi mama|de mi padre|de mi madre|de mi padrastro|de mi madrastra|de mi tio|de mi hermano|de mis padres|cuando llega mi papa|cuando mi papa bebe|cuando bebe)|miedo de volver a casa",
        "(no estoy a salvo|no me siento seguro|no me siento segura) ~3 (en casa|en mi casa|con mi|con el|con ella)",
        "no hay comida ~2 (en casa|en mi casa|para mi)|no me dan de comer|nadie me da de comer|no me dan comida",
        "no he comido ~3 (desde ayer|en todo el dia|en dias|en dos dias|nada en todo el dia)|no como desde ~2 (ayer|hace dias)|paso hambre|siempre tengo hambre ~4 (no hay comida|no me dan)",
        "me encierra|me encierran|me encerro|me encerraron|me deja (encerrado|encerrada)"
      ],
      online: [
        "{ONL} ~8 ({ASK}) ~4 ({ITEM})",
        "({ASK}) ~4 ({ITEM}) ~8 {ONL}",
        "({STRX}) ~5 ({ASK}) ~4 ({ITEMX})",
        "(me pregunto|me pregunta|me preguntaron|me preguntan|pregunto|pregunta|quiere saber|queria saber|quieren saber) ~2 (donde vivo|mi direccion|en que colegio|a que colegio|a que escuela|a que cole|en que cole|en que escuela|donde esta mi casa|si estoy solo|si estoy sola|si mis padres|donde estan mis padres|si mi mama|si mi papa|como soy|que llevo puesto|mi nombre completo|mi apellido|donde estoy)",
        "(hablo|hablaba|hable|chateo|chateaba|juego|jugaba|jugue|hablamos|escribo|escribia|me escribo|llamo|videollamada) ~3 (con)? ({STRONL}) ~6 ({ONL})",
        "({ONL}) ~6 (hablo|hablaba|chateo|chateaba|juego|jugaba|hablamos|escribo|escribia) ~3 (con)? ({STRONL})",
        "({STRONL}) ~3 ({ONL}) ~4 (me habla|me escribe|me manda|me pide|quiere|me pidio|me agrego|me sigue|me envio|me dice|me dijo|me llama|me escribio|es)",
        "({STRONL}) ~4 (me escribe|me escribio|me manda mensajes|me mando mensajes|me agrego|me agrega|me envia|me mando una solicitud|me habla mucho)",
        "(juego|jugaba|jugamos|jugar) (a)? ({APP}|juegos en linea|en linea|online) con (un|una|unos)? ({STRONL})",
        "(le mande|le envie|le di|le ensene|le dije|les mande|les envie|le mando|le envio|le doy) ~3 ({ITEMSEND})",
        "(mande|envie|di|ensene|dije|comparti) ~3 ({ITEMSEND}) ~6 ({ONL}|a un senor|a un desconocido|a alguien|a un hombre|a una senora|a gente)",
        "({STRX}|{ONL}|ella|ellos) ~6 ({ASK}) ~3 (videollamada|video llamada|hacer una videollamada|camara|encender la camara|poner la camara|webcam|facetime|en directo|un directo|ver mi cara|ensenar mi cara)",
        "(videollamada|video llamada|camara|webcam|facetime) ~3 (con)? ({STRONL})",
        "({ONL}) ~8 (quedar|quedar conmigo|verme|vernos|conocerme|conocernos|en persona|en la vida real|venir a mi casa|venir a buscarme|recogerme|encontrarnos)",
        "(robux|pavos|v bucks|vbucks|gemas|monedas|skins|skin|tarjeta regalo|diamantes|dinero|regalo|regalos) ~6 (si|por|a cambio|para que) ~4 (foto|fotos|selfie|numero|direccion|quedar|video|contrasena|secreto|mando|mande|envio|envie|ensene|ensenar|mandar|enviar)",
        "({STRX}|{ONL}|{FAM}|ella|ellos) ~4 (pide|pidio|dijo|dice|quiere) ~3 (borrar|borre|borrara|esconder|esconda|ocultar|oculte) ~3 (los|las|nuestros|nuestras|mis|sus|el|la)? (mensajes|mensaje|chat|chats|conversacion|conversaciones|fotos)",
        ["mandar fotos|enviar fotos|fotos mias|fotos de mi", "(mama|papa|abuela|abuelo|vacaciones|playa|cumpleanos|bebe|cuando era|colegio|clase|familia|de un|de una|de gatos|de perros)"]
      ],
      worry: [
        "un extrano|una extrana|un desconocido|una desconocida|desconocidos|extranos",
        "verme en persona|quedar conmigo",
        "no le digas a (mi mama|mi papa|mis padres|mi madre|mi padre|la profe)|no (se lo|le|lo) (digas|cuentes) a nadie|nadie (puede|debe) saberlo",
        "no estoy a salvo|no me siento (seguro|segura)",
        "secuestr*|abus*|me maltrat*",
        "({STR}) ~4 (me siguio|me sigue|me seguia|me agarro|me agarra|me cogio|quiso llevarme|quiere llevarme|intento llevarme|me persigue|me perseguia)"
      ],
      meanKids: [
        "({KIDS}|todos|todo el mundo|mis amigos|mis amigas|mi amigo|mi amiga|mi mejor amigo|mi mejor amiga) ~4 (son|es|eran|era|estan|esta|siempre son|estan siendo) ~2 (malos|malas|malo|mala|crueles|cruel|antipaticos|antipaticas|feos|feas|pesados|pesadas) conmigo",
        "(se rien|se reian|se rie|se reia) de mi",
        "me insultan|me insulta|me insultaron|(me llaman|me llama|me dicen|me dice|dicen que soy|dice que soy) (feo|fea|gordo|gorda|tonto|tonta|idiota|nombres|cosas feas|bebe|rara|raro|estupido|estupida|inutil|apestoso|apestosa)",
        "(nadie|ninguno|ninguna|ningun nino) (juega|quiere jugar|quiere estar|se sienta|habla|quiere hablar) conmigo|nadie quiere ser mi (amigo|amiga)",
        "no tengo (amigos|amigas|ningun amigo|ninguna amiga)|me dejan (solo|sola|de lado)|me ignoran|me excluyen|me apartan"
      ],
      checkin: [
        "(puedes|me puedes|sabes) guardar (un|mi|este)? secreto !({SECRETOK})",
        "tengo (un|un gran|un pequeno) secreto !({SECRETOK})",
        "secreto entre (nosotros|tu y yo|yo y tu|los dos)",
        "(estoy|estamos) (solo|sola|solos|solito|solita) (en casa|en mi casa|toda la noche|todo el dia|por la noche)",
        "(me deja|me dejan|me dejo|me dejaron) (solo|sola) ~3 (en casa|toda la noche|todo el dia|todos los dias|muchas horas|por la noche)",
        ["({PAR}|{PRO}|{KIN}) ~4 (viene|vino|venia|se mete|se acuesta|duerme|dormia) ~2 (a|en) (mi) (cama|banera|ducha)", "pesadilla|pesadillas|mal sueno|miedo|tormenta|truenos|abrazo|abrazos|cuento|cuentos|enfermo|enferma|frio"],
        "(ella|mi amigo|mi amiga|un amigo|una amiga|un chico|una chica) ~4 (quiere|pide|pidio|queria) ~3 (mi) (numero|direccion|foto|contrasena)",
        "(amigo|amiga|amigos|alguien) (que conoci|que conozco) ~2 ({ONL})|amigo de internet|amiga de internet|amigos de internet|amigo online|amiga online",
        "({PAR}) ~3 (gritan|grita|se pelean|se pelea|discuten|discute|gritaban|se peleaban) ~3 (todo el rato|todos los dias|todas las noches|mucho|a mi|muy fuerte|otra vez)",
        "(mama y papa|papa y mama|mis padres) (se pelean|gritan|discuten|se gritan)",
        "nadie me (escucha|cree)",
        ["no quiero volver a casa|no quiero ir a casa", "parque|divertido|jugar|fiesta|zoo|playa|vacaciones|juego|amigo|amiga|abuela|abuelo|cine"],
        ["paso algo malo|me paso algo|tengo algo que contar|tengo miedo de (el|ella|ellos)", "juego|cuento|historia|pelicula|libro|broma|sueno|pesadilla"]
      ]
    }
  };

  // Categories that turn into a gentle check-in when the message looks like a game, a joke or an
  // accident (yes) and nothing serious is in it (no).
  const SOFT = {
    en: {
      selfharm2: [{ yes: "{GAME}", no: "{SERIOUS}" }],
      grooming: [{ yes: "{SURPRISE}", no: "{STR}|{FAM}|touch|touched|touching|touches|clothes|naked|nude|bed|bath|private|privates|body|kiss|photo|picture|money|sweets|candy|robux" },
        { yes: "{BATH}", no: "{HARD}" },
        { yes: "tag|tig|game|playing|catch|you are it|hide and seek|football|rugby|high five|it", no: "{BODY}|secret|bed|bath|clothes|naked|{STR}|{FAM}|kiss|there|online" }],
      home: [{ yes: "{GAME}|play fight|play fighting|wrestling|karate|judo|boxing|pillow fight|dodgeball|mosquito|bee|wasp|nettle", no: "every day|every night|all the time|always|scared|cry|crying|bleeding|blood|bruise|bruises|belt|really hurt|when he is angry|when she is angry|drunk|shout|shouts|shouting|nobody|no one|secret" }],
      worry: [{ yes: "{SURPRISE}", no: "{STR}|{FAM}|touch|touched|naked|clothes|bed|bath|private|photo|picture|secret game|online|{APP}" },
        { yes: "({PAR}|{KIN}|teacher|sister|brother) ~3 (will|is going to|going to|is gonna|would|might) kill me", no: "really|for real|knife|gun|hurt|hit|hurts|hits|scared|said he will|said she will" }]
    },
    fr: {
      selfharm2: [{ yes: "{GAME}", no: "{SERIOUS}" }],
      grooming: [{ yes: "{SURPRISE}", no: "{STR}|{FAM}|touche|touchait|habits|vetements|nu|nue|lit|bain|intimes|corps|bisou|photo|argent|bonbons|robux" },
        { yes: "{BATH}", no: "{HARD}" },
        { yes: "chat|chat perche|jeu|en jouant|loup|ballon|foot|epaule|bras|main|tete|cheveux|par accident|pas fait expres|tape m'en cinq", no: "{BODY}|secret|lit|bain|habits|nu|nue|bisou|la ou|internet|nuit|chambre|dors|seul|seule" }],
      home: [{ yes: "{GAME}|bagarre pour rire|catch|karate|judo|boxe|bataille d'oreillers|guepe|abeille|moustique|ortie", no: "tous les jours|tous les soirs|tout le temps|toujours|peur|pleure|pleurer|sang|bleu|bleus|ceinture|tres fort|en colere|boit|bourre|crie|personne|secret" }],
      worry: [{ yes: "{SURPRISE}", no: "{STR}|{FAM}|touche|nu|nue|habits|lit|bain|intimes|photo|internet|{APP}" }]
    },
    es: {
      selfharm2: [{ yes: "{GAME}", no: "{SERIOUS}" }],
      grooming: [{ yes: "{SURPRISE}", no: "{STR}|{FAM}|toca|toco|tocaba|ropa|desnudo|desnuda|cama|bano|intimas|cuerpo|beso|foto|dinero|caramelos|robux" },
        { yes: "{BATH}", no: "{HARD}" }],
      home: [{ yes: "{GAME}|pelea de broma|lucha|karate|judo|boxeo|guerra de almohadas|avispa|abeja|mosquito|ortiga|pupa", no: "todos los dias|todas las noches|todo el rato|siempre|miedo|lloro|llorar|sangre|moraton|moratones|cinturon|muy fuerte|enfadado|enfadada|bebe|borracho|grita|nadie|secreto" }],
      worry: [{ yes: "{SURPRISE}", no: "{STR}|{FAM}|toca|desnudo|desnuda|ropa|cama|bano|intimas|foto|internet|{APP}" }]
    }
  };

  // Innocent phrases taken out before the worry rules run.
  const INNOCENT = {
    en: [
      "stranger things|stranger danger",
      "(never|do not|not|should not|must not|we do not|you should not|you must not|we never|we should not|we must not|i never|i do not|i will not|always say no to) (talk|speak|go|walk|get in a car|take sweets|take sweets from|accept sweets from|take anything from|play) (to|with|from|off)? strangers",
      "(send|show) me (a|some) (picture|pictures|photo|photos) of (a|an|the|some|cats|dogs|animals|dinosaurs|space|planets)"
    ],
    fr: [
      "(ne|n) (parle|parlez|parler|suis|suivez|monte|montez|va|allez|pars) (jamais|pas) (aux|avec les|avec des|avec un|avec une|a un|a une|a des|un|une|des) (inconnus|inconnu|inconnue|etrangers)",
      "(jamais|pas|faut pas|il ne faut pas|interdit de|on doit pas|on ne doit pas) (parler|suivre|monter avec|partir avec|aller avec|accepter des bonbons) ~2 (inconnus|inconnu|inconnue|etrangers)",
      "(envoie moi|montre moi) (une|des) (photo|photos|image|images) (d'un|d'une|de|du|des)"
    ],
    es: [
      "(no|nunca) (hables|hablar|hablo|vayas|ir|subas|subir|aceptes|aceptar|te vayas) ~3 (con)? (extranos|desconocidos|un extrano|un desconocido|una extrana|una desconocida)",
      "(manda|mandame|envia|enviame|ensename) (una|unas)? (foto|fotos) de (un|una|el|la|los|las|unos|unas)"
    ]
  };

  // Personal details written as words (hidden like the others).
  const PRIV_RULES = {
    en: {
      address: ["(my|our) (address|home address|house address|house number|postcode|post code|zip|zip code|zipcode|postal code)", "(i|we) live at number|my house is (number|at number|at|on)"],
      user: ["my (username|user name|gamertag|gamer tag|login|account name|nickname|nick name|handle|screen name) (is|on|for|in)", "my ({APP}) (name|username|user name|account|id|tag|handle|is|channel|code)", "(add me|friend me|follow me|find me|message me|text me) (on|at) ({APP})"],
      school: ["my school (is called|s name|is named|name)|the name of my school|i go to school at"],
      name: ["my (full name|real name|family name)"]
    },
    fr: {
      address: ["(mon|notre) (adresse|code postal|numero de maison)", "j'habite au numero|j'habite (rue|avenue|boulevard|chemin|allee|impasse|place)"],
      user: ["mon (pseudo|identifiant|nom d'utilisateur|gamertag|login)", "mon (pseudo|compte|nom) (sur|de|dans) ({APP})", "(ajoute moi|ajoutez moi|suis moi|ecris moi) (sur|au|a) ({APP})"],
      school: ["mon (ecole|college) (s'appelle|c'est l'ecole|c'est le college)|je vais a l'ecole (de|du)"],
      name: ["mon (nom complet|vrai nom)"]
    },
    es: {
      address: ["(mi|nuestra) (direccion|codigo postal|numero de casa)", "vivo en (la calle|el numero|la avenida|el portal|el piso)"],
      user: ["mi (usuario|nombre de usuario|nick|gamertag|login)", "mi (usuario|cuenta|nombre|nick) (en|de) ({APP})", "(agregame|anademe|sigueme|escribeme) (en|al|a) ({APP})"],
      school: ["mi (colegio|cole|escuela|insti|instituto) (se llama|es el|es la)"],
      name: ["mi (nombre completo|apellidos)"]
    }
  };

  // Common misspellings and contractions (after accents and repeated letters are removed), per language.
  const FIX = {
    en: {
      dont: "do not", doesnt: "does not", didnt: "did not", cant: "can not", cannot: "can not", wont: "will not", isnt: "is not",
      arent: "are not", wasnt: "was not", werent: "were not", havent: "have not", hasnt: "has not", shouldnt: "should not",
      mustnt: "must not", couldnt: "could not", wouldnt: "would not", im: "i am", ive: "i have", its: "it is", thats: "that is",
      whats: "what is", hes: "he is", shes: "she is", theyre: "they are", youre: "you are", wanna: "want to", gonna: "going to",
      gotta: "got to", u: "you", ur: "your", coz: "because", cuz: "because", cos: "because", noone: "no one", noi: "no one", nol: "no one",
      somei: "someone", sumi: "someone", anyi: "anyone", everyi: "everyone", nobdy: "nobody", grownup: "grown up", grownups: "grown ups",
      secrit: "secret", secrat: "secret", sekret: "secret", secert: "secret", scret: "secret", sercet: "secret", seceret: "secret", secrect: "secret", secrits: "secrets",
      privite: "private", privat: "private", privete: "private", pirvate: "private", prvate: "private", privit: "private", privte: "private", privites: "privates",
      clotes: "clothes", cloths: "clothes", clothez: "clothes", clohtes: "clothes", cloes: "clothes", clothse: "clothes", cloze: "clothes",
      roblux: "roblox", robloks: "roblox", roblocks: "roblox", roblx: "roblox", robox: "roblox", rblx: "roblox", roblos: "roblox",
      mincraft: "minecraft", minecraf: "minecraft", maincraft: "minecraft", mindcraft: "minecraft", minecrft: "minecraft",
      fortnight: "fortnite", fornite: "fortnite", fortnit: "fortnite", fortnte: "fortnite",
      youtub: "youtube", yutube: "youtube", utube: "youtube", watsap: "whatsapp", whatsup: "whatsapp", whatap: "whatsapp", snapcht: "snapchat",
      nuber: "number", numbr: "number", numbre: "number", num: "number", fone: "phone", phne: "phone", adress: "address", addy: "address",
      pitcure: "picture", picure: "picture", pictre: "picture", pitchur: "picture", picher: "picture", pikture: "picture", piture: "picture",
      pitcures: "pictures", pictres: "pictures", pichers: "pictures", foto: "photo", fotos: "photos", phot: "photo", selfi: "selfie", vid: "video", vids: "videos",
      strager: "stranger", stanger: "stranger", strnger: "stranger", strangr: "stranger", stranjer: "stranger", stangers: "strangers",
      toutch: "touch", tuch: "touch", tutch: "touch", touchd: "touched", tuched: "touched", toutched: "touched", tuches: "touches",
      uncel: "uncle", unkle: "uncle", unkel: "uncle", bulied: "bullied", bulyed: "bullied", nakid: "naked", neked: "naked", nekid: "naked",
      disapeer: "disappear", disaper: "disappear", myslef: "myself", mysef: "myself", lyf: "life", skol: "school", skul: "school", scol: "school", schol: "school", hous: "house"
    },
    fr: {
      secre: "secret", segret: "secret", secrai: "secret", secrais: "secret", secrait: "secret", secrete: "secret",
      abits: "habits", habit: "habits", vetement: "vetements", vetemants: "vetements", inkonu: "inconnu", anconu: "inconnu",
      disparetre: "disparaitre", disparaite: "disparaitre", dispaitre: "disparaitre", disparete: "disparaitre",
      foto: "photo", fotos: "photos", photot: "photo", numerot: "numero", numro: "numero", tel: "telephone", interner: "internet", intrnet: "internet",
      robloxe: "roblox", tiktoc: "tiktok", partis: "parties", veu: "veux", fesse: "fesses", msieur: "monsieur", ke: "que", ki: "qui", c: "c'est", mai: "m'ai"
    },
    es: {
      secrto: "secreto", sekreto: "secreto", segreto: "secreto", desapareser: "desaparecer", desaparezer: "desaparecer", desapereser: "desaparecer",
      desconosido: "desconocido", desconosida: "desconocida", estrano: "extrano", fotito: "foto", fotitos: "fotos", direcsion: "direccion",
      telefno: "telefono", contrasenia: "contrasena", contrasenya: "contrasena", kiero: "quiero", qiero: "quiero", quero: "quiero",
      kiere: "quiere", qiere: "quiere", ke: "que", q: "que", xq: "porque", pq: "porque", kasa: "casa", nadien: "nadie"
    }
  };
  const JOIN = {
    en: [["tik tok", "tiktok"], ["you tube", "youtube"], ["whats app", "whatsapp"], ["snap chat", "snapchat"], ["mine craft", "minecraft"],
      ["fort nite", "fortnite"], ["face time", "facetime"], ["some one", "someone"], ["some body", "somebody"], ["any one", "anyone"],
      ["my self", "myself"], ["insta gram", "instagram"], ["grown-up", "grown up"]],
    fr: [["tik tok", "tiktok"], ["you tube", "youtube"], ["whats app", "whatsapp"], ["snap chat", "snapchat"], ["mine craft", "minecraft"], ["face time", "facetime"], ["parti intime", "partie intime"]],
    es: [["tik tok", "tiktok"], ["you tube", "youtube"], ["whats app", "whatsapp"], ["snap chat", "snapchat"], ["mine craft", "minecraft"], ["face time", "facetime"]]
  };
  // Misspelled by one letter → the word (only for words of 6+ letters that are not in the rules already).
  const FUZZY = {
    en: L("secret|secrets|private|privates|clothes|roblox|minecraft|fortnite|tiktok|youtube|whatsapp|snapchat|discord|instagram|password|stranger|strangers|touched|touching|undress|disappear|myself|bathroom|bedroom|pictures|picture"),
    fr: L("secret|habits|vetements|disparaitre|inconnu|inconnue|roblox|minecraft|fortnite|tiktok|youtube|snapchat|whatsapp|discord|instagram|intimes|culotte|deshabiller"),
    es: L("secreto|desaparecer|desconocido|desconocida|roblox|minecraft|fortnite|tiktok|youtube|snapchat|whatsapp|discord|instagram|calzoncillos|desnudo|desnuda")
  };
  const FUZZY_SKIP = new Set(L("strange|stronger|stranded|strangle|strangled|secrete|picturs|clothed|clothe|youtuber|youtubers|desnudar|habiter|habite|inconnus"));

  // ---------- normalising for the worry rules ----------
  const LEET1 = { '0': 'o', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '|': 'l' };
  // Lower case, no accents (ñ → n), look-alike digits/signs inside words → letters (one = what "1" becomes).
  function prep(s, one) {
    return String(s || '').toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .split(/\s+/).map(w => /\p{L}/u.test(w) && /[013457@$|!]/.test(w)
        ? w.replace(/[013457@$|]/g, c => c === '1' ? one : LEET1[c]).replace(/!(?=\p{L})/gu, 'i') : w).join(' ');
  }
  // Words with single spaces around them; apostrophes dropped ('') or spaced (' '); repeated letters squeezed.
  const wordsOf = (s, apos) => (' ' + s.replace(/['’‘`´ʼ]/g, apos).replace(/[^\p{L}\p{N}]+/gu, ' ') + ' ')
    .replace(/(\p{L})\1+/gu, '$1').replace(/ +/g, ' ');

  function osa1(a, b) {   // true when a and b differ by one letter (added, missing, changed or swapped)
    if (a === b) return false;
    const la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    let i = 0; while (i < la && i < lb && a[i] === b[i]) i++;
    if (la === lb) return a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
    return la > lb ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
  }

  // Pattern for words written together: repeated letters squeezed, then each letter may repeat ("dontt+ell").
  const loose = src => src.replace(/(\p{L})\1+/gu, '$1').replace(/\\p\{L\}|\\.|(\p{L})/gu, (m, l) => (l ? l + '+' : m));
  const DB = {};   // compiled rules per language and apostrophe style
  function setup(lang, apos) {
    const key = lang + '|' + apos;
    if (DB[key]) return DB[key];
    const db = { lang, apos, map: {}, join: [], vocab: new Set(), fuzzy: [], macros: {} };
    const n = s => wordsOf(prep(s, 'i'), apos).trim();
    Object.entries(FIX[lang] || {}).forEach(([k, v]) => { db.map[n(k)] = n(v); });
    (JOIN[lang] || []).forEach(([a, b]) => db.join.push([' ' + n(a) + ' ', ' ' + n(b) + ' ']));
    const compileOne = (src, flags) => { const node = parse(src, db, 0); return { src, re: new RegExp(node.s + '(?= )', flags || 'u'), cre: node.c ? new RegExp(loose(node.c), 'u') : null }; };
    const rule = r => Array.isArray(r) ? Object.assign(compileOne(r[0]), { unless: compileOne(r[1]) }) : compileOne(r);
    db.rules = {};
    Object.keys(CATS).forEach(cat => { db.rules[cat] = ((RULES[lang] || {})[cat] || []).map(rule); });
    db.soft = {};
    Object.entries(SOFT[lang] || {}).forEach(([cat, list]) => { db.soft[cat] = list.map(s => ({ yes: compileOne(s.yes), no: compileOne(s.no) })); });
    db.innocent = (INNOCENT[lang] || []).map(s => compileOne(s, 'gu'));
    db.priv = {};
    Object.entries(PRIV_RULES[lang] || {}).forEach(([kind, list]) => { db.priv[kind] = list.map(x => compileOne(x)); });
    db.fuzzy = (FUZZY[lang] || []).map(n).filter(w => w.length >= 6);
    return (DB[key] = db);
  }
  // Text → padded, normalised words for one language (fixes, joins and one-letter misspellings applied).
  function fixText(s, db, fuzzy) {
    db.join.forEach(([a, b]) => { s = s.split(a).join(b); });
    return s.replace(/ (\S+)(?= )/g, (m, w) => {
      if (db.map[w]) return ' ' + db.map[w];
      if (fuzzy && w.length >= 6 && !db.vocab.has(w) && !FUZZY_SKIP.has(w)) { const f = db.fuzzy.find(x => osa1(w, x)); if (f) return ' ' + f; }
      return m;
    });
  }

  // The pattern language (see the top of the file). Each piece becomes {s: regex on spaced words, c: regex on
  // the words written together (null when it can't be, e.g. gaps)}.
  function parse(src, db, depth) {
    let i = 0;
    const SPECIAL = '()|{}?~!$';
    function alt() {
      const b = [seq()];
      while (src[i] === '|') { i++; b.push(seq()); }
      if (b.length === 1) return b[0];
      return { s: '(?:' + b.map(x => x.s).join('|') + ')', c: b.every(x => x.c !== null) ? '(?:' + b.map(x => x.c).join('|') + ')' : null };
    }
    function seq() {
      const parts = [];
      for (;;) {
        while (src[i] === ' ') i++;
        if (i >= src.length || src[i] === '|' || src[i] === ')') break;
        parts.push(item());
      }
      return { s: parts.map(p => p.s).join(''), c: parts.some(p => p.c === null) ? null : parts.map(p => p.c).join('') };
    }
    function item() {
      let u;
      const ch = src[i];
      if (ch === '~') { i++; let k = ''; while (/\d/.test(src[i] || '')) k += src[i++]; return { s: '(?: \\S+){0,' + (k || 4) + '}', c: null }; }
      if (ch === '$') { i++; return { s: '(?= $)', c: '' }; }
      if (ch === '!') { i++; const g = item(); return { s: '(?!' + g.s + '(?= ))', c: '' }; }
      if (ch === '(') { i++; u = alt(); if (src[i] !== ')') throw new Error('Brainy safety rule: missing ) in ' + src); i++; }
      else if (ch === '{') {
        const j = src.indexOf('}', i), name = src.slice(i + 1, j);
        i = j + 1;
        if (!db.macros[name]) {
          const def = (MACROS[db.lang] || {})[name];
          if (def == null || depth > 6) throw new Error('Brainy safety rule: unknown group {' + name + '}');
          db.macros[name] = parse(def, db, depth + 1);
        }
        u = db.macros[name];
      } else {
        let w = '';
        while (i < src.length && src[i] !== ' ' && !SPECIAL.includes(src[i])) w += src[i++];
        const star = w.endsWith('*');
        const n = fixText(wordsOf(prep(star ? w.slice(0, -1) : w, 'i'), db.apos), db, false).trim();
        const ws = n ? n.split(' ') : [];
        ws.forEach(x => db.vocab.add(x));
        u = { s: ws.map(x => ' ' + escRe(x)).join('') + (star ? '\\S*' : ''), c: ws.map(escRe).join('') + (star ? '\\p{L}*' : '') };
      }
      if (src[i] === '?') { i++; u = { s: '(?:' + u.s + ')?', c: u.c === null ? null : '(?:' + u.c + ')?' }; }
      return u;
    }
    const node = alt();
    if (i < src.length) throw new Error('Brainy safety rule: unexpected ' + src[i] + ' in ' + src);
    return node;
  }

  // The message as the rules of one language see it: up to 4 versions ("1" as i or l; apostrophes dropped or spaced).
  function versions(text, lang) {
    const ones = /1/.test(text) && /\p{L}/u.test(text) ? ['i', 'l'] : ['i'];
    const out = [];
    for (const apos of ['', ' ']) {
      const db = setup(lang, apos);
      for (const one of ones) {
        let t = fixText(wordsOf(prep(text, one), apos), db, true);
        db.innocent.forEach(r => { t = t.replace(r.re, ' '); });
        t = t.replace(/ +/g, ' ');
        // Words written together ("donttellanyone"): also try the rules on the letters without spaces, when the
        // message has a long word (10+ letters) that is not a word of the rules and not part of an innocent phrase.
        const long = prep(text, one).split(/[^\p{L}'’]+/u).filter(w => w.length >= 10).map(w => wordsOf(w, apos).trim())
          .some(w => w && !db.vocab.has(w) && t.includes(' ' + w + ' '));
        const compact = long
          ? prep(text, one).replace(/['’‘`´ʼ]/g, '').replace(/[^\p{L}]+/gu, '').replace(/dont/g, 'donot').replace(/didnt/g, 'didnot').replace(/cant/g, 'cannot').replace(/wanna/g, 'wantto') : '';
        out.push({ db, t, compact });
      }
    }
    return out;
  }
  function hits(r, v, spacedOnly) {
    if (r.re.test(v.t)) return v.t.match(r.re)[0].trim();
    if (r.cre && v.compact && !spacedOnly) { const m = v.compact.match(r.cre); if (m && m[0].length >= 9) return m[0]; }
    return null;
  }
  const anyHit = (key, vs, pick) => { for (const v of vs) for (const r of pick(v.db)) { const h = hits(r, v); if (h) return h; } return null; };

  // → { cat, reply, level, hit } or null.
  function worry(text, lang) {
    let gentle = null;
    for (const l of lang === 'en' ? ['en'] : [lang, 'en']) {
      if (!RULES[l]) continue;
      const vs = versions(text, l);
      for (const cat of Object.keys(CATS)) {
        let hit = null;
        for (const v of vs) {
          for (const r of v.db.rules[cat]) {
            const h = hits(r, v);
            if (h && !(r.unless && vs.some(x => x.db === v.db && hits(r.unless, x)))) { hit = h; break; }
          }
          if (hit) break;
        }
        if (!hit) continue;
        const [reply, level] = CATS[cat], shown = SHOWN[cat] || cat;
        const soft = (vs[0].db.soft[cat] || []).some(s => vs.some(v => hits(s.yes, v, true)) && !vs.some(v => hits(s.no, v, true)));
        if (level === 'danger' && !soft) return { cat: shown, reply, level, hit };
        if (!gentle) gentle = soft ? { cat: 'checkin', reply: 'checkin', level: 'feelings', hit, from: shown } : { cat: shown, reply, level, hit };
      }
    }
    return gentle;
  }

  // ---------- personal details ----------
  // Lower case, no accents, punctuation kept (for street and email patterns).
  const low = s => String(s || '').toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '');
  const plainWords = s => low(s).replace(/['’‘`´ʼ]/g, ' ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  // "I live in …": private unless the first real word is a common one ("a yellow house", "France").
  const GEN = {
    en: new Set(L("a|an|the|my|our|his|her|their|this|that|one|two|big|small|little|nice|tiny|huge|new|old|lovely|yellow|red|blue|green|pink|purple|white|black|orange|brown|grey|gray|house|home|flat|flats|apartment|castle|igloo|tree|treehouse|cave|forest|jungle|city|town|village|country|countryside|world|planet|earth|space|ocean|sea|water|zoo|farm|palace|tent|boat|hole|shell|pond|nest|den|sky|clouds|bungalow|cottage|caravan|building|block|hotel|hut|barn|mansion|school|peace|fear|hope|england|scotland|wales|ireland|britain|uk|usa|us|america|france|spain|germany|italy|canada|australia|china|india|japan|africa|europe|asia|mexico|brazil|portugal|poland|with|here|there|alone|far|close|very|happily|next|near|so|really|for|together|by|in|on|at|of|to|and|is|too|forever|inside|outside|underground|upstairs|downstairs|middle|same|different|nowhere|somewhere|everywhere|lots|it")),
    fr: new Set(L("un|une|le|la|les|l|mon|ma|mes|notre|nos|son|sa|ses|ce|cette|grand|grande|petit|petite|belle|beau|jolie|gros|grosse|maison|appartement|appart|chateau|igloo|arbre|cabane|grotte|foret|jungle|ville|village|campagne|pays|monde|planete|terre|espace|mer|ocean|eau|zoo|ferme|palais|tente|bateau|trou|nid|ciel|immeuble|montagne|banlieue|bord|cote|france|angleterre|espagne|allemagne|italie|belgique|suisse|canada|quebec|afrique|europe|asie|amerique|chine|japon|maroc|algerie|tunisie|senegal|portugal|avec|chez|ici|la|loin|pres|tout|toujours|depuis|aussi|encore|pas|plus|juste|seul|seule|tranquille|dedans|dehors|haut|bas|etage|milieu|meme|et|est|quartier|centre")),
    es: new Set(L("un|una|el|la|los|las|mi|mis|nuestro|nuestra|su|sus|este|esta|ese|esa|grande|pequeno|pequena|bonita|bonito|casa|piso|apartamento|departamento|castillo|iglu|arbol|cabana|cueva|bosque|selva|ciudad|pueblo|campo|pais|mundo|planeta|tierra|espacio|mar|oceano|agua|zoo|granja|palacio|tienda|barco|agujero|nido|cielo|edificio|montana|espana|mexico|argentina|colombia|peru|chile|venezuela|francia|inglaterra|estados|eeuu|europa|america|africa|asia|china|japon|portugal|italia|alemania|ecuador|bolivia|uruguay|paraguay|cuba|con|aqui|alli|lejos|cerca|solo|sola|todo|siempre|tambien|y|es|barrio|centro|medio"))
  };
  const SKIP = { en: new Set(L("in|on|at|near|next|to|by")), fr: new Set(L("a|au|aux|en|dans|pres|de|du|des|d|sur|vers")), es: new Set(L("en|de|del|al|a|cerca|por|junto")) };
  const LIVE = {
    en: / (?:i|we|me and my \S+|my family) (?:live|lives|living|stay|am living|are living)((?: \S+){1,6})/,
    fr: / (?:j habite|jhabite|j abite|on habite|nous habitons|je vis|on vit|nous vivons|j vis)((?: \S+){1,7})/,
    es: / (?:vivo|vivimos|yo vivo|mi casa esta|mi casa queda|estoy viviendo) (?:en|cerca de|al lado de|junto a|por)((?: \S+){1,7})/
  };
  function livesAt(text, lang) {
    const t = ' ' + plainWords(text) + ' ';
    for (const l of lang === 'en' ? ['en'] : [lang, 'en']) {
      const m = LIVE[l] && t.match(LIVE[l]);
      if (!m) continue;
      const rest = m[1].trim().split(' ');
      if (rest.some(w => /\d/.test(w))) return true;
      const first = rest.find(w => !SKIP[l].has(w));
      if (first && !GEN[l].has(first)) return true;
    }
    return false;
  }
  // A number with a street word: "12 Baker Street", "12 rue Victor Hugo", "calle Mayor 12".
  const STREET_STOP = new Set(L("and|are|is|have|has|in|on|at|the|of|with|to|for|was|were|my|our|a|an|cars|dogs|cats|hay|habia|tiene|tienen|son|es|esta|estan|veo|vi|corren|juegan|tengo|y|con|mas|menos|por|para|que|un|una|los|las"));
  function streetAddress(text) {
    const lo = low(text), raw = String(text);
    let m;
    const reEn = /\b\d{1,4}[a-z]?\b,? ((?:[a-z'.-]+ ){1,3})(?:street|st|road|rd|avenue|ave|lane|ln|crescent|terrace|boulevard|blvd|mews)\b/g;
    while ((m = reEn.exec(lo))) if (!m[1].trim().split(' ').some(w => STREET_STOP.has(w))) return true;
    if (/\b\d{1,4}[A-Za-z]?,? (?:[A-Z][A-Za-z'.-]* ){1,3}(?:Drive|Close|Way|Court|Place|Gardens|Grove|Square|Hill|Park|Row|Walk|Green|View|Rise|Parade|Vale)\b/.test(raw)) return true;
    if (/\b\d{1,4}(?: ?(?:bis|ter))?,? (?:rue|avenue|av|bd|boulevard|chemin|allee|impasse|place|quai|cours|route|square|passage|residence|lotissement)\b/.test(lo)) return true;
    const reEs = /\b(?:calle|c\/|avenida|avda|av|plaza|paseo|camino|carretera|ronda|travesia|glorieta|pasaje|urbanizacion)\.? ((?:[a-z'.-]+ ){0,4})(?:n[ºo°]?\.? ?)?\d{1,4}\b/g;
    while ((m = reEs.exec(lo))) if (!m[1].trim().split(' ').some(w => STREET_STOP.has(w) && !/^(de|del|la|el|los|las)$/.test(w))) return true;
    return false;
  }
  const POSTCODE = /\b(?!ps[45]\b)[a-z]{1,2}\d[a-z\d]? ?\d[abd-hjlnp-uw-z]{2}\b/i;   // UK
  const POSTCODE_CITY = /\b\d{5} +[A-ZÀ-Ý][\p{L}-]+/u;                          // France / Spain: "69002 Lyon"
  // School names: "St Mary's Primary", "école Jean Jaurès", "colegio San José".
  const SCHOOL_GEN = new Set(L("the|a|my|our|big|new|old|local|swimming|dance|ballet|football|music|art|sunday|summer|forest|holiday|primary|nursery|magic|fairy|wizard|robot|space|dinosaur|princess|boarding|play|driving|cooking|drama|karate|judo|this|that|same|other|next|first|last|whole|good|best|nice|to|at|in|from|for|of"));
  function schoolName(text) {
    const raw = String(text), lo = ' ' + plainWords(text) + ' ';
    if (/\b(?:go to|goes to|at|attend|attends|from|in)\s+(?:(?:St|Saint|Our|Holy|Sacred)\.?\s+)?(?:[A-Z][\p{L}'’.-]*\s+){1,4}(?:Primary|Elementary|Junior|Infant|Infants|Academy|High|Middle|Grammar|Prep|School|College|CofE|CE)\b/u.test(raw.replace(/^\S+\s/, ' ')) &&
        !/\b(?:go to|goes to|at|attend|from|in)\s+(?:The|My|Our|A)\s+(?:School|Primary)\b/.test(raw)) return true;
    const m = lo.match(/ (?:go to|goes to|at|attend|attends|from) ((?:\S+ ){1,3})(?:primary|elementary|junior|infant|infants|academy|grammar|prep|c of e|catholic)( school)? /);
    if (m && m[1].trim().split(' ').some(w => !SCHOOL_GEN.has(w))) return true;
    if (/ (?:st|saint|holy|our lady|sacred heart) \S+ (?:school|primary|academy|college) /.test(lo)) return true;
    if (/\b(?:[ée]cole|coll[eè]ge|lyc[ée]e|maternelle)\s+(?:primaire\s+|maternelle\s+|[ée]l[ée]mentaire\s+|publique\s+|priv[ée]e\s+)?(?:de\s+la\s+|du\s+|des\s+|de\s+|d['’])?(?:[A-ZÉÈÀ][\p{L}'’-]+|saint|sainte|st|ste|notre)/u.test(raw)) return true;
    if (/\b(?:colegio|cole|escuela|instituto|ceip|ies)\s+(?:p[uú]blico\s+|privado\s+|concertado\s+)?(?:de\s+|del\s+)?(?:[A-ZÁÉÍÓÚÑ][\p{L}'’-]+|san|santa|nuestra|virgen)/u.test(raw)) return true;
    return false;
  }
  // "my name is Leo Martin", "je m'appelle Léa Dupont", "mi mamá se llama Sara Gómez".
  const NOT_NAME = new Set(L("And|Et|Y|I|But|Mais|Pero|The|Le|La|El|Is|Est|Es|Brainy|Im|I'm"));
  function fullName(text) {
    const m = String(text).match(/\b(?:name is|name's|called|named|m'appelle|m’appelle|s'appelle|s’appelle|appelle|me llamo|se llama|llamo|mi nombre es)\s+([A-ZÀ-Ý][\p{Ll}'’-]+)\s+([A-ZÀ-Ý][\p{Ll}'’-]+)/u);
    return !!(m && !NOT_NAME.has(m[1]) && !NOT_NAME.has(m[2]));
  }
  const HANDLE = /(^|\s)@[\p{L}\d_.]{3,}/u;
  const SPELLED_EMAIL = /\b[\p{L}\d._-]{2,} ?(?:@|\bat\b|\barobase\b|\barroba\b) ?[\p{L}\d-]{2,} ?(?:\.|\bdot\b|\bpoint\b|\bpunto\b) ?(?:com|net|org|fr|es|co|uk|io|me)\b/u;

  // Phone numbers in words (and mixed with digits): "zero seven seven double zero nine", "zéro six douze trente-quatre".
  const NUMW = {
    en: { zero: 0, oh: 0, o: 0, nought: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fourty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 },
    fr: { zero: 0, un: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16, vingt: 20, vingts: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60 },
    es: { cero: 0, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19, veinte: 20, veintiuno: 21, veintidos: 22, veintitres: 23, veinticuatro: 24, veinticinco: 25, veintiseis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29, treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90 }
  };
  const MULT = { double: 2, triple: 3, treble: 3, doble: 2 };
  const LINKW = new Set(['and', 'et', 'y']);
  // Runs of number words/digits → [{from, to}] (token indexes) that look like a phone number.
  function numberRuns(tokens, langs) {
    const look = w => { for (const l of langs) if (NUMW[l] && NUMW[l][w] !== undefined) return NUMW[l][w]; return undefined; };
    const item = tok => {
      const parts = plainWords(tok).split(' ').filter(Boolean);
      if (!parts.length) return null;
      const out = [];
      for (const p of parts) {
        if (/^\d+$/.test(p)) out.push({ d: p });
        else if (look(p) !== undefined) out.push({ v: look(p) });
        else if (MULT[p]) out.push({ m: MULT[p] });
        else if (LINKW.has(p)) out.push({ link: 1 });
        else return null;
      }
      return out;
    };
    const runs = [];
    let i = 0;
    while (i < tokens.length) {
      const first = item(tokens[i]);
      if (!first || first.every(x => x.link || x.m)) { i++; continue; }
      let j = i, items = [];
      while (j < tokens.length) { const it = item(tokens[j]); if (!it) break; items = items.concat(it); j++; }
      // Join tens and units (vingt et un, treinta y cuatro, soixante-dix, quatre-vingt-deux, twenty one).
      const vals = []; let mult = 1, words = 0;
      for (let k = 0; k < items.length; k++) {
        const x = items[k];
        if (x.link) continue;
        if (x.m) { mult = x.m; continue; }
        if (x.d !== undefined) { for (let r = 0; r < mult; r++) vals.push({ s: x.d, v: +x.d }); mult = 1; continue; }
        words++;
        const prev = vals[vals.length - 1];
        if (prev && prev.word && x.v === 20 && prev.v === 4) { prev.v = 80; prev.s = '80'; prev.tens = true; continue; }
        if (prev && prev.word && prev.tens && x.v > 0 && x.v < 20 && !prev.joined) { prev.v += x.v; prev.s = String(prev.v); prev.joined = true; continue; }
        for (let r = 0; r < mult; r++) vals.push({ s: String(x.v), v: x.v, word: true, tens: x.v >= 20 && x.v % 10 === 0 });
        mult = 1;
      }
      const digits = vals.map(x => x.s).join('');
      const diffs = vals.slice(1).map((x, k) => x.v - vals[k].v);
      const counting = vals.length >= 3 && diffs.every(d => d === diffs[0]);
      if (words >= 2 && digits.length >= 6 && !counting) runs.push({ from: i, to: j });
      i = j;
    }
    return runs;
  }
  const spelledPhone = (text, lang) => numberRuns(String(text).split(/\s+/), lang === 'en' ? ['en'] : [lang, 'en']).length > 0;

  // → 'email' | 'address' | 'school' | 'user' | 'name' | null
  function personal(text, lang) {
    if (EMAIL.test(text) || SPELLED_EMAIL.test(low(text))) return 'email';
    for (const l of lang === 'en' ? ['en'] : [lang, 'en']) {
      if (!PRIV_RULES[l]) continue;
      const vs = versions(text, l);
      for (const kind of Object.keys(PRIV_RULES[l])) if (anyHit(kind, vs, db => db.priv[kind] || [])) return kind;
    }
    if (livesAt(text, lang) || streetAddress(text) || POSTCODE.test(text) || POSTCODE_CITY.test(text)) return 'address';
    if (schoolName(text)) return 'school';
    if (HANDLE.test(text)) return 'user';
    if (fullName(text)) return 'name';
    return null;
  }

  /* check(text, lang, opts) → { kind, hit, cat?, level?, reply? } or { kind: null }.
   *   kind 'danger': cat (selfharm, grooming, bully, home, online, worry, checkin), level ('danger' | 'feelings')
   *                  and reply (Brainy answers with br_s_<reply>).
   *   kind 'private': hit 'number' | 'address' | 'email' | 'school' | 'user' | 'name' | a phrase.
   * opts.isMaths: the message is a sum, so long numbers are not treated as phone numbers. */
  function check(text, lang, opts) {
    opts = opts || {};
    lang = lang || 'en';
    let hit;
    const w = worry(text, lang);
    if (w && w.level === 'danger') return Object.assign({ kind: 'danger' }, w);
    if (!w && (hit = find('danger', DANGER, text, lang))) return { kind: 'danger', cat: 'worry', reply: 'danger', level: 'danger', hit };
    if ((hit = personal(text, lang))) return { kind: 'private', hit };
    if ((hit = find('private', PRIVATE, text, lang))) return { kind: 'private', hit };
    if (!opts.isMaths && (looksLikePhone(text) || spelledPhone(text, lang))) return { kind: 'private', hit: 'number' };
    if (w) return Object.assign({ kind: 'danger' }, w);
    if ((hit = findRude(text, lang))) return { kind: 'rude', hit };
    if ((hit = find('unkind', UNKIND, text, lang))) return { kind: find('self', SELF, text, lang) ? 'self' : 'unkind', hit };
    if ((hit = find('grownup', GROWNUP, text, lang))) return { kind: 'grownup', hit };
    if (LINK.test(text)) return { kind: 'link', hit: 'link' };
    return { kind: null };
  }

  // What we keep in the chat history (shown to parents) for each kind of message.
  function redact(text, kind) {
    if (kind === 'private') return '🔒 •••••';
    if (kind === 'rude') return '🙊 •••••';
    // Worrying messages are kept so a parent can understand them, with personal details inside hidden:
    // e-mails, @usernames, phone numbers (digits or words), long numbers and street addresses.
    let s = String(text).replace(new RegExp(EMAIL.source, 'gi'), '•••@•••').replace(/(^|\s)@[\p{L}\d_.]{3,}/gu, '$1@•••');
    s = s.replace(/\+?\d[\d\s().-]{5,}\d/g, m => (m.replace(/\D/g, '').length >= 6 ? '••••' : m)).replace(/\d{4,}/g, '••••');
    const parts = s.split(/(\s+)/), words = parts.filter((p, k) => k % 2 === 0);
    numberRuns(words, ['en', 'fr', 'es']).forEach(r => { for (let k = r.from; k < r.to; k++) words[k] = k === r.from ? '••••' : ''; });
    s = parts.map((p, k) => (k % 2 === 0 ? words[k / 2] : p)).join('').replace(/\s{2,}/g, ' ').trim();
    if (streetAddress(s) || POSTCODE.test(s)) s = s.replace(/\d+[a-z]?/gi, m => (/\d/.test(m) ? '••' : m)).replace(POSTCODE, '•••');
    return s;
  }

  window.BrainySafety = { check, redact, norm, CJK };
})();
