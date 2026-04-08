/**
 * YouTube Shorts — встроенные отзывы (proof · кейсы).
 * Заполните name / role / outcomeLine после согласования с участниками (не подставляйте вымышленные имена).
 */
export type TestimonialShort = {
  id: string;
  /** Заголовок для iframe (a11y) */
  label: string;
  imageSrc?: string;
  name?: string;
  role?: string;
  outcomeLine?: string;
};

export const TESTIMONIAL_SHORTS: TestimonialShort[] = [
  { id: "JpyLduJWhLw", label: "Видеоотзыв участника" },
  { id: "vv3MdnUPVM8", label: "Видеоотзыв участника" },
  { id: "DV4G9A4lDns", label: "Видеоотзыв участника" },
  { id: "kodPCEFX050", label: "Видеоотзыв участника" },
  {
    id: "case-ilyas",
    label: "Результат студента Ильяса",
    imageSrc: "/cases/ilyas.png",
    name: "Ильяс",
    role: "Результат студента",
    outcomeLine: "Стажировка в Web3-агентстве Meraki & XD Studio",
  },
  {
    id: "case-artur",
    label: "Результат студента Артура",
    imageSrc: "/cases/artur.png",
    name: "Артур",
    role: "Результат студента",
    outcomeLine: "Бренд-амбассадорство в Owlto Finance, Eclipse, Fragmetric",
  },
  {
    id: "case-nurbol",
    label: "Результат студента Нурбола",
    imageSrc: "/cases/nurbol.png",
    name: "Нурбол",
    role: "Результат студента",
    outcomeLine: "Стажировка в фонде Most Ventures",
  },
  {
    id: "case-zhannura",
    label: "Результат студента Жаннуры",
    imageSrc: "/cases/zhannura.png",
    name: "Жаннура",
    role: "Результат студента",
    outcomeLine: "Стажировка в топ Big4 компании PwC",
  },
  {
    id: "case-alisher",
    label: "Результат студента Алишера",
    imageSrc: "/cases/alisher.png",
    name: "Алишер",
    role: "Результат студента",
    outcomeLine: "Стажировка в digital agency ABC studio",
  },
  {
    id: "case-asylbek",
    label: "Результат студента Асылбека",
    imageSrc: "/cases/asylbek.png",
    name: "Асылбек",
    role: "Результат студента",
    outcomeLine: "Стажировка в банке Freedom",
  },
  {
    id: "case-ismail",
    label: "Результат студента Исмаила",
    imageSrc: "/cases/ismail.png",
    name: "Исмаил",
    role: "Результат студента",
    outcomeLine: "Участие в акселерационной программе Samsung",
  },
  {
    id: "case-erkhan",
    label: "Результат студента Ерхана",
    imageSrc: "/cases/erkhan.png",
    name: "Ерхан",
    role: "Результат студента",
    outcomeLine: "Стажировка в ООН",
  },
  {
    id: "case-arina",
    label: "Результат студентки Арины",
    imageSrc: "/cases/arina.png",
    name: "Арина",
    role: "Результат студента",
    outcomeLine: "Стажировка в престижной компании в Торонто",
  },
];
