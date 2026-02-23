import { createFileRoute } from '@tanstack/react-router'

import CashCountPage from '@/modules/cash-count/components/pages/cash-count'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(blotter)/cash-count'
)({
    component: CashCountPage,
})
