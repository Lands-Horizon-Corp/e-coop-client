import { cn } from '@/helpers'
import { toReadableDateTime } from '@/helpers/date-utils'

import CopyTextButton from '@/components/copy-text-button'
import { EyeIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import { ITransactionBatch } from '..'
import { TransactionBatchHistoriesModal } from './transaction-batch/transaction-batch-histories'

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
                    onClick={() => historyModal.onOpenChange(true)}
                    size="sm"
                >
                    <EyeIcon className="mr-2" />
                    View Histories
                </Button>
            </div>
        </div>
    )
}

export default TransBatchTitleUserDisplay
