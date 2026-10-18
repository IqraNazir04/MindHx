import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "MindHx - Notice the signal. Keep the human.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The app's own icon.png (512x512, already has its rounded-square teal
// background baked in) reused here rather than the tall logo-mark.png,
// which isn't square enough for a clean social-card logo.
const logoData = await readFile(join(process.cwd(), "src/app/icon.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#2C6FBA 0%,#2F8F6E 100%)",
        }}
      >
        <img src={logoSrc} width={150} height={150} style={{ borderRadius: 34 }} alt="" />
        <div style={{ display: "flex", marginTop: 40, fontSize: 92, fontWeight: 700, color: "#ffffff" }}>
          Mind<span style={{ color: "#F6B26B" }}>Hx</span>
        </div>
        <div style={{ display: "flex", marginTop: 18, fontSize: 34, color: "rgba(255,255,255,0.92)" }}>
          Notice the signal. Keep the human.
        </div>
      </div>
    ),
    { ...size }
  );
}
