import type { CSSProperties } from "react";
import { StepIcon, type StepIconKey } from "./StepIcons";

const ITEMS: { num: string; icon: StepIconKey; en: { title: string; body: string }; ur: { title: string; body: string } }[] = [
  {
    num: "01",
    icon: "gauge",
    en: { title: "Explainable, not a black box", body: "Every combined score shows exactly how much each signal - voice, words, and questionnaires - contributed, using real per-term attribution, not an approximation." },
    ur: { title: "قابلِ وضاحت، بند ڈبہ نہیں", body: "ہر مجموعی اسکور بالکل دکھاتا ہے کہ ہر اشارے - آواز، الفاظ، اور سوالنامے - کا کتنا حصہ تھا، حقیقی تناسب کے ساتھ، کسی تخمینے سے نہیں۔" },
  },
  {
    num: "02",
    icon: "speechArrow",
    en: { title: "Bilingual by construction", body: "Every page - including this one - exists fully in English and Urdu, with the layout correctly mirroring for right-to-left script, not just swapped words." },
    ur: { title: "بنیادی طور پر دو لسانی", body: "ہر صفحہ - بشمول یہ صفحہ - مکمل طور پر انگریزی اور اردو میں موجود ہے، جس کا خاکہ دائیں سے بائیں رسم الخط کے لیے درست طریقے سے پلٹتا ہے۔" },
  },
  {
    num: "03",
    icon: "shield",
    en: { title: "Safety-gated AI", body: "Crisis language is caught before any score or reply is shown. A server-side guard also discards any generated reply that ignores the requested language." },
    ur: { title: "محفوظ AI", body: "کسی بھی اسکور یا جواب سے پہلے بحرانی زبان پکڑی جاتی ہے۔ ایک سرور سائیڈ گارڈ اس جواب کو بھی مسترد کرتا ہے جو مطلوبہ زبان کو نظرانداز کرے۔" },
  },
  {
    num: "04",
    icon: "staircase",
    en: { title: "Original, illustrated guidance", body: "Every meditation and therapy page includes hand-built, step-by-step icons designed for MindHx - not licensed stock art or generic clip art." },
    ur: { title: "اصل، تصویری رہنمائی", body: "ہر مراقبہ اور تھراپی صفحے میں MindHx کے لیے خاص طور پر بنائے گئے مرحلہ وار آئیکنز شامل ہیں - لائسنس یافتہ یا عام کلپ آرٹ نہیں۔" },
  },
];

export default function InnovationGrid({ isUrdu = false }: { isUrdu?: boolean }) {
  return (
    <section className="innovation-grid-section" dir={isUrdu ? "rtl" : "ltr"}>
      <p className="eyebrow" style={{ textAlign: "center" }}>{isUrdu ? "یہ کیوں مختلف ہے" : "WHAT MAKES THIS DIFFERENT"}</p>
      <h2 style={{ textAlign: "center" }}>{isUrdu ? "محض ایک اور ایپ نہیں" : "Not just another screening app."}</h2>
      <div className="innovation-grid">
        {ITEMS.map((item, index) => {
          const content = item[isUrdu ? "ur" : "en"];
          return (
            <article key={item.num} className="innovation-card" style={{ "--float-delay": `${index * 0.5}s` } as CSSProperties}>
              <div className="innovation-icon-wrap">
                <StepIcon icon={item.icon} />
              </div>
              <span className="innovation-num">{item.num}</span>
              <h3>{content.title}</h3>
              <p>{content.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
