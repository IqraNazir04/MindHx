"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const questions = ["Little interest or pleasure in doing things", "Feeling down, depressed, or hopeless", "Trouble falling or staying asleep, or sleeping too much", "Feeling tired or having little energy", "Poor appetite or overeating", "Feeling bad about yourself, or that you are a failure", "Trouble concentrating on things", "Moving or speaking slowly, or being unusually restless", "Thoughts that you would be better off dead or hurting yourself"];
const gadQuestions = ["Feeling nervous, anxious, or on edge", "Not being able to stop or control worrying", "Worrying too much about different things", "Trouble relaxing", "Being so restless that it is hard to sit still", "Becoming easily annoyed or irritable", "Feeling afraid as if something awful might happen"];
const k10Questions = ["Tired out for no good reason", "Nervous", "So nervous that nothing could calm you down", "Hopeless", "Restless or fidgety", "So restless you could not sit still", "Depressed", "Everything was an effort", "So sad that nothing could cheer you up", "Worthless"];
const answerOptions = ["Not at all", "Several days", "More than half the days", "Nearly every day"];
const k10Options = ["A little of the time", "Some of the time", "Most of the time", "All of the time"];
const copy = {
  English: {
    eyebrow: "EARLY SIGNALS, HUMAN CARE", title: "Check in with yourself.", intro: "A quiet, private way to notice changes in how you're feeling. MindHx brings together your voice, words, and a short clinical questionnaire.", ready: "Session ready", private: "Private & secure", sound: "How you sound", soundDescription: "Share a short voice note in English or Urdu. We listen for changes in vocal patterns, not the words themselves.", record: "Record a voice note", stop: "Stop recording", listening: "Listening... tap to finish", processing: "Transcribing securely...", recordingHint: "Up to 60 seconds · Nothing is saved", transcriptReady: "Transcript added below", voiceError: "Microphone or transcription unavailable", words: "What you say", wordsDescription: "Write a little about how things have been lately. Be as brief or open as feels right.", placeholder: "I've been feeling...", optional: "Optional", speakUrdu: "Hear this in Urdu", speaking: "Generating Urdu voice...", speechError: "Urdu voice generation unavailable", clinical: "Clinical check-in", clinicalDescription: "The PHQ-9 is a validated questionnaire used by healthcare professionals. Think about the last two weeks.", question: "QUESTION", back: "Back", next: "Next question", review: "Review answers", estimate: "LIVE ESTIMATE", picture: "Your combined picture", pictureDescription: "Complete your check-in to see how the signals come together.", seeCheckIn: "See my check-in", disclaimer: "MindHx is a screening and triage aid, not a diagnosis. Your results are a starting point for a conversation with a qualified professional.", modalEyebrow: "YOUR PRIVATE CHECK-IN", modalTitle: "Your signals are ready to review.", modalDescription: "MindHx combines the three signals into an explainable estimate. A professional should interpret this result with you.", modalScore: "estimated signal strength", continue: "Continue to results"
  },
  اردو: {
    eyebrow: "ابتدائی اشارے، انسانی نگہداشت", title: "اپنا حال جانچیں۔", intro: "اپنی کیفیت میں آنے والی تبدیلیوں کو سمجھنے کا ایک پُرسکون اور نجی طریقہ۔ MindHx آپ کی آواز، الفاظ اور مختصر طبی سوالنامے کو یکجا کرتا ہے۔", ready: "سیشن تیار ہے", private: "نجی اور محفوظ", sound: "آپ کی آواز", soundDescription: "انگریزی یا اردو میں ایک مختصر صوتی پیغام ریکارڈ کریں۔ ہم الفاظ کے بجائے آواز کے انداز میں آنے والی تبدیلیوں کو دیکھتے ہیں۔", record: "صوتی پیغام ریکارڈ کریں", stop: "ریکارڈنگ روکیں", listening: "سن رہے ہیں... مکمل کرنے کے لیے دبائیں", processing: "محفوظ طریقے سے متن تیار کیا جا رہا ہے...", recordingHint: "60 سیکنڈ تک · کچھ محفوظ نہیں کیا جاتا", transcriptReady: "متن نیچے شامل کر دیا گیا ہے", voiceError: "مائیکروفون یا متن کی سہولت دستیاب نہیں", words: "آپ کے الفاظ", wordsDescription: "حال ہی میں آپ کیسا محسوس کر رہے ہیں، اس کے بارے میں کچھ لکھیں۔ جتنا مناسب لگے اتنا ہی لکھیں۔", placeholder: "میں محسوس کر رہا/رہی ہوں...", optional: "اختیاری", speakUrdu: "یہ اردو میں سنیں", speaking: "اردو آواز تیار ہو رہی ہے...", speechError: "اردو آواز دستیاب نہیں", clinical: "طبی جائزہ", clinicalDescription: "PHQ-9 ایک مستند سوالنامہ ہے جسے ماہرین صحت استعمال کرتے ہیں۔ گزشتہ دو ہفتوں کے بارے میں سوچیں۔", question: "سوال", back: "واپس", next: "اگلا سوال", review: "جوابات کا جائزہ", estimate: "موجودہ اندازہ", picture: "آپ کی مجموعی کیفیت", pictureDescription: "اپنا جائزہ مکمل کریں تاکہ تمام اشارے ایک ساتھ دیکھے جا سکیں۔", seeCheckIn: "میرا جائزہ دیکھیں", disclaimer: "MindHx ایک ابتدائی اسکریننگ اور رہنمائی کا ذریعہ ہے، تشخیص نہیں۔ آپ کے نتائج کسی مستند ماہر سے گفتگو کا آغاز ہیں۔", modalEyebrow: "آپ کا نجی جائزہ", modalTitle: "آپ کے اشارے جائزے کے لیے تیار ہیں۔", modalDescription: "MindHx تینوں اشاروں کو ایک قابلِ وضاحت اندازے میں یکجا کرتا ہے۔ اس نتیجے کی تشریح کسی ماہر کو آپ کے ساتھ کرنی چاہیے۔", modalScore: "اندازاً سگنل کی شدت", continue: "نتائج کی طرف جائیں"
  }
};

