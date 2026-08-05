"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label, Textarea } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Confirmation, Honeypot } from "@/components/question-form";
import { categories } from "@/content/categories";
import { site } from "@/content/site";
import {
  ACCEPTED_UPLOAD_TYPES,
  CONTACT_PREFERENCES,
  MAX_UPLOAD_BYTES,
  OCCASIONS,
  SIZES,
  commissionSchema,
  fieldErrors,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, title: "What are you looking for?" },
  { n: 2, title: "Reference & details" },
  { n: 3, title: "How do I reach you?" },
] as const;

type Values = {
  type: string;
  description: string;
  occasion: string;
  size: string;
  referenceLink: string;
  name: string;
  email: string;
  instagram: string;
  phone: string;
  contactPreference: (typeof CONTACT_PREFERENCES)[number];
};

const EMPTY: Values = {
  type: "",
  description: "",
  occasion: "",
  size: "",
  referenceLink: "",
  name: "",
  email: "",
  instagram: "",
  phone: "",
  contactPreference: "Email",
};

/** Which schema keys each step is allowed to block on. */
const STEP_FIELDS: Record<number, (keyof Values)[]> = {
  1: ["type"],
  2: ["description", "referenceLink"],
  3: ["name", "email"],
};

export function CommissionForm() {
  const params = useSearchParams();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const topRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Deep links into the form:
   *   /commission?category=devotional        — from a gallery filter or lightbox
   *   /commission?ref=<instagram post url>   — from the "Order this" button
   *   /commission?piece=Mahadev              — "something like this piece"
   */
  useEffect(() => {
    const category = params.get("category");
    const ref = params.get("ref");
    const piece = params.get("piece");

    setValues((v) => {
      const next = { ...v };
      if (category && categories.some((c) => c.id === category)) next.type = category;

      const notes: string[] = [];
      if (ref) {
        notes.push(
          /^https?:\/\//i.test(ref)
            ? `Referencing this Instagram post: ${ref}`
            : `Referencing: ${ref}`,
        );
        if (/^https?:\/\//i.test(ref)) next.referenceLink = ref;
      }
      if (piece) notes.push(`Something in the style of "${piece}".`);
      if (notes.length && !next.description) next.description = `${notes.join("\n")}\n\n`;

      return next;
    });
  }, [params]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const { [key]: _removed, ...rest } = e;
      return rest;
    });
  };

  function validateStep(n: number) {
    const result = commissionSchema.safeParse({ ...values, website: "" });
    if (result.success) return true;

    const all = fieldErrors(result.error);
    const relevant = Object.fromEntries(
      Object.entries(all).filter(([k]) => STEP_FIELDS[n].includes(k as keyof Values)),
    );
    setErrors(relevant);
    return Object.keys(relevant).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(3, s + 1));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onPickFile(picked: File | null) {
    if (!picked) return setFile(null);
    if (picked.size > MAX_UPLOAD_BYTES) {
      setErrors((e) => ({ ...e, reference: "That image is over 8MB — try a smaller one." }));
      return;
    }
    if (picked.type && !ACCEPTED_UPLOAD_TYPES.includes(picked.type)) {
      setErrors((e) => ({ ...e, reference: "Images only — JPG, PNG, WEBP or HEIC." }));
      return;
    }
    setErrors((e) => {
      const { reference: _removed, ...rest } = e;
      return rest;
    });
    setFile(picked);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = commissionSchema.safeParse({ ...values, website: "" });
    if (!result.success) {
      const all = fieldErrors(result.error);
      setErrors(all);
      // Jump back to the earliest step that still has a problem.
      const firstBad = [1, 2, 3].find((n) =>
        STEP_FIELDS[n].some((f) => all[f as string] !== undefined),
      );
      if (firstBad && firstBad !== step) setStep(firstBad);
      return;
    }

    setFormError(null);
    setStatus("sending");

    const body = new FormData();
    Object.entries(result.data).forEach(([k, v]) => body.append(k, String(v ?? "")));
    // Honeypot travels with the payload so the server sees it either way.
    body.set("website", (event.currentTarget.elements.namedItem("website") as HTMLInputElement)?.value ?? "");
    if (file) body.append("reference", file);

    try {
      const res = await fetch("/api/commission", { method: "POST", body });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (json.errors) setErrors(json.errors);
        setFormError(json.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setFormError(`Couldn't reach the studio — check your connection, or email ${site.email}.`);
      setStatus("idle");
    }
  }

  if (status === "sent") {
    const first = values.name.split(" ")[0];
    return (
      <div ref={topRef}>
        <Confirmation
          title={`Thank you, ${first}.`}
          body={
            values.contactPreference === "Instagram DM"
              ? `Your brief is with me. I'll come back to you on Instagram within two or three days with what I think the piece wants to be, what it would cost, and roughly how long it would take. If I need more reference photos I'll ask then — no payment, no commitment until we've both agreed on the shape of it.`
              : `Your brief is with me. I'll reply from ${site.email} within two or three days with what I think the piece wants to be, what it would cost, and roughly how long it would take. If I need more reference photos I'll ask then — no payment, no commitment until we've both agreed on the shape of it.`
          }
        />
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* ── Step rail ───────────────────────────────────────────────────────── */}
      <ol className="mb-12 flex items-center gap-3 border-b border-paper-edge pb-6 md:gap-6">
        {STEPS.map((s) => {
          const state = s.n === step ? "current" : s.n < step ? "done" : "todo";
          return (
            <li key={s.n} className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => s.n < step && setStep(s.n)}
                disabled={s.n > step}
                className={cn(
                  "flex items-center gap-2.5 text-left transition-colors duration-300",
                  state === "todo" && "cursor-default",
                  s.n < step && "cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border font-sans text-[0.6875rem] transition-colors duration-500",
                    state === "current" && "border-ink bg-ink text-paper",
                    state === "done" && "border-clay text-clay",
                    state === "todo" && "border-paper-edge text-ink-faint",
                  )}
                >
                  {s.n}
                </span>
                <span
                  className={cn(
                    "hidden whitespace-nowrap font-sans text-[0.75rem] uppercase tracking-[0.14em] lg:block",
                    state === "current" ? "text-ink" : "text-ink-faint",
                  )}
                >
                  {s.title}
                </span>
              </button>
              {s.n < 3 && <span aria-hidden className="h-px w-6 bg-paper-edge md:w-10" />}
            </li>
          );
        })}
      </ol>

      <h2 className="mb-10 font-serif text-heading leading-tight text-ink lg:hidden">
        {STEPS[step - 1].title}
      </h2>

      <form onSubmit={onSubmit} noValidate className="relative">
        <Honeypot />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ── Step 1 ───────────────────────────────────────────────────── */}
            {step === 1 && (
              <fieldset>
                <legend className="sr-only">What are you looking for?</legend>
                <RadioGroup
                  value={values.type}
                  onValueChange={(v) => set("type", v)}
                  className="gap-3"
                >
                  {categories.map((c) => (
                    <RadioCard key={c.id} value={c.id} label={c.label} description={c.blurb} />
                  ))}
                  <RadioCard
                    value="unsure"
                    label="Not sure yet — I just want to ask"
                    description="Perfectly fine. Tell me the idea on the next step and we'll work out what it should be."
                  />
                </RadioGroup>
                {errors.type && (
                  <p role="alert" className="mt-4 text-sm text-clay">
                    {errors.type}
                  </p>
                )}
              </fieldset>
            )}

            {/* ── Step 2 ───────────────────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-10">
                <Field
                  label="Tell me about it"
                  htmlFor="description"
                  error={errors.description}
                  hint="Who or what it's for, and anything you already know you want. The more specific the better — 'my grandfather, from this photo, the way he looked when he was actually listening' beats 'a portrait'."
                >
                  <Textarea
                    id="description"
                    value={values.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="It's for my parents' 30th anniversary…"
                    className="min-h-40"
                  />
                </Field>

                {/* Reference photo */}
                <div className="space-y-3">
                  <Label optional>Reference photo</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_UPLOAD_TYPES.join(",")}
                    className="sr-only"
                    onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                  />
                  {file ? (
                    <div className="flex items-center justify-between gap-4 border border-paper-edge bg-paper-raised px-5 py-4">
                      <span className="flex min-w-0 items-center gap-3">
                        <Paperclip className="size-4 shrink-0 text-clay" />
                        <span className="truncate text-sm text-ink">{file.name}</span>
                        <span className="shrink-0 text-xs text-ink-faint">
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="shrink-0 p-1 text-ink-faint transition-colors hover:text-clay"
                        aria-label="Remove reference photo"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center gap-3 border border-dashed border-paper-edge px-5 py-6 text-left transition-colors duration-300 hover:border-ink-faint hover:bg-paper-raised/60"
                    >
                      <Paperclip className="size-4 shrink-0 text-ink-faint" />
                      <span className="text-sm text-ink-muted">
                        Attach a photo — JPG, PNG or HEIC, up to 8MB
                      </span>
                    </button>
                  )}
                  {errors.reference && (
                    <p role="alert" className="text-sm text-clay">
                      {errors.reference}
                    </p>
                  )}
                  <p className="text-sm leading-snug text-ink-faint">
                    Only one here — if you have several, send the rest once I reply. Good light and
                    a straight-on angle beat high resolution every time.
                  </p>
                </div>

                <Field
                  label="Or paste a link"
                  htmlFor="referenceLink"
                  optional
                  error={errors.referenceLink}
                  hint="An Instagram post of mine you want something like, or a Drive/Photos link to your references."
                >
                  <Input
                    id="referenceLink"
                    inputMode="url"
                    value={values.referenceLink}
                    onChange={(e) => set("referenceLink", e.target.value)}
                    placeholder="https://instagram.com/p/…"
                  />
                </Field>

                <div className="grid gap-10 sm:grid-cols-2">
                  <Field label="Occasion" optional>
                    <Select
                      value={values.occasion}
                      onValueChange={(v) => set("occasion", v)}
                    >
                      <SelectTrigger aria-label="Occasion">
                        <SelectValue placeholder="Select one" />
                      </SelectTrigger>
                      <SelectContent>
                        {OCCASIONS.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Size" optional hint="We can pin this down later.">
                    <Select value={values.size} onValueChange={(v) => set("size", v)}>
                      <SelectTrigger aria-label="Preferred size">
                        <SelectValue placeholder="Select one" />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>
            )}

            {/* ── Step 3 ───────────────────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-10">
                <div className="grid gap-10 sm:grid-cols-2">
                  <Field label="Your name" htmlFor="name" error={errors.name}>
                    <Input
                      id="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Priya Sharma"
                    />
                  </Field>
                  <Field label="Email" htmlFor="email" error={errors.email}>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                    />
                  </Field>
                  <Field label="Instagram handle" htmlFor="instagram" optional>
                    <Input
                      id="instagram"
                      value={values.instagram}
                      onChange={(e) => set("instagram", e.target.value)}
                      placeholder="@yourhandle"
                    />
                  </Field>
                  <Field label="Phone" htmlFor="phone" optional>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+91 …"
                    />
                  </Field>
                </div>

                <fieldset className="space-y-4">
                  <legend className="kicker">Where should I reply?</legend>
                  <RadioGroup
                    value={values.contactPreference}
                    onValueChange={(v) =>
                      set("contactPreference", v as Values["contactPreference"])
                    }
                    className="grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    <RadioCard value="Email" label="Email" description="Best for longer replies." />
                    <RadioCard
                      value="Instagram DM"
                      label="Instagram DM"
                      description="Add your handle above so I can find you."
                    />
                  </RadioGroup>
                </fieldset>

                <p className="max-w-lg border-l-2 border-paper-edge pl-5 text-sm leading-relaxed text-ink-muted">
                  Sending this doesn&apos;t commit you to anything. It starts a conversation — I&apos;ll
                  come back with a price and a timeline, and you decide from there.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {formError && (
          <p role="alert" className="mt-8 border-l-2 border-clay pl-4 text-sm text-clay">
            {formError}
          </p>
        )}

        {/* ── Controls ─────────────────────────────────────────────────────── */}
        <div className="mt-14 flex items-center justify-between gap-6 border-t border-paper-edge pt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={back}
              className="ink-link font-sans text-[0.8125rem] uppercase tracking-[0.16em] text-ink-muted"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <Button type="button" variant="solid" size="lg" onClick={next}>
              Continue
            </Button>
          ) : (
            <Button type="submit" variant="solid" size="lg" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send commission brief"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
