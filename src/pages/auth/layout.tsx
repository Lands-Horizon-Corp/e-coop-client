import { Outlet } from '@tanstack/react-router'

import AuthNav from '@/components/nav/navs/auth-nav'
import AuthFooter from '@/components/footers/auth-footer'

const AuthLayout = () => {
    return (
        // <div className="grid min-h-[100dvh] grid-rows-[1fr_auto]">
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
                    <div className="size-full rounded bg-cover sm:bg-[url('/auth-bg.webp')]" />
                </div>
            </main>
        </div>
    )
}

export default AuthLayout
