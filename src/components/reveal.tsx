"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Fade-up reveal when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Letterspaced small-caps kicker with flanking ornaments. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
      <span aria-hidden className="text-gold">✦</span>
      {children}
      <span aria-hidden className="text-gold">✦</span>
    </p>
  );
}

/** Section heading block. */
export function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <Reveal className="mb-12 text-center">
      <Kicker>{kicker}</Kicker>
      <h2 className="mt-4 font-display text-3xl font-medium text-burgundy md:text-[2.6rem] md:leading-tight">
        {title}
      </h2>
      {sub ? (
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted md:text-[15px]">
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}

/** Ornamental divider — double hairlines with a center fleuron. */
export function Divider() {
  return (
    <div aria-hidden className="mx-auto my-16 flex max-w-6xl items-center gap-4 px-6 text-gold">
      <span className="h-[5px] flex-1 border-y border-gold-light" />
      <span className="font-display text-lg">❦</span>
      <span className="h-[5px] flex-1 border-y border-gold-light" />
    </div>
  );
}
