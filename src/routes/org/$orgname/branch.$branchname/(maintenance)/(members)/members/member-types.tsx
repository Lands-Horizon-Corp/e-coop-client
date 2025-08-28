import { createFileRoute } from '@tanstack/react-router'

import MemberTypePage from '@/modules/member-type/components/pages/member-types'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-types'
)({
    component: MemberTypePage,
})
