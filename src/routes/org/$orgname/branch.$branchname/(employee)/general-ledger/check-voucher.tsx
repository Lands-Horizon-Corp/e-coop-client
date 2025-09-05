import { createFileRoute } from '@tanstack/react-router'

import CheckVoucherEntryPage from '@/modules/general-ledger/components/pages/check-voucher-entry'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/check-voucher'
)({
    component: CheckVoucherEntryPage,
})
