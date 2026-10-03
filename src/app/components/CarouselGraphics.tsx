// Original, hand-built illustrations for the home-page feature carousel,
// matching the glossy-3D-badge language already used in SignalGraphics.tsx
// and StepIcons.tsx. No external art assets.

type GraphicProps = { size?: number };

export function ChatSupportGraphic({ size = 88 }: GraphicProps) {
  return (
    <span className="carousel-graphic" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <circle cx="60" cy="60" r="56" fill="url(#carouselChatGrad)" />
        <circle cx="42" cy="38" r="16" fill="#fff" opacity=".22" />
        <g fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M34 42h52a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H56l-14 12v-12h-8a6 6 0 0 1-6-6V48a6 6 0 0 1 6-6Z" fill="#ffffff" opacity=".92" stroke="none" />
        </g>
        <g fill="var(--teal-deep,#1c5c42)" opacity=".6">
          <circle cx="48" cy="60" r="3.2" />
          <circle cx="60" cy="60" r="3.2" />
          <circle cx="72" cy="60" r="3.2" />
        </g>
        <defs>
          <radialGradient id="carouselChatGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#6fcaa8" />
            <stop offset="100%" stopColor="var(--teal)" />
          </radialGradient>
        </defs>
      </svg>
    </span>
  );
}

export function PracticeGraphic({ size = 88 }: GraphicProps) {
  return (
    <span className="carousel-graphic" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <circle cx="60" cy="60" r="56" fill="url(#carouselLeafGrad)" />
        <circle cx="42" cy="38" r="16" fill="#fff" opacity=".22" />
        <g fill="#ffffff" opacity=".92">
          <path d="M60 32c16 6 24 20 24 34 0 14-11 24-24 24s-24-10-24-24c0-14 8-28 24-34Z" />
        </g>
        <path d="M60 40v50" fill="none" stroke="var(--orange-deep,#7a4318)" strokeWidth="2.6" strokeLinecap="round" opacity=".55" />
        <path d="M60 52c-6-3-11-2-14 2M60 68c6-3 11-2 14 2" fill="none" stroke="var(--orange-deep,#7a4318)" strokeWidth="2.6" strokeLinecap="round" opacity=".5" />
        <defs>
          <radialGradient id="carouselLeafGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#f5ae74" />
            <stop offset="100%" stopColor="var(--orange)" />
          </radialGradient>
        </defs>
      </svg>
    </span>
  );
}

export function CommunityGraphic({ size = 88 }: GraphicProps) {
  return (
    <span className="carousel-graphic" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <circle cx="60" cy="60" r="56" fill="url(#carouselPeopleGrad)" />
        <circle cx="42" cy="38" r="16" fill="#fff" opacity=".22" />
        <g fill="#ffffff" opacity=".92">
          <circle cx="46" cy="48" r="10" />
          <path d="M28 86c0-13 8-21 18-21s18 8 18 21Z" />
          <circle cx="76" cy="44" r="8.5" opacity=".75" />
          <path d="M60 86c1-11 8-18 16-18s16 7 17 18Z" opacity=".75" />
        </g>
        <defs>
          <radialGradient id="carouselPeopleGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#7fb3e6" />
            <stop offset="100%" stopColor="var(--blue)" />
          </radialGradient>
        </defs>
      </svg>
    </span>
  );
}

export function ShieldGraphic({ size = 88 }: GraphicProps) {
  return (
    <span className="carousel-graphic" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <circle cx="60" cy="60" r="56" fill="url(#carouselShieldGrad)" />
        <circle cx="42" cy="38" r="16" fill="#fff" opacity=".22" />
        <path d="M60 30 86 40v20c0 20-11 33-26 38-15-5-26-18-26-38V40Z" fill="#ffffff" opacity=".92" />
        <path d="M49 60l8 8 15-17" fill="none" stroke="var(--red-deep,#8f2f2f)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity=".65" />
        <defs>
          <radialGradient id="carouselShieldGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#e58d8d" />
            <stop offset="100%" stopColor="var(--red)" />
          </radialGradient>
        </defs>
      </svg>
    </span>
  );
}
