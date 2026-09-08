"use client";

import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { DoodleHeart, DoodleLeaf } from "../components/Doodles";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";

const entries = [
  {
    en: { name: "SSRIs", use: "Commonly prescribed for depression and some anxiety disorders.", details: "A prescriber determines the medicine, dose, timing, and follow-up. Nausea, sleep changes, and other effects can occur." },
    ur: { name: "ایس ایس آر آئیز", use: "عام طور پر ڈپریشن اور کچھ اضطرابی امراض کے لیے تجویز کی جاتی ہیں۔", details: "دوا، خوراک، وقت، اور فالو اپ ایک تجویز کنندہ طے کرتا ہے۔ متلی، نیند میں تبدیلی، اور دیگر اثرات ہو سکتے ہیں۔" },
  },
  {
    en: { name: "Short-term anxiety medicines", use: "Some medicines may be used for acute symptoms under close clinical supervision.", details: "Dependence, sedation, and interactions are important considerations. These are not suitable for everyone." },
    ur: { name: "قلیل مدتی اضطراب کی ادویات", use: "کچھ ادویات شدید علامات کے لیے قریبی طبی نگرانی میں استعمال ہو سکتی ہیں۔", details: "انحصار، غنودگی، اور دیگر ادویات کے ساتھ تعامل اہم امور ہیں۔ یہ سب کے لیے موزوں نہیں۔" },
  },
  {
    en: { name: "Sleep-related treatment", use: "Sleep problems may be addressed through behavioral care, medical review, or medication when appropriate.", details: "A clinician should check other causes, current medicines, and safety before recommending treatment." },
    ur: { name: "نیند سے متعلق علاج", use: "نیند کے مسائل رویے پر مبنی نگہداشت، طبی جائزے، یا ضرورت پڑنے پر ادویات کے ذریعے حل کیے جا سکتے ہیں۔", details: "علاج تجویز کرنے سے پہلے ایک معالج کو دیگر اسباب، موجودہ ادویات، اور حفاظت کی جانچ کرنی چاہیے۔" },
  },
];

const copy = {
  English: {
    eyebrow: "01 / MEDICATION REFERENCE",
    titleLine1: "Medication information",
    titleLine2: "for an informed conversation.",
    intro: "General reference information only. MindHx does not prescribe, personalize, or recommend medication. Always speak with a licensed prescriber before starting, stopping, or changing any medication.",
    reference: "REFERENCE",
    generallyUsedFor: "Generally used for",
    considerations: "Important considerations",
    footer: "Talk to a licensed prescriber before making changes.",
  },
  اردو: {
    eyebrow: "01 / ادویات کی معلومات",
    titleLine1: "ادویات کی معلومات",
    titleLine2: "ایک باخبر گفتگو کے لیے۔",
    intro: "صرف عمومی حوالہ جاتی معلومات۔ MindHx ادویات تجویز، ذاتی نوعیت، یا سفارش نہیں کرتا۔ کوئی بھی دوا شروع کرنے، روکنے، یا تبدیل کرنے سے پہلے ہمیشہ ایک مستند تجویز کنندہ سے بات کریں۔",
    reference: "حوالہ",
    generallyUsedFor: "عام طور پر استعمال ہوتی ہے",
    considerations: "اہم امور",
    footer: "تبدیلی کرنے سے پہلے ایک مستند تجویز کنندہ سے بات کریں۔",
  },
};

export default function MedicationClient() {
  const [language, setLanguage] = useState<"English" | "اردو">("English");
  const text = copy[language];
  const isUrdu = language === "اردو";

  return (
    <>
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <DoodleHeart className="doodle doodle-orange doodle-float" style={{ top: "100px", right: "5%" }} />
      <DoodleLeaf className="doodle doodle-teal doodle-sway" style={{ top: "55%", left: "2%", width: "28px", height: "auto" }} />
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={isUrdu ? "چیک ان پر واپس" : "Back to check-in"} />
      <section className="resource-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.titleLine1}<br /><em>{text.titleLine2}</em></h1>
        <p>{text.intro}</p>
      </section>
      <NatureBanner {...naturePhotos.balancedStones} />
      <section className="reference-grid">
        {entries.map((entry) => {
          const content = entry[isUrdu ? "ur" : "en"];
          return (
            <article key={content.name}>
              <p className="card-kicker">{text.reference}</p>
              <h2>{content.name}</h2>
              <b>{text.generallyUsedFor}</b>
              <p>{content.use}</p>
              <b>{text.considerations}</b>
              <p>{content.details}</p>
              <footer>{text.footer}</footer>
            </article>
          );
        })}
      </section>
    </main>
    <SiteFooter language={language} />
    </>
  );
}
