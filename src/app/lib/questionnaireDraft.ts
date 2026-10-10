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

// The home page's other two signals - the voice note's transcript and tone
// reading, and the written reflection with its word-choice reading - so they
// survive going to /questionnaire and back, just like the answers above.
const SIGNALS_DRAFT_KEY = "mindhx:signals-draft";

// Cleared on sign-out (see lib/auth.ts), since they hold what the person said.
export const CHECKIN_DRAFT_STORAGE_KEYS = [QUESTIONNAIRE_DRAFT_KEY, SIGNALS_DRAFT_KEY];

export type SignalsDraft = {
  transcript: string;
  typedText: string;
  voiceFeatures: Record<string, unknown>;
  textSubmitResult: Record<string, unknown> | null;
};

export function loadSignalsDraft(): SignalsDraft | null {
  try {
    const raw = sessionStorage.getItem(SIGNALS_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      transcript: typeof parsed.transcript === "string" ? parsed.transcript : "",
      typedText: typeof parsed.typedText === "string" ? parsed.typedText : "",
      voiceFeatures: parsed.voiceFeatures && typeof parsed.voiceFeatures === "object" ? parsed.voiceFeatures : {},
      textSubmitResult: parsed.textSubmitResult && typeof parsed.textSubmitResult === "object" ? parsed.textSubmitResult : null,
    };
  } catch {
    return null;
  }
}

export function saveSignalsDraft(draft: SignalsDraft): void {
  try {
    sessionStorage.setItem(SIGNALS_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage unavailable - the signals just won't persist across navigation.
  }
}
