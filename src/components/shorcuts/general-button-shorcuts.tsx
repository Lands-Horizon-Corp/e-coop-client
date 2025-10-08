import { ReactNode } from 'react'

import { cn } from '@/helpers'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    ArrowIcon,
    CommandIcon,
    EyeIcon,
    FocusIcon,
    HistoryIcon,
    ReloadIcon,
    ResetIcon,
    ScanQrIcon,
    UserIcon,
    ViewIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import Modal from '../modals/modal'

interface ShortcutItemProps {
    icon: ReactNode
    text: string
    shortcut: string
    description?: string
}

const ShortcutItem = ({
    icon,
    text,
    shortcut,
    description,
}: ShortcutItemProps) => {
    return (
        <div
            className={cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                'aria-selected:bg-accent aria-selected:text-accent-foreground',
                'hover:!bg-transparent' // Custom styling to disable hover
            )}
        >
            <div className="flex-none w-5 h-5 mr-2">{icon}</div>
            <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                <span className="font-medium text-wrap">{text}</span>
                {description && (
                    <span className="text-xs italic text-wrap text-muted-foreground ml-2">
                        {description}
                    </span>
                )}
            </div>
            <div className="flex-none ml-auto text-xs text-muted-foreground">
                {shortcut}
            </div>
        </div>
    )
}

const shortcutsData = {
    general: {
        title: 'General',
        items: [
            {
                icon: <EyeIcon />,
                text: 'Open / Close Command Shortcuts',
                shortcut: 'Ctrl + J',
            },
            {
                icon: <EyeIcon />,
                text: 'Open Create Form',
                description: '(from any table)',
                shortcut: 'Enter',
            },
            {
                text: 'Quick Navigate',
                description: 'search pages',
                icon: <CommandIcon />,
                shortcut: 'Alt + Q, Ctrl + Q, Meta + Q',
            },
        ],
    },
    quicktTransfer: {
        title: 'Quick Transfer / Payment',
        items: [
            { icon: <UserIcon />, text: 'Select a Member', shortcut: 'Enter' },
            {
                icon: <ArrowIcon />,
                text: 'Submit Payment',
                description: '(requires a member and valid form)',
                shortcut: 'Ctrl + Enter',
            },
            {
                icon: <ViewIcon />,
                text: 'View Member Profile',
                description: '(requires a member to be selected)',
                shortcut: 'Alt + V',
            },
            { icon: <HistoryIcon />, text: 'History', shortcut: 'H' },
            {
                icon: <ResetIcon />,
                text: 'Reset Transaction / Clear Member',
                shortcut: 'Escape',
            },
            {
                icon: <ReloadIcon />,
                text: 'Refresh Accounts Table',
                description: 'this will work on history page panel too',
                shortcut: 'Alt + R',
            },
        ],
    },
    transaction: {
        title: 'Payment',
        items: [
            {
                icon: <ScanQrIcon />,
                text: 'Start / Stop Scanner',
                shortcut: 'S',
            },
            {
                icon: <FocusIcon />,
                text: 'Focus on Amount',
                description: '(requires a member to be selected)',
                shortcut: 'A',
            },
        ],
    },
    loanActions: {
        title: 'Loan',
        items: [
            {
                icon: <ScanQrIcon />,
                text: 'Start Code Scanner',
                shortcut: 'Shift + S',
            },
            {
                icon: <UserIcon />,
                text: 'Select a Member',
                shortcut: 'Ctrl + Enter',
            },
        ],
    },
}

const GeneralButtonShortcuts = ({ className }: { className?: string }) => {
    const { open, onOpenChange } = useModalState()

    useHotkeys(
        'control+J',
        (e) => {
            onOpenChange(!open)
            e.preventDefault()
        },
        {
            keydown: true,
        }
    )

    return (
        <div className={cn('w-fit ', className)}>
            <Button
                className="hover:!bg-transparent text-muted-foreground/70 h-9 rounded-full"
                onClick={() => onOpenChange(!open)}
                size="sm"
                variant="outline"
            >
                <CommandIcon />
            </Button>
            <Modal
                className="min-w-fit lg:min-w-[1200px] h-fit bg-background border-border text-foreground p-6 flex flex-col"
                description="Here are some useful keyboard shortcuts to help you navigate and perform actions quickly."
                descriptionClassName="text-sm text-center text-muted-foreground"
                onOpenChange={onOpenChange}
                open={open}
                title="All Keyboard Shortcuts"
                titleClassName="text-lg font-semibold text-center"
            >
                <div className="">
                    {/* Main Content Area - Columns */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 ecoop-scroll overflow-y-auto">
                        {Object.values(shortcutsData).map((category, index) => (
                            <div className="p-2" key={index}>
                                <h2 className="text-sm text-muted-foreground font-medium mb-2">
                                    {category.title}
                                </h2>
                                <div className="space-y-1">
                                    {category.items.map((item, itemIndex) => (
                                        <ShortcutItem
                                            key={itemIndex}
                                            {...item}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Panel */}
                    <div className="flex-none hidden pt-4 mt-6 border-t border-border justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span>Single-character shortcuts</span>
                            {/* You would add a switch component here */}
                            <div className="w-10 h-5 bg-muted rounded-full"></div>
                        </div>
                        <div>Pin keyboard shortcut help</div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default GeneralButtonShortcuts
