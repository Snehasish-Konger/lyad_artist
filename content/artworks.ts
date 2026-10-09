import manifest from "./artwork-manifest.json";
import { categoryById, type CategoryId } from "./categories";

/**
 * ============================================================================
 * THE ARTWORK LIST
 * ============================================================================
 *
 * These pieces are the curated set from "Best Art collection" — this is the
 * whole gallery, not a sample of a bigger library.
 *
 * The images are real. Every TITLE, YEAR, MEDIUM and CAPTION below is a
 * PLACEHOLDER I guessed from looking at the picture. Correct them — the
 * captions in particular are where the site gets its voice. Nothing in app/ or
 * components/ needs touching when you edit this file.
 *
 * To add a piece:
 *   1. Drop the file in content/images/  (filename = slug, e.g. new-piece.png)
 *   2. npm run images
 *   3. Add an entry here with that slug
 *
 * Fields
 *   slug        matches the filename in content/images/ (required)
 *   title       shown in the lightbox and on hover
 *   category    one of the ids in content/categories.ts
 *   year        display only, string
 *   medium      e.g. "Graphite — Procreate", "Ink — Procreate"
 *   caption     1–3 sentences. Optional, but this is what makes a gallery
 *               feel like a person made it. Leave it out rather than pad it.
 *   featured    true = appears in Selected Works on the home page
 *   shopUrl     any non-empty string = this exact piece is for sale. The
 *               lightbox then shows "Order it" with a choice of WhatsApp or
 *               Instagram DM — see components/order-choice.tsx.
 *   commissionable  set false to hide the "available as a commission" line
 *   instagramPost   the piece's own Instagram post. Paste it however you
 *               have it: the app's "Copy link" URL (tracking bits are
 *               stripped), a reel link, or just the code after /p/. Used by
 *               "View on Instagram" in the lightbox and "View post" in the
 *               Instagram section. Leave it out and both link to the
 *               profile instead. A malformed value fails the build.
 * ============================================================================
 */

export type Artwork = {
  slug: string;
  title: string;
  category: CategoryId;
  year?: string;
  medium?: string;
  caption?: string;
  featured?: boolean;
  shopUrl?: string;
  commissionable?: boolean;
  instagramPost?: string;
};

