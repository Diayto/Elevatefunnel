export type VideoWatchKey =
  | "main"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6";

export const VIDEO_WATCH_KEYS: VideoWatchKey[] = [
  "main",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
];

export const TOTAL_VIDEOS = VIDEO_WATCH_KEYS.length;

/** Главное видео блока 2 — замените URL на актуальный embed/watch/shorts. */
export const MAIN_VIDEO_URL = "";

export type QuestionVideo = {
  id: VideoWatchKey;
  question: string;
  videoUrl: string;
};

/** Шесть вопросов с видео-ответами — тексты и URL легко менять здесь. */
export const QUESTION_VIDEOS: QuestionVideo[] = [
  { id: "q1", question: "[ЗАПОЛНИТЬ] Вопрос 1", videoUrl: "" },
  { id: "q2", question: "[ЗАПОЛНИТЬ] Вопрос 2", videoUrl: "" },
  { id: "q3", question: "[ЗАПОЛНИТЬ] Вопрос 3", videoUrl: "" },
  { id: "q4", question: "[ЗАПОЛНИТЬ] Вопрос 4", videoUrl: "" },
  { id: "q5", question: "[ЗАПОЛНИТЬ] Вопрос 5", videoUrl: "" },
  { id: "q6", question: "[ЗАПОЛНИТЬ] Вопрос 6", videoUrl: "" },
];

export type StudentCase = {
  id: string;
  name: string;
  result: string;
  photoUrl: string;
  videoUrl?: string;
};

/** Кейсы студентов — замените плейсхолдеры на контент из Instagram. */
export const STUDENT_CASES: StudentCase[] = [
  {
    id: "case-1",
    name: "[ЗАПОЛНИТЬ] Имя студента",
    result: "[ЗАПОЛНИТЬ] Результат / описание стажировки",
    photoUrl: "/figma/students/Image-1.jpg",
  },
  {
    id: "case-2",
    name: "[ЗАПОЛНИТЬ] Имя студента",
    result: "[ЗАПОЛНИТЬ] Результат / описание стажировки",
    photoUrl: "/figma/students/Image-2.jpg",
  },
  {
    id: "case-3",
    name: "[ЗАПОЛНИТЬ] Имя студента",
    result: "[ЗАПОЛНИТЬ] Результат / описание стажировки",
    photoUrl: "/figma/students/Image-3.jpg",
  },
  {
    id: "case-4",
    name: "[ЗАПОЛНИТЬ] Имя студента",
    result: "[ЗАПОЛНИТЬ] Результат / описание стажировки",
    photoUrl: "/figma/students/Image-4.jpg",
  },
  {
    id: "case-5",
    name: "[ЗАПОЛНИТЬ] Имя студента",
    result: "[ЗАПОЛНИТЬ] Результат / описание стажировки",
    photoUrl: "/figma/students/Image-5.jpg",
  },
  {
    id: "case-6",
    name: "[ЗАПОЛНИТЬ] Имя студента",
    result: "[ЗАПОЛНИТЬ] Результат / описание стажировки",
    photoUrl: "/figma/students/Image-6.jpg",
  },
];

export const AGE_RANGES = [
  "16–17",
  "18–20",
  "21–23",
  "24–26",
  "27+",
] as const;

export const STUDY_STATUSES = [
  { value: "studying", label: "Учусь" },
  { value: "studying_working", label: "Учусь и работаю" },
  { value: "working", label: "Работаю" },
  { value: "graduated", label: "Окончил учёбу" },
] as const;

export const COURSE_OPTIONS = [
  "1 курс",
  "2 курс",
  "3 курс",
  "4 курс",
  "Магистратура",
  "Другое",
] as const;

export const FUNNEL_SECTION_IDS = {
  offer: "act-offer",
  video: "act-video",
  warmup: "act-warmup",
  cases: "act-cases",
  form: "act-form",
} as const;

export type FunnelStep = "offer" | "video" | "cases" | "form" | "done";

export const FUNNEL_STEPS: { id: FunnelStep; label: string; sectionId: string }[] = [
  { id: "offer", label: "Оффер", sectionId: FUNNEL_SECTION_IDS.offer },
  { id: "video", label: "Видео", sectionId: FUNNEL_SECTION_IDS.video },
  { id: "cases", label: "Кейсы", sectionId: FUNNEL_SECTION_IDS.cases },
  { id: "form", label: "Анкета", sectionId: FUNNEL_SECTION_IDS.form },
  { id: "done", label: "Готово", sectionId: FUNNEL_SECTION_IDS.form },
];
