export type Project = {
  slug: 'vex' | 'divergence'
  title: string
  eyebrow: string
  description: string
  role: string
  technologies: string[]
  contributions: string[]
  links: { label: string; href: string }[]
  nextStory: string
}

export const profile = {
  name: 'Daan van Vugt',
  github: 'https://github.com/DaanvanVugt99',
  email: null as string | null,
  linkedin: null as string | null,
}

type ProjectDefinition = Pick<Project, 'slug' | 'title' | 'technologies'> & {
  links: { label: 'appStore' | 'googlePlay' | 'code'; href: string }[]
}

export const projectDefinitions: ProjectDefinition[] = [
  {
    slug: 'vex',
    title: 'Valk Exclusief',
    technologies: ['React Native', 'TypeScript', 'Expo', 'Redux Toolkit'],
    links: [
      {
        label: 'appStore',
        href: 'https://apps.apple.com/nl/app/van-der-valk-exclusief/id435109159',
      },
      {
        label: 'googlePlay',
        href: 'https://play.google.com/store/apps/details?id=nl.valkexclusief',
      },
    ],
  },
  {
    slug: 'divergence',
    title: 'Emerald Rogue: Divergence',
    technologies: ['C', 'Python', 'mGBA'],
    links: [{ label: 'code', href: 'https://github.com/DaanvanVugt99/pokeemerald-rogue' }],
  },
]
