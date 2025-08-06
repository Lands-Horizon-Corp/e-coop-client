import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import GeneralLedgerTable from '@/components/tables/ledgers-tables/general-ledger-table'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(me)/my-general-ledger-entries/journal-entry'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <GeneralLedgerTable
                mode="current"
                TEntryType="journal-entry"
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
