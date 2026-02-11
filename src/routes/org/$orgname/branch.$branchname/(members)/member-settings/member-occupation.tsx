import { createFileRoute } from '@tanstack/react-router'

import MemberOccupationPage from '@/modules/member-occupation/components/pages/member-occupation'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(members)/member-settings/member-occupation'
)({
    component: MemberOccupationPage,
})
