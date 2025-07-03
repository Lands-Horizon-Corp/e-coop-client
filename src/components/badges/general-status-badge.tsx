import { forwardRef } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

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
                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30',
                'not allowed':
                    'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30',
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
