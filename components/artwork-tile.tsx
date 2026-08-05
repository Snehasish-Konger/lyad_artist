"use client";

import Image from "next/image";
import { artworkAlt, image, type Artwork } from "@/content/artworks";
import { categoryById } from "@/content/categories";
import { cn } from "@/lib/utils";

/**
 * One piece in a grid. The whole tile is the button; the caption stays
 * permanently visible below the image rather than hiding under a hover
 * overlay — hover reveals nothing you'd miss on a touch device.
 */
export function ArtworkTile({
  artwork,
  onOpen,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className,
}: {
  artwork: Artwork;
  onOpen?: () => void;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const img = image(artwork.slug);

  return (
    <figure className={cn("group", className)}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${artwork.title}`}
        className="block w-full cursor-zoom-in overflow-hidden bg-paper-deep"
      >
        <div className="relative" style={{ aspectRatio: `${img.width} / ${img.height}` }}>
          <Image
            src={img.src}
            alt={artworkAlt(artwork)}
            fill
            sizes={sizes}
            placeholder="blur"
            blurDataURL={img.blurDataURL}
            priority={priority}
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />
          {/* A warm wash on hover — a tint, not a scrim */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-clay/0 transition-colors duration-700 group-hover:bg-clay/[0.07]"
          />
        </div>
      </button>

      <figcaption className="mt-3.5 flex items-baseline justify-between gap-4">
        <span className="font-serif text-lg leading-snug text-ink">{artwork.title}</span>
        <span className="shrink-0 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
          {categoryById[artwork.category].short}
        </span>
      </figcaption>
    </figure>
  );
}
