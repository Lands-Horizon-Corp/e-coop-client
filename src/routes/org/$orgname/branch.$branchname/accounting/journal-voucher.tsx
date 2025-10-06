import { createFileRoute } from '@tanstack/react-router'

import JournalVoucherPage from '@/modules/journal-voucher/pages/journal-voucher'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/accounting/journal-voucher'
)({
    component: () => <JournalVoucherPage />,
})
