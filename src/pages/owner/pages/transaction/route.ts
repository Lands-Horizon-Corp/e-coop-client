import { createRoute, redirect } from '@tanstack/react-router'
import { ownerRoute } from '../../route'
import { lazyRouteComponent } from '@tanstack/react-router'

export const ownerTransactionRoute = createRoute({
    getParentRoute: () => ownerRoute,
    path: '/transaction',
})

export const ownerTransactionIndexRoute = createRoute({
    getParentRoute: () => ownerTransactionRoute,
    path: '/',
    beforeLoad: () => {
        throw redirect({ to: '/owner/transaction/fund-movement' })
    },
})

export const ownerTransactionPaymentsEntry = createRoute({
    getParentRoute: () => ownerTransactionRoute,
    path: '/fund-movement',
    component: lazyRouteComponent(() => import('./payments-entry-page')),
})

export const ownerTransactionPaymentType = createRoute({
    getParentRoute: () => ownerTransactionRoute,
    path: '/payment-types',
    component: lazyRouteComponent(
        () => import('./transaction-payment-type-page')
    ),
})

export const OwnerTransactionRoute = ownerTransactionRoute.addChildren([
    ownerTransactionPaymentType,
    ownerTransactionIndexRoute,
    ownerTransactionPaymentsEntry,
])
