import { createFileRoute } from '@tanstack/react-router'

import MemberTypePage from '@/modules/member-type/components/pages/member-types'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(members)/member-settings/member-types'
)({
    component: MemberTypePage,
})
