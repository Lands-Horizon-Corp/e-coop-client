import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import TransactionBatchTable from '../transaction-batch-table'
import TransactionBatchAction from '../transaction-batch-table/row-action-context'

const TransactionBatchPage = () => {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`transaction_batch.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'paginated'],
        })
    })

    useSubscribe(`transaction_batch.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'paginated'],
        })
    })

    useSubscribe(`transaction_batch.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <TransactionBatchTable
                mode="all"
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default TransactionBatchPage
