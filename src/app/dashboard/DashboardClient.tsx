"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import SiteHeader from "../components/SiteHeader";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";
import { fetchCheckIns, logout, type CheckInRecord } from "../lib/auth";

const BAND_LABEL: Record<string, string> = { low: "Low", watch: "Watch", elevated: "Elevated", crisis: "Crisis" };

export default function DashboardClient() {
  return <ProtectedRoute>{(user) => <DashboardContent email={user.email} />}</ProtectedRoute>;
}

function DashboardContent({ email }: { email: string }) {
  const router = useRouter();
  const [checkIns, setCheckIns] = useState<CheckInRecord[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCheckIns()
      .then(setCheckIns)
      .catch(() => setError("Could not load your history right now."));
  }, []);

  function handleSignOut() {
    logout();
    router.push("/");
  }

  return (
    <>
    <main className="resource-page">
      <SiteHeader
        backLabel="New check-in"
        right={<button className="dashboard-signout" onClick={handleSignOut} type="button">Sign out</button>}
      />
      <section className="resource-hero">
        <p className="eyebrow">YOUR DASHBOARD</p>
        <h1>Check-in history<br /><em>for {email}.</em></h1>
        <p>Only the score, band, and detected themes from each check-in are saved here - never your transcript, typed answers, or individual questionnaire responses.</p>
      </section>
      <NatureBanner {...naturePhotos.mountainRange} priority />
      {error && <p className="assessment-error dashboard-error">{error}</p>}
      {checkIns === null && !error && <p className="dashboard-loading">Loading your history…</p>}
      {checkIns?.length === 0 && (
        <div className="dashboard-empty">
          <p>No saved check-ins yet.</p>
          <Link className="result-primary" href="/">Start a check-in <span>→</span></Link>
        </div>
      )}
      {checkIns && checkIns.length > 0 && (
        <div className="dashboard-list">
          {checkIns.map((entry) => (
            <article className="dashboard-entry" key={entry.id}>
              <div className="dashboard-entry-score">
                <strong>{Math.round(entry.risk_score * 100)}</strong>
                <span>/ 100</span>
              </div>
              <div className="dashboard-entry-details">
                <b className={`result-band ${entry.band}`}>{BAND_LABEL[entry.band] ?? entry.band}</b>
                <span className="dashboard-entry-date">{new Date(entry.created_at).toLocaleString()}</span>
                {entry.themes.length > 0 && (
                  <div className="theme-row">{entry.themes.map((theme) => <span key={theme}>{theme.replaceAll("_", " ")}</span>)}</div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
    <SiteFooter />
    </>
  );
}
