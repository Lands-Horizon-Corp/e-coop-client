import { createFileRoute } from '@tanstack/react-router'

import ComputationSheetPage from '@/modules/computation-sheet/components/pages/computation-sheet'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/loan/computation-sheet-scheme/'
)({
    component: ComputationSheetPage,
})
