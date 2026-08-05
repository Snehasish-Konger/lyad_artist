import Link from "next/link";
import { nav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-paper-edge bg-paper-raised/50 md:mt-44">
      <div className="shell py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="font-serif text-heading leading-tight text-ink">
              Have something in mind?
            </p>
            <p className="mt-4 max-w-sm text-ink-muted">
              Commissions are open. Tell me who it&apos;s for and I&apos;ll come back to you with
              what it would take.
            </p>
            <Link
              href="/commission"
              className="ink-link mt-7 inline-block font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink"
            >
              Start a commission
            </Link>
          </div>

          <nav className="md:col-span-2 md:col-start-7" aria-label="Footer">
            <p className="kicker">Pages</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="ink-link text-ink-soft hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4 md:col-start-9">
            <p className="kicker">Elsewhere</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ink-link text-ink-soft hover:text-ink"
                >
                  Instagram — @{site.handle}
                </a>
              </li>
              <li>
                <a
                  href={site.shopUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ink-link text-ink-soft hover:text-ink"
                >
                  Shop — snehasishkonger.com
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="ink-link break-all text-ink-soft hover:text-ink"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper-edge pt-8 text-[0.75rem] uppercase tracking-[0.16em] text-ink-faint md:mt-24 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>
            {site.location} — {site.shipping}
          </p>
        </div>
      </div>
    </footer>
  );
}
