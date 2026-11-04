import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { landing } from '../data/landing'
import { LandingName } from './LandingName'
import { MotionToggle } from './PreferenceControls'
import { Settings } from './Settings'
import { useTranslation } from 'react-i18next'
import type { MotionStyle } from '../data/workshop'
import { BrandMark } from './BrandMark'
import { StickyHeader } from './StickyHeader'

export function LandingPage({
  preview,
}: {
  preview?: {
    fontUrl: string
    fontFamily: string
    motionStyle: MotionStyle
    idle: boolean
    controls: ReactNode
  }
}) {
  const { t } = useTranslation()
  return (
    <div className={`landing-page ${preview ? 'workshop-page' : ''}`}>
      <StickyHeader className="landing-header">
        {preview ? (
          <Link to="/" className="workshop-back">
            <ArrowLeft size={15} /> {t('navigation.landing')}
          </Link>
        ) : (
          <Link
            className="monogram landing-portfolio-mark"
            to={landing.href}
            aria-label={t('navigation.openPortfolio')}
          >
            <BrandMark />
          </Link>
        )}
        <div className="landing-controls">
          <MotionToggle />
          <Settings />
        </div>
      </StickyHeader>
      <main id="main" className="landing-main" tabIndex={-1}>
        <LandingName
          key={preview?.fontUrl ?? landing.font}
          fontUrl={preview?.fontUrl}
          fontFamily={preview?.fontFamily}
          motionStyle={preview?.motionStyle}
          idle={preview?.idle}
        />
        {preview?.controls}
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
