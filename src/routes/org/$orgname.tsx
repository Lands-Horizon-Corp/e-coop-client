import AuthGuard from '@/components/wrappers/auth-guard'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/org/$orgname')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    )
}
