import { useEffect, useRef, useState, type ReactNode } from 'react'

export function StickyHeader({ children, className }: { children: ReactNode; className: string }) {
  const sentinel = useRef<HTMLSpanElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const marker = sentinel.current
    if (!marker) return
    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(marker)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <span ref={sentinel} className="header-scroll-sentinel" aria-hidden="true" />
      <header className={`sticky-header ${className}`} data-scrolled={scrolled}>
        {children}
      </header>
    </>
  )
}
