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
  role: 'Software developer',
  introduction: 'Open to fullstack and backend development roles.',
  experience: '3 years',
  employer: 'Valk Digital',
  focus: ['Fullstack development', 'Backend systems', 'Mobile applications'],
  github: 'https://github.com/DaanvanVugt99',
  // Fill these with Daan’s preferred public destinations after design review.
  email: null as string | null,
  linkedin: null as string | null,
  about:
    'I’d like to be involved earlier in understanding requirements and deciding how to solve them.',
  interests: ['Making music', 'Films & cinema', 'Building things'],
}

export const projects: Project[] = [
  {
    slug: 'vex',
    title: 'Valk Exclusief',
    eyebrow: 'Professional work · iOS & Android',
    description:
      'An iOS and Android hotel app for bookings, online check-in, digital room keys, and rewards.',
    role: 'App development, end to end, alongside a colleague at Valk Digital.',
    technologies: ['React Native', 'TypeScript', 'Expo', 'Redux Toolkit'],
    contributions: [
      'Worked across the entire application alongside a colleague.',
      'Built and maintained app features and backend integrations.',
      'Contributed to testing, deployment, and ongoing maintenance.',
    ],
    links: [
      {
        label: 'App Store',
        href: 'https://apps.apple.com/nl/app/van-der-valk-exclusief/id435109159',
      },
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=nl.valkexclusief',
      },
    ],
    nextStory:
      'Next: choose a feature or integration to walk through, including the problem, your decisions, and how you tested it.',
  },
  {
    slug: 'divergence',
    title: 'Emerald Rogue: Divergence',
    eyebrow: 'Personal project · GBA / C',
    description:
      'A personal C project extending Pokémon Emerald Rogue with custom game systems, tooling, and regression checks.',
    role: 'Personal development on a standalone fork of Pokémon Emerald Rogue.',
    technologies: ['C', 'Python tooling', 'mGBA', 'Regression testing'],
    contributions: [
      'Extends an existing decompilation-based codebase with custom game systems.',
      'Includes project-specific changes, build tooling, and focused regression checks.',
      'Maintains clear project documentation and upstream credits.',
    ],
    links: [
      { label: 'Explore the code', href: 'https://github.com/DaanvanVugt99/pokeemerald-rogue' },
    ],
    nextStory:
      'Next: select a system or bug fix that best demonstrates your engineering decisions.',
  },
]

export const backendTechnologies = [
  'Ruby on Rails',
  'Elixir',
  'Database design',
  'Git',
  'Testing & delivery',
]
