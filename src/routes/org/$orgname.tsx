import AuthGuard from '@/components/wrappers/auth-guard'
import UserOrgGuard from '@/components/wrappers/user-org-guard'
import { createFileRoute, Outlet } from '@tanstack/react-router'

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
