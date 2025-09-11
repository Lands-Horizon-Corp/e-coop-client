import { toast } from 'sonner'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import { LoanTransactionCreateUpdateFormModal } from '../forms/loan-transaction-create-update-form'
import LoanTransactionTable from '../loan-transaction-table'
import LoanTransactionAction, {
    LoanTransactionRowContext,
} from '../loan-transaction-table/row-action-context'

const LoansPage = () => {
    const {
        currentAuth: {
            user_organization: {
                branch: {
                    branch_setting: { cash_on_hand_account },
                },
            },
        },
    } = useAuthUserWithOrgBranch()

    const createModal = useModalState()
    const { data } = useTransactionBatchStore()

    return (
        <PageContainer>
            <LoanTransactionCreateUpdateFormModal
                formProps={{
                    mode: 'create',
                    defaultValues: {
                        cash_on_hand_account,
                    },
                }}
                {...createModal}
            />
            <LoanTransactionTable
                mode="branch"
                toolbarProps={{
                    createActionProps: {
                        onClick: () => {
                            if (!data)
                                return toast.warning(
                                    'Please create transaction batch first before making any loan.'
                                )
                            createModal.onOpenChange(true)
                        },
                    },
                }}
                RowContextComponent={LoanTransactionRowContext}
                actionComponent={LoanTransactionAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default LoansPage
