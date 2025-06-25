import { useState } from 'react'
import { ILoanPurposeTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { LoanPurposeCreateUpdateFormModal } from '@/components/forms/loan/loan-purpose-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteLoanPurpose } from '@/hooks/api-hooks/loan/use-loan-purpose'

interface ILoanPurposeTableActionProps
    extends ILoanPurposeTableActionComponentProp {
    onLoanPurposeUpdate?: () => void
    onDeleteSuccess?: () => void
}

const LoanPurposeTableAction = ({
    row,
    onDeleteSuccess,
}: ILoanPurposeTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const loanPurpose = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingLoanPurpose, mutate: deleteLoanPurpose } =
        useDeleteLoanPurpose({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <LoanPurposeCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        loanPurposeId: loanPurpose.id,
                        defaultValues: {
                            ...loanPurpose,
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingLoanPurpose,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Loan Purpose',
                            description:
                                'Are you sure you want to delete this Loan Purpose?',
                            onConfirm: () => deleteLoanPurpose(loanPurpose.id),
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

export default LoanPurposeTableAction
