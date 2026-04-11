import type { Metadata } from "next";
import Link from "next/link";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";
import { AtmosphereBackdrop } from "@/components/layout/AtmosphereBackdrop";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | Elevate Interns",
  description:
    "Политика конфиденциальности и обработки персональных данных ИП «Тлеуғалиұлы» (Elevate Interns).",
};

export default function PrivacyPage() {
  return (
    <>
      <AtmosphereBackdrop />
      <SiteHeader />
      <main className="relative z-10 min-h-[80vh] px-5 pb-24 pt-[4.75rem] sm:px-6 md:px-14 md:pb-32 md:pt-[5.25rem] lg:px-20">
        <PrivacyPolicyContent />
        <p className="mx-auto mt-12 max-w-3xl text-center md:text-left">
          <Link
            className="text-sm text-[var(--accent)] underline-offset-4 transition hover:underline"
            href="/#act-apply"
          >
            ← К форме заявки
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
