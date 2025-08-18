import { useAuthUser } from '@/store/user-auth-store'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'

import AuthFooter from '@/components/footers/auth-footer'
import { ArrowLeftIcon } from '@/components/icons'
import OnboardingNav from '@/components/nav/navs/onboarding-nav'
import AccountSettingsSidebar from '@/components/settings/account-settings/account-settings-sidebar'
// import AccountSettingsUserBanner from '@/components/account-settings/account-settings-user-banner'
import VerifyNotice from '@/components/settings/account-settings/verify-notice'
import { Button } from '@/components/ui/button'
import AuthGuard from '@/components/wrappers/auth-guard'

// ACCOUNT SETTINGS NOT TIED TO COOP
export const Route = createFileRoute('/account')({
    component: RouteComponent,
})

function RouteComponent() {
    const router = useRouter()
    const {
        currentAuth: { user_organization },
    } = useAuthUser()

    const handleBack = () => {
        if (user_organization)
            return router.navigate({
                to: `/org/${user_organization.organization.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(
                        /^-+|-+$/g,
                        ''
                    )}/branch/${user_organization.branch.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')}`,
            })

        router.history.back()
    }

    return (
        <AuthGuard>
            <div className="flex">
                <OnboardingNav />
                <main className="flex w-full flex-1 items-center">
                    <div className="ecoop-scroll relative flex h-screen max-h-screen w-full flex-col items-center justify-center overflow-y-auto">
                        <div className="relative mt-24 flex min-h-[80vh] w-full max-w-5xl flex-1 flex-col space-y-4">
                            {/* <AccountSettingsUserBanner /> */}
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
                        {user_organization && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-5 right-5"
                                onClick={() => handleBack()}
                            >
                                <ArrowLeftIcon className="mr-2" /> Back to Org
                            </Button>
                        )}
                    </div>
                    <div className="hidden h-screen sm:block sm:w-1/3">
                        <div
                            className="size-full rounded-l-3xl bg-cover shadow-lg dark:shadow-none"
                            style={{
                                backgroundImage: "url('/auth-bg.webp')",
                            }}
                        />
                    </div>
                </main>
            </div>
        </AuthGuard>
    )
}
