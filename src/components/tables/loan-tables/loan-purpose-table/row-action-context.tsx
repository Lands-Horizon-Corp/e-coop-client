import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { LoanPurposeCreateUpdateFormModal } from '@/components/forms/loan/loan-purpose-create-update-form'

import { useDeleteLoanPurpose } from '@/hooks/api-hooks/loan/use-loan-purpose'
import { useModalState } from '@/hooks/use-modal-state'

import { ILoanPurpose } from '@/types'

import { ILoanPurposeTableActionComponentProp } from './columns'

interface UseLoanPurposeActionsProps {
    row: Row<ILoanPurpose>
    onDeleteSuccess?: () => void
}

const useLoanPurposeActions = ({
    row,
    onDeleteSuccess,
}: UseLoanPurposeActionsProps) => {
    const updateModal = useModalState()
    const loanPurpose = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingLoanPurpose, mutate: deleteLoanPurpose } =
        useDeleteLoanPurpose({
            onSuccess: onDeleteSuccess,
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Loan Purpose',
            description: 'Are you sure you want to delete this Loan Purpose?',
            onConfirm: () => deleteLoanPurpose(loanPurpose.id),
        })
    }

    return {
        loanPurpose,
        updateModal,
        isDeletingLoanPurpose,
        handleEdit,
        handleDelete,
    }
}

interface ILoanPurposeTableActionProps
    extends ILoanPurposeTableActionComponentProp {
    onLoanPurposeUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const LoanPurposeAction = ({
    row,
    onDeleteSuccess,
}: ILoanPurposeTableActionProps) => {
    const {
        loanPurpose,
        updateModal,
        isDeletingLoanPurpose,
        handleEdit,
        handleDelete,
    } = useLoanPurposeActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <LoanPurposeCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        loanPurposeId: loanPurpose.id,
                        defaultValues: loanPurpose,
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingLoanPurpose,
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

interface ILoanPurposeRowContextProps
    extends ILoanPurposeTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const LoanPurposeRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ILoanPurposeRowContextProps) => {
    const {
        loanPurpose,
        updateModal,
        isDeletingLoanPurpose,
        handleEdit,
        handleDelete,
    } = useLoanPurposeActions({ row, onDeleteSuccess })

    return (
        <>
            <LoanPurposeCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    loanPurposeId: loanPurpose.id,
                    defaultValues: loanPurpose,
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingLoanPurpose,
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

export default LoanPurposeAction
