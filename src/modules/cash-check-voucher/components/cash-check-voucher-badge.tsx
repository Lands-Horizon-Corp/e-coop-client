import { cn } from '@/helpers/tw-utils'

import { Badge } from '@/components/ui/badge'

export type CashCheckVoucherStatus =
    | 'pending'
    | 'printed'
    | 'approved'
    | 'released'

interface CashCheckVoucherStatusBadgeProps {
    status: CashCheckVoucherStatus
    className?: string
}

const statusStyles: Record<
    CashCheckVoucherStatus,
    {
        label: string
        bgColor: string
        textColor: string
    }
> = {
    pending: {
        label: 'Pending',
        bgColor: 'bg-gray-500',
        textColor: 'text-white',
    },
    printed: {
        label: 'Printed',
        bgColor: 'bg-yellow-500',
        textColor: 'text-white',
    },
    approved: {
        label: 'Approved',
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
    },
    released: {
        label: 'Released',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
    },
}

export const CashCheckVoucherStatusBadge = ({
    status,
    className,
}: CashCheckVoucherStatusBadgeProps) => {
    if (statusStyles[status] === undefined) {
        return null
    }

    const { label, bgColor, textColor } = statusStyles[status]
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
        </Badge>
    )
}
