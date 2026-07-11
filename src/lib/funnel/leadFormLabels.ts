import {
  LEAD_AGE_OPTIONS,
  LEAD_CONSULTATION_GOALS_OPTIONS,
  LEAD_COURSE_OPTIONS,
  LEAD_ENGLISH_CERT_OPTIONS,
  LEAD_ENGLISH_LEVEL_OPTIONS,
  LEAD_FINANCIAL_DECISION_OPTIONS,
  LEAD_FINANCIAL_SITUATION_OPTIONS,
  LEAD_START_TIMING_OPTIONS,
  LEAD_STUDY_STATUS_OPTIONS,
  labelForOption,
} from "@/lib/funnel/leadFormConfig";

function labelFrom(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return value ? labelForOption(options, value) : "";
}

function labelMulti(
  options: readonly { value: string; label: string }[],
  raw: string,
): string {
  if (!raw.trim()) return "";
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((value) => labelForOption(options, value))
    .join("; ");
}

export type LeadSubmissionInput = {
  name: string;
  age: string;
  age_value?: string;
  country: string;
  status: string;
  course: string;
  specialty: string;
  interest_reason: string;
  internship_understanding: string;
  career_importance: string;
  experience: string;
  english_level: string;
  english_certificate: string;
  internship_field: string;
  target_countries: string;
  start_timing: string;
  financial_situation: string;
  financial_decision: string;
  career_blockers: string;
  consultation_goals: string;
  additional_notes: string;
  contact: string;
  videos_watched: string;
  watch_log: string;
};

export type LeadSheetsRow = LeadSubmissionInput & {
  age_label: string;
  status_label: string;
  course_label: string;
  english_level_label: string;
  english_certificate_label: string;
  start_timing_label: string;
  financial_situation_label: string;
  financial_decision_label: string;
  consultation_goals_label: string;
  submittedAt: string;
  source: "elevate-funnel";
};

export function toSheetsRow(input: LeadSubmissionInput): LeadSheetsRow {
  const ageValue = input.age_value?.trim() || input.age.trim();

  return {
    ...input,
    age_label: input.age.trim() || labelFrom(LEAD_AGE_OPTIONS, ageValue),
    status_label: labelFrom(LEAD_STUDY_STATUS_OPTIONS, input.status),
    course_label: labelFrom(LEAD_COURSE_OPTIONS, input.course),
    english_level_label: labelFrom(LEAD_ENGLISH_LEVEL_OPTIONS, input.english_level),
    english_certificate_label: labelFrom(LEAD_ENGLISH_CERT_OPTIONS, input.english_certificate),
    start_timing_label: labelFrom(LEAD_START_TIMING_OPTIONS, input.start_timing),
    financial_situation_label: labelFrom(
      LEAD_FINANCIAL_SITUATION_OPTIONS,
      input.financial_situation,
    ),
    financial_decision_label: labelFrom(
      LEAD_FINANCIAL_DECISION_OPTIONS,
      input.financial_decision,
    ),
    consultation_goals_label: labelMulti(
      LEAD_CONSULTATION_GOALS_OPTIONS,
      input.consultation_goals,
    ),
    submittedAt: new Date().toISOString(),
    source: "elevate-funnel",
  };
}
