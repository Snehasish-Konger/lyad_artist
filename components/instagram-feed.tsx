import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { artworkAlt, artworks, heroSlug, image } from "@/content/artworks";
import { instagramLink } from "@/lib/instagram";

/**
 * ============================================================================
 * INSTAGRAM FEED
 * ============================================================================
 * The official Instagram Graph API needs a Meta app review, which isn't worth
 * it for a one-person studio. Instead this reads a JSON feed from Behold.so,
 * which handles the OAuth on their side.
 *
 * SETUP (about five minutes)
 *   1. Sign up at https://behold.so and connect @lyad_artist
 *   2. Create a feed, open it, copy the feed ID from the JSON endpoint
 *      (https://feeds.behold.so/XXXXXXXXXXXX  ->  the XXXXXXXXXXXX part)
 *   3. Put it in .env.local as NEXT_PUBLIC_BEHOLD_FEED_ID
 *
 * Until then the section falls back to recent pieces from content/artworks.ts,
 * so the page never renders an empty hole.
 *
 * Note this deliberately does NOT use Behold's <script> widget: fetching the
 * JSON lets the posts be styled like the rest of the site instead of arriving
 * inside someone else's chrome. If you'd rather use a script widget (SnapWidget,
 * LightWidget, Elfsight), drop it into <ScriptEmbedSlot /> at the bottom of
 * this file and render that instead.
 * ============================================================================
 */

type BeholdPost = {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  caption?: string;
  mediaType?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  sizes?: { small?: { mediaUrl?: string }; medium?: { mediaUrl?: string } };
};

type Post = {
  key: string;
  src: string;
  href: string;
  /** false = no post link for this piece, so href is the profile. */
  isPost: boolean;
  alt: string;
  remote: boolean;
  blurDataURL?: string;
  /** Passed to the commission form so the message arrives with a reference. */
  reference: string;
};

const FEED_ID = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID;

async function loadPosts(limit: number): Promise<{ posts: Post[]; live: boolean }> {
  if (FEED_ID) {
    try {
      const res = await fetch(`https://feeds.behold.so/${FEED_ID}`, {
        // Instagram doesn't change minute to minute; an hour is plenty.
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const json = await res.json();
        const raw: BeholdPost[] = Array.isArray(json) ? json : (json.posts ?? []);
        if (raw.length > 0) {
          return {
            live: true,
            posts: raw.slice(0, limit).map((p) => ({
              key: p.id,
              src: p.sizes?.medium?.mediaUrl ?? p.thumbnailUrl ?? p.mediaUrl,
              href: p.permalink,
              isPost: true,
              alt: p.caption?.slice(0, 120) ?? `Post by @${site.handle}`,
              remote: true,
              reference: p.permalink,
            })),
          };
        }
      }
    } catch {
      // Network hiccup or a bad feed id — fall through to the local set rather
      // than failing the whole page render.
    }
  }

  // Fallback: recent work (newest year first), skipping anything already
  // shown in Selected Works or the hero so the home page doesn't repeat itself.
  return {
    live: false,
    posts: artworks
      .filter((a) => !a.featured && a.slug !== heroSlug)
      .sort((a, b) => (b.year ?? "").localeCompare(a.year ?? ""))
      .slice(0, limit)
      .map((a) => {
        const img = image(a.slug);
        const instagram = instagramLink(a.instagramPost);
        return {
          key: a.slug,
          src: img.src,
          href: instagram.href,
          isPost: instagram.isPost,
          alt: artworkAlt(a),
          remote: false,
          blurDataURL: img.blurDataURL,
          reference: instagram.isPost ? instagram.href : `${a.title} (from the site gallery)`,
        };
      }),
  };
}

export async function InstagramFeed({
  limit = 6,
  heading = "From the feed",
}: {
  limit?: number;
  heading?: string;
}) {
  const { posts, live } = await loadPosts(limit);

  return (
    <section className="shell py-24 md:py-36" aria-labelledby="instagram-heading">
      <div className="flex flex-col gap-4 border-b border-paper-edge pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker">Instagram</p>
          <h2 id="instagram-heading" className="mt-4 font-serif text-title leading-tight text-ink">
            {heading}
          </h2>
        </div>
        <div className="flex flex-col gap-1 md:items-end">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink"
          >
            @{site.handle} ↗
          </a>
          <p className="text-sm text-ink-faint">
            {live ? "Updated hourly" : "Showing recent work — connect the feed to go live"}
          </p>
        </div>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-6">
        {posts.map((post) => (
          <li key={post.key} className="group relative aspect-square overflow-hidden bg-paper-deep">
            <Image
              src={post.src}
              alt={post.alt}
              fill
              unoptimized={post.remote && !post.src.startsWith("/")}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              placeholder={post.blurDataURL ? "blur" : "empty"}
              blurDataURL={post.blurDataURL}
              className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />

            {/* Two ways out of every post: look at it, or order one like it.
                Revealed on hover with a mouse; always shown on touch screens,
                which have no hover — otherwise a tap lands on an invisible
                button. */}
            <div className="absolute inset-0 flex flex-col justify-end gap-px bg-ink/0 p-2 opacity-0 transition-all duration-500 group-hover:bg-ink/45 group-hover:opacity-100 focus-within:bg-ink/45 focus-within:opacity-100 [@media(hover:none)]:opacity-100">
              <a
                href={post.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={post.isPost ? `View post: ${post.alt}` : `See more on @${site.handle}`}
                className="bg-paper/95 px-2.5 py-2 text-center font-sans text-[0.625rem] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-paper"
              >
                {post.isPost ? "View post" : "On Instagram"}
              </a>
              <Link
                href={`/commission?ref=${encodeURIComponent(post.reference)}`}
                className="bg-ink px-2.5 py-2 text-center font-sans text-[0.625rem] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-clay"
              >
                Order this
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-lg text-sm leading-relaxed text-ink-muted">
        Seen something on Instagram you want a version of? Tap{" "}
        <span className="text-ink">Order this</span> on any post — or paste the post link straight
        into the{" "}
        <Link href="/commission" className="ink-link text-ink">
          commission form
        </Link>
        .
      </p>
    </section>
  );
}

/**
 * Drop-in slot for a third-party script widget (SnapWidget / LightWidget /
 * Elfsight) if you'd rather not use the Behold JSON route. Paste the provider's
 * embed markup inside and render <ScriptEmbedSlot /> in place of <InstagramFeed />.
 *
 * Remember to add the provider's domain to next.config.mjs if it serves images.
 */
export function ScriptEmbedSlot() {
  return (
    <section className="shell py-24 md:py-36">
      <div
        className="[&_iframe]:!w-full [&_iframe]:!border-0"
        // Paste provider embed markup here, e.g.:
        // dangerouslySetInnerHTML={{ __html: `<iframe src="https://snapwidget.com/embed/..." />` }}
      />
    </section>
  );
}
