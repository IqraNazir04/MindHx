import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import ResultsClient from "./ResultsClient";

export const metadata: Metadata = pageMetadata({
  title: "Your Check-in Results",
  description: "Your private, explainable mental-health check-in results - a starting point for a conversation with a qualified professional, not a diagnosis.",
  path: "/results",
  noindex: true,
});

export default function Page() {
  return <ResultsClient />;
}
