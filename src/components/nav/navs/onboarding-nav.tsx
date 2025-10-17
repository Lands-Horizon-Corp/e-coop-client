import { cn } from '@/helpers'
import NavProfileMenu from '@/modules/user-profile/components/nav/nav-profile-menu'

import { IClassProps } from '@/types'

import NavEcoopLogo from '../nav-components/nav-ecoop-logo'
import NavThemeToggle from '../nav-components/nav-theme-toggle'
import NavContainer from '../nav-container'
import RootNav from '../root-nav'

const OnboardingNav = ({ className }: IClassProps) => {
    return (
        <RootNav
            className={cn(
                'pointer-events-none fixed w-full bg-popover/70 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none',
                className
            )}
        >
            <NavEcoopLogo className="pointer-events-auto" />
            <NavContainer />
            <NavContainer className="pointer-events-auto">
                <NavProfileMenu />
                <NavThemeToggle />
            </NavContainer>
        </RootNav>
    )
}

export default OnboardingNav
