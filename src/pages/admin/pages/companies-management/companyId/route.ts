import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import ErrorPage from '@/pages/admin/components/error-page'

import { adminCompaniesManagement } from '../route'
import { companyIdPathSchema } from './route-schemas'
import AdminCompanyBranchRoute from './branches/route'

import { companyLoader } from '@/hooks/api-hooks/use-company'

export const adminCompanyId = createRoute({
    getParentRoute: () => adminCompaniesManagement,
    path: '$companyId',
    params: {
        parse: companyIdPathSchema.parse,
    },
    errorComponent: ErrorPage,
    loader: async ({ context, params: { companyId } }) => {
        await context.queryClient.ensureQueryData(companyLoader(companyId))
    },
})

const adminCompanyIndexRoute = createRoute({
    getParentRoute: () => adminCompanyId,
    path: '/',
    beforeLoad: ({ params }) => {
        throw redirect({
            to: `/admin/companies-management/${params.companyId}/view`,
            params,
        })
    },
})

const adminCompanyViewRoute = createRoute({
    getParentRoute: () => adminCompanyId,
    path: 'view',
    component: lazyRouteComponent(() => import('./view')),
})

const adminCompanyEditRoute = createRoute({
    getParentRoute: () => adminCompanyId,
    path: 'edit',
    component: lazyRouteComponent(() => import('./edit')),
})

const AdminCompanyIdRoute = adminCompanyId.addChildren([
    adminCompanyViewRoute,
    adminCompanyEditRoute,
    adminCompanyIndexRoute,
    AdminCompanyBranchRoute,
])

export default AdminCompanyIdRoute
