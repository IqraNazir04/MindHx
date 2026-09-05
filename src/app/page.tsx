"use client";

import { useRef, useState } from "react";

const questions = ["Little interest or pleasure in doing things", "Feeling down, depressed, or hopeless", "Trouble falling or staying asleep, or sleeping too much", "Feeling tired or having little energy", "Poor appetite or overeating", "Feeling bad about yourself, or that you are a failure", "Trouble concentrating on things", "Moving or speaking slowly, or being unusually restless", "Thoughts that you would be better off dead or hurting yourself"];
const answerOptions = ["Not at all", "Several days", "More than half the days", "Nearly every day"];
const copy = {
  English: {
    eyebrow: "EARLY SIGNALS, HUMAN CARE", title: "Check in with yourself.", intro: "A quiet, private way to notice changes in how you're feeling. MindHx brings together your voice, words, and a short clinical questionnaire.", ready: "Session ready", private: "Private & secure", sound: "How you sound", soundDescription: "Share a short voice note in English or Urdu. We listen for changes in vocal patterns, not the words themselves.", record: "Record a voice note", stop: "Stop recording", listening: "Listening... tap to finish", processing: "Transcribing securely...", analyzingSentiment: "Analyzing sentiment...", recordingHint: "Up to 60 seconds · Nothing is saved", transcriptReady: "Transcript added below", voiceError: "Microphone or transcription unavailable", sentimentPositive: "Positive tone", sentimentNeutral: "Neutral tone", sentimentNegative: "Negative tone", crisisDetected: "Crisis language detected", keywordsLabel: "Flagged words", vocalPatternTypical: "Typical vocal variation", vocalPatternReduced: "Some reduced variation", vocalPatternFlat: "Flat / subdued pattern", flagReducedPitch: "Reduced pitch variability", flagHighPause: "Frequent pauses", flagSlowRate: "Slower speaking pace", flagLowEnergy: "Low vocal energy", speakingRate: "Speaking rate", wpm: "wpm", words: "What you say", wordsDescription: "Write a little about how things have been lately. Be as brief or open as feels right.", placeholder: "I've been feeling...", optional: "Optional", clinical: "Clinical check-in", clinicalDescription: "The PHQ-9 is a validated questionnaire used by healthcare professionals. Think about the last two weeks.", question: "QUESTION", back: "Back", next: "Next question", review: "Review answers", estimate: "LIVE ESTIMATE", picture: "Your combined picture", pictureDescription: "Complete your check-in to see how the signals come together.", seeCheckIn: "See my check-in", disclaimer: "MindHx is a screening and triage aid, not a diagnosis. Your results are a starting point for a conversation with a qualified professional.", modalEyebrow: "YOUR PRIVATE CHECK-IN", modalTitle: "Your signals are ready to review.", modalDescription: "MindHx combines the three signals into an explainable estimate. A professional should interpret this result with you.", modalScore: "estimated signal strength", continue: "Continue to results"
  },
  اردو: {
    eyebrow: "ابتدائی اشارے، انسانی نگہداشت", title: "اپنا حال جانچیں۔", intro: "اپنی کیفیت میں آنے والی تبدیلیوں کو سمجھنے کا ایک پُرسکون اور نجی طریقہ۔ MindHx آپ کی آواز، الفاظ اور مختصر طبی سوالنامے کو یکجا کرتا ہے۔", ready: "سیشن تیار ہے", private: "نجی اور محفوظ", sound: "آپ کی آواز", soundDescription: "انگریزی یا اردو میں ایک مختصر صوتی پیغام ریکارڈ کریں۔ ہم الفاظ کے بجائے آواز کے انداز میں آنے والی تبدیلیوں کو دیکھتے ہیں۔", record: "صوتی پیغام ریکارڈ کریں", stop: "ریکارڈنگ روکیں", listening: "سن رہے ہیں... مکمل کرنے کے لیے دبائیں", processing: "محفوظ طریقے سے متن تیار کیا جا رہا ہے...", analyzingSentiment: "جذبات کا تجزیہ ہو رہا ہے...", recordingHint: "60 سیکنڈ تک · کچھ محفوظ نہیں کیا جاتا", transcriptReady: "متن نیچے شامل کر دیا گیا ہے", voiceError: "مائیکروفون یا متن کی سہولت دستیاب نہیں", sentimentPositive: "مثبت انداز", sentimentNeutral: "غیر جانبدار انداز", sentimentNegative: "منفی انداز", crisisDetected: "بحرانی زبان کا پتہ چلا", keywordsLabel: "نشان زدہ الفاظ", vocalPatternTypical: "معمول کے مطابق آواز کا اتار چڑھاؤ", vocalPatternReduced: "کچھ کم اتار چڑھاؤ", vocalPatternFlat: "یکساں / دبی ہوئی آواز کا انداز", flagReducedPitch: "آواز کے زیر و بم میں کمی", flagHighPause: "بار بار توقف", flagSlowRate: "سست رفتار گفتگو", flagLowEnergy: "آواز میں کم توانائی", speakingRate: "بولنے کی رفتار", wpm: "الفاظ فی منٹ", words: "آپ کے الفاظ", wordsDescription: "حال ہی میں آپ کیسا محسوس کر رہے ہیں، اس کے بارے میں کچھ لکھیں۔ جتنا مناسب لگے اتنا ہی لکھیں۔", placeholder: "میں محسوس کر رہا/رہی ہوں...", optional: "اختیاری", clinical: "طبی جائزہ", clinicalDescription: "PHQ-9 ایک مستند سوالنامہ ہے جسے ماہرین صحت استعمال کرتے ہیں۔ گزشتہ دو ہفتوں کے بارے میں سوچیں۔", question: "سوال", back: "واپس", next: "اگلا سوال", review: "جوابات کا جائزہ", estimate: "موجودہ اندازہ", picture: "آپ کی مجموعی کیفیت", pictureDescription: "اپنا جائزہ مکمل کریں تاکہ تمام اشارے ایک ساتھ دیکھے جا سکیں۔", seeCheckIn: "میرا جائزہ دیکھیں", disclaimer: "MindHx ایک ابتدائی اسکریننگ اور رہنمائی کا ذریعہ ہے، تشخیص نہیں۔ آپ کے نتائج کسی مستند ماہر سے گفتگو کا آغاز ہیں۔", modalEyebrow: "آپ کا نجی جائزہ", modalTitle: "آپ کے اشارے جائزے کے لیے تیار ہیں۔", modalDescription: "MindHx تینوں اشاروں کو ایک قابلِ وضاحت اندازے میں یکجا کرتا ہے۔ اس نتیجے کی تشریح کسی ماہر کو آپ کے ساتھ کرنی چاہیے۔", modalScore: "اندازاً سگنل کی شدت", continue: "نتائج کی طرف جائیں"
  }
};

