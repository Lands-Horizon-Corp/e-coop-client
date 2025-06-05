import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import Approval from '@/components/approval'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/approvals/'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer className="">
            <Approval className="min-h-[91dvh]" />
        </PageContainer>
    )
}
