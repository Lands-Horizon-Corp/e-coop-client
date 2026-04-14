import { cn } from '@/helpers/tw-utils'
import { TGeneralLedgerSource } from '@/modules/general-ledger'
import { type VariantProps, cva } from 'class-variance-authority'

import {
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    BankIcon,
    BookOpenIcon,
    CreditCardIcon,
    FileFillIcon,
    LayersIcon,
    QuestionIcon,
    ReceiptIcon,
    SettingsIcon,
    TrendingUpIcon,
    Users3Icon,
    WalletIcon,
} from '../../../components/icons'

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
                loan: cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
                ),
                'savings interest': cn(
                    'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200',
                    'dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800 dark:hover:bg-sky-900'
                ),
                'mutual contribution': cn(
                    'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-200',
                    'dark:bg-fuchsia-950 dark:text-fuchsia-300 dark:border-fuchsia-800 dark:hover:bg-fuchsia-900'
                ),
                disbursement: cn(
                    'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200',
                    'dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800 dark:hover:bg-cyan-900'
                ),
                blotter: cn(
                    'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
                    'dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900'
                ),
                'other fund': cn(
                    'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200',
                    'dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700'
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

interface LedgerSourceBadgeProps extends VariantProps<
    typeof ledgerSourceVariants
> {
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
        const icons: Record<TGeneralLedgerSource, React.ElementType> = {
            withdraw: ArrowDownLeftIcon,
            deposit: ArrowUpRightIcon,
            journal: BookOpenIcon,
            payment: CreditCardIcon,
            adjustment: SettingsIcon,
            'journal voucher': FileFillIcon,
            'check voucher': ReceiptIcon,
            // Added the missing mappings:
            loan: BankIcon,
            'savings interest': TrendingUpIcon,
            'mutual contribution': Users3Icon,
            disbursement: WalletIcon,
            blotter: LayersIcon,
            'other fund': QuestionIcon,
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
