import en from '../i18n/locales/en.json' with { type: 'json' }
import nl from '../i18n/locales/nl.json' with { type: 'json' }
import { projectDefinitions } from '../data/portfolio.ts'
import { canonicalUrl, siteUrl } from '../data/site.ts'

export const sharingImage = {
  path: '/social/portfolio.png',
  width: 1200,
  height: 630,
  type: 'image/png',
} as const

export function pageMetadata(pathname: string, language = 'en') {
  const copy = language.split('-')[0] === 'nl' ? nl : en
  const path = pathname.replace(/\/+$/, '') || '/'
  const canonical = canonicalUrl(pathname)
  const project = projectDefinitions.find(({ slug }) => path === `/projects/${slug}`)
  let title = copy.meta.home
  let description = copy.meta.description

  if (project) {
    const projectCopy = copy.projects[project.slug]
    title = `${project.title} — Daan van Vugt`
    description = `${projectCopy.overview.summary} ${projectCopy.overview.contribution}`
  } else {
    const pages: Record<string, { title: string; description: string }> = {
      '/portfolio': { title: copy.overview.title, description },
      '/projects': { title: copy.work.title, description: copy.work.metaDescription },
      '/about': { title: copy.about.title, description: copy.about.metaDescription },
      '/contact': { title: copy.navigation.contact, description: copy.contact.metaDescription },
      '/experience': {
        title: copy.experience.title,
        description: copy.experience.metaDescription,
      },
    }
    const page = pages[path]
    if (page) {
      title = `${page.title} — Daan van Vugt`
      description = page.description
    } else if (!canonical) {
      title = `${copy.notFound.title} — Daan van Vugt`
      description = copy.notFound.description
    }
  }

  return {
    title,
    description,
    canonical,
    locale: copy === nl ? 'nl_NL' : 'en_GB',
    image: new URL(sharingImage.path, siteUrl).href,
    imageAlt: copy.meta.socialImageAlt,
  }
}

export function metadataTags(metadata: ReturnType<typeof pageMetadata>) {
  return [
    { name: 'description', content: metadata.description },
    ...(!metadata.canonical ? [{ name: 'robots', content: 'noindex' }] : []),
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Daan van Vugt' },
    { property: 'og:title', content: metadata.title },
    { property: 'og:description', content: metadata.description },
    ...(metadata.canonical ? [{ property: 'og:url', content: metadata.canonical }] : []),
    { property: 'og:locale', content: metadata.locale },
    { property: 'og:image', content: metadata.image },
    { property: 'og:image:type', content: sharingImage.type },
    { property: 'og:image:width', content: String(sharingImage.width) },
    { property: 'og:image:height', content: String(sharingImage.height) },
    { property: 'og:image:alt', content: metadata.imageAlt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metadata.title },
    { name: 'twitter:description', content: metadata.description },
    { name: 'twitter:image', content: metadata.image },
    { name: 'twitter:image:alt', content: metadata.imageAlt },
  ]
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export function renderPageMetadata(html: string, metadata: ReturnType<typeof pageMetadata>) {
  const marker = /<!-- page-metadata:start -->[\s\S]*?<!-- page-metadata:end -->/
  if (!marker.test(html)) throw new Error('Missing page metadata markers')
  const tags = metadataTags(metadata).map((attributes) => {
    const attrs = Object.entries(attributes)
      .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
      .join(' ')
    return `<meta ${attrs} />`
  })
  return html.replace(
    marker,
    [
      '<!-- page-metadata:start -->',
      `<title>${escapeHtml(metadata.title)}</title>`,
      ...(metadata.canonical
        ? [`<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`]
        : []),
      ...tags,
      '<!-- page-metadata:end -->',
    ].join('\n    '),
  )
}

export function updateDocumentMetadata(
  document: Document,
  metadata: ReturnType<typeof pageMetadata>,
) {
  document.title = metadata.title
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (metadata.canonical) {
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = metadata.canonical
  } else {
    canonical?.remove()
    document.querySelector('meta[property="og:url"]')?.remove()
  }
  if (metadata.canonical) document.querySelector('meta[name="robots"]')?.remove()

  for (const { name, property, content } of metadataTags(metadata)) {
    const attribute = name ? 'name' : 'property'
    const value = name ?? property!
    let tag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`)
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute(attribute, value)
      document.head.append(tag)
    }
    tag.content = content
  }
}
