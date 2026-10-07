"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const NAV_LINKS: { href: string; en: string; ur: string }[] = [
  { href: "/medication", en: "Medication", ur: "ادویات" },
  { href: "/ai", en: "MindHx AI", ur: "MindHx AI" },
  { href: "/meditation", en: "Meditation", ur: "مراقبہ" },
  { href: "/therapies", en: "Therapies", ur: "تھراپیز" },
  { href: "/therapist", en: "Therapist", ur: "معالج" },
  { href: "/resources", en: "Resources", ur: "وسائل" },
];

const EMERGENCY = { href: "/emergency", en: "Emergency support", short: "Emergency", ur: "فوری مدد" };

// The site's main navigation, shared by the home page's header and
// SiteHeader. The emergency link sits outside the scrolling link list so it
// is never clipped or hidden at any width; below 960px the other links move
// into a menu.
export default function SiteNav({ isUrdu }: { isUrdu: boolean }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointer(event: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <>
      <nav className="topbar-nav" aria-label={isUrdu ? "MindHx وسائل" : "MindHx resources"}>
        {NAV_LINKS.map((link) => <Link key={link.href} href={link.href}>{isUrdu ? link.ur : link.en}</Link>)}
      </nav>
      <Link href={EMERGENCY.href} className="topbar-emergency">
        {isUrdu ? EMERGENCY.ur : <><span className="topbar-emergency-full">{EMERGENCY.en}</span><span className="topbar-emergency-short">{EMERGENCY.short}</span></>}
      </Link>
      <div className="nav-menu" ref={wrapperRef}>
        <button type="button" className="nav-menu-button" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>
          <span aria-hidden="true">☰</span>
          <span className="visually-hidden">{isUrdu ? "مینو" : "Menu"}</span>
        </button>
        {open && (
          <div id={menuId} className="nav-menu-panel" dir={isUrdu ? "rtl" : "ltr"}>
            {NAV_LINKS.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{isUrdu ? link.ur : link.en}</Link>)}
            <Link href={EMERGENCY.href} className="nav-menu-emergency" onClick={() => setOpen(false)}>{isUrdu ? EMERGENCY.ur : EMERGENCY.en}</Link>
          </div>
        )}
      </div>
    </>
  );
}
