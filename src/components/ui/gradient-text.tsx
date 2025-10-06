import type * as React from 'react'

import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/helpers'
import { type VariantProps, cva } from 'class-variance-authority'

const gradientTextVariants = cva(
    'inline-block bg-gradient-to-r bg-clip-text text-transparent font-medium transition-all',
    {
        variants: {
            variant: {
                primary: 'from-primary via-primary/80 to-primary/60',
                secondary:
                    'from-secondary-foreground via-muted-foreground to-secondary-foreground/60',
                accent: 'from-accent-foreground via-accent-foreground/80 to-accent-foreground/60',
                chart: 'from-chart-1 via-chart-2 to-chart-3',
                warm: 'from-chart-5 via-chart-4 to-chart-1',
                cool: 'from-chart-2 via-chart-3 to-chart-1',
                destructive:
                    'from-destructive via-destructive/80 to-destructive/60',
            },
            size: {
                sm: 'text-sm',
                default: 'text-base',
                lg: 'text-lg',
                xl: 'text-xl',
                '2xl': 'text-2xl',
                '3xl': 'text-3xl',
                '4xl': 'text-4xl',
                '5xl': 'text-5xl',
                '6xl': 'text-6xl',
            },
            animate: {
                none: '',
                shimmer:
                    'bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]',
                pulse: 'animate-[gradient-pulse_2s_ease-in-out_infinite]',
                slide: 'bg-[length:200%_100%] animate-[gradient-slide_3s_linear_infinite]',
                bounce: 'animate-[gradient-bounce_1.5s_ease-in-out_infinite]',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
            animate: 'none',
        },
    }
)

function GradientText({
    className,
    variant,
    size,
    animate,
    asChild = false,
    ...props
}: React.ComponentProps<'span'> &
    VariantProps<typeof gradientTextVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : 'span'

    return (
        <Comp
            data-slot="gradient-text"
            className={cn(
                gradientTextVariants({ variant, size, animate }),
                className
            )}
            {...props}
        />
    )
}

export { GradientText, gradientTextVariants }
