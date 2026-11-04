import { usePreferences } from '../state/Preferences'

export function BrandMark() {
  const { resolvedTheme } = usePreferences()
  return (
    <img
      className="brand-mark"
      src={resolvedTheme === 'dark' ? '/favicon-dark.svg?v=2' : '/favicon.svg?v=2'}
      width={40}
      height={40}
      alt=""
      aria-hidden="true"
    />
  )
}
