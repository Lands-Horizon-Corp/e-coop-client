import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { formatNumber } from '@/utils'

import { TransactionBatchSignCreateUpdateFormModal } from '@/components/forms/transaction-batch-forms/transaction-batch-sign-create-update-form'
import {
    EyeIcon,
    LayersSharpDotIcon,
    SignatureLightIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { BatchBlotterQuickViewModal } from '@/components/transaction-batch/transaction-batch-quick-view'
import TransactionBatchStatusIndicator from '@/components/transaction-batch/transaction-batch-status-indicator'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import {
    useTransactionBatchAcceptBlotterView,
    useTransactionBatchEndApprovals,
} from '@/hooks/api-hooks/use-transaction-batch'
import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps, ITransactionBatch } from '@/types'

import KanbanContainer from '../kanban/kanban-container'
import KanbanItemsContainer from '../kanban/kanban-items-container'
import KanbanTitle from '../kanban/kanban-title'

interface Props extends IClassProps {}

const EndedTransactionBatchKanban = (_props: Props) => {
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const { data, isPending, refetch } = useTransactionBatchEndApprovals()

    useSubscribe(`transaction_batch.update.branch.${branch_id}`, () =>
        refetch()
    )

    return (
        <KanbanContainer className="w-[360px]">
            <div className="flex items-center">
                <LayersSharpDotIcon className="mr-2 size-4 text-primary" />
                <KanbanTitle
                    isLoading={isPending}
                    totalItems={data.length}
                    title="Ended Batch"
                />
            </div>
            <Separator />
            <KanbanItemsContainer>
                {data.map((transactionBatch) => (
                    <TransactionBatchCard
                        transBatch={transactionBatch}
                        key={transactionBatch.id}
                    />
                ))}
                {data.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground/60">
                        no pending request
                    </p>
                )}
            </KanbanItemsContainer>
        </KanbanContainer>
    )
}

const TransactionBatchCard = ({
    transBatch,
}: {
    transBatch: ITransactionBatch
}) => {
    const viewModalState = useModalState()
    const approveModalState = useModalState()
    const { mutate: _approve, isPending: isAproving } =
        useTransactionBatchAcceptBlotterView()

    return (
        <div className="space-y-2 rounded-xl bg-popover p-4 text-sm">
            <BatchBlotterQuickViewModal
                {...viewModalState}
                batchBlotterProps={{
                    transBatch,
                }}
            />
            <TransactionBatchSignCreateUpdateFormModal
                {...approveModalState}
                formProps={{
                    batchId: transBatch.id,
                    defaultStep: 0,
                    defaultValues: transBatch,
                }}
            />
            <div className="flex items-center justify-between">
                <p className="truncate">{transBatch.batch_name}</p>
                <div className="flex items-center gap-x-1">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="size-fit p-1"
                        onClick={() => viewModalState.onOpenChange(true)}
                    >
                        <EyeIcon />
                    </Button>
                    <Button
                        className="size-fit px-2 py-1"
                        onClick={() => approveModalState.onOpenChange(true)}
                    >
                        {isAproving ? (
                            <LoadingSpinner className="size-3" />
                        ) : (
                            <>
                                <SignatureLightIcon className="mr-1" />
                                Sign
                            </>
                        )}
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-x-2">
                <ImageDisplay
                    className="size-8"
                    src={transBatch?.employee_user?.media?.download_url}
                />
                <div>
                    <p>{transBatch.employee_user?.full_name}</p>
                    <p className="text-xs text-muted-foreground/70">
                        @{transBatch.employee_user?.user_name ?? '-'}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <p className="text-muted-foreground">Beginning Bal.</p>{' '}
                <p className="text-right">
                    {formatNumber(transBatch.beginning_balance, 2)}
                </p>
                <p className="text-muted-foreground">Status</p>
                <TransactionBatchStatusIndicator
                    className="justify-end"
                    transBatch={transBatch}
                />
            </div>
        </div>
    )
}

export default EndedTransactionBatchKanban
