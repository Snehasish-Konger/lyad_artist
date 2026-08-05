"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

/**
 * Form primitives. shadcn/ui's structure (Radix under the hood, `cn` for
 * merging) but styled from scratch: no rounded-md/ring-offset default look.
 * Inputs here are underlined rather than boxed, to read as a printed form.
 */

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { optional?: boolean }
>(({ className, children, optional, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-muted",
      className,
    )}
    {...props}
  >
    {children}
    {optional && <span className="ml-2 normal-case tracking-normal text-ink-faint">optional</span>}
  </LabelPrimitive.Root>
));
Label.displayName = "Label";

const fieldBase =
  "w-full border-0 border-b border-paper-edge bg-transparent px-0 py-2.5 font-sans text-base text-ink " +
  "placeholder:text-ink-faint/70 transition-colors duration-300 " +
  "focus:border-clay focus:outline-none focus:ring-0 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-[invalid=true]:border-clay";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(fieldBase, "min-h-32 resize-y leading-relaxed", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

/** Label + control + optional hint/error, with consistent vertical rhythm. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} optional={optional}>
        {label}
      </Label>
      {children}
      {hint && !error && <p className="text-sm leading-snug text-ink-faint">{hint}</p>}
      {error && (
        <p role="alert" className="text-sm leading-snug text-clay">
          {error}
        </p>
      )}
    </div>
  );
}
