export type ScaleKey = "phq9" | "gad7" | "k10";

const SCALE_EXPLANATIONS: Record<ScaleKey, Record<string, string>> = {
  phq9: {
    minimal: "Little or no depressive symptoms over the last two weeks.",
    mild: "Mild symptoms. Self-care and keeping track of your mood often help; worth watching.",
    moderate: "Moderate symptoms. A professional evaluation is recommended, and talking therapies are well supported for this range.",
    moderately_severe: "Moderately severe symptoms. Please arrange a professional evaluation soon.",
    severe: "Severe symptoms. Please contact a clinician promptly, and use emergency support now if you feel unsafe.",
  },
  gad7: {
    minimal: "Minimal anxiety symptoms.",
    mild: "Mild anxiety. Breathing and grounding practices can help day to day.",
    moderate: "Moderate anxiety. A professional evaluation is advisable; CBT and exposure-based therapy have good evidence for this range.",
    severe: "Severe anxiety. Please arrange a professional evaluation soon.",
  },
  k10: {
    low: "Low psychological distress.",
    mild: "Mild psychological distress. Self-support and monitoring are reasonable for now.",
    moderate: "Moderate psychological distress. A professional evaluation is advisable.",
    severe: "Severe psychological distress. Please seek professional help promptly.",
  },
};

export function scaleExplanation(scale: ScaleKey, band: string | undefined): string {
  if (!band) return "No band available for this measure.";
  return SCALE_EXPLANATIONS[scale][band] ?? "See the score against the range for this measure.";
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
  cbt: { label: "Cognitive behavioural therapy (CBT)", href: "/therapies/cbt", note: "Structured work on the thought and behaviour patterns that keep low mood and worry going." },
  dbt: { label: "Dialectical behaviour therapy (DBT)", href: "/therapies/dbt", note: "Skills for handling strong emotions, stress, and relationships." },
  exposure: { label: "Exposure-based therapy", href: "/therapies/exposure-therapy", note: "A clinician-guided approach for anxiety and fear responses." },
};

export function buildRecommendation(result: RecommendationInput): Recommendation {
  const route = result.support_plan?.route;
  const crisis = Boolean(result.crisis_flag) || result.band === "crisis" || route === "crisis";
  if (crisis) {
    return {
      level: "emergency",
      headline: "Get emergency support now",
      body: "Your check-in suggests you may be in crisis. Contact local emergency services or a crisis line now, and stay with someone you trust if you can.",
      primary: { label: "Open emergency support", href: "/emergency" },
      therapies: [],
      alsoHelpful: [{ label: "Talk to a therapist", href: "/therapist" }],
    };
  }

  const professional = route === "psychiatric_referral" || result.routing_decision === "refer" || result.band === "elevated";
  if (professional) {
    return {
      level: "professional",
      headline: "Arrange a professional evaluation",
      body: "The combined picture points toward a professional evaluation. Therapy is a strong option alongside (or before) any medical review; the approaches below are a good place to start the conversation.",
      primary: { label: "Find a therapist", href: "/therapist" },
      therapies: [THERAPY_OPTIONS.cbt, THERAPY_OPTIONS.dbt, THERAPY_OPTIONS.exposure],
      alsoHelpful: [
        { label: "Emergency support if things get worse", href: "/emergency" },
        { label: "Practice a grounding exercise", href: "/meditation/grounding-5-4-3-2-1" },
      ],
    };
  }

  return {
    level: "self",
    headline: "Gentle self-support",
    body: "Nothing here points to urgent risk. Small, steady practices and keeping an eye on how you feel usually make the biggest difference; come back to a check-in if things change.",
    primary: { label: "Try a breathing practice", href: "/meditation/box-breathing" },
    therapies: [THERAPY_OPTIONS.cbt],
    alsoHelpful: [
      { label: "Explore therapy approaches", href: "/therapies" },
      { label: "Emergency support if you need it", href: "/emergency" },
    ],
  };
}

export type StageResult = {
  number: 1 | 2 | 3 | 4 | 5;
  label: string;
  summary: string;
  recommendations: string[];
  primary: { label: string; href: string };
  showEmergencyButton: boolean;
  therapies: { label: string; href: string; note: string }[];
  meditations: { label: string; href: string; note: string }[];
};

const MEDITATION_OPTIONS = {
  box: { label: "Box breathing", href: "/meditation/box-breathing", note: "A four-count breathing pattern that steadies the body when stress rises." },
  grounding: { label: "Grounding 5-4-3-2-1", href: "/meditation/grounding-5-4-3-2-1", note: "Notice five things you see, four you feel, three you hear, two you smell, one you taste." },
  bodyScan: { label: "Body scan", href: "/meditation/body-scan", note: "A slow pass through the body that releases tension you may not have noticed." },
};

