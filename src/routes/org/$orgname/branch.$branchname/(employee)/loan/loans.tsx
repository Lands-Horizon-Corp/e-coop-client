import { createFileRoute } from '@tanstack/react-router'

import LoansPage from '@/modules/loan-transaction/components/pages/loans'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/loan/loans'
)({
    component: LoansPage,
})
