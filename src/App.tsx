import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Check,
  CheckCheck,
  Code2,
  Database,
  ExternalLink,
  Film,
  Layers3,
  Mail,
  Server,
  Smartphone,
  Terminal,
  Workflow,
} from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { profile, type Project } from './data/portfolio'
import { usePortfolio } from './hooks/usePortfolio'
import { useTranslation } from 'react-i18next'
import { PreferencesProvider } from './state/Preferences'
import { MotionToggle } from './components/PreferenceControls'
import { Settings } from './components/Settings'
import { LandingPage } from './components/LandingPage'
import { WorkshopPage } from './components/WorkshopPage'
import { vexShowcasePhones } from './data/vexScreenshots'
import { ExperiencePage } from './components/ExperiencePage'
import { BrandMark } from './components/BrandMark'
import { StickyHeader } from './components/StickyHeader'
import { ProjectsPage } from './components/ProjectsPage'
import { ProjectThumbnail } from './components/ProjectThumbnail'
import { AboutPage } from './components/AboutPage'
import { ContactPage } from './components/ContactPage'
import { Github, Linkedin } from './components/SocialIcons'
import { SkillGroups } from './components/SkillGroups'

function Header() {
  const { t } = useTranslation()
  return (
    <StickyHeader className="site-header">
      <Link
        className="identity"
        to="/portfolio"
        aria-label={`${profile.name}, ${t('navigation.home')}`}
      >
        <span className="monogram">
          <BrandMark />
        </span>
        <span>
          Daan van Vugt<span className="identity-role">{t('profile.role')}</span>
        </span>
      </Link>
      <nav aria-label={t('navigation.label')}>
        <Link to="/portfolio">{t('navigation.home')}</Link>
        <Link to="/projects">{t('navigation.work')}</Link>
        <Link to="/about">{t('navigation.about')}</Link>
        <Link to="/contact">
          {t('navigation.contact')} <ArrowUpRight size={13} />
        </Link>
      </nav>
      <Settings />
    </StickyHeader>
  )
}

function PageEffects() {
  const { t } = useTranslation()
  const { projects } = usePortfolio()
  const { pathname, hash } = useLocation()
  const previousLocation = useRef<{ pathname: string; hash: string } | null>(null)
  useEffect(() => {
    const project = projects.find((p) => pathname === `/projects/${p.slug}`)
    document.title = project
      ? `${project.title} — Daan van Vugt`
      : pathname === '/projects'
        ? `${t('work.title')} — Daan van Vugt`
        : pathname === '/about'
          ? `${t('about.title')} — Daan van Vugt`
          : pathname === '/contact'
            ? `${t('navigation.contact')} — Daan van Vugt`
            : pathname === '/portfolio'
              ? `${t('overview.title')} — Daan van Vugt`
              : pathname === '/experience'
                ? `${t('experience.title')} — Daan van Vugt`
                : t('meta.home')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        project
          ? `${project.title} — ${project.description} ${project.role}`
          : pathname === '/projects'
            ? t('work.metaDescription')
            : pathname === '/about'
              ? t('about.metaDescription')
              : pathname === '/contact'
                ? t('contact.metaDescription')
                : pathname === '/experience'
                  ? t('experience.metaDescription')
                  : t('meta.description'),
      )
  }, [pathname, t, projects])

  useLayoutEffect(() => {
    const changedPage = previousLocation.current?.pathname !== pathname
    const main = document.getElementById('main')
    main?.setAttribute('tabindex', '-1')
    if (previousLocation.current && changedPage) main?.focus({ preventScroll: true })
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior:
          changedPage || matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
      })
    } else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    previousLocation.current = { pathname, hash }
  }, [pathname, hash])
  return null
}

function MotionRegion({
  children,
  className = '',
  label,
}: {
  children: ReactNode
  className?: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.1,
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`motion-region ${className}`}
      data-playing={visible}
      role="img"
      aria-label={label}
    >
      {children}
    </div>
  )
}

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
        <span>Daan</span>
        <span>van Vugt</span>
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

function Pills({ items }: { items: string[] }) {
  return (
    <div className="pills">
      {items.map((item) => (
        <span className="pill" key={item}>
          {item}
        </span>
      ))}
    </div>
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
        <h2>
          <Link
            className="experience-card-link"
            to="/experience"
            aria-label={t('experience.cardLink')}
          >
            {t('overview.experience')}
          </Link>
        </h2>
        <ArrowUpRight
          className="experience-card-arrow"
          size={17}
          strokeWidth={1.5}
          aria-hidden="true"
        />
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
    </Card>
  )
}

