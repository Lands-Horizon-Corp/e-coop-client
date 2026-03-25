import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteInventoryCategoryById } from '../inventory-category.service'
import { IInventoryCategory } from '../inventory-category.types'
import { IInventoryCategoryTableActionComponentProp } from './columns'
import { InventoryCategoryCreateUpdateModal } from './create-update-inventory-category-modal'

export type InventoryCategoryActionType = 'edit'

export interface InventoryCategoryActionExtra {
    onDeleteSuccess?: () => void
}

interface UseInventoryCategoryActionsProps {
    row: Row<IInventoryCategory>
    onDeleteSuccess?: () => void
}

const useInventoryCategoryActions = ({
    row,
    onDeleteSuccess,
}: UseInventoryCategoryActionsProps) => {
    const category = row.original

    const { open } = useTableRowActionStore<
        IInventoryCategory,
        InventoryCategoryActionType,
        InventoryCategoryActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingCategory, mutate: deleteCategory } =
        useDeleteInventoryCategoryById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: category.id,
            defaultValues: category,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Category',
            description: `Are you sure you want to delete "${category.name}"?`,
            onConfirm: () => deleteCategory(category.id),
        })
    }

    return {
        category,
        isDeletingCategory,
        handleEdit,
        handleDelete,
    }
}

interface IInventoryCategoryTableActionProps extends IInventoryCategoryTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const InventoryCategoryAction = ({
    row,
    onDeleteSuccess,
}: IInventoryCategoryTableActionProps) => {
    const { isDeletingCategory, handleEdit, handleDelete } =
        useInventoryCategoryActions({
            row,
            onDeleteSuccess,
        })

    return (
        <RowActionsGroup
            canSelect
            onDelete={{
                text: 'Delete',
                isAllowed: !isDeletingCategory,
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                onClick: handleEdit,
                isAllowed: true,
            }}
            row={row}
        />
    )
}

interface IInventoryCategoryRowContextProps extends IInventoryCategoryTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const InventoryCategoryRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IInventoryCategoryRowContextProps) => {
    const { isDeletingCategory, handleEdit, handleDelete } =
        useInventoryCategoryActions({
            row,
            onDeleteSuccess,
        })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed: !isDeletingCategory,
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                onClick: handleEdit,
                isAllowed: true,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const InventoryCategoryTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IInventoryCategory,
        InventoryCategoryActionType,
        InventoryCategoryActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <InventoryCategoryCreateUpdateModal
                    formProps={{
                        inventoryCategoryId: state.id,
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

export default InventoryCategoryAction
