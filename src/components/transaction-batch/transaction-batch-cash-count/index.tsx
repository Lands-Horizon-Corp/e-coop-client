import { useMemo } from 'react'

import BatchCashCount from './batch-cash-count'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib'
import { useBillsAndCoins } from '@/hooks/api-hooks/use-bills-and-coins'
import { useCurrentBatchCashCounts } from '@/hooks/api-hooks/use-cash-count'

import {
    IClassProps,
    ICashCountRequest,
    ITransactionBatchMinimal,
} from '@/types'

interface Props extends IClassProps {
    transactionBatch: ITransactionBatchMinimal
}

const TransactionBatchCashCount = ({ className, transactionBatch }: Props) => {
    const { data: billsAndCoins, isPending: isLoadingBillsAndCoins } =
        useBillsAndCoins()

    const { data: cashCounts, isPending: isLoadingCashCounts } =
        useCurrentBatchCashCounts({
            enabled: billsAndCoins.length === 0 || isLoadingBillsAndCoins,
        })

    const mergedCashCountBillsAndCoins: ICashCountRequest[] = useMemo(() => {
        if (
            billsAndCoins.length === 0 ||
            isLoadingBillsAndCoins ||
            isLoadingCashCounts
        )
            return []

        return billsAndCoins.map((billCoin) => {
            const findCashCountByBill = cashCounts.find(
                (cashCount) => cashCount.bill_amount === billCoin.value
            )

            return {
                country_code: billCoin.country_code,
                bill_amount: billCoin.value,
                amount: '' as unknown as number,
                quantity: '' as unknown as number,
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
                />
            </div>
        </div>
    )
}

export default TransactionBatchCashCount
