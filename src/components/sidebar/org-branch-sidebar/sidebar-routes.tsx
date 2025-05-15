import { TUserType } from '@/types'
import {
    INavGroupItem,
    INavItem,
    INavItemDropdown,
    INavItemSingle,
} from '../../ui/app-sidebar/types'

import {
    BankIcon,
    BillIcon,
    ShieldIcon,
    UserTagIcon,
    UserCogIcon,
    GendersIcon,
    UserListIcon,
    SettingsIcon,
    BriefCaseIcon,
    DashboardIcon,
    FootstepsIcon,
    HandCoinsIcon,
    MaintenanceIcon,
    Users3Icon,
    // NotificationIcon,
    // GraduationCapIcon,
    // BuildingBranchIcon,
} from '@/components/icons'

const filterNavItemsByUserType = (
    items: INavItem[],
    userType: TUserType
): INavItem[] => {
    return items
        .filter((item) => item.userType.includes(userType))
        .map((item) => {
            if (item.type === 'dropdown') {
                const filteredSubItems = filterNavItemsByUserType(
                    item.items,
                    userType
                )
                return {
                    ...item,
                    items: filteredSubItems,
                } as INavItemDropdown
            }
            return item as INavItemSingle
        })
        .filter((item) => item.type !== 'dropdown' || item.items.length > 0)
}

export const generateSidebarGroups = (
    baseUrl: string,
    userType: TUserType
): INavGroupItem[] => {
    const sidebarGroups: INavGroupItem[] = [
        {
            title: 'Home',
            userType: ['employee', 'member'],
            navItems: [
                {
                    type: 'item',
                    title: 'Dashboard',
                    url: `${baseUrl}/dashboard`,
                    shortDescription: 'Monitor your data',
                    icon: DashboardIcon,
                    userType: ['employee', 'member'],
                },
            ],
        },
        {
            title: 'Transaction',
            userType: ['employee'],
            navItems: [
                {
                    type: 'item',
                    icon: HandCoinsIcon,
                    title: 'Fund Movement',
                    url: `${baseUrl}/transaction/fund-movement`,
                    userType: ['employee'],
                },
                {
                    type: 'item',
                    icon: BillIcon,
                    title: 'Payment Types',
                    url: `${baseUrl}/transaction/payment-types`,
                    userType: ['employee'],
                },
                {
                    icon: MaintenanceIcon,
                    title: 'Maintenance',
                    url: `${baseUrl}/transaction/maintenance`,
                    type: 'dropdown',
                    userType: ['employee'],
                    items: [
                        {
                            title: 'Cash Count',
                            url: `/cash-count`,
                            type: 'item',
                            icon: HandCoinsIcon,
                            userType: ['employee'],
                        },
                        {
                            title: 'Disbursement',
                            url: `/disbursement`,
                            type: 'item',
                            icon: HandCoinsIcon,
                            userType: ['employee'],
                        },
                        {
                            title: 'Financial Statement',
                            url: `/financial-statement`,
                            type: 'item',
                            icon: BillIcon,
                            userType: ['employee'],
                        },
                        {
                            title: 'General Ledger',
                            url: `/general-ledger`,
                            type: 'item',
                            icon: BillIcon,
                            userType: ['employee'],
                        },
                    ],
                },
            ],
        },
        {
            title: 'Users & Members',
            userType: ['employee'],
            navItems: [
                {
                    title: 'All Members',
                    url: `${baseUrl}/view-members`,
                    type: 'item',
                    icon: UserListIcon,
                    userType: ['employee'],
                },
                {
                    title: 'Member Settings',
                    url: `${baseUrl}/members`,
                    icon: MaintenanceIcon,
                    type: 'dropdown',
                    userType: ['employee'],
                    items: [
                        {
                            title: 'Member Types',
                            url: `/member-types`,
                            type: 'item',
                            icon: UserCogIcon,
                            userType: ['employee'],
                        },
                        {
                            title: 'Member Group',
                            url: `/member-group`,
                            type: 'item',
                            icon: Users3Icon,
                            userType: ['employee'],
                        },
                        {
                            title: 'Member Center',
                            url: `/member-center`,
                            type: 'item',
                            icon: UserCogIcon,
                            userType: ['employee'],
                        },
                        {
                            title: 'Member Classification',
                            url: `/member-classification`,
                            type: 'item',
                            icon: UserTagIcon,
                            userType: ['employee'],
                        },
                        {
                            title: 'Member Occupation',
                            url: `/member-occupation`,
                            type: 'item',
                            icon: BriefCaseIcon,
                            userType: ['employee'],
                        },
                        {
                            title: 'Member Genders',
                            icon: GendersIcon,
                            type: 'item',
                            url: `/member-gender`,
                            userType: ['employee'],
                        },
                    ],
                },
            ],
        },
        {
            title: 'Employee',
            userType: ['employee'],
            navItems: [
                {
                    title: 'View Employees',
                    url: `${baseUrl}/employees/view-employees`,
                    icon: UserListIcon,
                    type: 'item',
                    userType: ['employee'],
                },
                {
                    title: 'Employee Footsteps',
                    url: `${baseUrl}/employee-footstep`,
                    icon: FootstepsIcon,
                    type: 'item',
                    userType: ['employee'],
                },
                {
                    title: 'Roles Management',
                    icon: ShieldIcon,
                    type: 'item',
                    url: `${baseUrl}/employees/roles-management`,
                    userType: ['employee'],
                },
            ],
        },
        {
            title: 'Accounting',
            userType: ['employee'],
            navItems: [
                {
                    type: 'item',
                    icon: BankIcon,
                    title: 'Accounts',
                    url: `${baseUrl}/accounting/accounts`,
                    userType: ['employee'],
                },
                {
                    type: 'item',
                    icon: BankIcon,
                    title: 'Computation Type',
                    url: `${baseUrl}/accounting/computation-type`,
                    userType: ['employee'],
                },
            ],
        },
        {
            title: 'Others',
            userType: ['employee'],
            navItems: [
                {
                    type: 'item',
                    title: 'Footsteps',
                    icon: FootstepsIcon,
                    url: `${baseUrl}/footsteps`,
                    userType: ['employee'],
                },
                {
                    type: 'item',
                    title: 'Settings',
                    icon: SettingsIcon,
                    url: `${baseUrl}/settings`,
                    userType: ['employee'],
                },
            ],
        },
    ]

    return sidebarGroups
        .map((group) => {
            if (!group.userType.includes(userType)) return null

            const filteredNavItems = filterNavItemsByUserType(
                group.navItems,
                userType
            )

            if (filteredNavItems.length === 0) return null

            return {
                ...group,
                navItems: filteredNavItems,
            }
        })
        .filter(Boolean) as INavGroupItem[]
}
