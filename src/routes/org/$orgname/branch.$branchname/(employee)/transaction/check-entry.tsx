import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import CheckEntryTable from '@/components/tables/check-entry-table'
import CheckEntryTableAction from '@/components/tables/check-entry-table/action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/check-entry'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <CheckEntryTable
                actionComponent={(props) => (
                    <CheckEntryTableAction {...props} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
