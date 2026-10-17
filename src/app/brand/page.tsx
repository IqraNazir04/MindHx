import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import BrandClient from "./BrandClient";

export const metadata: Metadata = pageMetadata({
  title: "Brand & Color System",
  description: "MindHx's color system and design tokens - blue for voice, teal for clinical scales, orange for language, and a reserved red used only for crisis and safety contexts.",
  path: "/brand",
  noindex: true,
});

export default function Page() {
  return <BrandClient />;
}
