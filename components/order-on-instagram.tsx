"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * ORDERING VIA INSTAGRAM DM
 * ============================================================================
 * Instagram has no public, reliable way to open a DM thread with a message
 * already typed in — that only exists for Meta's own ad/Business-Messaging
 * products, not for a plain profile link. `https://ig.me/m/<handle>` is the
 * one thing Instagram *does* support: it opens a DM thread with that account
 * (in the app if installed, in-browser otherwise).
 *
 * So the honest version of "order via DM" is two steps done together: copy a
 * ready-made message to the clipboard, then open that DM thread. The visitor
 * pastes instead of typing. It's not a true prefill, but it's the closest
 * thing that actually works.
 *
 * The message text itself is built by lib/order-message.ts, not here — this
 * file is "use client", and a plain function exported from a client-boundary
 * module can't be called directly from a Server Component (only rendered as
 * a component), which is exactly how the Shop page needs to use it.
 * ============================================================================
 */

export function OrderOnInstagram({
  message,
  label = "Order it",
  className,
}: {
  message: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      // Clipboard access can be blocked (permissions, insecure context) — the
      // DM thread still opens either way, the visitor just types it themselves.
    }
    window.open(`https://ig.me/m/${site.handle}`, "_blank", "noopener,noreferrer");
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {copied ? "Copied — paste it in the chat ↗" : `${label} ↗`}
    </button>
  );
}

/**
 * Full-card variant: the whole card is the click target, matching the visual
 * pattern of an <a> that wraps an image + copy block (used on the Shop page).
 */
export function OrderCard({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      // See OrderOnInstagram — clipboard failure isn't fatal, the DM still opens.
    }
    window.open(`https://ig.me/m/${site.handle}`, "_blank", "noopener,noreferrer");
  }

  return (
    <button type="button" onClick={handleClick} className={cn("text-left", className)}>
      {children}
      {copied && (
        <span className="mt-2 block font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-clay">
          Copied — paste it in the chat that just opened
        </span>
      )}
    </button>
  );
}
