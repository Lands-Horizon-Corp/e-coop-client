import { useLocation } from '@tanstack/react-router'

import NavSignIn from '@/modules/authentication/components/nav/nav-sign-in'
import NavSignOut from '@/modules/authentication/components/nav/nav-sign-out'
import NavSignUp from '@/modules/authentication/components/nav/nav-sign-up'

import NavGetStarted from './nav-get-started'

const NavAuthGroup = () => {
    const pathname = useLocation({
        select: (location) => location.pathname,
    })

    return (
        <>
            {pathname !== '/auth/sign-up' && <NavSignUp />}
            {pathname !== '/auth/sign-in' && <NavSignIn />}
            {[
                '/',
                '/about',
                '/contact',
                '/frequently-asked-questions',
                '/developers',
                '/subscription',
            ].includes(pathname) && <NavGetStarted />}
            hello
            <NavSignOut />
        </>
    )
}

export default NavAuthGroup
