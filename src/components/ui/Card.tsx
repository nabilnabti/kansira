import { type HTMLAttributes, type ReactNode } from "react";

const variantStyles = {
  default: "shadow-md",
  elevated: "shadow-xl",
  flat: "shadow-none",
} as const;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantStyles;
  children: ReactNode;
}

export function Card({
  variant = "default",
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
