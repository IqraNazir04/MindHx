import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import AiClient from "./AiClient";

export const metadata: Metadata = pageMetadata({
  title: "MindHx AI - Safety-Gated Mental Health Chat",
  description: "A bounded, source-grounded AI chat for early-stage stress and mental-health questions. Safety-gated before every reply, grounded only in reviewed reference material - never diagnosing, never prescribing, never improvising crisis counseling.",
  path: "/ai",
});

export default function Page() {
  return <AiClient />;
}
