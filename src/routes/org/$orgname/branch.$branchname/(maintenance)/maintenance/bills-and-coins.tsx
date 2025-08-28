import { createFileRoute } from '@tanstack/react-router'

import BillsAndCoinsPage from '@/modules/bill-and-coins/components/pages/bills-and-coins-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/bills-and-coins'
)({
    component: BillsAndCoinsPage,
})
