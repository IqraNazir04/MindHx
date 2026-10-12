// Shared crisis/emergency copy - used by both the standalone /emergency
// page (reached directly from nav, or when crisis language is flagged
// before a full check-in exists to show) and the crisis banner embedded in
// /results (reached when a completed check-in itself triggers the crisis
// signal, so the full results and PDF are still shown alongside this).
// Kept in one place so this safety-critical wording can't drift between
// the two surfaces.
export type CrisisLanguage = "en" | "ur";

export type CrisisContext = {
  source: "phq9_item9" | "text_crisis_language" | "manual";
  language: CrisisLanguage;
};

// Pakistan's national emergency numbers, shown as tap-to-call links. These
// are general emergency services, not a mental-health helpline.
export const emergencyNumbers: { number: string; en: string; ur: string }[] = [
  { number: "1122", en: "Rescue 1122 - ambulance & emergency", ur: "ریسکیو 1122 - ایمبولینس اور ہنگامی مدد" },
  { number: "115", en: "Edhi ambulance", ur: "ایدھی ایمبولینس" },
  { number: "15", en: "Police", ur: "پولیس" },
];

// Dedicated mental-health helplines in Pakistan, verified against each
// organization's own published details - last verified 2026-10-07, re-verify
// quarterly (numbers and hours do change). Pakistan has no round-the-clock
// dedicated mental-health crisis line, so outside these hours the general
// emergency numbers above or the nearest hospital emergency department are
// the route; see findHelpBody.
// Sources: Taskeen Health Initiative (taskeen.org); Sehat Tahaffuz 1166
// (Humraaz service, federal toll-free health helpline); Rozan Counseling
// Helpline (rozan.org); Sindh Mental Health Authority; Punjab Safe Cities
// Authority press-release on Helpline-15 mental health counselling (Apr 2026).
export const mentalHealthHelplines: { number: string; tel: string; en: string; ur: string }[] = [
  {
    number: "+92 316 827 5336",
    tel: "+923168275336",
    en: "Taskeen Health Initiative - free support from trained mental health professionals, Mon-Sat 11 AM-11 PM",
    ur: "تسکین ہیلتھ انیشیٹو - تربیت یافتہ ماہرینِ ذہنی صحت کی مفت معاونت، پیر تا ہفتہ صبح 11 تا رات 11 بجے",
  },
  {
    number: "1166",
    tel: "1166",
    en: "Sehat Tahaffuz (Humraaz) - toll-free federal health helpline, connects to counsellors and hospitals",
    ur: "صحت تحفظ (ہمراز) - ٹول فری وفاقی ہیلتھ ہیلپ لائن، مشیروں اور ہسپتالوں سے رابطہ کرواتی ہے",
  },
  {
    number: "0800-22-444",
    tel: "080022444",
    en: "Rozan Counseling Helpline - emotional health, abuse & violence support, Mon-Fri 9:30 AM-5 PM",
    ur: "روزن کاؤنسلنگ ہیلپ لائن - جذباتی صحت، تشدد اور زیادتی سے متعلق معاونت، پیر تا جمعہ صبح 9:30 تا شام 5 بجے",
  },
  {
    number: "15 (press 7)",
    tel: "15,7",
    en: "Police helpline - press 7 for a free psychologist (Punjab Safe Cities Authority)",
    ur: "پولیس ہیلپ لائن - مفت ماہرِ نفسیات کے لیے 7 دبائیں (پنجاب سیف سٹیز اتھارٹی)",
  },
  {
    number: "021 111 117 642",
    tel: "021111117642",
    en: "Sindh Mental Health Authority - Karachi (JPMC); also Hyderabad on 022 111 117 642",
    ur: "سندھ مینٹل ہیلتھ اتھارٹی - کراچی (جے پی ایم سی)؛ حیدرآباد کے لیے 022 111 117 642",
  },
];

