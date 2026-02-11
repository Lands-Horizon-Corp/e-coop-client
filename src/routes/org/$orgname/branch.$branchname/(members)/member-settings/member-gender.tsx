import { createFileRoute } from '@tanstack/react-router'

import MemberGenderPage from '@/modules/member-gender/components/pages/member-gender'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(members)/member-settings/member-gender'
)({
    component: MemberGenderPage,
})
