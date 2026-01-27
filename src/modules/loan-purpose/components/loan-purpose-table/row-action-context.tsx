import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteLoanPurposeById } from '../../loan-purpose.service'
import { ILoanPurpose } from '../../loan-purpose.types'
import { LoanPurposeCreateUpdateFormModal } from '../forms/loan-purpose-create-update-form'
import { ILoanPurposeTableActionComponentProp } from './columns'

export type LoanPurposeActionType = 'edit' | 'delete'

export type LoanPurposeActionExtra = Record<string, never>

interface UseLoanPurposeActionsProps {
    row: Row<ILoanPurpose>
    onDeleteSuccess?: () => void
}

const useLoanPurposeActions = ({
    row,
    onDeleteSuccess,
}: UseLoanPurposeActionsProps) => {
    const loanPurpose = row.original
    const { open } = useTableRowActionStore<
        ILoanPurpose,
        LoanPurposeActionType,
        LoanPurposeActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingLoanPurpose, mutate: deleteLoanPurpose } =
        useDeleteLoanPurposeById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: loanPurpose.id,
            defaultValues: loanPurpose,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Loan Purpose',
            description: 'Are you sure you want to delete this Loan Purpose?',
            onConfirm: () => deleteLoanPurpose(loanPurpose.id),
        })
    }

    return {
        loanPurpose,
        isDeletingLoanPurpose,
        handleEdit,
        handleDelete,
    }
}

interface ILoanPurposeTableActionProps extends ILoanPurposeTableActionComponentProp {
    onLoanPurposeUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const LoanPurposeAction = ({
    row,
    onDeleteSuccess,
}: ILoanPurposeTableActionProps) => {
    const { loanPurpose, isDeletingLoanPurpose, handleEdit, handleDelete } =
        useLoanPurposeActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingLoanPurpose &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'LoanPurpose',
                            resource: loanPurpose,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'LoanPurpose',
                        resource: loanPurpose,
                    }),
                    onClick: handleEdit,
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
                row={row}
            />
        </>
    )
}

interface ILoanPurposeRowContextProps extends ILoanPurposeTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const LoanPurposeRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ILoanPurposeRowContextProps) => {
    const { loanPurpose, isDeletingLoanPurpose, handleEdit, handleDelete } =
        useLoanPurposeActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingLoanPurpose &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'LoanPurpose',
                            resource: loanPurpose,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'LoanPurpose',
                        resource: loanPurpose,
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

export const LoanPurposeTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        ILoanPurpose,
        LoanPurposeActionType,
        LoanPurposeActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const loanPurpose = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <LoanPurposeCreateUpdateFormModal
                    formProps={{
                        loanPurposeId: loanPurpose.id,
                        defaultValues: loanPurpose,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default LoanPurposeAction
