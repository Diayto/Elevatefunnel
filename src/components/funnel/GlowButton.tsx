import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const glowStyle = {
  backgroundImage:
    "linear-gradient(180deg, #3D9EFF 0%, #053BE5 15%, #053BE5 85%, #0078F0 100%)",
  border: "1px solid #0080FF",
  boxShadow: "0px 0px 18px 0px #4675FF",
  letterSpacing: "-0.3px",
  fontFeatureSettings: "'zero' 1",
} as const;

type GlowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  as?: "button" | "a";
  href?: string;
};

export function GlowButton({
  children,
  className = "",
  as = "button",
  href,
  style,
  ...props
}: GlowButtonProps) {
  const classes = `glow-btn inline-flex items-center justify-center rounded-full font-semibold text-white ${className}`;

  if (as === "a") {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        href={href}
        className={classes}
        style={{ ...glowStyle, ...style }}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      style={{ ...glowStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
