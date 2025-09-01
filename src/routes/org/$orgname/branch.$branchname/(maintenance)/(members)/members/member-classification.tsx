import { createFileRoute } from '@tanstack/react-router'

import MemberClassificationPage from '@/modules/member-classification/components/pages/member-classification'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-classification'
)({
    component: MemberClassificationPage,
})
