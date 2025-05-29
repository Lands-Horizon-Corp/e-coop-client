import BatchWithdrawalEntryTable from '@/components/tables/transaction-batch-history-tables/batch-withdrawal-entry-table'
import { TransBatchHistoryTabsContentProps } from '.'

import { cn } from '@/lib'

const BatchWithdrawalEntryHistory = ({
    transactionBatchId,
    className,
}: TransBatchHistoryTabsContentProps) => {
    return (
        <div
            className={cn(
                'flex min-h-[94%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                className
            )}
        >
            <BatchWithdrawalEntryTable
                className="grow"
                transactionBatchId={transactionBatchId}
            />
        </div>
    )
}

export default BatchWithdrawalEntryHistory
