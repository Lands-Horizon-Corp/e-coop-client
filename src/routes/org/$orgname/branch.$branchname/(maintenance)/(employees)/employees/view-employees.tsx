import { createFileRoute } from '@tanstack/react-router'

import ViewEmployeePage from '@/modules/employee/components/pages/view-employees'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(employees)/employees/view-employees'
)({
    component: ViewEmployeePage,
})
