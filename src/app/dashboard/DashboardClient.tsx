"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import SiteHeader from "../components/SiteHeader";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";
import { changePassword, deleteCheckInReport, downloadCheckInReport, fetchCheckInEligibility, fetchCheckIns, fetchLoginSessions, logout, revokeLoginSession, revokeOtherLoginSessions, updateProfile, type CheckInEligibility, type CheckInRecord, type CurrentUser, type LoginSessionRecord } from "../lib/auth";
import { resizeImageToDataUrl } from "../lib/resizeImage";
import CheckInResultsBody from "../components/CheckInResultsBody";
import ProgressCharts from "../components/ProgressCharts";
import QuestionnaireAnswersList from "../components/QuestionnaireAnswersList";
import { downloadResultsPdf } from "../lib/resultsPdf";
import { useLanguage, type Language } from "../lib/language";
import { bandLabel, themeLabel } from "../lib/resultsGuidance";

const SESSION_METHOD_LABEL: Record<string, { en: string; ur: string }> = {
  login: { en: "Signed in", ur: "سائن ان ہوا" },
  register: { en: "Account created", ur: "اکاؤنٹ بنایا گیا" },
  password_change: { en: "Signed in after password change", ur: "پاس ورڈ تبدیل کرنے کے بعد سائن ان ہوا" },
};
const SESSION_STATUS_LABEL: Record<string, { en: string; ur: string }> = {
  active: { en: "Active", ur: "فعال" },
  expired: { en: "Expired", ur: "ختم شدہ" },
  logout: { en: "Signed out", ur: "سائن آؤٹ ہوا" },
  revoked: { en: "Signed out remotely", ur: "دور سے سائن آؤٹ کیا گیا" },
  password_change: { en: "Ended by password change", ur: "پاس ورڈ تبدیلی سے ختم ہوا" },
  password_reset: { en: "Ended by password reset", ur: "پاس ورڈ ری سیٹ سے ختم ہوا" },
};
const LOGIN_HISTORY_PREVIEW = 5;

