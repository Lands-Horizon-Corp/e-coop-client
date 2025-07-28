import { cn } from '@/lib'

import BatchOnlineEntryTable from '@/components/tables/transaction-batch-history-tables/batch-online-entry-table'

import { TransBatchHistoryTabsContentProps } from '.'

const BatchOnlineEntryHistory = ({
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
            <BatchOnlineEntryTable
                className="grow"
                transactionBatchId={transactionBatchId}
            />
        </div>
    )
}

export default BatchOnlineEntryHistory
