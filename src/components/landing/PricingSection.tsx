import Image from "next/image";
import { SectionDecor } from "@/components/landing/SectionDecor";

type TierStyle = "gold" | "diamond";

type TextPart = { text: string; highlight?: boolean };

type Feature = {
  id: string;
  parts: TextPart[];
};

type HighlightBox = {
  icon: string;
  parts: TextPart[];
  variant: "gold-bonus" | "diamond-bonus" | "diamond-program" | "gold-summary";
};

type PricingTier = {
  title: string;
  audienceBadge: string;
  subtitle: string;
  style: TierStyle;
  bestChoice?: boolean;
  features: Feature[];
  goldSummary?: { label: string; items: Feature[] };
  exclusiveLabel?: string;
  exclusiveFeatures?: Feature[];
  highlightBoxes?: HighlightBox[];
};

const GOLD_FEATURES: Feature[] = [
  {
    id: "g-1",
    parts: [
      { text: "Telegram-комьюнити " },
      { text: "100+ участников", highlight: true },
      { text: " из 30+ стран мира" },
    ],
  },
  {
    id: "g-2",
    parts: [
      {
        text: "Еженедельные групповые Занятия с Фаундерами (Office Hours -формат)",
      },
    ],
  },
  {
    id: "g-3",
    parts: [
      {
        text: "Еженедельный Interview Club , прокачка навыков прохождения интервью в группе",
      },
    ],
  },
  {
    id: "g-4",
    parts: [
      { text: "30 видеоуроков", highlight: true },
      {
        text: " от фаундеров о том, как попасть на международную позицию",
      },
    ],
  },
  {
    id: "g-5",
    parts: [
      {
        text: "Готовые шаблоны резюме, LinkedIn-профиля и Cover Letter",
      },
    ],
  },
  {
    id: "g-6",
    parts: [
      { text: "Актуальные книги по " },
      { text: "Consulting & Investment Banking", highlight: true },
      { text: " от топ бизнес-школ мира" },
    ],
  },
  {
    id: "g-7",
    parts: [
      { text: "5 новых офферов ежедневно", highlight: true },
      { text: " по всему миру , только актуальные позиции" },
    ],
  },
  {
    id: "g-8",
    parts: [
      {
        text: "Индивидуальный план стажировок под твой профиль и цели",
      },
    ],
  },
  {
    id: "g-9",
    parts: [
      { text: "AI-тренажёр " },
      { text: "Elvin", highlight: true },
      {
        text: " , персональный ассистент, который подбирает стажировки и помогает с откликами",
      },
    ],
  },
  {
    id: "g-10",
    parts: [
      {
        text: "Поддержка куратора с международным опытом (Harvard University, Nazarbayev University)",
      },
    ],
  },
  {
    id: "g-11",
    parts: [
      {
        text: "Офлайн-мастермайнды внутри комьюнити,  живые встречи и нетворкинг.",
      },
    ],
  },
];

