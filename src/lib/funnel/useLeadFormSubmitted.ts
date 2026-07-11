"use client";

import { useCallback, useEffect, useState } from "react";
import {
  markLeadFormSubmitted,
  readLeadFormSubmitted,
} from "@/lib/funnel/leadFormSubmitted";

export function useLeadFormSubmitted() {
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSubmitted(readLeadFormSubmitted());
    setHydrated(true);
  }, []);

  const markSubmitted = useCallback(() => {
    markLeadFormSubmitted();
    setSubmitted(true);
  }, []);

  return { submitted, hydrated, markSubmitted };
}
