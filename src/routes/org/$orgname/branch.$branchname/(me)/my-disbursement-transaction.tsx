import { createFileRoute } from '@tanstack/react-router'

import DisbursementTransactionTable from '@/modules/disbursement-transaction/components/disbursement-transaction-table'

import PageContainer from '@/components/containers/page-container'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(me)/my-disbursement-transaction'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <DisbursementTransactionTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                mode="current"
            />
        </PageContainer>
    )
}
