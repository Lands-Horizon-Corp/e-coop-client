import * as React from 'react'

import { cn } from '@/helpers'

import { CheckIcon, ChevronDownIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { ACCOUNT_CLOSURE_REASONS } from '../member-close-remark.constants'
import { TAccountClosureReasonType } from '../member-close-remark.types'

interface Props {
    id?: string
    name?: string
    value?: TAccountClosureReasonType
    disabled?: boolean
    className?: string
    placeholder?: string
    closureReasons?: string[]
    onChange?: (selected: TAccountClosureReasonType) => void
}

const AccountClosureReasonCombobox = ({
    value,
    className,
    disabled = false,
    placeholder = 'Select Closure Reason...',
    closureReasons = ACCOUNT_CLOSURE_REASONS as unknown as TAccountClosureReasonType[],
    onChange,
    ...other
}: Props) => {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover modal onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    {...other}
                    aria-expanded={open}
                    className={cn('w-full justify-between px-3', className)}
                    disabled={disabled}
                    role="combobox"
                    type="button"
                    variant="outline"
                >
                    <span className="capitalize">
                        {value || (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                    </span>
                    <ChevronDownIcon className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput
                        className="h-9"
                        placeholder="Search Closure Reason..."
                    />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No reason found.</CommandEmpty>
                        <CommandGroup>
                            {closureReasons.map((reason) => (
                                <CommandItem
                                    key={reason}
                                    onSelect={() => {
                                        setOpen(false)
                                        onChange?.(
                                            reason as unknown as TAccountClosureReasonType
                                        )
                                    }}
                                    value={reason}
                                >
                                    <span className="capitalize">{reason}</span>
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto',
                                            value === reason
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default AccountClosureReasonCombobox
