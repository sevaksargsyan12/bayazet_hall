export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bayazethall.com";

export const SITE_NAME = "Bayazet Hall";

// Bayazet Hall's Google Place ID — opens Google's "write a review" flow
// directly, rather than the general Maps listing page.
export const GOOGLE_PLACE_ID = "ChIJk-Th0q8NQEAR4u31Hnu6dUs";
export const GOOGLE_REVIEWS_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;

export const DEFAULT_META_DESCRIPTION =
  "Bayazet Hall — հարսանիքների և միջոցառումների սրահ Գավառում, Հայաստանում։ Փաթեթներ, գներ և առցանց ամրագրում։";

// User-specified keywords, plus a small set of geo/business-name variants
// covering the same intents (Armenian + English, hall name transliteration).
// Kept short and on-topic — a long stuffed list has no SEO benefit.
export const SEO_KEYWORDS = [
  "Հարսանյաց սրահ",
  "Հարսանյաց սրահ Հայաստանում",
  "Հարսանյաց սրահ Հայաստանում Գավառում",
  "Միջոցառումների սրահ",
  "Բանկետային դահլիճ",
  "Հարսանիքի կազմակերպում Գավառում",
  "Բայազետ հոլ",
  "Bayazet Hall",
  "Wedding hall Armenia",
  "Wedding venue Gavar",
  "Event hall Armenia",
  "Banquet hall Gavar Armenia",
];
