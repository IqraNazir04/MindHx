"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { DoodleLeaf, DoodleWave } from "../components/Doodles";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";
import { fetchPublishedResources, type ResourceRecord } from "../lib/admin";
import { useLanguage } from "../lib/language";

const TYPE_LABEL: Record<string, { en: string; ur: string }> = {
  meditation: { en: "Meditation", ur: "مراقبہ" },
  therapy: { en: "Therapy", ur: "تھراپی" },
  medication: { en: "Medication", ur: "ادویات" },
  general: { en: "General", ur: "عمومی" },
};

const copy = {
  English: {
    back: "Back to check-in",
    eyebrow: "RESOURCES",
    titleA: "Additional guidance",
    titleB: "from the MindHx team.",
    intro: "Alongside our meditation techniques and therapy approaches - general information, not individualized treatment.",
    loadError: "Could not load resources right now.",
    loading: "Loading…",
    empty: "No resources published yet - check back soon.",
    readMore: "Read more →",
  },
  اردو: {
    back: "چیک ان پر واپس",
    eyebrow: "وسائل",
    titleA: "اضافی رہنمائی",
    titleB: "MindHx ٹیم کی جانب سے۔",
    intro: "ہماری مراقبہ کی تکنیکوں اور تھراپی کے طریقوں کے ساتھ - عمومی معلومات، انفرادی علاج نہیں۔",
    loadError: "ابھی وسائل لوڈ نہیں ہو سکے۔",
    loading: "لوڈ ہو رہا ہے…",
    empty: "ابھی تک کوئی وسائل شائع نہیں ہوئے - بعد میں دوبارہ دیکھیں۔",
    readMore: "مزید پڑھیں ←",
  },
};

export default function ResourcesClient() {
  const [language, setLanguage] = useLanguage();
  const isUrdu = language === "اردو";
  const text = copy[language];
  const [resources, setResources] = useState<ResourceRecord[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPublishedResources()
      .then(setResources)
      .catch(() => setError(text.loadError));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <DoodleLeaf className="doodle doodle-teal doodle-sway" style={{ top: "55%", left: "2%", width: "26px", height: "auto" }} />
      <DoodleWave className="doodle doodle-blue doodle-float" style={{ bottom: "6%", right: "8%" }} />
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={text.back} />
      <div className="resource-hero-banner">
        <NatureBanner {...naturePhotos.meadow} priority />
        <section className="resource-hero">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{text.titleA}<br /><em>{text.titleB}</em></h1>
          <p>{text.intro}</p>
        </section>
      </div>
      {error && <p className="assessment-error dashboard-error">{error}</p>}
      {resources === null && !error && <p className="dashboard-loading">{text.loading}</p>}
      {resources?.length === 0 && <p className="dashboard-loading">{text.empty}</p>}
      {resources && resources.length > 0 && (
        <section className="reference-grid">
          {resources.map((resource) => {
            const typeLabel = TYPE_LABEL[resource.resource_type];
            return (
              <Link key={resource.id} href={`/resources/${resource.slug}`} className="reference-card-link">
                <article>
                  {resource.image_data_url && <img className="reference-card-image" src={resource.image_data_url} alt="" />}
                  <p className="card-kicker">{typeLabel ? (isUrdu ? typeLabel.ur : typeLabel.en) : resource.resource_type}</p>
                  <h2>{resource.title}</h2>
                  <p className="reference-card-summary">{resource.summary}</p>
                  <footer>{text.readMore}</footer>
                </article>
              </Link>
            );
          })}
        </section>
      )}
    </main>
    <SiteFooter language={language} />
    </>
  );
}
