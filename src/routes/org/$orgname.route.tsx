import { useAuthStore } from '@/store/user-auth-store'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/org/$orgname')({
    component: RouteComponent,
    beforeLoad: () => {
        const {
            authStatus,
            currentAuth: { user },
        } = useAuthStore.getState()

        if (authStatus !== 'authorized' && !user) {
            throw redirect({
                to: '/auth/sign-in',
            })
        }
    },
})

function RouteComponent() {
    return <Outlet />
}
