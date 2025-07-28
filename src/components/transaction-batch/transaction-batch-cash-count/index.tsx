import { useMemo } from 'react'

import { cn } from '@/lib'

import LoadingSpinner from '@/components/spinners/loading-spinner'

import { useBillsAndCoins } from '@/hooks/api-hooks/use-bills-and-coins'
import { useCurrentBatchCashCounts } from '@/hooks/api-hooks/use-cash-count'
import { useSubscribe } from '@/hooks/use-pubsub'

import {
    ICashCount,
    ICashCountRequest,
    IClassProps,
    ITransactionBatchMinimal,
} from '@/types'

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
        data: billsAndCoins,
        isPending: isLoadingBillsAndCoins,
        refetch: refetchBillsAndCoins,
    } = useBillsAndCoins()

    useSubscribe(`bills-and-coins.update`, refetchBillsAndCoins)

    const {
        data: cashCounts,
        isPending: isLoadingCashCounts,
        refetch: refetchCashCounts,
    } = useCurrentBatchCashCounts({
        enabled: billsAndCoins.length === 0 || isLoadingBillsAndCoins,
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
                country_code: billCoin.country_code,
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
                    <LoadingSpinner />
                )}
                <BatchCashCount
                    resetOnDefaultChange
                    defaultValues={defaultValues}
                    onSuccess={(data) => {
                        onCashCountUpdate?.(data)
                        refetchBillsAndCoins()
                        refetchCashCounts()
                    }}
                />
            </div>
        </div>
    )
}

export default TransactionBatchCashCount
