import { toReadableDate } from '@/helpers/date-utils'
import { AlertTriangle } from 'lucide-react'

import { TEntityId } from '@/types'

const TransactionBatchDayMismatchDisplay = ({
    transactionBatchDate,
    batchId,
}: {
    batchId: TEntityId
    transactionBatchDate: string
}) => {
    return (
        <div className="rounded-lg bg-destructive/10 p-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="space-y-2 text-center sm:text-left">
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <p className="font-semibold text-destructive">
                            Batch Date Mismatch
                        </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Your current transaction batch was opened on{' '}
                        <span className="font-medium text-foreground">
                            {toReadableDate(transactionBatchDate)}
                        </span>{' '}
                        but does not match today&apos;s date . Please close this
                        batch before continuing.
                    </p>

                    {batchId && (
                        <p className="text-xs text-muted-foreground">
                            Batch: <span className="font-mono">{batchId}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TransactionBatchDayMismatchDisplay
