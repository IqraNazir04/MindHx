import type { naturePhotos } from "../components/naturePhotos";
import type { StepIconKey } from "../components/StepIcons";

export type Medication = {
  slug: string;
  image: keyof typeof naturePhotos;
  stepIcons: StepIconKey[];
  en: { name: string; use: string; usageNotes: string[]; warnings: string[] };
  ur: { name: string; use: string; usageNotes: string[]; warnings: string[] };
  relatedThemes: string[];
};

export const medications: Medication[] = [
  {
    slug: "ssris",
    image: "balancedStones",
    stepIcons: ["clipboard", "chartUp", "repeatCycle"],
    en: {
      name: "SSRIs (Selective Serotonin Reuptake Inhibitors)",
      use: "Commonly prescribed for depression and several anxiety disorders, including OCD and panic disorder.",
      usageNotes: [
        "Usually taken once daily, at a dose a prescriber sets and reviews over time.",
        "Often takes 2 to 6 weeks of regular use before mood or anxiety benefits become noticeable.",
        "Regular follow-up appointments help track response and any side effects.",
      ],
      warnings: [
        "Common early side effects include nausea, headache, and sleep changes, which often ease after the first couple of weeks.",
        "Stopping suddenly can cause withdrawal-like symptoms; any change in dose should be guided by a prescriber.",
        "Can interact with other medicines, supplements, and alcohol - share a full list with the prescriber.",
        "Report any new or worsening suicidal thoughts to a professional promptly, especially in the first weeks of treatment or after a dose change.",
      ],
    },
    ur: {
      name: "ایس ایس آر آئیز (سلیکٹیو سیروٹونن ری اپٹیک انہیبیٹرز)",
      use: "عام طور پر ڈپریشن اور کئی اضطرابی امراض بشمول او سی ڈی اور پینک ڈس آرڈر کے لیے تجویز کی جاتی ہیں۔",
      usageNotes: [
        "عام طور پر دن میں ایک بار لی جاتی ہیں، خوراک ایک تجویز کنندہ طے کرتا اور وقتاً فوقتاً جائزہ لیتا ہے۔",
        "موڈ یا اضطراب میں بہتری محسوس ہونے میں اکثر 2 سے 6 ہفتے لگ سکتے ہیں۔",
        "باقاعدہ فالو اپ اپائنٹمنٹس ردعمل اور کسی بھی مضر اثرات کو ٹریک کرنے میں مدد دیتی ہیں۔",
      ],
      warnings: [
        "ابتدائی عام اثرات میں متلی، سر درد، اور نیند میں تبدیلی شامل ہیں، جو اکثر پہلے دو ہفتوں کے بعد کم ہو جاتے ہیں۔",
        "اچانک روکنے سے دستبرداری جیسی علامات ہو سکتی ہیں؛ خوراک میں کوئی بھی تبدیلی تجویز کنندہ کی رہنمائی میں ہونی چاہیے۔",
        "دیگر ادویات، سپلیمنٹس، اور الکحل کے ساتھ تعامل ہو سکتا ہے - تجویز کنندہ کو اپنی مکمل فہرست بتائیں۔",
        "خاص طور پر علاج کے پہلے ہفتوں میں یا خوراک کی تبدیلی کے بعد، کسی بھی نئے یا بڑھتے ہوئے خودکشی کے خیالات کو فوری طور پر ایک ماہر کو بتائیں۔",
      ],
    },
    relatedThemes: ["hardship", "anxiety"],
  },
  {
    slug: "snris",
    image: "steppingStones",
    stepIcons: ["clipboard", "chartUp", "gauge"],
    en: {
      name: "SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors)",
      use: "Used for depression and some anxiety disorders, and sometimes for certain chronic pain conditions.",
      usageNotes: [
        "Typically taken once or twice daily as directed by a prescriber.",
        "Benefits for mood or anxiety often build gradually over several weeks.",
        "Blood pressure may be checked periodically during treatment.",
      ],
      warnings: [
        "Can raise blood pressure in some people, so monitoring matters.",
        "Stopping abruptly can cause withdrawal-like symptoms; tapering is usually guided by a prescriber.",
        "May interact with other medicines affecting serotonin; always share your full medicine list.",
        "Report any new or worsening suicidal thoughts to a professional promptly, especially early in treatment.",
      ],
    },
    ur: {
      name: "ایس این آر آئیز (سیروٹونن-نوریپینفرین ری اپٹیک انہیبیٹرز)",
      use: "ڈپریشن اور کچھ اضطرابی امراض کے لیے، اور بعض اوقات کچھ دائمی درد کی کیفیتوں کے لیے استعمال ہوتی ہیں۔",
      usageNotes: [
        "عام طور پر دن میں ایک یا دو بار تجویز کنندہ کی ہدایت کے مطابق لی جاتی ہیں۔",
        "موڈ یا اضطراب کے فوائد اکثر کئی ہفتوں میں بتدریج ظاہر ہوتے ہیں۔",
        "علاج کے دوران بلڈ پریشر کا وقتاً فوقتاً جائزہ لیا جا سکتا ہے۔",
      ],
      warnings: [
        "کچھ لوگوں میں بلڈ پریشر بڑھا سکتی ہیں، اس لیے نگرانی اہم ہے۔",
        "اچانک روکنے سے دستبرداری جیسی علامات ہو سکتی ہیں؛ خوراک کم کرنا عام طور پر تجویز کنندہ کی رہنمائی میں ہوتا ہے۔",
        "سیروٹونن کو متاثر کرنے والی دیگر ادویات کے ساتھ تعامل ہو سکتا ہے؛ ہمیشہ اپنی مکمل ادویات کی فہرست بتائیں۔",
        "خاص طور پر علاج کے ابتدائی مرحلے میں، کسی بھی نئے یا بڑھتے ہوئے خودکشی کے خیالات کو فوری طور پر ایک ماہر کو بتائیں۔",
      ],
    },
    relatedThemes: ["hardship", "anxiety"],
  },
  {
    slug: "short-term-anxiety-medicines",
    image: "mistyMountains",
    stepIcons: ["clipboard", "headsetCoach", "sliderPacing"],
    en: {
      name: "Short-term anxiety medicines (benzodiazepines)",
      use: "Some medicines may be used for acute, short-term anxiety or panic symptoms under close clinical supervision.",
      usageNotes: [
        "Typically prescribed for the shortest effective period, often days to a few weeks.",
        "Used alongside, not instead of, longer-term approaches like therapy.",
        "A prescriber will usually plan how and when to stop, not just how to start.",
      ],
      warnings: [
        "Can cause dependence and tolerance with regular use, even at prescribed doses.",
        "Sedation can affect driving, operating machinery, and judgment.",
        "Combining with alcohol or other sedatives can be dangerous.",
        "Stopping abruptly after regular use can cause withdrawal symptoms, including rebound anxiety; any change should be guided by a prescriber.",
      ],
    },
    ur: {
      name: "قلیل مدتی اضطراب کی ادویات (بینزوڈایازپینز)",
      use: "کچھ ادویات شدید، قلیل مدتی اضطراب یا پینک کی علامات کے لیے قریبی طبی نگرانی میں استعمال ہو سکتی ہیں۔",
      usageNotes: [
        "عام طور پر مختصر ترین مؤثر مدت کے لیے تجویز کی جاتی ہیں، اکثر چند دن سے چند ہفتے۔",
        "طویل المدتی طریقوں جیسے تھراپی کے ساتھ، اس کے بدلے نہیں، استعمال کی جاتی ہیں۔",
        "ایک تجویز کنندہ عام طور پر یہ بھی طے کرتا ہے کہ کب اور کیسے روکنا ہے، نہ صرف شروع کرنا۔",
      ],
      warnings: [
        "باقاعدہ استعمال سے، حتیٰ کہ تجویز کردہ خوراک پر بھی، انحصار اور برداشت پیدا ہو سکتی ہے۔",
        "غنودگی ڈرائیونگ، مشینری چلانے، اور فیصلہ سازی کو متاثر کر سکتی ہے۔",
        "الکحل یا دیگر غنودگی پیدا کرنے والی ادویات کے ساتھ ملانا خطرناک ہو سکتا ہے۔",
        "باقاعدہ استعمال کے بعد اچانک روکنے سے دستبرداری کی علامات، بشمول اضطراب کا دوبارہ بڑھنا، ہو سکتی ہیں؛ کوئی بھی تبدیلی تجویز کنندہ کی رہنمائی میں ہونی چاہیے۔",
      ],
    },
    relatedThemes: ["anxiety"],
  },
  {
    slug: "sleep-related-treatment",
    image: "softDawn",
    stepIcons: ["clipboard", "gauge", "stethoscope"],
    en: {
      name: "Sleep-related treatment",
      use: "Sleep problems may be addressed through behavioral care (like CBT-I), medical review, or medication when appropriate.",
      usageNotes: [
        "Usually considered after sleep habits and other causes have been reviewed.",
        "Often prescribed for short-term or occasional use rather than nightly long-term use.",
        "A clinician will usually check for other conditions affecting sleep first.",
      ],
      warnings: [
        "Can cause dependence with regular, longer-term use.",
        "Next-day grogginess or impaired coordination can occur, affecting driving.",
        "Mixing with alcohol or other sedatives increases risk.",
        "Not a substitute for addressing the underlying cause of sleep difficulty.",
      ],
    },
    ur: {
      name: "نیند سے متعلق علاج",
      use: "نیند کے مسائل رویے پر مبنی نگہداشت (جیسے CBT-I)، طبی جائزے، یا ضرورت پڑنے پر ادویات کے ذریعے حل کیے جا سکتے ہیں۔",
      usageNotes: [
        "عام طور پر نیند کی عادات اور دیگر اسباب کا جائزہ لینے کے بعد غور کیا جاتا ہے۔",
        "اکثر مستقل رات کے استعمال کی بجائے قلیل مدتی یا کبھار استعمال کے لیے تجویز کی جاتی ہیں۔",
        "ایک معالج عام طور پر پہلے نیند کو متاثر کرنے والی دیگر کیفیات کی جانچ کرتا ہے۔",
      ],
      warnings: [
        "باقاعدہ، طویل مدتی استعمال سے انحصار ہو سکتا ہے۔",
        "اگلے دن غنودگی یا ہم آہنگی میں کمی ہو سکتی ہے، جو ڈرائیونگ کو متاثر کر سکتی ہے۔",
        "الکحل یا دیگر غنودگی پیدا کرنے والی ادویات کے ساتھ ملانا خطرہ بڑھاتا ہے۔",
        "نیند کی دشواری کی بنیادی وجہ کو حل کرنے کا متبادل نہیں۔",
      ],
    },
    relatedThemes: ["stress", "hardship"],
  },
  {
    slug: "mood-stabilisers",
    image: "calmLakeReflection",
    stepIcons: ["sliderPacing", "testTube", "chartUp"],
    en: {
      name: "Mood stabilisers",
      use: "Used primarily to manage bipolar disorder, smoothing out episodes of mania/hypomania and depression.",
      usageNotes: [
        "Often started and adjusted gradually, with blood levels checked for some medicines.",
        "Regular blood tests may be needed to monitor levels and organ function.",
        "Benefits for mood stability usually build over weeks, even when a dose feels right quickly.",
      ],
      warnings: [
        "Several mood stabilisers require regular blood monitoring - missed tests can be unsafe.",
        "Dehydration, certain other medicines, and illness can affect blood levels of some mood stabilisers.",
        "Some mood stabilisers carry specific risks in pregnancy; this should be discussed directly with a prescriber.",
        "Never stop or change dose without medical guidance - this can trigger a relapse or, for some medicines, be medically risky.",
      ],
    },
    ur: {
      name: "موڈ اسٹیبلائزرز",
      use: "بنیادی طور پر بائی پولر ڈس آرڈر کو سنبھالنے کے لیے استعمال ہوتی ہیں، مینیا/ہائپومینیا اور ڈپریشن کی اقساط کو متوازن کرتی ہیں۔",
      usageNotes: [
        "اکثر بتدریج شروع اور ایڈجسٹ کی جاتی ہیں، کچھ ادویات کے لیے خون میں سطح چیک کی جاتی ہے۔",
        "سطح اور اعضاء کے افعال کی نگرانی کے لیے باقاعدہ خون کے ٹیسٹ درکار ہو سکتے ہیں۔",
        "موڈ کے استحکام کے فوائد عام طور پر کئی ہفتوں میں بنتے ہیں، حتیٰ کہ جب خوراک جلدی درست لگے۔",
      ],
      warnings: [
        "کئی موڈ اسٹیبلائزرز کو باقاعدہ خون کی نگرانی درکار ہوتی ہے - ٹیسٹ چھوٹ جانا غیر محفوظ ہو سکتا ہے۔",
        "پانی کی کمی، کچھ دیگر ادویات، اور بیماری کچھ موڈ اسٹیبلائزرز کی خون میں سطح کو متاثر کر سکتی ہیں۔",
        "کچھ موڈ اسٹیبلائزرز حمل میں مخصوص خطرات رکھتی ہیں؛ اس پر براہ راست تجویز کنندہ سے گفتگو کرنی چاہیے۔",
        "طبی رہنمائی کے بغیر کبھی خوراک نہ روکیں یا تبدیل کریں - یہ دوبارہ بیماری کو متحرک کر سکتا ہے یا، کچھ ادویات کے لیے، طبی طور پر خطرناک ہو سکتا ہے۔",
      ],
    },
    relatedThemes: ["hardship", "medical_state"],
  },
  {
    slug: "antipsychotics",
    image: "forestCabin",
    stepIcons: ["gauge", "stethoscope", "clipboard"],
    en: {
      name: "Antipsychotics",
      use: "Used for psychosis, and sometimes to manage severe mood episodes or as an add-on treatment for depression.",
      usageNotes: [
        "Dose is usually started low and adjusted gradually based on response.",
        "Regular check-ups often monitor weight, blood sugar, and heart health.",
        "Some are taken daily; longer-acting injectable forms exist for certain situations.",
      ],
      warnings: [
        "Can affect weight, blood sugar, and cholesterol - regular physical health monitoring matters.",
        "Movement-related side effects can occur and should be reported to a prescriber.",
        "Combining with other sedating medicines or alcohol increases risk.",
        "Stopping suddenly can lead to relapse; any change should be planned with a prescriber.",
      ],
    },
    ur: {
      name: "اینٹی سائیکوٹکس",
      use: "نفسیاتی کیفیات (سائیکوسس) کے لیے، اور بعض اوقات شدید موڈ کی اقساط کو سنبھالنے یا ڈپریشن کے علاج میں اضافی دوا کے طور پر استعمال ہوتی ہیں۔",
      usageNotes: [
        "خوراک عام طور پر کم سے شروع کی جاتی ہے اور ردعمل کی بنیاد پر بتدریج ایڈجسٹ کی جاتی ہے۔",
        "باقاعدہ چیک اپ اکثر وزن، بلڈ شوگر، اور دل کی صحت کی نگرانی کرتے ہیں۔",
        "کچھ روزانہ لی جاتی ہیں؛ بعض صورتحال کے لیے طویل اثر والے انجیکشن کی شکلیں بھی موجود ہیں۔",
      ],
      warnings: [
        "وزن، بلڈ شوگر، اور کولیسٹرول کو متاثر کر سکتی ہیں - باقاعدہ جسمانی صحت کی نگرانی اہم ہے۔",
        "حرکت سے متعلق مضر اثرات ہو سکتے ہیں اور انہیں تجویز کنندہ کو بتانا چاہیے۔",
        "دیگر غنودگی پیدا کرنے والی ادویات یا الکحل کے ساتھ ملانا خطرہ بڑھاتا ہے۔",
        "اچانک روکنے سے بیماری دوبارہ ہو سکتی ہے؛ کوئی بھی تبدیلی تجویز کنندہ کے ساتھ منصوبہ بندی سے کرنی چاہیے۔",
      ],
    },
    relatedThemes: ["medical_state", "hardship"],
  },
  {
    slug: "stimulant-medication",
    image: "sunlitPathway",
    stepIcons: ["clipboard", "gauge", "chartUp"],
    en: {
      name: "Stimulant medication (for ADHD)",
      use: "Used to manage symptoms of ADHD, such as difficulty sustaining attention, impulsivity, and restlessness.",
      usageNotes: [
        "Usually taken in the morning or as directed, since timing affects sleep and appetite.",
        "A prescriber often starts at a low dose and adjusts based on response and side effects.",
        "Regular review of growth (in young people), heart health, and mood is common.",
      ],
      warnings: [
        "Can affect appetite, sleep, heart rate, and blood pressure - monitoring matters.",
        "Has potential for misuse; should be stored and used exactly as prescribed.",
        "Can interact with certain heart conditions and other medicines - a full medical history matters before starting.",
        "Not a performance enhancer for people without ADHD, and using it without a prescription carries real risks.",
      ],
    },
    ur: {
      name: "محرک ادویات (اے ڈی ایچ ڈی کے لیے)",
      use: "اے ڈی ایچ ڈی کی علامات، جیسے توجہ برقرار رکھنے میں دشواری، جلدبازی، اور بےچینی کو سنبھالنے کے لیے استعمال ہوتی ہیں۔",
      usageNotes: [
        "عام طور پر صبح یا ہدایت کے مطابق لی جاتی ہیں، کیونکہ وقت نیند اور بھوک کو متاثر کرتا ہے۔",
        "ایک تجویز کنندہ اکثر کم خوراک سے شروع کرتا ہے اور ردعمل اور مضر اثرات کی بنیاد پر ایڈجسٹ کرتا ہے۔",
        "نوجوانوں میں نشوونما، دل کی صحت، اور موڈ کا باقاعدہ جائزہ عام ہے۔",
      ],
      warnings: [
        "بھوک، نیند، دل کی دھڑکن، اور بلڈ پریشر کو متاثر کر سکتی ہیں - نگرانی اہم ہے۔",
        "غلط استعمال کا امکان رکھتی ہیں؛ بالکل تجویز کے مطابق محفوظ اور استعمال کی جانی چاہیے۔",
        "کچھ دل کی کیفیتوں اور دیگر ادویات کے ساتھ تعامل ہو سکتا ہے - شروع کرنے سے پہلے مکمل طبی تاریخ اہم ہے۔",
        "بغیر اے ڈی ایچ ڈی والے افراد کے لیے کارکردگی بڑھانے والی دوا نہیں، اور بغیر تجویز کے استعمال حقیقی خطرات رکھتا ہے۔",
      ],
    },
    relatedThemes: ["medical_state"],
  },
  {
    slug: "beta-blockers",
    image: "oceanSunrise",
    stepIcons: ["gauge", "stethoscope", "headsetCoach"],
    en: {
      name: "Beta-blockers (for physical anxiety symptoms)",
      use: "Sometimes used off-label for the physical symptoms of situational anxiety, such as a racing heart before a specific event.",
      usageNotes: [
        "Typically used occasionally, before a known stressful situation, rather than daily.",
        "Addresses physical symptoms like a racing heart or shaking, not the underlying worry itself.",
        "Often considered alongside, not instead of, therapy for ongoing anxiety.",
      ],
      warnings: [
        "Not suitable for people with certain heart or lung conditions, including asthma, without medical review.",
        "Can lower heart rate and blood pressure more than intended in some people.",
        "Should not be stopped abruptly after regular use without medical guidance.",
        "Does not treat the psychological experience of anxiety on its own.",
      ],
    },
    ur: {
      name: "بیٹا بلاکرز (جسمانی اضطرابی علامات کے لیے)",
      use: "بعض اوقات صورتحالی اضطراب کی جسمانی علامات، جیسے کسی مخصوص موقع سے پہلے دل کا تیز دھڑکنا، کے لیے آف لیبل استعمال ہوتی ہیں۔",
      usageNotes: [
        "عام طور پر روزانہ کی بجائے کسی معلوم دباؤ والی صورتحال سے پہلے کبھار استعمال ہوتی ہیں۔",
        "دل کی تیز دھڑکن یا کپکپی جیسی جسمانی علامات کو حل کرتی ہیں، بنیادی فکر کو نہیں۔",
        "اکثر جاری اضطراب کے لیے تھراپی کے ساتھ، اس کے بدلے نہیں، زیرِ غور لائی جاتی ہیں۔",
      ],
      warnings: [
        "دل یا پھیپھڑوں کی کچھ کیفیتوں، بشمول دمہ، والے افراد کے لیے طبی جائزے کے بغیر موزوں نہیں۔",
        "کچھ لوگوں میں دل کی دھڑکن اور بلڈ پریشر کو ارادے سے زیادہ کم کر سکتی ہیں۔",
        "باقاعدہ استعمال کے بعد طبی رہنمائی کے بغیر اچانک نہیں روکنی چاہیے۔",
        "اضطراب کے نفسیاتی تجربے کا خود بخود علاج نہیں کرتیں۔",
      ],
    },
    relatedThemes: ["anxiety"],
  },
  {
    slug: "buspirone-and-non-benzodiazepine-anxiolytics",
    image: "grassBreeze",
    stepIcons: ["repeatCycle", "chartUp", "branchPaths"],
    en: {
      name: "Buspirone and non-benzodiazepine anxiolytics",
      use: "Used for longer-term management of generalized anxiety, with a lower risk of dependence than benzodiazepines.",
      usageNotes: [
        "Usually taken regularly, a few times a day, rather than as needed.",
        "Can take 2 to 4 weeks for full anxiety-reducing effects to build up.",
        "Often used when longer-term anxiety treatment is needed beyond short-term options.",
      ],
      warnings: [
        "Less sedating than benzodiazepines but can still cause dizziness, especially when starting.",
        "Can interact with certain other medicines affecting serotonin.",
        "Not effective for acute panic in the moment, since it works gradually over time.",
        "Any change in dose should be guided by a prescriber.",
      ],
    },
    ur: {
      name: "بسپائرون اور غیر بینزوڈایازپین اضطراب کش ادویات",
      use: "طویل مدتی عمومی اضطراب کے انتظام کے لیے استعمال ہوتی ہیں، بینزوڈایازپینز کے مقابلے میں انحصار کے کم خطرے کے ساتھ۔",
      usageNotes: [
        "عام طور پر ضرورت کے وقت کی بجائے باقاعدگی سے، دن میں چند بار لی جاتی ہیں۔",
        "مکمل اضطراب کم کرنے والے اثرات بننے میں 2 سے 4 ہفتے لگ سکتے ہیں۔",
        "اکثر اس وقت استعمال ہوتی ہیں جب قلیل مدتی اختیارات سے آگے طویل مدتی اضطراب کے علاج کی ضرورت ہو۔",
      ],
      warnings: [
        "بینزوڈایازپینز کے مقابلے میں کم غنودگی پیدا کرتی ہیں لیکن پھر بھی چکر آ سکتا ہے، خاص طور پر شروع میں۔",
        "سیروٹونن کو متاثر کرنے والی کچھ دیگر ادویات کے ساتھ تعامل ہو سکتا ہے۔",
        "فوری پینک کے لیے مؤثر نہیں، کیونکہ یہ وقت کے ساتھ بتدریج کام کرتی ہے۔",
        "خوراک میں کوئی بھی تبدیلی تجویز کنندہ کی رہنمائی میں ہونی چاہیے۔",
      ],
    },
    relatedThemes: ["anxiety", "hardship"],
  },
  {
    slug: "tricyclic-antidepressants",
    image: "forestCreek",
    stepIcons: ["clipboard", "stethoscope", "gauge"],
    en: {
      name: "Tricyclic antidepressants (TCAs)",
      use: "An older class of antidepressant, now also used for some chronic pain and migraine prevention at lower doses.",
      usageNotes: [
        "Often started at a low dose and increased gradually to manage side effects.",
        "May be taken at night, since drowsiness is a common early effect.",
        "A prescriber may check heart rhythm (ECG) before and during treatment for some people.",
      ],
      warnings: [
        "Can be dangerous in overdose, more so than many newer antidepressants - safe storage matters.",
        "Can cause dry mouth, constipation, and drowsiness, especially early on.",
        "May affect heart rhythm in some people; pre-existing heart conditions should be discussed with a prescriber.",
        "Stopping suddenly can cause withdrawal-like symptoms; tapering is usually guided by a prescriber.",
      ],
    },
    ur: {
      name: "ٹرائی سائیکلک اینٹی ڈپریسنٹس (TCAs)",
      use: "اینٹی ڈپریسنٹ کی ایک پرانی قسم، جو اب کم خوراک پر کچھ دائمی درد اور مائیگرین کی روک تھام کے لیے بھی استعمال ہوتی ہے۔",
      usageNotes: [
        "اکثر کم خوراک سے شروع کی جاتی ہیں اور مضر اثرات کو سنبھالنے کے لیے بتدریج بڑھائی جاتی ہیں۔",
        "رات کو لی جا سکتی ہیں، کیونکہ غنودگی ایک عام ابتدائی اثر ہے۔",
        "کچھ لوگوں کے لیے تجویز کنندہ علاج سے پہلے اور دوران دل کی دھڑکن (ای سی جی) چیک کر سکتا ہے۔",
      ],
      warnings: [
        "زیادہ مقدار میں لینے پر خطرناک ہو سکتی ہیں، کئی نئی اینٹی ڈپریسنٹس کے مقابلے میں زیادہ - محفوظ ذخیرہ اہم ہے۔",
        "خشک منہ، قبض، اور غنودگی پیدا کر سکتی ہیں، خاص طور پر ابتدا میں۔",
        "کچھ لوگوں میں دل کی دھڑکن کو متاثر کر سکتی ہیں؛ پہلے سے موجود دل کی کیفیتوں پر تجویز کنندہ سے بات کرنی چاہیے۔",
        "اچانک روکنے سے دستبرداری جیسی علامات ہو سکتی ہیں؛ خوراک کم کرنا عام طور پر تجویز کنندہ کی رہنمائی میں ہوتا ہے۔",
      ],
    },
    relatedThemes: ["medical_state", "pain"],
  },
];

export function getMedication(slug: string) {
  return medications.find((medication) => medication.slug === slug);
}
