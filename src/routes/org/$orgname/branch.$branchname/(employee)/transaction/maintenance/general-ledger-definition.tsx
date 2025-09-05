import { createFileRoute } from '@tanstack/react-router'

import GeneralLedgerDefinition from '@/modules/general-ledger-definition/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/maintenance/general-ledger-definition'
)({
    component: () => <GeneralLedgerDefinition />,
})