const BAND_SEVERITY: Record<string, number> = {
  minimal: 1, low: 1, mild: 2, moderate: 3, moderately_severe: 4, severe: 4,
};

// The stage is the worst band across the three questionnaires, overridden to
// crisis whenever a crisis signal was detected.
export function stageFor(result: RecommendationInput & { components?: { phq9: { band: string }; gad7: { band: string }; k10: { band: string } } }): StageResult {
  const crisis = Boolean(result.crisis_flag) || result.band === "crisis" || result.support_plan?.route === "crisis";
  const bands = [result.components?.phq9.band, result.components?.gad7.band, result.components?.k10.band];
  const worst = Math.max(1, ...bands.map((band) => (band ? BAND_SEVERITY[band] ?? 1 : 1)));
  const number = crisis ? 5 : (worst as 1 | 2 | 3 | 4);

  if (number === 5) {
    return {
      number, label: "Stage 5 · Crisis",
      summary: "A crisis signal was detected. Please reach out for emergency help now, before anything else.",
      recommendations: [
        "Contact local emergency services or a crisis line now.",
        "Stay with someone you trust, or move to a safe place, if you can.",
        "Remove or put away anything you could use to hurt yourself.",
      ],
      primary: { label: "Go to emergency support", href: "/emergency" },
      showEmergencyButton: true,
      therapies: [],
      meditations: [MEDITATION_OPTIONS.box],
    };
  }
  if (number === 4) {
    return {
      number, label: "Stage 4 · Moderately severe to severe",
      summary: "Your answers point to moderately severe or severe symptoms. A professional evaluation should happen soon, and urgent help is available if things get worse.",
      recommendations: [
        "Book an appointment with a licensed psychiatrist or clinician as soon as you can.",
        "Start a talking therapy alongside any medical review.",
        "If your safety changes or you feel unable to cope, use emergency support right away.",
      ],
      primary: { label: "Find a therapist", href: "/therapist" },
      showEmergencyButton: true,
      therapies: [THERAPY_OPTIONS.cbt, THERAPY_OPTIONS.dbt, THERAPY_OPTIONS.exposure],
      meditations: [MEDITATION_OPTIONS.grounding, MEDITATION_OPTIONS.box],
    };
  }
  if (number === 3) {
    return {
      number, label: "Stage 3 · Moderate",
      summary: "Your answers point to moderate symptoms. A professional evaluation is recommended, and talking therapies are well supported at this level.",
      recommendations: [
        "Arrange a professional evaluation in the next few weeks.",
        "Begin structured therapy such as CBT or DBT.",
        "Keep a daily mood note and bring it to your appointment.",
      ],
      primary: { label: "Find a therapist", href: "/therapist" },
      showEmergencyButton: false,
      therapies: [THERAPY_OPTIONS.cbt, THERAPY_OPTIONS.dbt, THERAPY_OPTIONS.exposure],
      meditations: [MEDITATION_OPTIONS.box, MEDITATION_OPTIONS.bodyScan],
    };
  }
  if (number === 2) {
    return {
      number, label: "Stage 2 · Mild",
      summary: "Your answers point to mild symptoms. Self-care, therapy skills, and regular practice often help a lot at this stage.",
      recommendations: [
        "Practise a daily grounding or breathing exercise.",
        "Learn the basics of CBT and notice the link between thoughts and mood.",
        "Re-check in after a few weeks to see how things are changing.",
      ],
      primary: { label: "Try a breathing practice", href: "/meditation/box-breathing" },
      showEmergencyButton: false,
      therapies: [THERAPY_OPTIONS.cbt, THERAPY_OPTIONS.dbt],
      meditations: [MEDITATION_OPTIONS.box, MEDITATION_OPTIONS.grounding, MEDITATION_OPTIONS.bodyScan],
    };
  }
  return {
    number: 1, label: "Stage 1 · Minimal",
    summary: "Your answers show little or no symptoms right now. Keeping up good habits, with occasional practice, is the main thing.",
    recommendations: [
      "Keep up regular sleep, movement, and time with people you trust.",
      "Use a short meditation when you notice stress building.",
      "Come back to a check-in if anything changes.",
    ],
    primary: { label: "Explore meditation", href: "/meditation" },
    showEmergencyButton: false,
    therapies: [THERAPY_OPTIONS.cbt],
    meditations: [MEDITATION_OPTIONS.box, MEDITATION_OPTIONS.bodyScan],
  };
}
