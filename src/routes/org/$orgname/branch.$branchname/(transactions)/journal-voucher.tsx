import { createFileRoute } from '@tanstack/react-router'

import JournalVoucherPage from '@/modules/journal-voucher/pages/journal-voucher'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(transactions)/journal-voucher'
)({
    component: () => <JournalVoucherPage />,
})
