import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { LoanTransactionCreateUpdateFormModal } from '../forms/loan-transaction-create-update-form'
import LoanTransactionTable, {
    LoanTransactionTableProps,
} from '../loan-transaction-table'
import LoanTransactionAction, {
    LoanTransactionRowContext,
} from '../loan-transaction-table/row-action-context'

const LoansPage = () => {
    const createModal = useModalState()
    const { data } = useTransactionBatchStore()

    const {
        currentAuth: {
            user_organization: {
                branch_id,
                branch: { branch_setting },
            },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`loan-transaction.update.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({ queryKey: ['loan-transaction'] })
    })

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="Loan">
                <LoanTransactionCreateUpdateFormModal
                    {...createModal}
                    formProps={{
                        orSettings: branch_setting,
                    }}
                />
                <LoanTransactionTable
                    actionComponent={LoanTransactionAction}
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    mode="branch"
                    RowContextComponent={LoanTransactionRowContext}
                    toolbarProps={{
                        createActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'Loan',
                            }),
                            onClick: () => {
                                if (!data)
                                    return toast.warning(
                                        'Please create transaction batch first before making any loan.'
                                    )
                                createModal.onOpenChange(true)
                            },
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'Loan',
                            }),
                        } as NonNullable<
                            LoanTransactionTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default LoansPage
