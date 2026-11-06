import * as TabsPrimitive from '@radix-ui/react-tabs'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export function Tabs(props: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />
}

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List data-slot="tabs-list" className={cn('tabs-list', className)} {...props} />
  )
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn('tabs-trigger', className)}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('tabs-content', className)}
      {...props}
    />
  )
}
