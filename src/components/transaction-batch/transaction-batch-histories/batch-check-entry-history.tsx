import { TransBatchHistoryTabsContentProps } from '.'
import BatchCheckEntryTable from '@/components/tables/transaction-batch-history-tables/batch-check-entry-table'

import { cn } from '@/lib'

const BatchCheckEntryHistory = ({
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
            <BatchCheckEntryTable
                className="grow"
                transactionBatchId={transactionBatchId}
            />
        </div>
    )
}

export default BatchCheckEntryHistory
