import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib'
import React from 'react'

type Status = 'pending' | 'reported' | 'accepted' | 'ban'

interface StatusBadgeProps {
    status: Status
    className?: string
}

const statusStyles: Record<
    Status,
    {
        label: string
        variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    }
> = {
    pending: { label: 'Pending', variant: 'secondary' },
    reported: { label: 'Reported', variant: 'destructive' },
    accepted: { label: 'Accepted', variant: 'default' },
    ban: { label: 'Banned', variant: 'outline' },
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    className,
}) => {
    const { label, variant } = statusStyles[status]

    return (
        <Badge className={cn('', className)} variant={variant}>
            {label}
        </Badge>
    )
}
