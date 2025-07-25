import { cn } from '@/lib'
import { formatNumber, toReadableDateTime } from '@/utils'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, ITransactionBatch } from '@/types'

import CopyTextButton from '../copy-text-button'
import ImageNameDisplay from '../elements/image-name-display'
import { LayersSharpDotIcon } from '../icons'
import { Button } from '../ui/button'
import { TransactionBatchHistoriesModal } from './transaction-batch-histories'
import { BatchBlotterQuickViewModal } from './transaction-batch-quick-view'
import TransactionBatchStatusIndicator from './transaction-batch-status-indicator'

interface Props extends IClassProps {
    transactionBatch: ITransactionBatch
}

const TransactionBatchMiniViewCard = ({
    transactionBatch,
    className,
}: Props) => {
    const historyModal = useModalState()
    const summaryModal = useModalState()

    return (
        <div
            className={cn(
                'relative w-full rounded-xl border border-dashed bg-secondary p-2 dark:bg-background',
                className
            )}
        >
            <BatchBlotterQuickViewModal
                {...summaryModal}
                batchBlotterProps={{
                    transBatch: transactionBatch,
                }}
            />
            <TransactionBatchHistoriesModal
                {...historyModal}
                transactionBatchHistoryProps={{
                    transactionBatchId: transactionBatch.id,
                }}
            />
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                    <LayersSharpDotIcon className="mr-1 inline" />
                    <p>{transactionBatch.batch_name}</p>
                    <TransactionBatchStatusIndicator
                        className="mx-2"
                        transBatch={transactionBatch}
                    />
                    <CopyTextButton
                        successText="Transaction batch ID copied."
                        textContent={transactionBatch.id}
                    />
                </div>
                <div className="flex items-center gap-x-1">
                    <Button
                        size="sm"
                        type="button"
                        hoverVariant="primary"
                        className="size-fit bg-primary p-2 text-xs text-primary-foreground dark:bg-secondary dark:text-secondary-foreground"
                        onClick={() => summaryModal.onOpenChange(true)}
                    >
                        Summary
                    </Button>
                    <Button
                        size="sm"
                        type="button"
                        hoverVariant="primary"
                        className="size-fit bg-primary p-2 text-xs text-primary-foreground dark:bg-secondary dark:text-secondary-foreground"
                        onClick={() => historyModal.onOpenChange(true)}
                    >
                        History
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-4 py-2 text-sm">
                <div>
                    <p>
                        {formatNumber(
                            transactionBatch.total_supposed_remitance,
                            2
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground/70">Supposed</p>
                </div>
                <div>
                    <p>
                        {formatNumber(
                            transactionBatch.total_actual_remittance,
                            2
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground/70">Actual</p>
                </div>
                <div>
                    <p>
                        {formatNumber(
                            transactionBatch.total_actual_supposed_comparison,
                            2
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                        Comparison
                    </p>
                </div>
                <div>
                    <ImageNameDisplay
                        name={transactionBatch?.employee_user?.full_name}
                        src={
                            transactionBatch?.employee_user?.media?.download_url
                        }
                    />
                    <p className="text-xs text-muted-foreground/70">
                        Employee / Teller
                    </p>
                </div>
            </div>
            <p className="absolute -top-5 right-0 text-left text-xs text-muted-foreground/80">
                {toReadableDateTime(
                    transactionBatch.created_at,
                    'M/d/yyyy hh:mm a'
                )}{' '}
                -{' '}
                {transactionBatch.ended_at
                    ? toReadableDateTime(
                          transactionBatch.ended_at,
                          'M/d/yyyy hh:mm a'
                      )
                    : '-'}
            </p>
        </div>
    )
}

export default TransactionBatchMiniViewCard
