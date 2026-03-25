import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteInventoryHazardById } from '../inventory-hazard.service'
import { IInventoryHazard } from '../inventory-hazard.types'
import { IInventoryHazardTableActionComponentProp } from './columns'
import { InventoryHazardCreateUpdateModal } from './create-update-inventory-hazard-modal'

export type InventoryHazardActionType = 'edit'

export interface InventoryHazardActionExtra {
    onDeleteSuccess?: () => void
}

interface UseInventoryHazardActionsProps {
    row: Row<IInventoryHazard>
    onDeleteSuccess?: () => void
}

const useInventoryHazardActions = ({
    row,
    onDeleteSuccess,
}: UseInventoryHazardActionsProps) => {
    const hazard = row.original
    const { open } = useTableRowActionStore<
        IInventoryHazard,
        InventoryHazardActionType,
        InventoryHazardActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteHazard } =
        useDeleteInventoryHazardById({
            options: { onSuccess: onDeleteSuccess },
        })

    const handleEdit = () => {
        open('edit', {
            id: hazard.id,
            defaultValues: hazard,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Hazard Warning',
            description: `Are you sure you want to delete "${hazard.name}"? This might affect items associated with this hazard.`,
            onConfirm: () => deleteHazard(hazard.id),
        })
    }

    return { isDeleting, handleEdit, handleDelete }
}

export const InventoryHazardAction = ({
    row,
    onDeleteSuccess,
}: IInventoryHazardTableActionComponentProp & {
    onDeleteSuccess?: () => void
}) => {
    const { isDeleting, handleEdit, handleDelete } = useInventoryHazardActions({
        row,
        onDeleteSuccess,
    })
    return (
        <RowActionsGroup
            canSelect
            onDelete={{
                text: 'Delete',
                isAllowed: !isDeleting,
                onClick: handleDelete,
            }}
            onEdit={{ text: 'Edit', onClick: handleEdit, isAllowed: true }}
            row={row}
        />
    )
}

export const InventoryHazardRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IInventoryHazardTableActionComponentProp & {
    children?: ReactNode
    onDeleteSuccess?: () => void
}) => {
    const { isDeleting, handleEdit, handleDelete } = useInventoryHazardActions({
        row,
        onDeleteSuccess,
    })
    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed: !isDeleting,
                onClick: handleDelete,
            }}
            onEdit={{ text: 'Edit', onClick: handleEdit, isAllowed: true }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const InventoryHazardTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IInventoryHazard,
        InventoryHazardActionType,
        InventoryHazardActionExtra
    >()
    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <InventoryHazardCreateUpdateModal
                    formProps={{
                        inventoryHazardId: state.id,
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
