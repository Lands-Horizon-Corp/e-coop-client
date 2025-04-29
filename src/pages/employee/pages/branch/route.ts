import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import { employeeRoute } from '../../route'
import EmployeeBranchIdRoute from './branch-id/route'

export const employeeBranchRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: 'branches',
})

export const employeeCompanyBranchIndexRoute = createRoute({
    getParentRoute: () => employeeBranchRoute,
    path: '/',
    component: lazyRouteComponent(() => import('./branches-page')),
})

const EmployeeBranchRoute = employeeBranchRoute.addChildren([
    employeeCompanyBranchIndexRoute,
    EmployeeBranchIdRoute,
])

export default EmployeeBranchRoute
