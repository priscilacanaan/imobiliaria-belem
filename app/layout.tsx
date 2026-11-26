import type { Metadata } from "next";
import "./globals.css";
import { siteSettings } from "@/content/seed";

export const metadata: Metadata = {
  title: siteSettings.brandName,
  description: siteSettings.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
