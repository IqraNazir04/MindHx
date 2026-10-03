"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { scaleExplanation, stageFor, type ScaleKey } from "../lib/resultsGuidance";
import type { Result } from "../components/CheckInResultsBody";

const STAGE_STEPS = ["Minimal", "Mild", "Moderate", "Severe", "Crisis"];

export default function RecommendationsClient() {
  const [result, setResult] = useState<Result | null | undefined>(undefined);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem("mindhx:last-result");
    } catch {
      stored = null;
    }
    startTransition(() => {
      try {
        setResult(stored ? (JSON.parse(stored) as Result) : null);
      } catch {
        setResult(null);
      }
    });
  }, []);

  if (result === undefined) {
    return <><main className="resource-page"><p className="dashboard-loading">Loading…</p></main><SiteFooter /></>;
  }

  if (!result) {
    return (
      <>
      <main className="resource-page">
        <SiteHeader backLabel="Back to check-in" />
        <section className="resource-hero">
          <p className="eyebrow">YOUR STAGE</p>
          <h1>Your check-in is not ready yet.</h1>
          <p>Complete the private assessment first, then return here to see your stage and next steps.</p>
          <Link className="result-primary" href="/">Back to check-in <span>→</span></Link>
        </section>
      </main>
      <SiteFooter />
      </>
    );
  }

  const stage = stageFor(result);
  const components = result.components;
  const scales: { key: ScaleKey; name: string; score: number; max: number; band?: string }[] = [
    { key: "phq9", name: "PHQ-9 (low mood)", score: components?.phq9.score ?? 0, max: 27, band: components?.phq9.band },
    { key: "gad7", name: "GAD-7 (anxiety)", score: components?.gad7.score ?? 0, max: 21, band: components?.gad7.band },
    { key: "k10", name: "K10 (overall distress)", score: components?.k10.score ?? 0, max: 50, band: components?.k10.band },
  ];

  return (
    <>
    <main className="resource-page stage-page">
      <SiteHeader backLabel="Back to check-in" />
      <section className="resource-hero">
        <p className="eyebrow">YOUR STAGE</p>
        <h1>{stage.label.split(" · ")[1]}<br /><em>your next steps.</em></h1>
        <p>{stage.summary}</p>
      </section>

      <div className="stage-ladder" aria-label="Stage scale">
        {STAGE_STEPS.map((step, index) => (
          <div key={step} className={`stage-step ${index + 1 === stage.number ? "current" : index + 1 < stage.number ? "passed" : ""}`}>
            <span>{index + 1}</span>
            <b>{step}</b>
          </div>
        ))}
      </div>

      <section className="detail-rows stage-scores">
        {scales.map((scale) => (
          <div className="detail-row" key={scale.key}>
            <div className="detail-row-head"><b>{scale.name}</b><span className="detail-value">{scale.score} / {scale.max}</span>{scale.band && <span className="detail-band">{scale.band.replaceAll("_", " ")}</span>}</div>
            <p>{scaleExplanation(scale.key, scale.band)}</p>
          </div>
        ))}
      </section>

      <section className={`recommend-card recommend-${stage.number === 5 ? "emergency" : stage.number >= 3 ? "professional" : "self"}`}>
        <p className="eyebrow">RECOMMENDED FOR {stage.label.toUpperCase()}</p>
        <ul className="stage-recommendations">
          {stage.recommendations.map((item) => <li key={item}>{item}</li>)}
        </ul>
        {stage.therapies.length > 0 && (
          <>
            <h3>Therapies to consider</h3>
            <ul className="therapy-options">
              {stage.therapies.map((therapy) => <li key={therapy.href}><Link href={therapy.href}>{therapy.label} ↗</Link><span>{therapy.note}</span></li>)}
            </ul>
          </>
        )}
        {stage.meditations.length > 0 && (
          <>
            <h3>Meditation techniques</h3>
            <ul className="therapy-options">
              {stage.meditations.map((item) => <li key={item.href}><Link href={item.href}>{item.label} ↗</Link><span>{item.note}</span></li>)}
            </ul>
          </>
        )}
        <div className="stage-actions">
          <Link className="result-primary" href={stage.primary.href}>{stage.primary.label} <span>→</span></Link>
          {stage.showEmergencyButton && <Link className="result-primary result-primary-orange" href="/emergency">Go to emergency support <span>→</span></Link>}
        </div>
        {!stage.showEmergencyButton && <p className="stage-safety-note">If things get worse or you feel unsafe, <Link href="/emergency">emergency support is available here</Link>.</p>}
        <div className="recommend-also">
          <Link href="/results">View the full results report ↗</Link>
          <Link href="/therapies">Explore therapy approaches ↗</Link>
        </div>
      </section>
    </main>
    <SiteFooter />
    </>
  );
}
