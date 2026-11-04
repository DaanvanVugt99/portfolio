import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Braces,
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
import { useEffect, useRef, useState, type ReactNode, type SVGProps } from 'react'
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

function Github({ size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.5c0-1 .1-1.7-.5-2.4 3.2-.4 6.5-1.6 6.5-7.1 0-1.6-.6-2.8-1.5-3.8.2-.4.6-1.8-.2-3.2 0 0-1.2-.4-3.9 1.4a13.5 13.5 0 0 0-6.8 0C5.9 1.6 4.7 2 4.7 2c-.8 1.4-.4 2.8-.2 3.2C3.6 6.2 3 7.4 3 9c0 5.5 3.3 6.7 6.5 7.1-.5.6-.5 1.3-.5 2.4V22" />
    </svg>
  )
}
function Linkedin({ size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5v6M11.5 16.5v-6m0 2c0-3 5-3 5 0v4M7.5 7.4v.2" />
    </svg>
  )
}

function Header() {
  const { t } = useTranslation()
  return (
    <header className="site-header">
      <Link className="identity" to="/" aria-label={t('navigation.home')}>
        <span className="monogram">
          d<span>.</span>
        </span>
        <span>
          Daan van Vugt<span className="identity-role">{t('profile.role')}</span>
        </span>
      </Link>
      <nav aria-label={t('navigation.label')}>
        <Link to="/portfolio#work">{t('navigation.work')}</Link>
        <Link to="/portfolio#about">{t('navigation.about')}</Link>
        <Link to="/portfolio#contact">
          {t('navigation.contact')} <ArrowUpRight size={13} />
        </Link>
      </nav>
      <Settings />
    </header>
  )
}

function PageEffects() {
  const { t } = useTranslation()
  const { projects } = usePortfolio()
  const { pathname, hash } = useLocation()
  const previousPath = useRef(pathname)
  useEffect(() => {
    const project = projects.find((p) => pathname === `/projects/${p.slug}`)
    document.title = project
      ? `${project.title} — Daan van Vugt`
      : pathname === '/portfolio'
        ? `${t('overview.title')} — Daan van Vugt`
        : t('meta.home')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        project
          ? `${project.title} — ${project.description} ${project.role}`
          : t('meta.description'),
      )
  }, [pathname, t, projects])

  useEffect(() => {
    const main = document.getElementById('main')
    main?.setAttribute('tabindex', '-1')
    if (previousPath.current !== pathname) main?.focus({ preventScroll: true })
    previousPath.current = pathname
    if (hash)
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        }),
      )
    else window.scrollTo(0, 0)
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
        <a className="overview-work-link" href="#work">
          {t('overview.viewProjects')} <ArrowDown size={16} />
        </a>
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
  const { backendTechnologies } = usePortfolio()
  return (
    <Card className="experience-card">
      <div className="eyebrow">
        <span className="icon-label">
          <Layers3 size={15} />
        </span>{' '}
        {t('overview.experience')}
      </div>
      <div className="experience-heading">
        <strong>
          3<span> {t('overview.years')}</span>
        </strong>
        <p>
          {t('overview.professional')}
          <br />
          {t('overview.at')} <span>Valk Digital</span>
        </p>
      </div>
      <div className="experience-rule" />
      <div className="capabilities">
        <span>
          <Braces size={16} /> {t('overview.fullstack')}
        </span>
        <span>
          <Server size={16} /> {t('overview.backend')}
        </span>
        <span>
          <Smartphone size={16} /> {t('overview.mobile')}
        </span>
      </div>
      <Pills items={backendTechnologies} />
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

function VexVisual({ detail = false }: { detail?: boolean }) {
  const { t } = useTranslation()
  return (
    <MotionRegion
      className={`vex-visual ${detail ? 'vex-detail-visual' : ''}`}
      label={t('visuals.vex')}
    >
      <div className="visual-grid" />
      <div className="vex-mark">
        V<span>EX</span>
      </div>
      <div className="phone-composition">
        <Phone source="vex-hotels.webp" className="phone-back" />
        <Phone source="vex-stay.webp" alternate="vex-vouchers.webp" className="phone-front" />
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

function VexCard() {
  const { t } = useTranslation()
  const { projects } = usePortfolio()
  const project = projects[0]
  return (
    <Card className="vex-card project-card" id="work">
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
      <h2>{t('navigation.about')}</h2>
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
      <span className="contact-symbol" aria-hidden="true">
        <ArrowUpRight size={36} strokeWidth={1.2} />
      </span>
      <h2>{t('navigation.contact')}</h2>
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

function ProjectPage({ project }: { project: Project }) {
  const { t } = useTranslation()
  const { projects } = usePortfolio()
  const other = projects.find((p) => p.slug !== project.slug)!
  return (
    <main id="main" className="project-page">
      <Link to="/portfolio#work" className="back-link">
        <ArrowLeft size={16} /> {t('navigation.back')}
      </Link>
      <div className="case-heading">
        <span className="eyebrow">{project.eyebrow}</span>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <Pills items={project.technologies} />
      </div>
      {project.slug === 'vex' ? (
        <VexVisual detail />
      ) : (
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
      </div>
      {project.slug === 'divergence' && <p className="credits">{t('caseStudy.credits')}</p>}
      <section className="story-placeholder">
        <Workflow size={22} />
        <div>
          <h2>{t('caseStudy.draft')}</h2>
          <p>{project.nextStory}</p>
          <span>{t('caseStudy.draftNote')}</span>
        </div>
      </section>
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
  return ['#work', '#about', '#contact'].includes(hash) ? (
    <Navigate replace to={`/portfolio${hash}`} />
  ) : (
    <LandingPage />
  )
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
            <Route path="/portfolio" element={<OverviewPage />} />
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
