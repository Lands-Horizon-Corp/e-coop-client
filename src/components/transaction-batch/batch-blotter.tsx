import { Button } from '@/components/ui/button'
import { EyeNoneIcon } from '@/components/icons'
import { BatchBlotterSummaryView } from './batch-blotter-summary'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { toReadableDate } from '@/utils'
import useActionSecurityStore from '@/store/action-security-store'
import { useTransactionBatchRequestBlotterView } from '@/hooks/api-hooks/use-transaction-batch'

import {
    IClassProps,
    ITransactionBatch,
    ITransactionBatchMinimal,
} from '@/types'

interface Props extends IClassProps {
    transactionBatch: ITransactionBatch
    onBatchUpdate?: (data: ITransactionBatch | ITransactionBatchMinimal) => void
}

const BatchBlotter = ({ transactionBatch, onBatchUpdate }: Props) => {
    const { mutate: requestBlotterView, isPending: isRequestingView } =
        useTransactionBatchRequestBlotterView({ onSuccess: onBatchUpdate })

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
                                Requested access on{' '}
                                <span className="rounded-sm bg-accent p-0.5 px-1 text-accent-foreground">
                                    {toReadableDate(
                                        transactionBatch.request_view,
                                        "MM-dd-yyyy 'at' hh:mm a"
                                    )}
                                </span>
                                . <br />
                                Please wait for the authorized person to approve
                                your request.
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
                                size="sm"
                                variant="outline"
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
