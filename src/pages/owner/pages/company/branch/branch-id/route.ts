import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import ErrorPage from '@/pages/owner/components/error-page'

import { ownerBranchRoute } from '../route'
import { ownerIdPathSchema } from './route-schemas'
import { branchLoader } from '@/hooks/api-hooks/use-branch'

export const ownerBranchId = createRoute({
    getParentRoute: () => ownerBranchRoute,
    path: '$branchId',
    params: {
        parse: ownerIdPathSchema.parse,
    },
    errorComponent: ErrorPage,
    loader: async ({ context, params: { branchId } }) => {
        await context.queryClient.ensureQueryData(branchLoader(branchId))
    },
})

const ownerBranchIndexRoute = createRoute({
    getParentRoute: () => ownerBranchId,
    path: '/',
    beforeLoad: ({ params }) => {
        throw redirect({
            to: `/owner/company/branches/$branchId/view`,
            params,
        })
    },
})

const ownerBranchViewRoute = createRoute({
    getParentRoute: () => ownerBranchId,
    path: 'view',
    component: lazyRouteComponent(() => import('./view-branch-page')),
})

const OwnerBranchIdRoute = ownerBranchId.addChildren([
    ownerBranchIndexRoute,
    ownerBranchViewRoute,
])

export default OwnerBranchIdRoute
