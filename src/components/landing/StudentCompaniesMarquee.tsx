import Image from "next/image";

type Company = {
  name: string;
  src: string;
};

const CARD_WIDTH = 176;
const CARD_GAP = 20;

// Порядок задан клиентом (скрин), higgsfield добавлен последним после abc media.
const COMPANIES: Company[] = [
  { name: "U.S. Bank", src: "/figma/companies/us-bank.svg" },
  { name: "MIT", src: "/figma/companies/MIT.svg" },
  { name: "Owlto", src: "/figma/companies/Owlto.svg" },
  { name: "nFactorial", src: "/figma/companies/nfactorial.svg" },
  { name: "AIFC", src: "/figma/companies/AIFC.svg" },
  { name: "Coca-Cola", src: "/figma/companies/Coca-Cola.svg" },
  { name: "Samsung", src: "/figma/companies/Samsung.svg" },
  { name: "PwC", src: "/figma/companies/PWC.svg" },
  { name: "Kazakhtelecom", src: "/figma/companies/KazakhTelecom.svg" },
  { name: "GAO Tek", src: "/figma/companies/GAO-Tek.svg" },
  { name: "MARS", src: "/figma/companies/MARS.svg" },
  { name: "Khan Tengri Innovation Hub", src: "/figma/companies/KTIH.svg" },
  { name: "United Nations", src: "/figma/companies/UN.svg" },
  { name: "MOST", src: "/figma/companies/MOST.svg" },
  { name: "ABC Media", src: "/figma/companies/abc-media.svg" },
  { name: "Higgsfield", src: "/figma/companies/higgsfield.svg" },
];

function CompanyLogoSlot({
  company: c,
  ariaHidden,
}: {
  company: Company;
  ariaHidden?: boolean;
}) {
  return (
    <Image
      aria-hidden={ariaHidden ? true : undefined}
      src={c.src}
      alt={ariaHidden ? "" : c.name}
      width={176}
      height={102}
      className="h-[102px] w-[176px] shrink-0"
      unoptimized
    />
  );
}

/** Бегущая строка логотипов компаний с теми же параметрами, что и лента партнёров (размер карточек, скорость, поведение). */
export function StudentCompaniesMarquee() {
  const oneCycleWidth = COMPANIES.length * CARD_WIDTH + (COMPANIES.length - 1) * CARD_GAP;
  const marqueeDurationSec = Math.max(1, Math.round(oneCycleWidth / 21));

  return (
    <div
      className="partner-marquee-wrap relative mx-auto mt-16 max-w-[1200px] overflow-hidden px-8"
      aria-label="Компании, где работают наши студенты"
    >
      <div
        className="partner-marquee flex w-max gap-5"
        style={{
          animation: `partner-marquee ${marqueeDurationSec}s linear infinite`,
          animationPlayState: "running",
        }}
      >
        {COMPANIES.map((c) => (
          <CompanyLogoSlot key={c.name} company={c} />
        ))}
        {COMPANIES.map((c) => (
          <CompanyLogoSlot key={`dup-${c.name}`} company={c} ariaHidden />
        ))}
      </div>
    </div>
  );
}
