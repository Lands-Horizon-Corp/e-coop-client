import AccountSettingsSidebar from '@/components/account-settings/account-settings-sidebar'
import AccountSettingsUserBanner from '@/components/account-settings/account-settings-user-banner'
import VerifyNotice from '@/components/account-settings/verify-notice'
import AuthFooter from '@/components/footers/auth-footer'
import OnboardingNav from '@/components/nav/navs/onboarding-nav'
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
                <OnboardingNav />
                <main className="flex w-full flex-1 items-center">
                    <div className="ecoop-scroll flex h-screen max-h-screen w-full flex-col items-center justify-center overflow-y-auto">
                        <div className="relative mt-24 flex min-h-[80vh] w-full max-w-5xl flex-1 flex-col space-y-4">
                            <AccountSettingsUserBanner />
                            <div className="flex flex-1 gap-x-8">
                                <AccountSettingsSidebar />
                                <div className="flex min-h-full flex-1 flex-col items-center space-y-4 px-4">
                                    <div className="min-h-full w-full flex-1 space-y-4 px-0 sm:px-4">
                                        <Outlet />
                                        <div className="space-y-4">
                                            <VerifyNotice />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AuthFooter />
                        </div>
                    </div>
                    <div className="hidden h-screen sm:block sm:w-1/3">
                        <div className="size-full rounded-l-3xl bg-cover shadow-lg dark:shadow-none sm:bg-[url('/auth-bg.webp')]" />
                    </div>
                </main>
            </div>
        </AuthGuard>
    )
}
