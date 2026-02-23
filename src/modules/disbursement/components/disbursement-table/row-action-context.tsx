import { ReactNode } from 'react'

import {
    getCrudPermissionFromAuthStore,
    hasPermissionFromAuth,
} from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteDisbursementById } from '../../disbursement.service'
import { IDisbursement } from '../../disbursement.types'
import { DisbursementCreateUpdateFormModal } from '../forms/disbursement-create-update-form'
import { IDisbursementTableActionComponentProp } from './columns'

export type DisbursementActionType = 'edit' | 'delete'
export type DisbursementActionExtra = Record<string, never>

interface UseDisbursementActionsProps {
    row: Row<IDisbursement>
    onDeleteSuccess?: () => void
}

const useDisbursementActions = ({
    row,
    onDeleteSuccess,
}: UseDisbursementActionsProps) => {
    const disbursement = row.original
    const { open } = useTableRowActionStore<
        IDisbursement,
        DisbursementActionType,
        DisbursementActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const disbursementCrudPerms = getCrudPermissionFromAuthStore({
        resourceType: 'DisburesmentType',
        resource: disbursement,
    })

    const { isPending: isDeletingDisbursement, mutate: deleteDisbursement } =
        useDeleteDisbursementById({
            options: { onSuccess: onDeleteSuccess },
        })

    const handleEdit = () => {
        open('edit', {
            id: disbursement.id,
            defaultValues: { ...disbursement },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Disbursement',
            description:
                'Are you sure you want to delete this disbursement? This action cannot be undone.',
            onConfirm: () => deleteDisbursement(disbursement.id),
        })
    }

    return {
        disbursement,
        disbursementCrudPerms,
        isDeletingDisbursement,
        handleEdit,
        handleDelete,
    }
}

interface IDisbursementTableActionProps extends IDisbursementTableActionComponentProp {
    onDisbursementUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const DisbursementAction = ({
    row,
    onDeleteSuccess,
}: IDisbursementTableActionProps) => {
    const { disbursement, isDeletingDisbursement, handleEdit, handleDelete } =
        useDisbursementActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'DisburesmentType',
                            conditionLogic: 'some',
                            resource: disbursement,
                        }) && !isDeletingDisbursement,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'DisburesmentType',
                        conditionLogic: 'some',
                        resource: disbursement,
                    }),
                    onClick: handleEdit,
                }}
                otherActions={<></>}
                row={row}
            />
        </>
    )
}

interface IDisbursementRowContextProps extends IDisbursementTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const DisbursementRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IDisbursementRowContextProps) => {
    const { disbursement, isDeletingDisbursement, handleEdit, handleDelete } =
        useDisbursementActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingDisbursement &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'DisburesmentType',
                            resource: disbursement,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'DisburesmentType',
                        resource: disbursement,
                    }),
                    onClick: handleEdit,
                }}
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const DisbursementTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IDisbursement,
        DisbursementActionType,
        DisbursementActionExtra
    >()

    if (!state || !state.defaultValues) return null

    return (
        <>
            {state.action === 'edit' && (
                <DisbursementCreateUpdateFormModal
                    formProps={{
                        disbursementId: state.defaultValues.id,
                        defaultValues: { ...state.defaultValues },
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default DisbursementAction
