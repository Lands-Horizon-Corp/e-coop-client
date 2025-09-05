import { createFileRoute } from '@tanstack/react-router'

import { AccountClassificationPage } from '@/modules/account-classification'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(account-setup)/account-classification'
)({
    component: () => <AccountClassificationPage />,
})
