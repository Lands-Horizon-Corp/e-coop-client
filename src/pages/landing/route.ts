import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import { rootRoute } from '@/root-route'

const landingRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'public',
    component: lazyRouteComponent(() => import('@/pages/landing/layout')),
})

const landingIndexRoute = createRoute({
    getParentRoute: () => landingRoute,
    path: '/',
    component: lazyRouteComponent(() => import('@/pages/landing/pages')),
})

const aboutRoute = createRoute({
    getParentRoute: () => landingRoute,
    path: 'about',
    component: lazyRouteComponent(() => import('@/pages/landing/pages/about')),
})

const contactRoute = createRoute({
    getParentRoute: () => landingRoute,
    path: 'contact',
    component: lazyRouteComponent(
        () => import('@/pages/landing/pages/contact')
    ),
})

const developersRoute = createRoute({
    getParentRoute: () => landingRoute,
    path: 'developers',
    component: lazyRouteComponent(
        () => import('@/pages/landing/pages/developers')
    ),
})

const LandingRoute = landingRoute.addChildren([
    aboutRoute,
    contactRoute,
    developersRoute,
    landingIndexRoute,
])

export default LandingRoute
