import { cn } from '@/helpers/tw-utils'

import { Badge } from '@/components/ui/badge'

import { TFinancialStatementType } from '../financial-statement-definition.types'

interface FinancialStatementTypeBadgeProps {
    type: TFinancialStatementType
    className?: string
    description?: string
}

const financialStatementTypeStyles: Record<
    TFinancialStatementType,
    {
        label: string
        bgColor: string
        textColor: string
    }
> = {
    Assets: {
        label: 'Assets',
        bgColor: 'bg-emerald-500',
        textColor: 'text-emerald-50',
    },
    Liabilities: {
        label: 'Liabilities',
        bgColor: 'bg-rose-500',
        textColor: 'text-rose-50',
    },
    Equity: {
        label: 'Equity',
        bgColor: 'bg-indigo-500',
        textColor: 'text-indigo-50',
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
