import { useRouter } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import TransactionBatchNavButton from '@/modules/transaction-batch/components/batch-nav-button'
import NavProfileMenu from '@/modules/user-profile/components/nav/nav-profile-menu'

import { BadgeCheckFillIcon } from '@/components/icons'
import NavThemeToggle from '@/components/nav/nav-components/nav-theme-toggle'
import NavContainer from '@/components/nav/nav-container'
import RootNav from '@/components/nav/root-nav'
import PageBreadCrumb from '@/components/pages-breadcrumbs'
import GeneralButtonShortcuts from '@/components/shorcuts/general-button-shorcuts'
import AppSidebarToggle from '@/components/ui/app-sidebar/app-sidebar-toggle'
import { Button } from '@/components/ui/button'

import { IClassProps } from '@/types'

import NavTimeInBar from '../../../modules/timesheet/components/nav-time-in-bar'

const UserNav = ({
    homeUrl,
    className,
}: { homeUrl?: `/${string}` } & IClassProps) => {
    const {
        currentAuth: { user, user_organization },
    } = useAuthStore()

    const router = useRouter()

    return (
        <RootNav
            className={cn(
                'pointer-events-none relative justify-between lg:px-4',
                className
            )}
        >
            <NavContainer className="pointer-events-auto min-w-[10%]">
                <AppSidebarToggle />
                <PageBreadCrumb
                    homeUrl={homeUrl}
                    className="hidden text-xs md:block"
                />
            </NavContainer>
            <NavContainer className="pointer-events-auto">
                {['employee', 'owner'].includes(
                    user_organization?.user_type ?? ''
                ) && (
                    <Button
                        variant="secondary"
                        hoverVariant="primary"
                        className="rounded-full group"
                        onClick={() =>
                            router.navigate({
                                to: '/org/$orgname/branch/$branchname/approvals' as string,
                            })
                        }
                    >
                        <BadgeCheckFillIcon className="ease-out duration-500 text-primary group-hover:text-primary-foreground" />
                        Approvals
                    </Button>
                )}
                {user && <TransactionBatchNavButton />}
                {user && user_organization?.user_type === 'employee' && (
                    <NavTimeInBar />
                )}
                <GeneralButtonShortcuts />
                <NavProfileMenu />
                <NavThemeToggle />
            </NavContainer>
        </RootNav>
    )
}

export default UserNav
