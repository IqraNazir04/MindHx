import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import TherapistClient from "./TherapistClient";

export const metadata: Metadata = pageMetadata({
  title: "Find a Therapist or Psychiatrist in Pakistan",
  description: "A verified, city-by-city directory of psychiatrists and psychologists in Pakistan, real public and private institutions, live doctor-directory links, and what to actually say at your first appointment.",
  path: "/therapist",
});

export default function Page() {
  return <TherapistClient />;
}
