export type LeadFormQuestion =
  | {
      id: string;
      number: number;
      type: "text";
      label: string;
      placeholder?: string;
      required: boolean;
      showIf?: (data: LeadFormData) => boolean;
    }
  | {
      id: string;
      number: number;
      type: "textarea";
      label: string;
      placeholder?: string;
      required: boolean;
      rows?: number;
      showIf?: (data: LeadFormData) => boolean;
    }
  | {
      id: string;
      number: number;
      type: "single";
      label: string;
      options: readonly { value: string; label: string }[];
      required: boolean;
      showIf?: (data: LeadFormData) => boolean;
    }
  | {
      id: string;
      number: number;
      type: "multi";
      label: string;
      options: readonly { value: string; label: string }[];
      required: boolean;
      showIf?: (data: LeadFormData) => boolean;
    };

export type LeadFormPage = {
  id: string;
  sectionHeading?: string;
  showIntro?: boolean;
  questions: LeadFormQuestion[];
};

export type LeadFormData = Record<string, string | string[]>;

export const LEAD_FORM_INTRO = {
  title: "Анкета для консультации по стажировкам",
  greeting: "Давайте познакомимся!",
  description:
    "Заполнение анкеты займёт около 3 минут. Это поможет нам подобрать наиболее подходящие возможности и сделать консультацию максимально полезной.",
} as const;

export const LEAD_AGE_OPTIONS = [
  { value: "under_18", label: "До 18" },
  { value: "18_20", label: "18–20" },
  { value: "21_23", label: "21–23" },
  { value: "24_26", label: "24–26" },
  { value: "27_plus", label: "27+" },
] as const;

export const LEAD_STUDY_STATUS_OPTIONS = [
  { value: "studying", label: "Учусь в университете" },
  { value: "studying_working", label: "Учусь и работаю" },
  { value: "working", label: "Только работаю" },
  { value: "graduated", label: "Уже окончил(а) университет" },
  { value: "other", label: "Другое" },
] as const;

export const LEAD_COURSE_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "masters", label: "Магистратура" },
  { value: "graduate", label: "Выпускник" },
  { value: "not_studying", label: "Не обучаюсь" },
] as const;

export const LEAD_ENGLISH_LEVEL_OPTIONS = [
  { value: "a1_a2", label: "A1–A2" },
  { value: "b1", label: "B1" },
  { value: "b2", label: "B2" },
  { value: "c1_plus", label: "C1+" },
  { value: "unknown", label: "Не знаю" },
] as const;

export const LEAD_ENGLISH_CERT_OPTIONS = [
  { value: "ielts", label: "IELTS" },
  { value: "toefl", label: "TOEFL" },
  { value: "duolingo", label: "Duolingo English Test" },
  { value: "other", label: "Другой сертификат" },
  { value: "none", label: "Нет сертификата" },
] as const;

export const LEAD_START_TIMING_OPTIONS = [
  { value: "asap", label: "Как можно скорее" },
  { value: "1_3_months", label: "В течение 1–3 месяцев" },
  { value: "3_6_months", label: "Через 3–6 месяцев" },
  { value: "exploring", label: "Пока просто изучаю возможности" },
] as const;

export const LEAD_FINANCIAL_SITUATION_OPTIONS = [
  { value: "ready_now", label: "Готов(а) инвестировать в сопровождение сейчас" },
  { value: "need_discuss", label: "Рассматриваю, нужно обсудить с близкими" },
  { value: "free_only", label: "Пока интересуют только бесплатные возможности" },
  { value: "not_ready", label: "Не готов(а) платить за сопровождение" },
  { value: "unsure", label: "Затрудняюсь ответить" },
] as const;

export const LEAD_FINANCIAL_DECISION_OPTIONS = [
  { value: "self", label: "Я сам(а)" },
  { value: "parents", label: "Родители" },
  { value: "together", label: "Родители и я вместе" },
  { value: "other", label: "Другое" },
  { value: "unsure", label: "Затрудняюсь ответить" },
] as const;

export const LEAD_CONSULTATION_GOALS_OPTIONS = [
  { value: "fit", label: "Понять, какие стажировки мне подходят" },
  { value: "plan", label: "Получить пошаговый план" },
  { value: "chances", label: "Узнать свои шансы" },
  { value: "process", label: "Разобраться, как проходит весь процесс" },
  {
    value: "start",
    label: "Если всё подойдёт — начать работу",
  },
] as const;

export function needsCourseField(data: LeadFormData): boolean {
  const status = String(data.status ?? "");
  return status === "studying" || status === "studying_working";
}

