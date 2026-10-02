"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DoodleCloud, DoodleSun, DoodleWave } from "./components/Doodles";
import NatureBanner from "./components/NatureBanner";
import { naturePhotos } from "./components/naturePhotos";
import SiteFooter from "./components/SiteFooter";
import AccountChip from "./components/AccountChip";
import FeatureCarousel from "./components/FeatureCarousel";
import InnovationGrid from "./components/InnovationGrid";
import { ClinicalSignalGraphic, VoiceSignalGraphic, WordsSignalGraphic } from "./components/SignalGraphics";
import VoiceEmotionBars, { type VoiceEmotion } from "./components/VoiceEmotionBars";
import TextMoodBars, { type TextMoodScores } from "./components/TextMoodBars";
import { fetchCheckInEligibility, isLoggedIn, saveCheckIn, type CheckInEligibility } from "./lib/auth";
import { API_BASE } from "./lib/api";
import { answerOptions, gadQuestions, gadQuestionsEn, k10Options, k10Questions, k10QuestionsEn, questions, questionsEn } from "./lib/questionnaires";

const copy = {
  English: {
    eyebrow: "EARLY SIGNALS, HUMAN CARE", title: "Check in with yourself.", intro: "A quiet, private way to notice changes in how you're feeling. MindHx brings together your voice, words, and a short clinical questionnaire.", ready: "Session ready", private: "Private & secure", sound: "How you sound", soundDescription: "Share a short voice note in English or Urdu. We listen for changes in vocal patterns, not the words themselves.", record: "Record a voice note", stop: "Stop recording", listening: "Listening... tap to finish", processing: "Transcribing securely...", recordingHint: "Up to 60 seconds · Nothing is saved", transcriptReady: "Transcript added below", voiceError: "Microphone or transcription unavailable", words: "What you say", wordsDescription: "Write a little about how things have been lately. Be as brief or open as feels right.", placeholder: "I've been feeling...", optional: "Required", speakUrdu: "Hear this in Urdu", speaking: "Generating Urdu voice...", speechError: "Urdu voice generation unavailable", submitText: "Submit", submittingText: "Analyzing...", textSentiment: "Sentiment read", textSubmitHint: "Sent for analysis only - never saved to a database.", clinical: "Clinical check-in", clinicalDescription: "The PHQ-9 is a validated questionnaire used by healthcare professionals. Think about the last two weeks.", question: "QUESTION", back: "Back", next: "Next test", review: "Review answers", estimate: "LIVE ESTIMATE", picture: "Your combined picture", pictureDescription: "Complete your check-in to see how the signals come together.", seeCheckIn: "See my check-in", disclaimer: "MindHx is a screening and triage aid, not a diagnosis. Your results are a starting point for a conversation with a qualified professional.", modalEyebrow: "YOUR PRIVATE CHECK-IN", modalTitle: "Your signals are ready to review.", modalDescription: "MindHx combines the three signals into an explainable estimate. A professional should interpret this result with you.", modalScore: "estimated signal strength", continue: "Continue to results", bannerCaption: "Slow down. Notice the signal.", aboutEyebrow: "ABOUT MINDHX", aboutTitle: "Understanding MindHx",
    heroTitleA: "Notice the signal.", heroTitleB: "Keep the human.", voiceOptional: "Optional", recordingHintFull: "Up to 60 seconds · stops automatically · the audio itself is never saved", voiceTone: "Voice tone", wordChoice: "Word-choice breakdown", signInToView: "Sign in or create an account to view your results.",
    contextKicker: "PRIVATE SESSION CONTEXT", contextReady: "Your context is ready for this session.", contextPrompt: "Personal context helps MindHx tailor support.", contextBody: "Only age range, optional gender, relationship status, and life context are used, in memory, for this session - they are not saved to your account.", contextEdit: "Edit context", contextSet: "Set session context",
    modalContextTitle: "Share only what helps.", modalContextBody: "These fields are optional except age range. They stay in memory for this session and are not saved to your account.", ageRange: "Age range", genderOptional: "Gender (optional)", relationship: "Relationship status", lifeContext: "Life context (optional)", preferNot: "Prefer not to say", updateContext: "Update session context", continuePrivately: "Continue privately", modalAuthA: "Sign in", modalAuthOr: "or", modalAuthB: "create an account", modalAuthC: "to view your check-in results and save your history.", closeLabel: "Close", openProfile: "Open private profile",
    options: { Woman: "Woman", Man: "Man", "Non-binary": "Non-binary", "Prefer not to say": "Prefer not to say", Single: "Single", Partnered: "Partnered", Married: "Married", Student: "Student", Working: "Working", Retired: "Retired", "Between roles": "Between roles", Caregiving: "Caregiving" }
  },
  اردو: {
    eyebrow: "ابتدائی اشارے، انسانی نگہداشت", title: "اپنا حال جانچیں۔", intro: "اپنی کیفیت میں آنے والی تبدیلیوں کو سمجھنے کا ایک پُرسکون اور نجی طریقہ۔ MindHx آپ کی آواز، الفاظ اور مختصر طبی سوالنامے کو یکجا کرتا ہے۔", ready: "سیشن تیار ہے", private: "نجی اور محفوظ", sound: "آپ کی آواز", soundDescription: "انگریزی یا اردو میں ایک مختصر صوتی پیغام ریکارڈ کریں۔ ہم الفاظ کے بجائے آواز کے انداز میں آنے والی تبدیلیوں کو دیکھتے ہیں۔", record: "صوتی پیغام ریکارڈ کریں", stop: "ریکارڈنگ روکیں", listening: "سن رہے ہیں... مکمل کرنے کے لیے دبائیں", processing: "محفوظ طریقے سے متن تیار کیا جا رہا ہے...", recordingHint: "60 سیکنڈ تک · کچھ محفوظ نہیں کیا جاتا", transcriptReady: "متن نیچے شامل کر دیا گیا ہے", voiceError: "مائیکروفون یا متن کی سہولت دستیاب نہیں", words: "آپ کے الفاظ", wordsDescription: "حال ہی میں آپ کیسا محسوس کر رہے ہیں، اس کے بارے میں کچھ لکھیں۔ جتنا مناسب لگے اتنا ہی لکھیں۔", placeholder: "میں محسوس کر رہا/رہی ہوں...", optional: "ضروری", speakUrdu: "یہ اردو میں سنیں", speaking: "اردو آواز تیار ہو رہی ہے...", speechError: "اردو آواز دستیاب نہیں", submitText: "جمع کریں", submittingText: "تجزیہ ہو رہا ہے...", textSentiment: "جذباتی کیفیت", textSubmitHint: "صرف تجزیے کے لیے بھیجا گیا - کبھی ڈیٹا بیس میں محفوظ نہیں کیا جاتا۔", clinical: "طبی جائزہ", clinicalDescription: "PHQ-9 ایک مستند سوالنامہ ہے جسے ماہرین صحت استعمال کرتے ہیں۔ گزشتہ دو ہفتوں کے بارے میں سوچیں۔", question: "سوال", back: "واپس", next: "اگلا ٹیسٹ", review: "جوابات کا جائزہ", estimate: "موجودہ اندازہ", picture: "آپ کی مجموعی کیفیت", pictureDescription: "اپنا جائزہ مکمل کریں تاکہ تمام اشارے ایک ساتھ دیکھے جا سکیں۔", seeCheckIn: "میرا جائزہ دیکھیں", disclaimer: "MindHx ایک ابتدائی اسکریننگ اور رہنمائی کا ذریعہ ہے، تشخیص نہیں۔ آپ کے نتائج کسی مستند ماہر سے گفتگو کا آغاز ہیں۔ سوالنامے کا اردو متن اس سیشن کے لیے ترجمہ کیا گیا ہے؛ حتمی الفاظ کے لیے انگریزی نسخہ ملاحظہ کریں۔", modalEyebrow: "آپ کا نجی جائزہ", modalTitle: "آپ کے اشارے جائزے کے لیے تیار ہیں۔", modalDescription: "MindHx تینوں اشاروں کو ایک قابلِ وضاحت اندازے میں یکجا کرتا ہے۔ اس نتیجے کی تشریح کسی ماہر کو آپ کے ساتھ کرنی چاہیے۔", modalScore: "اندازاً سگنل کی شدت", continue: "نتائج کی طرف جائیں", bannerCaption: "آہستہ چلیں۔ اشارے کو محسوس کریں۔", aboutEyebrow: "MindHx کے بارے میں", aboutTitle: "MindHx کو سمجھنا",
    heroTitleA: "اشارے کو پہچانیں۔", heroTitleB: "انسانی رابطہ برقرار رکھیں۔", voiceOptional: "اختیاری", recordingHintFull: "60 سیکنڈ تک · خود بخود رک جاتا ہے · آواز کبھی محفوظ نہیں کی جاتی", voiceTone: "آواز کا انداز", wordChoice: "الفاظ کے انتخاب کا جائزہ", signInToView: "نتائج دیکھنے کے لیے سائن ان کریں یا اکاؤنٹ بنائیں۔",
    contextKicker: "نجی سیشن کا سیاق", contextReady: "اس سیشن کے لیے آپ کا سیاق تیار ہے۔", contextPrompt: "ذاتی سیاق MindHx کو بہتر مدد دینے میں مدد کرتا ہے۔", contextBody: "صرف عمر کی حد، اور اختیاری طور پر جنس، ازدواجی حیثیت اور زندگی کی صورتحال، اسی سیشن کے دوران استعمال ہوتی ہیں - یہ آپ کے اکاؤنٹ میں محفوظ نہیں ہوتیں۔", contextEdit: "سیاق میں ترمیم کریں", contextSet: "سیشن کا سیاق طے کریں",
    modalContextTitle: "صرف وہی بتائیں جو مددگار ہو۔", modalContextBody: "عمر کی حد کے علاوہ یہ تمام خانے اختیاری ہیں۔ یہ صرف اسی سیشن کے دوران یادداشت میں رہتے ہیں اور آپ کے اکاؤنٹ میں محفوظ نہیں ہوتے۔", ageRange: "عمر کی حد", genderOptional: "جنس (اختیاری)", relationship: "ازدواجی حیثیت", lifeContext: "زندگی کی صورتحال (اختیاری)", preferNot: "بتانا نہیں چاہتے", updateContext: "سیشن کا سیاق اپ ڈیٹ کریں", continuePrivately: "نجی طور پر جاری رکھیں", modalAuthA: "سائن ان کریں", modalAuthOr: "یا", modalAuthB: "اکاؤنٹ بنائیں", modalAuthC: "تاکہ اپنے جائزے کے نتائج دیکھ سکیں اور اپنی تاریخ محفوظ کر سکیں۔", closeLabel: "بند کریں", openProfile: "نجی پروفائل کھولیں",
    options: { Woman: "خاتون", Man: "مرد", "Non-binary": "نان بائنری", "Prefer not to say": "بتانا نہیں چاہتے", Single: "غیر شادی شدہ", Partnered: "رشتے میں", Married: "شادی شدہ", Student: "طالب علم", Working: "ملازمت پیشہ", Retired: "ریٹائرڈ", "Between roles": "فی الحال بے روزگار", Caregiving: "نگہداشت کرنے والے" }
  }
};

