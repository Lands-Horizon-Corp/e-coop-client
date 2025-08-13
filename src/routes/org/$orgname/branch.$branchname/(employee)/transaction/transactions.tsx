import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import TransactionTable from '@/components/tables/transaction-table'
import TransactionTableAction from '@/components/tables/transaction-table/row-action-context'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/transactions'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(`transaction.create.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction', 'resource-query', 'current-branch'],
        })
    })

    useSubscribe(`transaction.update.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction', 'resource-query', 'current-branch'],
        })
    })

    useSubscribe(`transaction.delete.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction', 'resource-query', 'current-branch'],
        })
    })

    return (
        <PageContainer>
            <TransactionTable
                mode="current-branch"
                actionComponent={TransactionTableAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
