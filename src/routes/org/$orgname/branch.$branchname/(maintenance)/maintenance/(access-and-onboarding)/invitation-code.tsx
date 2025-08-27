import { createFileRoute } from '@tanstack/react-router'

import InvitationCode from '@/modules/invitation-code/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(access-and-onboarding)/invitation-code'
)({
    component: () => <InvitationCode />,
})
