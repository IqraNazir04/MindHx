export type ScaleKey = "phq9" | "gad7" | "k10";
export type Lang = "English" | "اردو";

// Covers every band word used across all three scales plus the overall risk
// band, so one lookup serves PHQ-9/GAD-7/K10 severity bands, the top-level
// risk band (low/watch/elevated/crisis), and the "not available"/"not
// answered" fallbacks - wherever a raw band string would otherwise be shown
// to the user untranslated.
const BAND_WORDS: Record<string, { en: string; ur: string }> = {
  minimal: { en: "Minimal", ur: "کم از کم" },
  low: { en: "Low", ur: "کم" },
  mild: { en: "Mild", ur: "ہلکا" },
  moderate: { en: "Moderate", ur: "درمیانہ" },
  moderately_severe: { en: "Moderately severe", ur: "درمیانی سے شدید" },
  severe: { en: "Severe", ur: "شدید" },
  watch: { en: "Watch", ur: "نگرانی" },
  elevated: { en: "Elevated", ur: "بلند" },
  crisis: { en: "Crisis", ur: "بحران" },
  not_answered: { en: "Not answered", ur: "جواب نہیں دیا گیا" },
  "not available": { en: "Not available", ur: "دستیاب نہیں" },
};

export function bandLabel(band: string | undefined | null, lang: Lang = "English"): string {
  if (!band) return "";
  const entry = BAND_WORDS[band];
  if (entry) return lang === "اردو" ? entry.ur : entry.en;
  return band.replaceAll("_", " ");
}

const THEME_WORDS: Record<string, { en: string; ur: string }> = {
  anxiety: { en: "Anxiety", ur: "بے چینی" },
  depression: { en: "Depression", ur: "ذہنی دباؤ" },
  therapy: { en: "Therapy", ur: "تھراپی" },
  medication: { en: "Medication", ur: "ادویات" },
  family_stigma: { en: "Family & stigma", ur: "خاندان اور بدنامی" },
  exam_pressure: { en: "Exam pressure", ur: "امتحان کا دباؤ" },
  safety: { en: "Safety", ur: "حفاظت" },
  stress: { en: "Stress", ur: "تناؤ" },
  meditation: { en: "Meditation", ur: "مراقبہ" },
  grief: { en: "Grief", ur: "غم" },
  pain: { en: "Pain", ur: "درد" },
  conditions: { en: "Conditions", ur: "کیفیات" },
};

export function themeLabel(theme: string, lang: Lang = "English"): string {
  const entry = THEME_WORDS[theme];
  if (entry) return lang === "اردو" ? entry.ur : entry.en;
  return theme.replaceAll("_", " ");
}

