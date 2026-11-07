import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { Window } from 'happy-dom'
import { build } from 'vite'
import { publicPages, publicPaths, siteUrl } from '../src/data/site.ts'
import {
  pageMetadata,
  renderPageMetadata,
  sharingImage,
  updateDocumentMetadata,
} from '../src/lib/pageMetadata.ts'

function parse(html) {
  const { document } = new Window()
  document.write(html)
  return document
}

test('Every public URL builds with readable content, route styles and sharing metadata before JavaScript runs', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
  const result = await build({ write: false, logLevel: 'silent' })
  const output = (Array.isArray(result) ? result : [result]).flatMap((result) => result.output)
  for (const path of publicPaths) {
    const destination =
      path === '/'
        ? '/index.html'
        : config.rewrites.find(({ source }) => source === path)?.destination
    assert.ok(destination, `No Vercel route for ${path}`)
    const file = output.find(({ fileName }) => fileName === destination.slice(1))
    assert.ok(file && file.type === 'asset', `No built HTML for ${path}`)
    const document = parse(file.source)
    const metadata = pageMetadata(path)
    assert.equal(document.title, metadata.title)
    assert.equal(document.querySelector('meta[name="description"]').content, metadata.description)
    assert.equal(document.querySelector('meta[property="og:title"]').content, metadata.title)
    assert.equal(
      document.querySelector('meta[property="og:description"]').content,
      metadata.description,
    )
    assert.equal(document.querySelector('meta[property="og:url"]').content, siteUrl + path)
    assert.equal(
      document.querySelector('link[rel="canonical"]').getAttribute('href'),
      siteUrl + path,
    )
    assert.equal(
      document.querySelector('meta[property="og:image"]').content,
      siteUrl + sharingImage.path,
    )
    assert.equal(document.querySelector('meta[name="twitter:card"]').content, 'summary_large_image')
    assert.equal(document.querySelectorAll('meta[property="og:image"]').length, 1)
    assert.equal(document.querySelectorAll('title').length, 1)
    assert.ok(document.querySelector('script[type="module"][src^="/assets/"]'))
    assert.ok(document.querySelector('#root[data-prerendered]'))
    assert.equal(document.querySelectorAll('main').length, 1)
    assert.equal(document.querySelectorAll('h1').length, 1)
    assert.ok(document.querySelector('h1').textContent.trim())
    assert.ok(document.querySelector('main a[href]'), `No usable navigation on ${path}`)
    assert.equal(document.querySelector('[data-route-loading]'), null)
    assert.ok(!file.source.includes('<!--app-html-->'))
    if (path === '/about') {
      assert.match(document.querySelector('main').textContent, /Ableton Live/)
      assert.ok(document.querySelector('main img[src$=".webp"]'))
    }
    if (path === '/projects/vex' || path === '/projects/divergence') {
      assert.ok(document.querySelectorAll('.case-study-panel').length >= 3)
      for (const panel of document.querySelectorAll('.case-study-panel')) {
        assert.ok(panel.querySelector('h3')?.textContent)
        assert.ok(panel.querySelector('p')?.textContent)
      }
    }
    if (path === '/contact') {
      assert.ok(document.querySelector('a[href^="mailto:"]'))
      assert.ok(document.querySelector('button[type="submit"]').disabled)
      assert.equal(document.querySelector('form').getAttribute('action'), null)
    }
    const pageName = publicPages.find((page) => page.path === path).component
    const pageCss = output.find(
      (asset) =>
        asset.fileName.startsWith(`assets/${pageName}-`) && asset.fileName.endsWith('.css'),
    )
    if (pageCss)
      assert.ok(document.querySelector(`link[rel="stylesheet"][href="/${pageCss.fileName}"]`))
    assert.ok(
      document.querySelectorAll('link[rel="stylesheet"]').length <
        output.filter((asset) => asset.fileName.endsWith('.css')).length,
    )
  }
  const notFound = parse(output.find(({ fileName }) => fileName === '404.html').source)
  assert.equal(notFound.querySelector('meta[name="robots"]').content, 'noindex')
  assert.equal(notFound.querySelector('link[rel="canonical"]'), null)
  assert.equal(notFound.querySelectorAll('main h1').length, 1)
  assert.ok(
    !config.rewrites.some(({ source }) => source === '/(.*)'),
    'Unknown URLs must reach Vercel�s static 404, not the landing page',
  )
})

test('Navigation and language changes update all metadata without accumulating tags', () => {
  const document = parse('<html><head></head><body></body></html>')
  for (const [path, language] of [
    ['/', 'en'],
    ['/projects/vex', 'nl'],
    ['/missing', 'nl'],
    ['/contact', 'en'],
  ]) {
    const metadata = pageMetadata(path, language)
    updateDocumentMetadata(document, metadata)
    assert.equal(document.title, metadata.title)
    assert.equal(
      document.querySelector('meta[property="og:locale"]').content,
      language === 'nl' ? 'nl_NL' : 'en_GB',
    )
    assert.equal(document.querySelector('meta[property="og:title"]').content, metadata.title)
    assert.equal(
      document.querySelector('meta[name="twitter:description"]').content,
      metadata.description,
    )
    assert.equal(document.querySelectorAll('meta[name="description"]').length, 1)
    assert.equal(document.querySelectorAll('meta[property="og:image"]').length, 1)
    if (path === '/missing') {
      assert.equal(document.querySelector('link[rel="canonical"]'), null)
      assert.equal(document.querySelector('meta[property="og:url"]'), null)
      assert.equal(document.querySelector('meta[name="robots"]').content, 'noindex')
    } else {
      assert.equal(
        document.querySelector('link[rel="canonical"]').getAttribute('href'),
        siteUrl + path,
      )
      assert.equal(document.querySelector('meta[name="robots"]'), null)
    }
  }
  assert.equal(pageMetadata('/projects/vex', 'nl-NL').locale, 'nl_NL')
  assert.equal(pageMetadata('/about', 'fr').locale, 'en_GB')
})

test('Metadata rendering escapes text and attributes and can replace an existing block', () => {
  const shell =
    '<html><head><!-- page-metadata:start --><!-- page-metadata:end --><meta name="theme-color" content="white"></head><body><div id="root"></div></body></html>'
  const title = 'A & "B" <script>example</script>'
  const description = '"><img src=x onerror=alert(1)> & details'
  const metadata = { ...pageMetadata('/about'), title, description }
  const once = renderPageMetadata(shell, metadata)
  const document = parse(renderPageMetadata(once, metadata))
  assert.equal(document.title, title)
  assert.equal(document.querySelector('meta[property="og:description"]').content, description)
  assert.equal(document.querySelectorAll('script, img').length, 0)
  assert.equal(document.querySelectorAll('meta[property="og:title"]').length, 1)
  assert.equal(document.querySelector('meta[name="theme-color"]').content, 'white')
  assert.ok(document.querySelector('#root'))
})

test('The sharing image is a small PNG with the advertised dimensions', async () => {
  const image = await readFile(new URL(`../public${sharingImage.path}`, import.meta.url))
  assert.equal(image.toString('hex', 0, 8), '89504e470d0a1a0a')
  const dimensions = [image.readUInt32BE(16), image.readUInt32BE(20)]
  assert.deepEqual(dimensions, [sharingImage.width, sharingImage.height])
  assert.ok(image.length < 300_000)
  assert.equal(sharingImage.type, 'image/png')
})
