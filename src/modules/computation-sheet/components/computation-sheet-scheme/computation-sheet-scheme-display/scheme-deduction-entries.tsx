import { forwardRef } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { cn } from '@/helpers'
import { useAuthContext } from '@/modules/authentication'
import { automaticLoanDeductionBaseKey } from '@/modules/automatic-loan-deduction'
import AutomaticLoanDeductionTable from '@/modules/automatic-loan-deduction/components/automatic-loan-deductions-table'
import { AutomaticLoanDeductionCreateUpdateFormModal } from '@/modules/automatic-loan-deduction/components/forms/automatic-loan-deduction-entry-create-update-form'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps, TEntityId } from '@/types'

interface Props extends IClassProps {
    computationSheetId: TEntityId
}

const ComputationSheetSchemeDeductionEntries = forwardRef<
    HTMLDivElement,
    Props
>(({ className, computationSheetId }, ref) => {
    const autContext = useAuthContext()
    const createModal = useModalState()
    const queryClient = useQueryClient()

    useSubscribe(
        `automatic_loan_deduction.create.branch.${autContext.data?.user_organization?.branch_id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: [
                    automaticLoanDeductionBaseKey,
                    'all',
                    'scheme',
                    computationSheetId,
                ],
            })
        }
    )

    useSubscribe(`computation_sheet.update.${computationSheetId}`, () => {
        queryClient.invalidateQueries({
            queryKey: [
                automaticLoanDeductionBaseKey,
                'all',
                'scheme',
                computationSheetId,
            ],
        })
    })

    useSubscribe(`computation_sheet.delete.${computationSheetId}`, () => {
        queryClient.invalidateQueries({
            queryKey: [
                automaticLoanDeductionBaseKey,
                'all',
                'scheme',
                computationSheetId,
            ],
        })
    })

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