const SCALE_EXPLANATIONS: Record<ScaleKey, Record<string, { en: string; ur: string }>> = {
  phq9: {
    minimal: { en: "Little or no depressive symptoms over the last two weeks.", ur: "پچھلے دو ہفتوں میں ذہنی دباؤ کی علامات بہت کم یا نہیں۔" },
    mild: { en: "Mild symptoms. Self-care and keeping track of your mood often help; worth watching.", ur: "ہلکی علامات۔ خود خیالی اور اپنے موڈ پر نظر رکھنا اکثر مددگار ہوتا ہے؛ اس پر نظر رکھیں۔" },
    moderate: { en: "Moderate symptoms. A professional evaluation is recommended, and talking therapies are well supported for this range.", ur: "درمیانی علامات۔ ماہر سے جائزہ لینے کی سفارش کی جاتی ہے، اور اس سطح کے لیے گفتگو پر مبنی تھراپی کارآمد ثابت ہوتی ہے۔" },
    moderately_severe: { en: "Moderately severe symptoms. Please arrange a professional evaluation soon.", ur: "درمیانی سے شدید علامات۔ براہ کرم جلد ماہر سے جائزہ کروائیں۔" },
    severe: { en: "Severe symptoms. Please contact a clinician promptly, and use emergency support now if you feel unsafe.", ur: "شدید علامات۔ براہ کرم فوری طور پر معالج سے رابطہ کریں، اور اگر خود کو غیر محفوظ محسوس کریں تو ابھی فوری مدد حاصل کریں۔" },
  },
  gad7: {
    minimal: { en: "Minimal anxiety symptoms.", ur: "بے چینی کی علامات بہت کم۔" },
    mild: { en: "Mild anxiety. Breathing and grounding practices can help day to day.", ur: "ہلکی بے چینی۔ سانس اور گراؤنڈنگ کی مشقیں روزمرہ میں مددگار ہو سکتی ہیں۔" },
    moderate: { en: "Moderate anxiety. A professional evaluation is advisable; CBT and exposure-based therapy have good evidence for this range.", ur: "درمیانی بے چینی۔ ماہر سے جائزہ لینا مناسب ہے؛ اس سطح کے لیے CBT اور ایکسپوژر بیسڈ تھراپی مؤثر ثابت ہوئی ہیں۔" },
    severe: { en: "Severe anxiety. Please arrange a professional evaluation soon.", ur: "شدید بے چینی۔ براہ کرم جلد ماہر سے جائزہ کروائیں۔" },
  },
  k10: {
    low: { en: "Low psychological distress.", ur: "ذہنی تناؤ کم ہے۔" },
    mild: { en: "Mild psychological distress. Self-support and monitoring are reasonable for now.", ur: "ہلکا ذہنی تناؤ۔ فی الحال خود مدد اور نگرانی مناسب ہے۔" },
    moderate: { en: "Moderate psychological distress. A professional evaluation is advisable.", ur: "درمیانہ ذہنی تناؤ۔ ماہر سے جائزہ لینا مناسب ہے۔" },
    severe: { en: "Severe psychological distress. Please seek professional help promptly.", ur: "شدید ذہنی تناؤ۔ براہ کرم فوری طور پر ماہر سے مدد لیں۔" },
  },
};

export function scaleExplanation(scale: ScaleKey, band: string | undefined, lang: Lang = "English"): string {
  const ur = lang === "اردو";
  if (!band) return ur ? "اس پیمانے کے لیے کوئی بینڈ دستیاب نہیں۔" : "No band available for this measure.";
  if (band === "not_answered") return ur ? "یہ سوالنامہ مکمل نہیں کیا گیا، اس لیے یہ مجموعی اسکور کا حصہ نہیں ہے۔" : "This questionnaire wasn't finished, so it isn't part of the combined score.";
  const entry = SCALE_EXPLANATIONS[scale][band];
  if (!entry) return ur ? "اس پیمانے کی حد کے مقابلے میں اسکور دیکھیں۔" : "See the score against the range for this measure.";
  return ur ? entry.ur : entry.en;
}

// "12 / 21", or "Not answered" for a questionnaire that wasn't finished.
export function scoreText(score: number | null | undefined, max: number, lang: Lang = "English"): string {
  if (score === null || score === undefined) return lang === "اردو" ? "جواب نہیں دیا گیا" : "Not answered";
  return `${score} / ${max}`;
}

// What the routing decision means, in place of the raw value ("refer").
export const ROUTING_LABELS: Record<string, { en: string; ur: string }> = {
  refer_immediately: { en: "Get support now", ur: "ابھی مدد حاصل کریں" },
  refer: { en: "Professional evaluation advised", ur: "ماہر سے جائزہ تجویز کیا گیا" },
  no_referral_needed: { en: "No referral needed right now", ur: "فی الحال کسی ریفرل کی ضرورت نہیں" },
};

export function routingLabel(decision: string, lang: Lang = "English"): string {
  const entry = ROUTING_LABELS[decision];
  if (entry) return lang === "اردو" ? entry.ur : entry.en;
  return decision.replaceAll("_", " ");
}

export type Recommendation = {
  level: "emergency" | "professional" | "self";
  headline: string;
  body: string;
  primary: { label: string; href: string };
  therapies: { label: string; href: string; note: string }[];
  alsoHelpful: { label: string; href: string }[];
};

