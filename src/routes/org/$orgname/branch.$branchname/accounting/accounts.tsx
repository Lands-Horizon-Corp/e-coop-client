import { createFileRoute } from '@tanstack/react-router'

import Account from '@/modules/account/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/accounting/accounts'
)({
    component: () => <Account />,
})
