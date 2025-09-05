import { createFileRoute } from '@tanstack/react-router'

import FinancialStatementDefinition from '@/modules/financial-statement-definition/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/maintenance/financial-statement-definition'
)({
    component: () => <FinancialStatementDefinition />,
})
