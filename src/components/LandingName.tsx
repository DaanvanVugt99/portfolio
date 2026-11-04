import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { landing } from '../data/landing'
import { usePreferences } from '../state/Preferences'
import type { NameScene } from '../graphics/nameScene'
import { defaultMotion, type MotionStyle } from '../data/workshop'

export function LandingName({ fontUrl = landing.font, fontFamily = landing.fontFamily, motionStyle = defaultMotion, idle = landing.idleMotion }: { fontUrl?: string; fontFamily?: string; motionStyle?: MotionStyle; idle?: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const scene = useRef<NameScene | null>(null)
  const { resolvedTheme, motionEnabled } = usePreferences()
  const latest = useRef({ theme: resolvedTheme, motionEnabled, motionStyle, idle, fontUrl })
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  latest.current = { theme: resolvedTheme, motionEnabled, motionStyle, idle, fontUrl }

  useEffect(() => {
    const abort = new AbortController()
    setStatus('loading')
    let disposed = false
    let failed = false
    const mount = host.current
    if (!mount) return
    const onLost = () => { failed = true; scene.current?.dispose(); scene.current = null; setStatus('fallback') }
    mount.addEventListener('name-renderer-lost', onLost)
    import('../graphics/nameScene')
      .then(module => module.createNameScene(mount, { ...latest.current, signal: abort.signal }))
      .then(controller => {
        if (disposed || failed) { controller.dispose(); return }
        scene.current = controller
        controller.setPreferences(latest.current.theme, latest.current.motionEnabled)
        controller.setMotionStyle(latest.current.motionStyle, latest.current.idle)
        setStatus('ready')
      })
      .catch(() => { if (!disposed) setStatus('fallback') })
    return () => { disposed = true; abort.abort(); mount.removeEventListener('name-renderer-lost', onLost); scene.current?.dispose(); scene.current = null }
  }, [fontUrl])

  useEffect(() => { scene.current?.setPreferences(resolvedTheme, motionEnabled) }, [resolvedTheme, motionEnabled])
  useEffect(() => { scene.current?.setMotionStyle(motionStyle, idle) }, [motionStyle, idle])

  return <div className="name-stage" data-scene-status={status} data-font={fontFamily} style={{ '--name-font': `"${fontFamily}"` } as CSSProperties}>
    <h1 className="name-fallback" aria-label="Daan van Vugt">{landing.lines.map(line => <span key={line}>{line}</span>)}</h1>
    <div className="name-canvas-host" ref={host} aria-hidden="true"/>
  </div>
}
