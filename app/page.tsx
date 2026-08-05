import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import { SelectedWorks } from "@/components/selected-works";
import { InstagramFeed } from "@/components/instagram-feed";
import { Reveal } from "@/components/reveal";
import { StructuredData } from "@/components/structured-data";
import { about } from "@/content/about";
import { aboutTeaserSlug, artworkAlt, artworkBySlug, image } from "@/content/artworks";
import { site } from "@/content/site";
import { personJsonLd, localBusinessJsonLd } from "@/lib/structured-data";

const homeTitle = `${site.brand} | Custom Portraits & Illustration by ${site.name}`;
const homeDescription =
  "Commission a custom portrait, or browse devotional art, pen-and-ink likenesses and fan art by Snehasish Konger — the artist behind S. Konger Arts, based in Gurugram, India.";

// Bypasses the layout's title template (Home's title IS the site's default
// title, so appending " — S. Konger Arts" again would duplicate the brand).
export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: { title: homeTitle, description: homeDescription, url: "/" },
  twitter: { card: "summary_large_image", title: homeTitle, description: homeDescription },
};

export default function HomePage() {
  const teaserImage = image(aboutTeaserSlug);
  const teaserArtwork = artworkBySlug(aboutTeaserSlug);

  return (
    <>
      <StructuredData schemas={[personJsonLd(), localBusinessJsonLd()]} />

      <HomeHero />

      <SelectedWorks />

      {/* ── About teaser ───────────────────────────────────────────────────── */}
      <section className="shell py-24 md:py-36" aria-labelledby="about-teaser-heading">
        <div className="grid items-center gap-14 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5 lg:col-span-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep">
              <Image
                src={teaserImage.src}
                alt={teaserArtwork ? artworkAlt(teaserArtwork) : ""}
                fill
                sizes="(max-width: 768px) 92vw, 34vw"
                placeholder="blur"
                blurDataURL={teaserImage.blurDataURL}
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
            <p className="kicker">About</p>
            <h2
              id="about-teaser-heading"
              className="mt-5 font-serif text-title leading-tight text-ink"
            >
              Drawn by hand, one at a time.
            </h2>
            <p className="mt-7 max-w-lg text-[1.125rem] leading-relaxed text-ink-soft">
              {about.teaser}
            </p>
            <Link
              href="/about"
              className="ink-link mt-9 inline-block font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink"
            >
              More about the work
            </Link>
          </Reveal>
        </div>
      </section>

      <InstagramFeed limit={6} heading="What I've been drawing lately" />

      {/* ── Closing CTA — two doors ────────────────────────────────────────── */}
      <section className="shell pb-8 pt-8 md:pb-16" aria-labelledby="cta-heading">
        <Reveal>
          <h2
            id="cta-heading"
            className="max-w-2xl font-serif text-title leading-tight text-ink"
          >
            Two ways in.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px border border-paper-edge bg-paper-edge md:grid-cols-2">
          <Reveal className="bg-paper-raised/60">
            <Link
              href="/commission"
              className="group flex h-full flex-col justify-between gap-10 p-9 transition-colors duration-700 hover:bg-paper-deep/70 md:p-14"
            >
              <div>
                <p className="kicker">Commission</p>
                <p className="mt-5 font-serif text-heading leading-snug text-ink">
                  Something made for you
                </p>
                <p className="mt-4 max-w-sm text-ink-muted">
                  A portrait from your photograph, a devotional piece for a room in your house, or
                  fan art of the thing you won&apos;t stop thinking about. Tell me the idea and
                  I&apos;ll tell you what it would take.
                </p>
              </div>
              <span className="font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink transition-colors duration-500 group-hover:text-clay">
                Start a commission →
              </span>
            </Link>
          </Reveal>

          <Reveal className="bg-paper-raised/60" delay={0.08}>
            <Link
              href="/shop"
              className="group flex h-full flex-col justify-between gap-10 p-9 transition-colors duration-700 hover:bg-paper-deep/70 md:p-14"
            >
              <div>
                <p className="kicker">Shop</p>
                <p className="mt-5 font-serif text-heading leading-snug text-ink">
                  Something ready to ship
                </p>
                <p className="mt-4 max-w-sm text-ink-muted">
                  Prints and originals, packed and posted from Gurugram. Message me on Instagram
                  and it&apos;s on its way.
                </p>
              </div>
              <span className="font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink transition-colors duration-500 group-hover:text-clay">
                Browse the shop →
              </span>
            </Link>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <p className="text-ink-muted">
            Or just say hello —{" "}
            <a href={`mailto:${site.email}`} className="ink-link text-ink">
              {site.email}
            </a>{" "}
            <span className="text-ink-faint">/</span>{" "}
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="ink-link text-ink"
            >
              @{site.handle}
            </a>
          </p>
        </Reveal>
      </section>
    </>
  );
}
