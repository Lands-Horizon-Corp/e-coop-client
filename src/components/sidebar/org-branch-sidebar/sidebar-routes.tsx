import { TUserType } from '@/types'
import {
    INavItem,
    INavGroupItem,
    INavItemSingle,
    INavItemDropdown,
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
    CalendarDotsIcon,
    BankDuoToneIcon,
    CodeSandBox,
    UserLockIcon,
    AccountSetupIcon,
    CreditCardIcon2,
    BookIcon,
    FinanceReportsIcon,
    ChecksGridIcon,
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
            title: 'Members',
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
            title: 'Approval & Request',
            userType: ['employee'],
            navItems: [
                {
                    title: 'Approvals',
                    url: `${baseUrl}/approvals`,
                    icon: ChecksGridIcon,
                    type: 'item',
                    userType: ['employee'],
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
                // {
                //     title: 'Employee Footsteps',
                //     url: `${baseUrl}/employee-footstep`,
                //     icon: FootstepsIcon,
                //     type: 'item',
                //     userType: ['employee'],
                // },
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
            title: 'Maintenance',
            userType: ['employee'],
            navItems: [
                {
                    type: 'item',
                    icon: BillIcon,
                    title: 'Bills & Coins',
                    url: `${baseUrl}/maintenance/bills-and-coins`,
                    userType: ['employee'],
                },
                {
                    type: 'item',
                    icon: BankDuoToneIcon,
                    title: 'Banks',
                    url: `${baseUrl}/maintenance/banks`,
                    userType: ['employee'],
                },
                {
                    type: 'item',
                    icon: CalendarDotsIcon,
                    title: 'Holidays',
                    url: `${baseUrl}/maintenance/holidays`,
                    userType: ['employee'],
                },
                {
                    title: 'Access & Onboarding',
                    icon: UserLockIcon,
                    type: 'dropdown',
                    url: `${baseUrl}/maintenance/`,
                    userType: ['employee'],
                    items: [
                        {
                            type: 'item',
                            icon: CodeSandBox,
                            title: 'invitation Code',
                            url: `/invitation-code`,
                            userType: ['employee'],
                        },
                    ],
                },
                {
                    title: 'Account Setup',
                    icon: AccountSetupIcon,
                    type: 'dropdown',
                    url: `${baseUrl}/maintenance/`,
                    userType: ['employee'],
                    items: [
                        {
                            type: 'item',
                            title: 'Account Classification',
                            url: `/account-classification`,
                            userType: ['employee'],
                        },
                        {
                            type: 'item',
                            title: 'Account Category',
                            url: `/account-category`,
                            userType: ['employee'],
                        },
                    ],
                },
                {
                    title: 'Payment Configuration',
                    icon: CreditCardIcon2,
                    type: 'dropdown',
                    url: `${baseUrl}/maintenance/`,
                    userType: ['employee'],
                    items: [
                        {
                            type: 'item',
                            title: 'Payment Type',
                            url: `/payment-type`,
                            userType: ['employee'],
                        },
                    ],
                },
                {
                    title: 'GL Management',
                    icon: BookIcon,
                    type: 'dropdown',
                    userType: ['employee'],
                    items: [
                        {
                            type: 'item',
                            title: 'GL Account Grouping',
                            url: `${baseUrl}/maintenance/account-classification`,
                            userType: ['employee'],
                        },
                        {
                            type: 'item',
                            title: 'GL Definition',
                            url: `${baseUrl}/maintenance/account-classification`,
                            userType: ['employee'],
                        },
                    ],
                },
                {
                    title: 'Financial Statement Configuration',
                    url: `${baseUrl}/maintenance/general-ledger-management`,
                    icon: FinanceReportsIcon,
                    type: 'dropdown',
                    userType: ['employee'],
                    items: [
                        {
                            type: 'item',
                            title: 'FS Definition',
                            url: `${baseUrl}/maintenance/account-classification`,
                            userType: ['employee'],
                        },
                        {
                            type: 'item',
                            title: 'FS Account Grouping',
                            url: `${baseUrl}/maintenance/account-classification`,
                            userType: ['employee'],
                        },
                        {
                            type: 'item',
                            title: 'FS Accounts Definition',
                            url: `${baseUrl}/maintenance/account-classification`,
                            userType: ['employee'],
                        },
                    ],
                },
                {
                    title: 'Surplus Handling',
                    icon: FinanceReportsIcon,
                    type: 'dropdown',
                    userType: ['employee'],
                    items: [
                        {
                            type: 'item',
                            title: '++Net Surplus Grouping',
                            url: `${baseUrl}/maintenace/net-surplus-grouping(positive)`,
                            userType: ['employee'],
                        },
                        {
                            type: 'item',
                            title: '--Net Surplus Grouping',
                            url: `${baseUrl}/maintenace/net-surplus-grouping(negative)`,
                            userType: ['employee'],
                        },
                    ],
                },
            ],
        },
        {
            title: 'Others',
            userType: ['employee', 'member'],
            navItems: [
                {
                    type: 'item',
                    title: 'Users Footsteps',
                    icon: FootstepsIcon,
                    url: `${baseUrl}/users-footsteps`,
                    userType: ['owner', 'employee'],
                },
                {
                    type: 'item',
                    title: 'My Footsteps',
                    icon: FootstepsIcon,
                    url: `${baseUrl}/my-footsteps`,
                    userType: ['employee', 'member', 'owner'],
                },
                {
                    type: 'item',
                    title: 'Settings',
                    icon: SettingsIcon,
                    url: `${baseUrl}/settings`,
                    userType: ['employee', 'member'],
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
