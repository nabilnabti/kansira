import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
  className = "",
}: ToggleProps) {
  return (
    <label
      className={`inline-flex items-center gap-2.5 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 items-center rounded-full
          transition-colors duration-200 cursor-pointer
          ${checked ? "bg-primary" : "bg-dark/20"}
          ${disabled ? "cursor-not-allowed" : ""}
        `}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="block h-5 w-5 rounded-full bg-white shadow-sm"
          style={{ marginLeft: checked ? "22px" : "2px" }}
        />
      </button>
      {label && <span className="text-sm text-dark">{label}</span>}
    </label>
  );
}
