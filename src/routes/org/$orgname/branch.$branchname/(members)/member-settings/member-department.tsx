import { createFileRoute } from '@tanstack/react-router'

import MemberDepartmentPage from '@/modules/member-department/components/pages/member-department'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(members)/member-settings/member-department'
)({
    component: MemberDepartmentPage,
})
