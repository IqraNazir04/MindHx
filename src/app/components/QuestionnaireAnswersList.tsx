import Link from "next/link";
import type { QuestionnaireAnswers } from "../lib/auth";
import { answerOptionsEn, gadQuestionsEn, k10OptionsEn, k10QuestionsEn, questionsEn } from "../lib/questionnaires";

// A saved check-in's item-by-item questionnaire answers, one collapsible
// section per questionnaire. Shared by the admin panel ("admin") and the
// person's own dashboard ("self") - only the PHQ-9 item 9 note differs.

const QUESTIONNAIRES = [
  { key: "phq9", title: "PHQ-9", max: 27, questions: questionsEn, options: answerOptionsEn, offset: 0 },
  { key: "gad7", title: "GAD-7", max: 21, questions: gadQuestionsEn, options: answerOptionsEn, offset: 0 },
  // K10 answers are stored on its 1-5 scale; its labels are indexed 0-4.
  { key: "k10", title: "K10", max: 50, questions: k10QuestionsEn, options: k10OptionsEn, offset: 1 },
] as const;

export default function QuestionnaireAnswersList({ answers, audience }: { answers: QuestionnaireAnswers; audience: "admin" | "self" }) {
  const item9 = answers.phq9[8];
  return (
    <div className="answers-list">
      {item9 > 0 && (
        audience === "admin"
          ? <p className="answers-alert">PHQ-9 item 9 (thoughts of self-harm) was answered &ldquo;{answerOptionsEn[item9]}&rdquo;.</p>
          : <p className="answers-alert">In this check-in you said you&apos;d had thoughts of being better off dead or of hurting yourself. If you feel that way now, <Link href="/emergency">immediate support is here</Link>.</p>
      )}
      {QUESTIONNAIRES.map((scale) => {
        const scaleAnswers = answers[scale.key];
        const total = scaleAnswers.reduce((sum, answer) => sum + answer, 0);
        return (
          <details key={scale.key}>
            <summary>{scale.title} - {total} of {scale.max}</summary>
            <ol>
              {scale.questions.map((question, index) => (
                <li key={question} className={scale.key === "phq9" && index === 8 && scaleAnswers[index] > 0 ? "answers-flag" : undefined}>
                  <span>{question}</span>
                  <b>{scale.options[scaleAnswers[index] - scale.offset] ?? "—"}</b>
                </li>
              ))}
            </ol>
          </details>
        );
      })}
    </div>
  );
}
