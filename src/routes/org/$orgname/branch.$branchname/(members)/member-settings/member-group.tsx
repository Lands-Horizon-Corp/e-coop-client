import { createFileRoute } from '@tanstack/react-router'

import MemberGroupPage from '@/modules/member-group/components/pages/member-group'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(members)/member-settings/member-group'
)({
    component: MemberGroupPage,
})
