import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteIncludeNegativeAccountsById } from '../../include-negative-accounts.service'
import { IIncludeNegativeAccounts } from '../../include-negative-accounts.types'
import { IncludeNegativeAccountCreateUpdateFormModal } from '../forms/include-negative-account-create-update-form'
import { IIncludeNegativeAccountTableActionComponentProp } from './columns'

export type IncludeNegativeAccountActionType = 'edit'

export interface IncludeNegativeAccountActionExtra {
    onDeleteSuccess?: () => void
}

interface UseIncludeNegativeAccountActionsProps {
    row: Row<IIncludeNegativeAccounts>
    onDeleteSuccess?: () => void
}

const useIncludeNegativeAccountActions = ({
    row,
    onDeleteSuccess,
}: UseIncludeNegativeAccountActionsProps) => {
    const item = row.original

    const { open } = useTableRowActionStore<
        IIncludeNegativeAccounts,
        IncludeNegativeAccountActionType,
        IncludeNegativeAccountActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteItem } =
        useDeleteIncludeNegativeAccountsById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted record',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: item.id,
            defaultValues: item,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Record',
            description: 'Are you sure you want to delete this record?',
            onConfirm: () => deleteItem(item.id),
        })
    }

    return {
        item,
        isDeleting,
        handleEdit,
        handleDelete,
    }
}

interface IncludeNegativeAccountActionProps extends IIncludeNegativeAccountTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const IncludeNegativeAccountAction = ({
    row,
    onDeleteSuccess,
}: IncludeNegativeAccountActionProps) => {
    const { item, isDeleting, handleEdit, handleDelete } =
        useIncludeNegativeAccountActions({ row, onDeleteSuccess })

    return (
        <RowActionsGroup
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeleting &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'LoanSchemeIncludeNegativeAccounts',
                        resource: item,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'LoanSchemeIncludeNegativeAccounts',
                    resource: item,
                }),
                onClick: handleEdit,
            }}
            row={row}
        />
    )
}

interface IncludeNegativeAccountRowContextProps extends IIncludeNegativeAccountTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const IncludeNegativeAccountRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IncludeNegativeAccountRowContextProps) => {
    const { item, isDeleting, handleEdit, handleDelete } =
        useIncludeNegativeAccountActions({ row, onDeleteSuccess })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeleting &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'LoanSchemeIncludeNegativeAccounts',
                        resource: item,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'LoanSchemeIncludeNegativeAccounts',
                    resource: item,
                }),
                onClick: handleEdit,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const IncludeNegativeAccountTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IIncludeNegativeAccounts,
        IncludeNegativeAccountActionType,
        IncludeNegativeAccountActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <IncludeNegativeAccountCreateUpdateFormModal
                    formProps={{
                        includeNegativeAccountId: state.id,
                        defaultValues: state.defaultValues,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

const IncludeNegativeAccountTableAction = ({
    row,
    onDeleteSuccess,
}: IncludeNegativeAccountActionProps) => {
    return (
        <IncludeNegativeAccountAction
            onDeleteSuccess={onDeleteSuccess}
            row={row}
        />
    )
}

export default IncludeNegativeAccountTableAction
