"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { DoodleLeaf, DoodleSun } from "../components/Doodles";
import SiteFooter from "../components/SiteFooter";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import { StepIcon, type StepIconKey } from "../components/StepIcons";
import { useLanguage } from "../lib/language";
import { therapies } from "../therapies/data";

type AboutSection = { icon: StepIconKey; image: keyof typeof naturePhotos; en: { title: string; body: string }; ur: { title: string; body: string } };

const copy = {
  English: {
    eyebrow: "ABOUT MINDHX",
    title: "Understanding MindHx",
    intro: "Why this exists, how it actually works, what it keeps and what it doesn't, and who it is - and isn't - built for.",
    back: "Back to check-in",
    therapiesEyebrow: "THERAPY APPROACHES",
    therapiesTitle: "More than one path to support",
    therapiesIntro: "A few evidence-based approaches MindHx references when it points you toward a next step. A licensed clinician decides what actually fits you.",
    therapiesLearnMore: "Learn more",
    therapiesSeeAll: "See all therapy approaches",
    closingEyebrow: "READY WHEN YOU ARE",
    closingTitle: "See what your own signals look like",
    closingBody: "No account needed to start - voice, words, and the three questionnaires take about five minutes together, and you decide at the end whether to save anything.",
    closingCta: "Start a private check-in",
    closingEmergency: "Looking for emergency support instead?",
  },
  اردو: {
    eyebrow: "MindHx کے بارے میں",
    title: "MindHx کو سمجھنا",
    intro: "یہ کیوں موجود ہے، یہ دراصل کیسے کام کرتا ہے، یہ کیا محفوظ کرتا ہے اور کیا نہیں، اور یہ کس کے لیے ہے - اور کس کے لیے نہیں۔",
    back: "چیک ان پر واپس",
    therapiesEyebrow: "تھراپی کے طریقے",
    therapiesTitle: "مدد کا ایک سے زیادہ راستہ",
    therapiesIntro: "چند شواہد پر مبنی طریقے جن کا MindHx اگلے قدم کی رہنمائی کرتے وقت حوالہ دیتا ہے۔ یہ طے کرنا کہ آپ کے لیے کیا موزوں ہے، ایک مستند معالج کا کام ہے۔",
    therapiesLearnMore: "مزید جانیں",
    therapiesSeeAll: "تمام تھراپی طریقے دیکھیں",
    closingEyebrow: "جب آپ تیار ہوں",
    closingTitle: "دیکھیں آپ کے اپنے اشارے کیسے نظر آتے ہیں",
    closingBody: "شروع کرنے کے لیے اکاؤنٹ ضروری نہیں - آواز، الفاظ، اور تینوں سوالنامے مل کر تقریباً پانچ منٹ لیتے ہیں، اور آخر میں آپ خود فیصلہ کرتے ہیں کہ کچھ محفوظ کرنا ہے یا نہیں۔",
    closingCta: "نجی چیک ان شروع کریں",
    closingEmergency: "اس کی بجائے فوری مدد چاہیے؟",
  },
};

