import type { NextConfig } from "next";
import { site } from "./src/config/sites";
import { retailers } from "./src/config/retailers";

const host = new URL(site.domain).host;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: {
    // Styles arrive with the HTML instead of as a render-blocking request (better LCP).
    inlineCss: true,
  },
  images: {
    // Product images may come from a store's CDN when the affiliate programme allows it.
    remotePatterns: Object.values(retailers).flatMap((retailer) =>
      retailer.hosts.map((hostname) => ({ protocol: "https" as const, hostname })),
    ),
  },
  // One canonical host: www.<domain> -> <domain> (permanent).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${host}` }],
        destination: `${site.domain}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Browsers that have seen the site once always use HTTPS afterwards.
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The breeder map needs no geolocation: it filters by county.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // No script-src: prerendered pages rely on inline scripts.
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
        ],
      },
    ];
  },
  // Browsers ask for /favicon.ico on their own; serve the generated PNG icon.
  async rewrites() {
    return { beforeFiles: [{ source: "/favicon.ico", destination: "/icon" }], afterFiles: [], fallback: [] };
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
