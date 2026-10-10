import type { naturePhotos } from "../components/naturePhotos";
import type { StepIconKey } from "../components/StepIcons";

export type Therapy = {
  slug: string;
  image: keyof typeof naturePhotos;
  stepIcons: StepIconKey[];
  en: { name: string; summary: string; sessionInfo: string; whatToExpect: string[] };
  ur: { name: string; summary: string; sessionInfo: string; whatToExpect: string[] };
  relatedThemes: string[];
};

export const therapies: Therapy[] = [
  {
    slug: "cbt",
    image: "balancedStones",
    stepIcons: ["clipboard", "thoughtCloud", "repeatCycle", "chartUp"],
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
    image: "mountainRange",
    stepIcons: ["twoPeople", "peopleGroup", "notebook", "headsetCoach"],
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
    image: "steppingStones",
    stepIcons: ["clipboard", "staircase", "gauge"],
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
    image: "forestCabin",
    stepIcons: ["shield", "sliderPacing", "branchPaths"],
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
    image: "softDawn",
    stepIcons: ["stethoscope", "testTube", "speechArrow"],
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
  {
    slug: "peer-support-groups",
    image: "pebbleCircle",
    stepIcons: ["groupRules", "peopleGroup", "guideFacilitator", "openHand"],
    en: {
      name: "Peer support groups",
      summary: "Structured groups where people with similar experiences share support under trained facilitation.",
      sessionInfo: "Sessions are usually confidential and led or co-led by a trained facilitator, not just an informal chat.",
      whatToExpect: [
        "An introduction to group norms - confidentiality, respect, and voluntary sharing.",
        "Structured time for members to share experiences and what has helped them.",
        "A facilitator who keeps the space safe and makes sure no single person dominates.",
        "No pressure to speak - many people attend several sessions before sharing anything.",
      ],
    },
    ur: {
      name: "ہم خیال معاون گروپ",
      summary: "منظم گروپ جہاں ملتے جلتے تجربات رکھنے والے افراد تربیت یافتہ نگرانی میں ایک دوسرے کی مدد کرتے ہیں۔",
      sessionInfo: "سیشنز عام طور پر خفیہ ہوتے ہیں اور ایک تربیت یافتہ سہولت کار کی رہنمائی میں ہوتے ہیں، محض غیر رسمی گفتگو نہیں۔",
      whatToExpect: [
        "گروپ کے اصولوں کا تعارف - رازداری، احترام، اور رضاکارانہ شرکت۔",
        "اراکین کے لیے اپنے تجربات اور جو کچھ ان کی مدد کرتا رہا ہے شیئر کرنے کا منظم وقت۔",
        "ایک سہولت کار جو ماحول کو محفوظ رکھتا ہے اور یقینی بناتا ہے کہ کوئی ایک شخص گفتگو پر حاوی نہ ہو۔",
        "بولنے کا کوئی دباؤ نہیں - بہت سے لوگ کچھ بھی شیئر کرنے سے پہلے کئی سیشنز میں شریک ہوتے ہیں۔",
      ],
    },
    relatedThemes: ["hardship", "grief", "loss"],
  },
  {
    slug: "act",
    image: "mountainLake",
    stepIcons: ["thoughtCloud", "target", "openHand", "chartUp"],
    en: {
      name: "ACT (Acceptance and Commitment Therapy)",
      summary: "Focuses on accepting difficult thoughts and feelings while committing to actions aligned with your values.",
      sessionInfo: "Often includes mindfulness exercises, values clarification, and behavioral steps between sessions.",
      whatToExpect: [
        "Identifying what matters most to you across different areas of life.",
        "Learning to notice thoughts and feelings without immediately acting on or fighting them.",
        "Practicing mindfulness and \"defusion\" skills to create space from difficult thoughts.",
        "Setting small, values-based actions to try between sessions.",
      ],
    },
    ur: {
      name: "اے سی ٹی (قبولیت اور عزم کی تھراپی)",
      summary: "مشکل خیالات اور جذبات کو قبول کرنے جبکہ اپنی اقدار کے مطابق اقدامات کرنے پر توجہ دیتی ہے۔",
      sessionInfo: "اکثر مائنڈ فلنس مشقیں، اقدار کی وضاحت، اور سیشنز کے درمیان عملی اقدامات شامل ہوتے ہیں۔",
      whatToExpect: [
        "زندگی کے مختلف پہلوؤں میں آپ کے لیے سب سے اہم چیزوں کی نشاندہی۔",
        "خیالات اور جذبات کو فوراً عمل کیے یا ان سے لڑے بغیر محسوس کرنا سیکھنا۔",
        "مشکل خیالات سے فاصلہ بنانے کے لیے مائنڈ فلنس اور 'ڈی فیوژن' کی مہارتوں کی مشق۔",
        "سیشنز کے درمیان آزمانے کے لیے چھوٹے، اقدار پر مبنی اقدامات طے کرنا۔",
      ],
    },
    relatedThemes: ["hardship", "anxiety", "grief"],
  },
  {
    slug: "ipt",
    image: "meadow",
    stepIcons: ["twoPeople", "thoughtCloud", "speechArrow", "chartUp"],
    en: {
      name: "IPT (Interpersonal Therapy)",
      summary: "Focuses on how current relationships and life changes connect to how you're feeling.",
      sessionInfo: "Usually time-limited, often 12-16 sessions, with a focus on one or two relationship areas.",
      whatToExpect: [
        "Mapping your important relationships and recent life changes.",
        "Identifying one or two focus areas - grief, conflict, a role transition, or isolation.",
        "Working through specific relationship situations as they come up day to day.",
        "Reviewing how your mood shifts alongside relationship changes.",
      ],
    },
    ur: {
      name: "آئی پی ٹی (باہمی تعلقات کی تھراپی)",
      summary: "موجودہ تعلقات اور زندگی کی تبدیلیاں آپ کے احساسات سے کیسے جڑی ہیں، اس پر توجہ دیتی ہے۔",
      sessionInfo: "عام طور پر وقت کی حد میں، اکثر 12-16 سیشنز، ایک یا دو تعلقاتی شعبوں پر توجہ کے ساتھ۔",
      whatToExpect: [
        "آپ کے اہم تعلقات اور حالیہ زندگی کی تبدیلیوں کا نقشہ بنانا۔",
        "ایک یا دو توجہ کے شعبوں کی نشاندہی - غم، تنازعہ، کردار کی تبدیلی، یا تنہائی۔",
        "روزمرہ زندگی میں پیش آنے والی مخصوص تعلقاتی صورتحال پر کام کرنا۔",
        "تعلقات کی تبدیلیوں کے ساتھ مزاج کیسے بدلتا ہے، اس کا جائزہ۔",
      ],
    },
    relatedThemes: ["grief", "loss", "hardship"],
  },
  {
    slug: "psychodynamic-therapy",
    image: "foggyValley",
    stepIcons: ["thoughtCloud", "branchPaths", "notebook", "reflect"],
    en: {
      name: "Psychodynamic therapy",
      summary: "Explores how past experiences and patterns shape present relationships and feelings.",
      sessionInfo: "Often longer-term than CBT, with open-ended exploration guided by what arises in conversation.",
      whatToExpect: [
        "An open, exploratory style of conversation rather than a fixed agenda.",
        "Looking at patterns that repeat across different relationships in your life.",
        "Making connections between past experiences and present feelings, at your own pace.",
        "A focus on the therapeutic relationship itself as part of the work.",
      ],
    },
    ur: {
      name: "نفسیاتی حرکیاتی تھراپی",
      summary: "یہ دیکھتی ہے کہ ماضی کے تجربات اور انداز موجودہ تعلقات اور احساسات کو کیسے تشکیل دیتے ہیں۔",
      sessionInfo: "اکثر سی بی ٹی سے زیادہ طویل مدتی، گفتگو میں سامنے آنے والے موضوعات کی رہنمائی میں کھلی تلاش کے ساتھ۔",
      whatToExpect: [
        "ایک مقررہ ایجنڈے کی بجائے کھلی، تلاش پر مبنی گفتگو کا انداز۔",
        "زندگی کے مختلف تعلقات میں دہرائے جانے والے انداز کو دیکھنا۔",
        "اپنی رفتار سے، ماضی کے تجربات اور موجودہ احساسات کے درمیان تعلق قائم کرنا۔",
        "معالجاتی تعلق کو خود کام کے حصے کے طور پر اہمیت دینا۔",
      ],
    },
    relatedThemes: ["grief", "hardship", "trauma"],
  },
  {
    slug: "emdr",
    image: "oceanSunrise",
    stepIcons: ["senseEye", "thoughtCloud", "shield", "calmFinish"],
    en: {
      name: "EMDR",
      summary: "Eye Movement Desensitisation and Reprocessing - a structured therapy for processing distressing memories.",
      sessionInfo: "Delivered only by a trained EMDR clinician; involves brief recall of memories alongside guided eye movements or other bilateral stimulation.",
      whatToExpect: [
        "An initial phase focused on stabilization and coping skills before any memory work.",
        "Briefly recalling a specific distressing memory while following guided eye movements, taps, or sounds.",
        "Regular check-ins on your distress level, with pauses whenever needed.",
        "A closing phase to help you feel grounded before ending each session.",
      ],
    },
    ur: {
      name: "ای ایم ڈی آر",
      summary: "آنکھوں کی حرکت سے غیر حساسیت اور ری پروسیسنگ - تکلیف دہ یادوں پر کارروائی کے لیے ایک منظم تھراپی۔",
      sessionInfo: "صرف ایک تربیت یافتہ ای ایم ڈی آر معالج کے ذریعے کی جاتی ہے؛ اس میں رہنمائی شدہ آنکھوں کی حرکت یا دیگر محرکات کے ساتھ یادوں کی مختصر یاد دہانی شامل ہے۔",
      whatToExpect: [
        "کسی بھی یادداشت پر کام سے پہلے استحکام اور مقابلہ کرنے کی مہارتوں پر ابتدائی مرحلہ۔",
        "رہنمائی شدہ آنکھوں کی حرکت، تھپکی، یا آوازوں کی پیروی کرتے ہوئے کسی مخصوص تکلیف دہ یاد کو مختصراً یاد کرنا۔",
        "آپ کی تکلیف کی سطح پر باقاعدہ جائزہ، جب بھی ضرورت ہو وقفے کے ساتھ۔",
        "ہر سیشن ختم ہونے سے پہلے آپ کو مستحکم محسوس کرانے کے لیے اختتامی مرحلہ۔",
      ],
    },
    relatedThemes: ["trauma", "grief"],
  },
  {
    slug: "family-therapy",
    image: "forestBridge",
    stepIcons: ["peopleGroup", "speechArrow", "branchPaths", "twoPeople"],
    en: {
      name: "Family therapy",
      summary: "Addresses difficulties in the context of the whole family rather than one person alone.",
      sessionInfo: "Sessions may include some or all family members, depending on what's being worked on.",
      whatToExpect: [
        "An initial conversation about what's bringing the family to therapy.",
        "Sessions that may involve different combinations of family members over time.",
        "Work on communication patterns, roles, and conflict within the family system.",
        "Space for each person's perspective to be heard, with the therapist managing the process.",
      ],
    },
    ur: {
      name: "خاندانی تھراپی",
      summary: "صرف ایک فرد کی بجائے پورے خاندان کے تناظر میں مشکلات کو حل کرتی ہے۔",
      sessionInfo: "سیشنز میں کام کے مطابق خاندان کے کچھ یا تمام افراد شامل ہو سکتے ہیں۔",
      whatToExpect: [
        "خاندان کو تھراپی تک لانے والی وجہ پر ابتدائی گفتگو۔",
        "ایسے سیشنز جن میں وقت کے ساتھ خاندان کے مختلف افراد شامل ہو سکتے ہیں۔",
        "خاندانی نظام میں رابطے کے انداز، کردار، اور تنازعات پر کام۔",
        "ہر فرد کے نقطہ نظر کو سننے کی گنجائش، معالج کے عمل کو سنبھالنے کے ساتھ۔",
      ],
    },
    relatedThemes: ["family_stigma", "hardship", "frustration"],
  },
  {
    slug: "couples-therapy",
    image: "grassBreeze",
    stepIcons: ["twoPeople", "speechArrow", "openHand", "chartUp"],
    en: {
      name: "Couples therapy",
      summary: "Helps partners address communication breakdowns, conflict, and relationship distress together.",
      sessionInfo: "Usually involves both partners in the room, with occasional individual sessions depending on the approach.",
      whatToExpect: [
        "A joint assessment of the relationship's current strengths and difficulties.",
        "Learning structured ways to communicate during disagreements.",
        "Identifying repeating patterns or cycles that create distance between partners.",
        "Practicing new ways of responding to each other, both in session and at home.",
      ],
    },
    ur: {
      name: "میاں بیوی کی تھراپی",
      summary: "جوڑوں کو مل کر رابطے کی خرابیوں، تنازعات، اور تعلقاتی تکلیف کو حل کرنے میں مدد دیتی ہے۔",
      sessionInfo: "عام طور پر دونوں ساتھی کمرے میں موجود ہوتے ہیں، طریقہ کار کے مطابق کبھی کبھار انفرادی سیشنز بھی ہو سکتے ہیں۔",
      whatToExpect: [
        "تعلق کی موجودہ خوبیوں اور مشکلات کا مشترکہ جائزہ۔",
        "اختلاف کے دوران بات چیت کرنے کے منظم طریقے سیکھنا۔",
        "ساتھیوں کے درمیان فاصلہ پیدا کرنے والے دہرائے جانے والے انداز یا چکروں کی نشاندہی۔",
        "سیشن میں اور گھر پر ایک دوسرے کا جواب دینے کے نئے طریقوں کی مشق۔",
      ],
    },
    relatedThemes: ["frustration", "hardship"],
  },
  {
    slug: "cbt-i",
    image: "calmLakeReflection",
    stepIcons: ["notebook", "clipboard", "chartUp", "calmFinish"],
    en: {
      name: "CBT for Insomnia (CBT-I)",
      summary: "A structured, short-term therapy that is the first-line treatment for ongoing sleep problems.",
      sessionInfo: "Usually 4-8 sessions, often including a sleep diary and specific changes to sleep habits.",
      whatToExpect: [
        "Keeping a sleep diary to track patterns over 1-2 weeks.",
        "Setting a consistent sleep and wake schedule, even on difficult nights.",
        "Learning to get out of bed when unable to sleep, rather than lying awake frustrated.",
        "Addressing anxious thoughts about sleep itself, which often make insomnia worse.",
      ],
    },
    ur: {
      name: "بے خوابی کے لیے سی بی ٹی (CBT-I)",
      summary: "ایک منظم، قلیل مدتی تھراپی جو جاری نیند کے مسائل کے لیے پہلی ترجیحی علاج ہے۔",
      sessionInfo: "عام طور پر 4-8 سیشنز، اکثر نیند کی ڈائری اور نیند کی عادات میں مخصوص تبدیلیوں کے ساتھ۔",
      whatToExpect: [
        "1-2 ہفتوں تک انداز کو ٹریک کرنے کے لیے نیند کی ڈائری رکھنا۔",
        "مشکل راتوں میں بھی سونے اور جاگنے کا مستقل وقت طے کرنا۔",
        "نیند نہ آنے پر بستر سے اٹھنا سیکھنا، بجائے جاگے ہوئے مایوس لیٹے رہنے کے۔",
        "نیند کے بارے میں فکرمند خیالات کو حل کرنا، جو اکثر بے خوابی کو بڑھاتے ہیں۔",
      ],
    },
    relatedThemes: ["stress", "hardship"],
  },
  {
    slug: "grief-focused-therapy",
    image: "sprout",
    stepIcons: ["thoughtCloud", "openHand", "notebook", "calmFinish"],
    en: {
      name: "Grief-focused therapy",
      summary: "Targeted support for grief that stays intense, stuck, or disabling well beyond the initial loss.",
      sessionInfo: "Not needed by everyone who is grieving - aimed at those whose grief isn't easing over time.",
      whatToExpect: [
        "An assessment of how grief is affecting daily functioning compared to the time since the loss.",
        "Processing the loss at a pace that feels manageable, without being rushed toward \"moving on\".",
        "Finding ways to maintain a meaningful connection to the person who died.",
        "Addressing any guilt, anger, or unfinished business connected to the loss.",
      ],
    },
    ur: {
      name: "غم پر مرکوز تھراپی",
      summary: "ایسے غم کے لیے مخصوص مدد جو نقصان کے کافی عرصے بعد بھی شدید، رکا ہوا، یا معذور کن رہے۔",
      sessionInfo: "ہر غمزدہ شخص کے لیے ضروری نہیں - ان کے لیے جن کا غم وقت کے ساتھ کم نہیں ہو رہا۔",
      whatToExpect: [
        "نقصان کے بعد سے گزرے وقت کے مقابلے میں غم روزمرہ زندگی کو کیسے متاثر کر رہا ہے، اس کا جائزہ۔",
        "'آگے بڑھنے' کی جلدی کیے بغیر، آرام دہ رفتار سے نقصان پر کارروائی کرنا۔",
        "فوت شدہ شخص کے ساتھ بامعنی تعلق برقرار رکھنے کے طریقے تلاش کرنا۔",
        "نقصان سے جڑے کسی بھی احساسِ جرم، غصے، یا ادھوری باتوں کو حل کرنا۔",
      ],
    },
    relatedThemes: ["grief", "loss"],
  },
  {
    slug: "mindfulness-based-therapy",
    image: "bareFeetOnGrass",
    stepIcons: ["headFocus", "bodyScan", "peopleGroup", "chartUp"],
    en: {
      name: "Mindfulness-based therapy (MBCT / MBSR)",
      summary: "A structured group programme combining mindfulness meditation with elements of CBT.",
      sessionInfo: "Usually delivered over 8 weeks in a group format, with daily home practice between sessions.",
      whatToExpect: [
        "Weekly group sessions teaching formal meditation practices like body scan and sitting meditation.",
        "Daily home practice using guided audio, usually 20-45 minutes.",
        "Learning to recognize early signs of a mood dip before it builds.",
        "Particularly recommended to help prevent relapse in recurrent depression.",
      ],
    },
    ur: {
      name: "مائنڈ فلنس پر مبنی تھراپی (ایم بی سی ٹی / ایم بی ایس آر)",
      summary: "مائنڈ فلنس مراقبے کو سی بی ٹی کے عناصر کے ساتھ ملانے والا ایک منظم گروپ پروگرام۔",
      sessionInfo: "عام طور پر 8 ہفتوں میں گروپ کی صورت میں، سیشنز کے درمیان روزانہ گھریلو مشق کے ساتھ۔",
      whatToExpect: [
        "ہفتہ وار گروپ سیشنز جن میں باڈی اسکین اور بیٹھ کر مراقبہ جیسی باقاعدہ مشقیں سکھائی جاتی ہیں۔",
        "رہنمائی شدہ آڈیو کے ساتھ روزانہ گھریلو مشق، عام طور پر 20-45 منٹ۔",
        "مزاج میں کمی کی ابتدائی علامات کو اس کے بڑھنے سے پہلے پہچاننا سیکھنا۔",
        "بار بار آنے والے ڈپریشن کی واپسی روکنے میں خاص طور پر تجویز کردہ۔",
      ],
    },
    relatedThemes: ["hardship", "patience"],
  },
  {
    slug: "teletherapy",
    image: "mistyMountains",
    stepIcons: ["headsetCoach", "speechArrow", "clipboard", "checkDone"],
    en: {
      name: "Teletherapy (online counselling)",
      summary: "Therapy delivered over video or phone call, often through Pakistani telehealth platforms.",
      sessionInfo: "Same clinical approaches as in-person therapy, delivered remotely - useful when travel, stigma, or location are barriers.",
      whatToExpect: [
        "A video or phone session at a scheduled time, usually through a secure platform.",
        "The same kinds of approaches available in person - CBT, counselling, or psychiatric review.",
        "A private, quiet space on your end helps, though many providers can adapt if that's not possible.",
        "A chance to ask the provider about their training and experience with your specific concern.",
      ],
    },
    ur: {
      name: "ٹیلی تھراپی (آن لائن کاؤنسلنگ)",
      summary: "ویڈیو یا فون کال کے ذریعے تھراپی، اکثر پاکستانی ٹیلی ہیلتھ پلیٹ فارمز کے ذریعے۔",
      sessionInfo: "ذاتی تھراپی جیسے ہی طریقہ کار، دور سے فراہم کیے جاتے ہیں - سفر، بدنامی، یا مقام رکاوٹ ہونے پر مفید۔",
      whatToExpect: [
        "مقررہ وقت پر ویڈیو یا فون سیشن، عام طور پر ایک محفوظ پلیٹ فارم کے ذریعے۔",
        "وہی طریقہ کار جو ذاتی طور پر دستیاب ہیں - سی بی ٹی، کاؤنسلنگ، یا نفسیاتی جائزہ۔",
        "آپ کی طرف سے ایک نجی، پرسکون جگہ مددگار ہوتی ہے، اگرچہ بہت سے فراہم کنندگان اس کے بغیر بھی ایڈجسٹ کر سکتے ہیں۔",
        "فراہم کنندہ سے ان کی تربیت اور آپ کے مخصوص مسئلے کے تجربے کے بارے میں پوچھنے کا موقع۔",
      ],
    },
    relatedThemes: ["family_stigma", "hardship"],
  },
];

export function getTherapy(slug: string) {
  return therapies.find((therapy) => therapy.slug === slug);
}
