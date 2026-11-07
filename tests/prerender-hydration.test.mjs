import assert from 'node:assert/strict'
import { test } from 'node:test'
import { act, createElement } from 'react'
import { Window } from 'happy-dom'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'

// Exercise the actual route tree, not a separate approximation of the static page.
test('Static pages hydrate without replacing content and restore Dutch, dark theme and reduced motion', async (t) => {
  const server = await createServer({
    configFile: false,
    logLevel: 'error',
    plugins: [react()],
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: 'custom',
  })
  t.after(() => server.close())
  const { render } = await server.ssrLoadModule('/src/entry-server.tsx')
  const { default: App, initialPages } = await server.ssrLoadModule('/src/App.tsx')
  const { default: i18n } = await server.ssrLoadModule('/src/i18n/index.ts')
  const { BrowserRouter } = await import('react-router-dom')
  const window = new Window({ url: 'http://localhost/about' })
  for (const key of [
    'window',
    'document',
    'navigator',
    'localStorage',
    'HTMLElement',
    'HTMLInputElement',
    'HTMLFormElement',
    'getComputedStyle',
    'MutationObserver',
    'IntersectionObserver',
    'ResizeObserver',
    'requestAnimationFrame',
    'cancelAnimationFrame',
  ]) {
    const value = window[key]
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value:
        typeof value === 'function' &&
        (key.endsWith('AnimationFrame') || key === 'getComputedStyle')
          ? value.bind(window)
          : value,
    })
  }
  globalThis.matchMedia = (query) =>
    Object.assign(new window.EventTarget(), {
      matches: query.includes('reduce') || query.includes('dark'),
    })
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { hydrateRoot } = await import('react-dom/client')
  const warnings = []
  t.mock.method(console, 'error', (...args) => warnings.push(args.join(' ')))
  for (const path of ['/about', '/projects/vex', '/projects/divergence', '/contact']) {
    window.happyDOM.setURL(`http://localhost${path}`)
    await i18n.changeLanguage('en')
    window.localStorage.setItem('portfolio-language', 'nl')
    window.localStorage.setItem('portfolio-theme', 'dark')
    window.happyDOM.setWindowSize({ width: 390, height: 844 })
    const markup = render(path)
    window.document.body.innerHTML = `<div id="root" data-prerendered>${markup}</div>`
    const container = window.document.getElementById('root')
    const originalMain = container.querySelector('main')
    const errors = []
    let root
    await act(async () => {
      root = hydrateRoot(
        container,
        createElement(BrowserRouter, {}, createElement(App, { pages: await initialPages(path) })),
        { onRecoverableError: (error) => errors.push(error.message) },
      )
    })
    assert.deepEqual(errors, [], `Hydration failed on ${path}`)
    assert.deepEqual(warnings, [], `React warnings on ${path}`)
    assert.equal(
      container.querySelector('main'),
      originalMain,
      `Replaced the static page on ${path}`,
    )
    assert.equal(i18n.resolvedLanguage, 'nl')
    assert.equal(window.document.documentElement.lang, 'nl')
    assert.equal(window.document.documentElement.dataset.theme, 'dark')
    assert.equal(window.document.documentElement.dataset.motion, 'paused')
    assert.equal(window.localStorage.getItem('portfolio-theme'), 'dark')
    assert.equal(container.querySelector('[data-route-loading]'), null)
    await act(async () => root.unmount())
  }
  await window.happyDOM.abort()
})
