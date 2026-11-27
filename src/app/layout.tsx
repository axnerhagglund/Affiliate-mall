import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Lora } from "next/font/google";
import type { CSSProperties } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/config/sites";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const heading = Lora({ variable: "--font-heading", subsets: ["latin"] });

// Every page is generated at build time; nothing may render per request.
export const ensureStatic = "navigation";

export const metadata: Metadata = rootMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  const colors = {
    "--brand": site.themeColors.primary,
    "--brand-dark": site.themeColors.primaryDark,
    "--brand-soft": site.themeColors.soft,
    "--accent": site.themeColors.accent,
  } as CSSProperties;
  return (
    <html lang="sv" style={colors} className={`${body.variable} ${heading.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
        >
          Hoppa till innehållet
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Cookie-free statistics, only on Vercel (not locally or on other hosts). */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
