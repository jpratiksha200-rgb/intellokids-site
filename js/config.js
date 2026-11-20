/*
 * IntelloKids configuration.
 * Paddle (payments on the website): the client-side token and the two price IDs are in the "paddle" block below.
 * The client-side token is public by design (it can only open checkouts and preview prices). The Paddle API key is
 * SECRET and never goes in any website file. To test with a Paddle sandbox account, set environment 'sandbox' and a
 * test_ token; production needs environment 'production' and a live_ token (checked before checkout opens).
 */
window.IK_CONFIG = {
  // Payments (owner, 2026-11-15: live payments on intellokids.com with Paddle).
  //   enabled: true → the public Pricing and Refund pages, the Pricing and Refund links in the footers and the
  //            payment note. It does NOT bring back the old free-week lockout: nobody is ever locked out
  //            (Store.hasAccess), the trial below decides what is open, and after it families keep the free part.
  //   live:    true → "Subscribe" on the plans screen (#/plans, parents only, behind the parent gate) opens Paddle's
  //            secure checkout. false → it says that online payment is opening soon.
  //   provider: 'paddle' (the only one wired up). Paddle is never loaded in the Android app (Google Play policy).
  payments: { enabled: true, live: true, provider: 'paddle' },

  // 7-day free trial, then the free part (owner decision 2026-11-13: option D from the trial paper, plus the
  // "ask a grown-up" locks from option E). This switch works on its own; payments.enabled and live don't change it.
  //   enabled: true → each parent account gets ONE trial of `days` days with everything open (no payment
  //            details). It starts when the account adds its first child; accounts that already have children
  //            start theirs the first time they open the site. After it ends the `limits` below apply again,
  //            nothing is charged, and progress, stars and stickers are kept. Parents see a trial banner,
  //            reminders on the last 2 days, a one-time "trial ended" pop-up and a plans screen (#/plans, behind
  //            a parent gate, prices from paddle.displayPrices). Children only ever see "Ask a grown-up".
  //            Subscribing opens Paddle's checkout while payments.live is true (otherwise "opening soon").
  //   enabled: false → no trial and no plan or subscribe wording; the limits apply to everyone, as before.
  //   reminderDays: the parents' reminder (stronger banner + one pop-up) shows on the last N days.
  // Before the Play Store release, the plans/subscribe screens must be hidden in the Android app or moved to
  // Google Play Billing (docs/ANDROID.md).
  // The "7" is also written in the home-page texts (lp_trialLine, faq8a in js/i18n/<lang>.js) and the SEO page copy
  // (infra/seo/content/<lang>.js: ctaText and the games FAQ). Change them too if the length changes.
  trial: { enabled: true, days: 7, reminderDays: 2 },

  // Online family accounts (docs/BACKEND.md). OFF until the owner approves the move to Cloudflare.
  //   enabled: false → accounts stay on this device, exactly as before ("Forgot your password?" explains that we
  //            can't reset a device-only password and gives the contact email).
  //   enabled: true  → sign-up needs a confirmed email (6-digit code or link), log-in and password reset go through
  //            the server, children's progress is saved online and the server decides the free week and paid access.
  //   url:     the API's address. '' = this website's own address (the API lives at /api on the same site);
  //            the Android app sets https://intellokids.com (the CSP's connect-src allows it).
  // Live since 2026-11-15 (go-live): the API runs on Cloudflare at https://api.intellokids.com (data in the EU).
  backend: { enabled: true, url: 'https://api.intellokids.com' },

  // The free part: what every family can open without a subscription (owner decisions 2026-11-08 and 2026-11-13).
  // Locked parts show a padlock. With the trial on, children hear "Ask a grown-up to unlock this!" (never a price);
  // with it off, "locked for now, it will open later". Each line is one switch:
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
  // During the free trial (above) and for subscribers (Store.hasPaid), everything is open.
  limits: { enabled: true, maxLevel: 10, videos: ['shapes', 'count10', 'abc', 'planets', 'big-feelings', 'sink-or-float', 'water-cycle'], colouring: ['cat', 'unicorn', 'rocket'], colouringPerAge: 3, quizzes: 15, chat: true },

  // Children per parent account (owner, 2026-11-12): up to 4, for every family (not one of the limits above).
  // Accounts that already have more keep all their children; they just can't add another one.
  // The number is also written in the SEO page copy (infra/seo/content/<lang>.js: ctaText and the games FAQ).
  maxChildren: 4,

  // Brainy's recorded voice (the kid voice from the videos). Languages listed here play the recordings in
  // audio/brainy/<lang>/ (made by infra/build-voice.ps1). Other languages use the device's voice.
  // To switch a language back to the device voice, remove it from this list.
  brainyVoice: { recorded: ['en', 'fr', 'es'] },

  // Paddle (live account, catalog created by the owner 2026-11-15: product "intellokids", no Paddle trial).
  //   environment: exactly 'production' (live_ token) or 'sandbox' (test_ token). Anything else, or a token that
  //                doesn't match, and checkout refuses to open (a clear error in the console).
  //   prices:      the two Paddle price IDs (Monthly USD 9.99, Yearly USD 79.99, recurring, no trial).
  //   successUrl:  where Paddle sends the parent after paying (the thank-you screen).
  paddle: {
    environment: 'production',
    clientToken: 'live_070689129f3fd9e20b43ab2fdd8',
    prices: {
      monthly: 'pri_01m7f6md4svtgnvm7fd698r2s3',
      yearly: 'pri_01m7f6qnzjg6pz57ttyh7ydjtp'
    },
    successUrl: 'https://intellokids.com/#/welcome',
    // Fallback prices, shown when Paddle can't be reached (normally the plans screen shows Paddle's own localized
    // prices from Paddle.PricePreview). Keep them equal to the USD prices in Paddle; the static Pricing page and the
    // yearly saving ("about $6.67 a month, save 33%") use them too. Owner, 2026-11-13: $9.99 a month, $79.99 a year.
    displayPrices: { monthly: '$9.99', yearly: '$79.99' }
    // Payment methods switched on in Paddle (2026-11-15): card, Apple Pay, Google Pay, PayPal (and Bancontact for
    // Belgium). The plans screen and the Pricing page name them in the pl_payMethods text (js/i18n/<lang>.js):
    // change that text if a method is switched on or off in Paddle > Checkout > Checkout settings.
  },

  // Social media profiles (owner, 2026-11-17): the full https:// address of each IntelloKids profile. Each one that is
  // filled in shows a round icon link in the footer of the home page and every public page (never in the Android app),
  // and is listed as the Organization "sameAs" for search engines. Empty = hidden. After changing them, run
  // infra/build-seo.ps1 so the static pages get them too.
  // Owner, 2026-11-19: TikTok, Instagram, Facebook, X and LinkedIn are live; YouTube will follow. An icon is only added once the
  // owner sends its link. Use profile addresses, not share links (infra/seo/build.js keeps share links out of sameAs).
  social: { tiktok: 'https://www.tiktok.com/@intellokid', instagram: 'https://www.instagram.com/intellokids/', facebook: 'https://www.facebook.com/profile.php?id=61596820496191', youtube: '', x: 'https://x.com/Intellokids', linkedin: 'https://www.linkedin.com/in/intello-kids-1ba608450/' },

  // Supported languages. Add more here, in js/i18n.js, and a flag in Art.flag (js/characters.js).
  // dir: 'rtl' for right-to-left languages.
  // Owner, 2026-11-13: the site is in English, French and Spanish only. German (de) and Chinese (zh) are parked in
  // parked/languages/ (outside website/, so not published) and will come back later: see parked/languages/README.md.
  // No "More languages coming soon" line in the language pickers any more (owner, 2026-11-15).
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

  // Parent feedback (owner, 2026-11-09; logged-in parents only since 2026-11-15): a card at the bottom of the Parents'
  // area since 2026-11-18 (#/feedback leads there). Optional stars and a message, sent to the owner's inbox.
  // Owner, 2026-11-18: sent to our own API (POST /api/v1/feedback: stored in our database and emailed to the team), no
  // third-party form service any more. Needs the online accounts (backend above); without them the card offers
  // "Email us instead".
  //   email:    where parents can write if sending fails (the mailto link).
  //   cooldown: seconds between two sends from the same browser. maxLength: longest message, in characters.
  feedback: { enabled: true, email: 'help@intellokids.com', cooldown: 30, maxLength: 2000 },

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
    { id: 'plants',  emoji: '🌱', group: 'explorer', subject: 'science', url: 'videos/plants.mp4', poster: 'videos/plants.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'world',   emoji: '🌍', group: 'explorer', subject: 'world',   url: '' },
    // Planned (research 2026-11-12), Little Learners, 3–4:
    { id: 'big-feelings',     emoji: '😊', group: 'tiny',     subject: 'feelings', url: 'videos/big-feelings.mp4', poster: 'videos/big-feelings.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'five-senses',      emoji: '👀', group: 'tiny',     subject: 'science',  url: 'videos/five-senses.mp4', poster: 'videos/five-senses.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'weather',          emoji: '☀️', group: 'tiny',     subject: 'science',  url: 'videos/weather.mp4', poster: 'videos/weather.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'wiggly-body',      emoji: '🤸', group: 'tiny',     subject: 'science',  url: 'videos/wiggly-body.mp4', poster: 'videos/wiggly-body.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'wash-hands',       emoji: '🧼', group: 'tiny',     subject: 'science',  url: 'videos/wash-hands.mp4', poster: 'videos/wash-hands.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'opposites',        emoji: '↕️', group: 'tiny',     subject: 'words',    url: '' },
    { id: 'rhyme-time',       emoji: '🐱', group: 'tiny',     subject: 'words',    url: '' },
    { id: 'in-on-under',      emoji: '📦', group: 'tiny',     subject: 'maths',    url: '' },
    { id: 'patterns',         emoji: '🔁', group: 'tiny',     subject: 'maths',    url: '' },
    { id: 'taking-turns',     emoji: '🤝', group: 'tiny',     subject: 'feelings', url: '' },
    { id: 'clap-band',        emoji: '🥁', group: 'tiny',     subject: 'creative', url: '' },
    { id: 'helpers',          emoji: '🚒', group: 'tiny',     subject: 'world',    url: '' },
    // Planned (research 2026-11-12), Junior Thinkers, 5–6:
    { id: 'sink-or-float',    emoji: '🛁', group: 'junior',   subject: 'science',  url: 'videos/sink-or-float.mp4', poster: 'videos/sink-or-float.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'push-and-pull',    emoji: '🛒', group: 'junior',   subject: 'science',  url: 'videos/push-and-pull.mp4', poster: 'videos/push-and-pull.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'four-seasons',     emoji: '🍂', group: 'junior',   subject: 'science',  url: 'videos/four-seasons.mp4', poster: 'videos/four-seasons.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'butterfly',        emoji: '🦋', group: 'junior',   subject: 'science',  url: '' },
    { id: 'wobbly-tooth',     emoji: '🦷', group: 'junior',   subject: 'science',  url: 'videos/wobbly-tooth.mp4', poster: 'videos/wobbly-tooth.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'make-ten',         emoji: '🔟', group: 'junior',   subject: 'maths',    url: 'videos/make-ten.mp4', poster: 'videos/make-ten.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'clock-time',       emoji: '🕐', group: 'junior',   subject: 'maths',    url: '' },
    { id: 'sound-it-out',     emoji: '🔊', group: 'junior',   subject: 'words',    url: '' },
    { id: 'say-hello',        emoji: '🗺️', group: 'junior',   subject: 'world',    url: '' },
    { id: 'mistakes-ok',      emoji: '💪', group: 'junior',   subject: 'feelings', url: '' },
    { id: 'draw-with-shapes', emoji: '✏️', group: 'junior',   subject: 'creative', url: '' },
    { id: 'robot-steps',      emoji: '🤖', group: 'junior',   subject: 'coding',   url: '' },
    // Planned (research 2026-11-12), Young Explorers, 7–10:
    { id: 'water-cycle',      emoji: '🌧️', group: 'explorer', subject: 'science',  url: 'videos/water-cycle.mp4', poster: 'videos/water-cycle.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'magnets',          emoji: '🧲', group: 'explorer', subject: 'science',  url: 'videos/magnets.mp4', poster: 'videos/magnets.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'food-journey',     emoji: '🍌', group: 'explorer', subject: 'science',  url: 'videos/food-journey.mp4', poster: 'videos/food-journey.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'life-cycles',      emoji: '🐸', group: 'explorer', subject: 'science',  url: 'videos/life-cycles.mp4', poster: 'videos/life-cycles.jpg', lang: 'en', langs: ['fr', 'es'] },
    { id: 'day-and-night',    emoji: '🌗', group: 'explorer', subject: 'science',  url: 'videos/day-and-night.mp4', poster: 'videos/day-and-night.jpg', lang: 'en', langs: ['fr', 'es'] },
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
