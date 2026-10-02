// Bridges the PHQ-9/GAD-7/K10 answers between the home page (which owns the
// combined score, crisis check, and submission) and the standalone
// /questionnaire page (where the questions are actually answered). Both
// pages read and write this on every change, so navigating between them
// never loses progress. Session-scoped only, like every other check-in
// draft in this app - nothing here is written to a server until the user
// explicitly submits their check-in.
const QUESTIONNAIRE_DRAFT_KEY = "mindhx:questionnaire-draft";

export type QuestionnaireDraft = {
  answers: number[];
  gadAnswers: number[];
  k10Answers: number[];
};

export function loadQuestionnaireDraft(defaults: QuestionnaireDraft): QuestionnaireDraft {
  try {
    const raw = sessionStorage.getItem(QUESTIONNAIRE_DRAFT_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      answers: Array.isArray(parsed.answers) && parsed.answers.length === defaults.answers.length ? parsed.answers : defaults.answers,
      gadAnswers: Array.isArray(parsed.gadAnswers) && parsed.gadAnswers.length === defaults.gadAnswers.length ? parsed.gadAnswers : defaults.gadAnswers,
      k10Answers: Array.isArray(parsed.k10Answers) && parsed.k10Answers.length === defaults.k10Answers.length ? parsed.k10Answers : defaults.k10Answers,
    };
  } catch {
    return defaults;
  }
}

export function saveQuestionnaireDraft(draft: QuestionnaireDraft): void {
  try {
    sessionStorage.setItem(QUESTIONNAIRE_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage unavailable (private browsing, quota) - progress just won't
    // persist across navigation; answering still works within this page.
  }
}
