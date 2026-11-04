import assert from 'node:assert/strict'
import { test } from 'node:test'
import { experience, formatExperienceDate } from '../src/data/experience.ts'
import { getTimelineFocus } from '../src/lib/timeline.ts'

test('Experience preserves the three confirmed periods, newest first', () => {
  assert.deepEqual(
    experience.map(({ id, start, end }) => ({ id, start, end })),
    [
      { id: 'valk', start: '2023-09', end: '2026-09' },
      { id: 'han', start: '2019-09', end: '2023-09' },
      { id: 'tbl', start: '2012-09', end: '2017-06' },
    ],
  )
  assert.equal(new Set(experience.map(({ id }) => id)).size, experience.length)
})

test('Month-precise dates are localised without losing the confirmed month or year', () => {
  assert.match(formatExperienceDate('2017-06', 'en'), /Jun.*2017/)
  assert.match(formatExperienceDate('2017-06', 'nl'), /jun.*2017/)
  assert.match(formatExperienceDate('2023-09', 'en'), /Sept.*2023/)
  assert.match(formatExperienceDate('2023-09', 'nl'), /sep.*2023/)
})

test('The scroll highlight clamps to the rail and follows the nearest milestone both ways', () => {
  const centers = [46, 480, 900]
  assert.deepEqual(getTimelineFocus(centers, -100), { position: 46, activeIndex: 0 })
  assert.deepEqual(getTimelineFocus(centers, 500), { position: 500, activeIndex: 1 })
  assert.deepEqual(getTimelineFocus(centers, 830), { position: 830, activeIndex: 2 })
  assert.deepEqual(getTimelineFocus(centers, 1500), { position: 900, activeIndex: 2 })
  assert.deepEqual(getTimelineFocus(centers, 400), { position: 400, activeIndex: 1 })
  assert.deepEqual(getTimelineFocus(centers, 60), { position: 60, activeIndex: 0 })
})

test('The timeline also handles a single entry or an empty list', () => {
  assert.deepEqual(getTimelineFocus([46], 500), { position: 46, activeIndex: 0 })
  assert.deepEqual(getTimelineFocus([], 500), { position: 0, activeIndex: -1 })
})
