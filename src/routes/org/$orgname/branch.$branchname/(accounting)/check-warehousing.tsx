import { createFileRoute } from '@tanstack/react-router'

import CheckWarehousingPage from '@/modules/check-warehousing/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(accounting)/check-warehousing'
)({
    component: CheckWarehousingPage,
})
