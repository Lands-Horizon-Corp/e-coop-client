import RootNav from '@/components/nav/root-nav'
import NavContainer from '@/components/nav/nav-container'
import PageBreadCrumb from '@/components/pages-breadcrumbs'
import NavTimeInBar from '../nav-components/nav-time-in-bar'
import AppSidebarToggle from '@/components/ui/app-sidebar/app-sidebar-toggle'
import NavThemeToggle from '@/components/nav/nav-components/nav-theme-toggle'
import NavProfileMenu from '@/components/nav/nav-components/nav-profile-menu'
import TransactionBatchNavButton from '@/components/nav/nav-components/batch-nav-button'

import { cn } from '@/lib'
import { useAuthStore } from '@/store/user-auth-store'

import { IClassProps } from '@/types'

const UserNav = ({
    homeUrl,
    className,
}: { homeUrl?: `/${string}` } & IClassProps) => {
    const {
        currentAuth: { user, user_organization },
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
                <PageBreadCrumb
                    homeUrl={homeUrl}
                    className="hidden text-xs md:block"
                />
            </NavContainer>
            <NavContainer className="pointer-events-auto">
                {user && <TransactionBatchNavButton />}
                {user && user_organization?.user_type === 'employee' && (
                    <NavTimeInBar />
                )}
                <NavProfileMenu />
                <NavThemeToggle />
            </NavContainer>
        </RootNav>
    )
}

export default UserNav
