import { createFileRoute } from '@tanstack/react-router'

import DisbursementTransactionPage from '@/modules/disbursement-transaction/components/pages/disbursement-transaction'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/disbursement-transaction'
)({
    component: DisbursementTransactionPage,
})
