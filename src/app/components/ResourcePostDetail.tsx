"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { fetchResourceBySlug, type ResourceRecord } from "../lib/admin";
import { useLanguage } from "../lib/language";

const SECTION_LABEL = {
  meditation: { back: "All meditation techniques", backHref: "/meditation", kicker: "PRACTICE" },
  therapy: { back: "All therapy approaches", backHref: "/therapies", kicker: "APPROACH" },
} as const;

// A post an admin published in the Meditation or Therapies section. The body is
// shown as written (English content), with the site header/footer around it.
export default function ResourcePostDetail({ slug, section }: { slug: string; section: "meditation" | "therapy" }) {
  const [language, setLanguage] = useLanguage();
  const [post, setPost] = useState<ResourceRecord | null | undefined>(undefined);
  const labels = SECTION_LABEL[section];

  useEffect(() => {
    fetchResourceBySlug(slug)
      .then((result) => {
        startTransition(() => setPost(result));
        if (result) document.title = `${result.title} | MindHx`;
      })
      .catch(() => startTransition(() => setPost(null)));
  }, [slug]);

  const isUrdu = language === "اردو";

  return (
    <>
    <main className="resource-page" dir="ltr">
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backHref={labels.backHref} backLabel={labels.back} />
      {post === undefined && <p className="dashboard-loading">Loading…</p>}
      {post === null && (
        <section className="resource-hero">
          <p className="eyebrow">{labels.kicker}</p>
          <h1>Not found</h1>
          <p>This post doesn&apos;t exist or isn&apos;t published. <Link href={labels.backHref}>{labels.back}</Link></p>
        </section>
      )}
      {post && (
        <>
          <section className="resource-hero">
            <p className="eyebrow">{labels.kicker}</p>
            <h1>{post.title}</h1>
            {post.summary && <p>{post.summary}</p>}
          </section>
          {post.image_data_url && <img className="resource-hero-image" src={post.image_data_url} alt="" />}
          <section className="admin-section">
            <div className="resource-body">{post.body.split("\n").map((paragraph, index) => paragraph.trim() && <p key={index}>{paragraph}</p>)}</div>
          </section>
        </>
      )}
    </main>
    <SiteFooter language={language} />
    </>
  );
}