export const crisisCopy: Record<CrisisLanguage, {
  callNow: string;
  eyebrow: string;
  title: string;
  lede: string;
  // For someone who opened this page themselves, not from a flagged check-in.
  ledeDirect: string;
  stepsTitle: string;
  steps: string[];
  notDiagnosis: string;
  helplinesTitle: string;
  helplinesNote: string;
  findHelp: string;
  findHelpBody: string;
  talkTherapist: string;
  fullResultsNote: string;
}> = {
  en: {
    callNow: "Call now (Pakistan)",
    eyebrow: "IMMEDIATE SUPPORT",
    title: "You do not have to handle this alone.",
    lede: "MindHx detected a safety signal in your check-in. This is not a diagnosis — it is the fastest route to a person who can help right now.",
    ledeDirect: "If you are struggling or feel unsafe right now, you don't have to wait. Call one of the numbers below, or reach out to someone you trust.",
    stepsTitle: "Right now",
    steps: [
      "If you are in immediate danger, call one of the emergency numbers below now (outside Pakistan, your local emergency number).",
      "Call one of the mental health helplines below, or reach out to someone you trust - a friend, family member, or your doctor - and stay with them, in person or on a call.",
      "Remove access to anything you could use to harm yourself, if you can.",
      "If symptoms ease, still bring this check-in to a licensed professional for a full evaluation.",
    ],
    notDiagnosis: "This is a risk-tier signal, not a diagnosis. Only a qualified professional can assess and treat what you are experiencing.",
    helplinesTitle: "Mental health helplines (Pakistan)",
    helplinesNote: "Pakistan doesn't yet have a round-the-clock mental health crisis line. Outside these hours, use the emergency numbers above or go to the nearest hospital emergency department.",
    findHelp: "Find help",
    findHelpBody: "Search for a local crisis line, emergency service, or hospital emergency department in your country. If you already have a therapist, psychiatrist, or doctor, contact them directly.",
    talkTherapist: "Talk to a professional",
    fullResultsNote: "Your full results and PDF are available below - bring them to whoever you reach out to.",
  },
  ur: {
    callNow: "ابھی کال کریں (پاکستان)",
    eyebrow: "فوری مدد",
    title: "آپ کو یہ اکیلے نہیں سنبھالنا۔",
    lede: "MindHx نے آپ کے جائزے میں ایک حفاظتی اشارہ محسوس کیا ہے۔ یہ تشخیص نہیں ہے — یہ ابھی کسی مددگار شخص تک پہنچنے کا تیز ترین راستہ ہے۔",
    ledeDirect: "اگر آپ اس وقت مشکل میں ہیں یا خود کو غیر محفوظ محسوس کر رہے ہیں تو انتظار نہ کریں۔ نیچے دیے گئے کسی نمبر پر کال کریں، یا کسی قابلِ اعتماد شخص سے رابطہ کریں۔",
    stepsTitle: "ابھی کریں",
    steps: [
      "اگر آپ فوری خطرے میں ہیں تو ابھی نیچے دیے گئے کسی ہنگامی نمبر پر کال کریں (پاکستان سے باہر ہوں تو اپنے مقامی ہنگامی نمبر پر)۔",
      "نیچے دی گئی کسی ذہنی صحت ہیلپ لائن پر کال کریں، یا کسی قابلِ اعتماد شخص - دوست، گھر کے فرد، یا اپنے ڈاکٹر - سے رابطہ کریں اور ان کے ساتھ رہیں، ذاتی طور پر یا کال پر۔",
      "اگر ممکن ہو تو خود کو نقصان پہنچانے کی کسی بھی چیز تک رسائی ختم کریں۔",
      "علامات کم ہونے پر بھی، اس جائزے کو مکمل تشخیص کے لیے کسی مستند ماہر کے پاس ضرور لے جائیں۔",
    ],
    notDiagnosis: "یہ ایک خطرے کی سطح کا اشارہ ہے، تشخیص نہیں۔ آپ کی کیفیت کا جائزہ اور علاج صرف ایک مستند ماہر ہی کر سکتا ہے۔",
    helplinesTitle: "ذہنی صحت کی ہیلپ لائنز (پاکستان)",
    helplinesNote: "پاکستان میں ابھی چوبیس گھنٹے کام کرنے والی ذہنی صحت کی بحرانی ہیلپ لائن موجود نہیں۔ ان اوقات کے علاوہ، اوپر دیے گئے ہنگامی نمبروں پر کال کریں یا قریبی ہسپتال کے ایمرجنسی شعبے میں جائیں۔",
    findHelp: "مدد تلاش کریں",
    findHelpBody: "اپنے ملک میں کسی مقامی بحرانی ہیلپ لائن، ہنگامی سروس، یا ہسپتال کے ایمرجنسی شعبے کو تلاش کریں۔ اگر آپ کا پہلے سے کوئی معالج، ماہرِ نفسیات، یا ڈاکٹر ہے تو براہِ راست ان سے رابطہ کریں۔",
    talkTherapist: "کسی ماہر سے بات کریں",
    fullResultsNote: "آپ کے مکمل نتائج اور PDF نیچے دستیاب ہیں - انہیں اپنے ساتھ لے جائیں جس سے بھی آپ رابطہ کریں۔",
  },
};
