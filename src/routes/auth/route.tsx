import {
    Outlet,
    createFileRoute,
    lazyRouteComponent,
    redirect,
} from '@tanstack/react-router'

import SidePanelPoster from '@/modules/home/components/side-panel-poster'

import AuthFooter from '@/components/footers/auth-footer'
import AuthNav from '@/components/nav/navs/auth-nav'
import GuestGuard from '@/components/wrappers/guest-guard'

type TAuthSearch = {
    cbUrl?: string
    key?: string
}

export const Route = createFileRoute('/auth')({
    component: RouteComponent,
    validateSearch: (searchParams: TAuthSearch) => searchParams,
    beforeLoad: ({ location }) => {
        if (location.pathname === '/auth' || location.pathname === '/auth/')
            throw redirect({ to: '/auth/sign-in' })
    },
    notFoundComponent: lazyRouteComponent(
        () => import('@/routes/auth/-components/not-found')
    ),
})

function RouteComponent() {
    return (
        <GuestGuard allowAuthenticatedUser={false}>
            <div className="flex">
                <AuthNav />
                <main className="flex flex-col sm:flex-row w-full flex-1 items-center">
                    <div className="ecoop-scroll flex h-screen max-h-screen w-full flex-col overflow-y-auto">
                        <div className="flex w-full flex-1 items-center justify-center py-4 sm:py-8">
                            <Outlet />
                        </div>
                        <AuthFooter />
                    </div>

                    <SidePanelPoster />
                </main>
            </div>
        </GuestGuard>
    )
}
