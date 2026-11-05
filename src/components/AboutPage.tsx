import '../about.css'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { aboutPortrait } from '../data/about'
import { Button } from './ui/button'
import { Card } from './ui/card'

export function AboutPage() {
  const { t } = useTranslation()
  return (
    <main id="main" className="about-page">
      <header className="about-heading">
        <h1>{t('about.title')}</h1>
        <Link to="/portfolio" className="back-link">
          <ArrowLeft size={15} aria-hidden="true" /> {t('about.back')}
        </Link>
      </header>
      <div className="about-introduction">
        <Card className="about-portrait">
          <img
            src={aboutPortrait.src}
            srcSet={aboutPortrait.sources.map(({ src, width }) => `${src} ${width}w`).join(', ')}
            sizes={aboutPortrait.sizes}
            width={aboutPortrait.width}
            height={aboutPortrait.height}
            alt={t('about.portraitAlt')}
            fetchPriority="high"
            decoding="async"
          />
        </Card>
        <div className="about-biography">
          <p>
            <Trans
              i18nKey="about.biography.introduction"
              components={{ experience: <Link to="/experience" /> }}
            />
          </p>
          <p>{t('about.biography.approach')}</p>
        </div>
      </div>
      <section className="about-personal" aria-labelledby="outside-work">
        <h2 id="outside-work">{t('about.outsideWork')}</h2>
        <div className="about-biography">
          <p>
            <Trans
              i18nKey="about.biography.personal"
              components={{ divergence: <Link to="/projects/divergence" /> }}
            />
          </p>
          <div className="about-actions">
            <Button asChild variant="outline">
              <Link to="/projects">
                {t('about.viewWork')} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Button>
            <Link className="about-contact-link" to="/contact">
              {t('about.contact')} <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
