import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { usePreferences } from '../../state/Preferences'
import { getTimelineFocus } from '../../lib/timeline'

export type TimelineItem = {
  id: string
  period: ReactNode
  marker: ReactNode
  content: ReactNode
  featured?: boolean
  side?: 'left' | 'right'
  variant?: 'opportunity' | 'root'
}

export function Timeline({ items, label }: { items: TimelineItem[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { motionEnabled } = usePreferences()

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const rows = [...root.querySelectorAll<HTMLElement>('.timeline-item')]
    const markers = [...root.querySelectorAll<HTMLElement>('.timeline-marker')]
    let frame: number | null = null
    let visible = true
    let disposed = false

    function update() {
      frame = null
      if (disposed || !markers.length) return
      const top = root!.getBoundingClientRect().top
      const centers = markers.map((marker) => {
        const rect = marker.getBoundingClientRect()
        return rect.top + rect.height / 2 - top
      })
      const first = centers[0]
      const last = centers[centers.length - 1]
      const focus = getTimelineFocus(centers, window.innerHeight * 0.45 - top)
      const activeIndex = motionEnabled ? focus.activeIndex : 0
      root!.style.setProperty('--rail-top', `${first}px`)
      root!.style.setProperty('--rail-height', `${last - first}px`)
      root!.style.setProperty('--beam-y', `${focus.position - first}px`)
      root!.dataset.activeEntry = rows[activeIndex]?.dataset.entry
      rows.forEach((row, index) => {
        row.dataset.active = String(index === activeIndex)
      })
    }

    function cancelFrame() {
      if (frame !== null) window.cancelAnimationFrame(frame)
      frame = null
    }

    function requestUpdate() {
      if (disposed || frame !== null || !visible || document.hidden) return
      frame = window.requestAnimationFrame(update)
    }

    function onVisibility() {
      if (document.hidden) cancelFrame()
      else requestUpdate()
    }

    const resize = new ResizeObserver(requestUpdate)
    resize.observe(root)
    rows.forEach((row) => resize.observe(row))
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) requestUpdate()
        else cancelFrame()
      },
      { rootMargin: '80px 0px' },
    )
    intersection.observe(root)
    if (motionEnabled) window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    document.addEventListener('visibilitychange', onVisibility)
    update()

    return () => {
      disposed = true
      cancelFrame()
      resize.disconnect()
      intersection.disconnect()
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [items, motionEnabled])

  return (
    <div
      ref={ref}
      className="experience-timeline"
      data-motion={motionEnabled ? 'tracking' : 'static'}
    >
      <div className="timeline-rail" aria-hidden="true">
        <div className="timeline-beam" />
      </div>
      <ol className="timeline-list" aria-label={label}>
        {items.map((item, index) => (
          <li
            className="timeline-item"
            key={item.id}
            data-entry={item.id}
            data-side={item.side ?? (index % 2 === 0 ? 'right' : 'left')}
            data-variant={item.variant}
            data-active={index === 0}
            data-featured={item.featured || undefined}
          >
            {item.period && <div className="timeline-period">{item.period}</div>}
            <div className="timeline-marker" aria-hidden="true">
              {item.marker}
            </div>
            {item.content}
          </li>
        ))}
      </ol>
    </div>
  )
}
