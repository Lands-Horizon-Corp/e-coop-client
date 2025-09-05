import { FocusIcon } from 'lucide-react'

import {
    ArrowIcon,
    HistoryIcon,
    ResetIcon,
    ScanQrIcon,
    UserIcon,
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

const TransactionShortcuts = () => {
    const { open, onOpenChange } = useModalState()

    return (
        <div>
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
                className=" hover:!bg-transparent text-muted-foreground/70"
            >
                command shorcuts
            </Button>
            <Popover open={open} onOpenChange={onOpenChange} modal>
                <PopoverTrigger></PopoverTrigger>
                <PopoverContent className="md:min-w-[450px] bg-transparent p-0 border-0">
                    <Command className="rounded-lg border shadow-md ">
                        <CommandList>
                            <CommandSeparator />
                            <CommandGroup heading="Transaction Shortcuts (must unfocus to any element to work)">
                                <CommandItem>
                                    <UserIcon />
                                    <span>Select a member</span>
                                    <CommandShortcut>Enter</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <ScanQrIcon />
                                    <span>Start/Stop scanner</span>
                                    <CommandShortcut>S</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <ResetIcon />
                                    <span>
                                        Reset transaction / Clear member
                                    </span>
                                    <CommandShortcut>Escape</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <FocusIcon />
                                    <span>Focus on amount</span>
                                    <span className="text-xs italic text-muted-foreground">
                                        (requires a member to be selected)
                                    </span>
                                    <CommandShortcut>A</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <ArrowIcon />
                                    <span>Submit payment</span>
                                    <span className="text-xs italic text-muted-foreground">
                                        (requires a member and valid form)
                                    </span>
                                    <CommandShortcut>Enter</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <HistoryIcon />
                                    <span>History</span>
                                    <CommandShortcut>H</CommandShortcut>
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