const ABOUT_SECTIONS: AboutSection[] = [
  {
    icon: "openHand",
    image: "mistyMountains",
    en: {
      title: "Why this exists",
      body: "Asking for mental-health help is still read as weakness in much of Pakistan, and real care is hard to reach outside major cities. MindHx replaces \"I should talk to someone eventually\" with a private five-minute check-in you can do tonight - not a diagnosis, just a concrete starting point for a real conversation later.",
    },
    ur: {
      title: "یہ کیوں موجود ہے",
      body: "پاکستان میں بہت سی جگہوں پر ذہنی صحت کی مدد مانگنا اب بھی کمزوری سمجھا جاتا ہے، اور بڑے شہروں سے باہر حقیقی نگہداشت تک رسائی مشکل ہے۔ MindHx 'مجھے کبھی نہ کبھی بات کرنی چاہیے' کو ایک نجی، پانچ منٹ کے چیک ان سے بدل دیتا ہے جو آپ آج رات کر سکتے ہیں - یہ تشخیص نہیں، بس بعد میں ایک حقیقی گفتگو کے لیے ایک ٹھوس نقطہ آغاز ہے۔",
    },
  },
  {
    icon: "gauge",
    image: "forestCreek",
    en: {
      title: "How the three signals work together",
      body: "MindHx scores three signals separately - how your voice sounds, read by a speech-emotion model, your own words, and PHQ-9, GAD-7, and K10, the same questionnaires clinicians already use - then combines them into one number. The results page shows exactly how much each signal contributed; nothing is smoothed over or hidden inside a black box.",
    },
    ur: {
      title: "تینوں اشارے مل کر کیسے کام کرتے ہیں",
      body: "MindHx تین اشاروں کو الگ الگ جانچتا ہے - آپ کی آواز کا انداز، جسے ایک اسپیچ ایموشن ماڈل پڑھتا ہے، آپ کے اپنے الفاظ، اور PHQ-9، GAD-7، اور K10 جو معالجین پہلے سے استعمال کرتے ہیں - پھر انہیں ایک نمبر میں یکجا کرتا ہے۔ نتائج کا صفحہ بالکل دکھاتا ہے کہ ہر اشارے کا کتنا حصہ تھا؛ کچھ بھی چھپایا نہیں جاتا۔",
    },
  },
  {
    icon: "shield",
    image: "goldenSea",
    en: {
      title: "What we keep, and what we don't",
      body: "Your voice is analysed for emotional tone by a speech-emotion model running on MindHx's own server, then discarded - the audio is never stored, and no one listens to it. Account holders' scores, questionnaire answers, and a downloadable PDF report are saved to their dashboard, visible only to them, and deletable at any time.",
    },
    ur: {
      title: "ہم کیا محفوظ کرتے ہیں اور کیا نہیں",
      body: "آپ کی آواز کا جذباتی انداز MindHx کے اپنے سرور پر چلنے والے ایک اسپیچ ایموشن ماڈل کے ذریعے جانچا جاتا ہے، پھر فوراً ضائع کر دیا جاتا ہے - آڈیو کبھی محفوظ نہیں کیا جاتا، اور کوئی اسے سنتا نہیں۔ اکاؤنٹ رکھنے والوں کے اسکور، سوالنامے کے جوابات، اور ڈاؤن لوڈ کے قابل PDF رپورٹ ڈیش بورڈ میں محفوظ ہوتی ہے، صرف انہیں نظر آتی ہے، اور کسی بھی وقت حذف کی جا سکتی ہے۔",
    },
  },
  {
    icon: "branchPaths",
    image: "goldenField",
    en: {
      title: "From a private check-in to a real next step",
      body: "A score alone helps no one. Crisis language routes straight to emergency support, ahead of any number, with no account required. Everything else gets a matched support plan and a bounded AI chat, plus a real directory of psychiatrists and psychologists across Pakistan when that's the right next step.",
    },
    ur: {
      title: "ایک نجی چیک ان سے ایک حقیقی اگلے قدم تک",
      body: "صرف ایک اسکور کسی کی مدد نہیں کرتا۔ بحرانی زبان براہ راست فوری مدد کی طرف لے جاتی ہے، کسی بھی نمبر سے پہلے، اکاؤنٹ کے بغیر بھی۔ باقی سب کے لیے ایک معاون منصوبہ اور محدود AI چیٹ ملتی ہے، اور جب ضرورت ہو تو پاکستان بھر کے نفسیاتی ماہرین کی ایک حقیقی ڈائریکٹری بھی۔",
    },
  },
  {
    icon: "speechArrow",
    image: "foggyValley",
    en: {
      title: "Built with context, and honest about its limits",
      body: "Every page, including this one, exists fully in English and Urdu with proper right-to-left layout - not just swapped words. And the limits are stated plainly: the risk score is a weighted heuristic, not a validated clinical probability, and the voice signal comes from a general-purpose speech-emotion model, not a clinically validated biomarker.",
    },
    ur: {
      title: "سیاق کے ساتھ بنایا گیا، اور اپنی حدود کے بارے میں ایماندار",
      body: "ہر صفحہ، بشمول یہ صفحہ، مکمل طور پر انگریزی اور اردو میں موجود ہے، صحیح دائیں سے بائیں خاکے کے ساتھ - صرف الفاظ بدلے نہیں جاتے۔ اور حدود صاف بتائی گئی ہیں: خطرے کا اسکور ایک وزنی تخمینہ ہے، کوئی مصدقہ طبی امکان نہیں، اور صوتی اشارہ ایک عمومی اسپیچ ایموشن ماڈل سے آتا ہے، نہ کہ کوئی طبی طور پر مصدقہ بایومارکر۔",
    },
  },
  {
    icon: "twoPeople",
    image: "sunlitPathway",
    en: {
      title: "Who MindHx is for (and who needs more than this)",
      body: "Built for someone who's noticed something is off and wants to understand it before deciding what to do next - a first look, not a last resort. Not built for an emergency: MindHx detects crisis signals and routes to help immediately, before showing any score. And it's not a substitute for care already in progress.",
    },
    ur: {
      title: "MindHx کس کے لیے ہے (اور کسے اس سے زیادہ کی ضرورت ہے)",
      body: "ایسے شخص کے لیے بنایا گیا جس نے کچھ محسوس کیا ہو کہ ٹھیک نہیں اور فیصلہ کرنے سے پہلے اسے سمجھنا چاہتا ہو - ایک پہلی نظر، آخری سہارا نہیں۔ ہنگامی صورتحال کے لیے نہیں: MindHx بحرانی اشارے پہچان کر، کوئی اسکور دکھانے سے پہلے، فوراً مدد کی طرف لے جاتا ہے۔ اور یہ جاری نگہداشت کا متبادل بھی نہیں۔",
    },
  },
];

