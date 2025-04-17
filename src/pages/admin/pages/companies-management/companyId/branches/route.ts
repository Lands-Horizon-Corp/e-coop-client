import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import { adminCompanyId } from '../route'
import AdminBranchIdRoute from './branchId/route'

export const adminCompanyBranchRoute = createRoute({
    getParentRoute: () => adminCompanyId,
    path: 'branch',
})

const adminCompanyBranchesIndexRoute = createRoute({
    getParentRoute: () => adminCompanyBranchRoute,
    path: '/',
    component: lazyRouteComponent(() => import('./view-branches')),
})

const AdminCompanyBranchRoute = adminCompanyBranchRoute.addChildren([
    adminCompanyBranchesIndexRoute,
    AdminBranchIdRoute,
])

export default AdminCompanyBranchRoute
