import type { Metadata } from "next";
import { pageMetadata, SITE_NAME, SITE_URL } from "./lib/seo";
import HomeClient from "./HomeClient";

export const metadata: Metadata = pageMetadata({
  title: "MindHx | Private Mental Health Check-in (Voice, Text & PHQ-9/GAD-7/K10)",
  description: "A private, five-minute mental health check-in that fuses your voice, your words, and validated PHQ-9, GAD-7, and K10 questionnaires into one explainable risk signal. No account required, nothing stored by default. Available in English and Urdu.",
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description: "An early-detection mental-health triage aid that fuses voice, language, and validated PHQ-9/GAD-7/K10 questionnaires into one explainable risk signal. Not a diagnosis.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  inLanguage: ["en", "ur"],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeClient />
    </>
  );
}