type AboutSection = { image: keyof typeof naturePhotos; en: { title: string; body: string[] }; ur: { title: string; body: string[] } };

const ABOUT_SECTIONS: AboutSection[] = [
  {
    image: "mistyMountains",
    en: {
      title: "Why this exists",
      body: [
        "Depression, anxiety, and related conditions are common, but the first conversation about them rarely feels easy to start. In much of Pakistan and beyond, seeking help is sometimes read as weakness or private shame - something to manage quietly rather than an ordinary health matter to bring to a professional. Add limited access to psychiatrists and psychologists outside major cities, long waitlists even where care exists, and a lot of people never take a first screening step - not because they don't want support, but because the step itself feels too large to start.",
        "MindHx exists to make that step smaller. It replaces “I should probably talk to someone eventually” with a private, five-minute check-in you can do from a phone or laptop tonight - no appointment, no waiting room, no one else needing to know unless you choose to tell them. It is not a diagnosis and it does not pretend to be one. It is a starting point: something concrete to notice about yourself, and, if it matters, something concrete to bring into a real conversation with a real clinician.",
      ],
    },
    ur: {
      title: "یہ کیوں موجود ہے",
      body: [
        "ڈپریشن، اضطراب، اور اس سے ملتی جلتی کیفیات عام ہیں، لیکن ان کے بارے میں پہلی بات کرنا شاذ و نادر ہی آسان محسوس ہوتا ہے۔ پاکستان اور دیگر کئی جگہوں پر، مدد لینا کبھی کبھار کمزوری یا ذاتی شرمندگی سمجھا جاتا ہے - ایک عام صحت کے معاملے کی بجائے کچھ ایسا جسے خاموشی سے سنبھالنا ہے۔ اس پر بڑے شہروں سے باہر ماہرینِ نفسیات اور سائیکاٹرسٹس تک محدود رسائی اور طویل انتظار کا اضافہ کر دیں تو بہت سے لوگ کبھی پہلا اسکریننگ قدم نہیں اٹھاتے - اس لیے نہیں کہ وہ مدد نہیں چاہتے، بلکہ اس لیے کہ یہ قدم خود بہت بڑا محسوس ہوتا ہے۔",
        "MindHx اسی قدم کو چھوٹا بنانے کے لیے موجود ہے۔ یہ 'مجھے کبھی نہ کبھی کسی سے بات کرنی چاہیے' کو ایک نجی، پانچ منٹ کے چیک ان سے بدل دیتا ہے جو آپ آج رات اپنے فون یا لیپ ٹاپ سے کر سکتے ہیں - کوئی ملاقات نہیں، کوئی انتظار گاہ نہیں، اور جب تک آپ خود نہ بتائیں کسی اور کو جاننے کی ضرورت نہیں۔ یہ تشخیص نہیں ہے اور نہ ہی ہونے کا دعویٰ کرتا ہے۔ یہ ایک نقطہ آغاز ہے: اپنے بارے میں کچھ ٹھوس محسوس کرنا، اور اگر ضرورت ہو تو کسی حقیقی معالج کے ساتھ حقیقی گفتگو میں لے جانے کے لیے کچھ ٹھوس۔",
      ],
    },
  },
  {
    image: "forestCreek",
    en: {
      title: "How the three signals work together",
      body: [
        "Most self-assessments ask one kind of question and stop there - a mood questionnaire, a chatbot, or a wearable's guess from your heart rate. MindHx instead treats a check-in as three separate signals that don't always agree: how you sound (pause patterns, loudness variability, speaking pace), what you actually say in your own words rather than a multiple-choice answer, and how you score on PHQ-9, GAD-7, and K10 - the same validated questionnaires clinicians already use in practice.",
        "Each signal is scored on its own first, then combined into one weighted estimate. The combination isn't a black box: the results page shows exactly how much each signal contributed to the final number, using an additive model where each term's share is the real, mathematically exact contribution - not an approximate explanation added after the fact. If your voice sounded flat but your questionnaire answers were mild, or the other way around, you'll see that tension laid out honestly, not smoothed away inside a single tidy number.",
      ],
    },
    ur: {
      title: "تینوں اشارے مل کر کیسے کام کرتے ہیں",
      body: [
        "زیادہ تر خود جائزے ایک ہی طرح کے سوالات پوچھ کر رک جاتے ہیں - ایک موڈ سوالنامہ، ایک چیٹ بوٹ، یا کسی پہننے والے آلے کا دل کی دھڑکن سے اندازہ۔ MindHx اس کے برعکس ایک چیک ان کو تین الگ الگ اشاروں کے طور پر دیکھتا ہے جو ہمیشہ ایک دوسرے سے متفق نہیں ہوتے: آپ کیسے بولتے ہیں (خاموشی کے وقفے، آواز کی بلندی میں تبدیلی، بولنے کی رفتار)، آپ اصل میں اپنے الفاظ میں کیا کہتے ہیں (کثیر انتخابی جواب کی بجائے)، اور PHQ-9، GAD-7، اور K10 پر آپ کا اسکور - وہی مستند سوالنامے جو معالجین پہلے سے استعمال کرتے ہیں۔",
        "ہر اشارے کا پہلے الگ سے جائزہ لیا جاتا ہے، پھر انہیں ایک وزنی اندازے میں یکجا کیا جاتا ہے۔ یہ یکجائی ایک بند ڈبہ نہیں - نتائج کا صفحہ بالکل دکھاتا ہے کہ حتمی نمبر میں ہر اشارے کا کتنا حصہ تھا، ایک ایسے ماڈل کے ذریعے جس میں ہر حصے کا تناسب حقیقی، ریاضیاتی طور پر درست شراکت ہے - کوئی بعد میں جوڑی گئی تخمینی وضاحت نہیں۔ اگر آپ کی آواز بےرونق تھی مگر سوالنامے کے جوابات ہلکے تھے، یا اس کے برعکس، تو یہ تضاد ایمانداری سے سامنے آئے گا، ایک صاف نمبر کے اندر چھپایا نہیں جائے گا۔",
      ],
    },
  },
  {
    image: "goldenSea",
    en: {
      title: "What we never store",
      body: [
        "A screening tool that asks about your inner life only earns trust if it's honest about what happens to what you share. MindHx's default is to keep almost nothing. A voice note is analysed for acoustic features (pause ratio, loudness variability, speaking rate) and then discarded; MindHx never writes the audio to its database and no person listens to it. To turn speech into text and to read the tone of what you write, the audio and text are sent to OpenAI's API for processing - MindHx itself doesn't keep either one.",
        "Seeing your results needs an account, so they're there when you come back. What's saved to it is each check-in's overall score, risk band, detected themes, and each section's summary scores (for example your PHQ-9 total and band, or the voice and word-choice bars), along with your answer to each questionnaire item, which the MindHx team can review. Your transcript and typed words are never saved. That distinction is deliberate: a therapist you eventually sit down with should hear your story from you, in your own words and your own time, not have it pre-written by an app before you arrive.",
      ],
    },
    ur: {
      title: "ہم کبھی کیا محفوظ نہیں کرتے",
      body: [
        "ایک اسکریننگ ذریعہ جو آپ کی اندرونی زندگی کے بارے میں پوچھتا ہے وہ اعتماد تب ہی حاصل کرتا ہے جب وہ اس بارے میں ایماندار ہو کہ آپ کی بتائی گئی باتوں کا کیا ہوتا ہے۔ MindHx کا طریقہ کار تقریباً کچھ بھی محفوظ نہ رکھنا ہے۔ صوتی پیغام کو صوتی خصوصیات (خاموشی کا تناسب، آواز کی بلندی میں تبدیلی، بولنے کی رفتار) کے لیے پراسیس کیا جاتا ہے اور پھر ضائع کر دیا جاتا ہے؛ MindHx آواز کو کبھی اپنے ڈیٹا بیس میں محفوظ نہیں کرتا اور نہ ہی کوئی شخص اسے سنتا ہے۔ آواز کو متن میں بدلنے اور آپ کے لکھے ہوئے کے لہجے کو سمجھنے کے لیے آواز اور متن OpenAI کی API کو پراسیسنگ کے لیے بھیجے جاتے ہیں - MindHx خود ان میں سے کچھ بھی محفوظ نہیں رکھتا۔",
        "نتائج دیکھنے کے لیے اکاؤنٹ ضروری ہے، تاکہ واپس آنے پر وہ موجود ہوں۔ اس میں ہر چیک ان کا مجموعی اسکور، خطرے کا درجہ، شناخت شدہ موضوعات، اور ہر حصے کے خلاصہ اسکور (مثلاً آپ کا PHQ-9 کل اسکور اور درجہ، یا آواز اور الفاظ کے انتخاب کے خانے) محفوظ ہوتے ہیں، اور ساتھ ہی سوالنامے کے ہر سوال کا آپ کا جواب بھی، جسے MindHx کی ٹیم دیکھ سکتی ہے۔ آپ کا متن اور آپ کے لکھے الفاظ کبھی محفوظ نہیں کیے جاتے۔ یہ فرق جان بوجھ کر رکھا گیا ہے: جس معالج سے آپ بالآخر ملیں گے اسے آپ کی کہانی آپ سے، آپ کے اپنے الفاظ اور اپنے وقت میں سننی چاہیے، نہ کہ کسی ایپ کی طرف سے پہلے سے لکھی گئی۔",
      ],
    },
  },
  {
    image: "goldenField",
    en: {
      title: "From a private check-in to a real next step",
      body: [
        "A risk score by itself doesn't help anyone - what matters is what happens after it's shown to you. MindHx routes based on what it finds, not just what it scores. If PHQ-9's self-harm item or clear crisis language shows up when you ask for your results, emergency support comes first - ahead of any score, and without needing an account or a finished questionnaire - and the AI chat stops generating replies for the rest of that conversation.",
        "For everything else, the results page pairs your combined signal with a support plan matched to the themes it detected - grounding techniques for anxiety, small behavioral-activation steps for low motivation, pacing guidance after loss or trauma - alongside a bounded AI chat that answers orienting questions like “what does CBT actually involve” from a fixed reference library. When an AI model is configured, it words the reply conversationally, but only from that library and under strict rules: no diagnosis, no medication advice, and a fallback to the library text itself if a reply breaks those rules.",
        "When a real conversation with a professional is the right next step, MindHx tries to make that concrete too, rather than leaving it as vague advice: a city-by-city directory of verified psychiatric and psychological care in Pakistan, and a plain answer to what to actually say at a first appointment.",
      ],
    },
    ur: {
      title: "ایک نجی چیک ان سے ایک حقیقی اگلے قدم تک",
      body: [
        "صرف ایک خطرے کا اسکور کسی کی مدد نہیں کرتا - اہم بات یہ ہے کہ اسے دکھانے کے بعد کیا ہوتا ہے۔ MindHx اس کی بنیاد پر رہنمائی کرتا ہے جو اسے ملتا ہے، صرف اس پر نہیں جو وہ اسکور کرتا ہے۔ اگر نتائج مانگتے وقت PHQ-9 کا خود کو نقصان پہنچانے والا سوال یا واضح بحرانی زبان ظاہر ہو تو فوری مدد سب سے پہلے دکھائی جاتی ہے - کسی بھی اسکور سے پہلے، اور اکاؤنٹ یا مکمل سوالنامے کے بغیر بھی - اور AI چیٹ اس گفتگو میں مزید جوابات تیار کرنا بند کر دیتی ہے۔",
        "باقی تمام صورتوں میں، نتائج کا صفحہ آپ کے مجموعی اشارے کو شناخت شدہ موضوعات کے مطابق ایک معاون منصوبے سے جوڑتا ہے - اضطراب کے لیے گراؤنڈنگ تکنیکیں، کم حوصلے کے لیے چھوٹے عملی اقدامات، غم یا صدمے کے بعد رفتار کی رہنمائی - ساتھ ہی ایک محدود AI چیٹ جو 'CBT دراصل کیا ہے' جیسے رہنمائی کے سوالات کا جواب ایک مقررہ حوالہ جاتی لائبریری سے دیتی ہے۔ جب AI ماڈل فعال ہو تو وہ جواب کو گفتگو کے انداز میں لکھتا ہے، مگر صرف اسی لائبریری سے اور سخت اصولوں کے تحت: نہ تشخیص، نہ دوا کا مشورہ، اور اگر کوئی جواب ان اصولوں کو توڑے تو اس کی جگہ لائبریری کا اصل متن دکھایا جاتا ہے۔",
        "جب کسی ماہر سے حقیقی گفتگو ہی صحیح اگلا قدم ہو تو MindHx اسے بھی ٹھوس بنانے کی کوشش کرتا ہے، مبہم مشورہ چھوڑنے کی بجائے: پاکستان میں مستند نفسیاتی اور ذہنی صحت کی نگہداشت کی شہر بہ شہر ڈائریکٹری، اور پہلی ملاقات میں کیا کہنا ہے اس کا واضح جواب۔",
      ],
    },
  },
  {
    image: "foggyValley",
    en: {
      title: "Built with context, and honest about its limits",
      body: [
        "MindHx is bilingual by construction, not by afterthought: every page - the check-in itself, the AI chat, the therapist directory, even this paragraph - exists in both English and Urdu, switchable with a single tap in the header, with the entire layout correctly mirroring for Urdu's right-to-left script rather than just swapping words inside a left-to-right frame. That distinction matters in a country where a screening tool available only in English quietly excludes most of the people who might actually need it.",
        "Being built with that context also means being honest about what isn't finished yet. The combined risk score is a weighted heuristic, not a clinically calibrated probability - it hasn't been validated against real outcome data, and pretending otherwise would make it less trustworthy, not more. The Urdu translation of PHQ-9, GAD-7, and K10 is a careful draft for this session, not a licensed clinical instrument. The acoustic voice signal is an explicit heuristic proxy, deliberately built to be swapped for a real biomarker vendor later. None of that lives in fine print - it's stated plainly here and in the project's technical documentation, because a screening tool that oversells its own certainty is more dangerous than one that admits what it doesn't yet know.",
      ],
    },
    ur: {
      title: "سیاق کے ساتھ بنایا گیا، اور اپنی حدود کے بارے میں ایماندار",
      body: [
        "MindHx بنیادی طور پر دو لسانی بنایا گیا ہے، بعد میں سوچ کر نہیں: ہر صفحہ - چیک ان خود، AI چیٹ، معالج کی ڈائریکٹری، یہاں تک کہ یہ پیراگراف بھی - انگریزی اور اردو دونوں میں موجود ہے، ہیڈر میں ایک ہی کلک سے قابلِ تبدیل، اور پورا خاکہ اردو کی دائیں سے بائیں تحریر کے لیے درست طریقے سے پلٹتا ہے، نہ کہ محض بائیں سے دائیں فریم کے اندر الفاظ بدل دیے جاتے ہیں۔ یہ فرق اس ملک میں اہم ہے جہاں صرف انگریزی میں دستیاب ایک اسکریننگ ذریعہ خاموشی سے اکثر انہی لوگوں کو خارج کر دیتا ہے جنہیں اس کی سب سے زیادہ ضرورت ہو سکتی ہے۔",
        "اس تناظر کے ساتھ بنائے جانے کا مطلب یہ بھی ہے کہ جو ابھی مکمل نہیں اس کے بارے میں ایماندار رہا جائے۔ مجموعی خطرے کا اسکور ایک وزنی تخمینہ ہے، کوئی طبی طور پر مصدقہ امکان نہیں - اسے ابھی حقیقی نتائج کے ڈیٹا کے خلاف تصدیق نہیں کیا گیا، اور اس کے برعکس ظاہر کرنا اسے کم قابلِ اعتماد بنا دے گا، زیادہ نہیں۔ PHQ-9، GAD-7، اور K10 کا اردو ترجمہ اس سیشن کے لیے ایک محتاط مسودہ ہے، کوئی لائسنس یافتہ طبی آلہ نہیں۔ صوتی اشارہ ایک واضح تخمینی متبادل ہے، جسے جان بوجھ کر بعد میں ایک حقیقی بایومارکر فراہم کنندہ سے بدلنے کے لیے بنایا گیا ہے۔ ان میں سے کچھ بھی چھوٹے حروف میں چھپایا نہیں گیا - یہ یہاں اور پراجیکٹ کی تکنیکی دستاویزات میں صاف طور پر بیان کیا گیا ہے، کیونکہ ایک اسکریننگ ذریعہ جو اپنی یقین دہانی کو ضرورت سے زیادہ ظاہر کرے وہ اس سے زیادہ خطرناک ہے جو تسلیم کرے کہ وہ ابھی کیا نہیں جانتا۔",
      ],
    },
  },
  {
    image: "sunlitPathway",
    en: {
      title: "Who MindHx is for (and who needs more than this)",
      body: [
        "MindHx is built for someone who has noticed something is off - a lower mood, more worry than usual, sleep that isn't restoring them the way it used to - and would rather understand that a little before deciding what, if anything, to do next. It's meant to be a first look, not a last resort and not a running log to obsess over daily.",
        "It is explicitly not built for a mental-health emergency. If you or someone you're with may be in immediate danger, a local crisis line and MindHx's own Emergency Support page matter far more than any questionnaire score, and the app is built to get out of the way and point there directly the moment it detects that situation - before, not after, showing you a number. It's also not a substitute for ongoing care: for anyone already working with a therapist or psychiatrist, MindHx is at most a way to notice patterns between appointments, never a reason to skip one.",
      ],
    },
    ur: {
      title: "MindHx کس کے لیے ہے (اور کسے اس سے زیادہ کی ضرورت ہے)",
      body: [
        "MindHx اس شخص کے لیے بنایا گیا ہے جس نے کچھ محسوس کیا ہو کہ ٹھیک نہیں لگ رہا - موڈ کا کم ہونا، معمول سے زیادہ فکر، نیند جو پہلے کی طرح تازگی نہ دے - اور جو اگلا قدم اٹھانے سے پہلے اسے تھوڑا سمجھنا چاہتا ہو۔ اس کا مقصد ایک پہلی نظر ہونا ہے، آخری سہارا نہیں اور روزانہ جنون کی حد تک دیکھنے کے لیے کوئی جاری فہرست بھی نہیں۔",
        "یہ واضح طور پر ذہنی صحت کی ہنگامی صورتحال کے لیے نہیں بنایا گیا۔ اگر آپ یا آپ کے ساتھ کوئی شخص فوری خطرے میں ہو سکتا ہے تو ایک مقامی بحرانی ہیلپ لائن اور MindHx کا اپنا فوری مدد کا صفحہ کسی بھی سوالنامے کے اسکور سے کہیں زیادہ اہم ہیں، اور ایپ اس صورتحال کا پتہ چلتے ہی راستے سے ہٹ کر براہ راست وہاں رہنمائی کرنے کے لیے بنائی گئی ہے - نمبر دکھانے کے بعد نہیں، پہلے۔ یہ جاری نگہداشت کا متبادل بھی نہیں: جو کوئی پہلے ہی کسی معالج یا سائیکاٹرسٹ کے ساتھ کام کر رہا ہے، اس کے لیے MindHx زیادہ سے زیادہ ملاقاتوں کے درمیان انداز محسوس کرنے کا ایک طریقہ ہے، کبھی کسی ملاقات کو چھوڑنے کی وجہ نہیں۔",
      ],
    },
  },
];

