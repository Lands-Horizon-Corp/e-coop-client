import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteInventoryWarehouseById } from '../inventory-warehouse.service'
import { IInventoryInternalWarehouse } from '../inventory-warehouse.types'
import { IInventoryWarehouseTableActionComponentProp } from './columns'
import { InventoryWarehouseCreateUpdateModal } from './create-update-inventory-warehouse-modal'

export type InventoryWarehouseActionType = 'edit'

export interface InventoryWarehouseActionExtra {
    onDeleteSuccess?: () => void
}

interface UseInventoryWarehouseActionsProps {
    row: Row<IInventoryInternalWarehouse>
    onDeleteSuccess?: () => void
}

const useInventoryWarehouseActions = ({
    row,
    onDeleteSuccess,
}: UseInventoryWarehouseActionsProps) => {
    const warehouse = row.original

    const { open } = useTableRowActionStore<
        IInventoryInternalWarehouse,
        InventoryWarehouseActionType,
        InventoryWarehouseActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending, mutate } = useDeleteInventoryWarehouseById({
        options: {
            onSuccess: onDeleteSuccess,
        },
    })

    const handleEdit = () => {
        open('edit', {
            id: warehouse.id,
            defaultValues: warehouse,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Warehouse',
            description: 'Are you sure you want to delete this warehouse?',
            onConfirm: () => mutate(warehouse.id),
        })
    }

    return {
        warehouse,
        isPending,
        handleEdit,
        handleDelete,
    }
}

interface IInventoryWarehouseTableActionProps extends IInventoryWarehouseTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const InventoryWarehouseAction = ({
    row,
    onDeleteSuccess,
}: IInventoryWarehouseTableActionProps) => {
    const { isPending, handleEdit, handleDelete } =
        useInventoryWarehouseActions({
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

interface IInventoryWarehouseRowContextProps extends IInventoryWarehouseTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const InventoryWarehouseRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IInventoryWarehouseRowContextProps) => {
    const { isPending, handleEdit, handleDelete } =
        useInventoryWarehouseActions({
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
                onClick: handleEdit,
                isAllowed: true,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const InventoryWarehouseTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IInventoryInternalWarehouse,
        InventoryWarehouseActionType,
        InventoryWarehouseActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <InventoryWarehouseCreateUpdateModal
                    formProps={{
                        inventoryWarehouseId: state.id,
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

export default InventoryWarehouseAction
