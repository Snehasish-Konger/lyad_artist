import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { about } from "@/content/about";
import { image, portraitSlug, artworkBySlug } from "@/content/artworks";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.teaser,
  alternates: { canonical: "/about" },
};

/** Two pieces shown mid-page as process examples. Any slug from artworks.ts. */
const processPieces = ["manmohan-singh", "premanand-ji"];

export default function AboutPage() {
  const portrait = image(portraitSlug);

  return (
    <>
      <PageHeader kicker="About" title="Snehasish Konger" lede={about.lede} />

      <div className="shell">
        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          {/* Portrait + facts rail */}
          <Reveal className="md:col-span-5 lg:col-span-4">
            <div className="md:sticky md:top-32">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep">
                <Image
                  src={portrait.src}
                  alt={site.name}
                  fill
                  sizes="(max-width: 768px) 92vw, 34vw"
                  placeholder="blur"
                  blurDataURL={portrait.blurDataURL}
                  className="object-cover"
                  priority
                />
              </div>

              <dl className="mt-10 divide-y divide-paper-edge border-y border-paper-edge">
                {about.facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-3 gap-4 py-4">
                    <dt className="col-span-1 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
                      {f.label}
                    </dt>
                    <dd className="col-span-2 text-sm leading-relaxed text-ink-soft">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Body */}
          <div className="md:col-span-6 md:col-start-7">
            <div className="space-y-8">
              {about.body.map((para, i) => (
                <Reveal key={i} delay={i * 0.04}>
                  <p
                    className={
                      i === 0
                        ? "font-serif text-[1.5rem] leading-[1.55] text-ink md:text-[1.75rem]"
                        : "text-[1.0625rem] leading-[1.85] text-ink-soft md:text-[1.125rem]"
                    }
                  >
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Process pieces, dropped into the reading column */}
            <Reveal className="my-16 grid grid-cols-2 gap-5">
              {processPieces.map((slug) => {
                const img = image(slug);
                const art = artworkBySlug(slug);
                return (
                  <figure key={slug}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
                      <Image
                        src={img.src}
                        alt={art?.title ?? ""}
                        fill
                        sizes="(max-width: 768px) 45vw, 24vw"
                        placeholder="blur"
                        blurDataURL={img.blurDataURL}
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="mt-2.5 text-sm text-ink-faint">
                      {art?.title} — {art?.medium}
                    </figcaption>
                  </figure>
                );
              })}
            </Reveal>

            <Reveal className="border-t border-paper-edge pt-10">
              <p className="font-serif text-heading leading-snug text-ink">
                If any of this sounds like the thing you&apos;ve been meaning to get made — tell me
                about it.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-9 gap-y-4">
                <Link
                  href="/commission"
                  className="ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink"
                >
                  Commission a piece
                </Link>
                <Link
                  href="/gallery"
                  className="ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink-muted"
                >
                  See the gallery
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
