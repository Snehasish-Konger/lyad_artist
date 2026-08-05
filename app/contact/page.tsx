import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { QuestionForm } from "@/components/question-form";
import { Reveal } from "@/components/reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Snehasish Konger — studio@snehasishkonger.com, or @lyad_artist on Instagram. Based in Gurugram, ships across India.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="Contact"
        title="Say hello."
        lede="Email and Instagram both reach me directly. The form below goes to the same inbox if that's easier."
      />

      <div className="shell pb-8">
        <div className="grid gap-16 md:grid-cols-12 md:gap-16">
          {/* Direct channels first — the form is the fallback, not the default */}
          <Reveal className="md:col-span-4">
            <dl className="divide-y divide-paper-edge border-y border-paper-edge">
              <div className="py-6">
                <dt className="kicker">Email</dt>
                <dd className="mt-2.5">
                  <a href={`mailto:${site.email}`} className="ink-link text-lg text-ink">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="py-6">
                <dt className="kicker">Instagram</dt>
                <dd className="mt-2.5">
                  <a
                    href={site.instagramUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ink-link text-lg text-ink"
                  >
                    @{site.handle} ↗
                  </a>
                </dd>
              </div>
              <div className="py-6">
                <dt className="kicker">Shop</dt>
                <dd className="mt-2.5">
                  <a
                    href={site.shopUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ink-link text-lg text-ink"
                  >
                    snehasishkonger.com ↗
                  </a>
                </dd>
              </div>
              <div className="py-6">
                <dt className="kicker">Studio</dt>
                <dd className="mt-2.5 text-lg leading-snug text-ink-soft">
                  {site.location}
                  <span className="mt-1 block text-sm text-ink-muted">{site.shipping}</span>
                </dd>
              </div>
            </dl>

            <p className="mt-8 text-sm leading-relaxed text-ink-muted">
              Wanting a piece made rather than asking a question? The{" "}
              <Link href="/commission" className="ink-link text-ink">
                commission form
              </Link>{" "}
              collects what I need up front and saves us both a round trip.
            </p>
          </Reveal>

          <Reveal className="md:col-span-7 md:col-start-6" delay={0.08}>
            <h2 className="font-serif text-heading leading-snug text-ink">
              Or write to me here.
            </h2>
            <div className="mt-10">
              <QuestionForm
                successTitle="Message received."
                successBody="It's landed in my inbox and I read everything myself — expect a reply within a day or two, from studio@snehasishkonger.com. If it doesn't turn up, have a look in your promotions tab before assuming I've ignored you."
              />
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
