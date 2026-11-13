/*
 * IntelloKids configuration.
 * Fill in your Paddle details here once your Paddle account is set up.
 *   1. Paddle dashboard → Developer tools → Authentication → create a client-side token.
 *   2. Paddle dashboard → Catalog → create a product with a monthly and a yearly price.
 *   3. Paste the token and the two price IDs (they start with "pri_") below.
 * Use environment "sandbox" while testing, then switch to "production".
 */
window.IK_CONFIG = {
  // Payments master switch (owner decision 2026-11-08: remove all payment content for now).
  //   enabled: false → IntelloKids is free for every family with no time limit, and the site shows
  //            no prices, plans, free week, pricing/refund pages or payment wording anywhere.
  //   enabled: true  → brings back the free week, plans and the pricing page. To restore payments
  //            fully, follow docs/PAYMENTS-PAUSED.md (legal texts, static pages, security policy).
  //   live: online checkout on/off once a provider (Paddle, PayPal, ...) is chosen and set up.
  payments: { enabled: false, live: false, provider: '' },

  // What visitors can open for now (owner decision 2026-11-08). Locked parts show a padlock and
  // "locked for now, it will open later", with no other wording. Each line is one switch:
  //   enabled:   false opens everything.
  //   maxLevel:  adventure levels 1 to maxLevel can be played on every age path (100 = all).
  //   videos:    ids of the videos that can be played. Other videos that have a file show a padlock.
  //   colouring: colouring pictures that stay open, as a list of picture ids (the classics in PICS in
  //              js/colouring.js, or pack ids like 'a5-pony') or a number (the first N classics).
  //   colouringPerAge: plus the first N pictures of every age's pack (js/colouring/age3.js … age10.js).
  //              Drawing on a blank page always stays open.
  //   quizzes:   quizzes each child can finish in the Quiz section (the quiz at the end of each world doesn't count).
  //              null = no limit.
  //   chat:      false locks Talk to Brainy, true opens it (for the ages set in brainyChat.minAge below).
  // Once payments are switched on, parents who have paid (Store.hasPaid) get everything.
  limits: { enabled: true, maxLevel: 10, videos: ['shapes', 'count10', 'abc', 'planets'], colouring: ['cat', 'unicorn', 'rocket'], colouringPerAge: 3, quizzes: 15, chat: true },

  // Children per parent account (owner, 2026-11-12): up to 4, for every family (not one of the limits above).
  // Accounts that already have more keep all their children; they just can't add another one.
  // The number is also written in the SEO page copy (infra/seo/content/<lang>.js: ctaText and the games FAQ).
  maxChildren: 4,

  // Brainy's recorded voice (the kid voice from the videos). Languages listed here play the recordings in
  // audio/brainy/<lang>/ (made by infra/build-voice.ps1). Other languages use the device's voice.
  // To switch a language back to the device voice, remove it from this list.
  brainyVoice: { recorded: ['en', 'fr', 'es'] },

  // Free week length (days) and the prices shown on the site live in the block below.
  paddle: {
    environment: 'sandbox',
    clientToken: '',            // e.g. 'test_abc123...'
    prices: {
      monthly: '',              // e.g. 'pri_01h...'
      yearly: ''
    },
    // Display prices only (the real price is whatever is set in Paddle).
    // Starter plan from docs/PADDLE-CATALOG.md (Pro and Advanced come later, once their contents are defined).
    displayPrices: { monthly: '$9.99', yearly: '$99.99' },
    trialDays: 7
  },

  // Supported languages. Add more here, in js/i18n.js, and a flag in Art.flag (js/characters.js).
  // dir: 'rtl' for right-to-left languages.
  // Owner, 2026-11-13: the site is in English, French and Spanish only. German (de) and Chinese (zh) are parked in
  // parked/languages/ (outside website/, so not published) and will come back later: see parked/languages/README.md.
  // Every language picker shows a "More languages coming soon" line (the moreLangsSoon text) without naming them.
  languages: [
    { code: 'en', name: 'English', flag: 'gb', voice: 'en-GB', locale: 'en_GB' },
    { code: 'fr', name: 'Français', flag: 'fr', voice: 'fr-FR', locale: 'fr_FR' },
    { code: 'es', name: 'Español', flag: 'es', voice: 'es-ES', locale: 'es_ES' }
  ],

  // Talk to Brainy (js/brainy-chat.js). Answers are made on the device; nothing typed is sent anywhere.
  // dailyLimit: messages a child can send per day (keeps the chat a helper, not a time sink).
  // minAge: Talk to Brainy is only for children this age and over (owner decision 2026-11-09). Younger children
  //         don't see it at all: no tile, no padlock. 3 = every child.
  // Parents can switch the chat off per child in that child's progress dashboard.
  brainyChat: { enabled: true, minAge: 6, dailyLimit: 60, maxLength: 150 },

  // Parent feedback form (owner, 2026-11-09): "How are we doing?" at the bottom of the home page, #/feedback,
  // the footer link and the account menu. Stars + an optional message, name and email, sent to the owner's inbox.
  // The website has no server, so the form posts JSON to FormSubmit (formsubmit.co), which emails it on.
  //   email:    where parents can write if sending fails (the mailto link), and the inbox FormSubmit delivers to.
  //   endpoint: FormSubmit's AJAX address. The very first submission makes FormSubmit email an "Activate form"
  //             link to kidsintello@gmail.com; the owner clicks it once, then messages arrive. After that,
  //             FormSubmit also gives a random alias: you may put it here instead of the address
  //             ('https://formsubmit.co/ajax/<alias>') so the address isn't visible in the page code.
  //             Another service (Formspree, Getform, ...) can replace this line; also add its address to
  //             connect-src in the Content-Security-Policy of website/index.html.
  //   cooldown: seconds between two sends from the same browser. maxLength: longest message, in characters.
  feedback: { enabled: true, email: 'kidsintello@gmail.com', endpoint: 'https://formsubmit.co/ajax/kidsintello@gmail.com', cooldown: 30, maxLength: 2000 },

  // Educational videos. Add a "url" (an .mp4 in website/videos/, 720p, under ~15 MB) to make a video playable,
  // plus a "poster" thumbnail (640x360 .jpg). "lang" is the language spoken in the video.
  // "langs" lists the other languages the video also exists in (owner decision 2026-11-09), as
  // website/videos/<lang>/<id>.mp4 + <id>.jpg. The site plays the version in its current language and falls back to
  // the main one; limits.videos still works by id for every language.
  // "group" is the age tab the video shows in (owner, 2026-11-12): 'tiny' 3–4, 'junior' 5–6, 'explorer' 7–10.
  // "subject" adds a small chip on the card: science, maths, words, world, feelings, creative or coding
  // (the icons are VIDEO_SUBJECTS in js/app.js, the names are the vs_* texts).
  // An entry with url: '' is a planned video: it shows as a "Coming soon" card (its emoji on the age's colour)
  // and is never playable. Its title is the v_<id> text in every language. Give it a url to make it a real video.
  videos: [
    { id: 'shapes',  emoji: '🔺', group: 'tiny',     subject: 'maths',   url: 'videos/shapes.mp4',  poster: 'videos/shapes.jpg',  lang: 'en', langs: ['fr', 'es'] },
    { id: 'colours', emoji: '🌈', group: 'tiny',     subject: 'creative', url: 'videos/colours.mp4', poster: 'videos/colours.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'count10', emoji: '🔢', group: 'tiny',     subject: 'maths',   url: 'videos/count10.mp4', poster: 'videos/count10.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'abc',     emoji: '🔤', group: 'junior',   subject: 'words',   url: 'videos/abc.mp4',     poster: 'videos/abc.jpg',     lang: 'en', langs: ['fr', 'es'] },
    { id: 'animals', emoji: '🦁', group: 'junior',   subject: 'science', url: 'videos/animals.mp4', poster: 'videos/animals.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'planets', emoji: '🪐', group: 'explorer', subject: 'science', url: 'videos/planets.mp4', poster: 'videos/planets.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'plants',  emoji: '🌱', group: 'explorer', subject: 'science', url: 'videos/plants.mp4', poster: 'videos/plants.jpg', lang: 'en' },
    { id: 'world',   emoji: '🌍', group: 'explorer', subject: 'world',   url: '' },
    // Planned (research 2026-11-12), Little Learners, 3–4:
    { id: 'big-feelings',     emoji: '😊', group: 'tiny',     subject: 'feelings', url: 'videos/big-feelings.mp4', poster: 'videos/big-feelings.jpg', lang: 'en' },
    { id: 'five-senses',      emoji: '👀', group: 'tiny',     subject: 'science',  url: 'videos/five-senses.mp4', poster: 'videos/five-senses.jpg', lang: 'en' },
    { id: 'weather',          emoji: '☀️', group: 'tiny',     subject: 'science',  url: '' },
    { id: 'wiggly-body',      emoji: '🤸', group: 'tiny',     subject: 'science',  url: '' },
    { id: 'wash-hands',       emoji: '🧼', group: 'tiny',     subject: 'science',  url: 'videos/wash-hands.mp4', poster: 'videos/wash-hands.jpg', lang: 'en' },
    { id: 'opposites',        emoji: '↕️', group: 'tiny',     subject: 'words',    url: '' },
    { id: 'rhyme-time',       emoji: '🐱', group: 'tiny',     subject: 'words',    url: '' },
    { id: 'in-on-under',      emoji: '📦', group: 'tiny',     subject: 'maths',    url: '' },
    { id: 'patterns',         emoji: '🔁', group: 'tiny',     subject: 'maths',    url: '' },
    { id: 'taking-turns',     emoji: '🤝', group: 'tiny',     subject: 'feelings', url: '' },
    { id: 'clap-band',        emoji: '🥁', group: 'tiny',     subject: 'creative', url: '' },
    { id: 'helpers',          emoji: '🚒', group: 'tiny',     subject: 'world',    url: '' },
    // Planned (research 2026-11-12), Junior Thinkers, 5–6:
    { id: 'sink-or-float',    emoji: '🛁', group: 'junior',   subject: 'science',  url: 'videos/sink-or-float.mp4', poster: 'videos/sink-or-float.jpg', lang: 'en' },
    { id: 'push-and-pull',    emoji: '🛒', group: 'junior',   subject: 'science',  url: '' },
    { id: 'four-seasons',     emoji: '🍂', group: 'junior',   subject: 'science',  url: '' },
    { id: 'butterfly',        emoji: '🦋', group: 'junior',   subject: 'science',  url: '' },
    { id: 'wobbly-tooth',     emoji: '🦷', group: 'junior',   subject: 'science',  url: 'videos/wobbly-tooth.mp4', poster: 'videos/wobbly-tooth.jpg', lang: 'en' },
    { id: 'make-ten',         emoji: '🔟', group: 'junior',   subject: 'maths',    url: 'videos/make-ten.mp4', poster: 'videos/make-ten.jpg', lang: 'en' },
    { id: 'clock-time',       emoji: '🕐', group: 'junior',   subject: 'maths',    url: '' },
    { id: 'sound-it-out',     emoji: '🔊', group: 'junior',   subject: 'words',    url: '' },
    { id: 'say-hello',        emoji: '🗺️', group: 'junior',   subject: 'world',    url: '' },
    { id: 'mistakes-ok',      emoji: '💪', group: 'junior',   subject: 'feelings', url: '' },
    { id: 'draw-with-shapes', emoji: '✏️', group: 'junior',   subject: 'creative', url: '' },
    { id: 'robot-steps',      emoji: '🤖', group: 'junior',   subject: 'coding',   url: '' },
    // Planned (research 2026-11-12), Young Explorers, 7–10:
    { id: 'water-cycle',      emoji: '🌧️', group: 'explorer', subject: 'science',  url: 'videos/water-cycle.mp4', poster: 'videos/water-cycle.jpg', lang: 'en' },
    { id: 'magnets',          emoji: '🧲', group: 'explorer', subject: 'science',  url: 'videos/magnets.mp4', poster: 'videos/magnets.jpg', lang: 'en' },
    { id: 'food-journey',     emoji: '🍌', group: 'explorer', subject: 'science',  url: 'videos/food-journey.mp4', poster: 'videos/food-journey.jpg', lang: 'en' },
    { id: 'life-cycles',      emoji: '🐸', group: 'explorer', subject: 'science',  url: '' },
    { id: 'day-and-night',    emoji: '🌗', group: 'explorer', subject: 'science',  url: '' },
    { id: 'circuits',         emoji: '💡', group: 'explorer', subject: 'science',  url: '' },
    { id: 'volcanoes',        emoji: '🌋', group: 'explorer', subject: 'science',  url: '' },
    { id: 'fossils',          emoji: '🦕', group: 'explorer', subject: 'science',  url: '' },
    { id: 'times-tables',     emoji: '✖️', group: 'explorer', subject: 'maths',    url: '' },
    { id: 'fractions',        emoji: '🍕', group: 'explorer', subject: 'maths',    url: '' },
    { id: 'story-maker',      emoji: '📖', group: 'explorer', subject: 'words',    url: '' },
    { id: 'calm-brain',       emoji: '🧠', group: 'explorer', subject: 'feelings', url: '' },
    { id: 'loops-and-bugs',   emoji: '🐞', group: 'explorer', subject: 'coding',   url: '' },
    { id: 'flipbook',         emoji: '🎞️', group: 'explorer', subject: 'creative', url: '' }
  ],

  // "Coming soon" cards for the planned videos above (the ones with url: ''), in each age tab of the
  // Learning videos page, so families see what is on the way. false hides every one of them at once
  // (the finished videos are not affected). Tapping one only shows a short "coming soon" message.
  videosComingSoon: true
};
