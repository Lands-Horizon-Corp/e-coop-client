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
            <LoanView loanTransactionId={'87ee9c32-1faa-4285-b5d7-07fe4fab4ee2'}/>
        </PageContainer>
    )
}
