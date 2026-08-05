/**
 * ============================================================================
 * SHOP PREVIEW — PLACEHOLDER COPY
 * ============================================================================
 * This page does NOT sell anything or link to Shopify. Each card's "Order it"
 * button copies a ready-made message and opens a DM to @lyad_artist on
 * Instagram — see components/order-on-instagram.tsx for why it works that
 * way instead of a prefilled link.
 *
 * The `image` field is any slug present in content/images/.
 * ============================================================================
 */

export const shopSections = [
  {
    title: "Prints",
    image: "far-outpost",
    blurb:
      "Giclée prints on textured cotton rag, in a few standard sizes. The ink landscapes work best large.",
    note: "From ₹—",
  },
  {
    title: "Originals",
    image: "no-sugar",
    blurb:
      "One-of-one pieces on paper. When a piece is gone it's gone — most of these never come back in stock.",
    note: "Limited",
  },
  {
    title: "Devotional prints",
    image: "premanand-ji",
    blurb: "Deities and saints — sized for a puja room wall or a shelf.",
    note: "Best sellers",
  },
  {
    title: "Home decor",
    image: "valley-crossing",
    blurb: "Landscapes, animals and quiet pieces made to hang somewhere you sit often.",
    note: "New",
  },
] as const;
