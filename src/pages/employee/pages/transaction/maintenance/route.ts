import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import { employeeTransactionRoute } from '../route'

export const employeeTransactionMaintenance = createRoute({
    path: 'maintenance',
    getParentRoute: () => employeeTransactionRoute,
})

export const employeeTransactionIndexRoute = createRoute({
    path: '/',
    getParentRoute: () => employeeTransactionMaintenance,
    beforeLoad: () => {
        throw redirect({ to: '/employee/transaction/maintenance/cash-count' })
    },
})

export const employeeTransactionMaintenanceCashCount = createRoute({
    path: '/cash-count',
    getParentRoute: () => employeeTransactionMaintenance,
    component: lazyRouteComponent(
        () => import('./transaction-maintenance-cash-count-page')
    ),
})

export const employeeTransactionMaintenanceFinancialStatementGrouping =
    createRoute({
        path: '/financial-statement',
        getParentRoute: () => employeeTransactionMaintenance,
        component: lazyRouteComponent(
            () =>
                import(
                    './transaction-maintenance-financial-statement-grouping-page'
                )
        ),
    })

export const employeeTransactionMaintenanceDisbursement = createRoute({
    path: '/disbursement',
    getParentRoute: () => employeeTransactionMaintenance,
    component: lazyRouteComponent(
        () => import('./transaction-maintenance-disbursement-page')
    ),
})

export const employeeTransactionMaintenanceGeneralLedger = createRoute({
    path: '/general-ledger',
    getParentRoute: () => employeeTransactionMaintenance,
    component: lazyRouteComponent(
        () => import('./transaction-maintenance-general-ledger-page')
    ),
})

const EmployeeMaintenanceRoute = employeeTransactionMaintenance.addChildren([
    employeeTransactionIndexRoute,
    employeeTransactionMaintenanceCashCount,
    employeeTransactionMaintenanceFinancialStatementGrouping,
    employeeTransactionMaintenanceDisbursement,
    employeeTransactionMaintenanceGeneralLedger,
])

export default EmployeeMaintenanceRoute
