import Link from "next/link";
import TextMoodBars from "./TextMoodBars";
import { bandLabel, buildRecommendation, routingLabel, scaleExplanation, scoreText, themeLabel, type Lang } from "../lib/resultsGuidance";
import VoiceEmotionBars, { type VoiceEmotion } from "./VoiceEmotionBars";

export type Result = {
  risk_score: number;
  band: string;
  routing_decision: string;
  // Computed by /risk-assess but never actually rendered here - optional so
  // a saved CheckInRecord (which never stored this field) can be passed in
  // directly wherever a Result is expected, e.g. an expanded dashboard entry.
  explanation?: string[];
  crisis_flag?: boolean;
  themes?: string[];
  // Signed copy of this result from /risk-assess - the only thing POST
  // /checkins accepts, so saved history can't differ from what was computed.
  assessment_token?: string;
  components?: {
    phq9: { score: number; band: string };
    // score is null (band "not_answered") for a questionnaire that wasn't
    // finished, which only happens on a crisis check-in.
    gad7: { score: number | null; band: string };
    k10: { score: number | null; band: string };
    text: { sentiment: string; signal: number; anxiety_level?: number | null; stress_level?: number | null; depression_indicator?: number | null };
    voice: { available: boolean; signal: number | null; note: string; emotion?: VoiceEmotion | null };
    attribution?: {
      method: string;
      note: string;
      total: number;
      contributions: { name: string; label: string; modality: string; signal: number; weight: number; contribution: number; share_pct: number }[];
    };
  };
  support_plan?: {
    route?: string;
    title: string;
    next_action: string;
    professional_contact?: { recommended: boolean; action: string; what_to_say: string };
    strategies?: { name: string; steps: string }[];
    meditation?: { name: string; steps: string }[];
    support_groups?: { name: string; description: string }[];
    resources?: { name: string; description: string }[];
  };
};

