import { createFileRoute } from '@tanstack/react-router'

import CashCheckJournalVoucherPage from '@/modules/cash-check-voucher/pages/cash-check-voucher'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/accounting/cash-check-journal-voucher'
)({
    component: () => <CashCheckJournalVoucherPage />,
})
