import RootNav from '@/components/nav/root-nav'
import NavContainer from '@/components/nav/nav-container'
import PageBreadCrumb from '@/components/pages-breadcrumbs'
import NavTimeInBar from '../nav-components/nav-time-in-bar'
import AppSidebarToggle from '@/components/ui/app-sidebar/app-sidebar-toggle'
import NavThemeToggle from '@/components/nav/nav-components/nav-theme-toggle'
import NavProfileMenu from '@/components/nav/nav-components/nav-profile-menu'

import { cn } from '@/lib'
import { useAuthStore } from '@/store/user-auth-store'

import { IClassProps, IEmployee } from '@/types'

const UserNav = ({
    homeUrl,
    className,
}: { homeUrl?: `/${string}` } & IClassProps) => {
    const {
        currentAuth: { user },
    } = useAuthStore()
    return (
        <RootNav
            className={cn(
                'pointer-events-none relative justify-between lg:px-4',
                className
            )}
        >
            <NavContainer className="pointer-events-auto">
                <AppSidebarToggle />
                <PageBreadCrumb homeUrl={homeUrl} className="hidden md:block" />
            </NavContainer>
            <NavContainer className="pointer-events-auto">
                {user && user.type === 'employee' && (
                    <NavTimeInBar currentUser={user as IEmployee} />
                )}
                <NavProfileMenu />
                <NavThemeToggle />
            </NavContainer>
        </RootNav>
    )
}

export default UserNav
