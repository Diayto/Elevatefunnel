import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import Script from "next/script";
import { getSiteMetadataBase } from "@/lib/siteUrl";
import "./globals.css";

const META_PIXEL_ID = "26431845113149106";

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: getSiteMetadataBase(),
  title: "Стратегическая сессия | Elevate Interns",
  description:
    "Стратегическая сессия от Elevate.Interns: международные стажировки, разбор профиля и пошаговый план для студентов 1–4 курса.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Стратегическая сессия | Elevate Interns",
    description:
      "Персональный разбор профиля и план получения международной стажировки.",
    siteName: "Elevate Interns",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Стратегическая сессия | Elevate Interns",
    description:
      "Персональный разбор профиля и план получения международной стажировки.",
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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* Meta Pixel noscript fallback — raw 1×1 tracking URL (not next/image). */}
          {/* eslint-disable-next-line @next/next/no-img-element -- third-party pixel */}
          <img
            height={1}
            width={1}
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
