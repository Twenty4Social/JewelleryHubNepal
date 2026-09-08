"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || reduce) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "0px 0px -80px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={`premium-reveal ${reduce || visible ? "is-visible" : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/** Letterspaced small-caps kicker with flanking ornaments. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-3 text-sm font-semibold text-muted">
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
        <p className="mx-auto mt-3 max-w-xl text-base text-muted md:text-[15px]">
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
