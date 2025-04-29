import { Outlet } from '@tanstack/react-router'

import bg_element_1 from '@/assets/images/landing-page/bg_element_1.webp'
import bg_element_2 from '@/assets/images/landing-page/bg_element_2.webp'
import bg_element_3 from '@/assets/images/landing-page/bg_element_3.webp'

import Footer from '@/components/footers/landing-footer'
import { VersionAndFeedBack } from '@/components/version'
import LandingNav from '@/components/nav/navs/landing-nav'

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

export default PublicLayout
