import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import { adminRoute } from '../../route'

const adminMembersManagement = createRoute({
    getParentRoute: () => adminRoute,
    path: 'members-management',
})

const adminViewMembersRoute = createRoute({
    getParentRoute: () => adminMembersManagement,
    path: 'view-members',
    component: lazyRouteComponent(() => import('./view-members')),
})

const adminMembersFeedbackRoute = createRoute({
    getParentRoute: () => adminMembersManagement,
    path: 'feedbacks',
    component: lazyRouteComponent(() => import('./feedbacks')),
})

const AdminMemberManagementRoute = adminMembersManagement.addChildren([
    adminViewMembersRoute,
    adminMembersFeedbackRoute,
])

export default AdminMemberManagementRoute
