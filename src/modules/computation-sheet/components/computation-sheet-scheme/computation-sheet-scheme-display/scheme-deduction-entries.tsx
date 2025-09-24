import { forwardRef } from 'react'

import { cn } from '@/helpers'
import AutomaticLoanDeductionTable from '@/modules/automatic-loan-deduction/components/automatic-loan-deductions-table'
import { AutomaticLoanDeductionCreateUpdateFormModal } from '@/modules/automatic-loan-deduction/components/forms/automatic-loan-deduction-entry-create-update-form'

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
