"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";
import { resetPassword } from "../lib/auth";
import { useLanguage } from "../lib/language";

const copy = {
  English: {
    back: "Back to check-in",
    eyebrow: "ACCOUNT",
    titleA: "Set a new password",
    titleB: "and you're back in.",
    intro: "Choose a new password for your MindHx account.",
    missingToken: "This reset link is missing its token, so it can't be used. Request a new one below.",
    requestNewLink: "Request a new link",
    success: "Your password has been updated. Sign in with your new password.",
    goToSignIn: "Go to sign in",
    newPassword: "New password (min. 8 characters)",
    confirmPassword: "Confirm new password",
    required: "*required",
    update: "Update password",
    updating: "Updating…",
    expiryPrefix: "This link expires 30 minutes after it was requested. Need a new one? ",
    requestAgain: "Request again",
    tooShort: "Password must be at least 8 characters.",
    mismatch: "Passwords do not match.",
    failed: "Could not update your password right now.",
  },
  اردو: {
    back: "چیک ان پر واپس",
    eyebrow: "اکاؤنٹ",
    titleA: "نیا پاس ورڈ بنائیں",
    titleB: "اور آپ دوبارہ داخل ہو جائیں گے۔",
    intro: "اپنے MindHx اکاؤنٹ کے لیے نیا پاس ورڈ منتخب کریں۔",
    missingToken: "اس ری سیٹ لنک میں ٹوکن موجود نہیں، اس لیے یہ استعمال نہیں ہو سکتا۔ نیچے سے نیا لنک حاصل کریں۔",
    requestNewLink: "نیا لنک حاصل کریں",
    success: "آپ کا پاس ورڈ تبدیل ہو گیا ہے۔ نئے پاس ورڈ سے سائن ان کریں۔",
    goToSignIn: "سائن ان کریں",
    newPassword: "نیا پاس ورڈ (کم از کم 8 حروف)",
    confirmPassword: "نئے پاس ورڈ کی تصدیق کریں",
    required: "*ضروری",
    update: "پاس ورڈ اپ ڈیٹ کریں",
    updating: "اپ ڈیٹ ہو رہا ہے…",
    expiryPrefix: "یہ لنک درخواست کے 30 منٹ بعد ختم ہو جاتا ہے۔ نیا لنک چاہیے؟ ",
    requestAgain: "دوبارہ درخواست کریں",
    tooShort: "پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے۔",
    mismatch: "پاس ورڈز مماثل نہیں ہیں۔",
    failed: "ابھی پاس ورڈ اپ ڈیٹ نہیں ہو سکا۔",
  },
};

export default function ResetPasswordClient() {
  const token = useSearchParams().get("token") ?? "";
  const [language, setLanguage] = useLanguage();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const text = copy[language];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError(text.tooShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(text.mismatch);
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : text.failed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <main className="resource-page" dir={language === "اردو" ? "rtl" : "ltr"}>
      <SiteHeader backLabel={text.back} language={language} onToggleLanguage={() => setLanguage(language === "English" ? "اردو" : "English")} />
      <section className="resource-hero auth-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.titleA}<br /><em>{text.titleB}</em></h1>
        <p>{text.intro}</p>
      </section>
      <NatureBanner {...naturePhotos.steppingStones} priority />
      {!token ? (
        <div className="auth-form auth-confirmation">
          <p className="assessment-error auth-error">{text.missingToken}</p>
          <Link className="check-in-button auth-confirmation-link" href="/forgot-password">{text.requestNewLink} <span>→</span></Link>
        </div>
      ) : done ? (
        <div className="auth-form auth-confirmation">
          <p className="auth-success">{text.success}</p>
          <Link className="check-in-button auth-confirmation-link" href="/login">{text.goToSignIn} <span>→</span></Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>{text.newPassword} <em className="required-mark">{text.required}</em></span>
            <input type="password" dir="ltr" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
          </label>
          <label>
            <span>{text.confirmPassword} <em className="required-mark">{text.required}</em></span>
            <input type="password" dir="ltr" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
          </label>
          {error && <p className="assessment-error auth-error">{error}</p>}
          <button className="check-in-button" type="submit" disabled={loading}>{loading ? text.updating : text.update} <span>→</span></button>
          <p className="auth-switch">{text.expiryPrefix}<Link href="/forgot-password">{text.requestAgain}</Link></p>
        </form>
      )}
    </main>
    <SiteFooter language={language} />
    </>
  );
}
