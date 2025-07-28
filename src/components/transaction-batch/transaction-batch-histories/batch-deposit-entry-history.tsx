import { cn } from '@/lib'

import BatchDepositEntryTable from '@/components/tables/transaction-batch-history-tables/batch-deposit-entry-table'

import { TransBatchHistoryTabsContentProps } from '.'

const BatchDepositEntryHistory = ({
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
            <BatchDepositEntryTable
                className="grow"
                transactionBatchId={transactionBatchId}
            />
        </div>
    )
}

export default BatchDepositEntryHistory
