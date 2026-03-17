import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteInventoryTagById } from '../inventory-tag.service'
import { IInventoryTag } from '../inventory-tag.types'
import { IInventoryTagTableActionComponentProp } from './columns'
import { InventoryTagCreateUpdateFormModal } from './inventory-tag-create-update-modal'

export type InventoryTagActionType = 'edit'

export interface InventoryTagActionExtra {
    onDeleteSuccess?: () => void
}

interface UseInventoryTagActionsProps {
    row: Row<IInventoryTag>
    onDeleteSuccess?: () => void
}

const useInventoryTagActions = ({
    row,
    onDeleteSuccess,
}: UseInventoryTagActionsProps) => {
    const tag = row.original

    const { open } = useTableRowActionStore<
        IInventoryTag,
        InventoryTagActionType,
        InventoryTagActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingTag, mutate: deleteTag } =
        useDeleteInventoryTagById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: tag.id,
            defaultValues: tag,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Tag',
            description: 'Are you sure you want to delete this tag?',
            onConfirm: () => deleteTag(tag.id),
        })
    }

    return {
        tag,
        isDeletingTag,
        handleEdit,
        handleDelete,
    }
}

interface IInventoryTagTableActionProps extends IInventoryTagTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const InventoryTagAction = ({
    row,
    onDeleteSuccess,
}: IInventoryTagTableActionProps) => {
    const { isDeletingTag, handleEdit, handleDelete } = useInventoryTagActions({
        row,
        onDeleteSuccess,
    })

    return (
        <RowActionsGroup
            canSelect
            onDelete={{
                text: 'Delete',
                isAllowed: !isDeletingTag,
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                onClick: handleEdit,
            }}
            row={row}
        />
    )
}

interface IInventoryTagRowContextProps extends IInventoryTagTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const InventoryTagRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IInventoryTagRowContextProps) => {
    const { isDeletingTag, handleEdit, handleDelete } = useInventoryTagActions({
        row,
        onDeleteSuccess,
    })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed: !isDeletingTag,
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                onClick: handleEdit,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const InventoryTagTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IInventoryTag,
        InventoryTagActionType,
        InventoryTagActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <InventoryTagCreateUpdateFormModal
                    formProps={{
                        inventoryTagId: state.id,
                        defaultValues: state.defaultValues,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default InventoryTagAction
