import { createFileRoute } from '@tanstack/react-router'

import FootstepTable from '@/components/tables/footsteps-table'
import PageContainer from '@/components/containers/page-container'
import FootstepTableAction from '@/components/tables/footsteps-table/action'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useAuthUser } from '@/store/user-auth-store'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(common)/my-footsteps'
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
            queryKey: ['timesheet', 'resource-query', 'me'],
        })
    })

    useSubscribe(`footstep.update.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'resource-query', 'me'],
        })
    })

    useSubscribe(`footstep.delete.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'resource-query', 'me'],
        })
    })

    return (
        <PageContainer>
            <FootstepTable
                mode="me"
                actionComponent={FootstepTableAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
