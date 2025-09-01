import { cn } from '@/helpers/tw-utils'
import { GeneralLedgerTypeEnum } from '@/modules/account'

import { Badge } from '@/components/ui/badge'

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
        bgColor: 'bg-emerald-700',
        textColor: 'text-emerald-50',
    },
    [GeneralLedgerTypeEnum.LiabilitiesEquityAndReserves]: {
        label: 'Liabilities, Equity & Reserves',
        bgColor: 'bg-purple-700',
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
