// Renders the voice emotion breakdown returned by /analyze-voice (and echoed
// back in /risk-assess's components.voice.emotion) as a set of labeled bars:
// the seven class probabilities of whichever provider answered - Qwen-Omni
// (a hosted multimodal model) when backend/main.py's DASHSCOPE_API_KEY is
// configured, else the Dpngtm/wav2vec2-emotion-recognition speech-emotion
// model run locally (_voice_emotion_model_scores). Keep the disclaimer
// visible wherever this renders.

export type VoiceEmotion = {
  angry: number;
  calm: number;
  disgust: number;
  fearful: number;
  happy: number;
  sad: number;
  surprised: number;
};

export const VOICE_EMOTION_ROWS: { key: keyof VoiceEmotion; label: string; color: string }[] = [
  { key: "calm", label: "Calm", color: "teal" },
  { key: "happy", label: "Happy", color: "blue" },
  { key: "surprised", label: "Surprised", color: "teal-deep" },
  { key: "sad", label: "Sad", color: "navy" },
  { key: "fearful", label: "Fearful", color: "orange" },
  { key: "angry", label: "Angry", color: "red" },
  { key: "disgust", label: "Disgust", color: "blue-deep" },
];

// Check-ins saved before the model replaced the old rule-based bars hold a
// different shape (calm/stress/anger/fatigue/depression_indicator); those
// render no voice bars rather than misleading zeros.
export function isVoiceEmotion(value: unknown): value is VoiceEmotion {
  return typeof value === "object" && value !== null && VOICE_EMOTION_ROWS.every(({ key }) => typeof (value as Record<string, unknown>)[key] === "number");
}

// Names both providers regardless of which one actually answered this
// particular reading - a per-reading attribution lives in the backend's own
// components.voice.note (evaluate_components), shown separately wherever
// that's rendered; this one just explains the feature in general.
const EMOTION_NOTE = "Emotion probabilities from a speech-emotion model - Qwen-Omni and wav2vec2 (local, trained on acted English recordings) - a rough reading of tone of voice, not a diagnosis.";

export default function VoiceEmotionBars({ emotion, title }: { emotion: VoiceEmotion; title?: string }) {
  return (
    <div className="emotion-bars">
      {title && <p className="emotion-bars-title">{title}</p>}
      {VOICE_EMOTION_ROWS.map(({ key, label, color }) => (
        <div className="emotion-row" key={key}>
          <span className="emotion-label">{label}</span>
          <span className="emotion-track"><i className={`emotion-fill emotion-fill-${color}`} style={{ width: `${Math.round(emotion[key] * 100)}%` }} /></span>
          <span className="emotion-share">{Math.round(emotion[key] * 100)}%</span>
        </div>
      ))}
      <p className="emotion-note">{EMOTION_NOTE}</p>
    </div>
  );
}
