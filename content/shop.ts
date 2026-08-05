import { site } from "./site";

/**
 * ============================================================================
 * SHOP PREVIEW — PLACEHOLDER LINKS
 * ============================================================================
 * This page does NOT sell anything. It's a window onto the Shopify store at
 * snehasishkonger.com. Every `href` below is a guess at your collection URL —
 * replace each one with the real collection link from your Shopify admin
 * (Products → Collections → the collection's "View" URL).
 *
 * The `image` field is any slug present in content/images/.
 * ============================================================================
 */

export const shopSections = [
  {
    title: "Prints",
    href: `${site.shopUrl}/collections/prints`,
    image: "far-outpost",
    blurb:
      "Giclée prints on textured cotton rag, in a few standard sizes. The ink landscapes work best large.",
    note: "From ₹—",
  },
  {
    title: "Originals",
    href: `${site.shopUrl}/collections/originals`,
    image: "no-sugar",
    blurb:
      "One-of-one pieces on paper. When a piece is gone it's gone — most of these never come back in stock.",
    note: "Limited",
  },
  {
    title: "Devotional prints",
    href: `${site.shopUrl}/collections/devotional`,
    image: "premanand-ji",
    blurb:
      "Deities and saints — sized for a puja room wall or a shelf.",
    note: "Best sellers",
  },
  {
    title: "Home decor",
    href: `${site.shopUrl}/collections/home-decor`,
    image: "valley-crossing",
    blurb: "Landscapes, animals and quiet pieces made to hang somewhere you sit often.",
    note: "New",
  },
] as const;
