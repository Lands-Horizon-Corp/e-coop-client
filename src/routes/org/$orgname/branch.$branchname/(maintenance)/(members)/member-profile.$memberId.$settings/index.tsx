import { createFileRoute } from '@tanstack/react-router'

import MemberProfileSettingsPage from '@/modules/member-profile/pages/member-profile-settings-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/member-profile/$memberId/$settings/'
)({
    component: MemberProfileSettingsPage,
})
