"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { DoodleSpeechBubble, DoodleWave } from "../components/Doodles";

const copy = {
  English: {
    eyebrow: "02 / MINDHX AI",
    titleLine1: "Support that stays",
    titleLine2: "grounded and bounded.",
    intro: "MindHx AI provides general, source-grounded mental-health information after a safety gate. It does not diagnose, prescribe, or replace a professional.",
    chatLabel: "MINDHX AI / APPROVED RAG LIBRARY",
    placeholder: "What would you like grounded information about?",
    ask: "Ask MindHx AI",
    retrieving: "Retrieving information...",
    escalate: "Professional support required",
    grounded: "Grounded information",
    openReference: "Open reference ↗",
    step1Title: "01 / Safety gate",
    step1: "Risk and crisis signals are checked before generated support.",
    step2Title: "02 / Retrieval",
    step2: "Approved coping and psychoeducation content is retrieved for the situation.",
    step3Title: "03 / Explanation",
    step3: "Claude may explain approved content without scoring, diagnosing, or prescribing.",
    boundaryTitle: "Claude integration boundary",
    boundaryBody: "Claude does not score PHQ-9, GAD-7, or K10, recommend medication, provide crisis counseling, or override a MindHx crisis decision.",
    medicationRef: "Medication reference ↗",
    groundingRef: "Grounding techniques ↗",
    therapyRef: "Therapy reference ↗",
  },
  اردو: {
    eyebrow: "02 / MindHx AI",
    titleLine1: "ایسی مدد جو",
    titleLine2: "بنیادی اور محدود رہتی ہے۔",
    intro: "MindHx AI ایک حفاظتی جانچ کے بعد عمومی، مصدقہ ذہنی صحت کی معلومات فراہم کرتا ہے۔ یہ تشخیص، تجویز، یا کسی ماہر کا متبادل نہیں ہے۔",
    chatLabel: "MindHx AI / منظور شدہ لائبریری",
    placeholder: "آپ کس بارے میں مصدقہ معلومات چاہتے ہیں؟",
    ask: "MindHx AI سے پوچھیں",
    retrieving: "معلومات حاصل کی جا رہی ہیں...",
    escalate: "پیشہ ورانہ مدد درکار ہے",
    grounded: "مصدقہ معلومات",
    openReference: "حوالہ کھولیں ↗",
    step1Title: "01 / حفاظتی جانچ",
    step1: "تیار کردہ مدد سے پہلے خطرے اور بحران کے اشارے جانچے جاتے ہیں۔",
    step2Title: "02 / بازیافت",
    step2: "صورتحال کے لیے منظور شدہ نمٹنے اور نفسیاتی تعلیم کا مواد حاصل کیا جاتا ہے۔",
    step3Title: "03 / وضاحت",
    step3: "Claude اسکورنگ، تشخیص، یا تجویز کیے بغیر منظور شدہ مواد کی وضاحت کر سکتا ہے۔",
    boundaryTitle: "Claude انضمام کی حد",
    boundaryBody: "Claude PHQ-9، GAD-7، یا K10 اسکور نہیں کرتا، ادویات تجویز نہیں کرتا، بحرانی مشاورت فراہم نہیں کرتا، یا MindHx کے بحرانی فیصلے کو نظرانداز نہیں کرتا۔",
    medicationRef: "ادویات کا حوالہ ↗",
    groundingRef: "گراؤنڈنگ تکنیکیں ↗",
    therapyRef: "تھراپی کا حوالہ ↗",
  },
};

export default function AiPage() {
  const [language, setLanguage] = useState<"English" | "اردو">("English");
  const text = copy[language];
  const isUrdu = language === "اردو";
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<{ status: string; message: string; sources?: { title: string; content: string; link: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  async function askMindHx() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/ai/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, language: isUrdu ? "ur" : "en", risk_clear: true }) });
      setResponse(await result.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <DoodleSpeechBubble className="doodle doodle-blue doodle-float" style={{ top: "100px", right: "5%" }} />
      <DoodleWave className="doodle doodle-teal doodle-sway" style={{ top: "58%", left: "2%" }} />
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={isUrdu ? "چیک ان پر واپس" : "Back to check-in"} />
      <section className="resource-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.titleLine1}<br /><em>{text.titleLine2}</em></h1>
        <p>{text.intro}</p>
      </section>
      <section className="ai-chat">
        <div className="chat-label">{text.chatLabel}</div>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={text.placeholder} aria-label={text.ask} />
        <button className="result-primary" onClick={askMindHx} disabled={loading}>{loading ? text.retrieving : text.ask}<span>→</span></button>
        {response && (
          <div className={`ai-response ${response.status === "escalate" ? "ai-escalation" : ""}`}>
            <b>{response.status === "escalate" ? text.escalate : text.grounded}</b>
            <p>{response.message}</p>
            {response.sources?.map((source) => (
              <article key={source.title}>
                <h3>{source.title}</h3>
                <p>{source.content}</p>
                <Link href={source.link}>{text.openReference}</Link>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="ai-steps">
        <article><b>{text.step1Title}</b><p>{text.step1}</p></article>
        <article><b>{text.step2Title}</b><p>{text.step2}</p></article>
        <article><b>{text.step3Title}</b><p>{text.step3}</p></article>
      </section>
      <div className="resource-note">
        <b>{text.boundaryTitle}</b>
        <p>{text.boundaryBody}</p>
        <div className="resource-links">
          <Link href="/medication">{text.medicationRef}</Link>
          <Link href="/meditation">{text.groundingRef}</Link>
          <Link href="/therapies">{text.therapyRef}</Link>
        </div>
      </div>
    </main>
  );
}
