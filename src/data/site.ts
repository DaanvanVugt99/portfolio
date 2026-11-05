import { projectDefinitions } from './portfolio.ts'

export const siteUrl = 'https://daanvanvugt.com'

export const publicPaths: readonly string[] = [
  '/',
  '/portfolio',
  '/projects',
  ...projectDefinitions.map(({ slug }) => `/projects/${slug}`),
  '/experience',
  '/about',
  '/contact',
]

export function canonicalUrl(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/'
  return publicPaths.includes(path) ? new URL(path, siteUrl).href : undefined
}
