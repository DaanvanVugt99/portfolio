import { Monitor, Moon, Pause, Play, Sun } from 'lucide-react'
import { usePreferences } from '../state/Preferences'

export function MotionToggle() {
  const { paused, reducedMotion, toggleMotion } = usePreferences()
  return (
    <button
      className="motion-toggle"
      aria-label={
        reducedMotion
          ? 'Reduced motion enabled by your device'
          : paused
            ? 'Play motion'
            : 'Pause motion'
      }
      aria-pressed={paused || reducedMotion}
      disabled={reducedMotion}
      onClick={toggleMotion}
    >
      {paused || reducedMotion ? <Play size={12} /> : <Pause size={12} />}{' '}
      {reducedMotion ? 'Reduced motion' : paused ? 'Play motion' : 'Pause motion'}
    </button>
  )
}

export function ThemeSwitcher() {
  const { theme, setTheme } = usePreferences()
  return (
    <div className="theme-switch" role="group" aria-label="Colour theme">
      {(
        [
          { value: 'light', Icon: Sun },
          { value: 'system', Icon: Monitor },
          { value: 'dark', Icon: Moon },
        ] as const
      ).map(({ value, Icon }) => (
        <button
          key={value}
          aria-label={`Use ${value} theme`}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
        >
          <Icon size={15} />
        </button>
      ))}
    </div>
  )
}
