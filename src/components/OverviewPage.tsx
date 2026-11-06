import '../overview.css'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCheck,
  Code2,
  Database,
  Layers3,
  Mail,
  Terminal,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from './ui/card'
import { profile } from '../data/portfolio'
import { usePortfolio } from '../hooks/usePortfolio'
import { MotionRegion } from './MotionRegion'
import { Pills } from './Pills'
import { VexVisual } from './VexVisuals'
import { SkillGroups } from './SkillGroups'
import { aboutPortrait } from '../data/about'
import { Github, Linkedin } from './SocialIcons'
import { DivergenceGifPreview } from './DivergenceGifPreview'

function AbstractIllustration() {
  return (
    <div className="abstract-art" aria-hidden="true">
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <div className="art-tile tile-back">
        <Database size={24} />
      </div>
      <div className="art-tile tile-mid">
        <Code2 size={28} />
      </div>
      <div className="art-tile tile-front">
        <span />
        <span />
        <span />
      </div>
      <div className="art-dot dot-one" />
      <div className="art-dot dot-two" />
    </div>
  )
}

function IntroCard() {
  const { t } = useTranslation()
  const { profile } = usePortfolio()
  return (
    <Card className="intro-card">
      <div className="eyebrow intro-eyebrow">{profile.role}</div>
      <h1>
        <span>Daan</span> <span>van Vugt</span>
      </h1>
      <p>{profile.introduction}</p>
      <div className="intro-bottom">
        <Link className="overview-work-link" to="/projects">
          {t('overview.viewProjects')} <ArrowRight size={16} />
        </Link>
      </div>
      <AbstractIllustration />
    </Card>
  )
}

function ExperienceCard() {
  const { t } = useTranslation()
  return (
    <Card className="experience-card" id="experience">
      <div className="eyebrow experience-card-label">
        <span className="icon-label">
          <Layers3 size={15} />
        </span>{' '}
        <h2>{t('overview.experience')}</h2>
      </div>
      <div className="experience-heading">
        <strong>
          3<span> {t('overview.years')}</span>
        </strong>
        <p>{t('skills.role')}</p>
      </div>
      <div className="experience-rule" />
      <SkillGroups compact />
      <p className="experience-summary">{t('skills.summary')}</p>
      <Link className="text-link experience-card-link" to="/experience">
        {t('overview.viewExperience')} <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </Card>
  )
}

function VexCard() {
  const { t } = useTranslation()
  const { projects } = usePortfolio()
  const project = projects.find((project) => project.slug === 'vex')!
  return (
    <Card className="vex-card project-card">
      <VexVisual />
      <div className="project-copy">
        <div className="eyebrow">{project.eyebrow}</div>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <Pills items={project.technologies} />
        <Link className="text-link vex-card-link" to="/projects/vex">
          {t('overview.explore')} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  )
}

function BuildSequence() {
  return (
    <div className="build-sequence" aria-hidden="true">
      <span>
        <Code2 size={12} /> code
      </span>
      <i />
      <span>
        <Terminal size={12} /> build
      </span>
      <i />
      <span className="test-step">
        <CheckCheck size={12} /> test
      </span>
    </div>
  )
}

function DivergenceCard() {
  const { t } = useTranslation()
  return (
    <Card className="divergence-card project-card">
      <MotionRegion className="divergence-visual" label={t('visuals.divergence')}>
        <div className="overworld-frame">
          <DivergenceGifPreview
            src="/assets/divergence-overworld.gif"
            poster="/assets/divergence-overworld-poster.png"
          />
        </div>
        <BuildSequence />
      </MotionRegion>
      <div className="divergence-copy">
        <div className="eyebrow">{t('projects.divergence.eyebrow')}</div>
        <h2>
          <Link to="/projects/divergence">
            Emerald Rogue: <br />
            Divergence
          </Link>
        </h2>
        <p>{t('overview.divergenceSummary')}</p>
        <Link className="text-link" to="/projects/divergence">
          {t('overview.explore')} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  )
}

function AboutCard() {
  const { t } = useTranslation()
  const portrait = aboutPortrait.sources[0]
  return (
    <Card className="about-card" id="about">
      <img
        className="about-card-portrait"
        src={portrait.src}
        width={portrait.width}
        height={portrait.width}
        alt={t('about.portraitAlt')}
        loading="lazy"
        decoding="async"
      />
      <div className="about-card-copy">
        <div className="about-card-heading">
          <h2>
            <Link className="about-card-link" to="/about" aria-label={t('about.cardLink')}>
              {t('about.title')}
            </Link>
          </h2>
        </div>
        <p>{t('about.card.description')}</p>
        <span className="about-card-action">
          {t('about.card.action')}
          <ArrowRight className="about-card-arrow" size={16} strokeWidth={1.5} aria-hidden="true" />
        </span>
      </div>
    </Card>
  )
}

function ContactCard() {
  const { t } = useTranslation()
  return (
    <Card className="contact-card" id="contact">
      <Link className="contact-card-heading-link" to="/contact">
        <h2>{t('navigation.contact')}</h2>
        <ArrowRight size={28} strokeWidth={1.2} aria-hidden="true" />
      </Link>
      <div className="contact-links">
        <a href={`mailto:${profile.email}`}>
          <Mail size={18} aria-hidden="true" /> {t('overview.email')}{' '}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          <Github size={18} /> GitHub <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          <Linkedin size={18} /> LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </Card>
  )
}

export function OverviewPage() {
  const { t } = useTranslation()
  return (
    <>
      <div className="page-intro">
        <span>{t('overview.title')}</span>
      </div>
      <main id="main" className="bento-grid">
        <IntroCard />
        <VexCard />
        <ExperienceCard />
        <DivergenceCard />
        <AboutCard />
        <ContactCard />
      </main>
    </>
  )
}
