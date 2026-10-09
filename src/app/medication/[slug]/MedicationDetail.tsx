"use client";

import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import { DoodleLeaf } from "../../components/Doodles";
import NatureBanner from "../../components/NatureBanner";
import { naturePhotos } from "../../components/naturePhotos";
import SiteFooter from "../../components/SiteFooter";
import { StepIcon } from "../../components/StepIcons";
import { useLanguage } from "../../lib/language";
import type { Medication } from "../data";

const copy = {
  English: {
    eyebrow: "MEDICATION REFERENCE",
    usageNotes: "USAGE NOTES",
    warnings: "Warnings & precautions",
    back: "All medication reference",
    relatedThemes: "Related themes",
    discuss: "Discuss medication with a professional",
    disclaimer: "General reference information only. MindHx does not prescribe, personalize, or recommend medication. Always speak with a licensed prescriber before starting, stopping, or changing any medication.",
  },
  اردو: {
    eyebrow: "ادویات کی معلومات",
    usageNotes: "استعمال سے متعلق نکات",
    warnings: "انتباہات اور احتیاطی تدابیر",
    back: "تمام ادویات کی معلومات",
    relatedThemes: "متعلقہ موضوعات",
    discuss: "کسی ماہر سے ادویات پر گفتگو کریں",
    disclaimer: "صرف عمومی حوالہ جاتی معلومات۔ MindHx ادویات تجویز، ذاتی نوعیت، یا سفارش نہیں کرتا۔ کوئی بھی دوا شروع کرنے، روکنے، یا تبدیل کرنے سے پہلے ہمیشہ ایک مستند تجویز کنندہ سے بات کریں۔",
  },
};

export default function MedicationDetail({ medication }: { medication: Medication }) {
  const [language, setLanguage] = useLanguage();
  const isUrdu = language === "اردو";
  const text = copy[language];
  const content = medication[isUrdu ? "ur" : "en"];

  return (
    <>
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <DoodleLeaf className="doodle doodle-teal doodle-sway" style={{ top: "50%", left: "2%", width: "28px", height: "auto" }} />
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backHref="/medication" backLabel={text.back} />
      <div className="resource-hero-banner">
        <NatureBanner {...naturePhotos[medication.image]} priority />
        <section className="resource-hero">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{content.name}</h1>
          <p>{content.use}</p>
        </section>
      </div>
      <section className="technique-detail">
        <div>
          <p className="card-kicker">{text.usageNotes}</p>
          <ol>{content.usageNotes.map((item, index) => <li key={item}><StepIcon icon={medication.stepIcons[index]} /><span>{item}</span></li>)}</ol>
        </div>
        <div className="resource-note resource-note-warning">
          <b>{text.warnings}</b>
          {content.warnings.map((item) => <p key={item}>{item}</p>)}
        </div>
      </section>
      {medication.relatedThemes.length > 0 && (
        <section className="technique-themes">
          <p className="card-kicker">{text.relatedThemes}</p>
          <div className="theme-row">{medication.relatedThemes.map((theme) => <span key={theme}>{theme.replaceAll("_", " ")}</span>)}</div>
        </section>
      )}
      <p className="technique-themes resource-disclaimer">{text.disclaimer}</p>
      <div className="technique-actions">
        <Link className="result-primary" href="/medication">{text.back} <span>→</span></Link>
        <Link className="result-primary result-primary-orange" href="/therapist">{text.discuss} <span>→</span></Link>
      </div>
    </main>
    <SiteFooter language={language} />
    </>
  );
}
