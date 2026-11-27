import { ImageResponse } from "next/og";
import { site } from "@/config/sites";

/** A monogram (first letter of the site name) in the site's colours. */
export function iconImage(size: number, rounded: boolean) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: site.themeColors.primary,
          color: "#ffffff",
          fontSize: size * 0.62,
          fontWeight: 700,
          borderRadius: rounded ? size * 0.22 : 0,
        }}
      >
        {site.siteName.charAt(0).toUpperCase()}
      </div>
    ),
    { width: size, height: size },
  );
}
