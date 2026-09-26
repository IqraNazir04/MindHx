"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";
import { login, safeNextPath } from "../lib/auth";

const copy = {
  English: {
    back: "Back to check-in",
    eyebrow: "ACCOUNT",
    titleA: "Sign in",
    titleB: "to see your results.",
    intro: "Viewing your check-in results requires an account, so you can safely revisit them later. We save your overall score, band, themes, and each section's summary scores - never your transcript, your written words, or your individual question answers.",
    email: "Email",
    password: "Password",
    required: "*required",
    forgot: "Forgot password?",
    submit: "Sign in",
    submitting: "Signing in…",
    failed: "Sign in failed.",
    noAccount: "Don't have an account?",
    create: "Create one",
  },
  اردو: {
    back: "چیک ان پر واپس",
    eyebrow: "اکاؤنٹ",
    titleA: "سائن ان کریں",
    titleB: "تاکہ اپنے نتائج دیکھ سکیں۔",
    intro: "اپنے جائزے کے نتائج دیکھنے کے لیے اکاؤنٹ ضروری ہے، تاکہ آپ بعد میں انہیں محفوظ طریقے سے دوبارہ دیکھ سکیں۔ ہم آپ کا مجموعی اسکور، درجہ، موضوعات، اور ہر حصے کے خلاصہ اسکور محفوظ کرتے ہیں - کبھی آپ کا متن، آپ کے لکھے الفاظ، یا انفرادی سوالات کے جوابات نہیں۔",
    email: "ای میل",
    password: "پاس ورڈ",
    required: "*ضروری",
    forgot: "پاس ورڈ بھول گئے؟",
    submit: "سائن ان",
    submitting: "سائن ان ہو رہا ہے…",
    failed: "سائن ان نہیں ہو سکا۔",
    noAccount: "اکاؤنٹ نہیں ہے؟",
    create: "نیا اکاؤنٹ بنائیں",
  },
};

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const [language, setLanguage] = useState<"English" | "اردو">("English");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const text = copy[language];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push(nextPath);
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
      <NatureBanner {...naturePhotos.forestPath} priority />
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span>{text.email} <em className="required-mark">{text.required}</em></span>
          <input type="email" dir="ltr" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" />
        </label>
        <label>
          <div className="auth-label-row">
            <span>{text.password} <em className="required-mark">{text.required}</em></span>
            <Link href="/forgot-password" className="auth-forgot-link">{text.forgot}</Link>
          </div>
          <input type="password" dir="ltr" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        </label>
        {error && <p className="assessment-error auth-error">{error}</p>}
        <button className="check-in-button" type="submit" disabled={loading}>{loading ? text.submitting : text.submit} <span>→</span></button>
        <p className="auth-switch">{text.noAccount} <Link href={`/register${nextPath !== "/dashboard" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}>{text.create}</Link></p>
      </form>
    </main>
    <SiteFooter language={language} />
    </>
  );
}
