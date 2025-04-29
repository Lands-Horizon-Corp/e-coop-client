import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import { rootRoute } from '@/root-route'
import AdminMemberManagementRoute from './pages/members/route'
import AdminCompaniesManagementRoute from './pages/companies-management/route'

export const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'admin',
    component: lazyRouteComponent(() => import('./layout')),
})

const adminLandingRoute = createRoute({
    getParentRoute: () => adminRoute,
    path: '/',
    component: lazyRouteComponent(() => import('./pages')),
})

const adminDashboardRoute = createRoute({
    getParentRoute: () => adminRoute,
    path: 'dashboard',
    component: lazyRouteComponent(() => import('./pages/dashboard')),
})

const adminFootstepTrackingRoute = createRoute({
    getParentRoute: () => adminRoute,
    path: 'footstep-tracking',
    component: lazyRouteComponent(() => import('./pages/footsteps')),
})

const adminProfileRoute = createRoute({
    getParentRoute: () => adminRoute,
    path: 'profile',
    component: lazyRouteComponent(() => import('./pages/profile')),
})

const adminNotificationsRoute = createRoute({
    getParentRoute: () => adminRoute,
    path: 'notifications',
    component: lazyRouteComponent(
        () => import('./pages/notifications/view-notifications')
    ),
})

const adminSettingsRoute = createRoute({
    getParentRoute: () => adminRoute,
    path: 'settings',
    component: lazyRouteComponent(() => import('./pages/settings')),
})

const adminFeedbacksRoute = createRoute({
    getParentRoute: () => adminRoute,
    path: 'feedbacks',
    component: lazyRouteComponent(
        () => import('./pages/feedbacks/view-feedback')
    ),
})

const AdminRoute = adminRoute.addChildren([
    adminLandingRoute,
    adminDashboardRoute,

    AdminMemberManagementRoute,
    AdminCompaniesManagementRoute,

    adminProfileRoute,
    adminSettingsRoute,
    adminNotificationsRoute,
    adminFootstepTrackingRoute,
    adminFeedbacksRoute,
])

export default AdminRoute
