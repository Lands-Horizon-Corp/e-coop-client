import { createFileRoute } from '@tanstack/react-router'

import LoanView from '@/modules/loan-transaction/components/loan-view'

import PageContainer from '@/components/containers/page-container'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/temp-page'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <LoanView />
        </PageContainer>
    )
}
