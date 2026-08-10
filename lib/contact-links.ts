import { site } from "@/content/site";

/**
 * wa.me and t.me both support a pre-filled message via `?text=`, unlike a
 * plain Instagram profile link — that's the whole reason these replaced the
 * "copy to clipboard, then open Instagram DM" flow for ordering artwork.
 */
export function waLink(message: string): string | null {
  if (!site.whatsappNumber) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function telegramLink(message: string): string | null {
  if (!site.telegramUsername) return null;
  return `https://t.me/${site.telegramUsername}?text=${encodeURIComponent(message)}`;
}
