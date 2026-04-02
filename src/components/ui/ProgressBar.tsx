import { motion } from "framer-motion";

const colorMap = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  gold: "bg-gold",
  accent: "bg-accent",
} as const;

const sizeMap = {
  sm: "h-1.5",
  md: "h-3",
} as const;

interface ProgressBarProps {
  value: number;
  color?: keyof typeof colorMap;
  size?: keyof typeof sizeMap;
  className?: string;
}

export function ProgressBar({
  value,
  color = "primary",
  size = "md",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`w-full rounded-full bg-dark/10 overflow-hidden ${sizeMap[size]} ${className}`}
    >
      <motion.div
        className={`h-full rounded-full ${colorMap[color]}`}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </div>
  );
}
