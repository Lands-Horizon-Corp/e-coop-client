import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { useAuthUser } from '@/modules/authentication/authgentication.store'
import FootstepTable from '@/modules/footstep/components/footsteps-table'
import FootstepAction from '@/modules/footstep/components/footsteps-table/row-action-context'

import PageContainer from '@/components/containers/page-container'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(me)/my-all-footsteps'
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
            queryKey: ['footstep', 'paginated', 'me'],
        })
    })

    useSubscribe(`footstep.update.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'paginated', 'me'],
        })
    })

    useSubscribe(`footstep.delete.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['footstep', 'paginated', 'me'],
        })
    })

    return (
        <PageContainer>
            <FootstepTable
                mode="me"
                actionComponent={FootstepAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
