import z from 'zod'

import {
    Outlet,
    createFileRoute,
    lazyRouteComponent,
    redirect,
} from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'

import AuthFooter from '@/components/footers/auth-footer'
import AuthNav from '@/components/nav/navs/auth-nav'
import GuestGuard from '@/components/wrappers/guest-guard'
import { emailSchema } from '@/validations/common'

const authSearchSchema = z.object({
    cbUrl: z.coerce.string().optional(),
    key: emailSchema.optional(),
})

export const Route = createFileRoute('/auth')({
    component: RouteComponent,
    validateSearch: zodValidator(authSearchSchema),
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
        </GuestGuard>
    )
}
