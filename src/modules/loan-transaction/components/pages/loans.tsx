import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { LoanTransactionCreateUpdateFormModal } from '../forms/loan-transaction-create-update-form'
import LoanTransactionTable from '../loan-transaction-table'
import LoanTransactionAction, {
    LoanTransactionRowContext,
} from '../loan-transaction-table/row-action-context'

const LoansPage = () => {
    const createModal = useModalState()
    const { data } = useTransactionBatchStore()

    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`loan-transaction.update.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({ queryKey: ['loan-transaction'] })
    })

    return (
        <PageContainer>
            <LoanTransactionCreateUpdateFormModal {...createModal} />
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
