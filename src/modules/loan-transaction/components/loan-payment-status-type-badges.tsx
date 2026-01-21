import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'

import {
    BankIcon,
    CalendarCheckIcon,
    ClockFillIcon,
    FaCheckIcon,
    QuestionIcon,
    TrendingUpIcon,
    UserIcon,
    Users3Icon,
    WarningIcon,
} from '../../../components/icons'
import {
    TLoanComakerType,
    TLoanOverallPaymentStatus,
    TLoanPaymentStatus,
} from '../loan-transaction.types'

const loanComakerTypeVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                none: '',
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
            md: 'size-3.5',
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

// ============================================
// LOAN PAYMENT STATUS BADGE
// ============================================

const loanPaymentStatusVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                paid: cn(
                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
                    'dark:bg-green-950 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900'
                ),
                overdue: cn(
                    'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
                    'dark:bg-red-950 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900'
                ),
                upcoming: cn(
                    'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
                    'dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900'
                ),
                advance: cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
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

interface LoanPaymentStatusBadgeProps
    extends VariantProps<typeof loanPaymentStatusVariants> {
    status: TLoanPaymentStatus
    className?: string
    showIcon?: boolean
}

const loanPaymentStatusIcons = {
    paid: FaCheckIcon,
    overdue: WarningIcon,
    upcoming: ClockFillIcon,
    advance: TrendingUpIcon,
} as const

const loanPaymentStatusLabels = {
    paid: 'Paid',
    overdue: 'Overdue',
    upcoming: 'Upcoming',
    advance: 'Advance',
} as const

export function LoanPaymentStatusBadge({
    status,
    className,
    showIcon = true,
    size = 'md',
    ...props
}: LoanPaymentStatusBadgeProps) {
    const IconComponent =
        loanPaymentStatusIcons[status as keyof typeof loanPaymentStatusIcons]
    const label =
        loanPaymentStatusLabels[
            status as keyof typeof loanPaymentStatusLabels
        ] || status

    return (
        <div
            className={cn(
                loanPaymentStatusVariants({ variant: status, size }),
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

// ============================================
// LOAN OVERALL PAYMENT STATUS BADGE
// ============================================

const loanOverallPaymentStatusVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                current: cn(
                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
                    'dark:bg-green-950 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900'
                ),
                overdue: cn(
                    'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
                    'dark:bg-red-950 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900'
                ),
                advance: cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
                ),
                mixed: cn(
                    'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
                    'dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800 dark:hover:bg-yellow-900'
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

interface LoanOverallPaymentStatusBadgeProps
    extends VariantProps<typeof loanOverallPaymentStatusVariants> {
    status: TLoanOverallPaymentStatus
    className?: string
    showIcon?: boolean
}

const loanOverallPaymentStatusIcons = {
    current: FaCheckIcon,
    overdue: WarningIcon,
    advance: TrendingUpIcon,
    mixed: CalendarCheckIcon,
} as const

const loanOverallPaymentStatusLabels = {
    current: 'Current',
    overdue: 'Overdue',
    advance: 'Advance',
    mixed: 'Mixed',
} as const

export function LoanOverallPaymentStatusBadge({
    status,
    className,
    showIcon = true,
    size = 'md',
    ...props
}: LoanOverallPaymentStatusBadgeProps) {
    const IconComponent =
        loanOverallPaymentStatusIcons[
            status as keyof typeof loanOverallPaymentStatusIcons
        ]
    const label =
        loanOverallPaymentStatusLabels[
            status as keyof typeof loanOverallPaymentStatusLabels
        ] || status

    return (
        <div
            className={cn(
                loanOverallPaymentStatusVariants({ variant: status, size }),
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

export { loanOverallPaymentStatusVariants, loanPaymentStatusVariants }
export type LoanPaymentStatusBadgeVariants = VariantProps<
    typeof loanPaymentStatusVariants
>
export type LoanOverallPaymentStatusBadgeVariants = VariantProps<
    typeof loanOverallPaymentStatusVariants
>
