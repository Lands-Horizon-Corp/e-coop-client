import { createFileRoute } from '@tanstack/react-router'

import HolidayPage from '@/modules/holiday/components/pages/holidays'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/holidays'
)({
    component: HolidayPage,
})
