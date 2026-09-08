// Original, hand-built illustrations for the three home-page signal cards
// (voice, words, clinical check-in) - large supportive graphics rendered
// above each card's heading, in the same glossy-3D-badge language as
// StepIcons.tsx but bigger and more detailed. No external art assets.

type GraphicProps = { size?: number };

export function VoiceSignalGraphic({ size = 96 }: GraphicProps) {
  return (
    <span className="signal-graphic signal-graphic-orange" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <circle cx="60" cy="60" r="56" fill="url(#voiceGrad)" />
        <circle cx="42" cy="38" r="16" fill="#fff" opacity=".22" />
        <g fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round">
          <path d="M60 40a10 10 0 0 1 10 10v14a10 10 0 0 1-20 0V50a10 10 0 0 1 10-10Z" fill="#ffffff" opacity=".92" stroke="none" />
          <path d="M45 64a15 15 0 0 0 30 0" />
          <path d="M60 79v8" />
          <path d="M52 87h16" />
          <path d="M27 60c0 6 2 10 4 13" opacity=".85" />
          <path d="M18 60c0 9 3 16 7 21" opacity=".55" />
          <path d="M93 60c0 6-2 10-4 13" opacity=".85" />
          <path d="M102 60c0 9-3 16-7 21" opacity=".55" />
        </g>
        <defs>
          <radialGradient id="voiceGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#f7b27e" />
            <stop offset="100%" stopColor="var(--orange)" />
          </radialGradient>
        </defs>
      </svg>
    </span>
  );
}

export function WordsSignalGraphic({ size = 96 }: GraphicProps) {
  return (
    <span className="signal-graphic signal-graphic-blue" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <circle cx="60" cy="60" r="56" fill="url(#wordsGrad)" />
        <circle cx="42" cy="38" r="16" fill="#fff" opacity=".22" />
        <g fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="34" y="38" width="52" height="40" rx="8" fill="#ffffff" opacity=".92" stroke="none" />
          <path d="M44 52h32" stroke="var(--blue-deep,#194d85)" opacity=".55" />
          <path d="M44 62h32" stroke="var(--blue-deep,#194d85)" opacity=".55" />
          <path d="M44 72h20" stroke="var(--blue-deep,#194d85)" opacity=".55" />
          <path d="M46 78 38 90l14-6" fill="#ffffff" opacity=".92" stroke="none" />
        </g>
        <defs>
          <radialGradient id="wordsGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#7fb3e6" />
            <stop offset="100%" stopColor="var(--blue)" />
          </radialGradient>
        </defs>
      </svg>
    </span>
  );
}

export function ClinicalSignalGraphic({ size = 96 }: GraphicProps) {
  return (
    <span className="signal-graphic signal-graphic-red" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <circle cx="60" cy="60" r="56" fill="url(#clinicalGrad)" />
        <circle cx="42" cy="38" r="16" fill="#fff" opacity=".22" />
        <g fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="38" y="36" width="44" height="52" rx="7" fill="#ffffff" opacity=".92" stroke="none" />
          <rect x="50" y="30" width="20" height="10" rx="3" fill="#ffffff" opacity=".92" stroke="none" />
          <path d="M46 66h8l4-10 6 20 5-14 4 8h9" stroke="var(--red-deep,#8f2f2f)" opacity=".6" />
          <circle cx="60" cy="79" r="4.5" fill="var(--red-deep,#8f2f2f)" opacity=".6" stroke="none" />
        </g>
        <defs>
          <radialGradient id="clinicalGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#e58d8d" />
            <stop offset="100%" stopColor="var(--red)" />
          </radialGradient>
        </defs>
      </svg>
    </span>
  );
}
