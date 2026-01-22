import { TPermissionAction } from './permission.types'

// BASE PERMISSION ACTIONS
export const PERMISSION_BASE_ACTIONS = [
    'Create',
    'Read',
    'Update',
    'Delete',
    'Export',
    'Approve',
    'OwnRead',
    'OwnUpdate',
    'OwnDelete',
    'OwnExport',
] as const

export const PERMISSION_ALL_ACTIONS: {
    action: (typeof PERMISSION_BASE_ACTIONS)[number]
    label: string
    description: string
}[] = [
    {
        action: 'Create',
        label: 'Create',
        description: 'Allows creating resources',
    },
    { action: 'Read', label: 'Read', description: 'Allows reading resources' },
    {
        action: 'Update',
        label: 'Update',
        description: 'Allows updating resources',
    },
    {
        action: 'Delete',
        label: 'Delete',
        description: 'Allows deleting resources',
    },
    {
        action: 'Export',
        label: 'Export',
        description: 'Allows exporting resources',
    },
    {
        action: 'Approve',
        label: 'Approve',
        description: 'Allows approving resources',
    },
    {
        action: 'OwnRead',
        label: 'Own Read',
        description: 'Allows reading own resources',
    },
    {
        action: 'OwnUpdate',
        label: 'Own Update',
        description: 'Allows updating own resources',
    },
    {
        action: 'OwnDelete',
        label: 'Own Delete',
        description: 'Allows deleting own resources',
    },
    {
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
        resource: 'Account',
        label: 'Account Module',
        description: 'Accounts',
        supportedActions: generateBaseAction({
            excludeActions: ['Approve'],
        }),
    },
    {
        resource: 'AccountClassification',
        label: 'Account Classification Module',
        description: 'Manage classifications of accounts',
        supportedActions: generateBaseAction({
            excludeActions: ['Approve'],
        }),
    },
    {
        resource: 'AccountCategory',
        label: 'Account Category Module',
        description: 'Manage Account Categories',
        supportedActions: generateBaseAction({ excludeActions: ['Approve'] }),
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
    {
        resource: 'AdjustmentEntry',
        label: 'Adjustment Entry',
        description: 'View Adjustment Entry',
        supportedActions: ['Read', 'Create', 'Export'] as TPermissionAction[],
    },
    {
        resource: 'Approvals',
        label: 'Approvals Module',
        description: 'Access/Manage Approvals',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsEndBatch',
        label: 'Approval Endbatch Access',
        description: 'Allow access to Approval > End Batch',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsBlotterView',
        label: 'Approval Blotter View',
        description: 'Allow Approval blotter view request approvals',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsUser',
        label: 'Approval Users View',
        description: 'Allow access for user join requests',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsMemberProfile',
        label: 'Approval Member View',
        description: 'Allow access for member profile requests',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsJV',
        label: 'Approval Journal Voucher',
        description: 'Allow access for journal voucher approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsJVDraft',
        label: 'Approval Journal Voucher Draft',
        description: 'Allow access for JV Draft approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsJVPrinted',
        label: 'Approval Journal Voucher Print',
        description: 'Allow access for JV print approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsJVApproved',
        label: 'Approval Journal Voucher Approved',
        description: 'Allow access for JV Approved approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsCashVoucher',
        label: 'Approval Cash Voucher',
        description: 'Allow access for cash voucher approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsCashVoucherDraft',
        label: 'Approval Cash Voucher Draft',
        description: 'Allow access for Cash Voucher Draft approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsCashVoucherPrinted',
        label: 'Approval Cash Voucher Print',
        description: 'Allow access for Cash Voucher print approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsCashVoucherApproved',
        label: 'Approval Cash Voucher Approved',
        description: 'Allow access for Cash Voucher Approved approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsLoan',
        label: 'Approval Loan',
        description: 'Allow access for loan approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsLoanDraft',
        label: 'Approval Loan Draft',
        description: 'Allow access for Loan Draft approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsLoanPrinted',
        label: 'Approval Loan Print',
        description: 'Allow access for Loan print approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'ApprovalsLoanApproved',
        label: 'Approval Loan Approved',
        description: 'Allow access for Loan Approved approval',
        supportedActions: ['Read', 'Approve'] as TPermissionAction[],
    },
    {
        resource: 'GeneralLedger',
        label: 'General Ledger',
        description: 'Allow reading general ledger',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'MemberProfile',
        label: 'Member Profile',
        description: 'Manage member',
        supportedActions: generateBaseAction({ excludeActions: ['Approve'] }),
    },
    {
        resource: 'User',
        label: 'User',
        description: 'Manage any user related actions',
        supportedActions: ['Read'] as TPermissionAction[],
    },
] as const satisfies PermissionResourceAction[]

export const PERMISSION_BASE_RESOURCE = PERMISSION_ALL_RESOURCE_ACTION.map(
    (r) => r.resource
)
