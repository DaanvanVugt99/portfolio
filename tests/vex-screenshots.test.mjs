import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { vexShowcasePhones } from '../src/data/vexScreenshots.ts'

const sources = vexShowcasePhones.flatMap(({ source, alternate }) =>
  alternate ? [source, alternate] : [source],
)

test('No screenshot can appear on different phones, including during crossfades', () => {
  assert.equal(vexShowcasePhones.length, 3)
  assert.equal(new Set(sources).size, sources.length)
})

test('All showcase screenshots contain different image data and fit the phone crop', async () => {
  const hashes = await Promise.all(
    sources.map(async (source) => {
      const image = await readFile(new URL(`../public/assets/${source}`, import.meta.url))
      assert.equal(image.toString('ascii', 0, 4), 'RIFF', source)
      assert.equal(image.toString('ascii', 8, 12), 'WEBP', source)
      assert.equal(image.toString('ascii', 12, 16), 'VP8L', `${source}: lossless encoding`)
      const dimensions = image.readUInt32LE(21)
      assert.equal((dimensions & 0x3fff) + 1, 500, `${source}: width`)
      assert.equal(((dimensions >>> 14) & 0x3fff) + 1, 1024, `${source}: height`)
      return createHash('sha256').update(image).digest('hex')
    }),
  )
  assert.equal(new Set(hashes).size, sources.length)
})
