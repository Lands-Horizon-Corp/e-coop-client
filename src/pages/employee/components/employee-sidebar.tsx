import { useMemo } from 'react'
import { Link, useRouter } from '@tanstack/react-router'

import {
    UserIcon,
    BankIcon,
    BillIcon,
    ShieldIcon,
    UserTagIcon,
    UserCogIcon,
    GendersIcon,
    UserListIcon,
    SettingsIcon,
    UserClockIcon,
    BriefCaseIcon,
    DashboardIcon,
    FootstepsIcon,
    HandCoinsIcon,
    UserShieldIcon,
    MaintenanceIcon,
    NotificationIcon,
    GraduationCapIcon,
    BuildingBranchIcon,
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

import { IBaseProps } from '@/types/components'
import logger from '@/helpers/loggers/logger'

const employeeSidebarGroupItems: INavGroupItem[] = [
    {
        title: 'Home',
        navItems: [
            {
                type: 'item',
                title: 'Dashboard',
                url: '/employee/dashboard',
                icon: DashboardIcon,
            },
        ],
    },
    {
        title: 'Transaction',
        navItems: [
            {
                type: 'item',
                icon: HandCoinsIcon,
                title: 'Fund Movement',
                url: '/employee/transaction/fund-movement',
            },
            {
                type: 'item',
                icon: BillIcon,
                title: 'Payment Types',
                url: '/employee/transaction/payment-types',
            },
            {
                icon: MaintenanceIcon,
                title: 'Maintenance',
                url: '/employee/transaction/maintenance',
                type: 'dropdown',
                items: [
                    {
                        title: 'Cash Count',
                        url: '/cash-count',
                        type: 'item',
                        icon: HandCoinsIcon,
                    },
                    {
                        title: 'Disbursement',
                        url: '/disbursement',
                        type: 'item',
                        icon: HandCoinsIcon,
                    },
                    {
                        title: 'Financial Statement',
                        url: '/financial-statement',
                        type: 'item',
                        icon: BillIcon,
                    },

                    {
                        title: 'General Ledger',
                        url: '/general-ledger',
                        type: 'item',
                        icon: BillIcon,
                    },
                ],
            },
        ],
    },
    {
        title: 'Users',
        navItems: [
            {
                title: 'Members',
                url: '/employee/users/members',
                icon: UserIcon,
                type: 'dropdown',
                items: [
                    {
                        title: 'View Members',
                        url: '/view-members',
                        type: 'item',
                        icon: UserListIcon,
                    },
                    {
                        title: 'Member Types',
                        url: '/member-types',
                        type: 'item',
                        icon: UserCogIcon,
                    },
                    {
                        title: 'Member Center',
                        url: '/member-center',
                        type: 'item',
                        icon: UserCogIcon,
                    },
                    {
                        title: 'Members Activity',
                        url: '/members-activity',
                        type: 'item',
                        icon: UserClockIcon,
                    },
                    {
                        title: 'Educational Attainments',
                        url: '/member-educational-attainments',
                        type: 'item',
                        icon: GraduationCapIcon,
                    },
                    {
                        title: 'Member Classification',
                        url: '/member-classification',
                        type: 'item',
                        icon: UserTagIcon,
                    },
                    {
                        title: 'Member Occupation',
                        url: '/member-occupation',
                        type: 'item',
                        icon: BriefCaseIcon,
                    },
                    {
                        title: 'Genders',
                        icon: GendersIcon,
                        type: 'item',
                        url: '/genders',
                    },
                ],
            },
            {
                title: 'Employees',
                url: '/employee/users/employees',
                type: 'dropdown',
                icon: UserShieldIcon,
                items: [
                    {
                        title: 'View Employees',
                        url: '/view-employees',
                        icon: UserListIcon,
                        type: 'item',
                    },
                    {
                        title: 'Employee Footsteps',
                        url: '/employee-footsteps',
                        icon: FootstepsIcon,
                        type: 'item',
                    },
                ],
            },
            {
                title: 'Roles Management',
                icon: ShieldIcon,
                type: 'item',
                url: '/employee/roles-management',
            },
        ],
    },
    {
        title: 'Accounting',
        navItems: [
            {
                type: 'item',
                icon: BankIcon,
                title: 'Accounts',
                url: '/employee/accounting/accounts',
            },
            {
                type: 'item',
                icon: BankIcon,
                title: 'Computation Type',
                url: '/employee/accounting/computation-type',
            },
        ],
    },
    {
        title: 'Company',
        navItems: [
            {
                type: 'item',
                title: 'Branch',
                url: '/employee/branches',
                icon: BuildingBranchIcon,
            },
        ],
    },
    {
        title: 'Others',
        navItems: [
            {
                type: 'item',
                icon: NotificationIcon,
                title: 'Notifications',
                url: '/employee/notifications',
            },
            {
                type: 'item',
                title: 'Footsteps',
                icon: FootstepsIcon,
                url: '/employee/footsteps',
            },
            {
                type: 'item',
                icon: UserIcon,
                title: 'Profile',
                url: '/employee/profile',
            },
            {
                type: 'item',
                title: 'Settings',
                icon: SettingsIcon,
                url: '/employee/settings',
            },
        ],
    },
]

const EmployeeSidebar = (props: IBaseProps) => {
    const router = useRouter()

    const item = useMemo(
        () =>
            flatSidebarGroupItem(employeeSidebarGroupItems).map((item) => ({
                ...item,
                items: item.items.map((itm) => ({
                    ...itm,
                    onClick: (self: typeof itm) => {
                        router.navigate({ to: self.url })
                    },
                })),
            })),
        [router]
    )

    logger.log(item)

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/employee">
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
                <AppSidebarQruickNavigate groups={item} />
            </SidebarHeader>
            <SidebarContent className="ecoop-scroll">
                {employeeSidebarGroupItems.map((navGroupItem, i) => (
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

export default EmployeeSidebar
