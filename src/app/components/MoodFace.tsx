// Original, hand-built glossy 3D mood faces replacing plain emoji, matching
// the badge language used in SignalGraphics/StepIcons (radial-gradient body,
// inset highlight, drop shadow) so the mood scale feels designed rather than
// borrowed from the OS emoji font. Mouth curves form one consistent
// progression (Bezier control point above the corners = frown, below the
// corners = smile) so the five expressions read as a clear continuum.
const TONES: Record<number, { from: string; to: string }> = {
  1: { from: "#e58d8d", to: "var(--red)" },
  2: { from: "#f5ae74", to: "var(--orange)" },
  3: { from: "#9aa8b8", to: "var(--muted)" },
  4: { from: "#7fb3e6", to: "var(--blue)" },
  5: { from: "#6fcaa8", to: "var(--teal)" },
};

const DOT_EYES = "M42 50a3.6 3.6 0 1 0 7.2 0 3.6 3.6 0 0 0-7.2 0Zm26 0a3.6 3.6 0 1 0 7.2 0 3.6 3.6 0 0 0-7.2 0Z";
const HAPPY_EYES = "M35 51q6-9 12 0M63 51q6-9 12 0";

const FACE_PATHS: Record<number, { eyesFilled: boolean; eyes: string; mouth: string; brows?: string }> = {
  1: { brows: "M34 39l11 5M76 39l-11 5", eyesFilled: true, eyes: DOT_EYES, mouth: "M40 80q15-20 30 0" },
  2: { eyesFilled: true, eyes: DOT_EYES, mouth: "M42 78q13-11 26 0" },
  3: { eyesFilled: true, eyes: DOT_EYES, mouth: "M42 76h26" },
  4: { eyesFilled: true, eyes: DOT_EYES, mouth: "M42 74q13 11 26 0" },
  5: { eyesFilled: false, eyes: HAPPY_EYES, mouth: "M37 72q18 22 36 0" },
};

export function MoodFace({ mood, size = 40 }: { mood: number; size?: number }) {
  const tone = TONES[mood] ?? TONES[3];
  const face = FACE_PATHS[mood] ?? FACE_PATHS[3];
  const gradId = `moodGrad${mood}`;
  return (
    <span className="mood-face-graphic" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 110 110" width="100%" height="100%">
        <defs>
          <radialGradient id={gradId} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={tone.from} />
            <stop offset="100%" stopColor={tone.to} />
          </radialGradient>
        </defs>
        <circle cx="55" cy="55" r="51" fill={`url(#${gradId})`} />
        <circle cx="38" cy="35" r="14" fill="#fff" opacity=".2" />
        {face.brows && (
          <path d={face.brows} fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" />
        )}
        <path
          d={face.eyes}
          fill={face.eyesFilled ? "#fff" : "none"}
          stroke={face.eyesFilled ? "none" : "#fff"}
          strokeWidth={face.eyesFilled ? 0 : 4.2}
          strokeLinecap="round"
        />
        <path d={face.mouth} fill="none" stroke="#fff" strokeWidth="4.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}
