import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeChoice = 'light' | 'dark' | 'system'
type Preferences = {
  theme: ThemeChoice
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: ThemeChoice) => void
  paused: boolean
  reducedMotion: boolean
  motionEnabled: boolean
  toggleMotion: () => void
}

const PreferenceContext = createContext<Preferences | null>(null)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeChoice>(() => {
    try { const saved = localStorage.getItem('portfolio-theme'); return saved === 'light' || saved === 'dark' ? saved : 'system' } catch { return 'system' }
  })
  const [systemDark, setSystemDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches)
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [paused, setPaused] = useState(false)
  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    const colour = matchMedia('(prefers-color-scheme: dark)')
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const onColour = () => setSystemDark(colour.matches)
    const onMotion = () => setReducedMotion(motion.matches)
    colour.addEventListener('change', onColour)
    motion.addEventListener('change', onMotion)
    return () => { colour.removeEventListener('change', onColour); motion.removeEventListener('change', onMotion) }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolvedTheme === 'light' ? '#ffffff' : '#0e111b')
    try { if (theme === 'system') localStorage.removeItem('portfolio-theme'); else localStorage.setItem('portfolio-theme', theme) } catch { /* Preferences work in memory when storage is unavailable. */ }
  }, [theme, resolvedTheme])

  useEffect(() => { document.documentElement.dataset.motion = paused || reducedMotion ? 'paused' : 'playing' }, [paused, reducedMotion])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme, paused, reducedMotion, motionEnabled: !paused && !reducedMotion, toggleMotion: () => setPaused(value => !value) }), [theme, resolvedTheme, paused, reducedMotion])
  return <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>
}

export function usePreferences() {
  const preferences = useContext(PreferenceContext)
  if (!preferences) throw new Error('PreferencesProvider is required')
  return preferences
}
