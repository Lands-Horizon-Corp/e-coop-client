import { createFileRoute } from '@tanstack/react-router'

import Approval from '@/components/approval'
import PageContainer from '@/components/containers/page-container'

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
