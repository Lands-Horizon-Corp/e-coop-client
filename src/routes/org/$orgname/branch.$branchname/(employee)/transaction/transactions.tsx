import { createFileRoute } from '@tanstack/react-router'

import TransactionPage from '@/modules/transactions/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/transactions'
)({
    component: () => <TransactionPage />,
})
