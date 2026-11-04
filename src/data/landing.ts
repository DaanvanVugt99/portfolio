export const landing = {
  lines: ['Daan van Vugt'],
  role: 'Software developer',
  experience: '3 years of professional experience',
  action: 'View portfolio',
  href: '/portfolio',
  font: '/fonts/space-grotesk-bold.typeface.json',
  fontFamily: 'Workshop Space',
  idleMotion: true,
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
  lighting: { ambient: 0.6, hemisphere: 1.7, key: 3.3, fill: 1.6, keyPosition: [-3, 5, 8] as const, fillPosition: [5, -1, 5] as const },
  shadow: { resolution: 1024, radius: 5, blurSamples: 12, planeDepth: -0.38 },
  entranceMs: 780,
  maxPixelRatio: 1.75,
}
