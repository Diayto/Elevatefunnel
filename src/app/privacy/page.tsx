import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";
import { FunnelFooter } from "@/components/layout/FunnelFooter";
import { FunnelHeader } from "@/components/layout/FunnelHeader";
import { FUNNEL_SECTION_IDS } from "@/lib/funnel/config";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | Elevate Interns",
  description:
    "Политика конфиденциальности и обработки персональных данных ИП «Тлеуғалиұлы» (Elevate Interns).",
};

export default function PrivacyPage() {
  return (
    <>
      <FunnelHeader />
      <main className="relative z-10 min-h-screen overflow-hidden bg-black pt-[72px] sm:pt-[80px]">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <div
            className="absolute"
            style={{ left: "-200px", top: "200px", width: "500px", height: "500px", opacity: 0.3 }}
          >
            <Image src="/figma/gradients/blob-4.svg" alt="" fill className="object-contain" />
          </div>
          <div
            className="absolute"
            style={{ right: "-150px", top: "600px", width: "400px", height: "400px", opacity: 0.25 }}
          >
            <Image src="/figma/gradients/blob-3.svg" alt="" fill className="object-contain" />
          </div>
          <div
            className="absolute"
            style={{ left: "300px", top: "100px", width: "596px", height: "438px", opacity: 0.15 }}
          >
            <Image src="/figma/gradients/grid-2.svg" alt="" fill className="object-contain" />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[800px] px-8 pb-20 pt-12">
          <PrivacyPolicyContent />

          <p className="mt-12 text-center">
            <Link
              className="inline-flex items-center gap-2 text-[14px] text-[#4a8fff] transition hover:text-white"
              href={`/#${FUNNEL_SECTION_IDS.form}`}
            >
              ← К анкете
            </Link>
          </p>
        </div>

        <div className="mx-auto max-w-[1200px] px-8">
          <div className="h-px bg-white/10" />
        </div>

        <FunnelFooter />
      </main>
    </>
  );
}
