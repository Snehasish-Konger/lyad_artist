"use client";

import { useState } from "react";
import { Instagram, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { waLink } from "@/lib/contact-links";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * ORDERING: WHATSAPP OR INSTAGRAM, VISITOR'S CHOICE
 * ============================================================================
 * WhatsApp supports a real prefilled message via wa.me?text=. Instagram has
 * no public way to prefill DM text from a link, so that path copies the
 * message to the clipboard first, then opens the DM thread for pasting —
 * the honest version of "order via DM" (see the old order-on-instagram.tsx
 * for the fuller explanation of why).
 *
 * Both buttons start the exact same conversation — the visitor just picks
 * whichever app they'd rather continue the conversation in.
 * ============================================================================
 */
export function OrderChoice({ message, className }: { message: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const whatsappHref = waLink(message);

  async function openInstagram() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      // Clipboard access can be blocked — the DM thread still opens, the
      // visitor just types the message themselves instead of pasting it.
    }
    window.open(`https://ig.me/m/${site.handle}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2.5", className)}>
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
          className="ink-link inline-flex items-center gap-1.5 font-sans text-[0.8125rem] uppercase tracking-[0.16em]"
        >
          <MessageCircle className="size-3.5" aria-hidden />
          WhatsApp ↗
        </a>
      )}
      <button
        type="button"
        onClick={openInstagram}
        className="ink-link inline-flex items-center gap-1.5 font-sans text-[0.8125rem] uppercase tracking-[0.16em]"
      >
        <Instagram className="size-3.5" aria-hidden />
        {copied ? "Copied — paste it in the chat ↗" : "Instagram DM ↗"}
      </button>
    </div>
  );
}
