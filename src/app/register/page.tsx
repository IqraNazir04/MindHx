import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = pageMetadata({
  title: "Create an Account",
  description: "Create an optional MindHx account to save your check-in history over time - only the score, band, and themes are ever stored, never a transcript.",
  path: "/register",
  noindex: true,
});

export default function Page() {
  return <RegisterClient />;
}
