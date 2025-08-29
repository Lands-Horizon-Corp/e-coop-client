import { createFileRoute } from '@tanstack/react-router'

import CollateralPage from '@/modules/collateral/components/pages/collateral'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/collateral'
)({
    component: CollateralPage,
})
