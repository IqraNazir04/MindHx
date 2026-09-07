import type { naturePhotos } from "../components/naturePhotos";

export type Technique = {
  slug: string;
  image: keyof typeof naturePhotos;
  en: { name: string; summary: string; notes: string; steps: string[] };
  ur: { name: string; summary: string; notes: string; steps: string[] };
  relatedThemes: string[];
};

export const techniques: Technique[] = [
  {
    slug: "box-breathing",
    image: "grassBreeze",
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
];

export function getTechnique(slug: string) {
  return techniques.find((technique) => technique.slug === slug);
}
