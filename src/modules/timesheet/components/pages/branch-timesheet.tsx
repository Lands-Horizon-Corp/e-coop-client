import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useSubscribe } from '@/hooks/use-pubsub'

import TimesheetTable from '../timesheet-table'
import TimesheetAction from '../timesheet-table/row-action-context'

const BranchTimesheetPage = () => {
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`timesheet.create.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'paginated', 'all'],
        })
    })

    useSubscribe(`timesheet.update.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'paginated', 'all'],
        })
    })

    useSubscribe(`timesheet.delete.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['timesheet', 'paginated', 'me'],
        })
    })

    return (
        <PageContainer>
            <TimesheetTable
                actionComponent={TimesheetAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
                mode="all"
            />
        </PageContainer>
    )
}

export default BranchTimesheetPage
