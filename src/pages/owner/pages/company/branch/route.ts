import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import { ownerCompanyRoute } from '../route'
import OwnerBranchIdRoute from './branch-id/route'

export const ownerBranchRoute = createRoute({
    getParentRoute: () => ownerCompanyRoute,
    path: 'branches',
})

export const ownerCompanyBranchIndexRoute = createRoute({
    getParentRoute: () => ownerBranchRoute,
    path: '/',
    component: lazyRouteComponent(() => import('./branches-page')),
})

const OwnerBranchRoute = ownerBranchRoute.addChildren([
    ownerCompanyBranchIndexRoute,
    OwnerBranchIdRoute,
])

export default OwnerBranchRoute