const copy = {
  English: {
    newCheckIn: "New check-in",
    signOut: "Sign out",
    eyebrow: "YOUR DASHBOARD",
    titleA: "Check-in history",
    titleB: (email: string) => `for ${email}.`,
    intro: "Every check-in is saved here: your combined score, signal breakdown, support plan, and your answer to each questionnaire item (which the MindHx team can review). Its full PDF report - including what you said and wrote - is saved too, visible only to you, so you can download it any time and show it to your doctor. You can delete a saved report whenever you like.",
    uploading: "Uploading…",
    changePhoto: "Change photo",
    changePassword: "Change password",
    loadError: "Could not load your history right now.",
    loadingHistory: "Loading your history…",
    noCheckIns: "No saved check-ins yet.",
    startCheckIn: "Start a check-in",
    yourProgress: "YOUR PROGRESS",
    scoresChanged: "How your scores have changed",
    takeThisWeek: "Take this week's check-in",
    nextCheckInOpens: (when: string) => `Next check-in opens ${when}.`,
    hideFullResults: "Hide full results ↑",
    viewFullResults: "View full results ↓",
    fullReportSaved: "📄 Full report saved - your answers and scores, ready to show your doctor.",
    summaryOnly: "Summary only - the full report for this check-in isn't saved.",
    working: "Working…",
    downloadReport: "Download report (PDF)",
    downloadSummary: "Download summary (PDF)",
    deleteReport: "Delete report",
    deleteReportError: "Could not delete this report right now.",
    downloadReportError: "Could not download this report right now.",
    deleteConfirm: "Delete the saved PDF report for this check-in? Its scores stay in your history, but the full report - your answers and what you wrote or said - is removed for good.",
    yourAnswers: "Your answers",
    phq9: "PHQ-9", gad7: "GAD-7", k10: "K10", text: "Text", voice: "Voice", na: "n/a",
  },
  اردو: {
    newCheckIn: "نیا چیک ان",
    signOut: "سائن آؤٹ",
    eyebrow: "آپ کا ڈیش بورڈ",
    titleA: "چیک ان کی تاریخ",
    titleB: (email: string) => `${email} کے لیے۔`,
    intro: "ہر چیک ان یہاں محفوظ ہے: آپ کا مجموعی اسکور، اشاروں کی تفصیل، معاون منصوبہ، اور سوالنامے کے ہر سوال کا آپ کا جواب (جسے MindHx ٹیم دیکھ سکتی ہے)۔ اس کی مکمل PDF رپورٹ بھی - جس میں آپ نے جو کہا اور لکھا وہ شامل ہے - محفوظ کی جاتی ہے، جو صرف آپ کو نظر آتی ہے، تاکہ آپ اسے کسی بھی وقت ڈاؤن لوڈ کر کے اپنے ڈاکٹر کو دکھا سکیں۔ آپ محفوظ شدہ رپورٹ جب چاہیں حذف کر سکتے ہیں۔",
    uploading: "اپ لوڈ ہو رہا ہے…",
    changePhoto: "تصویر تبدیل کریں",
    changePassword: "پاس ورڈ تبدیل کریں",
    loadError: "ابھی آپ کی تاریخ لوڈ نہیں ہو سکی۔",
    loadingHistory: "آپ کی تاریخ لوڈ ہو رہی ہے…",
    noCheckIns: "ابھی تک کوئی محفوظ چیک ان نہیں۔",
    startCheckIn: "چیک ان شروع کریں",
    yourProgress: "آپ کی پیش رفت",
    scoresChanged: "آپ کے اسکور کیسے بدلے ہیں",
    takeThisWeek: "اس ہفتے کا چیک ان کریں",
    nextCheckInOpens: (when: string) => `اگلا چیک ان ${when} کو کھلے گا۔`,
    hideFullResults: "مکمل نتائج چھپائیں ↑",
    viewFullResults: "مکمل نتائج دیکھیں ↓",
    fullReportSaved: "📄 مکمل رپورٹ محفوظ ہے - آپ کے جوابات اور اسکور، آپ کے ڈاکٹر کو دکھانے کے لیے تیار۔",
    summaryOnly: "صرف خلاصہ - اس چیک ان کی مکمل رپورٹ محفوظ نہیں ہے۔",
    working: "کام جاری ہے…",
    downloadReport: "رپورٹ ڈاؤن لوڈ کریں (PDF)",
    downloadSummary: "خلاصہ ڈاؤن لوڈ کریں (PDF)",
    deleteReport: "رپورٹ حذف کریں",
    deleteReportError: "ابھی یہ رپورٹ حذف نہیں ہو سکی۔",
    downloadReportError: "ابھی یہ رپورٹ ڈاؤن لوڈ نہیں ہو سکی۔",
    deleteConfirm: "اس چیک ان کی محفوظ شدہ PDF رپورٹ حذف کریں؟ اس کے اسکور آپ کی تاریخ میں رہیں گے، لیکن مکمل رپورٹ - آپ کے جوابات اور جو آپ نے لکھا یا کہا - ہمیشہ کے لیے ہٹا دی جائے گی۔",
    yourAnswers: "آپ کے جوابات",
    phq9: "PHQ-9", gad7: "GAD-7", k10: "K10", text: "متن", voice: "آواز", na: "دستیاب نہیں",
  },
};

export default function DashboardClient() {
  return <ProtectedRoute>{(user) => <DashboardContent initialUser={user} />}</ProtectedRoute>;
}

