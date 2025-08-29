import { createFileRoute } from '@tanstack/react-router'

import LoanPurposePage from '@/modules/loan-purpose/components/page/loan-purpose'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/loan/loan-purpose'
)({
    component: LoanPurposePage,
})
