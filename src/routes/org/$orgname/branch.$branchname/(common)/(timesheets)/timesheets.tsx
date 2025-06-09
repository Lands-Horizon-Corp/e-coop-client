import { createFileRoute } from '@tanstack/react-router'

import TimesheetTable from '@/components/tables/timesheet-table'
import PageContainer from '@/components/containers/page-container'
import TimesheetTableAction from '@/components/tables/timesheet-table/action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(common)/(timesheets)/timesheets'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <TimesheetTable
                mode="all"
                actionComponent={TimesheetTableAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
