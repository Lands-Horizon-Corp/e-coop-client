// Action.tsx
import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { AutomaticLoanDeductionCreateUpdateFormModal } from '@/components/forms/loan/automatic-loan-deduction-entry-create-update-form'

import { useDeleteAutomaticLoanDeduction } from '@/hooks/api-hooks/loan/use-automatic-loan-deduction'
import { useModalState } from '@/hooks/use-modal-state'

import { IAutomaticLoanDeductionTableActionComponentProp } from './columns'

interface ActionProps extends IAutomaticLoanDeductionTableActionComponentProp {
    onLoanPurposeUpdate?: () => void
    onDeleteSuccess?: () => void
}

const AutomaticLoanDeductionAction = ({
    row,
    onDeleteSuccess,
}: ActionProps) => {
    const { onOpen } = useConfirmModalStore()
    const editModal = useModalState()
    const { isPending, mutate: deleteItem } = useDeleteAutomaticLoanDeduction({
        onSuccess: onDeleteSuccess,
    })

    const data = row.original

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <AutomaticLoanDeductionCreateUpdateFormModal
                    {...editModal}
                    formProps={{
                        automaticLoanDeductionId: data.id,
                        defaultValues: data,
                    }}
                />
            </div>
            <RowActionsGroup
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => editModal.onOpenChange(true),
                }}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isPending,
                    onClick: () =>
                        onOpen({
                            title: 'Delete Record',
                            description:
                                'Are you sure you want to delete this record?',
                            onConfirm: () => deleteItem(data.id),
                        }),
                }}
            />
        </>
    )
}

export default AutomaticLoanDeductionAction
