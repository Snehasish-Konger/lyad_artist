import Image from "next/image";
import Link from "next/link";
import { heroSlug, image } from "@/content/artworks";
import { site } from "@/content/site";

/**
 * Full-bleed opener, laid out differently at each end of the range because a
 * tall drawing and a tall phone don't crop the same way:
 *
 *   Desktop — the artwork runs off the right edge at full height, type set
 *             against paper on the left, feathered between them.
 *   Mobile  — the artwork takes a full-width band at the top, which crops it
 *             *vertically* into the subject rather than showing the blank
 *             paper margin around it; type sits below on clean paper.
 *
 * To change the piece, edit `heroSlug` in content/artworks.ts.
 * To use a looping timelapse instead, swap each <Image> for a muted, playsInline
 * autoplay <video> with the same classes — no layout changes needed.
 */
export function HomeHero() {
  const img = image(heroSlug);

  return (
    <section className="relative flex min-h-[100svh] flex-col md:block">
      {/* ── Mobile: artwork band ─────────────────────────────────────────── */}
      <div className="relative h-[54svh] w-full shrink-0 overflow-hidden bg-paper-deep md:hidden">
        <Image
          src={img.src}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={img.blurDataURL}
          className="object-cover object-[50%_18%]"
        />
        {/* Paper behind the header bar, so the nav stays legible over the art */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-paper via-paper/80 to-transparent"
        />
        {/* Feather into the type below */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent"
        />
      </div>

      {/* ── Desktop: artwork bleeding off the right edge ──────────────────── */}
      <div className="absolute inset-y-0 right-0 hidden w-[58%] overflow-hidden md:block">
        <Image
          src={img.src}
          alt=""
          fill
          priority
          sizes="58vw"
          placeholder="blur"
          blurDataURL={img.blurDataURL}
          className="object-cover object-[42%_28%]"
        />
        {/* Feather left into the paper column, and top/bottom into the page */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-paper via-paper/25 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-paper/85 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent"
        />
      </div>

      {/* ── Type ──────────────────────────────────────────────────────────── */}
      <div className="shell relative flex flex-1 flex-col justify-center py-14 md:min-h-[100svh] md:py-32">
        <div className="max-w-2xl md:max-w-md lg:max-w-lg">
          <p className="kicker">{site.location} — Commissions open</p>

          <h1 className="mt-6 font-serif text-display text-ink md:mt-7">
            Snehasish
            <br />
            Konger
          </h1>

          <p className="mt-7 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft md:mt-8 md:text-[1.1875rem]">
            {site.positioning}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-9 gap-y-4 md:mt-11">
            <Link
              href="/gallery"
              className="ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink"
            >
              See the work
            </Link>
            <Link
              href="/commission"
              className="ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-clay"
            >
              Commission a piece
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue — a rule that fades down, not an animated mouse icon */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-6 hidden h-16 w-px bg-gradient-to-b from-transparent to-ink-faint md:left-10 md:block xl:left-16"
      />
    </section>
  );
}
