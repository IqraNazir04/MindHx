"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { DoodleCloud } from "../components/Doodles";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";

type CrisisContext = {
  source: "phq9_item9" | "text_crisis_language" | "manual";
  language: "en" | "ur";
};

const copy = {
  en: {
    eyebrow: "IMMEDIATE SUPPORT",
    title: "You do not have to handle this alone.",
    lede: "MindHx detected a safety signal in your check-in. This page is not a diagnosis — it is the fastest route to a person who can help right now.",
    stepsTitle: "Right now",
    steps: [
      "If you are in immediate danger, contact your local emergency number now.",
      "Reach out to a crisis line or a trusted person and stay with them, in person or on a call.",
      "Remove access to anything you could use to harm yourself, if you can.",
      "If symptoms ease, still bring this check-in to a licensed professional for a full evaluation.",
    ],
    notDiagnosis: "This is a risk-tier signal, not a diagnosis. Only a qualified professional can assess and treat what you are experiencing.",
    findHelp: "Find help",
    findHelpBody: "Search for a local crisis line, emergency service, or hospital emergency department in your country. If you already have a therapist, psychiatrist, or doctor, contact them directly.",
    talkTherapist: "Talk to a professional",
    backHome: "Back to check-in",
  },
  ur: {
    eyebrow: "فوری مدد",
    title: "آپ کو یہ اکیلے نہیں سنبھالنا۔",
    lede: "MindHx نے آپ کے جائزے میں ایک حفاظتی اشارہ محسوس کیا ہے۔ یہ صفحہ تشخیص نہیں ہے — یہ ابھی کسی مددگار شخص تک پہنچنے کا تیز ترین راستہ ہے۔",
    stepsTitle: "ابھی کریں",
    steps: [
      "اگر آپ فوری خطرے میں ہیں تو ابھی اپنے مقامی ہنگامی نمبر پر رابطہ کریں۔",
      "کسی بحرانی ہیلپ لائن یا قابلِ اعتماد شخص سے رابطہ کریں اور ان کے ساتھ رہیں، ذاتی طور پر یا کال پر۔",
      "اگر ممکن ہو تو خود کو نقصان پہنچانے کی کسی بھی چیز تک رسائی ختم کریں۔",
      "علامات کم ہونے پر بھی، اس جائزے کو مکمل تشخیص کے لیے کسی مستند ماہر کے پاس ضرور لے جائیں۔",
    ],
    notDiagnosis: "یہ ایک خطرے کی سطح کا اشارہ ہے، تشخیص نہیں۔ آپ کی کیفیت کا جائزہ اور علاج صرف ایک مستند ماہر ہی کر سکتا ہے۔",
    findHelp: "مدد تلاش کریں",
    findHelpBody: "اپنے ملک میں کسی مقامی بحرانی ہیلپ لائن، ہنگامی سروس، یا ہسپتال کے ایمرجنسی شعبے کو تلاش کریں۔ اگر آپ کا پہلے سے کوئی معالج، ماہرِ نفسیات، یا ڈاکٹر ہے تو براہِ راست ان سے رابطہ کریں۔",
    talkTherapist: "کسی ماہر سے بات کریں",
    backHome: "چیک ان پر واپس جائیں",
  },
};

export default function EmergencyClient() {
  const [context, setContext] = useState<CrisisContext | null>(null);
  const [manualLanguage, setManualLanguage] = useState<"en" | "ur" | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("mindhx:crisis-context");
    if (stored) startTransition(() => setContext(JSON.parse(stored) as CrisisContext));
  }, []);

  const language = manualLanguage ?? (context?.language === "ur" ? "ur" : "en");
  const text = copy[language];

  return (
    <>
    <main className="resource-page emergency-page" dir={language === "ur" ? "rtl" : "ltr"}>
      <DoodleCloud className="doodle doodle-blue doodle-float-slow" style={{ top: "95px", right: "6%", opacity: 0.3 }} />
      <SiteHeader
        language={language === "ur" ? "اردو" : "English"}
        onToggleLanguage={() => setManualLanguage(language === "ur" ? "en" : "ur")}
        backLabel={text.backHome}
      />
      <section className="resource-hero emergency-hero">
        <p className="eyebrow crisis-eyebrow">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <p>{text.lede}</p>
      </section>
      <NatureBanner {...naturePhotos.softDawn} priority />
      <section className="emergency-steps">
        <p className="card-kicker">{text.stepsTitle}</p>
        <ol>{text.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </section>
      <div className="crisis-card emergency-notice">{text.notDiagnosis}</div>
      <section className="therapist-contact">
        <div>
          <p className="card-kicker">{text.findHelp}</p>
          <p>{text.findHelpBody}</p>
        </div>
      </section>
      <div className="emergency-actions">
        <Link className="result-primary" href="/therapist">{text.talkTherapist} <span>→</span></Link>
        <Link className="resource-back" href="/">{text.backHome} ↗</Link>
      </div>
    </main>
    <SiteFooter language={language === "ur" ? "اردو" : "English"} />
    </>
  );
}
