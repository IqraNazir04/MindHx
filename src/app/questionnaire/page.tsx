import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import QuestionnaireClient from "./QuestionnaireClient";

export const metadata: Metadata = pageMetadata({
  title: "Clinical Check-in (PHQ-9, GAD-7, K10)",
  description: "The PHQ-9, GAD-7, and K10 validated questionnaires, part of your private MindHx check-in.",
  path: "/questionnaire",
  noindex: true,
});

export default function Page() {
  return <QuestionnaireClient />;
}
