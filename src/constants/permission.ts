import { IconType } from 'react-icons/lib'

import {
    BankIcon,
    BillIcon,
    CalendarDotsIcon,
    HandWithdrawIcon,
    ShieldIcon,
    UserIcon,
    Users3Icon,
} from '@/components/icons'

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

export const PERMISSION_BASE_RESOURCE = [
    'User',
    'UserOrganization',
    'MemberType',
    'MemberGroup',
    'MemberCenter',
    'MemberGender',
    'MemberOccupation',
    'MemberClassification',
    'MemberProfile',
    'Banks',
    'Holidays',
    'BillsAndCoin',
    'Loan',
    'LoanStatus',
    'LoanPurpose',
    'TransactionBatch',
    'InvitationCode',
    'Timesheet',
    'Footstep',
    'Approvals',
] as const

type ActionType = (typeof PERMISSION_ALL_ACTIONS)[number]['action']

export const PERMISSION_ALL_RESOURCE_ACTION: {
    resource: (typeof PERMISSION_BASE_RESOURCE)[number]
    label: string
    icon?: IconType
    description: string
    supportedActions: ActionType[]
}[] = [
    {
        resource: 'MemberType',
        label: 'Member Type',
        icon: UserIcon,
        description: 'Classification type for members',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'MemberGroup',
        label: 'Member Group',
        icon: Users3Icon,
        description: 'Groupings of members',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'MemberCenter',
        label: 'Member Center',
        icon: Users3Icon,
        description: 'Centers associated with members',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'MemberGender',
        label: 'Member Gender',
        icon: Users3Icon,
        description: 'Gender classification for members',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'MemberOccupation',
        label: 'Member Occupation',
        icon: Users3Icon,
        description: 'Occupational classification for members',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'MemberClassification',
        label: 'Member Classification',
        icon: Users3Icon,
        description: 'General classification for members',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'MemberProfile',
        label: 'Member Profile',
        icon: UserIcon,
        description: 'Profile details of a member',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'Approvals',
        description: 'Approve requests',
        icon: ShieldIcon,
        label: 'Approval',
        supportedActions: ['Read', 'Approve'],
    },
    {
        resource: 'Banks',
        label: 'Banks',
        icon: BankIcon,
        description: 'Bank-related resources',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'Holidays',
        label: 'Holidays',
        icon: CalendarDotsIcon,
        description: 'Holiday schedules and information',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'BillsAndCoin',
        label: 'Bills And Coin',
        icon: BillIcon,
        description: 'Bills and coin denomination settings',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'Loan',
        label: 'Loan',
        icon: HandWithdrawIcon,
        description: 'Loan details and management',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'LoanStatus',
        label: 'Loan Status',
        description: 'Status information for loans',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'LoanPurpose',
        label: 'Loan Purpose',
        description: 'Purpose classification for loans',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'TransactionBatch',
        label: 'Transaction Batch',
        description: 'Batch processing for transactions',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'InvitationCode',
        label: 'Invitation Code',
        description: 'Codes for inviting new members/users',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'Timesheet',
        label: 'Timesheet',
        description: 'Timesheet entries (time in/out)',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
    {
        resource: 'Footstep',
        label: 'Footstep',
        description: 'Footstep tracking',
        supportedActions: [
            ...PERMISSION_BASE_ACTIONS.filter(
                (val) => !['Approve'].includes(val)
            ),
        ],
    },
]
