import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { StructuredData } from "@/components/structured-data";
import { about } from "@/content/about";
import { RecentWorks } from "@/components/recent-works";
import { image, portraitSlug } from "@/content/artworks";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { personJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "About Snehasish Konger",
  description: about.teaser,
  path: "/about",
});

/** Pieces shown in the "lately" strip, in order. Any slug from artworks.ts. */
const recentWork = ["premanand-ji", "messi", "ganesha", "kolkata-tram"] as const;

/** The section id the strip sits under. */
const recentWorkAfter = "faces";

const bodyText = "text-[1.0625rem] leading-[1.85] text-ink-soft md:text-[1.125rem]";

export default function AboutPage() {
  const portrait = image(portraitSlug);

  return (
    <>
      <StructuredData schemas={[personJsonLd()]} />

      <PageHeader kicker="About" title="Snehasish Konger" lede={about.lede} />

      <div className="shell">
        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          {/* Portrait + facts rail */}
          <Reveal className="md:col-span-5 lg:col-span-4">
            <div className="md:sticky md:top-32">
              {/* Sized to the photo itself so the doodles at its edges aren't cropped. */}
              <div
                className="relative w-full overflow-hidden bg-paper-deep"
                style={{ aspectRatio: `${portrait.width} / ${portrait.height}` }}
              >
                <Image
                  src={portrait.src}
                  alt={`${site.name} at the desk, with Goku and Luffy doodled around the photo`}
                  fill
                  sizes="(max-width: 768px) 92vw, 34vw"
                  placeholder="blur"
                  blurDataURL={portrait.blurDataURL}
                  className="object-cover"
                  priority
                />
              </div>

              <p className="kicker mt-10">A little about the studio</p>
              <dl className="mt-5 divide-y divide-paper-edge border-y border-paper-edge">
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
              {about.intro.map((para, i) => (
                <Reveal key={i} delay={i * 0.04}>
                  <p
                    className={
                      i === 0
                        ? "font-serif text-[1.5rem] leading-[1.55] text-ink md:text-[1.75rem]"
                        : bodyText
                    }
                  >
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>

            {about.sections.map((section) => (
              <section key={section.id} className="mt-16 md:mt-20" aria-labelledby={section.id}>
                <Reveal>
                  <h2 id={section.id} className="font-serif text-heading leading-snug text-ink">
                    {section.heading}
                  </h2>
                </Reveal>
                <div className="mt-6 space-y-6">
                  {section.body.map((para, i) => (
                    <Reveal key={i} delay={i * 0.04}>
                      <p className={bodyText}>{para}</p>
                    </Reveal>
                  ))}
                </div>

                {/* Recent work, right after the paragraph about range */}
                {section.id === recentWorkAfter && (
                  // Not wrapped in <Reveal>: its transform would trap the
                  // lightbox's position: fixed inside this column.
                  <div className="mt-14">
                    <p className="kicker">On the drawing board lately</p>
                    <div className="mt-6">
                      <RecentWorks slugs={recentWork} />
                    </div>
                  </div>
                )}
              </section>
            ))}

            <Reveal className="my-16 border-l-2 border-clay pl-6 md:my-20 md:pl-8">
              <blockquote className="font-serif text-[1.5rem] leading-[1.45] text-ink md:text-[1.875rem]">
                {about.closing.quote}
              </blockquote>
            </Reveal>

            <Reveal className="mb-16">
              <p className={bodyText}>{about.closing.signoff}</p>
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
