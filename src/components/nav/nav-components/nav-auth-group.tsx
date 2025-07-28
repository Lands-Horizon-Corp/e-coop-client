import { useLocation } from '@tanstack/react-router'

import NavGetStarted from './nav-get-started'
import NavSignIn from './nav-sign-in'
import NavSignOut from './nav-sign-out'
import NavSignUp from './nav-sign-up'

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
                '/subscription-plans',
            ].includes(pathname) && <NavGetStarted />}
            <NavSignOut />
        </>
    )
}

export default NavAuthGroup
