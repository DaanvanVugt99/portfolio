export function getTimelineFocus(centers: readonly number[], readingPosition: number) {
  if (!centers.length) return { position: 0, activeIndex: -1 }
  const position = Math.max(centers[0], Math.min(centers[centers.length - 1], readingPosition))
  const activeIndex = centers.reduce(
    (closest, center, index) =>
      Math.abs(center - position) < Math.abs(centers[closest] - position) ? index : closest,
    0,
  )
  return { position, activeIndex }
}