function Phone({
  source,
  alternate,
  className = '',
}: {
  source: string
  alternate?: string
  className?: string
}) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        <img src={`/assets/${source}`} alt="" width="500" height="1024" draggable="false" />
        {alternate && (
          <img
            className="phone-alternate"
            src={`/assets/${alternate}`}
            alt=""
            width="500"
            height="1024"
            draggable="false"
          />
        )}
      </div>
    </div>
  )
}

function VexVisual() {
  const { t } = useTranslation()
  return (
    <MotionRegion className="vex-visual" label={t('visuals.vex')}>
      <div className="visual-grid" />
      <div className="phone-composition">
        <Phone source="vex-home.png" className="phone-back" />
        <Phone source="vex-room-key.png" alternate="vex-vouchers.png" className="phone-front" />
      </div>
      <div className="connection-chip">
        <span className="connection-node">
          <Smartphone size={14} />
        </span>
        <span className="connection-line">
          <i />
        </span>
        <span className="connection-node">
          <Server size={14} />
        </span>
        <span className="connection-line">
          <i />
        </span>
        <span className="connection-node">
          <Database size={14} />
        </span>
      </div>
      <div className="screen-note">
        <span className="status-dot" /> iOS & Android
      </div>
    </MotionRegion>
  )
}

function VexProjectVisual() {
  const { t } = useTranslation()
  return (
    <MotionRegion className="vex-project-visual" label={t('visuals.vexProject')}>
      <div className="visual-grid" />
      <img
        className="vex-project-logo"
        src="/assets/valk-exclusief-logo.svg"
        alt="Valk Exclusief"
        width="579"
        height="292"
      />
      <span className="vex-project-platforms">
        <Smartphone size={13} aria-hidden="true" /> iOS & Android
      </span>
      <div className="vex-project-phones">
        {vexShowcasePhones.map(({ id, ...phone }) => (
          <Phone key={id} {...phone} />
        ))}
      </div>
    </MotionRegion>
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
        <div className="project-title-row">
          <h2>
            <Link to="/projects/vex">{project.title}</Link>
          </h2>
          <Link
            className="round-link project-arrow"
            to="/projects/vex"
            aria-label={t('overview.vexRead')}
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
        <p>{project.description}</p>
        <Pills items={project.technologies} />
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
        <div className="map-frame">
          <img src="/assets/divergence-lab.png" alt="" width="320" height="256" loading="lazy" />
        </div>
        <BuildSequence />
      </MotionRegion>
      <div className="divergence-copy">
        <div className="eyebrow">{t('projects.divergence.eyebrow')}</div>
        <h2>
          <Link to="/projects/divergence">
            Emerald Rogue:
            <br />
            Divergence
          </Link>
        </h2>
        <p>{t('overview.divergenceSummary')}</p>
        <Link className="text-link" to="/projects/divergence">
          {t('overview.explore')} <ArrowUpRight size={15} />
        </Link>
      </div>
    </Card>
  )
}

function AboutCard() {
  const { t } = useTranslation()
  const { profile } = usePortfolio()
  return (
    <Card className="about-card" id="about">
      <div className="about-card-heading">
        <h2>
          <Link className="about-card-link" to="/about" aria-label={t('about.cardLink')}>
            {t('navigation.about')}
          </Link>
        </h2>
        <ArrowUpRight className="about-card-arrow" size={18} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p>{profile.about}</p>
      <div className="interest-tags">
        <span>
          <AudioLines size={14} /> {t('profile.music')}
        </span>
        <span>
          <Film size={14} /> {t('profile.films')}
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
        <ArrowUpRight size={28} strokeWidth={1.2} aria-hidden="true" />
      </Link>
      <div className="contact-links">
        {profile.email ? (
          <a href={`mailto:${profile.email}`}>
            <Mail size={15} /> {t('overview.email')} <ArrowUpRight size={12} />
          </a>
        ) : (
          <span className="pending-link" title={t('overview.emailPending')}>
            <Mail size={15} /> {t('overview.email')} <small>{t('overview.pending')}</small>
          </span>
        )}
        <a href={profile.github} target="_blank" rel="noreferrer">
          <Github size={15} /> GitHub <ArrowUpRight size={12} />
        </a>
        {profile.linkedin ? (
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={15} /> LinkedIn <ArrowUpRight size={12} />
          </a>
        ) : (
          <span className="pending-link" title={t('overview.linkedinPending')}>
            <Linkedin size={15} /> LinkedIn <small>{t('overview.pending')}</small>
          </span>
        )}
      </div>
    </Card>
  )
}

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Daan van Vugt</span>
      <MotionToggle />
      <a href={profile.github} target="_blank" rel="noreferrer" aria-label={t('overview.github')}>
        <Github size={16} />
      </a>
    </footer>
  )
}

