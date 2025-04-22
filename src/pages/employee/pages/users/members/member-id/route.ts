import { createRoute } from '@tanstack/react-router'

import ErrorPage from '@/pages/employee/components/error-page'

import { employeeUserMemberRoute } from '../route'
import { memberIdPathSchema } from './route-schema'
import MemberApplication from './member-application'
import { memberLoader } from '@/hooks/api-hooks/member/use-member'

const employeeMemberIdRoute = createRoute({
    getParentRoute: () => employeeUserMemberRoute,
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
    getParentRoute: () => employeeMemberIdRoute,
    path: 'member-application',
    component: MemberApplication,
})

const OwnerMemberIdRoute = employeeMemberIdRoute.addChildren([
    memberApplicationRoute,
])

export default OwnerMemberIdRoute
