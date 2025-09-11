import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import {
    ILoanClearanceAnalysis,
    useDeleteLoanClearanceAnalysisById,
} from '../..'
import { LoanClearanceAnalysisCreateUpdateFormModal } from '../form/create-loan-clearance-analysis'
import { ILoanClearanceAnalysisTableActionComponentProp } from './columns'

// ===== SHARED HOOK =====
interface UseLoanClearanceAnalysisActionsProps {
    row: Row<ILoanClearanceAnalysis>
    onDeleteSuccess?: () => void
}

const useLoanClearanceAnalysisActions = ({
    row,
    onDeleteSuccess,
}: UseLoanClearanceAnalysisActionsProps) => {
    const updateModal = useModalState()
    const loanClearanceAnalysis = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingLoanClearanceAnalysis,
        mutate: deleteLoanClearanceAnalysis,
    } = useDeleteLoanClearanceAnalysisById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Deleted loan clearance analysis',
                onSuccess: onDeleteSuccess,
            }),
        },
    })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Loan Clearance Analysis',
            description:
                'Are you sure you want to delete this loan clearance analysis?',
            onConfirm: () =>
                deleteLoanClearanceAnalysis(loanClearanceAnalysis.id),
        })
    }

    return {
        loanClearanceAnalysis,
        updateModal,
        isDeletingLoanClearanceAnalysis,
        handleEdit,
        handleDelete,
    }
}

interface ILoanClearanceAnalysisTableActionProps
    extends ILoanClearanceAnalysisTableActionComponentProp {
    onLoanClearanceAnalysisUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const LoanClearanceAnalysisAction = ({
    row,
    onDeleteSuccess,
}: ILoanClearanceAnalysisTableActionProps) => {
    const {
        loanClearanceAnalysis,
        updateModal,
        isDeletingLoanClearanceAnalysis,
        handleEdit,
        handleDelete,
    } = useLoanClearanceAnalysisActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <LoanClearanceAnalysisCreateUpdateFormModal
                    {...updateModal}
                    title="Update Loan Clearance Analysis"
                    formProps={{
                        loanClearanceAnalysisId: loanClearanceAnalysis.id,
                        loanTransactionId:
                            loanClearanceAnalysis.loan_transaction_id,
                        defaultValues: { ...loanClearanceAnalysis },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingLoanClearanceAnalysis,
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

interface ILoanClearanceAnalysisRowContextProps
    extends ILoanClearanceAnalysisTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const LoanClearanceAnalysisRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ILoanClearanceAnalysisRowContextProps) => {
    const {
        loanClearanceAnalysis,
        updateModal,
        isDeletingLoanClearanceAnalysis,
        handleEdit,
        handleDelete,
    } = useLoanClearanceAnalysisActions({ row, onDeleteSuccess })

    return (
        <>
            <LoanClearanceAnalysisCreateUpdateFormModal
                {...updateModal}
                title="Update Loan Clearance Analysis"
                formProps={{
                    loanClearanceAnalysisId: loanClearanceAnalysis.id,
                    loanTransactionId:
                        loanClearanceAnalysis.loan_transaction_id,
                    defaultValues: { ...loanClearanceAnalysis },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingLoanClearanceAnalysis,
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

// Default export for backward compatibility
export default LoanClearanceAnalysisAction
