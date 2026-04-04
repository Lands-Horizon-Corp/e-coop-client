import { createFileRoute } from '@tanstack/react-router'

import OtherFundPage from '@/modules/other-fund/pages/other-fund-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(transactions)/other-fund'
)({
    component: OtherFundPage,
})
