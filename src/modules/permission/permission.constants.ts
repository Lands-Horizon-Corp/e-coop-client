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
    return PERMISSION_ALL_ACTIONS.filter((action) =>
        action.action.startsWith('Own')
    )
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

    // LOAN TRANSACTION
    {
        resource: 'Loan',
        label: 'Loan Module',
        description: 'Allow access/action for Loan module',
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

    

    //
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
        supportedActions: generateBaseAction(),
    },
    {
        resource: 'User',
        label: 'User',
        description: 'Manage any user related actions',
        supportedActions: ['Read'] as TPermissionAction[],
    },
    {
        resource: 'LoanScheme',
        label: 'Loan Scheme',
        description: 'Manage loan scheme',
        supportedActions: ['Read'] as TPermissionAction[],
    },
] as const satisfies PermissionResourceAction[]

export const PERMISSION_BASE_RESOURCE = PERMISSION_ALL_RESOURCE_ACTION.map(
    (r) => r.resource
)
