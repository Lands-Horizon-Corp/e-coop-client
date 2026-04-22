import { cn } from '@/helpers'

import { Badge } from '@/components/ui/badge'

import { TGeneralLedgerSource } from '../general-ledger.types'

interface GeneralLedgerSourceBadgeProps {
    source: TGeneralLedgerSource
    className?: string
    description?: string
}

const generalLedgerSourceStyles: Record<
    TGeneralLedgerSource,
    {
        label: string
        bgColor: string
        textColor: string
    }
> = {
    withdraw: {
        label: 'Withdraw',
        bgColor: 'bg-rose-700',
        textColor: 'text-rose-50',
    },
    deposit: {
        label: 'Deposit',
        bgColor: 'bg-emerald-700',
        textColor: 'text-emerald-50',
    },
    journal: {
        label: 'Journal',
        bgColor: 'bg-blue-700',
        textColor: 'text-blue-50',
    },
    payment: {
        label: 'Payment',
        bgColor: 'bg-amber-600',
        textColor: 'text-amber-50',
    },
    adjustment: {
        label: 'Adjustment',
        bgColor: 'bg-purple-700',
        textColor: 'text-purple-50',
    },
    'journal voucher': {
        label: 'Journal Voucher',
        bgColor: 'bg-indigo-700',
        textColor: 'text-indigo-50',
    },
    'check voucher': {
        label: 'Check Voucher',
        bgColor: 'bg-slate-700',
        textColor: 'text-slate-50',
    },
    loan: {
        label: 'Loan',
        bgColor: 'bg-cyan-700',
        textColor: 'text-cyan-50',
    },
    'savings interest': {
        label: 'Savings Interest',
        bgColor: 'bg-sky-600',
        textColor: 'text-sky-50',
    },
    'mutual contribution': {
        label: 'Mutual Contribution',
        bgColor: 'bg-fuchsia-700',
        textColor: 'text-fuchsia-50',
    },
    disbursement: {
        label: 'Disbursement',
        bgColor: 'bg-teal-700',
        textColor: 'text-teal-50',
    },
    blotter: {
        label: 'Blotter',
        bgColor: 'bg-orange-700',
        textColor: 'text-orange-50',
    },
    'other fund': {
        label: 'Other Fund',
        bgColor: 'bg-zinc-700',
        textColor: 'text-zinc-50',
    },
}

export const GeneralLedgerSourceBadge = ({
    source,
    className,
    description,
}: GeneralLedgerSourceBadgeProps) => {
    const style = generalLedgerSourceStyles[source]

    if (!style) {
        return (
            <Badge
                className={cn('text-[10.5px] py-0.5', className)}
                variant="secondary"
            >
                {source}
                {description && (
                    <span className="ml-1 opacity-70">{description}</span>
                )}
            </Badge>
        )
    }

    const { label, bgColor, textColor } = style

    return (
        <Badge
            className={cn(
                'py-0.5 text-[10.5px] hover:opacity-90',
                bgColor,
                textColor,
                className
            )}
        >
            {label}
            {description && (
                <span className="ml-1 opacity-70">{description}</span>
            )}
        </Badge>
    )
}
