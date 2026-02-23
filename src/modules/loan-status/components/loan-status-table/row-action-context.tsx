import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteLoanStatusById } from '../../loan-status.service'
import { ILoanStatus } from '../../loan-status.types'
import { LoanStatusCreateUpdateFormModal } from '../forms/loan-status-create-update-form'
import { ILoanStatusTableActionComponentProp } from './columns'

export type LoanStatusActionType = 'edit' | 'delete'

export type LoanStatusActionExtra = Record<string, never>

interface UseLoanStatusActionsProps {
    row: Row<ILoanStatus>
    onDeleteSuccess?: () => void
}

const useLoanStatusActions = ({
    row,
    onDeleteSuccess,
}: UseLoanStatusActionsProps) => {
    const loanStatus = row.original
    const { open } = useTableRowActionStore<
        ILoanStatus,
        LoanStatusActionType,
        LoanStatusActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingLoanStatus, mutate: deleteLoanStatus } =
        useDeleteLoanStatusById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: loanStatus.id,
            defaultValues: loanStatus,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Loan Status',
            description: 'Are you sure you want to delete this Loan Status?',
            onConfirm: () => deleteLoanStatus(loanStatus.id),
        })
    }

    return {
        loanStatus,
        isDeletingLoanStatus,
        handleEdit,
        handleDelete,
    }
}

interface ILoanStatusTableActionProps extends ILoanStatusTableActionComponentProp {
    onLoanStatusUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const LoanStatusAction = ({
    row,
    onDeleteSuccess,
}: ILoanStatusTableActionProps) => {
    const { loanStatus, isDeletingLoanStatus, handleEdit, handleDelete } =
        useLoanStatusActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingLoanStatus &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'LoanStatus',
                            resource: loanStatus,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'LoanStatus',
                        resource: loanStatus,
                    }),
                    onClick: handleEdit,
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
                row={row}
            />
        </>
    )
}

interface ILoanStatusRowContextProps extends ILoanStatusTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const LoanStatusRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ILoanStatusRowContextProps) => {
    const { isDeletingLoanStatus, handleEdit, handleDelete } =
        useLoanStatusActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingLoanStatus,
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
        </>
    )
}

export const LoanStatusTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        ILoanStatus,
        LoanStatusActionType,
        LoanStatusActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const loanStatus = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <LoanStatusCreateUpdateFormModal
                    formProps={{
                        loanStatusId: loanStatus.id,
                        defaultValues: loanStatus,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default LoanStatusAction
