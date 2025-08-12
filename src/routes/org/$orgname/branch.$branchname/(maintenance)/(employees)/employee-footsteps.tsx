import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import FootstepTable from '@/components/tables/footsteps-table'
import FootstepTableAction from '@/components/tables/footsteps-table/row-action-context'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(employees)/employee-footsteps'
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

    useSubscribe(`footstep.create.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'resource-query', 'branch'],
        })
    })

    useSubscribe(`footstep.update.user.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'resource-query', 'branch'],
        })
    })

    useSubscribe(`footstep.delete.user.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'resource-query', 'branch'],
        })
    })

    return (
        <PageContainer>
            <FootstepTable
                mode="branch"
                actionComponent={FootstepTableAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
