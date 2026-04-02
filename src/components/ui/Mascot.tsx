import { motion } from 'framer-motion'

interface MascotProps {
  size?: number
  expression?: 'happy' | 'excited' | 'thinking' | 'waving'
  className?: string
}

export function Mascot({
  size = 80,
  expression = 'happy',
  className = '',
}: MascotProps) {
  const Wrapper = expression === 'waving' ? motion.div : 'div'
  const wrapperProps =
    expression === 'waving'
      ? {
          initial: { rotate: 0 },
          animate: { rotate: [0, 3, -3, 2, 0] },
          transition: { duration: 2, repeat: Infinity, repeatDelay: 3 },
        }
      : {}

  return (
    <Wrapper {...(wrapperProps as any)} className={`inline-flex ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse cx="60" cy="68" rx="34" ry="36" fill="#FF6B00" />
        <ellipse cx="60" cy="76" rx="22" ry="22" fill="#FF8C3A" />

        {/* Tail feathers */}
        <path d="M28 58 C18 48, 14 56, 20 64" stroke="#E05A00" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M26 62 C14 56, 12 64, 18 70" stroke="#E05A00" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* African kufi cap */}
        <ellipse cx="60" cy="34" rx="20" ry="6" fill="#2D9F4F" />
        <rect x="42" y="22" width="36" height="12" rx="4" fill="#2D9F4F" />
        <line x1="48" y1="22" x2="48" y2="34" stroke="#1B7A38" strokeWidth="1.5" />
        <line x1="54" y1="22" x2="54" y2="34" stroke="#1B7A38" strokeWidth="1.5" />
        <line x1="60" y1="22" x2="60" y2="34" stroke="#1B7A38" strokeWidth="1.5" />
        <line x1="66" y1="22" x2="66" y2="34" stroke="#1B7A38" strokeWidth="1.5" />
        <line x1="72" y1="22" x2="72" y2="34" stroke="#1B7A38" strokeWidth="1.5" />

        {/* Wings */}
        {expression === 'excited' ? (
          <>
            <path d="M28 56 C14 40, 10 48, 22 52" fill="#2D9F4F" />
            <path d="M92 56 C106 40, 110 48, 98 52" fill="#2D9F4F" />
          </>
        ) : expression === 'waving' ? (
          <>
            <ellipse cx="30" cy="70" rx="10" ry="14" fill="#2D9F4F" transform="rotate(15,30,70)" />
            <path d="M92 56 C108 36, 112 44, 98 52" fill="#2D9F4F" />
            <circle cx="106" cy="38" r="3" fill="#2D9F4F" />
            <circle cx="110" cy="42" r="2.5" fill="#2D9F4F" />
          </>
        ) : expression === 'thinking' ? (
          <>
            <ellipse cx="30" cy="70" rx="10" ry="14" fill="#2D9F4F" transform="rotate(15,30,70)" />
            <path d="M90 64 C100 72, 82 84, 72 78" fill="#2D9F4F" />
          </>
        ) : (
          <>
            <ellipse cx="30" cy="70" rx="10" ry="14" fill="#2D9F4F" transform="rotate(15,30,70)" />
            <ellipse cx="90" cy="70" rx="10" ry="14" fill="#2D9F4F" transform="rotate(-15,90,70)" />
          </>
        )}

        {/* Eyes */}
        <circle cx="48" cy="52" r={expression === 'excited' ? 11 : 10} fill="white" />
        <circle cx="72" cy="52" r={expression === 'excited' ? 11 : 10} fill="white" />

        {/* Pupils */}
        {expression === 'thinking' ? (
          <>
            <circle cx="46" cy="49" r="5" fill="#1A1A2E" />
            <circle cx="70" cy="49" r="5" fill="#1A1A2E" />
            <path d="M64 38 Q72 33 80 38" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="48" cy="53" r={expression === 'excited' ? 6 : 5} fill="#1A1A2E" />
            <circle cx="72" cy="53" r={expression === 'excited' ? 6 : 5} fill="#1A1A2E" />
          </>
        )}

        {/* Eye shine */}
        <circle cx="50" cy="50" r="2" fill="white" />
        <circle cx="74" cy="50" r="2" fill="white" />

        {/* Beak */}
        <path d="M56 62 L60 70 L64 62 Z" fill="#FFB800" />
        <path d="M57.5 62 L60 67 L62.5 62 Z" fill="#FFD54F" />

        {/* Mouth */}
        {(expression === 'happy' || expression === 'waving') && (
          <path d="M52 74 Q60 82 68 74" stroke="#E05A00" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}
        {expression === 'excited' && (
          <>
            <path d="M50 74 Q60 84 70 74" stroke="#E05A00" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <g fill="#FFB800">
              <polygon points="16,30 18,24 20,30 14,26 22,26" />
              <polygon points="100,26 102,20 104,26 98,22 106,22" />
              <polygon points="104,64 105.5,60 107,64 102.5,61.5 107.5,61.5" />
            </g>
          </>
        )}
        {expression === 'thinking' && (
          <path d="M54 76 L66 76" stroke="#E05A00" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* Feet */}
        <g fill="#FFB800">
          <path d="M48 102 L44 112 L48 110 L52 112 L48 102" />
          <path d="M72 102 L68 112 L72 110 L76 112 L72 102" />
        </g>
      </svg>
    </Wrapper>
  )
}
