// Original, hand-built glyph set rendered inside a glossy 3D-shaded badge
// (radial-gradient body + inset highlight + drop shadow, see .step-icon in
// globals.css) so each practice/therapy step gets a small illustrative icon
// rather than a bare number.
export type StepIconKey =
  | "seated"
  | "breatheIn"
  | "holdPause"
  | "breatheOut"
  | "repeatCycle"
  | "senseEye"
  | "senseHand"
  | "senseEar"
  | "senseNose"
  | "senseMouth"
  | "headFocus"
  | "bodyScan"
  | "muscleToes"
  | "muscleLegs"
  | "muscleHands"
  | "muscleShoulders"
  | "muscleFace"
  | "calmFinish"
  | "target"
  | "glassWater"
  | "checkDone"
  | "reflect"
  | "pathChoose"
  | "walking"
  | "footStep"
  | "thoughtCloud"
  | "standStill"
  | "clipboard"
  | "chartUp"
  | "twoPeople"
  | "peopleGroup"
  | "notebook"
  | "headsetCoach"
  | "staircase"
  | "gauge"
  | "shield"
  | "sliderPacing"
  | "branchPaths"
  | "stethoscope"
  | "testTube"
  | "speechArrow"
  | "groupRules"
  | "guideFacilitator"
  | "openHand";

const TONES: Record<StepIconKey, "blue" | "teal" | "orange" | "navy"> = {
  seated: "blue", breatheIn: "teal", holdPause: "navy", breatheOut: "teal", repeatCycle: "blue",
  senseEye: "orange", senseHand: "orange", senseEar: "orange", senseNose: "orange", senseMouth: "orange",
  headFocus: "blue", bodyScan: "teal", muscleToes: "navy", muscleLegs: "navy", muscleHands: "navy",
  muscleShoulders: "navy", muscleFace: "navy", calmFinish: "teal", target: "orange", glassWater: "blue",
  checkDone: "teal", reflect: "blue", pathChoose: "orange", walking: "blue", footStep: "blue",
  thoughtCloud: "navy", standStill: "teal", clipboard: "blue", chartUp: "teal", twoPeople: "blue",
  peopleGroup: "orange", notebook: "navy", headsetCoach: "blue", staircase: "orange", gauge: "navy",
  shield: "teal", sliderPacing: "blue", branchPaths: "orange", stethoscope: "navy", testTube: "blue",
  speechArrow: "teal", groupRules: "orange", guideFacilitator: "blue", openHand: "teal",
};

