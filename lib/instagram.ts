import { site } from "@/content/site";

/**
 * Accepts an Instagram post the way it usually gets pasted — the app's
 * "Copy link" share URL (with its ?igsh= tracking), a reel link, a link that
 * includes the username, or just the post code — and returns one clean
 * canonical URL: https://www.instagram.com/p/<code>/
 */
const POST_URL_RE =
  /^(?:https?:\/\/)?(?:www\.|m\.)?instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)/i;
const SHORTCODE_RE = /^[\w-]{6,}$/;

export function instagramPostUrl(raw: string): string {
  const value = raw.trim();

  const match = value.match(POST_URL_RE);
  if (match) {
    const kind = match[1].toLowerCase() === "reels" ? "reel" : match[1].toLowerCase();
    return `https://www.instagram.com/${kind}/${match[2]}/`;
  }
  if (SHORTCODE_RE.test(value)) {
    return `https://www.instagram.com/p/${value}/`;
  }

  // Fail the build rather than ship a link that quietly goes nowhere.
  throw new Error(
    `"${raw}" isn't an Instagram post link. Paste the post's link (https://www.instagram.com/p/…) or just its code.`,
  );
}

/**
 * Where a piece's Instagram link should go: its own post when one is set,
 * otherwise the studio profile. `isPost` lets the UI label it honestly.
 */
export function instagramLink(post?: string): { href: string; isPost: boolean } {
  return post
    ? { href: instagramPostUrl(post), isPost: true }
    : { href: site.instagramUrl, isPost: false };
}