// Live pre-submission estimate only: combines whichever of PHQ-9/GAD-7/K10 are answered
// so far, weighted the same way the backend weights them in the final risk assessment
// (proportionally re-normalized over just the scales answered). Text and voice signals
// are not folded in here since they aren't available until the check-in is submitted;
// the real combined_signal from /risk-assess (which does include them) replaces this
// once the assessment completes.
function combinedLiveEstimate(answers: number[], gadAnswers: number[], k10Answers: number[]) {
  const scales = [
    { values: answers, weight: 0.3, maxIndex: 3 },
    { values: gadAnswers, weight: 0.22, maxIndex: 3 },
    { values: k10Answers, weight: 0.22, maxIndex: 4 },
  ];
  let weightedSum = 0;
  let weightTotal = 0;
  for (const { values, weight, maxIndex } of scales) {
    const answered = values.filter((value) => value > -1);
    if (!answered.length) continue;
    const signal = answered.reduce((sum, value) => sum + value, 0) / (answered.length * maxIndex);
    weightedSum += signal * weight;
    weightTotal += weight;
  }
  return weightTotal ? Math.round((weightedSum / weightTotal) * 100) : 0;
}

// Holds the in-progress check-in (recording, answers, profile) across the
// redirect to sign in - viewing results now requires an account, but
// bouncing someone to /login shouldn't throw away what they just recorded.
const CHECKIN_DRAFT_KEY = "mindhx:pending-checkin";

