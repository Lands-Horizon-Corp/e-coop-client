import { createFileRoute } from '@tanstack/react-router'

import CheckEntryPage from '@/modules/general-ledger/components/pages/check-entry'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/check-entry'
)({
    component: CheckEntryPage,
})
