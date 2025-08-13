import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import CashCountTable from '@/components/tables/cash-count-table'
import CashCountTableAction from '@/components/tables/cash-count-table/row-action-context'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/maintenance/cash-count'
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

    useSubscribe(`cash_count.create.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['cash-count', 'resource-query'],
        })
    )

    useSubscribe(`cash_count.update.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['cash-count', 'resource-query'],
        })
    )

    useSubscribe(`cash_count.delete.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['cash-count', 'resource-query'],
        })
    )

    return (
        <PageContainer>
            <CashCountTable
                actionComponent={(prop) => <CashCountTableAction {...prop} />}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
