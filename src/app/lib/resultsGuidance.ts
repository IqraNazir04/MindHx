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
