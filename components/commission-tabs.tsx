"use client";

import { useState } from "react";
import { CommissionForm } from "./commission-form";
import { QuestionForm } from "./question-form";
import { cn } from "@/lib/utils";

/**
 * Two doors into the same inbox. Nobody with a one-line question should have
 * to walk through a three-step brief to ask it.
 */
export function CommissionTabs() {
  const [tab, setTab] = useState<"commission" | "question">("commission");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Enquiry type"
        className="mb-14 flex gap-8 border-b border-paper-edge"
      >
        <Tab
          active={tab === "commission"}
          onClick={() => setTab("commission")}
          label="Commission a piece"
        />
        <Tab
          active={tab === "question"}
          onClick={() => setTab("question")}
          label="Just have a question"
        />
      </div>

      {tab === "commission" ? (
        <CommissionForm />
      ) : (
        <div className="max-w-2xl">
          <p className="mb-10 text-[1.0625rem] leading-relaxed text-ink-soft">
            No form to fill in. Ask about pricing, timelines, whether a particular photo will work
            as reference, anything — I&apos;ll answer honestly even if the answer is no.
          </p>
          <QuestionForm />
        </div>
      )}
    </div>
  );
}

function Tab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative pb-4 text-left font-sans text-[0.8125rem] uppercase tracking-[0.14em] transition-colors duration-300",
        active ? "text-ink" : "text-ink-faint hover:text-ink-soft",
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 -bottom-px h-px origin-left bg-clay transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active ? "scale-x-100" : "scale-x-0",
        )}
      />
    </button>
  );
}
