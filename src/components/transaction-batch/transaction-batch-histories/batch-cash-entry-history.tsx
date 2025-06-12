import BatchCashEntryTable from '@/components/tables/transaction-batch-history-tables/batch-cash-entry-table'
import { TransBatchHistoryTabsContentProps } from '.'

import { cn } from '@/lib'

const BatchCashEntryHistory = ({
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
            <BatchCashEntryTable
                className="grow"
                transactionBatchId={transactionBatchId}
            />
        </div>
    )
}

export default BatchCashEntryHistory
