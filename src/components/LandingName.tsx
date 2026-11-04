import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { landing, nameAppearance } from '../data/landing'
import { usePreferences } from '../state/Preferences'
import type { NameScene } from '../graphics/nameScene'
import { defaultMotion, type MotionStyle } from '../data/workshop'
import { loadNameAssets } from '../graphics/nameAssets'
import { useTranslation } from 'react-i18next'

export function LandingName({
  fontUrl = landing.font,
  fontFamily = landing.fontFamily,
  motionStyle = defaultMotion,
  idle = landing.idleMotion,
}: {
  fontUrl?: string
  fontFamily?: string
  motionStyle?: MotionStyle
  idle?: boolean
}) {
  const { t } = useTranslation()
  const host = useRef<HTMLDivElement>(null)
  const scene = useRef<NameScene | null>(null)
  const { resolvedTheme, motionEnabled } = usePreferences()
  const latest = useRef({ theme: resolvedTheme, motionEnabled, motionStyle, idle, fontUrl })
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')

  useEffect(() => {
    latest.current = { theme: resolvedTheme, motionEnabled, motionStyle, idle, fontUrl }
  }, [resolvedTheme, motionEnabled, motionStyle, idle, fontUrl])

  useEffect(() => {
    const abort = new AbortController()
    let disposed = false
    let failed = false
    const mount = host.current
    if (!mount) return
    const deadline = window.setTimeout(onLost, nameAppearance.loadTimeoutMs)
    function onLost() {
      failed = true
      window.clearTimeout(deadline)
      abort.abort()
      scene.current?.dispose()
      scene.current = null
      setStatus('fallback')
    }
    mount.addEventListener('name-renderer-lost', onLost)
    loadNameAssets(fontUrl)
      .then(([module, fontData]) => {
        abort.signal.throwIfAborted()
        return module.createNameScene(mount, { ...latest.current, fontData, signal: abort.signal })
      })
      .then((controller) => {
        if (disposed || failed) {
          controller.dispose()
          return
        }
        scene.current = controller
        controller.setPreferences(latest.current.theme, latest.current.motionEnabled)
        controller.setMotionStyle(latest.current.motionStyle, latest.current.idle)
        window.clearTimeout(deadline)
        setStatus('ready')
      })
      .catch(() => {
        if (!disposed) onLost()
      })
    return () => {
      disposed = true
      window.clearTimeout(deadline)
      abort.abort()
      mount.removeEventListener('name-renderer-lost', onLost)
      scene.current?.dispose()
      scene.current = null
    }
  }, [fontUrl])

  useLayoutEffect(() => {
    if (status === 'ready') scene.current?.reveal()
  }, [status])

  useEffect(() => {
    scene.current?.setPreferences(resolvedTheme, motionEnabled)
  }, [resolvedTheme, motionEnabled])
  useEffect(() => {
    scene.current?.setMotionStyle(motionStyle, idle)
  }, [motionStyle, idle])

  return (
    <div
      className="name-stage"
      data-scene-status={status}
      aria-busy={status === 'loading'}
      data-font={fontFamily}
      style={{ '--name-font': `"${fontFamily}"` } as CSSProperties}
    >
      <h1 className="name-fallback" aria-label="Daan van Vugt">
        {landing.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      {status === 'loading' && (
        <div className="name-loading" aria-hidden="true">
          <span className="name-loading-line" />
          <span>{t('landing.loading')}</span>
        </div>
      )}
      <div className="name-canvas-host" ref={host} aria-hidden="true" />
    </div>
  )
}
