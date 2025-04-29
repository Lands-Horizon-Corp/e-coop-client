import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import { ownerRoute } from '../../route'

export const ownerAccountingRoute = createRoute({
    getParentRoute: () => ownerRoute,
    path: '/accounting',
})

const ownerAccountingIndexRoute = createRoute({
    getParentRoute: () => ownerAccountingRoute,
    path: '/',
    beforeLoad: () => redirect({ to: '/owner/accounting/accounts' }),
})

const ownerAccountingAccountsRoute = createRoute({
    getParentRoute: () => ownerAccountingRoute,
    path: 'accounts',
    component: lazyRouteComponent(() => import('./accounts-page')),
})

const ownerAccountingComputationRoute = createRoute({
    getParentRoute: () => ownerAccountingRoute,
    path: 'computation-type',
    component: lazyRouteComponent(() => import('./accounts-computation-page')),
})

const OwnerAccountingRoute = ownerAccountingRoute.addChildren([
    ownerAccountingIndexRoute,
    ownerAccountingAccountsRoute,
    ownerAccountingComputationRoute,
])

export default OwnerAccountingRoute
