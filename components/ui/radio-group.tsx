"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn("grid gap-px", className)} {...props} />
));
RadioGroup.displayName = "RadioGroup";

/**
 * A full-width selectable row rather than a dot-and-label. Reads like choosing
 * an entry from a printed list; the whole row is the target, which matters on
 * a phone.
 */
export const RadioCard = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    label: string;
    description?: string;
  }
>(({ className, label, description, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "group relative flex w-full items-start gap-4 border border-paper-edge bg-transparent",
      "px-5 py-4 text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
      "hover:border-ink-faint hover:bg-paper-raised/60",
      "data-[state=checked]:border-ink data-[state=checked]:bg-paper-raised",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
      className,
    )}
    {...props}
  >
    <span
      aria-hidden
      className={cn(
        "mt-[0.4rem] size-2.5 shrink-0 rounded-full border border-ink-faint transition-colors duration-300",
        "group-data-[state=checked]:border-clay group-data-[state=checked]:bg-clay",
      )}
    />
    <span className="min-w-0">
      <span className="block font-serif text-lg leading-snug text-ink">{label}</span>
      {description && (
        <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{description}</span>
      )}
    </span>
  </RadioGroupPrimitive.Item>
));
RadioCard.displayName = "RadioCard";
