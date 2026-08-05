/**
 * Site-wide constants. Change things here, not in the components.
 */

export const site = {
  name: "Snehasish Konger",
  handle: "lyad_artist",
  instagramUrl: "https://instagram.com/lyad_artist",
  shopUrl: "https://snehasishkonger.com",
  email: "studio@snehasishkonger.com",
  location: "Gurugram, India",
  shipping: "Ships anywhere in India",

  /** One line, used in the hero and as the meta description base. */
  positioning:
    "Devotional portraits, pen-and-ink likenesses and fan art — drawn one commission at a time.",

  /** Used for canonical URLs, sitemap and OG tags. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://studio.snehasishkonger.com",
} as const;

export const nav = [
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/commission", label: "Commission" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
] as const;
