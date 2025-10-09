import useActionSecurityStore from '@/store/action-security-store'

import { EyeNoneIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { IClassProps } from '@/types'

import { useTransactionBatchRequestBlotterView } from '../../transaction-batch.service'
import {
    ITransactionBatch,
    ITransactionBatchMinimal,
} from '../../transaction-batch.types'
import { BatchBlotterSummaryView } from './batch-blotter-summary'

interface Props extends IClassProps {
    transactionBatch: ITransactionBatch
    onBatchUpdate?: (data: ITransactionBatch | ITransactionBatchMinimal) => void
}

const BatchBlotter = ({ transactionBatch, onBatchUpdate }: Props) => {
    const { mutate: requestBlotterView, isPending: isRequestingView } =
        useTransactionBatchRequestBlotterView({
            options: { onSuccess: onBatchUpdate },
        })

    const { onOpenSecurityAction } = useActionSecurityStore()
    return (
        <div className="relative flex-1 rounded-2xl border bg-background p-4">
            {!transactionBatch?.can_view ? (
                <div className="flex size-full flex-col items-center justify-center gap-y-3 p-4">
                    {transactionBatch?.request_view ? (
                        <>
                            <EyeNoneIcon className="size-12 text-muted-foreground/40" />
                            <p>Blotter View Request Pending</p>
                            <p className="text-center text-sm text-muted-foreground/80">
                                You have requested blotter view, please wait for
                                the authorized person to approve your request.
                            </p>
                        </>
                    ) : (
                        <>
                            <EyeNoneIcon className="size-12 text-muted-foreground/40" />
                            <p>Transaction Batch Blotter Hidden</p>
                            <p className="text-center text-sm text-muted-foreground/80">
                                You can request view and your manager will
                                confirm or decline
                            </p>
                            <Button
                                disabled={
                                    isRequestingView ||
                                    !!transactionBatch?.request_view
                                }
                                onClick={() =>
                                    onOpenSecurityAction({
                                        title: 'Request Blotter View',
                                        description:
                                            'You are requesting blotter view, please confirm if it is really you.',
                                        onSuccess: () =>
                                            requestBlotterView(
                                                transactionBatch.id
                                            ),
                                    })
                                }
                                size="sm"
                                variant="outline"
                            >
                                {isRequestingView ? (
                                    <LoadingSpinner />
                                ) : (
                                    'Request View'
                                )}
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <BatchBlotterSummaryView transBatch={transactionBatch} />
            )}
        </div>
    )
}

export default BatchBlotter
