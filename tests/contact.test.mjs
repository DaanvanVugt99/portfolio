import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Window } from 'happy-dom'
import { createInstance } from 'i18next'
import { act, createElement } from 'react'
import { I18nextProvider } from 'react-i18next'
import en from '../src/i18n/locales/en.json' with { type: 'json' }
import nl from '../src/i18n/locales/nl.json' with { type: 'json' }

const window = new Window({ url: 'http://localhost/' })
const { document } = window
for (const key of [
  'window',
  'document',
  'navigator',
  'HTMLElement',
  'HTMLInputElement',
  'FormData',
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: key === 'window' ? window : window[key],
  })
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true
const { createRoot } = await import('react-dom/client')
const { ContactForm } = await import('../src/components/ContactForm.tsx')

async function renderForm(t, { formId = 'test-contact', language = 'en', response } = {}) {
  const request = t.mock.method(
    globalThis,
    'fetch',
    response ||
      (() => {
        throw new Error('Unexpected network request')
      }),
  )
  const translations = createInstance()
  await translations.init({
    resources: { en: { translation: en }, nl: { translation: nl } },
    lng: language,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  await act(async () =>
    root.render(
      createElement(
        I18nextProvider,
        { i18n: translations },
        createElement(ContactForm, { formId }),
      ),
    ),
  )
  t.after(async () => {
    await act(async () => root.unmount())
    container.remove()
  })
  const form = () => container.querySelector('form')
  const input = (name) => container.querySelector(`[name="${name}"]`)
  function fill(
    values = { name: 'Test Visitor', email: 'visitor@example.com', message: 'A test message.' },
  ) {
    for (const [name, value] of Object.entries(values)) input(name).value = value
  }
  async function submit() {
    await act(async () =>
      form().dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })),
    )
  }
  return { container, request, form, input, fill, submit }
}

test('An unconfigured form offers direct email and cannot submit, even with a forced submit event', async (t) => {
  const ui = await renderForm(t, { formId: '' })
  assert.equal(ui.container.querySelector('button[type="submit"]').disabled, true)
  assert.ok(ui.container.textContent.includes(en.contact.unavailable))
  assert.equal(
    ui.container.querySelector('a').getAttribute('href'),
    'mailto:Daan.vanvugt99@gmail.com',
  )
  ui.fill()
  await ui.submit()
  assert.equal(ui.request.mock.callCount(), 0)
  assert.equal(ui.container.querySelector('.contact-success'), null)
})

test('Validation blocks empty and whitespace-only fields, focuses the first error, and localises email errors', async (t) => {
  const ui = await renderForm(t, { language: 'nl' })
  await ui.submit()
  assert.equal(document.activeElement, ui.input('name'))
  assert.equal(ui.container.querySelectorAll('[aria-invalid="true"]').length, 3)
  assert.ok(ui.container.textContent.includes(nl.contact.errors.required))
  ui.fill({ name: 'Visitor', email: 'invalid', message: '   ' })
  await ui.submit()
  assert.equal(document.activeElement, ui.input('email'))
  assert.ok(ui.container.textContent.includes(nl.contact.errors.email))
  assert.equal(ui.input('message').getAttribute('aria-invalid'), 'true')
  assert.equal(ui.request.mock.callCount(), 0)
})

test('Sending waits for acceptance, blocks duplicate requests, and submits the visitor email as Reply-To', async (t) => {
  let accept
  const ui = await renderForm(t, {
    response: () =>
      new Promise((resolve) => {
        accept = resolve
      }),
  })
  ui.fill({ name: ' Test Visitor ', email: 'visitor@example.com', message: ' A test message. ' })
  await ui.submit()
  assert.equal(ui.container.querySelector('button[type="submit"]').disabled, true)
  assert.equal(ui.form().getAttribute('aria-busy'), 'true')
  assert.equal(ui.container.querySelector('.contact-success'), null)
  await ui.submit()
  assert.equal(ui.request.mock.callCount(), 1)
  const [url, options] = ui.request.mock.calls[0].arguments
  assert.equal(url, 'https://formspree.io/f/test-contact')
  assert.equal(options.body.get('email'), 'visitor@example.com')
  assert.equal(options.body.get('name'), 'Test Visitor')
  assert.equal(options.body.get('message'), 'A test message.')
  assert.equal(options.body.get('_gotcha'), '')
  await act(async () =>
    accept(
      new Response(JSON.stringify({ next: '/thanks' }), {
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  )
  assert.ok(ui.container.textContent.includes(en.contact.successTitle))
  assert.equal(document.activeElement, ui.container.querySelector('.contact-success'))
  await act(async () => ui.container.querySelector('button').click())
  assert.ok(ui.form())
  assert.equal(ui.input('message').value, '')
})

test('Provider rejection is translated, retains the message, and focuses the rejected field', async (t) => {
  const ui = await renderForm(t, {
    language: 'nl',
    response: async () =>
      new Response(
        JSON.stringify({
          errors: [{ field: 'email', code: 'TYPE_EMAIL', message: 'English provider error' }],
        }),
        { status: 422 },
      ),
  })
  ui.fill()
  await ui.submit()
  assert.equal(document.activeElement, ui.input('email'))
  assert.ok(ui.container.textContent.includes(nl.contact.errors.email))
  assert.ok(!ui.container.textContent.includes('English provider error'))
  assert.equal(ui.input('message').value, 'A test message.')
  assert.ok(ui.container.querySelector('[role="alert"]'))
  assert.equal(ui.container.querySelector('.contact-success'), null)
})

test('Network and quota failures keep the message and allow an explicit retry', async (t) => {
  let attempts = 0
  const ui = await renderForm(t, {
    response: async () => {
      attempts += 1
      if (attempts === 1) throw new TypeError('Network unavailable')
      if (attempts === 2)
        return new Response(JSON.stringify({ error: 'Monthly submission limit reached' }), {
          status: 429,
        })
      return new Response(JSON.stringify({ next: '/thanks' }))
    },
  })
  ui.fill()
  await ui.submit()
  assert.equal(ui.input('message').value, 'A test message.')
  assert.ok(ui.container.textContent.includes(en.contact.errors.failed))
  assert.equal(ui.container.querySelector('button').disabled, false)
  await ui.submit()
  assert.equal(ui.input('email').value, 'visitor@example.com')
  assert.equal(ui.container.querySelector('.contact-success'), null)
  await ui.submit()
  assert.equal(ui.request.mock.callCount(), 3)
  assert.ok(ui.container.querySelector('.contact-success'))
})
