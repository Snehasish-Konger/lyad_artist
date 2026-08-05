import type { Metadata } from "next";
import { Suspense } from "react";
import { CommissionTabs } from "@/components/commission-tabs";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Commission a portrait",
  description:
    "Commission a devotional portrait, pen-and-ink likeness, anime piece or home decor illustration. Tell me about it and I'll come back with a price and a timeline.",
  alternates: { canonical: "/commission" },
};

/** What actually happens after someone sends the form. Stated plainly, because
 *  not knowing is the main reason people close the tab. */
const steps = [
  {
    n: "01",
    title: "You send the brief",
    body: "Three short steps below. A reference photo helps but isn't required to start.",
  },
  {
    n: "02",
    title: "I reply within 2–3 days",
    body: "With what I think the piece should be, a price, and how long it'll take. No obligation either way.",
  },
  {
    n: "03",
    title: "We agree, then I draw",
    body: "You see the work in progress at least once, so nothing arrives as a surprise.",
  },
  {
    n: "04",
    title: "It ships, or it's a file",
    body: "Prints and originals post anywhere in India. Digital pieces arrive as high-resolution files.",
  },
];

export default function CommissionPage() {
  return (
    <>
      <PageHeader
        kicker="Commissions — open"
        title="Tell me who it's for."
        lede="Most of what I draw starts as somebody's photograph and a short note about why it matters. This is that note. It takes about two minutes."
      />

      {/* How it works */}
      <section className="shell pb-20 md:pb-28" aria-label="How a commission works">
        <div className="grid gap-x-10 gap-y-9 border-y border-paper-edge py-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <p className="font-sans text-[0.6875rem] tracking-[0.2em] text-clay">{s.n}</p>
              <p className="mt-3 font-serif text-xl leading-snug text-ink">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The form */}
      <section className="shell pb-24 md:pb-32">
        <div className="max-w-3xl">
          <Suspense fallback={<div className="h-[32rem]" />}>
            <CommissionTabs />
          </Suspense>
        </div>
      </section>

      {/* Fallback for people who'd rather not use a form at all */}
      <section className="shell pb-8">
        <div className="max-w-3xl border-t border-paper-edge pt-10">
          <p className="text-ink-muted">
            Forms not your thing? Email{" "}
            <a href={`mailto:${site.email}`} className="ink-link text-ink">
              {site.email}
            </a>{" "}
            or DM{" "}
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="ink-link text-ink"
            >
              @{site.handle}
            </a>
            . Both reach me directly.
          </p>
        </div>
      </section>
    </>
  );
}
