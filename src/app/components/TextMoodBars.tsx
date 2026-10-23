// Renders the linguistic anxiety/stress/depression breakdown returned by
// /analyze-text (and echoed back in /risk-assess's components.text) as
// labeled bars - a second, independent read of the same free text beyond
// its single positive/neutral/negative sentiment label. Backend:
// backend/main.py's analyze_text - scored by whichever of Claude, Qwen, or
// OpenAI is configured and answers, else backend/main.py's
// _linguistic_indicators, a lexicon-and-ratio heuristic informed by
// published psycholinguistic markers (first-person-singular density,
// absolutist language). Not a trained classifier or a diagnosis either way.
// Keep the disclaimer visible wherever this renders.

export type TextMoodScores = {
  anxiety_level: number;
  stress_level: number;
  depression_indicator: number;
  anger_level: number;
  calm_level: number;
};

// calm/anger were added to match the same five dimensions the voice signal
// reports (calm/stress/anger/fatigue/depression_indicator) - text previously
// had no way to register either. anxiety_level has no voice equivalent and
// stays text-only. See _linguistic_indicators and the project report's
// "Text & voice sentiment breakdown" section.
const MOOD_META: { key: keyof TextMoodScores; label: string; color: string }[] = [
  { key: "calm_level", label: "Calm", color: "teal" },
  { key: "anxiety_level", label: "Anxiety", color: "orange" },
  { key: "stress_level", label: "Stress", color: "red" },
  { key: "anger_level", label: "Anger", color: "red" },
  { key: "depression_indicator", label: "Depression indicator", color: "navy" },
];

export default function TextMoodBars({ scores, title }: { scores: TextMoodScores; title?: string }) {
  return (
    <div className="emotion-bars">
      {title && <p className="emotion-bars-title">{title}</p>}
      {MOOD_META.map(({ key, label, color }) => (
        <div className="emotion-row" key={key}>
          <span className="emotion-label">{label}</span>
          <span className="emotion-track"><i className={`emotion-fill emotion-fill-${color}`} style={{ width: `${Math.round(scores[key] * 100)}%` }} /></span>
          <span className="emotion-share">{Math.round(scores[key] * 100)}%</span>
        </div>
      ))}
      <p className="emotion-note">A reading of word choice (worry/pressure/absolutist language, self-focus) - scored by Claude, Qwen, OpenAI, and a local heuristic - not a trained classifier or a diagnosis.</p>
    </div>
  );
}
