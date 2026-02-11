import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { TUserType } from '@/modules/user'

import {
    BankDuoToneIcon,
    BankIcon,
    BillIcon,
    BookIcon,
    BookOpenIcon,
    BookStackIcon,
    BriefCaseIcon,
    CalendarDotsIcon,
    CashClockIcon,
    ChecksGridIcon,
    CurlyBracketIcon,
    DashboardIcon,
    FootstepsIcon,
    GendersIcon,
    GridFillIcon,
    HandCoinsIcon,
    HandDepositIcon,
    HandDropCoinsIcon,
    HandHeartIcon,
    HandWithdrawIcon,
    HouseLockIcon,
    LayersIcon,
    MaintenanceIcon,
    MapMarkedIcon,
    MoneyCheckIcon,
    MoneyIcon,
    PeopleGroupIcon,
    PercentIcon,
    // PlusIcon,
    PriceTagIcon,
    QrCodeIcon,
    SettingsIcon,
    ShieldIcon,
    TagIcon,
    TargetArrowIcon,
    UserCogIcon,
    UserIcon,
    UserListIcon,
    UserTagIcon,
    Users3Icon,
    Users3LineIcon,
    WrenchIcon,
} from '@/components/icons'
import {
    INavGroupItem,
    INavItem,
    INavItemDropdown,
    INavItemSingle,
} from '@/components/ui/app-sidebar/types'

