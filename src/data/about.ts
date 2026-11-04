type ResponsivePortrait = {
  src: string
  width: number
  height: number
  sources: readonly { src: string; width: number }[]
  sizes: string
}

export const aboutPortrait: ResponsivePortrait = {
  src: '/assets/daan-800.webp',
  width: 800,
  height: 800,
  sources: [
    { src: '/assets/daan-400.webp', width: 400 },
    { src: '/assets/daan-800.webp', width: 800 },
  ],
  sizes: '(min-width: 396px) 360px, calc(100vw - 36px)',
}
