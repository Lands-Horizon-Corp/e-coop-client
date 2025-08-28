import { createFileRoute } from '@tanstack/react-router'

import DepositEntryPage from '@/modules/general-ledger/components/pages/deposit-entry'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/deposit-entry'
)({
    component: DepositEntryPage,
})
