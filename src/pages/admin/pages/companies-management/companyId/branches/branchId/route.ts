import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import { branchIdPathSchema } from './route-schemas'

import { branchLoader } from '@/hooks/api-hooks/use-branch'
import ErrorPage from '@/pages/admin/components/error-page'
import { adminCompanyBranchRoute } from '../route'

export const adminBranchId = createRoute({
    getParentRoute: () => adminCompanyBranchRoute,
    path: '$branchId',
    params: {
        parse: branchIdPathSchema.parse,
    },
    errorComponent: ErrorPage,
    loader: async ({ context, params: { branchId } }) => {
        await context.queryClient.ensureQueryData(branchLoader(branchId))
    },
})

const adminBranchIndexRoute = createRoute({
    getParentRoute: () => adminBranchId,
    path: '/',
    beforeLoad: ({ params }) => {
        throw redirect({
            to: `/admin/companies-management/${params.companyId}/branch/${params.branchId}/view`,
            params,
        })
    },
})

const adminBranchViewRoute = createRoute({
    getParentRoute: () => adminBranchId,
    path: 'view',
    component: lazyRouteComponent(() => import('./view')),
})

const adminBranchEditRoute = createRoute({
    getParentRoute: () => adminBranchId,
    path: 'edit',
    component: lazyRouteComponent(() => import('./edit')),
})

const AdminBranchIdRoute = adminBranchId.addChildren([
    adminBranchViewRoute,
    adminBranchEditRoute,
    adminBranchIndexRoute,
])

export default AdminBranchIdRoute
