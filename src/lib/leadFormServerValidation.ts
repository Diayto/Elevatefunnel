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
} from "@/lib/funnel/leadFormConfig";

function optionValues(
  options: readonly { value: string; label: string }[],
): ReadonlySet<string> {
  return new Set(options.map((o) => o.value));
}

const AGE = optionValues(LEAD_AGE_OPTIONS);
const STATUS = optionValues(LEAD_STUDY_STATUS_OPTIONS);
const COURSE = optionValues(LEAD_COURSE_OPTIONS);
const ENGLISH_LEVEL = optionValues(LEAD_ENGLISH_LEVEL_OPTIONS);
const ENGLISH_CERT = optionValues(LEAD_ENGLISH_CERT_OPTIONS);
const START_TIMING = optionValues(LEAD_START_TIMING_OPTIONS);
const FINANCIAL_SITUATION = optionValues(LEAD_FINANCIAL_SITUATION_OPTIONS);
const FINANCIAL_DECISION = optionValues(LEAD_FINANCIAL_DECISION_OPTIONS);
const CONSULTATION_GOALS = optionValues(LEAD_CONSULTATION_GOALS_OPTIONS);

const VIDEOS_WATCHED_RE = /^\d{1,2}\/7$/;

export function isValidVideosWatched(value: string): boolean {
  if (!VIDEOS_WATCHED_RE.test(value)) return false;
  const watched = Number(value.split("/")[0]);
  return Number.isFinite(watched) && watched >= 0 && watched <= 7;
}

export function sanitizeWatchLog(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "{}") return "{}";
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "{}";
    const entries = Object.entries(parsed as Record<string, unknown>).slice(0, 16);
    const safe: Record<string, number> = {};
    for (const [key, val] of entries) {
      const k = key.slice(0, 32);
      if (!k) continue;
      const n = typeof val === "number" ? val : Number(val);
      if (!Number.isFinite(n) || n < 0) continue;
      safe[k] = Math.min(Math.floor(n), 86_400);
    }
    return JSON.stringify(safe);
  } catch {
    return "{}";
  }
}

export function parseConsultationGoals(raw: string): string[] {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export type LeadChoiceFields = {
  age_value: string;
  status: string;
  course: string;
  english_level: string;
  english_certificate: string;
  start_timing: string;
  financial_situation: string;
  financial_decision: string;
  consultation_goals: string;
};

export function validateLeadChoices(fields: LeadChoiceFields): boolean {
  if (!AGE.has(fields.age_value)) return false;
  if (!STATUS.has(fields.status)) return false;
  if (!ENGLISH_LEVEL.has(fields.english_level)) return false;
  if (!ENGLISH_CERT.has(fields.english_certificate)) return false;
  if (!START_TIMING.has(fields.start_timing)) return false;
  if (!FINANCIAL_SITUATION.has(fields.financial_situation)) return false;
  if (!FINANCIAL_DECISION.has(fields.financial_decision)) return false;

  const needsCourse = fields.status === "studying" || fields.status === "studying_working";
  if (needsCourse) {
    if (!fields.course || !COURSE.has(fields.course)) return false;
  } else if (fields.course && !COURSE.has(fields.course)) {
    return false;
  }

  const goals = parseConsultationGoals(fields.consultation_goals);
  if (goals.length === 0) return false;
  if (!goals.every((g) => CONSULTATION_GOALS.has(g))) return false;

  return true;
}
