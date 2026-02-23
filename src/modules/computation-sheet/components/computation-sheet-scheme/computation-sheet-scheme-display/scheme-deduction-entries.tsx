import { forwardRef } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { cn } from '@/helpers'
import { useAuthContext } from '@/modules/authentication'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { automaticLoanDeductionBaseKey } from '@/modules/automatic-loan-deduction'
import AutomaticLoanDeductionTable, {
    AutomaticLoanDeductionTableProps,
} from '@/modules/automatic-loan-deduction/components/automatic-loan-deductions-table'
import { AutomaticLoanDeductionCreateUpdateFormModal } from '@/modules/automatic-loan-deduction/components/forms/automatic-loan-deduction-entry-create-update-form'
import { ICurrency } from '@/modules/currency'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps, TEntityId } from '@/types'

interface Props extends IClassProps {
    computationSheetId: TEntityId
    currency?: ICurrency
}

const ComputationSheetSchemeDeductionEntries = forwardRef<
    HTMLDivElement,
    Props
>(({ className, computationSheetId, currency }, ref) => {
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
            <PermissionGuard
                action="Create"
                resourceType="LoanSchemeAutomaticLoanDeduction"
            >
                <AutomaticLoanDeductionCreateUpdateFormModal
                    {...createModal}
                    formProps={{
                        currency,
                        defaultValues: {
                            computation_sheet_id: computationSheetId,
                        },
                    }}
                />
                <AutomaticLoanDeductionTable
                    className="max-h-[60vh] max-w-full min-w-0 min-h-[60vh]"
                    computationSheetId={computationSheetId}
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'Account',
                            }),
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'Account',
                            }),
                        } as NonNullable<
                            AutomaticLoanDeductionTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </div>
    )
})

ComputationSheetSchemeDeductionEntries.displayName =
    'ComputationSheetDeductionEntries'

export default ComputationSheetSchemeDeductionEntries