type RecommendationInput = {
  band: string;
  crisis_flag?: boolean;
  routing_decision: string;
  support_plan?: { route?: string };
};

const THERAPY_OPTIONS = {
  cbt: {
    en: { label: "Cognitive behavioural therapy (CBT)", href: "/therapies/cbt", note: "Structured work on the thought and behaviour patterns that keep low mood and worry going." },
    ur: { label: "کوگنیٹو بیہیویورل تھراپی (CBT)", href: "/therapies/cbt", note: "ان خیالات اور رویوں پر منظم کام جو ذہنی دباؤ اور فکر کو جاری رکھتے ہیں۔" },
  },
  dbt: {
    en: { label: "Dialectical behaviour therapy (DBT)", href: "/therapies/dbt", note: "Skills for handling strong emotions, stress, and relationships." },
    ur: { label: "ڈائلیکٹیکل بیہیویورل تھراپی (DBT)", href: "/therapies/dbt", note: "شدید جذبات، تناؤ، اور تعلقات سنبھالنے کی مہارتیں۔" },
  },
  exposure: {
    en: { label: "Exposure-based therapy", href: "/therapies/exposure-therapy", note: "A clinician-guided approach for anxiety and fear responses." },
    ur: { label: "ایکسپوژر بیسڈ تھراپی", href: "/therapies/exposure-therapy", note: "بے چینی اور خوف کے ردعمل کے لیے معالج کی رہنمائی میں ایک طریقہ۔" },
  },
};

function therapyOption(key: keyof typeof THERAPY_OPTIONS, lang: Lang) {
  return lang === "اردو" ? THERAPY_OPTIONS[key].ur : THERAPY_OPTIONS[key].en;
}

export function buildRecommendation(result: RecommendationInput, lang: Lang = "English"): Recommendation {
  const ur = lang === "اردو";
  const route = result.support_plan?.route;
  const crisis = Boolean(result.crisis_flag) || result.band === "crisis" || route === "crisis";
  if (crisis) {
    return {
      level: "emergency",
      headline: ur ? "ابھی فوری مدد حاصل کریں" : "Get emergency support now",
      body: ur
        ? "آپ کے جائزے سے ظاہر ہوتا ہے کہ آپ بحرانی کیفیت میں ہو سکتے ہیں۔ ابھی مقامی ہنگامی خدمات یا کرائسس لائن سے رابطہ کریں، اور اگر ممکن ہو تو کسی قابلِ اعتماد شخص کے ساتھ رہیں۔"
        : "Your check-in suggests you may be in crisis. Contact local emergency services or a crisis line now, and stay with someone you trust if you can.",
      primary: { label: ur ? "فوری مدد کھولیں" : "Open emergency support", href: "/emergency" },
      therapies: [],
      alsoHelpful: [{ label: ur ? "معالج سے بات کریں" : "Talk to a therapist", href: "/therapist" }],
    };
  }

  const professional = route === "psychiatric_referral" || result.routing_decision === "refer" || result.band === "elevated";
  if (professional) {
    return {
      level: "professional",
      headline: ur ? "ماہر سے جائزہ کروائیں" : "Arrange a professional evaluation",
      body: ur
        ? "مجموعی تصویر ماہر سے جائزے کی طرف اشارہ کرتی ہے۔ تھراپی ایک مضبوط آپشن ہے، طبی جائزے کے ساتھ یا اس سے پہلے؛ نیچے دیے گئے طریقے بات چیت شروع کرنے کے لیے اچھی جگہ ہیں۔"
        : "The combined picture points toward a professional evaluation. Therapy is a strong option alongside (or before) any medical review; the approaches below are a good place to start the conversation.",
      primary: { label: ur ? "معالج تلاش کریں" : "Find a therapist", href: "/therapist" },
      therapies: [therapyOption("cbt", lang), therapyOption("dbt", lang), therapyOption("exposure", lang)],
      alsoHelpful: [
        { label: ur ? "حالات بگڑیں تو فوری مدد" : "Emergency support if things get worse", href: "/emergency" },
        { label: ur ? "گراؤنڈنگ مشق کریں" : "Practice a grounding exercise", href: "/meditation/grounding-5-4-3-2-1" },
      ],
    };
  }

  return {
    level: "self",
    headline: ur ? "نرم خود مدد" : "Gentle self-support",
    body: ur
      ? "یہاں کچھ بھی فوری خطرے کی طرف اشارہ نہیں کرتا۔ چھوٹی، مستقل مشقیں اور اپنی کیفیت پر نظر رکھنا عام طور پر سب سے زیادہ فرق ڈالتا ہے؛ کچھ بدلے تو دوبارہ چیک ان کریں۔"
      : "Nothing here points to urgent risk. Small, steady practices and keeping an eye on how you feel usually make the biggest difference; come back to a check-in if things change.",
    primary: { label: ur ? "سانس کی مشق آزمائیں" : "Try a breathing practice", href: "/meditation/box-breathing" },
    therapies: [therapyOption("cbt", lang)],
    alsoHelpful: [
      { label: ur ? "تھراپی کے طریقے دیکھیں" : "Explore therapy approaches", href: "/therapies" },
      { label: ur ? "ضرورت ہو تو فوری مدد" : "Emergency support if you need it", href: "/emergency" },
    ],
  };
}

