import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react'
import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Button } from './components/ui/button'
import { profile } from './data/portfolio'
import { usePortfolio } from './hooks/usePortfolio'
import { useTranslation } from 'react-i18next'
import { PreferencesProvider } from './state/Preferences'
import { MotionToggle } from './components/PreferenceControls'
import { Settings } from './components/Settings'
import { LandingPage } from './components/LandingPage'
import { BrandMark } from './components/BrandMark'
import { StickyHeader } from './components/StickyHeader'
import { Github, Linkedin } from './components/SocialIcons'
import { siteNavigation } from './data/navigation'
import { MobileNavigation } from './components/MobileNavigation'
import { whenRouteContentReady } from './lib/routeContent'
import { canonicalUrl } from './data/site'

const OverviewPage = lazy(() =>
  import('./components/OverviewPage').then((module) => ({ default: module.OverviewPage })),
)
const ProjectPage = lazy(() =>
  import('./components/ProjectPage').then((module) => ({ default: module.ProjectPage })),
)
const ProjectsPage = lazy(() =>
  import('./components/ProjectsPage').then((module) => ({ default: module.ProjectsPage })),
)
const ExperiencePage = lazy(() =>
  import('./components/ExperiencePage').then((module) => ({ default: module.ExperiencePage })),
)
const AboutPage = lazy(() =>
  import('./components/AboutPage').then((module) => ({ default: module.AboutPage })),
)
const ContactPage = lazy(() =>
  import('./components/ContactPage').then((module) => ({ default: module.ContactPage })),
)

function Header() {
  const { t } = useTranslation()
  const location = useLocation()
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
        {siteNavigation.map(({ id, href }) => (
          <NavLink key={id} to={href} end={id === 'home'}>
            {t(`navigation.${id}`)}{' '}
            {id === 'contact' && <ArrowUpRight size={13} aria-hidden="true" />}
          </NavLink>
        ))}
      </nav>
      <div className="site-header-actions">
        <Settings />
        <MobileNavigation key={location.key} />
      </div>
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
    const canonical = canonicalUrl(pathname)
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (canonical) {
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.append(link)
      }
      link.href = canonical
      robots?.remove()
    } else {
      link?.remove()
      if (!robots) {
        robots = document.createElement('meta')
        robots.name = 'robots'
        document.head.append(robots)
      }
      robots.content = 'noindex'
    }
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
    const shouldFocus = Boolean(previousLocation.current && changedPage)
    previousLocation.current = { pathname, hash }
    return whenRouteContentReady((main) => {
      main.setAttribute('tabindex', '-1')
      if (shouldFocus) main.focus({ preventScroll: true })
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView({
          behavior:
            changedPage || matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'instant'
              : 'smooth',
        })
      } else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    })
  }, [pathname, hash])
  return null
}

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Daan van Vugt</span>
      <div className="footer-actions">
        <MotionToggle />
        <nav className="footer-socials" aria-label={t('footer.links')}>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label={t('overview.github')}
            title={t('overview.github')}
          >
            <Github size={16} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={t('footer.linkedin')}
            title={t('footer.linkedin')}
          >
            <Linkedin size={16} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label={t('footer.email')}
            title={t('footer.email')}
          >
            <Mail size={16} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </footer>
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
  const { t } = useTranslation()
  return (
    <div className="site-shell">
      <Header />
      <Suspense
        fallback={
          <main id="main" className="route-loading" data-route-loading aria-busy="true">
            <p role="status">{t('navigation.loading')}</p>
          </main>
        }
      >
        <Outlet />
      </Suspense>
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
