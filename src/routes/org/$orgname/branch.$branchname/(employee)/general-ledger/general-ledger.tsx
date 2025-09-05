import { createFileRoute } from '@tanstack/react-router'

import GeneralLedgerPage from '@/modules/general-ledger/components/pages/general-ledger'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/general-ledger'
)({
    component: GeneralLedgerPage,
})
