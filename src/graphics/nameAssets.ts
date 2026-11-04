import type { FontData } from 'three/addons/loaders/FontLoader.js'
import { nameAppearance } from '../data/landing'

let graphics: Promise<typeof import('./nameScene')> | undefined
const fonts = new Map<string, Promise<FontData>>()

export function loadNameAssets(fontUrl: string) {
  graphics ??= import('./nameScene').catch((error) => {
    graphics = undefined
    throw error
  })

  let font = fonts.get(fontUrl)
  if (!font) {
    font = fetch(fontUrl, { signal: AbortSignal.timeout(nameAppearance.loadTimeoutMs) })
      .then((response) => {
        if (!response.ok) throw new Error('Font unavailable')
        return response.json() as Promise<FontData>
      })
      .catch((error) => {
        fonts.delete(fontUrl)
        throw error
      })
    fonts.set(fontUrl, font)
  }

  return Promise.all([graphics, font])
}
