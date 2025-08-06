import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { DisbursementCreateUpdateFormModal } from '@/components/forms/disbursement-create-update-form'

import { useDeleteDisbursement } from '@/hooks/api-hooks/use-disbursement'
import { useModalState } from '@/hooks/use-modal-state'

import { IDisbursementTableActionComponentProp } from './columns'

interface IDisbursementTableActionProps
    extends IDisbursementTableActionComponentProp {
    onDisbursementUpdate?: () => void
    onDeleteSuccess?: () => void
}

const DisbursementTableAction = ({
    row,
    onDeleteSuccess,
}: IDisbursementTableActionProps) => {
    const updateModal = useModalState()
    const disbursement = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingDisbursement, mutate: deleteDisbursement } =
        useDeleteDisbursement({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <DisbursementCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        disbursementId: disbursement.id,
                        defaultValues: {
                            ...disbursement,
                        },
                        onSuccess: () => {
                            updateModal.onOpenChange(false)
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingDisbursement,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Disbursement',
                            description:
                                'Are you sure you want to delete this disbursement? This action cannot be undone.',
                            onConfirm: () =>
                                deleteDisbursement(disbursement.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => updateModal.onOpenChange(true),
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default DisbursementTableAction
