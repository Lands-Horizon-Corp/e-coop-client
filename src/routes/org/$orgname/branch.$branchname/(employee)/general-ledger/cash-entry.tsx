import CashEntryPage from '@/modules/general-ledger/components/pages/cash-entry'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/cash-entry'
)({
    component: CashEntryPage,
})