const TIERS: PricingTier[] = [
  {
    title: "Gold",
    audienceBadge: "Для студентов",
    subtitle:
      "Оптимальный темп с плотной обратной связью и сопровождением.",
    style: "gold",
    features: GOLD_FEATURES,
    highlightBoxes: [
      {
        icon: "🎁",
        variant: "gold-bonus",
        parts: [
          { text: "Бонус при вступлении:", highlight: true },
          {
            text: " чек-лист по оптимизации LinkedIn + мини-разбор резюме от куратора",
          },
        ],
      },
    ],
  },
  {
    title: "Diamond",
    audienceBadge: "Премиум - для всех",
    subtitle:
      "Максимум персонализации и приоритетная индивидуальная работа.",
    style: "diamond",
    bestChoice: true,
    features: [],
    goldSummary: {
      label: "✦ Всё из Gold, плюс:",
      items: [
        {
          id: "d-sum-1",
          parts: [
            { text: "30 видеоуроков", highlight: true },
            {
              text: ", AI-тренажёр Elvin, шаблоны, 5 стажировок ежедневно, комьюнити 100+ из 30+ стран",
            },
          ],
        },
        {
          id: "d-sum-2",
          parts: [
            {
              text: "Еженедельные созвоны с Фаундерами + Interview Club + офлайн-мастермайнды",
            },
          ],
        },
      ],
    },
    exclusiveLabel: "Эксклюзивно в Diamond",
    exclusiveFeatures: [
      {
        id: "d-1",
        parts: [
          {
            text: "6 личных созвонов с ментором из топовой компании - разбор твоей ситуации 1-на-1",
          },
        ],
      },
      {
        id: "d-2",
        parts: [
          {
            text: "Персональная поддержка ментора на протяжении всей программы - в чате и на звонках",
          },
        ],
      },
      {
        id: "d-3",
        parts: [
          {
            text: "Глубокая практика интервью с детальным фидбеком от ментора - behavioral, case, technical",
          },
        ],
      },
      {
        id: "d-4",
        parts: [
          {
            text: "Личная стратегия выхода в топ-компанию - с учётом твоего профиля, опыта и целей",
          },
        ],
      },
      {
        id: "d-5",
        parts: [
          {
            text: "Стратегии отклика и рост-карта - как и куда подаваться, чтобы максимизировать конверсию",
          },
        ],
      },
      {
        id: "d-6",
        parts: [
          {
            text: "Приоритетные правки резюме и LinkedIn от куратора - быстро, точно, по стандартам топ-компаний",
          },
        ],
      },
      {
        id: "d-7",
        parts: [
          {
            text: "Поддержка куратора с международным опытом (Гарвард, Nazarbayev University)",
          },
        ],
      },
    ],
    highlightBoxes: [
      {
        icon: "💎",
        variant: "diamond-bonus",
        parts: [
          { text: "Бонус:", highlight: true },
          {
            text: " персональный карьерный Roadmap - пошаговый план твоего пути в международные компании",
          },
        ],
      },
      {
        icon: "📋",
        variant: "diamond-program",
        parts: [
          {
            text: "6-недельная структурированная программа: CV → LinkedIn → Cover Letter → Интервью → Нетворкинг - с домашними заданиями, баллами и финальным сертификатом",
          },
        ],
      },
    ],
  },
];

const ACCENT: Record<TierStyle, string> = {
  gold: "#FAFF00",
  diamond: "#4675FF",
};

const CARD_BORDER: Record<TierStyle, string> = {
  gold: "1px solid rgba(250, 255, 0, 0.2)",
  diamond: "1px solid rgba(70, 117, 255, 0.22)",
};

const CARD_BASE: Record<TierStyle, string> = {
  gold: "#0a0a0a",
  diamond: "#080a12",
};

type AmbientSpot = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  width: number;
  height: number;
  color: string;
  opacity: number;
  blur: number;
};

/** Мягкие цветовые пятна — едва заметные, как в макете */
const CARD_SPOTS: Record<TierStyle, AmbientSpot[]> = {
  gold: [
    {
      top: "-18%",
      right: "-12%",
      width: 320,
      height: 320,
      color: "rgba(250, 255, 0, 1)",
      opacity: 0.09,
      blur: 56,
    },
    {
      bottom: "5%",
      left: "-22%",
      width: 220,
      height: 220,
      color: "rgba(185, 191, 0, 1)",
      opacity: 0.045,
      blur: 48,
    },
  ],
  diamond: [
    {
      top: "-16%",
      right: "-10%",
      width: 340,
      height: 340,
      color: "rgba(70, 117, 255, 1)",
      opacity: 0.1,
      blur: 60,
    },
    {
      top: "30%",
      left: "-18%",
      width: 260,
      height: 260,
      color: "rgba(5, 59, 229, 1)",
      opacity: 0.06,
      blur: 52,
    },
    {
      top: "22%",
      right: "0%",
      width: 200,
      height: 200,
      color: "rgba(250, 255, 0, 1)",
      opacity: 0.035,
      blur: 44,
    },
  ],
};

/** Яркий блик — заметнее мягких пятен, справа сверху как в макете */
const CARD_GLINT: Record<
  TierStyle,
  { top: string; right: string; width: number; height: number; color: string }
> = {
  gold: {
    top: "-6%",
    right: "-4%",
    width: 210,
    height: 210,
    color: "rgba(250, 255, 0, 1)",
  },
  diamond: {
    top: "-5%",
    right: "-3%",
    width: 230,
    height: 230,
    color: "rgba(90, 140, 255, 1)",
  },
};

const CARD_SHADOW: Record<TierStyle, string> = {
  gold: "inset 0 1px 0 rgba(250, 255, 0, 0.06)",
  diamond: "inset 0 1px 0 rgba(70, 117, 255, 0.08)",
};

const HIGHLIGHT_BOX_STYLES: Record<
  HighlightBox["variant"],
  { border: string; background: string; accent: string }
