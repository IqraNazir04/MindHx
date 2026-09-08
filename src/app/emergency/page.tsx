import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import EmergencyClient from "./EmergencyClient";

export const metadata: Metadata = pageMetadata({
  title: "Emergency Mental Health Support",
  description: "Immediate guidance and next steps if you or someone you know may be in danger - local crisis contacts and a fast path to real help. Not a diagnosis, and not a substitute for emergency services.",
  path: "/emergency",
});

export default function Page() {
  return <EmergencyClient />;
}
