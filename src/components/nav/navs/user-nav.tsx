'use client'

import { useState } from 'react'

import { useRouter } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { NotificationNav } from '@/modules/notification/components/notification'
import TransactionBatchNavButton from '@/modules/transaction-batch/components/batch-nav-button'
import NavProfileMenu from '@/modules/user-profile/components/nav/nav-profile-menu'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { BadgeCheckFillIcon } from '@/components/icons'
import LiveToggle from '@/components/live-toggle'
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
    const [isOpen, setIsOpen] = useState(true)

    // Secondary nav items (collapsible)
    const SECONDARY_NAV_ITEMS = [
        {
            important: false,
            component: ['employee', 'owner'].includes(
                user_organization?.user_type ?? ''
            ) ? (
                <Button
                    className="rounded-full group"
                    hoverVariant="primary"
                    onClick={() =>
                        router.navigate({
                            to: '/org/$orgname/branch/$branchname/approvals' as string,
                        })
                    }
                    variant="secondary"
                >
                    <BadgeCheckFillIcon className="ease-out duration-500 text-primary" />
                    Approvals
                </Button>
            ) : null,
        },
        {
            important: false,
            component: user ? <TransactionBatchNavButton /> : null,
        },
        {
            important: false,
            component:
                user && user_organization?.user_type === 'employee' ? (
                    <NavTimeInBar />
                ) : null,
        },
        {
            important: false,
            component: user ? <LiveToggle size="default" /> : null,
        },
        {
            important: false,
            component: <GeneralButtonShortcuts />,
        },
        {
            important: false,
            component: <NavThemeToggle />,
        },
    ]

    // Important nav items (always visible)
    const IMPORTANT_NAV_ITEMS = [
        {
            important: true,
            component: user ? <NotificationNav /> : null,
        },
        {
            important: true,
            component: user ? <NavProfileMenu /> : null,
        },
    ]

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
                    className="hidden text-xs md:block"
                    homeUrl={homeUrl}
                />
            </NavContainer>

            <NavContainer className="pointer-events-auto">
                <div className="flex items-center gap-2">
                    {/* Collapsible secondary navigation */}
                    <div className="relative p-2 overflow-hidden">
                        <div
                            className={`flex items-center gap-2 transition-all duration-300 ease-out ${
                                isOpen
                                    ? 'translate-x-0 opacity-100'
                                    : '-translate-x-8 opacity-0 pointer-events-none'
                            }`}
                            style={{
                                maxWidth: isOpen ? '800px' : '0px',
                            }}
                        >
                            {SECONDARY_NAV_ITEMS.map((navItem, index) => (
                                <div className="whitespace-nowrap" key={index}>
                                    {navItem.component}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Toggle button */}
                    <Button
                        aria-label={
                            isOpen ? 'Hide more options' : 'Show more options'
                        }
                        className="shrink-0"
                        onClick={() => setIsOpen(!isOpen)}
                        size="icon"
                        variant="ghost"
                    >
                        {isOpen ? (
                            <ChevronLeft className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>

                    {/* Divider */}
                    <div className="mx-2 h-6 w-px bg-border" />

                    {/* Important items - always visible */}
                    {IMPORTANT_NAV_ITEMS.map((navItem, index) => (
                        <div key={index}>{navItem.component}</div>
                    ))}
                </div>
            </NavContainer>
        </RootNav>
    )
}

export default UserNav
