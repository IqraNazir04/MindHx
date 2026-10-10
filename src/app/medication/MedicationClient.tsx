"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { fetchPublishedResources, type ResourceRecord } from "../lib/admin";
import SiteHeader from "../components/SiteHeader";
import { DoodleLeaf } from "../components/Doodles";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";
import { useLanguage } from "../lib/language";
import { medications } from "./data";

const copy = {
  English: {
    eyebrow: "01 / MEDICATION REFERENCE",
    titleLine1: "Medication information",
    titleLine2: "for an informed conversation.",
    intro: "General reference information only. MindHx does not prescribe, personalize, or recommend medication. Always speak with a licensed prescriber before starting, stopping, or changing any medication.",
    reference: "REFERENCE",
    learnMore: "Learn more",
  },
  اردو: {
    eyebrow: "01 / ادویات کی معلومات",
    titleLine1: "ادویات کی معلومات",
    titleLine2: "ایک باخبر گفتگو کے لیے۔",
    intro: "صرف عمومی حوالہ جاتی معلومات۔ MindHx ادویات تجویز، ذاتی نوعیت، یا سفارش نہیں کرتا۔ کوئی بھی دوا شروع کرنے، روکنے، یا تبدیل کرنے سے پہلے ہمیشہ ایک مستند تجویز کنندہ سے بات کریں۔",
    reference: "حوالہ",
    learnMore: "مزید جانیں",
  },
};

export default function MedicationClient() {
  const [language, setLanguage] = useLanguage();
  const [adminPosts, setAdminPosts] = useState<ResourceRecord[]>([]);
  useEffect(() => {
    fetchPublishedResources("medication")
      .then((list) => startTransition(() => setAdminPosts(list)))
      .catch(() => {});
  }, []);
  const text = copy[language];
  const isUrdu = language === "اردو";

  return (
    <>
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <DoodleLeaf className="doodle doodle-teal doodle-sway" style={{ top: "55%", left: "2%", width: "28px", height: "auto" }} />
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={isUrdu ? "چیک ان پر واپس" : "Back to check-in"} />
      <div className="resource-hero-banner">
        <NatureBanner {...naturePhotos.balancedStones} priority />
        <section className="resource-hero">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{text.titleLine1}<br /><em>{text.titleLine2}</em></h1>
          <p>{text.intro}</p>
        </section>
      </div>
      <section className="reference-grid">
        {medications.map((medication) => {
          const content = medication[isUrdu ? "ur" : "en"];
          return (
            <Link key={medication.slug} href={`/medication/${medication.slug}`} className="reference-card-link">
              <article>
                <p className="card-kicker">{text.reference}</p>
                <h2>{content.name}</h2>
                <p className="reference-card-summary">{content.use}</p>
                <footer>{text.learnMore} <span className="footer-arrow">→</span></footer>
              </article>
            </Link>
          );
        })}
        {adminPosts.map((post) => (
          <Link key={post.slug} href={`/medication/post/${post.slug}`} className="reference-card-link">
            <article>
              {post.image_data_url && <img className="admin-post-card-image" src={post.image_data_url} alt="" />}
              <p className="card-kicker">{text.reference}</p>
              <h2>{post.title}</h2>
              <p className="reference-card-summary">{post.summary}</p>
              <footer>{text.learnMore} <span className="footer-arrow">→</span></footer>
            </article>
          </Link>
        ))}
      </section>
    </main>
    <SiteFooter language={language} />
    </>
  );
}
