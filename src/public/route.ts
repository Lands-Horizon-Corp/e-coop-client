import { createRoute } from '@tanstack/react-router'

import PublicPracticeLayout from './layout'
import { rootRoute } from '@/root-route'

const publicPracticeRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'practice',
    component: PublicPracticeLayout,
})

const practiceRoute = createRoute({
    getParentRoute: () => publicPracticeRoute,
    path: 'practice',
    component: PublicPracticeLayout,
})

const practiceLandingRoute = publicPracticeRoute.addChildren([practiceRoute])

export default practiceLandingRoute
