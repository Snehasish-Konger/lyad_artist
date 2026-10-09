"use client";

import { useState } from "react";
import { artworkBySlug, type Artwork } from "@/content/artworks";
import { ArtworkTile } from "./artwork-tile";
import { Lightbox } from "./lightbox";

/**
 * A small two-column set of pieces dropped into a reading column (the About
 * page). Each tile opens the same lightbox as the gallery.
 */
export function RecentWorks({ slugs }: { slugs: readonly string[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = slugs
    .map((slug) => artworkBySlug(slug))
    .filter((a): a is Artwork => Boolean(a));

  return (
    <>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10">
        {items.map((art, i) => (
          <ArtworkTile
            key={art.slug}
            artwork={art}
            onOpen={() => setOpenIndex(i)}
            sizes="(max-width: 768px) 45vw, 24vw"
          />
        ))}
      </div>

      <Lightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
