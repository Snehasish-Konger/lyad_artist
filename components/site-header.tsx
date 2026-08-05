"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { nav, site } from "@/content/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation, and lock the page behind it while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        // Open drawer: solid, so the artwork doesn't show through behind the logo.
        // Scrolled: near-solid with a blur. At rest on the hero: nothing at all.
        open
          ? "border-transparent bg-paper"
          : scrolled
            ? "border-paper-edge/70 bg-paper/95 backdrop-blur-xl"
            : "border-transparent",
      )}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between md:h-20">
        <Link
          href="/"
          className="group flex flex-col leading-none"
          aria-label={`${site.name} — home`}
        >
          <span className="font-serif text-lg tracking-tight text-ink md:text-xl">
            {site.name}
          </span>
          <span className="mt-1 font-sans text-[0.625rem] uppercase tracking-[0.28em] text-ink-faint transition-colors duration-500 group-hover:text-clay">
            @{site.handle}
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em]",
                  active ? "text-clay" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 flex items-center gap-2.5 p-2 md:hidden"
        >
          <span className="font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-ink-muted">
            {open ? "Close" : "Menu"}
          </span>
          <span className="relative block h-3 w-5" aria-hidden>
            <span
              className={cn(
                "absolute left-0 block h-px w-full bg-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-px w-full bg-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 top-[4.5rem] bg-paper md:hidden"
          >
            <nav className="shell flex flex-col pt-10" aria-label="Primary">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    className="block border-b border-paper-edge py-5 font-serif text-3xl text-ink"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-10 font-sans text-[0.75rem] uppercase tracking-[0.2em] text-ink-muted"
              >
                Instagram — @{site.handle} ↗
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
