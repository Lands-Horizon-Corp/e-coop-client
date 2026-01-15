import { useEffect, useState } from 'react'

import { useRouter } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

import { useGetAll } from '@/modules/category/category.service'
import { OnboardingBack } from '@/modules/organization'
import OrganizationCategoryPicker from '@/modules/organization/components/organization-category-picker'
import { useCategoryStore } from '@/store/onboarding/category-store'

import { FlickeringGrid } from '@/components/backgrounds/flickering-grid'
import AuthFooter from '@/components/footers/auth-footer'
import OnboardingNav from '@/components/nav/navs/onboarding-nav'
import AuthGuard from '@/components/wrappers/auth-guard'

export const Onboarding = () => {
    const router = useRouter()
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
                <FlickeringGrid
                    className="fixed"
                    flickerChance={0.03}
                    gridGap={1}
                    maxOpacity={0.5}
                    squareSize={64}
                />
                <OnboardingNav />
                <OrganizationCategoryPicker
                    data={Category}
                    onOpenChange={setOnOpenCategoryPicker}
                    open={onOpenCategoryPicker}
                />
                <main className="flex w-full relative overflow-hidden flex-1 items-center ">
                    <div className="to-background/0 via-background/0 from-primary/50 absolute right-50 -z-10 -mt-16 h-screen w-full blur-2xl bg-radial-[ellipse_at_20%_0%] to-100% dark:block hidden" />
                    <div className="ecoop-scroll  max-h-screen relative flex w-full flex-col overflow-y-auto">
                        <div className="relative mx-auto h-full mt-20 flex max-w-6xl flex-1 flex-col">
                            {isCreateBranchRoute && (
                                <OnboardingBack className="absolute z-50 right-3 top-2 max-w-full" />
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
