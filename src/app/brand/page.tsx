import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import { DoodleSun, DoodleWave } from "../components/Doodles";
import NatureBanner from "../components/NatureBanner";
import { naturePhotos } from "../components/naturePhotos";
import SiteFooter from "../components/SiteFooter";
import { pageMetadata } from "../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Brand & Color System",
  description: "MindHx's color system and design tokens - blue for voice, teal for clinical scales, orange for language, and a reserved red used only for crisis and safety contexts.",
  path: "/brand",
});

type Swatch = { name: string; textColor: string; background: string; usage: string };

const PRIMARY: Swatch[] = [
  { name: "Page", textColor: "#24344A", background: "#FBF3E6", usage: "#24344A on #FBF3E6" },
  { name: "Surface", textColor: "#24344A", background: "#FFFFFF", usage: "#24344A on #FFFFFF" },
  { name: "Signal gradient", textColor: "#FFFFFF", background: "linear-gradient(135deg,#2C6FBA,#2F8F6E)", usage: "#FFFFFF on motion gradient" },
];

const SECONDARY: Swatch[] = [
  { name: "Blue (voice)", textColor: "#2C6FBA", background: "#E5F0FB", usage: "#2C6FBA on #E5F0FB" },
  { name: "Teal (clinical)", textColor: "#2F8F6E", background: "#E3F6EE", usage: "#2F8F6E on #E3F6EE" },
  { name: "Orange (words)", textColor: "#E98232", background: "#FFF0E3", usage: "#E98232 on #FFF0E3" },
];

const TECHNICAL: Swatch[] = [
  { name: "Crisis red", textColor: "#8B3535", background: "#FBE9E8", usage: "#8B3535 on #FBE9E8 - reserved for crisis/safety UI only" },
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
    <>
    <main className="resource-page brand-page">
      <DoodleSun className="doodle doodle-orange doodle-float-slow" style={{ top: "95px", right: "5%" }} />
      <DoodleWave className="doodle doodle-teal doodle-sway" style={{ top: "55%", left: "2%" }} />
      <SiteHeader backLabel="Back to check-in" />
      <section className="resource-hero">
        <p className="eyebrow">BRAND</p>
        <h1>Color system<br /><em>for every touchpoint.</em></h1>
        <p>MindHx pairs a calm, clinical light base with three signal colors - blue for voice, teal for the PHQ-9-family clinical scales, and orange for language - plus a reserved red used only for crisis and safety contexts, never decoratively.</p>
      </section>
      <NatureBanner {...naturePhotos.mountainLake} priority />
      <SwatchGroup eyebrow="PRIMARY" description="Standard use across all brand touchpoints" swatches={PRIMARY} />
      <SwatchGroup eyebrow="SECONDARY" description="Creative contexts only - marketing collateral, banners" swatches={SECONDARY} />
      <SwatchGroup eyebrow="TECHNICAL" description="Documentation sites and technical contexts only" swatches={TECHNICAL} />
    </main>
    <SiteFooter />
    </>
  );
}
