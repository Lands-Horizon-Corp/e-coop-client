import { createRoute, redirect } from '@tanstack/react-router'

import { ownerRoute } from '../../route'
import OwnerUserMemberRoute from './members/route'
import OwnerUserEmployeesRoute from './employees/route'

export const ownerUserRoute = createRoute({
    getParentRoute: () => ownerRoute,
    path: 'users',
})

export const ownerUserIndexRoute = createRoute({
    path: '/',
    getParentRoute: () => ownerUserRoute,
    beforeLoad: () => {
        throw redirect({
            to: '/owner/users/members/view-members',
        })
    },
})

const OwnerUserRoute = ownerUserRoute.addChildren([
    ownerUserIndexRoute,
    OwnerUserEmployeesRoute,
    OwnerUserMemberRoute,
])

export default OwnerUserRoute
