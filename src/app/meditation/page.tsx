"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { techniques } from "./data";

const copy = {
  English: {
    eyebrow: "03 / MEDITATION TECHNIQUES",
    titleLine1: "Simple practices",
    titleLine2: "you can explore safely.",
    intro: "These techniques are general information, not individualized treatment. Choose one gently and stop if it increases distress.",
    practice: "PRACTICE",
    learnMore: "Learn more",
  },
  اردو: {
    eyebrow: "03 / مراقبے کی تکنیکیں",
    titleLine1: "سادہ مشقیں",
    titleLine2: "جنہیں آپ محفوظ طریقے سے آزما سکتے ہیں۔",
    intro: "یہ تکنیکیں عمومی معلومات ہیں، انفرادی علاج نہیں۔ ایک کو نرمی سے آزمائیں اور اگر تکلیف بڑھے تو رک جائیں۔",
    practice: "مشق",
    learnMore: "مزید جانیں",
  },
};

export default function MeditationPage() {
  const [language, setLanguage] = useState<"English" | "اردو">("English");
  const text = copy[language];
  const isUrdu = language === "اردو";

  return (
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={isUrdu ? "چیک ان پر واپس" : "Back to check-in"} />
      <section className="resource-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.titleLine1}<br /><em>{text.titleLine2}</em></h1>
        <p>{text.intro}</p>
      </section>
      <section className="reference-grid">
        {techniques.map((technique) => {
          const content = technique[isUrdu ? "ur" : "en"];
          return (
            <Link key={technique.slug} href={`/meditation/${technique.slug}`} className="reference-card-link">
              <article>
                <p className="card-kicker">{text.practice}</p>
                <h2>{content.name}</h2>
                <p className="reference-card-summary">{content.summary}</p>
                <footer>{text.learnMore} →</footer>
              </article>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
