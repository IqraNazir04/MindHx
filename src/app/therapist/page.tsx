"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { DoodleHeart, DoodleSun } from "../components/Doodles";
import { CITIES, getDirectoryLinks, getProvidersForCity, type City } from "./providers";

const TYPE_LABELS: Record<string, { en: string; ur: string }> = {
  "Public hospital": { en: "Public hospital", ur: "سرکاری ہسپتال" },
  "Private hospital": { en: "Private hospital", ur: "نجی ہسپتال" },
  "NGO / community clinic": { en: "NGO / community clinic", ur: "فلاحی ادارہ / کمیونٹی کلینک" },
};

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
    findEyebrow: "FIND A PROFESSIONAL IN PAKISTAN",
    findTitle: "Search by city",
    findIntro: "A starting point for finding psychiatrists and psychologists in Pakistan. This is not exhaustive and not an endorsement - confirm credentials and details yourself.",
    selectCity: "City",
    curatedTitle: "Known institutions",
    noCurated: "No institution is curated for this city yet - use the live directories below instead.",
    liveDirectories: "Live doctor directories",
    liveDirectoriesBody: "These platforms maintain current, verified individual psychiatrist and psychologist profiles with fees, reviews, and booking - more reliable than a static list for finding an individual provider.",
    psychiatrists: "Psychiatrists",
    psychologists: "Psychologists",
    visit: "Visit",
    findDisclaimer: "MindHx does not verify real-time availability, fees, or credentials for any listing above. Confirm details directly with the provider before booking.",
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
    findEyebrow: "پاکستان میں ماہر تلاش کریں",
    findTitle: "شہر کے مطابق تلاش کریں",
    findIntro: "پاکستان میں ماہرینِ نفسیات اور سائیکاٹرسٹ تلاش کرنے کے لیے ایک نقطہ آغاز۔ یہ مکمل فہرست نہیں اور نہ ہی کسی کی سفارش ہے - اسناد اور تفصیلات خود تصدیق کریں۔",
    selectCity: "شہر",
    curatedTitle: "معروف ادارے",
    noCurated: "اس شہر کے لیے ابھی کوئی ادارہ درج نہیں - براہ کرم ذیل کی لائیو ڈائریکٹریز استعمال کریں۔",
    liveDirectories: "لائیو معالج ڈائریکٹریز",
    liveDirectoriesBody: "یہ پلیٹ فارمز انفرادی سائیکاٹرسٹ اور ماہرینِ نفسیات کے تازہ ترین، مصدقہ پروفائلز فیس، جائزوں، اور بکنگ کے ساتھ برقرار رکھتے ہیں - انفرادی معالج تلاش کرنے کے لیے ایک جامد فہرست سے زیادہ قابلِ اعتماد۔",
    psychiatrists: "سائیکاٹرسٹ",
    psychologists: "ماہرینِ نفسیات",
    visit: "دیکھیں",
    findDisclaimer: "MindHx مذکورہ بالا کسی بھی فہرست کی حقیقی وقت کی دستیابی، فیس، یا اسناد کی تصدیق نہیں کرتا۔ بکنگ سے پہلے تفصیلات براہ راست فراہم کنندہ سے تصدیق کریں۔",
  },
};

export default function TherapistPage() {
  const [language, setLanguage] = useState<"English" | "اردو">("English");
  const [city, setCity] = useState<City>("Karachi");
  const text = copy[language];
  const isUrdu = language === "اردو";
  const cityProviders = getProvidersForCity(city);
  const directories = getDirectoryLinks(city);

  return (
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <DoodleSun className="doodle doodle-orange doodle-float-slow" style={{ top: "100px", right: "5%" }} />
      <DoodleHeart className="doodle doodle-teal doodle-sway" style={{ top: "55%", left: "2%" }} />
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
      <section className="provider-finder">
        <div className="result-section-heading">
          <p className="eyebrow">{text.findEyebrow}</p>
          <h2>{text.findTitle}</h2>
          <p>{text.findIntro}</p>
        </div>
        <label className="provider-city-select">
          <span>{text.selectCity}</span>
          <select value={city} onChange={(event) => setCity(event.target.value as City)}>
            {CITIES.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>

        <div className="provider-block">
          <p className="card-kicker">{text.curatedTitle}</p>
          {cityProviders.length > 0 ? (
            <div className="provider-grid">
              {cityProviders.map((provider) => (
                <article key={provider.name} className="provider-card">
                  <span className="provider-type">{TYPE_LABELS[provider.type][isUrdu ? "ur" : "en"]}</span>
                  <h3>{provider.name}</h3>
                  <p>{provider.note}</p>
                  <a href={provider.link} target="_blank" rel="noopener noreferrer">{text.visit} ↗</a>
                </article>
              ))}
            </div>
          ) : (
            <p className="provider-empty">{text.noCurated}</p>
          )}
        </div>

        <div className="provider-block">
          <p className="card-kicker">{text.liveDirectories}</p>
          <p className="provider-directories-body">{text.liveDirectoriesBody}</p>
          <div className="provider-directory-grid">
            {directories.map((directory) => (
              <article key={directory.name} className="provider-directory-card">
                <h3>{directory.name}</h3>
                <div className="provider-directory-links">
                  <a href={directory.psychiatristUrl} target="_blank" rel="noopener noreferrer">{text.psychiatrists} ↗</a>
                  <a href={directory.psychologistUrl} target="_blank" rel="noopener noreferrer">{text.psychologists} ↗</a>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="provider-disclaimer">{text.findDisclaimer}</p>
      </section>

      <Link className="crisis-resource" href="/emergency">
        <b>{text.safetyConcern}</b>
        <p>{text.safetyBody}</p>
      </Link>
    </main>
  );
}
