import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import ErrorPage from '@/pages/employee/components/error-page'

import { employeeBranchRoute } from '../route'
import { branchIdPathSchema } from './route-schemas'
import { branchLoader } from '@/hooks/api-hooks/use-branch'

export const employeeBranchId = createRoute({
    getParentRoute: () => employeeBranchRoute,
    path: '$branchId',
    params: {
        parse: branchIdPathSchema.parse,
    },
    errorComponent: ErrorPage,
    loader: async ({ context, params: { branchId } }) => {
        await context.queryClient.ensureQueryData(branchLoader(branchId))
    },
})

const employeeBranchIndexRoute = createRoute({
    getParentRoute: () => employeeBranchId,
    path: '/',
    beforeLoad: ({ params }) => {
        throw redirect({
            to: `/employee/branches/$branchId/view`,
            params,
        })
    },
})

const employeeBranchViewRoute = createRoute({
    getParentRoute: () => employeeBranchId,
    path: 'view',
    component: lazyRouteComponent(() => import('./view-branch-page')),
})

const EmployeeBranchIdRoute = employeeBranchId.addChildren([
    employeeBranchIndexRoute,
    employeeBranchViewRoute,
])

export default EmployeeBranchIdRoute