export type StageResult = {
  number: 1 | 2 | 3 | 4 | 5;
  label: string;
  stageTitle: string;
  summary: string;
  recommendations: string[];
  primary: { label: string; href: string };
  showEmergencyButton: boolean;
  therapies: { label: string; href: string; note: string }[];
  meditations: { label: string; href: string; note: string }[];
};

const MEDITATION_OPTIONS = {
  box: {
    en: { label: "Box breathing", href: "/meditation/box-breathing", note: "A four-count breathing pattern that steadies the body when stress rises." },
    ur: { label: "باکس بریتھنگ", href: "/meditation/box-breathing", note: "چار گنتی کا سانس کا طریقہ جو تناؤ بڑھنے پر جسم کو مستحکم کرتا ہے۔" },
  },
  grounding: {
    en: { label: "Grounding 5-4-3-2-1", href: "/meditation/grounding-5-4-3-2-1", note: "Notice five things you see, four you feel, three you hear, two you smell, one you taste." },
    ur: { label: "گراؤنڈنگ 5-4-3-2-1", href: "/meditation/grounding-5-4-3-2-1", note: "پانچ چیزیں جو آپ دیکھتے ہیں، چار جو محسوس کرتے ہیں، تین جو سنتے ہیں، دو جن کی خوشبو آتی ہے، ایک جس کا ذائقہ محسوس ہو۔" },
  },
  bodyScan: {
    en: { label: "Body scan", href: "/meditation/body-scan", note: "A slow pass through the body that releases tension you may not have noticed." },
    ur: { label: "باڈی اسکین", href: "/meditation/body-scan", note: "جسم کا آہستہ جائزہ جو اس تناؤ کو کم کرتا ہے جس کا آپ کو شاید احساس بھی نہ ہو۔" },
  },
};

function meditationOption(key: keyof typeof MEDITATION_OPTIONS, lang: Lang) {
  return lang === "اردو" ? MEDITATION_OPTIONS[key].ur : MEDITATION_OPTIONS[key].en;
}

const BAND_SEVERITY: Record<string, number> = {
  minimal: 1, low: 1, mild: 2, moderate: 3, moderately_severe: 4, severe: 4,
};

const STAGE_LABELS: Record<1 | 2 | 3 | 4 | 5, { en: string; ur: string; enTitle: string; urTitle: string }> = {
  5: { en: "Stage 5 · Crisis", ur: "مرحلہ 5 · بحران", enTitle: "Crisis", urTitle: "بحران" },
  4: { en: "Stage 4 · Moderately severe to severe", ur: "مرحلہ 4 · درمیانی سے شدید", enTitle: "Moderately severe to severe", urTitle: "درمیانی سے شدید" },
  3: { en: "Stage 3 · Moderate", ur: "مرحلہ 3 · درمیانہ", enTitle: "Moderate", urTitle: "درمیانہ" },
  2: { en: "Stage 2 · Mild", ur: "مرحلہ 2 · ہلکا", enTitle: "Mild", urTitle: "ہلکا" },
  1: { en: "Stage 1 · Minimal", ur: "مرحلہ 1 · کم از کم", enTitle: "Minimal", urTitle: "کم از کم" },
};

