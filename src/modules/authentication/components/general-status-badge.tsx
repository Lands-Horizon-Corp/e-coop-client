import { forwardRef } from 'react'

import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'

import type { IClassProps, TGeneralStatus } from '@/types'

const generalStatusVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                pending:
                    'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/30',
                'for review':
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30',
                verified:
                    'bg-primary/10 text-primary/70 border-primary hover:bg-primary/20 dark:bg-primary/10/20 dark:text-primary dark:border-primary/70 dark:hover:bg-primary/10/30',
                'not allowed':
                    'bg-destructive/40 text-destructive/70 border-red-200 hover:bg-destructive/70 dark:bg-destructive/40/20 dark:text-destructive dark:border-red-800 dark:hover:bg-destructive/40/30',
                unknown:
                    'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800/70',
            },
        },
        defaultVariants: {
            variant: 'unknown',
        },
    }
)

interface Props
    extends IClassProps,
        VariantProps<typeof generalStatusVariants> {
    generalStatus: TGeneralStatus | string
}

const GeneralStatusBadge = forwardRef<HTMLDivElement, Props>(
    ({ generalStatus, className }, ref) => {
        const isValidStatus = [
            'pending',
            'for review',
            'verified',
            'not allowed',
        ].includes(generalStatus as TGeneralStatus)
        const variant = isValidStatus
            ? (generalStatus as TGeneralStatus)
            : 'unknown'
        const displayText = isValidStatus ? generalStatus : 'unknown'

        return (
            <div
                ref={ref}
                className={cn(generalStatusVariants({ variant }), className)}
            >
                {displayText}
            </div>
        )
    }
)

GeneralStatusBadge.displayName = 'GeneralStatusBadge'

export default GeneralStatusBadge
