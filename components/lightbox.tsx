"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { image, type Artwork } from "@/content/artworks";
import { categoryById } from "@/content/categories";

/**
 * Full-screen detail view. Paper background rather than the usual black
 * overlay — the art should sit on a surface, not float in a void.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: Artwork[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const open = index !== null;
  const art = open ? items[index] : undefined;

  const go = useCallback(
    (delta: number) => {
      if (index === null || items.length === 0) return;
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, go]);

  return (
    <AnimatePresence>
      {open && art && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={art.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70] bg-paper"
        >
          {/* Click-away layer, behind the content */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 cursor-default"
            tabIndex={-1}
          />

          <div className="relative flex h-full flex-col">
            <div className="shell flex h-[4.5rem] shrink-0 items-center justify-between md:h-20">
              <span className="font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
                {index + 1} / {items.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous piece"
                  className="p-3 text-ink-muted transition-colors hover:text-ink"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next piece"
                  className="p-3 text-ink-muted transition-colors hover:text-ink"
                >
                  <ArrowRight className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="ml-3 p-3 text-ink-muted transition-colors hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="shell grid min-h-0 flex-1 gap-8 overflow-y-auto pb-12 lg:grid-cols-12 lg:gap-12 lg:overflow-hidden lg:pb-16">
              <motion.figure
                key={art.slug}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative min-h-[45svh] lg:col-span-8 lg:min-h-0"
              >
                <Image
                  src={image(art.slug).src}
                  alt={art.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  placeholder="blur"
                  blurDataURL={image(art.slug).blurDataURL}
                  className="object-contain object-center lg:object-left"
                  priority
                />
              </motion.figure>

              <div className="flex flex-col justify-center lg:col-span-4 lg:col-start-9">
                <p className="kicker">{categoryById[art.category].label}</p>
                <h2 className="mt-4 font-serif text-title leading-tight text-ink">{art.title}</h2>

                <dl className="mt-6 space-y-1.5 text-sm text-ink-muted">
                  {art.medium && (
                    <div className="flex gap-3">
                      <dt className="sr-only">Medium</dt>
                      <dd>{art.medium}</dd>
                    </div>
                  )}
                  {art.year && (
                    <div className="flex gap-3">
                      <dt className="sr-only">Year</dt>
                      <dd>{art.year}</dd>
                    </div>
                  )}
                </dl>

                {art.caption && (
                  <p className="mt-7 max-w-prose text-[1.0625rem] leading-relaxed text-ink-soft">
                    {art.caption}
                  </p>
                )}

                <div className="mt-9 flex flex-col items-start gap-4 border-t border-paper-edge pt-7">
                  {art.shopUrl ? (
                    <a
                      href={art.shopUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink"
                    >
                      Available in the shop ↗
                    </a>
                  ) : art.commissionable !== false ? (
                    <>
                      <p className="text-sm text-ink-muted">
                        Not for sale as a print — but this style is available as a commission.
                      </p>
                      <Link
                        href={`/commission?category=${art.category}&piece=${encodeURIComponent(
                          art.title,
                        )}`}
                        className="ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink"
                      >
                        Commission something like this
                      </Link>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
