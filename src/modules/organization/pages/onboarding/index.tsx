import { useEffect, useState } from 'react'

import { useRouter } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { useGetAll } from '@/modules/category/category.service'
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
                    data={Category}
                    onOpenChange={setOnOpenCategoryPicker}
                    open={onOpenCategoryPicker}
                />
                <main className="flex w-full flex-1 items-center ">
                    <div className=" ecoop-scroll max-h-screen relative flex w-full flex-col overflow-y-auto">
                        <div className="relative mx-auto h-full mt-20 flex w-[90%] flex-1 flex-col">
                            {!isCreateBranchRoute && user_organization && (
                                <OnboardingBack className="absolute right-5 top-10 max-w-full" />
                            )}
                            <Outlet />
                        </div>
                        <AuthFooter />
                    </div>
                </main>
            </div>
        </AuthGuard>
    )
}
export default Onboarding
