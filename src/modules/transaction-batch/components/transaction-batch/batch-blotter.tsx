import useActionSecurityStore from '@/store/action-security-store'

import { EyeNoneIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

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
                <div className="flex items-center sticky top-1/2 -translate-y-1/2  justify-center min-h-[400px]">
                    {transactionBatch?.request_view ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <EyeNoneIcon />
                                </EmptyMedia>
                                <EmptyTitle>
                                    Blotter View Request Pending
                                </EmptyTitle>
                                <EmptyDescription>
                                    You have requested blotter view, please wait
                                    for the authorized person to approve your
                                    request.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <EyeNoneIcon />
                                </EmptyMedia>
                                <EmptyTitle>
                                    Transaction Batch Blotter Hidden
                                </EmptyTitle>
                                <EmptyDescription>
                                    You can request view and your manager will
                                    confirm or decline
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
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
                                >
                                    {isRequestingView ? (
                                        <LoadingSpinner />
                                    ) : (
                                        'Request View'
                                    )}
                                </Button>
                            </EmptyContent>
                        </Empty>
                    )}
                </div>
            ) : (
                <BatchBlotterSummaryView transBatch={transactionBatch} />
            )}
        </div>
    )
}

export default BatchBlotter
