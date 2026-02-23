import { createFileRoute } from '@tanstack/react-router'

import LoanApplicationPage from '@/modules/loan-transaction/components/pages/loan-application'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/maintenance/loans/loan-application'
)({
    component: LoanApplicationPage,
})
