import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import { Window } from 'happy-dom'
import { act, createElement } from 'react'

const window = new Window({ url: 'http://localhost/' })
const { document } = window
for (const key of ['window', 'document', 'localStorage', 'navigator']) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: key === 'window' ? window : window[key],
  })
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true
globalThis.matchMedia = window.matchMedia.bind(window)
const { createRoot } = await import('react-dom/client')

test('Startup detects Dutch without saving a default; selecting English saves the override', async () => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { languages: ['nl-BE', 'en'], language: 'nl-BE' },
  })
  localStorage.clear()
  const { default: i18n, selectLanguage } = await import('../src/i18n/index.ts')
  assert.equal(i18n.resolvedLanguage, 'nl')
  assert.equal(document.documentElement.lang, 'nl')
  assert.equal(localStorage.getItem('portfolio-language'), null)
  selectLanguage('en')
  assert.equal(i18n.resolvedLanguage, 'en')
  assert.equal(document.documentElement.lang, 'en')
  assert.equal(localStorage.getItem('portfolio-language'), 'en')
})

test('The first paint follows device colour scheme, saved overrides and blocked storage', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  for (const [saved, dark, blocked, expected] of [
    [null, true, false, 'dark'],
    [null, false, false, 'light'],
    ['light', true, false, 'light'],
    ['dark', false, false, 'dark'],
    [null, true, true, 'dark'],
  ]) {
    const page = { documentElement: { dataset: {} } }
    runInNewContext(script, {
      document: page,
      matchMedia: () => ({ matches: dark }),
      localStorage: {
        getItem() {
          if (blocked) throw new Error('Storage disabled')
          return saved
        },
      },
    })
    assert.equal(page.documentElement.dataset.theme, expected)
  }
})

test('System theme tracks device changes; an explicit theme stays selected', async (t) => {
  localStorage.clear()
  const colour = new window.EventTarget()
  colour.matches = true
  t.mock.method(globalThis, 'matchMedia', () => colour)
  const { PreferencesProvider, usePreferences } = await import('../src/state/Preferences.tsx')
  let preferences
  function Probe() {
    preferences = usePreferences()
    return null
  }
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  t.after(async () => {
    await act(async () => root.unmount())
    container.remove()
  })
  await act(async () => root.render(createElement(PreferencesProvider, {}, createElement(Probe))))
  assert.equal(document.documentElement.dataset.theme, 'dark')
  assert.equal(localStorage.getItem('portfolio-theme'), null)
  await act(async () => {
    colour.matches = false
    colour.dispatchEvent(new window.Event('change'))
  })
  assert.equal(document.documentElement.dataset.theme, 'light')
  await act(async () => preferences.setTheme('dark'))
  assert.equal(document.documentElement.dataset.theme, 'dark')
  assert.equal(localStorage.getItem('portfolio-theme'), 'dark')
})
