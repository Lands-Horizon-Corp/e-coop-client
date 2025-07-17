import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import OnlineEntryTable from '@/components/tables/online-entry-table'
import OnlineEntryTableAction from '@/components/tables/online-entry-table/action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/online-entry'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <OnlineEntryTable
                actionComponent={(props) => (
                    <OnlineEntryTableAction {...props} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
