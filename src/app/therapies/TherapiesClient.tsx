"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { DoodleHeart, DoodleSpeechBubble } from "../components/Doodles";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";
import { therapies } from "./data";

const copy = {
  English: {
    eyebrow: "04 / THERAPIES & TREATMENT",
    titleLine1: "There is more than",
    titleLine2: "one path to support.",
    intro: "These evidence-based approaches are general reference information. A licensed clinician determines what is appropriate for a person's needs.",
    approach: "APPROACH",
    learnMore: "Learn more",
    discuss: "Discuss treatment with a professional",
  },
  اردو: {
    eyebrow: "04 / تھراپیز اور علاج",
    titleLine1: "مدد کا راستہ",
    titleLine2: "ایک سے زیادہ ہو سکتا ہے۔",
    intro: "یہ شواہد پر مبنی طریقے عمومی حوالہ جاتی معلومات ہیں۔ ایک مستند معالج طے کرتا ہے کہ کسی شخص کی ضروریات کے لیے کیا مناسب ہے۔",
    approach: "طریقہ کار",
    learnMore: "مزید جانیں",
    discuss: "کسی ماہر سے علاج پر گفتگو کریں",
  },
};

export default function TherapiesClient() {
  const [language, setLanguage] = useState<"English" | "اردو">("English");
  const text = copy[language];
  const isUrdu = language === "اردو";

  return (
    <>
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <DoodleSpeechBubble className="doodle doodle-blue doodle-float" style={{ top: "100px", right: "5%" }} />
      <DoodleHeart className="doodle doodle-orange doodle-sway" style={{ top: "55%", left: "2%" }} />
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={isUrdu ? "چیک ان پر واپس" : "Back to check-in"} />
      <section className="resource-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.titleLine1}<br /><em>{text.titleLine2}</em></h1>
        <p>{text.intro}</p>
      </section>
      <NatureBanner {...naturePhotos.forestPath} priority />
      <section className="reference-grid therapy-reference">
        {therapies.map((therapy) => {
          const content = therapy[isUrdu ? "ur" : "en"];
          return (
            <Link key={therapy.slug} href={`/therapies/${therapy.slug}`} className="reference-card-link">
              <article>
                <p className="card-kicker">{text.approach}</p>
                <h2>{content.name}</h2>
                <p className="reference-card-summary">{content.summary}</p>
                <footer>{text.learnMore} →</footer>
              </article>
            </Link>
          );
        })}
      </section>
      <Link className="result-primary result-primary-orange" href="/therapist">{text.discuss} <span>→</span></Link>
    </main>
    <SiteFooter language={language} />
    </>
  );
}
