import { createFileRoute } from '@tanstack/react-router'

import TransactionBatchPage from '@/modules/transaction-batch/components/pages/transaction-batch'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(blotter)/transaction-batch'
)({
    component: TransactionBatchPage,
})
