const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
} as const;

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: keyof typeof sizeMap;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Avatar({
  src,
  name = "",
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={`
        relative shrink-0 rounded-full overflow-hidden
        inline-flex items-center justify-center
        bg-primary/15 text-primary font-semibold
        ${sizeMap[size]}
        ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
