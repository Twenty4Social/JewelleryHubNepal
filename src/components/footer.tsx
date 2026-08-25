"use client";

import { Divider } from "./reveal";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();

  return (
    <>
      <Divider />
      <footer className="pb-10 pt-2 text-center text-muted">
        <p className="mb-2 font-display text-lg text-gold">✦ ❦ ✦</p>
        <p className="font-display italic">{t("footer.tagline")}</p>
        <p className="mt-2 text-xs">{t("footer.rights")}</p>
      </footer>
    </>
  );
}
