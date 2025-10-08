import * as React from 'react'

import { GENERAL_STATUS } from '@/constants'
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

import { TGeneralStatus } from '@/types'

interface Props
    extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
    id?: string
    name?: string
    value?: TGeneralStatus
    disabled?: boolean
    className?: string
    placeholder?: string
    generalStatuses?: TGeneralStatus[]
    onChange?: (selected: TGeneralStatus) => void
}

const GeneralStatusCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            placeholder = 'Select General Status...',
            generalStatuses = GENERAL_STATUS,
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)

        return (
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        {...other}
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled}
                        ref={ref}
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
                            placeholder="Search General Status..."
                        />
                        <CommandList className="ecoop-scroll">
                            <CommandEmpty>
                                No general status found.
                            </CommandEmpty>
                            <CommandGroup>
                                {generalStatuses.map((status) => (
                                    <CommandItem
                                        key={status}
                                        onSelect={() => {
                                            setOpen(false)
                                            onChange?.(status)
                                        }}
                                        value={status}
                                    >
                                        <span className="capitalize">
                                            {status}
                                        </span>
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto',
                                                value === status
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
)

GeneralStatusCombobox.displayName = 'GeneralStatusCombobox'

export default GeneralStatusCombobox
