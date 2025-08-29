import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(me)/my-general-ledger-entries/journal-voucher'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <GeneralLedgerTable
                mode="current"
                TEntryType="journal-voucher"
                excludeColumnIds={['balance']}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
