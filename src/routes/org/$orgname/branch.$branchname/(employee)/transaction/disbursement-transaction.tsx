import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import DisbursementTransactionTable from '@/components/tables/disbursement-transaction-table'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/disbursement-transaction'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <DisbursementTransactionTable
                mode="branch"
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
