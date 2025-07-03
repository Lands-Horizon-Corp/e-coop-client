import { cn } from '@/lib'
import { ComputationTypeEnum } from '@/types/coop-types/accounts/account'

import { Badge } from '@/components/ui/badge'

interface ComputationTypeBadgeProps {
    type: ComputationTypeEnum
    className?: string
    description?: string
}

const computationTypeStyles: Record<
    ComputationTypeEnum,
    {
        label: string
        bgColor: string
        textColor: string
    }
> = {
    [ComputationTypeEnum.Straight]: {
        label: 'Straight',
        bgColor: 'bg-blue-800',
        textColor: 'text-blue-50',
    },
    [ComputationTypeEnum.Diminishing]: {
        label: 'Diminishing',
        bgColor: 'bg-red-600',
        textColor: 'text-red-50',
    },
    [ComputationTypeEnum.DiminishingAddOn]: {
        label: 'Diminishing Add-On',
        bgColor: 'bg-green-800',
        textColor: 'text-green-50',
    },
    [ComputationTypeEnum.DiminishingYearly]: {
        label: 'Diminishing Yearly',
        bgColor: 'bg-yellow-600',
        textColor: 'text-yellow-50',
    },
    [ComputationTypeEnum.DiminishingStraight]: {
        label: 'Diminishing Straight',
        bgColor: 'bg-indigo-600',
        textColor: 'text-indigo-50',
    },
    [ComputationTypeEnum.DiminishingQuarterly]: {
        label: 'Diminishing Quarterly',
        bgColor: 'bg-fuchsia-800',
        textColor: 'text-fuchsia-50',
    },
}

export const ComputationTypeBadge = ({
    type,
    className,
    description,
}: ComputationTypeBadgeProps) => {
    const { label, bgColor, textColor } = computationTypeStyles[type]
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
            {description && (
                <span className="ml-1 opacity-70">{description}</span>
            )}
        </Badge>
    )
}
