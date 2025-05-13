import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/users/members/view-members'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <PageContainer>View members</PageContainer>
}
