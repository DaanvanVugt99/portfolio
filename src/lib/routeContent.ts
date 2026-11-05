// A lazy route may commit its loading state before its main content exists.
// Defer focus and anchor scrolling until the destination has actually mounted.
export function whenRouteContentReady(action: (main: HTMLElement) => void) {
  let observer: MutationObserver | undefined
  const check = () => {
    const main = document.getElementById('main')
    if (!main || main.hasAttribute('data-route-loading')) return false
    observer?.disconnect()
    action(main)
    return true
  }
  if (!check()) {
    observer = new MutationObserver(check)
    observer.observe(document.getElementById('root') ?? document.body, {
      childList: true,
      subtree: true,
    })
  }
  return () => observer?.disconnect()
}
