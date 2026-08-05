/**
 * The four bodies of work. The `id` is used everywhere: gallery filters,
 * artwork entries, and the commission form's first step.
 *
 * Adding a fifth category means adding it here and using its id in
 * content/artworks.ts — the gallery filter bar and the commission form
 * both read from this list.
 */

export const categories = [
  {
    id: "devotional",
    label: "Devotional portraits",
    /** Short label for tight spaces (filter chips on mobile) */
    short: "Devotional",
    blurb:
      "Deities and gurus, drawn slowly. Graphite and digital ink, usually with the paper left showing through.",
  },
  {
    id: "pop-culture",
    label: "Anime & pop-culture",
    short: "Anime & pop",
    blurb:
      "Characters and faces from the things I grew up loving — Ghibli, Berserk, cinema, cricket.",
  },
  {
    id: "ink-portraits",
    label: "Pen-and-ink portraits",
    short: "Pen & ink",
    blurb:
      "Likenesses from your photographs. Line, hatching, and as much of the person as I can get onto the page.",
  },
  {
    id: "home-decor",
    label: "Home decor illustration",
    short: "Home decor",
    blurb:
      "Landscapes, still life and quiet pieces made to live on a wall rather than a phone screen.",
  },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export const categoryById = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, (typeof categories)[number]>;
