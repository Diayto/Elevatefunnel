export type MentorProfile = {
  id: string;
  name: string;
  role: string;
  /** Путь в /public */
  photoSrc: string;
  intro: string;
  details: string[];
};

export const MENTORS: MentorProfile[] = [
  {
    id: "ruslan",
    name: "Ruslan Narbaev",
    role: "Co-Founder",
    photoSrc: "/mentors/ruslan-narbaev.png",
    intro: "Entrepreneur & CoFounder of Elevate.Interns",
    details: [
      "300+ Students Trained",
      "Proven English program (with $100.000 revenue year)",
      "Launched over 10+ projects",
    ],
  },
  {
    id: "imangali",
    name: "Imangali Tleugaliuly",
    role: "Founder",
    photoSrc: "/mentors/imangali-tleugaliuly.png",
    intro: "Entrepreneur & Founder of Elevate.Interns",
    details: [
      "Student: W.P Carey School of Business, KIMEP University, Hong Kong Baptist University",
      "Стажер: Mastercard (Almaty), Injective (New York), PwC (Chicago), Deloitte (Almaty)",
      "Участник программ: Harvard Project for Asian and International Relations, Diversity on Wall Street, PRME, United Nations 80th Anniversary Round Table",
      "12 Offers (USA, Europe, Asia) - $500K+ Scholarships",
    ],
  },
  {
    id: "kamilla",
    name: "Kamilla",
    role: "Team",
    photoSrc: "/mentors/kamilla.png",
    intro: "Program operations and participant support.",
    details: [
      "Tracks participant progress",
      "Coordinates communication with mentors",
    ],
  },
  {
    id: "nurbike",
    name: "Nurbike",
    role: "Team",
    photoSrc: "/mentors/nurbike.png",
    intro: "Application flow and coordination support.",
    details: [
      "Supports onboarding and scheduling",
      "Helps maintain quality of participant journey",
    ],
  },
];
