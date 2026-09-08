import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = pageMetadata({
  title: "Your Dashboard",
  description: "Review your saved MindHx check-in history - score, band, and themes only, never a transcript.",
  path: "/dashboard",
  noindex: true,
});

export default function Page() {
  return <DashboardClient />;
}
