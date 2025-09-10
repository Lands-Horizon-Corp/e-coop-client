import { cn } from '@/helpers'
import { FocusIcon } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    ArrowIcon,
    EyeIcon,
    HistoryIcon,
    ResetIcon,
    ScanQrIcon,
    UserIcon,
    ViewIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { useModalState } from '@/hooks/use-modal-state'

const TransactionShortcuts = ({ className }: { className?: string }) => {
    const { open, onOpenChange } = useModalState()

    useHotkeys('Alt+C', () => {
        onOpenChange(!open)
    })

    return (
        <div className={cn('w-fit', className)}>
            <Button
                variant="ghost"
                size="sm"
                onMouseOver={(e) => {
                    e.preventDefault()
                    onOpenChange(true)
                }}
                onBlur={(e) => {
                    e.preventDefault()
                    onOpenChange(false)
                }}
                className="hover:!bg-transparent text-muted-foreground/70"
            >
                Command Shortcuts
            </Button>
            <Popover open={open} onOpenChange={onOpenChange} modal>
                <PopoverTrigger />
                <PopoverContent className="md:min-w-[450px] bg-transparent p-0 border-0">
                    <Command className="rounded-lg border shadow-md">
                        <CommandList className="ecoop-scroll">
                            {/* General Shortcuts */}
                            <CommandGroup heading="General">
                                <CommandItem>
                                    <EyeIcon />
                                    <span>Open / Close Command Shortcuts</span>
                                    <CommandShortcut>Alt + C</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <HistoryIcon />
                                    <span>History</span>
                                    <CommandShortcut>H</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator />

                            {/* Member Actions */}
                            <CommandGroup heading="Member Actions">
                                <CommandItem>
                                    <ViewIcon />
                                    <span>View Member Profile</span>
                                    <span className="text-xs italic text-muted-foreground">
                                        (requires a member to be selected)
                                    </span>
                                    <CommandShortcut>Alt + V</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <UserIcon />
                                    <span>Select a Member</span>
                                    <CommandShortcut>Enter</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <ScanQrIcon />
                                    <span>Start / Stop Scanner</span>
                                    <CommandShortcut>S</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <ResetIcon />
                                    <span>
                                        Reset Transaction / Clear Member
                                    </span>
                                    <CommandShortcut>Escape</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator />

                            {/* Transaction Actions */}
                            <CommandGroup heading="Transaction">
                                <CommandItem>
                                    <FocusIcon />
                                    <span>Focus on Amount</span>
                                    <span className="text-xs italic text-muted-foreground">
                                        (requires a member to be selected)
                                    </span>
                                    <CommandShortcut>A</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <ArrowIcon />
                                    <span>Submit Payment</span>
                                    <span className="text-xs italic text-muted-foreground">
                                        (requires a member and valid form)
                                    </span>
                                    <CommandShortcut>
                                        Ctrl + Enter
                                    </CommandShortcut>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default TransactionShortcuts
