import assert from 'node:assert/strict'
import test from 'node:test'

test('Deployment verification rejects a failing test', () => {
  assert.fail('Intentional deployment gate check. This PR must never be merged.')
})
