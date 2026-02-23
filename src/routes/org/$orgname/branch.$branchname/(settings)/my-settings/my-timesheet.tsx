import { createFileRoute } from '@tanstack/react-router'

import MyTimesheetPage from '@/modules/user/components/pages/my-timesheet'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(settings)/my-settings/my-timesheet'
)({
    component: MyTimesheetPage,
})
