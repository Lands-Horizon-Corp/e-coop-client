import { cn } from '@/helpers'
import BatchBatchFundingTable from '@/modules/batch-funding/components/batch-batch-funding-table'

import { ITransBatchHistoryTabsContentProps } from '.'

const BatchFundingHistory = ({
    transactionBatchId,
    className,
}: ITransBatchHistoryTabsContentProps) => {
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
