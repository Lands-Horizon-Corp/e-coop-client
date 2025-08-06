import React from 'react'

import { cn } from '@/lib/utils'

import { TPaymentSource } from '@/types'

import { Badge } from '../ui/badge'

interface TransactionTypeBadgeProps {
    transactionType: TPaymentSource
    className?: string
}

const transactionTypeStyles: Record<
    TPaymentSource,
    {
        label: string
        variant:
            | 'default'
            | 'success'
            | 'warning'
            | 'secondary'
            | 'destructive'
            | 'outline'
    }
> = {
    withdraw: { label: 'Withdrawal', variant: 'destructive' },
    deposit: { label: 'Deposit', variant: 'success' },
    journal: { label: 'Journal', variant: 'secondary' },
    payment: { label: 'Payment', variant: 'default' },
    adjustment: { label: 'Adjustment', variant: 'warning' },
    check: { label: 'Journal Voucher', variant: 'secondary' },
    voucher: { label: 'Check Voucher', variant: 'outline' },
}

export const TransactionTypeBadge: React.FC<TransactionTypeBadgeProps> = ({
    transactionType,
    className,
}) => {
    const { label, variant } = transactionTypeStyles[transactionType]

    return (
        <Badge className={cn('', className)} variant={variant}>
            {label}
        </Badge>
    )
}
