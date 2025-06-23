import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import type { IClassProps } from '@/types'

const yesNoVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                yes: [
                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
                    'dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30',
                ],
                no: [
                    'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200',
                    'dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800/70',
                ],
            },
        },
        defaultVariants: {
            variant: 'no',
        },
    }
)

interface Props extends IClassProps, VariantProps<typeof yesNoVariants> {
    value: boolean
    yesText?: string
    noText?: string
}

const YesNoBadge = forwardRef<HTMLDivElement, Props>(
    ({ value, yesText = 'Yes', noText = 'No', className }, ref) => {
        const variant = value ? 'yes' : 'no'
        const displayText = value ? yesText : noText

        return (
            <div
                ref={ref}
                className={cn(yesNoVariants({ variant }), className)}
            >
                {displayText}
            </div>
        )
    }
)

YesNoBadge.displayName = 'YesNoBadge'

export default YesNoBadge
