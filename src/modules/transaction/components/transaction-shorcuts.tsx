import { ReactNode } from 'react'

import { cn } from '@/helpers'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    ArrowIcon,
    CommandIcon,
    EyeIcon,
    FocusIcon,
    HistoryIcon,
    ResetIcon,
    ScanQrIcon,
    UserIcon,
    ViewIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { useModalState } from '@/hooks/use-modal-state'

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
    general: [
        {
            icon: <EyeIcon />,
            text: 'Open / Close Command Shortcuts',
            shortcut: 'Ctrl + J',
        },
        { icon: <HistoryIcon />, text: 'History', shortcut: 'H' },
    ],
    memberActions: [
        {
            icon: <ViewIcon />,
            text: 'View Member Profile',
            description: '(requires a member to be selected)',
            shortcut: 'Alt + V',
        },
        { icon: <UserIcon />, text: 'Select a Member', shortcut: 'Enter' },
        { icon: <ScanQrIcon />, text: 'Start / Stop Scanner', shortcut: 'S' },
        {
            icon: <ResetIcon />,
            text: 'Reset Transaction / Clear Member',
            shortcut: 'Escape',
        },
    ],
    transaction: [
        {
            icon: <FocusIcon />,
            text: 'Focus on Amount',
            description: '(requires a member to be selected)',
            shortcut: 'A',
        },
        {
            icon: <ArrowIcon />,
            text: 'Submit Payment',
            description: '(requires a member and valid form)',
            shortcut: 'Ctrl + Enter',
        },
    ],
}

const TransactionButtonShortcuts = ({ className }: { className?: string }) => {
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
        <div className={cn('w-fit', className)}>
            <Button
                variant="outline"
                size="sm"
                className="hover:!bg-transparent text-muted-foreground/70 h-9 rounded-full"
                onClick={() => onOpenChange(!open)}
            >
                <CommandIcon />
            </Button>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="min-w-fit lg:min-w-[1200px] h-[600px] bg-neutral-900 border-neutral-700 text-white p-6 flex flex-col">
                    <DialogHeader className="flex-none">
                        <DialogTitle className="text-xl font-bold text-center mb-6">
                            All Keyboard Shortcuts
                        </DialogTitle>
                    </DialogHeader>

                    {/* Main Content Area - Columns */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 ecoop-scroll overflow-y-auto">
                        {/* Column 1: General */}
                        <div className="p-2">
                            <h2 className="text-sm text-neutral-400 font-medium mb-2">
                                General
                            </h2>
                            <div className="space-y-1">
                                {shortcutsData.general.map((item, index) => (
                                    <ShortcutItem key={index} {...item} />
                                ))}
                            </div>
                        </div>

                        {/* Column 2: Member Actions */}
                        <div className="p-2">
                            <h2 className="text-sm text-neutral-400 font-medium mb-2">
                                Member Actions
                            </h2>
                            <div className="space-y-1">
                                {shortcutsData.memberActions.map(
                                    (item, index) => (
                                        <ShortcutItem key={index} {...item} />
                                    )
                                )}
                            </div>
                        </div>

                        {/* Column 3: Transaction */}
                        <div className="p-2">
                            <h2 className="text-sm text-neutral-400 font-medium mb-2">
                                Transaction
                            </h2>
                            <div className="space-y-1">
                                {shortcutsData.transaction.map(
                                    (item, index) => (
                                        <ShortcutItem key={index} {...item} />
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Panel */}
                    <div className="flex-none hidden pt-4 mt-6 border-t border-neutral-700 justify-between items-center text-sm text-neutral-400">
                        <div className="flex items-center gap-2">
                            <span>Single-character shortcuts</span>
                            {/* You would add a switch component here */}
                            <div className="w-10 h-5 bg-neutral-600 rounded-full"></div>
                        </div>
                        <div>Pin keyboard shortcut help</div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TransactionButtonShortcuts
