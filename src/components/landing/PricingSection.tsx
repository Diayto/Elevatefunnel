import Image from "next/image";
import { SectionDecor } from "@/components/landing/SectionDecor";

type TierStyle = "silver" | "gold" | "diamond";

type PricingTier = {
  title: string;
  badge: string;
  subtitle: string;
  style: TierStyle;
  includeLabel?: string;
  bullets: string[];
  bestChoice?: boolean;
};

const TIERS: PricingTier[] = [
  {
    title: "Silver",
    badge: "/figma/icons/silver-badge.svg",
    subtitle:
      "Для первого системного выхода на международные стажировки.",
    style: "silver",
    bullets: [
      "Telegram Premium Community",
      "Чат 100+ участников",
      "10 видеоуроков от фаундера",
      "Шаблоны резюме, LinkedIn, Cover Letter",
      "3 новые стажировки ежедневно",
      "Еженедельные созвоны (AMA)",
      "3 созвона с ментором",
      "Индивидуальный план стажировок",
      "Бонус: чек-лист LinkedIn + мини-разбор резюме",
    ],
  },
  {
    title: "Gold",
    badge: "/figma/icons/gold-badge.svg",
    subtitle:
      "Оптимальный темп с плотной обратной связью и сопровождением.",
    style: "gold",
    bestChoice: true,
    includeLabel: "Все из Silver, плюс:",
    bullets: [
      "7 созвонов с ментором",
      "Поддержка куратора",
      "Расширенные шаблоны и ресурсы",
      "Мастермайнды внутри коммьюнити",
      "Стратегии отклика и рост-карта",
      "Бонус: разбор LinkedIn от куратора",
    ],
  },
  {
    title: "Diamond",
    badge: "/figma/icons/diamond-badge.svg",
    subtitle:
      "Максимум персонализации и приоритетная индивидуальная работа.",
    style: "diamond",
    includeLabel: "Все из Gold, плюс:",
    bullets: [
      "13 созвонов с ментором",
      "3 Mock Interviews",
      "Глубокая практика интервью с фидбеком",
      "Личная стратегия выхода в топ-компании",
      "Приоритетные правки резюме/LinkedIn",
      "Бонус: персональный карьерный Roadmap",
    ],
  },
];

const HEADER_BG: Record<TierStyle, string> = {
  silver:
    "linear-gradient(180deg, #CDD2D6 0%, #6B7077 10.17%, #979CA1 90%, #FFFFFF 100%)",
  gold: "linear-gradient(180deg, #F7FFBC 0%, #FAFF00 15%, #FAFF00 85.1%, #F7FFBC 100%)",
  diamond:
    "linear-gradient(180deg, #3D9EFF 0%, #053BE5 15%, #053BE5 85%, #3D9EFF 100%)",
};

const BUTTON_BG: Record<TierStyle, string> = {
  silver:
    "linear-gradient(180deg, #CDD2D6 0%, #6B7077 10.17%, #979CA1 90%, #FFFFFF 100%)",
  gold: "linear-gradient(180deg, #F7FFBC 0%, #FAFF00 15%, #FCFF3D 85.1%, #F7FFBC 100%)",
  diamond:
    "linear-gradient(180deg, #3D9EFF 0%, #053BE5 15%, #053BE5 85%, #0078F0 100%)",
};

const BUTTON_BORDER: Record<TierStyle, string> = {
  silver: "#A0A0A0",
  gold: "#A0A430",
  diamond: "#0080FF",
};

const BUTTON_SHADOW: Record<TierStyle, string> = {
  silver: "0px 0px 10px 0px #FFFFFF",
  gold: "0px 0px 10px 0px #E5EA4E",
  diamond: "0px 0px 10px 0px #4675FF",
};

const CARD_STYLES: Record<TierStyle, React.CSSProperties> = {
  silver: {
    backgroundColor: "#000",
    border: "1px solid #282828",
  },
  gold: {
    border: "1px solid #D2D900",
    background:
      "radial-gradient(120% 90% at 50% 50%, #000 78.65%, #0F1000 81.1%, #3E4000 83.5%, #7B8000 88.4%, #B9BF00 93.2%, #F7FF00 98.1%)",
  },
  diamond: {
    border: "1px solid #1a3a9a",
    background:
      "radial-gradient(120% 90% at 50% 50%, #000 78.65%, #00081F 81.1%, #001F57 83.5%, #003CB0 88.4%, #0054DC 93.2%, #053BE5 98.1%)",
  },
};

