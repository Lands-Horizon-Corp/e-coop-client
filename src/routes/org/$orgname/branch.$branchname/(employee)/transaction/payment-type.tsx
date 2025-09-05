import { createFileRoute } from '@tanstack/react-router'

import PaymentType from '@/modules/payment-type/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/payment-type'
)({
    component: () => <PaymentType />,
})
