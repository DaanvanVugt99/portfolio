export const ascensionExampleLevels = [0, 2, 4, 8, 14, 20] as const
export type AscensionExampleLevel = (typeof ascensionExampleLevels)[number]
export const ascensionCaseStages = ['rules', 'generation', 'persistence'] as const
export const ascensionArchitecture = ['resolver', 'composition', 'snapshots'] as const
export type UpgradeScope = 'none' | 'aces' | 'bosses' | 'trainers'

function distribution(level: number, ace: number, boss: number, trainer: number): UpgradeScope {
  if (level >= trainer) return 'trainers'
  if (level >= boss) return 'bosses'
  if (level >= ace) return 'aces'
  return 'none'
}

// A small explanatory subset of RogueAscension_Resolve, not a game simulation.
// Thresholds are taken from the linked C implementation. Other modifiers are omitted.
export function resolveAscensionExample(level: number) {
  return {
    natures: distribution(level, 2, 6, 11),
    moves: distribution(level, 3, 7, 12),
    items: distribution(level, 4, 8, 14),
    party: level >= 20 ? 'full' : level >= 10 ? 'expanded' : 'baseline',
  } as const
}

const source =
  'https://github.com/DaanvanVugt99/pokeemerald-rogue/blob/63d3d113fe094ac2109d470b4df81975cb4c6187'
export const ascensionEvidence = {
  date: '2026-10-20',
  focusedTests: 36,
  links: [
    { key: 'rules', href: `${source}/src/rogue_ascension.c` },
    { key: 'tests', href: `${source}/test/rogue_ascension.c` },
    { key: 'validation', href: `${source}/docs/design/ascension_validation.md` },
  ],
} as const
