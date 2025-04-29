import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import { rootRoute } from '@/root-route'
import OwnerUserRoute from './pages/users/route'
import EmployeeTransactionRoute from './pages/transaction/route'
import EmployeeBranchRoute from './pages/branch/route'
import EmployeeMaintenanceRoute from './pages/transaction/maintenance/route'

export const employeeRoute = createRoute({
    path: 'employee',
    getParentRoute: () => rootRoute,
    component: lazyRouteComponent(() => import('@/pages/employee/layout')),
})

const employeeLandingRoute = createRoute({
    path: '/',
    getParentRoute: () => employeeRoute,
    component: lazyRouteComponent(() => import('./pages')),
})

const employeeDashboardRoute = createRoute({
    path: 'dashboard',
    getParentRoute: () => employeeRoute,
    component: lazyRouteComponent(() => import('./pages/dashboard')),
})

const employeeReportsRoute = createRoute({
    path: 'reports',
    getParentRoute: () => employeeRoute,
    component: lazyRouteComponent(() => import('./pages/reports')),
})

const employeeNotificationsRoute = createRoute({
    path: 'notifications',
    getParentRoute: () => employeeRoute,
    component: lazyRouteComponent(() => import('./pages/notifications')),
})

const employeeFootstepsRoute = createRoute({
    path: 'footsteps',
    getParentRoute: () => employeeRoute,
    component: lazyRouteComponent(() => import('./pages/footsteps')),
})

const employeeProfileRoute = createRoute({
    path: 'profile',
    getParentRoute: () => employeeRoute,
    component: lazyRouteComponent(() => import('./pages/profile')),
})

const employeeSettingsRoute = createRoute({
    path: 'settings',
    getParentRoute: () => employeeRoute,
    component: lazyRouteComponent(() => import('./pages/settings')),
})

const EmployeeRoute = employeeRoute.addChildren([
    OwnerUserRoute,
    EmployeeBranchRoute,
    employeeReportsRoute,
    employeeLandingRoute,
    employeeProfileRoute,
    employeeSettingsRoute,
    employeeDashboardRoute,
    employeeFootstepsRoute,
    EmployeeTransactionRoute,
    employeeNotificationsRoute,
    EmployeeMaintenanceRoute,
])

export default EmployeeRoute
