import { createFileRoute } from '@tanstack/react-router'

import APIRoutes from '@/modules/developer/components/api-routes'

import PageContainer from '@/components/containers/page-container'

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
