import { EyeIcon } from '../icons'
import { Button } from '../ui/button'
import ImageDisplay from '../image-display'
import { TransactionBatchHistoriesModal } from '../transaction-batch/transaction-batch-histories'

import { cn } from '@/lib'
import { toReadableDateTime } from '@/utils'

import { IClassProps, ITransactionBatch } from '@/types'
import { useModalState } from '@/hooks/use-modal-state'
import CopyTextButton from '../copy-text-button'
import PreviewMediaWrapper from '../wrappers/preview-media-wrapper'

interface Props extends IClassProps {
    transBatch: ITransactionBatch
}

const TransBatchTitleUserDisplay = ({ transBatch, className }: Props) => {
    const historyModal = useModalState()

    return (
        <div
            className={cn('space-y-4 rounded-xl bg-background p-4', className)}
        >
            <TransactionBatchHistoriesModal
                {...historyModal}
                transactionBatchHistoryProps={{
                    transactionBatchId: transBatch.id,
                }}
            />
            <div className="flex items-center justify-between">
                <p>{transBatch.batch_name ?? '-'}</p>
                <p className="text-xs text-muted-foreground/70">
                    {transBatch.created_at
                        ? toReadableDateTime(
                              transBatch.created_at,
                              'MM-dd-yyyy hh:mm a '
                          )
                        : 'invalid start'}{' '}
                    -{' '}
                    {transBatch.ended_at
                        ? toReadableDateTime(
                              transBatch.ended_at,
                              'MM-dd-yyyy hh:mm a '
                          )
                        : 'not ended'}
                </p>
            </div>
            <p className="!mt-0 text-xs text-muted-foreground/60">
                <span className="text-muted-foreground/40">Batch ID: </span>
                {transBatch.id ? (
                    <>
                        {transBatch.id}
                        <CopyTextButton
                            className="ml-1"
                            textContent={transBatch.id}
                        />
                    </>
                ) : (
                    '-'
                )}
            </p>
            <div className="flex items-center justify-between gap-x-2">
                <div className="flex items-center gap-x-2">
                    <PreviewMediaWrapper
                        media={transBatch?.employee_user?.media}
                    >
                        <ImageDisplay
                            className="size-8"
                            src={transBatch?.employee_user?.media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <div>
                        <p>{transBatch.employee_user?.full_name}</p>
                        <p className="text-xs text-muted-foreground/70">
                            @{transBatch.employee_user?.user_name ?? '-'}
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    onClick={() => historyModal.onOpenChange(true)}
                >
                    <EyeIcon className="mr-2" />
                    View Histories
                </Button>
            </div>
        </div>
    )
}

export default TransBatchTitleUserDisplay
