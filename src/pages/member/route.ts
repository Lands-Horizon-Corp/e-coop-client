import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import { rootRoute } from '@/root-route'

const memberRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'member',
    component: lazyRouteComponent(() => import('@/pages/member/layout')),
})

const memberLandingRoute = createRoute({
    getParentRoute: () => memberRoute,
    path: '/',
    component: lazyRouteComponent(() => import('@/pages/member/pages')),
})

const memberDashboardRoute = createRoute({
    getParentRoute: () => memberRoute,
    path: '/dashboard',
    component: lazyRouteComponent(() => import('./pages/dashboard')),
})

const memberProfileRoute = createRoute({
    getParentRoute: () => memberRoute,
    path: '/profile',
    component: lazyRouteComponent(() => import('./pages/profile')),
})

const memberNotificationRoute = createRoute({
    getParentRoute: () => memberRoute,
    path: '/notifications',
    component: lazyRouteComponent(() => import('./pages/notifications')),
})

const memberMessagesRoute = createRoute({
    getParentRoute: () => memberRoute,
    path: '/messages',
    component: lazyRouteComponent(() => import('./pages/messages')),
})

const memberSettingsRoute = createRoute({
    getParentRoute: () => memberRoute,
    path: '/settings',
    component: lazyRouteComponent(() => import('./pages/settings')),
})

const MemberRoute = memberRoute.addChildren([
    memberLandingRoute,
    memberDashboardRoute,
    memberProfileRoute,
    memberNotificationRoute,
    memberMessagesRoute,
    memberSettingsRoute,
])

export default MemberRoute
