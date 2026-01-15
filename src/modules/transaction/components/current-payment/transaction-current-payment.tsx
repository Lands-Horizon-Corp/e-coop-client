import { useCallback } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { currencyFormat } from '@/modules/currency'
import { useGetAllGeneralLedger } from '@/modules/general-ledger'

import CopyTextButton from '@/components/copy-text-button'
import { RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { TEntityId } from '@/types'

import { ITransaction } from '../..'
import TransactionHistory from '../history'
import TransactionCurrentPaymentItem from './transaction-current-payment-item'

type itemgBadgeTypeProps = {
    text: string
    type?:
        | 'default'
        | 'success'
        | 'warning'
        | 'secondary'
        | 'destructive'
        | 'outline'
        | null
        | undefined
    className?: string
}

type CurrentPaymentsEntryListProps = {
    transactionId: TEntityId
    transaction: ITransaction
    totalAmount?: number
    fullPath: string
}
const TransactionCurrentPaymentEntry = ({
    fullPath,
    transactionId,
    transaction,
    totalAmount,
}: CurrentPaymentsEntryListProps) => {
    const {
        data: generalLedgerBasedTransaction,
        isLoading,
        isError,
        isSuccess,
        isRefetching,
        refetch: refetchGeneralLedger,
    } = useGetAllGeneralLedger({
        transactionId,
        mode: 'transaction',
        options: {
            retry: 0,
            enabled: !!transactionId,
        },
    })

    const handleError = useCallback((error: Error) => {
        toast.error(error?.message || 'Something went wrong')
    }, [])

    useQeueryHookCallback({
        data: generalLedgerBasedTransaction,
        error: handleError,
        isError: isError,
        isSuccess: isSuccess,
    })

    return (
        <div className="flex min-h-[100%] h-fit flex-col gap-y-2 mb-2 p-4 overflow-hidden  rounded-2xl bg-card">
            <div className="flex items-center gap-x-2">
                <div className=" flex-grow rounded-xl py-2">
                    <div className="flex items-center justify-between gap-x-2">
                        <div className="flex items-center gap-x-2">
                            <TransactionHistory fullPath={fullPath} />
                            <p className="text-sm font-bold uppercase text-muted-foreground">
                                Total Amount
                            </p>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <p className="text-lg font-bold text-primary dark:text-primary">
                                {currencyFormat(totalAmount || 0, {
                                    currency: transaction?.currency,
                                    showSymbol: !!transaction?.currency,
                                })}
                            </p>
                            <Button
                                disabled={isRefetching}
                                onClick={() => refetchGeneralLedger()}
                                size="icon-sm"
                                variant="ghost"
                            >
                                {isRefetching ? (
                                    <LoadingSpinner />
                                ) : (
                                    <RefreshIcon />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Separator /> */}
            <TransactionCurrentPaymentItem
                currentPayment={generalLedgerBasedTransaction || []}
                handleRefetchTransaction={() => refetchGeneralLedger()}
                isLoading={isLoading}
            />
        </div>
    )
}

type PaymentsEntryItemProps = {
    icon?: React.ReactNode
    label?: string
    value?: string
    className?: string
    badge?: itemgBadgeTypeProps
    copyText?: string
    labelClassName?: string
    valueClassName?: string
}

export const PaymentsEntryItem = ({
    icon,
    label,
    value,
    className,
    badge,
    copyText,
    labelClassName,
    valueClassName,
}: PaymentsEntryItemProps) => {
    return (
        <div className={cn('my-1 flex w-full flex-grow', className)}>
            <div className="flex gap-x-2">
                <span className="text-muted-foreground">{icon}</span>
                <p
                    className={cn(
                        'text-xs text-muted-foreground',
                        labelClassName
                    )}
                >
                    {label}
                </p>
            </div>
            <div className="grow gap-x-2 text-end text-sm ">
                <span className={cn('text-sm ', valueClassName)}>{value}</span>
                {badge && (
                    <Badge
                        className={cn('', badge.className)}
                        variant={badge.type || 'default'}
                    >
                        {badge.text}
                    </Badge>
                )}
                {copyText && (
                    <CopyTextButton
                        className="ml-2"
                        textContent={value ?? ''}
                    />
                )}
            </div>
        </div>
    )
}

export default TransactionCurrentPaymentEntry
