import { ICheckEntryTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteCheckEntry } from '@/hooks/api-hooks/use-check-entry'

interface ICheckEntryTableActionProps
    extends ICheckEntryTableActionComponentProp {
    onCheckEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

const CheckEntryTableAction = ({
    row,
    onDeleteSuccess,
}: ICheckEntryTableActionProps) => {
    const checkEntry = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingCheckEntry, mutate: deleteCheckEntry } =
        useDeleteCheckEntry({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingCheckEntry,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Check Entry',
                            description:
                                'Are you sure you want to delete this check entry?',
                            onConfirm: () => deleteCheckEntry(checkEntry.id),
                        })
                    },
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default CheckEntryTableAction