export const artworks: Artwork[] = [
  // ── Devotional portraits ──────────────────────────────────────────────────
  {
    slug: "ganesha",
    title: "Ganesha",
    category: "devotional",
    year: "2026",
    medium: "Ink — Procreate",
    caption:
      "Parashu raised, pasha in the other hand, one foot on the rock. The warrior Ganesha rather than the one seated on a lotus.",
    // TODO: paste this piece's post link — until then it links to the profile.
    // instagramPost: "https://www.instagram.com/p/XXXXXXXXXXX/",
    commissionable: true,
  },
  {
    slug: "premanand-ji",
    title: "Premanand Ji Maharaj",
    category: "devotional",
    year: "2025",
    medium: "Graphite with gold — Procreate",
    caption: "Folded hands, and a beard I spent most of a weekend inside.",
    featured: true,
    commissionable: true,
  },
  {
    slug: "vishwarupa",
    title: "Vishwarupa",
    category: "devotional",
    year: "2025",
    medium: "Graphite — Procreate",
    caption:
      "The universal form, left deliberately unfinished at the edges so the page still breathes.",
    commissionable: true,
  },
  {
    slug: "kurukshetra",
    title: "Kurukshetra",
    category: "devotional",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "Arjuna's chariot, the moment before the argument that becomes the Gita.",
    commissionable: true,
  },

  // ── Anime & pop-culture ───────────────────────────────────────────────────
  {
    slug: "setsuko",
    title: "Setsuko",
    category: "pop-culture",
    year: "2025",
    medium: "Digital — Procreate",
    caption:
      "Grave of the Fireflies. The parasol was the whole reason for the drawing — everything else followed it.",
    featured: true,
    commissionable: true,
  },
  {
    slug: "miyazaki",
    title: "Miyazaki",
    category: "pop-culture",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "The man who is responsible for most of why I draw at all.",
    commissionable: true,
  },
  {
    slug: "the-wind-rises",
    title: "The Wind Rises",
    category: "pop-culture",
    year: "2025",
    medium: "Digital — Procreate",
    caption: "Jiro and Naoko at the window. A study in flat colour and restraint.",
    commissionable: true,
  },
  {
    slug: "dhurandhar-studies",
    title: "Dhurandhar — Studies",
    category: "pop-culture",
    year: "2026",
    medium: "Graphite — Procreate",
    caption: "Seven passes at the same face until one of them finally looked back.",
    featured: true,
    commissionable: true,
  },
  {
    slug: "the-potions-master",
    title: "The Potions Master",
    category: "pop-culture",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "Snape, drawn the way I remember him from the books rather than the films.",
    commissionable: true,
  },
  {
    slug: "the-white-wolf",
    title: "The White Wolf",
    category: "pop-culture",
    year: "2024",
    medium: "Ink — Procreate",
    caption: "Loose line work, the smoke left as negative space.",
    commissionable: true,
  },
  {
    slug: "jim-carrey",
    title: "Jim Carrey",
    category: "pop-culture",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "A face that is almost entirely made of teeth and creases, which is a gift.",
    commissionable: true,
  },
  {
    slug: "emma-watson",
    title: "Emma Watson",
    category: "pop-culture",
    year: "2025",
    medium: "Graphite — Procreate",
    commissionable: true,
  },
  {
    slug: "odyssey",
    title: "Odyssey",
    category: "pop-culture",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "Two of them, side by side, looking at different things.",
    commissionable: true,
  },
  {
    slug: "the-run-up",
    title: "The Run-Up",
    category: "pop-culture",
    year: "2025",
    medium: "Digital — Procreate",
    caption: "That action, from the reference frame everyone already has in their head.",
    commissionable: true,
  },
  {
    slug: "eighteen",
    title: "Eighteen",
    category: "pop-culture",
    year: "2025",
    medium: "Graphite — Procreate",
    commissionable: true,
  },
  {
    slug: "haaland",
    title: "Haaland",
    category: "pop-culture",
    year: "2025",
    medium: "Graphite — Procreate",
    commissionable: true,
  },
  {
    slug: "messi",
    title: "Messi",
    category: "pop-culture",
    year: "2026",
    medium: "Ink — Procreate",
    caption: "The eyes were the whole job. Get those right and the beard just follows.",
    featured: true,
    commissionable: true,
  },
  {
    slug: "ithaca",
    title: "Ithaca",
    category: "pop-culture",
    year: "2026",
    medium: "Ink — Procreate",
    caption:
      "Odysseus and Penelope, drawn back to back on the same page — him already home in his head, her still deciding whether to believe it.",
    commissionable: true,
  },

  // ── Pen-and-ink portraits ─────────────────────────────────────────────────
  {
    slug: "uttam-kumar",
    title: "Uttam Kumar",
    category: "ink-portraits",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "Mahanayak, with a cigarette and a room behind him.",
    featured: true,
    commissionable: true,
  },
  {
    slug: "ha-yuk",
    title: "Ha-yuk",
    category: "ink-portraits",
    year: "2025",
    medium: "Graphite — Procreate",
    caption:
      "A commission from a photograph a parent sent me. Drawn from the reference in the corner — that's usually all I need.",
    featured: true,
    commissionable: true,
  },
  {
    slug: "asha-bhosle",
    title: "Asha Bhosle",
    category: "ink-portraits",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "Soft pencil, almost no line. Her whole face is in the smile.",
    commissionable: true,
  },
  {
    slug: "manmohan-singh",
    title: "Dr. Manmohan Singh",
    category: "ink-portraits",
    year: "2025",
    medium: "Ink — Procreate",
    caption: "Pure contour line. Nothing shaded, nothing hidden.",
    commissionable: true,
  },
  {
    slug: "sunday-braid",
    title: "Sunday Braid",
    category: "ink-portraits",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "Loose hair, a bindi, and the light coming from somewhere off to the left.",
    commissionable: true,
  },
  {
    slug: "the-two-of-them",
    title: "The Two of Them",
    category: "ink-portraits",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "Drawn from a phone photo someone almost deleted.",
    commissionable: true,
  },
  {
    slug: "first-tears",
    title: "First Tears",
    category: "ink-portraits",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "Babies are all soft edges and no lines, which makes them terrifying to draw.",
    commissionable: true,
  },
  {
    slug: "little-one",
    title: "Little One",
    category: "ink-portraits",
    year: "2025",
    medium: "Ink — Procreate",
    caption: "Every fold of the dress, one line at a time.",
    commissionable: true,
  },
  {
    slug: "quiet-morning",
    title: "Quiet Morning",
    category: "ink-portraits",
    year: "2025",
    medium: "Graphite — Procreate",
    commissionable: true,
  },
  {
    slug: "freckles",
    title: "Freckles",
    category: "ink-portraits",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "Freckles are the one thing you cannot fake — either you count them or you don't.",
    commissionable: true,
  },
  {
    slug: "in-a-scarf",
    title: "In a Scarf",
    category: "ink-portraits",
    year: "2025",
    medium: "Graphite — Procreate",
    commissionable: true,
  },
  {
    slug: "the-long-sunday",
    title: "The Long Sunday",
    category: "ink-portraits",
    year: "2026",
    medium: "Graphite — Procreate",
    caption: "Someone mid-sentence, holding a mug, not looking at the camera.",
    commissionable: true,
  },
  {
    slug: "line-study",
    title: "Line Study",
    category: "ink-portraits",
    year: "2025",
    medium: "Ink — Procreate",
    caption: "Barely there. I stopped before I could ruin it.",
    commissionable: true,
  },
  {
    slug: "cartoonify",
    title: "Cartoonify",
    category: "ink-portraits",
    year: "2025",
    medium: "Digital — Procreate",
    caption:
      "The flat, friendly version — good for profile pictures and for people who don't want to be looked at that closely.",
    commissionable: true,
  },

  // ── Home decor illustration ───────────────────────────────────────────────
  {
    slug: "kolkata-tram",
    title: "Route 6, Gariahat–Esplanade",
    category: "home-decor",
    year: "2026",
    medium: "Ink — Procreate",
    caption:
      "Car 248 on the Kolkata tram line. Drawn mostly for the overhead wire, the grilles and the dents in the paint.",
    // TODO: paste this piece's post link — until then it links to the profile.
    // instagramPost: "https://www.instagram.com/p/XXXXXXXXXXX/",
    commissionable: true,
  },
  {
    slug: "no-sugar",
    title: "No Sugar",
    category: "home-decor",
    year: "2025",
    medium: "Graphite — Procreate",
    caption:
      "A can and a hand, drawn on a grid so I couldn't cheat the perspective. The most looked-at thing I've made.",
    featured: true,
    commissionable: true,
  },
  {
    slug: "valley-crossing",
    title: "Valley Crossing",
    category: "home-decor",
    year: "2025",
    medium: "Digital — Procreate",
    caption: "Painted for a living-room wall that needed something to look into.",
    featured: true,
    commissionable: true,
  },
  {
    slug: "far-outpost",
    title: "Far Outpost",
    category: "home-decor",
    year: "2025",
    medium: "Ink — Procreate",
    caption: "A whole afternoon of hatching. The planet was the last thing I put in.",
    commissionable: true,
  },
  {
    slug: "weightless",
    title: "Weightless",
    category: "home-decor",
    year: "2025",
    medium: "Graphite — Procreate",
    caption: "No background at all, so there's nothing to tell you which way is up.",
    commissionable: true,
  },
  {
    slug: "the-reading-room",
    title: "The Reading Room",
    category: "home-decor",
    year: "2025",
    medium: "Digital — Procreate",
    caption: "Flat colour, one lamp, a clock that's slightly wrong.",
    commissionable: true,
  },
  {
    slug: "afternoon-with-a-cat",
    title: "Afternoon With a Cat",
    category: "home-decor",
    year: "2025",
    medium: "Digital — Procreate",
    commissionable: true,
  },
];

