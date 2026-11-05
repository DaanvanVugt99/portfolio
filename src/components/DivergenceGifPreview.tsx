import { useEffect, useRef, useState } from 'react'
import { usePreferences } from '../state/Preferences'

export function DivergenceGifPreview({ src, poster }: { src: string; poster: string }) {
  const imageRef = useRef<HTMLImageElement>(null)
  const { motionEnabled } = usePreferences()
  const [visible, setVisible] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    const image = imageRef.current
    if (!image) return
    let inView = false
    const updateVisibility = () => {
      setVisible(inView && document.visibilityState === 'visible')
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        updateVisibility()
      },
      { threshold: 0.05 },
    )
    observer.observe(image)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  return (
    <img
      ref={imageRef}
      src={motionEnabled && visible && !unavailable ? `${src}?v=2` : poster}
      alt=""
      width="240"
      height="160"
      onError={() => setUnavailable(true)}
    />
  )
}
