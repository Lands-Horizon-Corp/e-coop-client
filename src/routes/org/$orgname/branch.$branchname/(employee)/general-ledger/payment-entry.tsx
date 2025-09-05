import { createFileRoute } from '@tanstack/react-router'

import PaymentEntryPage from '@/modules/general-ledger/components/pages/payment-entry'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/general-ledger/payment-entry'
)({
    component: PaymentEntryPage,
})