const copy = {
  English: {
    eyebrowCheckin: "YOUR MINDHX CHECK-IN",
    titleA: "A clearer picture", titleB: "to take forward.",
    lede: "These signals are a starting point for a conversation, not a diagnosis. You remain in control of what happens next.",
    downloadPdf: "Download PDF",
    pdfHint: "Bring this to a doctor or therapist. A copy is saved to your history, so you can download it again from your dashboard.",
    combinedSignal: "COMBINED SIGNAL",
    eyebrowDetail: "DETAILED RESULTS",
    detailTitle: "Your numbers, explained",
    detailIntro: "Each questionnaire is scored against its published range. Words and voice are combined with them into the overall signal.",
    phq9: "PHQ-9 (low mood)", gad7: "GAD-7 (anxiety)", k10: "K10 (overall distress)",
    words: "Words (what you wrote)", voice: "Voice (how you sounded)",
    textSignal: (pct: number) => `${pct}% text signal`, noTextSignal: "No text signal",
    voiceSignalPct: (pct: number) => `${pct}% voice signal`, notRecorded: "Not recorded",
    sentimentReadAs: (sentiment: string) => `Sentiment read as ${sentiment}. This adds to the overall signal alongside the questionnaires.`,
    neutral: "neutral", noVoiceFeatures: "No voice features for this check-in.",
    eyebrowNextSteps: "PROPOSED NEXT STEPS",
    therapiesToConsider: "Therapies to consider",
    eyebrowSignals: "01 / THE SIGNALS",
    signalsTitle: "What contributed to this picture",
    signalsIntro: "Each measure is shown separately so the combined estimate stays explainable.",
    wordsLabel: "WORDS", voiceLabel: "VOICE",
    voiceSignalShort: (pct: number) => `${pct}% signal`, notAvailable: "Not available", noAcoustic: "No acoustic features returned.",
    wordChoiceBreakdown: "Word-choice breakdown", voiceToneBreakdown: "Voice tone breakdown",
    eyebrowWhatNext: "02 / WHAT NEXT",
    gentleNextStep: "A gentle next step", chooseOneAction: "Choose one small action that supports you today.",
    suggestedStrategies: "Suggested strategies", supportPractices: "Support practices", connection: "Connection",
    eyebrowProfessional: "03 / PROFESSIONAL SUPPORT",
    considerSpeaking: "Consider speaking with a professional.", canReachOut: "You can reach out when you need to.",
    whatToSay: "What to say",
    footer: "MindHx / private session", returnToCheckIn: "Return to check-in",
    notAnswered: "Not answered",
  },
  اردو: {
    eyebrowCheckin: "آپ کا MindHx چیک ان",
    titleA: "ایک واضح تصویر", titleB: "آگے بڑھانے کے لیے۔",
    lede: "یہ اشارے گفتگو کا نقطہ آغاز ہیں، تشخیص نہیں۔ آگے کیا ہوگا اس کا فیصلہ آپ کے ہاتھ میں ہے۔",
    downloadPdf: "PDF ڈاؤن لوڈ کریں",
    pdfHint: "اسے ڈاکٹر یا معالج کے پاس لے جائیں۔ ایک کاپی آپ کی تاریخ میں محفوظ ہے، جسے آپ اپنے ڈیش بورڈ سے دوبارہ ڈاؤن لوڈ کر سکتے ہیں۔",
    combinedSignal: "مجموعی اشارہ",
    eyebrowDetail: "تفصیلی نتائج",
    detailTitle: "آپ کے اعداد، وضاحت کے ساتھ",
    detailIntro: "ہر سوالنامے کا اسکور اس کی مقررہ حد کے مطابق لگایا گیا ہے۔ الفاظ اور آواز کو بھی ان کے ساتھ ملا کر مجموعی اشارہ بنایا جاتا ہے۔",
    phq9: "PHQ-9 (کم موڈ)", gad7: "GAD-7 (بے چینی)", k10: "K10 (مجموعی تناؤ)",
    words: "الفاظ (جو آپ نے لکھا)", voice: "آواز (آپ کا انداز)",
    textSignal: (pct: number) => `${pct}% متن کا اشارہ`, noTextSignal: "کوئی متن اشارہ نہیں",
    voiceSignalPct: (pct: number) => `${pct}% آواز کا اشارہ`, notRecorded: "ریکارڈ نہیں ہوا",
    sentimentReadAs: (sentiment: string) => `جذباتی کیفیت ${sentiment} کے طور پر پڑھی گئی۔ یہ سوالناموں کے ساتھ مل کر مجموعی اشارے میں شامل ہوتی ہے۔`,
    neutral: "غیر جانبدار", noVoiceFeatures: "اس چیک ان کے لیے کوئی آواز کی خصوصیات نہیں۔",
    eyebrowNextSteps: "تجویز کردہ اگلے قدم",
    therapiesToConsider: "غور کرنے کے لیے تھراپیز",
    eyebrowSignals: "01 / اشارے",
    signalsTitle: "اس تصویر میں کیا شامل ہوا",
    signalsIntro: "ہر پیمانہ الگ دکھایا گیا ہے تاکہ مجموعی اندازہ قابلِ وضاحت رہے۔",
    wordsLabel: "الفاظ", voiceLabel: "آواز",
    voiceSignalShort: (pct: number) => `${pct}% اشارہ`, notAvailable: "دستیاب نہیں", noAcoustic: "کوئی صوتی خصوصیات موصول نہیں ہوئیں۔",
    wordChoiceBreakdown: "الفاظ کے انتخاب کی تفصیل", voiceToneBreakdown: "آواز کے انداز کی تفصیل",
    eyebrowWhatNext: "02 / اگلا قدم",
    gentleNextStep: "ایک نرم اگلا قدم", chooseOneAction: "آج آپ کی مدد کرنے والا ایک چھوٹا اقدام منتخب کریں۔",
    suggestedStrategies: "تجویز کردہ حکمت عملی", supportPractices: "معاون مشقیں", connection: "رابطہ",
    eyebrowProfessional: "03 / پیشہ ورانہ مدد",
    considerSpeaking: "کسی ماہر سے بات کرنے پر غور کریں۔", canReachOut: "جب ضرورت ہو آپ رابطہ کر سکتے ہیں۔",
    whatToSay: "کیا کہنا ہے",
    footer: "MindHx / نجی سیشن", returnToCheckIn: "چیک ان پر واپس جائیں",
    notAnswered: "جواب نہیں دیا گیا",
  },
};

