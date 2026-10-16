import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // The plain `new URL(...)` shorthand implies an empty `search`, which
    // blocks every query string - including the `?q=...&w=...` resize
    // params naturePhotos.ts appends to cap how large a source image
    // Unsplash serves. Every photo uses that exact same suffix, so this
    // matches it precisely instead of opening search up to "**".
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**", search: "?q=80&w=2600&auto=format&fit=max" },
    ],
  },
  // Proxies same-origin "/api/*" calls (see src/app/lib/api.ts) to the
  // FastAPI backend running alongside this server in the same container.
  // Keeps the browser talking to one origin only, so there's no CORS to
  // configure. Override API_INTERNAL_URL if the backend lives elsewhere
  // (e.g. a different container/host reachable over the network).
  async rewrites() {
    const target = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:8000";
    return [{ source: "/api/:path*", destination: `${target}/:path*` }];
  },
};

export default nextConfig;
