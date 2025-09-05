import { createFileRoute } from '@tanstack/react-router'

import MemberAccountingLedgerPage from '@/modules/member-accounting-ledger/components/pages/member-accounting-ledger'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/member-accounting-ledger'
)({
    component: MemberAccountingLedgerPage,
})
