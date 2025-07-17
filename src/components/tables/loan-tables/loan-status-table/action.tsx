import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { LoanStatusCreateUpdateFormModal } from '@/components/forms/loan/loan-status-create-update-form'

import { useDeleteLoanStatus } from '@/hooks/api-hooks/loan/use-loan-status'

import { ILoanStatusTableActionComponentProp } from './columns'

interface ILoanStatusTableActionProps
    extends ILoanStatusTableActionComponentProp {
    onLoanStatusUpdate?: () => void
    onDeleteSuccess?: () => void
}

const LoanStatusTableAction = ({
    row,
    onDeleteSuccess,
}: ILoanStatusTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const loanStatus = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingLoanStatus, mutate: deleteLoanStatus } =
        useDeleteLoanStatus({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <LoanStatusCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        loanStatusId: loanStatus.id,
                        defaultValues: {
                            ...loanStatus,
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingLoanStatus,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Loan Status',
                            description:
                                'Are you sure you want to delete this Loan Status?',
                            onConfirm: () => deleteLoanStatus(loanStatus.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setUpdateModalForm(true),
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default LoanStatusTableAction
