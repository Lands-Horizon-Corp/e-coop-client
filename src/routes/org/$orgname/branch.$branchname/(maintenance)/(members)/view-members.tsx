import { createFileRoute } from '@tanstack/react-router'

import ViewMemberProfilePage from '@/modules/member-profile/pages/member-profile-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/view-members'
)({
    component: ViewMemberProfilePage,
})
