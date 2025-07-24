import { useQueryClient } from '@tanstack/react-query'

import { useAuthUser } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import FootstepTable from '@/components/tables/footsteps-table'
import FootstepTableAction from '@/components/tables/footsteps-table/action'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(common)/my-all-footsteps'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: { user },
    } = useAuthUser()
    const queryClient = useQueryClient()

    useSubscribe(`footstep.create.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'resource-query', 'me-branch'],
        })
    })

    useSubscribe(`footstep.update.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'resource-query', 'me-branch'],
        })
    })

    useSubscribe(`footstep.delete.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'resource-query', 'me-branch'],
        })
    })

    return (
        <PageContainer>
            <FootstepTable
                mode="me-branch"
                actionComponent={FootstepTableAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