function DashboardContent({ initialUser }: { initialUser: CurrentUser }) {
  const router = useRouter();
  const [language, setLanguage] = useLanguage();
  const isUrdu = language === "اردو";
  const text = copy[language];
  const [user, setUser] = useState(initialUser);
  const [checkIns, setCheckIns] = useState<CheckInRecord[] | null>(null);
  const [error, setError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reportBusyId, setReportBusyId] = useState<string | null>(null);
  const [reportError, setReportError] = useState<{ id: string; message: string } | null>(null);
  const [eligibility, setEligibility] = useState<CheckInEligibility | null>(null);

  useEffect(() => {
    fetchCheckIns()
      .then(setCheckIns)
      .catch(() => setError(text.loadError));
    fetchCheckInEligibility().then(setEligibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSignOut() {
    logout();
    router.push("/");
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setAvatarError("");
    setUploadingAvatar(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      const updated = await updateProfile({ avatarDataUrl: dataUrl });
      setUser(updated);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Could not update your photo.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  const displayName = user.full_name || user.email;
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";

  async function handleDownloadPdf(entry: CheckInRecord) {
    if (!entry.has_report) {
      // Check-ins saved before reports were kept (or whose report was
      // deleted): rebuild a summary PDF from the saved scores. It has no
      // transcript or written text - only the saved report does; saved item
      // answers are shown on this page instead (QuestionnaireAnswersList).
      downloadResultsPdf(entry, { name: user.full_name, email: user.email });
      return;
    }
    setReportBusyId(entry.id);
    setReportError(null);
    try {
      await downloadCheckInReport(entry.id);
    } catch {
      setReportError({ id: entry.id, message: text.downloadReportError });
    } finally {
      setReportBusyId(null);
    }
  }

  async function handleDeleteReport(entry: CheckInRecord) {
    if (!window.confirm(text.deleteConfirm)) return;
    setReportBusyId(entry.id);
    setReportError(null);
    try {
      await deleteCheckInReport(entry.id);
      setCheckIns((current) => current?.map((item) => item.id === entry.id ? { ...item, has_report: false } : item) ?? null);
    } catch {
      setReportError({ id: entry.id, message: text.deleteReportError });
    } finally {
      setReportBusyId(null);
    }
  }

  return (
    <>
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <SiteHeader
        language={language}
        onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")}
        backLabel={text.newCheckIn}
        right={<button className="dashboard-signout" onClick={handleSignOut} type="button">{text.signOut}</button>}
      />
      <div className="resource-hero-banner">
        <NatureBanner {...naturePhotos.mountainRange} priority />
        <section className="resource-hero">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{text.titleA}<br /><em>{text.titleB(user.email)}</em></h1>
          <p>{text.intro}</p>
        </section>
      </div>

      <section className="profile-panel">
        <div className="profile-avatar-wrap">
          {user.avatar_data_url
            ? <img className="profile-avatar" src={user.avatar_data_url} alt="" />
            : <div className="profile-avatar-placeholder">{initial}</div>}
          <label className="profile-avatar-edit">
            {uploadingAvatar ? text.uploading : text.changePhoto}
            <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={uploadingAvatar} />
          </label>
          <div className="profile-avatar-actions">
            <button onClick={() => setShowChangePassword(true)} type="button">{text.changePassword}</button>
            <button onClick={handleSignOut} type="button">{text.signOut}</button>
          </div>
        </div>
        <div className="profile-info">
          <h2>{displayName}</h2>
          <p>{user.email}</p>
          {avatarError && <p className="profile-avatar-error">{avatarError}</p>}
        </div>
      </section>

      {error && <p className="assessment-error dashboard-error">{error}</p>}
      {checkIns === null && !error && <p className="dashboard-loading">{text.loadingHistory}</p>}
      {checkIns?.length === 0 && (
        <div className="dashboard-empty">
          <p>{text.noCheckIns}</p>
          <Link className="result-primary" href="/">{text.startCheckIn} <span>→</span></Link>
        </div>
      )}
      {checkIns && checkIns.length > 0 && (
        <section className="progress-section">
          <div className="progress-heading">
            <div>
              <p className="card-kicker">{text.yourProgress}</p>
              <h2>{text.scoresChanged}</h2>
            </div>
            {eligibility && (eligibility.can_check_in
              ? <Link className="result-primary" href="/">{text.takeThisWeek} <span>→</span></Link>
              : <p className="progress-next">{text.nextCheckInOpens(new Date(eligibility.next_available_at!).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" }))}</p>)}
          </div>
          <ProgressCharts entries={checkIns} />
        </section>
      )}
      {checkIns && checkIns.length > 0 && (
        <div className="dashboard-list">
          {checkIns.map((entry) => {
            const isExpanded = expandedId === entry.id;
            return (
              <article className="dashboard-entry-wrap" key={entry.id}>
                <button
                  className="dashboard-entry"
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="dashboard-entry-score">
                    <strong>{Math.round(entry.risk_score * 100)}</strong>
                    <span>/ 100</span>
                  </div>
                  <div className="dashboard-entry-details">
                    <b className={`result-band ${entry.band}`}>{bandLabel(entry.band, language)}</b>
                    <span className="dashboard-entry-date">{new Date(entry.created_at).toLocaleString()}</span>
                    {entry.themes.length > 0 && (
                      <div className="theme-row">{entry.themes.map((theme) => <span key={theme}>{themeLabel(theme, language)}</span>)}</div>
                    )}
                    {entry.components && (
                      <div className="dashboard-entry-breakdown">
                        <span><b>{text.phq9}</b> {entry.components.phq9.score}/27 · {bandLabel(entry.components.phq9.band, language)}</span>
                        <span><b>{text.gad7}</b> {entry.components.gad7.score}/21 · {bandLabel(entry.components.gad7.band, language)}</span>
                        <span><b>{text.k10}</b> {entry.components.k10.score}/50 · {bandLabel(entry.components.k10.band, language)}</span>
                        <span><b>{text.text}</b> {entry.components.text.sentiment}</span>
                        <span><b>{text.voice}</b> {entry.components.voice.available ? `${Math.round((entry.components.voice.signal ?? 0) * 100)}%` : text.na}</span>
                      </div>
                    )}
                    {entry.support_plan?.next_action && <p className="dashboard-entry-next-action">{entry.support_plan.next_action}</p>}
                  </div>
                  {(entry.components || entry.answers) && <span className="dashboard-entry-toggle">{isExpanded ? text.hideFullResults : text.viewFullResults}</span>}
                </button>
                <div className="dashboard-report-row">
                  {entry.has_report
                    ? <span>{text.fullReportSaved}</span>
                    : <span>{text.summaryOnly}</span>}
                  <div>
                    <button type="button" onClick={() => handleDownloadPdf(entry)} disabled={reportBusyId === entry.id}>
                      {reportBusyId === entry.id ? text.working : entry.has_report ? text.downloadReport : text.downloadSummary}
                    </button>
                    {entry.has_report && (
                      <button type="button" className="dashboard-report-delete" onClick={() => handleDeleteReport(entry)} disabled={reportBusyId === entry.id}>{text.deleteReport}</button>
                    )}
                  </div>
                  {reportError?.id === entry.id && <p className="assessment-error">{reportError.message}</p>}
                </div>
                {isExpanded && (entry.components || entry.answers) && (
                  <div className="dashboard-entry-expanded">
                    {entry.answers && (
                      <div className="dashboard-answers">
                        <h3>{text.yourAnswers}</h3>
                        <QuestionnaireAnswersList answers={entry.answers} audience="self" />
                      </div>
                    )}
                    {entry.components && (
                      <CheckInResultsBody
                        result={entry}
                        onDownloadPdf={() => handleDownloadPdf(entry)}
                        onReturnToCheckIn={() => setExpandedId(null)}
                        language={language}
                      />
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <LoginHistory language={language} />
    </main>
    <SiteFooter language={language} />
    {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} language={language} />}
    </>
  );
}

const loginHistoryCopy = {
  English: {
    loadError: "Could not load your login history right now.",
    revokeError: "Could not sign out that device.",
    revokeOthersError: "Could not sign out your other devices.",
    security: "SECURITY",
    title: "Login history",
    intro: "Every sign-in to your account from the last 90 days. If you don't recognise one, sign it out and change your password.",
    signingOut: "Signing out…",
    signOutOthers: (count: number) => `Sign out ${count} other device${count === 1 ? "" : "s"}`,
    loading: "Loading login history…",
    thisDevice: "This device",
    signedInDefault: "Signed in",
    ipAddress: (ip: string) => `IP ${ip}`,
    lastActive: (when: string) => `last active ${when}`,
    signOut: "Sign out",
    showFewer: "Show fewer",
    showAll: (count: number) => `Show all ${count} sign-ins`,
  },
  اردو: {
    loadError: "ابھی آپ کی سائن ان تاریخ لوڈ نہیں ہو سکی۔",
    revokeError: "اس ڈیوائس کو سائن آؤٹ نہیں کیا جا سکا۔",
    revokeOthersError: "آپ کی دیگر ڈیوائسز کو سائن آؤٹ نہیں کیا جا سکا۔",
    security: "سیکیورٹی",
    title: "سائن ان کی تاریخ",
    intro: "پچھلے 90 دنوں میں آپ کے اکاؤنٹ میں ہر سائن ان۔ اگر کوئی پہچان میں نہ آئے تو اسے سائن آؤٹ کریں اور اپنا پاس ورڈ تبدیل کریں۔",
    signingOut: "سائن آؤٹ ہو رہا ہے…",
    signOutOthers: (count: number) => `${count} دیگر ڈیوائسز سائن آؤٹ کریں`,
    loading: "سائن ان کی تاریخ لوڈ ہو رہی ہے…",
    thisDevice: "یہ ڈیوائس",
    signedInDefault: "سائن ان ہوا",
    ipAddress: (ip: string) => `IP ${ip}`,
    lastActive: (when: string) => `آخری سرگرمی ${when}`,
    signOut: "سائن آؤٹ",
    showFewer: "کم دکھائیں",
    showAll: (count: number) => `تمام ${count} سائن اِنز دکھائیں`,
  },
};

function LoginHistory({ language }: { language: Language }) {
  const isUrdu = language === "اردو";
  const text = loginHistoryCopy[language];
  const [sessions, setSessions] = useState<LoginSessionRecord[] | null>(null);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetchLoginSessions()
      .then((result) => {
        setSessions(result);
        setError("");
      })
      .catch(() => setError(text.loadError));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  async function handleRevoke(sessionId: string) {
    setBusyId(sessionId);
    try {
      await revokeLoginSession(sessionId);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : text.revokeError);
    } finally {
      setBusyId(null);
    }
  }

  async function handleRevokeOthers() {
    setBusyId("others");
    try {
      await revokeOtherLoginSessions();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : text.revokeOthersError);
    } finally {
      setBusyId(null);
    }
  }

  const otherActive = sessions?.filter((session) => session.active && !session.current).length ?? 0;
  const visible = sessions && (showAll ? sessions : sessions.slice(0, LOGIN_HISTORY_PREVIEW));

  return (
    <section className="login-history">
      <div className="login-history-heading">
        <div>
          <p className="card-kicker">{text.security}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </div>
        {otherActive > 0 && (
          <button className="login-history-revoke-all" type="button" onClick={handleRevokeOthers} disabled={busyId !== null}>
            {busyId === "others" ? text.signingOut : text.signOutOthers(otherActive)}
          </button>
        )}
      </div>
      {error && <p className="assessment-error">{error}</p>}
      {sessions === null && !error && <p className="dashboard-loading">{text.loading}</p>}
      {visible && visible.length > 0 && (
        <ul className="login-history-list">
          {visible.map((session) => (
            <li key={session.id} className={`login-history-row ${session.active ? "is-active" : ""}`}>
              <div className="login-history-main">
                <b>{session.device}</b>
                {session.current && <span className="login-history-badge">{text.thisDevice}</span>}
                <span className="login-history-meta">
                  {(isUrdu ? SESSION_METHOD_LABEL[session.method]?.ur : SESSION_METHOD_LABEL[session.method]?.en) ?? text.signedInDefault} · {new Date(session.created_at).toLocaleString()}
                  {session.ip_address && <> · {text.ipAddress(session.ip_address)}</>}
                </span>
                <span className="login-history-meta">
                  {(isUrdu ? SESSION_STATUS_LABEL[session.status]?.ur : SESSION_STATUS_LABEL[session.status]?.en) ?? session.status}
                  {session.active && <> · {text.lastActive(new Date(session.last_seen_at).toLocaleString())}</>}
                  {session.ended_at && <> · {new Date(session.ended_at).toLocaleString()}</>}
                </span>
              </div>
              {session.active && !session.current && (
                <button type="button" onClick={() => handleRevoke(session.id)} disabled={busyId !== null}>
                  {busyId === session.id ? text.signingOut : text.signOut}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {sessions && sessions.length > LOGIN_HISTORY_PREVIEW && (
        <button className="login-history-more" type="button" onClick={() => setShowAll(!showAll)}>
          {showAll ? text.showFewer : text.showAll(sessions.length)}
        </button>
      )}
    </section>
  );
}

const changePasswordCopy = {
  English: {
    close: "Close",
    eyebrow: "ACCOUNT",
    title: "Change password",
    current: "Current password",
    newPassword: "New password (min. 8 characters)",
    confirm: "Confirm new password",
    tooShort: "New password must be at least 8 characters.",
    mismatch: "New passwords don't match.",
    failed: "Could not change your password.",
    changing: "Changing…",
    submit: "Change password",
    forgotPrefix: "Forgot your current password instead? ",
    resetByEmail: "Reset it by email",
  },
  اردو: {
    close: "بند کریں",
    eyebrow: "اکاؤنٹ",
    title: "پاس ورڈ تبدیل کریں",
    current: "موجودہ پاس ورڈ",
    newPassword: "نیا پاس ورڈ (کم از کم 8 حروف)",
    confirm: "نئے پاس ورڈ کی تصدیق کریں",
    tooShort: "نیا پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے۔",
    mismatch: "نئے پاس ورڈز مماثل نہیں ہیں۔",
    failed: "پاس ورڈ تبدیل نہیں ہو سکا۔",
    changing: "تبدیل ہو رہا ہے…",
    submit: "پاس ورڈ تبدیل کریں",
    forgotPrefix: "اس کے بجائے موجودہ پاس ورڈ بھول گئے؟ ",
    resetByEmail: "ای میل کے ذریعے ری سیٹ کریں",
  },
};

function ChangePasswordModal({ onClose, language }: { onClose: () => void; language: Language }) {
  const text = changePasswordCopy[language];
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword.length < 8) {
      setError(text.tooShort);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(text.mismatch);
      return;
    }
    setLoading(true);
    try {
      const message = await changePassword(currentPassword, newPassword);
      setSuccess(message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : text.failed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()} dir={language === "اردو" ? "rtl" : "ltr"}>
        <button className="close" onClick={onClose} aria-label={text.close} type="button">×</button>
        <p className="eyebrow">{text.eyebrow}</p>
        <h2>{text.title}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>{text.current}</span>
            <input type="password" dir="ltr" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" />
          </label>
          <label>
            <span>{text.newPassword}</span>
            <input type="password" dir="ltr" required minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" />
          </label>
          <label>
            <span>{text.confirm}</span>
            <input type="password" dir="ltr" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
          </label>
          {error && <p className="assessment-error auth-error">{error}</p>}
          {success && <p className="profile-avatar-success">{success}</p>}
          <button className="check-in-button" type="submit" disabled={loading}>{loading ? text.changing : text.submit} <span>→</span></button>
        </form>
        <p className="profile-modal-auth">{text.forgotPrefix}<Link href="/forgot-password">{text.resetByEmail}</Link>.</p>
      </div>
    </div>
  );
}
