"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Entrance animation used across the site. One component, one behaviour:
 * a short rise and fade, once, when the element comes into view.
 *
 * Restraint is the point — nothing here scales, rotates, or springs. If a
 * visitor has reduced motion on, this renders as a plain div.
 */

const variants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header" | "figure";
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as];

  if (reduced) {
    return <Comp className={className}>{children}</Comp>;
  }

  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/** Staggers its children with Reveal's timing. Children must be <RevealItem>. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "section";
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as];

  if (reduced) return <Comp className={className}>{children}</Comp>;

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "figure" | "article";
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as];

  if (reduced) return <Comp className={className}>{children}</Comp>;

  return (
    <Comp className={className} variants={variants}>
      {children}
    </Comp>
  );
}
