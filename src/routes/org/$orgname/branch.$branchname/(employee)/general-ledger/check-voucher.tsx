import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import GeneralLedgerTable from '@/components/tables/ledgers-tables/general-ledger-table'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/check-voucher'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <GeneralLedgerTable
                mode="branch"
                TEntryType="check-voucher"
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
