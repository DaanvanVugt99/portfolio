import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Window } from 'happy-dom'
import { whenRouteContentReady } from '../src/lib/routeContent.ts'

const window = new Window()
const { document } = window
globalThis.document = window.document
globalThis.MutationObserver = window.MutationObserver

test('Route focus waits for lazy content, runs once, and ignores cancelled navigation', async () => {
  document.body.innerHTML = '<div id="root"><main id="main" data-route-loading></main></div>'
  let calls = 0
  const stop = whenRouteContentReady((main) => {
    calls++
    main.tabIndex = -1
    main.focus()
  })
  assert.equal(calls, 0)

  document.getElementById('root').innerHTML = '<main id="main"><h1>Destination</h1></main>'
  await window.happyDOM.waitUntilComplete()
  assert.equal(calls, 1)
  assert.equal(document.activeElement, document.getElementById('main'))

  document.querySelector('h1').textContent = 'Translated destination'
  await window.happyDOM.waitUntilComplete()
  assert.equal(calls, 1)
  stop()

  document.getElementById('root').innerHTML = '<main id="main" data-route-loading></main>'
  const cancel = whenRouteContentReady(() => calls++)
  cancel()
  document.getElementById('root').innerHTML = '<main id="main">Another route</main>'
  await window.happyDOM.waitUntilComplete()
  assert.equal(calls, 1)

  const dispose = whenRouteContentReady(() => calls++)
  assert.equal(calls, 2, 'Already loaded routes remain immediate')
  dispose()
  await window.happyDOM.close()
})
