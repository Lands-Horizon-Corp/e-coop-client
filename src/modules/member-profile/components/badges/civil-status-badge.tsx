import { forwardRef } from 'react'

import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'

import type { IClassProps, TCivilStatus } from '@/types'

const civilStatusVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                married:
                    'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/30',
                single: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800/70',
                widowed:
                    'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-800/70',
                divorced:
                    'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/30',
                separated:
                    'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800 dark:hover:bg-pink-900/30',
                'civil partnership':
                    'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/30',
                unknown:
                    'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800/70',
            },
        },
        defaultVariants: {
            variant: 'unknown',
        },
    }
)

interface Props extends IClassProps, VariantProps<typeof civilStatusVariants> {
    civilStatus: TCivilStatus | string
}

const CivilStatusBadge = forwardRef<HTMLDivElement, Props>(
    ({ civilStatus, className }, ref) => {
        const isValidStatus = [
            'married',
            'single',
            'widowed',
            'divorced',
            'separated',
            'civil partnership',
        ].includes(civilStatus as TCivilStatus)
        const variant = isValidStatus
            ? (civilStatus as TCivilStatus)
            : 'unknown'
        const displayText = isValidStatus ? civilStatus : 'unknown'

        return (
            <div
                className={cn(civilStatusVariants({ variant }), className)}
                ref={ref}
            >
                {displayText}
            </div>
        )
    }
)

CivilStatusBadge.displayName = 'CivilStatusBadge'

export default CivilStatusBadge
