export type ExperienceEntry = {
  id: 'valk' | 'han' | 'tbl'
  kind: 'work' | 'study' | 'school'
  side: 'left' | 'right'
  organization: string
  logo: { src: string; width: number; height: number }
  start: string
  end: string
  translationKey: 'experience.entries.valk' | 'experience.entries.han' | 'experience.entries.tbl'
  featured?: boolean
  projectHref?: string
}

export const experience: readonly ExperienceEntry[] = [
  {
    id: 'valk',
    kind: 'work',
    side: 'right',
    organization: 'Valk Digital',
    logo: { src: '/assets/valk-digital-logo.jpg', width: 200, height: 200 },
    start: '2023-09',
    end: '2026-09',
    translationKey: 'experience.entries.valk',
    featured: true,
    projectHref: '/projects/vex',
  },
  {
    id: 'han',
    kind: 'study',
    side: 'left',
    organization: 'Hogeschool van Arnhem en Nijmegen',
    logo: { src: '/assets/han-logo.svg', width: 200, height: 133 },
    start: '2019-09',
    end: '2023-09',
    translationKey: 'experience.entries.han',
  },
  {
    id: 'tbl',
    kind: 'school',
    side: 'right',
    organization: 'Titus Brandsmalyceum',
    logo: { src: '/assets/tbl-logo.png', width: 1007, height: 260 },
    start: '2012-09',
    end: '2017-06',
    translationKey: 'experience.entries.tbl',
  },
]

export const establishedYear = '1999'

export function formatExperienceDate(value: string, language: string) {
  const [year, month] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(language === 'nl' ? 'nl-NL' : 'en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)))
}
