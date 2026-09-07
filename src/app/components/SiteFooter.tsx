import Link from "next/link";

type Props = { language?: "English" | "اردو" };

const COPY = {
  English: {
    tagline: "An early-detection triage aid that combines voice, language, and validated questionnaires into one explainable signal for professional review. Not a diagnosis.",
    resources: "Resources", medication: "Medication", meditation: "Meditation techniques", therapies: "Therapies",
    support: "Support", ai: "MindHx AI", therapist: "Talk to a therapist", emergency: "Emergency support",
    account: "Account", signIn: "Sign in", createAccount: "Create account", dashboard: "Dashboard",
    more: "MindHx", checkIn: "Check-in", brand: "Brand",
    copyright: (year: number) => `© ${year} MindHx - a screening and triage aid, not a diagnosis.`,
    privacy: "Private by default. No account required.",
  },
  اردو: {
    tagline: "ایک ابتدائی اسکریننگ اور رہنمائی کا ذریعہ جو آواز، زبان، اور مستند سوالناموں کو ایک قابلِ وضاحت اشارے میں یکجا کرتا ہے۔ یہ تشخیص نہیں ہے۔",
    resources: "وسائل", medication: "ادویات", meditation: "مراقبے کی تکنیکیں", therapies: "تھراپیز",
    support: "مدد", ai: "MindHx AI", therapist: "معالج سے بات کریں", emergency: "فوری مدد",
    account: "اکاؤنٹ", signIn: "سائن ان", createAccount: "اکاؤنٹ بنائیں", dashboard: "ڈیش بورڈ",
    more: "MindHx", checkIn: "چیک ان", brand: "برانڈ",
    copyright: (year: number) => `© ${year} MindHx - ایک اسکریننگ اور رہنمائی کا ذریعہ، تشخیص نہیں۔`,
    privacy: "پہلے سے نجی۔ کسی اکاؤنٹ کی ضرورت نہیں۔",
  },
};

export default function SiteFooter({ language = "English" }: Props) {
  const text = COPY[language];
  const isUrdu = language === "اردو";
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" dir={isUrdu ? "rtl" : "ltr"}>
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <div className="site-footer-wordmark"><span className="brand-mark">M</span><span>Mind<span className="brand-accent">Hx</span></span></div>
          <p>{text.tagline}</p>
        </div>
        <nav className="site-footer-columns" aria-label="MindHx site links">
          <div>
            <p className="site-footer-heading">{text.resources}</p>
            <Link href="/medication">{text.medication}</Link>
            <Link href="/meditation">{text.meditation}</Link>
            <Link href="/therapies">{text.therapies}</Link>
          </div>
          <div>
            <p className="site-footer-heading">{text.support}</p>
            <Link href="/ai">{text.ai}</Link>
            <Link href="/therapist">{text.therapist}</Link>
            <Link href="/emergency" className="site-footer-emergency">{text.emergency}</Link>
          </div>
          <div>
            <p className="site-footer-heading">{text.account}</p>
            <Link href="/login">{text.signIn}</Link>
            <Link href="/register">{text.createAccount}</Link>
            <Link href="/dashboard">{text.dashboard}</Link>
          </div>
          <div>
            <p className="site-footer-heading">{text.more}</p>
            <Link href="/">{text.checkIn}</Link>
            <Link href="/brand">{text.brand}</Link>
          </div>
        </nav>
      </div>
      <div className="site-footer-bottom">
        <span>{text.copyright(year)}</span>
        <span>{text.privacy}</span>
      </div>
    </footer>
  );
}