function TickIcon({ color = "#fff" }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="mt-[3px] shrink-0"
      aria-hidden
    >
      <circle cx="10" cy="10" r="9" stroke={color} strokeOpacity="0.35" strokeWidth="1.2" />
      <path
        d="M6.2 10.3l2.4 2.4 5.2-5.2"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingSection() {
  return (
    <section
      id="act-pricing"
      className="relative overflow-visible py-24"
      style={{ fontFamily: "var(--font-inter-tight)" }}
    >
      <SectionDecor
        items={[
          // blob-4 слева сверху. Native SVG 1159x1159, core circle = 601.
          { src: "/figma/gradients/blob-4.svg", offsetX: -608, top: -540, width: 1159, height: 1159, opacity: 0.7 },
          // grid-2 справа сверху. Figma center 1004, offsetX = +404.
          { src: "/figma/gradients/grid-2.svg", offsetX: 404, top: -170, width: 596, height: 438, opacity: 0.35 },
          // grid-3 по центру внизу.
          { src: "/figma/gradients/grid-3.svg", offsetX: 0, top: 900, width: 596, height: 438, opacity: 0.3 },
        ]}
      />
      <div className="relative mx-auto max-w-[1200px] px-8">
        {/* Icon */}
        <div className="flex justify-center">
          <span className="section-icon-box">
            <Image
              src="/figma/icons/gift-icon.svg"
              alt=""
              width={24}
              height={24}
            />
          </span>
        </div>

        {/* Heading */}
        <h2
          className="heading-gradient mt-5 text-center font-semibold uppercase leading-[1.2] tracking-[-0.005em]"
          style={{ fontFamily: "var(--font-inter-tight)", fontSize: "44px" }}
        >
          Тарифы
        </h2>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => {
            const isGold = tier.style === "gold";
            const headerText = isGold ? "#0e1000" : "#fff";
            const buttonText = isGold ? "#0e1000" : "#fff";

            return (
              <div
                key={tier.title}
                className="lift-card relative flex flex-col overflow-hidden rounded-[24px]"
                style={CARD_STYLES[tier.style]}
              >
                {/* Header block */}
                <div
                  className="relative"
                  style={{
                    background: HEADER_BG[tier.style],
                    height: "132px",
                    borderRadius: "24px 24px 0 0",
                  }}
                >
                  <div className="flex h-full flex-col justify-center px-6">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-semibold"
                        style={{
                          fontSize: "26px",
                          color: headerText,
                          lineHeight: 1,
                        }}
                      >
                        {tier.title}
                      </span>
                      {tier.bestChoice && (
                        <span
                          className="inline-flex items-center rounded-[8px] border px-2 py-1 text-[12px] font-bold uppercase tracking-[0.02em]"
                          style={{
                            backgroundColor: "#FBFF0C",
                            borderColor: "#585B00",
                            color: "#585B00",
                          }}
                        >
                          Лучший выбор
                        </span>
                      )}
                      <Image
                        src={tier.badge}
                        alt=""
                        width={28}
                        height={28}
                        className="ml-auto"
                      />
                    </div>
                    <p
                      className="mt-3 leading-[1.3]"
                      style={{ fontSize: "16px", color: headerText }}
                    >
                      {tier.subtitle}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <div className="px-6 pt-6">
                  <a
                    href="#act-apply"
                    className="glow-btn flex h-[48px] w-full items-center justify-center rounded-full font-semibold"
                    style={{
                      background: BUTTON_BG[tier.style],
                      border: `1px solid ${BUTTON_BORDER[tier.style]}`,
                      boxShadow: BUTTON_SHADOW[tier.style],
                      color: buttonText,
                      fontSize: "16px",
                      letterSpacing: "-0.3px",
                      fontFeatureSettings: "'zero' 1",
                    }}
                  >
                    Получить бесплатный урок
                  </a>
                </div>

                {/* Feature list */}
                <div className="flex-1 px-6 pb-8 pt-7">
                  {tier.includeLabel && (
                    <p className="mb-4 text-[14px] font-medium text-[#a0a0a0]">
                      {tier.includeLabel}
                    </p>
                  )}
                  <ul className="space-y-3">
                    {tier.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-[16px] leading-[1.35] text-white"
                      >
                        <TickIcon color="#fff" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
