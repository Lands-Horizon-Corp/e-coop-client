import RootNav from '../root-nav'
import NavContainer from '../nav-container'
import NavEcoopLogo from '../nav-components/nav-ecoop-logo'
import NavThemeToggle from '../nav-components/nav-theme-toggle'
import NavProfileMenu from '../nav-components/nav-profile-menu'

const OnboardingNav = () => {
    return (
        <RootNav className="pointer-events-none fixed w-full">
            <NavEcoopLogo className="pointer-events-auto" />
            <NavContainer />
            <NavContainer className="pointer-events-auto">
                {/* TODO: Add avatar dropdown current signed in user */}
                <NavProfileMenu />
                <NavThemeToggle />
            </NavContainer>
        </RootNav>
    )
}

export default OnboardingNav
