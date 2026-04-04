import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteInventoryBrandById } from '../inventory-brand.service'
import { IInventoryBrand } from '../inventory-brand.types'
import { IInventoryBrandTableActionComponentProp } from './columns'
import { InventoryBrandCreateUpdateFormModal } from './inventory-brancd-create-update-modal'

export type InventoryBrandActionType = 'edit'

export interface InventoryBrandActionExtra {
    onDeleteSuccess?: () => void
}

const useInventoryBrandActions = ({
    row,
    onDeleteSuccess,
}: {
    row: Row<IInventoryBrand>
    onDeleteSuccess?: () => void
}) => {
    const brand = row.original

    const { open } = useTableRowActionStore<
        IInventoryBrand,
        InventoryBrandActionType,
        InventoryBrandActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending, mutate } = useDeleteInventoryBrandById({
        options: { onSuccess: onDeleteSuccess },
    })

    const handleEdit = () => {
        open('edit', {
            id: brand.id,
            defaultValues: brand,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Brand',
            description: 'Are you sure you want to delete this brand?',
            onConfirm: () => mutate(brand.id),
        })
    }

    return { brand, isPending, handleEdit, handleDelete }
}

export const InventoryBrandAction = ({
    row,
    onDeleteSuccess,
}: IInventoryBrandTableActionComponentProp & {
    onDeleteSuccess?: () => void
}) => {
    const { isPending, handleEdit, handleDelete } = useInventoryBrandActions({
        row,
        onDeleteSuccess,
    })

    return (
        <RowActionsGroup
            canSelect
            onDelete={{
                text: 'Delete',
                isAllowed: !isPending,
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: true,
                onClick: handleEdit,
            }}
            row={row}
        />
    )
}

export const InventoryBrandRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IInventoryBrandTableActionComponentProp & {
    children?: ReactNode
    onDeleteSuccess?: () => void
}) => {
    const { isPending, handleEdit, handleDelete } = useInventoryBrandActions({
        row,
        onDeleteSuccess,
    })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed: !isPending,
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: true,
                onClick: handleEdit,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const InventoryBrandTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IInventoryBrand,
        InventoryBrandActionType,
        InventoryBrandActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <InventoryBrandCreateUpdateFormModal
                    formProps={{
                        inventoryBrandId: state.id,
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

export default InventoryBrandAction
