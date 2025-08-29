import { createFileRoute } from '@tanstack/react-router'

import ApprovalPage from '@/modules/approvals/components/pages/approval'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/approvals/'
)({
    component: ApprovalPage,
})
