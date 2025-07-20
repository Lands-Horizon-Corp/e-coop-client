import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { IncludeNegativeAccountCreateUpdateFormModal } from '@/components/forms/loan/include-negative-account-create-update-form'

import { useDeleteIncludeNegativeAccount } from '@/hooks/api-hooks/loan/use-include-negative-account'
import { useModalState } from '@/hooks/use-modal-state'

import { IIncludeNegativeAccountTableActionComponentProp } from './columns'

interface ActionProps extends IIncludeNegativeAccountTableActionComponentProp {
    onDeleteSuccess?: () => void
}

const IncludeNegativeAccountAction = ({
    row,
    onDeleteSuccess,
}: ActionProps) => {
    const { onOpen } = useConfirmModalStore()
    const editModal = useModalState()
    const { isPending, mutate: deleteItem } = useDeleteIncludeNegativeAccount({
        onSuccess: onDeleteSuccess,
    })

    const data = row.original

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <IncludeNegativeAccountCreateUpdateFormModal
                    {...editModal}
                    formProps={{
                        includeNegativeAccountId: data.id,
                        defaultValues: data,
                    }}
                />
            </div>
            <RowActionsGroup
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => editModal.onOpenChange(true),
                }}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isPending,
                    onClick: () =>
                        onOpen({
                            title: 'Delete Record',
                            description:
                                'Are you sure you want to delete this record?',
                            onConfirm: () => deleteItem(data.id),
                        }),
                }}
            />
        </>
    )
}

export default IncludeNegativeAccountAction