// The stage is the worst band across the three questionnaires, overridden to
// crisis whenever a crisis signal was detected.
export function stageFor(result: RecommendationInput & { components?: { phq9: { band: string }; gad7: { band: string }; k10: { band: string } } }, lang: Lang = "English"): StageResult {
  const ur = lang === "اردو";
  const crisis = Boolean(result.crisis_flag) || result.band === "crisis" || result.support_plan?.route === "crisis";
  const bands = [result.components?.phq9.band, result.components?.gad7.band, result.components?.k10.band];
  const worst = Math.max(1, ...bands.map((band) => (band ? BAND_SEVERITY[band] ?? 1 : 1)));
  const number = crisis ? 5 : (worst as 1 | 2 | 3 | 4);
  const labels = STAGE_LABELS[number];
  const label = ur ? labels.ur : labels.en;
  const stageTitle = ur ? labels.urTitle : labels.enTitle;

  if (number === 5) {
    return {
      number, label, stageTitle,
      summary: ur ? "ایک بحرانی اشارہ ملا ہے۔ براہ کرم کسی بھی چیز سے پہلے ابھی فوری مدد حاصل کریں۔" : "A crisis signal was detected. Please reach out for emergency help now, before anything else.",
      recommendations: ur
        ? ["ابھی مقامی ہنگامی خدمات یا کرائسس لائن سے رابطہ کریں۔", "اگر ممکن ہو تو کسی قابلِ اعتماد شخص کے ساتھ رہیں، یا محفوظ جگہ پر چلے جائیں۔", "اپنے آپ کو نقصان پہنچانے کی کوئی بھی چیز ہٹا دیں یا دور رکھیں۔"]
        : ["Contact local emergency services or a crisis line now.", "Stay with someone you trust, or move to a safe place, if you can.", "Remove or put away anything you could use to hurt yourself."],
      primary: { label: ur ? "فوری مدد کی طرف جائیں" : "Go to emergency support", href: "/emergency" },
      showEmergencyButton: true,
      therapies: [],
      meditations: [meditationOption("box", lang)],
    };
  }
  if (number === 4) {
    return {
      number, label, stageTitle,
      summary: ur
        ? "آپ کے جوابات درمیانی سے شدید علامات کی طرف اشارہ کرتے ہیں۔ ماہر سے جائزہ جلد ہونا چاہیے، اور حالات بگڑیں تو فوری مدد دستیاب ہے۔"
        : "Your answers point to moderately severe or severe symptoms. A professional evaluation should happen soon, and urgent help is available if things get worse.",
      recommendations: ur
        ? ["جتنی جلدی ممکن ہو لائسنس یافتہ ماہرِ نفسیات یا معالج سے اپائنٹمنٹ لیں۔", "طبی جائزے کے ساتھ گفتگو پر مبنی تھراپی شروع کریں۔", "اگر آپ کی حفاظت متاثر ہو یا آپ سنبھال نہ سکیں تو فوراً فوری مدد حاصل کریں۔"]
        : ["Book an appointment with a licensed psychiatrist or clinician as soon as you can.", "Start a talking therapy alongside any medical review.", "If your safety changes or you feel unable to cope, use emergency support right away."],
      primary: { label: ur ? "معالج تلاش کریں" : "Find a therapist", href: "/therapist" },
      showEmergencyButton: true,
      therapies: [therapyOption("cbt", lang), therapyOption("dbt", lang), therapyOption("exposure", lang)],
      meditations: [meditationOption("grounding", lang), meditationOption("box", lang)],
    };
  }
  if (number === 3) {
    return {
      number, label, stageTitle,
      summary: ur
        ? "آپ کے جوابات درمیانی علامات کی طرف اشارہ کرتے ہیں۔ ماہر سے جائزے کی سفارش کی جاتی ہے، اور اس سطح کے لیے گفتگو پر مبنی تھراپی کارآمد ثابت ہوتی ہے۔"
        : "Your answers point to moderate symptoms. A professional evaluation is recommended, and talking therapies are well supported at this level.",
      recommendations: ur
        ? ["اگلے چند ہفتوں میں ماہر سے جائزہ کروائیں۔", "CBT یا DBT جیسی منظم تھراپی شروع کریں۔", "روزانہ موڈ کا نوٹ رکھیں اور اسے اپنی اپائنٹمنٹ پر لے جائیں۔"]
        : ["Arrange a professional evaluation in the next few weeks.", "Begin structured therapy such as CBT or DBT.", "Keep a daily mood note and bring it to your appointment."],
      primary: { label: ur ? "معالج تلاش کریں" : "Find a therapist", href: "/therapist" },
      showEmergencyButton: false,
      therapies: [therapyOption("cbt", lang), therapyOption("dbt", lang), therapyOption("exposure", lang)],
      meditations: [meditationOption("box", lang), meditationOption("bodyScan", lang)],
    };
  }
  if (number === 2) {
    return {
      number, label, stageTitle,
      summary: ur
        ? "آپ کے جوابات ہلکی علامات کی طرف اشارہ کرتے ہیں۔ اس مرحلے پر خود خیالی، تھراپی کی مہارتیں، اور باقاعدہ مشق اکثر بہت مددگار ہوتی ہیں۔"
        : "Your answers point to mild symptoms. Self-care, therapy skills, and regular practice often help a lot at this stage.",
      recommendations: ur
        ? ["روزانہ گراؤنڈنگ یا سانس کی مشق کریں۔", "CBT کی بنیادی باتیں سیکھیں اور خیالات اور موڈ کے تعلق کو محسوس کریں۔", "چند ہفتوں بعد دوبارہ چیک ان کریں تاکہ دیکھ سکیں کہ چیزیں کیسے بدل رہی ہیں۔"]
        : ["Practise a daily grounding or breathing exercise.", "Learn the basics of CBT and notice the link between thoughts and mood.", "Re-check in after a few weeks to see how things are changing."],
      primary: { label: ur ? "سانس کی مشق آزمائیں" : "Try a breathing practice", href: "/meditation/box-breathing" },
      showEmergencyButton: false,
      therapies: [therapyOption("cbt", lang), therapyOption("dbt", lang)],
      meditations: [meditationOption("box", lang), meditationOption("grounding", lang), meditationOption("bodyScan", lang)],
    };
  }
  return {
    number: 1, label, stageTitle,
    summary: ur
      ? "آپ کے جوابات سے ظاہر ہوتا ہے کہ فی الحال علامات بہت کم یا نہیں ہیں۔ اچھی عادات برقرار رکھنا، کبھی کبھار مشق کے ساتھ، سب سے اہم چیز ہے۔"
      : "Your answers show little or no symptoms right now. Keeping up good habits, with occasional practice, is the main thing.",
    recommendations: ur
      ? ["باقاعدہ نیند، حرکت، اور قابلِ اعتماد لوگوں کے ساتھ وقت برقرار رکھیں۔", "جب تناؤ بڑھتا محسوس ہو تو مختصر مراقبہ کریں۔", "اگر کچھ بدلے تو دوبارہ چیک ان کے لیے آئیں۔"]
      : ["Keep up regular sleep, movement, and time with people you trust.", "Use a short meditation when you notice stress building.", "Come back to a check-in if anything changes."],
    primary: { label: ur ? "مراقبہ دیکھیں" : "Explore meditation", href: "/meditation" },
    showEmergencyButton: false,
    therapies: [therapyOption("cbt", lang)],
    meditations: [meditationOption("box", lang), meditationOption("bodyScan", lang)],
  };
}
