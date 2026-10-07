"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import AccountChip from "./AccountChip";
import SiteNav from "./SiteNav";

type Props = {
  backHref?: string;
  backLabel?: string;
  language?: "English" | "اردو";
  onToggleLanguage?: () => void;
  right?: ReactNode;
};

export default function SiteHeader({ backHref = "/", backLabel, language = "English", onToggleLanguage, right }: Props) {
  const isUrdu = language === "اردو";
  return (
    <header className="site-header-sticky">
      <div className="resource-header" dir={isUrdu ? "rtl" : "ltr"}>
        <Link href="/" className="results-brand"><span className="brand-mark">M</span><span>Mind<span className="brand-accent">Hx</span></span></Link>
        <SiteNav isUrdu={isUrdu} />
        <div className="resource-header-right">
          {right}
          <AccountChip language={language} />
          {onToggleLanguage && <button className="language" onClick={onToggleLanguage} type="button">◎ {language}</button>}
          <Link href={backHref} className="resource-back">{backLabel ?? (isUrdu ? "چیک ان پر واپس" : "Back to check-in")} ↗</Link>
        </div>
      </div>
    </header>
  );
}
