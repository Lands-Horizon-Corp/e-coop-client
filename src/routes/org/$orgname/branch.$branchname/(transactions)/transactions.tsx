import { createFileRoute } from '@tanstack/react-router'

import TransactionPage from '@/modules/transactions/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(transactions)/transactions'
)({
    component: () => <TransactionPage />,
})
