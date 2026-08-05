"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { artworks } from "@/content/artworks";
import { categories, type CategoryId } from "@/content/categories";
import { ArtworkTile } from "./artwork-tile";
import { Lightbox } from "./lightbox";
import { cn } from "@/lib/utils";

type Filter = CategoryId | "all";

export function GalleryGrid({ initialFilter = "all" }: { initialFilter?: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? artworks : artworks.filter((a) => a.category === filter)),
    [filter],
  );

  const active = filter === "all" ? null : categories.find((c) => c.id === filter);

  return (
    <>
      {/* ── Filter bar ─────────────────────────────────────────────────────
          Scrolls sideways on narrow screens. Short labels below lg keep it
          from overflowing on a phone; a fade on the right edge signals that
          there's more to swipe to. */}
      <div className="relative border-y border-paper-edge">
        <div
          className="no-scrollbar -mx-6 flex gap-7 overflow-x-auto px-6 md:mx-0 md:gap-9 md:px-0"
          role="tablist"
          aria-label="Filter artwork by category"
        >
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Everything"
            short="All"
            count={artworks.length}
          />
          {categories.map((c) => (
            <FilterButton
              key={c.id}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
              label={c.label}
              short={c.short}
              count={artworks.filter((a) => a.category === c.id).length}
            />
          ))}
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-px right-0 w-12 bg-gradient-to-l from-paper to-transparent lg:hidden"
        />
      </div>

      {/* Category blurb — gives each filter a sentence rather than just a count */}
      <div className="min-h-[3.5rem] pt-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={filter}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl text-ink-muted"
          >
            {active
              ? active.blurb
              : "Everything, most recent first. Click any piece to see it properly."}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Masonry ────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 columns-1 gap-x-6 sm:columns-2 md:gap-x-8 lg:columns-3 lg:gap-x-10"
        >
          {visible.map((art, i) => (
            <div key={art.slug} className="mb-12 break-inside-avoid md:mb-16">
              <ArtworkTile
                artwork={art}
                onOpen={() => setOpenIndex(i)}
                priority={i < 3}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {visible.length === 0 && (
        <p className="py-24 text-center text-ink-muted">Nothing in this category yet.</p>
      )}

      <Lightbox
        items={visible}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  short,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  short: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "group relative shrink-0 whitespace-nowrap py-5 font-sans text-[0.8125rem] uppercase tracking-[0.14em] transition-colors duration-300",
        active ? "text-ink" : "text-ink-faint hover:text-ink-soft",
      )}
    >
      <span className="lg:hidden">{short}</span>
      <span className="hidden lg:inline">{label}</span>
      <sup className="ml-1.5 text-[0.625rem] tracking-normal text-ink-faint">{count}</sup>
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 -bottom-px h-px origin-left bg-clay transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active ? "scale-x-100" : "scale-x-0",
        )}
      />
    </button>
  );
}
