import { createFileRoute } from '@tanstack/react-router'

import MutualFundPage from '@/modules/mutual-fund/components/pages/mutual-fund-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/system/generate-mutual-aid'
)({
    component: MutualFundPage,
})
