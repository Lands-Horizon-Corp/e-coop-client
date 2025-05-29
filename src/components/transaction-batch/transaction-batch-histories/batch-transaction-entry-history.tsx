import { TransBatchHistoryTabsContentProps } from '.'
import BatchTransactionEntryTable from '@/components/tables/transaction-batch-history-tables/batch-transaction-entry-table'

import { cn } from '@/lib'

const BatchTransactionEntryHistory = ({
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
            <BatchTransactionEntryTable
                className="grow"
                transactionBatchId={transactionBatchId}
            />
        </div>
    )
}

export default BatchTransactionEntryHistory
