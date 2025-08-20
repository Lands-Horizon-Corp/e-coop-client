import NavEcoopLogo from '../nav-components/nav-ecoop-logo'
import NavProfileMenu from '../nav-components/nav-profile-menu'
import NavThemeToggle from '../nav-components/nav-theme-toggle'
import NavContainer from '../nav-container'
import RootNav from '../root-nav'

const OnboardingNav = () => {
    return (
        <RootNav className="pointer-events-none fixed w-full bg-popover/70 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none">
            <NavEcoopLogo className="pointer-events-auto" />
            <NavContainer />
            <NavContainer className="pointer-events-auto">
                {/* TODO: Add avatar dropdown current signed in user */}
                {/* <NavProfileMenu /> */}
                <NavThemeToggle />
            </NavContainer>
        </RootNav>
    )
}

export default OnboardingNav
