/**
 * Site-wide constants. Change things here, not in the components.
 */

export const site = {
  /** The studio/site identity — nav wordmark, <title>, footer, metadata. */
  brand: "S. Konger Arts",

  /** The artist's full name — used in bio copy, author fields, alt text. */
  name: "Snehasish Konger",

  handle: "lyad_artist",
  instagramUrl: "https://instagram.com/lyad_artist",
  email: "studio@snehasishkonger.com",
  location: "Gurugram, India",
  shipping: "Ships anywhere in India",

  /** One line, used in the hero and as the meta description base. */
  positioning:
    "Devotional portraits, pen-and-ink likenesses and fan art — drawn one commission at a time.",

  /** Used for canonical URLs, sitemap and OG tags. This site is the primary
   *  home — there is no separate storefront domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://snehasishkonger.com",
} as const;

export const nav = [
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/commission", label: "Commission" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
] as const;
