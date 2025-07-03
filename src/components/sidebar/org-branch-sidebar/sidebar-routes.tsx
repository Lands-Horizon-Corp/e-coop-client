import {
    PlusIcon,
    BankIcon,
    BillIcon,
    BookIcon,
    QrCodeIcon,
    Users3Icon,
    ShieldIcon,
    UserTagIcon,
    UserCogIcon,
    GendersIcon,
    UserListIcon,
    UserLockIcon,
    PriceTagIcon,
    SettingsIcon,
    BriefCaseIcon,
    DashboardIcon,
    FootstepsIcon,
    HandCoinsIcon,
    ChecksGridIcon,
    MoneyCheckIcon,
    TargetArrowIcon,
    MaintenanceIcon,
    CreditCardIcon2,
    BankDuoToneIcon,
    CalendarDotsIcon,
    AccountSetupIcon,
    FinanceReportsIcon,
    LayersIcon,
    OnlinePaymentIcon,
} from '@/components/icons'
import {
    INavItem,
    INavGroupItem,
    INavItemSingle,
    INavItemDropdown,
} from '@/components/ui/app-sidebar/types'

import { TUserType } from '@/types'

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
                    shortDescription: 'Manage fund transfers and movements',
                },
                {
                    type: 'item',
                    icon: BillIcon,
                    title: 'Payment Types',
                    url: `${baseUrl}/transaction/payment-types`,
                    userType: ['employee'],
                    shortDescription: 'Configure available payment types',
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
                            shortDescription: 'Record and review cash counts',
                        },
                        {
                            title: 'Disbursement',
                            url: `/disbursement`,
                            type: 'item',
                            icon: HandCoinsIcon,
                            userType: ['employee'],
                            shortDescription:
                                'Manage disbursement transactions',
                        },
                        {
                            title: 'Financial Statement',
                            url: `/financial-statement`,
                            type: 'item',
                            icon: BillIcon,
                            userType: ['employee'],
                            shortDescription: 'View financial statements',
                        },
                        {
                            title: 'General Ledger',
                            url: `/general-ledger`,
                            type: 'item',
                            icon: BillIcon,
                            userType: ['employee'],
                            shortDescription: 'Access general ledger records',
                        },
                    ],
                },
            ],
        },

        {
            title: 'Transaction Batch & Entries',
            userType: ['employee'],
            navItems: [
                {
                    type: 'item',
                    icon: LayersIcon,
                    title: 'Transaction Batch',
                    url: `${baseUrl}/transaction/transaction-batch`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'View transaction batches',
                },
                {
                    type: 'item',
                    icon: OnlinePaymentIcon,
                    title: 'Online Entry',
                    url: `${baseUrl}/transaction/online-entry`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'View online entries',
                },
                {
                    type: 'item',
                    icon: MoneyCheckIcon,
                    title: 'Check Entry',
                    url: `${baseUrl}/transaction/check-entry`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'View check entries',
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
                    shortDescription: 'Browse all cooperative members',
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
                            shortDescription: 'Manage member types',
                        },
                        {
                            title: 'Member Group',
                            url: `/member-group`,
                            type: 'item',
                            icon: Users3Icon,
                            userType: ['employee'],
                            shortDescription: 'Manage member groups',
                        },
                        {
                            title: 'Member Center',
                            url: `/member-center`,
                            type: 'item',
                            icon: UserCogIcon,
                            userType: ['employee'],
                            shortDescription: 'Manage member centers',
                        },
                        {
                            title: 'Member Classification',
                            url: `/member-classification`,
                            type: 'item',
                            icon: UserTagIcon,
                            userType: ['employee'],
                            shortDescription: 'Manage member classifications',
                        },
                        {
                            title: 'Member Occupation',
                            url: `/member-occupation`,
                            type: 'item',
                            icon: BriefCaseIcon,
                            userType: ['employee'],
                            shortDescription: 'Manage member occupations',
                        },
                        {
                            title: 'Member Genders',
                            icon: GendersIcon,
                            type: 'item',
                            url: `/member-gender`,
                            userType: ['employee'],
                            shortDescription: 'Manage member genders',
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
                    shortDescription: 'Approve or review pending requests',
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
                    shortDescription: 'Browse all employees',
                },
                {
                    title: 'Permission Template',
                    icon: ShieldIcon,
                    type: 'item',
                    url: `${baseUrl}/role-permission-template`,
                    userType: ['employee'],
                    shortDescription: 'Manage roles permissions',
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
                    shortDescription: 'View and manage accounts',
                },
                {
                    type: 'item',
                    icon: BankIcon,
                    title: 'Computation Type',
                    url: `${baseUrl}/accounting/computation-type`,
                    userType: ['employee'],
                    shortDescription: 'Configure computation types',
                },
            ],
        },
        {
            title: 'Loan',
            userType: ['employee'],
            navItems: [
                {
                    type: 'item',
                    icon: PlusIcon,
                    title: 'Loan Application',
                    url: `${baseUrl}/loan/loan-application`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Create/Add Loan Application',
                },
                {
                    type: 'item',
                    icon: MoneyCheckIcon,
                    title: 'Loans',
                    url: `${baseUrl}/loan/loans`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Manage Loans',
                },
                {
                    type: 'item',
                    icon: PriceTagIcon,
                    title: 'Loan Status',
                    url: `${baseUrl}/loan/loan-status`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Manage Loan Status',
                },
                {
                    type: 'item',
                    icon: TargetArrowIcon,
                    title: 'Loan Purpose',
                    url: `${baseUrl}/loan/loan-purpose`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Manage Loan Purpose',
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
                    shortDescription: 'Manage bills and coins',
                },
                {
                    type: 'item',
                    icon: BankDuoToneIcon,
                    title: 'Banks',
                    url: `${baseUrl}/maintenance/banks`,
                    userType: ['employee'],
                    shortDescription: 'Manage bank records',
                },
                {
                    type: 'item',
                    icon: CalendarDotsIcon,
                    title: 'Holidays',
                    url: `${baseUrl}/maintenance/holidays`,
                    userType: ['employee'],
                    shortDescription: 'Manage holiday schedules',
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
                            icon: QrCodeIcon,
                            title: 'invitation Code',
                            url: `/invitation-code`,
                            userType: ['employee'],
                            shortDescription: 'Manage invitation codes',
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
                            shortDescription: 'Manage account classifications',
                        },
                        {
                            type: 'item',
                            title: 'Account Category',
                            url: `/account-category`,
                            userType: ['employee'],
                            shortDescription: 'Manage account categories',
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
                            shortDescription: 'Configure payment types',
                        },
                    ],
                },
                {
                    title: 'GL Management',
                    icon: BookIcon,
                    type: 'dropdown',
                    url: `${baseUrl}/maintenance/`,
                    userType: ['employee'],
                    items: [
                        {
                            type: 'item',
                            title: 'GL Account Grouping',
                            url: `/gl-accounts-grouping`,
                            userType: ['employee'],
                            shortDescription: 'Manage GL account groupings',
                        },
                        {
                            type: 'item',
                            title: 'GL Definition',
                            url: `/gl-definition`,
                            userType: ['employee'],
                            shortDescription: 'Define general ledger accounts',
                        },
                    ],
                },
                {
                    title: 'FS Configuration',
                    url: `${baseUrl}/maintenance/`,
                    icon: FinanceReportsIcon,
                    type: 'dropdown',
                    userType: ['employee'],
                    items: [
                        {
                            type: 'item',
                            title: 'FS Definition',
                            url: `/fs-definition`,
                            userType: ['employee'],
                            shortDescription: 'Define financial statements',
                        },
                        {
                            type: 'item',
                            title: 'FS Account Grouping',
                            url: `/fs-account-grouping`,
                            userType: ['employee'],
                            shortDescription: 'Group FS accounts',
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
                            shortDescription: 'Group positive net surplus',
                        },
                        {
                            type: 'item',
                            title: '--Net Surplus Grouping',
                            url: `${baseUrl}/maintenace/net-surplus-grouping(negative)`,
                            userType: ['employee'],
                            shortDescription: 'Group negative net surplus',
                        },
                    ],
                },
            ],
        },
        {
            title: 'Timesheet',
            userType: ['employee', 'member'],
            navItems: [
                {
                    type: 'item',
                    title: 'Timesheets',
                    icon: CalendarDotsIcon,
                    url: `${baseUrl}/timesheets`,
                    userType: ['owner', 'employee'],
                    shortDescription: 'View all timesheet records',
                },
                {
                    type: 'item',
                    title: 'My Timesheet',
                    icon: CalendarDotsIcon,
                    url: `${baseUrl}/my-timesheet`,
                    userType: ['employee', 'member'],
                    shortDescription: 'View your personal timesheet',
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
                    shortDescription: 'Track all users’ footsteps',
                },
                {
                    type: 'item',
                    title: 'My Footsteps',
                    icon: FootstepsIcon,
                    url: `${baseUrl}/my-footsteps`,
                    userType: ['employee', 'member', 'owner'],
                    shortDescription: 'Track your own footsteps',
                },
                {
                    type: 'item',
                    title: 'Settings',
                    icon: SettingsIcon,
                    url: `${baseUrl}/settings`,
                    userType: ['employee', 'member'],
                    shortDescription: 'Application settings and preferences',
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
