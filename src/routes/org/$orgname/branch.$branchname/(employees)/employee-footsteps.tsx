import { createFileRoute } from '@tanstack/react-router'

import EmployeeFootstepPage from '@/modules/employee/components/pages/employee-footsteps'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employees)/employee-footsteps'
)({
    component: EmployeeFootstepPage,
})
