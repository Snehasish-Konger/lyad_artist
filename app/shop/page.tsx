import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { OrderChoice } from "@/components/order-choice";
import { buildOrderMessage } from "@/lib/order-message";
import { shopSections } from "@/content/shop";
import { image } from "@/content/artworks";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shop — Prints & Originals",
  description:
    "Prints and originals by Snehasish Konger of S. Konger Arts — devotional pieces, home decor illustration and more. Message the studio on WhatsApp or Instagram to order.",
  path: "/shop",
});

/**
 * A preview of what's available, not a second storefront. Nothing here has a
 * cart or checkout — "Order it" opens WhatsApp or Instagram DM, whichever
 * the visitor prefers, with a ready-made message already written.
 */
export default function ShopPage() {
  return (
    <>
      <PageHeader
        kicker="Shop"
        title="Prints and originals, posted from Gurugram."
        lede="Message me on WhatsApp or Instagram — whichever you prefer — to order any of these directly. Sizing, pricing and availability, sorted in a few messages."
      />

      <div className="shell">
        <RevealGroup className="grid gap-px border border-paper-edge bg-paper-edge md:grid-cols-2">
          {shopSections.map((section) => {
            const img = image(section.image);
            return (
              <RevealItem key={section.title}>
                <div className="group flex h-full w-full flex-col bg-paper-raised/60 transition-colors duration-700 hover:bg-paper-deep/70">
                  <div className="relative aspect-[16/11] overflow-hidden bg-paper-deep">
                    <Image
                      src={img.src}
                      alt={`${section.title} — ${section.blurb}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      placeholder="blur"
                      blurDataURL={img.blurDataURL}
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-8 p-8 md:p-11">
                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="font-serif text-heading leading-snug text-ink">
                          {section.title}
                        </h2>
                        <span className="shrink-0 font-sans text-[0.625rem] uppercase tracking-[0.16em] text-clay">
                          {section.note}
                        </span>
                      </div>
                      <p className="mt-4 max-w-sm text-ink-muted">{section.blurb}</p>
                    </div>
                    <div>
                      <p className="mb-3 font-sans text-[0.625rem] uppercase tracking-[0.16em] text-ink-faint">
                        Order it
                      </p>
                      <OrderChoice message={buildOrderMessage(section.title)} />
                    </div>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal className="mt-16 grid gap-10 border-t border-paper-edge pt-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="kicker">Shipping</p>
            <p className="mt-4 max-w-md text-ink-soft">
              Prints and originals ship anywhere in India, packed flat in a rigid mailer or rolled
              in a tube depending on size. Tracking goes out the day it leaves.
            </p>
          </div>
          <div>
            <p className="kicker">Nothing quite right?</p>
            <p className="mt-4 max-w-md text-ink-soft">
              The shop holds the pieces that already exist. If you want one that doesn&apos;t yet,
              that&apos;s a commission.
            </p>
            <Link
              href="/commission"
              className="ink-link mt-6 inline-block font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink"
            >
              Start a commission
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
