"use client";

import { useState } from "react";
import { CasesSection } from "@/components/funnel/CasesSection";
import { LeadFormSection } from "@/components/funnel/LeadFormSection";
import { OfferHero } from "@/components/funnel/OfferHero";
import { ProgressBar } from "@/components/funnel/ProgressBar";
import { VideoQuestionsSection } from "@/components/funnel/VideoQuestionsSection";
import { WarmupSection } from "@/components/funnel/WarmupSection";
import { FunnelFooter } from "@/components/layout/FunnelFooter";
import { FunnelHeader } from "@/components/layout/FunnelHeader";
import { useVideoWatchProgress } from "@/lib/funnel/useVideoWatchProgress";

export function FunnelPage() {
  const { state, watchedCount, allWatched, markWatched } = useVideoWatchProgress();
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <>
      <FunnelHeader />
      <ProgressBar formSubmitted={formSubmitted} />

      <main className="relative z-10 overflow-x-clip bg-black pt-[120px] sm:pt-[124px] lg:pt-[100px]">
        <OfferHero />
        <VideoQuestionsSection
          watchState={state}
          watchedCount={watchedCount}
          allWatched={allWatched}
          onMarkWatched={markWatched}
        />
        <WarmupSection />
        <CasesSection />
        <LeadFormSection watchState={state} onSubmitted={() => setFormSubmitted(true)} />

        <div className="mx-auto max-w-[1200px] px-8">
          <div className="h-px bg-white/10" />
        </div>

        <FunnelFooter />
      </main>
    </>
  );
}
