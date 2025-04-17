import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import { rootRoute } from '@/root-route'

const employeeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'employee',
    component: lazyRouteComponent(() => import('@/pages/employee/layout')),
})

const employeeLandingRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: '/',
    component: lazyRouteComponent(() => import('./pages')),
})

const employeeDashboardRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: 'dashboard',
    component: lazyRouteComponent(() => import('./pages/dashboard')),
})

const employeeMembersRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: '/users/members',
    component: lazyRouteComponent(() => import('./pages/users/members')),
})

const employeeBranchRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: 'branch',
    component: lazyRouteComponent(() => import('./pages/branch')),
})

const employeeReportsRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: 'reports',
    component: lazyRouteComponent(() => import('./pages/reports')),
})

const employeeNotificationsRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: 'notifications',
    component: lazyRouteComponent(() => import('./pages/notifications')),
})

const employeeFootstepsRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: 'footsteps',
    component: lazyRouteComponent(() => import('./pages/footsteps')),
})

const employeeProfileRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: 'profile',
    component: lazyRouteComponent(() => import('./pages/profile')),
})

const employeeSettingsRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: 'settings',
    component: lazyRouteComponent(() => import('./pages/settings')),
})

const EmployeeRoute = employeeRoute.addChildren([
    employeeBranchRoute,
    employeeMembersRoute,
    employeeReportsRoute,
    employeeLandingRoute,
    employeeProfileRoute,
    employeeSettingsRoute,
    employeeDashboardRoute,
    employeeFootstepsRoute,
    employeeNotificationsRoute,
])

export default EmployeeRoute
