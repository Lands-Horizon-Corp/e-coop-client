import { TransBatchHistoryTabsContentProps } from '.'
import BatchBatchFundingTable from '@/components/tables/transaction-batch-history-tables/batch-batch-funding-table'

import { cn } from '@/lib'

const BatchFundingHistory = ({
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
            <BatchBatchFundingTable
                className="grow"
                transactionBatchId={transactionBatchId}
            />
        </div>
    )
}

export default BatchFundingHistory
