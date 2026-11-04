import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

// Editable shadcn-style primitives: the project owns their markup and styling.
export function Card({ className, ...props }: ComponentProps<'article'>) {
  return <article data-slot="card" className={cn('card', className)} {...props} />
}
