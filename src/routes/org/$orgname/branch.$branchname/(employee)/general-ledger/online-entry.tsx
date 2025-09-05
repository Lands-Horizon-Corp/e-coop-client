import { createFileRoute } from '@tanstack/react-router'

import OnlineEntryPage from '@/modules/general-ledger/components/pages/online-entry'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/online-entry'
)({
    component: OnlineEntryPage,
})