> = {
  "gold-bonus": {
    border: "1px solid rgba(250, 255, 0, 0.28)",
    background: "rgba(250, 255, 0, 0.04)",
    accent: "#FAFF00",
  },
  "gold-summary": {
    border: "1px solid rgba(250, 255, 0, 0.22)",
    background: "rgba(250, 255, 0, 0.03)",
    accent: "#FAFF00",
  },
  "diamond-bonus": {
    border: "1px solid rgba(70, 117, 255, 0.28)",
    background: "rgba(70, 117, 255, 0.06)",
    accent: "#7B9AFF",
  },
  "diamond-program": {
    border: "1px solid rgba(70, 117, 255, 0.38)",
    background: "rgba(70, 117, 255, 0.1)",
    accent: "#7B9AFF",
  },
};

function FeatureText({
  parts,
  accent,
}: {
  parts: TextPart[];
  accent: string;
}) {
  return (
    <>
      {parts.map((part, i) =>
        part.highlight ? (
          <span key={i} style={{ color: accent }}>
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

function TickIcon({ color }: { color: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="mt-[3px] shrink-0"
      aria-hidden
    >
      <circle cx="10" cy="10" r="9" stroke={color} strokeOpacity="0.45" strokeWidth="1.2" />
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

function FeatureList({
  items,
  tickColor,
  accent,
}: {
  items: Feature[];
  tickColor: string;
  accent: string;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-start gap-3 text-[15px] leading-[1.4] text-white/85"
        >
          <TickIcon color={tickColor} />
          <span>
            <FeatureText parts={item.parts} accent={accent} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function HighlightBoxCard({ box }: { box: HighlightBox }) {
  const style = HIGHLIGHT_BOX_STYLES[box.variant];

  return (
    <div
      className="flex items-start gap-3 rounded-[14px] px-4 py-3.5"
      style={{
        border: style.border,
        background: style.background,
      }}
    >
      <span className="mt-0.5 shrink-0 text-[18px] leading-none" aria-hidden>
        {box.icon}
      </span>
      <p className="text-[14px] leading-[1.45] text-white/85">
        <FeatureText parts={box.parts} accent={style.accent} />
      </p>
    </div>
  );
}

function CardAmbientSpots({ style }: { style: TierStyle }) {
  const glint = CARD_GLINT[style];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {CARD_SPOTS[style].map((spot, i) => (
        <div
          key={`spot-${i}`}
          className="absolute rounded-full"
          style={{
            top: spot.top,
            right: spot.right,
            bottom: spot.bottom,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            opacity: spot.opacity,
            background: `radial-gradient(circle, ${spot.color} 0%, transparent 68%)`,
            filter: `blur(${spot.blur}px)`,
          }}
        />
      ))}

      {/* Блик — ядро + ореол */}
      <div
        className="absolute rounded-full"
        style={{
          top: glint.top,
          right: glint.right,
          width: glint.width,
          height: glint.height,
          background: `radial-gradient(circle at 38% 38%, ${glint.color} 0%, transparent 62%)`,
          opacity: 0.14,
          filter: "blur(36px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: glint.top,
          right: glint.right,
          width: glint.width * 0.55,
          height: glint.height * 0.55,
          background: `radial-gradient(circle at 42% 42%, ${glint.color} 0%, transparent 58%)`,
          opacity: style === "gold" ? 0.26 : 0.28,
          filter: "blur(18px)",
        }}
      />
    </div>
  );
}

function TierCard({ tier }: { tier: PricingTier }) {
  const isGold = tier.style === "gold";
  const accent = ACCENT[tier.style];
  const tickColor = isGold ? accent : "#7B9AFF";

  return (
    <article
      className="lift-card relative flex flex-col overflow-hidden rounded-[24px]"
      style={{
        border: CARD_BORDER[tier.style],
        background: CARD_BASE[tier.style],
        boxShadow: CARD_SHADOW[tier.style],
      }}
    >
      <CardAmbientSpots style={tier.style} />

      <div className="relative z-10 px-6 pb-8 pt-6">
        {/* Audience badge */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] text-white/55"
            style={{
              borderColor: isGold ? "rgba(250,255,0,0.15)" : "rgba(70,117,255,0.2)",
              background: isGold ? "rgba(250,255,0,0.04)" : "rgba(70,117,255,0.06)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent }}
              aria-hidden
            />
            {tier.audienceBadge}
          </span>
        </div>

        {/* Title row */}
        <div className="mt-5 flex items-center gap-3">
          <h3
            className="font-semibold italic leading-none tracking-[-0.02em]"
            style={{
              fontSize: "42px",
              color: isGold ? accent : "#fff",
            }}
          >
            {tier.title}
          </h3>
          {tier.bestChoice ? (
            <span
              className="inline-flex items-center rounded-[8px] border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em]"
              style={{
                borderColor: "rgba(123, 154, 255, 0.55)",
                color: "#7B9AFF",
                background: "rgba(70, 117, 255, 0.08)",
              }}
            >
              Топ выбор
            </span>
          ) : (
            <span
              className="inline-flex items-center rounded-[8px] border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em]"
              style={{
                borderColor: "rgba(250, 255, 0, 0.35)",
                color: accent,
                background: "rgba(250, 255, 0, 0.06)",
              }}
            >
              Старт
            </span>
          )}
          <Image
            src={isGold ? "/figma/icons/gold-badge.svg" : "/figma/icons/diamond-badge.svg"}
            alt=""
            width={28}
            height={28}
            className="ml-auto opacity-80"
          />
        </div>

        <p className="mt-3 text-[15px] leading-[1.4] text-white/55">{tier.subtitle}</p>

        <a
          href="#act-apply"
          className="glow-btn mt-6 flex h-[48px] w-full items-center justify-center rounded-full border text-[15px] font-semibold text-white transition-colors"
          style={{
            borderColor: isGold ? "rgba(250, 255, 0, 0.28)" : "rgba(70, 117, 255, 0.35)",
            background: isGold ? "rgba(250, 255, 0, 0.06)" : "rgba(70, 117, 255, 0.08)",
          }}
        >
          Получить бесплатный урок →
        </a>

        <div
          className="my-7 h-px"
          style={{
            background: isGold
              ? "linear-gradient(90deg, transparent, rgba(250,255,0,0.2), transparent)"
              : "linear-gradient(90deg, transparent, rgba(70,117,255,0.25), transparent)",
          }}
        />

        {/* Gold: feature list */}
        {tier.features.length > 0 && (
          <>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
              Что входит в пакет
            </p>
            <FeatureList items={tier.features} tickColor={tickColor} accent={accent} />
          </>
        )}

        {/* Diamond: gold summary box */}
        {tier.goldSummary && (
          <div
            className="rounded-[16px] p-4"
            style={{
              border: HIGHLIGHT_BOX_STYLES["gold-summary"].border,
              background: HIGHLIGHT_BOX_STYLES["gold-summary"].background,
            }}
          >
            <p
              className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: ACCENT.gold }}
            >
              {tier.goldSummary.label}
            </p>
            <FeatureList
              items={tier.goldSummary.items}
              tickColor={ACCENT.gold}
              accent={ACCENT.gold}
            />
          </div>
        )}

        {/* Diamond: exclusive section */}
        {tier.exclusiveLabel && tier.exclusiveFeatures && (
          <div className={tier.goldSummary ? "mt-7" : ""}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
              {tier.exclusiveLabel}
            </p>
            <FeatureList
              items={tier.exclusiveFeatures}
              tickColor={tickColor}
              accent={accent}
            />
          </div>
        )}

        {/* Highlight boxes (bonus, program) */}
        {tier.highlightBoxes && tier.highlightBoxes.length > 0 && (
          <div className="mt-6 space-y-3">
            {tier.highlightBoxes.map((box, i) => (
              <HighlightBoxCard key={i} box={box} />
            ))}
          </div>
        )}
      </div>
    </article>
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
          { src: "/figma/gradients/blob-4.svg", offsetX: -608, top: -540, width: 1159, height: 1159, opacity: 0.7 },
          { src: "/figma/gradients/grid-2.svg", offsetX: 404, top: -170, width: 596, height: 438, opacity: 0.35 },
          { src: "/figma/gradients/grid-3.svg", offsetX: 0, top: 900, width: 596, height: 438, opacity: 0.3 },
        ]}
      />
      <div className="relative mx-auto max-w-[1200px] px-8">
        <div className="flex justify-center">
          <span className="section-icon-box">
            <Image src="/figma/icons/gift-icon.svg" alt="" width={24} height={24} />
          </span>
        </div>

        <h2
          className="heading-gradient mt-5 text-center font-semibold uppercase leading-[1.2] tracking-[-0.005em]"
          style={{ fontFamily: "var(--font-inter-tight)", fontSize: "44px" }}
        >
          Тарифы
        </h2>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {TIERS.map((tier) => (
            <TierCard key={tier.title} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
}
