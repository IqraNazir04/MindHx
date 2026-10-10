import type { naturePhotos } from "../components/naturePhotos";
import type { StepIconKey } from "../components/StepIcons";

export type Technique = {
  slug: string;
  image: keyof typeof naturePhotos;
  stepIcons: StepIconKey[];
  en: { name: string; summary: string; notes: string; steps: string[] };
  ur: { name: string; summary: string; notes: string; steps: string[] };
  relatedThemes: string[];
};

export const techniques: Technique[] = [
  {
    slug: "box-breathing",
    image: "grassBreeze",
    stepIcons: ["seated", "breatheIn", "holdPause", "breatheOut", "repeatCycle"],
    en: {
      name: "Box breathing",
      summary: "Inhale, hold, exhale, and hold for four counts each.",
      notes: "A brief settling practice. Stop if you feel dizzy or more distressed.",
      steps: [
        "Sit comfortably and let your shoulders relax.",
        "Inhale slowly through the nose for a count of 4.",
        "Hold the breath gently for a count of 4.",
        "Exhale slowly through the mouth for a count of 4.",
        "Hold at the bottom for a count of 4, then repeat for 4-6 cycles.",
      ],
    },
    ur: {
      name: "باکس بریدنگ",
      summary: "چار گنتی تک سانس اندر لیں، روکیں، باہر نکالیں، اور دوبارہ روکیں۔",
      notes: "ایک مختصر پرسکون مشق۔ چکر آئے یا زیادہ بےچینی محسوس ہو تو رک جائیں۔",
      steps: [
        "آرام سے بیٹھیں اور کندھوں کو ڈھیلا چھوڑیں۔",
        "ناک سے 4 گنتی تک آہستہ سانس اندر لیں۔",
        "4 گنتی تک نرمی سے سانس روکیں۔",
        "منہ سے 4 گنتی تک آہستہ سانس باہر نکالیں۔",
        "4 گنتی تک دوبارہ روکیں، پھر 4-6 بار دہرائیں۔",
      ],
    },
    relatedThemes: ["anxiety", "frustration"],
  },
  {
    slug: "grounding-5-4-3-2-1",
    image: "bareFeetOnGrass",
    stepIcons: ["holdPause", "senseEye", "senseHand", "senseEar", "senseNose", "senseMouth"],
    en: {
      name: "5-4-3-2-1 grounding",
      summary: "Name five things you see, four you feel, three you hear, two you smell, and one you taste.",
      notes: "Useful when attention feels pulled into worry or overwhelm.",
      steps: [
        "Pause and take one slow breath.",
        "Name 5 things you can see around you.",
        "Name 4 things you can physically feel (your feet on the floor, fabric on your skin).",
        "Name 3 things you can hear.",
        "Name 2 things you can smell.",
        "Name 1 thing you can taste, or one thing you appreciate right now.",
      ],
    },
    ur: {
      name: "5-4-3-2-1 گراؤنڈنگ",
      summary: "پانچ چیزیں جو آپ دیکھ رہے ہیں، چار جو محسوس کر رہے ہیں، تین جو سن رہے ہیں، دو جن کی خوشبو، اور ایک جس کا ذائقہ محسوس کریں۔",
      notes: "جب توجہ فکر یا ذہنی دباؤ میں کھنچی جا رہی ہو تو مفید ہے۔",
      steps: [
        "رکیں اور ایک آہستہ سانس لیں۔",
        "اپنے ارد گرد 5 چیزیں دیکھ کر بتائیں۔",
        "4 چیزیں جو آپ جسمانی طور پر محسوس کر سکتے ہیں (پاؤں فرش پر، کپڑا جلد پر)۔",
        "3 چیزیں جو آپ سن سکتے ہیں۔",
        "2 چیزیں جن کی خوشبو محسوس ہو۔",
        "1 چیز جس کا ذائقہ محسوس ہو، یا کوئی چیز جس کی آپ قدر کرتے ہیں۔",
      ],
    },
    relatedThemes: ["anxiety", "trauma", "frustration"],
  },
  {
    slug: "body-scan",
    image: "calmLakeReflection",
    stepIcons: ["seated", "headFocus", "bodyScan", "muscleFace", "calmFinish"],
    en: {
      name: "Body scan",
      summary: "Notice sensations from head to feet without trying to change them.",
      notes: "Some people find body awareness difficult during acute distress; switch to external grounding if needed.",
      steps: [
        "Sit or lie down somewhere comfortable.",
        "Bring attention to the top of your head, noticing any sensation without judging it.",
        "Slowly move attention down through your face, shoulders, arms, chest, stomach, legs, and feet.",
        "If you notice tension, you can choose to soften it, or simply notice it and move on.",
        "Finish by taking one slow breath and opening your eyes.",
      ],
    },
    ur: {
      name: "باڈی اسکین",
      summary: "سر سے پاؤں تک جسمانی احساسات کو بدلنے کی کوشش کیے بغیر محسوس کریں۔",
      notes: "شدید تکلیف کے دوران کچھ لوگوں کو جسمانی آگاہی مشکل لگتی ہے؛ ضرورت پڑنے پر بیرونی گراؤنڈنگ کی طرف جائیں۔",
      steps: [
        "کسی آرام دہ جگہ بیٹھیں یا لیٹ جائیں۔",
        "سر کی چوٹی پر توجہ دیں، بغیر کسی فیصلے کے جو بھی احساس ہو اسے محسوس کریں۔",
        "آہستہ آہستہ توجہ چہرے، کندھوں، بازوؤں، سینے، پیٹ، ٹانگوں اور پاؤں کی طرف لے جائیں۔",
        "اگر تناؤ محسوس ہو تو اسے نرم کر سکتے ہیں، یا صرف محسوس کر کے آگے بڑھ سکتے ہیں۔",
        "ایک آہستہ سانس لے کر اور آنکھیں کھول کر ختم کریں۔",
      ],
    },
    relatedThemes: ["hardship", "grief", "patience"],
  },
  {
    slug: "one-small-action",
    image: "sprout",
    stepIcons: ["target", "glassWater", "checkDone", "reflect"],
    en: {
      name: "One small action",
      summary: "Choose one achievable action for the next hour: water, food, daylight, or a message to someone safe.",
      notes: "A behavioral activation prompt, not a replacement for treatment.",
      steps: [
        "Pick one small, concrete action you can do in the next hour.",
        "Keep it deliberately small: a glass of water, opening a window, a 5-minute walk, or one message to someone you trust.",
        "Do just that one thing, without expecting it to fix everything.",
        "Notice how you feel afterward, without judgment either way.",
      ],
    },
    ur: {
      name: "ایک چھوٹا سا قدم",
      summary: "اگلے ایک گھنٹے کے لیے ایک قابلِ حصول کام منتخب کریں: پانی، خوراک، دھوپ، یا کسی قابلِ اعتماد شخص کو پیغام۔",
      notes: "یہ ایک عملی محرک ہے، علاج کا متبادل نہیں۔",
      steps: [
        "اگلے ایک گھنٹے میں کرنے کے لیے ایک چھوٹا، ٹھوس کام منتخب کریں۔",
        "اسے جان بوجھ کر چھوٹا رکھیں: ایک گلاس پانی، کھڑکی کھولنا، 5 منٹ کی سیر، یا کسی قابلِ اعتماد شخص کو ایک پیغام۔",
        "بس وہی ایک کام کریں، اس توقع کے بغیر کہ یہ سب کچھ ٹھیک کر دے گا۔",
        "بعد میں اپنا احساس محسوس کریں، بغیر کسی فیصلے کے۔",
      ],
    },
    relatedThemes: ["hardship", "loss", "patience"],
  },
  {
    slug: "progressive-muscle-relaxation",
    image: "oceanSunrise",
    stepIcons: ["seated", "muscleToes", "muscleLegs", "muscleHands", "muscleShoulders", "muscleFace", "calmFinish"],
    en: {
      name: "Progressive muscle relaxation",
      summary: "Tense each muscle group for a few seconds, then release, working through the body from feet to head.",
      notes: "A physical way to notice the difference between tension and relaxation. Skip any area with pain or injury.",
      steps: [
        "Sit or lie down somewhere comfortable and take a few slow breaths.",
        "Curl your toes tightly for about 5 seconds, then release and notice the difference.",
        "Tense your calves and thighs for 5 seconds, then let go.",
        "Clench your hands and forearms for 5 seconds, then release.",
        "Raise your shoulders toward your ears for 5 seconds, then drop them.",
        "Gently scrunch your face muscles for 5 seconds, then soften them.",
        "Take one slow breath and notice how your body feels overall.",
      ],
    },
    ur: {
      name: "بتدریج پٹھوں میں نرمی",
      summary: "ہر عضلاتی گروہ کو چند سیکنڈ کے لیے سخت کریں، پھر ڈھیلا چھوڑیں، پاؤں سے سر تک۔",
      notes: "تناؤ اور نرمی کے فرق کو محسوس کرنے کا ایک جسمانی طریقہ۔ درد یا چوٹ والے حصے کو نظرانداز کریں۔",
      steps: [
        "کسی آرام دہ جگہ بیٹھیں یا لیٹ جائیں اور چند آہستہ سانسیں لیں۔",
        "اپنے پاؤں کی انگلیاں 5 سیکنڈ تک سختی سے موڑیں، پھر چھوڑ دیں اور فرق محسوس کریں۔",
        "اپنی پنڈلیوں اور رانوں کو 5 سیکنڈ تک سخت کریں، پھر ڈھیلا چھوڑیں۔",
        "اپنے ہاتھوں اور بازوؤں کو 5 سیکنڈ تک بھینچیں، پھر چھوڑ دیں۔",
        "اپنے کندھوں کو 5 سیکنڈ تک کانوں کی طرف اٹھائیں، پھر گرا دیں۔",
        "اپنے چہرے کے پٹھوں کو نرمی سے 5 سیکنڈ تک سکیڑیں، پھر نرم کریں۔",
        "ایک آہستہ سانس لیں اور محسوس کریں کہ آپ کا پورا جسم کیسا محسوس ہو رہا ہے۔",
      ],
    },
    relatedThemes: ["anxiety", "hardship"],
  },
  {
    slug: "mindful-walking",
    image: "forestBridge",
    stepIcons: ["pathChoose", "walking", "footStep", "thoughtCloud", "senseEar", "standStill"],
    en: {
      name: "Mindful walking",
      summary: "A short, slow walk where attention rests on physical sensation rather than thoughts.",
      notes: "Works indoors or outdoors and needs no equipment or special time - even 5 minutes counts.",
      steps: [
        "Choose a short path, indoors or outside, where you can walk slowly for a few minutes.",
        "Begin walking slower than usual, noticing your feet touching the ground.",
        "Notice the shift of weight from one foot to the other with each step.",
        "When your mind wanders to thoughts, gently bring attention back to your feet and legs.",
        "Notice the air on your skin and any sounds around you without needing to react to them.",
        "End by standing still for a moment before continuing your day.",
      ],
    },
    ur: {
      name: "ذہن نشین چہل قدمی",
      summary: "ایک مختصر، آہستہ چہل قدمی جہاں توجہ خیالات کی بجائے جسمانی احساس پر رہتی ہے۔",
      notes: "گھر کے اندر یا باہر کام کرتی ہے اور کسی سامان یا خاص وقت کی ضرورت نہیں - 5 منٹ بھی کافی ہیں۔",
      steps: [
        "ایک مختصر راستہ منتخب کریں، گھر کے اندر یا باہر، جہاں آپ چند منٹ آہستہ چل سکیں۔",
        "معمول سے آہستہ چلنا شروع کریں، اپنے پاؤں کے زمین کو چھونے کو محسوس کریں۔",
        "ہر قدم کے ساتھ ایک پاؤں سے دوسرے پاؤں پر وزن کی تبدیلی محسوس کریں۔",
        "جب ذہن خیالات کی طرف بھٹکے تو نرمی سے توجہ واپس پاؤں اور ٹانگوں کی طرف لائیں۔",
        "اپنی جلد پر ہوا اور ارد گرد کی آوازوں کو بغیر ردعمل کے محسوس کریں۔",
        "اپنے دن کو جاری رکھنے سے پہلے ایک لمحے کے لیے ساکت کھڑے ہو کر ختم کریں۔",
      ],
    },
    relatedThemes: ["hardship", "patience"],
  },
  {
    slug: "slow-exhale-breathing",
    image: "forestCreek",
    stepIcons: ["seated", "breatheIn", "breatheOut", "repeatCycle"],
    en: {
      name: "Slow exhale breathing",
      summary: "Breathe out for longer than you breathe in to help the body settle.",
      notes: "A quick way to calm the nervous system before sleep or during stress. Stop if you feel dizzy or lightheaded.",
      steps: [
        "Sit or lie down comfortably and let your shoulders drop.",
        "Breathe in gently through your nose for a count of 4.",
        "Breathe out slowly through your mouth or nose for a count of 6, as if blowing through a straw.",
        "Repeat for 8 to 10 breaths, keeping each out-breath a little longer and softer than the in-breath.",
      ],
    },
    ur: {
      name: "آہستہ سانس باہر نکالنا",
      summary: "جسم کو پرسکون کرنے کے لیے سانس باہر نکالنے کا دورانیہ اندر لینے سے زیادہ رکھیں۔",
      notes: "نیند سے پہلے یا دباؤ کے دوران اعصابی نظام کو جلدی پرسکون کرنے کا طریقہ۔ چکر آئے تو رک جائیں۔",
      steps: [
        "آرام سے بیٹھیں یا لیٹ جائیں اور کندھوں کو ڈھیلا چھوڑیں۔",
        "ناک سے 4 گنتی تک نرمی سے سانس اندر لیں۔",
        "منہ یا ناک سے 6 گنتی تک آہستہ سانس باہر نکالیں، جیسے بھوسے کے ذریعے پھونک رہے ہوں۔",
        "8 سے 10 سانسوں تک دہرائیں، ہر سانس باہر نکالنے کو اندر لینے سے تھوڑا لمبا اور نرم رکھیں۔",
      ],
    },
    relatedThemes: ["anxiety", "frustration"],
  },
  {
    slug: "physiological-sigh",
    image: "goldenSea",
    stepIcons: ["breatheIn", "holdPause", "breatheOut", "repeatCycle"],
    en: {
      name: "Physiological sigh",
      summary: "Two short inhales through the nose, then one long, slow exhale through the mouth.",
      notes: "Backed by research for fast relief from acute stress. Repeat only a few rounds.",
      steps: [
        "Take a normal breath in through your nose.",
        "At the top of that breath, take a second, shorter sip of air on top of it.",
        "Let out a long, slow breath through your mouth.",
        "Repeat 2 to 5 times, noticing your heart rate settle.",
      ],
    },
    ur: {
      name: "فزیالوجیکل آہ",
      summary: "ناک سے دو مختصر سانسیں اندر، پھر منہ سے ایک لمبی، آہستہ سانس باہر۔",
      notes: "اچانک دباؤ سے جلد سکون کے لیے تحقیق کی حمایت یافتہ۔ صرف چند بار دہرائیں۔",
      steps: [
        "ناک سے ایک معمول کی سانس اندر لیں۔",
        "اس سانس کے اختتام پر، اوپر سے ایک اور مختصر سانس لیں۔",
        "منہ سے ایک لمبی، آہستہ سانس باہر نکالیں۔",
        "2 سے 5 بار دہرائیں اور اپنی دل کی دھڑکن کو پرسکون ہوتا محسوس کریں۔",
      ],
    },
    relatedThemes: ["anxiety", "frustration"],
  },
  {
    slug: "loving-kindness-meditation",
    image: "sunlitPathway",
    stepIcons: ["seated", "thoughtCloud", "openHand", "peopleGroup", "calmFinish"],
    en: {
      name: "Loving-kindness meditation",
      summary: "Silently repeat phrases of goodwill, starting with yourself and extending outward.",
      notes: "Can ease self-criticism, loneliness, and anger. If kindness toward yourself feels hard, start with someone you love easily.",
      steps: [
        "Sit comfortably and bring to mind a sense of warmth.",
        "Silently repeat: 'May I be safe. May I be healthy. May I be at peace.'",
        "Bring to mind someone you love, and repeat the phrases for them.",
        "Extend the phrases to a neutral person, then someone you find difficult, then all people.",
        "Return attention to yourself for a final round before finishing.",
      ],
    },
    ur: {
      name: "محبت و شفقت کا مراقبہ",
      summary: "خود سے شروع کرتے ہوئے نیک خواہشات کے جملے خاموشی سے دہرائیں اور باہر کی طرف بڑھائیں۔",
      notes: "خود تنقیدی، تنہائی، اور غصے کو کم کر سکتا ہے۔ اگر خود سے محبت مشکل لگے تو کسی ایسے شخص سے شروع کریں جس سے آپ آسانی سے محبت کرتے ہیں۔",
      steps: [
        "آرام سے بیٹھیں اور دل میں گرمجوشی کا احساس لائیں۔",
        "خاموشی سے دہرائیں: 'میں محفوظ رہوں۔ میں صحت مند رہوں۔ میں پرسکون رہوں۔'",
        "کسی عزیز کو ذہن میں لائیں اور ان کے لیے یہی جملے دہرائیں۔",
        "یہ جملے کسی غیر جانبدار شخص، پھر کسی مشکل شخص، پھر تمام لوگوں کے لیے بڑھائیں۔",
        "ختم کرنے سے پہلے آخری بار توجہ خود کی طرف واپس لائیں۔",
      ],
    },
    relatedThemes: ["grief", "loss", "frustration"],
  },
  {
    slug: "stop-practice",
    image: "mistyMountains",
    stepIcons: ["standStill", "breatheIn", "headFocus", "pathChoose"],
    en: {
      name: "STOP practice",
      summary: "A one-minute pause to interrupt automatic reactions during busy or stressful moments.",
      notes: "Useful anywhere, any time - no equipment needed.",
      steps: [
        "Stop whatever you're doing for a moment.",
        "Take one slow breath.",
        "Observe what's happening in your body, emotions, and thoughts, without judging it.",
        "Proceed with something helpful, chosen deliberately rather than automatically.",
      ],
    },
    ur: {
      name: "رکو مشق (STOP)",
      summary: "مصروف یا دباؤ کے لمحات میں خودکار ردعمل کو روکنے کے لیے ایک منٹ کا وقفہ۔",
      notes: "کہیں بھی، کسی بھی وقت مفید - کسی سامان کی ضرورت نہیں۔",
      steps: [
        "جو کچھ بھی کر رہے ہیں، ایک لمحے کے لیے رک جائیں۔",
        "ایک آہستہ سانس لیں۔",
        "اپنے جسم، جذبات، اور خیالات میں جو ہو رہا ہے اسے بغیر فیصلہ کیے محسوس کریں۔",
        "جان بوجھ کر کوئی مددگار قدم اٹھائیں، خودکار ردعمل کی بجائے۔",
      ],
    },
    relatedThemes: ["frustration", "anxiety"],
  },
  {
    slug: "alternate-nostril-breathing",
    image: "forestPath",
    stepIcons: ["seated", "breatheIn", "breatheOut", "repeatCycle", "calmFinish"],
    en: {
      name: "Alternate nostril breathing",
      summary: "A slow, balancing breath practice that alternates between nostrils.",
      notes: "A traditional calming technique. Breathe gently - never force or strain the breath. Skip if you have a blocked nose.",
      steps: [
        "Sit comfortably with your spine upright.",
        "Close your right nostril with your thumb and breathe in slowly through your left nostril.",
        "Close your left nostril with a finger, release your thumb, and breathe out through your right nostril.",
        "Breathe in through your right nostril, then switch and breathe out through your left.",
        "Continue alternating for 5 to 10 rounds, keeping the breath slow and unforced.",
      ],
    },
    ur: {
      name: "متبادل نتھنوں سے سانس",
      summary: "ایک آہستہ، متوازن سانس کی مشق جو نتھنوں کے درمیان تبدیل ہوتی رہتی ہے۔",
      notes: "ایک روایتی پرسکون تکنیک۔ سانس کو نرمی سے لیں - کبھی زور نہ لگائیں۔ اگر ناک بند ہو تو یہ مشق نہ کریں۔",
      steps: [
        "سیدھی کمر کے ساتھ آرام سے بیٹھیں۔",
        "انگوٹھے سے دائیں نتھنے کو بند کریں اور بائیں نتھنے سے آہستہ سانس اندر لیں۔",
        "انگلی سے بائیں نتھنے کو بند کریں، انگوٹھا ہٹائیں، اور دائیں نتھنے سے سانس باہر نکالیں۔",
        "دائیں نتھنے سے سانس اندر لیں، پھر بدل کر بائیں سے باہر نکالیں۔",
        "5 سے 10 بار تبدیل کرتے رہیں، سانس کو آہستہ اور بغیر زور کے رکھیں۔",
      ],
    },
    relatedThemes: ["anxiety", "patience"],
  },
  {
    slug: "counting-breath",
    image: "mountainLake",
    stepIcons: ["seated", "breatheIn", "thoughtCloud", "repeatCycle"],
    en: {
      name: "Counting breath",
      summary: "Count each breath to anchor a wandering mind in something simple and present.",
      notes: "A good starting practice for beginners. Losing count and starting over is part of the practice, not a failure.",
      steps: [
        "Sit comfortably and let your breathing settle into its natural rhythm.",
        "Silently count '1' as you breathe in, and '2' as you breathe out.",
        "Continue counting up to 10, then start again from 1.",
        "When your mind wanders, gently notice it happened and return to counting from 1.",
      ],
    },
    ur: {
      name: "سانسوں کی گنتی",
      summary: "بھٹکتے ذہن کو کسی سادہ اور موجودہ چیز میں ٹھہرانے کے لیے ہر سانس کو گنیں۔",
      notes: "شروعات کرنے والوں کے لیے ایک اچھی مشق۔ گنتی بھول جانا اور دوبارہ شروع کرنا مشق کا حصہ ہے، ناکامی نہیں۔",
      steps: [
        "آرام سے بیٹھیں اور سانس کو اپنی قدرتی تال میں آنے دیں۔",
        "سانس اندر لیتے ہوئے خاموشی سے '1' اور باہر نکالتے ہوئے '2' گنیں۔",
        "10 تک گنتی جاری رکھیں، پھر دوبارہ 1 سے شروع کریں۔",
        "جب ذہن بھٹکے تو نرمی سے محسوس کریں اور دوبارہ 1 سے گننا شروع کریں۔",
      ],
    },
    relatedThemes: ["anxiety", "patience"],
  },
  {
    slug: "gratitude-reflection",
    image: "goldenField",
    stepIcons: ["notebook", "thoughtCloud", "openHand", "calmFinish", "breatheOut"],
    en: {
      name: "Gratitude reflection",
      summary: "Bring to mind a few specific things you're grateful for, and notice how they feel in the body.",
      notes: "Works best when specific rather than general - 'my sister called me today' rather than 'my family'.",
      steps: [
        "Sit quietly and take a few slow breaths.",
        "Bring to mind three specific things from the last day or two that you're grateful for.",
        "For each one, notice any warmth, ease, or lightness you feel in your body.",
        "If nothing comes to mind, it's okay - even noticing one small, ordinary thing counts.",
        "Close by taking one more slow breath before continuing your day.",
      ],
    },
    ur: {
      name: "شکرگزاری پر غور",
      summary: "چند مخصوص چیزوں کو یاد کریں جن کے آپ شکرگزار ہیں، اور محسوس کریں کہ جسم میں کیسا احساس ہوتا ہے۔",
      notes: "عمومی باتوں کی بجائے مخصوص باتوں پر بہتر کام کرتا ہے - 'میری بہن نے آج فون کیا' بمقابلہ 'میرا خاندان'۔",
      steps: [
        "خاموشی سے بیٹھیں اور چند آہستہ سانسیں لیں۔",
        "گزشتہ ایک دو دن کی تین مخصوص چیزیں یاد کریں جن کے آپ شکرگزار ہیں۔",
        "ہر ایک کے لیے، جسم میں محسوس ہونے والی گرمجوشی، سکون، یا ہلکا پن محسوس کریں۔",
        "اگر کچھ ذہن میں نہ آئے تو کوئی بات نہیں - ایک چھوٹی، معمولی چیز کو محسوس کرنا بھی کافی ہے۔",
        "اپنے دن کو جاری رکھنے سے پہلے ایک اور آہستہ سانس لے کر ختم کریں۔",
      ],
    },
    relatedThemes: ["hardship", "grief", "patience"],
  },
  {
    slug: "urge-surfing",
    image: "foggyValley",
    stepIcons: ["headFocus", "breatheIn", "gauge", "calmFinish", "reflect"],
    en: {
      name: "Urge surfing",
      summary: "Ride out a craving or urge by observing it rise and fall, rather than acting on it or fighting it.",
      notes: "Drawn from mindfulness-based relapse prevention. Useful for cravings or the pull toward a habit you're trying to change - seek professional support alongside this for serious urges.",
      steps: [
        "When you notice an urge, pause rather than acting on it immediately.",
        "Notice where you feel it in your body, and what it actually feels like - tightness, heat, restlessness.",
        "Imagine the urge as a wave: it builds, peaks, and then naturally falls, usually within 20-30 minutes.",
        "Breathe slowly and let the wave move through you without judging yourself for having it.",
        "Remind yourself that urges pass whether or not you act on them.",
      ],
    },
    ur: {
      name: "خواہش کی لہر کو گزرنے دینا",
      summary: "کسی خواہش یا تڑپ پر عمل کیے یا اس سے لڑے بغیر، اسے بڑھتے اور گھٹتے ہوئے محسوس کریں۔",
      notes: "مائنڈ فلنس پر مبنی ریلیپس روک تھام سے ماخوذ۔ کسی لت یا عادت بدلنے کی کوشش کے لیے مفید - شدید خواہشات کے لیے پیشہ ورانہ مدد بھی حاصل کریں۔",
      steps: [
        "جب کوئی خواہش محسوس ہو تو فوراً عمل کرنے کی بجائے رک جائیں۔",
        "محسوس کریں کہ یہ جسم میں کہاں محسوس ہوتی ہے اور کیسی لگتی ہے - سختی، گرمی، بےچینی۔",
        "خواہش کو ایک لہر کی طرح تصور کریں: یہ بڑھتی ہے، عروج پر پہنچتی ہے، پھر قدرتی طور پر کم ہو جاتی ہے، عام طور پر 20-30 منٹ میں۔",
        "آہستہ سانس لیں اور لہر کو بغیر خود پر تنقید کیے گزرنے دیں۔",
        "اپنے آپ کو یاد دلائیں کہ خواہشات، عمل کرنے یا نہ کرنے سے، گزر جاتی ہیں۔",
      ],
    },
    relatedThemes: ["frustration", "hardship"],
  },
  {
    slug: "self-compassion-break",
    image: "oceanSunrise",
    stepIcons: ["openHand", "thoughtCloud", "peopleGroup", "calmFinish"],
    en: {
      name: "Self-compassion break",
      summary: "A short practice to meet a hard moment with kindness instead of self-criticism.",
      notes: "Based on Kristin Neff's self-compassion research. Especially useful after a mistake or setback.",
      steps: [
        "Place a hand on your chest or another comforting spot, if that feels okay.",
        "Silently acknowledge: 'This is a moment of difficulty.'",
        "Remind yourself: 'Difficulty is part of being human - I'm not alone in this.'",
        "Ask yourself what you need to hear right now, and offer yourself that kindness: 'May I be kind to myself.'",
      ],
    },
    ur: {
      name: "خود ہمدردی کا وقفہ",
      summary: "مشکل لمحے کا سامنا خود تنقید کی بجائے نرمی سے کرنے کی ایک مختصر مشق۔",
      notes: "کرسٹن نیف کی خود ہمدردی سے متعلق تحقیق پر مبنی۔ غلطی یا ناکامی کے بعد خاص طور پر مفید۔",
      steps: [
        "اگر آرام دہ لگے تو ایک ہاتھ اپنے سینے یا کسی اور آرام دہ جگہ پر رکھیں۔",
        "خاموشی سے تسلیم کریں: 'یہ ایک مشکل لمحہ ہے۔'",
        "اپنے آپ کو یاد دلائیں: 'مشکل انسان ہونے کا حصہ ہے - میں اس میں اکیلا نہیں ہوں۔'",
        "اپنے آپ سے پوچھیں کہ آپ کو ابھی کیا سننے کی ضرورت ہے، اور وہ نرمی خود کو دیں: 'میں خود پر مہربان رہوں۔'",
      ],
    },
    relatedThemes: ["grief", "hardship", "frustration"],
  },
  {
    slug: "mindful-daily-moment",
    image: "pebbleCircle",
    stepIcons: ["senseHand", "senseNose", "senseMouth", "calmFinish"],
    en: {
      name: "Everyday mindfulness",
      summary: "Turn one routine moment - tea, wudu, washing hands - into a short mindfulness practice.",
      notes: "No extra time needed - it uses a moment already in your day. For many Muslim users, wudu and salah naturally fit this kind of present-moment attention.",
      steps: [
        "Pick one small routine you already do today: making tea, washing your hands, or wudu.",
        "As you do it, notice the temperature, texture, and sounds involved.",
        "When your mind drifts to other thoughts, gently bring it back to the sensations of the activity.",
        "Let the activity take the time it naturally takes, without rushing it.",
      ],
    },
    ur: {
      name: "روزمرہ کی ذہن نشینی",
      summary: "دن کے کسی ایک معمول کے لمحے - چائے، وضو، ہاتھ دھونا - کو ایک مختصر مراقبے میں بدلیں۔",
      notes: "اضافی وقت کی ضرورت نہیں - یہ آپ کے دن میں پہلے سے موجود ایک لمحہ استعمال کرتا ہے۔ بہت سے مسلمان صارفین کے لیے وضو اور نماز قدرتی طور پر اس قسم کی موجودہ لمحے کی توجہ کے مطابق ہیں۔",
      steps: [
        "آج کے دن کا کوئی چھوٹا معمول منتخب کریں: چائے بنانا، ہاتھ دھونا، یا وضو۔",
        "یہ کرتے ہوئے، درجہ حرارت، ساخت، اور آوازوں کو محسوس کریں۔",
        "جب ذہن دوسرے خیالات کی طرف بھٹکے تو نرمی سے اسے سرگرمی کے احساسات کی طرف واپس لائیں۔",
        "سرگرمی کو اس کا قدرتی وقت لینے دیں، جلدی کیے بغیر۔",
      ],
    },
    relatedThemes: ["patience", "hardship"],
  },
];

export function getTechnique(slug: string) {
  return techniques.find((technique) => technique.slug === slug);
}
