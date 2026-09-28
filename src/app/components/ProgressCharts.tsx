"use client";

import { useState } from "react";
import type { Result } from "./CheckInResultsBody";
import type { QuestionnaireAnswers } from "../lib/auth";

// Progress over time for one account's saved check-ins, as small multiples:
// one chart per measure, each on its own scale (PHQ-9 is out of 27, K10
// runs 10-50, the combined score is a percentage), rather than one chart
// with several y-axes. Used by the user's own dashboard and the admin
// panel's per-user view.

export type ProgressEntry = {
  created_at: string;
  risk_score: number;
  band: string;
  components?: Result["components"] | null;
  answers?: QuestionnaireAnswers | null;
};

type Measure = {
  key: string;
  title: string;
  min: number;
  max: number;
  unit: string;
  // Severity cut-offs, drawn as hairlines so a point's band is readable.
  cutoffs: number[];
  value: (entry: ProgressEntry) => number | null;
  band: (entry: ProgressEntry) => string | null;
};

const sum = (values: number[] | undefined) => (values ? values.reduce((total, value) => total + value, 0) : null);

const MEASURES: Measure[] = [
  {
    key: "phq9", title: "PHQ-9 · depression", min: 0, max: 27, unit: "/27", cutoffs: [5, 10, 15, 20],
    value: (entry) => entry.components?.phq9?.score ?? sum(entry.answers?.phq9),
    band: (entry) => entry.components?.phq9?.band ?? null,
  },
  {
    key: "gad7", title: "GAD-7 · anxiety", min: 0, max: 21, unit: "/21", cutoffs: [5, 10, 15],
    value: (entry) => entry.components?.gad7?.score ?? sum(entry.answers?.gad7),
    band: (entry) => entry.components?.gad7?.band ?? null,
  },
  {
    key: "k10", title: "K10 · distress", min: 10, max: 50, unit: "/50", cutoffs: [20, 25, 30],
    value: (entry) => entry.components?.k10?.score ?? sum(entry.answers?.k10),
    band: (entry) => entry.components?.k10?.band ?? null,
  },
  {
    key: "combined", title: "Combined score", min: 0, max: 100, unit: "%", cutoffs: [20, 40],
    value: (entry) => Math.round(entry.risk_score * 100),
    band: (entry) => entry.band,
  },
];

// Chart geometry, in viewBox units.
const W = 320;
const H = 150;
const M = { top: 10, right: 12, bottom: 22, left: 30 };

const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
const formatBand = (band: string | null) => (band ? band.replaceAll("_", " ") : null);

export default function ProgressCharts({ entries }: { entries: ProgressEntry[] }) {
  const chronological = [...entries].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  if (chronological.length === 0) return null;

  return (
    <div className="progress-charts">
      <p className="progress-note">
        Lower is better on every chart. Faint lines mark the questionnaire&apos;s severity cut-offs.
        {chronological.length === 1 && " Your trend appears after your next check-in."}
      </p>
      <div className="progress-grid">
        {MEASURES.map((measure) => <ProgressChart key={measure.key} measure={measure} entries={chronological} />)}
      </div>
    </div>
  );
}

function ProgressChart({ measure, entries }: { measure: Measure; entries: ProgressEntry[] }) {
  const [active, setActive] = useState<number | null>(null);
  const points = entries
    .map((entry) => ({ entry, value: measure.value(entry), time: new Date(entry.created_at).getTime() }))
    .filter((point): point is { entry: ProgressEntry; value: number; time: number } => point.value !== null);

  if (points.length === 0) {
    return (
      <figure className="progress-card">
        <figcaption><b>{measure.title}</b></figcaption>
        <p className="progress-empty">No scores saved yet.</p>
      </figure>
    );
  }

  const first = points[0];
  const last = points[points.length - 1];
  const span = last.time - first.time;
  const plotWidth = W - M.left - M.right;
  const plotHeight = H - M.top - M.bottom;
  const x = (time: number) => (span === 0 ? M.left + plotWidth / 2 : M.left + ((time - first.time) / span) * plotWidth);
  const y = (value: number) => M.top + (1 - (value - measure.min) / (measure.max - measure.min)) * plotHeight;
  const ticks = [measure.min, ...measure.cutoffs, measure.max];
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(point.time).toFixed(1)},${y(point.value).toFixed(1)}`).join(" ");
  const change = last.value - first.value;

  function pointerToIndex(event: React.PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const viewX = ((event.clientX - box.left) / box.width) * W;
    let nearest = 0;
    points.forEach((point, index) => {
      if (Math.abs(x(point.time) - viewX) < Math.abs(x(points[nearest].time) - viewX)) nearest = index;
    });
    return nearest;
  }

  function handleKey(event: React.KeyboardEvent<SVGSVGElement>) {
    if (event.key === "ArrowLeft") setActive((current) => Math.max(0, (current ?? points.length) - 1));
    else if (event.key === "ArrowRight") setActive((current) => Math.min(points.length - 1, (current ?? -1) + 1));
    else return;
    event.preventDefault();
  }

  const hovered = active !== null ? points[active] : null;
  const summary = `${measure.title}: ${points.map((point) => `${formatDate(point.entry.created_at)} ${point.value}${measure.unit}`).join(", ")}`;

  return (
    <figure className="progress-card">
      <figcaption>
        <b>{measure.title}</b>
        <span className="progress-latest">{last.value}{measure.unit}</span>
        {points.length > 1 && (
          <span className={`progress-change ${change < 0 ? "is-better" : change > 0 ? "is-worse" : ""}`}>
            {change === 0 ? "No change" : `${change < 0 ? "↓" : "↑"} ${Math.abs(change)}${measure.unit === "%" ? " pts" : ""} since first`}
          </span>
        )}
      </figcaption>
      <div className="progress-plot">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={summary}
          tabIndex={0}
          onPointerMove={(event) => setActive(pointerToIndex(event))}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(points.length - 1)}
          onBlur={() => setActive(null)}
          onKeyDown={handleKey}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line className="progress-grid-line" x1={M.left} x2={W - M.right} y1={y(tick)} y2={y(tick)} />
              <text className="progress-axis" x={M.left - 6} y={y(tick)} dy="0.32em" textAnchor="end">{tick}</text>
            </g>
          ))}
          <text className="progress-axis" x={x(first.time)} y={H - 6} textAnchor={span === 0 ? "middle" : "start"}>{formatDate(first.entry.created_at)}</text>
          {span > 0 && <text className="progress-axis" x={x(last.time)} y={H - 6} textAnchor="end">{formatDate(last.entry.created_at)}</text>}
          {hovered && <line className="progress-crosshair" x1={x(hovered.time)} x2={x(hovered.time)} y1={M.top} y2={H - M.bottom} />}
          {points.length > 1 && <path className="progress-line" d={path} />}
          {points.map((point, index) => (
            <circle key={index} className="progress-dot" cx={x(point.time)} cy={y(point.value)} r={index === active ? 5.5 : 4} />
          ))}
        </svg>
        {hovered && (
          <div
            className="progress-tooltip"
            style={{ left: `${(x(hovered.time) / W) * 100}%`, top: `${(y(hovered.value) / H) * 100}%` }}
            role="status"
          >
            <strong>{hovered.value}{measure.unit}</strong>
            {formatBand(measure.band(hovered.entry)) && <span>{formatBand(measure.band(hovered.entry))}</span>}
            <span>{new Date(hovered.entry.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
          </div>
        )}
      </div>
    </figure>
  );
}
