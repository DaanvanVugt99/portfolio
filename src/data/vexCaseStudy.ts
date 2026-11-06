export const vexCaseStages = ['backend', 'app', 'compatibility'] as const
export const offerArchitecturePatterns = ['adapter', 'configuration', 'selectors'] as const

export const offerGroups = ['all', 'summer-sale', 'last-minutes'] as const
export type OfferGroup = (typeof offerGroups)[number]

// Illustrative data for the explanation, not production offers or an API contract.
export const exampleOffers = [
  { id: 'summer', groups: ['summer-sale'] },
  { id: 'lastMinute', groups: ['last-minutes'] },
  { id: 'both', groups: ['summer-sale', 'last-minutes'] },
] satisfies { id: 'summer' | 'lastMinute' | 'both'; groups: string[] }[]
