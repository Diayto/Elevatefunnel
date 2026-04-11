import type { Metadata, Viewport } from "next";
import { Inter, Mulish } from "next/font/google";
import "./globals.css";

/**
 * Mulish (Muli) — основной текст и крупные заголовки.
 * Две CSS-переменные для совместимости с существующими классами (--font-sans / --font-serif).
 */
const sans = Mulish({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const display = Mulish({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/** Только логотип «Elevate Interns» в шапке — Inter. */
const interLogo = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter-logo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elevate Interns",
  description:
    "Структурированный доступ к международным стажировкам с менторской поддержкой и ИИ.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${sans.variable} ${display.variable} ${interLogo.variable}`}
      style={{ backgroundColor: "var(--bg-deep)" }}
    >
      <body className="min-h-screen bg-[var(--bg-deep)] antialiased font-[family-name:var(--font-sans)]">
        {children}
      </body>
    </html>
  );
}
