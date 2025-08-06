import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import TimesheetTable from '@/components/tables/timesheet-table'
import TimesheetTableAction from '@/components/tables/timesheet-table/action'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(me)/(timesheets)/timesheets'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`timesheet.create.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'resource-query', 'all'],
        })
    })

    useSubscribe(`timesheet.update.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'resource-query', 'all'],
        })
    })

    useSubscribe(`timesheet.delete.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'resource-query', 'me'],
        })
    })

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
