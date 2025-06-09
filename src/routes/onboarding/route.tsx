import AuthFooter from '@/components/footers/auth-footer'
import OnboardingNav from '@/components/nav/navs/onboarding-nav'
import OrganizationCategoryPicker from '@/components/category-pickers/organization-category-picker'

import { useAuthStore } from '@/store/user-auth-store'
import { useCategoryStore } from '@/store/onboarding/category-store'

import { useGetAllCategory } from '@/hooks/api-hooks/use-category'

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
    component: RouteComponent,
    beforeLoad: async () => {
        const {
            authStatus,
            currentAuth: { user },
        } = useAuthStore.getState()

        if (authStatus !== 'authorized' && !user) {
            throw redirect({ to: '/auth/sign-in' })
        }
    },
})

function RouteComponent() {
    const { onOpenCategoryPicker, setOnOpenCategoryPicker } = useCategoryStore()
    const { data: Category } = useGetAllCategory()

    return (
        <div className="flex">
            <OnboardingNav />
            <OrganizationCategoryPicker
                open={onOpenCategoryPicker}
                onOpenChange={setOnOpenCategoryPicker}
                data={Category}
            />
            <main className="flex w-full flex-1 items-center">
                <div className="ecoop-scroll flex h-screen max-h-screen w-full flex-col overflow-y-auto">
                    <div className="relative mx-auto my-5 flex w-[80%] flex-1 flex-col py-8">
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
