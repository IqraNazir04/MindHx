"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { bandLabel, scaleExplanation, scoreText, stageFor, type ScaleKey } from "../lib/resultsGuidance";
import type { Result } from "../components/CheckInResultsBody";
import { useLanguage } from "../lib/language";

const STAGE_STEPS = [
  { en: "Minimal", ur: "کم از کم" },
  { en: "Mild", ur: "ہلکا" },
  { en: "Moderate", ur: "درمیانہ" },
  { en: "Severe", ur: "شدید" },
  { en: "Crisis", ur: "بحران" },
];

const copy = {
  English: {
    back: "Back to check-in",
    eyebrow: "YOUR STAGE",
    loading: "Loading…",
    notReadyTitle: "Your check-in is not ready yet.",
    notReadyBody: "Complete the private assessment first, then return here to see your stage and next steps.",
    yourNextSteps: "your next steps.",
    phq9: "PHQ-9 (low mood)", gad7: "GAD-7 (anxiety)", k10: "K10 (overall distress)",
    recommendedFor: (stage: string) => `RECOMMENDED FOR ${stage.toUpperCase()}`,
    therapiesToConsider: "Therapies to consider",
    meditationTechniques: "Meditation techniques",
    emergencyButton: "Go to emergency support",
    safetyNote: "If things get worse or you feel unsafe, ",
    safetyNoteLink: "emergency support is available here",
    viewFullResults: "View the full results report ↗",
    exploreTherapies: "Explore therapy approaches ↗",
  },
  اردو: {
    back: "چیک ان پر واپس",
    eyebrow: "آپ کا مرحلہ",
    loading: "لوڈ ہو رہا ہے…",
    notReadyTitle: "آپ کا جائزہ ابھی تیار نہیں ہے۔",
    notReadyBody: "پہلے نجی جائزہ مکمل کریں، پھر اپنا مرحلہ اور اگلے اقدامات دیکھنے کے لیے یہاں واپس آئیں۔",
    yourNextSteps: "آپ کے اگلے قدم۔",
    phq9: "PHQ-9 (کم موڈ)", gad7: "GAD-7 (بے چینی)", k10: "K10 (مجموعی تناؤ)",
    recommendedFor: (stage: string) => `${stage} کے لیے تجویز کردہ`,
    therapiesToConsider: "غور کرنے کے لیے تھراپیز",
    meditationTechniques: "مراقبہ کی تکنیکیں",
    emergencyButton: "فوری مدد کی طرف جائیں",
    safetyNote: "اگر حالات بگڑیں یا آپ خود کو غیر محفوظ محسوس کریں تو ",
    safetyNoteLink: "فوری مدد یہاں دستیاب ہے",
    viewFullResults: "مکمل نتائج کی رپورٹ دیکھیں ↗",
    exploreTherapies: "تھراپی کے طریقے دیکھیں ↗",
  },
};

export default function RecommendationsClient() {
  const [language, setLanguage] = useLanguage();
  const isUrdu = language === "اردو";
  const text = copy[language];
  const [result, setResult] = useState<Result | null | undefined>(undefined);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem("mindhx:last-result");
    } catch {
      stored = null;
    }
    startTransition(() => {
      try {
        setResult(stored ? (JSON.parse(stored) as Result) : null);
      } catch {
        setResult(null);
      }
    });
  }, []);

  if (result === undefined) {
    return <><main className="resource-page"><p className="dashboard-loading">{text.loading}</p></main><SiteFooter language={language} /></>;
  }

  if (!result) {
    return (
      <>
      <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
        <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={text.back} />
        <section className="resource-hero">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{text.notReadyTitle}</h1>
          <p>{text.notReadyBody}</p>
          <Link className="result-primary" href="/">{text.back} <span>→</span></Link>
        </section>
      </main>
      <SiteFooter language={language} />
      </>
    );
  }

  const stage = stageFor(result, language);
  const components = result.components;
  const scales: { key: ScaleKey; name: string; score: number | null; max: number; band?: string }[] = [
    { key: "phq9", name: text.phq9, score: components?.phq9.score ?? 0, max: 27, band: components?.phq9.band },
    { key: "gad7", name: text.gad7, score: components ? components.gad7.score : 0, max: 21, band: components?.gad7.band },
    { key: "k10", name: text.k10, score: components ? components.k10.score : 0, max: 50, band: components?.k10.band },
  ];

  return (
    <>
    <main className="resource-page stage-page" dir={isUrdu ? "rtl" : "ltr"}>
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={text.back} />
      <section className="resource-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{stage.stageTitle}<br /><em>{text.yourNextSteps}</em></h1>
        <p>{stage.summary}</p>
      </section>

      <div className="stage-ladder" aria-label="Stage scale">
        {STAGE_STEPS.map((step, index) => (
          <div key={step.en} className={`stage-step ${index + 1 === stage.number ? "current" : index + 1 < stage.number ? "passed" : ""}`}>
            <span>{index + 1}</span>
            <b>{isUrdu ? step.ur : step.en}</b>
          </div>
        ))}
      </div>

      <section className="detail-rows stage-scores">
        {scales.map((scale) => (
          <div className="detail-row" key={scale.key}>
            <div className="detail-row-head"><b>{scale.name}</b><span className="detail-value">{scoreText(scale.score, scale.max, language)}</span>{scale.band && <span className="detail-band">{bandLabel(scale.band, language)}</span>}</div>
            <p>{scaleExplanation(scale.key, scale.band, language)}</p>
          </div>
        ))}
      </section>

      <section className={`recommend-card recommend-${stage.number === 5 ? "emergency" : stage.number >= 3 ? "professional" : "self"}`}>
        <p className="eyebrow">{text.recommendedFor(stage.stageTitle)}</p>
        <ul className="stage-recommendations">
          {stage.recommendations.map((item) => <li key={item}>{item}</li>)}
        </ul>
        {stage.therapies.length > 0 && (
          <>
            <h3>{text.therapiesToConsider}</h3>
            <ul className="therapy-options">
              {stage.therapies.map((therapy) => <li key={therapy.href}><Link href={therapy.href}>{therapy.label} ↗</Link><span>{therapy.note}</span></li>)}
            </ul>
          </>
        )}
        {stage.meditations.length > 0 && (
          <>
            <h3>{text.meditationTechniques}</h3>
            <ul className="therapy-options">
              {stage.meditations.map((item) => <li key={item.href}><Link href={item.href}>{item.label} ↗</Link><span>{item.note}</span></li>)}
            </ul>
          </>
        )}
        <div className="stage-actions">
          <Link className="result-primary" href={stage.primary.href}>{stage.primary.label} <span>→</span></Link>
          {stage.showEmergencyButton && <Link className="result-primary result-primary-orange" href="/emergency">{text.emergencyButton} <span>→</span></Link>}
        </div>
        {!stage.showEmergencyButton && <p className="stage-safety-note">{text.safetyNote}<Link href="/emergency">{text.safetyNoteLink}</Link>.</p>}
        <div className="recommend-also">
          <Link href="/results">{text.viewFullResults}</Link>
          <Link href="/therapies">{text.exploreTherapies}</Link>
        </div>
      </section>
    </main>
    <SiteFooter language={language} />
    </>
  );
}
