import { formatNumber } from '@/helpers/number-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import {
    ITransactionBatch,
    useTransactionBatchAcceptBlotterView,
    useTransactionBatchEndApprovals,
} from '@/modules/transaction-batch'
import { TransactionBatchSignCreateUpdateFormModal } from '@/modules/transaction-batch/components/forms/transaction-batch-sign-create-update-form'
import { BatchBlotterQuickViewModal } from '@/modules/transaction-batch/components/transaction-batch/transaction-batch-quick-view'
import TransactionBatchStatusIndicator from '@/modules/transaction-batch/components/transaction-batch/transaction-batch-status-indicator'

import {
    EyeIcon,
    LayersSharpDotIcon,
    SignatureLightIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps } from '@/types'

interface Props extends IClassProps {}

const EndedTransactionBatchKanban = (_props: Props) => {
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const {
        data = [],
        isRefetching,
        refetch,
    } = useTransactionBatchEndApprovals()

    useSubscribe(`transaction_batch.update.branch.${branch_id}`, () => {
        refetch()
    })

    useSubscribe(`transaction_batch.delete.branch.${branch_id}`, () => {
        refetch()
    })

    return (
        <KanbanContainer className="w-[360px]">
            <div className="flex items-center">
                <LayersSharpDotIcon className="mr-2 size-4 text-primary" />
                <KanbanTitle
                    title="Ended Batch"
                    totalItems={data.length}
                    isLoading={isRefetching}
                    onRefresh={() => refetch()}
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
                    resetOnDefaultChange: true,
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
