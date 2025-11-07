import {
    ArrowIcon,
    BackIcon,
    BookIcon,
    CloseIcon,
    CommandIcon,
    EyeIcon,
    FocusIcon,
    HistoryIcon,
    MagnifyingGlassIcon,
    MoneyStackIcon,
    ReloadIcon,
    ResetIcon,
    ScanQrIcon,
    UserIcon,
    ViewIcon,
} from '../icons'
import { TGroupShorcuts } from './general-shorcuts.type'

export const ShortcutsData: TGroupShorcuts[] = [
    {
        key: 'general',
        title: 'General',
        items: [
            {
                icon: <EyeIcon />,
                text: 'Toggle Command Shortcuts',
                shortcut: 'Ctrl + J',
            },
            {
                icon: <EyeIcon />,
                text: 'Open Create Form',
                description: 'From any table view',
                shortcut: 'Enter',
            },
            {
                text: 'Quick Navigation',
                description: 'Search pages quickly',
                icon: <CommandIcon />,
                shortcut: 'Alt + Q, Ctrl + Q, Meta + Q',
            },
            {
                icon: <CloseIcon />,
                text: 'Close Dialog',
                description: 'Close active modal',
                shortcut: 'Esc',
            },
        ],
    },
    {
        key: 'quickTransfer',
        title: 'Quick Transfer / Payment',
        items: [
            { icon: <UserIcon />, text: 'Select Member', shortcut: 'Enter' },
            {
                icon: <ArrowIcon />,
                text: 'Submit Payment',
                description: 'Requires selected member and valid form',
                shortcut: 'Ctrl + Enter',
            },
            {
                icon: <ViewIcon />,
                text: 'View Member Profile',
                description: 'Requires selected member',
                shortcut: 'Alt + V',
            },
            { icon: <HistoryIcon />, text: 'View History', shortcut: 'H' },
            {
                icon: <ResetIcon />,
                text: 'Reset Transaction',
                description: 'Clears member selection and form',
                shortcut: 'Escape',
            },
            {
                icon: <ReloadIcon />,
                text: 'Refresh Accounts',
                description: 'Works in history panel as well',
                shortcut: 'Alt + R',
            },
        ],
    },
    {
        key: 'transaction',
        title: 'Payment',
        items: [
            {
                icon: <ScanQrIcon />,
                text: 'Toggle Scanner',
                shortcut: 'S',
            },
            {
                icon: <FocusIcon />,
                text: 'Focus Amount Field',
                description: 'Requires selected member',
                shortcut: 'A',
            },
        ],
    },
    {
        key: 'loan-actions',
        title: 'Loan',
        items: [
            {
                icon: <ScanQrIcon />,
                text: 'Start Code Scanner',
                shortcut: 'Shift + S',
            },
            {
                icon: <UserIcon />,
                text: 'Select Member',
                shortcut: 'Ctrl + Enter',
            },
        ],
    },
    {
        key: 'approvals',
        title: 'Approvals',
        items: [
            {
                icon: <MagnifyingGlassIcon />,
                text: 'Start Search',
                description:
                    'For Journal Voucher, Cash Check Voucher, and Loans',
                shortcut: 'Enter',
            },
            {
                icon: <BackIcon />,
                text: 'Go to Approvals Page',
                description: 'Works when no modal is open',
                shortcut: 'Alt + A',
            },
        ],
    },
    {
        title: 'Start Batch',
        key: 'start-batch',
        items: [
            {
                text: 'Open Batch Process',
                icon: <MoneyStackIcon />,
                description: 'Available system-wide',
                shortcut: 'Alt + S',
            },
        ],
    },
    {
        title: 'Journal Voucher / Cash Check Voucher',
        key: 'journal-voucher',
        items: [
            {
                text: 'Select Member',
                icon: <UserIcon />,
                description: 'Choose a member for the voucher',
                shortcut: 'Enter',
            },
            {
                text: 'Add Journal Entry',
                icon: <BookIcon />,
                description:
                    'Available after creating Journal/Cash Check Voucher',
                shortcut: 'Shift + I',
            },
        ],
    },
]
