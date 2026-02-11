import { createFileRoute } from '@tanstack/react-router'

import GeneralLedgerDefinitionPage from '@/modules/general-ledger-definition/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(blotter)/general-ledger-definition'
)({
    component: GeneralLedgerDefinitionPage,
})
