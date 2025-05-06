import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import { rootRoute } from '@/root-route'

const organizationRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'organization',
    component: lazyRouteComponent(() => import('./layout')),
})

const memberLandingRoute = createRoute({
    getParentRoute: () => organizationRoute,
    path: '/$organization_name',
    // component: lazyRouteComponent(() => import('@/pages/member/pages')),
})

const OrganizationRoute = organizationRoute.addChildren([memberLandingRoute])

export default OrganizationRoute
