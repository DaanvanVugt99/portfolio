import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { projectDefinitions } from '../src/data/portfolio.ts'
import en from '../src/i18n/locales/en.json' with { type: 'json' }
import nl from '../src/i18n/locales/nl.json' with { type: 'json' }

test('The work catalogue contains four distinct projects in the agreed order', () => {
  assert.deepEqual(
    projectDefinitions.map(({ slug }) => slug),
    ['vex', 'valk-to-go', 'hktd', 'divergence'],
  )
  assert.equal(new Set(projectDefinitions.map(({ slug }) => slug)).size, 4)
  for (const project of projectDefinitions) {
    assert.ok(project.overviewTechnologies.length <= 4)
    for (const resource of [en, nl]) {
      const copy = resource.projects[project.slug]
      assert.ok(copy.overview.summary && copy.overview.contribution && copy.role)
      assert.ok(copy.contributions.length > 0)
    }
  }
})

test('VEX and HKTD both explain their shared Rails backend and show Rails in the overview', () => {
  for (const slug of ['vex', 'hktd']) {
    const project = projectDefinitions.find((project) => project.slug === slug)
    assert.ok(project.overviewTechnologies.includes('Ruby on Rails'))
    for (const resource of [en, nl]) {
      const copy = resource.projects[slug].backend
      for (const name of ['Roomserve', 'Valk Exclusief', 'HKTD', 'Ruby on Rails']) {
        assert.ok(copy.includes(name), `${slug}: missing ${name}`)
      }
    }
  }
})

test('Every overview cover has local image assets and a translated accessible description', async () => {
  for (const project of projectDefinitions) {
    assert.ok(project.thumbnail.sources.length > 0)
    assert.equal(new Set(project.thumbnail.sources).size, project.thumbnail.sources.length)
    const key = project.thumbnail.altKey.replace('visuals.', '')
    assert.ok(en.visuals[key] && nl.visuals[key])
    for (const source of project.thumbnail.sources) {
      assert.ok(source.startsWith('/assets/'))
      const image = await readFile(new URL(`../public${source}`, import.meta.url))
      assert.ok(image.length > 1000, source)
    }
  }
})