function scoreFromAnswers(answers: number[]) {
  const answered = answers.filter((answer) => answer > -1).length;
  const total = answers.reduce((sum, answer) => sum + (answer > -1 ? answer : 0), 0);
  return Math.round((answered ? total / (answered * 3) : 0) * 70 + 14 + (answered ? 8 : 0));
}

export default function Home() {
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(questions.length).fill(-1));
  const [gadAnswers, setGadAnswers] = useState(Array(gadQuestions.length).fill(-1));
  const [k10Answers, setK10Answers] = useState(Array(k10Questions.length).fill(-1));
  const [profile, setProfile] = useState({ ageRange: "", gender: "", maritalStatus: "", lifeContext: "", preferredLanguage: "en" });
  const [activeScale, setActiveScale] = useState<"phq9" | "gad7" | "k10">("phq9");
  const [sessionToken, setSessionToken] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [language, setLanguage] = useState("English");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [typedText, setTypedText] = useState("");
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState("");
  const [crisisResult, setCrisisResult] = useState(false);
  const [riskResult, setRiskResult] = useState<{ risk_score: number; band: string; routing_decision: string; explanation: string[]; themes?: string[]; components?: { phq9: { signal: number; score: number; band: string }; gad7: { signal: number; score: number; band: string }; k10: { signal: number; score: number; band: string }; text: { signal: number; sentiment: string; crisis_language: boolean }; voice: { signal: number | null; available: boolean; note: string }; combined_signal: number }; phq9?: { total_score: number; severity_band: string }; gad7?: { total_score: number; severity_band: string }; k10?: { total_score: number; severity_band: string }; support_plan?: { route: string; title: string; next_action: string; psychiatric_referral?: { what_to_expect?: string[]; provider_search?: string; action?: string }; professional_contact?: { recommended: boolean; action: string; what_to_say: string }; meditation: { name: string; themes: string[]; steps: string }[]; strategies?: { name: string; themes: string[]; steps: string }[]; support_groups?: { name: string; description: string }[]; resources?: { name: string; description: string }[] } } | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const answered = answers.filter((answer) => answer > -1).length;
  const isComplete = answered === questions.length;
  const isScreeningComplete = isComplete && gadAnswers.every((answer) => answer > -1) && k10Answers.every((answer) => answer > -1);
  const score = scoreFromAnswers(answers);
  const liveScores = { phq9: riskResult?.phq9?.total_score ?? answers.reduce((sum, answer) => sum + Math.max(0, answer), 0), gad7: riskResult?.gad7?.total_score ?? gadAnswers.reduce((sum, answer) => sum + Math.max(0, answer), 0), k10: riskResult?.k10?.total_score ?? k10Answers.reduce((sum, answer) => sum + (answer > -1 ? answer + 1 : 0), 0) };
  const text = copy[language as keyof typeof copy];
  const componentEvaluation = riskResult?.components && <div className="component-evaluation"><div><b>PHQ-9</b><span>{riskResult.components.phq9.score}/27 · {riskResult.components.phq9.band}</span></div><div><b>GAD-7</b><span>{riskResult.components.gad7.score}/21 · {riskResult.components.gad7.band}</span></div><div><b>K10</b><span>{riskResult.components.k10.score}/50 · {riskResult.components.k10.band}</span></div><div><b>Text</b><span>{riskResult.components.text.sentiment}</span></div><div><b>Voice</b><span>{riskResult.components.voice.available ? `${Math.round((riskResult.components.voice.signal ?? 0) * 100)}% signal` : "not available"}</span></div></div>;
  const activeQuestions = activeScale === "phq9" ? questions : activeScale === "gad7" ? gadQuestions : k10Questions;
  const activeAnswers = activeScale === "phq9" ? answers : activeScale === "gad7" ? gadAnswers : k10Answers;
  const activeOptions = activeScale === "k10" ? k10Options : answerOptions;
  const completedScales = [isComplete, gadAnswers.every((answer) => answer > -1), k10Answers.every((answer) => answer > -1)].filter(Boolean).length;

  function updateActiveAnswer(index: number) {
    if (activeScale === "phq9") setAnswers(answers.map((answer, answerIndex) => answerIndex === activeQuestion ? index : answer));
    if (activeScale === "gad7") setGadAnswers(gadAnswers.map((answer, answerIndex) => answerIndex === activeQuestion ? index : answer));
    if (activeScale === "k10") setK10Answers(k10Answers.map((answer, answerIndex) => answerIndex === activeQuestion ? index : answer));
  }

  async function createPrivateSession() {
    if (!profile.ageRange) {
      setAssessmentError(language === "اردو" ? "سیشن شروع کرنے کے لیے عمر کی حد منتخب کریں۔" : "Choose an age range to start the session.");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/session/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: { age_range: profile.ageRange || null, gender: profile.gender || null, marital_status: profile.maritalStatus || null, life_context: profile.lifeContext || null, preferred_language: language === "اردو" ? "ur" : "en" } }) });
      if (!response.ok) throw new Error("Session unavailable");
      const result = await response.json() as { session_token: string };
      setSessionToken(result.session_token);
      setShowProfile(false);
    } catch {
      setAssessmentError(language === "اردو" ? "نجی سیشن شروع نہیں ہو سکا۔" : "Private session could not be started.");
    }
  }

  async function handleVoiceToggle() {
    if (recording) {
      mediaRecorder.current?.stop();
      setRecording(false);
      return;
    }

    try {
      setVoiceError("");
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
          const formData = new FormData();
          formData.append("file", new Blob(audioChunks.current, { type: "audio/webm" }), "mindhx-voice.webm");
          formData.append("language", language === "اردو" ? "ur" : "en");
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/transcribe`, { method: "POST", body: formData });
          if (!response.ok) throw new Error("Transcription failed");
          const result = await response.json() as { text: string };
          setTranscript(result.text);
        } catch {
          setVoiceError(text.voiceError);
        } finally {
          setTranscribing(false);
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
    if (!isComplete) return;
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
      if (!sessionToken) {
        setAssessmentError(language === "اردو" ? "پہلے نجی سیشن کا سیاق مکمل کریں۔" : "Set your private session context before starting the assessment.");
        setShowProfile(true);
        return;
      }
      if (!isScreeningComplete) {
        setAssessmentError(language === "اردو" ? "خطرے کے مکمل جائزے کے لیے GAD-7 اور K10 بھی مکمل کریں۔" : "Complete GAD-7 and K10 before the combined risk assessment.");
        return;
      }
      const riskResponse = await fetch(`${apiUrl}/risk-assess`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript, typed_text: typedText, language: language === "اردو" ? "ur" : "en", phq9_answers: answers, gad7_answers: gadAnswers, k10_answers: k10Answers.map((answer) => answer + 1), profile: { age_range: profile.ageRange, gender: profile.gender || null, marital_status: profile.maritalStatus || null, life_context: profile.lifeContext || null, preferred_language: language === "اردو" ? "ur" : "en" }, text_analysis: textAnalysis, phq9_result: phq9Result }) });
      if (!riskResponse.ok) throw new Error("Risk assessment unavailable");
      const result = await riskResponse.json();
      sessionStorage.setItem("mindhx:last-result", JSON.stringify(result));
      router.push("/results");
    } catch {
      setAssessmentError(language === "اردو" ? "MindHx سروس دستیاب نہیں۔ براہ کرم backend چلا کر دوبارہ کوشش کریں۔" : "MindHx service unavailable. Start the backend and try again.");
    } finally {
      setAssessmentLoading(false);
    }
  }

  async function handleUrduSpeech() {
    const speechText = `${transcript}\n${typedText}`.trim();
    if (!speechText || language !== "اردو") return;
    setSpeaking(true);
    setVoiceError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/synthesize`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: speechText, language: "ur" }) });
      if (!response.ok) throw new Error("Speech generation failed");
      const audio = new Audio(URL.createObjectURL(await response.blob()));
      audio.onended = () => URL.revokeObjectURL(audio.src);
      await audio.play();
    } catch {
      setVoiceError(text.speechError);
    } finally {
      setSpeaking(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar"><div className="brand"><span className="brand-mark">M</span><span>Mind<span className="brand-accent">Hx</span></span></div><div className="topbar-right"><span className="privacy"><span className="dot" /> {text.private}</span><button className="language" onClick={() => setLanguage(language === "English" ? "اردو" : "English")}>◎ {language}</button><button className="avatar" onClick={() => setShowProfile(true)} aria-label="Open private profile">{sessionToken ? "✓" : "A"}</button></div></header>
      <main className="workspace" dir={language === "اردو" ? "rtl" : "ltr"}>
        <section className="intro"><div className="hero-copy"><p className="eyebrow">{text.eyebrow}</p><h1>Notice the signal.<br /><em>Keep the human.</em></h1><p className="intro-copy">{text.intro}</p><div className="hero-actions"><button className="check-in-button hero-action" onClick={() => document.querySelector(".signal-grid")?.scrollIntoView({ behavior: "smooth" })}>{text.seeCheckIn} <span>↓</span></button><span className="status-pill"><span className="pulse" /> {text.ready}</span></div></div><div className="conversation-preview"><div className="preview-topline"><span>MIN DHX / LIVE CHECK-IN</span><span className="preview-dot" /></div><div className="preview-bubble patient-bubble">I&apos;ve been feeling a little distant lately.</div><div className="preview-bubble mindhx-bubble">Let&apos;s slow down and look at the full picture.</div><div className="preview-signals"><span><i className="signal-blue" /> Voice</span><span><i className="signal-orange" /> Words</span><span><i className="signal-green" /> PHQ-9</span></div></div></section>
        <section className="profile-strip"><div><p className="card-kicker">PRIVATE SESSION CONTEXT</p><h2>{sessionToken ? "Your context is ready for this session." : "Personal context helps MindHx tailor support."}</h2><p>Only age range, optional gender, relationship status, and life context are used in memory for this session. Nothing is saved as an account.</p></div><button className="profile-button" onClick={() => setShowProfile(true)}>{sessionToken ? "Edit context" : "Set session context"} <span>→</span></button></section>
        <section className="resource-nav"><div><p className="card-kicker">MINDHX RESOURCE LIBRARY</p><h2>Continue with grounded information</h2><p>Browse clinician-reviewed reference pages. These resources inform your choices and do not replace professional care.</p></div><nav aria-label="MindHx resources"><Link href="/medication"><span>01</span>Medication</Link><Link href="/ai"><span>02</span>MindHx AI</Link><Link href="/meditation"><span>03</span>Meditation techniques</Link><Link href="/therapies"><span>04</span>Therapies</Link><Link href="/therapist"><span>05</span>Talk to a therapist</Link></nav></section>
        <div className="signal-grid">
          <article className="signal-card"><div className="card-heading"><span className="icon-circle voice-icon">◖</span><div><p className="card-kicker">SIGNAL 01</p><h2>{text.sound}</h2></div><span className="ready-label">{text.ready}</span></div><p className="card-description">{text.soundDescription}</p><button className={`record-button ${recording ? "recording" : ""}`} onClick={handleVoiceToggle} disabled={transcribing}><span className="record-icon" />{transcribing ? text.processing : recording ? text.stop : text.record}</button><span className="microcopy">{voiceError || (transcript ? text.transcriptReady : recording ? text.listening : text.recordingHint)}</span><div className="waveform" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={index} style={{ height: `${12 + ((index * 17) % 29)}px` }} />)}</div>{transcript && <p className="voice-transcript">{transcript}</p>}</article>
          <article className="signal-card"><div className="card-heading"><span className="icon-circle words-icon">✎</span><div><p className="card-kicker">SIGNAL 02</p><h2>{text.words}</h2></div><span className="ready-label">{text.ready}</span></div><p className="card-description">{text.wordsDescription}</p><textarea value={typedText} onChange={(event) => setTypedText(event.target.value)} placeholder={text.placeholder} aria-label={text.wordsDescription} /><div className="text-footer"><span>{text.optional}</span><span>{typedText.length} / 500</span></div><button className="speech-button" onClick={handleUrduSpeech} disabled={speaking || language !== "اردو" || !(`${transcript}\n${typedText}`.trim())}>{speaking ? text.speaking : text.speakUrdu}</button>{voiceError && <span className="microcopy">{voiceError}</span>}</article>
          <article className="signal-card phq-card"><div className="card-heading"><span className="icon-circle phq-icon">＋</span><div><p className="card-kicker">SIGNAL 03 · {completedScales} / 3 COMPLETE</p><h2>{text.clinical}</h2></div><span className="progress-label">{activeAnswers.filter((answer) => answer > -1).length} / {activeQuestions.length}</span></div><p className="card-description">{text.clinicalDescription}</p><div className="scale-tabs"><button className={activeScale === "phq9" ? "active" : ""} onClick={() => { setActiveScale("phq9"); setActiveQuestion(0); }}>PHQ-9</button><button className={activeScale === "gad7" ? "active" : ""} onClick={() => { setActiveScale("gad7"); setActiveQuestion(0); }}>GAD-7</button><button className={activeScale === "k10" ? "active" : ""} onClick={() => { setActiveScale("k10"); setActiveQuestion(0); }}>K10</button></div><div className="question-progress"><span style={{ width: `${(activeAnswers.filter((answer) => answer > -1).length / activeQuestions.length) * 100}%` }} /></div><p className="question-number">{activeScale.toUpperCase()} · {activeQuestion + 1} / {activeQuestions.length}</p><h3>{activeQuestions[activeQuestion]}</h3><div className="answer-list">{activeOptions.map((option, index) => <button key={option} className={activeAnswers[activeQuestion] === index ? "selected" : ""} onClick={() => updateActiveAnswer(index)}><span className="radio" />{option}</button>)}</div><div className="question-actions"><button className="back-button" disabled={activeQuestion === 0} onClick={() => setActiveQuestion(activeQuestion - 1)}>{text.back}</button><button className="next-button" onClick={() => setActiveQuestion(Math.min(activeQuestions.length - 1, activeQuestion + 1))}>{activeQuestion === activeQuestions.length - 1 ? text.review : text.next}<span>→</span></button></div></article>
        </div>
        <section className="bottom-row"><div className="score-preview"><div className="score-ring"><strong>{riskResult ? Math.round(riskResult.risk_score * 100) : score}</strong><span>/ 100</span></div><div><p className="card-kicker">{text.estimate}</p><h2>{text.picture}</h2><p>{riskResult ? riskResult.band : text.pictureDescription}</p><div className="scale-outcomes"><span><b>PHQ-9</b> {liveScores.phq9}/27</span><span><b>GAD-7</b> {liveScores.gad7}/21</span><span><b>K10</b> {liveScores.k10}/50</span></div></div></div><div><button className="check-in-button" onClick={handleCheckIn} disabled={assessmentLoading}>{assessmentLoading ? text.processing : text.seeCheckIn} <span>→</span></button>{assessmentError && <p className="assessment-error">{assessmentError}</p>}</div></section>
        {componentEvaluation}
        <p className="disclaimer"><span>ⓘ</span> {text.disclaimer}</p>
      </main>
      {showCheckIn && <div className="modal-backdrop" onClick={() => setShowCheckIn(false)}><div className="modal" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setShowCheckIn(false)}>×</button>{crisisResult ? <><p className="eyebrow crisis-eyebrow">{language === "اردو" ? "فوری مدد درکار ہے" : "IMMEDIATE SUPPORT"}</p><h2>{language === "اردو" ? "آپ اکیلے نہیں ہیں۔" : "You do not have to handle this alone."}</h2><p>{language === "اردو" ? "ایک فوری حفاظتی اشارہ ملا ہے۔ ابھی کسی قابل اعتماد شخص یا مقامی ہنگامی/بحرانی خدمت سے رابطہ کریں۔" : "A crisis signal was detected. Please contact a trusted person or your local emergency or crisis service now."}</p><div className="crisis-card">{language === "اردو" ? "یہ نتیجہ تشخیص نہیں ہے، لیکن فوری پیشہ ورانہ مدد ضروری ہے۔" : "This is not a diagnosis, but immediate professional support is recommended."}</div><button className="check-in-button" onClick={() => setShowCheckIn(false)}>{language === "اردو" ? "سمجھ گیا" : "I understand — we are here for you"}</button></> : <><p className="eyebrow">{text.modalEyebrow}</p><h2>{riskResult?.support_plan?.title ?? text.modalTitle}</h2><p>{riskResult?.explanation.join(" ") ?? text.modalDescription}</p><div className="modal-score"><strong>{riskResult ? Math.round(riskResult.risk_score * 100) : score}</strong><span>{riskResult?.routing_decision ?? text.modalScore}</span></div>{riskResult?.themes && <div className="theme-row">{riskResult.themes.map((theme) => <span key={theme}>{theme.replace("_", " ")}</span>)}</div>}{riskResult?.support_plan && <div className="support-plan"><p><strong>Next step:</strong> {riskResult.support_plan.next_action}</p>{riskResult.support_plan.professional_contact && <div className="referral-note"><strong>{riskResult.support_plan.professional_contact.recommended ? "Professional contact" : "When to reach out"}</strong><p>{riskResult.support_plan.professional_contact.action}</p></div>}{riskResult.support_plan.strategies && riskResult.support_plan.strategies.length > 0 && <div><strong>Suggested strategies</strong>{riskResult.support_plan.strategies.slice(0, 3).map((strategy) => <div className="practice" key={strategy.name}><b>{strategy.name}</b><span>{strategy.steps}</span></div>)}</div>}{riskResult.support_plan.meditation.length > 0 && <div><strong>Support practices</strong>{riskResult.support_plan.meditation.slice(0, 3).map((practice) => <div className="practice" key={practice.name}><b>{practice.name}</b><span>{practice.steps}</span></div>)}</div>}</div>}<button className="check-in-button" onClick={() => setShowCheckIn(false)}>I understand — we are here for you <span>→</span></button></>}</div></div>}
      {showProfile && <div className="modal-backdrop" onClick={() => setShowProfile(false)}><div className="modal profile-modal" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setShowProfile(false)}>×</button><p className="eyebrow">PRIVATE SESSION CONTEXT</p><h2>Share only what helps.</h2><p>These fields are optional except age range. They stay in memory for this session and are not used to create an account.</p><div className="profile-fields"><select value={profile.ageRange} onChange={(event) => setProfile({ ...profile, ageRange: event.target.value })} aria-label="Age range"><option value="">Age range</option><option>18-24</option><option>25-34</option><option>35-44</option><option>45+</option></select><select value={profile.gender} onChange={(event) => setProfile({ ...profile, gender: event.target.value })} aria-label="Gender"><option value="">Gender (optional)</option><option>Woman</option><option>Man</option><option>Non-binary</option><option>Prefer not to say</option></select><select value={profile.maritalStatus} onChange={(event) => setProfile({ ...profile, maritalStatus: event.target.value })} aria-label="Relationship status"><option value="">Relationship status</option><option>Single</option><option>Partnered</option><option>Married</option><option>Prefer not to say</option></select><select value={profile.lifeContext} onChange={(event) => setProfile({ ...profile, lifeContext: event.target.value })} aria-label="Life context"><option value="">Life context (optional)</option><option>Student</option><option>Working</option><option>Retired</option><option>Between roles</option><option>Caregiving</option></select></div><button className="check-in-button" onClick={createPrivateSession}>{sessionToken ? "Update session context" : "Continue privately"} <span>→</span></button></div></div>}
    </div>
  );
}
