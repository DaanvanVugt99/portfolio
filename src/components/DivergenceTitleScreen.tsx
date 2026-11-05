import { useEffect, useRef, useState } from 'react'
import { usePreferences } from '../state/Preferences'

const poster = '/assets/divergence-title-poster.png'

export function DivergenceTitleScreen() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { motionEnabled } = usePreferences()
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let visible = false
    const updatePlayback = () => {
      if (motionEnabled && visible && document.visibilityState === 'visible') {
        void video.play().catch(() => {
          // Keep the poster visible if the browser prevents autoplay.
        })
      } else video.pause()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        updatePlayback()
      },
      { threshold: 0.05 },
    )
    observer.observe(video)
    document.addEventListener('visibilitychange', updatePlayback)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updatePlayback)
      video.pause()
    }
  }, [motionEnabled, unavailable])

  if (unavailable) return <img src={poster} alt="" width="240" height="160" />

  return (
    <video
      ref={videoRef}
      width="240"
      height="160"
      poster={poster}
      preload="none"
      muted
      loop
      playsInline
      disablePictureInPicture
      tabIndex={-1}
      aria-hidden="true"
      onError={() => setUnavailable(true)}
    >
      <source
        src="/assets/divergence-title.mp4"
        type="video/mp4"
        onError={() => setUnavailable(true)}
      />
    </video>
  )
}
