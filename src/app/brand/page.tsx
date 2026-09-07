import SiteHeader from "../components/SiteHeader";
import { DoodleSun, DoodleWave } from "../components/Doodles";

type Swatch = { name: string; textColor: string; background: string; usage: string };

const PRIMARY: Swatch[] = [
  { name: "Dark", textColor: "#EDF5FB", background: "#08121F", usage: "#EDF5FB on #08121F" },
  { name: "Light", textColor: "#172B49", background: "#FFFFFF", usage: "#172B49 on #FFFFFF" },
  { name: "Signal gradient", textColor: "#FFFFFF", background: "linear-gradient(135deg,#2C7BC4,#54B49A)", usage: "#FFFFFF on motion gradient" },
];

const SECONDARY: Swatch[] = [
  { name: "Blue (voice)", textColor: "#66B1EE", background: "#193349", usage: "#66B1EE on #193349" },
  { name: "Teal (clinical)", textColor: "#70C6A7", background: "#0D1D2D", usage: "#70C6A7 on #0D1D2D" },
  { name: "Orange (words)", textColor: "#FFFFFF", background: "#E98232", usage: "#FFFFFF on #E98232" },
];

const TECHNICAL: Swatch[] = [
  { name: "Crisis red", textColor: "#FFC6C6", background: "#102438", usage: "#FFC6C6 on #102438 - reserved for crisis/safety UI only" },
];

function SwatchGroup({ eyebrow, description, swatches }: { eyebrow: string; description: string; swatches: Swatch[] }) {
  return (
    <section className="brand-group">
      <div className="brand-group-heading">
        <span className="brand-group-label">{eyebrow}</span>
        <span className="brand-group-rule" />
        <span className="brand-group-desc">{description}</span>
      </div>
      <div className="brand-swatch-grid">
        {swatches.map((swatch) => (
          <article className="brand-swatch" key={swatch.name}>
            <div className="brand-swatch-panel" style={{ background: swatch.background }}>
              <span className="brand-swatch-wordmark" style={{ color: swatch.textColor }}>Mind<b>Hx</b></span>
            </div>
            <footer className="brand-swatch-footer">
              <b>{swatch.name}</b>
              <span>{swatch.usage}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function BrandPage() {
  return (
    <main className="resource-page brand-page">
      <DoodleSun className="doodle doodle-orange doodle-float-slow" style={{ top: "95px", right: "5%" }} />
      <DoodleWave className="doodle doodle-teal doodle-sway" style={{ top: "55%", left: "2%" }} />
      <SiteHeader backLabel="Back to check-in" />
      <section className="resource-hero">
        <p className="eyebrow">BRAND</p>
        <h1>Color system<br /><em>for every touchpoint.</em></h1>
        <p>MindHx pairs a calm, clinical dark base with three signal colors - blue for voice, teal for the PHQ-9-family clinical scales, and orange for language - plus a reserved red used only for crisis and safety contexts, never decoratively.</p>
      </section>
      <SwatchGroup eyebrow="PRIMARY" description="Standard use across all brand touchpoints" swatches={PRIMARY} />
      <SwatchGroup eyebrow="SECONDARY" description="Creative contexts only - marketing collateral, banners" swatches={SECONDARY} />
      <SwatchGroup eyebrow="TECHNICAL" description="Documentation sites and technical contexts only" swatches={TECHNICAL} />
    </main>
  );
}
