import { createFileRoute } from '@tanstack/react-router'

import DisbursementTransactionPage from '@/modules/disbursement-transaction/components/pages/disbursement-transaction'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(transactions)/disbursement-transaction'
)({
    component: DisbursementTransactionPage,
})
