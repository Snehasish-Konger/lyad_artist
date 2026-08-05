import Link from "next/link";
import { Reveal } from "@/components/reveal";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
      <Reveal>
        <p className="kicker">404</p>
        <h1 className="mt-6 max-w-2xl font-serif text-title leading-tight text-ink">
          There&apos;s nothing on this page.
        </h1>
        <p className="mt-6 max-w-md text-ink-muted">
          A blank sheet, which is usually a good thing — but not here. The gallery is where
          everything actually lives.
        </p>
        <div className="mt-10 flex flex-wrap gap-x-9 gap-y-4">
          <Link href="/" className="ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink">
            Back home
          </Link>
          <Link href="/gallery" className="ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink-muted">
            See the gallery
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
