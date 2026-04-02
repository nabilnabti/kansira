import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      iconPosition = "left",
      className = "",
      containerClassName = "",
      id: externalId,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const id = externalId ?? autoId;

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-dark/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full rounded-xl border bg-white px-4 py-2.5 text-dark
              placeholder:text-dark/40
              transition-shadow duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-accent ring-1 ring-accent/30" : "border-dark/15"}
              ${icon && iconPosition === "left" ? "pl-10" : ""}
              ${icon && iconPosition === "right" ? "pr-10" : ""}
              ${className}
            `}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 pointer-events-none">
              {icon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-sm text-accent">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
