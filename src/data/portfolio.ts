export type ProjectSlug = 'vex' | 'valk-to-go' | 'hktd' | 'divergence'

export type ProjectThumbnail = {
  kind: 'phones' | 'store-previews' | 'photo' | 'map'
  sources: string[]
  altKey:
    | 'visuals.vexThumbnail'
    | 'visuals.valkToGoThumbnail'
    | 'visuals.hktdThumbnail'
    | 'visuals.mapAlt'
}

export type Project = {
  slug: ProjectSlug
  title: string
  category: 'professional' | 'personal'
  thumbnail: ProjectThumbnail
  eyebrow: string
  description: string
  role: string
  backend?: string
  overview: { summary: string; contribution: string }
  technologies: string[]
  overviewTechnologies: string[]
  contributions: string[]
  links: { label: string; href: string }[]
  nextStory?: string
}

export const profile = {
  name: 'Daan van Vugt',
  github: 'https://github.com/DaanvanVugt99',
  email: 'Daan.vanvugt99@gmail.com',
  linkedin: 'https://www.linkedin.com/in/daan-van-vugt-497a941a2/',
}

type ProjectDefinition = Pick<
  Project,
  'slug' | 'title' | 'category' | 'thumbnail' | 'technologies' | 'overviewTechnologies'
> & {
  links: { label: 'appStore' | 'googlePlay' | 'code' | 'product'; href: string }[]
}

export const projectDefinitions: ProjectDefinition[] = [
  {
    slug: 'vex',
    title: 'Valk Exclusief',
    category: 'professional',
    thumbnail: {
      kind: 'phones',
      sources: ['/assets/vex-home.png', '/assets/vex-room-key.png'],
      altKey: 'visuals.vexThumbnail',
    },
    technologies: ['React Native', 'TypeScript', 'Expo', 'Redux Toolkit', 'Ruby on Rails'],
    overviewTechnologies: ['React Native', 'TypeScript', 'Ruby on Rails', 'Expo'],
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
    slug: 'valk-to-go',
    title: 'Valk to Go',
    category: 'professional',
    thumbnail: {
      kind: 'photo',
      sources: ['/assets/valk-to-go-shop.jpg'],
      altKey: 'visuals.valkToGoThumbnail',
    },
    technologies: ['React', 'Elixir', 'Phoenix'],
    overviewTechnologies: ['React', 'Elixir', 'Phoenix'],
    links: [
      {
        label: 'product',
        href: 'https://www.valkexclusief.nl/faciliteiten/valk-to-go-shop/',
      },
    ],
  },
  {
    slug: 'hktd',
    title: 'HKTD',
    category: 'professional',
    thumbnail: {
      kind: 'store-previews',
      sources: ['/assets/hktd-screen-3.png', '/assets/hktd-screen-2.png'],
      altKey: 'visuals.hktdThumbnail',
    },
    technologies: ['React Native', 'TypeScript', 'Ruby on Rails'],
    overviewTechnologies: ['React Native', 'TypeScript', 'Ruby on Rails'],
    links: [
      { label: 'googlePlay', href: 'https://play.google.com/store/apps/details?id=com.hktdmobile' },
    ],
  },
  {
    slug: 'divergence',
    title: 'Emerald Rogue: Divergence',
    category: 'personal',
    thumbnail: {
      kind: 'map',
      sources: ['/assets/divergence-lab.png'],
      altKey: 'visuals.mapAlt',
    },
    technologies: ['C', 'Python', 'mGBA'],
    overviewTechnologies: ['C', 'Python', 'mGBA'],
    links: [{ label: 'code', href: 'https://github.com/DaanvanVugt99/pokeemerald-rogue' }],
  },
]