const FEATURED_THERAPY_SLUGS = ["cbt", "dbt", "exposure-therapy", "trauma-informed-therapy"];

export default function AboutClient() {
  const [language, setLanguage] = useLanguage();
  const text = copy[language];
  const isUrdu = language === "اردو";
  const [openIndex, setOpenIndex] = useState(0);
  const featuredTherapies = FEATURED_THERAPY_SLUGS.map((slug) => therapies.find((therapy) => therapy.slug === slug)).filter((therapy): therapy is (typeof therapies)[number] => Boolean(therapy));

  return (
    <>
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <DoodleSun className="doodle doodle-orange doodle-float-slow" style={{ top: "95px", right: "5%" }} />
      <DoodleLeaf className="doodle doodle-teal doodle-sway" style={{ top: "55%", left: "2%", width: "26px", height: "auto" }} />
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backLabel={text.back} />
      <section className="resource-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <p>{text.intro}</p>
      </section>
      <section className="about-accordion">
        {ABOUT_SECTIONS.map((item, index) => {
          const content = item[isUrdu ? "ur" : "en"];
          const open = openIndex === index;
          return (
            <article key={content.title} className="about-accordion-item" data-open={open}>
              <button type="button" className="about-accordion-header" aria-expanded={open} onClick={() => setOpenIndex(open ? -1 : index)}>
                <StepIcon icon={item.icon} />
                <h2>{content.title}</h2>
                <span className="about-accordion-chevron" aria-hidden="true">⌄</span>
              </button>
              <div className="about-accordion-panel">
                <div>
                  <div className="about-accordion-body">
                    <p>{content.body}</p>
                    <div className="about-image"><NatureBanner {...naturePhotos[item.image]} sizes="(max-width: 700px) 100vw, 320px" /></div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
      <section className="about-therapies">
        <p className="eyebrow" style={{ textAlign: "center" }}>{text.therapiesEyebrow}</p>
        <h2 style={{ textAlign: "center" }}>{text.therapiesTitle}</h2>
        <p className="about-therapies-intro">{text.therapiesIntro}</p>
        <div className="reference-grid about-therapies-grid">
          {featuredTherapies.map((therapy) => {
            const content = therapy[isUrdu ? "ur" : "en"];
            return (
              <Link key={therapy.slug} href={`/therapies/${therapy.slug}`} className="reference-card-link">
                <article>
                  <StepIcon icon={therapy.stepIcons[0]} />
                  <h2>{content.name}</h2>
                  <p className="reference-card-summary">{content.summary}</p>
                  <footer>{text.therapiesLearnMore} <span className="footer-arrow">→</span></footer>
                </article>
              </Link>
            );
          })}
        </div>
        <Link href="/therapies" className="about-therapies-all">{text.therapiesSeeAll} <span>→</span></Link>
      </section>
      <section className="about-closing">
        <p className="eyebrow">{text.closingEyebrow}</p>
        <h2>{text.closingTitle}</h2>
        <p>{text.closingBody}</p>
        <div className="about-closing-actions">
          <Link href="/" className="result-primary">{text.closingCta}<span>→</span></Link>
          <Link href="/emergency" className="about-closing-emergency">{text.closingEmergency}</Link>
        </div>
      </section>
    </main>
    <SiteFooter language={language} />
    </>
  );
}
