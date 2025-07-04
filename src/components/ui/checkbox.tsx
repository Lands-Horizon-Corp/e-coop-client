import * as React from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

import { MinusIcon } from '../icons'

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            'peer size-4 shrink-0 data-[state=indeterminate]:bg-primary/40 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            className={cn(
                'group/indicator flex items-center justify-center text-current'
            )}
        >
            <Check className="size-full group-[[data-state=indeterminate]]/indicator:hidden" />
            <MinusIcon className="size-full group-[[data-state=checked]]/indicator:hidden" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
