import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Window } from 'happy-dom'
import { act, createElement } from 'react'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import en from '../src/i18n/locales/en.json' with { type: 'json' }

const window = new Window({ url: 'http://localhost/' })
const { document } = window
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'localStorage']) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: key === 'window' ? window : window[key],
  })
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true
const reducedMotion = '(prefers-reduced-motion: reduce)'
const mediaQueries = new Map()
globalThis.matchMedia = (query) => {
  if (!mediaQueries.has(query)) {
    const media = new window.EventTarget()
    media.matches = query === reducedMotion
    mediaQueries.set(query, media)
  }
  return mediaQueries.get(query)
}
globalThis.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback
  }
  observe(target) {
    this.callback([{ target, isIntersecting: true }])
  }
  disconnect() {}
}
let visibility = 'visible'
Object.defineProperty(document, 'visibilityState', { get: () => visibility })

const { createRoot } = await import('react-dom/client')
const { PreferencesProvider } = await import('../src/state/Preferences.tsx')
const { MotionToggle } = await import('../src/components/PreferenceControls.tsx')
const { DivergenceGifPreview } = await import('../src/components/DivergenceGifPreview.tsx')

test('Reduced motion, shared pause controls and hidden pages keep game previews static', async () => {
  const i18n = createInstance()
  await i18n.init({ resources: { en: { translation: en } }, lng: 'en' })
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  try {
    await act(async () =>
      root.render(
        createElement(
          I18nextProvider,
          { i18n },
          createElement(
            PreferencesProvider,
            null,
            createElement(MotionToggle),
            createElement(MotionToggle),
            createElement(DivergenceGifPreview, { src: '/game.gif', poster: '/still.png' }),
          ),
        ),
      ),
    )
    const buttons = () => [...container.querySelectorAll('button')]
    const image = () => container.querySelector('img').getAttribute('src')
    assert.ok(buttons().every((button) => button.disabled))
    assert.equal(image(), '/still.png')
    assert.equal(document.documentElement.dataset.motion, 'paused')

    const media = mediaQueries.get(reducedMotion)
    await act(async () => {
      media.matches = false
      media.dispatchEvent(new window.Event('change'))
    })
    assert.ok(buttons().every((button) => !button.disabled))
    assert.equal(image(), '/game.gif?v=2')

    await act(async () => buttons()[0].click())
    assert.ok(buttons().every((button) => button.getAttribute('aria-pressed') === 'true'))
    assert.equal(image(), '/still.png')
    await act(async () => buttons()[1].click())
    assert.ok(buttons().every((button) => button.getAttribute('aria-pressed') === 'false'))
    assert.equal(image(), '/game.gif?v=2')

    await act(async () => {
      visibility = 'hidden'
      document.dispatchEvent(new window.Event('visibilitychange'))
    })
    assert.equal(image(), '/still.png')
    await act(async () => {
      visibility = 'visible'
      document.dispatchEvent(new window.Event('visibilitychange'))
      media.matches = true
      media.dispatchEvent(new window.Event('change'))
    })
    assert.ok(buttons().every((button) => button.disabled))
    assert.equal(image(), '/still.png')
  } finally {
    await act(async () => root.unmount())
    container.remove()
    await window.happyDOM.close()
  }
})
