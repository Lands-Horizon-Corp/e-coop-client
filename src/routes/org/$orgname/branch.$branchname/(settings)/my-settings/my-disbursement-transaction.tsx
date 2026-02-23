import { createFileRoute } from '@tanstack/react-router'

import DisbursementTransactionTable from '@/modules/disbursement-transaction/components/disbursement-transaction-table'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(settings)/my-settings/my-disbursement-transaction'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="MyDisbursements">
                <DisbursementTransactionTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    mode="current"
                />
            </PermissionGuard>
        </PageContainer>
    )
}
