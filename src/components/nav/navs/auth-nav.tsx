import NavAuthGroup from '@/components/nav/nav-components/nav-auth-group'
import NavEcoopLogo from '@/components/nav/nav-components/nav-ecoop-logo'
import NavThemeToggle from '@/components/nav/nav-components/nav-theme-toggle'
import NavContainer from '@/components/nav/nav-container'
import RootNav from '@/components/nav/root-nav'

const AuthNav = () => {
    return (
        <RootNav className="pointer-events-none fixed w-full">
            <NavEcoopLogo className="pointer-events-auto" />
            <NavContainer />
            <NavContainer className="pointer-events-auto">
                <NavAuthGroup />
                <NavThemeToggle />
            </NavContainer>
        </RootNav>
    )
}

export default AuthNav
