import { createFileRoute } from '@tanstack/react-router'

import { QuickDepositWithdraw } from '@/modules/quick-transfer'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/quick-transfer/deposit'
)({
    component: () => <QuickDepositWithdraw mode="deposit" />,
})
