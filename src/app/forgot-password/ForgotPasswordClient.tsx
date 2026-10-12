"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";
import { requestPasswordReset } from "../lib/auth";
import { useLanguage } from "../lib/language";

const copy = {
  English: {
    back: "Back to check-in",
    eyebrow: "ACCOUNT",
    titleA: "Forgot your password?",
    titleB: "We'll email you a link.",
    intro: "Enter the email address on your account and we'll send a link to reset your password. The link expires in 30 minutes.",
    email: "Email",
    required: "*required",
    submit: "Send reset link",
    submitting: "Sending…",
    failed: "Could not send the reset link right now.",
    successPrefix: "If an account exists for ",
    successSuffix: ", a password reset link is on its way. Check your inbox (and spam folder) - the link expires in 30 minutes.",
    backToSignIn: "Back to sign in",
    rememberedIt: "Remembered it?",
    signIn: "Sign in",
  },
  اردو: {
    back: "چیک ان پر واپس",
    eyebrow: "اکاؤنٹ",
    titleA: "پاس ورڈ بھول گئے؟",
    titleB: "ہم آپ کو ای میل پر لنک بھیجیں گے۔",
    intro: "اپنے اکاؤنٹ کا ای میل ایڈریس درج کریں، ہم آپ کو پاس ورڈ ری سیٹ کرنے کا لنک بھیجیں گے۔ یہ لنک 30 منٹ میں ختم ہو جائے گا۔",
    email: "ای میل",
    required: "*ضروری",
    submit: "ری سیٹ لنک بھیجیں",
    submitting: "بھیجا جا رہا ہے…",
    failed: "ابھی ری سیٹ لنک بھیجا نہیں جا سکا۔",
    successPrefix: "اگر ",
    successSuffix: " کے لیے کوئی اکاؤنٹ موجود ہے تو پاس ورڈ ری سیٹ لنک بھیجا جا رہا ہے۔ اپنا ان باکس (اور اسپیم فولڈر) چیک کریں - یہ لنک 30 منٹ میں ختم ہو جائے گا۔",
    backToSignIn: "سائن ان پر واپس جائیں",
    rememberedIt: "یاد آ گیا؟",
    signIn: "سائن ان",
  },
};

export default function ForgotPasswordClient() {
  const [language, setLanguage] = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const text = copy[language];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
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
      <NatureBanner {...naturePhotos.sunlitPathway} priority />
      {sent ? (
        <div className="auth-form auth-confirmation">
          <p className="auth-success">{text.successPrefix}<b>{email}</b>{text.successSuffix}</p>
          <Link className="check-in-button auth-confirmation-link" href="/login">{text.backToSignIn} <span>→</span></Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>{text.email} <em className="required-mark">{text.required}</em></span>
            <input type="email" dir="ltr" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" />
          </label>
          {error && <p className="assessment-error auth-error">{error}</p>}
          <button className="check-in-button" type="submit" disabled={loading || !email}>{loading ? text.submitting : text.submit} <span>→</span></button>
          <p className="auth-switch">{text.rememberedIt} <Link href="/login">{text.signIn}</Link></p>
        </form>
      )}
    </main>
    <SiteFooter language={language} />
    </>
  );
}
