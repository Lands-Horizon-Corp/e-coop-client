import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                success:
                    'bg-green-400/40 dark:bg-green-400/20 text-green-600 dark:text-green-300 hover:bg-green-400/60',
                warning:
                    'bg-amber-400/40 dark:bg-amber-400/20 text-amber-600 dark:text-amber-300 hover:bg-amber-400/60',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                outline: 'text-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant, ...props }, ref) => {
        return (
            <span
                className={cn(badgeVariants({ variant }), className)}
                ref={ref}
                {...props}
            />
        )
    }
)

export { Badge, badgeVariants }
