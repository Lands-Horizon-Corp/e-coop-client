import { useLocation } from '@tanstack/react-router'

import NavSignIn from './nav-sign-in'
import NavSignUp from './nav-sign-up'
import NavSignOut from './nav-sign-out'
import NavGetStarted from './nav-get-started'

const NavAuthGroup = () => {
    const pathname = useLocation({
        select: (location) => location.pathname,
    })

    return (
        <>
            {pathname !== '/auth/sign-up' && <NavSignUp />}
            {pathname !== '/auth/sign-in' && <NavSignIn />}
            {pathname === '/' && <NavGetStarted />}
            <NavSignOut />
        </>
    )
}

export default NavAuthGroup
