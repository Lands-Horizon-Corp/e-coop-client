import { ReactNode } from 'react'

import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteCheckById } from '../check-warehousing.service'
import { ICheckWarehousing } from '../check-warehousing.types'
import { ICheckWarehousingTableActionComponentProp } from './check-warehouse-columns'
import { CheckWarehousingCreateUpdateFormModal } from './create-update-check-warehousing-modal'

export type CheckWarehousingActionType = 'edit'

export interface CheckWarehousingActionExtra {
    onDeleteSuccess?: () => void
}

interface UseCheckWarehousingActionsProps {
    row: Row<ICheckWarehousing>
    onDeleteSuccess?: () => void
}

const useCheckWarehousingActions = ({
    row,
    onDeleteSuccess,
}: UseCheckWarehousingActionsProps) => {
    const check = row.original

    const { open } = useTableRowActionStore<
        ICheckWarehousing,
        CheckWarehousingActionType,
        CheckWarehousingActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingCheck, mutate: deleteCheck } =
        useDeleteCheckById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: check.id,
            defaultValues: check,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Check',
            description:
                'Are you sure you want to delete this check warehousing record?',
            onConfirm: () => deleteCheck(check.id),
        })
    }

    return {
        check,
        isDeletingCheck,
        handleEdit,
        handleDelete,
    }
}

interface ICheckWarehousingTableActionProps extends ICheckWarehousingTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const CheckWarehousingAction = ({
    row,
    onDeleteSuccess,
}: ICheckWarehousingTableActionProps) => {
    const { check, isDeletingCheck, handleEdit, handleDelete } =
        useCheckWarehousingActions({
            row,
            onDeleteSuccess,
        })

    return (
        <RowActionsGroup
            canSelect
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingCheck &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'CheckWarehousing',
                        resource: check,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'CheckWarehousing',
                    resource: check,
                }),
                onClick: handleEdit,
            }}
            row={row}
        />
    )
}

interface ICheckWarehousingRowContextProps extends ICheckWarehousingTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const CheckWarehousingRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ICheckWarehousingRowContextProps) => {
    const { check, isDeletingCheck, handleEdit, handleDelete } =
        useCheckWarehousingActions({
            row,
            onDeleteSuccess,
        })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingCheck &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'CheckWarehousing',
                        resource: check,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'CheckWarehousing',
                    resource: check,
                }),
                onClick: handleEdit,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const CheckWarehousingTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        ICheckWarehousing,
        CheckWarehousingActionType,
        CheckWarehousingActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <CheckWarehousingCreateUpdateFormModal
                    formProps={{
                        checkWarehousingId: state.id,
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

export default CheckWarehousingAction
