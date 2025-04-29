import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import { employeeUserRoute } from '../route'
import EmployeeMemberIdRoute from './member-id/route'

export const employeeUserMemberRoute = createRoute({
    getParentRoute: () => employeeUserRoute,
    path: '/members',
})

const employeeUserMemberIndexRoute = createRoute({
    getParentRoute: () => employeeUserMemberRoute,
    path: '/',
    beforeLoad: () => redirect({ to: '/owner/users/members/view-members' }),
})

const employeeViewMembersRoute = createRoute({
    getParentRoute: () => employeeUserMemberRoute,
    path: 'view-members',
    component: lazyRouteComponent(() => import('./view-members-page')),
})

const employeeMembersActivityRoute = createRoute({
    getParentRoute: () => employeeUserMemberRoute,
    path: 'members-activity',
    component: lazyRouteComponent(() => import('./members-activity-page')),
})

const employeeMemberTypesRoute = createRoute({
    getParentRoute: () => employeeUserMemberRoute,
    path: 'member-types',
    component: lazyRouteComponent(() => import('./member-types-page')),
})

const employeeMemberCenterRoute = createRoute({
    getParentRoute: () => employeeUserMemberRoute,
    path: 'member-center',
    component: lazyRouteComponent(() => import('./member-center-page')),
})

const employeeEducationalAttainmentRoute = createRoute({
    getParentRoute: () => employeeUserMemberRoute,
    path: '/member-educational-attainments',
    component: lazyRouteComponent(
        () => import('./member-educational-attainment-page')
    ),
})

const employeeMemberClassificationRoute = createRoute({
    getParentRoute: () => employeeUserMemberRoute,
    path: '/member-classification',
    component: lazyRouteComponent(() => import('./member-classification-page')),
})

const employeeMemberOccupationRoute = createRoute({
    getParentRoute: () => employeeUserMemberRoute,
    path: '/member-occupation',
    component: lazyRouteComponent(() => import('./member-occupation-page')),
})

export const employeeGenderRoute = createRoute({
    path: 'genders',
    getParentRoute: () => employeeUserMemberRoute,
    component: lazyRouteComponent(() => import('./genders-page')),
})

const OwnerUserMemberRoute = employeeUserMemberRoute.addChildren([
    employeeGenderRoute,
    EmployeeMemberIdRoute,
    employeeViewMembersRoute,
    employeeMemberTypesRoute,
    employeeMemberCenterRoute,
    employeeUserMemberIndexRoute,
    employeeMembersActivityRoute,
    employeeMemberOccupationRoute,
    employeeMemberClassificationRoute,
    employeeEducationalAttainmentRoute,
])

export default OwnerUserMemberRoute
