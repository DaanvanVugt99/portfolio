export type ProjectSlug = 'vex' | 'valk-to-go' | 'hktd' | 'divergence'

export type ProjectThumbnail = {
  kind: 'phones' | 'store-previews' | 'photo' | 'collage'
  sources: string[]
  altKey:
    | 'visuals.vexThumbnail'
    | 'visuals.valkToGoThumbnail'
    | 'visuals.hktdThumbnail'
    | 'visuals.divergenceThumbnail'
}

export type Project = {
  slug: ProjectSlug
  title: string
  category: 'professional' | 'personal'
  thumbnail: ProjectThumbnail
  eyebrow: string
  description: string
  role: string
  overview: { summary: string; contribution: string }
  technologies: string[]
  overviewTechnologies: string[]
  contributions: string[]
  links: { label: string; href: string }[]
  sourceVisibility: 'public' | 'private'
}

export const profile = {
  name: 'Daan van Vugt',
  github: 'https://github.com/DaanvanVugt99',
  email: 'Daan.vanvugt99@gmail.com',
  linkedin: 'https://www.linkedin.com/in/daan-van-vugt-497a941a2/',
}

type ProjectDefinition = Pick<
  Project,
  | 'slug'
  | 'title'
  | 'category'
  | 'thumbnail'
  | 'technologies'
  | 'overviewTechnologies'
  | 'sourceVisibility'
> & {
  links: { label: 'appStore' | 'googlePlay' | 'code' | 'product'; href: string }[]
}

export const projectDefinitions: ProjectDefinition[] = [
  {
    slug: 'vex',
    title: 'Valk Exclusief',
    category: 'professional',
    sourceVisibility: 'private',
    thumbnail: {
      kind: 'phones',
      sources: ['/assets/vex-home.webp', '/assets/vex-room-key.webp'],
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
    sourceVisibility: 'private',
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
    sourceVisibility: 'private',
    thumbnail: {
      kind: 'store-previews',
      sources: ['/assets/hktd-screen-3.webp', '/assets/hktd-screen-2.webp'],
      altKey: 'visuals.hktdThumbnail',
    },
    technologies: ['React Native', 'React', 'TypeScript', 'Ruby on Rails'],
    overviewTechnologies: ['React Native', 'React', 'TypeScript', 'Ruby on Rails'],
    links: [
      { label: 'googlePlay', href: 'https://play.google.com/store/apps/details?id=com.hktdmobile' },
    ],
  },
  {
    slug: 'divergence',
    title: 'Emerald Rogue: Divergence',
    category: 'personal',
    sourceVisibility: 'public',
    thumbnail: {
      kind: 'collage',
      sources: [
        '/assets/divergence-hub-poster.png',
        '/assets/divergence-overworld-poster.png',
        '/assets/divergence-battle-poster.png',
      ],
      altKey: 'visuals.divergenceThumbnail',
    },
    technologies: ['C', 'Python', 'mGBA'],
    overviewTechnologies: ['C', 'Python', 'mGBA'],
    links: [{ label: 'code', href: 'https://github.com/DaanvanVugt99/pokeemerald-rogue' }],
  },
]
