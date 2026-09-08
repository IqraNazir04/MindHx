import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import MeditationClient from "./MeditationClient";

export const metadata: Metadata = pageMetadata({
  title: "Meditation & Grounding Techniques",
  description: "Step-by-step meditation and grounding techniques - box breathing, 5-4-3-2-1 grounding, body scan, progressive muscle relaxation, mindful walking, and more - with practical instructions and original illustrated steps.",
  path: "/meditation",
});

export default function Page() {
  return <MeditationClient />;
}
