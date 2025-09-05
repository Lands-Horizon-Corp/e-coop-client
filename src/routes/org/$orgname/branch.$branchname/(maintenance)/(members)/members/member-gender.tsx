import { createFileRoute } from '@tanstack/react-router'

import MemberGenderPage from '@/modules/member-gender/components/pages/member-gender'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-gender'
)({
    component: MemberGenderPage,
})
