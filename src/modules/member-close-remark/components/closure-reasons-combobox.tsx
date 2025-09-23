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
        <Popover modal open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    {...other}
                    type="button"
                    role="combobox"
                    variant="outline"
                    disabled={disabled}
                    aria-expanded={open}
                    className={cn('w-full justify-between px-3', className)}
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
                        placeholder="Search Closure Reason..."
                        className="h-9"
                    />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No reason found.</CommandEmpty>
                        <CommandGroup>
                            {closureReasons.map((reason) => (
                                <CommandItem
                                    key={reason}
                                    value={reason}
                                    onSelect={() => {
                                        setOpen(false)
                                        onChange?.(
                                            reason as unknown as TAccountClosureReasonType
                                        )
                                    }}
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
