import { createFileRoute } from '@tanstack/react-router'

import AccountTransactionPage from '@/modules/account-transaction/components/pages/account-transaction-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/system/account-transaction'
)({
    component: AccountTransactionPage,
})
