import { rootRoute } from '@/root-route'
import { createRoute } from '@tanstack/react-router'

import PublicPracticeLayout from './layout'

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
