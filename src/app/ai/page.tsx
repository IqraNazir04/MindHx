"use client";

import Link from "next/link";
import { useState } from "react";

export default function AiPage() {
	const [message, setMessage] = useState("");
	const [response, setResponse] = useState<{ status: string; message: string; sources?: { title: string; content: string; link: string }[] } | null>(null);
	const [loading, setLoading] = useState(false);

	async function askMindHx() {
		if (!message.trim()) return;
		setLoading(true);
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/ai/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, language: "en", risk_clear: true }) });
			setResponse(await result.json());
		} finally {
			setLoading(false);
		}
	}

	return <main className="resource-page"><ResourceHeader /><section className="resource-hero"><p className="eyebrow">02 / MINDHX AI</p><h1>Support that stays<br /><em>grounded and bounded.</em></h1><p>MindHx AI provides general, source-grounded mental-health information after a safety gate. It does not diagnose, prescribe, or replace a professional.</p></section><section className="ai-chat"><div className="chat-label">MINDHX AI / APPROVED RAG LIBRARY</div><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What would you like grounded information about?" aria-label="Ask MindHx AI" /><button className="result-primary" onClick={askMindHx} disabled={loading}>{loading ? "Retrieving information..." : "Ask MindHx AI"}<span>→</span></button>{response && <div className={`ai-response ${response.status === "escalate" ? "ai-escalation" : ""}`}><b>{response.status === "escalate" ? "Professional support required" : "Grounded information"}</b><p>{response.message}</p>{response.sources?.map((source) => <article key={source.title}><h3>{source.title}</h3><p>{source.content}</p><Link href={source.link}>Open reference ↗</Link></article>)}</div>}</section><section className="ai-steps"><article><b>01 / Safety gate</b><p>Risk and crisis signals are checked before generated support.</p></article><article><b>02 / Retrieval</b><p>Approved coping and psychoeducation content is retrieved for the situation.</p></article><article><b>03 / Explanation</b><p>Claude may explain approved content without scoring, diagnosing, or prescribing.</p></article></section><div className="resource-note"><b>Claude integration boundary</b><p>Claude does not score PHQ-9, GAD-7, or K10, recommend medication, provide crisis counseling, or override a MindHx crisis decision.</p><div className="resource-links"><Link href="/medication">Medication reference ↗</Link><Link href="/meditation">Grounding techniques ↗</Link><Link href="/therapies">Therapy reference ↗</Link></div></div></main>;
}
function ResourceHeader() { return <header className="resource-header"><Link href="/" className="results-brand"><span className="brand-mark">M</span> Mind<span>Hx</span></Link><Link href="/" className="resource-back">Back to check-in ↗</Link></header>; }