import { createFileRoute } from '@tanstack/react-router'

import FootstepTable from '@/components/tables/footsteps-table'
import PageContainer from '@/components/containers/page-container'
import FootstepTableAction from '@/components/tables/footsteps-table/action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(common)/users-footsteps'
)({
    component: RouteComponent,
})

function RouteComponent() {
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
