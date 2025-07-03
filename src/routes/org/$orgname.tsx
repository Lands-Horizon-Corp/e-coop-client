import { Outlet, createFileRoute } from '@tanstack/react-router'

import AuthGuard from '@/components/wrappers/auth-guard'
import UserOrgGuard from '@/components/wrappers/user-org-guard'

export const Route = createFileRoute('/org/$orgname')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AuthGuard>
            <UserOrgGuard>
                <Outlet />
            </UserOrgGuard>
        </AuthGuard>
    )
}
