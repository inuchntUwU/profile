import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // OGP などの相対 URL を絶対 URL に解決するための基準。profile.siteUrl を実際の公開先にすること。
  metadataBase: new URL(profile.siteUrl),
  title: profile.handle,
  description: profile.tagline,
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    title: profile.handle,
    description: profile.tagline,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
