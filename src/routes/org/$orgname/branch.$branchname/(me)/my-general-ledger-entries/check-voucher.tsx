import { createFileRoute } from '@tanstack/react-router'

import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'

import PageContainer from '@/components/containers/page-container'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(me)/my-general-ledger-entries/check-voucher'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <GeneralLedgerTable
                mode="current"
                TEntryType="check-voucher"
                excludeColumnIds={['balance']}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
