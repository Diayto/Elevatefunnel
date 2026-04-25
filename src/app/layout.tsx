import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { getSiteMetadataBase } from "@/lib/siteUrl";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: getSiteMetadataBase(),
  title: "Elevate Interns",
  description:
    "Первая организация в СНГ которая помогает студентам за 45 дней получить международную стажировку в самых топовых компаниях мира.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Elevate Interns",
    description:
      "Международные стажировки с ментором, системой и фокусом на результат.",
    siteName: "Elevate Interns",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elevate Interns",
    description:
      "Международные стажировки с ментором, системой и фокусом на результат.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={interTight.variable}>
      <body className="min-h-screen bg-black antialiased font-[family-name:var(--font-inter-tight)]">
        {children}
      </body>
    </html>
  );
}
