import { createFileRoute } from '@tanstack/react-router'

import JournalVoucherEntryPage from '@/modules/general-ledger/components/pages/journal-voucher-entry'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/journal-voucher'
)({
    component: JournalVoucherEntryPage,
})
