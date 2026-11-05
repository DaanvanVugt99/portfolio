export const skills = {
  rails: 'Ruby on Rails',
  elixirPhoenix: 'Elixir / Phoenix',
  postgres: 'PostgreSQL',
  sql: 'SQL',
  rest: 'REST APIs',
  swagger: 'Swagger',
  react: 'React',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  htmlCss: 'HTML / CSS',
  reactNative: 'React Native',
  expo: 'Expo',
  reduxToolkit: 'Redux Toolkit',
  jest: 'Jest',
  rspec: 'RSpec',
  maestro: 'Maestro',
  integrationTests: null,
  git: 'Git',
  githubActions: 'GitHub Actions',
  fastlane: 'Fastlane',
  docker: 'Docker',
  honeybadger: 'Honeybadger',
  clarity: 'Microsoft Clarity',
} as const

type SkillId = keyof typeof skills
export type SkillGroupId = 'backend' | 'web' | 'mobile' | 'testing' | 'delivery' | 'monitoring'
type SkillGroup = {
  id: SkillGroupId
  items: readonly SkillId[]
  overviewItems?: readonly SkillId[]
}

// Professional experience at Valk Digital. Personal-project tools stay with
// their projects; the Home card selects a smaller subset of this same catalogue.
export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'backend',
    items: ['rails', 'elixirPhoenix', 'postgres', 'sql', 'rest', 'swagger'],
    overviewItems: ['rails', 'elixirPhoenix', 'postgres'],
  },
  {
    id: 'web',
    items: ['react', 'typescript', 'javascript', 'htmlCss'],
    overviewItems: ['react', 'typescript'],
  },
  {
    id: 'mobile',
    items: ['reactNative', 'expo', 'reduxToolkit'],
    overviewItems: ['reactNative', 'expo', 'reduxToolkit'],
  },
  { id: 'testing', items: ['jest', 'rspec', 'maestro', 'integrationTests'] },
  { id: 'delivery', items: ['git', 'githubActions', 'fastlane', 'docker'] },
  { id: 'monitoring', items: ['honeybadger', 'clarity'] },
]
