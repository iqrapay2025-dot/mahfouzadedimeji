import { useScrollReveal } from '../../hooks/useScrollReveal'

type Dir = 'up' | 'left' | 'right' | 'scale' | 'fade'

interface RevealProps {
  children: React.ReactNode
  dir?: Dir
  delay?: number
  duration?: number
  style?: React.CSSProperties
  className?: string
}

export default function Reveal({
  children,
  dir = 'up',
  delay = 0,
  duration,
  style = {},
  className = '',
}: RevealProps) {
  const { ref, visible } = useScrollReveal()

  const classMap: Record<Dir, [string, string]> = {
    up:    ['reveal-hidden',       'reveal-visible'],
    left:  ['reveal-left-hidden',  'reveal-left-visible'],
    right: ['reveal-right-hidden', 'reveal-right-visible'],
    scale: ['reveal-scale-hidden', 'reveal-scale-visible'],
    fade:  ['reveal-fade-hidden',  'reveal-fade-visible'],
  }

  const [hidden, show] = classMap[dir]

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${visible ? show : hidden} ${className}`}
      style={{
        ...style,
        ...(delay ? { transitionDelay: `${delay}s` } : {}),
        ...(duration ? { transitionDuration: `${duration}s` } : {}),
      }}
    >
      {children}
    </div>
  )
}
