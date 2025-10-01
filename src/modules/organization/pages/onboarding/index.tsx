import { useEffect, useState } from 'react'

import { useRouter } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { useGetAll } from '@/modules/category/category.service'
import SidePanelPoster from '@/modules/home/components/side-panel-poster'
import { OnboardingBack } from '@/modules/organization'
import OrganizationCategoryPicker from '@/modules/organization/components/organization-category-picker'
import { useCategoryStore } from '@/store/onboarding/category-store'

import AuthFooter from '@/components/footers/auth-footer'
import OnboardingNav from '@/components/nav/navs/onboarding-nav'
import AuthGuard from '@/components/wrappers/auth-guard'

export const Onboarding = () => {
    const router = useRouter()
    const {
        currentAuth: { user_organization },
    } = useAuthStore()
    const { onOpenCategoryPicker, setOnOpenCategoryPicker } = useCategoryStore()

    const { data: Category } = useGetAll()

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
                                <OnboardingBack className="absolute right-5 top-10 max-w-24" />
                            )}
                            <Outlet />
                        </div>
                        <AuthFooter />
                    </div>
                    <SidePanelPoster />
                </main>
            </div>
        </AuthGuard>
    )
}
export default Onboarding
