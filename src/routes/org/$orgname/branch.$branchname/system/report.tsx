import { createFileRoute } from '@tanstack/react-router'

import ReportPage from '@/modules/generated-report/components/pages/report-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/system/report'
)({
    component: ReportPage,
})
