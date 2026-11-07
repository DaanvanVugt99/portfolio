import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import {
  lazy,
  startTransition,
  Suspense,
  type ComponentType,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { Button } from './components/ui/button'
import { profile, type Project } from './data/portfolio'
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
import { pageMetadata, updateDocumentMetadata } from './lib/pageMetadata'
import { publicPages } from './data/site'
import { savedLanguage } from './i18n'

type Pages = {
  OverviewPage: ComponentType
  ProjectPage: ComponentType<{ project: Project }>
  ProjectsPage: ComponentType
  ExperiencePage: ComponentType
  AboutPage: ComponentType
  ContactPage: ComponentType
}
const pageLoaders = {
  OverviewPage: () =>
    import('./components/OverviewPage').then((m) => ({ default: m.OverviewPage })),
  ProjectPage: () => import('./components/ProjectPage').then((m) => ({ default: m.ProjectPage })),
  ProjectsPage: () =>
    import('./components/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
  ExperiencePage: () =>
    import('./components/ExperiencePage').then((m) => ({ default: m.ExperiencePage })),
  AboutPage: () => import('./components/AboutPage').then((m) => ({ default: m.AboutPage })),
  ContactPage: () => import('./components/ContactPage').then((m) => ({ default: m.ContactPage })),
}
const lazyPages: Pages = {
  OverviewPage: lazy(pageLoaders.OverviewPage),
  ProjectPage: lazy(pageLoaders.ProjectPage),
  ProjectsPage: lazy(pageLoaders.ProjectsPage),
  ExperiencePage: lazy(pageLoaders.ExperiencePage),
  AboutPage: lazy(pageLoaders.AboutPage),
  ContactPage: lazy(pageLoaders.ContactPage),
}

// Keep the static page visible while its code loads, then hydrate without a loading shell.
export async function initialPages(pathname: string): Promise<Pages> {
  const component = publicPages.find(
    ({ path }) => path === pathname.replace(/\/+$/, '') || path === pathname,
  )?.component
  if (!component || component === 'LandingPage') return lazyPages
  return { ...lazyPages, [component]: (await pageLoaders[component]()).default }
}

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
            {id === 'contact' && <ArrowRight size={13} aria-hidden="true" />}
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

function LanguagePreference() {
  const { i18n } = useTranslation()
  useEffect(() => {
    startTransition(() => {
      void i18n.changeLanguage(savedLanguage())
    })
  }, [i18n])
  return null
}

function PageEffects() {
  const { i18n } = useTranslation()
  const { pathname, hash } = useLocation()
  const previousLocation = useRef<{ pathname: string; hash: string } | null>(null)
  useEffect(() => {
    updateDocumentMetadata(document, pageMetadata(pathname, i18n.resolvedLanguage))
  }, [pathname, i18n.resolvedLanguage])

  useLayoutEffect(() => {
    const changedPage = previousLocation.current?.pathname !== pathname
    const shouldFocus = Boolean(previousLocation.current && changedPage)
    previousLocation.current = { pathname, hash }
    return whenRouteContentReady((main) => {
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
    <main id="main" tabIndex={-1} className="not-found">
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
  return hash === '#contact' ? (
    <Navigate replace to="/contact" />
  ) : (
    <>
      <LandingPage />
      <LanguagePreference />
    </>
  )
}

function PortfolioGate({ OverviewPage }: Pick<Pages, 'OverviewPage'>) {
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
          <main
            id="main"
            tabIndex={-1}
            className="route-loading"
            data-route-loading
            aria-busy="true"
          >
            <p role="status">{t('navigation.loading')}</p>
          </main>
        }
      >
        <Outlet />
        <LanguagePreference />
      </Suspense>
      <Footer />
    </div>
  )
}

export function App({ pages = lazyPages }: { pages?: Pages }) {
  const { OverviewPage, ProjectPage, ProjectsPage, ExperiencePage, AboutPage, ContactPage } = pages
  const { t } = useTranslation()
  const { projects } = usePortfolio()
  return (
    <PreferencesProvider>
      <PageEffects />
      <a className="skip-link" href="#main">
        {t('navigation.skip')}
      </a>
      <Routes>
        <Route path="/" element={<LandingGate />} />
        <Route element={<SiteLayout />}>
          <Route path="/portfolio" element={<PortfolioGate OverviewPage={OverviewPage} />} />
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
    </PreferencesProvider>
  )
}

export default App
