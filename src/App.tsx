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
import { backendTechnologies, profile, projects, type Project } from './data/portfolio'
import { PreferencesProvider } from './state/Preferences'
import { MotionToggle, ThemeSwitcher } from './components/PreferenceControls'
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
  return (
    <header className="site-header">
      <Link className="identity" to="/" aria-label="Daan van Vugt, home">
        <span className="monogram">
          d<span>.</span>
        </span>
        <span>
          Daan van Vugt<span className="identity-role">Software developer</span>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <Link to="/portfolio#work">Work</Link>
        <Link to="/portfolio#about">About</Link>
        <Link to="/portfolio#contact">
          Contact <ArrowUpRight size={13} />
        </Link>
      </nav>
      <ThemeSwitcher />
    </header>
  )
}

function PageEffects() {
  const { pathname, hash } = useLocation()
  const previousPath = useRef(pathname)
  useEffect(() => {
    const project = projects.find((p) => pathname === `/projects/${p.slug}`)
    document.title = project
      ? `${project.title} — Daan van Vugt`
      : pathname === '/portfolio'
        ? 'Portfolio — Daan van Vugt'
        : 'Daan van Vugt — Software developer'
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        project
          ? `${project.title} — ${project.description} ${project.role}`
          : 'Daan van Vugt. Software developer with 3 years of professional experience in web and mobile applications, backend services, and testing.',
      )
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
          View projects <ArrowDown size={16} />
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
  return (
    <Card className="experience-card">
      <div className="eyebrow">
        <span className="icon-label">
          <Layers3 size={15} />
        </span>{' '}
        EXPERIENCE
      </div>
      <div className="experience-heading">
        <strong>
          3<span> years</span>
        </strong>
        <p>
          of professional development
          <br />
          at <span>Valk Digital</span>
        </p>
      </div>
      <div className="experience-rule" />
      <div className="capabilities">
        <span>
          <Braces size={16} /> Fullstack development
        </span>
        <span>
          <Server size={16} /> Backend services & integrations
        </span>
        <span>
          <Smartphone size={16} /> Native mobile applications
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
  return (
    <MotionRegion
      className={`vex-visual ${detail ? 'vex-detail-visual' : ''}`}
      label="Actual Valk Exclusief app screens showing self check-in, a digital room key, and rewards. Decorative conceptual app and services connection."
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
            aria-label="Read about the Valk Exclusief project"
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
  return (
    <Card className="divergence-card project-card">
      <MotionRegion
        className="divergence-visual"
        label="A real development render of Divergence’s laboratory map, alongside a conceptual code, build, test sequence."
      >
        <div className="map-frame">
          <img src="/assets/divergence-lab.png" alt="" width="320" height="256" loading="lazy" />
        </div>
        <BuildSequence />
      </MotionRegion>
      <div className="divergence-copy">
        <div className="eyebrow">PERSONAL PROJECT · GBA / C</div>
        <h2>
          <Link to="/projects/divergence">
            Emerald Rogue:
            <br />
            Divergence
          </Link>
        </h2>
        <p>
          Custom systems, tooling,
          <br />
          and regression checks.
        </p>
        <Link className="text-link" to="/projects/divergence">
          Explore the project <ArrowUpRight size={15} />
        </Link>
      </div>
    </Card>
  )
}

function AboutCard() {
  return (
    <Card className="about-card" id="about">
      <h2>About</h2>
      <p>{profile.about}</p>
      <div className="interest-tags">
        <span>
          <AudioLines size={14} /> Making music
        </span>
        <span>
          <Film size={14} /> Films & cinema
        </span>
      </div>
    </Card>
  )
}

function ContactCard() {
  return (
    <Card className="contact-card" id="contact">
      <span className="contact-symbol" aria-hidden="true">
        <ArrowUpRight size={36} strokeWidth={1.2} />
      </span>
      <h2>Contact</h2>
      <div className="contact-links">
        {profile.email ? (
          <a href={`mailto:${profile.email}`}>
            <Mail size={15} /> Email <ArrowUpRight size={12} />
          </a>
        ) : (
          <span
            className="pending-link"
            title="Your preferred public email will be added after design review."
          >
            <Mail size={15} /> Email <small>to add</small>
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
          <span
            className="pending-link"
            title="Your LinkedIn URL will be added after design review."
          >
            <Linkedin size={15} /> LinkedIn <small>to add</small>
          </span>
        )}
      </div>
    </Card>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Daan van Vugt</span>
      <MotionToggle />
      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer"
        aria-label="Daan van Vugt on GitHub"
      >
        <Github size={16} />
      </a>
    </footer>
  )
}

function OverviewPage() {
  return (
    <>
      <div className="page-intro">
        <span>PORTFOLIO</span>
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
        <span /> Design preview · Project stories and contact details are being refined.
      </div>
    </>
  )
}

function ProjectPage({ project }: { project: Project }) {
  const other = projects.find((p) => p.slug !== project.slug)!
  return (
    <main id="main" className="project-page">
      <Link to="/portfolio#work" className="back-link">
        <ArrowLeft size={16} /> Back to selected work
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
            alt="A development render of the laboratory map in Emerald Rogue: Divergence"
          />
          <div>
            <span className="eyebrow">DEVELOPMENT PREVIEW</span>
            <h2>
              Divergence
              <br />
              map development
            </h2>
            <BuildSequence />
          </div>
        </div>
      )}
      <div className="case-columns">
        <section>
          <div className="eyebrow">MY INVOLVEMENT</div>
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
          <div className="eyebrow">PROJECT LINKS</div>
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
      {project.slug === 'divergence' && (
        <p className="credits">
          Built on pret’s pokeemerald, RHH’s pokeemerald-expansion, and Pokabbie’s
          pokeemerald-rogue. This page describes the Divergence fork; upstream work remains credited
          to its contributors.
        </p>
      )}
      <section className="story-placeholder">
        <Workflow size={22} />
        <div>
          <h2>Case study draft</h2>
          <p>{project.nextStory}</p>
          <span>Case-study draft · Details to be completed together after homepage review.</span>
        </div>
      </section>
      <Link to={`/projects/${other.slug}`} className="next-project">
        <span>
          <small>OTHER PROJECT</small>
          {other.title}
        </span>
        <ArrowRight size={25} />
      </Link>
    </main>
  )
}

function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">404</span>
      <h1>Page not found.</h1>
      <p>This page does not exist.</p>
      <Button asChild>
        <Link to="/portfolio">
          Back to the portfolio <ArrowRight size={16} />
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
  return (
    <PreferencesProvider>
      <BrowserRouter>
        <PageEffects />
        <a className="skip-link" href="#main">
          Skip to content
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
