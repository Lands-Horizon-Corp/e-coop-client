import { cn } from '@/helpers/tw-utils'
import { FinancialStatementTypeEnum } from '@/modules/account'

import { Badge } from '@/components/ui/badge'

interface FinancialStatementTypeBadgeProps {
    type: FinancialStatementTypeEnum
    className?: string
    description?: string
}

const financialStatementTypeStyles: Record<
    FinancialStatementTypeEnum,
    {
        label: string
        bgColor: string
        textColor: string
    }
> = {
    [FinancialStatementTypeEnum.Assets]: {
        label: 'Assets',
        bgColor: 'bg-emerald-500',
        textColor: 'text-emerald-50',
    },
    [FinancialStatementTypeEnum.Liabilities]: {
        label: 'Liabilities',
        bgColor: 'bg-rose-500',
        textColor: 'text-rose-50',
    },
    [FinancialStatementTypeEnum.Equity]: {
        label: 'Equity',
        bgColor: 'bg-indigo-500',
        textColor: 'text-indigo-50',
    },
    [FinancialStatementTypeEnum.Revenue]: {
        label: 'Revenue',
        bgColor: 'bg-teal-500',
        textColor: 'text-teal-50',
    },
    [FinancialStatementTypeEnum.Expenses]: {
        label: 'Expenses',
        bgColor: 'bg-stone-500',
        textColor: 'text-stone-50',
    },
}

export const FinancialStatementTypeBadge = ({
    type,
    className,
    description,
}: FinancialStatementTypeBadgeProps) => {
    const { label, bgColor, textColor } = financialStatementTypeStyles[type]

    const hover = `hover:${bgColor}`

    return (
        <Badge
            className={cn(
                `py-0.1 text-[10.5px]`,
                bgColor,
                textColor,
                hover,
                className
            )}
        >
            {label}
            {description}
        </Badge>
    )
}
