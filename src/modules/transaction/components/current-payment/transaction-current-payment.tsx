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

import { useTransactionContext } from '../../context/transaction-context'
import { useHotkeysTransaction } from '../../hooks/use-transaction-hot-keys'
import TransactionForm from '../forms/transaction-form'
import TransactionHistory from '../history'
import TransactionModalSuccessPayment from '../modals/transaction-modal-success-payment'
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

const TransactionCurrentPaymentEntry = () => {
    const { transaction, transactionId, accountPicker } =
        useTransactionContext()

    const totalAmount = transaction?.amount

    useHotkeysTransaction()

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
        <div className="flex min-h-full h-fit flex-col gap-y-2 mb-2 p-4 overflow-hidden rounded-2xl bg-card/50">
            <TransactionModalSuccessPayment
                onOpenPicker={() => {
                    accountPicker.onOpenChange(true)
                }}
            />

            <div className="flex space-x-2">
                <div className="flex gap-1 bg-linear-to-br from-primary/10 to-background border border-primary/10  rounded-lg p-2">
                    <TransactionForm />
                    <Button
                        disabled={isRefetching}
                        onClick={(e) => {
                            e.preventDefault()
                            refetchGeneralLedger()
                        }}
                        size="icon-sm"
                        variant="ghost"
                    >
                        {isRefetching ? <LoadingSpinner /> : <RefreshIcon />}
                    </Button>
                    <TransactionHistory />
                </div>
                <div className="flex-1 flex py-5 flex-col min-w-[8rem] items-center justify-center bg-linear-to-br from-primary/10 to-background/10 border border-primary/10 rounded-lg h-full w-full gap-x-1">
                    <p className="text-xs font-bold uppercase text-muted-foreground">
                        Total Amount
                    </p>
                    <p className="text-lg font-bold text-primary dark:text-primary">
                        {currencyFormat(totalAmount || 0, {
                            currency: transaction?.currency,
                            showSymbol: !!transaction?.currency,
                        })}
                    </p>
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
        <div className={cn('my-1 flex w-full grow', className)}>
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