export const LEAD_FORM_PAGES: LeadFormPage[] = [
  {
    id: "intro",
    showIntro: true,
    questions: [
      {
        id: "name",
        number: 1,
        type: "text",
        label: "Как вас зовут?",
        placeholder: "Тимур",
        required: true,
      },
      {
        id: "age",
        number: 2,
        type: "single",
        label: "Сколько вам лет?",
        options: LEAD_AGE_OPTIONS,
        required: true,
      },
    ],
  },
  {
    id: "profile",
    questions: [
      {
        id: "country",
        number: 3,
        type: "text",
        label: "Из какой вы страны?",
        placeholder: "Казахстан",
        required: true,
      },
      {
        id: "status",
        number: 4,
        type: "single",
        label: "Где вы сейчас обучаетесь или работаете?",
        options: LEAD_STUDY_STATUS_OPTIONS,
        required: true,
      },
      {
        id: "course",
        number: 5,
        type: "single",
        label: "Если учитесь — на каком курсе?",
        options: LEAD_COURSE_OPTIONS,
        required: true,
        showIf: needsCourseField,
      },
    ],
  },
  {
    id: "education",
    questions: [
      {
        id: "specialty",
        number: 6,
        type: "text",
        label: "Какая у вас специальность?",
        placeholder: "Ваша специальность",
        required: true,
      },
    ],
  },
  {
    id: "career-goals",
    sectionHeading: "Карьерные цели",
    questions: [
      {
        id: "interest_reason",
        number: 7,
        type: "textarea",
        label: "Почему вас заинтересовали международные стажировки?",
        required: true,
        rows: 4,
      },
      {
        id: "internship_understanding",
        number: 8,
        type: "textarea",
        label: "Насколько хорошо вы понимаете, как международные стажировки влияют на карьеру?",
        required: true,
        rows: 4,
      },
      {
        id: "career_importance",
        number: 9,
        type: "textarea",
        label: "Насколько для вас сейчас важно развитие карьеры?",
        required: true,
        rows: 4,
      },
    ],
  },
  {
    id: "experience",
    questions: [
      {
        id: "experience",
        number: 10,
        type: "textarea",
        label: "У вас уже есть резюме / LinkedIn / опыт работы / опыт стажировок?",
        placeholder: "Расскажите о том, что у вас есть…",
        required: true,
        rows: 4,
      },
      {
        id: "english_level",
        number: 11,
        type: "single",
        label: "Как бы вы оценили свой уровень английского?",
        options: LEAD_ENGLISH_LEVEL_OPTIONS,
        required: true,
      },
      {
        id: "english_certificate",
        number: 12,
        type: "single",
        label: "Есть ли у вас международный сертификат по английскому?",
        options: LEAD_ENGLISH_CERT_OPTIONS,
        required: true,
      },
    ],
  },
  {
    id: "goals",
    sectionHeading: "Цели",
    questions: [
      {
        id: "internship_field",
        number: 13,
        type: "text",
        label: "В какой сфере вы хотите пройти стажировку?",
        placeholder: "Ваша сфера интересов",
        required: true,
      },
      {
        id: "target_countries",
        number: 14,
        type: "text",
        label: "В каких странах вы хотели бы пройти стажировку?",
        placeholder: "Например: Германия, США…",
        required: true,
      },
      {
        id: "start_timing",
        number: 15,
        type: "single",
        label: "Когда вы хотели бы начать процесс поиска?",
        options: LEAD_START_TIMING_OPTIONS,
        required: true,
      },
    ],
  },
  {
    id: "financial",
    sectionHeading: "Финансовая готовность",
    questions: [
      {
        id: "financial_situation",
        number: 16,
        type: "single",
        label: "Какая ситуация сейчас лучше всего описывает вас?",
        options: LEAD_FINANCIAL_SITUATION_OPTIONS,
        required: true,
      },
      {
        id: "financial_decision",
        number: 17,
        type: "single",
        label: "Кто обычно принимает финансовые решения по подобным вопросам?",
        options: LEAD_FINANCIAL_DECISION_OPTIONS,
        required: true,
      },
    ],
  },
  {
    id: "pains",
    sectionHeading: "Боли",
    questions: [
      {
        id: "career_blockers",
        number: 18,
        type: "textarea",
        label: "Что сейчас больше всего мешает вашему карьерному развитию?",
        required: true,
        rows: 4,
      },
      {
        id: "consultation_goals",
        number: 19,
        type: "multi",
        label: "Что вы хотели бы получить после консультации?",
        options: LEAD_CONSULTATION_GOALS_OPTIONS,
        required: true,
      },
      {
        id: "additional_notes",
        number: 20,
        type: "textarea",
        label: "Есть ли что-то, что нам важно знать до консультации?",
        placeholder: "Напишите здесь…",
        required: true,
        rows: 4,
      },
      {
        id: "contact",
        number: 21,
        type: "text",
        label: "Как с вами связаться?",
        placeholder: "+7 … или @username в Telegram",
        required: true,
      },
    ],
  },
];

export function getVisibleQuestions(page: LeadFormPage, data: LeadFormData): LeadFormQuestion[] {
  return page.questions.filter((q) => !q.showIf || q.showIf(data));
}

export function isQuestionAnswered(question: LeadFormQuestion, data: LeadFormData): boolean {
  const value = data[question.id];

  switch (question.type) {
    case "text":
    case "textarea":
      return typeof value === "string" && value.trim().length >= 2;
    case "single":
      return typeof value === "string" && value.length > 0;
    case "multi":
      return Array.isArray(value) && value.length > 0;
    default:
      return false;
  }
}

export function isPageValid(page: LeadFormPage, data: LeadFormData): boolean {
  const visible = getVisibleQuestions(page, data);
  return visible.every((q) => !q.required || isQuestionAnswered(q, data));
}

export function labelForOption(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function serializeMultiValue(values: string[] | undefined): string {
  if (!values?.length) return "";
  return values.join(", ");
}
