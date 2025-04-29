import { useState } from 'react'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { IAccountsComputationTypeTableActionComponentProp } from '../column'
import { useDeleteComputationType } from '@/hooks/api-hooks/accounting/use-computation-type'
import { ComputationTypeCreateFormModal } from '@/components/forms/computation-type-forms/computation-type-create-update-form'

interface IComputationTypeTableOwnerActionProps
    extends IAccountsComputationTypeTableActionComponentProp {
    onComputationTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

const ComputationTypeTableOwnerAction = ({
    row,
    onDeleteSuccess,
}: IComputationTypeTableOwnerActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const computationType = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingComputationType,
        mutate: deleteComputationType,
    } = useDeleteComputationType({
        onSuccess: onDeleteSuccess,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <ComputationTypeCreateFormModal
                    formProps={{
                        computationTypeId: computationType.id,
                        defaultValues: {
                            ...computationType,
                        },
                    }}
                    title="Update Computation Type"
                    description="Modify/Update computation type..."
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingComputationType,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Computation Type',
                            description:
                                'Are you sure you want to delete this Computation Type?',
                            onConfirm: () =>
                                deleteComputationType(computationType.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setUpdateModalForm(true),
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default ComputationTypeTableOwnerAction
