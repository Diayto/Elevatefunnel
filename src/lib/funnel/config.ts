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

/** Единая очередь видео сверху вниз: основное → 6 вопросов. */
export type FunnelVideoItem = {
  id: VideoWatchKey;
  step: number;
  title: string;
  videoUrl: string;
};

export const FUNNEL_VIDEO_QUEUE: FunnelVideoItem[] = [
  {
    id: "main",
    step: 1,
    title: "Основное видео",
    videoUrl: MAIN_VIDEO_URL,
  },
  ...QUESTION_VIDEOS.map((item, index) => ({
    id: item.id,
    step: index + 2,
    title: item.question,
    videoUrl: item.videoUrl,
  })),
];

export type StudentCase = {
  id: string;
  name: string;
  result: string;
  photoUrl: string;
  videoUrl?: string;
};

/** Заглушка для карточки кейса, если фото не задано или не загрузилось. */
export const CASE_PLACEHOLDER_PHOTO = "/figma/graphics/case-placeholder.svg";

/** Кейсы студентов — топ-6 из основного лендинга Elevate. */
export const STUDENT_CASES: StudentCase[] = [
  {
    id: "case-miron",
    name: "Мирон",
    result: "Программа MIT Launch-X",
    photoUrl: "/figma/students/miron-launch-x.png",
  },
  {
    id: "case-erhan",
    name: "Ерхан",
    result: "Стажировка в ООН",
    photoUrl: "/figma/students/Image-13.png",
  },
  {
    id: "case-aruzhan-kpmg",
    name: "Аружан",
    result: "KPMG Audit Internship",
    photoUrl: "/figma/students/aruzhan-kpmg.png",
  },
  {
    id: "case-elizaveta",
    name: "Елизавета",
    result: "Стажировка в US Bank, Warszawa",
    photoUrl: "/figma/students/elizaveta-usbank.png",
  },
  {
    id: "case-maria",
    name: "Мария",
    result: "Full Time роль в Ref Group Indonesia",
    photoUrl: "/figma/students/maria-ref-group.png",
  },
  {
    id: "case-zhannur",
    name: "Жаннур",
    result: "Стажировка в PWC",
    photoUrl: "/figma/students/Image-8.jpg",
  },
];

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
