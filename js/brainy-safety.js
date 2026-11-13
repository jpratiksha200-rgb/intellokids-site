/* Talk to Brainy: safety filter.
 * Every message a child types goes through check() BEFORE Brainy answers. It runs on the
 * device only: nothing is sent anywhere. It looks for, in this order:
 *   danger   – signs a child may be unsafe (hurt, abuse, strangers, self-harm). Brainy sends the
 *              child to a trusted grown-up and the parents' dashboard shows an alert.
 *   private  – personal details (address, phone, email, passwords, school). The message is hidden.
 *   rude     – swear words and slurs. The message is hidden.
 *   unkind   – insults ("you're stupid"); "self" when the child says it about themselves.
 *   grownup  – topics for a grown-up (weapons, drugs, sex, money, violence).
 *   link     – web addresses (Brainy never opens or shares links).
 * The lists for the site's current language AND English are always checked (kids mix languages).
 * Phrases are written naturally; they are normalised the same way as the child's text.
 * A trailing * means "any word starting with this". Chinese is matched as plain text.
 * Watch out for innocent look-alikes when adding words (French "tant pis", German "Waffel"). */
(function () {
  const L = (s) => s.split('|');

  // ---------- word lists ----------
  const DANGER = {
    en: L("hurt me|hurts me|hurting me|hit me|hits me|hitting me|beat me|beats me|kick me|kicks me|touched me|touch me|touches me|touching me|my private parts|kill myself|want to die|wanna die|wish i was dead|kill me|hurt myself|cut myself|abuse*|abusing|run away from home|running away|keep a secret from my|secret from my mum|secret from my mom|secret from my dad|secret from my parents|don't tell my mum|dont tell my mum|don't tell my mom|dont tell my mom|don't tell my dad|dont tell my dad|don't tell my parents|dont tell my parents|a stranger|strangers|meet me|meet up|asked to meet|wants to meet|send pictures|send a picture|send photos|send a photo|photos of me|pictures of me|bully|bullied|bullying|bullies|not safe|unsafe|kidnap*|nobody feeds me|no food at home|locked me|locks me|scared of my|scared to go home"),
    fr: L("me frappe|me frappent|m'a frappé|me tape|me fait mal|me font mal|m'a touché|m'a touchée|me touche|me touchent|mes parties intimes|me tuer|envie de mourir|veux mourir|je veux mourir|me faire du mal|me couper|harcèle*|harcelé*|harcèlement|on se moque de moi|fuguer|un inconnu|une inconnue|des inconnus|un étranger|me rencontrer|se voir en vrai|envoyer des photos|envoyer une photo|photos de moi|dis pas à ma mère|dis pas à mon père|dis pas à mes parents|le dis pas à maman|le dis pas à papa|garder le secret|pas en sécurité|kidnapp*|j'ai peur de rentrer"),
    es: L("me pega|me pegan|me golpea|me golpean|me hace daño|me hacen daño|me toca el cuerpo|me tocó el cuerpo|me toca donde|me tocó donde|me toca mis partes|me tocó mis partes|mis partes íntimas|matarme|quiero morir|quiero morirme|hacerme daño|cortarme|me acosa*|acoso|me molestan|escaparme|escapar de casa|un extraño|una extraña|un desconocido|una desconocida|desconocidos|verme en persona|quedar conmigo|mandar fotos|enviar fotos|fotos mías|no le digas a mi mamá|no le digas a mi papá|no le digas a mis padres|guardar el secreto|no estoy a salvo|secuestr*|miedo de volver a casa"),
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

  /* check(text, lang, opts) → { kind, hit } or { kind: null }.
   * opts.isMaths: the message is a sum, so long numbers are not treated as phone numbers. */
  function check(text, lang, opts) {
    opts = opts || {};
    lang = lang || 'en';
    let hit;
    if ((hit = find('danger', DANGER, text, lang))) return { kind: 'danger', hit };
    if (EMAIL.test(text)) return { kind: 'private', hit: 'email' };
    if ((hit = find('private', PRIVATE, text, lang))) return { kind: 'private', hit };
    if (!opts.isMaths && looksLikePhone(text)) return { kind: 'private', hit: 'number' };
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
    // Danger messages are kept so a parent can understand them, with any long numbers hidden.
    return String(text).replace(/\d{4,}/g, '••••').replace(EMAIL, '•••@•••');
  }

  window.BrainySafety = { check, redact, norm, CJK };
})();
