"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type MenuItem = { href: string; en: string; ur: string; enDesc: string; urDesc: string };
type Menu = { key: string; en: string; ur: string; items: MenuItem[] };

const MENUS: Menu[] = [
  {
    key: "resources",
    en: "Resources",
    ur: "وسائل",
    items: [
      { href: "/medication", en: "Medication", ur: "ادویات", enDesc: "General education on SSRIs, anxiety medicines, and sleep treatment.", urDesc: "ایس ایس آر آئیز، اضطراب کی ادویات، اور نیند کے علاج کے بارے میں عمومی معلومات۔" },
      { href: "/meditation", en: "Meditation techniques", ur: "مراقبے کی تکنیکیں", enDesc: "Step-by-step grounding and breathing practices, illustrated.", urDesc: "گراؤنڈنگ اور سانس کی مشقیں، مرحلہ وار تصاویر کے ساتھ۔" },
      { href: "/therapies", en: "Therapies", ur: "تھراپیز", enDesc: "CBT, DBT, and other approaches explained in plain language.", urDesc: "CBT، DBT، اور دیگر طریقہ ہائے علاج آسان زبان میں۔" },
      { href: "/resources", en: "Community resources", ur: "کمیونٹی وسائل", enDesc: "Articles and guidance curated by the MindHx team.", urDesc: "MindHx ٹیم کے منتخب کردہ مضامین اور رہنمائی۔" },
    ],
  },
  {
    key: "support",
    en: "Get support",
    ur: "مدد حاصل کریں",
    items: [
      { href: "/ai", en: "MindHx AI", ur: "MindHx AI", enDesc: "A safety-gated chat for everyday stress, anxiety, and burnout.", urDesc: "روزمرہ ذہنی دباؤ اور تھکن کے لیے ایک محفوظ گفتگو۔" },
      { href: "/therapist", en: "Find a therapist", ur: "معالج تلاش کریں", enDesc: "A verified, city-by-city directory of care in Pakistan.", urDesc: "پاکستان میں تصدیق شدہ، شہر بہ شہر نگہداشت کی ڈائریکٹری۔" },
    ],
  },
];

export default function MegaNav({ isUrdu = false }: { isUrdu?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu(key: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(null), 150);
  }

  return (
    <nav className="mega-nav" aria-label="MindHx resources">
      {MENUS.map((menu) => (
        <div key={menu.key} className="mega-nav-item" onMouseEnter={() => openMenu(menu.key)} onMouseLeave={scheduleClose}>
          <button
            type="button"
            className={`mega-nav-trigger ${open === menu.key ? "active" : ""}`}
            aria-expanded={open === menu.key}
            onClick={() => setOpen(open === menu.key ? null : menu.key)}
          >
            {isUrdu ? menu.ur : menu.en}
            <span className="mega-nav-caret">▾</span>
          </button>
          {open === menu.key && (
            <div className="mega-nav-panel" dir={isUrdu ? "rtl" : "ltr"}>
              {menu.items.map((item) => (
                <Link key={item.href} href={item.href} className="mega-nav-panel-link" onClick={() => setOpen(null)}>
                  <b>{isUrdu ? item.ur : item.en}</b>
                  <span>{isUrdu ? item.urDesc : item.enDesc}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
      <Link href="/emergency" className="topbar-nav-emergency mega-nav-emergency">{isUrdu ? "فوری مدد" : "Emergency support"}</Link>
    </nav>
  );
}
