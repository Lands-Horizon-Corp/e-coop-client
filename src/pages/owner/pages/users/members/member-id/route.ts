import { createRoute } from '@tanstack/react-router'

import ErrorPage from '@/pages/owner/components/error-page'

import { ownerUserMemberRoute } from '../route'
import { memberIdPathSchema } from './route-schema'
import MemberApplication from './member-application'
import { memberLoader } from '@/hooks/api-hooks/member/use-member'

const ownerMemberIdRoute = createRoute({
    getParentRoute: () => ownerUserMemberRoute,
    path: '$memberId',
    params: {
        parse: memberIdPathSchema.parse,
    },
    errorComponent: ErrorPage,
    loader: async ({ context, params: { memberId } }) => {
        await context.queryClient.ensureQueryData(memberLoader(memberId))
    },
})

const memberApplicationRoute = createRoute({
    getParentRoute: () => ownerMemberIdRoute,
    path: 'member-application',
    component: MemberApplication,
})

const OwnerMemberIdRoute = ownerMemberIdRoute.addChildren([
    memberApplicationRoute,
])

export default OwnerMemberIdRoute