function vocalFlagLabel(flag: string, text: typeof copy["English"]) {
  switch (flag) {
    case "reduced_pitch_variability": return text.flagReducedPitch;
    case "high_pause_ratio": return text.flagHighPause;
    case "slow_speaking_rate": return text.flagSlowRate;
    case "low_vocal_energy": return text.flagLowEnergy;
    default: return flag;
  }
}

function vocalPatternLabel(pattern: string, text: typeof copy["English"]) {
  switch (pattern) {
    case "typical_variation": return text.vocalPatternTypical;
    case "some_variation_reduced": return text.vocalPatternReduced;
    case "flat_or_subdued": return text.vocalPatternFlat;
    default: return null;
  }
}

function scoreFromAnswers(answers: number[]) {
  const answered = answers.filter((answer) => answer > -1).length;
  const total = answers.reduce((sum, answer) => sum + (answer > -1 ? answer : 0), 0);
  return Math.round((answered ? total / (answered * 3) : 0) * 70 + 14 + (answered ? 8 : 0));
}

export default function Home() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(-1));
  const [language, setLanguage] = useState("English");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [analyzingVoice, setAnalyzingVoice] = useState(false);
  const [voiceSentiment, setVoiceSentiment] = useState<{ sentiment: "negative" | "neutral" | "positive"; keyword_flags: string[]; crisis_language: boolean } | null>(null);
  const [voiceAcoustics, setVoiceAcoustics] = useState<{ pitch_mean_hz: number; pitch_variability_hz: number; speaking_rate_wpm: number | null; silence_ratio: number; vocal_flags: string[]; vocal_pattern: string } | null>(null);
  const [typedText, setTypedText] = useState("");
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState("");
  const [crisisResult, setCrisisResult] = useState(false);
  const [riskResult, setRiskResult] = useState<{ risk_score: number; band: string; routing_decision: string; explanation: string[] } | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const answered = answers.filter((answer) => answer > -1).length;
  const score = scoreFromAnswers(answers);
  const text = copy[language as keyof typeof copy];

  async function handleVoiceToggle() {
    if (recording) {
      mediaRecorder.current?.stop();
      setRecording(false);
      return;
    }

    try {
      setVoiceError("");
      setVoiceSentiment(null);
      setVoiceAcoustics(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunks.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setTranscribing(true);
        try {
          const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("file", audioBlob, "mindhx-voice.webm");
          formData.append("language", language === "اردو" ? "ur" : "en");
          const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
          const response = await fetch(`${apiUrl}/transcribe`, { method: "POST", body: formData });
          if (!response.ok) throw new Error("Transcription failed");
          const result = await response.json() as { text: string };
          setTranscript(result.text);
          setTranscribing(false);

          setAnalyzingVoice(true);
          const voiceFormData = new FormData();
          voiceFormData.append("file", audioBlob, "mindhx-voice.webm");
          voiceFormData.append("transcript", result.text);
          const [sentimentResponse, acousticsResponse] = await Promise.all([
            result.text.trim() ? fetch(`${apiUrl}/analyze-text`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: result.text, language: language === "اردو" ? "ur" : "en" }) }) : null,
            fetch(`${apiUrl}/analyze-voice`, { method: "POST", body: voiceFormData }),
          ]);
          if (sentimentResponse?.ok) setVoiceSentiment(await sentimentResponse.json());
          if (acousticsResponse.ok) setVoiceAcoustics(await acousticsResponse.json());
        } catch {
          setVoiceError(text.voiceError);
        } finally {
          setTranscribing(false);
          setAnalyzingVoice(false);
        }
      };
      mediaRecorder.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setVoiceError(text.voiceError);
    }
  }

  async function handleCheckIn() {
    setAssessmentLoading(true);
    setAssessmentError("");
    setCrisisResult(false);
    setRiskResult(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    try {
      const combinedText = `${transcript}\n${typedText}`.trim();
      const [textResponse, phqResponse] = await Promise.all([
        fetch(`${apiUrl}/analyze-text`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: combinedText, language: language === "اردو" ? "ur" : "en" }) }),
        fetch(`${apiUrl}/score-phq9`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) }),
      ]);
      if (!textResponse.ok || !phqResponse.ok) throw new Error("MindHx assessment unavailable");
      const textAnalysis = await textResponse.json();
      const phq9Result = await phqResponse.json();
      if (phq9Result.item_9_crisis || textAnalysis.crisis_language) {
        setCrisisResult(true);
        setShowCheckIn(true);
        return;
      }
      const riskResponse = await fetch(`${apiUrl}/risk-assess`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript, typed_text: typedText, language: language === "اردو" ? "ur" : "en", phq9_answers: answers, text_analysis: textAnalysis, phq9_result: phq9Result, voice_analysis: voiceAcoustics ?? {} }) });
      if (!riskResponse.ok) throw new Error("Risk assessment unavailable");
      setRiskResult(await riskResponse.json());
      setShowCheckIn(true);
    } catch {
      setAssessmentError(language === "اردو" ? "MindHx سروس دستیاب نہیں۔ براہ کرم backend چلا کر دوبارہ کوشش کریں۔" : "MindHx service unavailable. Start the backend and try again.");
    } finally {
      setAssessmentLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar"><div className="brand"><span className="brand-mark">M</span><span>Mind<span className="brand-accent">Hx</span></span></div><div className="topbar-right"><span className="privacy"><span className="dot" /> {text.private}</span><button className="language" onClick={() => setLanguage(language === "English" ? "اردو" : "English")}>◎ {language}</button><button className="avatar">A</button></div></header>
      <main className="workspace" dir={language === "اردو" ? "rtl" : "ltr"}>
        <section className="intro"><div className="hero-copy"><p className="eyebrow">{text.eyebrow}</p><h1>Notice the signal.<br /><em>Keep the human.</em></h1><p className="intro-copy">{text.intro}</p><div className="hero-actions"><button className="check-in-button hero-action" onClick={() => document.querySelector(".signal-grid")?.scrollIntoView({ behavior: "smooth" })}>{text.seeCheckIn} <span>↓</span></button><span className="status-pill"><span className="pulse" /> {text.ready}</span></div></div><div className="conversation-preview"><div className="preview-topline"><span>MIN DHX / LIVE CHECK-IN</span><span className="preview-dot" /></div><div className="preview-bubble patient-bubble">I&apos;ve been feeling a little distant lately.</div><div className="preview-bubble mindhx-bubble">Let&apos;s slow down and look at the full picture.</div><div className="preview-signals"><span><i className="signal-blue" /> Voice</span><span><i className="signal-orange" /> Words</span><span><i className="signal-green" /> PHQ-9</span></div></div></section>
        <div className="signal-grid">
          <article className="signal-card"><div className="card-heading"><span className="icon-circle voice-icon">◖</span><div><p className="card-kicker">SIGNAL 01</p><h2>{text.sound}</h2></div><span className="ready-label">{text.ready}</span></div><p className="card-description">{text.soundDescription}</p><button className={`record-button ${recording ? "recording" : ""}`} onClick={handleVoiceToggle} disabled={transcribing || analyzingVoice}><span className="record-icon" />{transcribing ? text.processing : analyzingVoice ? text.analyzingSentiment : recording ? text.stop : text.record}</button><span className="microcopy">{voiceError || (transcript ? text.transcriptReady : recording ? text.listening : text.recordingHint)}</span><div className="waveform" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={index} style={{ height: `${12 + ((index * 17) % 29)}px` }} />)}</div>{transcript && <p className="voice-transcript">{transcript}</p>}{voiceSentiment && <div className="voice-sentiment"><span className={`sentiment-badge sentiment-${voiceSentiment.sentiment}`}>{voiceSentiment.sentiment === "positive" ? text.sentimentPositive : voiceSentiment.sentiment === "negative" ? text.sentimentNegative : text.sentimentNeutral}</span>{voiceSentiment.crisis_language && <span className="sentiment-badge sentiment-crisis">{text.crisisDetected}</span>}{voiceSentiment.keyword_flags.length > 0 && <span className="sentiment-keywords">{text.keywordsLabel}: {voiceSentiment.keyword_flags.join(", ")}</span>}</div>}{voiceAcoustics && vocalPatternLabel(voiceAcoustics.vocal_pattern, text) && <div className="voice-sentiment voice-acoustics"><span className={`sentiment-badge sentiment-vocal-${voiceAcoustics.vocal_flags.length >= 2 ? "flat" : voiceAcoustics.vocal_flags.length === 1 ? "reduced" : "typical"}`}>{vocalPatternLabel(voiceAcoustics.vocal_pattern, text)}</span>{voiceAcoustics.vocal_flags.map((flag) => <span key={flag} className="sentiment-keywords">{vocalFlagLabel(flag, text)}</span>)}{voiceAcoustics.speaking_rate_wpm != null && <span className="sentiment-keywords">{text.speakingRate}: {Math.round(voiceAcoustics.speaking_rate_wpm)} {text.wpm}</span>}</div>}</article>
          <article className="signal-card"><div className="card-heading"><span className="icon-circle words-icon">✎</span><div><p className="card-kicker">SIGNAL 02</p><h2>{text.words}</h2></div><span className="ready-label">{text.ready}</span></div><p className="card-description">{text.wordsDescription}</p><textarea value={typedText} onChange={(event) => setTypedText(event.target.value)} placeholder={text.placeholder} aria-label={text.wordsDescription} /><div className="text-footer"><span>{text.optional}</span><span>{typedText.length} / 500</span></div></article>
          <article className="signal-card phq-card"><div className="card-heading"><span className="icon-circle phq-icon">＋</span><div><p className="card-kicker">SIGNAL 03</p><h2>{text.clinical}</h2></div><span className="progress-label">{answered} / 9</span></div><p className="card-description">{text.clinicalDescription}</p><div className="question-progress"><span style={{ width: `${(answered / 9) * 100}%` }} /></div><p className="question-number">{text.question} {activeQuestion + 1} / 9</p><h3>{questions[activeQuestion]}</h3><div className="answer-list">{answerOptions.map((option, index) => <button key={option} className={answers[activeQuestion] === index ? "selected" : ""} onClick={() => setAnswers(answers.map((answer, questionIndex) => questionIndex === activeQuestion ? index : answer))}><span className="radio" />{option}</button>)}</div><div className="question-actions"><button className="back-button" disabled={activeQuestion === 0} onClick={() => setActiveQuestion(activeQuestion - 1)}>{text.back}</button><button className="next-button" onClick={() => setActiveQuestion(Math.min(8, activeQuestion + 1))}>{activeQuestion === 8 ? text.review : text.next}<span>→</span></button></div></article>
        </div>
        <section className="bottom-row"><div className="score-preview"><div className="score-ring"><strong>{riskResult ? Math.round(riskResult.risk_score * 100) : score}</strong><span>/ 100</span></div><div><p className="card-kicker">{text.estimate}</p><h2>{text.picture}</h2><p>{riskResult ? riskResult.band : text.pictureDescription}</p></div></div><div><button className="check-in-button" onClick={handleCheckIn} disabled={assessmentLoading}>{assessmentLoading ? text.processing : text.seeCheckIn} <span>→</span></button>{assessmentError && <p className="assessment-error">{assessmentError}</p>}</div></section>
        <p className="disclaimer"><span>ⓘ</span> {text.disclaimer}</p>
      </main>
      {showCheckIn && <div className="modal-backdrop" onClick={() => setShowCheckIn(false)}><div className="modal" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setShowCheckIn(false)}>×</button>{crisisResult ? <><p className="eyebrow crisis-eyebrow">{language === "اردو" ? "فوری مدد درکار ہے" : "IMMEDIATE SUPPORT"}</p><h2>{language === "اردو" ? "آپ اکیلے نہیں ہیں۔" : "You do not have to handle this alone."}</h2><p>{language === "اردو" ? "ایک فوری حفاظتی اشارہ ملا ہے۔ ابھی کسی قابل اعتماد شخص یا مقامی ہنگامی/بحرانی خدمت سے رابطہ کریں۔" : "A crisis signal was detected. Please contact a trusted person or your local emergency or crisis service now."}</p><div className="crisis-card">{language === "اردو" ? "یہ نتیجہ تشخیص نہیں ہے، لیکن فوری پیشہ ورانہ مدد ضروری ہے۔" : "This is not a diagnosis, but immediate professional support is recommended."}</div><button className="check-in-button" onClick={() => setShowCheckIn(false)}>{language === "اردو" ? "سمجھ گیا" : "I understand"}</button></> : <><p className="eyebrow">{text.modalEyebrow}</p><h2>{text.modalTitle}</h2><p>{riskResult?.explanation.join(" ") ?? text.modalDescription}</p><div className="modal-score"><strong>{riskResult ? Math.round(riskResult.risk_score * 100) : score}</strong><span>{riskResult?.routing_decision ?? text.modalScore}</span></div><button className="check-in-button" onClick={() => setShowCheckIn(false)}>{text.continue} <span>→</span></button></>}</div></div>}
    </div>
  );
}
