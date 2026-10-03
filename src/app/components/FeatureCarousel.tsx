"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChatSupportGraphic, CommunityGraphic, PracticeGraphic, ShieldGraphic } from "./CarouselGraphics";

type Slide = {
  Graphic: typeof ChatSupportGraphic;
  href: string;
  en: { title: string; body: string; cta: string };
  ur: { title: string; body: string; cta: string };
};

const SLIDES: Slide[] = [
  {
    Graphic: ChatSupportGraphic,
    href: "/ai",
    en: { title: "Talk to MindHx AI", body: "Grounded, safety-gated support for everyday stress, anxiety, and burnout - never a diagnosis, never improvised advice.", cta: "Start a conversation" },
    ur: { title: "MindHx AI سے بات کریں", body: "روزمرہ ذہنی دباؤ، اضطراب، اور تھکن کے لیے محفوظ اور بنیادی مدد - کبھی تشخیص نہیں، کبھی من گھڑت مشورہ نہیں۔", cta: "گفتگو شروع کریں" },
  },
  {
    Graphic: PracticeGraphic,
    href: "/meditation",
    en: { title: "Learn a technique", body: "Step-by-step meditation and therapy guidance with original illustrated instructions you can start right now.", cta: "Browse techniques" },
    ur: { title: "ایک تکنیک سیکھیں", body: "مرحلہ وار مراقبے اور تھراپی کی رہنمائی، اصل تصویری ہدایات کے ساتھ جو آپ ابھی شروع کر سکتے ہیں۔", cta: "تکنیکیں دیکھیں" },
  },
  {
    Graphic: CommunityGraphic,
    href: "/therapist",
    en: { title: "Find real care", body: "A verified, city-by-city directory of psychiatrists and psychologists across Pakistan, when a real conversation is the right next step.", cta: "Search by city" },
    ur: { title: "حقیقی نگہداشت تلاش کریں", body: "پاکستان بھر میں تصدیق شدہ، شہر بہ شہر ماہرینِ نفسیات کی ڈائریکٹری، جب ایک حقیقی گفتگو ہی صحیح اگلا قدم ہو۔", cta: "شہر کے مطابق تلاش کریں" },
  },
  {
    Graphic: ShieldGraphic,
    href: "/emergency",
    en: { title: "Immediate guidance", body: "If you or someone you know may be in danger, this page gets you to real help fast - no score, no delay.", cta: "Open emergency support" },
    ur: { title: "فوری رہنمائی", body: "اگر آپ یا آپ کا جاننے والا خطرے میں ہو سکتا ہے تو یہ صفحہ آپ کو تیزی سے حقیقی مدد تک پہنچاتا ہے - کوئی اسکور نہیں، کوئی تاخیر نہیں۔", cta: "فوری مدد کھولیں" },
  },
];

export default function FeatureCarousel({ isUrdu = false }: { isUrdu?: boolean }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => setActive((current) => (current + 1) % SLIDES.length), 4800);
    return () => clearTimeout(timer);
  }, [active, paused]);

  return (
    <section className="feature-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} dir={isUrdu ? "rtl" : "ltr"}>
      <p className="eyebrow" style={{ textAlign: "center" }}>{isUrdu ? "آگے کیا؟" : "WHAT'S NEXT"}</p>
      <h2 style={{ textAlign: "center" }}>{isUrdu ? "آپ کی ضرورت کے مطابق" : "Whatever you need next, it's here."}</h2>
      <div className="feature-carousel-track">
        {SLIDES.map((slide, index) => {
          const content = slide[isUrdu ? "ur" : "en"];
          const { Graphic } = slide;
          return (
            <article key={slide.href} className={`feature-slide ${index === active ? "feature-slide-active" : ""}`} aria-hidden={index !== active}>
              <Graphic size={84} />
              <h3>{content.title}</h3>
              <p>{content.body}</p>
              <Link href={slide.href} className="feature-slide-cta">{content.cta} →</Link>
            </article>
          );
        })}
      </div>
      <div className="feature-carousel-dots">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.href}
            type="button"
            className={`feature-carousel-dot ${index === active ? "active" : ""}`}
            aria-label={`${isUrdu ? "سلائیڈ" : "Slide"} ${index + 1}`}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
}
