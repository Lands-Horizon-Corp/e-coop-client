import { useMemo } from 'react'
import { Link, useRouter } from '@tanstack/react-router'

import {
    // UserIcon,
    // BankIcon,
    // BillIcon,
    // ShieldIcon,
    // UserTagIcon,
    // UserCogIcon,
    // GendersIcon,
    // UserListIcon,
    // SettingsIcon,
    // UserClockIcon,
    // BriefCaseIcon,
    DashboardIcon,
    // FootstepsIcon,
    // HandCoinsIcon,
    // UserShieldIcon,
    // MaintenanceIcon,
    // NotificationIcon,
    // GraduationCapIcon,
    // BuildingBranchIcon,
} from '@/components/icons'
import {
    Sidebar,
    SidebarRail,
    SidebarMenu,
    SidebarGroup,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar'
import EcoopLogo from '@/components/ecoop-logo'
import { INavGroupItem } from '@/components/app-sidebar/types'
import AppSidebarUser from '@/components/app-sidebar/app-sidebar-user'
import AppSidebarItem from '@/components/app-sidebar/app-sidebar-item'
import { flatSidebarGroupItem } from '@/components/app-sidebar/app-sidebar-utils'
import AppSidebarQruickNavigate from '@/components/app-sidebar/app-sidebar-quick-navigate'

import { IBaseProps } from '@/types'
import { useAuthUserWithBranch } from '@/store/user-auth-store'

const SidebarGroupItems = (orgName: string): INavGroupItem[] => {
    return [
        {
            title: 'Home',
            navItems: [
                {
                    type: 'item',
                    title: 'Dashboard',
                    url: `/organization/${orgName}/dashboard`,
                    icon: DashboardIcon,
                },
            ],
        },
    ]
}

const CoopSidebar = (props: IBaseProps) => {
    const router = useRouter()

    const {
        currentAuth: { organization },
    } = useAuthUserWithBranch()

    const sidebarRoutes = useMemo(() => {
        return SidebarGroupItems(organization.name)
    }, [organization.name])

    const sidebarItems = useMemo(
        () =>
            flatSidebarGroupItem(sidebarRoutes).map((item) => ({
                ...item,
                items: item.items.map((itm) => ({
                    ...itm,
                    onClick: (self: typeof itm) => {
                        router.navigate({ to: self.url })
                    },
                })),
            })),
        [router, sidebarRoutes]
    )

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <EcoopLogo className="size-9" />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        eCOOP
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground/80">
                                        Employee
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <AppSidebarQruickNavigate groups={sidebarItems} />
            </SidebarHeader>
            <SidebarContent className="ecoop-scroll">
                {sidebarRoutes.map((navGroupItem, i) => (
                    <SidebarGroup key={`${navGroupItem.title}-${i}`}>
                        <SidebarGroupLabel>
                            {navGroupItem.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navGroupItem.navItems.map((navItem, index) => (
                                    <AppSidebarItem
                                        key={index}
                                        navItem={{ ...navItem, depth: 1 }}
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <AppSidebarUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default CoopSidebar
