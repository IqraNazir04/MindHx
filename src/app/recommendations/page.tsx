import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import RecommendationsClient from "./RecommendationsClient";

export const metadata: Metadata = pageMetadata({
  title: "Your Stage and Next Steps",
  description: "Your private check-in stage, with recommended next steps - a starting point for a conversation with a qualified professional, not a diagnosis.",
  path: "/recommendations",
  noindex: true,
});

export default function Page() {
  return <RecommendationsClient />;
}
