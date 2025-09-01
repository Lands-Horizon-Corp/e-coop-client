// Action.tsx
import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteAutomaticLoanDeductionById } from '../..'
import { IAutomaticLoanDeduction } from '../../automatic-loan-deduction.types'
import { IAutomaticLoanDeductionTableActionComponentProp } from './columns'
import { AutomaticLoanDeductionCreateUpdateFormModal } from '../forms/automatic-loan-deduction-entry-create-update-form'

interface UseAutomaticLoanDeductionActionsProps {
    row: Row<IAutomaticLoanDeduction>
    onDeleteSuccess?: () => void
}

const useAutomaticLoanDeductionActions = ({
    row,
    onDeleteSuccess,
}: UseAutomaticLoanDeductionActionsProps) => {
    const automaticLoanDeduction = row.original
    const editModal = useModalState()

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingAutomaticLoanDeduction,
        mutate: deleteAutomaticLoanDeduction,
    } = useDeleteAutomaticLoanDeductionById({
        options: {
            ...withToastCallbacks({
                onSuccess: onDeleteSuccess,
            }),
        },
    })

    const handleEdit = () => editModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Record',
            description: 'Are you sure you want to delete this record?',
            onConfirm: () =>
                deleteAutomaticLoanDeduction(automaticLoanDeduction.id),
        })
    }

    return {
        automaticLoanDeduction,
        editModal,
        isDeletingAutomaticLoanDeduction,
        handleEdit,
        handleDelete,
    }
}

interface IAutomaticLoanDeductionTableActionProps
    extends IAutomaticLoanDeductionTableActionComponentProp {
    onAutomaticLoanDeductionUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const AutomaticLoanDeductionAction = ({
    row,
    onDeleteSuccess,
}: IAutomaticLoanDeductionTableActionProps) => {
    const {
        automaticLoanDeduction,
        editModal,
        isDeletingAutomaticLoanDeduction,
        handleEdit,
        handleDelete,
    } = useAutomaticLoanDeductionActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <AutomaticLoanDeductionCreateUpdateFormModal
                    {...editModal}
                    formProps={{
                        automaticLoanDeductionId: automaticLoanDeduction.id,
                        defaultValues: automaticLoanDeduction,
                        onSuccess: () => editModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingAutomaticLoanDeduction,
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

interface IAutomaticLoanDeductionRowContextProps
    extends IAutomaticLoanDeductionTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const AutomaticLoanDeductionRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IAutomaticLoanDeductionRowContextProps) => {
    const {
        automaticLoanDeduction,
        editModal,
        isDeletingAutomaticLoanDeduction,
        handleEdit,
        handleDelete,
    } = useAutomaticLoanDeductionActions({ row, onDeleteSuccess })

    return (
        <>
            <AutomaticLoanDeductionCreateUpdateFormModal
                {...editModal}
                formProps={{
                    automaticLoanDeductionId: automaticLoanDeduction.id,
                    defaultValues: automaticLoanDeduction,
                    onSuccess: () => editModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingAutomaticLoanDeduction,
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

export default AutomaticLoanDeductionAction
