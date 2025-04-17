import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import { ownerRoute } from '../../route'
import OwnerBranchRoute from './branch/route'

export const ownerCompanyRoute = createRoute({
    getParentRoute: () => ownerRoute,
    path: '/company',
})

const ownerCompanyIndexRoute = createRoute({
    getParentRoute: () => ownerCompanyRoute,
    path: '/',
    beforeLoad: () => redirect({ to: '/owner/company/profile' }),
})

const ownerCompanyProfileRoute = createRoute({
    getParentRoute: () => ownerCompanyRoute,
    path: 'profile',
    component: lazyRouteComponent(() => import('./company-profile-page')),
})

const OwnerCompanyRoute = ownerCompanyRoute.addChildren([
    ownerCompanyIndexRoute,
    ownerCompanyProfileRoute,
    OwnerBranchRoute,
])

export default OwnerCompanyRoute
