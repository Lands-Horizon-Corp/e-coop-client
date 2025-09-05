import { createFileRoute } from '@tanstack/react-router'

import MemberCenterPage from '@/modules/member-center/components/pages/member-center'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-center'
)({
    component: MemberCenterPage,
})
