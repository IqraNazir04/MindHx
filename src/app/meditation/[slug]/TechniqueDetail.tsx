"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import { DoodleLeaf, DoodleSun } from "../../components/Doodles";
import type { Technique } from "../data";

const copy = {
  English: { eyebrow: "PRACTICE", how: "HOW TO PRACTICE", considerations: "Considerations", back: "All meditation techniques", relatedThemes: "Related themes" },
  اردو: { eyebrow: "مشق", how: "کیسے کریں", considerations: "غور طلب باتیں", back: "تمام مراقبے کی تکنیکیں", relatedThemes: "متعلقہ موضوعات" },
};

export default function TechniqueDetail({ technique }: { technique: Technique }) {
  const [language, setLanguage] = useState<"English" | "اردو">("English");
  const isUrdu = language === "اردو";
  const text = copy[language];
  const content = technique[isUrdu ? "ur" : "en"];

  return (
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <DoodleSun className="doodle doodle-orange doodle-float-slow" style={{ top: "95px", right: "5%" }} />
      <DoodleLeaf className="doodle doodle-teal doodle-sway" style={{ top: "50%", left: "2%", width: "26px", height: "auto" }} />
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backHref="/meditation" backLabel={text.back} />
      <section className="resource-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{content.name}</h1>
        <p>{content.summary}</p>
      </section>
      <section className="technique-detail">
        <div>
          <p className="card-kicker">{text.how}</p>
          <ol>{content.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </div>
        <div className="resource-note">
          <b>{text.considerations}</b>
          <p>{content.notes}</p>
        </div>
      </section>
      {technique.relatedThemes.length > 0 && (
        <section className="technique-themes">
          <p className="card-kicker">{text.relatedThemes}</p>
          <div className="theme-row">{technique.relatedThemes.map((theme) => <span key={theme}>{theme.replaceAll("_", " ")}</span>)}</div>
        </section>
      )}
      <Link className="result-primary" href="/meditation">{text.back} <span>→</span></Link>
    </main>
  );
}
