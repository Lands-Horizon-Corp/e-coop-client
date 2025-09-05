import { createFileRoute } from '@tanstack/react-router'

import BankPage from '@/modules/bank/components/pages/banks'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/banks'
)({
    component: BankPage,
})
