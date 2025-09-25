import { createFileRoute } from '@tanstack/react-router'

import CompanyPage from '@/modules/company/pages/company-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/company'
)({
    component: () => <CompanyPage />,
})
