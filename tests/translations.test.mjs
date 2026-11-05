import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createInstance } from 'i18next'
import en from '../src/i18n/locales/en.json' with { type: 'json' }
import nl from '../src/i18n/locales/nl.json' with { type: 'json' }

function entries(value, prefix = '') {
  return Object.entries(value).flatMap(([key, item]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof item === 'string' ? [[path, item]] : entries(item, path)
  })
}

test('English and Dutch have the same nonempty translations and placeholders', () => {
  const english = new Map(entries(en))
  const dutch = new Map(entries(nl))
  assert.deepEqual([...english.keys()].sort(), [...dutch.keys()].sort())
  for (const [key, value] of english) {
    const translated = dutch.get(key)
    assert.ok(value.trim() && translated.trim(), `Empty translation: ${key}`)
    const placeholders = (text) =>
      [...text.matchAll(/{{\s*([^}]+)\s*}}/g)].map((match) => match[1].trim()).sort()
    assert.deepEqual(placeholders(value), placeholders(translated), key)
  }
})

test('Both languages resolve every translation key, including contribution lists', async () => {
  const instance = createInstance()
  await instance.init({
    resources: { en: { translation: en }, nl: { translation: nl } },
    supportedLngs: ['en', 'nl'],
    fallbackLng: 'en',
  })
  for (const [language, resource] of Object.entries({ en, nl })) {
    await instance.changeLanguage(language)
    for (const [key, value] of entries(resource)) {
      assert.equal(instance.t(key), value, `${language}: ${key}`)
    }
    for (const [slug, project] of Object.entries(resource.projects)) {
      assert.deepEqual(
        instance.t(`projects.${slug}.contributions`, { returnObjects: true }),
        project.contributions,
      )
    }
  }
  await instance.changeLanguage('fr')
  assert.equal(instance.t('landing.action'), en.landing.action)
})
