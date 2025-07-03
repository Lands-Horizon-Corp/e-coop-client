import bg_element_1 from '@/assets/images/landing-page/bg_element_1.webp'
import bg_element_2 from '@/assets/images/landing-page/bg_element_2.webp'
import bg_element_3 from '@/assets/images/landing-page/bg_element_3.webp'
import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

import Footer from '@/components/footers/landing-footer'
import LandingNav from '@/components/nav/navs/landing-nav'
import { VersionAndFeedBack } from '@/components/version'

const PublicLayout = () => {
    return (
        <>
            <div className="relative overflow-hidden">
                <img
                    src={bg_element_1}
                    className="absolute left-[50%] -z-30 h-auto w-[1781px] -translate-x-[50%]"
                    alt="background"
                />
                <img
                    src={bg_element_2}
                    className="absolute left-[90%] -z-30 h-auto w-[1681px] -translate-x-[50%] 2xl:left-[85%]"
                    alt="background"
                />
                <img
                    src={bg_element_3}
                    className="absolute left-[50%] -z-40 h-auto w-[1440px] -translate-x-[50%] opacity-30 2xl:left-[50%]"
                    alt="background"
                />
                <main className="w-full">
                    <LandingNav />
                    <Outlet />
                    <Footer />
                </main>
                <VersionAndFeedBack />
            </div>
        </>
    )
}

export const Route = createFileRoute('/(landing)')({
    component: PublicLayout,
})

export default PublicLayout
