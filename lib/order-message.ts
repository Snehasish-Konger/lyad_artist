import { site } from "@/content/site";

/**
 * There's no per-artwork URL (the gallery is one page with a client-side
 * lightbox, not individual routes) — so the "link to the artwork's page"
 * points at the gallery, and the title in the message does the rest of the
 * identifying work.
 */
export function buildOrderMessage(title: string) {
  return `Hi! I'd like to order this piece: ${title} — ${site.url}/gallery`;
}
