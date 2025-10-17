import { cn } from '@/helpers'
import NavProfileMenu from '@/modules/user-profile/components/nav/nav-profile-menu'

import AppSidebarToggle from '@/components/ui/app-sidebar/app-sidebar-toggle'

import { IClassProps } from '@/types'

import NavEcoopLogo from '../nav-components/nav-ecoop-logo'
import NavThemeToggle from '../nav-components/nav-theme-toggle'
import NavContainer from '../nav-container'
import RootNav from '../root-nav'

const UserProfileNav = ({ className }: IClassProps) => {
    return (
        <RootNav
            className={cn(
                'pointer-events-none fixed w-full bg-popover/70 backdrop-blur-sm',
                className
            )}
        >
            <NavContainer className="pointer-events-auto min-w-[10%]">
                <AppSidebarToggle />
                <NavEcoopLogo className="pointer-events-auto" />
            </NavContainer>
            <NavContainer />
            <NavContainer className="pointer-events-auto">
                <NavProfileMenu />
                <NavThemeToggle />
            </NavContainer>
        </RootNav>
    )
}

export default UserProfileNav
