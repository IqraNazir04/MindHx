import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import MedicationClient from "./MedicationClient";

export const metadata: Metadata = pageMetadata({
  title: "Medication Reference",
  description: "General, non-prescriptive education on SSRIs, short-term anxiety medicines, and sleep-related treatment. MindHx never prescribes - always speak with a licensed prescriber before starting, stopping, or changing any medication.",
  path: "/medication",
});

export default function Page() {
  return <MedicationClient />;
}
