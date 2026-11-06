import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveLanguage } from '../src/i18n/language.ts'

test('First visits use the first supported browser language, including regional variants', () => {
  assert.equal(resolveLanguage(null, ['nl-NL', 'en-US']), 'nl')
  assert.equal(resolveLanguage(null, ['NL-be']), 'nl')
  assert.equal(resolveLanguage(null, ['en-GB', 'nl']), 'en')
  assert.equal(resolveLanguage(null, ['de-DE', 'nl-NL', 'en']), 'nl')
})

test('Explicit language choices override the device, while invalid saved values do not', () => {
  assert.equal(resolveLanguage('en', ['nl-NL']), 'en')
  assert.equal(resolveLanguage('nl', ['en-US']), 'nl')
  assert.equal(resolveLanguage('fr', ['nl']), 'nl')
})

test('Unsupported or missing device languages fall back to English', () => {
  assert.equal(resolveLanguage(null, ['fr-FR', 'de']), 'en')
  assert.equal(resolveLanguage(null, []), 'en')
})
