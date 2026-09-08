import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import TherapiesClient from "./TherapiesClient";

export const metadata: Metadata = pageMetadata({
  title: "Therapy Approaches Explained (CBT, DBT & More)",
  description: "Plain-language guides to CBT, DBT, exposure therapy, trauma-informed care, medical review, and peer support groups - what each approach actually involves, so you know what to expect before talking to a professional.",
  path: "/therapies",
});

export default function Page() {
  return <TherapiesClient />;
}
