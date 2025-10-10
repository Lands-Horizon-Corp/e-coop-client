import { createFileRoute } from '@tanstack/react-router'

import LoanPaymentPage from '@/modules/loan-payment/pages/loan-payment-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/loan-payment'
)({
    component: LoanPaymentPage,
})
