import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import { TGeneralLedgerSource } from '@/types'

import {
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    BookOpenIcon,
    CreditCardIcon,
    FileFillIcon,
    ReceiptIcon,
    SettingsIcon,
} from '../icons'

const ledgerSourceVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                withdraw: cn(
                    'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200',
                    'dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800 dark:hover:bg-rose-900'
                ),
                deposit: cn(
                    'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
                    'dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900'
                ),
                journal: cn(
                    'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200',
                    'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                ),
                payment: cn(
                    'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
                    'dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900'
                ),
                adjustment: cn(
                    'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200',
                    'dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800 dark:hover:bg-violet-900'
                ),
                'journal voucher': cn(
                    'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
                    'dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-900'
                ),
                'check voucher': cn(
                    'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200',
                    'dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800 dark:hover:bg-teal-900'
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

interface LedgerSourceBadgeProps
    extends VariantProps<typeof ledgerSourceVariants> {
    source: TGeneralLedgerSource
    className?: string
    showIcon?: boolean
    showValue?: boolean
}

export function LedgerSourceBadge({
    source,
    className,
    showIcon = true,
    size = 'md',
    showValue = true,
    ...props
}: LedgerSourceBadgeProps) {
    const getSourceIcon = (source: TGeneralLedgerSource) => {
        const icons = {
            withdraw: ArrowDownLeftIcon,
            deposit: ArrowUpRightIcon,
            journal: BookOpenIcon,
            payment: CreditCardIcon,
            adjustment: SettingsIcon,
            'journal voucher': FileFillIcon,
            'check voucher': ReceiptIcon,
        }
        return icons[source]
    }

    const IconComponent = getSourceIcon(source)

    return (
        <div
            className={cn(
                ledgerSourceVariants({
                    variant: source,
                    size,
                }),
                'rounded-full',
                className
            )}
            {...props}
        >
            {showIcon && IconComponent && (
                <IconComponent className={iconSizeVariants({ size })} />
            )}
            {showValue && <span className="truncate capitalize">{source}</span>}
        </div>
    )
}

export { ledgerSourceVariants, iconSizeVariants }
export type LedgerSourceBadgeVariants = VariantProps<
    typeof ledgerSourceVariants
>
