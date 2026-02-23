import { createFileRoute } from '@tanstack/react-router'

import FinancialStatementDefinitionPage from '@/modules/financial-statement-definition/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(accounting)/financial-statement-definition'
)({
    component: FinancialStatementDefinitionPage,
})
