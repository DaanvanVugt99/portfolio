import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export function Field({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field" role="group" className={cn('field', className)} {...props} />
}

export function FieldLabel({ className, ...props }: ComponentProps<'label'>) {
  return <label data-slot="field-label" className={cn('field-label', className)} {...props} />
}

export function FieldError({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="field-error" className={cn('field-error', className)} {...props} />
}
