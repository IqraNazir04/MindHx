import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Matches the .brand-mark badge used in SiteHeader/SiteFooter (linear
// gradient blue -> teal, serif "M"), so the browser tab icon is the same
// mark as the in-app wordmark rather than a generic default favicon.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "linear-gradient(135deg, #2c6fba, #2f8f6e)",
          color: "#fff",
          fontSize: 40,
          fontFamily: "Georgia, serif",
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
