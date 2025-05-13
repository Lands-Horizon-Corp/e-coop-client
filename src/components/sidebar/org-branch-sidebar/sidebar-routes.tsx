import { TUserType } from '@/types'
import {
    INavGroupItem,
    INavItem,
    INavItemDropdown,
    INavItemSingle,
} from '../../ui/app-sidebar/types'

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
    BriefCaseIcon,
    DashboardIcon,
    FootstepsIcon,
    HandCoinsIcon,
    UserShieldIcon,
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
            title: 'Users',
            userType: ['employee'],
            navItems: [
                {
                    title: 'Members',
                    url: `${baseUrl}/users/members`,
                    icon: UserIcon,
                    type: 'dropdown',
                    userType: ['employee'],
                    items: [
                        {
                            title: 'View Members',
                            url: `/view-members`,
                            type: 'item',
                            icon: UserListIcon,
                            userType: ['employee'],
                        },
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
                {
                    title: 'Employees',
                    url: `${baseUrl}/users/employees`,
                    type: 'dropdown',
                    icon: UserShieldIcon,
                    userType: ['employee'],
                    items: [
                        {
                            title: 'View Employees',
                            url: `/view-employees`,
                            icon: UserListIcon,
                            type: 'item',
                            userType: ['employee'],
                        },
                        {
                            title: 'Employee Footsteps',
                            url: `/employee-footsteps`,
                            icon: FootstepsIcon,
                            type: 'item',
                            userType: ['employee'],
                        },
                    ],
                },
                {
                    title: 'Roles Management',
                    icon: ShieldIcon,
                    type: 'item',
                    url: `${baseUrl}/roles-management`,
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
