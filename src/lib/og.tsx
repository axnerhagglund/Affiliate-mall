import { ImageResponse } from "next/og";
import { site } from "@/config/sites";

export const ogSize = { width: 1200, height: 630 };

/**
 * The share image (1200×630) for any page: a label, the page title and the
 * site name, in the site's colours. Rendered at build time.
 */
export function ogImage({ title, label }: { title: string; label?: string }) {
  const { primaryDark, accent, soft } = site.themeColors;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `linear-gradient(135deg, #17211b 0%, ${primaryDark} 100%)`,
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30, color: accent, letterSpacing: 4 }}>
          <div style={{ width: 56, height: 4, background: accent }} />
          {(label ?? site.siteName).toUpperCase()}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 60 ? 56 : 68, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: soft }}>{site.siteName}</div>
      </div>
    ),
    ogSize,
  );
}
