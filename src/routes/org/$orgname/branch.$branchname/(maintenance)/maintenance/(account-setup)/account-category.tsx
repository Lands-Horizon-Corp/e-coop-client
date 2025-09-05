import { createFileRoute } from '@tanstack/react-router'

import AccountCategoryPage from '@/modules/account-category/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(account-setup)/account-category'
)({
    component: () => <AccountCategoryPage />,
})
