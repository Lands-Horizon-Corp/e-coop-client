import { cn } from '@/helpers/tw-utils'
import { TAccountType } from '@/modules/account'

import { Badge } from '@/components/ui/badge'

interface AccountTypeBadgeProps {
    type: TAccountType
    className?: string
    description?: string
}

const AccoutTTypeStyles: Record<
    TAccountType,
    {
        label: string
        bgColor: string
        textColor: string
    }
> = {
    Deposit: {
        label: 'Deposit',
        bgColor: 'bg-blue-500',
        textColor: 'text-blue-50',
    },
    Loan: {
        label: 'Loan',
        bgColor: 'bg-purple-500',
        textColor: 'text-purple-50',
    },
    'A/R-Ledger': {
        label: 'A/R-Ledger',
        bgColor: 'bg-orange-500',
        textColor: 'text-orange-50',
    },
    'A/R-Aging': {
        label: 'A/R-Aging',
        bgColor: 'bg-destructive',
        textColor: 'text-red-50',
    },
    Fines: {
        label: 'Fines',
        bgColor: 'bg-gray-700',
        textColor: 'text-gray-50',
    },
    Interest: {
        label: 'Interest',
        bgColor: 'bg-pink-500',
        textColor: 'text-pink-50',
    },
    'SVF-Ledger': {
        label: 'SVF-Ledger',
        bgColor: 'bg-yellow-600',
        textColor: 'text-yellow-50',
    },
    'W-Off': {
        label: 'W-Off',
        bgColor: 'bg-black',
        textColor: 'text-white',
    },
    'A/P-Ledger': {
        label: 'A/P-Ledger',
        bgColor: 'bg-primary/90',
        textColor: 'text-green-50',
    },
    Other: {
        label: 'Other',
        bgColor: 'bg-gray-500',
        textColor: 'text-gray-50',
    },
}

export const AccountTypeBadge = ({
    type,
    className,
    description,
}: AccountTypeBadgeProps) => {
    const style = AccoutTTypeStyles[type] || AccoutTTypeStyles['Other']

    const { label, bgColor, textColor } = style

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
export default AccountTypeBadge
