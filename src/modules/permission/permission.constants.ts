import { IconType } from 'react-icons/lib'

import {
    ExportIcon,
    EyeIcon,
    PencilOutlineIcon,
    PlusIcon,
    TrashIcon,
} from '@/components/icons'

import { TPermissionAction } from './permission.types'

// BASE PERMISSION ACTIONS
export const PERMISSION_BASE_ACTIONS = [
    'Create',
    'Read',
    'Update',
    'Delete',
    'Export',
    'OwnRead',
    'OwnUpdate',
    'OwnDelete',
    'OwnExport',
] as const

export const PERMISSION_ALL_ACTIONS: {
    action: (typeof PERMISSION_BASE_ACTIONS)[number]
    icon?: IconType
    label: string
    description: string
}[] = [
    {
        icon: PlusIcon,
        action: 'Create',
        label: 'Create',
        description: 'Allows creating resources',
    },
    {
        icon: EyeIcon,
        action: 'Read',
        label: 'Read',
        description: 'Allows reading resources',
    },
    {
        icon: PencilOutlineIcon,
        action: 'Update',
        label: 'Update',
        description: 'Allows updating resources',
    },
    {
        icon: TrashIcon,
        action: 'Delete',
        label: 'Delete',
        description: 'Allows deleting resources',
    },
    {
        icon: ExportIcon,
        action: 'Export',
        label: 'Export',
        description: 'Allows exporting resources',
    },
    {
        icon: EyeIcon,
        action: 'OwnRead',
        label: 'Own Read',
        description: 'Allows reading own resources',
    },
    {
        icon: PencilOutlineIcon,
        action: 'OwnUpdate',
        label: 'Own Update',
        description: 'Allows updating own resources',
    },
    {
        icon: TrashIcon,
        action: 'OwnDelete',
        label: 'Own Delete',
        description: 'Allows deleting own resources',
    },
    {
        icon: ExportIcon,
        action: 'OwnExport',
        label: 'Own Export',
        description: 'Allows exporting own resources',
    },
] as const

// ALL MODULES MODULES / ENTITY / MODEL are listed here.
// Similar to Report module constant? No, this have modules that are ghost.
// You can add more here

export const generateBaseAction = ({
    excludeActions = [],
}: {
    excludeActions?: TPermissionAction[]
} = {}) => {
    return PERMISSION_BASE_ACTIONS.filter(
        (val) => !excludeActions?.includes(val)
    ) as TPermissionAction[]
}

export const generateOwnActions = () => {
    return PERMISSION_BASE_ACTIONS.filter((action) => action.startsWith('Own'))
}

// MAPPING OF ALL PERMISSION RESOURCE ACTIONS
// YOU CAN ALSO FILTERED OUT ACTIONS FOR THE RESOURCE
type PermissionResourceAction = {
    resource: string
    label: string
    description: string
    supportedActions: Readonly<TPermissionAction[]>
}

