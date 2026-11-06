import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveAscensionExample } from '../src/data/divergenceCaseStudy.ts'

// Expected nature/moves/item distributions from the game's recorded rule matrix:
// pokeemerald-rogue@63d3d113fe, test/rogue_ascension.c.
const scopes = ['none', 'aces', 'bosses', 'trainers']
const expected = [
  [0, 0, 0],
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [1, 1, 1],
  [1, 1, 1],
  [2, 1, 1],
  [2, 2, 1],
  [2, 2, 2],
  [2, 2, 2],
  [2, 2, 2],
  [3, 2, 2],
  [3, 3, 2],
  [3, 3, 2],
  [3, 3, 3],
  [3, 3, 3],
  [3, 3, 3],
  [3, 3, 3],
  [3, 3, 3],
  [3, 3, 3],
  [3, 3, 3],
]

test('The portfolio preview matches the recorded upgrade distributions at every A0–A20 level', () => {
  for (const [level, [nature, moves, items]] of expected.entries()) {
    const rule = resolveAscensionExample(level)
    assert.deepEqual(
      [rule.natures, rule.moves, rule.items],
      [scopes[nature], scopes[moves], scopes[items]],
      `A${level}`,
    )
  }
})

test('Boss team expansion is separate from profile upgrades', () => {
  assert.equal(resolveAscensionExample(9).party, 'baseline')
  assert.equal(resolveAscensionExample(10).party, 'expanded')
  assert.equal(resolveAscensionExample(19).party, 'expanded')
  assert.equal(resolveAscensionExample(20).party, 'full')
})
