import { createFileRoute } from '@tanstack/react-router'

import DisbursementTypePage from '@/modules/disbursement/components/pages/disbursement'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/maintenance/accounts/disbursement-type'
)({
    component: DisbursementTypePage,
})
