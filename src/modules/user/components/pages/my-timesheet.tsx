import { useQueryClient } from '@tanstack/react-query'

import { useAuthUser } from '@/modules/authentication/authgentication.store'
import TimesheetTable from '@/modules/timesheet/components/timesheet-table'
import TimesheetAction from '@/modules/timesheet/components/timesheet-table/row-action-context'

import PageContainer from '@/components/containers/page-container'

import { useSubscribe } from '@/hooks/use-pubsub'

const MyTimesheetPage = () => {
    const {
        currentAuth: { user },
    } = useAuthUser()
    const queryClient = useQueryClient()

    useSubscribe(`timesheet.create.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'paginated', 'me'],
        })
    })

    useSubscribe(`timesheet.update.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'paginated', 'me'],
        })
    })

    useSubscribe(`timesheet.delete.user.${user.id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'paginated', 'me'],
        })
    })

    return (
        <PageContainer>
            <TimesheetTable
                mode="me"
                actionComponent={TimesheetAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default MyTimesheetPage