function cooldownMessage(eligibility: CheckInEligibility, isUrdu: boolean): string {
  const days = eligibility.cooldown_days;
  const opens = eligibility.next_available_at
    ? new Date(eligibility.next_available_at).toLocaleString(isUrdu ? "ur-PK" : undefined, { dateStyle: "full", timeStyle: "short" })
    : "";
  return isUrdu
    ? `آپ پچھلے ${days} دنوں میں اپنا جائزہ مکمل کر چکے ہیں۔ آپ کا اگلا جائزہ ${opens} کو دستیاب ہوگا۔ اس دوران آپ اپنی پیش رفت ڈیش بورڈ پر دیکھ سکتے ہیں۔`
    : `You've completed a check-in in the last ${days} days. Your next one opens ${opens}. Meanwhile, you can follow your progress on your dashboard.`;
}

const MAX_RECORDING_MS = 60_000;
const MAX_TYPED_TEXT = 500;

// MediaRecorder formats differ by browser: Chrome/Firefox record WebM,
// Safari (including iPhone) records MP4/AAC. Both are accepted by the
// transcription and voice-analysis endpoints.
function pickRecordingFormat(): { mimeType?: string; extension: string } {
  const candidates = [
    { mimeType: "audio/webm;codecs=opus", extension: "webm" },
    { mimeType: "audio/webm", extension: "webm" },
    { mimeType: "audio/mp4", extension: "m4a" },
    { mimeType: "audio/ogg;codecs=opus", extension: "ogg" },
  ];
  const supported = typeof MediaRecorder !== "undefined" && typeof MediaRecorder.isTypeSupported === "function"
    ? candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate.mimeType))
    : undefined;
  return supported ?? { extension: "webm" };
}

