import AuthFooter from '@/components/footers/auth-footer'
import OnboardingNav from '@/components/nav/navs/onboarding-nav'
import { useAuthStore } from '@/store/user-auth-store'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
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
    return (
        <div className="flex">
            <OnboardingNav />
            <main className="flex w-full flex-1 items-center">
                <div className="ecoop-scroll flex h-screen max-h-screen w-full flex-col overflow-y-auto">
                    <div className="flex w-full flex-1 items-center justify-center py-8">
                        <Outlet />
                    </div>
                    <AuthFooter />
                </div>
                <div className="hidden h-screen sm:block sm:w-1/3">
                    <div className="size-full rounded-l-3xl bg-cover sm:bg-[url('/auth-bg.webp')]" />
                </div>
            </main>
        </div>
    )
}
