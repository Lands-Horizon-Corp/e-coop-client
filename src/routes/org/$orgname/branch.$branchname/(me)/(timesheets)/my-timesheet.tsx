import { useQueryClient } from '@tanstack/react-query'

import { useAuthUser } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import TimesheetTable from '@/components/tables/timesheet-table'
import TimesheetTableAction from '@/components/tables/timesheet-table/action'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(me)/(timesheets)/my-timesheet'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: { user },
    } = useAuthUser()
    const queryClient = useQueryClient()

    useSubscribe(`timesheet.create.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'resource-query', 'me'],
        })
    })

    useSubscribe(`timesheet.update.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'resource-query', 'me'],
        })
    })

    useSubscribe(`timesheet.delete.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'resource-query', 'me'],
        })
    })

    return (
        <PageContainer>
            <TimesheetTable
                mode="me"
                actionComponent={TimesheetTableAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
