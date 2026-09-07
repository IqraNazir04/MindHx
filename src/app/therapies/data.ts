export type Therapy = {
  slug: string;
  en: { name: string; summary: string; sessionInfo: string; whatToExpect: string[] };
  ur: { name: string; summary: string; sessionInfo: string; whatToExpect: string[] };
  relatedThemes: string[];
};

export const therapies: Therapy[] = [
  {
    slug: "cbt",
    en: {
      name: "CBT",
      summary: "Cognitive behavioral therapy explores patterns between thoughts, feelings, and behavior.",
      sessionInfo: "Sessions often include structured discussion and small between-session exercises.",
      whatToExpect: [
        "An initial assessment of your goals and current difficulties.",
        "Identifying specific thought patterns linked to distress.",
        "Structured exercises, often including between-session practice.",
        "Regular review of progress with your therapist.",
      ],
    },
    ur: {
      name: "سی بی ٹی",
      summary: "کوگنیٹو بیہیویورل تھراپی خیالات، جذبات، اور رویے کے درمیان تعلق کو دیکھتی ہے۔",
      sessionInfo: "سیشنز میں اکثر منظم گفتگو اور سیشنز کے درمیان چھوٹی مشقیں شامل ہوتی ہیں۔",
      whatToExpect: [
        "آپ کے اہداف اور موجودہ مشکلات کا ابتدائی جائزہ۔",
        "تکلیف سے جڑے مخصوص سوچ کے انداز کی نشاندہی۔",
        "منظم مشقیں، اکثر سیشنز کے درمیان مشق کے ساتھ۔",
        "اپنے معالج کے ساتھ پیش رفت کا باقاعدہ جائزہ۔",
      ],
    },
    relatedThemes: ["anxiety", "hardship", "frustration"],
  },
  {
    slug: "dbt",
    en: {
      name: "DBT",
      summary: "Dialectical behavior therapy teaches emotion regulation, distress tolerance, and interpersonal skills.",
      sessionInfo: "It may include skills practice, individual therapy, and structured support.",
      whatToExpect: [
        "Individual therapy sessions focused on your specific challenges.",
        "Skills-group sessions covering distress tolerance and emotion regulation.",
        "Structured homework to practice skills between sessions.",
        "Optional between-session coaching, depending on the provider.",
      ],
    },
    ur: {
      name: "ڈی بی ٹی",
      summary: "ڈائلیکٹیکل بیہیویورل تھراپی جذباتی توازن، تکلیف برداشت کرنے، اور باہمی تعلقات کی مہارتیں سکھاتی ہے۔",
      sessionInfo: "اس میں مہارتوں کی مشق، انفرادی تھراپی، اور منظم مدد شامل ہو سکتی ہے۔",
      whatToExpect: [
        "آپ کے مخصوص مسائل پر مرکوز انفرادی تھراپی سیشنز۔",
        "تکلیف برداشت کرنے اور جذباتی توازن پر مبنی گروپ سیشنز۔",
        "سیشنز کے درمیان مہارتوں کی مشق کے لیے منظم ہوم ورک۔",
        "فراہم کنندہ کے مطابق، سیشنز کے درمیان اختیاری رہنمائی۔",
      ],
    },
    relatedThemes: ["frustration", "trauma", "hardship"],
  },
  {
    slug: "exposure-therapy",
    en: {
      name: "Exposure therapy",
      summary: "A clinician-guided approach for some anxiety and fear responses.",
      sessionInfo: "Exposure is planned gradually with a qualified therapist; it should not be attempted as a self-prescription.",
      whatToExpect: [
        "A collaborative plan built around your specific fears or triggers, ranked from least to most distressing.",
        "Gradual, paced exposure exercises, in session and sometimes between sessions.",
        "Close monitoring of your response and adjustment of pace by the clinician.",
      ],
    },
    ur: {
      name: "ایکسپوژر تھراپی",
      summary: "کچھ اضطراب اور خوف کے ردعمل کے لیے ایک معالج کی رہنمائی میں طریقہ کار۔",
      sessionInfo: "ایکسپوژر کا منصوبہ ایک مستند معالج کے ساتھ آہستہ آہستہ بنایا جاتا ہے؛ اسے خود سے آزمانا نہیں چاہیے۔",
      whatToExpect: [
        "آپ کے مخصوص خوف یا محرکات کے گرد ایک باہمی منصوبہ، کم سے زیادہ تکلیف دہ ترتیب میں۔",
        "سیشن کے دوران اور کبھی کبھار سیشنز کے درمیان بتدریج ایکسپوژر مشقیں۔",
        "معالج کی جانب سے آپ کے ردعمل کی قریبی نگرانی اور رفتار میں تبدیلی۔",
      ],
    },
    relatedThemes: ["anxiety", "trauma"],
  },
  {
    slug: "trauma-informed-therapy",
    en: {
      name: "Trauma-informed therapy",
      summary: "A safety-led approach that respects pacing, choice, and control.",
      sessionInfo: "A clinician determines whether and when trauma-focused work is appropriate.",
      whatToExpect: [
        "An initial focus on stabilization and safety before any trauma-focused work begins.",
        "Collaborative pacing - you and your clinician decide when and how to address specific memories.",
        "Options may include trauma-focused CBT, EMDR, or other approaches depending on training and fit.",
      ],
    },
    ur: {
      name: "صدمے سے آگاہ تھراپی",
      summary: "ایک حفاظت پر مبنی طریقہ جو رفتار، انتخاب، اور اختیار کا احترام کرتا ہے۔",
      sessionInfo: "ایک معالج طے کرتا ہے کہ صدمے پر مرکوز کام کب اور آیا مناسب ہے۔",
      whatToExpect: [
        "کسی بھی صدمے پر مرکوز کام شروع ہونے سے پہلے استحکام اور حفاظت پر ابتدائی توجہ۔",
        "باہمی رفتار - آپ اور آپ کا معالج طے کرتے ہیں کہ مخصوص یادوں کو کب اور کیسے حل کیا جائے۔",
        "تربیت اور موزونیت کے مطابق ٹراما فوکسڈ سی بی ٹی، ای ایم ڈی آر، یا دیگر طریقے شامل ہو سکتے ہیں۔",
      ],
    },
    relatedThemes: ["trauma", "grief", "loss"],
  },
  {
    slug: "medical-review",
    en: {
      name: "Medical review",
      summary: "Primary-care or psychiatric review can consider physical contributors, sleep, medicines, and safety.",
      sessionInfo: "A licensed clinician decides what assessment or treatment is appropriate.",
      whatToExpect: [
        "A review of your symptoms, sleep, medical history, and current medicines.",
        "Possible bloodwork or other tests if a physical contributor is suspected.",
        "A discussion of next steps, which may include therapy, medication, or further specialist referral.",
      ],
    },
    ur: {
      name: "طبی جائزہ",
      summary: "بنیادی نگہداشت یا نفسیاتی جائزہ جسمانی اسباب، نیند، ادویات، اور حفاظت پر غور کر سکتا ہے۔",
      sessionInfo: "ایک مستند معالج طے کرتا ہے کہ کون سا جائزہ یا علاج مناسب ہے۔",
      whatToExpect: [
        "آپ کی علامات، نیند، طبی تاریخ، اور موجودہ ادویات کا جائزہ۔",
        "اگر کسی جسمانی سبب کا شبہ ہو تو ممکنہ خون کے ٹیسٹ یا دیگر جانچ۔",
        "اگلے اقدامات پر گفتگو، جس میں تھراپی، ادویات، یا مزید ماہر کے پاس ریفرل شامل ہو سکتا ہے۔",
      ],
    },
    relatedThemes: ["medical_state", "hardship"],
  },
];

export function getTherapy(slug: string) {
  return therapies.find((therapy) => therapy.slug === slug);
}
