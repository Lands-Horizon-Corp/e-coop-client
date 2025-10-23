import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { currencyFormat } from '@/modules/currency'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { EyeIcon, LayersSharpDotIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps } from '@/types'

import { ITransactionBatch } from '../..'
import {
    useTransactionBatchAcceptBlotterView,
    useTransactionBatchBlotterViewRequests,
} from '../../transaction-batch.service'
import { BatchBlotterQuickViewModal } from '../transaction-batch/transaction-batch-quick-view'
import TransactionBatchStatusIndicator from '../transaction-batch/transaction-batch-status-indicator'

interface Props extends IClassProps {}

const BlotterRequestKanban = (_props: Props) => {
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const {
        data = [],
        isRefetching,
        refetch,
    } = useTransactionBatchBlotterViewRequests()

    useSubscribe(`transaction_batch.create.branch.${branch_id}`, () => {
        refetch()
    })

    useSubscribe(`transaction_batch.update.branch.${branch_id}`, () => {
        refetch()
    })

    useSubscribe(`transaction_batch.delete.branch.${branch_id}`, () => {
        refetch()
    })

    return (
        <KanbanContainer className="w-[360px]">
            <div className="flex items-center">
                <LayersSharpDotIcon className="mr-2 size-4 text-orange-400" />
                <KanbanTitle
                    isLoading={isRefetching}
                    onRefresh={() => refetch()}
                    title="Blotter View Request"
                    totalItems={data.length}
                />
            </div>
            <Separator />
            <KanbanItemsContainer>
                {data.map((transactionBatch) => (
                    <TransactionBatchCard
                        key={transactionBatch.id}
                        transBatch={transactionBatch}
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
    const { onOpen } = useConfirmModalStore()

    const { mutate: approve, isPending: isAproving } =
        useTransactionBatchAcceptBlotterView()

    return (
        <div className="space-y-2 rounded-xl bg-popover p-4 text-sm">
            <BatchBlotterQuickViewModal
                {...viewModalState}
                batchBlotterProps={{
                    transBatch,
                }}
            />
            <div className="flex items-center justify-between">
                <p className="truncate">{transBatch.batch_name}</p>
                <div className="flex items-center gap-x-1">
                    <Button
                        className="size-fit p-1"
                        onClick={() => viewModalState.onOpenChange(true)}
                        size="icon"
                        variant="secondary"
                    >
                        <EyeIcon />
                    </Button>
                    <Button
                        className="size-fit px-2 py-1"
                        onClick={() =>
                            onOpen({
                                title: 'Approve View',
                                description:
                                    'Are you sure to approve this employee from viewing own transaction batch summary?',
                                confirmString: 'Allow',
                                onConfirm: () => approve(transBatch.id),
                            })
                        }
                    >
                        {isAproving ? (
                            <LoadingSpinner className="size-3" />
                        ) : (
                            'Allow'
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
                    {currencyFormat(transBatch.beginning_balance, {
                        currency: transBatch.currency,
                        showSymbol: !!transBatch.currency,
                    })}
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

export default BlotterRequestKanban
