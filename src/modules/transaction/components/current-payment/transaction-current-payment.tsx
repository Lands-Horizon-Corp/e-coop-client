import { useCallback, useState } from 'react'

import { toast } from 'sonner'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import { cn } from '@/helpers'
import { currencyFormat } from '@/modules/currency'
import { useFilteredPaginatedGeneralLedger } from '@/modules/general-ledger'
import { PaginationState } from '@tanstack/react-table'

import CopyTextButton from '@/components/copy-text-button'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import { Badge } from '@/components/ui/badge'

import useFilterState from '@/hooks/use-filter-state'
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
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: 20,
    })
    const { sortingStateBase64 } = useDataTableSorting()

    const { finalFilterPayloadBase64 } = useFilterState({
        defaultFilterMode: 'OR',
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const {
        data: generalLedgerBasedTransaction,
        isLoading,
        isFetching,
        isError,
        isSuccess,
    } = useFilteredPaginatedGeneralLedger({
        transactionId,
        mode: 'transaction',
        options: {
            retry: 0,
        },
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: finalFilterPayloadBase64,
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

    const hasPayments =
        generalLedgerBasedTransaction &&
        generalLedgerBasedTransaction?.data?.length > 0

    return (
        <div className="flex min-h-[100%] h-fit flex-col gap-y-2 p-4 overflow-hidden  rounded-2xl bg-card">
            <div className="flex items-center gap-x-2">
                <div className=" flex-grow rounded-xl py-2">
                    <div className="flex items-center justify-between gap-x-2">
                        <div className="flex items-center gap-x-2">
                            <TransactionHistory fullPath={fullPath} />
                            <p className="text-sm font-bold uppercase text-muted-foreground">
                                Total Amount
                            </p>
                        </div>
                        <p className="text-lg font-bold text-primary dark:text-primary">
                            {currencyFormat(totalAmount || 0, {
                                currency: transaction?.currency,
                                showSymbol: !!transaction?.currency,
                            })}
                        </p>
                    </div>
                </div>
            </div>
            {/* <Separator /> */}
            <TransactionCurrentPaymentItem
                currentPayment={generalLedgerBasedTransaction?.data || []}
                hasPayments={hasPayments}
                isLoading={isLoading}
            />
            <MiniPaginationBar
                disablePageMove={isFetching}
                onNext={({ pageIndex }) =>
                    setPagination((prev) => ({ ...prev, pageIndex }))
                }
                onPrev={({ pageIndex }) =>
                    setPagination((prev) => ({ ...prev, pageIndex }))
                }
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalPage: generalLedgerBasedTransaction?.totalPage || 0,
                    totalSize: generalLedgerBasedTransaction?.totalSize || 0,
                }}
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
