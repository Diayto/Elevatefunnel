import Image from "next/image";

type DecorItem = {
  src: string;
  /** координата относительно центра: положительное — вправо, отрицательное — влево */
  offsetX: number;
  /** top относительно верха секции */
  top: number;
  width: number;
  height: number;
  opacity?: number;
  flipY?: boolean;
};

/**
 * Декоративный слой с blob/grid. Ставится первым ребёнком секции с
 * `position: relative`. Элементы позиционируются относительно центральной
 * колонки 1200px, поэтому на любой ширине экрана они стоят точно как в Figma.
 */
export function SectionDecor({ items }: { items: DecorItem[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
    >
      {items.map((d, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: "50%",
            top: `${d.top}px`,
            width: `${d.width}px`,
            height: `${d.height}px`,
            transform: `translateX(calc(-50% + ${d.offsetX}px))${d.flipY ? " scaleY(-1)" : ""}`,
            opacity: d.opacity ?? 0.5,
          }}
        >
          <Image src={d.src} alt="" fill className="object-contain" />
        </div>
      ))}
    </div>
  );
}