export default function HomeClient() {
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(questionsEn.length).fill(-1));
  const [gadAnswers, setGadAnswers] = useState(Array(gadQuestionsEn.length).fill(-1));
  const [k10Answers, setK10Answers] = useState(Array(k10QuestionsEn.length).fill(-1));
  const [profile, setProfile] = useState({ ageRange: "", gender: "", maritalStatus: "", lifeContext: "", preferredLanguage: "en" });
  const [activeScale, setActiveScale] = useState<"phq9" | "gad7" | "k10">("phq9");
  const [sessionToken, setSessionToken] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [language, setLanguage] = useState("English");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [voiceFeatures, setVoiceFeatures] = useState<{ risk_signal?: number; pause_ratio?: number; energy_variability?: number; speaking_rate?: number; emotion?: VoiceEmotion }>({});
  const [typedText, setTypedText] = useState("");
  const [textSubmitting, setTextSubmitting] = useState(false);
  const [textSubmitError, setTextSubmitError] = useState("");
  const [textSubmitResult, setTextSubmitResult] = useState<({ sentiment: string } & TextMoodScores) | null>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState("");
  const [resumeNotice, setResumeNotice] = useState("");
  // Set while this account is inside its check-in cooldown (one saved
  // check-in per CHECKIN_COOLDOWN_DAYS, enforced by the backend).
  const [cooldown, setCooldown] = useState<CheckInEligibility | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const answered = answers.filter((answer) => answer > -1).length;
  const isComplete = answered === questionsEn.length;
  const score = combinedLiveEstimate(answers, gadAnswers, k10Answers);
  const liveScores = { phq9: answers.reduce((sum, answer) => sum + Math.max(0, answer), 0), gad7: gadAnswers.reduce((sum, answer) => sum + Math.max(0, answer), 0), k10: k10Answers.reduce((sum, answer) => sum + (answer > -1 ? answer + 1 : 0), 0) };
  const text = copy[language as keyof typeof copy];
  const profileOption = (value: keyof typeof copy.English.options) => <option value={value}>{text.options[value]}</option>;
  const languageKey = language as keyof typeof questions;
  const activeQuestions = activeScale === "phq9" ? questions[languageKey] : activeScale === "gad7" ? gadQuestions[languageKey] : k10Questions[languageKey];
  const activeAnswers = activeScale === "phq9" ? answers : activeScale === "gad7" ? gadAnswers : k10Answers;
  const activeOptions = activeScale === "k10" ? k10Options[languageKey] : answerOptions[languageKey];
  const completedScales = [isComplete, gadAnswers.every((answer) => answer > -1), k10Answers.every((answer) => answer > -1)].filter(Boolean).length;

  function updateActiveAnswer(questionIndex: number, optionIndex: number) {
    if (activeScale === "phq9") setAnswers(answers.map((answer, answerIndex) => answerIndex === questionIndex ? optionIndex : answer));
    if (activeScale === "gad7") setGadAnswers(gadAnswers.map((answer, answerIndex) => answerIndex === questionIndex ? optionIndex : answer));
    if (activeScale === "k10") setK10Answers(k10Answers.map((answer, answerIndex) => answerIndex === questionIndex ? optionIndex : answer));
  }

  function goToNextScale() {
    if (activeScale === "phq9") setActiveScale("gad7");
    else if (activeScale === "gad7") setActiveScale("k10");
  }

  useEffect(() => {
    const loggedIn = isLoggedIn();
    startTransition(() => setHasAccount(loggedIn));
    if (!loggedIn) return;
    fetchCheckInEligibility().then((eligibility) => {
      startTransition(() => setCooldown(eligibility && !eligibility.can_check_in ? eligibility : null));
    });
    try {
      const raw = sessionStorage.getItem(CHECKIN_DRAFT_KEY);
      if (!raw) return;
      sessionStorage.removeItem(CHECKIN_DRAFT_KEY);
      const draft = JSON.parse(raw);
      startTransition(() => {
        if (typeof draft.transcript === "string") setTranscript(draft.transcript);
        if (typeof draft.typedText === "string") setTypedText(draft.typedText);
        if (Array.isArray(draft.answers)) setAnswers(draft.answers);
        if (Array.isArray(draft.gadAnswers)) setGadAnswers(draft.gadAnswers);
        if (Array.isArray(draft.k10Answers)) setK10Answers(draft.k10Answers);
        if (draft.profile) setProfile(draft.profile);
        if (typeof draft.language === "string") setLanguage(draft.language);
        if (draft.voiceFeatures) setVoiceFeatures(draft.voiceFeatures);
        if (typeof draft.sessionToken === "string") setSessionToken(draft.sessionToken);
        setResumeNotice(
          draft.language === "اردو"
            ? "خوش آمدید - آپ کے جوابات بحال کر دیے گئے ہیں۔ نتائج دیکھنے کے لیے دوبارہ \"میرا جائزہ دیکھیں\" دبائیں۔"
            : "Welcome back - your answers were restored. Click “See my check-in” again to view your results."
        );
      });
    } catch {
      // Corrupt or unavailable draft - nothing to restore, no harm done.
    }
  }, []);

  async function handleSubmitText() {
    if (!typedText.trim()) return;
    setTextSubmitting(true);
    setTextSubmitError("");
    setTextSubmitResult(null);
    try {
      const response = await fetch(`${API_BASE}/analyze-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: typedText, language: language === "اردو" ? "ur" : "en" }),
      });
      if (!response.ok) throw new Error("Text analysis unavailable");
      const result = await response.json() as { sentiment: string; crisis_language: boolean } & TextMoodScores;
      if (result.crisis_language) {
        sessionStorage.setItem("mindhx:crisis-context", JSON.stringify({ source: "text_crisis_language", language: language === "اردو" ? "ur" : "en" }));
        router.push("/emergency");
        return;
      }
      setTextSubmitResult({ sentiment: result.sentiment, anxiety_level: result.anxiety_level, stress_level: result.stress_level, depression_indicator: result.depression_indicator });
    } catch {
      setTextSubmitError(language === "اردو" ? "متن جمع نہیں ہو سکا۔" : "Could not submit your text right now.");
    } finally {
      setTextSubmitting(false);
    }
  }

  async function createPrivateSession() {
    if (!profile.ageRange) {
      setAssessmentError(language === "اردو" ? "سیشن شروع کرنے کے لیے عمر کی حد منتخب کریں۔" : "Choose an age range to start the session.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/session/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: { age_range: profile.ageRange || null, gender: profile.gender || null, marital_status: profile.maritalStatus || null, life_context: profile.lifeContext || null, preferred_language: language === "اردو" ? "ur" : "en" } }) });
      if (!response.ok) throw new Error("Session unavailable");
      const result = await response.json() as { session_token: string };
      setSessionToken(result.session_token);
      setShowProfile(false);
    } catch {
      setAssessmentError(language === "اردو" ? "نجی سیشن شروع نہیں ہو سکا۔" : "Private session could not be started.");
    }
  }

  function stopRecording() {
    if (recordingTimer.current) clearTimeout(recordingTimer.current);
    recordingTimer.current = null;
    if (mediaRecorder.current?.state === "recording") mediaRecorder.current.stop();
    setRecording(false);
  }

  useEffect(() => () => {
    if (recordingTimer.current) clearTimeout(recordingTimer.current);
  }, []);

  async function handleVoiceToggle() {
    if (recording) {
      stopRecording();
      return;
    }

    try {
      setVoiceError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const format = pickRecordingFormat();
      const recorder = format.mimeType ? new MediaRecorder(stream, { mimeType: format.mimeType }) : new MediaRecorder(stream);
      const fileName = `mindhx-voice.${format.extension}`;
      audioChunks.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setTranscribing(true);
        const audioBlob = new Blob(audioChunks.current, { type: recorder.mimeType || format.mimeType || "audio/webm" });
        try {
          const formData = new FormData();
          formData.append("file", audioBlob, fileName);
          formData.append("language", language === "اردو" ? "ur" : "en");
          const response = await fetch(`${API_BASE}/transcribe`, { method: "POST", body: formData });
          if (!response.ok) throw new Error("Transcription failed");
          const result = await response.json() as { text: string };
          setTranscript(result.text);
        } catch {
          setVoiceError(text.voiceError);
        } finally {
          setTranscribing(false);
        }
        try {
          const voiceFormData = new FormData();
          voiceFormData.append("file", audioBlob, fileName);
          const voiceResponse = await fetch(`${API_BASE}/analyze-voice`, { method: "POST", body: voiceFormData });
          if (!voiceResponse.ok) throw new Error("Voice analysis unavailable");
          const voiceResult = await voiceResponse.json() as { risk_signal: number; pause_ratio: number; energy_variability: number; speaking_rate: number; emotion: VoiceEmotion };
          setVoiceFeatures({ risk_signal: voiceResult.risk_signal, pause_ratio: voiceResult.pause_ratio, energy_variability: voiceResult.energy_variability, speaking_rate: voiceResult.speaking_rate, emotion: voiceResult.emotion });
        } catch {
          setVoiceFeatures({});
        }
      };
      mediaRecorder.current = recorder;
      recorder.start();
      setRecording(true);
      recordingTimer.current = setTimeout(stopRecording, MAX_RECORDING_MS);
    } catch {
      setVoiceError(text.voiceError);
    }
  }

  function goToEmergency(source: "phq9_item9" | "text_crisis_language") {
    try {
      sessionStorage.setItem("mindhx:crisis-context", JSON.stringify({ source, language: language === "اردو" ? "ur" : "en" }));
    } catch {
      // Storage unavailable - /emergency still renders its full content without it.
    }
    router.push("/emergency");
  }

  async function handleCheckIn() {
    const isUrdu = language === "اردو";
    const languageCode = isUrdu ? "ur" : "en";
    const combinedText = `${transcript}\n${typedText}`.trim();
    setAssessmentError("");

    // Safety first: a crisis signal is checked before anything else - before
    // the "finish every section" check and before the sign-in requirement -
    // so someone who has answered PHQ-9 item 9 or written about wanting to
    // die is never sent to a login form or told to finish a questionnaire.
    let textAnalysis: ({ crisis_language?: boolean } & Record<string, unknown>) | null = null;
    if (combinedText) {
      setAssessmentLoading(true);
      try {
        const textResponse = await fetch(`${API_BASE}/analyze-text`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: combinedText, language: languageCode }) });
        if (textResponse.ok) textAnalysis = await textResponse.json();
      } catch {
        // Carry on - /risk-assess re-checks the same text server-side.
      } finally {
        setAssessmentLoading(false);
      }
    }
    const crisisSource = answers[8] > 0 ? "phq9_item9" : textAnalysis?.crisis_language ? "text_crisis_language" : null;
    // Full results (with the crisis banner on top) are only possible once
    // signed in with an age range and a complete PHQ-9; otherwise go straight
    // to emergency support rather than asking for any of that first.
    if (crisisSource && !(isLoggedIn() && profile.ageRange && isComplete)) {
      goToEmergency(crisisSource);
      return;
    }

    if (!crisisSource) {
      // The voice note is optional: it needs a microphone, a supported browser,
      // and a configured speech-to-text service, none of which should stand
      // between someone and their questionnaire results.
      const missingSteps: string[] = [];
      if (!typedText.trim()) missingSteps.push(isUrdu ? "تحریری جواب" : "written reflection");
      if (!isComplete) missingSteps.push("PHQ-9");
      if (!gadAnswers.every((answer) => answer > -1)) missingSteps.push("GAD-7");
      if (!k10Answers.every((answer) => answer > -1)) missingSteps.push("K10");
      if (missingSteps.length > 0) {
        setAssessmentError(
          isUrdu
            ? `نتائج دیکھنے سے پہلے یہ مکمل کریں: ${missingSteps.join("، ")}۔`
            : `Complete these before you can see your results: ${missingSteps.join(", ")}.`
        );
        return;
      }
      if (!isLoggedIn()) {
        try {
          sessionStorage.setItem(CHECKIN_DRAFT_KEY, JSON.stringify({
            transcript, typedText, answers, gadAnswers, k10Answers, profile, language, voiceFeatures, sessionToken,
          }));
        } catch {
          // Storage unavailable - proceed anyway; they'll just re-enter answers after signing in.
        }
        router.push("/login?next=%2F");
        return;
      }
      if (!profile.ageRange) {
        setAssessmentError(isUrdu ? "پہلے نجی سیشن کا سیاق مکمل کریں۔" : "Set your private session context before starting the assessment.");
        setShowProfile(true);
        return;
      }
    }

    // One saved check-in per cooldown window. Checked fresh (not from state)
    // in case a check-in was just saved from another tab. A crisis signal
    // still goes to emergency support rather than stopping here.
    const eligibility = await fetchCheckInEligibility();
    if (eligibility && !eligibility.can_check_in) {
      if (crisisSource) {
        goToEmergency(crisisSource);
        return;
      }
      setCooldown(eligibility);
      setAssessmentError(cooldownMessage(eligibility, isUrdu));
      return;
    }

    setAssessmentLoading(true);
    try {
      // PHQ-9 and the crisis flags are always recomputed by /risk-assess from
      // the raw answers and text; textAnalysis is passed only so it doesn't
      // repeat the (possibly LLM-backed) text read for sentiment.
      const riskResponse = await fetch(`${API_BASE}/risk-assess`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript, typed_text: typedText, language: languageCode, phq9_answers: answers, gad7_answers: gadAnswers, k10_answers: k10Answers.map((answer) => answer + 1), profile: { age_range: profile.ageRange, gender: profile.gender || null, marital_status: profile.maritalStatus || null, life_context: profile.lifeContext || null, preferred_language: languageCode }, text_analysis: textAnalysis ?? {}, voice_features: voiceFeatures }) });
      if (!riskResponse.ok) throw new Error("Risk assessment unavailable");
      const result = await riskResponse.json();
      sessionStorage.setItem("mindhx:last-result", JSON.stringify(result));
      // Full per-question detail for the PDF export - browser-only, never sent
      // to or stored on the backend (the account only ever gets the scores,
      // bands, themes, and per-section summaries in `result`).
      sessionStorage.setItem("mindhx:last-checkin-detail", JSON.stringify({
        language,
        transcript,
        typedText,
        phq9: questions[languageKey].map((questionText, index) => ({ question: questionText, answer: answerOptions[languageKey][answers[index]] ?? null })),
        gad7: gadQuestions[languageKey].map((questionText, index) => ({ question: questionText, answer: answerOptions[languageKey][gadAnswers[index]] ?? null })),
        k10: k10Questions[languageKey].map((questionText, index) => ({ question: questionText, answer: k10Options[languageKey][k10Answers[index]] ?? null })),
      }));
      saveCheckIn({
        riskScore: result.risk_score,
        band: result.band,
        routingDecision: result.routing_decision,
        themes: result.themes ?? [],
        components: result.components,
        supportPlan: result.support_plan,
        // A crisis check-in can reach here with GAD-7/K10 unfinished; only
        // complete sets are saved (the backend rejects partial ones).
        answers: isComplete && gadAnswers.every((answer) => answer > -1) && k10Answers.every((answer) => answer > -1)
          ? { phq9: answers, gad7: gadAnswers, k10: k10Answers.map((answer) => answer + 1) }
          : undefined,
      });
      router.push("/results");
    } catch {
      if (crisisSource) {
        // Never leave a crisis check-in on an error message.
        goToEmergency(crisisSource);
        return;
      }
      setAssessmentError(isUrdu ? "MindHx سروس دستیاب نہیں۔ براہ کرم تھوڑی دیر بعد دوبارہ کوشش کریں۔" : "MindHx service unavailable. Please try again in a moment.");
    } finally {
      setAssessmentLoading(false);
    }
  }

  async function handleUrduSpeech() {
    const speechText = `${transcript}\n${typedText}`.trim();
    if (!speechText || language !== "اردو") return;
    setSpeaking(true);
    setVoiceError("");
    try {
      const response = await fetch(`${API_BASE}/synthesize`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: speechText, language: "ur" }) });
      if (!response.ok) throw new Error("Speech generation failed");
      const audio = new Audio(URL.createObjectURL(await response.blob()));
      audio.onended = () => URL.revokeObjectURL(audio.src);
      await audio.play();
    } catch {
      setVoiceError(text.speechError);
    } finally {
      setSpeaking(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar"><div className="brand"><span className="brand-mark">M</span><span>Mind<span className="brand-accent">Hx</span></span></div><nav className="topbar-nav" aria-label="MindHx resources"><Link href="/medication">Medication</Link><Link href="/ai">MindHx AI</Link><Link href="/meditation">Meditation</Link><Link href="/therapies">Therapies</Link><Link href="/therapist">Therapist</Link><Link href="/resources">Resources</Link><Link href="/emergency" className="topbar-nav-emergency">Emergency support</Link></nav><div className="topbar-right"><span className="privacy"><span className="dot" /> {text.private}</span><AccountChip language={language === "اردو" ? "اردو" : "English"} /><button className="language" onClick={() => setLanguage(language === "English" ? "اردو" : "English")}>◎ {language}</button><button className="avatar" onClick={() => setShowProfile(true)} aria-label={text.openProfile}>{sessionToken ? "✓" : "A"}</button></div></header>
      <main className="workspace" dir={language === "اردو" ? "rtl" : "ltr"}>
        <section className="intro"><DoodleCloud className="doodle doodle-blue doodle-float" style={{ top: "-18px", right: "14%" }} /><DoodleWave className="doodle doodle-teal doodle-sway" style={{ bottom: "-6px", right: "8%" }} /><DoodleSun className="doodle doodle-orange doodle-float-slow" style={{ top: "-30px", right: "30%" }} /><div className="hero-copy"><div className="signal-orbit" aria-hidden="true"><span className="orbit-ring ring-1" /><span className="orbit-ring ring-2" /><span className="orbit-ring ring-3" /><span className="orbit-core" /><span className="orbit-dot dot-blue" /><span className="orbit-dot dot-orange" /><span className="orbit-dot dot-green" /></div><div className="hero-copy-text"><p className="eyebrow">{text.eyebrow}</p><h1>{text.heroTitleA}<br /><em>{text.heroTitleB}</em></h1><p className="intro-copy">{text.intro}</p><div className="hero-actions"><button className="check-in-button hero-action" onClick={() => document.querySelector(".signal-grid")?.scrollIntoView({ behavior: "smooth" })}>{text.seeCheckIn} <span>↓</span></button><span className="status-pill"><span className="pulse" /> {text.ready}</span></div>{cooldown && <p className="checkin-cooldown-note">{cooldownMessage(cooldown, language === "اردو")} <Link href="/dashboard">{language === "اردو" ? "ڈیش بورڈ دیکھیں" : "View your dashboard"} →</Link></p>}</div></div><div className="conversation-preview"><div className="preview-topline"><span>MIN DHX / LIVE CHECK-IN</span><span className="preview-dot" /></div><div className="preview-bubble patient-bubble">I&apos;ve been feeling a little distant lately.</div><div className="preview-bubble mindhx-bubble">Let&apos;s slow down and look at the full picture.</div><div className="preview-signals"><span><i className="signal-blue" /> Voice</span><span><i className="signal-orange" /> Words</span><span><i className="signal-green" /> PHQ-9</span></div></div></section>
        <section className="profile-strip"><div><p className="card-kicker">{text.contextKicker}</p><h2>{sessionToken ? text.contextReady : text.contextPrompt}</h2><p>{text.contextBody}</p></div><button className="profile-button" onClick={() => setShowProfile(true)}>{sessionToken ? text.contextEdit : text.contextSet} <span>→</span></button></section>
        <NatureBanner {...naturePhotos.mountainLake} caption={text.bannerCaption} priority />
        <div className="signal-grid">
          <article className="signal-card"><VoiceSignalGraphic /><div className="card-heading"><div><p className="card-kicker">SIGNAL 01</p><h2>{text.sound}</h2></div><span className="ready-label">{text.voiceOptional}</span></div><p className="card-description">{text.soundDescription}</p><button className={`record-button ${recording ? "recording" : ""}`} onClick={handleVoiceToggle} disabled={transcribing}><span className="record-icon" />{transcribing ? text.processing : recording ? text.stop : text.record}</button><span className="microcopy">{voiceError || (transcript ? text.transcriptReady : recording ? text.listening : text.recordingHintFull)}</span><div className={`waveform ${recording ? "waveform-live" : ""}`} aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={index} style={{ height: `${12 + ((index * 17) % 29)}px`, animationDelay: `${(index % 9) * 0.09}s` }} />)}</div>{transcript && <p className="voice-transcript">{transcript}</p>}{voiceFeatures.emotion && <VoiceEmotionBars emotion={voiceFeatures.emotion} title={text.voiceTone} />}</article>
          <article className="signal-card"><WordsSignalGraphic /><div className="card-heading"><div><p className="card-kicker">SIGNAL 02</p><h2>{text.words}</h2></div><span className="ready-label">{text.ready}</span></div><p className="card-description">{text.wordsDescription}</p><textarea value={typedText} onChange={(event) => setTypedText(event.target.value)} maxLength={MAX_TYPED_TEXT} placeholder={text.placeholder} aria-label={text.wordsDescription} /><div className="text-footer"><span>{text.optional}</span><span>{typedText.length} / {MAX_TYPED_TEXT}</span></div><div className="text-actions"><button className="check-in-button text-submit-button" onClick={handleSubmitText} disabled={textSubmitting || !typedText.trim()}>{textSubmitting ? text.submittingText : text.submitText}</button><button className="speech-button" onClick={handleUrduSpeech} disabled={speaking || language !== "اردو" || !(`${transcript}\n${typedText}`.trim())}>{speaking ? text.speaking : text.speakUrdu}</button></div><span className="microcopy">{text.textSubmitHint}</span>{textSubmitResult && <p className="text-submit-result"><b>{text.textSentiment}:</b> {textSubmitResult.sentiment}</p>}{textSubmitResult && <TextMoodBars scores={textSubmitResult} title={text.wordChoice} />}{textSubmitError && <span className="microcopy">{textSubmitError}</span>}{voiceError && <span className="microcopy">{voiceError}</span>}</article>
          <article className="signal-card phq-card"><ClinicalSignalGraphic /><div className="card-heading"><div><p className="card-kicker">SIGNAL 03 · {completedScales} / 3 COMPLETE</p><h2>{text.clinical}</h2></div><span className="progress-label">{activeAnswers.filter((answer) => answer > -1).length} / {activeQuestions.length}</span></div><p className="card-description">{text.clinicalDescription}</p><div className="scale-tabs"><button className={activeScale === "phq9" ? "active" : ""} onClick={() => setActiveScale("phq9")}>PHQ-9</button><button className={activeScale === "gad7" ? "active" : ""} onClick={() => setActiveScale("gad7")}>GAD-7</button><button className={activeScale === "k10" ? "active" : ""} onClick={() => setActiveScale("k10")}>K10</button></div><div className="question-progress"><span style={{ width: `${(activeAnswers.filter((answer) => answer > -1).length / activeQuestions.length) * 100}%` }} /></div><div className="question-list">{activeQuestions.map((questionText, questionIndex) => <div className="question-block" key={`${activeScale}-${questionIndex}`}><p className="question-number">{activeScale.toUpperCase()} · {questionIndex + 1} / {activeQuestions.length}</p><h3>{questionText}</h3><div className="answer-list">{activeOptions.map((option, optionIndex) => <button key={option} className={activeAnswers[questionIndex] === optionIndex ? "selected" : ""} onClick={() => updateActiveAnswer(questionIndex, optionIndex)}><span className="radio" />{option}</button>)}</div></div>)}</div>{activeScale !== "k10" && <div className="question-actions"><button className="next-button" onClick={goToNextScale}>{text.next}<span>→</span></button></div>}</article>
        </div>
        <section className="bottom-row"><div className="score-preview"><div className="score-ring"><strong>{score}</strong><span>/ 100</span></div><div><p className="card-kicker">{text.estimate}</p><h2>{text.picture}</h2><p>{text.pictureDescription}</p><div className="scale-outcomes"><span><b>PHQ-9</b> {liveScores.phq9}/27</span><span><b>GAD-7</b> {liveScores.gad7}/21</span><span><b>K10</b> {liveScores.k10}/50</span></div></div></div><div><button className="check-in-button" onClick={handleCheckIn} disabled={assessmentLoading}>{assessmentLoading ? text.processing : text.seeCheckIn} <span>→</span></button>{!hasAccount && <span className="microcopy">{text.signInToView}</span>}{resumeNotice && <p className="microcopy">{resumeNotice}</p>}{cooldown && !assessmentError && <p className="checkin-cooldown-note">{cooldownMessage(cooldown, language === "اردو")}</p>}{assessmentError && <p className="assessment-error">{assessmentError}</p>}</div></section>
        <FeatureCarousel isUrdu={language === "اردو"} />
        <InnovationGrid isUrdu={language === "اردو"} />
        <section className="about-mindhx">
          <p className="eyebrow">{text.aboutEyebrow}</p>
          <h2>{text.aboutTitle}</h2>
          {ABOUT_SECTIONS.map((item, index) => {
            const content = item[language === "اردو" ? "ur" : "en"];
            return (
              <article key={content.title} className={`about-block ${index % 2 === 1 ? "about-block-reverse" : ""}`}>
                <div className="about-text">
                  <h3>{content.title}</h3>
                  {content.body.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
                </div>
                <div className="about-image"><NatureBanner {...naturePhotos[item.image]} /></div>
              </article>
            );
          })}
        </section>
        <p className="disclaimer"><span>ⓘ</span> {text.disclaimer} <Link href="/brand" className="brand-link">Brand ↗</Link></p>
      </main>
      <SiteFooter language={language === "اردو" ? "اردو" : "English"} />
      {showProfile && <div className="modal-backdrop" onClick={() => setShowProfile(false)}><div className="modal profile-modal" dir={language === "اردو" ? "rtl" : "ltr"} onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setShowProfile(false)} aria-label={text.closeLabel}>×</button><p className="eyebrow">{text.contextKicker}</p><h2>{text.modalContextTitle}</h2><p>{text.modalContextBody}</p><div className="profile-fields"><select value={profile.ageRange} onChange={(event) => setProfile({ ...profile, ageRange: event.target.value })} aria-label={text.ageRange}><option value="">{text.ageRange}</option><option>18-24</option><option>25-34</option><option>35-44</option><option>45+</option></select><select value={profile.gender} onChange={(event) => setProfile({ ...profile, gender: event.target.value })} aria-label={text.genderOptional}><option value="">{text.genderOptional}</option>{profileOption("Woman")}{profileOption("Man")}{profileOption("Non-binary")}{profileOption("Prefer not to say")}</select><select value={profile.maritalStatus} onChange={(event) => setProfile({ ...profile, maritalStatus: event.target.value })} aria-label={text.relationship}><option value="">{text.relationship}</option>{profileOption("Single")}{profileOption("Partnered")}{profileOption("Married")}{profileOption("Prefer not to say")}</select><select value={profile.lifeContext} onChange={(event) => setProfile({ ...profile, lifeContext: event.target.value })} aria-label={text.lifeContext}><option value="">{text.lifeContext}</option>{profileOption("Student")}{profileOption("Working")}{profileOption("Retired")}{profileOption("Between roles")}{profileOption("Caregiving")}</select></div><button className="check-in-button" onClick={createPrivateSession}>{sessionToken ? text.updateContext : text.continuePrivately} <span>→</span></button><p className="profile-modal-auth"><Link href="/login">{text.modalAuthA}</Link> {text.modalAuthOr} <Link href="/register">{text.modalAuthB}</Link> {text.modalAuthC}</p></div></div>}
    </div>
  );
}
