"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2.5 font-sans text-[0.8125rem] font-medium " +
    "uppercase tracking-[0.16em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
    "disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        /** Solid ink. The one loud element on the page — use once per screen. */
        solid: "bg-ink text-paper hover:bg-clay",
        /** Hairline outline. The default. */
        outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
        /** No chrome at all, just a rule that slides under on hover. */
        quiet: "text-ink hover:text-clay",
      },
      size: {
        sm: "px-5 py-2.5",
        md: "px-7 py-3.5",
        lg: "px-9 py-4.5",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof button> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(button({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";
