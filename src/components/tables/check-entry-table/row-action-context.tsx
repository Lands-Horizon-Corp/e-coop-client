import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useDeleteCheckEntry } from '@/hooks/api-hooks/use-check-entry'

import { ICheckEntry } from '@/types'

import { ICheckEntryTableActionComponentProp } from './columns'

interface UseCheckEntryActionsProps {
    row: Row<ICheckEntry>
    onDeleteSuccess?: () => void
}

const useCheckEntryActions = ({
    row,
    onDeleteSuccess,
}: UseCheckEntryActionsProps) => {
    const checkEntry = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingCheckEntry, mutate: deleteCheckEntry } =
        useDeleteCheckEntry({
            onSuccess: onDeleteSuccess,
        })

    const handleDelete = () => {
        onOpen({
            title: 'Delete Check Entry',
            description: 'Are you sure you want to delete this check entry?',
            onConfirm: () => deleteCheckEntry(checkEntry.id),
        })
    }

    return {
        checkEntry,
        isDeletingCheckEntry,
        handleDelete,
    }
}

interface ICheckEntryTableActionProps
    extends ICheckEntryTableActionComponentProp {
    onCheckEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const CheckEntryAction = (props: ICheckEntryTableActionProps) => {
    const { isDeletingCheckEntry, handleDelete } = useCheckEntryActions(props)

    return (
        <>
            <RowActionsGroup
                canSelect
                row={props.row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingCheckEntry,
                    onClick: handleDelete,
                }}
                otherActions={<></>}
            />
        </>
    )
}

interface ICheckEntryRowContextProps
    extends ICheckEntryTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const CheckEntryRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ICheckEntryRowContextProps) => {
    const { isDeletingCheckEntry, handleDelete } = useCheckEntryActions({
        row,
        onDeleteSuccess,
    })

    return (
        <>
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingCheckEntry,
                    onClick: handleDelete,
                }}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default CheckEntryAction
