"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";

const copy = {
  English: {
    eyebrow: "05 / PROFESSIONAL REFERRAL",
    titleLine1: "Take the next step",
    titleLine2: "with a licensed professional.",
    intro: "Bring your MindHx screening results to a qualified clinician. They can review your context, symptoms, safety, medical history, and treatment options with you. MindHx flags elevated risk - only a clinician can assess or diagnose.",
    whatToSay: "WHAT TO SAY",
    quote: "“I completed a mental-health screening and would like a professional evaluation.”",
    directory: "Use a regulated local provider directory, hospital service, university clinic, or established telehealth provider in your country.",
    beforeAppointment: "Before the appointment",
    keepReady: "Keep your PHQ-9, GAD-7, K10 results, text/voice explanation, current medicines, and questions ready if you choose to share them.",
    noBooking: "MindHx does not book appointments or provide emergency care.",
    safetyConcern: "Immediate safety concern?",
    safetyBody: "Contact local emergency services or a crisis line now. If you may hurt yourself or someone else, do not wait for a routine appointment. Open MindHx's emergency support page ↗",
  },
  اردو: {
    eyebrow: "05 / پیشہ ورانہ ریفرل",
    titleLine1: "اگلا قدم اٹھائیں",
    titleLine2: "ایک مستند ماہر کے ساتھ۔",
    intro: "اپنے MindHx اسکریننگ نتائج ایک مستند معالج کے پاس لے جائیں۔ وہ آپ کے ساتھ آپ کا سیاق و سباق، علامات، حفاظت، طبی تاریخ، اور علاج کے اختیارات کا جائزہ لے سکتے ہیں۔ MindHx بڑھے ہوئے خطرے کی نشاندہی کرتا ہے - صرف ایک معالج تشخیص کر سکتا ہے۔",
    whatToSay: "کیا کہیں",
    quote: "“میں نے ایک ذہنی صحت کی اسکریننگ مکمل کی ہے اور ایک پیشہ ورانہ جائزہ چاہتا/چاہتی ہوں۔”",
    directory: "اپنے ملک میں ایک مستند مقامی فراہم کنندہ ڈائریکٹری، ہسپتال سروس، یونیورسٹی کلینک، یا معتبر ٹیلی ہیلتھ فراہم کنندہ استعمال کریں۔",
    beforeAppointment: "ملاقات سے پہلے",
    keepReady: "اگر آپ شیئر کرنا چاہیں تو اپنے PHQ-9، GAD-7، K10 نتائج، متن/آواز کی وضاحت، موجودہ ادویات، اور سوالات تیار رکھیں۔",
    noBooking: "MindHx ملاقاتیں بک نہیں کرتا یا ہنگامی نگہداشت فراہم نہیں کرتا۔",
    safetyConcern: "فوری حفاظتی خدشہ؟",
    safetyBody: "ابھی مقامی ہنگامی خدمات یا بحرانی ہیلپ لائن سے رابطہ کریں۔ اگر آپ خود کو یا کسی اور کو نقصان پہنچا سکتے ہیں تو معمول کی ملاقات کا انتظار نہ کریں۔ MindHx کا فوری مدد کا صفحہ کھولیں ↗",
  },
};

export default function TherapistPage() {
  const [language, setLanguage] = useState<"English" | "اردو">("English");
  const text = copy[language];
  const isUrdu = language === "اردو";

  return (
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backHref="/results" backLabel={isUrdu ? "نتائج پر واپس" : "Back to results"} />
      <section className="resource-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.titleLine1}<br /><em>{text.titleLine2}</em></h1>
        <p>{text.intro}</p>
      </section>
      <section className="therapist-contact">
        <div>
          <p className="card-kicker">{text.whatToSay}</p>
          <h2>{text.quote}</h2>
          <p>{text.directory}</p>
        </div>
        <div className="resource-note">
          <b>{text.beforeAppointment}</b>
          <p>{text.keepReady}</p>
          <p>{text.noBooking}</p>
        </div>
      </section>
      <Link className="crisis-resource" href="/emergency">
        <b>{text.safetyConcern}</b>
        <p>{text.safetyBody}</p>
      </Link>
    </main>
  );
}
