import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

import Footer from '@/components/footers/landing-footer'
import LandingNav from '@/components/nav/navs/landing-nav'

import { VersionAndFeedBack } from './-landing-components/version'

const PublicLayout = () => {
    return (
        <>
            <div>
                <main>
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
