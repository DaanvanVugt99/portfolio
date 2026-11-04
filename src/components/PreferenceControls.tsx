import { Pause, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '../state/Preferences'

export function MotionToggle() {
  const { t } = useTranslation()
  const { paused, reducedMotion, toggleMotion } = usePreferences()
  return (
    <button
      className="motion-toggle"
      aria-label={
        reducedMotion ? t('motion.deviceReduced') : paused ? t('motion.play') : t('motion.pause')
      }
      aria-pressed={paused || reducedMotion}
      disabled={reducedMotion}
      onClick={toggleMotion}
    >
      {paused || reducedMotion ? <Play size={12} /> : <Pause size={12} />}{' '}
      {reducedMotion ? t('motion.reduced') : paused ? t('motion.play') : t('motion.pause')}
    </button>
  )
}
