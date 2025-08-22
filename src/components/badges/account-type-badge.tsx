import { cn } from '@/helpers/tw-utils'
import { AccountTypeEnum } from '@/modules/account'

import { Badge } from '@/components/ui/badge'

interface AccountTypeBadgeProps {
    type: AccountTypeEnum
    className?: string
    description?: string
}

const AccoutTTypeStyles: Record<
    AccountTypeEnum,
    {
        label: string
        bgColor: string
        textColor: string
    }
> = {
    [AccountTypeEnum.Deposit]: {
        label: 'Deposit',
        bgColor: 'bg-blue-500',
        textColor: 'text-blue-50',
    },
    [AccountTypeEnum.Loan]: {
        label: 'Loan',
        bgColor: 'bg-purple-500',
        textColor: 'text-purple-50',
    },
    [AccountTypeEnum.ARLedger]: {
        label: 'A/R-Ledger',
        bgColor: 'bg-orange-500',
        textColor: 'text-orange-50',
    },
    [AccountTypeEnum.ARAging]: {
        label: 'A/R-Aging',
        bgColor: 'bg-red-500',
        textColor: 'text-red-50',
    },
    [AccountTypeEnum.Fines]: {
        label: 'Fines',
        bgColor: 'bg-gray-700',
        textColor: 'text-gray-50',
    },
    [AccountTypeEnum.Interest]: {
        label: 'Interest',
        bgColor: 'bg-pink-500',
        textColor: 'text-pink-50',
    },
    [AccountTypeEnum.SVFLedger]: {
        label: 'SVF-Ledger',
        bgColor: 'bg-yellow-600',
        textColor: 'text-yellow-50',
    },
    [AccountTypeEnum.WOff]: {
        label: 'W-Off',
        bgColor: 'bg-black',
        textColor: 'text-white',
    },
    [AccountTypeEnum.APLedger]: {
        label: 'A/P-Ledger',
        bgColor: 'bg-green-700',
        textColor: 'text-green-50',
    },
    [AccountTypeEnum.Other]: {
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
    const style =
        AccoutTTypeStyles[type] || AccoutTTypeStyles[AccountTypeEnum.Other]

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