/**
 * The photo behind the home page hero — a real photograph of you, not an
 * artwork. Square crop, so the hero's object-position values assume a
 * roughly centered face.
 */
export const heroSlug = "hero-photo";

/**
 * The photo on the About page.
 */
export const portraitSlug = "studio-portrait";

/**
 * The image in the home page's "About teaser" section, just below Selected
 * Works. Deliberately a piece of art rather than another photo of you — the
 * hero right above it already carries the personal photo, so repeating it a
 * few hundred pixels later would read as redundant.
 */
export const aboutTeaserSlug = "far-outpost";

// ── Helpers ─────────────────────────────────────────────────────────────────

type ManifestEntry = { src: string; width: number; height: number; blurDataURL: string };
const images = manifest as Record<string, ManifestEntry>;

/** Image data (src / dimensions / blur) generated by `npm run images`. */
export function image(slug: string): ManifestEntry {
  const found = images[slug];
  if (!found) {
    throw new Error(
      `No image for slug "${slug}". Add content/images/${slug}.<ext> and run \`npm run images\`.`,
    );
  }
  return found;
}

export function artworkBySlug(slug: string) {
  return artworks.find((a) => a.slug === slug);
}

/**
 * Descriptive alt text — category and medium give search engines and screen
 * readers something concrete, rather than just a proper noun. Composed from
 * existing fields so it stays correct automatically as titles/captions get
 * rewritten; no per-image alt copy to maintain separately.
 */
export function artworkAlt(a: Artwork): string {
  const category = categoryById[a.category].label.toLowerCase();
  const medium = a.medium ? `, ${a.medium.toLowerCase()}` : "";
  return `${a.title} — ${category}${medium}`;
}

export const featuredArtworks = artworks.filter((a) => a.featured);

export function artworksByCategory(id: CategoryId) {
  return artworks.filter((a) => a.category === id);
}
