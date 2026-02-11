import { createFileRoute } from '@tanstack/react-router'

import AreaPage from '@/modules/area/components/pages/area-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/maintenance/area'
)({
    component: AreaPage,
})
