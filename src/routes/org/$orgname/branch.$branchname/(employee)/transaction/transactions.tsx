import { createFileRoute } from '@tanstack/react-router'

import TransactionPage from '@/modules/transaction/components/pages/transaction-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/transactions'
)({
    component: TransactionPage,
})
