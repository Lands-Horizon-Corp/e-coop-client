import { cn } from '@/helpers/tw-utils'
import { TAccountType } from '@/modules/account'
import { type VariantProps, cva } from 'class-variance-authority'

import { Badge } from '@/components/ui/badge'

const accountTypeBadgeVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors',
    {
        variants: {
            type: {
                Deposit: 'bg-blue-500 text-blue-50',
                Loan: 'bg-purple-500 text-purple-50',
                'A/R-Ledger': 'bg-orange-500 text-orange-50',
                'A/R-Aging': 'bg-destructive text-red-50',
                Fines: 'bg-gray-700 text-gray-50',
                Interest: 'bg-pink-500 text-pink-50',
                'SVF-Ledger': 'bg-yellow-600 text-yellow-50',
                'W-Off': 'bg-black text-white',
                'A/P-Ledger': 'bg-primary/90 text-green-50',
                Other: 'bg-gray-500 text-gray-50',
            },
            size: {
                default: 'py-0.5 px-2 text-[10.5px]',
                sm: 'py-0.5 px-1.5 text-[9px]',
                xs: 'rounded-sm py-0 px-1 text-[8px]',
            },
        },
        defaultVariants: {
            type: 'Other',
            size: 'default',
        },
    }
)

interface AccountTypeBadgeProps
    extends VariantProps<typeof accountTypeBadgeVariants> {
    type: TAccountType
    className?: string
    description?: string
}

export const AccountTypeBadge = ({
    type = 'Other',
    size,
    className,
    description,
}: AccountTypeBadgeProps) => {
    return (
        <Badge
            className={cn(accountTypeBadgeVariants({ type, size }), className)}
        >
            {type}
            {description && (
                <span className="ml-1 opacity-70">{description}</span>
            )}
        </Badge>
    )
}

export default AccountTypeBadge
