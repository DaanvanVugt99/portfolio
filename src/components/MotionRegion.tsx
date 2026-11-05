import { useEffect, useRef, useState, type ReactNode } from 'react'

export function MotionRegion({
  children,
  className = '',
  label,
}: {
  children: ReactNode
  className?: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.1,
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`motion-region ${className}`}
      data-playing={visible}
      role="img"
      aria-label={label}
    >
      {children}
    </div>
  )
}
