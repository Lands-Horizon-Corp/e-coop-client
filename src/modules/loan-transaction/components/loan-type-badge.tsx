import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'

import {
    BankIcon,
    FileFillIcon,
    QuestionIcon,
    RefreshIcon,
    RotateRightIcon,
} from '../../../components/icons'
import { TLoanType } from '../loan-transaction.types'

const loanTypeVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                standard: cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
                ),
                restructured: cn(
                    'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
                    'dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900'
                ),
                'standard previous': cn(
                    'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
                    'dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900'
                ),
                renewal: cn(
                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
                    'dark:bg-green-950 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900'
                ),
                'renewal without deduction': cn(
                    'bg-teal-100 text-primary/60 border-teal-200 hover:bg-teal-200',
                    'dark:bg-teal-950 dark:text-primary dark:border-teal-800 dark:hover:bg-teal-900'
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

interface LoanTypeBadgeProps extends VariantProps<typeof loanTypeVariants> {
    loanType: TLoanType
    className?: string
    showIcon?: boolean
}

const loanTypeIcons = {
    standard: BankIcon,
    restructured: RotateRightIcon,
    'standard previous': FileFillIcon,
    renewal: RefreshIcon,
    'renewal without deduction': RefreshIcon,
} as const

const loanTypeLabels = {
    standard: 'Standard',
    restructured: 'Restructured',
    'standard previous': 'Standard Previous',
    renewal: 'Renewal',
    'renewal without deduction': 'Renewal w/o Deduction',
} as const

export function LoanTypeBadge({
    loanType,
    className,
    showIcon = true,
    size = 'md',
    ...props
}: LoanTypeBadgeProps) {
    const IconComponent = loanTypeIcons[loanType as keyof typeof loanTypeIcons]
    const label =
        loanTypeLabels[loanType as keyof typeof loanTypeLabels] || loanType

    return (
        <div
            className={cn(
                loanTypeVariants({ variant: loanType, size }),
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
            <span className="truncate">{label}</span>
        </div>
    )
}

export { loanTypeVariants, iconSizeVariants }
export type LoanTypeBadgeVariants = VariantProps<typeof loanTypeVariants>
