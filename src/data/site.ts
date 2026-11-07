import { projectDefinitions } from './portfolio.ts'

export const siteUrl = 'https://daanvanvugt.com'

export const publicPages = [
  { path: '/', component: 'LandingPage' },
  { path: '/portfolio', component: 'OverviewPage' },
  { path: '/projects', component: 'ProjectsPage' },
  ...projectDefinitions.map(({ slug }) => ({
    path: `/projects/${slug}`,
    component: 'ProjectPage' as const,
  })),
  { path: '/experience', component: 'ExperiencePage' },
  { path: '/about', component: 'AboutPage' },
  { path: '/contact', component: 'ContactPage' },
] as const
export const publicPaths: readonly string[] = publicPages.map(({ path }) => path)

export function canonicalUrl(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/'
  return publicPaths.includes(path) ? new URL(path, siteUrl).href : undefined
}
