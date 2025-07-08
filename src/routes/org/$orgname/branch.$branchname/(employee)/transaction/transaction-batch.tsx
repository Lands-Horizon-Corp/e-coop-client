import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import TransactionBatchTable from '@/components/tables/transaction-batch-table'
import TransactionBatchTableAction from '@/components/tables/transaction-batch-table/action'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/transaction-batch'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`transaction_batch.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'resource-query'],
        })
    })

    useSubscribe(`transaction_batch.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'resource-query'],
        })
    })

    useSubscribe(`transaction_batch.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <TransactionBatchTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => (
                    <TransactionBatchTableAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
