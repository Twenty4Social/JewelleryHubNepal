"use client";

import type {} from "react/canary";
import { ViewTransition, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useLayoutEffect(() => {
    // New pages start at the opening; hash links retain native in-page navigation.
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return <ViewTransition name="page-content" update="page-crossfade" default="none"><main id="main-content" tabIndex={-1} className="page-transition min-h-[60svh]">{children}</main></ViewTransition>;
}
