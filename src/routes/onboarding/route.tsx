import { useEffect, useState } from 'react'

import { useCategoryStore } from '@/store/onboarding/category-store'
import { useAuthStore } from '@/store/user-auth-store'
import { useRouter } from '@tanstack/react-router'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import OrganizationCategoryPicker from '@/components/category-pickers/organization-category-picker'
import AuthFooter from '@/components/footers/auth-footer'
import OnboardingNav from '@/components/nav/navs/onboarding-nav'
import AuthGuard from '@/components/wrappers/auth-guard'

import { useGetAllCategory } from '@/hooks/api-hooks/use-category'

import LocationBack from './-components/onboarding-back'

export const Route = createFileRoute('/onboarding')({
    component: RouteComponent,
})

function RouteComponent() {
    const router = useRouter()
    const {
        currentAuth: { user_organization },
    } = useAuthStore()
    const { onOpenCategoryPicker, setOnOpenCategoryPicker } = useCategoryStore()

    const { data: Category } = useGetAllCategory()

    const [currentPath, setCurrentPath] = useState(
        router.latestLocation.pathname
    )

    useEffect(() => {
        const unsubscribe = router.subscribe('onResolved', (state) => {
            setCurrentPath(state.toLocation.pathname)
        })
        return () => unsubscribe()
    }, [router])

    const isCreateBranchRoute = currentPath.includes('onboarding/create-branch')

    return (
        <AuthGuard>
            <div className="flex">
                <OnboardingNav />
                <OrganizationCategoryPicker
                    open={onOpenCategoryPicker}
                    onOpenChange={setOnOpenCategoryPicker}
                    data={Category}
                />
                <main className="flex w-full flex-1 items-center">
                    <div className="ecoop-scroll relative flex h-screen max-h-screen w-full flex-col overflow-y-auto">
                        <div className="relative mx-auto my-5 flex w-[80%] flex-1 flex-col py-8">
                            {!isCreateBranchRoute && user_organization && (
                                <LocationBack className="absolute right-5 top-10 max-w-24" />
                            )}
                            <Outlet />
                        </div>
                        <AuthFooter />
                    </div>
                    <div className="hidden h-screen sm:block sm:w-1/3">
                        <div
                            className="size-full rounded-l-3xl bg-cover"
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
