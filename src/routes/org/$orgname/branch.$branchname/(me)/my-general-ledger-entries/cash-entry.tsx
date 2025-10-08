import { createFileRoute } from '@tanstack/react-router'

import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'

import PageContainer from '@/components/containers/page-container'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(me)/my-general-ledger-entries/cash-entry'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <GeneralLedgerTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                excludeColumnIds={['balance']}
                mode="current"
                TEntryType="cash-entry"
            />
        </PageContainer>
    )
}
