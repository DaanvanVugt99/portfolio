import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { landing } from '../data/landing'
import { LandingName } from './LandingName'
import { MotionToggle } from './PreferenceControls'
import { Settings } from './Settings'
import { useTranslation } from 'react-i18next'
import { BrandMark } from './BrandMark'
import { StickyHeader } from './StickyHeader'

export function LandingPage() {
  const { t } = useTranslation()
  return (
    <div className="landing-page">
      <StickyHeader className="landing-header">
        <Link
          className="monogram landing-portfolio-mark"
          to={landing.href}
          aria-label={t('navigation.openPortfolio')}
        >
          <BrandMark />
        </Link>
        <div className="landing-controls">
          <MotionToggle />
          <Settings />
        </div>
      </StickyHeader>
      <main id="main" className="landing-main" tabIndex={-1}>
        <LandingName />
        <div className="landing-details">
          <p>
            <span className="landing-role">{t('profile.role')}</span>
            <span className="landing-experience">{t('landing.experience')}</span>
          </p>
          <Link className="landing-cta" to={landing.href}>
            <span>{t('landing.action')}</span>
            <ArrowRight size={21} strokeWidth={1.5} />
          </Link>
        </div>
      </main>
    </div>
  )
}
