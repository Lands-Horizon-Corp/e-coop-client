import { createFileRoute } from '@tanstack/react-router'

import LoanStatusPage from '@/modules/loan-status/components/page/loan-status'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/loan/loan-status'
)({
    component: LoanStatusPage,
})
