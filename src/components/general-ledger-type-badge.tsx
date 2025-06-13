import React from 'react'
import { cn } from '@/lib'

import { Badge } from '@/components/ui/badge'

import { GeneralLedgerTypeEnum } from '@/types/coop-types/general-ledger-definitions'

interface GeneralLedgerTypeBadgeProps {
    type: GeneralLedgerTypeEnum
    className?: string
    description?: string
}

const generalLedgerTypeStyles: Record<
    GeneralLedgerTypeEnum,
    {
        label: string
        bgColor: string
        textColor: string
    }
> = {
    [GeneralLedgerTypeEnum.Assets]: {
        label: 'Assets',
        bgColor: 'bg-emerald-500',
        textColor: 'text-emerald-50',
    },
    [GeneralLedgerTypeEnum.LiabilitiesEquityAndReserves]: {
        label: 'Liabilities/Equity',
        bgColor: 'bg-purple-600',
        textColor: 'text-purple-50',
    },
    [GeneralLedgerTypeEnum.Income]: {
        label: 'Income',
        bgColor: 'bg-teal-500',
        textColor: 'text-teal-50',
    },
    [GeneralLedgerTypeEnum.Expenses]: {
        label: 'Expenses',
        bgColor: 'bg-stone-500',
        textColor: 'text-stone-50',
    },
}

export const GeneralLedgerTypeBadge: React.FC<GeneralLedgerTypeBadgeProps> = ({
    type,
    className,
    description,
}) => {
    if (!type) return

    const { label, bgColor, textColor } = generalLedgerTypeStyles[type]

    return (
        <Badge
            className={cn(
                `py-0.1 text-[10.5px] hover:bg-black`,
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
