import { createFileRoute } from '@tanstack/react-router'

import HolidayPage from '@/modules/holiday/components/pages/holidays'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/maintenance/holidays'
)({
    component: HolidayPage,
})
