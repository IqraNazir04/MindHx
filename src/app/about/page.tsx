import type { Metadata } from "next";
import { pageMetadata, SITE_URL } from "../lib/seo";
import AboutClient from "./AboutClient";

export const metadata: Metadata = pageMetadata({
  title: "About MindHx",
  description: "Why MindHx exists, how its three signals work together, what it keeps and what it doesn't, where a check-in routes next, and who it is - and isn't - built for.",
  path: "/about",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About MindHx",
  description: "Why MindHx exists, how its three signals work together, what it keeps and what it doesn't, where a check-in routes next, and who it is - and isn't - built for.",
  url: `${SITE_URL}/about`,
  inLanguage: ["en", "ur"],
  mainEntity: {
    "@type": "Organization",
    name: "MindHx",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-mark.png`,
    description: "An early-detection mental-health triage aid that fuses voice, language, and validated PHQ-9/GAD-7/K10 questionnaires into one explainable risk signal. Not a diagnosis - private by default, bilingual in English and Urdu.",
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutClient />
    </>
  );
}
