import useConfirmModalStore from '@/store/confirm-modal-store'
import { useAuthUser } from '@/store/user-auth-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { ClockIcon, EyeIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { TransactionBatchHistoriesModal } from '@/components/transaction-batch/transaction-batch-histories'
import { BatchBlotterQuickViewModal } from '@/components/transaction-batch/transaction-batch-quick-view'
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import {
    useDeleteTransactionBatch,
    useTransactionBatchAcceptBlotterView,
} from '@/hooks/api-hooks/use-transaction-batch'
import { useModalState } from '@/hooks/use-modal-state'

import { ITransactionBatchTableActionComponentProp } from './columns'

interface ITransactionBatchTableActionProps
    extends ITransactionBatchTableActionComponentProp {
    onBatchUpdate?: () => void
    onDeleteSuccess?: () => void
}

const TransactionBatchTableAction = ({
    row,
    onDeleteSuccess,
}: ITransactionBatchTableActionProps) => {
    const batch = row.original
    const { onOpen } = useConfirmModalStore()

    const quickViewModal = useModalState()
    const viewHistoryModal = useModalState()

    const {
        currentAuth: { user },
    } = useAuthUser()

    const { isPending: isDeletingBatch, mutate: deleteBatch } =
        useDeleteTransactionBatch({
            onSuccess: onDeleteSuccess,
        })

    const { mutate: approve, isPending: isAproving } =
        useTransactionBatchAcceptBlotterView()

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <TransactionBatchHistoriesModal
                    {...viewHistoryModal}
                    transactionBatchHistoryProps={{
                        transactionBatchId: batch.id,
                    }}
                />
                <BatchBlotterQuickViewModal
                    {...quickViewModal}
                    batchBlotterProps={{
                        transBatch: batch,
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingBatch,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Transaction Batch',
                            description:
                                'Are you sure you want to delete this Transaction Batch?',
                            onConfirm: () => deleteBatch(batch.id),
                        })
                    },
                }}
                otherActions={
                    <>
                        <DropdownMenuItem
                            onClick={() => quickViewModal.onOpenChange(true)}
                            disabled={
                                user?.id === batch.employee_user_id &&
                                batch.can_view === false
                            }
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Quick Summary
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => viewHistoryModal.onOpenChange(true)}
                        >
                            <ClockIcon className="mr-2" strokeWidth={1.5} />
                            View Histories
                        </DropdownMenuItem>

                        <DropdownMenuLabel>Advance</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            disabled={batch.can_view}
                            onClick={() =>
                                onOpen({
                                    title: 'Approve View',
                                    description:
                                        'Are you sure to approve this employee from viewing own transaction batch summary?',
                                    confirmString: 'Allow',
                                    onConfirm: () => approve(batch.id),
                                })
                            }
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            Approve Blotter View{' '}
                            {isAproving && <LoadingSpinner />}
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
    )
}

export default TransactionBatchTableAction
