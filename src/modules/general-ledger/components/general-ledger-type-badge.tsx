import { cn } from '@/helpers/tw-utils'

import { Badge } from '@/components/ui/badge'

import { TGeneralLedgerType } from '../general-ledger.types'

interface GeneralLedgerTypeBadgeProps {
    type: TGeneralLedgerType
    className?: string
    description?: string
}

const generalLedgerTypeStyles: Record<
    TGeneralLedgerType,
    {
        label: string
        bgColor: string
        textColor: string
    }
> = {
    Assets: {
        label: 'Assets',
        bgColor: 'bg-emerald-700',
        textColor: 'text-emerald-50',
    },
    Liabilities: {
        label: 'Liabilities',
        bgColor: 'bg-rose-700',
        textColor: 'text-rose-50',
    },
    Equity: {
        label: 'Liabilities, Equity & Reserves',
        bgColor: 'bg-purple-700',
        textColor: 'text-purple-50',
    },
    Revenue: {
        label: 'Revenue',
        bgColor: 'bg-primary',
        textColor: 'text-primary',
    },
    Expenses: {
        label: 'Expenses',
        bgColor: 'bg-stone-500',
        textColor: 'text-stone-50',
    },
}

export const GeneralLedgerTypeBadge = ({
    type,
    className,
    description,
}: GeneralLedgerTypeBadgeProps) => {
    if (generalLedgerTypeStyles[type] === undefined) {
        return null
    }
    const { label, bgColor, textColor } = generalLedgerTypeStyles[type]
    const hover = `hover:${bgColor}`
    return (
        <Badge
            className={cn(
                `py-0.1 text-[10.5px] hover:bg-transparent`,
                bgColor,
                textColor,
                hover,
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
