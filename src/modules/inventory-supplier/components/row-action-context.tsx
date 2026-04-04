import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteInventorySupplierById } from '../inventory-supplier.service'
import { IInventorySupplier } from '../inventory-supplier.types'
import { IInventorySupplierTableActionComponentProp } from './columns'
import { InventorySupplierCreateUpdateModal } from './create-update-inventory-supplier-modal'

export type InventorySupplierActionType = 'edit'

export interface InventorySupplierActionExtra {
    onDeleteSuccess?: () => void
}

const useInventorySupplierActions = ({
    row,
    onDeleteSuccess,
}: {
    row: Row<IInventorySupplier>
    onDeleteSuccess?: () => void
}) => {
    const supplier = row.original

    const { open } = useTableRowActionStore<
        IInventorySupplier,
        InventorySupplierActionType,
        InventorySupplierActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending, mutate } = useDeleteInventorySupplierById({
        options: { onSuccess: onDeleteSuccess },
    })

    const handleEdit = () => {
        open('edit', {
            id: supplier.id,
            defaultValues: supplier,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Supplier',
            description: 'Are you sure you want to delete this supplier?',
            onConfirm: () => mutate(supplier.id),
        })
    }

    return { supplier, isPending, handleEdit, handleDelete }
}

export const InventorySupplierAction = ({
    row,
    onDeleteSuccess,
}: IInventorySupplierTableActionComponentProp & {
    onDeleteSuccess?: () => void
}) => {
    const { handleEdit, handleDelete, isPending } = useInventorySupplierActions(
        { row, onDeleteSuccess }
    )

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

export const InventorySupplierRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IInventorySupplierTableActionComponentProp & {
    children?: ReactNode
    onDeleteSuccess?: () => void
}) => {
    const { handleEdit, handleDelete, isPending } = useInventorySupplierActions(
        { row, onDeleteSuccess }
    )

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

export const InventorySupplierTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IInventorySupplier,
        InventorySupplierActionType,
        InventorySupplierActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <InventorySupplierCreateUpdateModal
                    formProps={{
                        inventorySupplierId: state.id,
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