const GLYPHS: Record<StepIconKey, string> = {
  seated: "M16 9a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-2 21 2-9 3-3h4l3 3 2 9M14 21h14",
  breatheIn: "M24 30V10m0 0-5 5m5-5 5 5M14 34c3-2 17-2 20 0",
  holdPause: "M17 13h4v18h-4zm10 0h4v18h-4z",
  breatheOut: "M24 10v20m0 0-5-5m5 5 5-5M14 34c3 2 17 2 20 0",
  repeatCycle: "M31 17a8 8 0 1 0 2 8m0-11v6h-6m-6 6v6h6",
  senseEye: "M10 24c4-7 10-10 14-10s10 3 14 10c-4 7-10 10-14 10s-10-3-14-10Zm14 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  senseHand: "M18 27V13a2 2 0 0 1 4 0v9m0-8a2 2 0 0 1 4 0v8m0-6a2 2 0 0 1 4 0v6m0-3a2 2 0 0 1 4 0v9c0 6-4 10-9 10s-8-3-10-7l-3-6a2 2 0 0 1 3-3l3 3",
  senseEar: "M28 12a9 9 0 0 0-9 9c0 4 2 5 2 8a4 4 0 0 1-4 4M28 12a9 9 0 0 1 9 9c0 8-7 8-7 15a5 5 0 0 1-5 5",
  senseNose: "M22 10c-2 6-6 10-6 16a8 8 0 0 0 16 0c0-2-1-3-2-3s-2 1-2 3a4 4 0 0 1-8 0",
  senseMouth: "M12 22c4 3 8 4 12 4s8-1 12-4M15 22a9 5 0 0 0 18 0",
  headFocus: "M24 12a8 8 0 0 1 8 8c0 4-2 6-3 8h-10c-1-2-3-4-3-8a8 8 0 0 1 8-8Zm-3 20h6m-5 4h4",
  bodyScan: "M24 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM17 38l3-10 4-3h0l4 3 3 10M15 19h18",
  muscleToes: "M13 30c0-6 3-9 3-14a4 4 0 0 1 8 0v6m0-4a3 3 0 0 1 6 0v4m0-2a3 3 0 0 1 6 0v6c0 6-4 10-10 10-5 0-9-3-11-7l-2-4a2 2 0 0 1 4-2",
  muscleLegs: "M18 12h4v13l-3 13h-4l2-14zm8 0h4v13l1 13h-4l-2-14z",
  muscleHands: "M17 22V13a2 2 0 0 1 4 0v7m0-5a2 2 0 0 1 4 0v6m0-4a2 2 0 0 1 4 0v5m0-2a2 2 0 0 1 4 0v6c0 6-4 9-9 9s-8-4-9-7c-1-3-3-6-2-8a2 2 0 0 1 4 0",
  muscleShoulders: "M14 26c0-7 5-12 10-12s10 5 10 12M17 26v8m14-8v8M14 26h6m8 0h6",
  muscleFace: "M24 34c-7 0-12-5-12-11a12 12 0 0 1 24 0c0 6-5 11-12 11Zm-5-11h2m6 0h2m-8 5c1 1 5 1 6 0",
  calmFinish: "M16 24a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm4 0 2.5 3L28 21",
  target: "M24 10a14 14 0 1 0 0 28 14 14 0 0 0 0-28Zm0 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  glassWater: "M17 12h14l-2 22a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3zm1 8h12",
  checkDone: "M13 25l7 7 15-15",
  reflect: "M24 12v3m9.9 3.1-2.1 2.1M14.1 18.1 12 16M14.1 29.9 12 32m19.9-2.1 2.1 2.1M14 24h-3m26 0h-3M24 18a6 6 0 0 0-3 11l1 3h4l1-3a6 6 0 0 0-3-11Z",
  pathChoose: "M12 34c4-10 8-4 12-14s8-8 12-8M28 8l4 4-4 4",
  walking: "M27 9a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM22 24l3-7 5 2 4 6M18 38l4-9 2-4M28 38l-2-9-4-4M14 22l6-3",
  footStep: "M18 12c-3 0-4 3-4 6s2 4 4 4 3-2 3-5-1-5-3-5Zm11 8c-3 0-4 3-4 6s2 4 4 4 3-2 3-5-1-5-3-5ZM15 30h6m8-16h6",
  thoughtCloud: "M18 26a5 5 0 0 1 0-10 6 6 0 0 1 11-3 5 5 0 0 1 1 10Zm-3 8h1m4 0h1m4 0h1",
  standStill: "M24 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 6v14m-5 8 5-8 5 8m-8-14h6",
  clipboard: "M18 11h12v4H18zm-3 3h18v22H15zm4 7h10m-10 5h10m-10 5h6",
  chartUp: "M13 34V21m8 13V15m8 19V24m8 10V12M13 34h26",
  twoPeople: "M15 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4 14c0-5 2-8 4-8s4 3 4 8m14-14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4 14c0-5 2-8 4-8s4 3 4 8",
  peopleGroup: "M17 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-4 12c0-4 2-7 4-7s4 3 4 7m7-12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-4 12c0-4 2-7 4-7s4 3 4 7m7-12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-4 12c0-4 2-7 4-7s4 3 4 7",
  notebook: "M16 10h13l3 3v25H16zm3 8h10m-10 5h10m-10 5h6",
  headsetCoach: "M14 25v-3a10 10 0 0 1 20 0v3M12 25a2 2 0 0 1 4 0v5a2 2 0 0 1-4 0Zm20 0a2 2 0 0 1 4 0v5a2 2 0 0 1-4 0Zm0 5v2a3 3 0 0 1-3 3h-4",
  staircase: "M12 34h6v-6h6v-6h6v-6h6",
  gauge: "M12 30a12 12 0 1 1 24 0M24 30l6-8m-16 8h-2m20 0h2",
  shield: "M24 10l11 4v9c0 8-5 13-11 15-6-2-11-7-11-15v-9z",
  sliderPacing: "M13 17h22M13 24h22M13 31h22M18 17v0m10 7v0m-6 7v0",
  branchPaths: "M15 12v10c0 4 3 5 5 5h8c2 0 5 1 5 5v6M15 12l-3 3m3-3 3 3m17 17-3 3m3-3 3 3",
  stethoscope: "M16 10v9a6 6 0 0 0 12 0v-9M22 28v3a7 7 0 0 0 14 0v-3m-7-9v0M35 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  testTube: "M20 10h8m-7 0v18a6 6 0 0 0 12 0V10m-12 15h12",
  speechArrow: "M13 15h16v11H21l-5 5v-5h-3zM29 24l6 6m0 0-1-6m1 6-6 1",
  groupRules: "M24 10l11 4v8c0 7-5 12-11 14-6-2-11-7-11-14v-8zM19 24l3.5 3.5L29 21",
  guideFacilitator: "M24 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 6v9m-8 11c1-6 4-9 8-9s7 3 8 9M16 22l-3 3m19-3 3 3",
  openHand: "M20 26V12a2 2 0 0 1 4 0v9m0-8a2 2 0 0 1 4 0v8m0-6a2 2 0 0 1 4 0v6m0-3a2 2 0 0 1 4 0v6c0 6-4 10-10 10s-9-4-10-8c0-3 0-6 2-6s3 2 3 4",
};

export function StepIcon({ icon }: { icon: StepIconKey }) {
  const tone = TONES[icon];
  const path = GLYPHS[icon];
  return (
    <span className={`step-icon step-icon-${tone}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    </span>
  );
}
