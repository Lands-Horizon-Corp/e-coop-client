import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { LoanStatusCreateUpdateFormModal } from '@/components/forms/loan/loan-status-create-update-form'

import { useDeleteLoanStatus } from '@/hooks/api-hooks/loan/use-loan-status'
import { useModalState } from '@/hooks/use-modal-state'

import { ILoanStatus } from '@/types'

import { ILoanStatusTableActionComponentProp } from './columns'

interface UseLoanStatusActionsProps {
    row: Row<ILoanStatus>
    onDeleteSuccess?: () => void
}

const useLoanStatusActions = ({
    row,
    onDeleteSuccess,
}: UseLoanStatusActionsProps) => {
    const updateModal = useModalState()
    const loanStatus = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingLoanStatus, mutate: deleteLoanStatus } =
        useDeleteLoanStatus({
            onSuccess: onDeleteSuccess,
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Loan Status',
            description: 'Are you sure you want to delete this Loan Status?',
            onConfirm: () => deleteLoanStatus(loanStatus.id),
        })
    }

    return {
        loanStatus,
        updateModal,
        isDeletingLoanStatus,
        handleEdit,
        handleDelete,
    }
}

interface ILoanStatusTableActionProps
    extends ILoanStatusTableActionComponentProp {
    onLoanStatusUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const LoanStatusAction = ({
    row,
    onDeleteSuccess,
}: ILoanStatusTableActionProps) => {
    const {
        loanStatus,
        updateModal,
        isDeletingLoanStatus,
        handleEdit,
        handleDelete,
    } = useLoanStatusActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <LoanStatusCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        loanStatusId: loanStatus.id,
                        defaultValues: loanStatus,
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
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
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

interface ILoanStatusRowContextProps
    extends ILoanStatusTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const LoanStatusRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ILoanStatusRowContextProps) => {
    const {
        loanStatus,
        updateModal,
        isDeletingLoanStatus,
        handleEdit,
        handleDelete,
    } = useLoanStatusActions({ row, onDeleteSuccess })

    return (
        <>
            <LoanStatusCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    loanStatusId: loanStatus.id,
                    defaultValues: loanStatus,
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
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
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default LoanStatusAction
