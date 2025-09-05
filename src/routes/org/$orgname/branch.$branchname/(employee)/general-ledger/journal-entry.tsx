import { createFileRoute } from '@tanstack/react-router'

import JournalEntryPage from '@/modules/general-ledger/components/pages/journal-entry'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/journal-entry'
)({
    component: JournalEntryPage,
})
