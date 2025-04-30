import { createRoute } from '@tanstack/react-router'

import { rootRoute } from '@/root-route'
import React from 'react'

const testRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'test',
    component: React.lazy(() => import('./layout')),
})

const testLandingRoute = createRoute({
    getParentRoute: () => testRoute,
    path: '/upload',
    component: React.lazy(() => import('./pages/upload')),
})

const TestRoute = testRoute.addChildren([testLandingRoute])

export default TestRoute
