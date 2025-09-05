import { createFileRoute } from '@tanstack/react-router'

import DisbursementPage from '@/modules/disbursement/components/pages/disbursement'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/disbursement'
)({
    component: DisbursementPage,
})
