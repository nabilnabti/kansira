import { Loader2 } from "lucide-react";

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
} as const;

const colorMap = {
  primary: "text-primary",
  secondary: "text-secondary",
  white: "text-white",
  gold: "text-gold",
  accent: "text-accent",
  current: "text-current",
} as const;

interface SpinnerProps {
  size?: keyof typeof sizeMap;
  color?: keyof typeof colorMap;
  className?: string;
}

export function Spinner({
  size = "md",
  color = "primary",
  className = "",
}: SpinnerProps) {
  return (
    <Loader2
      className={`animate-spin ${sizeMap[size]} ${colorMap[color]} ${className}`}
    />
  );
}
