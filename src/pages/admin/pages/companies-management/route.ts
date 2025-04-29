import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import { adminRoute } from '../../route'
import CompanyErrorPage from '../../components/error-page'
import AdminCompanyIdRoute from './companyId/route'

export const adminCompaniesManagement = createRoute({
    getParentRoute: () => adminRoute,
    path: 'companies-management',
})

const adminCompaniesManagementIndexRoute = createRoute({
    getParentRoute: () => adminCompaniesManagement,
    errorComponent: CompanyErrorPage,
    path: '/',
    beforeLoad: () => {
        throw redirect({ to: '/admin/companies-management/view-companies' })
    },
})

const adminViewCompaniesRoute = createRoute({
    getParentRoute: () => adminCompaniesManagement,
    path: 'view-companies',
    component: lazyRouteComponent(() => import('./view-companies')),
})

const adminCompaniesFeedbackRoute = createRoute({
    getParentRoute: () => adminCompaniesManagement,
    path: 'feedbacks',
    component: lazyRouteComponent(() => import('./feedbacks')),
})

const AdminCompaniesManagementRoute = adminCompaniesManagement.addChildren([
    adminViewCompaniesRoute,
    adminCompaniesFeedbackRoute,
    adminCompaniesManagementIndexRoute,
    AdminCompanyIdRoute,
])

export default AdminCompaniesManagementRoute
