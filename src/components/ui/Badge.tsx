import { type ReactNode } from "react";

const variantStyles = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  accent: "bg-accent/15 text-accent",
  gold: "bg-gold/15 text-gold",
  dark: "bg-dark/10 text-dark",
} as const;

interface BadgeProps {
  variant?: keyof typeof variantStyles;
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "primary",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5
        text-xs font-semibold
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
