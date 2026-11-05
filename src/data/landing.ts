export const landing = {
  lines: ['Daan van Vugt'],
  href: '/portfolio',
  font: '/fonts/space-grotesk-bold.typeface.json',
  fontFamily: 'Portfolio Space Grotesk',
  idleMotion: true,
}

export type MotionStyle = {
  id: string
  maxTilt: number
  hoverDepth: number
  pressDepth: number
  travelX: number
  travelY: number
  spring: number
  damping: number
  influenceRadius: number
  releaseImpulse: number
}

export const defaultMotion: MotionStyle = {
  id: 'bouncy',
  maxTilt: (Math.PI * 20) / 180,
  hoverDepth: 0.27,
  pressDepth: 0.25,
  travelX: 0.15,
  travelY: 0.13,
  spring: 80,
  damping: 8.5,
  influenceRadius: 0.8,
  releaseImpulse: 1.1,
}

// Art direction and interaction settings, shared by all screen sizes.
export const nameAppearance = {
  light: { face: '#294cde', side: '#203cae', background: '#ffffff', shadowOpacity: 0.15 },
  dark: { face: '#858aff', side: '#5254c8', background: '#0e111b', shadowOpacity: 0.4 },
  depth: 0.19,
  bevelSize: 0.024,
  bevelThickness: 0.022,
  rowGap: 0.29,
  tracking: 0.035,
  firstRowScale: 1.16,
  viewPaddingX: 1.14,
  viewPaddingY: 1.22,
  opticalOffset: 0.065,
  restTilt: { x: -0.055, y: -0.07 },
  lighting: {
    ambient: 0.6,
    hemisphere: 1.7,
    key: 3.3,
    fill: 1.6,
    keyPosition: [-3, 5, 8] as const,
    fillPosition: [5, -1, 5] as const,
  },
  shadow: { resolution: 1024, radius: 5, blurSamples: 12, planeDepth: -0.38 },
  entranceMs: 780,
  entranceStaggerMs: 22,
  entranceRise: 0.18,
  loadTimeoutMs: 8000,
  maxPixelRatio: 1.75,
  idleFrameRate: 30,
}
