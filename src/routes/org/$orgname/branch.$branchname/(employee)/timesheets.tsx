import { createFileRoute } from '@tanstack/react-router'

import BranchTimesheetPage from '@/modules/timesheet/components/pages/branch-timesheet'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/timesheets'
)({
    component: BranchTimesheetPage,
})
