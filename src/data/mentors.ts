export type MentorProfile = {
  id: string;
  name: string;
  role: string;
  /** Путь в /public */
  photoSrc: string;
  intro: string;
  details: string[];
  /** Роль строкой над именем (как в CV). */
  roleAboveName?: boolean;
};

export const MENTORS: MentorProfile[] = [
  {
    id: "imangali",
    name: "Imangali Tleugaliuly",
    role: "Founder",
    photoSrc: "/mentors/imangali-tleugaliuly.png",
    intro: "• Entrepreneur & Founder of Elevate.Interns",
    details: [
      "Student:\n\nW.P Carey School of Business\nKIMEP University,\nHong Kong Baptist University",
      "Стажер: Mastercard (Almaty) , Injective (New York), PwC (Chicago), Deloitte (Almaty)",
      "Участник Программ: Harvard Project for Asian and International Relations, Diversity on Wall Street, Principles for Responsible Management Education (PRME), United Nations 80th Anniversary Round Table",
      "12 Offers (USA, Europe, Asia) - $500K+ Scholarships",
    ],
  },
  {
    id: "ruslan",
    name: "Narbaev Ruslan",
    role: "Co-Founder:",
    roleAboveName: true,
    photoSrc: "/mentors/ruslan-narbaev.png",
    intro: "• Entrepreneur & CoFounder of Elevate.Interns",
    details: [
      "• 300+ Students Trained Proven English program (with $100.000 revenue year)",
      "Launched over 10+ projects",
    ],
  },
  {
    id: "kamilla",
    name: "Akhmetzhan Nurbike",
    role: "Career Consultant",
    roleAboveName: true,
    photoSrc: "/mentors/kamilla.png",
    intro:
      "Поступила в New York University на полный грант, Победитель Harvard Global Case Competition, MIT Launch X, Georgetown, Pioneer Academics, Bentley Wall Street 101 - принята на программы на полном гранте. $15 000 и 1 место в международной стартап-битве Digital Almaty. Финалист ABC Incubation X TCA 8.0 и топ 10 среди 150 лучших команд. CEO of KazrobotX, Co-founder PulmoAI, стажировалась в ISSAI SRP, Samsung, KPMG.",
    details: [],
  },
  {
    id: "nurbike",
    name: "Kishkashbayeva Kamilla",
    role: "Career Consultant",
    roleAboveName: true,
    photoSrc: "/mentors/kamilla-new.png",
    intro:
      "Поступила в Northwestern University (топ-30 в мире), Выпускница Harvard Entrepreneurship School, Stanford, UC Berkeley Journalism Camp. Вице-президент Youth Science Journal. Амбассадор инициатив ООН. Стажёр в американской компании Amplify, а также поработала с профессионалами из The New York Times и The Guardian. Дважды выпускница программ EducationUSA. Автор научной работы, опубликованной в Oxford Journal of Student Scholarship.",
    details: [],
  },
];
