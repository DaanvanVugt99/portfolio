import assert from 'node:assert/strict'
import { test } from 'node:test'
import { canonicalUrl, publicPaths, siteUrl } from '../src/data/site.ts'
import { projectDefinitions } from '../src/data/portfolio.ts'

test('Public routes have unique production canonical URLs, including every project', () => {
  assert.equal(new Set(publicPaths).size, publicPaths.length)
  for (const path of publicPaths) {
    assert.equal(canonicalUrl(path), new URL(path, siteUrl).href)
  }
  for (const { slug } of projectDefinitions) {
    assert.ok(publicPaths.includes(`/projects/${slug}`))
  }
  assert.equal(canonicalUrl('/about/'), 'https://daanvanvugt.com/about')
})

test('Unknown routes and query/fragment strings cannot become canonical URLs', () => {
  for (const path of ['/missing', '/workshop', '//example.com', '/about?preview=1', '/about#bio']) {
    assert.equal(canonicalUrl(path), undefined)
  }
})