// The full check-in results content (score card, signal breakdown, support
// plan, professional-contact banner, and the "Download PDF" button) -
// shared between /results and the crisis case of /emergency, so a check-in
// that lands on either page shows the complete picture, not just the score
// on one and nothing on the other.
export default function CheckInResultsBody({
  result,
  onDownloadPdf,
  onReturnToCheckIn,
  language = "English",
}: {
  result: Result;
  onDownloadPdf: () => void;
  onReturnToCheckIn: () => void;
  language?: Lang;
}) {
  const text = copy[language];
  const score = Math.round(result.risk_score * 100);
  const components = result.components;
  const contact = result.support_plan?.professional_contact;
  const recommendation = buildRecommendation(result, language);

  return (
    <>
      <section className="results-hero"><div><p className="eyebrow">{text.eyebrowCheckin}</p><h1>{text.titleA}<br /><em>{text.titleB}</em></h1><p className="results-lede">{text.lede}</p><button className="result-primary" type="button" onClick={onDownloadPdf}>{text.downloadPdf} <span>↓</span></button><p className="results-pdf-hint">{text.pdfHint}</p></div><div className="result-score-card"><p className="card-kicker">{text.combinedSignal}</p><div className="result-score-ring"><strong>{score}</strong><span>/ 100</span></div><b className={`result-band ${result.band}`}>{bandLabel(result.band, language)}</b><small>{routingLabel(result.routing_decision, language)}</small></div></section>

      <section className="result-section detail-results"><div className="result-section-heading"><p className="eyebrow">{text.eyebrowDetail}</p><h2>{text.detailTitle}</h2><p>{text.detailIntro}</p></div>
        <div className="detail-rows">
          <DetailRow name={text.phq9} value={scoreText(components?.phq9.score, 27, language)} band={components?.phq9.band} explanation={scaleExplanation("phq9", components?.phq9.band, language)} language={language} />
          <DetailRow name={text.gad7} value={scoreText(components?.gad7.score, 21, language)} band={components?.gad7.band} explanation={scaleExplanation("gad7", components?.gad7.band, language)} language={language} />
          <DetailRow name={text.k10} value={scoreText(components?.k10.score, 50, language)} band={components?.k10.band} explanation={scaleExplanation("k10", components?.k10.band, language)} language={language} />
          <DetailRow name={text.words} value={components?.text.signal ? text.textSignal(Math.round(components.text.signal * 100)) : text.noTextSignal} band={components?.text.sentiment} explanation={text.sentimentReadAs(components?.text.sentiment ?? text.neutral)} language={language} />
          <DetailRow name={text.voice} value={components?.voice.available ? text.voiceSignalPct(Math.round((components.voice.signal ?? 0) * 100)) : text.notRecorded} explanation={components?.voice.note ?? text.noVoiceFeatures} language={language} />
        </div>
        {result.explanation && result.explanation.length > 0 && <ul className="detail-notes">{result.explanation.map((line) => <li key={line}>{line}</li>)}</ul>}
      </section>

      <section className={`recommend-card recommend-${recommendation.level}`}>
        <p className="eyebrow">{text.eyebrowNextSteps}</p>
        <h2>{recommendation.headline}</h2>
        <p>{recommendation.body}</p>
        <div className="recommend-primary"><Link className="result-primary" href={recommendation.primary.href}>{recommendation.primary.label} <span>→</span></Link></div>
        {recommendation.therapies.length > 0 && <><h3>{text.therapiesToConsider}</h3><ul className="therapy-options">{recommendation.therapies.map((therapy) => <li key={therapy.href}><Link href={therapy.href}>{therapy.label} ↗</Link><span>{therapy.note}</span></li>)}</ul></>}
        <div className="recommend-also">{recommendation.alsoHelpful.map((item) => <Link key={item.href} href={item.href}>{item.label} ↗</Link>)}</div>
      </section>

      <section className="result-section"><div className="result-section-heading"><p className="eyebrow">{text.eyebrowSignals}</p><h2>{text.signalsTitle}</h2><p>{text.signalsIntro}</p></div><div className="result-signal-grid">
        <Signal name="PHQ-9" score={components?.phq9.score ?? 0} max={27} band={components?.phq9.band ?? "not available"} color="orange" notAnswered={text.notAnswered} language={language} />
        <Signal name="GAD-7" score={components ? components.gad7.score : 0} max={21} band={components?.gad7.band ?? "not available"} color="blue" notAnswered={text.notAnswered} language={language} />
        <Signal name="K10" score={components ? components.k10.score : 0} max={50} band={components?.k10.band ?? "not available"} color="green" notAnswered={text.notAnswered} language={language} />
        <div className="result-signal-card text-result"><span className="result-signal-icon">Aa</span><div><b>{text.wordsLabel}</b><h3>{components?.text.sentiment ?? text.notAvailable}</h3><p>{components?.text.signal ? text.textSignal(Math.round(components.text.signal * 100)) : text.noTextSignal}</p></div></div>
        <div className="result-signal-card voice-result"><span className="result-signal-icon">◉</span><div><b>{text.voiceLabel}</b><h3>{components?.voice.available ? text.voiceSignalShort(Math.round((components.voice.signal ?? 0) * 100)) : text.notAvailable}</h3><p>{components?.voice.note ?? text.noAcoustic}</p></div></div>
      </div>{components?.text.anxiety_level != null && components.text.stress_level != null && components.text.depression_indicator != null && <TextMoodBars scores={{ anxiety_level: components.text.anxiety_level, stress_level: components.text.stress_level, depression_indicator: components.text.depression_indicator }} title={text.wordChoiceBreakdown} />}{components?.voice.emotion && <VoiceEmotionBars emotion={components.voice.emotion} title={text.voiceToneBreakdown} />}{components?.attribution && <><div className="attribution-list">{components.attribution.contributions.map((item) => <div className="attribution-row" key={item.name}><span className="attribution-label">{item.label}<small>{item.modality}</small></span><span className="attribution-track"><i className="attribution-fill" style={{ width: `${Math.max(4, item.share_pct)}%` }} /></span><span className="attribution-share">{item.share_pct}%</span></div>)}</div><p className="attribution-note">{components.attribution.note}</p></>}</section>

      <section className="result-section support-section"><div className="result-section-heading"><p className="eyebrow">{text.eyebrowWhatNext}</p><h2>{result.support_plan?.title ?? text.gentleNextStep}</h2><p>{result.support_plan?.next_action ?? text.chooseOneAction}</p></div>{result.themes && <div className="result-themes">{result.themes.map((theme) => <span key={theme}>{themeLabel(theme, language)}</span>)}</div>}<div className="result-columns">{result.support_plan?.strategies && result.support_plan.strategies.length > 0 && <SupportList title={text.suggestedStrategies} items={result.support_plan.strategies.map((item) => `${item.name}: ${item.steps}`)} />}{result.support_plan?.meditation && result.support_plan.meditation.length > 0 && <SupportList title={text.supportPractices} items={result.support_plan.meditation.map((item) => `${item.name}: ${item.steps}`)} />}{result.support_plan?.support_groups && <SupportList title={text.connection} items={result.support_plan.support_groups.map((item) => `${item.name}: ${item.description}`)} />}</div></section>

      {contact && <section className={`contact-banner ${contact.recommended ? "recommended" : ""}`}><div><p className="eyebrow">{text.eyebrowProfessional}</p><h2>{contact.recommended ? text.considerSpeaking : text.canReachOut}</h2><p>{contact.action}</p></div><div className="contact-quote"><b>{text.whatToSay}</b><span>{contact.what_to_say}</span></div></section>}
      <footer className="results-footer"><span>{text.footer}</span><button onClick={onReturnToCheckIn}>{text.returnToCheckIn} <span>↗</span></button></footer>
    </>
  );
}

function Signal({ name, score, max, band, color, notAnswered, language }: { name: string; score: number | null; max: number; band: string; color: string; notAnswered: string; language: Lang }) {
  return <div className={`result-signal-card ${color}-result`}><span className="result-signal-icon">{name === "PHQ-9" ? "9" : name === "GAD-7" ? "∿" : "K"}</span><div><b>{name}</b><h3>{score === null ? notAnswered : <>{score}<small> / {max}</small></>}</h3><div className="result-bar"><i style={{ width: `${Math.min(100, ((score ?? 0) / max) * 100)}%` }} /></div><p>{bandLabel(band, language)}</p></div></div>;
}

function SupportList({ title, items }: { title: string; items: string[] }) {
  return <div className="support-list"><h3>{title}</h3>{items.slice(0, 3).map((item) => <p key={item}><span>+</span>{item}</p>)}</div>;
}

function DetailRow({ name, value, band, explanation, language }: { name: string; value: string; band?: string; explanation: string; language: Lang }) {
  return <div className="detail-row"><div className="detail-row-head"><b>{name}</b><span className="detail-value">{value}</span>{band && <span className="detail-band">{bandLabel(band, language)}</span>}</div><p>{explanation}</p></div>;
}
