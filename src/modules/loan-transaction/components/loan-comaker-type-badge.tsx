import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'

import {
    BankIcon,
    QuestionIcon,
    UserIcon,
    Users3Icon,
} from '../../../components/icons'
import { TLoanComakerType } from '../loan-transaction.types'

const loanComakerTypeVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                member: cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
                ),
                deposit: cn(
                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
                    'dark:bg-green-950 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900'
                ),
                others: cn(
                    'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
                    'dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900'
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

interface LoanComakerTypeBadgeProps
    extends VariantProps<typeof loanComakerTypeVariants> {
    comakerType: TLoanComakerType
    className?: string
    showIcon?: boolean
}

const loanComakerTypeIcons = {
    member: UserIcon,
    deposit: BankIcon,
    others: Users3Icon,
} as const

const loanComakerTypeLabels = {
    member: 'Member',
    deposit: 'Deposit',
    others: 'Others',
} as const

export function LoanComakerTypeBadge({
    comakerType,
    className,
    showIcon = true,
    size = 'md',
    ...props
}: LoanComakerTypeBadgeProps) {
    const IconComponent =
        loanComakerTypeIcons[comakerType as keyof typeof loanComakerTypeIcons]
    const label =
        loanComakerTypeLabels[
            comakerType as keyof typeof loanComakerTypeLabels
        ] || comakerType

    return (
        <div
            className={cn(
                loanComakerTypeVariants({ variant: comakerType, size }),
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

export { loanComakerTypeVariants, iconSizeVariants }
export type LoanComakerTypeBadgeVariants = VariantProps<
    typeof loanComakerTypeVariants
>