const filterNavItemsByUserType = (
    items: INavItem[],
    userType: TUserType
): INavItem[] => {
    return items
        .filter((item) =>
            /* item.userType.includes(userType) && */ item.canAccess !==
            undefined
                ? item.canAccess
                : true
        )
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
            // userType: ['employee', 'member'],
            navItems: [
                {
                    type: 'item',
                    title: 'Dashboard',
                    url: `${baseUrl}/dashboard`,
                    shortDescription: 'Monitor your data',
                    icon: DashboardIcon,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Dashboard',
                    }),
                    // userType: ['employee', 'member'],
                },
                {
                    title: 'Approvals',
                    url: `${baseUrl}/approvals`,
                    icon: ChecksGridIcon,
                    type: 'item',
                    // userType: ['employee', 'owner'],
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Approvals',
                    }),
                    shortDescription: 'Approve or review pending requests',
                },
            ],
        },
        {
            title: 'Transaction',
            // userType: ['employee', 'owner'],
            navItems: [
                {
                    type: 'item',
                    icon: HandCoinsIcon,
                    title: 'Payment',
                    url: `${baseUrl}/payment`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Transaction',
                    }),
                    shortDescription: 'Manage fund transfers and movements',
                },
                {
                    type: 'item',
                    icon: HandDepositIcon,
                    title: 'Deposit',
                    url: `${baseUrl}/deposit`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'QuickDeposit',
                    }),
                    shortDescription: 'Quickly deposit funds',
                },
                {
                    type: 'item',
                    icon: HandWithdrawIcon,
                    title: 'Withdraw',
                    url: `${baseUrl}/withdraw`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'QuickWithdraw',
                    }),
                    shortDescription: 'Quickly withdraw funds',
                },
                {
                    type: 'item',
                    icon: BookIcon,
                    title: 'Journal Voucher',
                    url: `${baseUrl}/journal-voucher`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'JournalVoucher',
                    }),
                    shortDescription: 'Manage journal vouchers',
                },
                {
                    type: 'item',
                    icon: MoneyIcon,
                    title: 'Cash Check Voucher',
                    url: `${baseUrl}/cash-check-journal-voucher`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'CashCheckVoucher',
                    }),
                    shortDescription: 'Manage cash check vouchers',
                },
                {
                    type: 'item',
                    icon: WrenchIcon,
                    title: 'Adjustment Entry',
                    url: `${baseUrl}/adjustment-entry`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'AdjustmentEntry',
                    }),
                    shortDescription: 'Manage cash adjustment entries',
                },
                {
                    type: 'item',
                    icon: MoneyCheckIcon,
                    title: 'Loans',
                    url: `${baseUrl}/loan`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Loan',
                    }),
                    shortDescription: 'Manage loans / apply loan',
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
                    url: `${baseUrl}/accounts`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Account',
                    }),
                    shortDescription: 'View and manage accounts',
                },
                {
                    type: 'item',
                    icon: BookOpenIcon,
                    title: 'General Ledger',
                    url: `${baseUrl}/general-ledger-definition`,
                    // canAccess: hasPermissionFromAuth({
                    //     action: 'Read',
                    //     resourceType: 'GeneralLedger',
                    // }),
                    shortDescription: 'View general ledger',
                },
                {
                    type: 'item',
                    icon: BillIcon,
                    title: 'Financial Statement',
                    url: `${baseUrl}/financial-statement-definition`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'FSDefinition',
                    }),
                    shortDescription: 'View financial statements',
                },
            ],
        },
        {
            title: 'Members',
            navItems: [
                {
                    title: 'Members',
                    url: `${baseUrl}/view-members`,
                    type: 'item',
                    icon: UserListIcon,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'MemberProfile',
                    }),
                    shortDescription: 'Browse all members/member profile',
                },
                {
                    title: 'Member Accounting Ledger',
                    url: `${baseUrl}/member-accounting-ledger`,
                    type: 'item',
                    icon: UserListIcon,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'MemberAccountingLedger',
                    }),
                    shortDescription: 'Browse overall member accounting ledger',
                },
                {
                    title: 'Member Settings',
                    type: 'dropdown',
                    icon: MaintenanceIcon,
                    url: `${baseUrl}/member-settings`,
                    items: [
                        {
                            title: 'Member Types',
                            url: `/member-types`,
                            type: 'item',
                            icon: UserCogIcon,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MemberType',
                            }),
                            shortDescription: 'Manage member types',
                        },
                        {
                            title: 'Member Group',
                            url: `/member-group`,
                            type: 'item',
                            icon: Users3Icon,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MemberGroup',
                            }),
                            shortDescription: 'Manage member groups',
                        },
                        {
                            title: 'Member Center',
                            url: `/member-center`,
                            type: 'item',
                            icon: UserCogIcon,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MemberGender',
                            }),
                            shortDescription: 'Manage member centers',
                        },
                        {
                            title: 'Member Classification',
                            url: `/member-classification`,
                            type: 'item',
                            icon: UserTagIcon,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MemberClassification',
                            }),
                            shortDescription: 'Manage member classifications',
                        },
                        {
                            title: 'Member Occupation',
                            url: `/member-occupation`,
                            type: 'item',
                            icon: BriefCaseIcon,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MemberOccupation',
                            }),
                            shortDescription: 'Manage member occupations',
                        },
                        {
                            title: 'Member Genders',
                            icon: GendersIcon,
                            type: 'item',
                            url: `/member-gender`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MemberGender',
                            }),
                            shortDescription: 'Manage member genders',
                        },
                        {
                            title: 'Member Department',
                            url: `/member-department`,
                            type: 'item',
                            icon: Users3LineIcon,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MemberDepartment',
                            }),
                            shortDescription: 'Manage member departments',
                        },
                    ],
                },
            ],
        },

        {
            title: 'Blotter',
            navItems: [
                {
                    type: 'item',
                    icon: LayersIcon,
                    title: 'Transaction Batch',
                    url: `${baseUrl}/transaction-batch`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'TransactionBatch',
                    }),
                    shortDescription: 'View transaction batches',
                },
                {
                    type: 'item',
                    icon: LayersIcon,
                    title: 'Transactions',
                    url: `${baseUrl}/transactions`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Transactions',
                    }),
                    shortDescription: 'View transactions',
                },
                {
                    type: 'item',
                    icon: HandDropCoinsIcon,
                    title: 'Disbursement Transactions',
                    url: `${baseUrl}/disbursement-transaction`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'DisbursementTransaction',
                    }),
                    shortDescription: 'View disbursement transactions',
                },
                {
                    type: 'item',
                    icon: HandCoinsIcon,
                    title: 'Cash Count',
                    url: `${baseUrl}/cash-count`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'CashCount',
                    }),
                    shortDescription: 'Record and review cash counts',
                },
            ],
        },

        {
            title: 'Schemes',
            navItems: [
                {
                    type: 'item',
                    icon: BookStackIcon,
                    title: 'Computation Scheme',
                    url: `${baseUrl}/schemes?tab=computation-sheet-scheme`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'LoanScheme',
                    }),
                    shortDescription: 'Manage loan computation schemes',
                },
                {
                    type: 'item',
                    icon: GridFillIcon,
                    title: 'Loan Charge Scheme',
                    url: `${baseUrl}/schemes?tab=loan-charges-scheme`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'LoanChargeScheme',
                    }),
                    shortDescription: 'Manage loan charges',
                },
                {
                    type: 'item',
                    icon: CashClockIcon,
                    title: 'Time Deposit Scheme',
                    url: `${baseUrl}/schemes?tab=time-deposit-scheme`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'TimeDepositScheme',
                    }),
                    shortDescription: 'Manage time deposit schemes',
                },
                {
                    type: 'item',
                    icon: UserIcon,
                    title: 'Browse Reference',
                    url: `${baseUrl}/schemes?tab=browse-reference`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'MemberTypeBrowseReference',
                    }),
                    shortDescription: 'Browse reference data',
                },
            ],
        },

        {
            title: 'System',
            navItems: [
                {
                    type: 'item',
                    icon: PercentIcon,
                    title: 'Savings Interest System',
                    url: `${baseUrl}/system/generate-savings-interest`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'GenerateSavingsInterest',
                    }),
                },
                {
                    type: 'item',
                    icon: HandHeartIcon,
                    title: 'Mutual Fund/Aid System',
                    url: `${baseUrl}/system/generate-mutual-aid`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'GenerateMutualFundAid',
                    }),
                },
                {
                    type: 'item',
                    icon: BookIcon,
                    title: 'Account Transaction System',
                    url: `${baseUrl}/system/account-transaction`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'AccountTransaction',
                    }),
                    shortDescription: 'Automates daily accounting processes',
                },
            ],
        },

        {
            title: 'Employee',
            navItems: [
                {
                    type: 'item',
                    title: 'Employees',
                    icon: UserListIcon,
                    url: `${baseUrl}/view-employees`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Employee',
                    }),
                    shortDescription: 'Browse/view all employees',
                },
                {
                    type: 'item',
                    title: 'Permission Template',
                    icon: ShieldIcon,
                    url: `${baseUrl}/permission-template`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'PermissionTemplate',
                    }),
                    shortDescription: 'Manage role template permissions',
                },
                {
                    type: 'item',
                    icon: QrCodeIcon,
                    title: 'invitation Code',
                    url: `${baseUrl}/invitation-code`,
                    // userType: ['employee', 'owner'],

                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'InvitationCode',
                    }),
                    shortDescription: 'Manage invitation codes',
                },
                {
                    type: 'item',
                    title: 'All Employee Footsteps',
                    icon: FootstepsIcon,
                    url: `${baseUrl}/employee-footsteps`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'EmployeeFootstep',
                    }),
                    shortDescription: 'Track all employee footsteps',
                },
                {
                    type: 'item',
                    title: 'All Timesheets',
                    icon: FootstepsIcon,
                    url: `${baseUrl}/timesheets`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Timesheet',
                    }),
                    shortDescription: 'Track all employee footsteps',
                },
            ],
        },

        {
            title: 'Maintenance',
            navItems: [
                {
                    type: 'item',
                    icon: BillIcon,
                    title: 'Bills & Coins',
                    url: `${baseUrl}/maintenance/bills-and-coins`,
                    // userType: ['employee'],

                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'BillsAndCoins',
                    }),
                    shortDescription: 'Manage bills and coins',
                },
                {
                    type: 'item',
                    icon: TagIcon,
                    title: 'Tag Templates',
                    url: `${baseUrl}/maintenance/tag-template`,
                    // userType: ['employee', 'owner'],

                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'TagTemplate',
                    }),
                    shortDescription: 'Manage Tag Templates',
                },
                {
                    type: 'item',
                    icon: BankDuoToneIcon,
                    title: 'Banks',
                    url: `${baseUrl}/maintenance/banks`,
                    // userType: ['employee', 'owner'],

                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Bank',
                    }),
                    shortDescription: 'Manage bank records',
                },
                {
                    type: 'item',
                    icon: MapMarkedIcon,
                    title: 'Area',
                    url: `${baseUrl}/maintenance/area`,
                    // userType: ['employee', 'owner'],

                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Area',
                    }),
                    shortDescription: 'Manage Area',
                },
                {
                    type: 'item',
                    icon: CalendarDotsIcon,
                    title: 'Holidays',
                    url: `${baseUrl}/maintenance/holidays`,
                    // userType: ['employee', 'owner'],

                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Holiday',
                    }),
                    shortDescription: 'Manage holiday schedules',
                },
                {
                    type: 'item',
                    icon: PeopleGroupIcon,
                    title: 'Company',
                    url: `${baseUrl}/maintenance/company`,
                    // userType: ['employee', 'owner'],

                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'Company',
                    }),
                    shortDescription: 'Manage company settings',
                },
                {
                    title: 'Loans',
                    type: 'dropdown',
                    icon: HandCoinsIcon,
                    url: `${baseUrl}/maintenance/loans`,
                    items: [
                        {
                            type: 'item',
                            title: 'Collateral',
                            icon: HouseLockIcon,
                            url: `/collateral`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'Collateral',
                            }),
                            shortDescription: 'Manage common collaterals',
                        },
                        {
                            type: 'item',
                            title: 'Loan Status',
                            icon: PriceTagIcon,
                            url: `/loan-status`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'LoanStatus',
                            }),
                            shortDescription: 'Manage loan status',
                        },
                        {
                            type: 'item',
                            title: 'Loan Purpose',
                            icon: TargetArrowIcon,
                            url: `/loan-purpose`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'LoanPurpose',
                            }),
                            shortDescription: 'Manage loan purpose',
                        },
                    ],
                },
                {
                    title: 'Accounts',
                    type: 'dropdown',
                    icon: BankIcon,
                    url: `${baseUrl}/maintenance/accounts`,
                    items: [
                        {
                            type: 'item',
                            title: 'Account Classification',
                            url: `/account-classification`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'AccountClassification',
                            }),
                            shortDescription: 'Manage account classifications',
                        },
                        {
                            type: 'item',
                            title: 'Account Category',
                            url: `/account-category`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'AccountCategory',
                            }),
                            shortDescription: 'Manage account categories',
                        },
                        {
                            type: 'item',
                            title: 'Payment Type',
                            url: `/payment-type`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'PaymentType',
                            }),
                            shortDescription: 'Configure payment types',
                        },
                        {
                            type: 'item',
                            title: 'Disbursement Type',
                            url: `/disbursement-type`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'DisburesmentType',
                            }),
                            shortDescription: 'Manage disbursement types',
                        },
                    ],
                },
            ],
        },

        {
            title: 'Settings',
            navItems: [
                {
                    type: 'item',
                    title: 'Settings',
                    icon: SettingsIcon,
                    url: `${baseUrl}/settings`,
                    canAccess:
                        hasPermissionFromAuth({
                            action: 'Read',
                            resourceType: 'BranchSettings',
                        }) ||
                        hasPermissionFromAuth({
                            action: 'Read',
                            resourceType: 'MySettings',
                        }),
                    shortDescription: 'Application and branch configuration',
                },
                {
                    type: 'item',
                    title: 'API Documentation',
                    icon: CurlyBracketIcon,
                    url: `${baseUrl}/dev/documentation`,
                    canAccess: hasPermissionFromAuth({
                        action: 'Read',
                        resourceType: 'ApiDoc',
                    }),
                    shortDescription: 'View developer API documentation',
                },
                {
                    title: 'My Settings',
                    type: 'dropdown',
                    icon: UserIcon,
                    url: `${baseUrl}/my-settings`,
                    items: [
                        {
                            type: 'item',
                            title: 'My Timesheets',
                            icon: CalendarDotsIcon,
                            url: `/my-timesheet`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MyTimesheet',
                            }),
                        },
                        {
                            type: 'item',
                            title: 'My Footsteps',
                            icon: FootstepsIcon,
                            url: `/my-all-footsteps`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'AllMyFootsteps',
                            }),
                        },
                        {
                            type: 'item',
                            title: 'My Branch Footsteps',
                            icon: FootstepsIcon,
                            url: `/my-branch-footsteps`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MyBranchFootsteps',
                            }),
                        },
                        {
                            type: 'item',
                            title: 'My Disbursement Transactions',
                            icon: HandDropCoinsIcon,
                            url: `/my-disbursement-transaction`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MyDisbursements',
                            }),
                        },
                        {
                            type: 'item',
                            title: 'My GL Entries',
                            icon: BookOpenIcon,
                            url: `/my-general-ledger-entries`,
                            canAccess: hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'MyGeneralLedger',
                            }),
                        },
                    ],
                },
            ],
        },
    ]

    return sidebarGroups
        .map((group) => {
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
