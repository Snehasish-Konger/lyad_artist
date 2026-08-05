"use client";

import Link from "next/link";
import { useState } from "react";
import { artworks, featuredArtworks } from "@/content/artworks";
import { categories } from "@/content/categories";
import { ArtworkTile } from "./artwork-tile";
import { Lightbox } from "./lightbox";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

/**
 * A handful of pieces across all four categories — not the gallery. Whichever
 * artworks are marked `featured: true` in content/artworks.ts show up here.
 */
export function SelectedWorks() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = featuredArtworks;

  return (
    <section className="shell py-28 md:py-40" aria-labelledby="selected-heading">
      <Reveal>
        <div className="flex flex-col gap-6 border-b border-paper-edge pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">Selected works</p>
            <h2
              id="selected-heading"
              className="mt-4 max-w-lg font-serif text-title leading-tight text-ink"
            >
              A few pieces, chosen because they&apos;re the ones I&apos;d show you first.
            </h2>
          </div>
          <Link
            href="/gallery"
            className="ink-link shrink-0 font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink"
          >
            See all {artworks.length} pieces
          </Link>
        </div>
      </Reveal>

      <RevealGroup className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
        {items.map((art, i) => (
          <RevealItem key={art.slug} className={i % 3 === 1 ? "lg:mt-16" : undefined}>
            <ArtworkTile
              artwork={art}
              onOpen={() => setOpenIndex(i)}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
            />
          </RevealItem>
        ))}
      </RevealGroup>

      {/* The four bodies of work, as a plain index rather than a card grid */}
      <Reveal className="mt-24 border-t border-paper-edge pt-10 md:mt-32">
        <p className="kicker">What I draw</p>
        <ul className="mt-7 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/gallery?c=${c.id}`} className="group block">
                <span className="font-serif text-xl leading-snug text-ink transition-colors duration-500 group-hover:text-clay">
                  {c.label}
                </span>
                <span className="mt-1.5 block text-sm leading-snug text-ink-muted">{c.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <Lightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </section>
  );
}