export const PERMISSION_ALL_RESOURCE_ACTION = [
    {
        resource: 'Dashboard',
        label: 'Dashboard Module',
        description: 'Allow access to Dashboard module',
        supportedActions: generateBaseAction(),
    },

    {
        resource: 'Account',
        label: 'Account Module',
        description: 'Accounts',
        supportedActions: generateBaseAction(),
    },
    {
        resource: 'AccountClassification',
        label: 'Account Classification Module',
        description: 'Manage classifications of accounts',
        supportedActions: generateBaseAction(),
    },
    {
        resource: 'AccountCategory',
        label: 'Account Category Module',
        description: 'Manage Account Categories',
        supportedActions: generateBaseAction(),
    },
    {
        resource: 'AccountTag',
        label: 'Account Tags',
        description: 'Manage Account Tags of an Account',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'AccountTransaction',
        label: 'Account Transactions',
        description: 'View Transactions of an account',
        supportedActions: ['Read', 'Create'] as TPermissionAction[],
    },

    // ADJUSTMENT
    {
        resource: 'AdjustmentEntry',
        label: 'Adjustment Entry',
        description: 'View Adjustment Entry',
        supportedActions: ['Read', 'Create', 'Export'] as TPermissionAction[],
    },
    // APPROVAL PAGE
    {
        resource: 'Approvals',
        label: 'Approvals',
        description: 'Access Approval Page/Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    // MAIN APPROVAL
    {
        resource: 'ApprovalsEndBatch',
        label: 'Approval Endbatch Access',
        description: 'Allow access to Approval > End Batch',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsBlotterView',
        label: 'Approval Blotter View Request',
        description: 'Blotter view request in approvals',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsUser',
        label: 'Approval Users View',
        description: 'Allow access for user join requests',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsMemberProfile',
        label: 'Approval Member View',
        description: 'Allow access for member profile requests',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },

    // APPROVAL JV
    {
        resource: 'ApprovalsJV',
        label: 'Approval Journal Voucher',
        description: 'Allow read for Approval > Journal Voucher',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsJVDraft',
        label: 'Approval Journal Voucher Draft',
        description: 'Allow read for Approval > Journal Voucher > Draft',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsJVPrinted',
        label: 'Approval Journal Voucher Print',
        description: 'Allow read/action for Approval > Journal Voucher > Print',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsJVApproved',
        label: 'Approval Journal Voucher Approved',
        description:
            'Allow read/action for Approval > Journal Voucher > Approved',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsJVReleased',
        label: 'Approval JV Release ',
        description:
            'Allow read/action for Approval > Journal Voucher > Released',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },

    // APPROVAL > CASH VOUCHER
    {
        resource: 'ApprovalsCashVoucher',
        label: 'Approval Cash Voucher',
        description: 'Allow read for Approval > Cash Voucher',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsCashVoucherDraft',
        label: 'Approval Cash Voucher Draft',
        description: 'Allow read for Approval > Cash Voucher > Draft',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsCashVoucherPrinted',
        label: 'Approval Cash Voucher Print',
        description: 'Allow read/action for Approval > Cash Voucher > Print',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsCashVoucherApproved',
        label: 'Approval Cash Voucher Approved',
        description: 'Allow read/action for Approval > Cash Voucher > Approved',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsCashVoucherReleased',
        label: 'Approval Cash Voucher Release',
        description: 'Allow read/action for Approval > Cash Voucher > Released',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },

    // APPROVAL > LOAN
    {
        resource: 'ApprovalsLoan',
        label: 'Approval Loan',
        description: 'Allow read for Approval > Loan',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsLoanDraft',
        label: 'Approval Loan Draft',
        description: 'Allow read for Approval > Loan > Draft',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsLoanPrinted',
        label: 'Approval Loan Print',
        description: 'Allow read/action for Approval > Loan > Print',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsLoanApproved',
        label: 'Approval Loan Approved',
        description: 'Allow read/action for Approval > Loan > Approved',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsLoanReleased',
        label: 'Approval Loan Release',
        description: 'Allow read/action for Approval > Loan > Released',
        supportedActions: ['Read', 'Update'] as TPermissionAction[],
    },

    // FOR TRANSACTION/PAYMENT (DEPOSIT, WITHDRAW, PAYMENT)
    {
        resource: 'Transaction',
        label: 'Transaction/Payment Module',
        description:
            'Allow access/action for transaction(payment, withdraw, deposit) module',
        supportedActions: ['Read', 'Create', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'QuickWithdraw',
        label: 'Quick Withdraw Module',
        description: 'Allow access/action for Quick Withdraw module',
        supportedActions: ['Read', 'Create', 'Update'] as TPermissionAction[],
    },
    {
        resource: 'QuickDeposit',
        label: 'Quick Deposit Module',
        description: 'Allow access/action for Quick Deposit module',
        supportedActions: ['Read', 'Create', 'Update'] as TPermissionAction[],
    },

    {
        resource: 'PaymentType',
        label: 'Payment Type Module',
        description: 'Allow access/action for payment type module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },

    // JOURNAL VOUCHER
    {
        resource: 'JournalVoucher',
        label: 'Journal Voucher Module',
        description: 'Allow access/action for Journal Voucher module',
        supportedActions: generateBaseAction({
            excludeActions: ['Delete', 'OwnDelete'],
        }) as TPermissionAction[],
    },

    // LOAN
    {
        resource: 'Loan',
        label: 'Loan Module',
        description: 'Allow access/action for Loan module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'LoanStatus',
        label: 'Loan Status Module',
        description: 'Allow access/action for Loan Status module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'LoanPurpose',
        label: 'Loan Purpose Module',
        description: 'Allow access/action for Loan Purpose module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'LoanTag',
        label: 'Loan Tags',
        description: 'Allow access/action for Loan Tags',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },

    // CASH CHECK VOUCHER
    {
        resource: 'CashCheckVoucher',
        label: 'Cash Check Voucher Module',
        description: 'Allow access/action for Cash Check Voucher Module',
        supportedActions: generateBaseAction({
            excludeActions: ['Delete', 'OwnDelete', 'OwnRead'],
        }) as TPermissionAction[],
    },

    {
        resource: 'DisburesmentType',
        label: 'Disbursement Type Module',
        description: 'Allow access/action for Disbursement Type Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },

    {
        resource: 'CashCount',
        label: 'Cash Count Module',
        description: 'Allow access/action for Cash count Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },

    {
        resource: 'FSDefinition',
        label: 'Financial Statement Definition',
        description: 'Allow access/action for Financial Definition Module',
        supportedActions: generateBaseAction({
            excludeActions: generateOwnActions(),
        }) as TPermissionAction[],
    },

    {
        resource: 'GLDefinition',
        label: 'General Ledger Definition',
        description: 'Allow access/action for General Ledger Module',
        supportedActions: generateBaseAction({
            excludeActions: generateOwnActions(),
        }) as TPermissionAction[],
    },

    //
    {
        resource: 'GeneralLedger',
        label: 'General Ledger',
        description: 'Allow reading general ledger',
        supportedActions: ['Read'] as TPermissionAction[],
    },

    // FOR MEMBERS
    {
        resource: 'MemberGender',
        label: 'MemberGender',
        description: 'Allow access/action for Member Gender Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },

    // MEMBER PROFILE
    {
        resource: 'MemberProfile',
        label: 'Member Profile',
        description: 'Manage member',
        supportedActions: generateBaseAction({
            excludeActions: ['Delete', 'OwnDelete', 'OwnRead'],
        }) as TPermissionAction[],
    },
    {
        resource: 'MemberProfileClose',
        label: 'Member Profile Close',
        description: 'Allow user to close a member profile',
        supportedActions: ['Create'] as TPermissionAction[],
    },
    {
        resource: 'MemberProfileFileMediaUpload',
        label: 'Member Media/File Upload Module',
        description: 'Allow access/actions for Member Files',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'MemberProfileFileArchives',
        label: 'Member File Archives Module',
        description: 'Allow access/actions for Member File Archives',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'MemberAccountingLedger',
        label: 'Member Accounting Ledger',
        description: 'Allow user to close a member profile',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'MemberType',
        label: 'Member Type Module',
        description: 'Allow access/actions for Member Type Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'MemberGroup',
        label: 'Member Group Module',
        description: 'Allow access/actions for Member Group Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'MemberOccupation',
        label: 'Member Occupation Module',
        description: 'Allow access/actions for Member Occupation Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'MemberClassification',
        label: 'Member Classification Module',
        description: 'Allow access/actions for Member Classification Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'MemberCenter',
        label: 'Member Center Module',
        description: 'Allow access/actions for Member Center Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'MemberDepartment',
        label: 'Member Department Module',
        description: 'Allow access/actions for Member Department Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },

    // SCHEME > LOAN SCHEME
    {
        resource: 'LoanScheme',
        label: 'Loan Scheme',
        description: 'Allow access/actions for Loan Scheme Module.',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'LoanSchemeAutomaticLoanDeduction',
        label: 'Loan Scheme > Automatic Loan Deduction',
        description:
            'Allow access/actions for Loan Scheme Automatic Loan Deduction.',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'LoanSchemeIncludeNegativeAccounts',
        label: 'Loan Scheme > Include Negative Accounts',
        description:
            'Allow access/actions for Loan Scheme Include Negative Accounts.',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'LoanSchemeBrowseExcludedIncludedAccounts',
        label: 'Loan Scheme > Browse Excluded/Included Accounts',
        description:
            'Allow access/actions for Loan Scheme Browse Excluded/Included Accounts.',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },

    // SCHEME > Charges Rate Scheme
    {
        resource: 'LoanChargeScheme',
        label: 'Loan Charge Scheme',
        description: 'Allow access/actions for Loan Charge Scheme.',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    // SCHEME > Time Deposit Scheme
    {
        resource: 'TimeDepositScheme',
        label: 'Loan Charge Scheme',
        description: 'Allow access/actions for Loan Charge Scheme.',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    // SCHEME >  Member Type
    {
        resource: 'MemberType',
        label: 'Member Type Module',
        description: 'Allow access/action for Member Type',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'MemberTypeBrowseReference',
        label: 'Member Type Browse Reference',
        description: 'Allow access/action for Member Type Browse Reference',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },

    // Transaction Batch
    {
        resource: 'TransactionBatch',
        label: 'Transaction Batch Module',
        description: 'Allow access/action for transaction batch',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'TransactionBatchHistory',
        label: 'Transaction Batch History',
        description: 'Allow read accesss for transaction batch history',
        supportedActions: ['Read'] as TPermissionAction[],
    },

    {
        resource: 'CheckRemittance',
        label: 'Check Remittance',
        description: 'Allow access/actions for Check Remittance',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'OnlineRemittance',
        label: 'Online Remittance',
        description: 'Allow access/actions for Online Remittance',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'DisbursementTransaction',
        label: 'Disbursement Transaction',
        description: 'Allow access/action for Disbursement Transaction Module',
        supportedActions: ['Create'] as TPermissionAction[],
    },

    {
        resource: 'Transactions',
        label: 'Transactions Module',
        description: 'Allow access for Transactions Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },

    // EMPLOYEE
    {
        resource: 'Employee',
        label: 'Employee Module',
        description: 'Allow access/action for Employee Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'EmployeePermission',
        label: 'Employee Module',
        description: 'Allow access/action for Employee Module',
        supportedActions: ['Update', 'OwnUpdate'] as TPermissionAction[],
    },
    {
        resource: 'EmployeeFootstep',
        label: 'Employee Footstep Module',
        description: 'Allow access/action for Employee Footstep Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'EmployeeDisbursements',
        label: 'Employee Disbursements Module',
        description: 'Allow access/action for Employee Disbursements Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'EmployeeSettings',
        label: 'Employee Settings Module',
        description: 'Allow access/action for Employee Settings Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },

    {
        resource: 'PermissionTemplate',
        label: 'Permission Template Module',
        description: 'Allow access/action for Permission Template Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'EmployeeFootstep',
        label: 'Employee Footstep Module',
        description: 'Allow access/action for Employee Footstep Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },

    {
        resource: 'Timesheet',
        label: 'Timesheet Module',
        description: 'Allow access/action for Timesheet Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'TimeInOut',
        label: 'Time In Out Module',
        description:
            'Allow employee access/action to Time In or Time Out Module',
        supportedActions: [
            'Read',
            'Create',
            'Update',
            'OwnUpdate',
        ] as TPermissionAction[],
    },

    {
        resource: 'Footstep',
        label: 'Footstep Module',
        description: 'Allow access/action for Footstep Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },

    {
        resource: 'BillsAndCoins',
        label: 'Bills and Coins Module',
        description: 'Allow access/action for Bills and Coins Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'TagTemplate',
        label: 'Tag Template Module',
        description: 'Allow access/action for Tag Template Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'Collateral',
        label: 'Collateral Module',
        description: 'Allow access/action for Collateral Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'Bank',
        label: 'Bank Module',
        description: 'Allow access/action for Bank Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'Holiday',
        label: 'Holiday Module',
        description: 'Allow access/action for Holiday Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'InvitationCode',
        label: 'Invitation Code Module',
        description: 'Allow access/action for Invitation Code Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'Company',
        label: 'Company Module',
        description: 'Allow access/action for Company Module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },

    {
        resource: 'MyTimesheet',
        label: 'My Timesheet Module',
        description: 'Allow access for Own Timesheet Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'MyGeneralLedger',
        label: 'My General Ledger Entries Module',
        description: 'Allow user to access Own General Ledger Entries Module',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'MyDisbursements',
        label: 'My Disbursements',
        description:
            'Allow Employee employee to access their own Disbursements',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'AllMyFootsteps',
        label: 'My All Footsteps',
        description:
            'Allow Employee employee to access all of their own Footsteps',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'MyBranchFootsteps',
        label: 'My Branch Footsteps Module',
        description: 'Allow access to their current branch footsteps',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'BranchSettings',
        label: 'Branch Settings Module',
        description: 'Allow access to branch settings',
        supportedActions: generateBaseAction({
            excludeActions: generateOwnActions(),
        }) as TPermissionAction[],
    },
    {
        resource: 'MySettings',
        label: 'My Settings Module',
        description: 'Allow access to their own settings module',
        supportedActions: generateBaseAction({
            excludeActions: ['Export', 'OwnExport'],
        }) as TPermissionAction[],
    },

    {
        resource: 'GenerateSavingsInterest',
        label: 'Generate Savings Interest',
        description: 'Allow access/action for generate savings interest module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
    {
        resource: 'GenerateMutualFundAid',
        label: 'Generate Mutual Fund/Aid',
        description:
            'Allow access/action for generating Mutual Fund/Aid module',
        supportedActions: generateBaseAction({
            excludeActions: ['Export', 'OwnExport'],
        }) as TPermissionAction[],
    },
    {
        resource: 'ApiDoc',
        label: 'API Documentation',
        description: 'Allow access/action for API Documentation module',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'ApiKeyGen',
        label: 'API Key Generation',
        description: 'Allow generate of API Key',
        supportedActions: ['Create'] as TPermissionAction[],
    },

    {
        resource: 'User',
        label: 'User',
        description: 'Manage any user related actions',
        supportedActions: ['Read'] as TPermissionAction[],
    },

    {
        resource: 'Area',
        label: 'Area',
        description: 'Allow action/access for Area module',
        supportedActions: generateBaseAction() as TPermissionAction[],
    },
] as const satisfies PermissionResourceAction[]

export const PERMISSION_BASE_RESOURCE = PERMISSION_ALL_RESOURCE_ACTION.map(
    (r) => r.resource
)
