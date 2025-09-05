import { createFileRoute } from '@tanstack/react-router'

import CashEntryPage from '@/modules/general-ledger/components/pages/cash-entry'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/cash-entry'
)({
    component: CashEntryPage,
})
