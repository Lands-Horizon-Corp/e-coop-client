import { ReactNode } from 'react'

import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteAreaById } from '../..'
import { IArea } from '../../area.types'
import { AreaCreateUpdateFormModal } from '../forms/area-create-update-form'
import { IAreaTableActionComponentProp } from './columnts'

export type AreaActionType = 'edit' | 'delete'
export type AreaActionExtra = Record<string, never>

interface UseAreaActionsProps {
    row: Row<IArea>
    onDeleteSuccess?: () => void
}

const useAreaActions = ({ row, onDeleteSuccess }: UseAreaActionsProps) => {
    const area = row.original

    const { open } = useTableRowActionStore<
        IArea,
        AreaActionType,
        AreaActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingArea, mutate: deleteArea } = useDeleteAreaById(
        {
            options: {
                onSuccess: onDeleteSuccess,
            },
        }
    )

    const handleEdit = () => {
        open('edit', {
            id: area.id,
            defaultValues: area,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Area',
            description: 'Are you sure you want to delete this Area?',
            onConfirm: () => deleteArea(area.id),
        })
    }

    return {
        area,
        isDeletingArea,
        handleEdit,
        handleDelete,
    }
}

interface IAreaTableActionProps extends IAreaTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const AreaAction = ({ row, onDeleteSuccess }: IAreaTableActionProps) => {
    const { area, isDeletingArea, handleEdit, handleDelete } = useAreaActions({
        row,
        onDeleteSuccess,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()} />
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingArea &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'Area',
                            conditionLogic: 'some',
                            resource: area,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'Area',
                        conditionLogic: 'some',
                        resource: area,
                    }),
                    onClick: handleEdit,
                }}
                row={row}
            />
        </>
    )
}

interface IAreaRowContextProps extends IAreaTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const AreaRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IAreaRowContextProps) => {
    const { area, isDeletingArea, handleEdit, handleDelete } = useAreaActions({
        row,
        onDeleteSuccess,
    })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingArea &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'Area',
                        conditionLogic: 'some',
                        resource: area,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'Area',
                    conditionLogic: 'some',
                    resource: area,
                }),
                onClick: handleEdit,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const AreaTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IArea,
        AreaActionType,
        AreaActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const area = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <AreaCreateUpdateFormModal
                    description="Modify/Update area information..."
                    formProps={{
                        areaId: area.id,
                        defaultValues: area,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Update Area"
                />
            )}
        </>
    )
}

const AreaTableAction = ({ row, onDeleteSuccess }: IAreaTableActionProps) => {
    return <AreaAction onDeleteSuccess={onDeleteSuccess} row={row} />
}

export default AreaTableAction
