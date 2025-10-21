import { useMemo } from 'react'

import { cn } from '@/helpers'
import { useGetAllBillsAndCoins } from '@/modules/bill-and-coins'
import { ICashCount, ICashCountRequest } from '@/modules/cash-count'
import { useCurrentBatchCashCounts } from '@/modules/transaction-batch/transaction-batch.service'
import { ITransactionBatchMinimal } from '@/modules/transaction-batch/transaction-batch.types'

import LoadingSpinner from '@/components/spinners/loading-spinner'

import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps } from '@/types'

import BatchCashCount from './batch-cash-count'

interface Props extends IClassProps {
    transactionBatch: ITransactionBatchMinimal
    onCashCountUpdate?: (data: ICashCount[]) => void
}

const TransactionBatchCashCount = ({
    className,
    transactionBatch,
    onCashCountUpdate,
}: Props) => {
    const {
        data: billsAndCoins = [],
        isPending: isLoadingBillsAndCoins,
        refetch: refetchBillsAndCoins,
    } = useGetAllBillsAndCoins()

    useSubscribe(`bills-and-coins.update`, refetchBillsAndCoins)

    const {
        data: cashCounts = [],
        isPending: isLoadingCashCounts,
        refetch: refetchCashCounts,
    } = useCurrentBatchCashCounts({
        options: {
            enabled: billsAndCoins.length === 0 || isLoadingBillsAndCoins,
        },
    })

    useSubscribe(
        `cash-count.transaction-batch.${transactionBatch?.id}.update`,
        refetchCashCounts
    )

    const mergedCashCountBillsAndCoins: ICashCountRequest[] = useMemo(() => {
        if (
            billsAndCoins.length === 0 ||
            isLoadingBillsAndCoins ||
            isLoadingCashCounts
        )
            return []

        return billsAndCoins.map((billCoin) => {
            const findCashCountByBill = cashCounts.find(
                (cashCount) => cashCount.name === billCoin.name
            )

            return {
                currency: billCoin.currency,
                currency_id: billCoin.currency_id,
                bill_amount: billCoin.value,
                amount: '' as unknown as number,
                quantity: '' as unknown as number,
                name: billCoin.name,
                transaction_batch_id: transactionBatch?.id,
                employee_user_id: transactionBatch?.employee_user_id,
                organization_id: transactionBatch?.organization_id,
                ...findCashCountByBill,
            }
        })
    }, [
        cashCounts,
        billsAndCoins,
        isLoadingCashCounts,
        isLoadingBillsAndCoins,
        transactionBatch?.id,
        transactionBatch?.employee_user_id,
        transactionBatch?.organization_id,
    ])

    const isLoading = isLoadingBillsAndCoins || isLoadingCashCounts

    const defaultValues = useMemo(() => {
        return {
            grand_total: transactionBatch?.grand_total,
            cash_counts: mergedCashCountBillsAndCoins,
            deposit_in_bank: transactionBatch?.deposit_in_bank,
            cash_count_total: transactionBatch?.cash_count_total,
            deleted_cash_counts: cashCounts
                .filter(
                    (cashCount) =>
                        !billsAndCoins.some(
                            (billCoin) =>
                                billCoin.value === cashCount.bill_amount
                        )
                )
                .map((cashCount) => cashCount.id),
        }
    }, [
        transactionBatch?.grand_total,
        transactionBatch?.deposit_in_bank,
        transactionBatch?.cash_count_total,
        mergedCashCountBillsAndCoins,
        cashCounts,
        billsAndCoins,
    ])

    return (
        <div className={cn('relative space-y-2', className)}>
            <p className="text-lg">Cash Count</p>
            <div>
                {mergedCashCountBillsAndCoins.length === 0 && isLoading && (
                    <LoadingSpinner className="mx-auto my-4" />
                )}
                <BatchCashCount
                    currency={transactionBatch.currency}
                    defaultValues={defaultValues}
                    onSuccess={(data) => {
                        onCashCountUpdate?.(data)
                        refetchBillsAndCoins()
                        refetchCashCounts()
                    }}
                    resetOnDefaultChange
                />
            </div>
        </div>
    )
}

export default TransactionBatchCashCount
