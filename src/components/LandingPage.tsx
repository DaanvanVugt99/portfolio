import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { landing } from '../data/landing'
import { LandingName } from './LandingName'
import { MotionToggle, ThemeSwitcher } from './PreferenceControls'
import type { MotionStyle } from '../data/workshop'

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
  return (
    <div className={`landing-page ${preview ? 'workshop-page' : ''}`}>
      <header className="landing-header">
        {preview ? (
          <Link to="/" className="workshop-back">
            <ArrowLeft size={15} /> Landing page
          </Link>
        ) : (
          <Link
            className="monogram landing-portfolio-mark"
            to={landing.href}
            aria-label="Open portfolio overview"
          >
            d<span aria-hidden="true">.</span>
          </Link>
        )}
        <div className="landing-controls">
          <MotionToggle />
          <ThemeSwitcher />
        </div>
      </header>
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
            <span className="landing-role">{landing.role}</span>
            <span className="landing-experience">{landing.experience}</span>
          </p>
          <Link className="landing-cta" to={landing.href}>
            <span>{landing.action}</span>
            <ArrowRight size={21} strokeWidth={1.5} />
          </Link>
        </div>
      </main>
    </div>
  )
}