function OverviewPage() {
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
      <div className="review-note">
        <span /> {t('overview.preview')}
      </div>
    </>
  )
}

function ProjectDetailVisual({ project }: { project: Project }) {
  const { t } = useTranslation()
  switch (project.slug) {
    case 'vex':
      return <VexProjectVisual />
    case 'divergence':
      return (
        <div className="divergence-detail-visual">
          <img
            src="/assets/divergence-lab.png"
            width="320"
            height="256"
            alt={t('visuals.mapAlt')}
          />
          <div>
            <span className="eyebrow">{t('visuals.development')}</span>
            <h2>
              Divergence
              <br />
              {t('visuals.map')}
            </h2>
            <BuildSequence />
          </div>
        </div>
      )
    case 'valk-to-go':
    case 'hktd':
      return (
        <div className="project-static-visual">
          <ProjectThumbnail thumbnail={project.thumbnail} priority />
        </div>
      )
  }
}

function ProjectPage({ project }: { project: Project }) {
  const { t } = useTranslation()
  const { projects } = usePortfolio()
  const other = projects.find((p) => p.slug !== project.slug)!
  return (
    <main id="main" className="project-page">
      <Link to={`/projects#${project.slug}`} className="back-link">
        <ArrowLeft size={16} /> {t('navigation.back')}
      </Link>
      <div className="case-heading">
        <span className="eyebrow">{project.eyebrow}</span>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <Pills items={project.technologies} />
      </div>
      <ProjectDetailVisual project={project} />
      {project.backend && (
        <section className="shared-backend">
          <Server size={22} strokeWidth={1.5} aria-hidden="true" />
          <div>
            <h2>{t('caseStudy.backend')}</h2>
            <p>{project.backend}</p>
          </div>
        </section>
      )}
      <div className="case-columns">
        <section>
          <div className="eyebrow">{t('caseStudy.involvement')}</div>
          <h2>{project.role}</h2>
          <ul className="contribution-list">
            {project.contributions.map((item) => (
              <li key={item}>
                <Check size={16} />
                {item}
              </li>
            ))}
          </ul>
        </section>
        {project.links.length > 0 && (
          <aside>
            <div className="eyebrow">{t('caseStudy.links')}</div>
            {project.links.map((link) => (
              <Button asChild variant="outline" key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                  <ExternalLink size={14} />
                </a>
              </Button>
            ))}
          </aside>
        )}
      </div>
      {project.slug === 'divergence' && <p className="credits">{t('caseStudy.credits')}</p>}
      {project.nextStory && (
        <section className="story-placeholder">
          <Workflow size={22} />
          <div>
            <h2>{t('caseStudy.draft')}</h2>
            <p>{project.nextStory}</p>
            <span>{t('caseStudy.draftNote')}</span>
          </div>
        </section>
      )}
      <Link to={`/projects/${other.slug}`} className="next-project">
        <span>
          <small>{t('caseStudy.other')}</small>
          {other.title}
        </span>
        <ArrowRight size={25} />
      </Link>
    </main>
  )
}

function NotFound() {
  const { t } = useTranslation()
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">404</span>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.description')}</p>
      <Button asChild>
        <Link to="/portfolio">
          {t('notFound.back')} <ArrowRight size={16} />
        </Link>
      </Button>
    </main>
  )
}

function LandingGate() {
  const { hash } = useLocation()
  if (hash === '#work') return <Navigate replace to="/projects" />
  if (hash === '#about') return <Navigate replace to="/about" />
  return hash === '#contact' ? <Navigate replace to="/contact" /> : <LandingPage />
}

function PortfolioGate() {
  const { hash } = useLocation()
  if (hash === '#about') return <Navigate replace to="/about" />
  if (hash === '#contact') return <Navigate replace to="/contact" />
  return hash === '#work' ? <Navigate replace to="/projects" /> : <OverviewPage />
}

function SiteLayout() {
  return (
    <div className="site-shell">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

function App() {
  const { t } = useTranslation()
  const { projects } = usePortfolio()
  return (
    <PreferencesProvider>
      <BrowserRouter>
        <PageEffects />
        <a className="skip-link" href="#main">
          {t('navigation.skip')}
        </a>
        <Routes>
          <Route path="/" element={<LandingGate />} />
          <Route path="/workshop" element={<WorkshopPage />} />
          <Route element={<SiteLayout />}>
            <Route path="/portfolio" element={<PortfolioGate />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            {projects.map((project) => (
              <Route
                key={project.slug}
                path={`/projects/${project.slug}`}
                element={<ProjectPage project={project} />}
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PreferencesProvider>
  )
}

export default App
