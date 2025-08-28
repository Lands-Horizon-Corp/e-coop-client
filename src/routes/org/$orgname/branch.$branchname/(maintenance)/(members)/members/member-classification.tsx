import MemberClassificationPage from '@/modules/member-classification/components/pages/member-classification'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-classification'
)({
    component: MemberClassificationPage,
})
