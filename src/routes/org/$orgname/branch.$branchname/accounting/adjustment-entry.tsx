import { createFileRoute } from '@tanstack/react-router'

import AdjustmentEntryPage from '@/modules/adjustment-entry/pages/adjustment-entry-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/accounting/adjustment-entry'
)({
    component: () => <AdjustmentEntryPage />,
})
