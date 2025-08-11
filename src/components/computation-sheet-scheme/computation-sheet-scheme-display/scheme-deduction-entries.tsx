import { forwardRef } from 'react'

import { cn } from '@/lib'

import { AutomaticLoanDeductionCreateUpdateFormModal } from '@/components/forms/loan/automatic-loan-deduction-entry-create-update-form'
import AutomaticLoanDeductionTable from '@/components/tables/loan-tables/automatic-loan-deductions-table'
import AutomaticLoanDeductionAction from '@/components/tables/loan-tables/automatic-loan-deductions-table/row-action-context'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

interface Props extends IClassProps {
    computationSheetId: TEntityId
}

const ComputationSheetSchemeDeductionEntries = forwardRef<
    HTMLDivElement,
    Props
>(({ className, computationSheetId }, ref) => {
    const createModal = useModalState()

    return (
        <div
            className={cn(
                'min-h-[70vh] space-y-4 bg-popover rounded-xl p-4',
                className
            )}
            ref={ref}
        >
            <p>Deduction Entries</p>
            <AutomaticLoanDeductionCreateUpdateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {
                        computation_sheet_id: computationSheetId,
                    },
                }}
            />
            <AutomaticLoanDeductionTable
                actionComponent={(props) => (
                    <AutomaticLoanDeductionAction {...props} />
                )}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                computationSheetId={computationSheetId}
                className="max-h-[60vh] max-w-full min-w-0 min-h-[60vh]"
            />
        </div>
    )
})

ComputationSheetSchemeDeductionEntries.displayName =
    'ComputationSheetDeductionEntries'

export default ComputationSheetSchemeDeductionEntries
