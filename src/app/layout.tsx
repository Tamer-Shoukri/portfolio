import type { Metadata, Viewport } from "next";
import "./globals.css";
import { profile } from "@/data/content";

// Public URL of the deployed site. Link previews (LinkedIn, Slack, iMessage)
// need absolute URLs for og:image, so everything resolves against this.
const SITE_URL = "https://tamer-shoukri.github.io/portfolio/";
const title = `${profile.name} — ${profile.title}`;
const description =
  "CS student at Western University building real, working software — including Ninja Motion, a webcam hand-tracking game, and Math Tug-of-War. Open to internships & co-ops.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: profile.name,
    title,
    description,
    images: [{ url: "og.png", width: 1200, height: 630, alt: `${profile.name} — portfolio` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
