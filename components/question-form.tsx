"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { questionSchema, fieldErrors } from "@/lib/validation";
import { site } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * The short form. Used both as the "Just have a question" tab on the
 * commission page and as the fallback form on /contact.
 */
export function QuestionForm({
  successTitle = "Got it.",
  successBody = "Your message is with me. I read everything myself, usually within a day or two — replies come from studio@snehasishkonger.com, so keep an eye on your promotions tab.",
}: {
  successTitle?: string;
  successBody?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;

    const parsed = questionSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (json.errors) setErrors(json.errors);
        setFormError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setFormError(
        `Couldn't reach the studio — check your connection, or email ${site.email} directly.`,
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <Confirmation title={successTitle} body={successBody} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <Honeypot />

      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Your name" htmlFor="q-name" error={errors.name}>
          <Input id="q-name" name="name" autoComplete="name" placeholder="Priya Sharma" />
        </Field>
        <Field label="Email" htmlFor="q-email" error={errors.email}>
          <Input
            id="q-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <Field label="Your message" htmlFor="q-message" error={errors.message}>
        <Textarea
          id="q-message"
          name="message"
          placeholder="Ask me anything — pricing, timelines, whether a photo will work as reference…"
        />
      </Field>

      {formError && (
        <p role="alert" className="border-l-2 border-clay pl-4 text-sm text-clay">
          {formError}
        </p>
      )}

      <Button type="submit" variant="solid" size="lg" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

export function Honeypot() {
  return (
    <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website-field">Leave this empty</label>
      <input id="website-field" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function Confirmation({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-ink pt-10"
    >
      <p className="kicker">Sent</p>
      <h3 className="mt-4 font-serif text-title leading-tight text-ink">{title}</h3>
      <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-soft">{body}</p>
      <p className="mt-8 text-sm text-ink-muted">
        In the meantime there&apos;s more work on{" "}
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="ink-link text-ink"
        >
          Instagram
        </a>
        .
      </p>
    </motion.div>
  );
}
