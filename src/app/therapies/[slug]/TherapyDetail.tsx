"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import type { Therapy } from "../data";

const copy = {
  English: { eyebrow: "APPROACH", whatToExpect: "WHAT SESSIONS MAY INCLUDE", sessionInfo: "Session information", back: "All therapies", relatedThemes: "Related themes", discuss: "Discuss treatment with a professional" },
  اردو: { eyebrow: "طریقہ کار", whatToExpect: "سیشنز میں کیا شامل ہو سکتا ہے", sessionInfo: "سیشن کی معلومات", back: "تمام تھراپیز", relatedThemes: "متعلقہ موضوعات", discuss: "کسی ماہر سے علاج پر گفتگو کریں" },
};

export default function TherapyDetail({ therapy }: { therapy: Therapy }) {
  const [language, setLanguage] = useState<"English" | "اردو">("English");
  const isUrdu = language === "اردو";
  const text = copy[language];
  const content = therapy[isUrdu ? "ur" : "en"];

  return (
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backHref="/therapies" backLabel={text.back} />
      <section className="resource-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{content.name}</h1>
        <p>{content.summary}</p>
      </section>
      <section className="technique-detail">
        <div>
          <p className="card-kicker">{text.whatToExpect}</p>
          <ol>{content.whatToExpect.map((item) => <li key={item}>{item}</li>)}</ol>
        </div>
        <div className="resource-note">
          <b>{text.sessionInfo}</b>
          <p>{content.sessionInfo}</p>
        </div>
      </section>
      {therapy.relatedThemes.length > 0 && (
        <section className="technique-themes">
          <p className="card-kicker">{text.relatedThemes}</p>
          <div className="theme-row">{therapy.relatedThemes.map((theme) => <span key={theme}>{theme.replaceAll("_", " ")}</span>)}</div>
        </section>
      )}
      <div className="technique-actions">
        <Link className="result-primary" href="/therapies">{text.back} <span>→</span></Link>
        <Link className="result-primary" href="/therapist">{text.discuss} <span>→</span></Link>
      </div>
    </main>
  );
}
