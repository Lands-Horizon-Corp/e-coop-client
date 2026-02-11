import { createFileRoute } from '@tanstack/react-router'

import { QuickDepositWithdraw } from '@/modules/quick-transfer'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(transactions)/withdraw'
)({
    component: () => <QuickDepositWithdraw mode="withdraw" />,
})
