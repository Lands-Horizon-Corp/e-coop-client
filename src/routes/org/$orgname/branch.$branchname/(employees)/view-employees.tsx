import { createFileRoute } from '@tanstack/react-router'

import ViewEmployeePage from '@/modules/employee/components/pages/view-employees'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employees)/view-employees'
)({
    component: ViewEmployeePage,
})
