"use client";

import { useEffect, useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import NatureBanner from "../../components/NatureBanner";
import { naturePhotos } from "../../components/naturePhotos";
import SiteFooter from "../../components/SiteFooter";
import { fetchResourceBySlug, type ResourceRecord } from "../../lib/admin";
import { useLanguage } from "../../lib/language";

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
    loading: "Loading…",
    notFoundTitle: "Not found",
    notFoundBody: "This resource doesn't exist or isn't published.",
  },
  اردو: {
    back: "چیک ان پر واپس",
    eyebrow: "وسائل",
    loading: "لوڈ ہو رہا ہے…",
    notFoundTitle: "نہیں ملا",
    notFoundBody: "یہ وسیلہ موجود نہیں ہے یا شائع نہیں ہوا۔",
  },
};

export default function ResourceDetailClient({ slug }: { slug: string }) {
  const [language, setLanguage] = useLanguage();
  const isUrdu = language === "اردو";
  const text = copy[language];
  const [resource, setResource] = useState<ResourceRecord | null | undefined>(undefined);

  useEffect(() => {
    fetchResourceBySlug(slug)
      .then((result) => {
        setResource(result);
        if (result) document.title = `${result.title} | MindHx`;
      })
      .catch(() => setResource(null));
  }, [slug]);

  if (resource === undefined) {
    return <><main className="resource-page"><p className="dashboard-loading">{text.loading}</p></main><SiteFooter language={language} /></>;
  }

  if (!resource) {
    return (
      <>
      <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
        <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={text.back} />
        <section className="resource-hero">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{text.notFoundTitle}</h1>
          <p>{text.notFoundBody}</p>
        </section>
      </main>
      <SiteFooter language={language} />
      </>
    );
  }

  const typeLabel = TYPE_LABEL[resource.resource_type];

  return (
    <>
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={text.back} />
      <section className="resource-hero">
        <p className="eyebrow">{typeLabel ? (isUrdu ? typeLabel.ur : typeLabel.en) : resource.resource_type}</p>
        <h1>{resource.title}</h1>
        {resource.summary && <p>{resource.summary}</p>}
      </section>
      {resource.image_data_url
        ? <img className="resource-hero-image" src={resource.image_data_url} alt="" />
        : <NatureBanner {...naturePhotos.meadow} priority />}
      <section className="admin-section">
        <div className="resource-body">{resource.body.split("\n").map((paragraph, index) => paragraph.trim() && <p key={index}>{paragraph}</p>)}</div>
      </section>
    </main>
    <SiteFooter language={language} />
    </>
  );
}
