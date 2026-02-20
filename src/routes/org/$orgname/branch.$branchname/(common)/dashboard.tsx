import { createFileRoute } from '@tanstack/react-router'

import Dashboard from '@/modules/dashboard/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(common)/dashboard'
)({
    component: Dashboard,
})
