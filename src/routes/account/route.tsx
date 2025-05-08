import AuthFooter from '@/components/footers/auth-footer'
import AuthNav from '@/components/nav/navs/auth-nav'
import AuthGuard from '@/components/wrappers/auth-guard'
import { createFileRoute, Outlet } from '@tanstack/react-router'

// ACCOUNT SETTINGS NOT TIED TO COOP
export const Route = createFileRoute('/account')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AuthGuard>
            <div className="flex">
                <AuthNav />
                <main className="flex w-full flex-1 items-center">
                    <div className="ecoop-scroll flex h-screen max-h-screen w-full flex-col overflow-y-auto">
                        <div className="flex w-full flex-1 items-center justify-center py-8">
                            <Outlet />
                        </div>
                        <AuthFooter />
                    </div>
                    <div className="hidden h-screen sm:block sm:w-1/3">
                        <div className="size-full rounded-l-3xl bg-cover shadow-lg dark:shadow-none sm:bg-[url('/auth-bg.webp')]" />
                    </div>
                </main>
            </div>
        </AuthGuard>
    )
}
