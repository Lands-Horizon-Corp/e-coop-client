import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { BrowseExcludeIncludeAccountsCreateUpdateFormModal } from '@/components/forms/loan/browse-exclude-include-account-create-update-form'

import { useDeleteBrowseExcludeIncludeAccounts } from '@/hooks/api-hooks/loan/use-browse-exclude-include-accounts'
import { useModalState } from '@/hooks/use-modal-state'

import { IBrowseExcludeIncludeAccountTableActionComponentProp } from './columns'

interface ActionProps
    extends IBrowseExcludeIncludeAccountTableActionComponentProp {
    onDeleteSuccess?: () => void
}

const BrowseExcludeIncludeAccountAction = ({
    row,
    onDeleteSuccess,
}: ActionProps) => {
    const { onOpen } = useConfirmModalStore()
    const editModal = useModalState()
    const { isPending, mutate: deleteItem } =
        useDeleteBrowseExcludeIncludeAccounts({
            onSuccess: onDeleteSuccess,
        })

    const data = row.original

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <BrowseExcludeIncludeAccountsCreateUpdateFormModal
                    {...editModal}
                    formProps={{
                        browseExcludeIncludeAccountId: data.id,
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

export default BrowseExcludeIncludeAccountAction
