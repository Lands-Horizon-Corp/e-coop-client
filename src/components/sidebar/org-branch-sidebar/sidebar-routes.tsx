import {
    AccountSetupIcon,
    BankDuoToneIcon,
    BankIcon,
    BillIcon,
    BookStackIcon,
    BriefCaseIcon,
    CalendarDotsIcon,
    ChecksGridIcon,
    DashboardIcon,
    FinanceReportsIcon,
    FootstepsIcon,
    GendersIcon,
    HandCoinsIcon,
    HouseLockIcon,
    LayersIcon,
    MaintenanceIcon,
    MoneyCheckIcon,
    OnlinePaymentIcon,
    PlusIcon,
    PriceTagIcon,
    QrCodeIcon,
    SettingsIcon,
    ShieldIcon,
    TagIcon,
    TargetArrowIcon,
    UserCogIcon,
    UserListIcon,
    UserLockIcon,
    UserTagIcon,
    Users3Icon,
} from '@/components/icons'
import {
    INavGroupItem,
    INavItem,
    INavItemDropdown,
    INavItemSingle,
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
            userType: ['employee', 'owner'],
            navItems: [
                {
                    type: 'item',
                    icon: HandCoinsIcon,
                    title: 'Fund Movement',
                    url: `${baseUrl}/transaction/fund-movement`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Manage fund transfers and movements',
                },
                {
                    type: 'item',
                    icon: BillIcon,
                    title: 'Payment Types',
                    url: `${baseUrl}/transaction/payment-type`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Configure available payment types',
                },
                {
                    icon: MaintenanceIcon,
                    title: 'Maintenance',
                    url: `${baseUrl}/transaction/maintenance`,
                    type: 'dropdown',
                    userType: ['employee', 'owner'],
                    items: [
                        {
                            title: 'Cash Count',
                            url: `/cash-count`,
                            type: 'item',
                            icon: HandCoinsIcon,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Record and review cash counts',
                        },
                        {
                            title: 'Disbursement',
                            url: `/disbursement`,
                            type: 'item',
                            icon: HandCoinsIcon,
                            userType: ['employee', 'owner'],
                            shortDescription:
                                'Manage disbursement transactions',
                        },
                        {
                            title: 'Financial Statement',
                            url: `/financial-statement`,
                            type: 'item',
                            icon: BillIcon,
                            userType: ['employee', 'owner'],
                            shortDescription: 'View financial statements',
                        },
                        {
                            title: 'General Ledger',
                            url: `/general-ledger-definition`,
                            type: 'item',
                            icon: BillIcon,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Access general ledger records',
                        },
                    ],
                },
            ],
        },

        {
            title: 'Transaction Batch & Entries',
            userType: ['employee', 'owner'],
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
                    icon: LayersIcon,
                    title: 'Transactions',
                    url: `${baseUrl}/transaction/transactions`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'View transactions',
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
            userType: ['employee', 'owner'],
            navItems: [
                {
                    title: 'All Members',
                    url: `${baseUrl}/view-members`,
                    type: 'item',
                    icon: UserListIcon,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Browse all cooperative members',
                },
                {
                    title: 'Member Settings',
                    url: `${baseUrl}/members`,
                    icon: MaintenanceIcon,
                    type: 'dropdown',
                    userType: ['employee', 'owner'],
                    items: [
                        {
                            title: 'Member Types',
                            url: `/member-types`,
                            type: 'item',
                            icon: UserCogIcon,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Manage member types',
                        },
                        {
                            title: 'Member Group',
                            url: `/member-group`,
                            type: 'item',
                            icon: Users3Icon,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Manage member groups',
                        },
                        {
                            title: 'Member Center',
                            url: `/member-center`,
                            type: 'item',
                            icon: UserCogIcon,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Manage member centers',
                        },
                        {
                            title: 'Member Classification',
                            url: `/member-classification`,
                            type: 'item',
                            icon: UserTagIcon,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Manage member classifications',
                        },
                        {
                            title: 'Member Occupation',
                            url: `/member-occupation`,
                            type: 'item',
                            icon: BriefCaseIcon,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Manage member occupations',
                        },
                        {
                            title: 'Member Genders',
                            icon: GendersIcon,
                            type: 'item',
                            url: `/member-gender`,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Manage member genders',
                        },
                    ],
                },
            ],
        },
        {
            title: 'Approval & Request',
            userType: ['employee', 'owner'],
            navItems: [
                {
                    title: 'Approvals',
                    url: `${baseUrl}/approvals`,
                    icon: ChecksGridIcon,
                    type: 'item',
                    userType: ['employee', 'owner'],
                    shortDescription: 'Approve or review pending requests',
                },
            ],
        },
        {
            title: 'Employee',
            userType: ['employee', 'owner'],
            navItems: [
                {
                    title: 'View Employees',
                    url: `${baseUrl}/employees/view-employees`,
                    icon: UserListIcon,
                    type: 'item',
                    userType: ['employee', 'owner'],
                    shortDescription: 'Browse all employees',
                },
                {
                    title: 'Permission Template',
                    icon: ShieldIcon,
                    type: 'item',
                    url: `${baseUrl}/permission-template`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Manage role template permissions',
                },
                {
                    type: 'item',
                    title: 'Employee Footsteps',
                    icon: FootstepsIcon,
                    url: `${baseUrl}/employee-footsteps`,
                    userType: ['owner', 'employee'],
                    shortDescription: 'Track all employee footsteps',
                },
            ],
        },
        {
            title: 'Accounting',
            userType: ['employee', 'owner'],
            navItems: [
                {
                    type: 'item',
                    icon: BankIcon,
                    title: 'Accounts',
                    url: `${baseUrl}/accounting/accounts`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'View and manage accounts',
                },
                {
                    type: 'item',
                    icon: BankIcon,
                    title: 'Computation Type',
                    url: `${baseUrl}/accounting/computation-type`,
                    userType: ['employee', 'owner'],
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
                {
                    type: 'item',
                    icon: BookStackIcon,
                    title: 'Computation Scheme',
                    url: `${baseUrl}/loan/computation-sheet-scheme`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Manage Loan Computation Sheet Schemes',
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
                    icon: TagIcon,
                    title: 'Tag Templates',
                    url: `${baseUrl}/maintenance/tag-template`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Manage bills and coins',
                },
                {
                    type: 'item',
                    icon: HouseLockIcon,
                    title: 'Collateral',
                    url: `${baseUrl}/maintenance/collateral`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Manage bills and coins',
                },
                {
                    type: 'item',
                    icon: BankDuoToneIcon,
                    title: 'Banks',
                    url: `${baseUrl}/maintenance/banks`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Manage bank records',
                },
                {
                    type: 'item',
                    icon: CalendarDotsIcon,
                    title: 'Holidays',
                    url: `${baseUrl}/maintenance/holidays`,
                    userType: ['employee', 'owner'],
                    shortDescription: 'Manage holiday schedules',
                },
                {
                    title: 'Access & Onboarding',
                    icon: UserLockIcon,
                    type: 'dropdown',
                    url: `${baseUrl}/maintenance/`,
                    userType: ['employee', 'owner'],
                    items: [
                        {
                            type: 'item',
                            icon: QrCodeIcon,
                            title: 'invitation Code',
                            url: `/invitation-code`,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Manage invitation codes',
                        },
                    ],
                },
                {
                    title: 'Account Setup',
                    icon: AccountSetupIcon,
                    type: 'dropdown',
                    url: `${baseUrl}/maintenance/`,
                    userType: ['employee', 'owner'],
                    items: [
                        {
                            type: 'item',
                            title: 'Account Classification',
                            url: `/account-classification`,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Manage account classifications',
                        },
                        {
                            type: 'item',
                            title: 'Account Category',
                            url: `/account-category`,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Manage account categories',
                        },
                    ],
                },
                {
                    title: 'Surplus Handling',
                    icon: FinanceReportsIcon,
                    type: 'dropdown',
                    userType: ['employee', 'owner'],
                    items: [
                        {
                            type: 'item',
                            title: '++Net Surplus Grouping',
                            url: `${baseUrl}/maintenace/net-surplus-grouping(positive)`,
                            userType: ['employee', 'owner'],
                            shortDescription: 'Group positive net surplus',
                        },
                        {
                            type: 'item',
                            title: '--Net Surplus Grouping',
                            url: `${baseUrl}/maintenace/net-surplus-grouping(negative)`,
                            userType: ['employee', 'owner'],
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
                    title: 'My Branch Footsteps',
                    icon: FootstepsIcon,
                    url: `${baseUrl}/my-branch-footsteps`,
                    userType: ['employee', 'member', 'owner'],
                    shortDescription: 'Track your own footsteps',
                },
                {
                    type: 'item',
                    title: 'All My Footsteps',
                    icon: FootstepsIcon,
                    url: `${baseUrl}/my-all-footsteps`,
                    userType: ['employee', 'member', 'owner'],
                    shortDescription:
                        'Track your all footsteps from all branch and orgs',
                },
                {
                    type: 'item',
                    title: 'Settings',
                    icon: SettingsIcon,
                    url: `${baseUrl}/settings`,
                    userType: ['employee', 'member', 'owner'],
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
