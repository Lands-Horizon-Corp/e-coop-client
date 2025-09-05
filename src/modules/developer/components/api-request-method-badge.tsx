import { forwardRef } from 'react'

import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'

import type { IClassProps } from '@/types'

const apiMethodVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase',
    {
        variants: {
            method: {
                get: [
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30',
                ],
                post: [
                    'bg-primary/10 text-primary/70 border-primary hover:bg-primary/20',
                    'dark:bg-primary/10/20 dark:text-primary dark:border-primary/70 dark:hover:bg-primary/10/30',
                ],
                put: [
                    'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
                    'dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/30',
                ],
                delete: [
                    'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
                    'dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30',
                ],
                patch: [
                    'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
                    'dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/30',
                ],
                default: [
                    'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200',
                    'dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800/70',
                ],
            },
        },
        defaultVariants: {
            method: 'default',
        },
    }
)

export const REQUEST_METHOD = ['get', 'post', 'put', 'delete', 'patch'] as const

interface Props extends IClassProps, VariantProps<typeof apiMethodVariants> {}

const APIRequestMethodBadge = forwardRef<HTMLDivElement, Props>(
    ({ method, className }, ref) => {
        const methodLower = (method ?? '').toLowerCase()
        const variant = REQUEST_METHOD.includes(
            methodLower as (typeof REQUEST_METHOD)[number]
        )
            ? (methodLower as VariantProps<typeof apiMethodVariants>['method'])
            : 'default'

        return (
            <div
                ref={ref}
                className={cn(
                    apiMethodVariants({ method: variant }),
                    className
                )}
            >
                {methodLower.toUpperCase()}
            </div>
        )
    }
)

APIRequestMethodBadge.displayName = 'APIRequestMethodBadge'

export default APIRequestMethodBadge
