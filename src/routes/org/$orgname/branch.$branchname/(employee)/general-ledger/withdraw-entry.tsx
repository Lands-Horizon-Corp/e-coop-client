import { createFileRoute } from '@tanstack/react-router'

import WithdrawEntryPage from '@/modules/general-ledger/components/pages/withdraw-entry'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/withdraw-entry'
)({
    component: WithdrawEntryPage,
})
