import type { SVGProps } from 'react'

export function Github({ size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.5c0-1 .1-1.7-.5-2.4 3.2-.4 6.5-1.6 6.5-7.1 0-1.6-.6-2.8-1.5-3.8.2-.4.6-1.8-.2-3.2 0 0-1.2-.4-3.9 1.4a13.5 13.5 0 0 0-6.8 0C5.9 1.6 4.7 2 4.7 2c-.8 1.4-.4 2.8-.2 3.2C3.6 6.2 3 7.4 3 9c0 5.5 3.3 6.7 6.5 7.1-.5.6-.5 1.3-.5 2.4V22" />
    </svg>
  )
}
export function Linkedin({ size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5v6M11.5 16.5v-6m0 2c0-3 5-3 5 0v4M7.5 7.4v.2" />
    </svg>
  )
}
