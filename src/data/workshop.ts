export const fontOptions = [
  { id: 'space', name: 'Space Grotesk', description: 'Angular details', url: '/fonts/space-grotesk-bold.typeface.json', family: 'Workshop Space' },
  { id: 'outfit', name: 'Outfit', description: 'Rounder shapes', url: '/fonts/outfit-bold.typeface.json', family: 'Workshop Outfit' },
  { id: 'bricolage', name: 'Bricolage Grotesque', description: 'More irregular detail', url: '/fonts/bricolage-bold.typeface.json', family: 'Workshop Bricolage' },
  { id: 'original', name: 'Original font', description: 'Previous version', url: '/fonts/helvetiker_bold.typeface.json', family: 'Inter Variable' },
] as const

export type MotionStyle = {
  id: string; name: string; description: string
  maxTilt: number; hoverDepth: number; pressDepth: number
  travelX: number; travelY: number; spring: number; damping: number
  influenceRadius: number; releaseImpulse: number
}

export const motionOptions: MotionStyle[] = [
  { id: 'original', name: 'Original', description: 'Small tilt, quick settle', maxTilt: Math.PI * 8 / 180, hoverDepth: 0.065, pressDepth: 0.085, travelX: 0, travelY: 0, spring: 155, damping: 21, influenceRadius: 0.65, releaseImpulse: 0 },
  { id: 'responsive', name: 'Responsive', description: 'More travel and rebound', maxTilt: Math.PI * 15 / 180, hoverDepth: 0.18, pressDepth: 0.17, travelX: 0.08, travelY: 0.07, spring: 105, damping: 13, influenceRadius: 0.72, releaseImpulse: 0.6 },
  { id: 'bouncy', name: 'Bouncy', description: 'Looser, longer spring', maxTilt: Math.PI * 20 / 180, hoverDepth: 0.27, pressDepth: 0.25, travelX: 0.15, travelY: 0.13, spring: 80, damping: 8.5, influenceRadius: 0.8, releaseImpulse: 1.1 },
]

export const defaultMotion = motionOptions[2]
