import { IOnlineEntryTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteOnlineEntry } from '@/hooks/api-hooks/use-online-entry'

interface IOnlineEntryTableActionProps
    extends IOnlineEntryTableActionComponentProp {
    onOnlineEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

const OnlineEntryTableAction = ({
    row,
    onDeleteSuccess,
}: IOnlineEntryTableActionProps) => {
    const onlineEntry = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingOnlineEntry, mutate: deleteOnlineEntry } =
        useDeleteOnlineEntry({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingOnlineEntry,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Online Entry',
                            description:
                                'Are you sure you want to delete this online entry?',
                            onConfirm: () => deleteOnlineEntry(onlineEntry.id),
                        })
                    },
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default OnlineEntryTableAction
