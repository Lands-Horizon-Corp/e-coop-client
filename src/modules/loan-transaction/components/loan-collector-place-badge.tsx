import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'

import { BuildingIcon, PinLocationIcon, QuestionIcon } from '@/components/icons'

import { TLoanCollectorPlace } from '../loan-transaction.types'

const loanCollectorPlaceVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                office: cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
                ),
                field: cn(
                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
                    'dark:bg-green-950 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900'
                ),
                default: cn(
                    'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                    'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                ),
            },
            size: {
                sm: 'text-xs px-2 py-1 gap-1',
                md: 'text-sm px-2.5 py-1.5 gap-1.5',
                lg: 'text-base px-3 py-2 gap-2',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
)

const iconSizeVariants = cva('flex-shrink-0', {
    variants: {
        size: {
            sm: 'h-3 w-3',
            md: 'h-3.5 w-3.5',
            lg: 'h-4 w-4',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

interface LoanCollectorPlaceBadgeProps
    extends VariantProps<typeof loanCollectorPlaceVariants> {
    collectorPlace: TLoanCollectorPlace
    className?: string
    showIcon?: boolean
}

const loanCollectorPlaceIcons = {
    office: BuildingIcon,
    field: PinLocationIcon,
} as const

const loanCollectorPlaceLabels = {
    office: 'Office',
    field: 'Field',
} as const

export function LoanCollectorPlaceBadge({
    collectorPlace,
    className,
    showIcon = true,
    size = 'md',
    ...props
}: LoanCollectorPlaceBadgeProps) {
    const IconComponent =
        loanCollectorPlaceIcons[
            collectorPlace as keyof typeof loanCollectorPlaceIcons
        ]
    const label =
        loanCollectorPlaceLabels[
            collectorPlace as keyof typeof loanCollectorPlaceLabels
        ] || collectorPlace

    return (
        <div
            className={cn(
                loanCollectorPlaceVariants({ variant: collectorPlace, size }),
                'rounded-full max-w-full min-w-0',
                className
            )}
            {...props}
        >
            {showIcon && IconComponent ? (
                <IconComponent className={iconSizeVariants({ size })} />
            ) : (
                <QuestionIcon className={iconSizeVariants({ size })} />
            )}
            <span className="truncate capitalize">{label}</span>
        </div>
    )
}

export { loanCollectorPlaceVariants, iconSizeVariants }
export type LoanCollectorPlaceBadgeVariants = VariantProps<
    typeof loanCollectorPlaceVariants
>
