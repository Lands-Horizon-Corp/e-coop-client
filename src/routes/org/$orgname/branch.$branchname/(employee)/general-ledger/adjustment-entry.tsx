import { createFileRoute } from '@tanstack/react-router'

import AdjustmentEntryPage from '@/modules/general-ledger/components/pages/adjustment-entry'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/adjustment-entry'
)({
    component: AdjustmentEntryPage,
})
