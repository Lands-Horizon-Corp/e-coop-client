import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import { employeeRoute } from '../../route'

export const employeeAccountingRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: '/accounting',
})

const employeeAccountingIndexRoute = createRoute({
    getParentRoute: () => employeeAccountingRoute,
    path: '/',
    beforeLoad: () => redirect({ to: '/employee/accounting/accounts' }),
})

const employeeAccountingAccountsRoute = createRoute({
    getParentRoute: () => employeeAccountingRoute,
    path: 'accounts',
    component: lazyRouteComponent(() => import('./accounts-page')),
})

const employeeAccountingComputationRoute = createRoute({
    getParentRoute: () => employeeAccountingRoute,
    path: 'computation-type',
    component: lazyRouteComponent(() => import('./accounts-computation-page')),
})

const EmployeeAccountingRoute = employeeAccountingRoute.addChildren([
    employeeAccountingIndexRoute,
    employeeAccountingAccountsRoute,
    employeeAccountingComputationRoute,
])

export default EmployeeAccountingRoute
