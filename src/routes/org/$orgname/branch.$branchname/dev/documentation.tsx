import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import APIRoutes from '@/components/developer/api-routes'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/dev/documentation'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <APIRoutes />
        </PageContainer>
    )
}
